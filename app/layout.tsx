import type { Metadata } from "next";
import Link from "next/link";
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
      <body>
        <div className="app-shell">
          <nav className="top-nav" aria-label="Primary navigation">
            <Link href="/" className="nav-brand">
              Train Detector
            </Link>
            <a
              href="https://github.com/cookster9/train-detection-dashboard"
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
