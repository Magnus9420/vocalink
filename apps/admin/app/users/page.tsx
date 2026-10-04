import { listUsers } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function Users() {
  const rows = await listUsers();
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Users ({rows.length})</h1>
      {rows.map((u) => (
        <div key={u.id} style={{ border: "1px solid #E4E7EC", borderRadius: 10, padding: 10, marginTop: 8, fontSize: 14 }}>
          <b>{u.name ?? u.email}</b> — {u.email} — <span style={{ background: "#EAECF0", padding: "2px 8px", borderRadius: 999 }}>{u.role}</span>
        </div>
      ))}
    </main>
  );
}
