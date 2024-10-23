import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const geometry = React.useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1); // Fallback geometry while STL loads
    return geometry;
  }, []);

  return (
    <mesh scale={[0.1, 0.1, 0.1]}>
      <primitive object={geometry} />
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