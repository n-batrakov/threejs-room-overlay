import React, { useMemo } from 'react';
import { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { deg, DEG90, V3 } from '~/lib';
import { calcJoint, calcRotationPosition } from '~/lib/joints';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

export const Clock = ({
  ref = undefined as React.RefObject<any> | undefined,
  radius = 0.5,
  depth = 0.06,
  color = '#e0e0e0' as ThemeMaterialValue,
  arrowColor = '#333' as ThemeMaterialValue,
  rimColor = '#888' as ThemeMaterialValue,
  hourAngle = 0,
  minuteAngle = Math.PI / 4,
  groupProps = {} as ThreeElements['group'],
}) => {
  const arrowDepth = 0.003;
  const arrowWidth = radius * 0.06;
  const arrowY = -depth / 2;

  const hourLength = radius * 0.5;
  const hourPosition = calcRotationPosition({ axis: 'y', basePosition: [0, arrowY, 0], length: hourLength, angle: hourAngle });

  const minuteLength = radius * 0.9;
  const minutePosition = calcRotationPosition({ axis: 'y', basePosition: [0, arrowY, 0], length: minuteLength, angle: minuteAngle });

  return (
    <group ref={ref} {...groupProps}  castShadow receiveShadow>
      {/* Clock face */}
      <mesh>
        <cylinderGeometry args={[radius, radius, depth, 64]} />
        <ThemeMaterial value={color} />
      </mesh>
      {/* Rim */}
      <mesh>
        <cylinderGeometry args={[radius * 1.03, radius, depth * 1.05, 64, 1, true]} />
        <ThemeMaterial value={rimColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Hour hand */}
      <mesh rotation={[0, hourAngle, 0]} position={hourPosition}>
        <boxGeometry args={[hourLength, arrowDepth, arrowWidth]} />
        <ThemeMaterial value={arrowColor} />
      </mesh>
      {/* Minute hand */}
      <mesh rotation={[0, minuteAngle, 0]} position={minutePosition}>
        <boxGeometry args={[minuteLength, arrowDepth, arrowWidth]} />
        <ThemeMaterial value={arrowColor} />
      </mesh>
      {/* Center pin */}
      <mesh position={[-0.02, arrowY, 0]}>
        <cylinderGeometry args={[0.01, 0.01, arrowDepth, 16]} />
        <ThemeMaterial value={arrowColor} />
      </mesh>
    </group>
  );
};
