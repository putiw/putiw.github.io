# Shrimp Home Prototype

A dev prototype, separate from Universal Shrimp, for trying ideas before they go into the game: hands-on tank jobs, colour breeding, a collection book, and a home that grows from Grandma's flat to land with a stream. Nothing here touches the game or its saves.

- `SPEC.md` is the brief: what each idea is for, the look, the module API.
- `src/` is the source. `python3 build.py` writes `dist/index.html` (for local testing, with a page skeleton) and `dist/artifact.html` (published as a claude.ai artifact).
- `test/serve.sh` serves `dist/` on port 8765. `node test/shot.js out.png "js" waitMs width height fullPage` takes a phone-sized screenshot. `test/toys.js` runs every tank job once.

## What's in it

| Tab | What to try |
|---|---|
| Home | Grandma's place as a little pixel world in Puti's own art (Haven, Echoing End): flat, balcony, house with a garden, land with a stream. Tap to walk as Millie, the dog follows, Pierre the cat lives indoors. Tap things to use them: tanks, the feeder, Grandma, the coop, the bench. Mow along your path, watch birds, collect eggs, catch a wild chicken with grain, fish into the pond, set a shrimp trap, decorate. Time is always 1× here. |
| Tank | The game's tank view and Puti's Shrimp Tanks art. Jobs: gravel vacuum (hold the top of the tube, the bucket is the water change, check it for babies), filter sponge (old tank water), trim moss and stems (scoop the bits, plant a stem top), pick off bladder snails and flatworms, sort shrimp into cups, aquascape. Wellbeing: one score, about 50 is enough. Tap a shrimp to look closer, move it, sell it or name it. |
| Book | Every colour line, solid and rili, with the best grade reached, and a colour wheel of every 3° of hue you've kept; birds, fish, stream finds, chickens and eggs. Missing entries are black silhouettes. |
| Try | Each idea with Try it, Keep / Maybe / Drop and a note. Notes save to the artifact's database (`notes/<viewer id>`), or this device when there's no database. Dev controls: stage, time, cash, genes, mess, reset. Design switches: jobs show when needed or always; wellbeing score, each thing on its own, or just for the look. |

## Breeding, in short

Breeding runs on Puti's Shrimp Tanks genetics (see `GENETICS.md`): an 80-base genome with eight hue genes, saturation and lightness, a shell that sets the grade (G1 see-through to G8 solid), a pattern for rili, vigor and body traits. Close colours blend, far ones mostly follow one parent and lower the grade. Without picking, grade sinks a little each generation; keep the best and it climbs. Babies drift a little in hue, so a line can walk to a new colour. Grandma's tank is a red line; wild shrimp are mostly clear, and some carry a faint colour.

One game day is 20 seconds at 1×. Breeding age is 60 days, eggs take 25, a baby shows its colour at 25 days.
