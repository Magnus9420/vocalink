import Link from "next/link";

export default function Offline() {
  return (
    <main>
      <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: 12, padding: 20, marginTop: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 22 }}>You’re offline</h1>
        <p style={{ color: "#667085" }}>VocaLink needs the internet for fresh training, jobs and AI guidance. Previously visited pages may still open from cache.</p>
        <p><Link href="/">Try home again →</Link></p>
      </div>
    </main>
  );
}
