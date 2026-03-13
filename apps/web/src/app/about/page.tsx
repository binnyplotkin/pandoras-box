import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Odyssey",
  description:
    "Odyssey is an immersive reality engine that opens the door to infinite worlds — reshaping how people learn, create, and experience life.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-mono)" }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/infinite-worlds.png"
            alt="An expansive vista of infinite worlds — luminous landscapes, floating realms, and vast possibilities stretching to the horizon"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Odyssey
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {["Worlds", "Engine", "About"].map((item) => (
              <Link
                key={item}
                href={
                  item === "Worlds"
                    ? "/builder"
                    : item === "Engine"
                      ? "/engine"
                      : "/about"
                }
                className={`rounded-full border px-5 py-1.5 text-sm backdrop-blur-md transition-all ${
                  item === "About"
                    ? "border-white/25 bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                    : "border-white/15 bg-white/8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-white/30 hover:bg-white/15"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/builder"
              className="rounded-full border border-white/15 bg-white/8 px-5 py-1.5 text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/15"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 flex min-h-[75vh] flex-col justify-end px-6 pb-16 sm:px-10">
          <div className="max-w-2xl space-y-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
              The Vision
            </p>
            <h1
              className="text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span style={{ color: "#8fd1cb" }}>Infinite Worlds.</span>
              <br />
              One Engine.
              <br />
              Limitless Potential.
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-white/65 lg:text-base">
              Odyssey is an immersive reality engine that opens the door to
              every world imaginable — and builds the ones that haven&apos;t been imagined yet.
            </p>
          </div>
        </div>
      </section>

      {/* ── Story Section ────────────────────────────────────── */}
      <section className="relative bg-black">
        <div className="mx-auto w-full max-w-4xl px-6 py-20 sm:px-10 lg:px-8">
          <article className="space-y-20">

            {/* The Origin */}
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                I. The Idea
              </p>
              <h2
                className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                A Door Into Every World
              </h2>
              <div className="space-y-5 text-base leading-relaxed text-white/70 sm:text-lg">
                <p>
                  Odyssey began with a deceptively simple premise: what if technology could place you — fully, convincingly, consequentially — inside any world you could describe?
                </p>
                <p>
                  Not a game with predefined outcomes. Not a simulation with guardrails. A living, adaptive environment that responds to your choices with the depth and unpredictability of reality itself. A medieval court where your diplomacy has real political consequences. A deep-sea expedition where every decision reshapes the mission. A jazz club in 1940s Harlem where the music shifts with the room.
                </p>
              </div>
              <blockquote
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-xl font-medium italic backdrop-blur-md sm:text-2xl"
                style={{ color: "#8fd1cb" }}
              >
                &ldquo;The most powerful technology disappears. What remains is the experience.&rdquo;
              </blockquote>
              <div className="space-y-5 text-base leading-relaxed text-white/70 sm:text-lg">
                <p>
                  That conviction — that the technology should vanish behind the world it creates — became the founding principle of Odyssey. Every architectural decision, every model integration, every interface choice flows from it.
                </p>
              </div>
            </div>

            {/* The Thesis */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                The Engine
              </p>
              <h3
                className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Worlds That Think, Adapt, and Respond
              </h3>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/70 sm:text-base">
                <p>
                  At the core of Odyssey is an immersive reality engine capable of generating, maintaining, and evolving entire worlds in real time. It holds persistent memory of characters, environments, and consequences. It adapts narratives to your decisions without breaking coherence. It renders experiences that feel less like software and more like stepping through a threshold.
                </p>
                <p>
                  The engine is built on advances in large-scale language models, real-time state management, and adaptive narrative architecture — technologies that simply did not exist at this level of maturity until now. Odyssey is what becomes possible when you point that infrastructure at the oldest human desire: to live inside a story.
                </p>
              </div>
            </div>

            {/* Why It Matters */}
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                II. The Opportunity
              </p>
              <h2
                className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What Infinite Worlds Unlock
              </h2>
              <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                When you can step into any world with full consequence and fidelity, entirely new categories of value emerge — across entertainment, education, professional development, and human understanding.
              </p>
            </div>

            {/* Use Cases Grid */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Use Case 1 */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Dimension I
                </p>
                <h3
                  className="mt-3 text-lg font-semibold tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Experiential Understanding
                </h3>
                <p className="mt-1 text-xs italic text-white/40">Know It by Living It</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
                  <p>
                    Reading about leadership is one thing. Navigating a political crisis with real stakes, real advisors, and real consequences is another. Odyssey collapses the distance between concept and experience.
                  </p>
                  <p>
                    Step into a role, and you don&apos;t just learn what it requires — you feel the weight of it. The world becomes a mirror that reveals things a textbook never could.
                  </p>
                </div>
              </div>

              {/* Use Case 2 */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Dimension II
                </p>
                <h3
                  className="mt-3 text-lg font-semibold tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  High-Fidelity Preparation
                </h3>
                <p className="mt-1 text-xs italic text-white/40">Rehearsal at the Speed of Reality</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
                  <p>
                    Surgeons practice on simulations before they operate. Pilots train in cockpits that never leave the ground. Odyssey extends that principle to any domain — leadership, negotiation, crisis management, creative performance.
                  </p>
                  <p>
                    The reps you put in here build real intuition. Real composure. Real readiness — applicable the moment you step back into the world outside.
                  </p>
                </div>
              </div>

              {/* Use Case 3 */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Dimension III
                </p>
                <h3
                  className="mt-3 text-lg font-semibold tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Creative & Narrative Innovation
                </h3>
                <p className="mt-1 text-xs italic text-white/40">Stories You Don&apos;t Watch — You Inhabit</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
                  <p>
                    Odyssey represents a new medium. Not a movie. Not a game. Not a book. Something that borrows from all three but is constrained by none of them.
                  </p>
                  <p>
                    For creators, it&apos;s an entirely new canvas. For audiences, it&apos;s the experience they&apos;ve always wanted from fiction but could never quite reach — full immersion, full agency, full consequence.
                  </p>
                </div>
              </div>
            </div>

            {/* Homage — The Original Worlds */}
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                Where It Began
              </p>
              <h2
                className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                The First Worlds
              </h2>
              <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                Before the engine, before the architecture — there were two questions asked on a rock in Central Park that set everything in motion.
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* The King */}
                <div className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
                  <div className="absolute -right-6 -top-6 text-[8rem] leading-none text-white/[0.03] transition-all group-hover:text-white/[0.06]" style={{ fontFamily: "var(--font-heading)" }}>
                    &#9813;
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    World I
                  </p>
                  <h3
                    className="mt-3 text-xl font-semibold tracking-[-0.01em] sm:text-2xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    What Would It Feel Like to Be a King?
                  </h3>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60 sm:text-base">
                    <p>
                      Not a figurehead. Not a character in a game. A real king — burdened by the weight of a crown, surrounded by advisors whose loyalty you can never quite verify, responsible for thousands of lives shaped by every decision you make.
                    </p>
                    <p>
                      The loneliness at the top of the tower. The impossible calculus of mercy versus order. The moment you realize the throne doesn&apos;t grant wisdom — it demands it.
                    </p>
                    <p className="text-xs italic" style={{ color: "#8fd1cb" }}>
                      This was the first question. The one that cracked the door open.
                    </p>
                  </div>
                </div>

                {/* The Pirate */}
                <div className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
                  <div className="absolute -right-6 -top-6 text-[8rem] leading-none text-white/[0.03] transition-all group-hover:text-white/[0.06]" style={{ fontFamily: "var(--font-heading)" }}>
                    &#9875;
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    World II
                  </p>
                  <h3
                    className="mt-3 text-xl font-semibold tracking-[-0.01em] sm:text-2xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    What Would It Feel Like to Be a Pirate?
                  </h3>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60 sm:text-base">
                    <p>
                      Salt air. A crew that follows you only as long as you&apos;re worth following. A horizon that promises nothing and everything at once. The raw, ungoverned freedom of a life lived outside every structure the world tried to put you in.
                    </p>
                    <p>
                      The thrill of the chase. The code that only matters when you choose to honor it. The discovery that freedom without purpose is just drift — and that the sea has a way of teaching you the difference.
                    </p>
                    <p className="text-xs italic" style={{ color: "#8fd1cb" }}>
                      This was the second question. The one that proved the first wasn&apos;t a fluke.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm leading-relaxed text-white/50 sm:text-base">
                Two worlds. Two very different lives. But the same underlying revelation: the technology to make this real would change everything. Odyssey is the proof.
              </p>
            </div>

            {/* Founders */}
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  III. The Team
                </p>
                <h2
                  className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The Founders
                </h2>
                <p className="text-base text-white/60">
                  Two builders with the vision to see what&apos;s possible and the resolve to make it real.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Binny */}
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src="/founders-binny.jpg"
                      alt="Binny Plotkin, Co-founder of Odyssey"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                      Co-founder
                    </p>
                    <h3
                      className="text-xl font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Binny Plotkin
                    </h3>
                    <p className="text-sm leading-relaxed text-white/60">
                      Binny Plotkin is a builder and storyteller drawn to the intersection of technology, mythology, and the inner life. His work is rooted in the belief that within each person lives a vast inner infinity — and that the most powerful experiences are the ones that help us return to it. He approaches product development as a craft of meaning: technology, in his view, should disappear. What endures is the experience it leaves behind.
                    </p>
                  </div>
                </div>

                {/* Josh */}
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src="/founders-josh.jpg"
                      alt="Josh Sassoon, Co-founder of Odyssey"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                      Co-founder
                    </p>
                    <h3
                      className="text-xl font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Josh Sassoon
                    </h3>
                    <p className="text-sm leading-relaxed text-white/60">
                      Josh Sassoon is a builder with an uncommon capacity to hold vision and execution in the same hand — to think with genuine philosophical depth while remaining sharply focused on what it takes to bring something real into the world. He has a rare instinct for identifying the questions worth asking, and the conviction to pursue them before the path is clear. Odyssey reflects both of those qualities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Now */}
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                IV. The Moment
              </p>
              <h2
                className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Why Now
              </h2>
              <div className="space-y-5 text-base leading-relaxed text-white/70 sm:text-lg">
                <p>
                  For decades, the vision of truly immersive, adaptive worlds existed only in science fiction. The computational infrastructure, the language understanding, the real-time narrative coherence — none of it was technically feasible at scale.
                </p>
                <p>
                  That changed. Large language models capable of holding entire worlds in memory, generating coherent consequence and dialogue, and adapting to user choices in real time have reached a threshold of maturity that makes Odyssey not just possible — but inevitable.
                </p>
                <p>
                  The appetite for this kind of experience is ancient and universal. The technology is finally here. Odyssey exists at the precise intersection of the two — and the market it opens is as vast as the worlds it creates.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md sm:p-10">
              <p className="text-lg italic text-white/50">
                &ldquo;The only way to discover the limits of the possible is to venture past them into the impossible.&rdquo;
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/30">
                Arthur C. Clarke
              </p>
              <p className="mx-auto mt-5 max-w-md text-sm text-white/50">
                Odyssey is building the door. The worlds are waiting.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-7 py-3 text-sm font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-lg transition-all hover:scale-[1.03] hover:border-white/40 hover:bg-white/25"
                >
                  Explore Worlds
                  <span className="text-white/60">&rarr;</span>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-7 py-3 text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/15"
                >
                  Back to Home
                </Link>
              </div>
            </div>

          </article>
        </div>
      </section>
    </main>
  );
}
