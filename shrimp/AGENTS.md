# Universal Shrimp: notes for agents

Read this before you change anything in `shrimp/`. It covers what the game is, how the code is laid out, the owner's design rules, how to test, and the mistakes that have already cost time.

## Token budget (read first)

Puti is on a Max plan and one week of this project used most of a weekly limit by Tuesday. Most of it went to helper agents (each re-reads the ~940 KB game file many times) and to one week-long chat that re-read its whole history on every reply. So:
- Do the work yourself. Start a helper agent only for something genuinely parallel and large, and never two that edit `index.html` at the same time.
- Never read `index.html` whole. `grep -n` for the function, then read only those lines (`sed -n 'A,Bp'`, cut long lines).
- Run the fast suites (`shrimp-balance`, `shrimp-academy`, `shrimp-me`) after each change. Run bots and the spotlight sweep only once before a deploy, not after every edit.
- Keep chats short: one topic per chat, then start fresh. This file and `tests/README-shrimp.md` carry the state between chats.
- Don't reply to every background notice or commit reminder at length.

## Names you will meet in the code

- **`gp` means grandparent, and the grandparent is Grandma.** The game used to have Grandpa, so some saved fields and ids still say `gp`, `gpLoan`, `keep:'gp'`, `G.me.gp`, the story keys `gp_net`, the ad id `grandpa`, and the unused lab project id `labgrandpa`. They are saved in players' games, so do not rename them without a migration. Functions and constants were renamed (`GRANDMA_LETTERS`, `grandmaLetter`, `payGrandma`). Grandpa died before the story starts (Puti, 27 Oct). He is only in the past: the fish market, his boat Maryam (named after his mother, Grandma still pays the harbour fee), his fishing hat, "you write like Grandpa used to talk". Don't write him as alive.
- **Player name.** Typed on the first card, kept in `G.name` (and localStorage `shrimp-name` for the next game). Always read it with `nm(G)` and put it into text with `N(G,text)`: `{,name}` becomes `, Name` or nothing, `{name|fallback}` becomes the name or the fallback. `nm` strips everything except letters, digits, space, dot, hyphen and caps at 16 characters, because the name goes into `innerHTML`. Never print `G.name` directly.
- **Staff:** Kiki (packing), Luca (sales), Gema (shops), Mimi (social), Lucy (the lab scientist).

## What the game is

Universal Shrimp is a single-file HTML idle/sim game in the spirit of Universal Paperclips. You keep cherry shrimp in Abu Dhabi and sell them (prices in AED). Grandma gives you her old tank and a dream: a shrimp tank in every home on Earth, in about ten years.

- **Arc:** cycle a tank → breed and sell shrimp → hand-pack starter kits → automate → farms and regions → a million owners → everyone (8.2B, or the goal you changed it to) → Space: a search program finds planets with water, you gene edit the shrimp or terraform the planet to fit, a seed ship sets up a base, then the shrimp are let go to live free (never kept in tanks out there). Space opens after any finished goal, for curious players only (`spaceOpen`).
- **Feel:** a short sci-fi novel told through Grandma's letters, chapters and story events, with something to do at every stage. Small minigames (health checks, salt baths, QC rounds, hand packing) fill the slow parts.
- **Owner:** Puti. She plays it on her phone, mostly at 390 px wide, and reviews by screenshot. She builds it with two agents, Codex and Claude, working on the same file.

## Files

| Path | What it is |
|---|---|
| `shrimp/index.html` | The whole game: markup, CSS, sim and UI in one file, sprites embedded as data URIs. |
| `shrimp/home.html` | Grandma's land (27 Oct): the pixel map built from the Shrimp Home Prototype (`shrimp-proto` branch, `shrimp-home-proto/`, `python3 build.py --game`). Generated, don't edit by hand. Opened full screen over the game in an iframe. |
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
| `maxSpeed(G)` | Speeds. 4× while the tank cycles with no shrimp, 2× once shrimp are in, 4× after the first hatchery, 12× later, 40× from the hard part (4B people) on. |

### Systems added recently

- **The hard part** (`HARD`, `HARD_GOALS`, `hardDay`, `hardBuy`, `hardSetGoal`, `hardCap`, `hardTarget`, `streamReady`, `renderHard`): opens at 4B people with a tank at home (Chapter 6, Grandma's kitchen). From there `kitCap` is `hardEasy()` (about 4.3B) plus the people reached in ten groups (too hot, no water, too poor, war, forced from home, hard to reach, can't do it alone, can't see, said no, never met). Each group has fix, workaround, dark and money options that ramp in over their days; war takes one ending option only. "Rethink the goal" changes the target (every home, every home that wants one, 90%, 75%) or ends the game now (the spreadsheet, good enough, no number). The living-stream ending is hidden: it appears only with the Rewild tree, mangroves, clean farm water, the Taiwan streams, a river answer, and no forced option. Forced options (`direct:1`: paying ministers, national programs, Glass Hearts, credit) put tanks in homes straight over their ramp instead of waiting for orders, and once you force anything public mood no longer slows sales (`opMult`). Said no is reached through governments, not a law on people: national programs with a factory in each country, or paying the ministers. Delivering to the uncontacted village kills it and takes those people off the target, the goal bar says "People who die don't need a tank" and Grandma stops writing for a year (`G.me.gpSilent`). The old c_war, c_water and c_last cards and the "last holdouts" project are gone, the hard part replaces them.
- **Shrimpcoin** (`coinOf`, `coinLaunch`, `coinPlant`, `coinBuy`, `coinSell`, `coinDay`, `renderCoin`): offered at 100M people. One coin per mangrove tree. Honest count mints a coin a year later for each tree that lived (60%), the seedling count mints everything at once and leaves unbacked coins that can surface on satellite photos (price crash, mood, heart). Price drifts back toward AED 12 (a tree's offset value) with hype events and noise, and your big buys and sells move it (`coinDepth`). The World card shows a one-year price chart with the takeaway in the title. When the price is above what a coin costs to make (`coinBreakEven`: AED 6.67 honest, AED 4 seedlings), outside planters plant in proportion to the gap (`otrees`), their coins add to supply and pull the price back, and you keep a 5% registry fee (`coinMintOut`). Buying coins is how a player pays the world to plant. Honest trees past 100M, yours and others', count as the mangrove step of the living-stream ending.
- **Mall stores** (24 Oct): `MALLS`, `storeGoal` (one store in five malls), `buyStores(G,r,n)`, `trust(G)` multiplies the word-of-mouth term in `kitDemand`. 60% trust in a region with none of your stores, 85% at home. Batch size follows how many you run (`storeBatchMax`). Rent, license and staff are daily (`storeDayCost`), counted in `fixedOverhead` and `operatingNet`.
- **Pause rules** (`CARD_HOLD`, `cardResume`, `pauseCue`, `PAUSE_T0`, `LAST_RUN`): cards restore the speed; a blocked `setSpeed` stores it in `CARD_HOLD`. `renderMilestone` waits while `TVLOCK`/`HC`/`SB`/`QCR` are active. The game goes to 1× by itself after the first shrimp purchase. While paused the tank view is still (no movement, no leg wiggle, `v.clk` only advances while running), except during cleaning, health checks and dips. The "Time is paused · tap to play" pill sits just above the tab bar (`body.pill-on` lifts toasts above it). Hand feeding lasts one day (`T.handUntil`, `handLeft`), no top-up. Biofilm: unfed shrimp stay half full (`bio`), hunger climbs past 50% about 10% a day to 90% (`T.chem.hd`), nutrition sinks toward 10%, which cuts breeding and baby grade but rarely kills.
- **Top action buttons** (`actNeed`, `setActs`): Feed shows while any tank lacks an auto feeder, Water while any tank lacks an auto water changer, Sell until Trade closes (`labMode`) or salespeople sell from every tank. With none left the row hides and the owners bar takes its place.
- **Too much new water** (`WC_CRASH` 200, `WC_AUTO_MAX` 150, `wcWeek`, `T.wcLog`, `T.moltCrash`): more than 200% changed in 7 days, all molt at once, half of everyone 10+ days old dies. Automatic changes skip rather than pass 150%. The Water toast warns from 120%, the header chip says "wait a day" from 150%.
- **New-player cues** (`guideTarget`, `SC_WC`, `#tb-wc.need`, `#tb-feed.first-feed`): the screen should carry a player with nobody guiding them. Feed glows when hand feeding runs out, Water glows when water needs changing (and during a stalled cycle), any danger tip on a tank is the NEXT step with its fix button glowing, heat suggests fan, chiller, then AC or ice, kits put affordable growth steps ahead of hand packing. Mid game: free hints teach each business lever once (`leversTaught`), then go quiet; idle money points at the consultants, and consultant advice glows its button (Pass 86). Don't add free hints that diagnose the bottleneck. Check with a cue-only bot (see Pass 80) after changing the guide.
- **Control tooltips** (`CTL_TIPS`): every slider label is tappable. Add a line when you add a slider.
- **Grandma money** (`GP_SEND`, `gpSendAmt`, `M.send` 0–3).
- **Shady loan** (`sharkLend`, `sharkPay`, `sharkTake`, `loanRow`, `E.shark.deal`, `SHARK_RATE`, `SHARK_DAYS`): pass the money threshold as the 6th `bbtn` argument and a "Know a guy?" button appears when the player has at least half. One loan, 20% a month, collects after 90 days. See Pass 81.
- **Shared tank settings** (`SHARED_SET`, `shareSet`, `shareNow`): every tank runs on the same feeding, water, temperature, treat and sales settings; a change on one goes to all. The copy-settings button is gone. Old saves are unified to Tank 1 once (`G.opt.sharedSet`).
- **Cooling**: room AC removed (`G.ac` forced off in `migrate`). The frozen bottle lasts about a day (`iceBottle`, refill once half melted) and floats in the tank view (`SPR.bottle`, Puti's sketch). Fan, then the 450 AED thermostat chiller, are the real fixes.
- **Seeded tanks** (`T.seeded`, `openTankSheet`, `#tsheet`, `TS`): tanks 2 and 3 copy Tank 1's bacteria, no cycling. The sheet offers the auto feeder and auto water changer for the new tank (Puti asked for this, Pass 81, restored in Pass 148), and since Pass 155 the tank isn't finished without both: Another tank needs the cash for tank and gear (`tankGear`), the new tank carries `T.gearDue` until both are in, Got it stays grey (`gearDone`), and a reload reopens the sheet. The Supplies bacteria starter and Seed from rows only show for a tank that isn't cycled. The sheet blocks cards and spotlights like the health check does.
- **Farm takes the tanks** (`ownTankNow`): the moment the first farm is built, extra tanks go to the farm and Tank 1 keeps 20. The owntank story card only tells you afterwards; it used to wait its turn in the story queue while all the tanks stayed (Pass 149).
- **Automated tanks** (Pass 155): with an auto feeder on the selected tank the Ration slider hides (Auto feed under Automation does it). With an auto water changer Water care moves to Gear right under Automation (`wcPlace`, `WC_HOME`) and its hand Change slider hides; the heater and cooling go with it.
- **Breeders** (`keepN`, `T.set.keepL`, `PACK_YOUNG`, Pass 151): one shared per-litre setting in Trade, Sales rules (0.2 to 5, default 0.5, so a 20 L tank keeps 10 and a 320 L tank 160). Breeders are never sold or packed. Packing leaves the young until a tank holds 6 shrimp per breeder (`packAbove` = `keepN` x `PACK_YOUNG`, the old Pack above 3/L at the default). Pack above in Kits is gone, merged into this (Puti, 29 Oct). Old saves get `keepL` from Tank 1's old breeder count over its litres.
- **First sickness guide**: until the player finishes one health check (`G.opt.hcDone`), a sick tank is a real Next step in `guideTarget` (`ill<tank>_<day>`), with a ring on the tank view and the caption "Some look sick · tap to check". A partly successful cure sets `ill.checked` to wait five days. After the first check, sickness is quiet again (rule 5).
- **Lab birthday parties** (`party1`, `party2`, `partyGo`): Grandma's old grad school lab, twice per game (day 90+ with shrimp, then after Europe). Going costs one day of operating net and lowers burnout.
- **Quiet spells** (`QUIET`, `quietDay`, `markEvent`, `QUIET_MS`, `QUIET_DAYS`): story cards, illnesses and orders call `markEvent`; after a quiet stretch `quietDay` fires one eligible event and sets `G.flash` for the UI toast.
- **Growing pains** (`PAINS`, `painMult`, `painPick`, `painNote`): story cards between 8k and 3M owners. Open or being set up: demand × `PAIN_K`, farm output × `PAIN_SHIP`. Costs are days of operating profit. Old saves mark passed pains done in `migrate`.
- **Play style** (`STYLE_KINDS` wrappers, `styleVals`, `styleTop`): purchase functions are wrapped at the end of the sim to count steady/methodical habits. Feeds `endingScores` and adds a subtitle, paragraph and Grandma line to the ending.
- **Grandma's land** (`gp_land`, `gp_scam`, `gpLand`, `gpScam`, `landDay`): at AED 500k sent. Yes freezes purchases 30 days (`frozenWhy='land'`) then grants the house land. The house card moves to the Tank tab when `ownTank`.
- **Gala causes** (`GALA_FOR`, `galaLines`): `buyProj(G,'gala',cause)`.
- **Story choice previews** (`choiceFx(key,i,all)`, `showAfter`, `storyShowDesc`): before the pick only the label and its cost show (AED, ✦, a month away), not the description. What happened (the description and the effects) comes after, in a popup the player has to close (`#after`, the game waits under it). Fork projects work the same way (name and cost, then `p.d` in the popup), and hard-part options show their news line after. Chapters, the intro, the space dream, win, game over and broke keep their text up front.
- **Gear scope** (`G.opt.upAll`): with several tanks one switch at the top of Equipment picks This tank / All tanks. Decor and treats sit under `h3.track` headings.
- **Ladders** (`topIdx`, `farmBuyable`, `farmNext`, `FARM_AT`, `shopBuyable`, `hasFarm`, `lineTop`): any farm kind bigger than your top one can be bought once its kits-sold gate opens, no need to own the one below (Pass 126); smaller kinds stop being sold. Projects that need a hatchery use `hasFarm(G,'hatch')` (that kind or bigger). Packing lines show your top tier and up; the next line tier needs one you've had (`E.lineStage`). Selling is by hand only (Puti, 28 Oct: no auto swap): farms and lines have Sell 1 and Sell all at half the price paid, two taps (`sellRow`, `changeFarm` 'sell'/'sellall', `sellLine`); older kinds sit in an Older farms / Older packing lines fold. Small shops stop once the first mall store opens.
- **Research merge** (`rlStaff`, `academyDay`, `scienceFork`): one Research card on the Lab tab (`academy-card`). Staff raise the research rate. The "pay to keep postdocs" fork waits for two postdocs and four papers.
- **Your day hours** (`workPer`, `HOUR_STEPS`, `hoursDay`): work hours move kit and shrimp demand, hour milestones fire events. Grandma calls with a short supply-and-demand lesson at about 3 kits a day (`M.call='lesson'`, the person button rings).
- **Tab layout** (28 Oct, Passes 119-122): tabs are Tank, Gear, Trade, Kits, Ads, World and Lab (`TAB_NAME`), plus the You page under the person button. Kits: Kits (price, profit, stock; rest under More numbers), Making kits (`c-staff`: packing table, tools, the ready/kept line (packing waits for 6 shrimp per breeder, Pass 151), Pack buttons, packers, machines; header Packed N of M today), Kit development (kit extras: Java moss +36, nerite snail +8, driftwood +20, plants +30, each on or off, `KIT_EXTRAS`, `wb(G).on`), Quality checks last as its own card marked optional (`#qccard`, Pass 135). Ads: Ads (one-off ads as a button row, online shop folds once bought), Shops (one line per region with one Open button, Close stores fold), Sales staff (`c-sales`, `e-sales`), Marketing development with the campaign desk inside (`#op-wrap`, ✦ stays in Ads), Regions (shows the ceiling). World: The hard part, Shaping the world, Owners' tanks, the coast card (Mangroves / Shrimpcoin plus Shrimp Island in `#coin-island`), other trees, The Shrimp Times last with a Science section (`newsLine(G,t,1)`). The Lab tab opens at 3,000 kits sold (`ACADEMY_AT`) with one merged Research card and the school and university projects. Trade hides once the farms run things (`labMode`). Money over time, Consultants, Operating controls and Wages live in the Money sheet behind the header cash once kits open (`finOpen`, `openFin`, `wageLines`). The readings chart hides once the farm takes your tanks. `projTab(p)` decides where a project shows up; the sim still uses `projectArea` for gating. Player word for racks, barns and hatcheries is farm.
- **Homes, not people** (`HH_AVG`, `hhDiv`, `hhPeople`, `addOwners`): one kit is one home of 1 to 4 people (2.5 on average, random per kit for small sales). Kit demand is divided by the household size once 2,000 kits are sold, so people-growth pace stays the same and kit counts are about 2.5x lower than before. Always add owners through `addOwners`.

- **Tank view** (`updateTankView`, `tv*` functions, `SPR` sprites): a canvas drawn from a sample of the real colony, using art layers from Puti's Shrimp Tanks game. It runs at about 30 fps and stops off screen, on other tabs and when the app is hidden. Pellets follow `T.chem.food`.
- **Illness and danger alerts** (`illDay`, `treatIll`, `startIll`, `tips`, `updateAlerts`): sickness is intentionally quiet at first. At illness stage 3 (“Shrimp are dying fast”), `tips()` adds a bad alert; `updateAlerts()` turns the top-right `?` into red `!!`, shows the message when tapped, and (with the default slow-danger setting) drops speed to 1× once for that alert. Stage 4 is “About to crash”; a crash wipes the tank. This alert is late by design, not the first-symptom warning, so keep the stage and UI contract in sync if changing illness timing. New shrimp from Trade carry a flatworm risk until salt dipped (`dipFresh`). The health check is a tap-the-sick-shrimp minigame in the tank view (`openHealth`). The salt bath is a timing minigame (`openSalt`). The failed-molt white ring sits where the head shell meets the body (sprite x 54–60), not behind the eye.
- **Choices and heart** (`FORK_Q`, `forkOpts`, `addHeart`, `dealsDay`, `laterDay`, `endingLines`, `endingVerdict`): kind or cold answers to one problem, hidden heart score, delayed news, and the win card's "What the world looks like" list.
- **Quality checks** (`QC_STEPS`, `qcRound`, `sickKitRate`, `openQC`): a manual round once a month, steps automated in order, and a strictness setting.
- **Hand packing** (`PACK_STEPS`, `handStep`, `buyTool`): five taps a kit, automated one tool at a time.
- **Who you become** (`TRAITS`, `trAdd`, `G.ps`, `traitVals`, `playVal`, `endingPick`, `ENDINGS`): seven hidden traits from choices and play pick one of 16 endings. Every new choice should move a trait other than Means too (tag it in `TRAIT_TAGS`, `STORY_TAGS`, or the choice itself). A trait reads the balance of pushes, not their volume: `trAdd` keeps the sum in `G.tr` and the sum of sizes in `G.trAbs`, and the choice part is sum / (sizes + `TRAIT_K`). Upgrades nearly everyone buys carry no tags; only forks and one-offs some players skip on principle do. Keep each negative pole reachable without crime, and keep risk for real bets, not for getting caught. The seven (Pass 110):
  - **drive**: driven (wants to achieve greatness) / easy-going (happy with a shrimp tank and some plants). Contentment, rest, saying enough, staying small, selling the company and family time are easy-going. Grandma time is easy-going. Old saves fold ego and reach into drive (`migrate`). Play: Your day work and dinners against Grandma, house, own tank and rest, measured from the default day (8 against 8 reads 0), time on the You page and own-tank jobs by hand. Never speed or region timing.
  - **means**: plays fair / ends justify means. `addHeart` adds heart × `HEART_TR` (0.3); repeated picks (campaigns, films, galas) count less each time (`repW`). On a means split the cold side pays about 1.5× and the fair side costs about 1.5×, and both costs show before the pick.
  - **know**: fine-tunes everything / good enough is good enough. 70% play: setting changes away from defaults, ? opens and chart opens per game year (`psNote` → `G.ps.tw/help/chart`), about −0.6 for nobody-touches-anything up to +0.8. Tags only on real measure, test or optimise against good-enough choices, never on curiosity or research.
  - **kin**: loves shrimp / shrimp are stock. Culling counts toward stock (`P.cull`).
  - **care**: helps strangers far away / looks after their own. Only on choices that split help between far and near. Grandma never pushes care.
  - **risk**: takes risks / careful.
  - **control**: has everything in order before moving on / moves on with loose ends. 70% play: at the first kit, each new farm tier (first rack included), each region and the space start, `prepNow` records optional tank gear, QC steps owned, stores in opened regions and no pain card left open. Never automation (the game pushes everyone to automate) and never cash (that's risk). Tags follow who decides: do it yourself or keep it = in control, hand it over (staff, partners, a vendor, a chatbot, a permit firm) = lets go.
  - Endings: empire = driven + ends justify means, garden = easy-going + fair + loves shrimp, question = fine-tunes + helps strangers, network = driven + good enough + helps strangers, drift = easy-going + looks after their own. `tests/shrimp-balance.cjs` checks that a random chooser sits within ±0.05 of the middle on every trait, that drive pushes are even, and that every family can be reached.
- **You tab** (`G.me`, `PICKS`, `MOMENTS`): Grandma's place first, then Grandma, Your day, and What happened (`me-log`, `M.dlog` via `dayLog`: hour milestones, design prizes, burnout, illness). Moments only show on the tab. Nothing about Grandma (Her years, letters, the loan, the visit count) shows until Check on Grandma, and it closes again every time you leave the tab (`GT_OPEN`, Pass 155).
- **Grandma's timeline** (`gtDay`, `gtCheck`, `gtAnswer`, `gtCollect`, `GT_YEAR`, `GT_EV`, `G.me.gt`): her life runs on the calendar (`gtDayOf`, day 0 is 20 Oct 2026). Nothing shows until the player taps Check on Grandma on the You page; then queued things, mailed money, moments (`M.cur`) and the lesson call show there, and Her years lists everything with dates. Every window is a game month or 3 minutes of play (`GT_WIN`, `GT_RT`), whichever is longer, then it happens without you (`miss` line, drive+). Yearly: her birthday 4 May (80 in 2027, only the first one rings the person button, after that you remember it), the New Year's Eve dinner (`CNY` table of real lunar dates 2026-2070, dinner the evening before, window the month before), and your birthday (`G.bday`, entered on the first card, default 1 Jan). New Year and your birthday bring pocket money (`gtGift`: 100, sometimes 150, at most 200, as Loans and gifts); missed means she mails it and you collect it on the next check. One-offs at least 60 days apart: WeChat, the TV (waits however long, counts the days), club president, selling Maryam (keep it and a sail comes every spring, help sell it and she gives you AED 30,000; consequences show only after the pick), Auntie Fang's funeral, the dance class, her knee, Göbekli Tepe at 3,000 kits a day (two weeks away, `M.trip`, `workMult` 0.5), the smaller flat. After 120 days and 6 minutes of play without a check she calls once, no penalty. Being there (`gtThere`) counts a visit, earns her next story (`M.lt`, `GP_STORY`), drive- only, never care. A check counts as a visit at most every 14 days. No-lines for moments are in `MOMENT_NO`. The ending adds checks, there and missed, and the stories she never told (`gtUntold`).
- **Money trouble and dirty money** (`broke`, `debtDay`, `G.dye`, fight night pick, `E.dirty`, `FAVOURS`, `E.network`, `E.turned`): the network deal is the point of no return.
- **Go and live on the land** (`canLeave`, `leaveCompany`, `G.left`, Pass 154): from the hard part or the win, with the land bought, in Settings. The ending review runs first (`left` card), then only Tank and You stay and the land runs on. "Your years at the company" in Settings reopens the review, after leaving or after the win (Pass 158). After the win the limit strip has a Look back button to the same sheet (`review`); no text should promise a tap that isn't a button. Sim: `progressionBlocked` allows `left`, `dayRollover` runs `leftDay` only.
- **Ending numbers** (`endNumsHTML`, `careMark`, `endStatsDay`, `READ`/`readStop`, Pass 154): the ending tells each player what they did, from the save. No line for not opening the ?.
- **Trees** (`treesFor`, `TREES`, `E.trees`): each type sees its own tree, Space is the curious one's.
- **Late cards** (`CARDS3`): data-driven story cards, `[label, result, traits, effect, ending line]`. A card only if different people would really choose differently, otherwise a headline (`HEADLINES`). Story cards and Shrimp Times stories take turns, each 30 s to 2 min of play apart, and a choice's own story comes right after it. Always use `newsLine`/`newsEvent`, never push to `R.log` directly.
- **Notes, not news** (`noteLine`, `NOTE_KINDS`, `paperOpen`, `updateNotes`, `#noteflash`): The Shrimp Times only prints once the World tab is there (`paperOpen`: World or the Lab open, or 10k+ people). Before that any `newsLine` becomes a "Word gets around" note. Personal things never go in the paper: Your day milestones are `noteLine(G,'day',t)`, Grandma is `noteLine(G,'grandma',t)`, small buzz about the kits is `noteLine(G,'word',t)`. Notes show one at a time as a banner like the newsflash with their own masthead, at least 12 s apart, never over a card, spotlight, cleaning or a check. Tapping a Your day or Grandma note opens the You page. `HOUR_NOTE` picks the channel for each Your day line; the viral video and the streaming show are news.
- **Income after Earth** (`foodIncome`, `sideIncome`): new income comes from things already built and shows as one finance line, never a new screen or button.
- **Food and tank care** (Pass 126, `foodRate`, `careGoods`, `topupShrimp`, `spareFarmShrimp`, `CARE_*`): the Finance line `foodsales`. Only homes with a living tank buy (homes × welfare): food from the first kit (×2 with the factory, pods on top), moss and plants once you have a shop or store, water test refills with the care app. Struggling tanks buy 10-shrimp top-ups twice a year at AED 40, only from farm output the kits don't use. 40% of the goods part is paid back as supplies. Income moves shrimp → kits → care: about 1–3% of kit income early, 10–15% at half of Earth, more than kits once reach is full.
- **Care plan** (Pass 127, fork `careplan`: `careplanfree` / `careplanpaid`, `planShare`, `planHomes`, `planDay`, `planFee`, `setPlanFee`, `PLAN_*`): opens with the care app at 1M owners, in the Kits tab with the other forks. Free: every living tank, you pay AED 0.10 a tank a month in calls (Distribution and customer support), welfare +5. Paid: the player sets the fee AED 5–60 a month with − and + in Owners' tanks; the share of living tanks that pay is mood × 1.4 (0.2–1) × e^(−fee/15), welfare +5 × that share, fees go to Food and tank care, calls still cost 0.10.

### Grandma's land (27 Oct)

- **Steps** (`GPLACE`, `gplaceNext`, `gplaceOffer`, `buyGplace`, `landOpen`, `renderGplace`, card `#me-gplace` in the You tab): A flat with a balcony AED 4k, A house with a garden AED 40k, Land with a stream AED 250k. The first two are paid steps with no map. Land opens the map. The Go button sits on Tank 1 in the Tank tab (`renderLandRow`, card `#landcard`, shown only with Tank 1 selected and no recipe), since the land's tank is Tank 1; the You tab card then just says Tank 1 lives there (Pass 128). Kept in `G.me.gplace`. "A place of your own" (`HOUSE`) was removed in Pass 151; old saves keep `G.me.house` only for `houseLines` in the ending.
- **The map** is `shrimp/home.html` in `#land-ov` (an iframe, full screen). The company keeps running behind it. Messages: the land sends `{land:1,type:'ready'|'spend'|'earn'|'take'|'care'|'back'}`, the game answers `{game:1,type:'cash'|'own'}` once a second while it's open (`landSend`).
- **Money**: the land spends and earns the company's cash (`pay`/`earn`, category `personal`).
- **Tank** (Pass 151): the land's Your tank is the game's Tank 1, the same tank. The game decides births and deaths (`landOwn` sends adults 75+ days and young); the land keeps every shrimp it knows (colour, name, age) and only adds or removes the difference (`syncOwn` in the land's `game.js`: oldest young grow up rather than being swapped, new young are children of the tank's own adults, netted shrimp still count). Land breeding and deaths are off for that tank, its shrimp only age. Moving shrimp in from another land tank posts `give` (`landGive`), moving out or selling posts `take` (`landTake`). Adult is 75 days on the land too. With the land owned, Tank 1 breeds by the land rule (`landCrowd`): past 2.5 shrimp a litre it is crowded, berries a third as often, deaths +1.2% a day per 100% over. Finishing a tank job there counts as care (`careDone`).
- **Time** (Pass 151): one clock, game days. While the land is open the company runs at real time (`LAND.acc`, a quarter day per 6 real hours, no play-time clock, so no new cards or notes), and the land's days come only from the game (`DAY_SEC=1e15`, `gameTime` advances on each `cash` message, up to 365 days at a time). Back at the company time flies and the land catches up next visit. The light still follows the player's clock. A card waiting under the land shows a banner on the land (`landNeed`, `#lneed`, tap to go back). Frozen accounts block spending on the land with the reason (`landFrozen`). Take/give carry a `seq` the game echoes in `own`, so the land ignores a sync sent before its change landed. Traps on the land run on real hours (`TRAP_MS`), everything else on game days. Hiding or reloading while on the land skips the company catch-up (`G.savedLand`). Tank 1's land crowding starts at 2.5 a litre or the packing line, whichever is higher. So at high Breeders the land's crowding rule rarely bites, on purpose: packing keeps the tank under it. Old saves migrate Breeders from Tank 1's count over its litres, capped at 1 per L and the old Pack above / 6. Time hidden on the land counts as real time (`LAND.acc`). The game only takes messages from its own land iframe (`e.source`).
- The land saves in its own localStorage key `shrimp-land-v1`.
- Eggs run on the company's clock (`eggClock`, `eggDay`, game day from the `cash` message, `GDAY`): every hen lays one egg a game day, so time that flies in the company fills the coop. Coop eggs go off after 28 days in winter down to 14 in summer (`outdoorT`, `eggLife`, wear in `eggW`), collected eggs keep. Away over 40 days, the coop holds only the last 40 days. Eggs sell for AED 3 (`EGG_AED`). Collecting says how many had gone off.
- Mowing pays: the mower is faster than walking (`MOW_SPEED` 330 against 210) and throws grass bits in three greens (Pass 151). Grandma gives AED 1 a tile, up to 300 tiles a game day (`mowPay`, `mowSettle`, `MOW_CAP`), paid 3 s after the mower stops, on a tool change or on Back.
- Bird sizes follow real length, bill to tail, at 2.5 art px a cm (`BIRD_PXCM`, `birdK`, `shrinkSpr`): sunbird 10 cm, bulbul 18, myna 23 (as drawn), kingfisher 24, hoopoe 27, parakeet 40. Hens are not on that scale yet (a hen is drawn about the size of a myna).
- Grass grows a step a game day (`grassClock`, `growGrass`): staying on the land it stays cut, time in the company grows it back. Feeders and wild chickens tick in `day`, on game days like everything else on the land (Pass 151).
- Look (Pass 140): no title card in the game. One header row: ‹ back (icon only under 410 px), cash, Home / Tank switch (`#lseg`), sound. Bottom tabs are hidden. On the map: clock chip top left (`#lclock`), ? top right, + and − bottom right (`ZOOMS`, `ZDEF` one step out, saved in `LS().zoom`), tools as small pixel-icon slots bottom left (`toolIcon`, `.tslot`). Puti has the icons as `shrimp-home-art/ui/tool-icons.aseprite` to redraw; swap her art in for `toolIcon` when she sends it.
- Millie, the dog, Pierre and Grandma with her armchair are drawn 1.5x (`CHK`, `drawSprK`), nearest pixel. A fresh land's floor patch is 5x4 tiles. Hens and other furniture are not scaled.
- Grass is calmed in `calmGrass`: her three greens pulled together and a slow tint (`lowF`). Only her exact grass colours change.
- Mowing pops a coin per paid tile and shows +AED over Millie. Thrown grain is a few small kernels per bit. The nest shows up to 8 eggs.
- Pierre's walk (`PW_POS`, `PW_LOOP`, `PW_FPS`, `catStep`): her frames 6-14 and 16-19 from `cat-pierre.aseprite`, positions and head set by Puti in the walk editor (head moves bake into the `walk` pose in `pixel-src/chars/add_pierre.py`, head and shoulders move together). He moves only by what each frame says.
- Birds: firecrest, great tit and magpie added, legs stay on through hops. Fish: Siamese algae eater and clown killifish, then (30 Oct) glowlight rasbora, Bolivian ram, zebra danio (`add_fish.py`).
- Dog and Millie idle life (Pass 159, `add_dog_millie.py`): dog wags, glances, sits in several poses, pants after running, naps (`dogLife`, `dogNap`, `dogFrame`, `dogSide`, `dogAx`); Millie switches between her two stands and blinks (`meIdle`, `MLay`, frames 52-53 are generated blinks). `pixel-src/animals/add_birds.py` regenerates every bird and the new fish from `tmp/fishandbird.aseprite` and checks no frame is cut off.
- Grandpa is dead on the land too: her armchair lines talk about him in the past.
- The You tab Grandma card shows one thing at a time with "N more after this." and mailed money as one envelope (`gt-mail-all`).
- No Next bar in the game (Pass 125): guide lines go to the ? popup only, the button glow stays.

## How to read Puti's requests

Her messages usually name a symptom, give one example, and sketch a fix ("maybe like..."). The sketch is a guess. The principle behind it is the request. Apply it to the whole game, not just the example, and when something pushes or tells the player what to do, remove it or make it optional rather than rewording it.

1. The player decides. No tasks, targets, unlock rules, prices to save for or nudges toward one route (a second tank, a specific item). Suggestions sit in the ? popup as options, only for tabs already open. Gates use room or progress the player chose, never a fixed path (kits need 60 L of tanks with shrimp in them, the farm license 120 L over three tanks with shrimp).
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
- Salespeople leave the shrimp this week's packing needs (`kitHold`), sell the rest and culls, and sell everything when there's no cash to pack. Default, no toggle (Pass 131).
- No goal card. Ideas live in the ? popup as loose suggestions (automate, more room, make the tank nicer), never an exact item to save for, never prices, counts or cash targets. Players pick their own order. Never mention something whose tab isn't open yet. Soft "Meanwhile" guide hints also go in the popup; the guide bar above the tank is only for a real next step.
- Do things by hand first, then automate one piece at a time.
- There should always be something to do or improve, not one button and done.
- Bottleneck advice only comes from the paid consultancy, never free.
- The top Feed, Water and Sell buttons stay only while they can matter (see Top action buttons).
- Bought shrimp are breeders and are never sold by the sales rules. The one exception: you can take any shrimp out by hand with Cull in Check shrimp, it sells as a cull.

**Revealing things**
- Anything new (cards, spotlights, notes, news) waits 15 s of play after the last new thing, on one clock (`introOK`, `introMark`, `progress.lastAck`, `CARD_GAP`). Paused time doesn't count, so nothing new comes while paused. Only urgent cards (`CARD_NOW`) and `now:1` spotlights (the pause-button one) skip it (Pass 147).
- Reveal one new thing at a time, and only when it's needed. Before the first shrimp the player sees only the cycle card, the test kit, ammonia, the speed buttons (from the bottle) and the Water button (from the cycled step). The full reveal order is in Pass 115 of `tests/README-shrimp.md`; keep new things behind a real need (`ob.temp`, `ob.room`, `ob.mins`, first babies, first sale, 10 kits).
- A tab bar with one tab is hidden. A dead button (grey with a countdown) is hidden until it can do something.
- A section is introduced once: if an intro or chapter card explains it, add it to `INTRO_COVERS` so no spotlight repeats it (Pass 152).
- Every new section gets a spotlight, not a toast. Toasts are only for small confirmations ("Added ammonia").
- Keep card text to one short line with the action in **bold**. Explanations go behind the ?.
- Everything should be collapsible.

**Look**
- Light mode only. The palette is the "field notebook": cream paper, dark ink, forest-green buttons, cherry red for the shrimp. ✦ influence is plum.
- Inter everywhere, numbers use tabular figures. No serif or mono fonts.
- Primary buttons are green. Disabled buttons are flat grey, never faded green.
- Highlight rings sit inside the element, so they never touch neighbours. Leave at least 10 px between buttons and the content under them.
- It must fit a 360 px phone with no horizontal scroll and no cut-off labels.

**Choices**
- A choice button shows only what it costs (money, money a day, influence ✦, kits), so the player knows if they can pick it. What it does shows on the What happened card afterwards (`choiceFx` with `all`).

**Writing**
- Write all player-facing text in Puti's voice: short, plain, comma-spliced, no build-up. No "AI vibe" phrasing, no flourishes ("a testament to", "embark", "journey").
- Patterns she flags as Claude-style, so don't write them: "X, so you don't have to", "for good", "by itself" / "on its own", "Nothing fancy, nothing wrong" style pairs, feel-good punchlines like "Finally, a ... that matters", poetic lists ("photos, classrooms, hospital rooms, a lighthouse"), slogan or life-lesson aphorisms ("less netting, more numbers"), chicken-soup-for-the-soul morals tied onto the end, and "Label. Description" lines. No quote marks around narration. A good line people would repeat is fine, she likes quotes, it just can't be the uplifting life-lesson kind.
- The Shrimp Times can be political. Stay away from the sensitive topics, like abortion and religion.
- Influence ✦ is knowing the right people. It starts with Mira (ev_mira), nothing earns ✦ before her. Costs mix money and ✦ by what makes sense: things money can buy cost AED, things that need someone on your side cost ✦, some cost both.
- There is one public mood (E.op.m), no audiences. Water and Fire were removed at Puti's request, don't bring them back.
- Late game (from about a million owners, Pass 154): a fixed AED price is no choice. Late costs are days of income (`needDays`, `incRef`), days of ✦ income (`needIDays`), your time (`needAway`), kits a day for a while (`slowKits`), or a share of income for years (`duesAdd`). The fast answer pays now (more want one, cheaper kits) and the bill comes later in the Times or the hard part (`later`, `hardMul`). Some cards are kind against kind (the rivers, the fisher). No backstop, no ending verdict.
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
- [ ] Text that changes with state (button subs, sell box, price foot) stays one line so nothing jumps (Pass 130, by hand at 360 px).
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

- [ ] The ending page shows four charts under who you became: owners over time with milestone dots, cash over time, the seven traits, and where the money went (`chartDay` records `G.chart`, `endCharts` draws plain SVG with the takeaway in each title). Saves from before this only chart from the day recording began.
- [ ] Sound: `shrimp/water.mp3` and `shrimp/music.mp3` from the shrimp tanks game, same graph as there (master 0.82, bus 0.5, water 0.4 with 4.8 s fades, music 0.16 with 2.2 s fades). Mute button always in the top bar (`tb-mute`), starts on the first tap, pauses when the tab is hidden, off switch in Settings (localStorage `shrimp-music`). App icons: `favicon.ico`, `icon-32.png`, `icon-192.png`, `icon-180.png` (apple-touch), cropped from the tank art.
- [ ] The first shrimp purchase starts the clock at 1×. Any time the clock is paused with nothing to read, the pause pill shows above the tab bar and 1× pulses (`pauseCue`, `G.opt.pauseTold`, `G.opt.nudge`). The tank is still while paused.
- [ ] `BUILD` near `toast` changes with every release; an open game checks every 15 minutes and offers a reload when a newer one is live. Bump it when you ship.
- [ ] Shrimp videos are driven (`drive`), and there is no ego or reach trait any more (Pass 110).

**Your own tank, Oct 26 (check these stay true)**
- The header shrimp count is everyShrimp(G): tanks plus farmStock (shrimp waiting + about 60 days of hatchery output on the racks). Tap-hold title splits it. Farms can only be bought or sold, no pausing (old saves with paused farms are sold on load). Don't use the word mothball in the game.
- The farm license (grow racks) needs 50 kits sold and Tanks 1-3 stocked with an auto feeder and auto water changer each (allStarterAuto). Buying the first farm of any kind brings the owntank card: extra tanks go to the farm, tank 1 keeps 20.
- Mangroves (the coin card, titled "Mangroves" until shrimpcoin launches) open at 10,000 kits sold (TREES_AT). A tap plants one tree (COIN_BATCH=1). Others copy: TREE_SPREAD 0.2% of all trees a day (x2 with the mangrove project), a mangrove gala buys seedlings with its money (treesFromGala), and after launch the coin-price gap adds more. Trees others plant before the coin make no coins; your own pre-coin trees mint a year after planting once the honest coin launches.
- The own-tank jobs (Gravel, Sponge, Trim, Pests) are ported from the Shrimp Home Prototype: vacuum tube that follows the finger with a bucket (babies get sucked in, tap them back), the sponge as its own sheet with a bucket of old tank water and flow meter, scissors through stems and moss with floating cuttings, tweezers for snails and flatworms. They finish through careDone; the vacuum does not change water (no water change).
- Culling lives inside Check shrimp: pick shrimp, tap Done looking, then choose Treat or Cull (with a ? that explains culling). The 16 you see stand for the tank: from scratch it takes 5 looks (CULL_ROUNDS), each covering a fifth, so each pick removes about adults/5/16 like it (cullEach). Once gone through, one look a month (CULL_MONTH) covers the whole tank. State is T.cull {cov, full}. Works from the first shrimp you buy. A one-time spotlight points at it once tank 1 has an auto feeder and auto water changer (G.opt.cullTour); the in-sheet 3-step guide shows until the first Treat or Cull (G.opt.cullGuided). Anything taken out there, bought or bred, sells as a cull. Normal selling never touches bought breeders.
- The home tank is 20 L from the farm on (`homeSmall`, no bigger tank), and once the farms sell everything berries slow toward 50 shrimp (`homeCrowd`, Puti 30 Oct).
- Mulm is shrimp waste: it builds with the shrimp in the tank and stops in an empty tank (after a crash), on the land too. Plants grow slowly, `C.grow` 1/350 a day (Puti, 30 Oct).
- From the first hatchery: one home tank with 20 shrimp, and Gravel, Sponge, Trim and Pests are optional. No alerts, guide steps or glowing buttons for them, ever. The mess shows in the tank, that's all.

**Last chapter and late game, Oct 26 (check these stay true)**
- Decisions show what happened after, in a popup you have to close. The screen holds still under the finger when content above changes (`anchorGet`/`anchorFix` wrap `render`), and a decision button ignores taps for half a second after it appears or moves (`SETTLE`).
- Shrimpcoin plants one stretch of coast per tap (`COIN_BATCH`, about 5,000 taps for every coast), others plant ten times slower, and Sell says why it's off. Space also opens for anyone with 40+ papers or a research group (`spaceResearch`).
- The hard part asks for the goal first, then shows one group at a time. Story cards are at least a minute apart. 40× opens with the hard part.
- No "x of y found" anywhere in research. Consultants never suggest regions once all are open. Dark single projects can be turned down.
- No Breeding laboratory card, no home-tank gear once hatcheries are up, no Sales & shop card once there's nothing left in it.

**Before friends play, Oct 26 (check these stay true)**
- Coming back after closing or backgrounding the app catches up to 30 days, and stops early if a tank gets sicker or shrimp are dying.
- Nothing saves while the page is hidden. Sound starts on the first tap on an iPhone. Start over is a migrated new game. Every pain card has a choice you can take with no money.

**Play-test fixes, Oct 23 (check these stay true)**
- [ ] Every story choice looks the same (no green first option). Before the pick only costs show; effects are aftermath. A choice you can't afford is greyed with a reason.
- [ ] Out of money before any farm talks about your shrimp, not farms.
- [ ] Quality check runs water → look → salt dip → done without freezing.
- [ ] The packing table keeps one size while you tap through the steps.
- [ ] Bulk kit orders: kits can be put in from stock by hand; the card says whether packers or shrimp are the limit.
- [ ] Moss/snail and planted kits cost per kit only, offered in Projects on the Kits tab.
- [ ] Consultants appear once you have had AED 20k.
- [ ] The SOP project (recipe tank) opens standard tanks 4 to 12; standard tanks come with everything, decor included. Tapping a row in the All tanks table looks at that tank alone (health check, restock), Back returns to the recipe.
- [ ] When farms take over (first hatchery, or farms ≥ 10 kits/day) the farm takes every tank but the first (`retireTanks`), so no more alerts about tanks you can't reach.
- [ ] Your day (`ACTS`, `M.wh`, `M.p2`, `dayHours`, `setWork`, `setPick`, `lifeDay` daily, `personalWeek` weekly): work is set in hours (0-14), plus two picks outside work, 3 hours a day each, that last until changed (a third pick drops the older one). Sleep is what's left up to 8, then rest, so long days cut sleep. Grandma is not an hour any more, she's the Check on Grandma button. Old painted days migrate once (`dayMigrate`). Sleep and exercise move health (`M.hp`): under 45 a doctor card, under 40 mild illness (3 weeks, 2% of cash), under 20 serious illness (a year, half the cash, company at half speed via `workMult`). Long work days and short nights build strain (`M.bo`): at 100 you burn out for four weeks (hours do nothing, ✦ at half). Work hours nudge sales ±2% an hour around 8. Design hours win prizes at 150/500/1200 h, video hours go viral at 400 h, paper hours raise research odds after 300 h. Once a year lane stays (trips home, holidays, conference).
- [ ] Story prices that were fixed grow with the company (`aiCost` 20% of cash plus 2% of every kit sale, `rivalCost`, `schoolKits`).
- [ ] The spotlight ring follows its card if anything moves (`spotTrack`).
- [ ] Once a second region is open and the tank buttons leave the top bar, the owners count (x of 8.2B) sits in the top bar instead.
- [ ] Research lines (`RLINES`, `RPOS`, `rlDay`): six fields (energy, water, automation and AI, genes, food, health), each can fund PhD students, postdocs and PI labs at the same time, paid daily, until you stop. Finds are random (`rlOdds`), a quarter of them come out as nothing. Each find is a small permanent bonus (`rlM`). Funding counts toward curiosity (know). The older academy chain (one study at a time, degrees, teaching, crew) still drives Space. Postdocs cost USD 50k a year base (the start line also shows AED); postdoc pay can go to 60k or 75k (`PD_PAY`, `setPdPay`), which only moves traits, never the odds. Papers come out steadily per person (`RPOS.pap`: PhD 0.6, postdoc 1, PI lab 5 a year), separate from finds.
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
- [ ] Free time is work hours plus two picks on the You tab (see Your day). Burnout after long heavy stretches costs lost weeks, and each new burnout shows the Tired card again.
- [ ] Check on Grandma: nothing about her shows until you tap it, only her first birthday and the one missing-you call ring. Windows are a game month or 3 minutes of play. Missed things happen without you and go in Her years. Pocket money on New Year and your birthday, mailed if you missed it. Untold stories show as a count, the ending lists them.
- [ ] Grandma moments only show on the tab and pass if nobody looks.
- [ ] Writing letters tells Grandma's story bit by bit. Her milestone letters live in the You tab once it opens.
- [ ] Climbers get shorter letters, floaters get longer ones (`gpVoice`).
- [ ] Grandma's place: a flat, a house, then land with a stream (the old A place of your own is gone, Pass 151).
- [ ] Your own tank after the first industrial hatchery is always there, no decision. The farm takes the other tanks, the 20 L stays (treats by hand, happy treats). Late game it is irrelevant, so most people ignore it. How much you tended it (`ownLevel` 0/1/2) changes a line in the ending and nudges kin. The year-eight green-glass card only asks start again or leave it, it never removes the tank.
- [ ] Mira shows up at 11+ moments (`mira_*` milestones plus the fisher card), each following something you did. Paths without Space get a `lastchap` card before the ending (`LASTCH`, `lastChapter`).

**People and money**
- [ ] Kiki, Luca, Gema and Mimi each get a goodbye card when a machine takes their job, options change over time.
- [ ] Out of money card: Grandma (once), neighbours, bank, the man at the market, washing money, sell something, bankruptcy (two taps, the game ends).
- [ ] Buyout offer after a million owners, two taps, the game ends with the Sold ending.
- [ ] Dyed shrimp, fight nights, the investor, three favours, the routes deal is the point of no return, the police way back costs almost everything.
- [ ] Mira reacts to dye, fight night, her scholarship, the investor, the year after the police.
- [ ] Academia or industry: pay postdocs more to stay (rare discoveries, Wonder) or hire them into the company (cheaper kits, Use, opens the designer lab).
- [ ] Food and tank care income (only living tanks, more with the food factory) and water, power and freight income keep paying after Earth. Space's last world is always reachable.
- [ ] No "Affordable in about…" lines anywhere.

**Text**
- [ ] Puti's voice: short, plain, comma-spliced. No feel-good or life-lesson punchlines (a sharp or funny line is fine), no "not X but Y", no twist endings. Made-up countries for satire. No abortion or religion.

## Pacing targets

| Player | Real time to finish Earth |
|---|---|
| Average | ~1.5 h |
| Slow or perfectionist | ~2.5 h |
| Speedrun | ~30 min, and it should be really hard |

In game days, best play is about 7 years and casual play about 15.

Latest bot results (seed 7, 28 Oct, Pass 132):

| Bot | Result |
|---|---|
| Strong, cold answers (default) | Earth won on day 2,019, empire_dictator (30 Oct deploy; 2,106 before) |
| Strong, kind answers (`BOT_HEART=kind`) | Earth won on day 3,183, question_prof (30 Oct deploy; 3,159 before) |
| Average, curious and kind (default) | Earth on day 6,049, space done by day 7,460, garden_hermit (30 Oct deploy; 6,777 / 8,188 before) |

Seed noise is big: over seeds 3–43 the average bot's Earth day ranges 5,700–6,640 on the same build, and strong seed 19 goes broke on day 252 on both the old and new build. Compare a few seeds before reading anything into one run.
| Average, cold answers (`BOT_HEART=cold`) | Earth on day 5,349, no Space (24 Oct, not rerun in Pass 110) |

All bots use campaigns (when ✦ is plentiful), films, Shrimpcoin, shops and mall stores. The average bot also funds research lines. It has 22 years to finish both chapters.

When you change balance, run both bots and compare against these. Report the before and after numbers, and add them to `tests/README-shrimp.md`.

## Testing checklist

### Cross-system change protocol

Before adding or changing a feature, trace its existing state and every consumer; do not stop at the new button or card. In this single-file game, changes commonly cross simulation, save migration, progression, alerts, story pacing, and UI rendering.

1. Search for the state field, action/function, unlock flag, rendered IDs, and tests before editing. Read the owning functions and current working-tree diff first.
2. Check the full lifecycle: new game defaults → old-save migration → unlock/reveal → player action → simulation update → alert/story/ending → save/load. Preserve the player's existing accordion/tab state unless the feature is a newly revealed item.
3. Check neighbouring systems explicitly: tank care ↔ illness ↔ alerts/health check; breeding ↔ sales ↔ kits/packing ↔ farms/economy; research ↔ costs/reserves ↔ Earth/Space gates; milestones ↔ spotlights ↔ story/news pacing; header controls ↔ all tabs/mobile layouts.
4. Add or update a focused regression test for each changed rule and run every affected suite. For UI-only work, verify the actual browser at narrow phone widths and at the progression stage where the feature appears. For balance/economy work, compare the strong and average bots; for Space work, run the Space continuation too.
5. Review adjacent features after the change, not only the target path. Report any untested path explicitly; update the feature checklist and changelog when behaviour changes.

1. Fast checks, run every time: `node tests/shrimp-balance.cjs` (80), `node tests/shrimp-academy.cjs` (10), `node tests/shrimp-me.cjs` (46: free time, Grandma, endings, schedule, research lines, charts, stores, pains, style, parties, quiet spells, water).
2. For balance or sim changes, run the bots: `node tests/shrimp-playthrough.cjs` (strong cold), `BOT_HEART=kind node tests/shrimp-playthrough.cjs` (strong kind), `node tests/shrimp-average-playthrough.cjs` (average curious player, goes to Space). Watch for `INSOLVENT` and big timing shifts against Pacing targets. `REVIEW_OUTPUT=<dir>` sets where the run json with snapshots goes (default `/private/tmp/shrimp-tests`, which doesn't exist on Linux).
3. Spotlight sweep in a real browser: `SPOT_RUN=<dir>/run-7.json node tests/shrimp-spotlights.cjs` after a strong bot run. Every spotlight on every tab at six stages.
   For Space changes, continue the academy fixture with `ACADEMY_RUN=<dir>/run-7.json node tests/shrimp-space-playthrough.cjs` and verify all planets remain sustainable.
4. Load the page at 390 px and 360 px wide and look at screenshots of every tab at several stages: the opening, first sale, kits, farm, a million owners, win, and the ending page. Check for console errors, overflow and cut-off text. For overflow, run `ACADEMY_RUN=<dir>/run-7.json node tests/shrimp-layout.cjs` first: start screen plus every snapshot at 320/360/390 px, every tab and details opened, flags anything wider than its card. Chromium only, so check date fields and other native inputs on an iPhone by hand. Load snapshots from the run json into the page (`G=snap;migrate(G);render()`).
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
- **Card headers drifting apart.** Fold-up cards and `<details>` cards used different header rules, so heights, gaps and arrows differed. All card headers share one 30 px row, no arrow, the ? only on open cards, and the 8 px card gap (Pass 119). `details{margin-top}` must not apply to cards. Long header notes cut off with … instead of wrapping the title.
- **Spotlights during the tank lock.** A new card spotlight scrolled the page while the tank was locked for cleaning, and the player was stuck. No spotlight, card jump or tab switch while `TVLOCK` or a health check is open.
- **Scrolling a card under the sticky header.** `scrollIntoView({block:'start'})` hid the top of story cards behind the top bar. Scroll to the card's top minus the header height.
- **Tiny shrimp washed out.** Babies at 0.36 scale looked white from the dither and sheen. Babies get a solid body with no sheen.
- **Locked sliders with live steppers.** The − and + buttons next to a slider kept changing a locked kit price. Steppers check `inp.disabled` and fade with it; any new locked control must disable its steppers too.
- **The guide jumping the page.** Centring the guided card on every cue pulled the page away from what the player was reading. The guide scrolls once per cue (`applyGuide.scrolled`), to the glowing button, only if it's off screen.
- **A step that can't happen while Sell drains what it needs.** The first kit waited for 8 spare shrimp while the header Sell sold them. When a step waits for shrimp, say so in NEXT and hide the action that undoes it (`firstKitWaits`).
- **A quote that kills a page.** An apostrophe in "can't" inside a single-quoted JS string stopped a whole preview page. Check the page runs (`node --check` or one headless load) after every text edit to script strings.
- **Caching sprites before they decode.** In a test page, shrimp bodies were cached before the images loaded on a phone, so only legs showed. Never cache a drawing until every image it uses has loaded.

**Sim and tests**
- **Screenshots in the repo.** A browser script run from the repo folder wrote `l1.png` and `l2.png` there and they got pushed. Write scratch files outside the repo and check `git status` before `git add`.
- **Comparing `innerHTML` to a built string.** The browser rewrites SVG and attributes, so the compare never matches and the node is rebuilt every frame (charts flickered, tooltips died). Compare against a cached copy of the string instead.
- **Spotlight on a fixed layer.** iPhone Safari has no scroll anchoring, so when something above the card grew, the page content moved and a `position:fixed` ring stayed put. The overlay now lives in page coordinates (`#spot` is absolute and as tall as the page), the ring follows its card every frame (`spotTrack`), and only header and tab-bar targets use fixed positioning. A scroll the player didn't make (no touch, wheel or key in the last 0.8 s) re-places the ring instead of closing it.
- **Same thing spotlit twice.** Different paths (tab, intro card, card sweep) each kept their own "seen" note. Any spotlight now marks its element, its card and its tab as seen. A tab spotlight also carries the first card's line and marks that card, and tapping a button in a card marks it seen.
- **Explanations on the card face.** Cards kept growing with how-it-works paragraphs. Put the why in `HELP[cardId]` or a `.explain` element (shown under ?), keep only numbers and choices on the card.
- **Story text rewritten as policy memos.** One pass made every late card "grounded" by turning it into explainer prose: semicolons, "sovereignty", "(+3% adoption ceiling)", and the jokes removed. Grounded means the premise holds up (scale, facts, cause and effect), not that the voice goes flat. Keep Puti's voice and fix the logic.
- **Satire that doesn't fit the scale.** News like "cocktail sales drop 12%" at 10,000 owners, or "the last person on Earth" with 4 million left, reads as bad writing. Match every news line and card to the owner count where it fires.
- **The ending preview drifting from the game.** `shrimp/ending-playtest-data.js` is built from the game now: run `node tests/build-ending-playtest.cjs` after changing forks, late cards or endings. The `extras` list and the ending formula in `ending-playtest.html` are hand-written, keep them in step with `STORY_TAGS` and `endingScores`.
- **A win card button that parked the game.** "Review your empire" set `progress.reviewing` with nothing to do, so the game froze. The win card offers Keep playing and New game only, and `migrate` releases saves stuck that way. The Space hand-off (`requestSpaceDream`) also sets `reviewing` while `spaceDream` is queued; leave that one.
- **Buttons rebuilt under a finger.** Writing `innerHTML` every render swapped buttons out mid-tap, so holds and fast taps got lost. Use `el.mhtml=html` (the `morph` helper): it patches the DOM in place, keeps `open` on folds and the classes in `KEEP_CLS`, and does nothing when the string hasn't changed.
- **Prices that stop mattering.** A fixed AED 20M choice is free with AED 300B in the bank. Fixed prices go through `scM(G,m)` / `si(G,i)`: never less than 0.2% of your cash (or ✦). Story labels are rewritten with the scaled number (`needM`/`needI` carry `.cost`/`.inf`).
- **A story choice that ends the game.** Selling or closing the company set `ended` but nothing queued the ending, so the game sat frozen. The choice handler now runs `detectMilestones` right away.
- **Old text in an open tab.** A tab left open for hours keeps running old code; Puti saw a "he" that was already fixed. That is what `BUILD` and the reload prompt are for.
- **UI helpers in the sim.** `labMode()` inside `illDay` broke every test.
- **Unguarded UI calls in `updateReveal`.** They break the bots.
- **Everything in the paper.** Running 10 km, the shrimp club and Grandma's fish soup came out as Shrimp Times stories, and the paper showed up long before the World tab. Ask whether a stranger would read it in a newspaper; if not, it's a note (`noteLine`).
- **Story events that block the clock.** A late story event fired on the ten-year day and blocked a test. Gate new events by day and condition.
- **Bots going broke after new spending.** Keep cash cushions in bot policies and re-run them.

**Design**
- **Removing her features under a general rule.** Pass 115, told "do what you think is best", took the auto feeder and water changer off the new-tank sheet as a route nudge, though Puti had asked for them in Pass 81. Before removing or hiding anything, search `tests/README-shrimp.md` for the pass that added it. If Puti asked for it, ask her first. Her standing requests are locked by checks at the end of `tests/shrimp-balance.cjs`: add one there for every request she makes, so a later pass can't undo it quietly.
- **Too many new things at once.** Water care, pH and KH chips and a toast all appeared right before the first shrimp purchase. Stage reveals behind real need, and blink an existing button if an action is needed early.
- **Fixing the one example instead of the rule.** Spotlight on water care only, when she meant every new section; softening the goal card three times when she wanted no push at all.
- **Explanations in card bodies, and goals that read like homework.** Both drew complaints. Move text behind ?. A goal card with one item to save for still felt linear and got removed.
- **Overwriting the other agent's work.** Always diff before you write.

## Open work

Planned and agreed with Puti, not built yet:

**Tab cleanup and text fixes (28 Oct): done** in Passes 119 to 123, deployed 28 Oct. Rules that stay: no growth or bottleneck summary anywhere, bottleneck advice only from the paid consultants (the !! ceiling and working-capital alerts only while `consultHas`). Numbers live on the page where they're used (packing capacity under Making kits, reach in Ads, the ceiling on Regions). USD in the Lab is on purpose.
Left from that review, not done:
- The farm-license Next steps (`fauto`, `ftank`: "Farm license: 3 tanks that run themselves...") still name the route. Not in the agreed list, ask Puti before removing.
- The `mkt` lever line ("You can make more kits than people order...") is a taught-once lever (`leversTaught`), kept on purpose.
- Old saves keep their old lab stories on the front page of The Shrimp Times; only new ones go to Science.

**Late game economy: built in Passes 126 and 127** (not deployed). The bots never sell farms or lines, so selling is only covered by `shrimp-balance`. The Gear and Making kits sell rows were not looked at in a browser.

**Small leftovers from the 2026-10-27 final pass**
- "Check shrimp" wraps to two lines in the six-button own-tank grid at 360–390 px (drop the icon at narrow widths).
- The Rewilding card has no fold arrow (they rebuild every render; needs open/closed state).
- The professor ending's "From the tank" line mentions space while it shows on the win card before Space has started.
- Shrimpcoin chart axis text scales up large at 1280 px.
- "Undercut them on price" reads "Each kit costs 12% more to make": accurate, but odd under that label.


**Sales channels.** Shops, Online and Community, all open to everyone, each with its own upgrade tree.
- Opening a channel costs money, and you can't afford all three early, so you pick which to grow first.
- Shops and Online trees cost money, Community costs ✦.
- You set how kits are split between open channels.

**Other planned work**
- The player chooses the next region from 2–3 options with trade-offs, instead of a fixed order.
- Story pacing: story cards at least ~30 game days apart, plus new late-game beats with choices that last (Mira's science fair, a flatworm recall, the rival's merger offer, a letter from Iceland).

- The own tank's year-eight card (`c_mytank`) only checks the glass.

**Known gaps**
- Kits open after 200 home-bred sales and 60 L of tanks with shrimp in them (`KIT_UNLOCK`, `KIT_ROOM`). From 100 sold one loose idea in the ? popup says more tank room is needed; the guide no longer names the route.
- The opening is slow from the first sale (day ~120) to kits (day ~320) for a player who never buys ads. Worth a look with the bots.
- The first babies trigger a few spotlights in a row (Colony, Recent events). They could be merged into one.
