import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Odyssey — Admin",
  description: "Administration dashboard for Odyssey simulation engine.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <AdminNav />
          <main style={{ flex: 1, padding: "2rem" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
