"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Abstract system diagram — decorative.
 *
 * Deliberately **not** a mock product UI. The obvious way to fill space on a
 * software agency's site is a fake dashboard with invented charts and plausible
 * numbers, and that is a claim: placed anywhere near a case study it reads as a
 * screenshot of the client's actual system, and the numbers on it read as their
 * actual figures. Same problem as an invented review, in picture form.
 *
 * So this is geometry. Nodes, links and a couple of bare panels, with no labels,
 * no values and nothing resembling a chart. It carries the *idea* of a connected
 * system without asserting anything about one.
 *
 * `aria-hidden` throughout, and every animated property is `transform` or
 * `opacity`. Looping animation is dropped automatically under reduced motion by
 * `MotionProvider`'s global `reducedMotion: "user"`.
 */

/** Nodes on a 200×140 viewBox. `r` doubles as the visual weight of the node. */
const NODES = [
  { id: "hub", x: 100, y: 70, r: 9 },
  { id: "a", x: 34, y: 32, r: 5.5 },
  { id: "b", x: 168, y: 34, r: 5.5 },
  { id: "c", x: 26, y: 106, r: 5 },
  { id: "d", x: 170, y: 108, r: 5 },
  { id: "e", x: 100, y: 16, r: 4 },
  { id: "f", x: 100, y: 126, r: 4 },
];

const LINKS = ["a", "b", "c", "d", "e", "f"].map((id) => ({
  from: NODES[0],
  to: NODES.find((n) => n.id === id)!,
}));

export interface SystemDiagramProps {
  className?: string;
}

export function SystemDiagram({ className }: SystemDiagramProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none relative select-none", className)}
    >
      <svg
        viewBox="0 0 200 140"
        fill="none"
        className="h-auto w-full overflow-visible"
      >
        {LINKS.map((link, index) => (
          <line
            key={index}
            x1={link.from.x}
            y1={link.from.y}
            x2={link.to.x}
            y2={link.to.y}
            stroke="var(--border-strong)"
            strokeWidth="0.75"
          />
        ))}

        {/* A pulse travelling each spoke — the only thing that reads as
            "a system doing something" without describing what. */}
        {LINKS.map((link, index) => (
          <motion.circle
            key={`pulse-${index}`}
            r="1.6"
            fill="var(--brand-500)"
            initial={false}
            animate={{
              cx: [link.from.x, link.to.x, link.from.x],
              cy: [link.from.y, link.to.y, link.from.y],
              opacity: [0, 0.85, 0],
            }}
            transition={{
              duration: 5 + index * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.45,
            }}
          />
        ))}

        {NODES.map((node, index) => (
          <motion.g
            key={node.id}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{
              duration: 4 + index * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="var(--background)"
              stroke={index === 0 ? "var(--brand-500)" : "var(--border-strong)"}
              strokeWidth={index === 0 ? 1.4 : 0.9}
            />
            {index === 0 ? (
              <circle cx={node.x} cy={node.y} r="3" fill="var(--brand-500)" />
            ) : null}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
