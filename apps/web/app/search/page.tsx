import Link from "next/link";
import { globalSearch } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function Search({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? "";
  const res = q ? await globalSearch(q) : null;
  return (
    <main>
      <nav style={{ display: "flex", gap: 12, fontSize: 14, borderBottom: "1px solid #E4E7EC", paddingBottom: 8 }}>
        <Link href="/">Discover</Link><b>Search all</b>
      </nav>
      <h1 style={{ fontSize: 24 }}>Search VocaLink</h1>
      <form method="get" style={{ display: "flex", gap: 8 }}>
        <input name="q" defaultValue={q} placeholder="Skills, courses, centres, trainers, jobs, mentors…" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <button type="submit" style={{ padding: "12px 18px", borderRadius: 8, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Go</button>
      </form>
      {res && (<>
        <h3>Programmes ({res.programmes.length})</h3>
        {res.programmes.map((p) => (<p key={p.id}><Link href={`/programmes/${p.id}`}>{p.title}</Link></p>))}
        <h3>Providers ({res.providers.length})</h3>
        {res.providers.map((p) => (<p key={p.id}>{p.name}</p>))}
        <h3>Opportunities ({res.opportunities.length})</h3>
        {res.opportunities.map((o) => (<p key={o.id}><Link href={`/work/${o.id}`}>{o.role}</Link></p>))}
        <h3>Certification ({res.pathways.length})</h3>
        {res.pathways.map((p) => (<p key={p.id}><Link href={`/certifications/${p.id}`}>{p.trade}</Link></p>))}
      </>)}
    </main>
  );
}
