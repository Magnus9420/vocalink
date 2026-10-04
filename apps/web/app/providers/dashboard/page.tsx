import Link from "next/link";
import { providerStats } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function ProviderDashboard() {
  const rows = await providerStats();
  return (
    <main>
      <nav style={{ display: "flex", gap: 12, fontSize: 14, borderBottom: "1px solid #E4E7EC", paddingBottom: 8 }}>
        <Link href="/">Discover</Link><b>Provider Dashboard</b><Link href="/org/publish">NGO/Gov Publish</Link>
      </nav>
      <h1 style={{ fontSize: 24 }}>Provider Dashboard</h1>
      <p style={{ color: "#667085" }}>Programmes, enrolments, feedback per provider (demo: all providers).</p>
      {rows.map((p) => (
        <div key={p.id} style={{ border: "1px solid #E4E7EC", borderRadius: 12, padding: 12, marginTop: 8 }}>
          <b>{p.name}</b> <span style={{ fontSize: 12, background: p.verificationStatus === "approved" ? "#0E7C3E" : "#FEF0C7", color: p.verificationStatus === "approved" ? "#fff" : "#B54708", padding: "2px 8px", borderRadius: 999 }}>{p.verificationStatus}</span>
          <p style={{ fontSize: 13, color: "#667085" }}>{p.programmeCount} programmes • {p.enrolmentCount} enrolments • {p.reviewCount} reviews • ★ {p.avg}</p>
        </div>
      ))}
    </main>
  );
}
