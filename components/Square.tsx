
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { AdData } from '../types';
import { SQUARE_SIZE, CORNER_SIZE } from '../constants';

interface SquareProps {
  data: AdData;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ data, index, isActive, onClick }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const getPosition = (idx: number): [number, number, number] => {
    const sideLen = 10;
    const offset = (sideLen * SQUARE_SIZE) / 2;
    if (idx < 10) return [offset - idx * SQUARE_SIZE, 0, offset];
    if (idx < 20) return [-offset, 0, offset - (idx - 10) * SQUARE_SIZE];
    if (idx < 30) return [-offset + (idx - 20) * SQUARE_SIZE, 0, -offset];
    return [offset, 0, -offset + (idx - 30) * SQUARE_SIZE];
  };

  const getRotation = (idx: number): [number, number, number] => {
    if (idx < 10) return [0, 0, 0];
    if (idx < 20) return [0, Math.PI / 2, 0];
    if (idx < 30) return [0, Math.PI, 0];
    return [0, -Math.PI / 2, 0];
  };

  const position = getPosition(index);
  const rotation = getRotation(index);
  const isCorner = index % 10 === 0;
  const size = isCorner ? CORNER_SIZE : SQUARE_SIZE;

  useFrame((state) => {
    if (meshRef.current) {
      const targetY = hovered ? 0.2 : (isActive ? 0.1 : 0);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[size, 0.3, size]} radius={0.08} smoothness={4}>
        <meshStandardMaterial 
          color={isActive ? "#fff" : (hovered ? "#fefefe" : "#fff")} 
          emissive={data.isChallenge ? "#fbbf24" : (isActive ? "#3b82f6" : "#000")}
          emissiveIntensity={data.isChallenge ? 0.4 : (isActive ? 0.3 : 0)}
        />
      </RoundedBox>

      {/* Subtle indicator strip */}
      {!isCorner && (
        <mesh position={[0, 0.16, -size/2 + 0.1]}>
          <boxGeometry args={[size * 0.85, 0.02, 0.2]} />
          <meshStandardMaterial color={data.color} opacity={0.8} transparent />
        </mesh>
      )}

      {/* Contextual Spark - Active indicator */}
      {isActive && (
        <group position={[0, 0.4, 0]}>
          <Float speed={4} rotationIntensity={0.5} floatIntensity={0.2}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08, 0.1, 32]} />
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
            </mesh>
          </Float>
        </group>
      )}

      <Text
        position={[0, 0.17, isCorner ? 0 : 0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={isCorner ? 0.2 : 0.14}
        color="#1e293b"
        maxWidth={size * 0.8}
        textAlign="center"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {data.name.toUpperCase()}
      </Text>

      {isActive && (
        <mesh position={[0, -0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size * 2, size * 2]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} />
        </mesh>
      )}
    </group>
  );
};

// Helper to keep the ring floating
const Float = ({ children, speed = 1, rotationIntensity = 1, floatIntensity = 1 }: any) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed;
      ref.current.position.y = Math.sin(t) * floatIntensity;
      ref.current.rotation.z = Math.cos(t) * rotationIntensity;
    }
  });
  return <group ref={ref}>{children}</group>;
};

export default Square;
