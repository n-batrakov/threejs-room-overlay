import React, { useMemo } from 'react';
import { Shape, ExtrudeGeometry } from 'three';

export const createBeveledBoxGeometry = ({
  width = 1,
  height = 1,
  depth = 1,
  bevelSize = 0.08,
  bevelSegments = 4,
}) => {
  const shape = new Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.lineTo(-width / 2, -height / 2);

  return new ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: true,
    bevelThickness: bevelSize,
    bevelSize: bevelSize,
    bevelSegments: bevelSegments,
    steps: 1,
  });
};

export const BeveledBoxGeometry = ({
  width = 1,
  height = 1,
  depth = 1,
  bevelSize = 0.08,
  bevelSegments = 4,
}) => {
  // Use ExtrudeGeometry with a rectangle shape and bevel for beveled box
  const geometry = React.useMemo(
    () => createBeveledBoxGeometry({ width, height, depth, bevelSegments, bevelSize }),
    [width, height, depth, bevelSize, bevelSegments],
  );

  return (
    <primitive object={geometry} />
  );
};
