"use client";

import { useState } from "react";

type Milestone = {
  label: string;
  status: "done" | "active" | "upcoming";
};

type Phase = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  colorSoft: string;
  status: "complete" | "active" | "upcoming";
  milestones: Milestone[];
  audience?: string;
};

const phases: Phase[] = [
  {
    id: "audio-engine",
    number: 1,
    title: "Audio Practice Engine",
    subtitle: "Voice-First Simulation",
    description:
      "Audio-driven world engine for practicing high-stakes communication. Users enter simulated environments — interviews, presentations, panels, pitches — and interact through voice with AI characters who respond dynamically to tone, content, and confidence.",
    color: "#8fd1cb",
    colorSoft: "rgba(143, 209, 203, 0.12)",
    status: "active",
    audience: "Institutions & Individuals",
    milestones: [
      { label: "Core world-building schema & engine", status: "done" },
      { label: "Turn-based simulation loop", status: "done" },
      { label: "ElevenLabs voice integration", status: "done" },
      { label: "Dynamic character voice assignment", status: "done" },
      { label: "World builder (AI-generated scenarios)", status: "done" },
      { label: "Admin console & engine inspector", status: "done" },
      { label: "Interview & presentation templates", status: "active" },
      { label: "Real-time voice input (STT)", status: "active" },
      { label: "Scoring & feedback system", status: "upcoming" },
      { label: "Session replay & coaching insights", status: "upcoming" },
      { label: "Consumer-facing world builder (node-based)", status: "upcoming" },
      { label: "Institutional onboarding & multi-seat", status: "upcoming" },
    ],
  },
  {
    id: "wellness-stories",
    number: 2,
    title: "Immersive Wellness & Stories",
    subtitle: "Guided Exploration Spaces",
    description:
      "Extend the world engine into meditative, therapeutic, and narrative spaces. Immersive guided meditations, self-exploration journeys, and branching interactive stories — all driven by the same dynamic character and environment system.",
    color: "#c4a7e7",
    colorSoft: "rgba(196, 167, 231, 0.10)",
    status: "upcoming",
    milestones: [
      { label: "Ambient soundscape & mood engine", status: "upcoming" },
      { label: "Guided meditation world templates", status: "upcoming" },
      { label: "Self-exploration character archetypes", status: "upcoming" },
      { label: "Branching narrative framework", status: "upcoming" },
      { label: "Emotional tone tracking & adaptation", status: "upcoming" },
      { label: "User-created worlds (publish & share)", status: "upcoming" },
      { label: "Community world discovery & ratings", status: "upcoming" },
    ],
  },
  {
    id: "multimedia",
    number: 3,
    title: "Multimedia Worlds",
    subtitle: "Visual & Video Rendering",
    description:
      "Introduce 2D image generation, video rendering, and rich visual layers to world experiences. Scenes come alive through generated imagery, animated sequences, and composited video — making every world visually distinct.",
    color: "#e7a74c",
    colorSoft: "rgba(231, 167, 76, 0.10)",
    status: "upcoming",
    milestones: [
      { label: "2D scene image generation", status: "upcoming" },
      { label: "Video clip rendering pipeline", status: "upcoming" },
      { label: "Visual character portraits & expressions", status: "upcoming" },
      { label: "Multi-format export (audio, video, mixed)", status: "upcoming" },
      { label: "Live video streaming for sessions", status: "upcoming" },
      { label: "Creator tools for multimedia worlds", status: "upcoming" },
      { label: "Community marketplace & monetization", status: "upcoming" },
    ],
  },
  {
    id: "full-immersion",
    number: 4,
    title: "Full Immersion",
    subtitle: "Live 3D & Spatial Worlds",
    description:
      "The ultimate vision — fully immersive, real-time 3D environments streamed to any device. Spatial audio, embodied characters, persistent worlds. The most fluid, immersive world engine ever built.",
    color: "#e76a6a",
    colorSoft: "rgba(231, 106, 106, 0.10)",
    status: "upcoming",
    milestones: [
      { label: "Real-time 3D environment streaming", status: "upcoming" },
      { label: "Spatial audio & positional voice", status: "upcoming" },
      { label: "Embodied AI characters", status: "upcoming" },
      { label: "Persistent world state across sessions", status: "upcoming" },
      { label: "Cross-device immersive client", status: "upcoming" },
      { label: "Full creator economy — 3D world publishing & revenue", status: "upcoming" },
    ],
  },
];

function statusDot(status: "done" | "active" | "upcoming") {
  if (status === "done") {
    return (
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--success, #8CE7D2)",
          flexShrink: 0,
        }}
      />
    );
  }
  if (status === "active") {
    return (
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--accent, #8fd1cb)",
          boxShadow: "0 0 6px var(--accent, #8fd1cb)",
          flexShrink: 0,
          animation: "pulse-dot 2s ease-in-out infinite",
        }}
      />
    );
  }
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        border: "1.5px solid var(--muted, rgba(255,255,255,0.3))",
        flexShrink: 0,
      }}
    />
  );
}

function phaseStatusBadge(status: Phase["status"]) {
  const map = {
    complete: {
      label: "Complete",
      bg: "rgba(140, 231, 210, 0.15)",
      color: "var(--success, #8CE7D2)",
    },
    active: {
      label: "In Progress",
      bg: "rgba(143, 209, 203, 0.15)",
      color: "var(--accent, #8fd1cb)",
    },
    upcoming: {
      label: "Upcoming",
      bg: "rgba(255, 255, 255, 0.06)",
      color: "var(--muted, rgba(255,255,255,0.5))",
    },
  };
  const s = map[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.6rem",
        borderRadius: 9999,
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

export default function RoadmapPage() {
  const [expanded, setExpanded] = useState<string | null>("audio-engine");

  const totalMilestones = phases.reduce((sum, p) => sum + p.milestones.length, 0);
  const doneMilestones = phases.reduce(
    (sum, p) => sum + p.milestones.filter((m) => m.status === "done").length,
    0,
  );
  const activeMilestones = phases.reduce(
    (sum, p) => sum + p.milestones.filter((m) => m.status === "active").length,
    0,
  );

  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "var(--foreground)",
            }}
          >
            Development Roadmap
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--muted)",
              lineHeight: 1.6,
              maxWidth: 640,
            }}
          >
            Building the most fluid, immersive world engine — starting with
            voice-first simulation for high-stakes practice, expanding into
            wellness, storytelling, and full spatial immersion.
          </p>
        </div>

        {/* Progress summary */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.25rem",
              minWidth: 140,
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.25rem",
              }}
            >
              Overall
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>
              {Math.round((doneMilestones / totalMilestones) * 100)}%
            </div>
          </div>
          <div
            style={{
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.25rem",
              minWidth: 140,
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.25rem",
              }}
            >
              Completed
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--success, #8CE7D2)" }}>
              {doneMilestones}
              <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--muted)" }}>
                {" "}
                / {totalMilestones}
              </span>
            </div>
          </div>
          <div
            style={{
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.25rem",
              minWidth: 140,
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.25rem",
              }}
            >
              Active
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent, #8fd1cb)" }}>
              {activeMilestones}
            </div>
          </div>
        </div>

        {/* Band visualization — stacked progress rail */}
        <div
          style={{
            display: "flex",
            height: 6,
            borderRadius: 3,
            overflow: "hidden",
            marginBottom: "2.5rem",
            background: "var(--panel)",
            border: "1px solid var(--border)",
          }}
        >
          {phases.map((phase) => {
            const weight = phase.milestones.length / totalMilestones;
            const done = phase.milestones.filter((m) => m.status === "done").length;
            const active = phase.milestones.filter((m) => m.status === "active").length;
            const fill = (done + active * 0.5) / phase.milestones.length;
            return (
              <div
                key={phase.id}
                style={{
                  flex: weight,
                  position: "relative",
                  background: phase.colorSoft,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${fill * 100}%`,
                    background: phase.color,
                    opacity: 0.8,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Phase bands */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {phases.map((phase) => {
            const isExpanded = expanded === phase.id;
            const done = phase.milestones.filter((m) => m.status === "done").length;
            const phaseProgress = Math.round((done / phase.milestones.length) * 100);

            return (
              <div
                key={phase.id}
                style={{
                  background: "var(--panel)",
                  border: `1px solid ${isExpanded ? phase.color + "33" : "var(--border)"}`,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Band header — always visible */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : phase.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--foreground)",
                  }}
                >
                  {/* Phase number pill */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: phase.colorSoft,
                      color: phase.color,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {phase.number}
                  </span>

                  {/* Title + subtitle */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 600 }}>
                        {phase.title}
                      </span>
                      {phaseStatusBadge(phase.status)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        marginTop: "0.1rem",
                      }}
                    >
                      {phase.subtitle}
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 4,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${phaseProgress}%`,
                          height: "100%",
                          background: phase.color,
                          borderRadius: 2,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                        width: 32,
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {phaseProgress}%
                    </span>
                  </div>

                  {/* Chevron */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      flexShrink: 0,
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "0 1.25rem 1.25rem 1.25rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--muted)",
                        lineHeight: 1.65,
                        margin: "1rem 0",
                        maxWidth: 600,
                      }}
                    >
                      {phase.description}
                    </p>

                    {phase.audience && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.2rem 0.65rem",
                          borderRadius: 9999,
                          background: phase.colorSoft,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: phase.color,
                          letterSpacing: "0.04em",
                          marginBottom: "1rem",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {phase.audience}
                      </div>
                    )}

                    {/* Milestones */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {phase.milestones.map((milestone, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            fontSize: "0.85rem",
                            color:
                              milestone.status === "upcoming"
                                ? "var(--muted)"
                                : "var(--foreground)",
                          }}
                        >
                          {statusDot(milestone.status)}
                          <span
                            style={{
                              textDecoration:
                                milestone.status === "done" ? "line-through" : "none",
                              opacity: milestone.status === "done" ? 0.6 : 1,
                            }}
                          >
                            {milestone.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vision footer */}
        <div
          style={{
            marginTop: "2.5rem",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            background:
              "linear-gradient(135deg, rgba(143, 209, 203, 0.06) 0%, rgba(196, 167, 231, 0.06) 50%, rgba(231, 106, 106, 0.06) 100%)",
            border: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}
          >
            North Star
          </div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--foreground)",
              lineHeight: 1.5,
            }}
          >
            The most fluid, immersive world engine that allows anyone to be
            fully engaged in a complex and dynamic space.
          </div>
        </div>
      </div>
    </>
  );
}
