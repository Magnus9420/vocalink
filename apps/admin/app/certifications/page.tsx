import { metrics, addPathway } from "@/lib/admin";
import { db } from "@vocalink/db/src/client";
import { certificationPathways } from "@vocalink/db/src/schema/core";

export const dynamic = "force-dynamic";

export default async function AdminCerts() {
  const m = await metrics();
  const paths = await db.select().from(certificationPathways).limit(50);

  async function add(form: FormData) {
    "use server";
    await addPathway({
      trade: String(form.get("trade") ?? ""),
      body: String(form.get("body") ?? ""),
      assessmentLocation: String(form.get("assessmentLocation") ?? ""),
      requirements: String(form.get("requirements") ?? ""),
      isNsqRelated: String(form.get("isNsqRelated") ?? "") === "1"
    });
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Certification ({m.certPathways} pathways, {m.certTracked} tracked, {m.certified} certified)</h1>
      {paths.map((p) => (
        <div key={p.id} style={{ border: "1px solid #E4E7EC", borderRadius: 10, padding: 10, marginTop: 8, fontSize: 14 }}>
          <b>{p.trade}</b> — {p.body} {p.isNsqRelated ? "(NSQ)" : ""} • {p.assessmentLocation}
        </div>
      ))}
      <form action={add} style={{ display: "grid", gap: 8, marginTop: 16 }}>
        <h3>Add pathway</h3>
        <input name="trade" required placeholder="Trade" style={{ padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="body" required placeholder="Awarding body" style={{ padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="assessmentLocation" placeholder="Assessment location" style={{ padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="requirements" placeholder="Requirements" style={{ padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <label style={{ fontSize: 14 }}><input type="checkbox" name="isNsqRelated" value="1" /> NSQ-related</label>
        <button type="submit" style={{ padding: 12, borderRadius: 8, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Add pathway</button>
      </form>
    </main>
  );
}
