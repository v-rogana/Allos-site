"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 900;

  const base = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 16;
      p[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return p;
  }, []);

  const phi = useMemo(() => {
    const p = new Float32Array(count);
    for (let i = 0; i < count; i++) p[i] = Math.random() * Math.PI * 2;
    return p;
  }, []);

  const pos = useMemo(() => new Float32Array(base), [base]);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.y = t * 0.018;
    const arr = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++)
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.22 + phi[i]) * 0.06;
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={pos} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#1BBAB0"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.28}
      />
    </Points>
  );
}

function Rings() {
  const r1 = useRef<THREE.Mesh>(null!);
  const r2 = useRef<THREE.Mesh>(null!);
  const r3 = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (r1.current) r1.current.rotation.x = t * 0.05;
    if (r2.current) r2.current.rotation.y = t * 0.04;
    if (r3.current) {
      r3.current.rotation.z = t * 0.07;
      r3.current.rotation.x = t * 0.025;
    }
  });

  return (
    <>
      {/* outer ring — teal suave */}
      <mesh ref={r1}>
        <torusGeometry args={[4.2, 0.009, 8, 120]} />
        <meshBasicMaterial
          color="#1BBAB0"
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>
      {/* mid ring — teal escuro */}
      <mesh ref={r2}>
        <torusGeometry args={[2.6, 0.008, 8, 80]} />
        <meshBasicMaterial
          color="#0C6E6A"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
      {/* inner ring — terracota sutil */}
      <mesh ref={r3}>
        <torusGeometry args={[1.5, 0.006, 8, 60]} />
        <meshBasicMaterial
          color="#C84B31"
          wireframe
          transparent
          opacity={0.055}
        />
      </mesh>
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        maskImage:
          "linear-gradient(to bottom,black 50%,transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom,black 50%,transparent 100%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        style={{ background: "transparent" }}
      >
        <Particles />
        <Rings />
      </Canvas>
    </div>
  );
}
