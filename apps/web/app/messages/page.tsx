import Link from "next/link";
import { redirect } from "next/navigation";
import { listConversations, startConversation } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function Messages() {
  const convs = await listConversations();

  async function start(form: FormData) {
    "use server";
    const id = await startConversation(String(form.get("subject") ?? "Question"), String(form.get("body") ?? ""));
    redirect(`/messages/${id}`);
  }

  return (
    <main>
      <h1 style={{ fontSize: 24 }}>Messages (in-app)</h1>
      <p style={{ color: "#667085" }}>Kept inside VocaLink for trust — no WhatsApp redirect (PRD §26).</p>
      {convs.map((c) => (<p key={c.id}><Link href={`/messages/${c.id}`}>{c.subject}</Link></p>))}
      {convs.length === 0 && <p style={{ color: "#667085" }}>No conversations yet.</p>}
      <form action={start} style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <h3>New message</h3>
        <input name="subject" required placeholder="Subject e.g. Question before enrolling" style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <textarea name="body" required placeholder="Message" rows={2} style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Send</button>
      </form>
    </main>
  );
}
