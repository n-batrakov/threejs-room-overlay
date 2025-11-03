import React, { useMemo } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { calcJoints, Joint } from '~/lib/joints';
import { Shape } from 'three';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

const DEFAULT_JOINTS: Joint[] = [

  { angle: 0, length: 0.05 },
  { angle: Math.PI / 8, length: 0.4 },
  { angle: -1.4 * Math.PI, length: 0.4 },
];

const CameraHead = ({
  width = 0.05,
  depth = 0.04,
  thickness = 0.015,
  color = '#bfa87a' as ThemeMaterialValue,
  cornerRadius = 0.005,
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
    <group {...groupProps}>
      <mesh position={[0, 0, 0]} castShadow>
        <extrudeGeometry args={[shape, { depth: thickness, bevelEnabled: false }]} />
        <ThemeMaterial value={color} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.008, 32]} />
        <ThemeMaterial value={"#333"} metalness={0.8} />
      </mesh>
    </group>
  );
};

export const WebCamera = ({
  ref = undefined as React.RefObject<any> | undefined,
  armRadius = 0.01,
  color = '#333' as ThemeMaterialValue,
  cameraColor = '#7affff' as ThemeMaterialValue,
  groupProps = {} as ThreeElements['group'],
}) => {
  const baseTop: [number, number, number] = [0, 0, 0];
  const jointsCoords = React.useMemo(() => calcJoints(DEFAULT_JOINTS, baseTop), []);
  const headJointPosition = jointsCoords[jointsCoords.length - 1]?.joint.position as [number, number, number] || [0, 0, 0];

  return (
    <group ref={ref} {...groupProps}>
      {jointsCoords.map((x, i, xs) => (
        <React.Fragment key={x.key}>
          <mesh {...x.arm} castShadow>
            <cylinderGeometry args={[armRadius, armRadius, x.length, 16]} />
            <ThemeMaterial value={color} />
          </mesh>
          <mesh {...x.joint}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <ThemeMaterial value={color} />
          </mesh>
        </React.Fragment>
      ))}

      <CameraHead
        color={cameraColor}
        groupProps={{
          rotation: [0, Math.PI/4, 0],
          position: [
            headJointPosition[0],
            headJointPosition[1] - 0,
            headJointPosition[2] + 0,
          ],

        }}
      />
    </group>
  );
};
