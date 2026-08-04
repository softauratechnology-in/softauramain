"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useAllowsMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * Gatekeeper for the 3D hero.
 *
 * Three.js plus R3F plus drei is the heaviest thing on this site by an order of
 * magnitude. This component decides whether that cost is worth paying, and only
 * then downloads it:
 *
 *  1. `ssr: false` — WebGL cannot run during server render, and prerendering the
 *     canvas would only produce an empty element plus hydration cost.
 *  2. Capability check — devices below the thresholds below get the CSS fallback
 *     and never download the 3D chunk at all.
 *  3. `IntersectionObserver` — the chunk is only requested once the hero is
 *     actually near the viewport, and rendering pauses when it leaves.
 *
 * The CSS fallback is not a blank space: it is an animated gradient orb that
 * matches the scene's palette, so the hero composition holds either way.
 */

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  /* The fallback orb also covers the chunk-download window, so there is no
     layout shift or flash of empty space between decision and first frame. */
  loading: () => <FallbackOrb />,
});

/** Minimum logical CPU cores before 3D is considered worthwhile. */
const MIN_CORES = 4;
/** Minimum device memory in GB, where the browser reports it. */
const MIN_MEMORY_GB = 4;
/** Below this viewport width the canvas is too small to justify its cost. */
const MIN_VIEWPORT_WIDTH = 768;

/**
 * Whether this device should run the 3D scene.
 *
 * Runs once on mount rather than on resize: swapping between WebGL and the
 * fallback mid-session would be far more jarring than being slightly wrong about
 * a rotated tablet.
 */
function shouldRender3D(): boolean {
  if (typeof window === "undefined") return false;

  /* A device that reports Save-Data has explicitly asked for less. Respect it. */
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    }
  ).connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && /2g|slow-2g|3g/.test(connection.effectiveType)) {
    return false;
  }

  if (window.innerWidth < MIN_VIEWPORT_WIDTH) return false;

  const cores = navigator.hardwareConcurrency ?? MIN_CORES;
  if (cores < MIN_CORES) return false;

  /* `deviceMemory` is Chromium-only; absent means "unknown", not "low". */
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory < MIN_MEMORY_GB) return false;

  /* Finally, confirm a WebGL context is actually obtainable — some environments
     advertise the API and then fail to create a context. */
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl");
    if (!gl) return false;
    /* Release the probe context immediately — contexts are a limited resource. */
    (gl.getExtension("WEBGL_lose_context") as { loseContext(): void } | null)?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Memoised result of the probe.
 *
 * `shouldRender3D` allocates a canvas and a WebGL context, so it must run exactly
 * once per page load. Caching at module scope also makes `getCapabilitySnapshot`
 * cheap and referentially stable, which is what `useSyncExternalStore` requires.
 */
let cachedCapability: boolean | null = null;

function getCapabilitySnapshot(): boolean {
  if (cachedCapability === null) {
    cachedCapability = shouldRender3D();
  }
  return cachedCapability;
}

/**
 * Device capability is a one-shot read, not a subscription — there is no event to
 * listen for, so `subscribe` is a no-op that never notifies.
 */
function subscribeToCapability(): () => void {
  return () => {};
}

/** Server snapshot: never claim WebGL during SSR. */
function getServerCapabilitySnapshot(): boolean {
  return false;
}

/**
 * Pure-CSS stand-in for the 3D object.
 *
 * Used for reduced motion, low-end devices, no WebGL, and as the loading state.
 * Layered radial gradients plus a conic sheen — no images, no JS.
 */
function FallbackOrb({ animate = true }: { animate?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center">
      <div className="relative h-[min(70vw,26rem)] w-[min(70vw,26rem)]">
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-90 blur-2xl",
            animate && "animate-[float_6s_ease-in-out_infinite]",
          )}
          style={{
            background:
              "radial-gradient(circle at 35% 30%, var(--brand-400) 0%, var(--secondary-500) 45%, transparent 72%)",
          }}
        />
        <div
          className="absolute inset-[12%] rounded-full opacity-70 blur-xl"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, var(--accent-400) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-[26%] rounded-full ring-hairline" />
        <div className="absolute inset-[38%] rounded-full ring-hairline-soft" />
      </div>
    </div>
  );
}

export interface HeroCanvasProps {
  className?: string;
}

export function HeroCanvas({ className }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const allowsMotion = useAllowsMotion();

  /**
   * Device capability, read through an external store rather than an effect.
   *
   * `false` during SSR and on the hydration pass, then the real value — so the
   * server and first client render agree and there is no hydration mismatch.
   */
  const capable = useSyncExternalStore(
    subscribeToCapability,
    getCapabilitySnapshot,
    getServerCapabilitySnapshot,
  );

  const [inView, setInView] = useState(false);
  /**
   * Latches true the first time the hero is near the viewport.
   *
   * The scene mounts on this, not on `inView`: unmounting on scroll-out would
   * tear down and rebuild the WebGL context, its shaders and its buffers on every
   * pass, which is far more expensive than keeping a paused canvas alive.
   */
  const [hasApproached, setHasApproached] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasApproached(true);
      },
      /* Start loading slightly before the hero is visible so the first frame is
         ready by the time it matters. */
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const render3D = capable && hasApproached;

  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      {render3D ? (
        <HeroScene
          /* Pausing the loop while offscreen is the difference between a hero
             that costs GPU time forever and one that costs it while visible. */
          frameloop={inView ? "always" : "never"}
          staticRender={!allowsMotion}
          particleCount={allowsMotion ? 320 : 0}
        />
      ) : (
        <FallbackOrb animate={allowsMotion} />
      )}
    </div>
  );
}
