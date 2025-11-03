import React, { Suspense } from 'react';
import { EffectComposer } from '@react-three/postprocessing';
import { Room } from './Room';
import { useTheme } from './themes/useTheme';
import { useThree } from '@react-three/fiber';
import { button, useControls } from 'leva';
import { createRecordIndicator } from '~/lib/recordIndicator';
import { ThemeTransition } from './themes/ThemeTransition';
import { persistValue } from '~/lib/useControls';
import { recordFramesAsync, recordSingleFrame } from '~/lib/recordFrames';
import { downloadBlob, downloadStream } from '~/lib/download';

let isRecording = false;
let abortController: AbortController | undefined = undefined;

export const RoomApp = () => {
  const three = useThree();
  const { theme, switchingTheme, loadingThemes } = useTheme();

  const [defaultWallText, useSaveWallText] = persistValue('wallText', 'be right\\nback');
  const { wallTextRaw } = useControls('THEME', {
    wallTextRaw: {
      label: 'Wall text',
      value: defaultWallText,
    },
  });

  const recording = useControls('RECORDING', {
    'RENDER SINGLE FRAME': button(() => {
      recordSingleFrame(three, () => {}).then(blob => downloadBlob(blob!, 'frame_0000.png'));
    }),
    'START / STOP': button(() => {
      if (!theme.animate) return;
      if (isRecording) {
        abortController?.abort('Cancel');
        return;
      }

      abortController = new AbortController();
      isRecording = true;
      const indicator = createRecordIndicator();
      recordFramesAsync(three, theme.animate, { fps: 30, lengthSeconds: 10, abortSignal: abortController.signal, onProgress: indicator.update })
        .then(stream => downloadStream(stream, 'room_frames.zip'))
        .catch(console.error)
        .finally(() => {
          indicator.stop();
          isRecording = false;
          abortController = undefined;
        });
    }),
  });
  useSaveWallText(wallTextRaw);

  const wallText = React.useMemo(() => wallTextRaw.replace(/\\n/g, '\n'), [wallTextRaw]);

  return (
    <>
      <EffectComposer enabled={!loadingThemes && !switchingTheme}>
        {theme.effects as any}
      </EffectComposer>
      {theme.fog}

      <Suspense fallback={null}>
        <ThemeTransition visible={loadingThemes || switchingTheme} />
        <Room theme={theme} wallText={wallText} />
      </Suspense>
    </>
  );
};
