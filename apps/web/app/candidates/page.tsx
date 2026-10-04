import Link from "next/link";
import { searchCandidates } from "@/lib/work";

export const dynamic = "force-dynamic";

export default async function Candidates({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const trade = searchParams.trade || undefined;
  const { certifications, portfolios } = await searchCandidates({ trade });
  const filtered = trade ? certifications.filter((c) => c.trade === trade) : certifications;

  return (
    <main>
      <nav style={{ display: "flex", gap: 12, fontSize: 14, borderBottom: "1px solid #E4E7EC", paddingBottom: 8 }}>
        <Link href="/work">Work</Link><b>Candidates</b>
      </nav>
      <h1 style={{ fontSize: 24 }}>Search Candidates</h1>
      <p style={{ color: "#667085" }}>Employer demo: certified learners + portfolios. Full skill/location filters arrive with auth.</p>
      <form method="get" style={{ display: "flex", gap: 8 }}>
        <select name="trade" defaultValue={trade ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
          {["", "Electrical Installation", "Fashion", "Photography", "Plumbing"].map((t) => (<option key={t} value={t}>{t === "" ? "All trades" : t}</option>))}
        </select>
        <button type="submit" style={{ padding: "10px 16px", borderRadius: 8, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Search</button>
      </form>
      <h2>Certified ({filtered.length})</h2>
      {filtered.map((c, i) => (<p key={i}>🎓 {c.learnerUserId} — {c.trade} ({c.status})</p>))}
      <h2>Portfolios ({portfolios.length})</h2>
      {portfolios.map((p) => (<p key={p.id} style={{ fontSize: 13 }}><b>{p.title}</b> ({p.trade}) — {p.learnerUserId}</p>))}
    </main>
  );
}
