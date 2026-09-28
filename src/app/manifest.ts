import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Qaddemni — AI Career Agent",
    short_name: "Qaddemni",
    description: "A clear path from career goals to your next opportunity.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f9fc",
    theme_color: "#163caa",
    orientation: "portrait",
    lang: "en",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
