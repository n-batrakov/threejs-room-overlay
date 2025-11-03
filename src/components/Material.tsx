import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import { TextureMapOptions, useTextureMap } from '~/lib/useTextureMap';
import { asset } from '~/lib';

export const parseTexturePath = (value: string, ext: string) => {
  const path = value.substring(1);
  const isFile = (/\.\w+$/gi).test(path);
  if (isFile) return { mapPath: asset(path) };

  const prefix = path.split('/').slice(-1)[0];
  const getPath = (file: string) => asset(`${path}/${prefix}_${file}.${ext}`);
  return {
    mapPath: getPath('color'),
    displacementPath: getPath('displacement'),
    normalPath: getPath('normalgl'),
    roughnessPath: getPath('roughness'),
  };
}

const DEFAULT_VALUE: ThemeSettings = {
  texture: '',
  color: '#fff',
  emissive: '#fff',
  emissiveIntensity: 0,
  visible: true,
};
export const parseThemeMaterialValue = (x: ThemeMaterialValue): ThemeSettings => {
  if (!x) return DEFAULT_VALUE;
  if (typeof x === 'object') return { ...DEFAULT_VALUE, ...x };
  if (typeof x === 'string' && x.startsWith('@')) return { ...DEFAULT_VALUE, texture: x };
  if (typeof x === 'string') return { ...DEFAULT_VALUE, color: x };
  throw new Error(`Unsuported theme material value: ${x}`);
};

export type ThemeMaterialProps =
  | ({ type: 'standard' } & ThreeElements['meshStandardMaterial'])
  | ({ type: 'toon'} & ThreeElements['meshToonMaterial']);

type TextureType = ThemeMaterialProps['type'];

const TextureComponent = ({ type = 'standard', ...props }: ThemeMaterialProps) => {
  switch (type) {
    case 'toon': return <meshToonMaterial {...props} />
    default: return <meshStandardMaterial {...props} />
  }
}

export const MaterialContext = React.createContext<ThemeMaterialProps>({ type: 'standard' });

type ThemeSettings = {
  texture?: string,
  mapPath?: string,
  displacementPath?: string,
  normalPath?: string,
  roughnessPath?: string,
  textureOptions?: TextureMapOptions,
} & ThreeElements['meshStandardMaterial'];
export type ThemeMaterialValue = string | ThemeSettings;

export const ThemeMaterial = ({
  value,
  ext = 'png',
  textureOptions: propsTextureOptions,
  ignoreColor,
  ignoreDisplacement,
  ignoreNormal,
  ignoreRoughness,
  ...materialProps
}: {
  value: ThemeMaterialValue,
  ext?: string,
  type?: TextureType,
  textureOptions?: TextureMapOptions,
  ignoreColor?: boolean,
  ignoreDisplacement?: boolean,
  ignoreNormal?: boolean,
  ignoreRoughness?: boolean,
} & ThreeElements['meshStandardMaterial']) => {
  const contextProps = React.useContext(MaterialContext);
  const theme = React.useMemo(
    () => {
      const theme = parseThemeMaterialValue(value);
      const texture = theme.texture ? parseTexturePath(theme.texture, ext) : undefined;
      return { ...theme, ...texture };
    },
    [value, ext],
  );
  const { color, displacementPath, mapPath, normalPath, roughnessPath, textureOptions: themeTextureOptions, ...themeProps } = theme;
  const textureOptions = React.useMemo(() => ({ ...propsTextureOptions, ...themeTextureOptions }), [propsTextureOptions, themeTextureOptions]);

  return (
    <TextureComponent
      key={mapPath || color}
      displacementScale={0}
      {...contextProps}
      {...materialProps as any}
      {...themeProps as any}
      color={color}
      map={useTextureMap(mapPath, textureOptions, ignoreColor)}
      displacementMap={useTextureMap(displacementPath, textureOptions, ignoreDisplacement)}
      normalMap={useTextureMap(normalPath, textureOptions, ignoreNormal)}
      roughnessMap={useTextureMap(roughnessPath, textureOptions, ignoreRoughness)}
    />
  );
};
