import { myNotifications, markAllRead, getPrefs, savePrefs } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

const CATS = ["training", "certification", "work", "messages"];

export default async function Notifications() {
  const [rows, prefs] = await Promise.all([myNotifications(), getPrefs()]);
  const unread = rows.filter((r) => !r.read).length;

  async function readAll() {
    "use server";
    await markAllRead();
  }

  async function save(form: FormData) {
    "use server";
    await savePrefs(CATS.filter((c) => form.get(c) === "1"));
  }

  return (
    <main>
      <h1 style={{ fontSize: 24 }}>Notifications ({unread} unread)</h1>
      <form action={readAll}><button type="submit" style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E4E7EC", background: "#fff" }}>Mark all read</button></form>
      {rows.map((n) => (
        <div key={n.id} style={{ border: "1px solid #E4E7EC", borderRadius: 12, padding: 12, marginTop: 8, opacity: n.read ? 0.65 : 1 }}>
          <b>[{n.type}] {n.title}</b><p style={{ fontSize: 13 }}>{n.body}</p>
        </div>
      ))}
      {rows.length === 0 && <p style={{ color: "#667085" }}>No notifications yet — enrol, apply, or message to generate some.</p>}
      <form action={save} style={{ marginTop: 16 }}>
        <h3>Preferences (PRD §23)</h3>
        {CATS.map((c) => (<label key={c} style={{ display: "block", fontSize: 14 }}><input type="checkbox" name={c} value="1" defaultChecked={prefs.includes(c)} /> {c}</label>))}
        <button type="submit" style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, border: 0, background: "#0E7C3E", color: "#fff", fontWeight: 800 }}>Save preferences</button>
      </form>
    </main>
  );
}
