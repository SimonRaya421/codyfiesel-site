import Link from "next/link";
import { SEO_CITIES, SITE, AGENT } from "../../lib/brand";

export const metadata = {
  title: `Browse by Area | ${AGENT.tagline} | ${SITE.name}`,
  description: "Explore homes for sale across Wine Country. Browse listings by city.",
  alternates: {
    canonical: '/areas',
  },
};

export default async function AreasPage() {

  const grouped = {};
  SEO_CITIES.forEach((cityName) => {
    const letter = cityName.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(cityName);
  });
  const letters = Object.keys(grouped).sort();

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F4F4F2" }}>
      <section style={{ backgroundColor: "#0B0B0B", padding: "100px 24px 70px", textAlign: "center" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600, color: "#2F4A63", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>Explore Wine Country</p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, marginBottom: 14 }}>BROWSE BY <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 400, color: "#2F4A63" }}>Area</span></h1>
        <p style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: 18, color: "rgba(255,255,255,0.45)" }}>Sonoma · Marin · Napa</p>
      </section>
      <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#4A4E51" }}>
        <Link href="/" style={{ color: "#2F4A63", textDecoration: "none" }}>Home</Link>
        <span style={{ margin: "0 8px", opacity: 0.4 }}>/</span>
        <span>Areas</span>
      </nav>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 60px" }}>
        {letters.map((letter) => (
          <div key={letter} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "#2F4A63", textTransform: "uppercase", letterSpacing: "0.1em", paddingBottom: 10, borderBottom: "2px solid #2F4A63", marginBottom: 16 }}>{letter}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {grouped[letter].map((city) => (
                <Link key={city} href={"/search?city=" + encodeURIComponent(city)} style={{ display: "block", padding: "18px 20px", backgroundColor: "#FFFFFF", borderRadius: 8, border: "1px solid #E8E8E6", textDecoration: "none" }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 600, color: "#0B0B0B", margin: "0 0 4px" }}>{city}</p>
                  <p style={{ fontFamily: "Open Sans, sans-serif", fontSize: 12, color: "#4A4E51", margin: 0 }}>Homes for Sale →</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section style={{ textAlign: "center", padding: "48px 24px", borderTop: "1px solid #E8E8E6" }}>
        <p style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: 22, color: "#0B0B0B", marginBottom: 12 }}>Can&#39;t find your area?</p>
        <p style={{ fontFamily: "Open Sans, sans-serif", fontSize: 14, color: "#4A4E51", marginBottom: 24 }}>{AGENT.firstName} covers all of Sonoma, Marin, and Napa counties.</p>
        <a href={SITE.phoneTel} style={{ display: "inline-block", padding: "14px 36px", backgroundColor: "#2F4A63", color: "#FFFFFF", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none", borderRadius: 8 }}>Call {AGENT.firstName}: {SITE.phone}</a>
      </section>
    </main>
  );
}
