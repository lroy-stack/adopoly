
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Float } from '@react-three/drei';
import * as THREE from 'three';
import { SQUARE_SIZE, THEME_COLORS } from '../constants';
import { CharacterType } from '../types';

interface PlayerProps {
  positionIndex: number;
  characterType?: CharacterType;
}

const Player: React.FC<PlayerProps> = ({ positionIndex, characterType = 'EXPLORER' }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bodyRootRef = useRef<THREE.Group>(null);
  const upperBodyRef = useRef<THREE.Group>(null);
  const lArmRef = useRef<THREE.Group>(null);
  const rArmRef = useRef<THREE.Group>(null);
  const lLegRef = useRef<THREE.Group>(null);
  const rLegRef = useRef<THREE.Group>(null);
  
  const targetPos = useRef(new THREE.Vector3());
  const prevPos = useRef(new THREE.Vector3());
  const lastUpdate = useRef(0);

  const getPosition = (idx: number): THREE.Vector3 => {
    const sideLen = 10;
    const offset = (sideLen * SQUARE_SIZE) / 2;
    const v = new THREE.Vector3();
    
    // Y offset is slightly higher now to accommodate the humanoid height
    const baseHeight = 0.5;
    if (idx < 10) v.set(offset - idx * SQUARE_SIZE, baseHeight, offset);
    else if (idx < 20) v.set(-offset, baseHeight, offset - (idx - 10) * SQUARE_SIZE);
    else if (idx < 30) v.set(-offset + (idx - 20) * SQUARE_SIZE, baseHeight, -offset);
    else v.set(offset, baseHeight, -offset + (idx - 30) * SQUARE_SIZE);
    
    return v;
  };

  useEffect(() => {
    targetPos.current = getPosition(positionIndex);
  }, [positionIndex]);

  useFrame((state) => {
    if (!rootGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // 1. Smooth lateral movement
    rootGroupRef.current.position.x = THREE.MathUtils.lerp(rootGroupRef.current.position.x, targetPos.current.x, 0.12);
    rootGroupRef.current.position.z = THREE.MathUtils.lerp(rootGroupRef.current.position.z, targetPos.current.z, 0.12);
    
    const dist = new THREE.Vector2(rootGroupRef.current.position.x, rootGroupRef.current.position.z)
      .distanceTo(new THREE.Vector2(targetPos.current.x, targetPos.current.z));
    
    const isMoving = dist > 0.05;

    // 2. Rotation / Banking logic
    if (isMoving) {
      // Rotate to face direction of movement
      const angle = Math.atan2(
        targetPos.current.x - rootGroupRef.current.position.x,
        targetPos.current.z - rootGroupRef.current.position.z
      );
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, angle, 0.15);
      
      // Banking/Leaning
      if (bodyRootRef.current) {
        bodyRootRef.current.rotation.z = THREE.MathUtils.lerp(bodyRootRef.current.rotation.z, -0.1, 0.1);
      }

      // 3. Hop / Jump animation
      rootGroupRef.current.position.y = targetPos.current.y + Math.abs(Math.sin(time * 12)) * 0.4;

      // 4. Limb animation during movement
      if (lArmRef.current && rArmRef.current) {
        lArmRef.current.rotation.x = Math.sin(time * 12) * 0.5;
        rArmRef.current.rotation.x = -Math.sin(time * 12) * 0.5;
      }
      if (lLegRef.current && rLegRef.current) {
        lLegRef.current.rotation.x = -Math.sin(time * 12) * 0.4;
        rLegRef.current.rotation.x = Math.sin(time * 12) * 0.4;
      }
    } else {
      // Idle state
      rootGroupRef.current.position.y = THREE.MathUtils.lerp(rootGroupRef.current.position.y, targetPos.current.y, 0.1);
      
      // Subtle idle bobbing
      if (upperBodyRef.current) {
        upperBodyRef.current.position.y = Math.sin(time * 2) * 0.05;
        upperBodyRef.current.rotation.z = Math.sin(time * 1.5) * 0.02;
      }

      // Reset limb positions
      if (lArmRef.current) lArmRef.current.rotation.x = THREE.MathUtils.lerp(lArmRef.current.rotation.x, 0, 0.1);
      if (rArmRef.current) rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, 0, 0.1);
      if (lLegRef.current) lLegRef.current.rotation.x = THREE.MathUtils.lerp(lLegRef.current.rotation.x, 0, 0.1);
      if (rLegRef.current) rLegRef.current.rotation.x = THREE.MathUtils.lerp(rLegRef.current.rotation.x, 0, 0.1);
      if (bodyRootRef.current) bodyRootRef.current.rotation.z = THREE.MathUtils.lerp(bodyRootRef.current.rotation.z, 0, 0.1);
    }

    // Squash and stretch on movement speed
    if (bodyRootRef.current) {
      const scaleY = isMoving ? 1.0 + Math.sin(time * 12) * 0.05 : 1.0;
      bodyRootRef.current.scale.set(1 / scaleY, scaleY, 1 / scaleY);
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* Visual Trail - keeps the previous cool effect but attached to the base */}
      <Trail
        width={1.2}
        length={6}
        color={new THREE.Color(THEME_COLORS.primary)}
        attenuation={(t) => t * t}
      >
        <group ref={bodyRootRef}>
          {/* Main Equipment Base (Board or Skis) */}
          <group position={[0, -0.4, 0]}>
            {characterType === 'SNOWBOARDER' || characterType === 'EXPLORER' ? (
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.6, 0.05, 1.4]} />
                <meshStandardMaterial color={THEME_COLORS.equipment} />
              </mesh>
            ) : (
              <group>
                <mesh position={[-0.2, 0, 0]} castShadow>
                  <boxGeometry args={[0.15, 0.05, 1.6]} />
                  <meshStandardMaterial color={THEME_COLORS.equipment} />
                </mesh>
                <mesh position={[0.2, 0, 0]} castShadow>
                  <boxGeometry args={[0.15, 0.05, 1.6]} />
                  <meshStandardMaterial color={THEME_COLORS.equipment} />
                </mesh>
              </group>
            )}
          </group>

          {/* Legs */}
          <group ref={lLegRef} position={[-0.15, -0.1, 0]}>
            <mesh castShadow position={[0, -0.15, 0]}>
              <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
              <meshStandardMaterial color={THEME_COLORS.suit} />
            </mesh>
          </group>
          <group ref={rLegRef} position={[0.15, -0.1, 0]}>
            <mesh castShadow position={[0, -0.15, 0]}>
              <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
              <meshStandardMaterial color={THEME_COLORS.suit} />
            </mesh>
          </group>

          {/* Upper Body Hierarchy */}
          <group ref={upperBodyRef} position={[0, 0.2, 0]}>
            {/* Torso */}
            <mesh castShadow>
              <capsuleGeometry args={[0.2, 0.35, 4, 8]} />
              <meshStandardMaterial color={THEME_COLORS.primary} />
            </mesh>

            {/* Arms */}
            <group ref={lArmRef} position={[-0.25, 0.1, 0]}>
              <mesh castShadow position={[0, -0.15, 0]}>
                <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
                <meshStandardMaterial color={THEME_COLORS.suit} />
              </mesh>
            </group>
            <group ref={rArmRef} position={[0.25, 0.1, 0]}>
              <mesh castShadow position={[0, -0.15, 0]}>
                <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
                <meshStandardMaterial color={THEME_COLORS.suit} />
              </mesh>
            </group>

            {/* Head */}
            <group position={[0, 0.35, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={THEME_COLORS.skin} />
              </mesh>
              {/* Subtle Hat / Cap */}
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
                <meshStandardMaterial color={THEME_COLORS.secondary} />
              </mesh>
              <mesh position={[0, 0.08, 0.1]}>
                <boxGeometry args={[0.25, 0.02, 0.15]} />
                <meshStandardMaterial color={THEME_COLORS.secondary} />
              </mesh>
            </group>
          </group>
        </group>
      </Trail>

      {/* Shadow Disk */}
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial color="black" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

export default Player;
