"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/worlds", label: "Worlds" },
  { href: "/sessions", label: "Sessions" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: 220,
        borderRight: "1px solid var(--border)",
        background: "var(--panel)",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "1.5rem",
          paddingLeft: "0.75rem",
        }}
      >
        Pandora Admin
      </div>

      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "block",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--accent)" : "var(--foreground)",
              background: isActive ? "var(--accent-light)" : "transparent",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
