# Shrimp Home Prototype: spec

A dev prototype, separate from the game, for Puti to test ideas before any of them go into Universal Shrimp. She plays on her phone at 390 px wide. Nothing here touches the game file.

Four tabs:

- **Home**: the place that grows with you. Grandma's flat → a flat with a balcony → a house with a garden → land with a stream. A 2D, hand-drawn map you can look around and do small things on.
- **Tank**: the tank view from the game, six hands-on jobs (gravel vacuum, filter sponge, trim, pests, sort, aquascape), and colour breeding.
- **Book**: the collection (shrimp colours and grades, birds, fish, stream finds, chickens and eggs).
- **Try**: every proposal with Keep / Maybe / Drop and a note (saved to the artifact db), plus dev controls.

The point Puti is testing: does this give the game a slow, creative, no-rush place to be, alongside the rushed empire? Every activity should feel like the tank cleaning her friends loved: **touch the mess and it goes away, the before/after is obvious, it never fails, it's done in under a minute.**

## Source layout

`build.py` concatenates `src/` into `dist/index.html` (with a local skeleton, for testing) and `dist/artifact.html` (raw, for publishing). Order: `sprites.js, core.js, ink.js, sound.js, shrimpart.js, breed.js, tank.js, toys.js, land.js, book.js, try.js, main.js`. Extra `src/*.css` files are appended after `style.css`.

Test: `./test/serve.sh` (serves dist on :8765), then `node test/shot.js out.png "js to eval" waitMs width height fullPage`. Put screenshots in `/tmp/claude-0/`, never in the repo.

## Core API (core.js, ink.js, sound.js, shrimpart.js)

State is one object `S`, saved to localStorage (`save()` throttled, `save(true)` now).

- `S.day` (float game days), `S.speed` (0, 1, 4, 20), `S.cash`, `S.stage` (0 flat, 1 balcony, 2 house, 3 land), `S.opt` (toys, effects, company, genes, sound), `S.tanks`, `S.sel`, `S.book`, `S.land` (owned by land.js), `S.company`, `S.seen`.
- `STAGES[i]` = `{id, name, tanks (slots), cost}`.
- One game day = `DAY_SEC` (20) real seconds at 1×.
- Modules: `registerMod({name, init(fresh), day(d), tick(dtDays, dtSec), show(arg), hide(), render(), bookChanged(cat,id)})`. `registerTab('home', mod)` makes a module own a tab panel (`#p-home`, `#p-tank`, `#p-book`, `#p-try`). `tick` runs every frame; `dtDays` is 0 while paused or held.
- Time: `hold()` / `release()` stop the clock while a toy or sheet is open (sheets hold by default). `running()`, `skipDays(n)`, `setSpeed(v)`.
- Money: `spend(n, what)` returns false (and toasts) when short, `earn(n, what)`, `fmtA(n)`.
- Book: `bookCat(cat, {title, order, entries:[{id, name, hint, draw(ctx,w,h)}]})`, `bookAdd(cat, id, info)` returns true when new (toasts, plays a chime), `bookHas(cat, id)`.
- UI: `toast(msg)`, `openSheet({title, html, mount(el, api), onClose, keepTime, noClose})` returns `{el, close()}`, `closeSheet()`, `openPop(html)`, `closePop()`, `setTab(t, arg)`, `goTank(i)`, `activeTab`.
- Helpers: `clamp, lerp, rnd, pick, gauss, mulberry32(seed), hash2(x,y,seed), esc, fmtN, plural, seasonOf(day), fitCanvas(canvas, w, h)` (sets the dpr transform, returns ctx), `miniCanvas(w,h,draw)`.
- Ink (hand-drawn look): `INK` (outline colour), `inkPath(ctx, pts, {closed, w, col, seed, amp, fill})`, `blobPts`, `inkBlob(ctx, cx, cy, rx, ry, {fill, seed, irr, w, wash})`, `washSpots`, `inkTick`, `grain(ctx, x, y, w, h, alpha)`, colour utils `mixC, shadeC, rgba, hexRGB`.
- Sound: `sfx(name, {v})` for one-shots (`click nope snip pop plip plop drip squelch suck scoop egg coin book chirp splash cast cluck flap reel thud pour`), `sfxLoop(name)` returns `{set(level), stop()}` for held sounds (`siphon mower bubbles wind`). Outdoor wind plays on Home from the balcony on.
- Shrimp art: `bodyCanvas(spec)`, `drawShrimp(ctx, agent, L, t)`, `shrimpStill(ctx, spec, cx, cy, L, face)`, `shrimpIconCanvas(spec, w, h)`, `COLOURS`, `DECOR`.

## Breeding API (breed.js, used by the land's shrimp trap)

- `breedWild()` returns one wild-caught shrimp (an individual object).
- `specOf(ind)` returns the draw spec for `shrimpIconCanvas`.
- `colourName(ind)` gives "Wild", "Blue rili", etc.
- `takeHome(list, from)` opens a sheet to pick a tank and puts the shrimp in it.

Guard calls with `typeof takeHome === 'function'` in case breed.js isn't loaded.

## Look

Same field-notebook palette as the game: cream paper `--bg #efe9dc`, dark ink, forest green buttons, cherry red for shrimp, Inter. Light only.

The tank art is hand-drawn: black ink outlines about 2 px, flat fills with soft shading. The land matches it:

- Ink outlines (`INK`, 1.3–1.8 px) with a slight wobble.
- Watercolour fills (`inkBlob`, `washSpots`) and faint paper `grain`.
- Seeded randomness so the map is computer-generated but stable.

Use a 3/4 top-down view, like Stardew: flat ground tiles, and objects drawn standing up and sorted by y. The house is a cutaway: low walls, no roof, the room visible inside.

## Home (land.js)

### Stages

Each stage has its own generated map. Moving up replaces the map.

| Stage | Map | Tanks | Things to do |
|---|---|---|---|
| Grandma's flat | one room | 2 stands | window bird feeder, decorate |
| Flat with a balcony | room + balcony | 3 | feeder, potted plants, decorate |
| House with a garden | cutaway house + lawn | 5 | mow, feeder, coop with hens and eggs, small pond, fish the pond, decorate |
| Land with a stream | house + garden + meadow + stream + trees | 6 | everything, wild chickens, fishing, shrimp trap |

A card above the map shows where you live, what's there, and a Move button for the next stage (`STAGES[n+1].cost`).

### Tools

Tools are a row under the map, showing only the ones that make sense at the stage:

- **Look**: drag to pan, tap things.
- **Mow**: drag over grass.
- **Grain**: tap ground to scatter grain for chickens.
- **Rod**: tap water to cast.
- **Build**: place and remove things.

### Activities

Each one should be satisfying on its own.

- **Mowing.** Grass tiles have a height that grows each day (long again in about 5 days). Dragging the mower over grass cuts it to 0 and records the stripe direction from the drag, so neighbouring passes make classic lawn stripes (light and dark bands). Clippings puff out, and the mower hum plays while moving over long grass. Short lawn draws the hoopoe; long meadow draws the bee-eater. That makes mowing a choice, not a chore.
- **Bird feeder.** Tap the feeder to fill it (AED 5 of seed). While there's seed, birds arrive over real time, perch on the feeder or peck underneath, and eat it down. Press and hold on a bird for about 1.2 s, without moving, to watch it: a ring fills, then it goes in the Book with its name. Tapping fast or dragging near birds makes them flap off. Which birds come depends on the stage and on what's around (lawn, meadow, water, trees, bird bath, flowers).
  - Suggested UAE-plausible birds: house sparrow, white-eared bulbul, laughing dove, common myna, purple sunbird (flowers), hoopoe (short lawn), green bee-eater (long grass, perches on fences), Indian roller (rare, land), white wagtail (near water), rose-ringed parakeet (trees, land), common kingfisher (stream, rare), grey heron (stream, rare).
  - Each bird gets a simple ink drawing with its real colour patches.
- **Chickens and eggs** (house stage on).
  - A coop with two or three hens that wander the garden and lay eggs in the nest boxes each day. Tap eggs to collect them into a basket, then sell (AED 1 each) or send to Grandma.
  - Egg colours can be a collection: white, brown, speckled, blue.
  - **Wild chickens** at the land stage live at the meadow edge and run from your finger. Scatter grain and they come to peck. Tap one while it's pecking to catch it (it flaps), and it joins the coop.
- **Fishing** (pond and stream).
  - Rod tool, tap water to cast: the bobber lands with a plop. After a wait of 2–9 s it twitches a few times (fake bites), then dips. Tap within about 0.7 s to hook it.
  - A sheet shows the fish (drawing, name, size). Let it go is the default, or keep it in the pond if there is one. It goes in the Book.
  - Fish: minnow, stream goby, loach, pale chub, barb, eel (rare).
- **Shrimp trap** (stream).
  - Tap a stream tile in Look and choose "Set a shrimp trap here" (AED 20, once per trap, up to 3 traps).
  - A small mesh trap sits in the water with a float. After at least a quarter day, tap it to lift: a sheet shows it coming up, dripping, with the catch: 2–7 wild shrimp from `breedWild()`, drawn with `shrimpIconCanvas(specOf(s))`, sometimes a crab, a pond snail, a dragonfly nymph or a leaf (Book: stream finds).
  - Buttons: **Take the shrimp home** (`takeHome(list, 'stream')`) or **Let them go**. Wild shrimp mostly look wild but carry hidden colours, which is the bridge to breeding.
- **Decorate** (Build).
  - A palette with prices from dev cash: flower bed, bush, small tree, stepping stones, fence, bench, bird bath, lantern, vegetable bed, a second feeder, coop (house on), pond (2×2, land).
  - Tap a tile to place (valid tiles highlighted); tap a placed thing in Build to remove it (half back).
  - Indoors: rug, plant pot, bookshelf, armchair.
- **Tanks on the map.** Draw one tank stand per tank in `S.tanks` inside the home: a small glass box with blue water and red dots. Tap it in Look to open it in the Tank tab (`goTank(i)`). Free slots up to `STAGES[S.stage].tanks` show as an empty stand.

### Book categories (registered by land.js)

`birds`, `fish`, `finds` (stream finds), `coop` (chickens and eggs). Each entry has a draw function so the Book can show it.

### Feel and rules

- The world stays alive while you look (the clock runs). Sheets pause it.
- Never fail, never punish. No timers that run out. Birds come back, fish bite again.
- One short line of text at most on the map card. Explanations behind the ? (`openPop`).
- Fits 360 and 390 px wide, with no sideways page scroll. The map pans inside its own box.
- 30+ fps on a phone: pre-render the ground to an offscreen canvas and redraw only changed tiles; draw animals and effects each frame.
- Expose `landSetStage(n)` globally for the Dev controls.
