import { getWorldRepository, getPersistenceStore } from "@odyssey/db";
import { StatCard } from "@/components/stat-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const worlds = await getWorldRepository().listWorlds();
  const sessions = await getPersistenceStore().listSessions();
  const activeSessions = sessions.filter((s) => s.status === "active");

  return (
    <div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
        }}
      >
        Dashboard
      </h1>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <StatCard label="Worlds" value={worlds.length} />
        <StatCard
          label="Sessions"
          value={sessions.length}
          detail={`${activeSessions.length} active`}
        />
      </div>

      {sessions.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              color: "var(--muted)",
            }}
          >
            Recent Sessions
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              overflow: "hidden",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem 1rem", color: "var(--muted)", fontWeight: 500 }}>ID</th>
                <th style={{ textAlign: "left", padding: "0.5rem 1rem", color: "var(--muted)", fontWeight: 500 }}>World</th>
                <th style={{ textAlign: "left", padding: "0.5rem 1rem", color: "var(--muted)", fontWeight: 500 }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.5rem 1rem", color: "var(--muted)", fontWeight: 500 }}>Turns</th>
                <th style={{ textAlign: "left", padding: "0.5rem 1rem", color: "var(--muted)", fontWeight: 500 }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(0, 10).map((session) => (
                <tr key={session.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.5rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                    <a
                      href={`/sessions/${session.id}`}
                      style={{ color: "var(--accent)" }}
                    >
                      {session.id.slice(0, 16)}...
                    </a>
                  </td>
                  <td style={{ padding: "0.5rem 1rem" }}>{session.worldId}</td>
                  <td style={{ padding: "0.5rem 1rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        background:
                          session.status === "active"
                            ? "#d1fae5"
                            : session.status === "complete"
                              ? "#dbeafe"
                              : "#f3f4f6",
                        color:
                          session.status === "active"
                            ? "#065f46"
                            : session.status === "complete"
                              ? "#1e40af"
                              : "#4b5563",
                      }}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem 1rem" }}>{session.currentStateVersion}</td>
                  <td style={{ padding: "0.5rem 1rem", color: "var(--muted)" }}>
                    {new Date(session.lastActiveAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
