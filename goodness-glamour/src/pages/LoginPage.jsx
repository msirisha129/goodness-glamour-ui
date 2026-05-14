import { useState } from "react";

// ✅ Admin credentials — change these to whatever you want
const ADMIN_EMAIL = "admin@goodnessglam.com";
const ADMIN_PASSWORD = "admin123";

export default function LoginPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      // ✅ Check admin credentials
      if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
        localStorage.setItem("gg_user", JSON.stringify({ email: form.email, role: "admin" }));
        onLogin(true); // admin = true
      } else if (form.password.length >= 6) {
        // Regular user login
        localStorage.setItem("gg_user", JSON.stringify({ email: form.email, role: "user" }));
        onLogin(false); // admin = false
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
                className="w-full border border-[#E8E0D8] rounded-xl px-4 py-3 text-[#1C1C1C] placeholder-[#C0B8B0] focus:outline-none focus:border-[#B8956A] transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>
            )}

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
        <div className="text-center text-xs text-[#C0B8B0] mt-3 space-y-1">
          <p>💡 Admin: admin@goodnessglam.com / admin123</p>
        </div>
      </div>
    </div>
  );
}