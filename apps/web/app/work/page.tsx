import Link from "next/link";
import { listOpportunities } from "@/lib/work";

export const dynamic = "force-dynamic";

export default async function Work({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const filters = { q: searchParams.q || undefined, type: searchParams.type || undefined, trade: searchParams.trade || undefined, state: searchParams.state || undefined, paid: searchParams.paid || undefined };
  const rows = await listOpportunities(filters);

  return (
    <main>
      <nav style={{ display: "flex", gap: 12, fontSize: 14, borderBottom: "1px solid #E4E7EC", paddingBottom: 8 }}>
        <Link href="/">Discover</Link><b>Work</b><Link href="/work/new">Post</Link><Link href="/work/applications">My Applications</Link><Link href="/candidates">Candidates</Link>
      </nav>
      <h1 style={{ fontSize: 24 }}>Internships, Mentorship & Jobs</h1>
      <form method="get" style={{ display: "grid", gap: 8 }}>
        <input name="q" defaultValue={filters.q ?? ""} placeholder="Search role, trade…" style={{ padding: 13, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select name="type" defaultValue={filters.type ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            {["", "internship", "apprenticeship", "mentorship", "job"].map((t) => (<option key={t} value={t}>{t === "" ? "All types" : t}</option>))}
          </select>
          <select name="trade" defaultValue={filters.trade ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            {["", "Electrical Installation", "Fashion", "Photography", "Plumbing", "Catering", "Welding", "Carpentry"].map((t) => (<option key={t} value={t}>{t === "" ? "All trades" : t}</option>))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select name="state" defaultValue={filters.state ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            {["", "Lagos", "FCT"].map((s) => (<option key={s} value={s}>{s === "" ? "All locations" : s}</option>))}
          </select>
          <select name="paid" defaultValue={filters.paid ?? ""} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            {["", "paid", "unpaid", "stipend"].map((s) => (<option key={s} value={s}>{s === "" ? "Any pay" : s}</option>))}
          </select>
        </div>
        <button type="submit" style={{ padding: 14, borderRadius: 12, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Search</button>
      </form>
      <p style={{ color: "#667085" }}>{rows.length} open. Apply with your Skills Passport.</p>
      {rows.map((o) => (
        <div key={o.id} style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 14, marginTop: 12 }}>
          <span style={{ background: "#EAECF0", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>{o.type}</span>{" "}
          <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 999, background: "#F8FAF7", border: "1px solid #E4E7EC" }}>{o.paidStatus}</span>
          <h3><Link href={`/work/${o.id}`}>{o.role}</Link></h3>
          <p style={{ color: "#667085", fontSize: 13 }}>{o.trade} • {o.state} {o.city ? `• ${o.city}` : ""}</p>
        </div>
      ))}
    </main>
  );
}
