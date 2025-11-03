import { Glitch, Grid,  } from '@react-three/postprocessing';
import React from 'react';
import { Theme } from '../types';
import { DEFAULT_PALETTE, DEFAULT_LIGHT, DEFAULT_OBJECTS, createDefaultAnimations } from '../defaults';

export default {
  name: 'Glitch',
  palette: DEFAULT_PALETTE,
  materialProps: {
    type: 'toon',
    wireframe: true,
  },
  objects: DEFAULT_OBJECTS,
  light: DEFAULT_LIGHT,
  effects: (
    <>
      <Glitch delay={[0, 2] as any} duration={[0, 0.3] as any} strength={[0.2, 0.8] as any} />
      <Grid scale={0.8} />
    </>
  ),
  animate: createDefaultAnimations(),
} as Theme;
