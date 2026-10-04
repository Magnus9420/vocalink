import Link from "next/link";
import { metrics } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const m = await metrics();
  const cards: [string, number][] = [
    ["Learners", m.learners], ["Users", m.users],
    ["Providers", m.providers], ["Verified", m.verifiedProviders],
    ["Programmes", m.programmes], ["Enrolments", m.enrolments],
    ["Completed", m.completed], ["Cert pathways", m.certPathways],
    ["Cert tracked", m.certTracked], ["Certified", m.certified],
    ["Opportunities", m.opportunities], ["Jobs", m.jobs],
    ["Internships", m.internships], ["Applications", m.applications],
    ["Open reports", m.openReports], ["Reviews", m.reviews]
  ];
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>VocaLink Admin — Skill → Training → Certification → Work</h1>
      <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/verifications">Verification queue</Link>
        <Link href="/users">Users</Link>
        <Link href="/content">Marketplace</Link>
        <Link href="/reports">Reports</Link>
        <Link href="/certifications">Certification</Link>
        <Link href="/flags">Platform controls</Link>
      </nav>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
        {cards.map(([k, v]) => (
          <div key={k} style={{ border: "1px solid #E4E7EC", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 12, color: "#667085" }}>{k}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
