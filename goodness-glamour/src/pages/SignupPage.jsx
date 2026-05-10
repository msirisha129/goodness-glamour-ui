import { useState } from "react";

export default function SignupPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) return;
    onLogin(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-3xl font-display font-bold text-[#1C1C1C]">Goodness</div>
          <div className="text-xs tracking-[0.4em] uppercase text-[#B8956A] font-medium mb-6">Glamour</div>
          <h1 className="text-2xl font-display font-semibold text-[#1C1C1C]">Create your account</h1>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E0D8]">
          <div className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Priya Sharma" },
              { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
              { label: "Phone", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
              { label: "Password", key: "password", type: "password", placeholder: "Min. 8 characters" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full border border-[#E8E0D8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#B8956A] transition-colors" />
              </div>
            ))}
            <button onClick={handleSubmit}
              className="w-full bg-[#B8956A] text-white py-3.5 rounded-xl font-medium hover:bg-[#A07850] transition-all mt-2">
              Create Account
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-[#9A9A9A] mt-6">
          Already have an account?{" "}
          <button onClick={() => navigate("login")} className="text-[#B8956A] font-medium hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  );
}