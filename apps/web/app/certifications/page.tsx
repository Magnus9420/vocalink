import Link from "next/link";
import { listPathways, myCertifications } from "@/lib/certifications";

export const dynamic = "force-dynamic";

export default async function Certifications() {
  const pathways = await listPathways();
  const mine = await myCertifications();
  const statusOf = Object.fromEntries(mine.map((m) => [m.pathwayId, m.status]));

  return (
    <main>
      <nav style={{ display: "flex", gap: 12, fontSize: 14, borderBottom: "1px solid #E4E7EC", paddingBottom: 8 }}>
        <Link href="/">Discover</Link><b>Certify</b><Link href="/passport">My Passport</Link><Link href="/learning">My Learning</Link>
      </nav>
      <h1 style={{ fontSize: 24 }}>Skills Certification</h1>
      <p style={{ color: "#667085" }}>Training completion ≠ certification. Track: Interested → In Progress → Assessed → Certified.</p>
      {pathways.map((p) => (
        <div key={p.id} style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 14, marginTop: 12 }}>
          <div>
            {p.isNsqRelated && (<span style={{ background: "#0E7C3E", color: "#fff", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>NSQ pathway</span>)}
            {statusOf[p.id] && (<span style={{ background: "#EAECF0", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999, marginLeft: 6 }}>{statusOf[p.id]}</span>)}
          </div>
          <h3><Link href={`/certifications/${p.id}`}>{p.trade}</Link></h3>
          <p style={{ color: "#667085", fontSize: 13 }}>{p.body} • Assessment: {p.assessmentLocation}</p>
        </div>
      ))}
    </main>
  );
}
