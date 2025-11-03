import React, { useMemo } from 'react';
import { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { calcJoints, calcJoint, Joint } from '~/lib/joints';
import { add, deg, v3 } from '~/lib';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

const LightBulb = ({
  position = v3(),
  lightTargetPosition = v3(),
  lightColor = '#fff',
  lightIntensity = 1,
}) => {
  const lightTarget = React.useMemo(
    () => {
      const obj = new THREE.Object3D();
      obj.position.set(...lightTargetPosition);
      return obj;
    },
    [...lightTargetPosition],
  );
  return (
    <>
      <primitive object={lightTarget} />
      <spotLight
        position={position}
        target={lightTarget}
        angle={deg(60)}
        distance={0.8}
        color={lightColor}
        intensity={lightIntensity}
        castShadow
      />
    </>
  )
};

const DEFAULT_JOINTS: Joint[] = [
  { angle: Math.PI / 1.2, length: 0.4 },
  { angle: Math.PI / 4, length: 0.4 },
];

export const Lamp = ({
  ref = undefined as React.RefObject<any> | undefined,
  baseRadius = 0.12,
  baseHeight = 0.04,
  armRadius = 0.01,
  headRadius = 0.09,
  headLength = 0.15,
  headAngle = Math.PI,
  joints = DEFAULT_JOINTS,
  color = '#bdbdbd' as ThemeMaterialValue,
  lightColor = '#fff',
  lightIntensity = 1,
  groupProps = {} as ThreeElements['group'],
}) => {
  const jointRadius = armRadius * 1.5;

  const baseTop: [number, number, number] = [0, baseHeight, 0];
  const jointsCoords = React.useMemo(() => calcJoints(joints, baseTop), [joints, baseHeight]);
  const headJointPosition = jointsCoords[jointsCoords.length - 1]?.joint.position as [number, number, number] || [0, 0, 0];

  const ha2 = Math.PI / 1.2;
  const headPosition = calcJoint(headJointPosition, headLength, ha2, -2);

  const bulbPosition = calcJoint(headJointPosition, headLength / 2, headAngle, 1);
  const lightTargetPosition = add(calcJoint(headJointPosition, headLength * 2, headAngle, 1), { x: 0 });

  // Bell-shaped lamp head using LatheGeometry
  const bellGeometry = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(headRadius * 0.25, headLength * 0.15));
    points.push(new THREE.Vector2(headRadius * 0.7, headLength * 0.5));
    points.push(new THREE.Vector2(headRadius, headLength * 0.95));
    points.push(new THREE.Vector2(headRadius * 0.95, headLength));
    return new THREE.LatheGeometry(points, 32);
  }, [headRadius, headLength]);

  return (
    <group ref={ref} {...groupProps}>
      {/* Base */}
      <mesh position={[0, baseHeight / 2, 0]}>
        <cylinderGeometry args={[baseRadius, baseRadius, baseHeight, 32]} />
        <ThemeMaterial value={color} />
      </mesh>

      {/* Joints */}
      {jointsCoords.map(x => (
        <React.Fragment key={x.key}>
          <mesh {...x.arm} castShadow>
            <cylinderGeometry args={[armRadius, armRadius, x.length, 16]} />
            <ThemeMaterial value={color} />
          </mesh>
          <mesh {...x.joint}>
            <sphereGeometry args={[jointRadius, 16, 16]} />
            <ThemeMaterial value={color} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Head joint */}
      <mesh position={headJointPosition}>
        <sphereGeometry args={[armRadius * 2.5, 16, 16]} />
        <ThemeMaterial value={color} />
      </mesh>

      {/* Lamp head (bell-shaped) */}
      <mesh
        position={[headPosition[0], headPosition[1] + 0.06, headPosition[2] - 0.04]}
        rotation={[headAngle, 0, 0]}
        geometry={bellGeometry}
        castShadow
        receiveShadow
      >
        <ThemeMaterial value={color} side={THREE.DoubleSide} shadowSide={THREE.DoubleSide} />
      </mesh>

      <LightBulb
        lightColor={lightColor}
        lightIntensity={lightIntensity}
        position={bulbPosition}
        lightTargetPosition={lightTargetPosition}
      />
    </group>
  );
};
