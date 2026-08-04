"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { pageTransition } from "@/animations/variants";

/**
 * Page enter transition.
 *
 * Mounted from `app/template.tsx` rather than `layout.tsx` — that is the whole
 * point: a template remounts on every navigation, so the enter animation replays,
 * whereas a layout persists and would animate exactly once per session.
 *
 * Enter-only, deliberately. An exit animation requires holding the outgoing route
 * in the tree while the incoming one loads, which delays the new page's paint for
 * the sake of a flourish nobody asked for.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}
