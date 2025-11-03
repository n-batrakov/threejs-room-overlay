import React from 'react';
import { Theme } from '../types';
import { createDefaultAnimations, DEFAULT_LIGHT, DEFAULT_OBJECTS, DEFAULT_PALETTE } from '../defaults';
import { asset } from '~/lib';
import { parseThemeMaterialValue } from '~/components/Material';

const THEME: Theme = {
  name: 'Horror',
  objects: DEFAULT_OBJECTS,
  fog: <fogExp2 args={['#888', 0.4]} attach="fog" />,
  palette: {
    ...DEFAULT_PALETTE,
    leftWall: parseThemeMaterialValue({ texture: '@Concrete042C_1K-PNG', textureOptions: { repeat: 2 } }),
    frontWall: parseThemeMaterialValue({ texture: '@Concrete042C_1K-PNG', textureOptions: { repeat: 2 } }),
    floor: parseThemeMaterialValue({ texture: '@MetalPlates013_1K-PNG', textureOptions: { repeat: 2 } }),
    chairCushion: parseThemeMaterialValue({ texture: '@DiamondPlate006C_1K-PNG', textureOptions: { repeat: 1 } }),
    chairBase: parseThemeMaterialValue({ texture: '@DiamondPlate006C_1K-PNG', textureOptions: { repeat: 1 } }),
    desk: parseThemeMaterialValue({ texture: '@Metal056C_1K-PNG', textureOptions: { repeat: 1 } }),
    floorSkirting: parseThemeMaterialValue('@Metal056C_1K-PNG'),
    windowFrame: parseThemeMaterialValue('@Metal056C_1K-PNG'),
    windowsill: parseThemeMaterialValue('@Metal056C_1K-PNG'),
    shelf: parseThemeMaterialValue('@Metal056C_1K-PNG'),
    wallText: parseThemeMaterialValue({ color: '#360a00', emissive: '#360a00', emissiveIntensity: 5 }),
    wallTextFont: asset('Special Elite_Regular.json'),
    webCameraHolder: parseThemeMaterialValue('@Metal025_1K-PNG'),
    lamp: parseThemeMaterialValue('@Metal025_1K-PNG'),
    microphone: parseThemeMaterialValue('@Metal025_1K-PNG'),
    webCamera: parseThemeMaterialValue('@Metal025_1K-PNG'),
    keyboard: parseThemeMaterialValue('@Metal025_1K-PNG'),
    keyboardKey: parseThemeMaterialValue('@Metal025_1K-PNG'),
    clock: parseThemeMaterialValue('@Metal025_1K-PNG'),
    pictureFrame: parseThemeMaterialValue('@Metal025_1K-PNG'),
    mug: parseThemeMaterialValue('@Metal025_1K-PNG'),
    mugSteam: parseThemeMaterialValue('#555555'),
    curtains: parseThemeMaterialValue({ visible: false }),
    papers: parseThemeMaterialValue({ visible: false }),
    screen: parseThemeMaterialValue('#000000'),
    screenText: '#c32400',
    lampLight: '#000000',
    pictureFramePicture: parseThemeMaterialValue({ color: '#360a00', emissive: '#360a00', emissiveIntensity: 10 }),
    microphoneLight: parseThemeMaterialValue({ color: '#ff3600', emissive: '#360a00', emissiveIntensity: 1 }),
    book: { page: '#888888', cover: '#555555' },
  },
  light: {
    ambient: { ...DEFAULT_LIGHT.ambient, visible: false },
    top: { ...DEFAULT_LIGHT.top, color: '#ffffff', intensity: 1 },
    right: { ...DEFAULT_LIGHT.right, color: '#ffffff', intensity: 1 },
    back: { ...DEFAULT_LIGHT.back, visible: false },
    window: { ...DEFAULT_LIGHT.window, visible: false },
  },
  animate: createDefaultAnimations(),
};
export default THEME;
