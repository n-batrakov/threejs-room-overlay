import React from 'react';
import { V3, v3 } from '~/lib';
import { Object3D, Vector3 } from 'three';
import { ThreeElements } from '@react-three/fiber';

const useSpotlightPosition = (lightTargetPosition: V3, deps: any[]) => {
  const lightTarget = React.useMemo(
    () => {
      const obj = new Object3D();
      obj.position.set(...lightTargetPosition);
      return obj;
    },
    deps,
  );

  return lightTarget;
};

export const RotationSpotLight = ({
  name = undefined as string | undefined,
  ref = undefined as React.RefObject<any> | undefined,
  position = v3(),
  rotation = v3(),
  showSource = false,
  color = '#fff',
  intensity= 1,
  angle = undefined as number | undefined,
  visible = true,
}) => {
  const lightTargetPosition = React.useMemo(
    () => {
      const length = Math.max(0.2, intensity / 20);
      const dir = new Object3D();
      dir.rotation.set(...rotation);
      const forward = new Vector3(0, -length, 0);
      forward.applyEuler(dir.rotation);
      return [
        position[0] + forward.x,
        position[1] + forward.y,
        position[2] + forward.z,
      ] as V3;
    },
    [...position, ...rotation, intensity],
  )
  const lightTarget = useSpotlightPosition(lightTargetPosition, [lightTargetPosition]);

  return (
    <>
      <primitive object={lightTarget} />
      <spotLight
        ref={ref}
        name={name}
        target={lightTarget}
        color={color}
        position={position}
        intensity={intensity}
        angle={angle}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0005}
        visible={visible}
      />

      {showSource && (
        <>
          <mesh position={position} rotation={rotation}>
            <coneGeometry args={[0.1, 0.2]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </mesh>
          <mesh position={lightTargetPosition}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </mesh>
        </>
      )}
    </>
  );
};
export type RotationSpotLightProps = Parameters<typeof RotationSpotLight>[0];

export type ThemeLightProps = {
  ambient?: ThreeElements['ambientLight'],
  window?: ThreeElements['rectAreaLight'],
  top?: RotationSpotLightProps,
  right?: RotationSpotLightProps,
  back?: RotationSpotLightProps,
};
export const ThemeLight = (props: ThemeLightProps) => {
  const { ambient, window, top, right, back } = props;

  return (
    <>
      {ambient && (
        <ambientLight name="ambientLight" {...props.ambient} {...ambient} />
      )}
      {window && (
        <rectAreaLight name="windowLight" width={5} height={5} {...window} />
      )}
      {right && (
        <RotationSpotLight name="rightLight" {...props.right} {...right} />
      )}
      {back && (
        <RotationSpotLight name="backLight" {...props.back} {...back} />
      )}
      {top && (
        <RotationSpotLight name="topLight" {...props.top} {...top} />
      )}
    </>
  );
};
