import React from 'react';
import { Theme } from './types';
import { THEMES } from './presets';
import { useControls } from 'leva';
import { themeSaver } from './utils';
import { persistValue, useObjectControl } from '~/lib/useControls';
import { DEFAULT_LIGHT, DEFAULT_OBJECTS, DEFAULT_PALETTE } from './defaults';
import { useFrame } from '@react-three/fiber';

export const useTheme = () => {
  const { saveTheme, defaultTheme } = React.useMemo(() => themeSaver(THEMES), []);
  const [switchingTheme, setSwitchingTheme] = React.useState(false);
  const [theme, setThemeRaw] = React.useState(defaultTheme || THEMES[0]);

  const setTheme = React.useCallback(
    (theme: Theme | ((x: Theme) => Theme) | string) => {
      if (typeof theme === 'string') {
        theme = THEMES.find(x => x.name === theme)!;
        if (!theme) return;
      }
      setThemeRaw(theme);
      setSwitchingTheme(true);
      setTimeout(() => setSwitchingTheme(false), 1e3);
    },
    [],
  );

  React.useEffect(() => saveTheme(theme), [theme]);

  const [defaultAnimate, useSaveAnimate] = persistValue('animate', true);
  const { animate } = useControls('THEME', {
    themeKey: {
      label: 'Theme',
      value: theme.name,
      options: THEMES.map(x => x.name),
      onChange: setTheme,
    },
    animate: {
      label: 'Use theme animations',
      value: defaultAnimate,
    },
  });
  useSaveAnimate(animate);

  useFrame(
    (state, dt, frame) => {
      if (theme.animate && animate) theme.animate(state, dt, frame);
    },
  );

  const palette = useObjectControl('PALETTE', DEFAULT_PALETTE, theme.palette);
  const objects = useObjectControl('OBJECTS', DEFAULT_OBJECTS, theme.objects);
  const light = useObjectControl('LIGHT', DEFAULT_LIGHT, theme.light);
  const themeAugmented = React.useMemo(() => ({ ...theme, palette, objects, light }), [theme, palette, objects, light]);

  return {
    theme: themeAugmented,
    setTheme,
    switchingTheme,
    loadingThemes: false,
  };
};
