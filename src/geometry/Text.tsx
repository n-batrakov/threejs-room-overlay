import React from 'react';
import { add, asset, v3 } from '~/lib';
import { Text3D, TextProps } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

export const Text = ({
  ref = undefined as React.RefObject<any> | undefined,
  text = 'Text',
  size = 0.3,
  thickness = 0.02,
  color = '#fff' as ThemeMaterialValue,
  font = undefined as string | undefined,
  lineGap = 1.2,
  groupProps = {} as ThreeElements['group'],
  textProps = {} as TextProps,
}) => {
  return (
    <group ref={ref} {...groupProps}>
      {text.split('\n').map((x, i) => (
        <Text3D
          key={i}
          font={font!}
          size={size}
          height={thickness}
          position={[0, -i * size * lineGap, 0]}
          castShadow
          receiveShadow
          {...textProps}
        >
          {x}
          <ThemeMaterial value={color} />
        </Text3D>
      ))}
    </group>
  )
};
