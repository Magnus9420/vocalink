import Link from "next/link";
import { getProgramme } from "@/lib/programmes";

export const dynamic = "force-dynamic";

export default async function ProgrammeDetail({ params }: { params: { id: string } }) {
  const p = await getProgramme(params.id);
  if (!p) return (<main><p>Programme not found.</p><p><Link href="/">← Back to Discover</Link></p></main>);
  return (
    <main>
      <p><Link href="/">← Back to Discover</Link></p>
      <div>
        {p.verificationStatus === "approved"
          ? <span style={{ background: "#0E7C3E", color: "#fff", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>✓ Verified provider</span>
          : <span style={{ background: "#FEF0C7", color: "#B54708", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>Unverified — enrol carefully</span>}
        {" "}<span style={{ background: "#EAECF0", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>{p.costType}</span>
      </div>
      <h1 style={{ fontSize: 24 }}>{p.title}</h1>
      <p style={{ color: "#667085" }}>{p.tradeCategory} • {p.providerName} • {p.state} {p.city ? `• ${p.city}` : ""} • {p.format} • {p.duration}</p>
      <p>{p.description}</p>
      <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 14 }}>
        <h3>At a glance</h3>
        <p>🎓 Certification: {p.certificationInfo ?? "—"}</p>
        <p>📋 Entry: {p.entryRequirements ?? "None listed"}</p>
        <p>💺 Spaces: {p.spaces ?? "—"}</p>
        <p>📞 Contact: {p.contact ?? "—"}</p>
        <p>🏫 About provider: {p.providerBio ?? "—"}</p>
      </div>
      <p style={{ color: "#667085", fontSize: 13 }}>Verification means VocaLink reviewed this provider — it is not automatic accreditation. Training completion ≠ certification; assessment comes first.</p>
    </main>
  );
}
