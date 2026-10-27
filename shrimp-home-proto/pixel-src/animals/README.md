# Home animals

Animation frames from Puti's own drawings in `shrimp-home-art`:
- `keyframes/hens.aseprite`, layer "Layer 1": her white hen. Brown, speckled, blue egg and wild junglefowl are recoloured from it (same pixels).
- `tmp/fishandbird.aseprite`: her white-eared bulbul, common myna and seven fish.

`python3 gen.py <hens.aseprite> <fishandbird.aseprite> <outdir>` writes one sheet per animal and `manifest.json`.
Hens: idle 4, walk 4, peck 5, run 4. Birds: idle 6, peck 5, hop 6, fly 4. Fish: swim 6. All face right; flip for left.
`python3 build_demo.py <outdir> demo.html` builds the demo page. `../ase.py` reads .aseprite files.
