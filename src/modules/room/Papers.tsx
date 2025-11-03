import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

export const Papers = ({
  ref = undefined as React.RefObject<any> | undefined,
  count = 6,
  width = 0.20,
  height = 0.287,
  thickness = 0.001,
  color = '#fafafa' as ThemeMaterialValue,
  groupProps = {} as ThreeElements['group'],
}) => {
  // Generate random offsets and rotations for a messy stack
  const papers = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const x = (Math.random() - 0.5) * 0.03;
      const z = (Math.random() - 0.5) * 0.03;
      const y = i * thickness * 1.1;
      const rot = (Math.random() - 0.5) * 0.3;
      return { x, y, z, rot, key: i };
    });
  }, [count, thickness]);

  return (
    <group {...groupProps}>
      {papers.map(({ x, y, z, rot, key }) => (
        <mesh
          key={key}
          position={[x, y, z]}
          rotation={[0, rot, 0]}
          receiveShadow
        >
          <boxGeometry args={[width, thickness, height]} />
          <ThemeMaterial value={color} />
        </mesh>
      ))}
    </group>
  );
};
