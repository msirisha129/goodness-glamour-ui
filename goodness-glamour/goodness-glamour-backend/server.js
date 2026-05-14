import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import twilio from "twilio";
import cron from "node-cron";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

// ─── Twilio Client ────────────────────────────────────────────────────────────
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ─── Nodemailer (Gmail) ───────────────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

mailer.verify((err) => {
  if (err) console.error("❌ Gmail FAILED:", err.message);
  else console.log("✅ Gmail connected!");
});

// ─── In-memory stores ─────────────────────────────────────────────────────────
const otpStore = {};
const bookings = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function sendEmail({ to, subject, html }) {
  await mailer.sendMail({
    from: `"Goodness Glamour" <${process.env.GMAIL_USER}>`,
    to, subject, html,
  });
}

async function sendSMS({ to, body }) {
  await twilioClient.messages.create({
    body,
    from: process.env.TWILIO_PHONE,
    to,
  });
}

async function sendWhatsApp({ to, body }) {
  await twilioClient.messages.create({
    body,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── ROUTE 1: Send OTP ───────────────────────────────────────────────────────
app.post("/api/send-otp", async (req, res) => {
  const { phone, email, name } = req.body;
  if (!phone || !email || !name)
    return res.status(400).json({ error: "phone, email and name required" });

  const otp = generateOTP();
  otpStore[phone] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

  try {
    await sendSMS({ to: phone, body: `Your Goodness Glamour verification code is: ${otp}. Valid for 10 minutes.` });
    await sendEmail({
      to: email,
      subject: "Your Goodness Glamour Verification Code",
      html: `
        <div style="font-family:Georgia,serif;max-width:500px;margin:auto;padding:40px;background:#FAF8F5;border-radius:16px;">
          <h1 style="color:#1C1C1C;font-size:28px;margin-bottom:4px;">Goodness <span style="color:#B8956A;">Glamour</span></h1>
          <p style="color:#9A9A9A;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-top:0;">Premium Salon</p>
          <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0;">
          <p style="color:#4A4A4A;">Hi <strong>${name}</strong>, welcome!</p>
          <p style="color:#4A4A4A;">Your verification code is:</p>
          <div style="background:#1C1C1C;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <span style="color:#B8956A;font-size:40px;font-weight:bold;letter-spacing:8px;">${otp}</span>
          </div>
          <p style="color:#9A9A9A;font-size:13px;">Valid for 10 minutes. Do not share with anyone.</p>
        </div>
      `,
    });
    await sendWhatsApp({ to: phone, body: `👋 Hi ${name}! Your Goodness Glamour verification code is: *${otp}*\n\nValid for 10 minutes.` });
    res.json({ success: true, message: "OTP sent via SMS, Email & WhatsApp" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP", details: err.message });
  }
});

// ─── ROUTE 2: Verify OTP ─────────────────────────────────────────────────────
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

// ─── ROUTE 3: Booking Confirmation ───────────────────────────────────────────
app.post("/api/booking-confirm", async (req, res) => {
  const { name, email, phone, service, date, time, stylist, price } = req.body;
  bookings.push({ name, email, phone, service, date, time, stylist, price, reminded: false });

  const msg = `✅ Booking Confirmed!\n\nService: ${service}\nDate: ${date}\nTime: ${time}\nStylist: ${stylist}\nTotal: ₹${price}\n\nSee you soon! 💇‍♀️`;

  try {
    await sendEmail({
      to: email,
      subject: `✅ Booking Confirmed — ${service} at Goodness Glamour`,
      html: `
        <div style="font-family:Georgia,serif;max-width:500px;margin:auto;padding:40px;background:#FAF8F5;border-radius:16px;">
          <h1 style="color:#1C1C1C;font-size:28px;margin-bottom:4px;">Goodness <span style="color:#B8956A;">Glamour</span></h1>
          <p style="color:#9A9A9A;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Booking Confirmed 🎉</p>
          <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0;">
          <p style="color:#4A4A4A;">Hi <strong>${name}</strong>, your appointment is confirmed!</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            ${[["Service", service], ["Date", date], ["Time", time], ["Stylist", stylist], ["Total", `₹${price}`]]
              .map(([k, v]) => `<tr>
                <td style="padding:10px 0;color:#9A9A9A;font-size:13px;border-bottom:1px solid #E8E0D8;">${k}</td>
                <td style="padding:10px 0;color:#1C1C1C;font-weight:600;font-size:13px;border-bottom:1px solid #E8E0D8;text-align:right;">${v}</td>
              </tr>`).join("")}
          </table>
          <p style="color:#9A9A9A;font-size:13px;">📍 Bengaluru, Karnataka<br>📞 063645 54220</p>
          <p style="color:#B8956A;font-weight:600;">See you soon! 💇‍♀️</p>
        </div>
      `,
    });
    // ✅ Email sent — SMS/WhatsApp skipped if Twilio not configured
    try { await sendSMS({ to: phone, body: msg }); } catch (e) { console.log("SMS skipped:", e.message); }
    try { await sendWhatsApp({ to: phone, body: msg }); } catch (e) { console.log("WhatsApp skipped:", e.message); }
    res.json({ success: true, message: "Booking confirmation sent!" });
  } catch (err) {
    console.error("Booking confirm error:", err);
    res.status(500).json({ error: "Failed to send confirmation", details: err.message });
  }
});

// ─── ROUTE 4: Thank You ───────────────────────────────────────────────────────
app.post("/api/thank-you", async (req, res) => {
  const { name, email, phone } = req.body;
  const msg = `💖 Thank you ${name} for visiting Goodness Glamour!\n\nPlease leave us a review! 🌟`;
  try {
    await sendEmail({
      to: email,
      subject: "Thank you for visiting Goodness Glamour 💖",
      html: `
        <div style="font-family:Georgia,serif;max-width:500px;margin:auto;padding:40px;background:#FAF8F5;border-radius:16px;text-align:center;">
          <h1 style="color:#1C1C1C;font-size:28px;">Goodness <span style="color:#B8956A;">Glamour</span></h1>
          <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0;">
          <p style="color:#4A4A4A;font-size:16px;">Hi <strong>${name}</strong>, thank you for your visit! 💖</p>
          <a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" style="display:inline-block;background:#B8956A;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;margin:20px 0;">⭐ Leave a Review</a>
        </div>
      `,
    });
    try { await sendSMS({ to: phone, body: msg }); } catch (e) { console.log("SMS skipped"); }
    try { await sendWhatsApp({ to: phone, body: msg }); } catch (e) { console.log("WA skipped"); }
    res.json({ success: true });
  } catch (err) {
    console.error("Thank you error:", err);
    res.status(500).json({ error: "Failed to send thank you", details: err.message });
  }
});

// ─── ROUTE 5: Hair AI (Hugging Face) ─────────────────────────────────────────
app.post("/api/hair-ai", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a luxury salon AI assistant for Goodness Glamour Salon. Help users with hairstyles, haircuts, hair coloring, treatments, hair care routines, salon suggestions and styling tips. Keep replies friendly, elegant, short to medium length with emojis. Redirect unrelated questions back to hair topics.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const reply = data?.choices?.[0]?.message?.content || "✨ Sorry, I couldn't respond right now.";
    res.json({ reply });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── CRON: Reminders ─────────────────────────────────────────────────────────
cron.schedule("*/30 * * * *", async () => {
  const now = new Date();
  for (const booking of bookings) {
    if (booking.reminded) continue;
    const apptTime = new Date(`${booking.date}T${convertTo24hr(booking.time)}`);
    const diffMins = (apptTime - now) / 60000;
    if (diffMins > 60 && diffMins <= 90) {
      booking.reminded = true;
      try {
        await sendEmail({
          to: booking.email,
          subject: `⏰ Reminder: Your appointment is in 1 hour!`,
          html: `<div style="font-family:Georgia,serif;max-width:500px;margin:auto;padding:40px;background:#FAF8F5;border-radius:16px;">
            <h1 style="color:#1C1C1C;">Goodness <span style="color:#B8956A;">Glamour</span></h1>
            <p>Hi <strong>${booking.name}</strong>! Your <strong>${booking.service}</strong> is in <strong style="color:#B8956A;">1 hour</strong>.</p>
            <p>🕐 ${booking.time} &nbsp;|&nbsp; 💇 ${booking.stylist}</p>
          </div>`,
        });
        console.log(`[CRON] Reminder sent to ${booking.name}`);
      } catch (err) {
        console.error("[CRON] Reminder error:", err.message);
      }
    }
  }
});

function convertTo24hr(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
  if (modifier === "AM" && hours === "12") hours = "00";
  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Goodness Glamour server running on port ${PORT}`);
  console.log(`📧 Gmail: ${process.env.GMAIL_USER || "❌ NOT SET"}`);
  console.log(`🔑 Pass: ${process.env.GMAIL_APP_PASS ? "✅ SET" : "❌ NOT SET"}`);
  console.log(`🤖 HF Key: ${process.env.HF_API_KEY ? "✅ SET" : "❌ NOT SET"}`);
});