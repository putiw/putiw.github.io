# Universal Shrimp: notes for agents

Read this before you change anything in `shrimp/`. It covers what the game is, how the code is laid out, the owner's design rules, how to test, and the mistakes that have already cost time.

## Names you will meet in the code

- **`gp` means grandparent, and the grandparent is Grandma.** The game used to have Grandpa, so some saved fields and ids still say `gp`, `gpLoan`, `keep:'gp'`, `G.me.gp`, the story keys `gp_net`, the ad id `grandpa`, and the unused lab project id `labgrandpa`. They are saved in players' games, so do not rename them without a migration. Functions and constants were renamed (`GRANDMA_LETTERS`, `grandmaLetter`, `payGrandma`). The late spouse is Grandpa (fish soup, the Maryam boat story, "calls you in for dinner"). Grandpa is alive in the story: he wants a well, he calls you in for dinner, Grandma writes that you write like he talks. Don't write him as dead.
- **Player name.** Typed on the first card, kept in `G.name` (and localStorage `shrimp-name` for the next game). Always read it with `nm(G)` and put it into text with `N(G,text)`: `{,name}` becomes `, Name` or nothing, `{name|fallback}` becomes the name or the fallback. `nm` strips everything except letters, digits, space, dot, hyphen and caps at 16 characters, because the name goes into `innerHTML`. Never print `G.name` directly.
- **Staff:** Kiki (packing), Luca (sales), Gema (shops), Mimi (social), Lucy (the lab scientist).

## What the game is

Universal Shrimp is a single-file HTML idle/sim game in the spirit of Universal Paperclips. You keep cherry shrimp in Abu Dhabi and sell them (prices in AED). Grandma gives you her old tank and a dream: a shrimp tank in every home on Earth, in about ten years.

- **Arc:** cycle a tank → breed and sell shrimp → hand-pack starter kits → automate → farms and regions → a million owners → everyone (8.2B) → Space, where shrimp are released to live free in alien waters (never kept in tanks out there).
- **Feel:** a short sci-fi novel told through Grandma's letters, chapters and story events, with something to do at every stage. Small minigames (health checks, salt baths, QC rounds, hand packing) fill the slow parts.
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
- **Illness and danger alerts** (`illDay`, `treatIll`, `startIll`, `tips`, `updateAlerts`): sickness is intentionally quiet at first. At illness stage 3 (“Shrimp are dying fast”), `tips()` adds a bad alert; `updateAlerts()` turns the top-right `?` into red `!!`, shows the message when tapped, and (with the default slow-danger setting) drops speed to 1× once for that alert. Stage 4 is “About to crash”; a crash wipes the tank. This alert is late by design, not the first-symptom warning, so keep the stage and UI contract in sync if changing illness timing. New shrimp from Trade carry a flatworm risk until salt dipped (`dipFresh`). The health check is a tap-the-sick-shrimp minigame in the tank view (`openHealth`). The salt bath is a timing minigame (`openSalt`). The failed-molt white ring sits where the head shell meets the body (sprite x 54–60), not behind the eye.
- **Choices and heart** (`FORK_Q`, `forkOpts`, `addHeart`, `dealsDay`, `laterDay`, `endingLines`, `endingVerdict`): kind or cold answers to one problem, hidden heart score, delayed news, and the win card's "What the world looks like" list.
- **Quality checks** (`QC_STEPS`, `qcRound`, `sickKitRate`, `openQC`): a manual round once a month, steps automated in order, and a strictness setting.
- **Hand packing** (`PACK_STEPS`, `handStep`, `buyTool`): five taps a kit, automated one tool at a time.
- **Who you become** (`TRAITS`, `trAdd`, `G.ps`, `traitVals`, `endingPick`, `ENDINGS`): nine hidden traits from choices and play style pick one of 16 endings. Every new choice should move a trait other than Means too (tag it in `TRAIT_TAGS`, `STORY_TAGS`, or the choice itself).
- **You tab** (`G.me`, `PICKS`, `MOMENTS`, `HOUSE`): free time, Grandma, a place of your own. Moments only show on the tab.
- **Money trouble and dirty money** (`broke`, `debtDay`, `G.dye`, fight night pick, `E.dirty`, `FAVOURS`, `E.network`, `E.turned`): the network deal is the point of no return.
- **Trees** (`treesFor`, `TREES`, `E.trees`): each type sees its own tree, Space is the curious one's.
- **Late cards** (`CARDS3`): data-driven story cards, `[label, result, traits, effect, ending line]`. A card only if different people would really choose differently, otherwise a headline (`HEADLINES`). Story cards and Shrimp Times stories take turns, each 30 s to 2 min of play apart, and a choice's own story comes right after it. Always use `newsLine`/`newsEvent`, never push to `R.log` directly.
- **Income after Earth** (`foodIncome`, `sideIncome`): new income comes from things already built and shows as one finance line, never a new screen or button.

## How to read Puti's requests

Her messages usually name a symptom, give one example, and sketch a fix ("maybe like..."). The sketch is a guess. The principle behind it is the request. Apply it to the whole game, not just the example, and when something pushes or tells the player what to do, remove it or make it optional rather than rewording it.

1. The player decides. No tasks, targets, unlock rules, prices to save for or nudges toward one route (a second tank, a specific item). Suggestions sit in the ? popup as options, only for tabs already open. Gates use room or progress the player chose, never a fixed path (kits need 60 L of stocked tanks, the farm license 120 L, any mix).
   Marketing is a real lever: referrals run at `wordOfMouth(G)` (30% with no marketing, up to 100% with an online shop, ads and shops). Don't let demand scale without it.
2. Show, don't tell. A glowing button or a spotlight beats a sentence. The guide bar is for events only (an order, illness, new stock to dip, QC due), everything optional is soft and goes to the popup.
3. Little on screen, detail on tap. Explanations behind ?, cards collapsible, alerts state the problem in a line plus the one fix when it's dangerous.
4. What's shown matches what's true. Food on screen matches "all eaten", highlights follow their target, the tank view shows the shrimp it says it has, bars read the way a glance reads them (Fed is full when they're full).
5. Real shrimp keeping. The player uses their eyes: no Care card and no sickness alerts until shrimp are dying fast. Tap the tank to lock in (no page scroll), tap sick shrimp, drag to wipe glass algae. Sickness comes from a play-time clock (about 2.5 to 7 min at normal risk, faster when water, crowding, dirty glass or new stock raise `illRisk`). Treats are unlocked in Equipment and picked weekly under Feeding.
   Was:  Illness, salt dips, cycling, manual first then automated.
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
- Influence ✦ is knowing the right people. It starts with Mira (ev_mira), nothing earns ✦ before her. Costs mix money and ✦ by what makes sense: things money can buy cost AED, things that need someone on your side cost ✦, some cost both.
- There is one public mood (E.op.m), no audiences. Water and Fire were removed at Puti's request, don't bring them back.
- The player picks a path, nobody pushes it. Choices come as a question with a kind answer and a cold one (PROJ items with fk, question in FORK_Q). Cold answers are cheaper or faster. A hidden heart score (E.heart) adds up kind (+) and cold (−) picks, campaigns and film stories. It is never shown as a number. It slows or speeds the good Shrimp Times stories (heartMult), and the win card shows what the world became and Grandma's verdict. The monopoly/dictator path is allowed and valid.
- Space opens only after everyone on Earth has a tank, never at year ten. Puti has asked for this twice, don't change it back.
- Don't paint good and evil (不要脸谱化善恶). Every cold answer has a real logistical reason in its text, and every kind answer says what it costs. The ending says what each path cost, it doesn't judge.
- World is split into University, Media, Politics and Nature, one thing per track at a time.
- Films: the player picks what each film is really about. Effects are hidden, the Shrimp Times reviews it.

**Shrimp**
- Lifespans: about 90% of babies reach adulthood, 80% reach a year, 20% reach two years.
- Cycling takes 3–5 game weeks.
- Salt dips are a short dip, about 30–45 s at a tablespoon per cup.
- Shrimp welfare matters: owners' tanks have a welfare score, and sick kits cost ✦.

**Weight**
- No game engines. One canvas, small embedded assets. The file is about 740 KB (most of it embedded sprites and sound), so keep additions small.

## Feature checklist

Run this before every push. Each line is something Puti asked for. If a line fails, fix it before anything else. Tests: `node tests/shrimp-balance.cjs`, `node tests/shrimp-academy.cjs`, `node tests/shrimp-me.cjs`, then the bots (Pacing targets). By hand means open the game in a browser at 390 px wide.

**Look and layout**
- [ ] Light mode only, Inter font, every card header the same height, 8 px between cards, no sideways scroll at 360 and 390 px (by hand, every tab).
- [ ] Top bar: `?` top right from the start, settings inside it, the person button beside it once free time opens, both 34×30 and lined up (by hand).
- [ ] Spotlights go in this order: pause and dim the whole screen so nothing can be tapped, glide the page to the thing, then cut the ring around it, show the tip and buzz (Android only, iPhone Safari has no vibration for web pages). The ring sits on the card the text talks about, the card sits between the header and the tab bar with room for the tip, never two within 15 s, never while cleaning or a health check is open, never on a card inside a closed section. Check with `node tests/shrimp-spotlights.cjs` after a strong bot run.
- [ ] The sticky header covers everything above it, nothing scrolls through a gap at the top (by hand on a phone).
- [ ] Water care opens the first time the tank actually needs a change (nitrate over 20, KH under 2.5, GH under 5, ammonia or nitrite showing). Its spotlight lights only the Water button in the header, not the whole header.
- [ ] When Water care is introduced the Water button pulses with it.
- [ ] Milestone cards scroll so their top sits under the header, not the middle.

**Tank and shrimp**
- [ ] Newborn shrimp are small white dots, juveniles pale pink, adults their grade colour (by hand, tank view). The Chapter 2 Babies card says white dots that get redder with each molt.
- [ ] Failed-molt ring sits where the head shell meets the body.
- [ ] Health check: tap the sick ones, pick a cure, then play the cure (by hand, all three):
  - Mineral pellets: drop pellets, everyone eats, GH+ one scoop at a time, GH ends up in the real tank, a big jump kills some, leftovers rot.
  - Water change: hold Drain to about half, tap the sick ones to net them while it's low, hold Refill to the line, the real tank gets that change.
  - Salt dip: no salt choice, hold to dip, aim 4.5 s (45 s real in small text), 3.5 to 5.5 s cures, past 7 s kills some. Same dip for new shrimp from Trade and for quality checks.
- [ ] Heat alert slows the game once per alert per 30 days, not every tenth of a degree.
- [ ] First illness ever spreads slower.
- [ ] Heater is "Winter heater", fan is "Summer cooling fan".

**Choices and who you become**
- [ ] Every cold answer has a logistical reason, every kind answer says what it costs. No good/evil caricature.
- [ ] Every new choice moves a trait other than Means (`TRAIT_TAGS`, `STORY_TAGS`, choice data).
- [ ] Story cards come one at a time, 30 s to 2 min of play apart. Money trouble, the ending and intro cards never wait (`shrimp-me`).
- [ ] Shrimp Times stories come one at a time, 30 s to 2 min apart, never on top of a card, and a story caused by your choice comes 8 to 20 s after it (`shrimp-me`). After the first issue, news is a short toast, it doesn't switch tabs.
- [ ] Only choices where different people really choose differently are cards, the rest are headlines (`HEADLINES`).
- [ ] The ending page: type and variation, who you became, Mira, what the world looks like, Grandma's letter (with the visits line), from the tank, lives you didn't live, all 16 endings, then the charts (`endCharts`: owners over the years, cash, and where your traits sit).
- [ ] Space opens only after Earth, and only for curious players (`spaceOpen`). Other types get their own tree in World.

- [ ] The ending page shows four charts under who you became: owners over time with milestone dots, cash over time, the nine traits, and where the money went (`chartDay` records `G.chart`, `endCharts` draws plain SVG with the takeaway in each title). Saves from before this only chart from the day recording began.
- [ ] Sound: `shrimp/water.mp3` and `shrimp/music.mp3` from the shrimp tanks game, same graph as there (master 0.82, bus 0.5, water 0.4 with 4.8 s fades, music 0.16 with 2.2 s fades). Mute button always in the top bar (`tb-mute`), starts on the first tap, pauses when the tab is hidden, off switch in Settings (localStorage `shrimp-music`). App icons: `favicon.ico`, `icon-32.png`, `icon-192.png`, `icon-180.png` (apple-touch), cropped from the tank art.
- [ ] When shrimp are in the tank, kits aren't open yet and the clock is paused, a spotlight points at 1× and says the game is paused. The 1× button pulses until it is pressed (`G.opt.pauseTold`, `G.opt.nudge`). Once per save. There is no "time has never run" check: time runs during cycling, so that version never fired.
- [ ] `BUILD` near `toast` changes with every release; an open game checks every 15 minutes and offers a reload when a newer one is live. Bump it when you ship.
- [ ] Shrimp videos count as reach, not ego, so they don't push you away from Space.

**Play-test fixes, Oct 23 (check these stay true)**
- [ ] Every story choice looks the same (no green first option) and shows what it does under the text (`choiceFx` tries it on a copy of the game: ✦, AED, mood, kits, owners). A choice you can't afford is greyed with a reason.
- [ ] Out of money before any farm talks about your shrimp, not farms.
- [ ] Quality check runs water → look → salt dip → done without freezing.
- [ ] The packing table keeps one size while you tap through the steps.
- [ ] Bulk kit orders: kits can be put in from stock by hand; the card says whether packers or shrimp are the limit.
- [ ] Moss/snail and planted kits cost per kit only, offered in Projects on the Kits tab.
- [ ] Consultants appear once you have had AED 20k.
- [ ] The SOP project (recipe tank) opens standard tanks 4 to 12; standard tanks come with everything, decor included. Tapping a row in the All tanks table looks at that tank alone (health check, restock), Back returns to the recipe.
- [ ] When farms take over (first hatchery, or farms ≥ 10 kits/day) the farm takes every tank but the first (`retireTanks`), so no more alerts about tanks you can't reach.
- [ ] Your day (`ACTS`, `M.day`, `dayHours`, `lifeDay` daily, `personalWeek` weekly): one typical day, set with −/+ per activity (`addHour`). Rest is whatever is left. Only the totals count, so the day is laid out from them (`layDay`: wake at 7, sleep last) and drawn as one timeline bar. Repeats daily. 3 hours a day ≈ one old weekly pick. Sleep and exercise move health (`M.hp`): under 45 a doctor card, under 40 mild illness (3 weeks, 2% of cash), under 20 serious illness (a year, half the cash, company at half speed via `workMult`). Long work days and short nights build strain (`M.bo`): at 100 you burn out for four weeks (hours do nothing, ✦ at half). Work hours nudge sales ±2% an hour around 8. Design hours win prizes at 150/500/1200 h, video hours go viral at 400 h, paper hours raise research odds after 300 h. Once a year lane stays (trips home, holidays, conference).
- [ ] Story prices that were fixed grow with the company (`aiCost` 20% of cash plus 2% of every kit sale, `rivalCost`, `schoolKits`).
- [ ] The spotlight ring follows its card if anything moves (`spotTrack`).
- [ ] Once a second region is open and the tank buttons leave the top bar, the owners count (x of 8.2B) sits in the top bar instead.
- [ ] Research lines (`RLINES`, `RPOS`, `rlDay`): six fields (energy, water, automation and AI, genes, food, health), each can fund PhD students, postdocs and PI labs at the same time, paid daily, until you stop. Finds are random (`rlOdds`), a quarter of them come out as nothing. Each find is a small permanent bonus (`rlM`). Funding counts toward curiosity (know). The older academy chain (one study at a time, degrees, teaching, crew) still drives Space. Postdocs cost USD 50k a year base; postdoc pay can go to 60k or 75k (`PD_PAY`, `setPdPay`), which only moves traits, never the odds. Papers come out steadily per person (`RPOS.pap`: PhD 0.6, postdoc 1, PI lab 5 a year), separate from finds.
- [ ] Big machines cost more to run: mega hatchery, ocean ranch and arcology upkeep are about 5 AED per kit; packing halls, hubs and the global network cost more per kit the bigger they are.
- [ ] Word of mouth needs more marketing as you grow (`mktNeed`, square root of owners). The consultant and the bottleneck say "Limit: marketing" when it falls under 75%.
- [ ] The Ministry (campaigns) opens once the farm has taken your tanks and 1,000 kits are sold, Shrimp Pictures right after; both cheaper than before.
- [ ] Late pages stay short: all-automatic QC is one line, smaller shops and farm tiers hide behind a button.
- [ ] Saves from the Grandpa version: the You tab history is rewritten to today's wording on load (`fixGpText`).
- [ ] A tank crash gets its own card (`crash`, `G.lastCrash`), and an empty tank before kits shows a red alert. "Out of money" (`broke`) only shows when selling everything still leaves you short, and it says farm or shrimp to match where you are.
- [ ] Fixed prices (projects, welfare, gala, crew, story choices) never fall under 0.2% of cash (`scM`, `si`). Excel is free once kits open.
- [ ] Selling or closing the company goes straight to the ending card.
- [ ] Frozen accounts say why and what is blocked. The reason is also in the ? popup, along with paying Grandma back. New Shrimp Times stories drop in from the top as a small newspaper banner.

**You tab and Grandma**
- [ ] Opens once the first tank feeds itself and changes its own water, with the Your Saturdays card.
- [ ] Free time is one typical day of 24 hours (`ACTS`), set with −/+ rows on the You tab. Burnout after long heavy stretches costs lost weeks, and each new burnout shows the Tired card again.
- [ ] Grandma moments only show on the tab and pass if nobody looks.
- [ ] Writing letters tells Grandma's story bit by bit. Her milestone letters live in the You tab once it opens.
- [ ] Climbers get shorter letters, floaters get longer ones (`gpVoice`).
- [ ] A place of your own: land, walls (for me, Grandma or both), then the rest, offered with AED 300k spare.
- [ ] Your own tank after the first industrial hatchery is always there, no decision. The farm takes the other tanks, the 20 L stays (treats by hand, happy treats). Late game it is irrelevant, so most people ignore it. How much you tended it (`ownLevel` 0/1/2) changes a line in the ending and nudges kin. The year-eight green-glass card only asks start again or leave it, it never removes the tank.
- [ ] Mira shows up at 11+ moments (`mira_*` milestones plus the fisher card), each following something you did. Paths without Space get a `lastchap` card before the ending (`LASTCH`, `lastChapter`).

**People and money**
- [ ] Kiki, Luca, Gema and Mimi each get a goodbye card when a machine takes their job, options change over time.
- [ ] Out of money card: Grandma (once), neighbours, bank, the man at the market, washing money, sell something, bankruptcy (two taps, the game ends).
- [ ] Buyout offer after a million owners, two taps, the game ends with the Sold ending.
- [ ] Dyed shrimp, fight nights, the investor, three favours, the routes deal is the point of no return, the police way back costs almost everything.
- [ ] Mira reacts to dye, fight night, her scholarship, the investor, the year after the police.
- [ ] Academia or industry: pay postdocs more to stay (rare discoveries, Wonder) or hire them into the company (cheaper kits, Use, opens the designer lab).
- [ ] Shrimp food income (more with the food factory) and water, power and freight income keep paying after Earth. Space's last world is always reachable.
- [ ] No "Affordable in about…" lines anywhere.

**Text**
- [ ] Puti's voice: short, plain, comma-spliced. No punchlines, no "not X but Y", no twist endings. Made-up countries for satire. No abortion or religion.

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
| Strong, cold answers (default) | Earth won on day 2,668, empire_dictator |
| Strong, kind answers (`BOT_HEART=kind`) | Earth won on day 2,738, garden_village |
| Average, curious and kind (default) | Earth on day 6,011, space done day 7,404 |
| Average, cold answers (`BOT_HEART=cold`) | Earth on day 5,975, no Space (Shrimp Island instead) |

The average bot has 21 years to finish both chapters (it used to finish space on day 7,292 of 7,300).

When you change balance, run both bots and compare against these. Report the before and after numbers, and add them to `tests/README-shrimp.md`.

## Testing checklist

### Cross-system change protocol

Before adding or changing a feature, trace its existing state and every consumer; do not stop at the new button or card. In this single-file game, changes commonly cross simulation, save migration, progression, alerts, story pacing, and UI rendering.

1. Search for the state field, action/function, unlock flag, rendered IDs, and tests before editing. Read the owning functions and current working-tree diff first.
2. Check the full lifecycle: new game defaults → old-save migration → unlock/reveal → player action → simulation update → alert/story/ending → save/load. Preserve the player's existing accordion/tab state unless the feature is a newly revealed item.
3. Check neighbouring systems explicitly: tank care ↔ illness ↔ alerts/health check; breeding ↔ sales ↔ kits/packing ↔ farms/economy; research ↔ costs/reserves ↔ Earth/Space gates; milestones ↔ spotlights ↔ story/news pacing; header controls ↔ all tabs/mobile layouts.
4. Add or update a focused regression test for each changed rule and run every affected suite. For UI-only work, verify the actual browser at narrow phone widths and at the progression stage where the feature appears. For balance/economy work, compare the strong and average bots; for Space work, run the Space continuation too.
5. Review adjacent features after the change, not only the target path. Report any untested path explicitly; update the feature checklist and changelog when behaviour changes.

1. Fast checks, run every time: `node tests/shrimp-balance.cjs` (50), `node tests/shrimp-academy.cjs` (10), `node tests/shrimp-me.cjs` (30: free time, Grandma, endings, schedule, research lines, charts).
2. For balance or sim changes, run the bots: `node tests/shrimp-playthrough.cjs` (strong cold), `BOT_HEART=kind node tests/shrimp-playthrough.cjs` (strong kind), `node tests/shrimp-average-playthrough.cjs` (average curious player, goes to Space). Watch for `INSOLVENT` and big timing shifts against Pacing targets. `REVIEW_OUTPUT=<dir>` sets where the run json with snapshots goes (default `/private/tmp/shrimp-tests`, which doesn't exist on Linux).
3. Spotlight sweep in a real browser: `SPOT_RUN=<dir>/run-7.json node tests/shrimp-spotlights.cjs` after a strong bot run. Every spotlight on every tab at six stages.
   For Space changes, continue the academy fixture with `ACADEMY_RUN=<dir>/run-7.json node tests/shrimp-space-playthrough.cjs` and verify all planets remain sustainable.
4. Load the page at 390 px and 360 px wide and look at screenshots of every tab at several stages: the opening, first sale, kits, farm, a million owners, win, and the ending page. Check for console errors, overflow and cut-off text. Load snapshots from the run json into the page (`G=snap;migrate(G);render()`).
5. Sound needs a real http server (`python3 -m http.server` in `shrimp/`), `file://` can't fetch the mp3s.
6. If you changed behaviour on purpose, update the matching test, and add a test for any new mechanic.
7. Append a short section to `tests/README-shrimp.md`, bump `BUILD`, and keep this file's checklist true.

### Before signing off any game change

Do not report a feature as finished just because its new path works once. Check the change against the game around it:

- Read the final diff and confirm every changed file belongs to the request; check `git status` for accidental screenshots, logs, or other scratch files.
- Trace the feature from new-game defaults and old-save migration through unlock, UI, player action, simulation, alerts/stories, and save/load. Confirm it does not bypass a progression gate or reveal several unrelated things at once.
- Check the neighboring game loops listed in the cross-system protocol above. In particular, make sure new choices or purchases do not silently change shrimp welfare, breeder stock, kit output, cash reserves, story pacing, ending state, or Earth/Space access.
- Verify the visible player path at the stage where it unlocks, including the narrow phone layout. Check that the button, message, alert, tab, and follow-up action agree with the underlying state.
- Run the tests required by the testing checklist and state which ones passed. If a required browser or playthrough check was skipped, say so plainly; do not imply it passed.
- Update the feature notes, changelog, tests, and `BUILD` when the shipped behavior changes. Leave the next agent a clear note for any unresolved issue or known edge case.

**Screenshot pitfalls.** Full-page screenshots show fixed bars and toasts in odd places. The guide can scroll the page by itself. A spotlight can block clicks, so close it or stub `spotlight` in scan scripts.

## Mistakes already made

**Editing**
- **Unanchored replacements.** A regex meant for one text block hit the first match elsewhere and overwrote Grandma's letters. Assert that each replacement matches exactly once.
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
- **Card headers drifting apart.** Fold-up cards and `<details>` cards used different header rules, so heights, gaps and arrows differed. All card headers share one 30 px row, one CSS-drawn chevron and the 8 px card gap. `details{margin-top}` must not apply to cards. Long header notes cut off with … instead of wrapping the title.
- **Spotlights during the tank lock.** A new card spotlight scrolled the page while the tank was locked for cleaning, and the player was stuck. No spotlight, card jump or tab switch while `TVLOCK` or a health check is open.
- **Scrolling a card under the sticky header.** `scrollIntoView({block:'start'})` hid the top of story cards behind the top bar. Scroll to the card's top minus the header height.
- **Tiny shrimp washed out.** Babies at 0.36 scale looked white from the dither and sheen. Babies get a solid body with no sheen.
- **Caching sprites before they decode.** In a test page, shrimp bodies were cached before the images loaded on a phone, so only legs showed. Never cache a drawing until every image it uses has loaded.

**Sim and tests**
- **Screenshots in the repo.** A browser script run from the repo folder wrote `l1.png` and `l2.png` there and they got pushed. Write scratch files outside the repo and check `git status` before `git add`.
- **Comparing `innerHTML` to a built string.** The browser rewrites SVG and attributes, so the compare never matches and the node is rebuilt every frame (charts flickered, tooltips died). Compare against a cached copy of the string instead.
- **Spotlight on a fixed layer.** iPhone Safari has no scroll anchoring, so when something above the card grew, the page content moved and a `position:fixed` ring stayed put. The overlay now lives in page coordinates (`#spot` is absolute and as tall as the page), the ring follows its card every frame (`spotTrack`), and only header and tab-bar targets use fixed positioning. A scroll the player didn't make (no touch, wheel or key in the last 0.8 s) re-places the ring instead of closing it.
- **Same thing spotlit twice.** Different paths (tab, intro card, card sweep) each kept their own "seen" note. Any spotlight now marks its element, its card and its tab as seen. A tab spotlight also carries the first card's line and marks that card, and tapping a button in a card marks it seen.
- **Story text rewritten as policy memos.** One pass made every late card "grounded" by turning it into explainer prose: semicolons, "sovereignty", "(+3% adoption ceiling)", and the jokes removed. Grounded means the premise holds up (scale, facts, cause and effect), not that the voice goes flat. Keep Puti's voice and fix the logic.
- **Satire that doesn't fit the scale.** News like "cocktail sales drop 12%" at 10,000 owners, or "the last person on Earth" with 4 million left, reads as bad writing. Match every news line and card to the owner count where it fires.
- **The ending preview drifting from the game.** `shrimp/ending-playtest-data.js` is built from the game now: run `node tests/build-ending-playtest.cjs` after changing forks, late cards or endings. The `extras` list in `ending-playtest.html` is still hand-written.
- **Buttons rebuilt under a finger.** Writing `innerHTML` every render swapped buttons out mid-tap, so holds and fast taps got lost. Use `el.mhtml=html` (the `morph` helper): it patches the DOM in place, keeps `open` on folds and the classes in `KEEP_CLS`, and does nothing when the string hasn't changed.
- **Prices that stop mattering.** A fixed AED 20M choice is free with AED 300B in the bank. Fixed prices go through `scM(G,m)` / `si(G,i)`: never less than 0.2% of your cash (or ✦). Story labels are rewritten with the scaled number (`needM`/`needI` carry `.cost`/`.inf`).
- **A story choice that ends the game.** Selling or closing the company set `ended` but nothing queued the ending, so the game sat frozen. The choice handler now runs `detectMilestones` right away.
- **Old text in an open tab.** A tab left open for hours keeps running old code; Puti saw a "he" that was already fixed. That is what `BUILD` and the reload prompt are for.
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
- The player chooses the next region from 2–3 options with trade-offs, instead of a fixed order.
- Story pacing: story cards at least ~30 game days apart, plus new late-game beats with choices that last (Mira's science fair, a flatworm recall, the rival's merger offer, a letter from Iceland).

- The own tank's year-eight card (`c_mytank`) only checks the glass.

**Known gaps**
- Kits open after 200 home-bred sales and 60 L of tanks with shrimp in them (`KIT_UNLOCK`, `KIT_ROOM`). The guide says so from 100 sold. They could unlock from the care ladder instead.
- The first babies trigger a few spotlights in a row (Colony, Recent events). They could be merged into one.
