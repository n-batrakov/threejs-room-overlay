export type T3<T> = [T, T, T];
export type V3 = T3<number>;

type V3Arg = number | V3 | { x?: number, y?: number, z?: number };
export const v3 = (x?: V3Arg, y?: number, z?: number): V3 => {
  if (Array.isArray(x)) return [...x];
  if (typeof x === 'object') return [x?.x || 0, x?.y || 0, x?.z || 0];
  if (x === undefined) return [0, 0, 0];
  if (y === undefined) return [x, x, x];
  if (z === undefined) return [x, y, x];
  return [x, y, z];
};

export const apply = (operator: (a: number, b: number) => number) => (left: V3Arg, right: V3Arg): V3 => {
  const a = v3(left);
  const b = v3(right);
  return [
    operator(a[0], b[0]),
    operator(a[1], b[1]),
    operator(a[2], b[2]),
  ];
};

export const add = apply((a, b) => a + b);
export const sub = apply((a, b) => a - b);
export const mul = apply((a, b) => a * b);
export const div = apply((a, b) => a / b);
export const set = (a: V3Arg, b: { x?: number, y?: number, z?: number }): V3 => {
  const [x, y, z] = v3(a);
  return [b?.x ?? x, b?.y ?? y, b?.z ?? z];
}
