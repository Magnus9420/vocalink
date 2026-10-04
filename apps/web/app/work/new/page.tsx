import { redirect } from "next/navigation";
import { postOpportunity } from "@/lib/work";

export const dynamic = "force-dynamic";

export default function PostWork() {
  async function action(form: FormData) {
    "use server";
    const id = await postOpportunity({
      type: String(form.get("type") ?? "job"),
      role: String(form.get("role") ?? ""),
      trade: String(form.get("trade") ?? ""),
      state: String(form.get("state") ?? ""),
      city: String(form.get("city") ?? ""),
      paidStatus: String(form.get("paidStatus") ?? "paid"),
      requirements: String(form.get("requirements") ?? "")
    });
    redirect(`/work/${id}`);
  }

  return (
    <main>
      <h1 style={{ fontSize: 24 }}>Post Opportunity</h1>
      <p style={{ color: "#667085" }}>Employer demo (no sign-in): posts as anonymous-org. Candidate search + management come with auth later.</p>
      <form action={action} style={{ display: "grid", gap: 10 }}>
        <select name="type" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
          <option value="job">Job</option><option value="internship">Internship</option><option value="apprenticeship">Apprenticeship</option><option value="mentorship">Mentorship</option>
        </select>
        <input name="role" required placeholder="Role e.g. Junior Electrician" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <input name="trade" required placeholder="Trade" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input name="state" placeholder="State" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
          <input name="city" placeholder="City" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        </div>
        <select name="paidStatus" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
          <option value="paid">Paid</option><option value="stipend">Stipend</option><option value="unpaid">Unpaid</option>
        </select>
        <textarea name="requirements" placeholder="Requirements + application process" rows={3} style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <button type="submit" style={{ padding: 14, borderRadius: 12, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Post</button>
      </form>
    </main>
  );
}
