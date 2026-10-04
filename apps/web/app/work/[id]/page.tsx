import Link from "next/link";
import { redirect } from "next/navigation";
import { getOpportunity, apply, applicantsFor } from "@/lib/work";

export const dynamic = "force-dynamic";

export default async function OpportunityDetail({ params }: { params: { id: string } }) {
  const o = await getOpportunity(params.id);
  if (!o) return (<main><p>Not found.</p><p><Link href="/work">← Back</Link></p></main>);
  const applicants = await applicantsFor(params.id);

  async function applyAction() {
    "use server";
    await apply(params.id);
    redirect("/work/applications");
  }

  return (
    <main>
      <p><Link href="/work">← Back to Work</Link></p>
      <span style={{ background: "#EAECF0", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>{o.type}</span>
      <h1 style={{ fontSize: 24 }}>{o.role}</h1>
      <p style={{ color: "#667085" }}>{o.trade} • {o.state} {o.city ? `• ${o.city}` : ""} • {o.paidStatus}</p>
      <p>{o.requirements}</p>
      <form action={applyAction}>
        <button type="submit" style={{ width: "100%", padding: 14, borderRadius: 12, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800, fontSize: 16 }}>Apply with Skills Passport</button>
      </form>
      <h3>Applicants ({applicants.length}) — employer view (demo)</h3>
      {applicants.map((a) => (<p key={a.id} style={{ fontSize: 13 }}>{a.learnerUserId} — {a.status}</p>))}
    </main>
  );
}
