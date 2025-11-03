import React from 'react';
import { Walls } from './Walls';
import { Desk } from './Desk';
import { LcdMonitor } from './LcdMonitor';
import { Lamp } from './Lamp';
import { Keyboard } from './Keyboard';
import { Trackpad } from './Trackpad';
import { Book } from './Book';
import { Papers } from './Papers';
import { Chair } from './Chair';
import { ThreeElements } from '@react-three/fiber';
import { Shelf } from './Shelf';
import { Microphone } from './Microphone';
import { WebCamera } from './WebCamera';
import { PictureFrame } from './PictureFrame';
import { Clock } from './Clock';
import { add, deg, DEG90, v3 } from '~/lib';
import { Mug } from './Mug';
import { Curtain } from './Curtains';
import { Text } from '~/geometry/Text';
import { MaterialContext, ThemeMaterial } from '~/components/Material';
import { Controller } from './Controller';
import { Palette, Theme, ThemeObjects } from './themes/types';
import { EffectComposer } from '@react-three/postprocessing';
import { BakeShadows } from '@react-three/drei';
import { ThemeLight } from './themes/ThemeLight';

const DeskWithStuff = ({ palette, toon, ...props }: ThreeElements['group'] & { palette: Palette, toon?: boolean }) => {
  const desktop = 0.02;
  const screenText = 'DVD';

  return (
    <group name="deskGroup" {...props}>
      <Desk
        groupProps={{ position: [0.009, 0, 0.615], castShadow: true, name: 'desk' }}
        color={palette.desk}
      />

      <Controller
        groupProps={{
          name: 'controller',
          position: [0.5, 0, 0.5],
          rotation: [-deg(48), deg(45), deg(35)],
        }}
      />

      <LcdMonitor
        groupProps={{ name: 'monitorLeft', position: [0.9, desktop, 0.1] }}
        width={0.6}
        height={0.3}
        depth={0.02}
        standWidth={0.05}
        standDepth={0.03}
        standHeight={0.05}
        color={palette.monitor}
        standColor={palette.monitor}
        screenColor={palette.screen}
        screenTextColor={palette.screenText}
        screenText={screenText}
        lightColor={palette.screenLight}
        lightIntensity={1}
      />
      <LcdMonitor
        groupProps={{
          name: 'monitorRight',
          position: [0.35, desktop, 0.33],
          rotation: [0, Math.PI/4, 0],
        }}
        width={0.6}
        height={0.3}
        depth={0.02}
        standWidth={0.05}
        standDepth={0.03}
        standHeight={0.05}
        color={palette.monitor}
        standColor={palette.monitor}
        screenColor={palette.screen}
        screenTextColor={palette.screenText}
        screenText={screenText}
        lightColor={palette.screenLight}
        lightIntensity={1}
      />

      <Keyboard
        color={palette.keyboard}
        keyColor={palette.keyboardKey}
        groupProps={{
          name: 'keyboard',
          position: [0.74, desktop, 0.3]
        }}
      />

      <Trackpad
        color={palette.keyboard}
        heightLow={0.005}
        heightHigh={0.001}
        groupProps={{
          name: 'trackpad',
          position: [1.00, desktop + 0.003, 0.3],
          rotation: [Math.PI / 1.99, 0, 0],
        }}
      />

      <Book
        toon={toon}
        pageColor={palette.book?.page}
        coverColor={palette.book?.cover}
        groupProps={{
          name: 'book',
          position: [0.45, desktop, 1],
          scale: [0.01, 0.01, 0.01]
        }}
      />

      <Papers
        color={palette.papers}
        groupProps={{
          name: 'papers',
          position: [1.6, desktop, 0.2],
        }}
      />

      <Mug
        color={palette.mug}
        steamColor={palette.mugSteam}
        groupProps={{
          name: 'mug',
          position: [1, desktop, 0.5],
          scale: [0.3, 0.3, 0.3],
        }}
      />

      <Lamp
        baseHeight={0.018}
        baseRadius={0.02}
        armRadius={0.006}
        color={palette.lamp}
        lightColor={palette.lampLight}
        lightIntensity={0.03}
        headRadius={0.08}
        headLength={0.12}
        headAngle={deg(220)}
        joints={[
          { angle: -Math.PI / 1.2, length: 0.2 },
          { angle: -Math.PI / 2.8, length: 0.3 },
        ]}
        groupProps={{
          name: 'lamp',
          position: [0.08, desktop, 1.18],
        }}
      />

      <WebCamera
        color={palette.webCameraHolder}
        cameraColor={palette.webCamera}
        groupProps={{
          name: 'webCamera',
          position: [1.78, desktop, 0.05],
          rotation: [0, -Math.PI / 2.3, 0],
        }}
      />
    </group>
  );
};

const ShelfWithStuff = (props: ThreeElements['group'] & { palette: Palette }) => {
  const wx = 0.18;
  const wall = -wx / 2;
  const { palette } = props;
  return (
    <group name="shelfGroup" {...props}>
      <Shelf
        depth={wx}
        thickness={0.025}
        color={palette.shelf}
        groupProps={{
          name: 'shelf',
          rotation: [Math.PI / 2, 0, Math.PI / 2],
        }}
      />
      <PictureFrame
        frameColor={palette.pictureFrame}
        picture={palette.pictureFramePicture}
        groupProps={{
          name: 'pictureFrame',
          position: [wall + 0.02, 0.17, 0.3],
          rotation: [Math.PI / 2, Math.PI / 1.85, 0],
        }}
      />
      <Clock
        color={palette.clock}
        arrowColor={palette.clockArrow}
        radius={0.15}
        depth={0.05}
        groupProps={{
          name: 'clock',
          position: [wall, 0.17, -0.2],
          rotation: [0, 0, DEG90],
        }}
      />
      <Microphone
        color={palette.microphone}
        netColor={palette.microphoneLight}
        headRotation={[DEG90, deg(-70), 0]}
        groupProps={{
          name: 'microphone',
          position: [wx / 2 - 0.01, -0.01, 0],
          rotation: [Math.PI / 2, 0, deg(90 + 20)],
        }}
      />
    </group>
  );
};

const RoomScene = ({ palette, objects, groupProps, children, toon }: {
  palette: Palette,
  toon?: boolean,
  objects?: ThemeObjects,
  children?: React.ReactNode,
  groupProps?: ThreeElements['group'],
}) => {
  const { height = 3, width = 5, depth = 5 } = objects?.room || {};
  return (
    <group name="room" {...groupProps}>
      <Walls
        height={height}
        width={width}
        depth={depth}
        showCeiling={objects?.room?.showCeiling}
        showWindow={objects?.room?.showWindow}
        showRightWall={objects?.room?.showRightWall}
        showFloorHeight={objects?.room?.showFloorHeight}
        floorHeight={objects?.room?.floorHeight}
        wallThickness={objects?.room?.wallThickness}
        showWindowGlass={false}
        palette={palette}
      />

      <DeskWithStuff palette={palette} position={[-width / 2, 0.35, -depth / 2]} toon={toon} />
      <ShelfWithStuff palette={palette} position={[-width / 2 + 0.1, 0.8, -depth / 2 + 0.6]} />
      <Chair
        cushionColor={palette.chairCushion}
        baseColor={palette.chairBase}
        groupProps={{
          name: 'chair',
          position: [-width / 2 + 0.9, 0.005, -depth / 2 + 0.7],
          scale: v3(0.5),
        }}
      />

      {children}
    </group>
  );
};



export const Room = (props: {
  theme: Theme,
  wallText: string,
  groupProps?: ThreeElements['group'],
}) => {
  const { name: themeKey, palette, objects, light, materialProps, children } = props.theme;
  const { height = 3, width = 5, depth = 5 } = objects?.room || {};
  const frontWall = v3(-width / 2, 0.35, -depth / 2);

  return (
    <MaterialContext.Provider value={materialProps || { type: 'standard' }}>
      {/* <BakeShadows key={themeKey + props.wallText} /> */}

      <RoomScene
        palette={palette}
        objects={objects}
        toon={materialProps?.type === 'toon'}
        groupProps={{ position: objects?.room?.position, rotation: objects?.room?.rotation }}
      >
        <Text
          font={palette.wallTextFont}
          color={palette.wallText}
          text={props.wallText}
          size={0.20}
          thickness={0.01}
          lineGap={1.2}
          groupProps={{
            name: 'wallText',
            position: add(frontWall, v3({ x: 0.1, y: 1, z: 0.01 })),
          }}
        />
        {light && <ThemeLight {...light} />}
      </RoomScene>
      {children}
    </MaterialContext.Provider>
  );
};
