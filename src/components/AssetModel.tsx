import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeElements } from '@react-three/fiber';

const getLoader = (ext: string): any => {
  switch (ext) {
    case 'glb': return GLTFLoader;
    case 'obj': return OBJLoader;
    default: {
      throw new Error(`Unsupported asset model type: ${ext}`);
    }
  }
};
const getExtension = (path: string) => {
  const segments = path.split('/');
  const filename = segments[segments.length - 1];
  if (!filename) return undefined;
  const [, ext] = filename.split('.');
  return ext;
};

export const AssetModel = ({
  path,
  effect,
  effectDeps = [],
  ...props
}: ThreeElements['group'] & {
  path: string,
  effect?: ((ref: any) => void),
  effectDeps?: any[],
}) => {
  if (!path) return null;

  const groupRef = React.useMemo(
    () => props.ref ?? React.createRef(),
    [],
  );

  const loader = React.useMemo(
    () => {
      const ext = getExtension(path);
      if (!ext) return undefined;
      return getLoader(ext);
    },
    [],
  );
  if (!loader) return null;

  const obj = useLoader(loader, path);

  React.useEffect(
    () => {
      if (effect) effect(groupRef);
    },
    effectDeps,
  );

  return (
    <group ref={groupRef} {...props}>
      <primitive object={obj.scene} />
    </group>
  );
};
