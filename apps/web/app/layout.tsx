import type { Metadata, Viewport } from "next";
import "./globals.css";
import SwRegister from "./sw-register";

export const metadata: Metadata = {
  title: "VocaLink — From Skill to Opportunity",
  description: "Discover verified vocational training, get certified, and find work in Nigeria.",
  appleWebApp: { capable: true, title: "VocaLink", statusBarStyle: "default" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#F8FAF7", color: "#101828" }}>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <SwRegister />
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
