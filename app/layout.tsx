import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOEL BABA RESTORAN — Modern Dining",
  description: "A premium digital menu experience for a modern restaurant.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}