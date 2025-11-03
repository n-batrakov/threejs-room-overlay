import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

export const Keyboard = ({
  ref = undefined as React.RefObject<any> | undefined,
  width = 0.28,
  depth = 0.12,
  height = 0.012,
  color = '#e0e0e0' as ThemeMaterialValue,
  keyColor = '#fafafa' as ThemeMaterialValue,
  groupProps = {} as ThreeElements['group'],
}) => {
  // Slightly inset keys
  const keyRows = 5;
  const keyCols = 14;
  const keyGap = 0.003;
  const keyWidth = (width - keyGap * (keyCols + 1)) / keyCols;
  const keyDepth = (depth - keyGap * (keyRows + 1)) / keyRows;
  const keyHeight = height * 0.5;

  const keys = [];
  for (let row = 0; row < keyRows; row++) {
    for (let col = 0; col < keyCols; col++) {
      if (row === keyRows - 1) {
        if (col === 3) {
          const spaceWidth = (keyWidth + keyGap) * (keyCols - 4 - 3);
          keys.push(
            <mesh
              key={`key-${row}-${col}`}
              position={[
                -width / 2 + keyGap + spaceWidth / 2 + col * (keyWidth + keyGap),
                height / 2 + keyHeight / 2 + 0.001,
                -depth / 2 + keyGap + keyDepth / 2 + row * (keyDepth + keyGap),
              ]}
            >
              <boxGeometry args={[spaceWidth, keyHeight, keyDepth]} />
              <ThemeMaterial value={keyColor} />
            </mesh>
          );
          continue;
        } else if (col > 3 && col < keyCols - 4) {
          continue;
        }
      }

      keys.push(
        <mesh
          key={`key-${row}-${col}`}
          position={[
            -width / 2 + keyGap + keyWidth / 2 + col * (keyWidth + keyGap),
            height / 2 + keyHeight / 2 + 0.001,
            -depth / 2 + keyGap + keyDepth / 2 + row * (keyDepth + keyGap),
          ]}
        >
          <boxGeometry args={[keyWidth, keyHeight, keyDepth]} />
          <ThemeMaterial value={keyColor} />
        </mesh>
      );
    }
  }

  return (
    <group ref={ref} {...groupProps}>
      {/* Keyboard body */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <ThemeMaterial value={color} />
      </mesh>
      {/* Keys */}
      {keys}
    </group>
  );
};
