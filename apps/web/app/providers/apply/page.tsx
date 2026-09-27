import { redirect } from "next/navigation";
import { submitProvider } from "@/lib/trust";

export const dynamic = "force-dynamic";

export default function ProviderApply() {
  async function action(form: FormData) {
    "use server";
    const id = await submitProvider({
      name: String(form.get("name") ?? ""),
      type: String(form.get("type") ?? "Vocational centre"),
      bio: String(form.get("bio") ?? ""),
      state: String(form.get("state") ?? ""),
      city: String(form.get("city") ?? ""),
      contact: String(form.get("contact") ?? ""),
      evidence: String(form.get("evidence") ?? "")
    });
    redirect(`/providers/applied/${id}`);
  }

  return (
    <main>
      <h1 style={{ fontSize: 24 }}>Register as Training Provider</h1>
      <p style={{ color: "#667085" }}>Submit for verification. You cannot claim “Verified” until an admin approves. Verification ≠ automatic accreditation.</p>
      <form action={action} style={{ display: "grid", gap: 10 }}>
        <input name="name" required placeholder="Provider name" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <select name="type" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
          <option>Vocational centre</option><option>Technical college</option><option>Certified trainer</option><option>Master artisan</option><option>Private training org</option>
        </select>
        <textarea name="bio" required placeholder="What do you train?" rows={3} style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input name="state" required placeholder="State" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
          <input name="city" required placeholder="City" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        </div>
        <input name="contact" required placeholder="Contact (phone/email)" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="evidence" placeholder="Evidence link or R2 key (CAC, photos, refs)" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <button type="submit" style={{ padding: 14, borderRadius: 12, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Submit for verification</button>
      </form>
    </main>
  );
}
