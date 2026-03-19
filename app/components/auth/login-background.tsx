"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ThemePalette = {
  accent: string;
  edge: string;
  line: string;
  paper: string;
  shadow: string;
  tint: string;
};

type AnimatedDocument = {
  baseX: number;
  baseY: number;
  baseZ: number;
  drift: number;
  group: THREE.Group;
  material: THREE.MeshBasicMaterial;
  shadowMaterial: THREE.MeshBasicMaterial;
  speed: number;
  texture: THREE.CanvasTexture;
  tilt: number;
  variant: number;
};

function getThemeColor(variableName: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return value || fallback;
}

function getThemePalette(): ThemePalette {
  const isDark =
    document.documentElement.dataset.theme === "dark" || document.body.dataset.theme === "dark";

  return {
    accent: getThemeColor("--accent", isDark ? "#7d96b3" : "#4e6685"),
    edge: isDark ? "rgba(188, 202, 220, 0.34)" : "rgba(57, 75, 98, 0.22)",
    line: isDark ? "rgba(204, 214, 225, 0.2)" : "rgba(68, 85, 108, 0.14)",
    paper: isDark ? "rgba(35, 42, 51, 0.84)" : "rgba(255, 255, 255, 0.88)",
    shadow: isDark ? "rgba(1, 4, 8, 0.22)" : "rgba(24, 32, 42, 0.08)",
    tint: isDark ? "rgba(125, 150, 179, 0.12)" : "rgba(78, 102, 133, 0.08)"
  };
}

function roundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawLines(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  widths: number[],
  lineHeight: number,
  gap: number,
  color: string
) {
  context.fillStyle = color;
  widths.forEach((width, index) => {
    context.beginPath();
    context.roundRect(x, y + (index * (lineHeight + gap)), width, lineHeight, lineHeight / 2);
    context.fill();
  });
}

function drawCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  opacity = 1
) {
  context.save();
  context.globalAlpha = opacity;
  context.fillStyle = fill;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawChip(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  opacity = 1
) {
  context.save();
  context.globalAlpha = opacity;
  context.fillStyle = fill;
  context.beginPath();
  context.roundRect(x, y, width, height, height / 2);
  context.fill();
  context.restore();
}

function createDocumentTexture(
  palette: ThemePalette,
  variant: number
) {
  const canvas = document.createElement("canvas");

  canvas.width = 900;
  canvas.height = 1240;

  const context = canvas.getContext("2d");

  if (!context) {
    const fallbackTexture = new THREE.CanvasTexture(canvas);

    fallbackTexture.colorSpace = THREE.SRGBColorSpace;
    return fallbackTexture;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();

  roundedRectPath(context, 90, 72, 720, 1050, 52);
  context.fillStyle = palette.paper;
  context.strokeStyle = palette.edge;
  context.lineWidth = 3;
  context.shadowColor = palette.shadow;
  context.shadowBlur = 42;
  context.shadowOffsetY = 18;
  context.fill();
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;
  context.stroke();

  const gradient = context.createLinearGradient(90, 72, 810, 1122);

  gradient.addColorStop(0, palette.tint);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  roundedRectPath(context, 90, 72, 720, 1050, 52);
  context.fillStyle = gradient;
  context.fill();

  context.beginPath();
  context.moveTo(640, 72);
  context.lineTo(810, 72);
  context.lineTo(810, 240);
  context.closePath();
  context.fillStyle = palette.tint;
  context.fill();
  context.strokeStyle = palette.edge;
  context.stroke();

  drawLines(context, 148, 162, [230, 162], 20, 18, palette.line);
  context.fillStyle = palette.accent;
  context.beginPath();
  context.roundRect(148, 132, 164, 12, 6);
  context.fill();

  if (variant === 0) {
    context.fillStyle = palette.tint;
    context.beginPath();
    context.roundRect(148, 248, 604, 174, 34);
    context.fill();
    drawCircle(context, 664, 158, 26, palette.accent, 0.18);
    drawCircle(context, 664, 158, 9, palette.accent, 0.32);
    drawLines(context, 186, 292, [218, 332, 276], 18, 18, palette.line);
    drawChip(context, 188, 354, 116, 28, palette.accent, 0.14);
    drawChip(context, 320, 354, 84, 28, palette.tint, 0.9);
    drawChip(context, 420, 354, 140, 28, palette.tint, 0.9);
    drawLines(context, 182, 460, [168, 94], 14, 12, palette.accent);
    drawLines(context, 458, 284, [122, 168, 144], 14, 14, palette.line);
    drawLines(context, 148, 470, [566, 612, 512, 438], 16, 20, palette.line);
    context.beginPath();
    context.moveTo(148, 762);
    context.lineTo(752, 762);
    context.strokeStyle = palette.line;
    context.lineWidth = 2;
    context.stroke();
    context.beginPath();
    context.roundRect(148, 842, 198, 78, 28);
    context.fillStyle = palette.tint;
    context.fill();
    drawLines(context, 184, 868, [112], 16, 14, palette.accent);
    drawChip(context, 578, 856, 140, 34, palette.tint, 0.8);
    drawChip(context, 578, 902, 104, 24, palette.accent, 0.12);
  } else if (variant === 1) {
    context.beginPath();
    context.roundRect(148, 248, 174, 650, 34);
    context.fillStyle = palette.tint;
    context.fill();
    context.beginPath();
    context.arc(235, 354, 56, 0, Math.PI * 2);
    context.fillStyle = palette.accent;
    context.globalAlpha = 0.18;
    context.fill();
    context.globalAlpha = 1;
    drawLines(context, 186, 456, [92, 76, 108], 16, 18, palette.line);
    drawChip(context, 182, 620, 108, 24, palette.accent, 0.14);
    drawChip(context, 182, 654, 76, 24, palette.tint, 0.92);
    drawLines(context, 178, 724, [102, 82], 14, 14, palette.line);
    drawLines(context, 382, 250, [298, 212, 258, 226], 18, 18, palette.line);
    context.beginPath();
    context.roundRect(382, 414, 318, 200, 30);
    context.fillStyle = palette.tint;
    context.fill();
    drawLines(context, 412, 452, [164, 212, 148], 14, 14, palette.accent);
    drawLines(context, 412, 466, [236, 198], 16, 18, palette.line);
    drawChip(context, 412, 542, 94, 26, palette.accent, 0.12);
    drawChip(context, 520, 542, 124, 26, palette.tint, 0.92);
    drawLines(context, 382, 686, [282, 246, 314], 16, 18, palette.line);
    context.beginPath();
    context.roundRect(382, 812, 144, 86, 24);
    context.fillStyle = palette.tint;
    context.fill();
    drawLines(context, 414, 844, [72], 14, 10, palette.accent);
    drawChip(context, 564, 828, 132, 26, palette.accent, 0.12);
    drawChip(context, 564, 864, 102, 22, palette.tint, 0.92);
  } else {
    context.beginPath();
    context.roundRect(148, 248, 604, 110, 30);
    context.fillStyle = palette.tint;
    context.fill();
    drawLines(context, 188, 286, [164, 112, 132], 16, 14, palette.line);
    drawLines(context, 508, 286, [136, 92], 16, 16, palette.line);
    drawChip(context, 610, 272, 106, 24, palette.accent, 0.12);

    for (let index = 0; index < 3; index += 1) {
      const top = 416 + (index * 176);

      context.beginPath();
      context.roundRect(148, top, 604, 138, 28);
      context.fillStyle = index === 1 ? palette.tint : "rgba(255,255,255,0)";
      context.fill();
      context.strokeStyle = palette.line;
      context.stroke();
      drawLines(context, 182, top + 34, [188, 256, 216], 16, 16, palette.line);
      drawLines(context, 182, top + 92, [132, 98], 12, 12, palette.accent);
      context.beginPath();
      context.roundRect(594, top + 34, 122, 20, 10);
      context.fillStyle = palette.accent;
      context.globalAlpha = 0.16;
      context.fill();
      context.globalAlpha = 1;
      context.beginPath();
      context.roundRect(594, top + 72, 84, 18, 9);
      context.fillStyle = palette.tint;
      context.fill();
      context.beginPath();
      context.roundRect(594, top + 102, 98, 18, 9);
      context.fill();
    }

    drawChip(context, 148, 1014, 166, 34, palette.tint, 0.9);
    drawChip(context, 326, 1014, 112, 34, palette.accent, 0.14);
    drawChip(context, 612, 1014, 140, 34, palette.tint, 0.9);
  }

  context.restore();

  const texture = new THREE.CanvasTexture(canvas);

  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createDocumentObject(
  width: number,
  height: number,
  palette: ThemePalette,
  variant: number
) {
  const group = new THREE.Group();
  const texture = createDocumentTexture(palette, variant);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 1.02, height * 1.02),
    new THREE.MeshBasicMaterial({
      color: palette.shadow,
      opacity: 0.28,
      transparent: true
    })
  );
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 0.98,
      side: THREE.DoubleSide,
      transparent: true
    })
  );
  const backPlate = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.98, height * 0.98),
    new THREE.MeshBasicMaterial({
      color: palette.tint,
      opacity: 0.12,
      side: THREE.DoubleSide,
      transparent: true
    })
  );

  shadow.position.set(0.1, -0.14, -0.08);
  backPlate.position.set(-0.04, 0.06, -0.04);

  group.add(shadow);
  group.add(backPlate);
  group.add(plate);

  return {
    group,
    material: plate.material as THREE.MeshBasicMaterial,
    shadowMaterial: shadow.material as THREE.MeshBasicMaterial,
    texture
  };
}

export function LoginBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    const clock = new THREE.Clock();
    const animatedDocuments: AnimatedDocument[] = [];
    const disposableGeometries = new Set<THREE.BufferGeometry>();
    const disposableMaterials = new Set<THREE.Material>();
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let isReducedMotion = reduceMotionQuery.matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.className = "login-background-canvas";
    container.appendChild(renderer.domElement);

    camera.position.set(0, 0, 11.2);

    const ambientLight = new THREE.AmbientLight("#ffffff", 1);

    scene.add(ambientLight);

    const addDocument = (
      width: number,
      height: number,
      x: number,
      y: number,
      z: number,
      rotationZ: number,
      drift: number,
      speed: number,
      variant: number
    ) => {
      const palette = getThemePalette();
      const { group, material, shadowMaterial, texture } = createDocumentObject(
        width,
        height,
        palette,
        variant
      );

      group.position.set(x, y, z);
      group.rotation.z = rotationZ;
      group.rotation.x = -0.14;
      group.rotation.y = x > 0 ? -0.16 : 0.16;

      scene.add(group);
      animatedDocuments.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        drift,
        group,
        material,
        shadowMaterial,
        speed,
        texture,
        tilt: rotationZ,
        variant
      });

      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          disposableGeometries.add(object.geometry as THREE.BufferGeometry);
          disposableMaterials.add(object.material as THREE.Material);
        }
      });
    };

    addDocument(2.72, 3.72, -3.52, 0.82, -1.8, -0.28, 0.18, 0.72, 0);
    addDocument(2.08, 2.82, -0.82, -1.72, -0.72, 0.24, 0.16, 0.86, 1);
    addDocument(2.94, 3.98, 3.4, 1.24, -2.1, 0.24, 0.16, 0.66, 2);
    addDocument(1.94, 2.68, 4.22, -1.2, -1.28, -0.18, 0.14, 0.8, 0);
    addDocument(1.72, 2.36, 1.08, 2.18, -1.58, -0.1, 0.12, 0.62, 1);

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(36 * 3);

    for (let index = 0; index < 36; index += 1) {
      const offset = index * 3;

      particlePositions[offset] = (Math.random() - 0.5) * 15;
      particlePositions[offset + 1] = (Math.random() - 0.5) * 9;
      particlePositions[offset + 2] = (Math.random() - 0.5) * 4;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: getThemePalette().accent,
      opacity: 0.05,
      size: 0.04,
      sizeAttenuation: true,
      transparent: true
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);

    scene.add(particles);
    disposableGeometries.add(particleGeometry);
    disposableMaterials.add(particleMaterial);

    const updateTheme = () => {
      const palette = getThemePalette();

      animatedDocuments.forEach((item) => {
        item.texture.dispose();
        item.texture = createDocumentTexture(palette, item.variant);
        item.material.map = item.texture;
        item.material.needsUpdate = true;
        item.shadowMaterial.color.set(palette.shadow);
        item.material.opacity = item.baseZ < -1.4 ? 0.86 : 0.96;
        item.shadowMaterial.opacity = item.baseZ < -1.4 ? 0.18 : 0.26;
      });

      particleMaterial.color.set(palette.accent);
    };

    const handleResize = () => {
      if (!container) {
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const motionFactor = isReducedMotion ? 0.18 : 1;

      animatedDocuments.forEach((item, index) => {
        const offset = elapsed * item.speed * motionFactor;

        item.group.position.y = item.baseY + Math.sin(offset + (index * 0.8)) * item.drift;
        item.group.position.x = item.baseX + Math.cos((offset * 0.66) + index) * (item.drift * 0.26);
        item.group.position.z = item.baseZ + Math.sin((offset * 0.42) + index) * 0.1;
        item.group.rotation.z = item.tilt + Math.sin((offset * 0.5) + index) * 0.03 * motionFactor;
        item.group.rotation.x = -0.14 + Math.cos((offset * 0.36) + index) * 0.02 * motionFactor;
      });

      particles.rotation.z = elapsed * 0.012 * motionFactor;
      particles.position.y = Math.sin(elapsed * 0.14) * 0.08 * motionFactor;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      isReducedMotion = event.matches;
    };

    const themeObserver = new MutationObserver(() => {
      updateTheme();
    });

    reduceMotionQuery.addEventListener("change", handleMotionPreference);
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
      attributes: true
    });
    themeObserver.observe(document.body, {
      attributeFilter: ["data-theme"],
      attributes: true
    });

    updateTheme();
    handleResize();
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      reduceMotionQuery.removeEventListener("change", handleMotionPreference);
      themeObserver.disconnect();
      scene.remove(ambientLight);
      scene.remove(particles);
      animatedDocuments.forEach((item) => {
        item.texture.dispose();
        scene.remove(item.group);
      });
      disposableGeometries.forEach((geometry) => geometry.dispose());
      disposableMaterials.forEach((material) => material.dispose());
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div aria-hidden="true" className="login-background" ref={containerRef}>
      <div className="login-background-overlay" />
    </div>
  );
}
