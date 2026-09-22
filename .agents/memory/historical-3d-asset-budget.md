---
name: Historical 3D asset budget
description: Performance target for historical-character and map GLBs used in the comparison app.
---

Web copies of historical 3D assets should target roughly 70,000 faces, 512×512 embedded textures, and about 2.5–3 MB per GLB. Keep uploaded originals unchanged. Show the matching poster immediately while the interactive model initializes.

**Why:** The topic panels display assets at roughly 600–900 effective pixels. The earlier 4096px textures and 15–22 MB GLBs created unnecessary network delay and large decoded GPU-memory allocations without visible benefit at that size. Even 1024px textures and 4–6 MB files still felt slow on some devices.

**How to apply:** Optimize every newly uploaded historical model before adding it to the public model directory, render-check the result, and version its URL so clients do not reuse the heavier cached file.