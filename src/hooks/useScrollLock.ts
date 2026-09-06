"use client";

import { useEffect } from "react";

/**
 * Freezes page scroll while `locked` is true — used by the mobile nav sheet.
 *
 * `overflow: hidden` on the body is the conventional lock and it is **not
 * enough on iOS Safari**, which ignores it for the visual viewport: the page
 * behind the sheet still rubber-bands, dragging body copy past the translucent
 * chrome. The reliable cross-browser lock is to take the body out of flow at a
 * negative offset equal to the current scroll, then put the scroll back on
 * release. `overflow: hidden` stays as well, for the desktop case where it is
 * sufficient and cheaper.
 *
 * Compensates for the scrollbar's width so locking does not shift the layout,
 * and restores the previous inline styles on unlock rather than clearing them,
 * so nested locks (nav open over a modal) unwind correctly.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    /* Pinning the body is what actually holds iOS. `width` is required because
       taking the element out of flow collapses it to its content width. */
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;

      /* `html` carries `scroll-behavior: smooth`, so restoring the offset would
         otherwise animate the page back — visible as a lurch on every close. */
      window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
    };
  }, [locked]);
}
