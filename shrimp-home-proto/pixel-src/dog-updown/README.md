# The dog walking up and down

Her dog sheet (`dog-14.png`, from Echoing End: stand, 12-frame side run, sit) had no frames for walking toward or away from the camera. `build.py` draws them in her palette and appends them, giving `dog-32.png`:

| Frames | What |
|---|---|
| 0–13 | Hers, unchanged |
| 14–21 | Trotting toward the camera, 8 frames (`front4.py`, head in `head2.py`) |
| 22–29 | Trotting away, 8 frames (`back3.py`) |
| 30, 31 | Standing toward, standing away |

Both views are seen a little from above, like the home.

- **Toward you:** her head made symmetric and tipped down a little (`head2.py`: more of the top of the head, the eyes, nose and muzzle lower, her brows beside the eyes). Her chest and front legs are mirrored the same way (`front_sym.py`), with the far hind legs between them, the dark neck under the ears, and the rump and tail showing behind the head.
- **Away:** her colours — the back of the head, the back and the top of the tail dark; under the tail and the thighs yellow (`back_sym.py`). The ears carry the head: each is dark with her tan stripe down its outer edge, wider from behind, and a lighter line where it hangs against the head.
- **Ears:** drawn on their own in both views, so their lower halves swing out 1–2 px as the head comes down and fold back as it rises.
- **Cycle:** the same 8-frame trot in both: the legs lift 2, 5, 4, 1 px in turn, the body bobs 1 px, the tail wags.

Run `python3 build.py`; the sheet and previews go to `out/`. To put a new sheet in the game, encode it as lossless WebP and replace `PIXSRC.dog` in `src/pixart.js`.
