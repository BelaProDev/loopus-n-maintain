import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model() {
  const { nodes } = useGLTF('/broken-chain.stl');
  return (
    <mesh geometry={nodes.mesh}>
      <meshStandardMaterial color="#2E5984" roughness={0.5} metalness={0.8} />
    </mesh>
  );
}

export default function StlViewer() {
  return (
    <div className="w-full h-[400px] bg-secondary/50 rounded-lg shadow-xl">
      <Canvas camera={{ position: [0, 0, 100], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Model />
          <OrbitControls autoRotate />
        </Suspense>
      </Canvas>
    </div>
  );
}