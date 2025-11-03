import { BufferGeometry, CatmullRomCurve3, Curve, CurvePath, CurveType, Euler, Line, LineBasicMaterial, LineCurve3, Object3D, Vector3 } from 'three';
import { RenderCallback, RootState } from '@react-three/fiber';
import { v3, V3 } from '~/lib';
import { getMeshObject } from './traverse';

export type CalcSpeedOptions = { fps?: number, animationLength?: number, frequency?: number, skew?: number };
export const calcSpeed = (curve: Curve<Vector3>, { fps = 30, animationLength = 10, frequency = 1, skew = 0.15 }: CalcSpeedOptions = {}) => {
  const pathLength = curve.getLength() + skew;
  const framesCount = (animationLength * fps) / frequency;
  return pathLength / framesCount;
};

export const smoothCurveRoute = ({ curveType = 'catmullrom' as CurveType, tension = 0.5 } = {}) =>
  (route: Vector3[], opts: RouteAnimationOptions) => new CatmullRomCurve3(route, opts.closed, curveType, tension)

export const angularCurveRoute = () => (route: Vector3[], opts: RouteAnimationOptions) => {
  const path = new CurvePath<Vector3>();
  route.forEach((x, i, xs) => {
    if (i === xs.length - 1) {
      if (opts.closed) path.closePath();
    } else {
      path.add(new LineCurve3(x, xs[i + 1]));
    }
  });
  return path;
};

const createCurve = (opts: RouteAnimationOptions) => {
  const points = opts.route?.map(x => new Vector3(...x));
  const create = opts.curve || smoothCurveRoute({});
  return create(points, opts);
};

const defaultUpdater = (obj: Object3D, point: Vector3) => {
  obj.position.copy(point);
};

const createDebugRoute = (opts: RouteAnimationOptions, segments: number) => {
  const route = opts.parent ? opts.route.map(x => opts.parent!.localToWorld(new Vector3(...x))) : opts.route.map(x => new Vector3(...x));
  const curve = (opts.curve || smoothCurveRoute())(route, opts);
  const points = curve.getPoints(segments);
  const material = new LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
  const geometry = new BufferGeometry().setFromPoints(points);

  return new Line(geometry, material);
};

export type RouteAnimation = ReturnType<typeof createRouteAnimation>;
export type RouteAnimationOptions<T extends Object3D = Object3D> = {
  closed?: boolean,
  speed?: number | CalcSpeedOptions,
  debug?: boolean,
  disable?: boolean,
  parent?: Object3D | null,
  route: V3[],
  curve?: (route: Vector3[], opts: RouteAnimationOptions<T>) => Curve<Vector3>,
  updater?: (x: T, point: Vector3, ctx: { time: number, path: Curve<Vector3>, state: RootState }) => void,
};

export const createRouteAnimation = <T extends Object3D = Object3D>(
  getOptions: RouteAnimationOptions<T> | ((state: RootState, obj: T) => RouteAnimationOptions<T>),
) => {
  let opts: RouteAnimationOptions<T> | undefined = typeof getOptions === 'function' ? undefined : getOptions;
  let path = opts ? createCurve(opts) : undefined;
  let init = false;
  let time = 0;
  let speed = 0;

  return (state: RootState, obj: T) => {
    if (!init) {
      init = true;

      if (typeof getOptions === 'function') {
        opts = getOptions(state, obj);
        path = createCurve(opts);
      }

      speed = typeof opts?.speed === 'number' ? opts.speed : calcSpeed(path!, opts?.speed);

      if (opts?.debug) {
        console.log('ROUTE LENGTH', obj.name, path!.getLength())
        state.scene.add(createDebugRoute(opts, 1 / speed));
      }
    }
    if (opts?.disable) return;
    if (!path) return;

    time += speed;
    if (time > 1) time = 0;

    const point = path.getPoint(time);
    (opts?.updater || defaultUpdater)(obj, point, { path, time, state });
  };
};

export const calcRotationAngle = (time: number, amplitude: number, frequency: number) => {
  return amplitude * Math.sin((2 * Math.PI * time) / frequency);
}
export const createRotationAnimation = ({
  amplitude = 0.1,
  frequency = 0.5,
  init = undefined as V3 | undefined,
  ignoreInit = false,
  rotateOnX = false,
  rotateOnY = false,
  rotateOnZ = false,
}) => {
  let initRotation: Euler | undefined = undefined;
  return (state: RootState, obj: Object3D) => {
    if (!initRotation) initRotation = obj.rotation;
    const time = state.clock.getElapsedTime();
    const angle = calcRotationAngle(time, amplitude, frequency);
    const base = ignoreInit ? new Euler() : init ? new Euler(...init) : initRotation;
    obj.rotation.set(
      rotateOnX ? base.x + angle : obj.rotation.x,
      rotateOnY ? base.y + angle : obj.rotation.y,
      rotateOnZ ? base.z + angle : obj.rotation.z,
    );
  };
}

export const createSceneAnimations = (defaultAnimations: RenderCallback, config: { [name: string]: RouteAnimation }): RenderCallback => {
  const objStore = {} as { [name: string]: Object3D };
  return (state, dt) => {
    defaultAnimations(state, dt);
    Object.entries(config).forEach(([name, animate]) => {
      const obj = name === 'camera' ? state.camera : objStore[name] || getMeshObject(state.scene, name);
      if (obj && !objStore[name] && name !== 'camera') {
        objStore[name] = obj;
      }
      if (obj) {
        animate(state, obj);
      }
    });
  };
}

export const pipeAnimations = (...animations: RenderCallback[]): RenderCallback => (state, dt) => {
  animations.forEach(f => f(state, dt));
};
