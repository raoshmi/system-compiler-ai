import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppForge | AI-Native Software Builder",
  description: "Turn your ideas into ready-to-use apps with the power of AI architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
