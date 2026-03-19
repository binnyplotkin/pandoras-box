"use client";

import { MeshGradient as PaperMeshGradient } from "@paper-design/shaders-react";

export function MeshGradient({ className }: { className?: string }) {
  return (
    <PaperMeshGradient
      className={className}
      style={{ width: "100%", height: "100%" }}
      colors={[
        "#0a0a0a",
        "#132e2b",
        "#1a4a45",
        "#8fd1cb",
        "#0f2624",
      ]}
      speed={0.8}
      distortion={0.4}
      swirl={0.3}
      grainMixer={0.1}
      grainOverlay={0.05}
    />
  );
}
