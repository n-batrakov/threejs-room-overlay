import React from "react";
import { Theme } from "./types";
import { THEMES } from "./presets";
import { parseTexturePath, parseThemeMaterialValue } from "~/components/Material";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export const themeSaver = (themes: Theme[]) => {
  const key = 'theme';
  const defaultThemeKey = window.localStorage.getItem(key);
  const defaultTheme = defaultThemeKey ? themes.find(x => x.name === defaultThemeKey) : undefined;
  const saveTheme = (theme: Theme) => window.localStorage.setItem(key, theme.name);
  return { defaultTheme, saveTheme };
};

export const useTextureEagerLoader = ({ enabled = true }) => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(
    () => {
      if (!enabled) return;

      const texturePaths = Array.from(new Set(THEMES
        .flatMap(x => Object.values(x.palette))
        .flatMap(x => {
          const { texture } = parseThemeMaterialValue(x as any);
          const { mapPath, displacementPath, normalPath, roughnessPath }  = texture ? parseTexturePath(texture, 'png') : {};
          return [mapPath, displacementPath, normalPath, roughnessPath] as string[];
        })
        .filter(Boolean))
        .values());

      if (texturePaths.length === 0) return;

      setLoading(true);
      useLoader.preload(TextureLoader, texturePaths, x => {
        x.manager.onLoad = () => setLoading(false);
      });
    },
    [],
  );
  return loading;
};

export const useThemeAggressiveLoader = (defaultTheme: Theme, setTheme: (x: Theme) => void, { enabled = true, interval = 2e3 }) => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(
    () => {
      if (!enabled) return;

      setLoading(true);
      let idx = 0;
      setTimeout(
        function loop() {
          console.log(idx, THEMES[idx]?.name || 'EXIT');
          if (idx === THEMES.length) {
            setLoading(false);
            setTheme(defaultTheme);
            return;
          }

          setTheme(THEMES[idx++]);
          setTimeout(loop, interval);
        },
        interval,
      );
    },
    [],
  );
  return loading;
};

export const useThemeAutoSwitch = (
  primeTheme: Theme,
  setTheme: (x: Theme | ((x: Theme) => Theme)) => void,
  {
    enable = true,
    primeThemeMaxLengthMs = 10e3,
    altThemeMaxLengthMs = 10e3,
  } = {},
) => {
  React.useEffect(
    () => {
      if (!enable) return undefined;

      let prevTheme = primeTheme;
      let timeout: any = undefined;

      function loop() {
        timeout = setTimeout(
          () => {
            const nextIdx = Math.round(Math.random() * 10) % THEMES.length;
            const next = THEMES[nextIdx];
            if (next.name !== prevTheme.name) {
              prevTheme = next;
              setTheme(next);
            }
            timeout = setTimeout(
              () => {
                if (prevTheme.name !== primeTheme.name) {
                  setTheme(primeTheme);
                }
                loop();
              },
              Math.random() * altThemeMaxLengthMs,
            );
          },
          Math.random() * primeThemeMaxLengthMs,
        );
      }

      loop();
      return () => clearTimeout(timeout);
    },
    [enable],
  );
};
