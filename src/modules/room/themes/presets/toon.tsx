import { Theme } from '../types';
import { createDefaultAnimations, DEFAULT_LIGHT, DEFAULT_OBJECTS, DEFAULT_PALETTE } from '../defaults';
import { parseThemeMaterialValue } from '~/components/Material';

export default {
  name: 'Purple haze',
  materialProps: { type: 'toon' },
  palette: {
    ...DEFAULT_PALETTE,
    chairCushion: parseThemeMaterialValue('#fffa6e'),
    chairBase: parseThemeMaterialValue('#5f4e23'),
    leftWall: parseThemeMaterialValue('#d1d1d1'),
    rightWall: parseThemeMaterialValue('#d1d1d1'),
    frontWall: parseThemeMaterialValue('#b8b8b8'),
    floor: parseThemeMaterialValue('#7a7a7a'),
    curtains: parseThemeMaterialValue('#706e6e'),
    desk: parseThemeMaterialValue('#a8a2a2'),
    screen: parseThemeMaterialValue('#b1a6ff'),
    screenLight: '#000000',
    screenText: '#ffb901',
    lampLight: '#ffb901',
    pictureFrame: parseThemeMaterialValue('#555555'),
    mugSteam: parseThemeMaterialValue({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1 }),
    bookPage: parseThemeMaterialValue('#ffffff'),
  },
  objects: DEFAULT_OBJECTS,
  light: {
    window: { ...DEFAULT_LIGHT.window, visible: false },
    ambient: { ...DEFAULT_LIGHT.ambient, visible: false },
    top: { ...DEFAULT_LIGHT.top, color: '#ffa300', intensity: 5, position: [0, 6, 0] },
    right: { ...DEFAULT_LIGHT.right, color: '#af00ff', intensity: 1000, position: [30, 1.5, -2] },
    back: { ...DEFAULT_LIGHT.back, color: '#af00ff', intensity: 15, position: [0, 1, 5] },
  },
  animate: createDefaultAnimations(),
} as Theme;
