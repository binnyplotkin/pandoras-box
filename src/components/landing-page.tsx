"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { VisibleWorld } from "@/types/simulation";

type SessionEnvelope = {
  session: {
    id: string;
  };
};

type ShowcaseWorld = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  atmosphere: string;
  accent: string;
  image: string;
  available: boolean;
  sourceWorld?: VisibleWorld;
};

const showcaseMeta: Array<
  Omit<ShowcaseWorld, "sourceWorld"> & {
    sourceWorldId?: string;
  }
> = [
  {
    id: "king-world",
    sourceWorldId: "the-king",
    title: "King World",
    eyebrow: "Imperial command simulation",
    description:
      "Rule a kingdom under pressure where mercy, brutality, debt, and legitimacy all reshape the fate of the realm. Every decree alters political stability, loyalty, and the stories people tell about your crown.",
    atmosphere: "Torchlight, rain on stone, restless nobles, and history tightening around every word.",
    accent: "from-amber-200/55 via-white/16 to-cyan-200/35",
    image: "/worlds/king-world.svg",
    available: true,
  },
  {
    id: "pirate-world",
    title: "Pirate World",
    eyebrow: "High-seas survival simulation",
    description:
      "Command a ship through mutiny, storms, hunger, and plunder while loyalty shifts with every gamble. Survival depends on fear, charisma, and whether your crew believes your legend is worth following.",
    atmosphere: "Salt mist, lantern glass, muttered oaths, and the horizon hiding danger.",
    accent: "from-sky-200/50 via-white/14 to-teal-200/35",
    image: "/worlds/pirate-world.svg",
    available: false,
  },
  {
    id: "ceo-world",
    title: "CEO World",
    eyebrow: "Executive pressure simulation",
    description:
      "Lead a multi-billion-dollar company through layoffs, product failures, investor panic, and internal power struggles. Every decision tests your appetite for risk and the human cost of winning.",
    atmosphere: "Cold towers, live market signals, private briefings, and crises that never sleep.",
    accent: "from-blue-200/50 via-white/14 to-indigo-200/35",
    image: "/worlds/ceo-world.svg",
    available: false,
  },
  {
    id: "war-general-world",
    title: "War General World",
    eyebrow: "Command-in-war simulation",
    description:
      "Carry the burden of strategy while soldiers, politicians, and civilians absorb the consequences. Tactical success is never clean, and each victory may hollow out what you hoped to protect.",
    atmosphere: "Command maps, radio static, smoke, and the quiet before irreversible orders.",
    accent: "from-stone-200/45 via-white/12 to-rose-200/35",
    image: "/worlds/war-general-world.svg",
    available: false,
  },
  {
    id: "explorer-world",
    title: "Explorer World",
    eyebrow: "Discovery and survival simulation",
    description:
      "Lead an expedition into unknown terrain where wonder and catastrophe arrive together. Scarcity, weather, and fear inside the group can become as dangerous as anything outside it.",
    atmosphere: "Frozen dawns, wet journals, uncertain maps, and a frontier that does not care about you.",
    accent: "from-emerald-200/50 via-white/12 to-cyan-100/30",
    image: "/worlds/explorer-world.svg",
    available: false,
  },
];

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  return ((index - activeIndex + total + 2) % total) - 2;
}

function getCarouselPose(offset: number) {
  if (offset === 0) {
    return { x: 0, y: -4, scale: 1, opacity: 1, blur: "0px", zIndex: 30 };
  }

  if (Math.abs(offset) === 1) {
    return {
      x: offset * 24,
      y: 12,
      scale: 0.8,
      opacity: 0.64,
      blur: "1.5px",
      zIndex: 20,
    };
  }

  return {
    x: offset * 33,
    y: 26,
    scale: 0.6,
    opacity: 0.28,
    blur: "4px",
    zIndex: 10,
  };
}

export function LandingPage({ worlds }: { worlds: VisibleWorld[] }) {
  const useWebmBackground = process.env.NEXT_PUBLIC_LANDING_HERO_USE_WEBM === "true";
  const heroVideoMp4 =
    process.env.NEXT_PUBLIC_LANDING_HERO_VIDEO_MP4 ??
    "/landing_page_video_optimized.mp4";
  const heroVideoWebm =
    process.env.NEXT_PUBLIC_LANDING_HERO_VIDEO_WEBM ??
    "/landing_page_video_optimized.webm";

  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dragStartRef = useRef<number | null>(null);
  const dragLastRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const showcaseWorlds = showcaseMeta.map((item) => ({
    ...item,
    sourceWorld: item.sourceWorldId
      ? worlds.find((world) => world.id === item.sourceWorldId)
      : undefined,
  }));

  const activeWorld = showcaseWorlds[activeIndex] ?? showcaseWorlds[0];

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    void video.play().catch(() => undefined);
    let lastTime = -1;
    let stalledTicks = 0;

    const ensureLooping = window.setInterval(() => {
      if (!videoRef.current) {
        return;
      }

      const currentVideo = videoRef.current;
      const duration = Number.isFinite(currentVideo.duration) ? currentVideo.duration : 0;
      const nearEnd = duration > 0 && currentVideo.currentTime >= Math.max(duration - 0.12, 0);
      const timeAdvanced = Math.abs(currentVideo.currentTime - lastTime) > 0.01;

      if (timeAdvanced) {
        stalledTicks = 0;
      } else {
        stalledTicks += 1;
      }
      lastTime = currentVideo.currentTime;

      if (currentVideo.ended || nearEnd) {
        currentVideo.currentTime = 0;
        void currentVideo.play().catch(() => undefined);
        stalledTicks = 0;
        return;
      }

      if (stalledTicks >= 3) {
        // Some browsers stall the decoded frame without marking the element as ended.
        if (duration > 0 && currentVideo.currentTime > duration * 0.85) {
          currentVideo.currentTime = 0;
        }
        void currentVideo.play().catch(() => undefined);
        stalledTicks = 0;
        return;
      }

      if (currentVideo.paused) {
        void currentVideo.play().catch(() => undefined);
      }
    }, 1500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && videoRef.current) {
        void videoRef.current.play().catch(() => undefined);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(ensureLooping);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  function moveCarousel(direction: "next" | "previous") {
    setActiveIndex((current) =>
      direction === "next"
        ? (current + 1) % showcaseWorlds.length
        : (current - 1 + showcaseWorlds.length) % showcaseWorlds.length,
    );
    setError(null);
  }

  function getDragProgress(delta: number) {
    const width = containerRef.current?.clientWidth ?? 1;
    return Math.max(-1.2, Math.min(1.2, delta / width)) * 100;
  }

  function handlePointerStart(clientX: number) {
    dragStartRef.current = clientX;
    dragLastRef.current = clientX;
    setDragDelta(0);
    setIsDragging(true);
  }

  function handlePointerMove(clientX: number) {
    if (dragStartRef.current === null) {
      return;
    }

    dragLastRef.current = clientX;
    setDragDelta(clientX - dragStartRef.current);
  }

  function handlePointerEnd(clientX?: number) {
    const origin = dragStartRef.current;

    if (origin === null) {
      return;
    }

    const resolved = clientX ?? dragLastRef.current ?? origin;
    const delta = resolved - origin;
    const threshold = (containerRef.current?.clientWidth ?? 0) * 0.12;

    if (delta <= -threshold) {
      moveCarousel("next");
    } else if (delta >= threshold) {
      moveCarousel("previous");
    }

    dragStartRef.current = null;
    dragLastRef.current = null;
    setDragDelta(0);
    setIsDragging(false);
  }

  async function beginSession() {
    const playableWorld = activeWorld.sourceWorld;

    if (!activeWorld.available || !playableWorld) {
      setError(
        `${activeWorld.title} is staged for the slider, but its simulation pack is not implemented yet.`,
      );
      return;
    }

    const role = playableWorld.roles[0];

    if (!role) {
      setError("Selected world has no playable role.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worldId: playableWorld.id, roleId: role.id }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error ?? "Failed to start session.");
        return;
      }

      const payload = (await response.json()) as SessionEnvelope;
      router.push(`/simulation/${payload.session.id}`);
    });
  }

  const dragProgress = getDragProgress(dragDelta);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
        onEnded={() => {
          const video = videoRef.current;
          if (!video) return;
          video.currentTime = 0;
          void video.play().catch(() => undefined);
        }}
        onCanPlay={() => {
          const video = videoRef.current;
          if (!video || !video.paused) return;
          void video.play().catch(() => undefined);
        }}
      >
        <source src={heroVideoMp4} type="video/mp4" />
        {useWebmBackground ? <source src={heroVideoWebm} type="video/webm" /> : null}
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,16,0.28),rgba(2,9,16,0.08)_26%,rgba(4,11,18,0.34)_58%,rgba(1,6,10,0.82))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_54%,rgba(170,255,244,0.2),transparent_18%),radial-gradient(circle_at_50%_56%,rgba(255,255,255,0.08),transparent_32%)]" />
      <div className="absolute inset-x-0 top-[40%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-8 text-center md:px-6 lg:px-8">
        <div className="pt-6 md:pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.38em] text-white/72">
            Pandora&apos;s Box
          </p>
        </div>

        <div className="mt-10 md:mt-14">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 rounded-full border border-white/12 bg-white/6 px-3 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(157,244,235,0.9)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/72 md:text-[11px]">
                Select a reality
              </p>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 md:gap-5">
              <button
                type="button"
                onClick={() => moveCarousel("previous")}
                className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/8 text-white/72 backdrop-blur-xl transition hover:bg-white/16 md:inline-flex"
                aria-label="Previous world"
              >
                ←
              </button>

              <div
                ref={containerRef}
                className={`relative h-[18rem] w-full max-w-6xl touch-pan-y overflow-hidden md:h-[22rem] ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  handlePointerStart(event.clientX);
                }}
                onPointerMove={(event) => handlePointerMove(event.clientX)}
                onPointerUp={(event) => handlePointerEnd(event.clientX)}
                onPointerCancel={() => handlePointerEnd()}
              >
                {showcaseWorlds.map((world, index) => {
                  const offset = getWrappedOffset(index, activeIndex, showcaseWorlds.length);
                  const pose = getCarouselPose(offset);
                  const isActive = offset === 0;

                  return (
                    <button
                      key={world.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        if (isDragging) {
                          return;
                        }
                        setActiveIndex(index);
                        setError(null);
                      }}
                      className="absolute left-1/2 top-1/2 flex aspect-square w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl hover:border-white/38 md:w-40"
                      style={{
                        left: `calc(50% + ${pose.x + dragProgress}%)`,
                        top: `calc(50% + ${pose.y}%)`,
                        transform: `translate(-50%, -50%) scale(${pose.scale})`,
                        opacity: pose.opacity,
                        filter: `blur(${pose.blur})`,
                        zIndex: pose.zIndex,
                        boxShadow: isActive
                          ? "0 0 0 1px rgba(255,255,255,0.18) inset, 0 0 65px rgba(104, 241, 228, 0.28), 0 24px 80px rgba(0,0,0,0.28)"
                          : "0 0 0 1px rgba(255,255,255,0.08) inset, 0 14px 44px rgba(0,0,0,0.18)",
                        transition: isDragging
                          ? "opacity 220ms ease, filter 220ms ease, box-shadow 220ms ease"
                          : "left 520ms ease, top 520ms ease, transform 520ms ease, opacity 420ms ease, filter 420ms ease, box-shadow 420ms ease",
                      }}
                    >
                      <span className={`absolute inset-[7%] overflow-hidden rounded-full bg-gradient-to-br ${world.accent}`}>
                        <Image
                          src={world.image}
                          alt={world.title}
                          fill
                          sizes="160px"
                          className="object-cover opacity-84 mix-blend-screen"
                        />
                      </span>
                      <span className="absolute inset-[8%] rounded-full border border-white/16" />
                      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.48),transparent_34%)]" />
                      <span className="absolute inset-[20%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_68%)]" />
                      <span className="relative z-10 max-w-[72%] text-center font-mono text-[10px] uppercase tracking-[0.24em] text-white/92 md:text-xs">
                        {world.title.replace(" World", "")}
                      </span>
                      {!world.available ? (
                        <span className="absolute bottom-3 rounded-full border border-white/14 bg-black/14 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.24em] text-white/64 md:bottom-4 md:text-[9px]">
                          Incoming
                        </span>
                      ) : null}
                      <span className="absolute -bottom-8 h-10 w-24 rounded-full bg-cyan-100/18 blur-2xl md:w-36" />
                    </button>
                  );
                })}

                <div className="pointer-events-none absolute inset-x-[18%] bottom-7 h-10 rounded-full bg-white/8 blur-3xl md:inset-x-[30%]" />
              </div>

              <button
                type="button"
                onClick={() => moveCarousel("next")}
                className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/8 text-white/72 backdrop-blur-xl transition hover:bg-white/16 md:inline-flex"
                aria-label="Next world"
              >
                →
              </button>
            </div>

            <div className="mx-auto mt-4 max-w-4xl rounded-[2rem] border border-white/12 bg-white/8 px-5 py-6 shadow-[0_22px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:mt-2 md:grid md:grid-cols-[0.88fr_1.12fr] md:items-center md:gap-8 md:px-8">
              <div className="relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-[1.7rem] border border-white/14 bg-black/12 shadow-[0_18px_54px_rgba(0,0,0,0.22)]">
                <Image
                  src={activeWorld.image}
                  alt={activeWorld.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${activeWorld.accent} opacity-35`} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.48))]" />
              </div>

              <div className="mt-5 md:mt-0 md:text-left">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">
                  {activeWorld.eyebrow}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                  {activeWorld.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/82 md:text-base">
                  {activeWorld.description}
                </p>
                <p className="mt-3 text-sm italic tracking-[-0.01em] text-white/52">
                  {activeWorld.atmosphere}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12 md:pt-16">
          <h1 className="mx-auto max-w-4xl text-4xl leading-tight font-semibold text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.42)] md:text-6xl">
            Enter realities that remember what you choose.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
            Pandora&apos;s Box is a cinematic simulation engine for alternate lives. Select a world,
            step into its pressure, and let the system answer with consequence, emotion, and memory.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void beginSession()}
              disabled={isPending}
              className="inline-flex min-w-[16rem] items-center justify-center gap-3 rounded-[1.2rem] border border-white/22 bg-white/12 px-8 py-4 text-base font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending
                ? "Opening reality..."
                : activeWorld.available
                  ? `Enter ${activeWorld.title}`
                  : `Focus ${activeWorld.title}`}
              <span aria-hidden="true">→</span>
            </button>

            <div className="rounded-[1.2rem] border border-white/12 bg-black/12 px-5 py-4 text-left backdrop-blur-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/58">
                Current status
              </p>
              <p className="mt-2 text-sm text-white/78">
                {activeWorld.available
                  ? "Playable now with session routing and world-state simulation."
                  : "Featured in the selector now. Simulation pack arrives in a later release."}
              </p>
            </div>
          </div>

          <p className="mt-8 text-lg italic tracking-[-0.01em] text-white/56">
            &ldquo;What is it like to become someone else and have the world answer honestly?&rdquo;
          </p>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </div>
      </section>
    </main>
  );
}
