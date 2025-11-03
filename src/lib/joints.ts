import { ThreeElements } from "@react-three/fiber";

export type Joint = {
  length: number,
  angle: number,
};

export type JointPosition = {
  key: number,
  length: number,
  arm: ThreeElements['mesh'],
  joint: ThreeElements['mesh'],
};

export const calcRotationPosition = ({
  axis = 'x' as 'x' | 'y' | 'z',
  angle = Math.PI / 4,
  length = 1,
  divider = 2,
  basePosition: [x, y, z] = [0, 0, 0] as [number, number, number],
}): [number, number, number] => {
  const angle2 = (Math.PI / 2) - angle;
  const dir = Math.abs(angle) > (Math.PI / 2) && Math.abs(angle) < Math.PI ? -1 : 1;
  const a = y + ((length * Math.sin(angle2) * dir) / divider);
  const b = z + ((length * Math.cos(angle2) * dir) / divider);

  switch (axis) {
    case 'x': return [x, a,  b];
    case 'y': return [a, y, -b];
    case 'z': return [a, b, z];
  }
};

export const calcJoint = (
  basePosition: [number, number, number],
  length: number,
  angle: number,
  divider: number = 2,
): [number, number, number] => {
  return calcRotationPosition({ basePosition, angle, length, divider, axis: 'x'});
};

export const calcJoints = (joints: Joint[], startPosition: [number, number, number]): JointPosition[] => {
  const coords: JointPosition[] = [];
  joints.forEach(({ angle, length }, i) => {
    const prev = i === 0 ? startPosition : coords[i - 1].joint.position as [number, number, number];
    coords.push({
      key: i,
      length,
      arm: { position: calcJoint(prev, length, angle, 2), rotation: [angle, 0, 0] },
      joint: { position: calcJoint(prev, length, angle, 1) },
    });
  });
  return coords;
};
