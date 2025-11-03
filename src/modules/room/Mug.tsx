import React, { useMemo } from 'react';
import { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { ThemeMaterial, ThemeMaterialValue } from '~/components/Material';

const SteamCurrent = ({
  pointsCount = 24,
  radius = 0.012,
  color = '#fff' as ThemeMaterialValue,
  opacity = 0.4,
}) => (
  <group name="mugSteam" position={[-0.05, 0, -0.03]}>
    {Array.from({ length: pointsCount }).map((_, i) => (
      <mesh key={i}>
        <sphereGeometry args={[radius, 12, 12]} />
        <ThemeMaterial
          value={color}
          transparent
          opacity={opacity}
          depthWrite={false}
          emissiveIntensity={0.2} />
      </mesh>
    ))}
  </group>
);

export const Mug = ({
  ref = undefined as React.RefObject<any> | undefined,
  outerRadius = 0.12,
  innerRadius = 0.10,
  height = 0.3,
  segments = 64,
  rimRadius = 0.012,
  color = '#e0e0e0' as ThemeMaterialValue,
  steamColor = '#fff' as ThemeMaterialValue,
  animate = true,
  groupProps = {} as ThreeElements['group'],
}) => {
  const thickness = outerRadius - innerRadius;
  // Mug body with rounded rim using LatheGeometry
  const mugGeometry = useMemo(() => {
    const pts = [];
    // Outer wall, bottom to top
    pts.push(new THREE.Vector2(outerRadius, 0));
    pts.push(new THREE.Vector2(outerRadius, height - rimRadius));
    // Rounded rim (outer)
    for (let i = 0; i <= 8; i++) {
      const t = (i / 8) * Math.PI;
      pts.push(
        new THREE.Vector2(
          outerRadius - rimRadius * (1 - Math.cos(t)),
          height - rimRadius + rimRadius * Math.sin(t)
        )
      );
    }
    // Inner wall, top to bottom
    pts.push(new THREE.Vector2(innerRadius, height));
    pts.push(new THREE.Vector2(innerRadius, 0));
    return pts;
  }, [outerRadius, innerRadius, height, rimRadius]);

  const geometry = useMemo(
    () => new THREE.LatheGeometry(mugGeometry, segments),
    [mugGeometry, segments]
  );

 const handle = useMemo(() => {
    const arc = Math.PI * 1.1;
    // Elliptical cross-section
    const circle = new THREE.Path();
    const crossSectionSegments = 32;
    const rx = rimRadius * 1.3;
    const ry = rimRadius * 0.6;
    for (let i = 0; i <= crossSectionSegments; i++) {
      const t = (i / crossSectionSegments) * Math.PI * 2;
      const x = Math.cos(t) * rx;
      const y = Math.sin(t) * ry;
      if (i === 0) circle.moveTo(x, y);
      else circle.lineTo(x, y);
    }
    const points = circle.getPoints();
    const shape = new THREE.Shape(points);

    // 3D arc path for handle
    const handleRadius = (outerRadius + innerRadius) / 2.5;
    const handleCenterY = height * 0.55;
    const handlePoints: THREE.Vector3[] = [];
    const steps = 64;
    for (let i = 0; i <= steps; i++) {
      const t = -arc / 2 + (arc * i) / steps;
      const x = Math.cos(t) * handleRadius;
      const y = handleCenterY + Math.sin(t) * handleRadius;
      const z = 0;
      handlePoints.push(new THREE.Vector3(x, y, z));
    }
    const handlePath = new THREE.CatmullRomCurve3(handlePoints);

    // Extrude the elliptical shape along the 3D arc path
    return new THREE.ExtrudeGeometry(shape, {
      steps: 64,
      extrudePath: handlePath,
      bevelEnabled: false,
    });
  }, [outerRadius, innerRadius, rimRadius, height]);

  const material = (
    <ThemeMaterial value={color} roughness={0.2} />
  );

  return (
    <group ref={ref} {...groupProps}>
      {/* Mug body */}
      <mesh geometry={geometry} castShadow receiveShadow>
        {material}
      </mesh>
      {/* Mug bottom */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[innerRadius + thickness, innerRadius + thickness, 0.01, segments]} />
        {material}
      </mesh>
      {/* Handle */}
      <mesh
        geometry={handle}
        position={[outerRadius * 0.95, 0, 0]}
        castShadow
        receiveShadow
      >
        {material}
      </mesh>

      {/* Liquid */}
      <mesh position={[0, height - 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[innerRadius]} />
        <ThemeMaterial value="#655748" roughness={0.1} />
      </mesh>
      {animate && (
        <SteamCurrent
          pointsCount={64}
          radius={0.1}
          color={steamColor}
          opacity={0.1}
        />
      )}
    </group>
  );
};
