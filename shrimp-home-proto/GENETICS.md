# Shrimp genetics in the prototype

`src/genetics.js` is a plain JS port of Puti's Shrimp Tanks model: `shrimp-tanks-phaser/src/game/genetics.ts`, DNA model v7. It has no imports and leaves out the migrations for older saves. Everything lives on one global, `GEN`, so its names can't collide with the other files.

## The genome

80 bases of A, T, G and C.

| Part | Bases | What it does |
|---|---|---|
| Pigment | 0–36 | Eight hue codons (3 bases each, 64 steps around the wheel), two saturation codons and two lightness codons. The colour is the circular mean of the hue codons. How much they agree is the *coherence*. |
| Shell | 36–52 | The number of G/C bases sets coverage. |
| Pattern | 52–56 | Three or more C bases is rili. |
| Vigor | 56–64 | Four 2-base loci: fertility, fecundity (brood size), embryo survival and stability. |
| Body | 64–80 | Catch resistance, speed, escape, size, lifespan, activity and food focus. The last 6 bases `CGCGCG` mark a legendary shrimp. |

### Grade

Grade (G1–G8, stored as 0–7) is expression bucketed into eight bands:

`expression = coverage × coherence factor × saturation factor × vigor factor`

- Mixed hue genes lower the coherence factor.
- Saturation under 38 lowers the saturation factor.
- G1 is see-through. The art draws body alpha by grade with a checker dither, as in the game's shader.

### Line names

Line names are labels only. They are the nearest of red 0, orange 28, yellow 58, green 120, cyan 180, blue 220, purple 272 and magenta 315 degrees. Anything under saturation 18 is wild.

## Inheritance (`GEN.inherit(momDna, dadDna, mutationChance, momGrade, dadGrade)`)

- **Pigment**
  - Close hues (under about 46°) usually blend at a point between the parents.
  - Far ones mostly follow one parent and carry 1 or 2 of the other parent's hue codons. That lowers coherence, so the grade drops.
  - Every child gets one shared hue shift. Its SD is up to 15°, scaled down by the parents' stability, so lines drift and can walk to a new colour.
  - Rare per-codon mutations move a hue by up to ±22°.
- **Other loci** are taken base by base from either parent, with rare mutations.
- **Shell**
  - The shell is set to the parents' mean grade plus a drift of −2 to +2, with weights 5/30/40/19/6%.
  - Without selection, grade sinks slowly. Keeping the best raises it.
- **Legendary parent:** the child is a fresh high-grade shrimp of any colour.

`GEN.pair(a, b, gradeA, gradeB)` gives fertility, brood, embryo survival and mutation scales. breed.js divides these by typical values (0.55, 0.41, 0.57) so an ordinary pair breeds at the round 1 pace.

## Making shrimp

| Call | Use |
|---|---|
| `GEN.forStrain(line, grade, hex?, opacityHint?, pattern?)` | Stock for a named line. The shell is aligned so the decoded grade matches. |
| `GEN.fromTraits({hue, saturation, lightness, grade, hueSpread, pattern, vigor, stability, legendary})` | A genome from continuous traits. |
| `GEN.pheno(dna)` | Returns `{h, s, l, grade, rili, line, legend, coh, spread, vig, body}`. breed.js caches it per shrimp in a WeakMap (`phOf(i)`), so it is never saved. |
| `GEN.inspect(dna)` | Everything decoded, for the dev genes view. |
| `GEN.withSeed(seed, fn)` | Runs `fn` with a seeded random, used for Grandma's stock. |

## In the prototype

- **Grandma's tank:** a red line, G3–G6, about 15% rili. Seeded, so it is the same every new game.
- **The stream:** 82% wild (saturation 7, G2–G4). 18% carry a faint hue from the colour lines (saturation 24–46, G1–G3); at G1 the colour is too faint to see. 0.4% are legendary.
- **Shrimp record:** each shrimp stores `dna` (the genome string) and, once bred, `mum` and `dad` summaries (`{l: line, g: grade, r: rili}`).
- **Old saves:** round 1 saves with R/Y/B/L genes are converted on first read (`ensureDna`). Old book keys are converted in `migrateBook`.
- **Book:** Puti's notebook, simplified.
  - One entry per line, solid and rili, keeps the best grade and that shrimp's colour.
  - `S.book.hue` and `S.book.hueR` hold the best grade per 3° hue slot (120 slots) for the colour wheel.
- **Price:** line base × grade multiplier, ×1.5 for rili, half price for juveniles.
- **Performance:** decoding a genome takes about 0.02 ms and a child takes about 0.06 ms. Body canvases are cached by quantised hue, saturation, lightness, grade and maturity, with the cache capped at 480.

## Wellbeing (tank.js)

The Score setting is `S.opt.effects = 'score'`, the default. It is Puti's note: one number, about 50 is enough, more is happiness, never money.

The score is 0–100:

| Part | Points |
|---|---|
| Water (nitrate, ammonia) | 35 |
| Filter | 20 |
| Gravel | 20 |
| Plants and hiding | 10 |
| Space | 10 |
| Pests | 5 |

- **Under 50:** more deaths, scaled by how far under, and a breeding chance of up to ×0.25.
- **75 and over:** the shrimp swim more and little hearts rise.
- **Each thing:** the `'on'` mode keeps the round 1 per-factor effects.
- **Neglect:** dirty gravel now feeds nitrate and a clogged filter lets ammonia build, so neglect shows within 2–4 weeks.
