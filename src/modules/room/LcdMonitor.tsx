import { ThreeElements } from '@react-three/fiber';
import React from 'react';
import { Text } from '@react-three/drei';
import { asset } from '~/lib';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

const Screen = ({
  color = '#fff' as ThemeMaterialValue,
  textColor = '#fff',
  width = 1,
  height = 1,
  text = 'DVD',
  groupProps = {} as ThreeElements['mesh']
}) => {
  const font = asset('screen-font.ttf');
  const textSize = 0.05;

  return (
    <mesh {...groupProps}>
      <boxGeometry args={[width, height, 0.001]} />
      <Text
        name="screenText"
        fontSize={textSize}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        font={font}
      >
        {text}
      </Text>
      <ThemeMaterial value={color} />
    </mesh>
  );
};

export const LcdMonitor = ({
  ref = undefined as React.RefObject<any> | undefined,
  width = 1.2,
  height = 0.7,
  depth = 0.08,
  standWidth = 0.3,
  standDepth = 0.1,
  standHeight = 0.15,
  color = '#222' as ThemeMaterialValue,
  screenColor = '#1a237e' as ThemeMaterialValue,
  screenTextColor = '#fff' as string,
  screenText = 'DVD',
  standColor = '#333' as ThemeMaterialValue,
  lightColor = '#fff',
  lightIntensity = 1,
  groupProps = {} as ThreeElements['group'],
}) => {
  return (
    <group ref={ref} {...groupProps}>
      {/* Monitor frame */}
      <mesh position={[0, height / 2 + standHeight, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <ThemeMaterial value={color} />
      </mesh>
      {/* Screen */}
      <Screen
        width={width * 0.94}
        height={height * 0.88}
        color={screenColor}
        textColor={screenTextColor}
        text={screenText}
        groupProps={{
          position: [0, height / 2 + standHeight, depth / 2 + 0.001],
        }}
      />
      {/* Stand */}
      <mesh position={[0, standHeight / 2, 0]} castShadow>
        <boxGeometry args={[standWidth, standHeight, standDepth]} />
        <ThemeMaterial value={standColor} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, 0, standDepth * 0.5]} castShadow receiveShadow>
        <boxGeometry args={[standWidth * 7, 0.01, standDepth * 2]} />
        <ThemeMaterial value={standColor} />
      </mesh>

      <rectAreaLight
        args={[lightColor, lightIntensity, width * 0.94, height * 0.88]}
        rotation={[0, Math.PI, 0]}
        position={[0, height / 2 + standHeight, depth / 2 + 0.001]}
      />
    </group>
  );
};
