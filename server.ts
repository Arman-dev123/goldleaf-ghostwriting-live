import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer as createViteServer } from "vite";
import { saveContactLead, saveCouponLead, checkDatabaseConnection, getIsDatabaseConnected } from "./src/lib/supabase";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "same-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: process.env.NODE_ENV === "production" ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      } : false,
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 80,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: "Too many requests. Please try again later.",
      },
    })
  );

  // Run startup connection check for Supabase
  await checkDatabaseConnection();

  // Server-side JSON payload parsing
  app.use(express.json({ limit: "1mb" }));

  // 1. Contact Lead capture API endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, service, budget, message } = req.body || {};

      // Server-side validation (400 bad input)
      if (!name || !email || !phone || !service || !message) {
        return res.status(400).json({
          success: false,
          error: "All required fields (Name, Email, Phone, Service, Message) must be provided."
        });
      }

      // Quick email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address."
        });
      }

      // Save to Supabase (or fallback if disconnected)
      const result = await saveContactLead({
        name,
        email,
        phone,
        service,
        budget: budget || "Not specified",
        message
      });

      if (!result.success) {
        const statusCode = result.statusCode || 500;
        return res.status(statusCode).json({
          success: false,
          error: result.error || "Failed to log lead into database."
        });
      }

      const responsePayload: any = {
        success: true,
        message: "Contact lead secured successfully.",
        data: result.data
      };

      if (result.warning) {
        responsePayload.warning = result.warning;
      }

      return res.status(200).json(responsePayload);
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] ❌ Express API error in /api/contact:`, err);
      return res.status(500).json({
        success: false,
        error: "An unexpected internal server error occurred while processing your request."
      });
    }
  });

  // 2. Coupon Lead capture API endpoint
  app.post("/api/coupon", async (req, res) => {
    try {
      const { name, email, phone } = req.body || {};

      // Server-side validation
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          error: "All required fields (Name, Email, Phone) must be provided."
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address."
        });
      }

      // Save to coupons table (or fallback if disconnected)
      const result = await saveCouponLead({ name, email, phone });

      if (!result.success) {
        const statusCode = result.statusCode || 500;
        return res.status(statusCode).json({
          success: false,
          error: result.error || "Failed to log coupon ledger in database."
        });
      }

      const responsePayload: any = {
        success: true,
        message: "Exclusive coupon registered successfully.",
        data: result.data
      };

      if (result.warning) {
        responsePayload.warning = result.warning;
      }

      return res.status(200).json(responsePayload);
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] ❌ Express API error in /api/coupon:`, err);
      return res.status(500).json({
        success: false,
        error: "An unexpected internal server error occurred while processing your request."
      });
    }
  });

  // 3. Health check
  app.get("/api/health", (req, res) => {
    const isConnected = getIsDatabaseConnected();
    res.json({
      database: isConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    });
  });

  // 4. Vite static assets or middleware routing
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT (Vite middleware Mode)");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION (Serving static build)");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 GoldLeaf Server listening on http://localhost:${PORT}`);
  });
}

startServer();
