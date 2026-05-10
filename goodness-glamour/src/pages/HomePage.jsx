import { useState } from "react";

const services = [
  {
    icon: "✂️",
    title: "Haircuts & Styling",
    desc: "Precision cuts tailored to your face shape and lifestyle",
    price: "From ₹599",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
  },
  {
    icon: "🎨",
    title: "Hair Coloring",
    desc: "Global balayage, highlights & vivid color techniques",
    price: "From ₹1,499",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  },
  {
    icon: "💆",
    title: "Hair Treatments",
    desc: "Keratin, smoothing & deep conditioning therapies",
    price: "From ₹999",
    img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
  },
  {
    icon: "🪒",
    title: "Grooming & Shave",
    desc: "Classic hot towel shaves & beard sculpting",
    price: "From ₹399",
    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
  },
  {
    icon: "✨",
    title: "Skin Services",
    desc: "Facials, clean-ups & advanced skin treatments",
    price: "From ₹799",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  },
  {
    icon: "💅",
    title: "Nail Art",
    desc: "Manicure, pedicure & artistic nail designs",
    price: "From ₹499",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
  },
];

const reviews = [
  { name: "Priya S.", rating: 5, text: "Absolutely loved my hair transformation! The stylists are incredibly skilled and the ambiance is so relaxing.", time: "2 weeks ago" },
  { name: "Rohan M.", rating: 5, text: "Best grooming experience in Bengaluru. Bipin is a legend — knew exactly what I wanted.", time: "1 month ago" },
  { name: "Akanksha B.", rating: 5, text: "Visited for a haircut and came out feeling like a new person. 10/10 would recommend!", time: "3 weeks ago" },
];

const stats = [
  { value: "5,000+", label: "Happy Clients" },
  { value: "12+", label: "Expert Stylists" },
  { value: "949", label: "Google Reviews" },
  { value: "8+", label: "Years of Excellence" },
];

const offers = [
  {
    tag: "Happy Hours",
    title: "40% OFF on All Services",
    subtitle: "Mon – Thurs | 10 AM to 2 PM",
    cta: "Book Now",
    img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80",
    accent: "#B8956A",
  },
  {
    tag: "Women's Special",
    title: "Haircut at ₹799",
    subtitle: "Includes wash, conditioning, serum & blow dry",
    cta: "Grab Offer",
    img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80",
    accent: "#FFD700",
  },
];

const galleryImages = [
  { src: "https://img.freepik.com/premium-photo/beautiful-girl-beauty-salon-hairstyle-makeup_1015980-566928.jpg", label: "Color & Balayage" },
  { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", label: "Precision Cut" },
  { src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", label: "Skin Glow Facial" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", label: "Beard Grooming" },
  { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", label: "Nail Art" },
  { src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80", label: "Hair Treatment" },
];

export default function HomePage({ navigate }) {
  const [activeOffer, setActiveOffer] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredGallery, setHoveredGallery] = useState(null);

  return (
    <div style={{ paddingTop: "0" }}>

      {/* ── HERO with full background image ── */}
      <section style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: "80px",
      }}>
        {/* Background image */}
        <img
          src="https://media.istockphoto.com/id/1391187647/photo/stylish-modern-barber-chairs-in-black-and-grey-barbershop-interior.jpg?s=1024x1024&w=is&k=20&c=gWZ1Ab3FOwUT1YMn0GxWnldb0qnd60IE4XkMYrAM8CM="
          alt="Salon hero"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
          }}
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.65) 55%, rgba(10,10,10,0.2) 100%)",
        }} />

        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "1200px", margin: "0 auto",
          padding: "80px 24px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "48px", alignItems: "center", width: "100%",
        }}>
          <div>
            <span style={{
              display: "inline-block", fontSize: "11px", letterSpacing: "4px",
              textTransform: "uppercase", color: "#B8956A",
              background: "rgba(184,149,106,0.15)", border: "1px solid rgba(184,149,106,0.3)",
              padding: "8px 16px", borderRadius: "999px", marginBottom: "24px",
            }}>
              Premium Salon • Bengaluru
            </span>
            <h1 style={{
              fontSize: "clamp(40px, 6vw, 72px)", fontWeight: "800",
              color: "white", lineHeight: "1.05", margin: "0 0 24px 0",
            }}>
              Redefine<br /><span style={{ color: "#B8956A" }}>Your</span><br />Glamour.
            </h1>
            <p style={{ color: "#C0B8B0", fontSize: "18px", lineHeight: "1.7", marginBottom: "40px", maxWidth: "420px" }}>
              Professional hair, beauty and grooming services by certified specialists. Crafted for you, every single visit.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button onClick={() => navigate("booking")} style={{
                background: "#B8956A", color: "white", border: "none",
                padding: "16px 32px", borderRadius: "999px", fontSize: "16px",
                fontWeight: "600", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(184,149,106,0.35)",
              }}>
                Book Appointment
              </button>
              <button style={{
                background: "transparent", color: "white",
                border: "1px solid rgba(255,255,255,0.35)",
                padding: "16px 32px", borderRadius: "999px", fontSize: "16px", cursor: "pointer",
              }}>
                View Services
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                borderRadius: "16px", padding: "24px",
              }}>
                <div style={{ fontSize: "32px", fontWeight: "800", color: "#B8956A", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ fontSize: "13px", color: "#9A9A9A" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFERS with background image ── */}
      <section style={{ background: "#F5F0EA", padding: "80px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#B8956A", marginBottom: "8px" }}>Limited Time</div>
            <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#1C1C1C", margin: "0" }}>Today's Offers</h2>
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px" }}>
            {offers.map((o, i) => (
              <button key={i} onClick={() => setActiveOffer(i)} style={{
                padding: "8px 20px", borderRadius: "999px", fontSize: "14px",
                fontWeight: "500", cursor: "pointer", border: "none",
                background: activeOffer === i ? "#B8956A" : "white",
                color: activeOffer === i ? "white" : "#4A4A4A",
                transition: "all 0.3s",
              }}>
                {o.tag}
              </button>
            ))}
          </div>

          {/* Offer card with image background */}
          <div style={{
            position: "relative", borderRadius: "24px", overflow: "hidden",
            minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img
              src={offers[activeOffer].img}
              alt={offers[activeOffer].tag}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%", objectFit: "cover",
                transition: "opacity 0.5s",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 100%)",
            }} />
            <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "64px 32px", color: "white" }}>
              <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", opacity: 0.6, marginBottom: "16px" }}>
                {offers[activeOffer].tag}
              </div>
              <h3 style={{
                fontSize: "clamp(28px, 5vw, 48px)", fontWeight: "800",
                color: offers[activeOffer].accent, margin: "0 0 12px 0",
              }}>
                {offers[activeOffer].title}
              </h3>
              <p style={{ opacity: 0.75, marginBottom: "32px", fontSize: "16px" }}>{offers[activeOffer].subtitle}</p>
              <button onClick={() => navigate("booking")} style={{
                background: offers[activeOffer].accent, color: "#1C1C1C",
                border: "none", padding: "14px 32px", borderRadius: "999px",
                fontWeight: "700", cursor: "pointer", fontSize: "15px",
              }}>
                {offers[activeOffer].cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES with card images ── */}
      <section id="services-section" style={{ background: "white", padding: "96px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#B8956A", marginBottom: "8px" }}>What We Do</div>
            <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#1C1C1C", margin: "0" }}>Our Services</h2>
            <p style={{ color: "#7A7A7A", marginTop: "16px" }}>Every treatment is a ritual. Every visit, a transformation.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {services.map((s, i) => (
              <div
                key={s.title}
                style={{
                  background: "#FAF8F5", borderRadius: "16px", overflow: "hidden",
                  border: hoveredCard === i ? "1px solid rgba(184,149,106,0.4)" : "1px solid transparent",
                  boxShadow: hoveredCard === i ? "0 16px 40px rgba(184,149,106,0.15)" : "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  transform: hoveredCard === i ? "translateY(-4px)" : "none",
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card image */}
                <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={s.img}
                    alt={s.title}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      transition: "transform 0.5s",
                      transform: hoveredCard === i ? "scale(1.06)" : "scale(1)",
                    }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
                  }} />
                  <span style={{
                    position: "absolute", top: "12px", left: "12px",
                    fontSize: "22px", background: "rgba(255,255,255,0.9)",
                    borderRadius: "50%", width: "40px", height: "40px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{s.icon}</span>
                </div>
                {/* Card body */}
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1C1C1C", margin: "0 0 8px 0" }}>{s.title}</h3>
                  <p style={{ fontSize: "14px", color: "#7A7A7A", lineHeight: "1.6", marginBottom: "16px" }}>{s.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#B8956A", fontWeight: "600", fontSize: "15px" }}>{s.price}</span>
                    <button onClick={() => navigate("booking")} style={{
                      fontSize: "12px", color: "#B8956A",
                      border: "1px solid rgba(184,149,106,0.4)",
                      padding: "7px 18px", borderRadius: "999px",
                      background: "transparent", cursor: "pointer",
                      fontWeight: "500",
                    }}>Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery-section" style={{ background: "#F5F0EA", padding: "96px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#B8956A", marginBottom: "8px" }}>Our Work</div>
            <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#1C1C1C", margin: "0" }}>Style Gallery</h2>
            <p style={{ color: "#7A7A7A", marginTop: "16px" }}>A glimpse of transformations we've crafted.</p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "220px 220px",
            gap: "12px",
          }}>
            {galleryImages.map((g, i) => (
              <div
                key={i}
                style={{
                  position: "relative", borderRadius: "12px", overflow: "hidden",
                  gridColumn: i === 0 ? "span 2" : "span 1",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredGallery(i)}
                onMouseLeave={() => setHoveredGallery(null)}
              >
                <img
                  src={g.src}
                  alt={g.label}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.5s",
                    transform: hoveredGallery === i ? "scale(1.07)" : "scale(1)",
                  }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: hoveredGallery === i
                    ? "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))"
                    : "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                  transition: "background 0.3s",
                }} />
                <div style={{
                  position: "absolute", bottom: "16px", left: "16px",
                  color: "white", fontWeight: "600", fontSize: "14px",
                  letterSpacing: "0.03em",
                  opacity: hoveredGallery === i ? 1 : 0.8,
                  transition: "opacity 0.3s",
                }}>
                  {g.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: "#1C1C1C", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "800", color: "white", margin: "0 0 16px 0" }}>
            Ready for a <span style={{ color: "#B8956A" }}>Style Upgrade?</span>
          </h2>
          <p style={{ color: "#9A9A9A", fontSize: "18px", marginBottom: "40px" }}>Premium care crafted just for you. Book today and walk out glowing.</p>
          <button onClick={() => navigate("booking")} style={{
            background: "#B8956A", color: "white", border: "none",
            padding: "18px 40px", borderRadius: "999px", fontSize: "17px",
            fontWeight: "600", cursor: "pointer",
            boxShadow: "0 8px 32px rgba(184,149,106,0.3)",
          }}>
            Book Appointment
          </button>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ background: "#F5F0EA", padding: "96px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#B8956A", marginBottom: "8px" }}>Social Proof</div>
              <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#1C1C1C", margin: "0" }}>Client Experiences</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#B8956A", fontSize: "20px" }}>★★★★★</span>
              <span style={{ color: "#4A4A4A", fontWeight: "500" }}>949 Google Reviews</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {reviews.map((r) => (
              <div key={r.name} style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ color: "#B8956A", fontSize: "18px", marginBottom: "16px" }}>{"★".repeat(r.rating)}</div>
                <p style={{ color: "#4A4A4A", lineHeight: "1.7", marginBottom: "24px", fontSize: "14px" }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(184,149,106,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#B8956A", fontWeight: "700", fontSize: "14px" }}>{r.name[0]}</div>
                    <span style={{ fontWeight: "500", color: "#1C1C1C", fontSize: "14px" }}>{r.name}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#9A9A9A" }}>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact-section" style={{ background: "#1C1C1C", color: "white", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800" }}>Goodness</div>
            <div style={{ fontSize: "11px", letterSpacing: "5px", textTransform: "uppercase", color: "#B8956A", marginBottom: "16px" }}>Glamour</div>
            <p style={{ color: "#9A9A9A", fontSize: "14px", lineHeight: "1.7" }}>Premium hair and skin care by certified professionals. Style, care, and confidence — tailored just for you.</p>
          </div>
          <div>
            <h4 style={{ fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", color: "#B8956A", marginBottom: "16px" }}>Quick Links</h4>
            {["Home", "Services", "Gallery", "Contact"].map((l) => (
              <button key={l} onClick={() => navigate("home")} style={{ display: "block", background: "none", border: "none", color: "#9A9A9A", fontSize: "14px", padding: "4px 0", cursor: "pointer", textAlign: "left" }}>{l}</button>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", color: "#B8956A", marginBottom: "16px" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#9A9A9A", fontSize: "14px" }}>
              <span>📞 09036626642</span>
              <span>✉️ 2akonsultant@gmail.com</span>
              <span>📍 Bengaluru, Karnataka</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1200px", margin: "48px auto 0", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center", color: "#5A5A5A", fontSize: "12px" }}>
          © 2026 Goodness Glamour. All rights reserved.
        </div>
      </footer>

    </div>
  );
}