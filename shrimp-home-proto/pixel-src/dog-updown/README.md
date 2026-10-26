# The dog walking up and down

Her dog sheet (`dog-14.png`, from Echoing End: stand, 12-frame side run, sit) had no frames for walking toward or away from the camera. `build.py` draws them in her palette and appends them, giving `dog-32.png`:

| Frames | What |
|---|---|
| 0–13 | Hers, unchanged |
| 14–21 | Trotting toward the camera, 8 frames (`front_sym.py`) |
| 22–29 | Trotting away, 8 frames (`back_sym.py`) |
| 30, 31 | Standing toward, standing away |

Both views are seen a little from above, like the home.

- **Toward you:** her face made symmetric (the right half of her sitting head, mirrored), the chest and front legs the same way, the far hind legs between them, and the dark back and the tail showing behind the head.
- **Away:** her colours (round 3 notes) — the back of the head, the back and the top of the tail dark; under the tail and the thighs yellow. The tail's yellow feathering rises from the yellow rump and wags.
- **Cycle:** the same 8-frame trot in both: the legs lift 2, 5, 4, 1 px in turn, the body bobs 1 px, the tail wags.

Run `python3 build.py`; the sheet and previews go to `out/`. To put a new sheet in the game, encode it as lossless WebP and replace `PIXSRC.dog` in `src/pixart.js`.
