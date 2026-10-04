import Link from "next/link";
import { searchProgrammes } from "@/lib/programmes";
import { isEnabled } from "@/lib/flags";

export const dynamic = "force-dynamic";

const TRADES = ["", "Fashion", "Catering", "Welding", "Plumbing", "Carpentry", "Electrical Installation", "Photography", "Videography", "Beauty", "Construction", "Automotive"];

export default async function Home({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const filters = {
    q: searchParams.q || undefined,
    trade: searchParams.trade || undefined,
    state: searchParams.state || undefined,
    costType: (searchParams.cost as never) || undefined,
    format: (searchParams.format as never) || undefined,
    verifiedOnly: searchParams.verified === "1",
    certifiedOnly: searchParams.certified === "1"
  };
  const rows = await searchProgrammes(filters);
  const [guidedOn, jobsOn] = await Promise.all([isEnabled("guided_discovery"), isEnabled("jobs")]);

  return (
    <main>
      <nav style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #E4E7EC", marginBottom: 12, fontSize: 14 }}>
        <b>VocaLink</b>
        <Link href="/">Discover</Link>
        {guidedOn && <Link href="/guided">Guided</Link>}
        <Link href="/providers/apply">For Providers</Link>
        <Link href="/programmes/new">Publish</Link>
        <Link href="/learning">My Learning</Link>
        <Link href="/certifications">Certify</Link>
        <Link href="/passport">Passport</Link>
        {jobsOn && <Link href="/work">Work</Link>}
        <Link href="/search">Search all</Link>
        <Link href="/notifications">Notifications</Link>
        <Link href="/messages">Messages</Link>
      </nav>
      <p style={{ color: "#667085", fontSize: 14 }}>VocaLink • From Skill to Opportunity</p>
      <h1 style={{ fontSize: 24 }}>Find a skill, get certified, find work</h1>
      <form method="get" style={{ display: "grid", gap: 8 }}>
        <input name="q" defaultValue={filters.q ?? ""} placeholder="Search trade, skill, provider…" style={{ width: "100%", padding: 13, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select name="trade" defaultValue={filters.trade ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            {TRADES.map((t) => (<option key={t} value={t}>{t === "" ? "All trades" : t}</option>))}
          </select>
          <select name="state" defaultValue={filters.state ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            {["", "Lagos", "FCT", "Kano", "Rivers"].map((s) => (<option key={s} value={s}>{s === "" ? "All locations (national)" : s}</option>))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select name="cost" defaultValue={searchParams.cost ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            {["", "free", "sponsored", "paid"].map((c) => (<option key={c} value={c}>{c === "" ? "Any cost" : c}</option>))}
          </select>
          <select name="format" defaultValue={searchParams.format ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            {["", "online", "offline", "hybrid"].map((c) => (<option key={c} value={c}>{c === "" ? "Any format" : c}</option>))}
          </select>
        </div>
        <label style={{ fontSize: 14 }}><input type="checkbox" name="verified" value="1" defaultChecked={filters.verifiedOnly} /> Verified only</label>
        <button type="submit" style={{ padding: 14, borderRadius: 12, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800, fontSize: 16 }}>Search</button>
      </form>
      {guidedOn && <p><Link href="/guided">Not sure what to learn? Try Guided Discovery →</Link></p>}
      <p style={{ color: "#667085" }}>{rows.length} programme(s) found. Verified first.</p>
      {rows.map((r) => (
        <div key={r.id} style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 14, marginTop: 12 }}>
          <div>
            {r.verificationStatus === "approved" && (<span style={{ background: "#0E7C3E", color: "#fff", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>✓ Verified</span>)}
            {" "}<span style={{ background: "#EAECF0", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>{r.costType}</span>
          </div>
          <h3><Link href={`/programmes/${r.id}`}>{r.title}</Link></h3>
          <p style={{ color: "#667085", fontSize: 13 }}>{r.providerName} • {r.state} {r.city ? `• ${r.city}` : ""} • {r.format} • {r.duration}</p>
          {r.certificationInfo && <p style={{ fontSize: 13 }}>🎓 {r.certificationInfo}</p>}
        </div>
      ))}
      <footer style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid #E4E7EC", fontSize: 13, color: "#667085" }}>
        VocaLink: From Skill to Opportunity • <Link href="/providers/apply">List your training</Link> • Admin: localhost:3001/verifications
      </footer>
    </main>
  );
}
