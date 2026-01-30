'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

function Steam() {
  const steamRefs = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    steamRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.position.y += 0.005 + i * 0.001;
        ref.rotation.z += 0.01;

        const material = ref.material as any;
        if (material && 'opacity' in material) {
          material.opacity = Math.max(0, 1 - (ref.position.y - 1.2) * 2);
        }

        ref.scale.setScalar(Math.max(0, 1 - (ref.position.y - 1.2) + Math.sin(state.clock.elapsedTime + i) * 0.2));

        if (ref.position.y > 2.5) {
          ref.position.y = 1.2;
          if (material && 'opacity' in material) {
            material.opacity = 0.6;
          }
          ref.scale.setScalar(0.5);
        }
      }
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { steamRefs.current[i] = el; }}
          position={[Math.sin(i) * 0.2, 1.2 + i * 0.3, Math.cos(i) * 0.2]}
          scale={[0.5, 0.5, 0.5]}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function TeaCup3D() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={[1.5, 1.5, 1.5]}>
      {/* Cup Body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.6, 1, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Cup Handle */}
      <mesh position={[0.8, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Tea Liquid */}
      <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.2} transparent opacity={0.9} />
      </mesh>

      {/* Saucer */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.0, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Steam */}
      <Steam />
    </group>
  );
}
