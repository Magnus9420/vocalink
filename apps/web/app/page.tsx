export default function Home() {
  return (
    <main>
      <p style={{ color: "#667085", fontSize: 14 }}>VocaLink • From Skill to Opportunity</p>
      <h1 style={{ fontSize: 24 }}>Find a skill, get certified, find work</h1>
      <input placeholder="Search trade, skill, provider…" style={{ width: "100%", padding: 13, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {["All", "Free", "Offline", "Certified", "Verified only"].map((c) => (
          <span key={c} style={{ padding: "8px 14px", borderRadius: 999, background: "#fff", border: "1.5px solid #E4E7EC", fontSize: 14 }}>{c}</span>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 14, marginTop: 12 }}>
        <span style={{ background: "#0E7C3E", color: "#fff", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>✓ Verified</span>{" "}
        <span style={{ border: "1.5px solid #0E7C3E", color: "#0E7C3E", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>Free</span>
        <h3>Electrical Installation — Beginner</h3>
        <p style={{ color: "#667085", fontSize: 13 }}>BrightVolt Academy • Lagos • Offline • 3 months</p>
      </div>
      <p style={{ color: "#667085", fontSize: 13 }}>Phase 0 skeleton. Auth at /api/auth. DB via local Postgres. Storage via Cloudflare R2.</p>
    </main>
  );
}
