import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleDomBridge } from "@/components/locale-dom-bridge";
export const metadata: Metadata = { metadataBase: new URL("https://qaddemni.com"), title: { default: "Qaddemni — Your AI Career Execution Agent", template: "%s · Qaddemni" }, description: "A thoughtful AI career execution agent to help you profile, discover roles, understand your fit, prepare applications, and learn as you go.", applicationName: "Qaddemni", openGraph: { title: "Qaddemni — Your AI Career Execution Agent", description: "From career goals to a confident next move.", siteName: "Qaddemni", type: "website" }, twitter: { card: "summary_large_image", title: "Qaddemni — Your AI Career Execution Agent", description: "From career goals to a confident next move." } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f5f8fd" }, { media: "(prefers-color-scheme: dark)", color: "#080e18" }] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-theme="dark"><body><ThemeProvider><LocaleDomBridge/>{children}</ThemeProvider></body></html>; }
