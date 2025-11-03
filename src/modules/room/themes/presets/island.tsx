import { parseThemeMaterialValue, ThemeMaterial } from "~/components/Material";
import { createDefaultAnimations, DEFAULT_LIGHT, DEFAULT_PALETTE } from "../defaults";
import { ThemeLight } from "../ThemeLight";
import { Theme } from "../types";
import React from "react";
import { DoubleSide, BackSide, HemisphereLight } from "three";
import { DEG90, v3 } from "~/lib";
import { useControls } from "leva";
import { useObjectControl } from "~/lib/useControls";

const DEFAULT_ISLAND = {
  sky: parseThemeMaterialValue({
    color: '#000000',
    emissive: '#25006b',
    emissiveIntensity: 1,
  }),
  skyColor: '#25006b',
  ground: parseThemeMaterialValue({
    color: '#000000',
    emissive: '#130052',
    emissiveIntensity: 1,
  }),
  groundColor: '#130052',
  sunColor: '#9d00ff',
  sunIntensity: 100,
  sunDistance: 50,
  sunPosition: v3(2, 5, 2),
  hemisphereIntensity: 0.5,
};
const Island = () => {
  const props = useObjectControl('ISLAND', DEFAULT_ISLAND, DEFAULT_ISLAND);

  return (
    <>
      <mesh>
        <sphereGeometry args={[10]} />
        <ThemeMaterial value={props.sky} side={BackSide}  />
      </mesh>

      <mesh position={[0, -0.11, 0]} rotation={v3({ x: -DEG90 })}>
        <planeGeometry args={[20, 20]} />
        <ThemeMaterial value={props.ground} />
      </mesh>

      <pointLight args={[props.sunColor, props.sunIntensity, props.sunDistance]} position={props.sunPosition} />
      <hemisphereLight args={[props.skyColor, props.groundColor, props.hemisphereIntensity]} />
    </>
  );
};

export default {
  name: 'Island',
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
  objects: {
    room: {
      position: [-2.5, 0, -1.7],
      showFloorHeight: true,
      showWindow: false,
      height: 1,
      width: 2,
      depth: 1.5,
      wallThickness: 0.1,
      floorHeight: 0.1,
    },
  },
  light: {
    ...DEFAULT_LIGHT,
    top: { ...DEFAULT_LIGHT.top, visible: false },
    right: { ...DEFAULT_LIGHT.right, visible: false },
    back: { ...DEFAULT_LIGHT.back, visible: false },
    window: { ...DEFAULT_LIGHT.window, visible: false },
    ambient: { ...DEFAULT_LIGHT.ambient, visible: true },
  },
  children: <Island />,
  animate: createDefaultAnimations(),
} as Theme;
