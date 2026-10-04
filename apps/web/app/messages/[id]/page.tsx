import Link from "next/link";
import { getThread, reply } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function Thread({ params }: { params: { id: string } }) {
  const { conv, msgs } = await getThread(params.id);
  if (!conv) return (<main><p>Not found.</p><p><Link href="/messages">← Back</Link></p></main>);

  async function send(form: FormData) {
    "use server";
    await reply(params.id, String(form.get("body") ?? ""));
  }

  return (
    <main>
      <p><Link href="/messages">← Back</Link></p>
      <h1 style={{ fontSize: 20 }}>{conv.subject}</h1>
      {msgs.map((m) => (
        <div key={m.id} style={{ border: "1px solid #E4E7EC", borderRadius: 10, padding: 10, marginTop: 8 }}>
          <p style={{ fontSize: 13, color: "#667085" }}>{m.senderId}</p>
          <p>{m.body}</p>
        </div>
      ))}
      <form action={send} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input name="body" required placeholder="Reply…" style={{ flex: 1, padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }} />
        <button type="submit" style={{ padding: "12px 16px", borderRadius: 8, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Send</button>
      </form>
    </main>
  );
}
