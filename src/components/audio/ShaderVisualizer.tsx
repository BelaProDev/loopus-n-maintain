import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ShaderVisualizerProps {
  audioData: number[];
}

const fragmentShader = `
  uniform float uTime;
  uniform float uAudioLevel;
  
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    float wave = sin(uv.x * 10.0 + uTime) * uAudioLevel;
    vec3 color = vec3(wave + 0.5, 0.5 + uAudioLevel, 0.7);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ShaderVisualizer = ({ audioData }: ShaderVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();
  
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAudioLevel: { value: 0 }
      }
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const animate = (time: number) => {
      const audioLevel = audioData.reduce((acc, val) => acc + Math.abs(val), 0) / audioData.length;
      
      material.uniforms.uTime.value = time * 0.001;
      material.uniforms.uAudioLevel.value = audioLevel;
      
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      renderer.dispose();
    };
  }, [audioData]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-48 rounded-lg bg-black/10 backdrop-blur"
    />
  );
};

export default ShaderVisualizer;