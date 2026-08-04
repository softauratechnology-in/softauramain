"use client";

import { useEffect } from "react";

/**
 * Freezes page scroll while `locked` is true — used by the mobile nav sheet.
 *
 * Compensates for the scrollbar's width so locking does not shift the layout,
 * and restores the previous inline styles on unlock rather than clearing them,
 * so nested locks (nav open over a modal) unwind correctly.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [locked]);
}
