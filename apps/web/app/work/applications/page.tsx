import Link from "next/link";
import { myApplications } from "@/lib/work";

export const dynamic = "force-dynamic";

export default async function Applications() {
  const rows = await myApplications();
  return (
    <main>
      <nav style={{ display: "flex", gap: 12, fontSize: 14, borderBottom: "1px solid #E4E7EC", paddingBottom: 8 }}>
        <Link href="/work">Work</Link><b>My Applications</b><Link href="/passport">Passport</Link>
      </nav>
      <h1 style={{ fontSize: 24 }}>My Applications ({rows.length})</h1>
      {rows.map((r) => (
        <div key={r.id} style={{ border: "1px solid #E4E7EC", borderRadius: 12, padding: 12, marginTop: 8 }}>
          <b><Link href={`/work/${r.opportunityId}`}>{r.role}</Link></b>
          <p style={{ color: "#667085", fontSize: 13 }}>{r.type} • {r.trade} • {r.state} • {r.status}</p>
        </div>
      ))}
      {rows.length === 0 && <p>No applications yet. <Link href="/work">Browse opportunities →</Link></p>}
    </main>
  );
}
