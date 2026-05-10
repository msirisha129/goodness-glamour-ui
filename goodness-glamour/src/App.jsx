import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  function navigate(p) {
    console.log("Navigating to:", p);
    setPage(p);
    window.scrollTo(0, 0);
  }

  function handleLogin(admin = false) {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    setPage(admin ? "admin" : "dashboard");
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setPage("home");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF8F5" }}>
      <Navbar
        navigate={navigate}
        currentPage={page}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      <main>
        {page === "home"      && <HomePage      navigate={navigate} />}
        {page === "booking"   && <BookingPage   navigate={navigate} />}
        {page === "dashboard" && <DashboardPage navigate={navigate} />}
        {page === "login"     && <LoginPage     navigate={navigate} onLogin={handleLogin} />}
        {page === "signup"    && <SignupPage     navigate={navigate} onLogin={handleLogin} />}
        {page === "admin"     && <AdminPage     navigate={navigate} />}
      </main>
    </div>
  );
}