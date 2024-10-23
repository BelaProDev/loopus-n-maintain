import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const geometry = React.useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
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
        transparent={true}
        opacity={0.1}
      />
    </mesh>
  );
}

export default function StlViewer() {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Stage
            environment="city"
            intensity={0.5}
            shadows={{ type: 'contact', opacity: 0.2, blur: 2 }}
          >
            <Model />
          </Stage>
        </Suspense>
        <OrbitControls 
          autoRotate={true}
          autoRotateSpeed={0.5}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}