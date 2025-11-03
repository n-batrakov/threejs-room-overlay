import type { Mesh, MeshStandardMaterial, Object3D } from "three";

export function getMeshObject<TValue extends Object3D = Mesh<any, MeshStandardMaterial>>(container: Object3D, name: string): TValue {
  return container.getObjectByName(name) as any;
}
