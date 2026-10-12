import type { Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#F8FAF7", color: "#101828" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}
