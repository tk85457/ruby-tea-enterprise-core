'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Vector3, CatmullRomCurve3, TubeGeometry, DoubleSide } from 'three';
import { Float, Sparkles } from '@react-three/drei';

function LeafModel() {
  const meshRef = useRef<Mesh>(null);

  // Create a custom curved leaf shape using a simple geometry approach
  // In a real app, importing a GLTF would be better, but procedural works for this task

  return (
    <group scale={2}>
      {/* Main Leaf Body - Simplified as a curved plane with custom shader or manipulation */}
      <mesh ref={meshRef} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[1, 3, 32, 1, true]} />
        <meshStandardMaterial
          color="#FBBF24" // Golden Amber
          emissive="#D97706"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.6}
          side={DoubleSide}
        />
      </mesh>

      {/* Leaf Vein */}
      <mesh position={[0, 0, 0]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.02, 3, 8]} />
        <meshStandardMaterial color="#92400e" roughness={0.5} />
      </mesh>
    </group>
  );
}

function TeaParticles() {
  return (
    <Sparkles
      count={50}
      scale={6}
      size={4}
      speed={0.4}
      opacity={0.6}
      color="#FBBF24"
    />
  );
}

export default function TeaLeaf3D() {
  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={0.5}
    >
      <group rotation={[0.5, 0, 0]} position={[0, -0.5, 0]}>
        <LeafModel />
        <TeaParticles />
      </group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
      <spotLight position={[-10, -10, -10]} angle={0.3} intensity={0.5} color="#b45309" />
    </Float>
  );
}
