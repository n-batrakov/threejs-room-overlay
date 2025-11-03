import React from 'react';
import { Renderer, WebGLRenderer } from 'pixi.js';
import { useFrame, useThree } from '@react-three/fiber';
import { Texture } from 'three';

export type PixiMaterialContext = {
  width: number,
  height: number,
};
export const PixiMaterial = (props: {
  render?: (x: Renderer, dt: number) => void,
  component?: (x: PixiMaterialContext) => (x: Renderer, dt: number) => void,
}) => {
  const [width, height] = useThree(x => [x.size.width, x.size.height]);

  const [texture, setTexture] = React.useState<Texture | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(
    () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvasRef.current = canvas;
      setTexture(new Texture(canvas));
    },
    [],
  );

  const [renderer, setRenderer] = React.useState<Renderer | undefined>(undefined);
  React.useEffect(
    () => {
      const renderer = new WebGLRenderer();
      renderer.init({
        width: width,
        height: height,
        canvas: canvasRef.current!,
        backgroundAlpha: 0,
        antialias: true,
      }).then(() => setRenderer(renderer));
    },
    [],
  );
  React.useEffect(
    () => {
      if (!renderer) return;
      renderer.resize(width, height);

      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    },
    [renderer, width, height],
  );

  const render = React.useMemo(
    () => {
      if (props.render) return props.render;
      if (props.component) return props.component({ width, height });
      return () => {
        console.warn('Either `render` or `component` should be specified for PixiMaterial. Otherwise nothing gets rendered');
      };
    },
    [width, height, props.render, props.component],
  );

  React.useEffect(
    () => {
      if (!renderer) return undefined;
      const handle = requestAnimationFrame(function loop(timeDelta) {
        render(renderer, timeDelta);
        requestAnimationFrame(loop);
      });
      return () => cancelAnimationFrame(handle);
    },
    [renderer, render, width, height],
  );

  useFrame(() => {
    if (texture && canvasRef.current) {
      texture.needsUpdate = true;
    }
  });

  return texture ? <meshBasicMaterial map={texture} transparent /> : null;
};
