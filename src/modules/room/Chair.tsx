import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { asset, deg, DEG45, DEG90, V3 } from '~/lib';
import { BeveledDiskGeometry } from '~/geometry/Disk';
import { TrapezoidGeometry } from '~/geometry/Trapezoid';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

const BaseLeg = ({
  width = 0.05,
  material = undefined as React.ReactNode | undefined,
  groupProps = {} as ThreeElements['group'],
}) => (
  <group {...groupProps}>
    <mesh castShadow receiveShadow>
      <TrapezoidGeometry
        height={0.3}
        depth={width}
        topWidth={0.7}
        bottomWidth={0.85}
        holeScale={0.6}
      />
      {material}
    </mesh>
    <group rotation={[0, 0, deg(20)]}>
      <mesh position={[-0.25, 0.35, width / 2]} rotation={[0, deg(90), 0]}>
        <TrapezoidGeometry
          holeScale={0}
          depth={width * 1.3}
          height={0.5}
          topWidth={width}
          bottomWidth={width}
        />
        {material}
      </mesh>
    </group>
  </group>
);


export const Chair = ({
  ref = undefined as React.RefObject<any> | undefined,
  cushionColor = '#fff' as ThemeMaterialValue,
  baseColor = '#fff' as ThemeMaterialValue,
  groupProps = {} as ThreeElements['group'],
}) => {
  const width = 0.8;
  const baseWidth = 0.025;
  const baseBorderWidth = 0.08;
  const baseOffset = (width - baseBorderWidth) / 2;

  const cushionMaterial = <ThemeMaterial value={cushionColor} displacementScale={0.001} textureOptions={{ repeat: 3 }} />
  const baseMaterial = <ThemeMaterial value={baseColor} displacementScale={0} textureOptions={{ repeat: 3, center: [1, 1] }} />

  return (
    <group ref={ref} rotation={[0, DEG90, 0]} {...groupProps} castShadow receiveShadow>
      <BaseLeg width={baseWidth} material={baseMaterial} groupProps={{ position: [0, 0, -baseOffset], rotation: [deg(15), 0, 0] }} />
      <BaseLeg width={baseWidth} material={baseMaterial} groupProps={{ position: [0, 0, baseOffset], rotation: [-deg(15), 0, 0] }} />

      {/* Bottom cushion */}
      <mesh position={[0.1, 0.36, 0]} rotation={[deg(90), 0, deg(45)]}>
        <BeveledDiskGeometry
          thickness={0.08}
          radialSegments={256}
          bevelSegments={32}
          bevelSize={0.03}
          radius={(width + (2 * baseBorderWidth)) / 2}
        />
        {cushionMaterial}
      </mesh>

      {/* Back cushion */}
      <mesh position={[-0.45, 0.85, 0]} rotation={[DEG90, -deg(70), DEG90]}>
        <BeveledDiskGeometry
          thickness={0.08}
          radialSegments={256}
          bevelSegments={32}
          bevelSize={0.03}
          radius={(width / 2)}
        />
        {cushionMaterial}
      </mesh>
    </group>
  );
};
