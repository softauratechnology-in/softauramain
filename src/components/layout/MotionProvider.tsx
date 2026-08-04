"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { motion as motionTokens } from "@/styles/theme";

/**
 * Global Framer Motion configuration.
 *
 * `reducedMotion="user"` is the important line: it makes Framer drop transform
 * and layout animations for visitors who have asked for reduced motion, keeping
 * only opacity. That means individual variants in `animations/variants.ts` do not
 * each need to branch on the preference — it is handled once, here.
 *
 * The default transition is set so any `animate` prop used without an explicit
 * transition still lands on the house curve rather than Framer's spring default.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: motionTokens.duration.base,
        ease: motionTokens.ease.outArray,
      }}
    >
      {children}
    </MotionConfig>
  );
}
