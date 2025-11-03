import { ThreeElements } from '@react-three/fiber';
import React from 'react';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';
import { BeveledBoxGeometry } from '~/geometry/Box';

export const Desk = ({
  ref = undefined as React.RefObject<any> | undefined,
  color = '#fff' as ThemeMaterialValue,
  height = 0.02,
  width = 1.2,
  depth = 0.6,
  bevelSize = 0.008,
  groupProps = {} as ThreeElements['group'],
}) => {
  const material = <ThemeMaterial value={color} ignoreDisplacement textureOptions={{ repeat: 3 }} />

  return (
    <group ref={ref} {...groupProps} castShadow receiveShadow>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <BeveledBoxGeometry width={width} height={height} depth={depth} bevelSize={bevelSize} />
        {material}
      </mesh>
      <mesh position={[width + 0.01, 0, -depth]} castShadow receiveShadow>
        <BeveledBoxGeometry width={width} height={height} depth={depth} bevelSize={bevelSize} />
        {material}
      </mesh>
    </group>
  )
};
