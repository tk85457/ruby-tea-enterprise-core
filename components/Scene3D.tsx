'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import TeaLeaf3D from './TeaLeaf3D';
import { Suspense } from 'react';

export default function Scene3D() {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        shadows
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <TeaLeaf3D />

          <Environment preset="sunset" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
