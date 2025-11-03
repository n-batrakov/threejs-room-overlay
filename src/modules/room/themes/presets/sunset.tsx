import { Theme } from '../types';
import { DEFAULT_PALETTE, DEFAULT_LIGHT, DEFAULT_OBJECTS, createDefaultAnimations } from '../defaults';

export default {
  name: 'Sunset',
  materialProps: { type: 'standard' },
  palette: DEFAULT_PALETTE,
  objects: DEFAULT_OBJECTS,
  light: DEFAULT_LIGHT,
  animate: createDefaultAnimations(),
} as Theme;
