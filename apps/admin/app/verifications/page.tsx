import { listPendingVerifications, decideVerification, listOpenReports } from "@/lib/trust";

export const dynamic = "force-dynamic";

export default async function Verifications() {
  const pending = await listPendingVerifications();
  const reports = await listOpenReports();

  async function decide(form: FormData) {
    "use server";
    await decideVerification(String(form.get("vid") ?? ""), String(form.get("decision") ?? "needs_info") as never, String(form.get("note") ?? ""));
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Trust & Safety — Verification Queue</h1>
      <p>{pending.length} pending. Approve → Verified badge. Reject/request-info otherwise.</p>
      {pending.map((v) => (
        <div key={v.id} style={{ border: "1px solid #E4E7EC", borderRadius: 12, padding: 14, marginTop: 12 }}>
          <b>{v.name}</b> <span style={{ color: "#667085" }}>({v.type} • {v.state}/{v.city})</span>
          <p>{v.bio}</p>
          <p style={{ fontSize: 13 }}>Contact: {v.contact} • Notes: {v.notes}</p>
          <form action={decide} style={{ display: "flex", gap: 8 }}>
            <input type="hidden" name="vid" value={v.id ?? ""} />
            <input name="note" placeholder="Reviewer note" style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
            <button name="decision" value="approved" style={{ padding: "10px 14px", borderRadius: 8, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Approve</button>
            <button name="decision" value="needs_info" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #E4E7EC", background: "#fff" }}>Need info</button>
            <button name="decision" value="rejected" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #D92D20", color: "#D92D20", background: "#fff" }}>Reject</button>
          </form>
        </div>
      ))}
      <h2 style={{ marginTop: 28 }}>Open reports ({reports.length})</h2>
      {reports.map((r) => (
        <div key={r.id} style={{ border: "1px solid #E4E7EC", borderRadius: 12, padding: 12, marginTop: 8 }}>
          <b>{r.targetType}:{r.targetId}</b> — {r.reason} <span style={{ color: "#667085" }}>({r.status})</span>
        </div>
      ))}
    </main>
  );
}
