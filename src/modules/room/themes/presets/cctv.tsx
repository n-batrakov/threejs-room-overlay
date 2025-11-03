import React from 'react';
import { Theme } from '../types';
import { OverlayPlane } from '~/components/OverlayPlane';
import { ChromaticAberration, Pixelation } from '@react-three/postprocessing';
import { createDefaultAnimations, DEFAULT_LIGHT, DEFAULT_OBJECTS, DEFAULT_PALETTE } from '../defaults';
import * as PIXI from 'pixi.js';
import { PixiMaterial, PixiMaterialContext } from '~/components/PixiMaterial';
import { CRTFilter } from 'pixi-filters';

export const cctvOverlay = ({ width, height }: PixiMaterialContext) => {
  const container = new PIXI.Container();
  const padding = 10;
  const borderLength = height / 4;
  const borderThickness = 10;
  const color = 0xffffff;
  const bgColor = 0x000000;
  const left = padding + borderThickness + 10;
  const right = width - padding - borderThickness - 10;
  const top = padding + borderThickness + 10;
  const bottom = height - padding - borderThickness - 10;

  container.addChild(new PIXI.Graphics().rect(0, 0, width, height).fill({ color: '#808080', alpha: 0.1 }));

  // Borders
  // top-left
  container.addChild(new PIXI.Graphics().rect(padding, padding, borderLength, borderThickness).fill(color));
  container.addChild(new PIXI.Graphics().rect(padding, padding, borderThickness, borderLength).fill(color));
  // top-right
  container.addChild(new PIXI.Graphics().rect(width - padding - borderLength, padding, borderLength, borderThickness).fill(color));
  container.addChild(new PIXI.Graphics().rect(width - padding - borderThickness, padding, borderThickness, borderLength).fill(color));
  // bottom-left
  container.addChild(new PIXI.Graphics().rect(padding, height - padding - borderThickness, borderLength, borderThickness).fill(color));
  container.addChild(new PIXI.Graphics().rect(padding, height - padding - borderLength, borderThickness, borderLength).fill(color));
  // bottom-right
  container.addChild(new PIXI.Graphics().rect(width - padding - borderLength, height - padding - borderThickness, borderLength, borderThickness).fill(color));
  container.addChild(new PIXI.Graphics().rect(width - padding - borderThickness, height - padding - borderLength, borderThickness, borderLength).fill(color));

  // REC
  const recCircle = new PIXI.Graphics().circle(left + 20, top + 20, 12).fill({ color: 0xff0000 });
  container.addChild(recCircle);
  container.addChild(new PIXI.Text({
    text: 'REC',
    x: left + 20 + 12 + 10,
    y: top + 7,
    style: {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: color,
      fontWeight: 'bold',
    },
  }));

  // Timestamp
  container.addChild(new PIXI.Graphics().rect(right - 120, top, 120, 30).fill({ color: bgColor, alpha: 0.9 }));
  const timestampText = new PIXI.Text({
    text: new Date().toLocaleTimeString(),
    x: right - 120 + 10,
    y: top,
    style: {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: color,
      fontWeight: 'bold',
    },
  });
  container.addChild(timestampText);

  // CCTV label
  container.addChild(new PIXI.Text({
    text: 'CCTV 01',
    x: width / 2 - 50,
    y: height - 30,
    style: {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: color,
      fontWeight: 'bold',
    },
  }));

  const crtFilter = new CRTFilter({
      lineWidth: 5,
      lineContrast: 1,
      noise: 0.1,
      noiseSize: 0.1,
      vignetting: 0,
      curvature: 2,
    });
  container.filters = [
    crtFilter,
  ];

  return (renderer: PIXI.Renderer, dt: number) => {
    recCircle.alpha = new Date().getSeconds() % 2 === 0 ? 0 : 1;
    timestampText.text = new Date().toLocaleTimeString();

    container.filters.forEach((filter: any) => {
      filter.time += dt;
      filter.seed = Math.random();
    });

    renderer.render({ container });
  };
};


export default {
  name: 'CCTV',
  palette: DEFAULT_PALETTE,
  objects: DEFAULT_OBJECTS,
  light: DEFAULT_LIGHT,
  fog: <OverlayPlane><PixiMaterial component={cctvOverlay} /></OverlayPlane>,
  effects: (
    <>
      <Pixelation granularity={3} />
      <ChromaticAberration offset={[0.005, 0.005]}  />
      {/* <Scanline blendFunction={BlendFunction.OVERLAY} density={0.5} opacity={0.2} /> */}
    </>
  ),
  animate: createDefaultAnimations(),
} as Theme;
