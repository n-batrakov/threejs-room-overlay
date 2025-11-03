import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

export const BeveledDiskGeometry = ({
  radius = 0.5,
  thickness = 0.1,
  bevelSize = 0.04,
  bevelSegments = 8,
  radialSegments = 64,
}) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const steps = radialSegments;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const r = radius;
      const x = Math.cos(t) * r;
      const y = Math.sin(t) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, [radius]);

  const extrudeSettings = useMemo(
    () => ({
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: bevelSize,
      bevelSize: bevelSize,
      bevelSegments: bevelSegments,
      steps: 1,
    } as THREE.ExtrudeGeometryOptions),
    [thickness, bevelSize, bevelSegments]
  );

  return (
    <extrudeGeometry args={[shape, extrudeSettings]} />
  );
};
