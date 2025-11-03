import { RenderCallback } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, Object3D, Scene } from 'three';
import { Palette, RoomScene, ThemeObjects } from './types';
import { ThemeLightProps } from './ThemeLight';
import { asset, deg, DEG90, v3 } from '~/lib';
import { parseThemeMaterialValue } from '~/components/Material';
import { angularCurveRoute, createRouteAnimation } from '~/lib/animation';
import { getMeshObject } from '~/lib/traverse';

export function getRoomObject<TKey extends keyof RoomScene>(container: Object3D, name: TKey): RoomScene[TKey] {
  return container.getObjectByName(name) as any;
}

export const DEFAULT_PALETTE: Palette = {
  leftWall: parseThemeMaterialValue('@Paint004_1K-PNG'),
  rightWall: parseThemeMaterialValue('#ffffff'),
  frontWall: parseThemeMaterialValue('@Paint004_1K-PNG'),
  windowFrame: parseThemeMaterialValue('#fff'),
  windowsill: parseThemeMaterialValue('#fff'),
  floor: parseThemeMaterialValue('@Wood082A_1K-PNG'),
  floorHeight: parseThemeMaterialValue('#ffffff'),
  floorSkirting: parseThemeMaterialValue('#ffffff'),
  curtains: parseThemeMaterialValue('@Fabric023_1K-PNG'),
  chairCushion: parseThemeMaterialValue('@Fabric035_1K-PNG'),
  chairBase: parseThemeMaterialValue('@Wood027_1K-PNG'),
  desk: parseThemeMaterialValue('@Wood022_1K-PNG'),
  wallTextFont: asset('Fascinate.json'),
  wallText: parseThemeMaterialValue({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1 }),
  monitor: parseThemeMaterialValue('#222222'),
  screen: parseThemeMaterialValue({ color: '#5f317d', emissive: '#5f317d', emissiveIntensity: 1 }),
  screenLight: '#5f317d',
  screenText: '#ffffff',
  lamp: parseThemeMaterialValue('#404040'),
  lampLight: '#ffb700',
  webCameraHolder: parseThemeMaterialValue('#404040'),
  webCamera: parseThemeMaterialValue('#00ffe6'),
  shelf: parseThemeMaterialValue('#dedede'),
  pictureFrame: parseThemeMaterialValue('#e0dfdf'),
  pictureFramePicture: parseThemeMaterialValue('@frame-picture.png'),
  clock: parseThemeMaterialValue('#464646'),
  clockArrow: parseThemeMaterialValue('#dddddd'),
  microphone: parseThemeMaterialValue('#ff9ed7'),
  microphoneLight: parseThemeMaterialValue({ color: '#c943ff', emissive: '#c943ff', emissiveIntensity: 0.5 }),
  mug: parseThemeMaterialValue('#fff'),
  mugSteam: parseThemeMaterialValue({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.2 }),
  book: { page: '#ffffff', cover: '#aaaaaa' },
  keyboard: parseThemeMaterialValue('#e0e0e0'),
  keyboardKey: parseThemeMaterialValue('#fafafa'),
  papers: parseThemeMaterialValue('#ffffff'),
};

const DEFAULT_ANGLE = Math.PI / 3;
export const DEFAULT_LIGHT: ThemeLightProps = ({
  top: {
    visible: true,
    showSource: false,
    color: '#ff9300',
    intensity: 5,
    position: [-2, 5, -2],
    rotation: [0, 0, 0],
    angle: DEFAULT_ANGLE,
  },
  right: {
    visible: true,
    showSource: false,
    color: '#7e0000',
    intensity: 50,
    position: [3, 1, -1],
    rotation: [deg(45), 0, -deg(90)],
    angle: DEFAULT_ANGLE,
  },
  back: {
    visible: true,
    showSource: false,
    color: '#7664b4',
    intensity: 50,
    position: [0, 1, 5],
    rotation: [0, -deg(90), -deg(90)],
    angle: DEFAULT_ANGLE,
  },
  ambient: {
    visible: false,
    color: '#fff',
    intensity: 0.1,
  },
  window: {
    visible: true,
    color: '#ff9300',
    intensity: 2,
    position: [-5, 0, 0],
    rotation: v3({ y: -DEG90 }),
  },
});

export const DEFAULT_OBJECTS: ThemeObjects = {
  room: {
    position: v3(),
    rotation: v3(),
    height: 3,
    width: 5,
    depth: 5,
    showCeiling: false,
    showWindow: true,
    showRightWall: false,
    showFloorHeight: false,
    floorHeight: 1,
    wallThickness: 0.6,
  },
};

const animateMug: RenderCallback = (state) => {
  const mug = getRoomObject(state.scene, 'mugSteam');
  if (!mug) return;
  const baseYOffset = -0.04;
  const interval = 2;
  const phaseSpeed = (2 * Math.PI) / interval;
  const t = state.clock.getElapsedTime() % interval;
  const angleWobble = 0.1;
  const rBase = 0.8;
  const rWobble = 0.3;
  const scaleStart = 0.5;
  const scaleEnd = 3;
  const height = 2;
  const swirl = 3;
  const spread = 0.1;
  const pointsCount = 64;
  const cupHeight = 0.3;
  const opacity = 0.1;
  for (let i = 0; i < pointsCount; i++) {
    const progress = i / (pointsCount - 1);
    const phase = t * phaseSpeed + progress * Math.PI * 2;
    const y = cupHeight + baseYOffset + progress * height;
    const angle = swirl * Math.PI * 2 * progress + Math.sin(phase) * angleWobble;
    const r = spread * (rBase + rWobble * Math.sin(phase + progress * 2));
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const mesh = mug.children[i] as Mesh<any, MeshStandardMaterial>;
    mesh.position.set(x, y, z);
    mesh.material.opacity = opacity * (1 - progress);
    mesh.scale.setScalar(scaleStart + scaleEnd * progress);
  }
};
const createScreenTextAnimation = (monitorName: keyof RoomScene): RenderCallback => {
  const width = 0.6 * 0.94;
  const height = 0.3 * 0.88;
  const margin = 0;
  const textSize = 0.05;
  const textLength = 9;
  const textWidth = textLength * (textSize * 0.5);
  const textHeight = 0.065;
  const xmax = width / 2 - textWidth / 2 - margin;
  const ymax = height / 2 - textHeight / 2 - margin;
  const z = 0.0011;

  const animateText = createRouteAnimation((state, text) => ({
    parent: text.parent,
    curve: angularCurveRoute(),
    closed: true,
    route: [
      [0, 0, z],
      [xmax, 0, z],
      [0, -ymax, z],
      [-xmax, 0, z],
      [0, ymax, z],
    ],
  }));

  return (state) => {
    const monitor = getRoomObject(state.scene, monitorName) as Mesh<any, MeshStandardMaterial>;
    const text = monitor ? getMeshObject(monitor, 'screenText') : undefined;
    if (!text) return;
    animateText!(state, text);
  };
}
export const createDefaultAnimations = (): RenderCallback => {
  const animateLeftScreen = createScreenTextAnimation('monitorLeft');
  const animateRightScreen = createScreenTextAnimation('monitorRight');
  return (state, dt) => {
    animateMug(state, dt);
    animateLeftScreen(state, dt);
    animateRightScreen(state, dt);
  };
}
