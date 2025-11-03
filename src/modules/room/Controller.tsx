import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ThreeElements } from '@react-three/fiber';
import { asset, v3 } from '~/lib';

const OBJ_PATH = asset('dualsense.glb');

export const Controller = ({
  ref = undefined as React.RefObject<any> | undefined,
  groupProps = {} as ThreeElements['group'],
}) => {
  const obj = useLoader(GLTFLoader, OBJ_PATH);

  return (
    <group ref={ref} scale={v3(0.001)} {...groupProps} castShadow receiveShadow>
      <primitive object={obj.scene} />
    </group>
  );
};
