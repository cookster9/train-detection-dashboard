import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Train Detector",
  description: "Live train detection feed from Raspberry Pi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
