import React from 'react';
import { Path, Shape } from 'three';

export const TrapezoidGeometry = ({
  topWidth = 1,
  bottomWidth = 2,
  height = 2,
  depth = 2,
  holeScale = 0,
}) => {
  const shape = React.useMemo(() => {
    const hwTop = topWidth / 2;
    const hwBot = bottomWidth / 2;
    const h = height;

    // Outer trapezoid (y=0)
    const s = new Shape();
    s.moveTo(-hwBot, 0);
    s.lineTo(hwBot, 0);
    s.lineTo(hwTop, h);
    s.lineTo(-hwTop, h);
    s.lineTo(-hwBot, 0);

    if (!holeScale) return s;

    // Inner (hole) trapezoid, scaled and centered
    const h_hwTop = hwTop * holeScale;
    const h_hwBot = hwBot * holeScale;
    const h_h = h * holeScale;
    const hole = new Path();
    hole.moveTo(-h_hwBot, (h - h_h) / 2);
    hole.lineTo(h_hwBot, (h - h_h) / 2);
    hole.lineTo(h_hwTop, (h + h_h) / 2);
    hole.lineTo(-h_hwTop, (h + h_h) / 2);
    hole.lineTo(-h_hwBot, (h - h_h) / 2);
    s.holes.push(hole);

    return s;
  }, [topWidth, bottomWidth, height, holeScale]);

  const extrudeSettings = React.useMemo(() => ({
    depth,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 4
  }), [depth]);

  return (
    <extrudeGeometry args={[shape, extrudeSettings]}  />
  );
};
