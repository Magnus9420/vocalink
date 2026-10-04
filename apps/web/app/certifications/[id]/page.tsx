import Link from "next/link";
import { getPathway, myCertStatus, setCertStatus, CERT_STEPS, CertStatus } from "@/lib/certifications";

export const dynamic = "force-dynamic";

export default async function PathwayDetail({ params }: { params: { id: string } }) {
  const p = await getPathway(params.id);
  if (!p) return (<main><p>Pathway not found.</p><p><Link href="/certifications">← Back</Link></p></main>);
  const current = await myCertStatus(params.id);

  async function track(form: FormData) {
    "use server";
    await setCertStatus(params.id, String(form.get("status") ?? "interested") as CertStatus);
  }

  return (
    <main>
      <p><Link href="/certifications">← Back to Certification</Link></p>
      <h1 style={{ fontSize: 24 }}>{p.trade}</h1>
      <p style={{ color: "#667085" }}>{p.body} {p.isNsqRelated ? "(NSQ-related)" : ""}</p>
      <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 14 }}>
        <h3>Steps</h3>
        <ol>{(p.steps as string[] ?? []).map((s) => (<li key={s}>{s}</li>))}</ol>
        <p>📍 Assessment: {p.assessmentLocation}</p>
        <p>📋 Requirements: {p.requirements}</p>
      </div>
      <h3>Your status: {current ?? "not tracking"}</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CERT_STEPS.map((s) => (
          <form key={s} action={track}>
            <input type="hidden" name="status" value={s} />
            <button type="submit" style={{ padding: "10px 14px", borderRadius: 999, border: current === s ? "2px solid #0E7C3E" : "1.5px solid #E4E7EC", background: current === s ? "#0E7C3E" : "#fff", color: current === s ? "#fff" : "#101828", fontWeight: 800 }}>{s}</button>
          </form>
        ))}
      </div>
      <p><Link href="/passport">View My Skills Passport →</Link></p>
    </main>
  );
}
