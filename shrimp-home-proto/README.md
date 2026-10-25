# Shrimp Home Prototype

A dev prototype, separate from Universal Shrimp, for trying ideas before they go into the game: hands-on tank jobs, colour breeding, a collection book, and a home that grows from Grandma's flat to land with a stream. Nothing here touches the game or its saves.

- `SPEC.md` is the brief: what each idea is for, the look, the module API.
- `src/` is the source. `python3 build.py` writes `dist/index.html` (for local testing, with a page skeleton) and `dist/artifact.html` (published as a claude.ai artifact).
- `test/serve.sh` serves `dist/` on port 8765. `node test/shot.js out.png "js" waitMs width height fullPage` takes a phone-sized screenshot. `test/toys.js` runs every tank job once.

## What's in it

| Tab | What to try |
|---|---|
| Home | The map for the stage you're at: flat, balcony, house with a garden, land with a stream. Mow, fill the feeder and hold on a bird to watch it, collect eggs, catch a wild chicken with grain, fish, set a shrimp trap, decorate. Tap a tank stand to open it. |
| Tank | The game's tank view and art. Jobs: gravel vacuum (the bucket is the water change, check it for babies), filter sponge (old tank water or tap water), trim moss and stems (scoop the bits, plant a stem top), pick off snails and flatworms, sort shrimp into cups, aquascape. Tap a shrimp to look closer, move it, sell it or name it. |
| Book | Every colour line by grade plus rili, birds, fish, stream finds, chickens and eggs. Empty slots show what's left. |
| Try | Each idea with Try it, Keep / Maybe / Drop and a note. Notes save to the artifact's database (`notes/<viewer id>`), or this device when there's no database. Dev controls: stage, time, cash, genes, mess, reset. Two design switches: jobs show when needed or always, and jobs change the water or are just for the look. |

## Breeding, in short

Each colour is a recessive gene of its own (red, yellow, blue). Two of them together make orange (red + yellow), violet (red + blue) or green (yellow + blue), all three make black. Mixing two colour lines gives wild brown babies. Rili, the clear middle band, is dominant and rare. Grade is passed on as an average with noise, so keeping the best and selling the rest raises it over generations. Wild shrimp from the stream carry hidden colours at real-ish rates, and Grandma's reds carry a little blue and yellow.

One game day is 20 seconds at 1×. Breeding age is 60 days, eggs take 25, a baby shows its colour at 25 days.
