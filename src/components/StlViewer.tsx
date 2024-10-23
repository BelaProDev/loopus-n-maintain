import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { Alert, AlertDescription } from "@/components/ui/alert";

function Model() {
  const geometry = React.useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    return geometry;
  }, []);

  return (
    <mesh scale={[0.1, 0.1, 0.1]} aria-hidden="true">
      <primitive object={geometry} />
      <meshPhysicalMaterial
        color="#2E5984"
        roughness={0.2}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0.2}
        envMapIntensity={1}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}

function CanvasContent() {
  return (
    <Suspense fallback={null}>
      <Stage
        environment="city"
        intensity={0.5}
        shadows={{ type: 'contact', opacity: 0.2, blur: 2 }}
      >
        <Model />
      </Stage>
      <OrbitControls 
        autoRotate={true}
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Suspense>
  );
}

export default function StlViewer() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <section aria-label="3D Model Visualization" className="h-[400px] relative my-16 bg-gray-50/50 flex items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>
            Your browser does not support WebGL, which is required for 3D visualization.
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  return (
    <section aria-label="3D Model Visualization" className="h-[400px] relative my-16 bg-gray-50/50">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: true
        }}
        dpr={[1, 2]}
        onError={(e) => {
          console.error('Three.js Error:', e);
          setError('Failed to initialize 3D viewer');
        }}
      >
        <CanvasContent />
      </Canvas>
      {error && (
        <Alert variant="destructive" className="absolute top-4 left-4 right-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </section>
  );
}