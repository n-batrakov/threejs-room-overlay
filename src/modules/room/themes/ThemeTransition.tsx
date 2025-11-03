import React from 'react';
import { useThree } from '@react-three/fiber';
import * as PIXI from 'pixi.js';
import { CRTFilter } from 'pixi-filters';
import { OverlayPlane } from '~/components/OverlayPlane';
import { PixiMaterial, PixiMaterialContext } from '~/components/PixiMaterial';

const useThemeTransition = () => {
  const { width, height } = useThree(x => x.size)
  const container = React.useMemo(
    () => {
      const container = new PIXI.Container();
      const crtFilter = new CRTFilter({
        lineWidth: 3,
        lineContrast: 1,
        noise: 0.3,
        noiseSize: 3,
      });
      container.filters = [crtFilter];

      container.addChild(new PIXI.Graphics().rect(0, 0, width, height).fill('#5f317d'));
      return container;
    },
    [width, height],
  );

  return React.useCallback(
    (renderer: PIXI.Renderer, dt: number) => {
      container.filters.forEach((filter: any) => {
        filter.time += dt;
        filter.seed = Math.random();
      });

      renderer.render(container);
    },
    [container],
  );
};

export const ThemeTransition = ({ visible = false }) => {
  const themeTransition = useThemeTransition();

  return (
    <OverlayPlane visible={visible}>
      <PixiMaterial render={themeTransition} />
    </OverlayPlane>
  );
};
