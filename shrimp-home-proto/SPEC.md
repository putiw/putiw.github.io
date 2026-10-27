# Shrimp Home Prototype: spec

A dev prototype, separate from the game, for Puti to test ideas before any of them go into Universal Shrimp. She plays on her phone at 390 px wide. Nothing here touches the game file.

Four tabs:

- **Home**: the place that grows with you. Grandma's flat → a flat with a balcony → a house with a garden → land with a stream. A 2D, hand-drawn map you can look around and do small things on.
- **Tank**: the tank view from the game, five hands-on jobs (gravel vacuum, filter sponge, trim, pests, aquascape), the net and cull tank, and colour breeding.
- **Book**: the collection (shrimp colours and grades, birds, fish, stream finds, chickens and eggs).
- **Try**: every proposal with Keep / Maybe / Drop and a note (saved to the artifact db), plus dev controls.

The point Puti is testing: does this give the game a slow, creative, no-rush place to be, alongside the rushed empire? Every activity should feel like the tank cleaning her friends loved: **touch the mess and it goes away, the before/after is obvious, it never fails, it's done in under a minute.**

## Source layout

`build.py` concatenates `src/` into `dist/index.html` (with a local skeleton, for testing) and `dist/artifact.html` (raw, for publishing). Order: `sprites.js, pixart.js, core.js, ink.js, sound.js, shrimpart.js, genetics.js, breed.js, tank.js, toys.js, land.js, book.js, try.js, main.js`. `pixart.js` holds Puti's pixel art (Millie, the dog, tiles, trees) as data URIs. Extra `src/*.css` files are appended after `style.css`.

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
- Shrimp art: `bodyCanvas(spec)` where spec is `{male, h, s, l, vg (grade 0-7), mat (colour maturity), juv, rili, legend, sick}`, `drawShrimp(ctx, agent, L, t)` (legs pre-joined, tail joined to the body, 2-3 drawImage calls), `shrimpStill(ctx, spec, cx, cy, L, face)`, `shrimpIconCanvas(spec, w, h)`, `COLOURS` (labels per line), `DECOR`.
- Speed: on the Home tab time is always 1× (`speedLock`, `homeSpeed` in core.js); leaving Home gives back the earlier speed.

## Breeding API (breed.js on genetics.js; see GENETICS.md)

- `breedWild()` returns one wild-caught shrimp. `grandmaStock()` makes Grandma's red line (seeded).
- `phOf(ind)` decodes the genome (cached, not saved): `{h, s, l, grade, rili, line, legend, vig, body}`. Helpers `gradeOf`, `lineOf`, `riliOf`, `colOf` (same as lineOf).
- `specOf(ind)` returns the draw spec for `bodyCanvas` / `shrimpIconCanvas`. `shrimpRGB(ind)` gives a flat `rgb()` colour.
- `colourName(ind, full)` gives "Wild", "Blue rili", "Red · G5".
- `takeHome(list, from)` opens a sheet to pick a tank and puts the shrimp in it. `addToTank(T, list, from)` records them in the book.
- `bookShrimpSeen(ind, info, silent)` keeps the book's best grade per line and the colour wheel (`S.book.hue`, `S.book.hueR`).
- `wellbeing(T)` (tank.js) returns `{total 0-100, parts}`; `scoreMode()` when `S.opt.effects === 'score'`.

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

## Round 2: the home in Puti's pixel style, Millie and the dog

Puti tested round 1 (notes in the artifact db, `notes/<her id>`). For the home she wants her own art style (Haven, Echoing End) and to **walk around Grandma's place as Millie with the dog following**.

**Assets** (`src/pixart.js`, from her Aseprite exports; keep them out of the public repo until she says OK):
- `PIXSRC`: data URIs, frame layout in `PIXMETA`.
- `millie`: 51 frames of 128×128 in a row.
  - 0 idle facing down; 1–12 run right; 13–24 run left; 26–37 run down (toward the camera); 38 back idle; 39–50 run up.
- `dog`: 32 frames of 128×128.
  - 0–12 run cycle facing right (mirror for left), 13 sitting facing front. These are hers.
  - 14–21 trotting toward the camera and 22–29 trotting away, 8 frames each; 30 standing toward, 31 standing away. Added in round 3 to match her sheet, seen a little from above like the home. Toward you: her face made symmetric (her sitting head is turned a little, so its right half is mirrored) and tipped down a little, so more of the top of the head shows, with the rump and the tail behind the head. The ears are their own shapes in both views and swing out and back with each step. Away: the back of the head, the back and the top of the tail dark; under the tail and the thighs yellow (her colours). Her 14 frames are unchanged.
- Tiles, 64×64: `grass`, `dirt`, `water`.
  - `terrain`: Haven atlas, 10×3 tiles of 64, grass-on-dirt transitions.
  - `gdw`: Echoing End autotile set, 64-px tiles: grass, dirt and water edges.
- Trees:
  - `olive`: 7-frame sway, each 420×200, base at bottom centre.
  - `olive2`: one frame, 235×196.
  - `oak`: a small chunky pixel tree, 74×90.
- `post` (log wall post, 32×128), `bench` (workbench, 64×64), `logs` (32×32).

**Style** (from Haven's `docs/art/style-guide.md`):
- Pixel art, hand-drawn, warm colours.
- Top-down ground tiles (Stardew style), side-view characters and objects.
- Natural earthy palette: greens with blue-green grass strokes, warm tan dirt, light cyan water with scribbly lines.
- Characters have dark outlines; trees and tiles are painterly with no outline.
- Draw everything else you need (house walls and floor, furniture, Grandma, tank stands, coop, hens, birds, fish, feeder, fences, flowers, pond banks, bench to sit on) as pixel sprites in code at the same scale: a 64-px tile, 2–4 tone shading, brushy texture. Draw at native resolution on offscreen canvases and scale with `imageSmoothingEnabled=false`.

**Play:**
- Millie is the player. Tap a tile and she walks there by a short path (A* on the tile grid around water and solid objects), animated in 4 directions, with idle or back-idle when she stops.
- The camera follows her smoothly.
- The dog follows a breadcrumb trail about 1.5 tiles behind:
  - runs when she moves, sits when she stops;
  - sometimes wanders and sniffs nearby;
  - tap the dog to pet it (a hop and a little heart).
- Things happen where Millie is. Tap a thing and she walks next to it, then does it:
  - fill the feeder;
  - collect eggs;
  - lift the trap;
  - open a tank (`goTank(i)`);
  - sit on the bench.
- **Mowing:** with Mow on she pushes the mower along her path and every grass tile she passes is cut. No stripes. Make sure every grass tile changes; Puti saw some grass background that didn't.
- **Birds:** sit on the bench (or stand still) and birds come close. Tap a bird once to watch it. A ring fills above it for about 1.5 s while Millie stays still, then it goes in the Book. No holding: Puti's finger was covering the bird.
- **Fishing:** catch fish in the stream or lake and bring them home to stock your pond. Kept fish swim in the pond.
- **Hens and wild chickens:** Puti asked how to catch them, so make it obvious. Grain shows a short hint. A wild chicken pecking near the grain can be caught by walking up and tapping it.
- Keep: the four stages and the Move card, decorating (Build), the trap → `takeHome` flow, tank stands, `landSetStage`, `LAND.setTool`, and the Book categories.

**Status after round 2 (26 October):** done as above. Pierre lives only in the house (Puti didn't want him in the tank view). The home renders one canvas pixel per art pixel and scales up crisp, and holds 60 fps at 4× CPU slowdown on a 390 px phone. The camera keeps to the part of the map with something on it.

## Round 3: the net and the cull tank (26 October)

Puti's note on Sort was "cull manually, but not this interface". She asked for the catch from Shrimp Tanks instead, with the same animation and sound.

- **Tap a shrimp** and it goes into her net (`catch-bucket.png`) in the top-left corner of the tank, with her catch sound.
  - The flight is hers: 760 ms, eased out, fading to half, tilted along the path.
  - On a narrow screen the art is cropped at the sides, so the net slides right to stay in view.
  - Tank shrimp keep out from under the net, so it's clear which ones are in it.
- **It can slip away:** 18% while grazing, 31% otherwise, times its escape gene, with her push sound and "Shrimp slipped away". A shrimp that's already fleeing, or one in a tank of 40 or more, is always caught.
- **Tap a shrimp in the net** to put it back in its own tank.
- **The bar under the tank** shows while the net has shrimp: Move to cull tank, Move to (each other tank), Put back.
- **Hold a shrimp** for about half a second to look closer (the card with Move, Pet shop and Name). A ring fills while you hold.
- **The cull tank** (`T.role = 'cull'`):
  - The first Move to cull tank puts Grandma's old tank on a free stand, free.
  - With no free stand, you pick one of your tanks.
  - The Colony card can make a tank the cull tank, or stop.
  - Now and then a hobbyist comes by and takes some, free: a 30% chance a day, more when the tank is full. Grown ones go first, 3–12 at a time, or a quarter to a half of a full tank. `S.stats.given` counts them.
- **36 at a time:** each time you come to look at a tank, 36 of its shrimp are out, picked at random. In the game the rest are hiding in the moss and wood ("36 of 80 out").
  - Netted ones leave the view and nobody takes their place. Babies and new arrivals join while there's room.
  - Netted shrimp keep growing while they wait in the net, as in her bucket.
  - To cull a big tank you come back often, so starting early is easier.
  - Checking for sick shrimp is different: the shrimp you see then stand for the whole tank, so one check is enough.
- **Sort is gone.** Its Try entry keeps the id `sort`, so her note stays with it, and is now "Net and cull tank". Its Try it button adds 60 reds of mixed grade if the tank has fewer than 60.

Code: in tank.js, `netCatch`, `netReturn`, `netMoveTo`, `netToCull`, `cullTank`, `setCullRole`, `hobbyists`, `sampleInds` (`SHOW_N = 36`), `netBar` and `drawNet`. The art is in netart.js (`SPR.net`, `NET_ART`). The sounds are `sfx('catch')` (her two samples) and `sfx('push')`. Tests: `test/net.js`.

## Round 3: the dog walks up and down (26 October)

Puti asked for walking up and down: the dog only had side, standing and sitting frames.
- New frames 14–31 on the dog sheet (see Assets above), drawn to match hers. Her notes on the first try: from behind, the back of the head, the back and the top of the tail are dark, the face, belly and under the tail yellow; walking down must not look tilted (her sitting frame is turned a little to the side); and walking down should show some of the back or at least the tail.
- Her notes on the second try: tip the face down a little (more top of the head, less face), make the ears easier to see, especially walking away, and give them a small swing. Done: the eyes and nose sit lower, the ears are drawn on their own with her tan stripe (wider from behind) and swing out 1–2 px as the head comes down.
- The home picks the view from the way he's going (`dogDir` in land.js, with a little stickiness so diagonals don't flicker): side frames for sideways, 14–21 toward you, 22–29 away.
- When he stops he stands facing that way (30, 31), then sits facing you (13) as before.

## Round 4 (27 October): her animals, characters and ground tiles

- Hens, birds and fish are her drawings (`pixel-src/animals`): her white hen animation (`anim/hen-white-anim.aseprite`, tags idle, walk, peck, run) recoloured into brown, speckled, blue egg and wild; her bulbul and myna (idle, peck, hop, fly; peck tips the whole bird from the feet); her seven fish (swim). Other birds and fish are gone.
- Dog, Pierre and Grandma come from her `characters/*.aseprite` (`pixel-src/chars`). `src/animart.js` is generated by `pixel-src/animals/export_js.py`; do not edit it.
- Pond fish keep nose, tail, back and belly in the water (`fishFits`); each has a home spot that fits.
- Ground painting in Build: lawn, long grass, dirt, sand, stone paving, wood deck, terracotta tiles, pond water. Tap one tile or drag to paint a run. Not inside rooms, not under things. Each painted tile is a 1x1 edit that remembers what was there first, so Take it away gives that back. The stream and grass are there from the start and can be painted over. Water, grass, dirt and sand edges are worked out from the neighbours on the fly (`composeTile`); floors and tiles have straight edges.
- `#full` (or `landFull()`) opens the land fully upgraded for previews.
- The dog (`stepDog`): a hidden love score `S.land.dogLove` (0-100, starts at 20). Walking together adds about 1 a minute, petting adds about 1 a pet (less if you pet again within 4 s), and it grows slower near 100. While he's with you a timer runs (25-50 s, plus up to about 2 minutes more with love); when it runs out he goes off somewhere 3-9 tiles away, sniffs, stands, sits. On his own, every 3 s he may think of you (3% plus up to 35% with love) and runs over from wherever he is. When you set off he reacts after 0.15-1.2 s; when you stop he takes a step or two, stands 1-5 s, then sits. Zoomies: 4-8 quick dashes left and right, now and then when you're idle or when you pet him, more with love. He runs at 360 px/s when far behind (was about 270).
