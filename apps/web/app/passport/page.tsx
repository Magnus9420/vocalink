import Link from "next/link";
import { myCertifications, myCompletedTraining, myPortfolios, addPortfolio } from "@/lib/certifications";
import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

function uploadsDir() {
  return process.env.LOCAL_UPLOADS_DIR || join(process.cwd(), "..", "..", "uploads");
}

export default async function Passport() {
  const [certs, training, portfolios] = await Promise.all([myCertifications(), myCompletedTraining(), myPortfolios()]);

  async function upload(form: FormData) {
    "use server";
    const title = String(form.get("title") ?? "Untitled");
    const trade = String(form.get("trade") ?? "");
    const description = String(form.get("description") ?? "");
    const files = form.getAll("media").filter((f): f is File => f instanceof File && f.size > 0);
    const keys: string[] = [];
    for (const f of files.slice(0, 4)) {
      if (f.size > 10 * 1024 * 1024) continue;
      const key = `portfolio/${randomUUID()}-${basename(f.name || "upload")}`;
      const full = join(uploadsDir(), key);
      await mkdir(dirname(full), { recursive: true });
      await writeFile(full, new Uint8Array(await f.arrayBuffer()));
      keys.push(key);
    }
    await addPortfolio({ title, trade, description, mediaR2Keys: keys });
  }

  return (
    <main>
      <nav style={{ display: "flex", gap: 12, fontSize: 14, borderBottom: "1px solid #E4E7EC", paddingBottom: 8 }}>
        <Link href="/">Discover</Link><Link href="/certifications">Certify</Link><b>My Passport</b><Link href="/learning">My Learning</Link>
      </nav>
      <h1 style={{ fontSize: 24 }}>My Skills Passport</h1>
      <p style={{ color: "#667085" }}>Use this link when applying: this page. Training + certs + portfolio in one place.</p>

      <h2>Completed training ({training.length})</h2>
      {training.map((t, i) => (<p key={i}>✅ {t.title} — {t.tradeCategory} ({t.providerName})</p>))}
      {training.length === 0 && <p style={{ color: "#667085" }}>None yet — complete a programme in <Link href="/learning">My Learning</Link>.</p>}

      <h2>Certifications ({certs.length})</h2>
      {certs.map((c) => (<p key={c.id}>🎓 {c.trade} — <b>{c.status}</b> ({c.body})</p>))}
      {certs.length === 0 && <p style={{ color: "#667085" }}>Not tracking any yet — <Link href="/certifications">browse pathways</Link>.</p>}

      <h2>Portfolio ({portfolios.length})</h2>
      {portfolios.map((p) => (
        <div key={p.id} style={{ border: "1px solid #E4E7EC", borderRadius: 12, padding: 12, marginTop: 8 }}>
          <b>{p.title}</b> <span style={{ color: "#667085" }}>({p.trade})</span>
          <p>{p.description}</p>
          {(p.mediaR2Keys as string[] ?? []).map((k) => (<p key={k} style={{ fontSize: 13 }}><a href={`/api/uploads/${k}`}>{k}</a></p>))}
        </div>
      ))}
      <form action={upload} style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <h3>Add portfolio evidence (max 4 files, 10MB each)</h3>
        <input name="title" required placeholder="Title e.g. Bedroom wiring job" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="trade" placeholder="Trade" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <textarea name="description" placeholder="What did you do?" rows={2} style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="media" type="file" multiple accept="image/*,video/*" />
        <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Add to passport</button>
      </form>
    </main>
  );
}
