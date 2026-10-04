import { listAllReports, resolveReport } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function Reports() {
  const rows = await listAllReports();

  async function resolve(form: FormData) {
    "use server";
    await resolveReport(String(form.get("id") ?? ""), String(form.get("status") ?? "resolved"));
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Reports & Complaints ({rows.length})</h1>
      {rows.map((r) => (
        <form key={r.id} action={resolve} style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #E4E7EC", borderRadius: 10, padding: 10, marginTop: 8, fontSize: 14 }}>
          <input type="hidden" name="id" value={r.id} />
          <span style={{ flex: 1 }}><b>{r.targetType}:{r.targetId}</b> — {r.reason} ({r.status})</span>
          <button name="status" value="resolved" style={{ padding: "6px 10px" }}>Resolve</button>
          <button name="status" value="dismissed" style={{ padding: "6px 10px" }}>Dismiss</button>
        </form>
      ))}
      {rows.length === 0 && <p>No reports.</p>}
    </main>
  );
}
