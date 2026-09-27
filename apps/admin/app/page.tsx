export default function AdminHome() {
  const flags = ["guided_discovery", "reviews", "jobs", "internships", "provider_reg", "employer_reg"];
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>VocaLink Admin — Phase 0</h1>
      <p>Feature flags (wired to feature_flags table in Phase 1):</p>
      <ul>
        {flags.map((f) => (
          <li key={f}>{f} — ON (placeholder toggle)</li>
        ))}
      </ul>
      <p>Next: verification queue, reports, dashboard metrics per PRD §27-28.</p>
    </main>
  );
}
