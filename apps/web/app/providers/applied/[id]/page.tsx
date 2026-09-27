import Link from "next/link";

export default function Applied({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Application received</h1>
      <p>Your provider ID: <b>{params.id}</b></p>
      <p style={{ color: "#667085" }}>Status: pending. An admin will approve, request info, or reject. Do not use the Verified badge until approved.</p>
      <p><Link href="/">← Back to Discover</Link> • <Link href="/programmes/new">Publish a programme</Link></p>
    </main>
  );
}
