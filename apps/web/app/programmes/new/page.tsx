import { redirect } from "next/navigation";
import { listProviders, publishProgramme } from "@/lib/trust";

export const dynamic = "force-dynamic";

export default async function PublishProgramme() {
  const providers = await listProviders();

  async function action(form: FormData) {
    "use server";
    const id = await publishProgramme({
      providerId: String(form.get("providerId") ?? ""),
      title: String(form.get("title") ?? ""),
      tradeCategory: String(form.get("tradeCategory") ?? ""),
      description: String(form.get("description") ?? ""),
      state: String(form.get("state") ?? ""),
      city: String(form.get("city") ?? ""),
      format: (String(form.get("format") ?? "offline") as never),
      duration: String(form.get("duration") ?? ""),
      costType: (String(form.get("costType") ?? "free") as never),
      certificationInfo: String(form.get("certificationInfo") ?? ""),
      entryRequirements: String(form.get("entryRequirements") ?? ""),
      spaces: Number(form.get("spaces") ?? 0)
    });
    redirect(`/programmes/${id}`);
  }

  return (
    <main>
      <h1 style={{ fontSize: 24 }}>Publish Training Programme</h1>
      <p style={{ color: "#667085" }}>Full §8 listing: learners must understand it without contacting you first. Keep certification honest.</p>
      <form action={action} style={{ display: "grid", gap: 10 }}>
        <select name="providerId" required style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
          <option value="">Select provider…</option>
          {providers.map((p) => (<option key={p.id} value={p.id}>{p.name} ({p.verificationStatus})</option>))}
        </select>
        <input name="title" required placeholder="Programme title" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="tradeCategory" required placeholder="Trade (e.g. Electrical Installation)" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <textarea name="description" required placeholder="Description + what learners will learn" rows={3} style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input name="state" placeholder="State" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
          <input name="city" placeholder="City" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select name="format" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            <option value="offline">Offline</option><option value="online">Online</option><option value="hybrid">Hybrid</option>
          </select>
          <select name="costType" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
            <option value="free">Free</option><option value="sponsored">Sponsored</option><option value="paid">Paid</option>
          </select>
        </div>
        <input name="duration" placeholder="Duration (e.g. 3 months)" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="certificationInfo" placeholder="Certification info (or leave honest blank)" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="entryRequirements" placeholder="Entry requirements" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="spaces" type="number" placeholder="Available spaces" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <button type="submit" style={{ padding: 14, borderRadius: 12, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Publish</button>
      </form>
    </main>
  );
}
