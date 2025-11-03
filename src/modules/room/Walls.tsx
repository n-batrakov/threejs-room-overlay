import { ThreeElements } from '@react-three/fiber';
import React from 'react';
import { BoxGeometry, DoubleSide, Mesh, Path, Shape } from 'three';
import { CSG } from 'three-csg-ts';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';
import { add, DEG90, v3 } from '~/lib';
import { BeveledBoxGeometry, createBeveledBoxGeometry } from '~/geometry/Box';
import { Palette } from './themes/types';
import { Curtain } from './Curtains';

const WindowFrame = ({
  color = '#fff' as ThemeMaterialValue,
  height = 1,
  width = 1,
  depth = 0.04,
  frameWidth = 0.05,
  showGlass = true,
  groupProps = {} as ThreeElements['group'],
}) => {
  const glassGeometry = React.useMemo(() => new BoxGeometry(width - frameWidth * 2, height - frameWidth * 2, depth * 2), []);
  const { geometry } = React.useMemo(
    () => {
      const frame = new Mesh(createBeveledBoxGeometry({
        depth: 0,
        height,
        width,
        bevelSegments: 64,
        bevelSize: depth,
      }));
      const glass = new Mesh(glassGeometry);
      return CSG.subtract(frame, glass);
    },
    [glassGeometry],
  );
  return (
    <group {...groupProps}>
      <mesh geometry={geometry}>
        <ThemeMaterial value={color} roughness={0.8} />
      </mesh>
      {showGlass && (
        <mesh geometry={glassGeometry}>
          <meshPhysicalMaterial
            color="#fff"
            transparent
            opacity={0.3}
            roughness={0}
            metalness={0}
            transmission={1}
            thickness={0.1}
            ior={1.5}
            reflectivity={0.5}
          />
        </mesh>
      )}
    </group>
  );
};

const drawSquare = (path: Path, w: number, h: number, cx = 0, cy = 0) => {
  path.moveTo(cx - w, cy - h);
  path.lineTo(cx + w, cy - h);
  path.lineTo(cx + w, cy + h);
  path.lineTo(cx - w, cy + h);
  path.lineTo(cx - w, cy - h);
};

const Window = ({ showGlass = true,
  color = '#fff' as ThemeMaterialValue,
  windowsillColor = '#fff' as ThemeMaterialValue,
  curtainsColor = '#fff'  as ThemeMaterialValue,
  height = 1,
  width = 1,
  depth = 1,
  padding = 0.08,
  groupProps = {} as ThreeElements['group'],
}) => {
  const frameHeight = height - (padding * 2);
  const frameWidth = (width / 2) - (padding * 2);
  const leftFramePosition = v3({ x: (width - frameWidth) / 2 - padding, z: 0.05 });
  const rightFramePosition = v3({ x: -(width - frameWidth) / 2 + padding, z: 0.05 });

  const paddingPlane = React.useMemo(
    () => {
      const shape = new Shape();
      drawSquare(shape, width / 2, height / 2);

      const holeWith = frameWidth / 2;
      const holeHeight = frameHeight / 2;
      const holeOffset = (width - frameWidth) / 2 - padding;

      const leftHole = new Path();
      drawSquare(leftHole, holeWith, holeHeight, holeOffset);
      shape.holes.push(leftHole);

      const rightHole = new Path();
      drawSquare(rightHole, holeWith, holeHeight, -holeOffset);
      shape.holes.push(rightHole);

      return shape;
    },
    [],
  );

  return (
    <group {...groupProps}>
      <mesh>
        <shapeGeometry args={[paddingPlane]} />
        <ThemeMaterial value={color} side={DoubleSide} />
      </mesh>
      <WindowFrame showGlass={showGlass} color={color} height={frameHeight} width={frameWidth} groupProps={{ position: leftFramePosition }} />
      <WindowFrame showGlass={showGlass} color={color} height={frameHeight} width={frameWidth} groupProps={{ position: rightFramePosition }} />

      <mesh position={[0, -height / 2, 0]}>
        <BeveledBoxGeometry
          width={width}
          height={0.01}
          depth={depth - 0.4}
          bevelSize={0.01}
        />
        <ThemeMaterial value={windowsillColor} roughness={0.5} />
      </mesh>

      <Curtain
        height={height + 1.1}
        width={0.8}
        waveAmplitude={0.008}
        waveFequency={3}
        color={curtainsColor}
        groupProps={{ position: [-width + 1, 0, (depth / 2) + 0.15] }}
      />
      <Curtain
        height={height + 1.1}
        width={0.8}
        waveAmplitude={0.008}
        waveFequency={3}
        color={curtainsColor}
        groupProps={{ position: [width - 1, 0, (depth / 2) + 0.15] }}
      />
    </group>
  );
};

const LeftWall = ({
  showWindow = true,
  rotation = v3(0),
  wallSize = v3(1),
  windowSize = v3(1),
  winowPosition = v3(0),
  wallPosition = v3(0),
  showWindowGlass = false,
  windowsillColor = '#fff' as ThemeMaterialValue,
  windowFrameColor = '#fff' as ThemeMaterialValue,
  curtainsColor = '#fff'  as ThemeMaterialValue,
  children = undefined as React.ReactNode | undefined,
}) => {
  const { geometry } = React.useMemo(
    () => {
      const wall = new Mesh(new BoxGeometry(...wallSize));
      wall.position.set(...wallPosition);
      wall.rotation.set(...rotation);
      wall.updateMatrix();

      if (!showWindow) return wall;
      const window = new Mesh(new BoxGeometry(...windowSize));
      window.position.set(...winowPosition);
      window.rotation.set(...rotation);
      window.updateMatrix();
      return CSG.subtract(wall, window);
    },
    [showWindow, ...wallSize, ...windowSize, ...winowPosition],
  );

  return (
    <>
      <mesh geometry={geometry} position={wallPosition} rotation={rotation} receiveShadow castShadow>
        {children}
      </mesh>
      {showWindow && (
        <>
          <Window
            width={windowSize[0]}
            height={windowSize[1]}
            depth={windowSize[2]}
            showGlass={showWindowGlass}
            color={windowFrameColor}
            windowsillColor={windowsillColor}
            curtainsColor={curtainsColor}
            groupProps={{
              position: winowPosition,
              rotation: rotation,
            }}
          />
        </>
      )}
    </>
  );
};

const RightWall = ({
  rotation = v3(0),
  wallSize = v3(1),
  doorSize = v3(1),
  doorPosition = v3(0),
  wallPosition = v3(0),
  children = undefined as React.ReactNode | undefined,
}) => {
  const { geometry } = React.useMemo(
    () => {
      const wall = new Mesh(new BoxGeometry(...wallSize));
      wall.position.set(...wallPosition);
      wall.rotation.set(...rotation);
      wall.updateMatrix();

      const door = new Mesh(new BoxGeometry(...doorSize));
      door.position.set(...doorPosition);
      door.rotation.set(...rotation);
      door.updateMatrix();
      return CSG.subtract(wall, door);
    },
    [...wallSize, ...doorSize, ...doorPosition, ...rotation],
  );

  return (
    <mesh geometry={geometry} position={wallPosition} rotation={rotation} receiveShadow castShadow>
      {children}
    </mesh>
  );
};

export const Walls = ({
  showWindow = true,
  showCeiling = true,
  showRightWall = false,
  showFloorHeight = false,
  floorHeight = 10,
  height = 2,
  wallThickness = 0.6,
  depth = 10,
  width = 5,
  palette = {} as Palette,
  showWindowGlass = true,
}) => {
  const windowBottomOffset = 1.3;
  const windowRightOffset = 2.5;
  const windowSize = v3(1.5, 1.2, 1);
  return (
    <>
      {/* floor */}
      <mesh rotation={v3({ x: -DEG90 })} position={v3({ y: 0.001 })} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <ThemeMaterial value={palette.floor || '#fff'} displacementScale={0} textureOptions={{ repeat: 10 }} />
      </mesh>
      {showFloorHeight && (
        <mesh
          position={showRightWall
              ? [0, -floorHeight / 2, -wallThickness / 2]
              : [-wallThickness / 2, -floorHeight / 2, -wallThickness / 2]
          }
          receiveShadow
        >
          <boxGeometry args={showRightWall ? [width + 2 * wallThickness, floorHeight, depth + wallThickness] : [width + wallThickness, floorHeight, depth + wallThickness]} />
          <ThemeMaterial value={palette.floorHeight || '#fff'} displacementScale={0} />
        </mesh>
      )}

      {/* ceiling */}
      {showCeiling && (
        <mesh rotation={v3({ x: DEG90 })} position={[0, height + 0.01, -wallThickness / 2]} receiveShadow>
          <planeGeometry args={[width + wallThickness * 2, depth + wallThickness]} />
          <ThemeMaterial value={'#fff'} side={DoubleSide} />
        </mesh>
      )}

      {/* front wall */}
      <mesh
        position={showRightWall
          ? [0, height / 2, -(depth / 2) - (wallThickness / 2)]
          : [-wallThickness / 2, height / 2, -(depth / 2) - (wallThickness / 2)]}
        receiveShadow
      >
        <boxGeometry args={showRightWall ? [width + wallThickness * 2, height, wallThickness] : [width + wallThickness, height, wallThickness]} />
        <ThemeMaterial value={palette.frontWall || '#fff'} ignoreDisplacement ignoreNormal textureOptions={{ repeat: 10 }} />
      </mesh>

      {/* left wall */}
      <LeftWall
        rotation={v3({ y: DEG90 })}
        wallPosition={[-(width / 2) - (wallThickness / 2), height / 2, 0]}
        showWindow={showWindow}
        wallSize={[depth, height, wallThickness]}
        windowSize={windowSize}
        winowPosition={[-(width / 2) - (wallThickness / 2) - 0.2, windowBottomOffset, -(depth / 2) + windowRightOffset]}
        showWindowGlass={showWindowGlass}
        windowFrameColor={palette.windowFrame || '#fff'}
        windowsillColor={palette.windowsill || '#fff'}
        curtainsColor={palette.curtains}
      >
        <ThemeMaterial value={palette.leftWall || '#fff'} ignoreDisplacement ignoreNormal textureOptions={{ repeat: 6 }} />
      </LeftWall>

      {/* right wall */}
      {showRightWall && (
        <RightWall
          rotation={v3({ y: -DEG90 })}
          wallPosition={[(width / 2) + (wallThickness / 2), height / 2, 0]}
          wallSize={[depth, height, wallThickness]}
          doorSize={[1.2, height - 0.2, wallThickness]}
          doorPosition={[(width / 2) + (wallThickness / 2), (height - 0.2) / 2, -2]}
        >
          <ThemeMaterial value={palette.rightWall || '#fff'} ignoreDisplacement ignoreNormal textureOptions={{ repeat: 6 }} />
        </RightWall>
      )}

      {/* floor skirting */}
      <mesh position={[0, 0.035, -(depth / 2) + 0.01]}>
        <BeveledBoxGeometry width={width} height={0.05} depth={0} bevelSize={0.01} />
        <ThemeMaterial value={palette.floorSkirting || '#fff'} />
      </mesh>
      <mesh position={[-(width / 2) + 0.01, 0.035, 0]} rotation={v3({ y: DEG90 })}>
        <BeveledBoxGeometry width={depth - 0.04} height={0.05} depth={0} bevelSize={0.01} />
        <ThemeMaterial value={palette.floorSkirting || '#fff'} />
      </mesh>
    </>
  );
};
