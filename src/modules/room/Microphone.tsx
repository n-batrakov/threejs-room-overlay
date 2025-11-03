import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { calcJoints, calcJoint, Joint } from '~/lib/joints';
import { deg, DEG90, v3 } from '~/lib';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

const DEFAULT_JOINTS: Joint[] = [

  { angle: Math.PI / 2, length: 0.05 },
  { angle: Math.PI, length: 0.2 },
  { angle: Math.PI / 2, length: 0.25 },
  { angle: Math.PI, length: 0.1 },
];

const MicHead = ({
  radius = 0.05,
  height = 0.1,
  color = '#bdbdbd' as ThemeMaterialValue,
  netColor = '#c943ff' as ThemeMaterialValue,
  ringColor = '#222' as ThemeMaterialValue,
  groupProps = {} as ThreeElements['group'],
}) => {
  const stringsThickness = 0.002;
  const micRadius = radius / 2;
  return (
    <group {...groupProps}>
      {/* Head */}
      <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[micRadius, micRadius, height, 32]}  />
        <ThemeMaterial value={color} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[micRadius + 0.001, micRadius + 0.001, height * 0.5, 32, undefined, true, 0, Math.PI / 1.2]}  />
        <ThemeMaterial value={netColor} />
      </mesh>
      <mesh position={[0, -0.04, 0]} rotation={[0, -Math.PI, 0]}>
        <cylinderGeometry args={[micRadius + 0.001, micRadius + 0.001, height * 0.5, 32, undefined, true, 0, Math.PI / 1.2]}  />
        <ThemeMaterial value={netColor} />
      </mesh>

      {/* Holder */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, height / 4, 32, undefined, true]} />
        <ThemeMaterial value={ringColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Pop filter */}
      <mesh position={[0, -0.035, 0]}>
        <cylinderGeometry args={[radius, radius, height * 0.45, 32, undefined, true, 0.8, Math.PI / 3]}  />
        <ThemeMaterial value="#333" transparent opacity={0.8} />
      </mesh>

      {/* Strings */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <cylinderGeometry args={[stringsThickness, stringsThickness, (radius * 2) - 0.001, 8]}  />
        <ThemeMaterial value="#333" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[stringsThickness, stringsThickness, (radius * 2) - 0.001, 8]}  />
        <ThemeMaterial value="#333" />
      </mesh>
    </group>
  );
};

export const Microphone = ({
  ref = undefined as React.RefObject<any> | undefined,
  armRadius = 0.01,
  netColor = '#bdbdbd' as ThemeMaterialValue,
  color = '#bdbdbd' as ThemeMaterialValue,
  headRotation = v3(DEG90, 0, 0),
  groupProps = {} as ThreeElements['group'],
}) => {
  const jointRadius = armRadius * 1.5;

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
          {i === xs.length - 1 ? null : (
            <mesh {...x.joint}>
              <sphereGeometry args={[0.012, 16, 16]} />
              <ThemeMaterial value={color} />
            </mesh>
          )}
        </React.Fragment>
      ))}

      <MicHead
        color={color}
        netColor={netColor}
        ringColor={color}
        radius={0.05}
        groupProps={{
          rotation: headRotation,
          position: [
            headJointPosition[0],
            headJointPosition[1] - 0.05,
            headJointPosition[2] + 0,
          ],

        }}
      />
    </group>
  );
};
