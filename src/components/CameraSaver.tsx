import React from 'react';
import { useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';
import { V3, v3 } from '~/lib';

const CAMERA_KEY = 'threejs-camera';

const round = (x: number) => Number.parseFloat(x.toPrecision(2));

export const CameraLookAt = ({ target = v3(), showTarget = false, showTargetRadius = 0.5, }) => {
  const camera = useThree(x => x.camera);
  React.useEffect(() => camera.lookAt(new Vector3(...target)), [camera, target]);
  return !showTarget ? <></> : (
    <mesh position={target}>
      <sphereGeometry args={[showTargetRadius]} />
      <meshBasicMaterial />
    </mesh>
  );
};

export const CameraInfoDisplay = (props: { orbitControls?: React.RefObject<OrbitControlsImpl> }) => {
  const camera = useThree(x => x.camera);
  const cameraRef = React.useRef(camera);
  cameraRef.current = camera;

  React.useEffect(
    () => {
      const camera = cameraRef.current;
      (window as any).showCamera = () => {
        const position = [camera.position.x, camera.position.y, camera.position.z].map(round).join(', ');
        const rotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z].map(round).join(', ');
        console.log(`position: [${position}],\nrotation: [${rotation}],`);
      };
    },
    [],
  );

  React.useEffect(
    () => {
      if (!props.orbitControls?.current) return;
      let samplingRate = 10;
      let frame = 0;
      const controls = props.orbitControls.current;
      let enabled = false;
      let points = [] as V3[];
      (window as any).beginTracingCamera = (rate?: number) => {
        enabled = true;
        points = [];
        frame = 0;
        if (rate) samplingRate = rate;
      };
      (window as any).endTracingCamera = () => {
        enabled = false;
        console.log(points.map(([x, y, z]) => `[${round(x)}, ${round(y)}, ${round(z)}],`).join('\n'));
      };

      const trace = () => {
        if (!enabled) return;
        if (frame % samplingRate === 0) {
          points.push([cameraRef.current.position.x, cameraRef.current.position.y, cameraRef.current.position.z]);
        }
        frame++;
      };

      controls.addEventListener('change', trace);
      return () => controls.removeEventListener('change', trace);
    },
    [],
  );

  React.useEffect(
    () => {
      if (!props.orbitControls?.current) return;
      const controls = props.orbitControls.current;

      const display = () => {

      };

      controls.addEventListener('change', display);
      return () => controls.removeEventListener('change', display);
    },
    [camera],
  );

  return <></>;
};

export const CameraSaver = (props: { orbitControls?: React.RefObject<OrbitControlsImpl> }) => {
  const camera = useThree(x => x.camera);

  // Restore camera on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(CAMERA_KEY);
    if (saved) {
      try {
        const { position, rotation } = JSON.parse(saved);
        camera.position.set(position.x, position.y, position.z);
        camera.rotation.set(rotation._x, rotation._y, rotation._z, rotation._order);
      } catch {}
    }
  }, [camera]);

  // Save camera on OrbitControls change
  React.useEffect(() => {
    if (!props.orbitControls?.current) return;
    const controls = props.orbitControls.current;

    const save = () => {
      localStorage.setItem(
        CAMERA_KEY,
        JSON.stringify({
          position: camera.position,
          rotation: camera.rotation,
        })
      );
    };

    controls.addEventListener('change', save);
    return () => controls.removeEventListener('change', save);
  }, [camera]);

  return null;
};
