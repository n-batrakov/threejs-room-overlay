import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import { DoubleSide, PlaneGeometry } from 'three';
import { TextureMapOptions, useTextureMap } from '~/lib/useTextureMap';
import { asset } from '~/lib';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

const makeWave = (geom: PlaneGeometry, shift = 0, amplitudeScale = 0.08, frequency = 1) => {
  const { height } = geom.parameters;
  for (let i = 0; i < geom.attributes.position.count; i++) {
    const x = geom.attributes.position.getX(i);
    const y = geom.attributes.position.getY(i);

    const normalX = x * frequency * Math.PI * 4;
    const timeShift = shift * 1.2;
    const yAmplitudeScale = ((1 - y + 0.5) / (height / 2));
    const wave = Math.sin(normalX + timeShift) * amplitudeScale * yAmplitudeScale;

    geom.attributes.position.setZ(i, wave);
  }
  geom.attributes.position.needsUpdate = true;
  geom.computeVertexNormals();
};

export const Curtain = ({
  width = 1.2,
  height = 1.8,
  segmentsW = 32,
  segmentsH = 32,
  waveShift = 0,
  waveFequency = 1.5,
  waveAmplitude = 0.04,
  color = '#fff' as ThemeMaterialValue,
  groupProps = {} as ThreeElements['group'],
}) => {
  const geometry = React.useMemo(
    () => {
      const geometry = new PlaneGeometry(width, height, segmentsW, segmentsH);
      makeWave(geometry, waveShift, waveAmplitude, waveFequency);
      return geometry;
    },
    [width, height, segmentsW, segmentsH, waveShift, waveAmplitude, waveFequency],
  );

  return (
    <group {...groupProps}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <ThemeMaterial
          value={color}
          textureOptions={{ center: [0.5, 0.5], rotation: Math.PI / 2, repeat: 6 }}
          displacementScale={0.01}
        />
      </mesh>
    </group>
  );
};
