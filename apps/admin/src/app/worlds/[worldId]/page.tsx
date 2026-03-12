import { notFound } from "next/navigation";
import { getWorldRepository } from "@pandora/db";

export const dynamic = "force-dynamic";

export default async function WorldDetailPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = await params;
  const detail = await getWorldRepository().getWorldDetail(worldId);

  if (!detail) {
    notFound();
  }

  const { world, source, editable } = detail;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <a href="/worlds" style={{ color: "var(--accent)", fontSize: "0.875rem" }}>
          &larr; Back to Worlds
        </a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{world.title}</h1>
        <span
          style={{
            display: "inline-block",
            padding: "0.125rem 0.5rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 500,
            background: source === "static" ? "#f3f4f6" : "#dbeafe",
            color: source === "static" ? "#4b5563" : "#1e40af",
          }}
        >
          {source}{editable ? " (editable)" : ""}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <section
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}
        >
          <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--muted)", marginBottom: "0.5rem" }}>
            Setting
          </h2>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{world.setting}</p>
        </section>

        <section
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}
        >
          <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--muted)", marginBottom: "0.5rem" }}>
            Premise
          </h2>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{world.premise}</p>
        </section>
      </div>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          Characters ({world.characters.length})
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
          {world.characters.map((character) => (
            <div
              key={character.id}
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                padding: "1rem",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{character.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                {character.title} &middot; {character.archetype}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                Faction: {character.factionId}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          Factions ({world.factions.length})
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
          {world.factions.map((faction) => (
            <div
              key={faction.id}
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                padding: "1rem",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{faction.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                Influence: {faction.influence} &middot; {faction.disposition}
              </div>
              <div style={{ fontSize: "0.8rem" }}>{faction.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          Initial State
        </h2>
        <pre
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "1rem",
            fontSize: "0.8rem",
            overflow: "auto",
            maxHeight: 400,
          }}
        >
          {JSON.stringify(world.initialState, null, 2)}
        </pre>
      </section>
    </div>
  );
}
