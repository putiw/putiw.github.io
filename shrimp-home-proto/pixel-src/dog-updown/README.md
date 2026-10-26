# The dog walking up and down

Her dog sheet (`dog-14.png`, from Echoing End: stand, 12-frame side run, sit) had no frames for walking toward or away from the camera. `build_ud.py` draws them in her palette and appends them, giving `dog-32.png`:

| Frames | What |
|---|---|
| 0–13 | Hers, unchanged |
| 14–21 | Trotting toward the camera, 8 frames |
| 22–29 | Trotting away, 8 frames |
| 30, 31 | Standing toward, standing away |

- **Front:** her own head (frame 13, the sitting dog, moved down 4 px) and her own front legs from the same frame, shortened and lifted in turn, with the far hind legs showing between them.
- **Back:** her head outline and ear lines with fur where the face was, the dark saddle over the neck and back, tan thighs, and a tan-feathered tail that wags.
- **Cycle:** both views use the same 8-frame cycle. The legs lift 2, 5, 4, 1 px in turn, and the body bobs 1 px.

Run `python3 build_ud.py`; previews go to `out/`. To put a new sheet in the game, encode it as lossless WebP and replace `PIXSRC.dog` in `src/pixart.js`.
