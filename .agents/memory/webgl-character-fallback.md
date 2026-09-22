---
name: WebGL character fallback
description: Compatibility rule for historical-character scenes on devices where WebGL initialization is unreliable or unavailable.
---

Do not create a temporary WebGL context to test support before constructing the Three.js renderer. Initialize the renderer directly in a guarded block, using a compatible power preference. Historical-character screens must retain a character-specific poster fallback when renderer initialization fails.

**Why:** A separate capability probe can fail or consume the available context before the real renderer starts. Some browsers and preview environments genuinely provide no WebGL context, so an error-only state leaves the main visual area empty even though the assets are valid.

**How to apply:** Use this rule whenever adding or changing a historical-character WebGL scene. Verify the interactive path where WebGL is available and the correct named-character poster where it is not.