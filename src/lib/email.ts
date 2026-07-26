import nodemailer from "nodemailer";

let transporterInstance: nodemailer.Transporter | null = null;
let warnLogged = false;

// Note: GMAIL_APP_PASSWORD must be a 16-character Google App Password (not the regular Gmail password),
// generated at myaccount.google.com/apppasswords with 2-Step Verification enabled on the account.

function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.GMAIL_USER || "goldleafghostwriting@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass) {
    if (!warnLogged) {
      const timestamp = new Date().toISOString();
      console.warn(
        `[${timestamp}] ⚠️ [Email Warning] GMAIL_APP_PASSWORD is missing or empty. Email notifications will be skipped.`
      );
      warnLogged = true;
    }
    return null;
  }

  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }

  return transporterInstance;
}

export async function sendAppointmentConfirmationEmail(
  to: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const timestamp = new Date().toISOString();
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn(
        `[${timestamp}] ⚠️ [Email Skipped] Transporter unavailable for appointment confirmation to ${to}.`
      );
      return { success: false, error: "GMAIL_APP_PASSWORD environment variable not configured" };
    }

    const mailOptions = {
      from: '"GoldLeaf Ghostwriting" <goldleafghostwriting@gmail.com>',
      to,
      subject: "Appointment Confirmed | GoldLeaf Ghostwriting",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #0a192f 0%, #1e40af 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
            .body-content { padding: 32px 28px; line-height: 1.6; font-size: 15px; color: #334155; }
            .body-content h2 { color: #0a192f; font-size: 20px; margin-top: 0; }
            .status-badge { display: inline-block; background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 16px 0; }
            .footer { background-color: #f1f5f9; padding: 20px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>GOLDLEAF GHOSTWRITING</h1>
              <p>Literary Excellence & Legacy Publishing</p>
            </div>
            <div class="body-content">
              <h2>Dear ${escapeHtml(name)},</h2>
              <p>Thank you for reaching out to <strong>GoldLeaf Ghostwriting</strong>. We have received your consultation inquiry and manuscript details.</p>
              
              <div class="status-badge">
                ✓ Consultation Request Received
              </div>

              <p>Our senior editorial team is currently reviewing your project details. A dedicated literary specialist will reach out to you within <strong>24 to 48 hours</strong> to schedule your initial strategic consultation.</p>

              <p>Whether you are embarking on a high-impact business guide, a personal memoir, or a bestselling hardcover, we look forward to helping you shape your narrative.</p>

              <br />
              <p>Warmest regards,</p>
              <p><strong>The GoldLeaf Editorial Board</strong><br />
              <span style="font-size: 13px; color: #64748b;">GoldLeaf Ghostwriting Agency</span><br />
              <a href="https://goldleafghostwriting.com" style="color: #1e40af; text-decoration: none; font-size: 13px;">goldleafghostwriting.com</a></p>
            </div>
            <div class="footer">
              <p>© 2026 GoldLeaf Ghostwriting. All rights reserved.<br />777 Luxury Row, Suite 900, New York, NY 10019</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[${timestamp}] ✅ [Email Sent] Appointment confirmation email delivered to ${to}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[${timestamp}] ❌ [Email Error] Failed to send appointment confirmation email to ${to}:`, err);
    return { success: false, error: err.message || "Email send failure" };
  }
}

export async function sendCouponEmail(
  to: string,
  name: string,
  couponCode: string
): Promise<{ success: boolean; error?: string }> {
  const timestamp = new Date().toISOString();
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn(
        `[${timestamp}] ⚠️ [Email Skipped] Transporter unavailable for coupon email to ${to}.`
      );
      return { success: false, error: "GMAIL_APP_PASSWORD environment variable not configured" };
    }

    const mailOptions = {
      from: '"GoldLeaf Ghostwriting" <goldleafghostwriting@gmail.com>',
      to,
      subject: "Your Exclusive 40% Discount Code | GoldLeaf Ghostwriting",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #0a192f 0%, #1e40af 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
            .body-content { padding: 32px 28px; line-height: 1.6; font-size: 15px; color: #334155; }
            .body-content h2 { color: #0a192f; font-size: 20px; margin-top: 0; }
            .coupon-box { background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
            .coupon-code { font-family: 'Courier New', Courier, monospace; font-size: 26px; font-weight: 800; color: #0369a1; letter-spacing: 2px; margin: 8px 0; }
            .coupon-sub { font-size: 12px; color: #0369a1; font-weight: 600; text-transform: uppercase; }
            .footer { background-color: #f1f5f9; padding: 20px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>GOLDLEAF GHOSTWRITING</h1>
              <p>Exclusive Privilege Voucher</p>
            </div>
            <div class="body-content">
              <h2>Dear ${escapeHtml(name)},</h2>
              <p>Thank you for registering with GoldLeaf Ghostwriting! Here is your exclusive <strong>40% discount coupon code</strong> for your upcoming ghostwriting or publishing package:</p>
              
              <div class="coupon-box">
                <div class="coupon-sub">40% Off Ghostwriting Package</div>
                <div class="coupon-code">${escapeHtml(couponCode)}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Valid for any Standard, Signature, or Elite Publishing Package</div>
              </div>

              <p>Simply mention this code during your initial consultation or enter it in your proposal form to apply your discount instantly.</p>

              <br />
              <p>Warmest regards,</p>
              <p><strong>The GoldLeaf Editorial Board</strong><br />
              <span style="font-size: 13px; color: #64748b;">GoldLeaf Ghostwriting Agency</span><br />
              <a href="https://goldleafghostwriting.com" style="color: #1e40af; text-decoration: none; font-size: 13px;">goldleafghostwriting.com</a></p>
            </div>
            <div class="footer">
              <p>© 2026 GoldLeaf Ghostwriting. All rights reserved.<br />777 Luxury Row, Suite 900, New York, NY 10019</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[${timestamp}] ✅ [Email Sent] Coupon discount email delivered to ${to}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[${timestamp}] ❌ [Email Error] Failed to send coupon email to ${to}:`, err);
    return { success: false, error: err.message || "Email send failure" };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
