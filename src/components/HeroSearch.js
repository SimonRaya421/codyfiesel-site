"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HERO_CITIES, AGENT } from "../lib/brand";

const HERO_CHIPS = HERO_CITIES;

export default function HeroSearch() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  const handleChipClick = (city) => {
    router.push(`/search?city=${encodeURIComponent(city)}`);
  };

  return (
    <section style={{
      position: "relative",
      width: "100%",
      minHeight: "520px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: "linear-gradient(rgba(11,11,11,0.45), rgba(11,11,11,0.6)), url(/images/vineyard-hero.webp)",
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
      backgroundRepeat: "no-repeat",
      padding: "80px 24px 60px",
    }}>
      {/* Headline */}
      <h1 style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "clamp(2rem, 5vw, 3.2rem)",
        fontWeight: 700,
        color: "#FFFFFF",
        textAlign: "center",
        margin: "0 0 8px 0",
        letterSpacing: "1px",
        textTransform: "uppercase",
        lineHeight: 1.15,
      }}>
        {AGENT.heroHeadline}
      </h1>

      {/* Tagline */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
        fontStyle: "italic",
        color: "rgba(255,255,255,0.75)",
        textAlign: "center",
        margin: "0 0 36px 0",
        letterSpacing: "0.5px",
      }}>
        {AGENT.tagline}
      </p>

      {/* Search form */}
      <div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
        <form onSubmit={handleSubmit} role="search" aria-label="Property search" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <label htmlFor="hero-search-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Search by city, neighborhood, or address</label>
          <input
            id="hero-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by city, neighborhood, or address..."
            aria-label="Search by city, neighborhood, or address"
            style={{
              flex: 1,
              padding: "14px 20px",
              fontSize: "1rem",
              fontFamily: "'Open Sans', sans-serif",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 6,
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#FFFFFF",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "14px 28px",
              backgroundColor: "#2F4A63",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              letterSpacing: "0.5px",
            }}
          >
            SEARCH
          </button>
        </form>

        {/* City chips */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          {HERO_CHIPS.map((city) => (
            <button
              key={city}
              onClick={() => handleChipClick(city)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: "0.8rem",
                fontFamily: "'Open Sans', sans-serif",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#2F4A63";
                e.target.style.borderColor = "#2F4A63";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.target.style.borderColor = "rgba(255,255,255,0.25)";
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
