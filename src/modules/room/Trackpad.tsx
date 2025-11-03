import React, { useMemo } from 'react';
import { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

export const Trackpad = ({
  ref = undefined as React.RefObject<any> | undefined,
  width = 0.16,
  depth = 0.12,
  heightLow = 0.005,
  heightHigh = 0.012,
  radius = 0.012,
  color = '#fafafa' as ThemeMaterialValue,
  groupProps = {} as ThreeElements['group'],
}) => {
  // Create a rounded rectangle shape for the perimeter
  const shape = useMemo(() => {
    const w = width, d = depth, r = Math.min(radius, width/2, depth/2);
    const s = new THREE.Shape();
    s.absarc(-w/2 + r, -d/2 + r, r, Math.PI, Math.PI * 1.5, false);
    s.absarc(w/2 - r, -d/2 + r, r, Math.PI * 1.5, 0, false);
    s.absarc(w/2 - r, d/2 - r, r, 0, Math.PI * 0.5, false);
    s.absarc(-w/2 + r, d/2 - r, r, Math.PI * 0.5, Math.PI, false);
    s.closePath();
    return s;
  }, [width, depth, radius]);

  // Extrude with a slant: use a simple extrude and then skew the mesh for the slant
  // We'll use a simple extrude and then rotate for the slant effect
  const extrudeSettings = useMemo(() => ({
    steps: 1,
    depth: Math.max(heightLow, heightHigh),
    bevelEnabled: false,
  }), [heightLow, heightHigh]);

  // Calculate slant angle and center Y
  const slant = Math.atan((heightHigh - heightLow) / depth);
  const centerY = (heightLow + heightHigh) / 2;

  return (
    <group ref={ref} {...groupProps}>
      <mesh
        rotation={[-slant, 0, 0]}
        position={[0, centerY, 0]}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <ThemeMaterial value={color} metalness={0.1} roughness={0.4} />
      </mesh>
    </group>
  );
};
