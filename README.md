# Pandora's Box 🗝️

> *"What is it like to be someone else entirely?"*

---

## Vision

Pandora's Box is an immersive reality engine. Users step into different worlds — historical, fictional, hypothetical — and *live* them through AI-powered sub-agents that inhabit that world alongside them.

Inspired by the film *Big*: not just watching a story, but *being inside one*. What would it feel like to be a medieval king making court decisions? A 1920s jazz musician in Harlem? A deep-space commander navigating a crisis? Pandora's Box is the engine that makes that possible.

---

## Core Thesis

Each experience is built on two primitives:

1. **Spaces** — rich context windows that define a world
2. **Identities** — sub-agents that *live* in that world and engage the user dynamically

The user steps in, takes a role, and the world responds to them.

---

## Architecture

### 1. 🌍 Spaces (Context Windows)
Each Space is a structured document that defines the complete reality of a world:
- **Setting** — time period, geography, culture, power structures
- **Rules** — what's possible, what's forbidden, what's at stake
- **Characters** — who exists, their relationships, their agendas
- **The User's Role** — who the user *is* in this world (king, explorer, detective, etc.)
- **Active Events** — what's happening right now that the user walks into

### 2. 🎭 Identities (Sub-Agents)
Within each Space, AI agents take on specific identities:
- Unique personality, dialect, knowledge, and worldview — all bounded by the Space context
- Dynamic relationships with the user (loyal advisor, rival, enemy, love interest)
- React, remember, and evolve within a session
- Can conspire with each other, conflict, align — creating emergent narrative

### 3. 🎼 Scene Orchestrator
The brain of the system:
- Routes user input to the right agent(s)
- Maintains narrative coherence across the session
- Triggers events, escalations, and consequences based on user choices
- Manages transitions between scenes and states
- Ensures agents don't break character or contradict the Space context

### 4. 🖥️ User Interface
An immersive frontend that makes the user feel present:
- Visually themed to the Space (art direction, typography, ambient tone)
- Conversation-first interaction model
- Context clues about the world woven into the UI
- Action menus for choices within the scene
- Optional voice layer for deeper immersion

### 5. 🧠 Memory System
Persistent state across sessions:
- **Session Memory** — what happened in this visit, who said what
- **World State** — how the user's decisions have changed the world over time
- **Relationship Tracking** — agents remember the user's history with them
- **Consequence Engine** — actions in past sessions ripple into future ones

### 6. 🏗️ Reality Builder (Admin)
A tool for creating and managing Spaces:
- Space definition editor (structured form → context document)
- Identity / character creator
- Context window manager and versioning
- Preview / test environment for new worlds

---

## User Journey

```
Open Pandora's Box
       ↓
Browse / choose a Space
(Medieval Kingdom · 1920s Jazz Club · Space Station · ...)
       ↓
Select your Role within the Space
(The King · The Musician · The Commander · ...)
       ↓
Enter the World
Agents greet you. The scene is alive.
       ↓
Engage, decide, act
The world responds to everything you do.
       ↓
Leave — return later
The world remembers. Things have changed.
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Backend / API | Next.js API routes |
| AI / Agent Layer | Anthropic Claude API (multi-agent) |
| Context Management | Structured prompting + vector embeddings |
| Database | NeonDB (PostgreSQL via Drizzle ORM) |
| Auth | NextAuth v5 |
| Frontend UI | Tailwind CSS, shadcn/ui |
| Voice (optional) | ElevenLabs TTS |

---

## MVP Scope

**Phase 1 — The Engine**
- [ ] Space schema and storage (NeonDB)
- [ ] Identity / agent system with bounded context
- [ ] Scene Orchestrator (single-user, single-space)
- [ ] Basic session memory

**Phase 2 — First Worlds**
- [ ] Medieval Kingdom (3 agents: Advisor, Knight, Rival Noble)
- [ ] 1920s Jazz Club (3 agents: Club Owner, Fellow Musician, Mysterious Stranger)
- [ ] Space Station (3 agents: Science Officer, Engineer, Mission Control)

**Phase 3 — The Interface**
- [ ] Immersive conversation UI
- [ ] Space selection / browsing
- [ ] Visual theming per Space
- [ ] Mobile-friendly layout

**Phase 4 — Depth**
- [ ] World State + Consequence Engine
- [ ] Reality Builder (admin) for creating new Spaces
- [ ] Voice layer
- [ ] Multi-session narrative arcs

---

## The Name

Pandora's Box — a container that holds all possible worlds. Every time someone opens it, something new escapes into existence.

---

*Project started: March 2026*
