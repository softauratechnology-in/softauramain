"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP plugins.
 *
 * Registering in every component works but runs the guard repeatedly and makes
 * it easy to forget a plugin. Import `gsap`, `ScrollTrigger` and `useGSAP` from
 * here instead of from the packages directly.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };
