import { getFlags, setFlag } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function Flags() {
  const flags = await getFlags();

  async function toggle(form: FormData) {
    "use server";
    await setFlag(String(form.get("key") ?? ""), String(form.get("enabled") ?? "1") === "1");
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Platform Controls</h1>
      <p>Major features toggle without deploy (PRD §27). Gated in web UI: Guided Discovery, Reviews, Jobs.</p>
      {flags.map((f) => (
        <form key={f.key} action={toggle} style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #E4E7EC", borderRadius: 10, padding: 10, marginTop: 8 }}>
          <input type="hidden" name="key" value={f.key} />
          <span style={{ flex: 1 }}><b>{f.key}</b> — {f.enabled ? "ON" : "OFF"}</span>
          <button name="enabled" value={f.enabled ? "0" : "1"} style={{ padding: "8px 14px", borderRadius: 8, border: 0, background: f.enabled ? "#D92D20" : "#0E7C3E", color: "#fff", fontWeight: 800 }}>
            Turn {f.enabled ? "OFF" : "ON"}
          </button>
        </form>
      ))}
    </main>
  );
}
