import { useState } from "react";

export default function Navbar({ navigate, currentPage, isLoggedIn, isAdmin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home",     page: "home", scrollTo: null },
    { label: "Services", page: "home", scrollTo: "services-section" },
    { label: "Gallery",  page: "home", scrollTo: "gallery-section" },
    { label: "Contact",  page: "home", scrollTo: "contact-section" },
  ];

  function handleNavClick(link) {
    navigate(link.page);
    setMenuOpen(false);
    if (link.scrollTo) {
      setTimeout(() => {
        document.getElementById(link.scrollTo)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E8E0D8]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate("home")} className="flex flex-col leading-none">
          <span className="text-2xl font-display font-bold tracking-tight text-[#1C1C1C]">
            Goodness
          </span>
          <span className="text-xs tracking-[0.3em] uppercase text-[#B8956A] font-medium">
            Glamour
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNavClick(l)}
              className="text-sm tracking-wide text-[#4A4A4A] hover:text-[#B8956A] transition-colors duration-200 font-medium"
            >
              {l.label}
            </button>
          ))}
          {isLoggedIn && (
            <button
              onClick={() => navigate(isAdmin ? "admin" : "dashboard")}
              className="text-sm tracking-wide text-[#4A4A4A] hover:text-[#B8956A] transition-colors duration-200 font-medium"
            >
              {isAdmin ? "Admin" : "My Appointments"}
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="text-sm text-[#4A4A4A] hover:text-[#B8956A] transition-colors px-4 py-2"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => navigate("login")}
              className="text-sm text-[#4A4A4A] hover:text-[#B8956A] transition-colors px-4 py-2"
            >
              Sign In
            </button>
          )}
          <button
            onClick={() => navigate("booking")}
            className="bg-[#B8956A] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#A07850] transition-all duration-200 hover:shadow-lg hover:shadow-[#B8956A]/20"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-6 h-0.5 bg-[#1C1C1C] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-[#1C1C1C] transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-[#1C1C1C] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E0D8] px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNavClick(l)}
              className="text-left text-sm text-[#4A4A4A] hover:text-[#B8956A] font-medium py-1"
            >
              {l.label}
            </button>
          ))}
          {isLoggedIn && (
            <button
              onClick={() => { navigate(isAdmin ? "admin" : "dashboard"); setMenuOpen(false); }}
              className="text-left text-sm text-[#4A4A4A] hover:text-[#B8956A] font-medium py-1"
            >
              {isAdmin ? "Admin" : "My Appointments"}
            </button>
          )}
          <div className="flex gap-3 pt-2 border-t border-[#E8E0D8]">
            {isLoggedIn ? (
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="flex-1 text-sm border border-[#B8956A] text-[#B8956A] py-2.5 rounded-full"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => { navigate("login"); setMenuOpen(false); }}
                className="flex-1 text-sm border border-[#B8956A] text-[#B8956A] py-2.5 rounded-full"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => { navigate("booking"); setMenuOpen(false); }}
              className="flex-1 text-sm bg-[#B8956A] text-white py-2.5 rounded-full"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}