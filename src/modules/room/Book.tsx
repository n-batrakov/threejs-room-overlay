import React from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeElements } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, MeshToonMaterial, TextureLoader } from 'three';
import { asset } from '~/lib';


const OBJ_PATH = asset('book.obj');

export const Book = ({
  ref = undefined as React.RefObject<any> | undefined,
  pageColor = '#ddd',
  coverColor = '#aaa',
  toon = false,
  groupProps = {} as ThreeElements['group'],
}) => {
  const obj = useLoader(OBJLoader, OBJ_PATH);

  React.useEffect(
    () => {
      obj.traverse((child) => {
        if (child instanceof Mesh) {
          child.material[0] = toon ? new MeshToonMaterial({ color: coverColor }) : new MeshStandardMaterial({ color: coverColor });
          child.material[0].needsUpdate = true;

          child.material[1] = toon ? new MeshToonMaterial({ color: pageColor }) : new MeshStandardMaterial({ color: pageColor });
          child.material[1].needsUpdate = true;
        }
      });
    },
    [obj, pageColor, coverColor, toon],
  );

  return (
    <group ref={ref} {...groupProps} castShadow receiveShadow>
      <primitive object={obj} />
    </group>
  );
};
