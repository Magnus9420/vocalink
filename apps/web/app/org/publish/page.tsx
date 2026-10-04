import { redirect } from "next/navigation";
import { listProviders } from "@/lib/trust";
import { publishSponsored } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function OrgPublish() {
  const providers = await listProviders();

  async function action(form: FormData) {
    "use server";
    const id = await publishSponsored({
      providerId: String(form.get("providerId") ?? ""),
      title: String(form.get("title") ?? ""),
      tradeCategory: String(form.get("tradeCategory") ?? ""),
      description: String(form.get("description") ?? ""),
      state: String(form.get("state") ?? ""),
      city: String(form.get("city") ?? ""),
      sponsor: String(form.get("sponsor") ?? ""),
      eligibility: String(form.get("eligibility") ?? ""),
      beneficiaryTarget: String(form.get("beneficiaryTarget") ?? ""),
      spaces: Number(form.get("spaces") ?? 0)
    });
    redirect(`/programmes/${id}`);
  }

  return (
    <main>
      <h1 style={{ fontSize: 24 }}>Publish Sponsored Programme (NGO / Government)</h1>
      <p style={{ color: "#667085" }}>Sponsor, beneficiaries, eligibility, places. Future: track Selection → Placement.</p>
      <form action={action} style={{ display: "grid", gap: 10 }}>
        <input name="sponsor" required placeholder="Sponsor e.g. State Skills Fund" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <select name="providerId" required style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
          <option value="">Training provider…</option>
          {providers.map((p) => (<option key={p.id} value={p.id}>{p.name} ({p.verificationStatus})</option>))}
        </select>
        <input name="title" required placeholder="Programme title" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="tradeCategory" required placeholder="Trade" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <textarea name="description" placeholder="Description + expected outcomes" rows={3} style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="eligibility" placeholder="Eligibility criteria" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="beneficiaryTarget" placeholder="Target beneficiaries e.g. 100 youths in Ikeja" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input name="state" placeholder="State" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
          <input name="city" placeholder="City" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
          <input name="spaces" type="number" placeholder="Places" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        </div>
        <button type="submit" style={{ padding: 14, borderRadius: 12, border: 0, background: "#175CD3", color: "#fff", fontWeight: 800 }}>Publish sponsored programme</button>
      </form>
    </main>
  );
}
