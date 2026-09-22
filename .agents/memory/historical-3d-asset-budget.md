---
name: Historical 3D asset budget
description: Performance target for historical-character and map GLBs used in the comparison app.
---

Web copies of historical 3D assets should target roughly 100,000 faces, 1024×1024 embedded textures, and about 4–6 MB per GLB. Keep uploaded originals unchanged.

**Why:** The topic panels display assets at roughly 600–900 effective pixels. The earlier 4096px textures and 15–22 MB GLBs created unnecessary network delay and large decoded GPU-memory allocations without visible benefit at that size.

**How to apply:** Optimize every newly uploaded historical model before adding it to the public model directory, render-check the result, and version its URL so clients do not reuse the heavier cached file.