# Room overlay

A 3D room visualization project built with React Three.

Made for fun primarily to record .webm videos to use as Streamlabs overlay.

![Preview](./preview.png)

## Interesting bits

Browser's `HTMLCanvasElement.captureStream()` provides poor video quality (as of 2025).
So I've decided to collect bunch of individual frames to encode them into video later on.

To collect frames without massive memory-load I used browser's `ReadableStream` and `fflate` lib
which allowed to stream resulting ZIP-archive without storing all the frames in-memory.

Then I encode a video on OS from individual frames using `ffmpeg`. The process is automated with simple script.

* [Recording, streaming and zipping](./src/lib/recordFrames.ts)
* [`recordFrames` usage](./src/modules/room/App.tsx#L42)
* [Encoding script](./scripts/encode.sh)

## Credits

See [credits.md](./credits.md) for third-party assets and attributions.
