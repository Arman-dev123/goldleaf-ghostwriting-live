import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { generateCouponCode } from "./coupon-generator.js";
import { sendAppointmentConfirmationEmail, sendCouponEmail } from "./email.js";

let isDatabaseConnected: boolean = false;
let supabaseAdminClient: SupabaseClient | null = null;

/**
 * Returns whether the database connection is verified and active.
 */
export function getIsDatabaseConnected(): boolean {
  return isDatabaseConnected;
}

/**
 * Lazy initializer for Supabase Admin Client using SUPABASE_SERVICE_ROLE_KEY.
 * Always uses the service role key for server-side inserts, never the anon key.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || (typeof process !== "undefined" && process.env ? process.env.VITE_SUPABASE_URL : undefined);
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    if (isDatabaseConnected) {
      console.warn(`[${new Date().toISOString()}] ⚠️ [Supabase Warning] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are missing or empty.`);
      isDatabaseConnected = false;
    }
    return null;
  }

  if (!supabaseAdminClient) {
    try {
      supabaseAdminClient = createClient(url, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ [Supabase Init Error] Failed to create Supabase client:`, error);
      isDatabaseConnected = false;
      return null;
    }
  }

  return supabaseAdminClient;
}

/**
 * Validates connection to Supabase on startup with a lightweight test query.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.warn(`[${timestamp}] ⚠️ [Supabase Startup] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing or empty. Using in-memory fallback store.`);
    isDatabaseConnected = false;
    return false;
  }

  try {
    const timeoutMs = 8000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Supabase connection check timed out")), timeoutMs)
    );

    const queryPromise = supabase
      .from("contacts")
      .select("id", { count: "exact", head: true });

    const result: any = await Promise.race([queryPromise, timeoutPromise]);

    if (result.error) {
      console.error(`[${timestamp}] ❌ [Supabase Connection Failed] Startup test query error:`, result.error);
      isDatabaseConnected = false;
      return false;
    }

    isDatabaseConnected = true;
    console.log(`[${timestamp}] ✅ [Supabase Connection Success] Verified Supabase database connection successfully.`);
    return true;
  } catch (err: any) {
    console.error(`[${timestamp}] ❌ [Supabase Connection Failed] Exception during startup test:`, err.message || err);
    isDatabaseConnected = false;
    return false;
  }
}

// Local in-memory store as fallback for development / offline / unavailable database mode
export interface ContactLead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  created_at?: string;
}

export interface CouponLead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  coupon_code?: string;
  created_at?: string;
}

export interface LeadSaveResult {
  success: boolean;
  data?: any;
  error?: string;
  warning?: string;
  statusCode?: number;
  couponCode?: string;
  emailSent?: boolean;
}

const memoryContacts: ContactLead[] = [];
const memoryCoupons: CouponLead[] = [];

/**
 * Handles inserting a contact form lead.
 * Uses real Supabase with service role key if connected, otherwise falls back to local memory store.
 * Triggers appointment confirmation email asynchronously without blocking or failing on email errors.
 */
export async function saveContactLead(lead: ContactLead): Promise<LeadSaveResult> {
  const timestamp = new Date().toISOString();
  let savedData: any = null;
  let isFallback = false;

  // Fallback if database is not connected
  if (!isDatabaseConnected) {
    console.warn(`[${timestamp}] ⚠️ [Contact Lead] Database disconnected. Saving lead to local in-memory fallback store:`, { name: lead.name, email: lead.email });
    savedData = { ...lead, id: `mock-contact-${Date.now()}`, created_at: timestamp };
    memoryContacts.push(savedData);
    isFallback = true;
  } else {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.warn(`[${timestamp}] ⚠️ [Contact Lead] Supabase admin client unavailable. Saving lead to local in-memory fallback store.`);
      savedData = { ...lead, id: `mock-contact-${Date.now()}`, created_at: timestamp };
      memoryContacts.push(savedData);
      isFallback = true;
    } else {
      try {
        const timeoutMs = 8000;
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Database insert request timed out after 8 seconds")), timeoutMs)
        );

        const insertPromise = supabase
          .from("contacts")
          .insert([{
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            service: lead.service,
            budget: lead.budget,
            message: lead.message,
            created_at: timestamp
          }])
          .select();

        const response: any = await Promise.race([insertPromise, timeoutPromise]);
        const { data, error } = response;

        if (error) {
          console.error(`[${timestamp}] ❌ [Supabase Contact Insert Error]:`, error);
          return {
            success: false,
            error: "Failed to save contact details due to a database error. Please try again later.",
            statusCode: 500
          };
        }

        savedData = data?.[0];
      } catch (err: any) {
        console.error(`[${timestamp}] ❌ [Contact Save Exception]:`, err);
        const isTimeout = err.message?.includes("timed out");
        return {
          success: false,
          error: isTimeout
            ? "Database request timed out. Please try again."
            : "An error occurred while communicating with the database server.",
          statusCode: isTimeout ? 503 : 500
        };
      }
    }
  }

  // Best-effort non-blocking email confirmation
  let emailSent = false;
  try {
    const emailRes = await sendAppointmentConfirmationEmail(lead.email, lead.name);
    emailSent = emailRes.success;
  } catch (emailErr) {
    console.error(`[${timestamp}] ❌ [Contact Lead Email Catch]:`, emailErr);
  }

  return {
    success: true,
    data: savedData,
    emailSent,
    ...(isFallback ? { warning: "Saved locally — database temporarily unavailable" } : {})
  };
}

/**
 * Handles inserting a coupon sign-up lead.
 * Generates a branded coupon code (WORD-WORD-DDDD) and inserts it.
 * Uses real Supabase with service role key if connected, otherwise falls back to local memory store.
 * Triggers coupon email asynchronously without blocking or failing on email errors.
 */
export async function saveCouponLead(lead: CouponLead): Promise<LeadSaveResult> {
  const timestamp = new Date().toISOString();
  const couponCode = generateCouponCode();
  let savedData: any = null;
  let isFallback = false;

  // Fallback if database is not connected
  if (!isDatabaseConnected) {
    console.warn(`[${timestamp}] ⚠️ [Coupon Lead] Database disconnected. Saving lead to local in-memory fallback store:`, { name: lead.name, email: lead.email, couponCode });
    savedData = { ...lead, coupon_code: couponCode, id: `mock-coupon-${Date.now()}`, created_at: timestamp };
    memoryCoupons.push(savedData);
    isFallback = true;
  } else {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.warn(`[${timestamp}] ⚠️ [Coupon Lead] Supabase admin client unavailable. Saving lead to local in-memory fallback store.`);
      savedData = { ...lead, coupon_code: couponCode, id: `mock-coupon-${Date.now()}`, created_at: timestamp };
      memoryCoupons.push(savedData);
      isFallback = true;
    } else {
      try {
        const timeoutMs = 8000;
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Database insert request timed out after 8 seconds")), timeoutMs)
        );

        const insertPromise = supabase
          .from("coupons")
          .insert([{
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            coupon_code: couponCode,
            created_at: timestamp
          }])
          .select();

        const response: any = await Promise.race([insertPromise, timeoutPromise]);
        const { data, error } = response;

        if (error) {
          console.error(`[${timestamp}] ❌ [Supabase Coupon Insert Error]:`, error);
          return {
            success: false,
            error: "Failed to record coupon registration due to a database error. Please try again later.",
            statusCode: 500
          };
        }

        savedData = data?.[0];
      } catch (err: any) {
        console.error(`[${timestamp}] ❌ [Coupon Save Exception]:`, err);
        const isTimeout = err.message?.includes("timed out");
        return {
          success: false,
          error: isTimeout
            ? "Database request timed out. Please try again."
            : "An error occurred while communicating with the database server.",
          statusCode: isTimeout ? 503 : 500
        };
      }
    }
  }

  // Best-effort non-blocking coupon email
  let emailSent = false;
  try {
    const emailRes = await sendCouponEmail(lead.email, lead.name, couponCode);
    emailSent = emailRes.success;
  } catch (emailErr) {
    console.error(`[${timestamp}] ❌ [Coupon Lead Email Catch]:`, emailErr);
  }

  return {
    success: true,
    data: savedData,
    couponCode,
    emailSent,
    ...(isFallback ? { warning: "Saved locally — database temporarily unavailable" } : {})
  };
}

/**
 * Dev tool helper to view submitted leads
 */
export function getStoredLeads() {
  return {
    contacts: memoryContacts,
    coupons: memoryCoupons,
    isSupabaseConnected: isDatabaseConnected
  };
}
