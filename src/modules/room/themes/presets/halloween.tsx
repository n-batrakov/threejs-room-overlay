import React from 'react';
import { Theme } from '../types';
import { createDefaultAnimations, DEFAULT_LIGHT, DEFAULT_OBJECTS, DEFAULT_PALETTE } from '../defaults';
import { parseThemeMaterialValue } from '~/components/Material';
import { asset, deg, V3, v3 } from '~/lib';
import { Camera, PointLight, Vector3 } from 'three';
import { AssetModel } from '~/components/AssetModel';
import { RotationSpotLight } from '../ThemeLight';
import { calcRotationAngle, createSceneAnimations, createRotationAnimation, createRouteAnimation } from '~/lib/animation';
import { getMeshObject } from '~/lib/traverse';


const animate = createSceneAnimations(createDefaultAnimations(), {
  camera: createRouteAnimation<Camera>({
    route: [[-0.92, 1.6, -0.41], [-1.3, 1.6, -0.23]],
    closed: true,
    disable: false,
    updater: (camera, point) => {
      camera.position.copy(point);
      camera.lookAt(new Vector3(-2, 0.5, -2));
    },
  }),
  ghost_real: createRouteAnimation({
    route: [[-0.5, 0, -2.2], [-0.5, 0.05, -2.2]],
    closed: true,
    speed: { frequency: 20 },
  }),
  ghost_cute: createRouteAnimation({
    route: [[-2, 1, -3], [-2, 1, 0]],
  }),
  candle_light: (state, candleLight: PointLight) => {
    const base = 0.05;
    const frequency = 0.1;
    const amplitude = 0.008;
    candleLight.intensity = base + calcRotationAngle(state.clock.getElapsedTime(), amplitude, frequency);
  },
  pumpkin_light: (state, pumpkinLight: PointLight) => {
    const base = 0.01;
    const frequency = 1;
    const amplitude = 0.005;
    pumpkinLight.intensity = base + calcRotationAngle(state.clock.getElapsedTime(), amplitude, frequency);
  },
  clock: (state, clock) => clock.rotateY(-2 * Math.PI / 10),
  chair: createRotationAnimation({ amplitude: 0.1, frequency: 5, rotateOnZ: true, ignoreInit: true }),
  microphone: createRotationAnimation({ amplitude: 0.011, frequency: 5, rotateOnZ: true }),
});

export default {
  name: 'Halloween',
  materialProps: { type: 'toon' },
  fog: <fogExp2 args={['#86ff84', 0.2]} attach="fog" />,
  palette: {
    ...DEFAULT_PALETTE,
    shelf: parseThemeMaterialValue({ texture: '@Wood082A_1K-PNG', color: '#624f3f' }),
    floor: parseThemeMaterialValue({ texture: '@Wood082A_1K-PNG', color: '#624f3f' }),
    desk: parseThemeMaterialValue({ texture: '@Wood022_1K-PNG', color: '#624f3f' }),
    curtains: parseThemeMaterialValue('#706e6e'),
    papers: parseThemeMaterialValue({ visible: false }),
    wallText: parseThemeMaterialValue({ color: '#000000', emissive: '#025f00', emissiveIntensity: 3 }),
    wallTextFont: asset('Griffy_Regular.json'),
    screen: parseThemeMaterialValue({ texture: '@spider-web.jpg', color: '#ffffff', emissiveIntensity: 0 }),
    screenLight: '#025f00',
    screenText: '#ffb901',
    lampLight: '#000000',
    pictureFrame: parseThemeMaterialValue('#555555'),
    mugSteam: parseThemeMaterialValue({ color: '#ffffff', emissive: '#025f00', emissiveIntensity: 1 }),
    mug: parseThemeMaterialValue({ visible: false }),
    bookPage: parseThemeMaterialValue('#ffffff'),
    microphone: parseThemeMaterialValue({ color: '#000000' }),
    microphoneLight: parseThemeMaterialValue({ color: '#000000', emissive: '#025f00', emissiveIntensity: 1 }),
  },
  objects: {
    ...DEFAULT_OBJECTS,
    room: { ...DEFAULT_OBJECTS.room, showRightWall: true },
  },
  light: {
    window: { ...DEFAULT_LIGHT.window, visible: false },
    ambient: { ...DEFAULT_LIGHT.ambient, visible: false, intensity: 0.03, color: '#0010ff' },
    top: { ...DEFAULT_LIGHT.top, visible: false, color: '#ffffff', intensity: 0.5, position: [0, 6, 0] },
    right: { ...DEFAULT_LIGHT.right, visible: true, color: '#00ff49', intensity: 30, position: [30, 1.5, -2] },
    back: { ...DEFAULT_LIGHT.back, visible: true, color: '#df00ff', intensity: 5 },
  },
  children: (
    <>
      <AssetModel
        path={asset('pumpkin.glb')}
        position={[-1, 0.37, -2.2]}
        rotation={v3({ y: deg(-30) })}
        scale={0.3}
        castShadow
        receiveShadow
        effect={ref => {
          if (!ref?.current) return;
          const pumpkinMesh = getMeshObject(ref.current, 'Pumpkin');
          pumpkinMesh.material.color.set('#ff9100');

          const stemMesh = getMeshObject(ref.current, 'Stem');
          stemMesh.material.color.set('#025f00');
        }}
      />
      <pointLight name="pumpkin_light" color="#ff9100" position={[-1, 0.5, -2.2]} intensity={0.01} distance={0.3} />

      <AssetModel path={asset('skull.glb')} position={[-2.3, 0.37, -1.5]} rotation={v3({ y: deg(90) })} />
      <pointLight color="#ff0000" position={[-2.26, 0.47, -1.467]} intensity={0.01} distance={0.1} />
      <mesh position={[-2.26, 0.47, -1.467]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshToonMaterial color="#ff0000" transparent opacity={0.6} emissive={"#ff0000"} emissiveIntensity={2} />
      </mesh>
      <pointLight color="#ff0000" position={[-2.26, 0.47, -1.527]} intensity={0.01} distance={0.1} />
      <mesh position={[-2.26, 0.47, -1.527]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshToonMaterial color="#ff0000" transparent opacity={0.6} emissive={"#ff0000"} emissiveIntensity={2} />
      </mesh>

      <AssetModel path={asset('candles.glb')} position={[-2.2, 0.37, -1.7]} scale={0.5} rotation={v3({ y: deg(90) })} />
      <pointLight name="candle_light" color="#c19a00" position={[-2.2, 0.45, -1.7]} intensity={0.05} distance={0.3} />

      <AssetModel path={asset('skeleton_arm.glb')} position={[-1.3, -0.1, -2.4]} rotation={v3({ y: deg(180), z: deg(-60) })} scale={0.6} />

      <AssetModel path={asset('goblet.glb')} position={[-1.5, 0.37, -2]} scale={0.5} />
      <RotationSpotLight color="#025f00" intensity={0.5} rotation={v3({ z: -Math.PI })} angle={deg(15)} position={[-1.5, 0.3, -2]} />

      <AssetModel name="ghost_real" path={asset('ghost_real.glb')} position={[-0.5, 0, -2.2]} scale={0.5} />

      <AssetModel
        name="ghost_cute"
        path={asset('ghost_cute.glb')}
        position={[-2, 1, -3]}
        scale={0.5}
        rotation={v3({ y: deg(180) })}
        effect={(ref) => {
          if (!ref.current) return;
          ref.current.traverse((child: any) => {
            if (child.isMesh) {
              if (child.material.name === 'Ögon') { // eyes
                child.material.emissive.set('#ffffff');
                child.material.emissiveIntensity = 1;
                return;
              }
              child.material.transparent = true;
              child.material.opacity = 0.1;
              child.material.color.set('#86ff84')
              child.material.emissive.set('#86ff84');
              child.material.emissiveIntensity = 1;
            }
          });
        }}
      />

      <hemisphereLight args={["#df00ff", "#df00ff", 0.2]} />
    </>
  ),
  animate,
} as Theme;
