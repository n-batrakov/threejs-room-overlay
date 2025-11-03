import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';
import { DEG90 } from '~/lib';

export const PictureFrame = ({
  ref = undefined as React.RefObject<any> | undefined,
  width = 0.3,
  height = 0.22,
  frameDepth = 0.02,
  frameThickness = 0.025,
  frameColor = '#8d6748' as ThemeMaterialValue,
  picture = '#333' as ThemeMaterialValue,
  groupProps = {} as ThreeElements['group'],
}) => {
  return (
    <group ref={ref} {...groupProps} castShadow receiveShadow>
      {/* Frame - four sides */}
      {/* Top */}
      <mesh position={[0, frameThickness / 2, frameDepth / 2]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
        <ThemeMaterial value={frameColor} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -height - frameThickness / 2, frameDepth / 2]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
        <ThemeMaterial value={frameColor} />
      </mesh>
      {/* Left */}
      <mesh position={[-width / 2 - frameThickness / 2, -height / 2, frameDepth / 2]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <ThemeMaterial value={frameColor} />
      </mesh>
      {/* Right */}
      <mesh position={[width / 2 + frameThickness / 2, -height / 2, frameDepth / 2]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <ThemeMaterial value={frameColor} />
      </mesh>
      {/* Picture */}
      <mesh position={[0, -height / 2, 0]}>
        <boxGeometry args={[width, height, frameDepth / 2]} />
        <ThemeMaterial value={picture} textureOptions={{ center: [0.5, 0.5], rotation: -DEG90 }} />
      </mesh>
    </group>
  );
};
