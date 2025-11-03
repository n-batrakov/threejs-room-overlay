import React from 'react';
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Room from './modules/room';
import { CameraInfoDisplay } from './components/CameraSaver';
import { Leva, useControls } from 'leva';
import { persistValue } from './lib/useControls';

const getSize = (size: string) => {
  switch (size) {
    case '480p': return {}
    case '1080p': return { width: 1920, height: 1080 };
    default: return { width: '100vw', height: '100vh' };
  }
};

const App = () => {
  const orbitControls = React.useRef<any>(undefined);
  React.useEffect(
    () => {
      (window as any).orbitControls = orbitControls;
    },
    [],
  );

  const [defaultSize, useSaveSize] = persistValue('size', 'Auto');
  const { size, drp } = useControls('RECORDING', {
    size: {
      label: 'Resolution',
      options: ['Auto', '1080p'],
      value: defaultSize,
    },
    drp: {
      label: 'Pixel ratio',
      value: 2,
      options: [1, 2],
    },
  });
  useSaveSize(size);

  return (
    <div
      style={{
        ...getSize(size),
        backgroundColor: 'var(--background, #333)',
        border: size !== 'Auto' ? '5px dashed #ffffff' : undefined,
      }}
    >
      <Leva oneLineLabels />
      <Canvas
        dpr={drp}
        gl={{ antialias: true }}
        shadows={true}
        camera={{
          position: [-0.92, 1.6, -0.41],
          rotation: [-0.59, 0.51, 0.32],
        }}
      >
        <OrbitControls
          ref={orbitControls}
          target={[-2, 0.5, -2]}
          zoomSpeed={0.5}
        />
        <CameraInfoDisplay orbitControls={orbitControls} />

        <Room />
      </Canvas>
    </div>
  );
};

createRoot(document.getElementById('app')!).render(<App />);
