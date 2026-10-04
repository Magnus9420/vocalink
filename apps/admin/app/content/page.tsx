import { listContent, setProgrammeStatus, setOpportunityStatus } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function Content() {
  const { programmes, opportunities } = await listContent();

  async function prog(form: FormData) {
    "use server";
    await setProgrammeStatus(String(form.get("id") ?? ""), String(form.get("status") ?? "published"));
  }
  async function opp(form: FormData) {
    "use server";
    await setOpportunityStatus(String(form.get("id") ?? ""), String(form.get("status") ?? "open"));
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Marketplace ({programmes.length} programmes, {opportunities.length} opportunities)</h1>
      <h2>Programmes</h2>
      {programmes.map((p) => (
        <form key={p.id} action={prog} style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #E4E7EC", borderRadius: 10, padding: 10, marginTop: 8, fontSize: 14 }}>
          <input type="hidden" name="id" value={p.id} />
          <span style={{ flex: 1 }}><b>{p.title}</b> — {p.status}</span>
          <button name="status" value="published" style={{ padding: "6px 10px" }}>Publish</button>
          <button name="status" value="hidden" style={{ padding: "6px 10px" }}>Hide</button>
        </form>
      ))}
      <h2>Opportunities</h2>
      {opportunities.map((o) => (
        <form key={o.id} action={opp} style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #E4E7EC", borderRadius: 10, padding: 10, marginTop: 8, fontSize: 14 }}>
          <input type="hidden" name="id" value={o.id} />
          <span style={{ flex: 1 }}><b>{o.role}</b> ({o.type}) — {o.status}</span>
          <button name="status" value="open" style={{ padding: "6px 10px" }}>Open</button>
          <button name="status" value="closed" style={{ padding: "6px 10px" }}>Close</button>
        </form>
      ))}
    </main>
  );
}
