import Link from "next/link";
import { getProgramme } from "@/lib/programmes";
import { listReviews, submitReview, submitReport } from "@/lib/trust";
import { isEnabled } from "@/lib/flags";
import { enrol } from "@/lib/learning";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProgrammeDetail({ params }: { params: { id: string } }) {
  const p = await getProgramme(params.id);
  if (!p) return (<main><p>Programme not found.</p><p><Link href="/">← Back to Discover</Link></p></main>);
  const reviews = await listReviews(params.id);
  const reviewsOn = await isEnabled("reviews");

  async function reviewAction(form: FormData) {
    "use server";
    await submitReview(params.id, Number(form.get("rating") ?? 5), String(form.get("body") ?? ""));
  }

  async function reportAction(form: FormData) {
    "use server";
    await submitReport("programme", params.id, String(form.get("reason") ?? "misleading"));
  }

  async function enrolAction() {
    "use server";
    await enrol(params.id);
    redirect("/learning");
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length).toFixed(1) : "—";

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
      <p style={{ color: "#667085" }}>{p.tradeCategory} • {p.providerName} • {p.state} {p.city ? `• ${p.city}` : ""} • {p.format} • {p.duration} • ★ {avg} ({reviews.length})</p>
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
      <form action={enrolAction}>
        <button type="submit" style={{ width: "100%", padding: 14, borderRadius: 12, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800, fontSize: 16 }}>Enrol in this programme</button>
      </form>
      <p><Link href="/learning">Go to My Learning →</Link></p>

      <h2>Reviews ({reviews.length})</h2>
      {reviews.map((r) => (
        <div key={r.id} style={{ border: "1px solid #E4E7EC", borderRadius: 12, padding: 12, marginTop: 8 }}>
          <b>★ {r.rating}</b> <span style={{ color: "#667085", fontSize: 13 }}>{r.moderationStatus}</span>
          <p>{r.body}</p>
        </div>
      ))}
      {reviewsOn && (
      <form action={reviewAction} style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <h3>Leave a review</h3>
        <select name="rating" style={{ padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
          {[5, 4, 3, 2, 1].map((n) => (<option key={n} value={n}>{n} stars</option>))}
        </select>
        <textarea name="body" required placeholder="Did it deliver what was advertised?" rows={2} style={{ padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Submit review</button>
      </form>
      )}

      <form action={reportAction} style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <select name="reason" style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
          <option value="misleading">Misleading info</option><option value="poor-service">Poor service</option><option value="fraud">Suspected fraud</option>
        </select>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #D92D20", color: "#D92D20", background: "#fff" }}>Report</button>
      </form>
    </main>
  );
}
