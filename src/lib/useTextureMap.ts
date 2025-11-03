import { useLoader } from "@react-three/fiber";
import { RepeatWrapping, Texture, TextureLoader } from "three";

export type TextureMapOptions = {
  repeat?: number,
  rotation?: number,
  center?: [number, number],
  effect?: (x: Texture) => void,
};

export const useTextureMap = (path?: string, opts?: TextureMapOptions, ignore?: boolean) => {
  if (ignore || !path) return null!;

  const texture = useLoader(TextureLoader, path);

  if (opts?.repeat) {
    const [x, y] = Array.isArray(opts.repeat) ? opts.repeat : [opts.repeat, opts.repeat];
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(x, y);
  }
  if (opts?.center) {
    texture.center.set(...opts?.center);
  }
  if (opts?.rotation) {
    texture.rotation = opts?.rotation;
  }
  if (opts?.effect) {
    opts.effect(texture);
  }
  return texture;
};
