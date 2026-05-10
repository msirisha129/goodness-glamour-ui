import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import twilio from "twilio";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── Twilio Client ───────────────────────────────────────────────────────────
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ─── Nodemailer (Gmail) ──────────────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// ─── In-memory OTP store ─────────────────────────────────────────────────────
const otpStore = {};

// ─── In-memory bookings store ─────────────────────────────────────────────────
const bookings = [];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Send Email
// ═══════════════════════════════════════════════════════════════════════════════
async function sendEmail({ to, subject, html }) {
  await mailer.sendMail({
    from: `"Goodness Glamour" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// ═══════════════════════════════════════
// 📱 SMS (DEV MODE - FAKE)
// ═══════════════════════════════════════
async function sendSMS({ to, body }) {
  console.log("📱 [FAKE SMS SENT]");
  console.log("To:", to);
  console.log("Message:", body);
}

// ═══════════════════════════════════════
// 💬 WhatsApp (DEV MODE - FAKE)
// ═══════════════════════════════════════
async function sendWhatsApp({ to, body }) {
  console.log("💬 [FAKE WHATSAPP SENT]");
  console.log("To:", to);
  console.log("Message:", body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Generate 6-digit OTP
// ═══════════════════════════════════════════════════════════════════════════════
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

// Shared wrapper used by all emails
function emailWrapper(content) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  </head>
  <body style="margin:0;padding:0;background:#F0EBE3;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0EBE3;padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:0;">

          <!-- TOP GOLD BAR -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#8B6D3F,#C9A96E,#E8D5B0,#C9A96E,#8B6D3F);"></td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="background:#0A0A0A;padding:36px 48px 28px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:2px;margin-bottom:2px;">GOODNESS</div>
              <div style="font-size:11px;letter-spacing:8px;color:#C9A96E;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:400;">G L A M O U R</div>
              <div style="width:48px;height:1px;background:#C9A96E;margin:16px auto 0;opacity:0.6;"></div>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          ${content}

          <!-- FOOTER -->
          <tr>
            <td style="background:#0A0A0A;padding:32px 48px;text-align:center;">
              <div style="font-size:11px;letter-spacing:4px;color:#C9A96E;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:12px;">Premium Salon · Bengaluru</div>
              <div style="font-size:12px;color:#666;font-family:Arial,sans-serif;line-height:1.8;">
                📞 063645 54220 &nbsp;·&nbsp; ✉️ goodnessglam@gmail.com<br/>
                📍 Bengaluru, Karnataka
              </div>
              <div style="width:40px;height:1px;background:#C9A96E;margin:20px auto;opacity:0.4;"></div>
              <div style="font-size:11px;color:#444;font-family:Arial,sans-serif;">© 2026 Goodness Glamour. All rights reserved.</div>
            </td>
          </tr>

          <!-- BOTTOM GOLD BAR -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#8B6D3F,#C9A96E,#E8D5B0,#C9A96E,#8B6D3F);"></td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

// ── OTP Email ──────────────────────────────────────────────────────────────
function otpEmailHtml({ name, otp }) {
  return emailWrapper(`
    <tr>
      <td style="padding:48px 48px 16px;background:#ffffff;">
        <div style="font-size:11px;letter-spacing:4px;color:#C9A96E;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:12px;">Verification</div>
        <h1 style="margin:0 0 16px;font-size:30px;color:#0A0A0A;font-weight:400;line-height:1.2;">Verify Your Identity</h1>
        <p style="margin:0;font-size:15px;color:#555;line-height:1.8;font-family:Arial,sans-serif;">Hi <strong style="color:#0A0A0A;">${name}</strong>,<br/>Welcome to Goodness Glamour. Use the code below to complete your verification.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 48px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#0A0A0A;border-radius:4px;padding:36px;text-align:center;">
              <div style="font-size:11px;letter-spacing:4px;color:#888;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:16px;">Your One-Time Code</div>
              <div style="font-size:52px;font-weight:700;color:#C9A96E;letter-spacing:14px;font-family:Courier,monospace;">${otp}</div>
              <div style="width:40px;height:1px;background:#C9A96E;margin:20px auto;opacity:0.4;"></div>
              <div style="font-size:12px;color:#666;font-family:Arial,sans-serif;">Valid for <strong style="color:#C9A96E;">10 minutes</strong></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 48px 48px;">
        <p style="margin:0;font-size:13px;color:#999;font-family:Arial,sans-serif;line-height:1.7;">For your security, never share this code with anyone. Goodness Glamour will never ask for your OTP.</p>
      </td>
    </tr>
  `);
}

// ── Booking Confirmation Email ─────────────────────────────────────────────
function bookingEmailHtml({ name, service, date, time, stylist, price }) {
  return emailWrapper(`
    <!-- HERO BANNER -->
    <tr>
      <td style="background:linear-gradient(135deg,#1a1008 0%,#0a0a0a 60%,#0d0a14 100%);padding:48px;text-align:center;">
        <div style="width:64px;height:64px;border:1px solid #C9A96E;border-radius:50%;margin:0 auto 20px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;">✓</div>
        <div style="font-size:11px;letter-spacing:5px;color:#C9A96E;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:10px;">Appointment Confirmed</div>
        <h2 style="margin:0;font-size:32px;color:#ffffff;font-weight:300;">You're all set, ${name}!</h2>
      </td>
    </tr>

    <!-- GREETING -->
    <tr>
      <td style="padding:40px 48px 0;">
        <p style="margin:0;font-size:15px;color:#555;line-height:1.9;font-family:Arial,sans-serif;">
          We're thrilled to have you at <strong style="color:#0A0A0A;">Goodness Glamour</strong>. Your appointment details are below. Please arrive 5 minutes early so we can get you settled in style.
        </p>
      </td>
    </tr>

    <!-- BOOKING CARD -->
    <tr>
      <td style="padding:32px 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8D5B0;border-radius:4px;overflow:hidden;">

          <!-- Card header -->
          <tr>
            <td colspan="2" style="background:#C9A96E;padding:16px 24px;">
              <div style="font-size:11px;letter-spacing:4px;color:#0A0A0A;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:600;">Booking Details</div>
            </td>
          </tr>

          <!-- Service row -->
          <tr>
            <td style="padding:18px 24px;border-bottom:1px solid #F0EBE3;font-size:12px;letter-spacing:2px;color:#999;text-transform:uppercase;font-family:Arial,sans-serif;width:40%;">Service</td>
            <td style="padding:18px 24px;border-bottom:1px solid #F0EBE3;font-size:15px;color:#0A0A0A;font-weight:600;font-family:Arial,sans-serif;">${service}</td>
          </tr>

          <!-- Date row -->
          <tr style="background:#FAFAF8;">
            <td style="padding:18px 24px;border-bottom:1px solid #F0EBE3;font-size:12px;letter-spacing:2px;color:#999;text-transform:uppercase;font-family:Arial,sans-serif;">Date</td>
            <td style="padding:18px 24px;border-bottom:1px solid #F0EBE3;font-size:15px;color:#0A0A0A;font-family:Arial,sans-serif;">📅 &nbsp;${date}</td>
          </tr>

          <!-- Time row -->
          <tr>
            <td style="padding:18px 24px;border-bottom:1px solid #F0EBE3;font-size:12px;letter-spacing:2px;color:#999;text-transform:uppercase;font-family:Arial,sans-serif;">Time</td>
            <td style="padding:18px 24px;border-bottom:1px solid #F0EBE3;font-size:15px;color:#0A0A0A;font-family:Arial,sans-serif;">🕐 &nbsp;${time}</td>
          </tr>

          <!-- Stylist row -->
          <tr style="background:#FAFAF8;">
            <td style="padding:18px 24px;border-bottom:1px solid #F0EBE3;font-size:12px;letter-spacing:2px;color:#999;text-transform:uppercase;font-family:Arial,sans-serif;">Stylist</td>
            <td style="padding:18px 24px;border-bottom:1px solid #F0EBE3;font-size:15px;color:#0A0A0A;font-family:Arial,sans-serif;">💇 &nbsp;${stylist}</td>
          </tr>

          <!-- Price row -->
          <tr>
            <td style="padding:18px 24px;font-size:12px;letter-spacing:2px;color:#999;text-transform:uppercase;font-family:Arial,sans-serif;">Amount</td>
            <td style="padding:18px 24px;font-size:20px;color:#C9A96E;font-weight:700;font-family:Arial,sans-serif;">₹${price}</td>
          </tr>

        </table>
      </td>
    </tr>

    <!-- TIPS -->
    <tr>
      <td style="padding:0 48px 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border-left:3px solid #C9A96E;padding:20px 24px;">
          <tr>
            <td style="padding:20px 24px;">
              <div style="font-size:11px;letter-spacing:3px;color:#C9A96E;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:10px;">Before You Arrive</div>
              <div style="font-size:13px;color:#666;font-family:Arial,sans-serif;line-height:2;">
                ✦ &nbsp;Arrive 5 minutes early<br/>
                ✦ &nbsp;Come with clean, dry hair for colour services<br/>
                ✦ &nbsp;Call us to reschedule at least 2 hours prior
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `);
}

// ── Thank You Email ────────────────────────────────────────────────────────
function thankYouEmailHtml({ name }) {
  return emailWrapper(`
    <!-- HERO -->
    <tr>
      <td style="background:linear-gradient(135deg,#1a1008 0%,#0a0a0a 60%,#0d0a14 100%);padding:56px 48px;text-align:center;">
        <div style="font-size:48px;margin-bottom:16px;">💖</div>
        <div style="font-size:11px;letter-spacing:5px;color:#C9A96E;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:12px;">Thank You</div>
        <h2 style="margin:0;font-size:30px;color:#ffffff;font-weight:300;">It was a pleasure, ${name}!</h2>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:48px 48px 32px;text-align:center;">
        <p style="margin:0 0 24px;font-size:16px;color:#444;line-height:1.9;font-family:Arial,sans-serif;">
          We hope you're feeling absolutely radiant after your visit. Your trust means the world to us — and we'd love to hear about your experience.
        </p>

        <!-- Review Button -->
        <a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
           style="display:inline-block;background:#C9A96E;color:#0A0A0A;padding:16px 40px;text-decoration:none;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:700;border-radius:2px;margin-bottom:32px;">
          ⭐ &nbsp;Leave a Review
        </a>

        <div style="width:48px;height:1px;background:#E8D5B0;margin:0 auto 32px;"></div>

        <p style="margin:0;font-size:14px;color:#999;font-family:Arial,sans-serif;line-height:1.8;">
          Book your next appointment anytime.<br/>We can't wait to see you again. 🌟
        </p>
      </td>
    </tr>

    <!-- STARS -->
    <tr>
      <td style="padding:0 48px 48px;text-align:center;">
        <div style="font-size:24px;letter-spacing:6px;color:#C9A96E;">★★★★★</div>
        <div style="font-size:11px;color:#bbb;font-family:Arial,sans-serif;margin-top:8px;letter-spacing:2px;">949 HAPPY GOOGLE REVIEWS</div>
      </td>
    </tr>
  `);
}

// ── Reminder Email ─────────────────────────────────────────────────────────
function reminderEmailHtml({ name, service, time, stylist }) {
  return emailWrapper(`
    <!-- HERO -->
    <tr>
      <td style="background:linear-gradient(135deg,#1a1008 0%,#0a0a0a 60%,#0d0a14 100%);padding:48px;text-align:center;">
        <div style="font-size:42px;margin-bottom:12px;">⏰</div>
        <div style="font-size:11px;letter-spacing:5px;color:#C9A96E;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:10px;">Appointment Reminder</div>
        <h2 style="margin:0;font-size:28px;color:#ffffff;font-weight:300;">See you in 1 hour, ${name}!</h2>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:40px 48px 16px;">
        <p style="margin:0;font-size:15px;color:#555;line-height:1.9;font-family:Arial,sans-serif;">
          Just a friendly nudge — your <strong style="color:#0A0A0A;">${service}</strong> appointment at Goodness Glamour is coming up shortly. We're getting everything ready for you!
        </p>
      </td>
    </tr>

    <!-- QUICK DETAILS -->
    <tr>
      <td style="padding:24px 48px 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;border-radius:4px;padding:32px;">
          <tr>
            <td style="padding:32px;">
              <table width="100%">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(201,169,110,0.15);">
                    <span style="font-size:12px;letter-spacing:2px;color:#888;text-transform:uppercase;font-family:Arial,sans-serif;">Service</span><br/>
                    <span style="font-size:16px;color:#fff;font-family:Arial,sans-serif;margin-top:4px;display:block;">${service}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(201,169,110,0.15);">
                    <span style="font-size:12px;letter-spacing:2px;color:#888;text-transform:uppercase;font-family:Arial,sans-serif;">Time</span><br/>
                    <span style="font-size:20px;color:#C9A96E;font-weight:700;font-family:Arial,sans-serif;margin-top:4px;display:block;">${time}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="font-size:12px;letter-spacing:2px;color:#888;text-transform:uppercase;font-family:Arial,sans-serif;">Your Stylist</span><br/>
                    <span style="font-size:16px;color:#fff;font-family:Arial,sans-serif;margin-top:4px;display:block;">💇 ${stylist}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `);
}


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE 1: Send OTP
// ═══════════════════════════════════════════════════════════════════════════════
app.post("/api/send-otp", async (req, res) => {
  const { phone, email, name } = req.body;
  if (!phone || !email || !name)
    return res.status(400).json({ error: "phone, email and name required" });

  const otp = generateOTP();
  otpStore[phone] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

  try {
    await sendSMS({
      to: phone,
      body: `Your Goodness Glamour verification code is: ${otp}. Valid for 10 minutes.`,
    });

    await sendEmail({
      to: email,
      subject: "Your Goodness Glamour Verification Code",
      html: otpEmailHtml({ name, otp }),
    });

    await sendWhatsApp({
      to: phone,
      body: `👋 Hi ${name}! Your Goodness Glamour verification code is: *${otp}*\n\nValid for 10 minutes. Don't share this with anyone.`,
    });

    res.json({ success: true, message: "OTP sent via SMS, Email & WhatsApp" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP", details: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE 2: Verify OTP
// ═══════════════════════════════════════════════════════════════════════════════
app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  const record = otpStore[phone];

  if (!record) return res.status(400).json({ error: "No OTP found for this number" });
  if (Date.now() > record.expiresAt) {
    delete otpStore[phone];
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  delete otpStore[phone];
  res.json({ success: true, message: "Phone verified successfully" });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE 3: Booking Confirmation
// ═══════════════════════════════════════════════════════════════════════════════
app.post("/api/booking-confirm", async (req, res) => {
  const { name, email, phone, service, date, time, stylist, price } = req.body;

  bookings.push({ name, email, phone, service, date, time, stylist, price, reminded: false });

  const msg = `Booking confirmed for ${service} on ${date} at ${time}`;
  let results = { email: false, sms: false, whatsapp: false };

  try {
    await sendEmail({
      to: email,
      subject: "✅ Booking Confirmed — Goodness Glamour",
      html: bookingEmailHtml({ name, service, date, time, stylist, price }),
    });
    results.email = true;
  } catch (e) {
    console.error("❌ Email error:", e.message);
  }

  try {
    await sendSMS({ to: phone, body: msg });
    results.sms = true;
  } catch (e) {
    console.error("❌ SMS error:", e.message);
  }

  try {
    await sendWhatsApp({ to: phone, body: msg });
    results.whatsapp = true;
  } catch (e) {
    console.error("❌ WhatsApp error:", e.message);
  }

  res.json({ success: true, message: "Booking processed successfully", results });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE 4: Thank You (after visit)
// ═══════════════════════════════════════════════════════════════════════════════
app.post("/api/thank-you", async (req, res) => {
  const { name, email, phone } = req.body;
  const msg = `💖 Thank you ${name} for visiting Goodness Glamour!\n\nWe hope you loved your experience. Please leave us a review on Google — it means the world to us! 🌟\n\nhttps://g.page/r/YOUR_GOOGLE_REVIEW_LINK`;

  try {
    await sendEmail({
      to: email,
      subject: "Thank you for visiting Goodness Glamour 💖",
      html: thankYouEmailHtml({ name }),
    });
    await sendSMS({ to: phone, body: msg });
    await sendWhatsApp({ to: phone, body: msg });
    res.json({ success: true });
  } catch (err) {
    console.error("Thank you error:", err);
    res.status(500).json({ error: "Failed to send thank you", details: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CRON: Send reminders 1 hour before appointment (runs every 30 minutes)
// ═══════════════════════════════════════════════════════════════════════════════
cron.schedule("*/30 * * * *", async () => {
  const now = new Date();
  console.log(`[CRON] Checking reminders at ${now.toISOString()}`);

  for (const booking of bookings) {
    if (booking.reminded) continue;

    const apptTime = new Date(`${booking.date}T${convertTo24hr(booking.time)}`);
    const diffMs = apptTime - now;
    const diffMins = diffMs / 60000;

    if (diffMins > 60 && diffMins <= 90) {
      booking.reminded = true;
      const reminderMsg = `⏰ Reminder: Your ${booking.service} at Goodness Glamour is in 1 hour!\n\nTime: ${booking.time}\nStylist: ${booking.stylist}\n\nSee you soon! 🌟`;

      try {
        await sendEmail({
          to: booking.email,
          subject: `⏰ Reminder: Your appointment is in 1 hour — Goodness Glamour`,
          html: reminderEmailHtml({
            name: booking.name,
            service: booking.service,
            time: booking.time,
            stylist: booking.stylist,
          }),
        });
        await sendSMS({ to: booking.phone, body: reminderMsg });
        await sendWhatsApp({ to: booking.phone, body: reminderMsg });
        console.log(`[CRON] Reminder sent to ${booking.name}`);
      } catch (err) {
        console.error("[CRON] Reminder error:", err.message);
      }
    }
  }
});

// ─── Helper: convert "10:00 AM" → "10:00:00" ────────────────────────────────
function convertTo24hr(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
  if (modifier === "AM" && hours === "12") hours = "00";
  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

// ═══════════════════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Goodness Glamour server running on port ${PORT}`));