---
name: Blender headless rendering
description: Reliable way to render GLB fallback images in this workspace without a graphics context.
---

Use Blender's Cycles engine with CPU rendering for headless GLB renders; Eevee and Workbench require a GLX/EGL context and abort in this environment.

**Why:** The headless environment exposes no usable OpenGL context, while Cycles CPU rendering completes successfully.

**How to apply:** When generating static fallback images from 3D assets, import the uncompressed GLB into Blender and render with `scene.render.engine = 'CYCLES'` and `scene.cycles.device = 'CPU'`.