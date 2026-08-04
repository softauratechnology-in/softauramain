"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { scene as sceneColors } from "@/styles/colors";

/**
 * The WebGL hero object.
 *
 * Never import this module directly from a section — go through
 * `<HeroCanvas>`, which decides whether WebGL should run at all and loads this
 * chunk lazily. Importing it eagerly pulls three.js (~150 kB gzipped) into the
 * initial bundle.
 *
 * Performance budget, and why each choice is here:
 *  - `dpr={[1, 1.5]}` — caps rendering at 1.5× even on 3× phone displays. The
 *    difference is invisible on a soft-edged abstract object and it is the single
 *    biggest cost saving available.
 *  - `<AdaptiveDpr>` — drops resolution further if the frame rate sags.
 *  - `frameloop` is controlled by the parent: `never` while offscreen, so a
 *    scrolled-past canvas costs nothing.
 *  - No `<Environment>` / HDRI — that is a network request and a cubemap render
 *    for lighting three lights can approximate.
 *  - `powerPreference: "high-performance"` with `antialias: false`; the distort
 *    material has no hard edges to alias, so MSAA is wasted fill rate.
 */

/**
 * Window-level pointer position, normalised to -1..1.
 *
 * R3F's own `state.pointer` is driven by events *on the canvas*, and this canvas
 * is `pointer-events: none` so that it never intercepts clicks on the hero CTAs
 * sitting above it. Tracking at the window instead keeps the CTAs clickable and
 * gives the scene pointer data across the whole viewport, not just its own box.
 *
 * Writes into a ref rather than state — this fires on every pointer move, and a
 * `setState` per move would re-render the React tree ~60 times a second for a
 * value only `useFrame` reads.
 */
function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return pointer;
}

/** Distorted core object. Slow rotation plus mouse-follow tilt. */
function CoreObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointer = useWindowPointer();

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    /* Constant drift, so the object is alive even with the pointer still.
       Delta-scaled, so speed is frame-rate independent. */
    mesh.rotation.y += delta * 0.12;
    mesh.rotation.x += delta * 0.04;

    /* Mouse parallax, damped toward the target rather than assigned — that is
       what makes it feel weighted instead of twitchy. Amplitude is deliberately
       small (was 0.22 rad): at full viewport width a larger figure meant any
       casual mouse movement swung the object, which read as the page reacting
       to the pointer far more than the visitor asked it to. */
    const targetX = pointer.current.y * 0.08;
    const targetZ = pointer.current.x * -0.08;
    mesh.rotation.x += (targetX - mesh.rotation.x) * 0.02;
    mesh.rotation.z += (targetZ - mesh.rotation.z) * 0.03;
  });

  return (
    <mesh ref={meshRef} castShadow={false} receiveShadow={false}>
      {/* Detail 4 is the lowest subdivision at which the distortion reads as
          smooth. Higher levels are wasted vertices at this screen size. */}
      <icosahedronGeometry args={[1.35, 4]} />
      <MeshDistortMaterial
        color={sceneColors.material}
        distort={0.32}
        speed={1.4}
        roughness={0.24}
        metalness={0.86}
        envMapIntensity={0.4}
      />
    </mesh>
  );
}

/** Wireframe shell around the core, counter-rotating for depth. */
function WireShell() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y -= delta * 0.07;
    meshRef.current.rotation.x -= delta * 0.03;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.1, 1]} />
      <meshBasicMaterial
        color={sceneColors.wireframe}
        wireframe
        transparent
        opacity={0.16}
      />
    </mesh>
  );
}

interface ParticleFieldProps {
  count: number;
}

/**
 * Deterministic PRNG (mulberry32).
 *
 * Used instead of `Math.random()` so the particle field is *identical* on every
 * render and on every visit. Two reasons that matters here: `Math.random()` inside
 * a `useMemo` is an impure call during render, and a seeded field means the hero
 * looks the same in screenshots and visual diffs instead of shuffling each load.
 */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Particle positions, distributed in a spherical shell.
 *
 * A shell rather than a filled sphere, so no particle lands inside the core object
 * where it would be occluded anyway — the same visual density for fewer vertices.
 */
function buildParticlePositions(count: number): Float32Array {
  const random = createRandom(0x5f3a71);
  const array = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const radius = 2.8 + random() * 2.6;
    const theta = random() * Math.PI * 2;
    /* `acos(2u - 1)` gives a uniform distribution over the sphere; using a raw
       uniform angle for phi would cluster particles at the poles. */
    const phi = Math.acos(2 * random() - 1);

    array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    array[i * 3 + 2] = radius * Math.cos(phi);
  }

  return array;
}

/**
 * Ambient particle field.
 *
 * Hand-rolled rather than using drei's `<Sparkles>`: this is one draw call with
 * a static buffer, and the whole field is animated by rotating the parent group
 * — no per-particle CPU work at all.
 */
function ParticleField({ count }: ParticleFieldProps) {
  const groupRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => buildParticlePositions(count), [count]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={groupRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={sceneColors.rimLight}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export interface HeroSceneProps {
  /**
   * `never` pauses rendering entirely — set by the parent when the hero scrolls
   * out of view. `demand` renders a single frame, used for reduced motion.
   */
  frameloop?: "always" | "never" | "demand";
  /** Reduced motion: no float, no drift, one static frame. */
  staticRender?: boolean;
  /** Particle count. Lowered on mid-tier devices by the parent. */
  particleCount?: number;
}

export default function HeroScene({
  frameloop = "always",
  staticRender = false,
  particleCount = 320,
}: HeroSceneProps) {
  return (
    <Canvas
      frameloop={staticRender ? "demand" : frameloop}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      }}
      /* The canvas is decorative — the headline carries the meaning. */
      aria-hidden
      style={{ pointerEvents: "none" }}
    >
      <AdaptiveDpr pixelated />

      {/* Three-point lighting, chosen over an HDRI to avoid the network cost. */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 5, 3]}
        intensity={2.4}
        color={sceneColors.keyLight}
      />
      <directionalLight
        position={[-5, -2, -4]}
        intensity={1.6}
        color={sceneColors.fillLight}
      />
      <pointLight position={[0, 0, 4]} intensity={3} color={sceneColors.rimLight} />

      {staticRender ? (
        <>
          <CoreObject />
          <WireShell />
        </>
      ) : (
        <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.7}>
          <CoreObject />
          <WireShell />
        </Float>
      )}

      <ParticleField count={particleCount} />
    </Canvas>
  );
}
