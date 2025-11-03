import { RenderCallback, RootState } from '@react-three/fiber';
import { Zip, ZipPassThrough } from 'fflate';
import { Clock } from 'three';

export const createStaticClock = (elapsedTime: number, delta: number): Clock => ({
  elapsedTime,
  autoStart: false,
  running: false,
  oldTime: 0,
  startTime: 0,
  getDelta: () => delta,
  getElapsedTime: () => elapsedTime,
  start: () => {},
  stop: () => {},
});

const waitForNextFrame = () => new Promise(requestAnimationFrame);
const toBlobAsync = (canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob | null> => new Promise(res => canvas.toBlob(res, type, quality));
const renderFrame = async (three: RootState, animate: RenderCallback, frame: number, delta: number): Promise<Blob | null> => {
  const clock = createStaticClock(frame, delta);
  animate({ ...three, clock }, clock.getDelta());
  await waitForNextFrame();
  return await toBlobAsync(three.gl.domElement, 'image/png');
};

export const recordSingleFrame = (three: RootState, animate: RenderCallback) => {
  return renderFrame(three, animate, 0, 0);
};

const digitCount = (n: number): number => n === 0 ? 1 : Math.floor(Math.log10(Math.abs(n))) + 1

export const recordFramesAsync = async (
  three: RootState,
  animate: RenderCallback,
  opts?: {
    lengthSeconds?: number,
    fps?: number,
    abortSignal?: AbortSignal,
    onProgress?: (second: number, totalSeconds: number) => void,
  },
): Promise<ReadableStream> => {
  const length = opts?.lengthSeconds ?? 60;
  const fps = opts?.fps ?? 60;
  const timePerFrame = 1 / fps;
  const totalFrames = fps * length;
  const padLength = Math.max(digitCount(totalFrames), 4);
  let elapsedTime = 0;

  const stream = new ReadableStream({
    start: async (controller) => {
      const zip = new Zip((err, data, final) => {
        if (err) {
          console.error(err);
          throw err;
        }
        controller.enqueue(data);
        if (final) controller.close();
      });

      for (let frame = 0; frame <= totalFrames; frame++) {
        if (opts?.abortSignal) opts.abortSignal.throwIfAborted();
        if (opts?.onProgress) opts.onProgress(Math.floor(frame / fps), length);

        elapsedTime += timePerFrame;
        const blob = await renderFrame(three, animate, elapsedTime, timePerFrame);
        if (!blob) continue;
        const arrayBuffer = await blob.arrayBuffer();

        const filename = `frame_${(frame).toString().padStart(padLength, '0')}.png`;
        const file = new ZipPassThrough(filename);
        zip.add(file);
        file.push(new Uint8Array(arrayBuffer), true);
      }
      zip.end();
    },
  });

  return stream;
};
