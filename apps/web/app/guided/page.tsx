import { GUIDED_QUESTIONS, guidedRecommend } from "@/lib/guided";

export const dynamic = "force-dynamic";

export default async function Guided({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const answers = {
    interest: searchParams.interest ?? "",
    method: searchParams.method ?? "",
    budget: searchParams.budget ?? "",
    state: searchParams.state ?? ""
  };
  const answered = Boolean(answers.interest && answers.method && answers.budget && answers.state);
  const rec = answered ? await guidedRecommend(answers) : null;

  return (
    <main>
      <h1 style={{ fontSize: 24 }}>Guided Discovery</h1>
      <p style={{ color: "#667085" }}>Answer 4 questions — we recommend trades and programmes. No account needed.</p>
      <form method="get" style={{ display: "grid", gap: 10 }}>
        {GUIDED_QUESTIONS.map((q) => (
          <label key={q.key} style={{ display: "grid", gap: 4 }}>
            <b>{q.label}</b>
            <select name={q.key} defaultValue={(answers as never)[q.key] ?? ""} style={{ padding: 12, borderRadius: 8, border: "1.5px solid #E4E7EC" }}>
              <option value="">Choose…</option>
              {q.options.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </label>
        ))}
        <button type="submit" style={{ padding: 14, borderRadius: 12, border: 0, background: "#F59E0B", fontWeight: 800, fontSize: 16 }}>Recommend for me</button>
      </form>
      {rec && (
        <div style={{ marginTop: 16 }}>
          <h2>Suggested: {rec.trade}</h2>
          {rec.rows.length === 0 && <p>No matches — try “Anywhere” or “Either”.</p>}
          {rec.rows.map((r) => (
            <div key={r.id} style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 14, marginTop: 10 }}>
              <b><a href={`/programmes/${r.id}`}>{r.title}</a></b>
              <p style={{ color: "#667085", fontSize: 13 }}>{r.providerName} • {r.state} • {r.format} • {r.costType}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
