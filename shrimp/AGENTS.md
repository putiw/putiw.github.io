# Universal Shrimp: notes for agents

Read this before you change anything in `shrimp/`. It covers what the game is, how the code is laid out, the owner's design rules, how to test, and the mistakes that have already cost time.

## What the game is

Universal Shrimp is a single-file HTML idle/sim game in the spirit of Universal Paperclips. You keep cherry shrimp in Abu Dhabi and sell them (prices in AED). Grandpa gives you his old tank and a dream: a shrimp tank in every home on Earth, in about ten years.

- **Arc:** cycle a tank → breed and sell shrimp → hand-pack starter kits → automate → farms and regions → a million owners → everyone (8.2B) → Space, where shrimp are released to live free in alien waters (never kept in tanks out there).
- **Feel:** a short sci-fi novel told through Grandpa's letters, chapters and story events, with something to do at every stage. Small minigames (health checks, salt baths, QC rounds, hand packing) fill the slow parts.
- **Owner:** Puti. She plays it on her phone, mostly at 390 px wide, and reviews by screenshot. She builds it with two agents, Codex and Claude, working on the same file.

## Files

| Path | What it is |
|---|---|
| `shrimp/index.html` | The whole game: markup, CSS, sim and UI in one file, sprites embedded as data URIs. The only game file. |
| `shrimp-tanks/` | A different, older game (Phaser build). Don't confuse the two. |
| `tests/shrimp-balance.cjs` | Focused checks for mechanics, migrations and key UI strings. Must pass. |
| `tests/shrimp-academy.cjs` | Research and chapter checks. Must pass. |
| `tests/shrimp-playthrough.cjs` | Strong bot, full game. Prints `WIN <year> <day> ...`. |
| `tests/shrimp-average-playthrough.cjs` | Average-player bot. Prints `RESULT {...}` with `earth`, `waitingMinutes`. |
| `tests/shrimp-space-playthrough.cjs` | Space chapter bot. |
| `tests/README-shrimp.md` | Running changelog of every design and balance pass, newest at the bottom. Append a section when you change behaviour. |
| `tests/shrimp-economy-notes.md` | Production chain and price table. |

This repo is Puti's public website, so anything committed here is public.

## Working with the other agent

- Codex commits and pushes. Other agents don't commit or push unless Puti asks.
- Both agents edit `shrimp/index.html`. Before you edit, check whether it changed since you last saw it (`git status`, `git log`, or a checksum). If it did, read the diff and build on it. Never overwrite the other agent's work with an older copy.
- Leave the tests passing on Puti's machine, not just on yours.

## Code layout

### The sim boundary

The sim lives between `// ==SIM-START==` and `// ==SIM-END==`. The tests load only that slice into a Node `vm` with no DOM.

- Code inside the sim must not call UI helpers: `$`, `aed`, `big`, `setT`, `toast`, `spotlight`, `labMode`, `render`, or anything that touches `document`. Use `cnt()` or `toLocaleString` for numbers in log text, and `farmCap(G)>=10` instead of `labMode()`.
- The bots also load the body of `updateReveal()`, which sits outside the sim. Any UI call added there must be guarded, for example `typeof spotlight==='function'` or `typeof SPOT_T!=='undefined'`.

### State and saves

- All game state is `G`. `newGame()` builds it and `stepGame(G)` advances a quarter day. `dayRollover(G)` runs the daily systems (illness, QC, welfare, orders).
- Saves go through `migrate(G)`. Any new field needs a default for old saves.
- New milestones or intros reach old saves too. If an old player shouldn't get them, mark them seen in a migration step (see `progress.v2` and `progress.v3` in `migrate`).

### Progression and reveal

| Piece | What it does |
|---|---|
| `rv(k)` and `G.ob` flags | Whether a feature is revealed. `updateReveal()` sets flags, `applyReveal()` shows or hides elements. |
| `MILESTONES` | Story cards: chapters, intros (`intro:1`, tutorial cards) and story events (`story:1` with `choices`). Triggers live in `milestoneConditions(G)`. Choices apply in `storyChoose()`. |
| `markNewCards()` | Folding and queueing for collapsible `.coll` cards. `OPEN_ON_REVEAL` lists cards that open when revealed. |
| `spotWatch()` | The first time any section in `SPOT_INFO` or tab in `SPOT_TAB` is on screen, it gets the spotlight: dim the rest, green ring, one line of text above, game paused, tap anywhere to go on. One at a time, after story cards. Every new section needs a `SPOT_INFO` line. |
| `guideTarget()` / `applyGuide()` | The one "Next" hint and the pulsing button it points at. |
| `HELP` + `.explain` | The ? on each card header. Long explanations go in `HELP[id]` or in paragraphs with class `explain` (hidden in the card, shown in the ? box). |
| `ideas(G)` | Up to three loose suggestions in the ? popup (Ideas). Only for tabs already open. `CARE_GOALS`/`phaseInfo` are legacy, no longer shown. |
| `maxSpeed(G)` | Speeds. 4× while the tank cycles with no shrimp, 2× once shrimp are in, 4× after the first hatchery, 12× and 40× later. |

### Systems added recently

- **Tank view** (`updateTankView`, `tv*` functions, `SPR` sprites): a canvas drawn from a sample of the real colony, using art layers from Puti's Shrimp Tanks game. It runs at about 30 fps and stops off screen, on other tabs and when the app is hidden. Pellets follow `T.chem.food`.
- **Illness** (`illDay`, `treatIll`, `startIll`): spreads until treated, stages from a few sick to a crash, and a crash wipes the whole tank. New shrimp from Trade carry a flatworm risk until salt dipped (`dipFresh`). The health check is a tap-the-sick-shrimp minigame in the tank view (`openHealth`). The salt bath is a timing minigame (`openSalt`).
- **Quality checks** (`QC_STEPS`, `qcRound`, `sickKitRate`, `openQC`): a manual round once a month, steps automated in order, and a strictness setting.
- **Hand packing** (`PACK_STEPS`, `handStep`, `buyTool`): five taps a kit, automated one tool at a time.

## How to read Puti's requests

Her messages usually name a symptom, give one example, and sketch a fix ("maybe like..."). The sketch is a guess. The principle behind it is the request. Apply it to the whole game, not just the example, and when something pushes or tells the player what to do, remove it or make it optional rather than rewording it.

1. The player decides. No tasks, targets, unlock rules, prices to save for or nudges toward one route (a second tank, a specific item). Suggestions sit in the ? popup as options, only for tabs already open. Gates use room or progress the player chose, never a fixed path (kits need 60 L of stocked tanks, the farm license 120 L, any mix).
2. Show, don't tell. A glowing button or a spotlight beats a sentence. The guide bar is for events only (an order, illness, new stock to dip, QC due), everything optional is soft and goes to the popup.
3. Little on screen, detail on tap. Explanations behind ?, cards collapsible, alerts state the problem in a line plus the one fix when it's dangerous.
4. What's shown matches what's true. Food on screen matches "all eaten", highlights follow their target, the tank view shows the shrimp it says it has, bars read the way a glance reads them (Fed is full when they're full).
5. Real shrimp keeping. Illness, salt dips, cycling, manual first then automated.
6. One thing at a time, only when needed. One spotlight, then at least 15 s of play before the next.
7. Her voice. Short, plain, comma-spliced, no AI patterns (list below).

## The owner's design rules

These come from Puti's feedback. Treat them as requirements.

**Progress and goals**
- No goal card. Ideas live in the ? popup as loose suggestions (automate, more room, make the tank nicer), never an exact item to save for, never prices, counts or cash targets. Players pick their own order. Never mention something whose tab isn't open yet. Soft "Meanwhile" guide hints also go in the popup; the guide bar above the tank is only for a real next step.
- Do things by hand first, then automate one piece at a time.
- There should always be something to do or improve, not one button and done.
- Bottleneck advice only comes from the paid consultancy, never free.
- The manual Feed button stays until the three starter tanks are automated.
- Bought shrimp are breeders and can never be sold.

**Revealing things**
- Reveal one new thing at a time, and only when it's needed. Before the first shrimp the player sees only the cycle card, the test kit, ammonia and the Water button.
- Every new section gets a spotlight, not a toast. Toasts are only for small confirmations ("Added ammonia").
- Keep card text to one short line with the action in **bold**. Explanations go behind the ?.
- Everything should be collapsible.

**Look**
- Light mode only. The palette is the "field notebook": cream paper, dark ink, forest-green buttons, cherry red for the shrimp. ✦ influence is plum.
- Inter everywhere, numbers use tabular figures. No serif or mono fonts.
- Primary buttons are green. Disabled buttons are flat grey, never faded green.
- Highlight rings sit inside the element, so they never touch neighbours. Leave at least 10 px between buttons and the content under them.
- It must fit a 360 px phone with no horizontal scroll and no cut-off labels.

**Writing**
- Write all player-facing text in Puti's voice: short, plain, comma-spliced, no build-up. No "AI vibe" phrasing, no flourishes ("a testament to", "embark", "journey").
- Patterns she flags as Claude-style, so don't write them: "X, so you don't have to", "for good", "by itself" / "on its own", "Nothing fancy, nothing wrong" style pairs, punchlines like "Finally, a ... that matters", poetic lists ("photos, classrooms, hospital rooms, a lighthouse"), aphorisms ("less netting, more numbers"), and "Label. Description" lines. No quote marks around narration.
- The Shrimp Times can be political. Stay away from the sensitive topics, like abortion and religion.
- Influence ✦ only pays for culture projects. Public opinion has two audiences, Water and Fire.

**Shrimp**
- Lifespans: about 90% of babies reach adulthood, 80% reach a year, 20% reach two years.
- Cycling takes 3–5 game weeks.
- Salt dips are a short dip, about 30–45 s at a tablespoon per cup.
- Shrimp welfare matters: owners' tanks have a welfare score, and sick kits cost ✦.

**Weight**
- No game engines. One canvas, small embedded assets. The file is about 430 KB, so keep additions small.

## Pacing targets

| Player | Real time to finish Earth |
|---|---|
| Average | ~1.5 h |
| Slow or perfectionist | ~2.5 h |
| Speedrun | ~30 min, and it should be really hard |

In game days, best play is about 7 years and casual play about 15.

Latest bot results (seed 7):

| Bot | Result |
|---|---|
| Strong | Earth won on day 2,352 |
| Average | Earth on day 6,657, 41.6 min of waiting at top speed (not total play time) |

When you change balance, run both bots and compare against these. Report the before and after numbers, and add them to `tests/README-shrimp.md`.

## Testing checklist

1. `node tests/shrimp-balance.cjs` and `node tests/shrimp-academy.cjs` pass.
2. For balance or sim changes, also run both playthrough bots. Watch for `INSOLVENT` and for big timing shifts.
3. Load the page at 390 px and 360 px wide and look at screenshots of every tab at several stages: the opening, first sale, kits, farm, a million owners, win. Check for console errors, overflow and cut-off text.
4. If you changed behaviour on purpose, update the matching test, and add a test for any new mechanic.
5. Append a short section to `tests/README-shrimp.md`.

**Screenshot pitfalls.** Full-page screenshots show fixed bars and toasts in odd places. The guide can scroll the page by itself. A spotlight can block clicks, so close it or stub `spotlight` in scan scripts.

## Mistakes already made

**Editing**
- **Unanchored replacements.** A regex meant for one text block hit the first match elsewhere and overwrote Grandpa's letters. Assert that each replacement matches exactly once.
- **Removing an element without a full search.** Dropping the pH chip left code that still read `wp-ph` and crashed `render()`. Search for every id you remove.
- **`setT` / `textContent` on structured elements.** This wipes child markup, which is how the tab icons got lost. Target the inner label instead.

**UI**
- **Sticky classes.** A leftover `queued` class hid cards for good, and a forced accordion hid core cards like Packing. Never auto-close sections the player needs.
- **Attribute collisions.** Reusing `data-tab` on the guide bar clashed with tab-switching code. Use a new attribute name.
- **Highlights outside the element.** Rings drawn outside buttons touched the readings under them.
- **Faded disabled buttons.** A faded green disabled button looked tappable.
- **Hardcoded text that goes stale.** A toast said "Tap 4×" while only 2× was open.
- **Visibility checks.** `IntersectionObserver` was unreliable here. Use a bounding-rect check, and stop animations off screen.
- **Visuals out of step with the sim.** Food pellets showed after the sim said all food was eaten. Drive visuals from sim state.

**Sim and tests**
- **UI helpers in the sim.** `labMode()` inside `illDay` broke every test.
- **Unguarded UI calls in `updateReveal`.** They break the bots.
- **Story events that block the clock.** A late story event fired on the ten-year day and blocked a test. Gate new events by day and condition.
- **Bots going broke after new spending.** Keep cash cushions in bot policies and re-run them.

**Design**
- **Too many new things at once.** Water care, pH and KH chips and a toast all appeared right before the first shrimp purchase. Stage reveals behind real need, and blink an existing button if an action is needed early.
- **Fixing the one example instead of the rule.** Spotlight on water care only, when she meant every new section; softening the goal card three times when she wanted no push at all.
- **Explanations in card bodies, and goals that read like homework.** Both drew complaints. Move text behind ?. A goal card with one item to save for still felt linear and got removed.
- **Overwriting the other agent's work.** Always diff before you write.

## Open work

Planned and agreed with Puti, not built yet:

**Sales channels.** Shops, Online and Community, all open to everyone, each with its own upgrade tree.
- Opening a channel costs money, and you can't afford all three early, so you pick which to grow first.
- Shops and Online trees cost money, Community costs ✦.
- You set how kits are split between open channels.

**Other planned work**
- About 8 straight +% projects become pick-one pairs, and filler gets cut.
- The player chooses the next region from 2–3 options with trade-offs, instead of a fixed order.
- Story pacing: story cards at least ~30 game days apart, plus new late-game beats with choices that last (Mira's science fair, a flatworm recall, the rival's merger offer, a letter from Iceland).
- A proper ending: a recap of the run (timeline, choices made, ocean impact, Grandpa's last note).

**Known gaps**
- Kits still unlock in the background after 200 home-bred sales and 2 stocked tanks. They could unlock from the care ladder instead.
- The first babies trigger three spotlights in a row (Care, Colony, Recent events). They could be merged into one.
