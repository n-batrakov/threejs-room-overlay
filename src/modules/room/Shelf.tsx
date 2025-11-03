import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import { Shape } from 'three';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

export const Shelf = ({
  ref = undefined as React.RefObject<any> | undefined,
  width = 0.8,
  depth = 0.18,
  thickness = 0.025,
  color = '#bfa87a' as ThemeMaterialValue,
  cornerRadius = 0.025,
  groupProps = {} as ThreeElements['group'],
}) => {
  const shape = React.useMemo(() => {
    const w = width, d = depth, r = Math.min(cornerRadius, width / 2, depth / 2);
    const s = new Shape();
    s.absarc(-w / 2 + r, -d / 2 + r, r, Math.PI, Math.PI * 1.5, false);
    s.absarc(w / 2 - r, -d / 2 + r, r, Math.PI * 1.5, 0, false);
    s.absarc(w / 2 - r, d / 2 - r, r, 0, Math.PI * 0.5, false);
    s.absarc(-w / 2 + r, d / 2 - r, r, Math.PI * 0.5, Math.PI, false);
    s.closePath();
    return s;
  }, [width, depth, cornerRadius]);
  return (
    <group ref={ref} {...groupProps}>
      {/* Shelf board */}
      <mesh position={[0, 0, 0]} castShadow>
        <extrudeGeometry args={[shape, { depth: thickness, bevelEnabled: false }]} />
        <ThemeMaterial value={color} />
      </mesh>
    </group>
  );
};
