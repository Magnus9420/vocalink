import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VocaLink — From Skill to Opportunity",
    short_name: "VocaLink",
    description: "Discover verified vocational training, get certified, and find work in Nigeria.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAF7",
    theme_color: "#0E7C3E",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
