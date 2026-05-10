import { useState } from "react";

const bookings = [
  { id: 1, client: "Priya S.", service: "Hair Coloring", stylist: "Bipin Kumar", date: "2026-05-10", time: "11:00 AM", status: "confirmed", phone: "9876543210" },
  { id: 2, client: "Rohan M.", service: "Beard Grooming", stylist: "Nadim Ali", date: "2026-05-10", time: "1:00 PM", status: "pending", phone: "9123456789" },
  { id: 3, client: "Akanksha B.", service: "Haircut", stylist: "Priya Sharma", date: "2026-05-11", time: "3:00 PM", status: "confirmed", phone: "9988776655" },
  { id: 4, client: "Sanjay K.", service: "Facial", stylist: "Lakshmi R.", date: "2026-05-11", time: "5:00 PM", status: "cancelled", phone: "9876501234" },
];

const statusStyle = {
  confirmed: "bg-green-50 text-green-700 border border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const stats = [
  { label: "Today's Bookings", value: "12", icon: "📅", change: "+3 from yesterday" },
  { label: "Total Revenue", value: "₹18,420", icon: "💰", change: "+12% this week" },
  { label: "Active Clients", value: "284", icon: "👥", change: "+8 new this month" },
  { label: "Avg. Rating", value: "4.9 ⭐", icon: "🌟", change: "949 reviews" },
];

export default function AdminPage({ navigate }) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="pt-20 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs tracking-[0.4em] uppercase text-[#B8956A] font-medium">Admin Panel</span>
            <h1 className="text-3xl font-display font-bold text-[#1C1C1C] mt-1">Salon Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#9A9A9A]">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live • Updated just now
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E8E0D8] shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-2xl font-display font-bold text-[#1C1C1C]">{s.value}</div>
              <div className="text-sm text-[#9A9A9A] mt-1">{s.label}</div>
              <div className="text-xs text-[#B8956A] mt-2">{s.change}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#E8E0D8]">
          {["bookings", "services", "stylists"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-all
                ${activeTab === t ? "border-[#B8956A] text-[#B8956A]" : "border-transparent text-[#9A9A9A] hover:text-[#4A4A4A]"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              {["all", "confirmed", "pending", "cancelled"].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                    ${filter === f ? "bg-[#1C1C1C] text-white" : "bg-white text-[#4A4A4A] border border-[#E8E0D8] hover:border-[#B8956A]"}`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-6 px-6 py-3 bg-[#F5F0EA] text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                <span>Client</span>
                <span>Service</span>
                <span>Stylist</span>
                <span>Date & Time</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filtered.map((b, i) => (
                <div key={b.id}
                  className={`grid md:grid-cols-6 gap-2 md:gap-0 px-6 py-4 items-center ${i !== filtered.length - 1 ? "border-b border-[#F0EBE5]" : ""}`}>
                  <div>
                    <div className="font-medium text-[#1C1C1C] text-sm">{b.client}</div>
                    <div className="text-xs text-[#9A9A9A]">{b.phone}</div>
                  </div>
                  <div className="text-sm text-[#4A4A4A]">{b.service}</div>
                  <div className="text-sm text-[#4A4A4A]">{b.stylist}</div>
                  <div>
                    <div className="text-sm text-[#4A4A4A]">{b.date}</div>
                    <div className="text-xs text-[#9A9A9A]">{b.time}</div>
                  </div>
                  <div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusStyle[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {b.status === "pending" && (
                      <button className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                        Confirm
                      </button>
                    )}
                    <button className="text-xs bg-[#F5F0EA] text-[#4A4A4A] px-3 py-1.5 rounded-lg hover:bg-[#E8E0D8] transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Haircut & Styling", bookings: 48, revenue: "₹28,752", icon: "✂️" },
              { name: "Hair Coloring", bookings: 22, revenue: "₹32,978", icon: "🎨" },
              { name: "Beard Grooming", bookings: 35, revenue: "₹13,965", icon: "🪒" },
              { name: "Facial & Cleanup", bookings: 18, revenue: "₹14,382", icon: "✨" },
              { name: "Keratin Treatment", bookings: 10, revenue: "₹29,990", icon: "💆" },
              { name: "Nail Art", bookings: 25, revenue: "₹12,475", icon: "💅" },
            ].map((s) => (
              <div key={s.name} className="bg-white rounded-2xl p-6 border border-[#E8E0D8] shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{s.icon}</span>
                  <button className="text-xs text-[#B8956A] hover:underline">Edit</button>
                </div>
                <div className="font-medium text-[#1C1C1C] mb-3">{s.name}</div>
                <div className="flex justify-between text-sm">
                  <div><div className="text-[#9A9A9A] text-xs">Bookings</div><div className="font-semibold">{s.bookings}</div></div>
                  <div><div className="text-[#9A9A9A] text-xs">Revenue</div><div className="font-semibold text-[#B8956A]">{s.revenue}</div></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stylists Tab */}
        {activeTab === "stylists" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Priya Sharma", role: "Color Specialist", clients: 38, rating: "4.9" },
              { name: "Bipin Kumar", role: "Senior Stylist", clients: 52, rating: "5.0" },
              { name: "Nadim Ali", role: "Grooming Expert", clients: 41, rating: "4.8" },
              { name: "Lakshmi R.", role: "Skin & Nail", clients: 29, rating: "4.9" },
            ].map((s) => (
              <div key={s.name} className="bg-white rounded-2xl p-6 border border-[#E8E0D8] shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B8956A] to-[#D4A882] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {s.name[0]}
                </div>
                <div className="font-semibold text-[#1C1C1C]">{s.name}</div>
                <div className="text-xs text-[#B8956A] mt-1">{s.role}</div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div><div className="text-[#9A9A9A] text-xs">Clients</div><div className="font-semibold">{s.clients}</div></div>
                  <div><div className="text-[#9A9A9A] text-xs">Rating</div><div className="font-semibold">⭐ {s.rating}</div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
