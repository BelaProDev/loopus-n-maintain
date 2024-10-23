import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import * as THREE from 'three';

interface GLTFResult {
  nodes: {
    mesh: THREE.Mesh;
  };
}

function Model() {
  const { nodes } = useGLTF('/broken-chain.stl') as unknown as GLTFResult;
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={nodes.mesh.geometry}
      scale={[2, 2, 2]}
    >
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
        <Stage
          environment="city"
          intensity={0.5}
          contactShadow={{ opacity: 0.5, blur: 2 }}
        >
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Stage>
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