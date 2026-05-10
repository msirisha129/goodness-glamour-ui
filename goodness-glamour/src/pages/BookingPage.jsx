import { useState } from "react";

const API = "http://localhost:4000/api";

const services = [
  { id: 1, name: "Haircut & Styling", price: 599, duration: "45 min", icon: "✂️" },
  { id: 2, name: "Hair Coloring", price: 1499, duration: "2 hrs", icon: "🎨" },
  { id: 3, name: "Keratin Treatment", price: 2999, duration: "3 hrs", icon: "💆" },
  { id: 4, name: "Beard Grooming", price: 399, duration: "30 min", icon: "🪒" },
  { id: 5, name: "Facial & Cleanup", price: 799, duration: "1 hr", icon: "✨" },
  { id: 6, name: "Manicure & Pedicure", price: 499, duration: "1 hr", icon: "💅" },
];

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const stylists = [
  { id: 1, name: "Priya Sharma", specialty: "Hair Color Specialist" },
  { id: 2, name: "Bipin Kumar", specialty: "Senior Stylist" },
  { id: 3, name: "Nadim Ali", specialty: "Grooming Expert" },
  { id: 4, name: "Lakshmi R.", specialty: "Skin & Nail Specialist" },
];

export default function BookingPage({ navigate }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState({
    service: null, date: "", time: null, stylist: null, name: "", phone: "", email: ""
  });
  const [booked, setBooked] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const update = (key, val) => setSelected((prev) => ({ ...prev, [key]: val }));
  const today = new Date().toISOString().split("T")[0];

  // ── Pre-fill from logged-in user ─────────────────────────────────────────────
  useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("gg_user") || "{}");
      if (user.name) setSelected((p) => ({ ...p, name: user.name, phone: user.phone || "", email: user.email || "" }));
    } catch (_) {}
  }, []);

  const handleBook = async () => {
    setError("");
    if (!selected.name || !selected.phone || !selected.email) {
      setError("Please fill in all contact details."); return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API}/booking-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selected.name,
          email: selected.email,
          phone: selected.phone,
          service: selected.service?.name,
          date: selected.date,
          time: selected.time,
          stylist: selected.stylist?.name,
          price: selected.service?.price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooked(true);
    } catch (err) {
      setError(err.message || "Failed to confirm booking. Is backend running?");
    } finally {
      setSending(false);
    }
  };

  // ── Booking Confirmed Screen ─────────────────────────────────────────────────
  if (booked) return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-3xl font-display font-bold text-[#1C1C1C] mb-3">Booking Confirmed!</h2>
        <p className="text-[#7A7A7A] mb-1">Your appointment has been booked.</p>
        <p className="text-sm text-[#B8956A] mb-6">📩 Confirmation sent via Email, SMS & WhatsApp!</p>
        <div className="bg-white rounded-2xl p-6 border border-[#E8E0D8] my-6 text-left space-y-3">
          {[
            ["Service", `${selected.service?.icon} ${selected.service?.name}`],
            ["Date", selected.date],
            ["Time", selected.time],
            ["Stylist", selected.stylist?.name],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm border-b border-[#F5F0EA] pb-2 last:border-0 last:pb-0">
              <span className="text-[#9A9A9A]">{k}</span>
              <span className="font-medium text-[#1C1C1C]">{v}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold pt-1">
            <span>Total</span>
            <span className="text-[#B8956A]">₹{selected.service?.price}</span>
          </div>
        </div>
        <div className="bg-[#F5F0EA] rounded-xl p-4 text-sm text-[#7A7A7A] mb-6">
          ⏰ You'll receive a reminder <strong>1 hour before</strong> your appointment!
        </div>
        <button onClick={() => navigate("home")}
          className="bg-[#B8956A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#A07850] transition-all">
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase text-[#B8956A] font-medium">Reserve Your Spot</span>
          <h1 className="text-4xl font-display font-bold text-[#1C1C1C] mt-2">Book Appointment</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-12 gap-2">
          {["Service", "Date & Time", "Stylist", "Confirm"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                ${step > i + 1 ? "bg-[#B8956A] text-white" : step === i + 1 ? "bg-[#1C1C1C] text-white" : "bg-[#E8E0D8] text-[#9A9A9A]"}`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? "text-[#1C1C1C] font-medium" : "text-[#9A9A9A]"}`}>{label}</span>
              {i < 3 && <div className={`w-8 h-px ${step > i + 1 ? "bg-[#B8956A]" : "bg-[#E8E0D8]"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E0D8]">

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-display font-semibold text-[#1C1C1C] mb-6">Choose a Service</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((s) => (
                  <button key={s.id} onClick={() => update("service", s)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md
                      ${selected.service?.id === s.id ? "border-[#B8956A] bg-[#B8956A]/5" : "border-[#E8E0D8] hover:border-[#B8956A]/40"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[#B8956A] font-semibold text-sm">₹{s.price}</span>
                    </div>
                    <div className="font-medium text-[#1C1C1C]">{s.name}</div>
                    <div className="text-xs text-[#9A9A9A] mt-1">⏱ {s.duration}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => selected.service && setStep(2)}
                  className={`px-8 py-3 rounded-full font-medium transition-all
                    ${selected.service ? "bg-[#B8956A] text-white hover:bg-[#A07850]" : "bg-[#E8E0D8] text-[#9A9A9A] cursor-not-allowed"}`}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-display font-semibold text-[#1C1C1C] mb-6">Pick Date & Time</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Select Date</label>
                <input type="date" min={today} value={selected.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="w-full border border-[#E8E0D8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#B8956A] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-3">Select Time</label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((t) => (
                    <button key={t} onClick={() => update("time", t)}
                      className={`py-3 rounded-xl text-sm font-medium border-2 transition-all
                        ${selected.time === t ? "border-[#B8956A] bg-[#B8956A] text-white" : "border-[#E8E0D8] text-[#4A4A4A] hover:border-[#B8956A]/40"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-full border border-[#E8E0D8] text-[#4A4A4A] hover:border-[#B8956A]">← Back</button>
                <button onClick={() => selected.date && selected.time && setStep(3)}
                  className={`px-8 py-3 rounded-full font-medium transition-all
                    ${selected.date && selected.time ? "bg-[#B8956A] text-white hover:bg-[#A07850]" : "bg-[#E8E0D8] text-[#9A9A9A] cursor-not-allowed"}`}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-display font-semibold text-[#1C1C1C] mb-6">Choose Your Stylist</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {stylists.map((s) => (
                  <button key={s.id} onClick={() => update("stylist", s)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md
                      ${selected.stylist?.id === s.id ? "border-[#B8956A] bg-[#B8956A]/5" : "border-[#E8E0D8] hover:border-[#B8956A]/40"}`}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B8956A] to-[#D4A882] flex items-center justify-center text-white font-bold text-lg mb-3">
                      {s.name[0]}
                    </div>
                    <div className="font-medium text-[#1C1C1C]">{s.name}</div>
                    <div className="text-xs text-[#B8956A] mt-1">{s.specialty}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-full border border-[#E8E0D8] text-[#4A4A4A] hover:border-[#B8956A]">← Back</button>
                <button onClick={() => selected.stylist && setStep(4)}
                  className={`px-8 py-3 rounded-full font-medium transition-all
                    ${selected.stylist ? "bg-[#B8956A] text-white hover:bg-[#A07850]" : "bg-[#E8E0D8] text-[#9A9A9A] cursor-not-allowed"}`}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-display font-semibold text-[#1C1C1C] mb-6">Confirm Details</h2>
              <div className="bg-[#FAF8F5] rounded-2xl p-5 mb-6 space-y-2.5">
                {[
                  ["Service", `${selected.service?.icon} ${selected.service?.name}`],
                  ["Price", `₹${selected.service?.price}`],
                  ["Date", selected.date],
                  ["Time", selected.time],
                  ["Stylist", selected.stylist?.name],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-[#9A9A9A]">{k}</span>
                    <span className="font-medium text-[#1C1C1C]">{v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-semibold text-[#4A4A4A] uppercase tracking-wider">Contact Details</h3>
                {[
                  { label: "Your Name *", key: "name", type: "text", placeholder: "Priya Sharma" },
                  { label: "Email *", key: "email", type: "email", placeholder: "you@example.com" },
                  { label: "Phone (with +91) *", key: "phone", type: "tel", placeholder: "+919876543210" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">{f.label}</label>
                    <input type={f.type} value={selected[f.key]} placeholder={f.placeholder}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full border border-[#E8E0D8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#B8956A] transition-colors" />
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 text-sm text-blue-600">
                📩 Confirmation will be sent via <strong>Email + SMS + WhatsApp</strong>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl mb-4">{error}</p>}

              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="px-6 py-3 rounded-full border border-[#E8E0D8] text-[#4A4A4A] hover:border-[#B8956A]">← Back</button>
                <button onClick={handleBook} disabled={sending}
                  className="bg-[#B8956A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#A07850] transition-all disabled:opacity-60 flex items-center gap-2">
                  {sending
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Confirming...</>
                    : "Confirm Booking ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
