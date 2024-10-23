import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

function Model() {
  const geometry = React.useMemo(() => {
    const loader = new STLLoader();
    return loader.parse(
      // Load the STL file as a string using Vite's raw import
      new TextEncoder().encode('/broken-chain.stl').buffer
    );
  }, []);

  return (
    <mesh scale={[0.1, 0.1, 0.1]}>
      <bufferGeometry {...geometry} />
      <meshPhysicalMaterial
        color="#2E5984"
        roughness={0.2}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
}

export default function StlViewer() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-secondary/30 to-secondary/10 rounded-lg shadow-2xl">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Stage
            environment="city"
            intensity={0.5}
            shadows={{ type: 'contact', opacity: 0.5, blur: 2 }}
          >
            <Model />
          </Stage>
        </Suspense>
        <OrbitControls 
          autoRotate={false}
          enableZoom={true}
          enablePan={true}
          minDistance={50}
          maxDistance={200}
        />
      </Canvas>
    </div>
  );
}