import React from 'react';
import { ThreeElements, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

export const OverlayPlane = (props: ThreeElements['mesh']) => {
  const { size: { width, height }, camera } = useThree(x => ({ size: x.size, camera: x.camera }));
  const distance = 0.5;
  const scale = 1.535;
  const aspectRatio = width / height;
  const ref = React.useRef<any>(null);

  useFrame(() => {
    if (!ref.current) return;
    const cameraDir = new Vector3();
    camera.getWorldDirection(cameraDir);
    const cameraPos = new Vector3();
    camera.getWorldPosition(cameraPos);
    const planePos = cameraPos.clone().add(cameraDir.multiplyScalar(distance));
    ref.current.position.copy(planePos);
    ref.current.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[aspectRatio * distance * scale, distance * scale]} />
      {props.children}
    </mesh>
  );
};
