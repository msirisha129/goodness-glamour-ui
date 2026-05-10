import { useState } from "react";

export default function LoginPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.email || !form.password) return;
    setLoading(true);
    setTimeout(() => {
      const isAdmin = form.email.includes("admin");
      onLogin(isAdmin);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-3xl font-display font-bold text-[#1C1C1C]">Goodness</div>
          <div className="text-xs tracking-[0.4em] uppercase text-[#B8956A] font-medium mb-6">Glamour</div>
          <h1 className="text-2xl font-display font-semibold text-[#1C1C1C]">Welcome back</h1>
          <p className="text-[#9A9A9A] text-sm mt-1">Sign in to manage your appointments</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E0D8]">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#E8E0D8] rounded-xl px-4 py-3 text-[#1C1C1C] placeholder-[#C0B8B0] focus:outline-none focus:border-[#B8956A] transition-colors"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-[#4A4A4A]">Password</label>
                <button className="text-xs text-[#B8956A] hover:underline">Forgot password?</button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-[#E8E0D8] rounded-xl px-4 py-3 text-[#1C1C1C] placeholder-[#C0B8B0] focus:outline-none focus:border-[#B8956A] transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#B8956A] text-white py-3.5 rounded-xl font-medium hover:bg-[#A07850] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E8E0D8]" />
            <span className="text-xs text-[#9A9A9A]">or</span>
            <div className="flex-1 h-px bg-[#E8E0D8]" />
          </div>

          <button className="w-full border border-[#E8E0D8] py-3.5 rounded-xl text-sm font-medium text-[#4A4A4A] hover:border-[#B8956A] transition-all flex items-center justify-center gap-2">
            <span>🔍</span> Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-[#9A9A9A] mt-6">
          Don't have an account?{" "}
          <button onClick={() => navigate("signup")} className="text-[#B8956A] font-medium hover:underline">
            Sign up free
          </button>
        </p>

        {/* Admin hint */}
        <p className="text-center text-xs text-[#C0B8B0] mt-3">
          💡 Use "admin@..." email to login as admin
        </p>
      </div>
    </div>
  );
}
