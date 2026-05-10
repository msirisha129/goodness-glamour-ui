import { useState } from "react";

const appointments = [
  { id: 1, service: "Haircut & Styling", stylist: "Bipin Kumar", date: "2026-05-10", time: "11:00 AM", status: "upcoming", price: 599 },
  { id: 2, service: "Hair Coloring", stylist: "Priya Sharma", date: "2026-04-20", time: "2:00 PM", status: "completed", price: 1499 },
  { id: 3, service: "Beard Grooming", stylist: "Nadim Ali", date: "2026-03-15", time: "4:00 PM", status: "completed", price: 399 },
];

const statusStyle = {
  upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

export default function DashboardPage({ navigate }) {
  const [tab, setTab] = useState("upcoming");

  const filtered = tab === "all" ? appointments : appointments.filter((a) => a.status === tab);

  return (
    <div className="pt-20 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs tracking-[0.4em] uppercase text-[#B8956A] font-medium">Welcome back</span>
            <h1 className="text-3xl font-display font-bold text-[#1C1C1C] mt-1">My Dashboard</h1>
          </div>
          <button onClick={() => navigate("booking")}
            className="bg-[#B8956A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#A07850] transition-all self-start md:self-auto">
            + New Booking
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Visits", value: "3", icon: "🗓️" },
            { label: "Total Spent", value: "₹2,497", icon: "💸" },
            { label: "Loyalty Points", value: "249", icon: "⭐" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E8E0D8] shadow-sm text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-display font-bold text-[#1C1C1C]">{s.value}</div>
              <div className="text-xs text-[#9A9A9A] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["upcoming", "completed", "all"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all
                ${tab === t ? "bg-[#1C1C1C] text-white" : "bg-white text-[#4A4A4A] border border-[#E8E0D8] hover:border-[#B8956A]"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Appointments */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#9A9A9A]">
              <div className="text-4xl mb-3">📅</div>
              <p>No appointments found.</p>
              <button onClick={() => navigate("booking")} className="mt-4 text-[#B8956A] font-medium hover:underline">Book one now →</button>
            </div>
          )}
          {filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-6 border border-[#E8E0D8] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#B8956A]/10 rounded-xl flex items-center justify-center text-xl">✂️</div>
                  <div>
                    <h3 className="font-semibold text-[#1C1C1C]">{a.service}</h3>
                    <p className="text-sm text-[#9A9A9A]">with {a.stylist}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                  <div className="text-sm">
                    <div className="text-[#9A9A9A] text-xs">Date</div>
                    <div className="font-medium text-[#1C1C1C]">{a.date}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-[#9A9A9A] text-xs">Time</div>
                    <div className="font-medium text-[#1C1C1C]">{a.time}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-[#9A9A9A] text-xs">Amount</div>
                    <div className="font-medium text-[#B8956A]">₹{a.price}</div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusStyle[a.status]}`}>
                    {a.status}
                  </span>
                </div>
              </div>
              {a.status === "upcoming" && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-[#F0EBE5]">
                  <button className="text-sm text-[#B8956A] hover:underline">Reschedule</button>
                  <button className="text-sm text-red-400 hover:underline">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
