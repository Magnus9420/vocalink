import Link from "next/link";
import { myEnrolments, updateProgress } from "@/lib/learning";

export const dynamic = "force-dynamic";

export default async function Learning() {
  const rows = await myEnrolments();
  const completed = rows.filter((r) => (r.progress ?? 0) >= 100).length;

  async function progressAction(form: FormData) {
    "use server";
    await updateProgress(String(form.get("eid") ?? ""), Number(form.get("progress") ?? 0));
  }

  return (
    <main>
      <nav style={{ display: "flex", gap: 12, fontSize: 14, borderBottom: "1px solid #E4E7EC", paddingBottom: 8 }}>
        <Link href="/">Discover</Link><Link href="/guided">Guided</Link><b>My Learning</b>
      </nav>
      <h1 style={{ fontSize: 24 }}>My Learning</h1>
      <p style={{ color: "#667085" }}>{rows.length} enrolled • {completed} completed. Progress is local-demo (sign-in comes later).</p>
      {rows.length === 0 && (<p>No enrolments yet. <Link href="/">Find a programme →</Link></p>)}
      {rows.map((r) => (
        <div key={r.id} style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 14, marginTop: 12 }}>
          <b><Link href={`/programmes/${r.programmeId}`}>{r.title}</Link></b>
          <p style={{ color: "#667085", fontSize: 13 }}>{r.providerName} • {r.tradeCategory} • {r.duration} • {r.costType}</p>
          <div style={{ height: 8, background: "#EAECF0", borderRadius: 99, overflow: "hidden" }}>
            <i style={{ display: "block", height: "100%", width: `${r.progress ?? 0}%`, background: "#0E7C3E" }} />
          </div>
          <p style={{ fontSize: 13 }}>{r.progress ?? 0}% • {r.status}{r.certificationInfo ? ` • 🎓 ${r.certificationInfo}` : ""}</p>
          <form action={progressAction} style={{ display: "flex", gap: 8 }}>
            <input type="hidden" name="eid" value={r.id ?? ""} />
            <select name="progress" defaultValue={String(r.progress ?? 0)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
              {[0, 25, 50, 75, 100].map((n) => (<option key={n} value={n}>{n}%</option>))}
            </select>
            <button type="submit" style={{ padding: "10px 14px", borderRadius: 8, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Update</button>
          </form>
        </div>
      ))}
    </main>
  );
}
