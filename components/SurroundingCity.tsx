
import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AdData } from '../types';

interface SurroundingCityProps {
  ads: AdData[];
  onAdClick: (ad: AdData) => void;
}

// Reusable shared geometries to drastically reduce draw calls and memory usage
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const planeGeo = new THREE.PlaneGeometry(1, 1);
const cylinderGeo = new THREE.CylinderGeometry(0.04, 0.04, 3, 6);

const SurroundingCity: React.FC<SurroundingCityProps> = ({ ads, onAdClick }) => {
  const cityLayout = useMemo(() => {
    const buildings = [];
    const count = 65; // High density but optimized
    const innerRadius = 25;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      
      // Create gaps for the "main roads" at cardinal directions
      const isRoadGap = Math.abs(angle % (Math.PI / 2)) < 0.12;
      if (isRoadGap && Math.random() > 0.3) continue;

      const dist = innerRadius + (i % 3) * 8 + Math.random() * 5;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      
      // Varied skyscraper heights
      const height = 5 + Math.random() * (dist > 40 ? 30 : 15);
      const width = 3 + Math.random() * 2;
      const depth = 3 + Math.random() * 2;
      
      const colors = ['#0f172a', '#1e293b', '#020617', '#1e1b4b'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Assign unique ads to different faces for "ads everywhere" feel
      const faceAds = {
        front: ads[Math.floor(Math.random() * ads.length)],
        left: ads[Math.floor(Math.random() * ads.length)],
        right: ads[Math.floor(Math.random() * ads.length)]
      };

      buildings.push({ 
        position: [x, height / 2 - 1.1, z] as [number, number, number], 
        args: [width, height, depth] as [number, number, number], 
        color, 
        id: i,
        faceAds,
        rotationY: -angle // Face the center plaza
      });
    }

    return { buildings };
  }, [ads]);

  return (
    <group>
      {/* 1. OPTIMIZED GROUND SYSTEM */}
      {/* Foundation Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.14, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#020617" roughness={1} metalness={0} />
      </mesh>

      {/* Main Grid Plaza Overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.135, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Cyber-Grid Ground Patterns */}
      <gridHelper args={[500, 50, "#1e293b", "#09090b"]} position={[0, -1.13, 0]} />

      {/* Glowing Road Arteries */}
      <group position={[0, -1.125, 0]}>
        {/* Horizontal */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[500, 0.2]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
        </mesh>
        {/* Vertical */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 500]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Sidewalk Borders */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]}>
        <ringGeometry args={[24, 25, 64]} />
        <meshBasicMaterial color="#334155" />
      </mesh>

      {/* 2. BUILDINGS ENGINE */}
      {cityLayout.buildings.map((b) => (
        <group key={b.id} position={b.position} rotation={[0, b.rotationY, 0]}>
          {/* Building Core */}
          <mesh scale={b.args} castShadow receiveShadow>
            <primitive object={boxGeo} attach="geometry" />
            <meshStandardMaterial color={b.color} metalness={0.1} roughness={0.8} />
          </mesh>
          
          {/* Optimized Window Strips */}
          <group position={[0, 0, b.args[2] / 2 + 0.01]}>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[b.args[0] * 0.7, b.args[1] * 0.8]} />
              <meshBasicMaterial color="#1e293b" transparent opacity={0.3} />
            </mesh>
          </group>

          {/* FRONT BILLBOARD */}
          <BillboardFace 
            ad={b.faceAds.front} 
            width={b.args[0] * 0.85} 
            height={b.args[1] * 0.4} 
            position={[0, b.args[1] * 0.2, b.args[2] / 2 + 0.05]} 
            onAdClick={onAdClick}
          />

          {/* LEFT BILLBOARD */}
          <BillboardFace 
            ad={b.faceAds.left} 
            width={b.args[2] * 0.7} 
            height={b.args[1] * 0.3} 
            position={[-b.args[0] / 2 - 0.05, -b.args[1] * 0.1, 0]} 
            rotation={[0, -Math.PI / 2, 0]}
            onAdClick={onAdClick}
            compact
          />

          {/* RIGHT BILLBOARD */}
          <BillboardFace 
            ad={b.faceAds.right} 
            width={b.args[2] * 0.7} 
            height={b.args[1] * 0.3} 
            position={[b.args[0] / 2 + 0.05, -b.args[1] * 0.1, 0]} 
            rotation={[0, Math.PI / 2, 0]}
            onAdClick={onAdClick}
            compact
          />
        </group>
      ))}

      {/* 3. ATMOSPHERIC OPTIMIZATION */}
      {/* Heavy Fog Ring to hide distance and improve performance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.11, 0]}>
        <ringGeometry args={[30, 300, 32]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

// Internal component for building faces to modularize and clean up
interface BillboardFaceProps {
  ad: AdData;
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  onAdClick: (ad: AdData) => void;
  compact?: boolean;
}

const BillboardFace: React.FC<BillboardFaceProps> = ({ ad, width, height, position, rotation = [0, 0, 0], onAdClick, compact }) => {
  return (
    <group 
      position={position} 
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onAdClick(ad);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Glow Backing - Use Emissive for perf (no dynamic lighting) */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={ad.color} 
          emissive={ad.color} 
          emissiveIntensity={0.7} 
          toneMapped={false}
        />
      </mesh>

      {/* Ad Text / Title */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={compact ? 0.22 : 0.3}
        color="white"
        maxWidth={width * 0.9}
        textAlign="center"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {ad.name.toUpperCase()}
      </Text>
      
      {!compact && (
        <Text
          position={[0, -height * 0.35, 0.01]}
          fontSize={0.12}
          color="white"
          opacity={0.8}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          {ad.category.toUpperCase()}
        </Text>
      )}
    </group>
  );
};

export default SurroundingCity;
