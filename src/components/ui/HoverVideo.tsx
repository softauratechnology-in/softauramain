"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface HoverVideoProps {
  /**
   * Path to the clip, e.g. `/case-studies/school-erp.mp4`. When omitted the
   * children render untouched, so callers never need to branch.
   */
  src?: string;
  /**
   * The still that shows when the clip is not playing — normally the card's
   * `next/image`. It stays mounted underneath, so the layout never shifts and
   * the video is a pure enhancement.
   */
  children: React.ReactNode;
  /**
   * Still shown by the `<video>` itself while the first frames decode. Pass the
   * same artwork as `children` renders — usually the card's `image` — so the
   * crossfade lands on an identical frame instead of a flash of black.
   */
  poster?: string;
  /** Video type attribute. Only override for non-MP4 sources. */
  type?: string;
  className?: string;
}

/**
 * Plays a short muted clip while the user hovers (or keyboard-focuses) the
 * media area, and fades back to the still on leave.
 *
 * Efficiency: nothing is fetched until the first hover — the `<video>` element
 * is only mounted at that point, and `preload="none"` keeps even that request
 * to the first hover's `play()`. Users who never hover pay nothing.
 *
 * Accessibility: `prefers-reduced-motion` is respected (the clip is never
 * started), the element is focusable so keyboard users get the same preview,
 * and the video is decorative — meaning lives in the still's alt text.
 */
export function HoverVideo({
  src,
  children,
  poster,
  type = "video/mp4",
  className,
}: HoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  /* Mounts the <video> on first interaction and keeps it mounted afterwards,
     so a second hover resumes instantly instead of re-fetching. */
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const start = useCallback(() => {
    if (!src) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setLoaded(true);
    setPlaying(true);
    /* On the very first hover the element does not exist yet; the `autoPlay`
       attribute covers that mount. Afterwards we drive it explicitly. */
    videoRef.current?.play().catch(() => {
      /* Autoplay can still be refused (e.g. low-power mode) — keep the still. */
      setPlaying(false);
    });
  }, [src]);

  const stop = useCallback(() => {
    setPlaying(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }, []);

  /* No clip for this item — stay out of the way entirely: no wrapper element,
     no tab stop, no listeners. */
  if (!src) return <>{children}</>;

  return (
    <div
      className={cn("relative h-full w-full", className)}
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={stop}
      tabIndex={0}
    >
      {children}
      {loaded && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          /* `type` is only meaningful on <source>; keep it as a hint for
             anything scraping the markup. */
          data-type={type}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden
          tabIndex={-1}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out-expo",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
