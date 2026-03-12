import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Odyssey",
  description:
    "How two guys on a rock in Central Park decided they wanted to build a door into every world imaginable — and why it matters.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-mono)" }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/about-hero.jpg"
            alt="Two young visionaries sitting on a rock in Central Park, imagining infinite worlds — depicted as an 1820s Romantic oil painting"
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
              Origin Story
            </p>
            <h1
              className="text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span style={{ color: "#8fd1cb" }}>Two Kings.</span>
              <br />
              One Rock.
              <br />
              Infinite Worlds.
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-white/65 lg:text-base">
              How a single question asked in Central Park became a door into
              every world you&apos;ve ever imagined — and a few you haven&apos;t.
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
                I. The Question
              </p>
              <h2
                className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                It Started on a Rock
              </h2>
              <div className="space-y-5 text-base leading-relaxed text-white/70 sm:text-lg">
                <p>
                  Somewhere in Central Park, on an unremarkable afternoon that turned out to be remarkably important, <strong className="text-white/90">Binny Plotkin</strong> and <strong className="text-white/90">Josh Sassoon</strong> were sitting on a boulder — the way serious people sit when they&apos;re trying to think about something bigger than themselves.
                </p>
                <p>
                  The conversation had that particular quality where the words start saying themselves, and you&apos;re really just listening. They talked about identity. About imagination. About the strange human ache of wanting to know what it would feel like to be someone entirely different — not to escape your life, but to understand it more deeply.
                </p>
              </div>
              <blockquote
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-xl font-medium italic backdrop-blur-md sm:text-2xl"
                style={{ color: "#8fd1cb" }}
              >
                &ldquo;What would it actually <em>feel like</em> to be a king?&rdquo;
              </blockquote>
              <div className="space-y-5 text-base leading-relaxed text-white/70 sm:text-lg">
                <p>
                  Not a metaphorical king. Not a chess piece. A real one — with weight and responsibility, with subjects who need things from you and advisors who may or may not be plotting something. The texture of a different life, fully inhabited.
                </p>
                <p>
                  That question cracked something open. And Odyssey was born in the space between the asking and the answer.
                </p>
              </div>
            </div>

            {/* The Thesis */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                The Premise
              </p>
              <h3
                className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What If You Could Step Into Any World?
              </h3>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/70 sm:text-base">
                <p>
                  Every person carries within them a vast inner universe — and a quiet, persistent curiosity about what it would feel like to live inside someone else&apos;s. Fiction gets you partway there. Method acting gets you closer. But nothing quite puts you <em>inside</em> an experience the way a living, responsive, adaptive world can.
                </p>
                <p>
                  Odyssey is an immersive reality engine. You step in. You choose a world. You inhabit a role — medieval king, deep-sea explorer, jazz musician in 1940s Harlem, a space captain navigating the politics of three civilizations. And then you <em>live it</em>, with consequence, surprise, and the full weight of a world that responds to you.
                </p>
              </div>
            </div>

            {/* Why It Matters */}
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                II. Why It Matters
              </p>
              <h2
                className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Three Doors. One Box.
              </h2>
              <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                Odyssey isn&apos;t just entertainment. It&apos;s a tool for the examined life — one that can unlock different things in different people.
              </p>
            </div>

            {/* Use Cases Grid */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Use Case 1 */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Use Case I
                </p>
                <h3
                  className="mt-3 text-lg font-semibold tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The Big Effect
                </h3>
                <p className="mt-1 text-xs italic text-white/40">Be Careful What You Wish For</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
                  <p>
                    In the film <em>Big</em>, a twelve-year-old boy wishes to be big — and wakes up to discover that the life he wanted isn&apos;t quite what he imagined.
                  </p>
                  <p>
                    Step into the role of a king, and you might discover the loneliness at the top of the tower. The world you step into isn&apos;t an escape. It&apos;s a mirror.
                  </p>
                </div>
              </div>

              {/* Use Case 2 */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Use Case II
                </p>
                <h3
                  className="mt-3 text-lg font-semibold tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The Training Ground
                </h3>
                <p className="mt-1 text-xs italic text-white/40">Practice Makes Presence</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
                  <p>
                    Athletes run the play in their minds before they run it on the field. Performers live the character before the curtain rises. Repetition builds presence.
                  </p>
                  <p>
                    The reps you put in here don&apos;t disappear when you close the session. They live in your body. Your intuition. Your calm.
                  </p>
                </div>
              </div>

              {/* Use Case 3 */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Use Case III
                </p>
                <h3
                  className="mt-3 text-lg font-semibold tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The Inner Journey
                </h3>
                <p className="mt-1 text-xs italic text-white/40">Navigating Your Own Universe</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
                  <p>
                    Immersive experience, when crafted with intention, becomes a vehicle for inner work. The metaphor gives you distance. The distance gives you clarity.
                  </p>
                  <p>
                    Joseph Campbell called it the Hero&apos;s Journey: a departure from the known, a descent into the unknown, and a return with something you couldn&apos;t have found without leaving.
                  </p>
                </div>
              </div>
            </div>

            {/* Founders */}
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  III. The People
                </p>
                <h2
                  className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The Founders
                </h2>
                <p className="text-base text-white/60">
                  Two builders who took the question seriously enough to do something about it.
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
                  The technology to do this well didn&apos;t exist until recently. Language models that can hold an entire world in memory, generate coherent consequence and dialogue, adapt to your choices in real time — all of that became possible in a window that spans roughly the last two years.
                </p>
                <p>
                  The hunger for it is ancient. The tool is new. And we are standing at the exact moment where the two have finally met.
                </p>
                <p>
                  The rock in Central Park was always there. It just took a while for the rest of the world to catch up to the conversation that happened on it.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md sm:p-10">
              <p className="text-lg italic text-white/50">
                &ldquo;The privilege of a lifetime is being who you are.&rdquo;
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/30">
                Joseph Campbell
              </p>
              <p className="mx-auto mt-5 max-w-md text-sm text-white/50">
                And sometimes — the quickest path back to yourself is the one that leads somewhere else first.
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
