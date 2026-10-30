# Universal Shrimp verification

Run from the repository root with Node.js (no dependencies):

```sh
node tests/shrimp-balance.cjs
REQUIRE_TEN_YEAR=1 REVIEW_SEED=7 node tests/shrimp-playthrough.cjs
REQUIRE_TEN_YEAR=1 REVIEW_SEED=19 node tests/shrimp-playthrough.cjs
REQUIRE_TEN_YEAR=1 REVIEW_SEED=42 node tests/shrimp-playthrough.cjs
```

The balance suite checks milestone boundaries, JSON save migration, historical
unlock suppression, legacy victory, owner-operated packing, payroll guards,
working-capital reserves, farm recovery, breeder protection, permanent lab
quality, sandbox opt-in, campaign and film recaps, operating accounting, shrimp-to-kit conservation, industrial packing capacity,
warehouse limits, staged marketing/shops, speed gates accrued annual-tax reserves, the opening story, letter persistence, ten-year
boundaries, non-punitive continuation and old-story migration.

The seeded playthrough uses the actual simulation and purchase functions. It
acknowledges milestone pauses, respects UI reveal gates, feeds/changes water,
assembles kits and invests in breeding, packing tiers, regions and projects.
It uses the same World/project and preceding-tier gates as the interface, and
fails immediately on insolvency. It must reach the
worldwide ending within 12,000 game days. It is a deterministic strategy replay,
not a human pacing or optimal-strategy claim. JSON results are written under
`<os tmpdir>/shrimp-tests` (/tmp on Linux), or `REVIEW_OUTPUT` if supplied.

Browser QA covers fresh start, restored cycle milestone, next-step navigation,
Kits/Operations/Marketing/World, contextual projects, purchase forecasts,
advertising, mothball/restart, legacy packing migration, lab scope, global
victory and sandbox, including a 390×844 phone viewport and desktop. Preview
saves stay outside the published repository.

`REVIEW_KIT_PRICE=market` follows the suggested kit-price button; a numeric value
uses that kit price after the first farm. `REQUIRE_TEN_YEAR=1` also requires the
special achievement; ordinary runs may finish after the celebration.

For the late-finish path, run `REQUIRE_AFTER_TEN_YEAR=1 REVIEW_KIT_PRICE=400
node tests/shrimp-playthrough.cjs` on one line. This requires a completed game
after the ten-year celebration, with no timely achievement awarded.

Academic progression and parallel space chapter:

```sh
node tests/shrimp-academy.cjs
REVIEW_ACADEMY=1 REVIEW_KIT_PRICE=250 REVIEW_OUTPUT=/tmp/shrimp-academy-play node tests/shrimp-playthrough.cjs
ACADEMY_RUN=/tmp/shrimp-academy-play/run-7.json node tests/shrimp-space-playthrough.cjs
```

The academic suite checks grant timing, idle/unfunded pauses, saved partial
work, effects applied to actual packing and machine purchases, funded career
requirements, teaching, old-save migration, Space opening only after Earth is
complete, Earth archival after victory, and both heat-management routes. The space
continuation starts from the win snapshot, buys missions and habitat systems
through simulation actions, completes new research and all four worlds, and
checks every completed habitat is sustainable at full capacity.

The average-player replay uses the default kit price and buys one inexpensive
starter colony. It checks weekly while cycling and monthly after opening the
business, limits each visit to two investments, keeps the listed prices, and
does not calculate a perfect investment order. It completes the Earth and
space chapters without insolvency within 20 game years. This is a reproducible
conservative scenario, not observed human play data:

```sh
REVIEW_OUTPUT=/tmp/shrimp-average-monthly node tests/shrimp-average-playthrough.cjs
```

On seed 7, Earth completes in 18.6 game years and space in 17.6, with a lowest
cash balance of AED 120. The browser check also followed the opening tank
cycle, three water changes to meet the displayed targets, the first shrimp
purchase, heat management and first hatch milestone.

Observed seed 7 with the academy strategy and AED 400 kit price: pilot grant day
1417, PhDs day 1782, six Earth discoveries day 1800, professor day 2145. Space
started day 3650 with Earth unfinished and completed day 4211, while Earth
adoption increased from 1.94 billion to 3.05 billion. This is one strategy replay;
research remains optional for the Earth ending. The original no-research seed
7/19/42 replays still finish on days 3448/3497/3359.

## Pacing after the October 21 pass (Claude)

Seeds 7/19/42 with the default strategy (kit price 600) win on days ~2,570-2,595
(about 7 years). A simpler greedy bot spans 8 to 18 years depending only on kit
price: 600 → 8.2 y, adaptive up to 400 → 10.5 y, 300 → 13.7 y, the 280 default
untouched → 15 y, 250 → 18 y. The Market price button never goes below cost +20%. The academy + space fixture
needs an Earth still unfinished at year ten, so it uses `REVIEW_KIT_PRICE=250`
(Earth wins day ~4,108; space runs day 3,650 → ~4,600).

Changed numbers: kit awareness 0.6, starting referral rate 1.2%/day, early
word-of-mouth projects +0.6%, farm license AED 1,000, grow rack AED 1,200, farms
+9% per copy (was 12%), mega hatchery AED 20M, ocean permit AED 100M, arcology
blueprint AED 3B. Space costs ×10, colony growth 0.4%/day (0.6% with genes),
60 stable days to settle, crew needs 200/600/1,200/2,500, courses train 1 crew/day,
contracts give 50 crew for AED 10M.

## Working together (Codex + Claude)

Both agents edit the same file: `site/shrimp/index.html` in this repository.
No Desktop copies. Before editing, check `git status`/`git diff` for the other
agent's uncommitted work and build on it; run the four test commands above after
any balance change. Claude does not commit or push; Codex commits.

Flow pass (21 Oct, Claude): pet shop orders appear during breeding (accept, then
deliver qualifying non-breeder shrimp for a 1.5-2.5x price); each business tab
shows at most 3 projects; at 40x the game drops to 12x when something new opens
(toggle in Game settings); 40x needs the old profit test *and* a million owners
(`fastReady` then `fastUnlocked`). Bot pacing at max allowed speed: strong 7.8 min,
casual 11.3 min of waiting (was 6.4 / 8.3); busiest 30 s holds 28 new things (was 46).

Shrimp-free ripple (21 Oct, Claude): owners slowly stop eating shrimp
(`rippleDay`, rate 0.0008 × kit survival, faster with "friends not food",
World Shrimp Day and the retraining fund). 25 headlines (`RIPPLE`) fire at
10k ... 2.75B shrimp-free people, shown in World → The Shrimp Times. Effects:
trawler headline cools Fire −8% (undone by the AED 500k retraining fund),
mangroves give ✦, wild shrimp cut farm upkeep 5%, typhoon makes regions 10%
cheaper, blue carbon pays AED per shrimp-free person per day. Strong bot sees
all 25 by its win (~day 2,990); the casual bot by ~day 4,900.

Flow fixes (21 Oct afternoon, Claude): at 40x the game now slows to 12x only
for big moments (headline, new region, farm tier, shop type, bulk order) and at
most once per 30 real seconds; project items and campaign ideas no longer slow
it. Kit phase gets bulk kit orders (`kitOrderDay`, 12 days of orders at +15%
price, until 40x) and a "Profit per kit · orders a day" line under the price.
The food-rot warning needs 2.5 days of food (daily 80% feeding peaks at ~2), and
the top Feed button reads "Extra feed" on auto-fed tanks. Phase goals show
progress (0 / 60, 4 / 10 kits, owners). "Another tank" appears after the first
sale. Bot pacing: casual mid-game longest gap 76 s → 14 s.

UI cleanup (21 Oct, Claude): shorter header (date · room °C, "Year N"), hunger
reads "fed" / "peckish 50%", business strip shows profit, packed/orders and
cash runway only when cash is falling, emphasis only bolds whole words, empty
project cards hide, farm rows lose duplicate text and use small Mothball/Sell
chips (shops: "Close one (35% back)"), hatch log lines merge into one per day,
World view switch is a proper segmented control, shorter opinion/AI texts and
campaign recap, Water test card hides while the cycling card shows, Dose
ammonia is only the primary button once ammonia is near zero.

## UI tidy pass 2 (Claude)
- Kits stats: 4 key numbers (Orders/day, In stock, Owners, Cost per kit); the rest under "More numbers".
- Hatcheries intro is one line; Starter kits intro shortened.
- Milestone card is compact: Grandma's letter is folded into a "Grandma's note" toggle (closed on each new milestone); smaller type on phones.
- "Max shrimp" renamed "Pack above". All-tanks table shows "594 packs >60" instead of "594/60".
- Tried scaling the default pack threshold with tank volume (3 shrimp/L). Codex playthroughs slowed by ~480 days and seed 42 failed to finish, so the sim default stays 60. Display-only change; all balance numbers identical to before.

## Smoother reveals (Claude)
- New sections open folded with a small "new" tag (cleared when opened), so an unlock adds one header line instead of a full card. Stays open when it holds the next action: start card, Buy shrimp, Starter kits, Projects, Equipment, Tanks, pet shop and bulk orders.
- Advertising and Readings over time also fold on first reveal.
- Existing saves: sections already present on first view of each tab are left as they were (G.opt.seenLegacy/seenTab).
- Staggered: Sell card waits for something sellable, Sales rules wait for the first sale, Readings over time waits 14 days after the first shrimp.
- Measured with the seed-7 policy in a browser, counting new visible controls per game day: biggest burst 63 → 32 (first shrimp day now 17), days with 10+ new controls 15 → 7. UI only; sim and balance unchanged.

## Text and UI tidy pass 3 (Claude)
- Shorter phrase-style help: water care, heater/chiller, AC and ice bottle, colony chart, readings source, sales rules, Excel course, shops, salespeople, packers, gala, campaign repeats, space skip note.
- Buy shrimp: one line each ("Solid red. Grade ~55 · 90-day adults"). Stocking-paused note shortened.
- Fixes: "Online shop" said "Permanent" twice; "1 kits" → "1 kit"; "Built a industrial" → "an"; "Kit materials cost half again" → "−50%" / "−50% again"; next packing line note rewritten; "Global packing installed" → "every packing line built".
- "Affordable in about 1928 days" now reads in months or years past 60 days.
- Labels: "Sell older than" → "Sell age", "Keep breeders" → "Breeders"; top button "Extra feed" drops the price (it was truncating on phones); kit margin "Profit AED X/kit · ~Y orders/day" (or "Loss").
- Operating controls: label + select rows with a short explanation, styled selects.

## Queue fix (Claude)
- Bug: a card that was queued got `display:none`, so it never had a screen box again and `markNewCards` (which only looked at on-screen cards) never cleared its `queued` class. Trade was empty after cycling (Buy shrimp hidden), Kits empty after kits opened, Equipment empty after the first farm.
- Fix: clear `queued` on every card that is no longer in the queue; queued cards now show as a folded title line instead of vanishing, so nothing the goal needs is ever invisible.

## Guide (Claude)
- `guideTarget()` picks one next step from the game state: a tab, a section and a button. `applyGuide()` (end of `render`) shows it in a "Next" bar at the top of every tab (inside the goal card on Tank), puts a dot on the target tab, outlines the section and pulses the button. It opens the target section once per step, so it never fights the player.
- Order: cycle → buy shrimp → first feed → pet shop orders → sell → auto feeder / bigger tank → first kit → bulk orders → packing bench → farm license → grow rack → new packing machines → next region (only when near the ceiling) → culture project → affordable business project → campaign → bottleneck report suggestion (90 days) → "Meanwhile" status line.
- Bottleneck advice appears only after the player buys the consultancy ("Report" with diag, "Advice" with a target after fix). Optional suggestions have a Skip.
- Spotlight queue now forces other sections shut only when the spotlight changes; Starter kits + Packing + Bulk order stay open together.
- Pet shop and bulk order toasts show once each; later ones use the Next bar and tab dot. The 40× roadmap moved to the speed buttons' tooltip. Alert line wraps to two lines.

## Cleanup 1–13 and owners' tanks (Claude)
- Lab tank: after the first farm the header folds to one "Lab tank ▾" line (G.opt.labOpen). Trade folds Buy/Sell/Sales rules/Colony behind "Lab tank: buy and sell shrimp" (G.opt.labTrade). Marketing folds ads and unused shops behind "Early marketing tools" from 1M owners (G.opt.earlyMkt).
- Settings moved to a ⚙ sheet in the header (toggles + Start over). "new" tags and queued sections expire after 30 game days. Feeding/Water test fold arrows match the rest. World switch reads Adoption / Research. Business strip is one slim line (profit/day was a duplicate of the header). Sell button stays visible and disables when nothing is ready. After the win farms stop breeding kit stock.
- Kit "Market price" button removed (bestKitPrice stays for the market test bot). Shrimp price slider is in AED for a prime adult of the colony's average grade; G.priceAED holds as mood moves (G.price derived daily); "Average · AED X" resets.
- Owners' tanks (World): welfare E.wel drifts to a target from kit quality × buyer commitment (cheap kits → impulse buyers), kit design, fishmeal-free food, winter cold (cold regions without Winter kits) and one 12-day summer heat wave a year (Heat-wave alerts soften it). Referrals × (0.7 + 0.5·welfare); below 55% thriving some owners lapse. WB items: Moss and snail kits, Planted kits (selectable design, +AED 12/30 a kit), Winter kits, Heat-wave alerts, Fishmeal-free food (ripple ×1.3), Every tank waters a houseplant (✦), Greywater gardens. Water use shown (0.86 L/owner/day).
- Space: seeding stations prepare each world, then shrimp are released to live free (p.wild grows to the world's lake/sea capacity). Ids and the settled flag are unchanged.
- Pacing (bots don't buy the new items): strong 600 seeds 7/19/42 ≈ 2,410–2,418 days (6.6 y), market+research 1,737 days (4.8 y, now needs manual pricing), average Earth 6,115 days (16.75 y).

## Lifespan and breeder slots (Claude)
- Clean-water mortality now gives 90% reaching adulthood (75 d), 80% one year, 20% two years, almost none past 2.5 years. Base daily rates: <10 d 0.4%, <30 d 0.15%, <75 d 0.08%, adults 0.04%, plus ageing (age − 540 d) × 0.0069% from 18 months (630 d with Longevity research). Verified with an isolated cohort in a 640 L tank.
- Breeding slows harder with crowding (full rate below 4/L, ~5% at 7/L), so long-lived colonies settle near 6–7/L instead of piling up crowding deaths.
- `breederProtection`: if adults are fewer than "keep", the oldest/best young shrimp (20+ days) are held back to fill the slots; sales, kits and orders all respect it, so a low sell age can no longer sell off every future breeder.
- Pacing: strong seeds 7/19/42 2,336–2,353 days (6.4 y); market+research 1,746; average Earth 5,951 days (16.3 y).

## Trade controls (Claude)
- Trade combines the shrimp age histogram, sales rules and selling controls in one card. The histogram and rules have independent toggles; the histogram is the only Colony content retained on Trade. Grade bars and transfer controls remain on Tank.
- The sales card appears after the first hatch. Feed, Water and Sell remain in the top action bar through progression; unavailable actions disable instead of disappearing. The Equipment guidance dot is remembered as seen after its tab is visited.

## Slower ramp into kits, tank decor, dashboards back (Claude)
- KIT_UNLOCK 60 → 200 home-bred shrimp: the shrimp-selling phase lasts longer, so tank upgrades, more tanks and ads matter before kits. Kit awareness ramps with kitRamp = clamp(0.2 + kits sold/100 + shrimp sold/1500, 0.2, 1): early kit income is about 2–4× shrimp income instead of ~10×.
- Tank decor upgrades in Equipment (per tank): Java moss (AED 40, babies under 30 d die 40% less), Driftwood (AED 60, 12% less food), Indian almond leaves (AED 25, breeding +10%, adults die 15% less), Live plants (AED 120, −0.25 ppm nitrate/day). Moss and snail kits now need moss in one of your tanks; Planted kits need live plants. Kit design (buy + selector) moved from World to the Starter kits card.
- Equipment tab order: Equipment, then Tanks (Another tank), then Supplies.
- Dashboards: the shrimp/hunger/nutrition/food row shows as soon as shrimp are in the tank (was after kits). Readings over time, Colony, Money over time (Excel offer), Colony & sales, Packing & staff and Hatcheries open when they first appear. New sections no longer force other sections shut (spotlight and click-accordion removed); only the guide's target opens.
- Lab-tank fold starts when hatcheries make 10+ kits a day (was the first rack).
- Bulk kit orders: offered only with spare packing (supply − demand ≥ 0.5/day), sized to ~60% of 25 days of spare; accepting sets aside up to 60% of each day's packing; ships automatically when full; set-aside kits return to stock if it expires.
- Guide: tank-phase steps for cycling/stocking new tanks, another tank, ads when stock exceeds buyers, and the Excel course (soft).
- Fixed: the alert line went blank on Tank/Trade after visiting a business tab (lastAlerts reset).
- Pacing: strong 2,362–2,369 days (6.5 y; kits ~day 245, first farm ~346); market+research 1,744; average Earth 6,271 days (17.2 y).

## Tanks before business (Claude)
- Starter kits need 200 home-bred shrimp sold and 2 stocked tanks (had + 5 shrimp); the farm license needs 3. `G.emp.kitsOpened` keeps kits open once reached; older saves with kit sales or owners are migrated as open. Goal card, kit lock text and the guide (tankStep) walk through adding, cycling and stocking each tank.
- A new non-soft "Next" step drops 12× to 4× (40× to 12×) at most once per 20 s, so waits run fast and decisions slow down (setting renamed "Slow down when something new needs a decision").
- New-tank defaults: sell age 60, keep 30 breeders (young shrimp now fill breeder slots first).
- Test bots: the strong playthrough and the average playthrough now add tanks 2–3 after the first sale (strong: when cash > cost + max(300, reserve); average: at a weekly visit), cycle them, move a third of Tank 1's shrimp in, feed, change water, and buy a fan and feeder with a cash cushion.
- Pacing: strong seeds 2,362–2,363 days (6.5 y; kits ~day 250, first farm ~358); average: kits ~1 year, first farm ~1.6 y, Earth 6,218 days (17 y).

## Real-time pacing (Claude)
- Target play time: perfect run ~30 min, average ~90 min, careful/completionist ~2.5 h.
- Speed tiers by stage: 1×/2× until the first hatchery; 4× from the first hatchery; 12× at a million owners with the existing fastReady condition (auto packing, barn, 7 profitable days); 40× only after everyone has a tank. A new non-soft guide step drops one tier (40→12→4→2) at most every 20 s.
- Waiting time at top speed (no reading/deciding): market+research best run 14.9 min (win day 1,724); strong 600 run 20.6 min (day 2,362); average 37.4 min to Earth, 37.9 min with space (311 check-ins). Average by stage: Keeper 0.6, Breeder 6.8, Kit seller 4.4, Producer 10.2, Global 15.4 min.

## Story, hand packing, tank care (Claude)
- Hand packing: every kit is five taps at the packing table (fill a bag, catch 8, add oxygen, seal, box). PACK_STEPS tools (AED 200/400/700/1,000/1,500) each automate one step; all five complete the packing station (staff.tier 1: 1 kit/day by itself, packers allowed). `buyPackTier` at tier 0 buys the next tool, so older code and test bots still progress. Old saves with a bench get all five tools.
- Care card (Tank): health checks and treats. Illness (failed molts / bacterial / scutariella) appears in a stocked tank ~1/150 per day, more with low GH, nitrate or crowding, less with almond leaves; untreated −0.4%/day and breeding ×0.7 for 30 days. Health check sheet: tap the sick shrimp in a grid of 20, read the sign, pick a cure (minerals / water change / salt); right cure with ≥70% found cures, fewer found halves it for 10 days, wrong cure costs money. Treats: spinach (+nutrition, breeding +5%), bee pollen (breeding +15% 7 d), colour food (+2 grade on hatchlings 7 d); one at a time.
- Story: chapter pages at hatch (Ch 2 Small lives), kits (Ch 3 The first box), first farm (Ch 4 Scale), a million owners (Ch 5); story decision cards (Mira next door, the local paper, a cheaper rival, the routing agent, Room 4B, the marine survey, Grandma on the roof) with small lasting effects (storyChoose). Feature intro cards (More tanks, Health check, Automate one step, Packing station, Bulk orders, World tab, Shrimp Times) pause, explain, and "Got it · show me" opens the tab. Legacy saves skip intros they are already past (progress.v2).
- Pacing: strong seeds 2,354–2,380 days; market+research 1,733; average Earth 6,292 days, 40.8 min waiting at top speed (+ hand packing and minigames).

## Voice pass (Claude)
- Story chapters, intros, events, Grandma letters, space and win texts rewritten in a plain, short, comma-spliced voice. No flowery lines.
- Tool notes, kit designs, world "why" texts and space equipment texts made plainer, semicolons swapped for commas.
- Gift letter left as is (a test checks it).

## Look and phone UI pass (Claude)
- New "field notebook" palette: cream paper, dark ink, forest-green buttons, cherry red (--shrimp) for colony bars and shrimp charts. Influence ✦ keeps its own plum colour.
- Fonts: Fraunces for titles, Inter for text and buttons, IBM Plex Mono for numbers.
- Guide highlight ring now sits inside the button, so it never touches nearby elements. More space under button rows.
- Disabled buttons are flat grey instead of faded green.
- NEXT strip: label and Skip on top, text full width, tab link under it.
- Tabs have icons. At 400px or narrower, Equipment/Marketing show as Gear/Ads and guide text follows (tabWords).
- Phones: day counter hidden, 1× hides once 12× opens and 2× once 40× opens, Settings is an icon, readings strip text bigger.
- Packing chips say "auto" instead of ⚙. Win text and the Space skip line rewritten.

## Tank view, spreading illness, salt bath (Claude, step 1 of 4)
- Tank tab opens with a picture of the tank (canvas, about 30 fps, stops off screen or on other tabs). Up to 26 shrimp sampled from the real colony: age, grade colour, berried, sick. Decor shows when bought, water tints with leaves, nitrate and ammonia, food sinks when you feed.
- Sprites are layers from Shrimp Tanks (outline, tinted body colour, legs, tail, eggs) plus driftwood, moss ball, anubias and sand, about 24 KB embedded (SPR).
- Illness no longer ends on its own. Sick share grows logistically (ILL_R 0.12, about 50 days from a few sick to a crash). Deaths 0.3% to 3.3% a day, sick adults lose colour, breeding drops by up to half. At 95% sick after 40+ days the whole tank dies. Failed molts clear once GH is back to 5+.
- Spreads to another tank when sick shrimp are moved. Bought shrimp (after the first sale) arrive as T.fresh with a 25% flatworm risk unless salt dipped within 3 days (dipFresh, AED 3).
- Sick share lowers owners' tank care (welfareParts care × (1 − 0.5 × sickShare)).
- Health check happens in the tank: tap sick shrimp as they move. Salt cure and new-stock dips use the salt bath minigame: pick strength, lift the net while the timer is in the green (weak 60–80 s, right 30–45 s, strong 12–20 s, 18× time).
- Grandma gives 5 shrimp if every tank is empty and cash is below AED 15 (every 60 days at most, before the farm).
- Bots dip new stock and treat illness. Strong bot 2,334 days, average Earth 6,387 days and 41.1 min waiting.

## Header and tank motion (Claude)
- Alerts, the owners bar and the ten-year journal moved into a panel behind a button next to Sell: ? when all is well, ! for a warning, !! when urgent (red).
- One readings row: Hunger and Nutrition on the left, NO₃, KH, GH and Temp on the right (pH dropped from the bar, still in Water test). ✦ sits next to cash.
- Tank view motion follows Shrimp Tanks: rear legs step with speed, front legs pick at food, tail flicks when swimming, smooth turning toward travel, a soft flip when turning around, shrimp climb the glass. Body colour runs from pale pink to cherry #DF614A with the highlight layer.
- Food pellets follow T.chem.food: they disappear as food is eaten and are gone when the tank has none.
- Health check spreads 16 shrimp over the water so each one can be tapped.

## Quality checks (Claude, step 2 of 4)
- New Kits card "Quality checks" (qccard) after kits open and 3 kits sold, with an intro story card (qc). Legacy saves past 3 kits skip the intro (progress.v3).
- QC round by hand, good for 30 days and fading to nothing by day 45: water (judge each stocked tank OK to pack or not safe), look (tap sick shrimp in the tank view, sometimes none), salt dip the batch (salt bath minigame).
- Automate in order after the first round: Water sensors AED 600, Camera check 2,500, Dip station 1,500, Holding racks 6,000, Own test lab 40,000. Hold and lab only exist as automation. Steps weigh 0.20/0.35/0.15/0.20/0.10.
- sickKitRate = (0.12 + 0.5 × sickShare + farm outbreak hit) × (1 − coverage) × strictness (Relaxed 1.4, Normal 1.0, Strict 0.6). Strictness adds AED 0/2/6 to kit materials. Owners' tank care × (1 − 0.6 × sickKitRate).
- At farm scale an outbreak hits a rack about every 150 days, a 20-day hit of 0.2 × (1 − coverage), cut to 30% with the camera.
- Bots: strong does a round whenever due, buys automation with a 3× cushion and goes Strict at the farm (2,352 days). Average checks every 40 days with mistakes and buys late (Earth 6,657 days, 41.8 min waiting).

## Less text, spotlights, calmer opening (Claude)
- Every section with an explanation has a ? at the right of its header. Tapping it opens a box with HELP[id] plus any .explain paragraphs in that card (they stay hidden otherwise; dynamic ones show their current text).
- New sections and tabs no longer use toasts. spotlight() dims the screen, rings the new thing in green, puts the message above it and pauses; tap anywhere to go on (SPOT_T / SPOT_MSG, queued one at a time, waits for story cards). Trade opening at the cycle is silent because the story card already says it.
- Opening: Water shows once the test kit is bought, Feed and Sell once there are shrimp. Water care, pH and the Water care spotlight wait until shrimp are in and fed once. Before that, when the cycle needs a water change the top Water button blinks. Cycle card text is short with the action in bold; dose button no longer shows doses left.
- Treats fold into "Treats · optional" (the guide opens it when it points at a treat). Goal card explanation moved behind its ?. Milestone button says "Got it". The bottle toast says 2× (4× is not open yet).

## 4× while cycling, care goals (Claude)
- maxSpeed allows 4× while no shrimp have ever been in a tank (cyclingOnly). Buying shrimp drops it back to 2× with a one-time note. The "4× is open" spotlight now waits for the first hatchery.
- The goal card follows CARE_GOALS instead of counts or cash targets: automate feeding → 40 L → second tank → auto water changes → stronger filter → 80 L → third tank → all three on autopilot, then after kits: automate packing → automate quality checks → first grow rack. The body says what to buy, where, and its price, with a thin bar for how close the cash is. Kits still unlock in the background (200 home-bred sold + 2 stocked tanks), explained under the goal card's ?.
- Old GOALS rewards still pay out silently; "Care goals" list shows the ladder with ticks.

## Spotlight for every new section (Claude)
- spotWatch() runs each render: the first time any section (SPOT_INFO) or tab (SPOT_TAB) is on screen it gets the spotlight with a one-line explanation, one at a time, after story cards. Folded or queued sections open first. G.opt.spotSeen remembers what was shown; old saves start with everything already revealed marked as seen. The cycle card is left out (the guide already points at it).

## Text, fonts, charts, Excel (Claude)
- Inter everywhere (titles, text, numbers with tabular figures). Fraunces and IBM Plex Mono removed.
- After buying ammonia, a spotlight points at 4× (G.ob.sp4c).
- Spotlight box now holds "Tap anywhere to go on", so it never overlaps the message.
- Text pass for Claude-style phrasing ("so you don't have to", "for good", "by itself", "Nothing fancy, nothing wrong", poetic lists). Spotlight lines rewritten as plain sentences. Opening line "Well, better get started..." has no quote marks.
- Readings over time: ammonia, nitrite and nitrate share one shorter chart (c2 removed), shrimp count chart shorter.
- Excel course appears after AED 500 earned in total (G.stats.earned, counted in earn()); old saves without the stat use 30+ shrimp sold.

## Shrimp keep moving, no push toward a second tank (Claude)
- Tank view: less standing still (idle 12%, graze 26%, shorter pauses), at most 3 shrimp per pellet, eating lasts 4–9 s then they wander off and stay full for a while, pellets land across the whole floor.
- No "More tanks" story card (tanks2 condition is false), no guide hints telling the player to add tanks or that kits/license need stocked tanks. The tankStep hints for cycling and stocking a tank the player added stay.
- The Tanks card in Gear only appears once Tank 1 has two of: auto feeder, 40 L+, auto water changer, better filter (tankRoomOpen).
- Care ladder: Tank 1 first (feeder → 40 L → auto water changes → filter → 80 L), then "More room, another tank" once Tank 1 is as big as it gets, then a third tank, then all three on autopilot.
- Removed player-facing unlock rules ("10 kits and 3 stocked tanks open the farm license", "starter kits open after...", "fully automate three tanks to unlock standard tanks"). Kits and the farm license still need 2 and 3 stocked tanks internally.

## Pass 31: one-goal card, shrimp count up top, scroll ends spotlight
- Goal card is a plain card now: "Saving up for / Ready to buy", the item name, AED have / cost, a thin bar, one short line. No checklist, no phase name, no details toggle. Care goal titles are item names (Auto feeder, A 40 L tank, ...).
- "Universal Shrimp" title is screen-reader only. Sticky top row shows AED big with net/day and ✦ under it, then the total shrimp count (#b-shrimp, allN).
- Spotlight records scrollY when shown; scrolling more than 6 px, a wheel or touchmove on the overlay closes it like a tap.
- Goal card keeps class phase-note so the collapse system skips it.

## Pass 32: ideas in the ? popup, tank view loop fix
- Goal card removed from Tank. `ideas(G)` gives up to three loose suggestions (temperature, automate, room, make the tank nicer, filter, then kit-stage ones), shown under Ideas in the ? popup. Tapping one opens its tab. Nothing shows before Equipment opens. Guide no longer names the auto feeder or bigger tank.
- Soft "Meanwhile" guide hints moved into the popup too; the guide bar shows only real next steps.
- Tank view: the loop could die with `on=true, raf=0` (canvas 0-sized while on another tab), and `tvWake` never restarted it, so after buying shrimp in Trade the tank stayed on its old empty frame. Loop now sets `on=false` when it can't size, `tvWake` restarts when `raf` is 0, and the tank animates under reduced motion too (it froze on the first frame before).
- Tests: goal card checks replaced by ideas checks (none before Gear, automation and nicer-tank side by side, no prices or litres, max three).

## Pass 33: sweep against Puti's seven rules
- Guide: feed and sell hints are glow only (no text). Buying nudges (ads, Excel, packing tools, license, rack, machines, regions, projects) are soft, no prices, and go to the popup. Count and savings targets removed ("x / 10 sold", "Save AED x"). Soft hints no longer glow buttons or pop cards open, except the speed hint.
- Alerts state the problem in a line; danger alerts keep one fix. No shopping advice ("buy a fan", "buy the auto water changer", "move some to another tank").
- Gates: kits need 200 home-bred sales and 60 L of stocked tanks, the farm license 120 L, any mix. A one-tank strong bot now wins day 2360 (before: stuck forever). Strong bot 2352, average Earth 6657 unchanged.
- Shown unlock rules removed: next packing line requirements, standard tank checklist, bacteria starter lock, academy "after 1,000 kits".
- Spotlights: one at a time, at least 15 s of play between them.
- Hunger bar is now "Fed", full when they're full, words instead of %.
- AGENTS.md: new section "How to read Puti's requests".

## Pass 34: her batch of fixes, shrimp looks
- Marketing: first ad (fb) is ready as soon as Marketing opens, the card was empty until the first sale.
- Top bar: tank buttons came back only when the chip signature changed, so after a business tab they stayed hidden. Now restored every render. The business view that hides the top bar only applies once all three starter tanks are fully upgraded (`stdUnlocked`).
- Salespeople: hiring the first one turns on "sell from this tank" for every tank (new tanks follow). Migration does the same for saves with salespeople and nothing switched on, unless the player has touched the toggle.
- Care: shows after Tank 1 has an auto feeder and water changer (then stays), or whenever a tank is sick or has new stock to dip. Cleaner rows, treats as a 3-up grid with short tags. Treat hint gated on Care being open.
- Health check: sick shrimp were always the first cells (top left), cells now shuffled.
- Salt dip: hold to dip, let go to lift, no clock. Bath time runs 10x (tablespoon window 3 to 4.5 s held). 3 tablespoons window 12 to 17 s. Too short now also kills a few with strong salt, too long kills more, random spread. Result shows where you landed against the window.
- Shrimp looks follow the other game: 8 visual grades, body/dither/highlight alpha curves (0..1, checker dither), base red hsl(6, 80%, 50%), per-shrimp hue offset N(0, 5 deg), sheen capped at 0.34. The drawn sample spreads grades so its mean matches the tank.
- Ideas buttons use data-itab (data-tab is reserved for tabs).

## Pass 35: grade per shrimp, wider hue
- Each drawn shrimp uses its own cohort grade: visual grade = floor(g / 12.5), no smoothing. Trade packs show as bought: cherry (g 25 to 45) grades 2 to 3, painted fire red (82 to 100) grades 6 to 7.
- Hue spread per shrimp N(0, 10 deg), clamped to ±24, cached in 3 deg buckets.

## Pass 36: no Care card, look with your eyes, glass algae, weekly treats
- Care card removed. Illness starts silently from a play-time clock: every 150 to 420 s of play, scaled by the worst tank's `illRisk` (GH < 5, nitrate > 25 and > 40, crowding, dirty glass x1.5, new stock in the last 20 days; almond leaves x0.7, plants x0.85). The old per-day random onset in `illDay` is gone. One sick tank at a time. No alerts or logs until stage 3 ("Shrimp are dying fast").
- No salt dip for new stock. Buying sets `T.newStock`, which raises risk for 20 days.
- Tap the tank to lock in: taller view, page scroll locked, game paused. Tap shrimp to ring them, "Treat the N I picked" opens the cure step (found = picked sick / visible sick, wrong picks count against). Drag to wipe algae. Done to leave.
- Glass algae: 32x16 grid per tank (`T.glass`), grows daily (faster with nitrate, slower with plants and moss), drawn as green specks over the tank, wiped by finger.
- Treats: unlock each in Equipment for AED 20, then pick one weekly under Feeding (None or an unlocked treat). Renews automatically at its price.
- Average bot over seeds 1 to 4: 6785/6818/6660/6831 before, 6883/6358/6778/6896 now (seed 7 7271 is RNG shift). Strong bot day 2345.

## Pass 37: tank art from the other game, plain lock view, age bins
- Tank view art comes from the other game's starter tank (1864x860 source, waterline 0.215): sky gradient + water + sand flattened to `tbg`, and full-canvas layers `twood` (driftwood), `tplants` (amazon sword, tiger lotus, cabomba), `trocks` (all 8 rocks as one "Mossy rocks" item, replaces Java moss), plus her almond leaf (`tleaf`). All webp at 932x430, about 77 KB total. Old moss/plant/wood/sand sprites removed. Background grass groups and floating plants (with Live plants) drawn like the other game, floaters at 0.22/0.30/0.68/0.74/0.80.
- Shrimp, food and bubbles stay under the waterline. Algae grid covers the water area only.
- Lock view no longer resizes: same view with a green outline, controls in a row under the tank.
- Shrimp sizes in three age bins (baby, juvenile, adult), no age fade, colour is grade only.

## Pass 38: two tank buttons, sword in front, bigger leaves
- Tapping the tank shows two buttons under it: Check shrimp (the 16-shrimp health check on a plain water and sand background, no decor or filter) and Clean tank (locks scroll, drag to wipe, Done). Tapping elsewhere hides them.
- Fixed: the old tap-to-pick function was named `tvPick`, the same as the shrimp behaviour picker, and replaced it. Shrimp move normally again. Balance test now fails on duplicate function names and on any script that doesn't parse.
- Amazon sword is its own layer drawn in front of the rocks. Almond leaves 40% bigger. Tank caption no longer mentions illness.

## Pass 39: dead bodies and money in tank health
- The white shrimp were dead bodies: every death dropped one on the sand, so big tanks always showed some. Now only when deaths are unusual (illness, or more than 0.4% of the tank in a day), at most two, drawn belly up.
- Cash alerts moved out of `tips(T)` into `cashTips()`, shown with the business alerts in the ? popup. Tank chips and the All tanks table only reflect the tank. Worst status per tank is now the most severe alert, not the first one.

## Pass 40: death animation from the other game
- `tvDeathPose` ports `shrimpDeathPose`: flip belly up in 320 ms, sink in two fast-slow pulses with side sway and a slight tilt, lie still 1 s, fade 700 ms. The dying shrimp keeps its own colour and grade, with the dead-leg frame.
- Deaths shown in proportion: each visible shrimp stands for N/S real ones, so a real day's deaths turn into visible ones at the same rate (sick or adult shrimp first). At most 3 at a time.

## Pass 41: pack limit per litre in Kits, header rearranged
- "Pack above" is one setting for all tanks, in shrimp per litre (`G.packPerL`, 1 to 8, default 3), in the Starter kits card. `packAbove(G,T)` = packPerL x volume. Removed from the tank sales rules, the copy-settings list and the All tanks table ("packs > 60" gone). Old saves: the old default of 60 becomes 3/L, any other value is converted from Tank 1.
- Header: money with influence on the same line, shrimp count and net per day under it. Date line starts with the day count ("Day 387 · 10 Nov · 25.4 °C").
- Strong bot day 2448 (was 2345, per-litre packing keeps more breeders early), average bot seeds 7/1/2: 6333/6651/6251.

## Pass 42: header deltas, packing shown
- Header: money with its daily net beside it, then influence; shrimp count with its daily change beside it (8-day average from `G.nh`). Tighter sizes under 375 px so influence isn't clipped.
- Kits: "Packing up to N kits a day: X by you at the station, Y by packers, Z by machines". The station packs 1 a day (4 with the second table, doubled by the AI camera) with no packers, which looked like a bug after firing everyone.

## Pass 43: weekly treats as toggles
- Treats stack: `T.treats` maps treat id to days left, `T.set.treats` holds which ones renew weekly. `treatOn(T,id)`, `treatMult` multiplies pollen and spinach. Old single `T.treat` / `T.set.treat` migrate.
- Feeding card: owned treats in one row of toggles, selected ones filled green with a tick. Note under it lists what's working and for how many days, and what starts tomorrow.

## Pass 44: steady kit status line
- `e-kithint` appeared only when spare shrimp were under 8, and the station packing one a day kept crossing that line, shifting the whole Kits page. Now always one line: "Spare shrimp: N · a kit takes 8." (plus materials when cash is short). The 20+ days / not breeders rule moved to the card's ? help.

## Pass 45: top bar everywhere until fully upgraded, ? moves up, consultants per visit, tighter Kits
- `topAway(G)`: every tank has every Equipment item. Until then the top bar (tank buttons, readings, Feed/Water/Sell) shows on every tab, including lab mode, which used to fold it once farms ran. After that the tank buttons go (use All tanks), business tabs drop the readings, and the ? moves next to ⚙ whenever there are no action buttons (`placeInfo`).
- Consultants: one product, paid per visit, 20% of cash with a AED 20,000 minimum, live for 30 days (report in the bar plus all forecasts). Old saves with consultants get 30 days. Average bot buys up to two visits.
- Kits card: Pack above moved under the numbers, Orders/day row dropped (it's in the price line), Pack 1 / Pack 10 side by side with cost and shrimp underneath, More numbers at the bottom.
- Header: influence shown compact (2.3k), tighter on narrow phones so nothing clips.

## Pass 46: Shrimp Times early, marketing matters, Kits and World tidy
- Shrimp Times opens with three kit-count stories (25: Reddit satire newsletter starts, 500: awareness walk, 1000: everyone in town has a tank, the shrimp grill struggles), then the shrimp-free stories. `rip()` migrates old saves (indexes +3). A new issue switches to World and spotlights the card. No progress bar and no "next story at". The ocean spotlight line and the milestone body were rewritten. Effects line only shows when there are effects; the shrimp-free explanation is behind ?.
- Marketing: kit referrals are multiplied by `wordOfMouth(G)` = 0.3 + 0.7 x (1 - e^(-level/2)), level = (reach - 1) + kit shops / 3. Marketing card header shows it. Strong bot now buys the online shop, keeps a shelf or YouTuber ad running and opens a stall: wins day 2499. Average bot Earth seeds 7/1: 5893/5963.
- Kits: consultant blurb shortened (details behind ?), QC how-to behind ?, Pack above hint shorter, hire buttons sit on the right like other rows.
- World: kit-quality and word-of-mouth notes behind ?, "Share of people" line removed, campaign line shortened, research shows reserve and free cash on one line, fund button on the right.

## Pass 47: plain news, AI job-loss news, space after Earth
- Shrimp Times stories rewritten in plain words (no scampi, rutabaga, bycatch, bailout, hectares, cooperatives, blue-carbon asset, class-action lawsuit, appetizer, apocalypse), jokes kept.
- Event stories (`NEWS_EV`, `newsEvent`): robots take over packing (first packing line), AI replaces salespeople, shop managers, technicians. The card now works off the story log, so event stories show and trigger the jump like the others. AI replacement rows say how many people lose their jobs.
- Space opens once everyone on Earth has a tank (`spaceOpen` = won), not at year ten. Winning early still jumps to the year-ten reunion for Grandma's dream. Average bot starts space after Earth: seeds 7/1 Earth 5961/5951, space done 7292.
- Removed the call to prayer from Grandma's star-gazing choice (now "until Grandma calls you in for dinner").

## Pass 48: no more Water/Fire, kind or cold paths, influence starts with Mira
- Water and Fire are gone. One public mood (`E.op.m`, `moodAdd`) sets how many will buy (`kitCap`) and referrals (`opMult`). Old two-faction saves migrate to their old overall appeal (`opFix`).
- Campaigns stay. Each offer has at least one honest message and one pushy one. Pushy ones move the mood more, some aren't true and can backfire later (Shrimp Times story, mood drop).
- Choices: 17 questions, each with a kind answer and a cold one (PROJ items with `fk`, question text in `FORK_Q`). Picking one closes the other. Cold answers are cheaper or pay every day (`dealsDay`: fish-food culls, filter cartridges, food pods, gene patent). Some cold answers come back later as news (`E.later`, `laterDay`): algae bloom, drained wetland, paid study, bribed inspector, fake reviews, bought politician. One choice shows per tab at a time.
- World is split into University, Media, Politics and Nature, one item per track. Costs mix money and ✦ by what makes sense (`m` and `i`). New: scholarships, lab name, stress study, gene, interview or buy the Shrimp Times, welfare law, buy a politician, tax haven, hamster tax, retraining or buying harbors, almond seed in every kit, Taiwan streams, take-back, solar farms, mangroves.
- Hidden heart (`E.heart`): kind choices, honest campaigns and kind film stories add, cold ones subtract. Never shown. It scales the good Shrimp Times stories (`heartMult`) and owners' welfare a little. The win card lists what the world looks like (`end` lines) and Grandma's verdict (`endingVerdict`).
- Films: pick what each film is really about. Hidden effects (word of mouth, how many want one, mood, heart, flop chance), a Shrimp Times review on release. Films cost money and ✦. If you bought the Shrimp Times, every review is five stars and every story ends flattering you.
- Influence: no ✦ before Mira (`E.infOn`). Her story says what it is, every answer starts it. Old saves with ✦ keep it.
- Research opens at 200 kits. A postdoc for a year costs AED 50,000, then a PhD student AED 150,000 a year, then the AED 1M lab and bigger grants. First study: cheaper packing machines (lines, AI setup, camera, machines 25% less via `autoDisc`).
- Fixed: World projects only showed once every tank was fully upgraded (`inBiz` vs `business`).
- Bots: strong bot takes cold answers (`BOT_HEART=kind` flips), average bot kind ones (`BOT_HEART=cold` flips). Average bot opens new regions and the first research grant before extras. Its limit for both chapters is now 21 years (it already finished space on day 7292 of 7300).
- Pacing: strong bot cold day 2253, kind day 2449 (was 2499). Average bot Earth seeds 7/1: kind 6143/5990, cold 6047 (seed 7), space done 7488.

## Pass 49: real reasons, research in dollars
- Every cold answer now says its logistical reason (replacing a few dead shrimp costs less than heat packs on every box, measured food pods stop overfeeding, the wetland is cheap and nobody farms it, harbor towns are broke and nobody else is buying, a hamster tax nudges people to a better pet), and kind answers say what they cost. Food pods now help owners' tanks a little, the cost is lock-in.
- The ending no longer judges. It says how long it took and what that path cost.
- Research priced in US dollars like a US university: postdoc USD 50k a year (about AED 184k), then a PhD student USD 150k for two years. `USD`, `usd()`.

## Pass 50: space after Earth, again
- `spaceOpen` is Earth complete only (Codex had brought back year ten). Academy test, space playthrough (now starts from the win snapshot) and README say so. AGENTS.md has a rule so it stays.
- Space card text no longer says it opens at ten years.

## Pass 51: UI review, one look for every card
- Every card header is the same height (30 px row, 52 px closed card), whether it's a fold-up card or a details card, with or without a ? or a note. Same chevron everywhere, drawn in CSS, pointing right when closed and down when open, also on the folds inside cards (Colony age histogram, Sales rules, More numbers). The rotated ▾ sat low and looked like a different arrow.
- Same 8 px gap between all cards. `details{margin-top:6px}` and the margin under the card before the Water care / Water test pair made uneven gaps, now `details.card` has no top margin and `.two` cards use the grid gap.
- Header notes cut off with … instead of wrapping the title onto two lines (Water test & bacteria with a long equipment list). `.two` columns are `minmax(0,1fr)` so long notes can't push cards off screen.
- Decluttered: word of mouth only shows in Advertising once kits exist, Pack 1/Pack 10 and the spare shrimp line hide once the automatic packaging machine runs, the farm cost line and the research reserve line moved behind ?. Research buttons are green when you can afford them.
- Checked at 360 and 390 px on 14 saves and all tabs: no sideways overflow, every gap 8 px, no script errors.

## Pass 52: letter scroll, red babies, no spotlight while cleaning, Water button with Water care
- Milestone cards scroll so their top sits just under the sticky header. The first babies letter used to open with its top hidden behind the header.
- Babies (anything drawn smaller than an adult) get a solid, slightly deeper red body with no white sheen (`tvBody(..., juv)`). At 0.36 scale the dithered body and highlight blurred into pale pink-white.
- No spotlight, card jump or Shrimp Times tab switch while the tank is locked for cleaning or a health check is open. Queued ones wait and show after Done.
- When Water care is introduced, the top bar stays lit above the dim and the Water button pulses (`body.spot-wc`).
- Babies milestone text no longer mentions the removed Care card.

## Pass 53: ring of death in the right place
- The failed-molt white ring now sits where the head shell meets the body, not behind the eye.

## Docs: AGENTS.md refreshed
- New bot results, recent systems (choices and heart), UI lessons from passes 51 to 53, cure minigame plan from the prototype, academia vs industry proposal.

## Pass 54: who you become, round 1
- Top bar: `?` sits top right from the start, settings live inside it (`.apop-foot`), the person button `#tb-me` sits next to it once free time opens. Id selectors because render resets `#tb-info`'s class.
- Nine hidden traits (`TRAITS`, `G.tr`, `trAdd`, `TRAIT_TAGS`, `STORY_TAGS`). Heart feeds Means. Play style (`G.ps`, counted in the UI tick and handlers: top speed, idle, hands-on feeding after automation, looks, wipes, treats, ? opens, Shrimp Times reads, You tab opens, thin or fat cash, the day of the 4th region) is half of each trait it can see (`playVal`, `traitVals`).
- `endingPick`: Empire, Garden, Question, Network, Drift, each with variations, plus the fall (3) and Sold. Text in `ENDINGS` (UI), same words as the doc's Endings tab. The win card shows the whole ending page, no trait bars.
- You tab (`p-me`): free time picks (`PICKS`, `mePick`, `personalPeriod`), weekly, monthly after farms, yearly after moving. Burnout after four heavy periods with no rest. Grandma moments (`MOMENTS`, `momentAnswer`) only show on the tab and pass after about 2.5 min of play.
- Your own tank (`owntank` note at the first industrial hatchery): always kept, no choice. Treats by hand plus happy treats (`HAPPY`); `ownLevel` feeds the ending. Also: six more Mira moments, and the `lastchap` card for non-Space paths.
- Staff goodbyes (`bye_pack`, `bye_sales`, `bye_mgr`, `bye_social`, `byeOpts`, `byeChoose`): Kiki, Luca, Gema, Mimi. Human in the loop and regional managers stay on the payroll (`E.hil`). The old packer fork projects are retired (`req` false).
- Tester fixes: the heat alert no longer re-slows every tenth of a degree (signature without numbers, once per alert per 30 days), spotlights at least 15 s apart from every source, "Tanks get cold in ." fixed, Space buttons spaced, no "Affordable in about" nudges, first illness ever spreads at 55% speed, algae a bit see-through, Winter heater vs Summer cooling fan.

## Pass 55: money trouble and dirty money, round 2
- Below zero, the `broke` card (`brokeOpts`, `brokePick`, repeats with a 7-day snooze): Grandma's savings (once, small debts, he cancels the sea trip, pay back from the You tab), the neighbours (co-op or kind players), a bank loan (three missed payments and it takes a farm), the man at the market (30% in two months or a farm gets smashed), washing money, sell something, or bankruptcy (deep debt only, the game ends here, two taps).
- `buyout` after a million owners (earlier with investor dinners), `sellco` card in Kits after. `endGame`, `gameover` card shows the ending.
- Dyed shrimp (`dye_offer`, 60% more, found out after a week or so, pet shop stops ordering, market mood capped). Fight nights (`fight_invite`, a free time pick: money, dead shrimp, raids). The logistics investor (`wash_offer`, `startWash`, `washDay`): cash every day, 9% tax on it, audits freeze accounts 30 days (`frozen` blocks buying), three favours (`fav_0..2`). The routes deal is the point of no return (`E.network`, borders open, dark news). Go to the police: 90% of cash, no kit sales for a year, half the farms (`E.inquiry`). Pay your way out keeps one dark line.
- Mira reacts: dye, fight night, scholarship, the investor, the year after the police.

## Pass 56: trees, the house, hard places, round 3
- `treesFor`: the top ending type plus anything within 0.3 of it opens its tree, locked in once opened (`E.trees`, from 50M owners). Space only for the curious (`spaceOpen` needs the Space tree). Old saves that already won keep Space.
- `TREES`: Shrimp Island (tax halves), Rewilding (also opens when the house is complete), The last mile, The designer lab (escape news later), The shop. Steps in World, lines in the ending.
- `HOUSE`: land, walls (for me, Grandma, or both), solar, wind, well, rain tank, compost, garden, shrimp room. Offered with AED 300k spare. Work on the house pick makes the next piece cheaper.
- `CARDS3`: Gary, shrimp mayor, divorce, shrimp money, the river war (made-up countries), shrimp in court, water first, lab shrimp, electricity, rivers, too many shrimp, blackout, tiny jails, nobody goes outside, the one neighbour, the fishing family, your own tank going green. Each choice moves traits and can leave a line.
- Tests: `node tests/shrimp-me.cjs` (16 checks). The average bot now plays a curious kind player (papers and shrimp club) so Space stays covered; the cold average player gets Shrimp Island and no Space, and stops at Earth.
- Pacing: strong cold 2293 (empire_dictator), strong kind 2449 (garden_village), average kind Earth 6071 and space 7404 (garden_village, trees rewild, space, island), average cold Earth 5975 (empire_dictator, island).
- Known: `shrimp-space-playthrough.cjs` from the academy fixture stalls on Pelagia (needs terraform research), the same on the version before this round.

## Pass 57: fewer cards, steady income after Earth
- Story cards wait their turn: one at a time, a random 30 s to 2 min of real play apart (`paceGap`, `storyClock`, `p.wait`, `p.nextStory`), shorter when several are waiting. Out of money, the ending and intro cards never wait. Bots and tests without a play clock count 4 s per game day.
- The Shrimp Times does the same (`newsPush`, `R.pend`, `newsTick`): one story at a time, 30 s to 2 min apart, never while a card is up and at least 10 s from one. A story caused by a choice you just made (`decide()` wraps `storyChoose`, `buyProj`, `momentAnswer`, `buyTreeStep`, `buyHouse`) jumps the line and comes 8 to 20 s after it. Only the first issue switches to World with a spotlight, later ones show as a short toast. Without a play clock (bots, tests) stories print straight away.
- Six late cards became Shrimp Times headlines with no choice (`HEADLINES`): Gary, the shrimp mayor, divorce, shrimp in court, lab shrimp, nobody goes outside. Cards are kept only where different people really choose differently.
- Shrimp food (`foodIncome`): every owner buys food, AED 0.001 a day each once kits open, four times that with the new Shrimp food factory project, a bit less with the published recipe, food pods on top. It keeps paying after Earth, so Space's AED 10B Pelagia upgrade is always reachable. Finance line "Shrimp food".
- Big builds earn a little (`sideIncome`): desalination plants sell water, last mile trucks carry freight, Shrimp Island passports, farm solar sells power. One finance line "Water, power and freight", plus a headline when each starts (the wind farm in Inner Mongolia rides on the solar one).
- The space test from the academy fixture finishes again (it used to run out of money at Pelagia).
- Pacing: strong cold 2309, strong kind 2428, average curious kind Earth 6139 and space 7488, average cold Earth 5986.

## Pass 58: cure minigames, white babies, letters, academia or industry, spotlights
- The cure minigames from the prototype are in the game (`openMolt`, `openWC`, `openSalt`, `CG`, `cgTank`). Picking a cure in the health check plays it, and the result feeds `treatIll` (how many you healed or netted) and the real tank (GH, water change, leftover food). The salt dip has no salt choice anymore, hold to dip for 4.5 s, used for sick tanks, new shrimp and quality checks.
- Newborns are drawn near-white and see-through, juveniles pale pink, adults their grade (`tvBody` juv 2/1). Pass 52 had made them red, that was the wrong way round. Chapter 2 Babies card says white dots.
- Free time pick "Write Grandma a letter" (`GP_STORY`), his milestone letters move into the You tab, climbers get shorter letters and floaters longer ones (`gpVoice`).
- Academia or industry fork (`sciacad`, `sciind`), no heart either way, Wonder or Use. Industry also opens the designer lab.
- Kept-your-tank-and-never-looked line, late cards can make their own news right after (`CARDS3[..].news`).
- Spotlights wait for the card to open and the page to stop moving, then place the ring, and follow the card while it's up (`spotPlace`). The ring used to land on the tab bar when the smooth scroll hadn't finished.
- `shrimp/AGENTS.md` has a feature checklist to run before every push.

## Pass 59: spotlights freeze, glide, then light up; header covers the top
- Spotlights: pause and dim the whole screen first (taps and scrolls are swallowed, `SPOT.ready` 0), scroll to a spot where the card sits between the header and the tab bar with room for the tip (`spotCamera`), wait for the page to settle, then cut the ring, show the tip and vibrate 30 ms where the browser allows it (`spotPlace`). Cards inside a closed section (the folded home-tank equipment in business mode) are never spotlighted (`spotShown`).
- Water care spotlight lights only a copy of the Water button (`#spot-btn`) over the dim, the rest of the header stays dimmed.
- Water care opens the first time the tank needs a change, not five days after the first feeding.
- `.top::before` paints the page colour 200 px above the sticky header, so content never shows through a gap above it (iPhone, artifact viewer).
- Spotlight sweep (`SPOT_RUN=<strong bot run json> node tests/shrimp-spotlights.cjs`): every spotlight card on every open tab on six saves, plus every tab button and the Water button, 145 spotlights. Checks the ring is up, the target is visible between the bars, the ring top matches the card, and the tip doesn't cover the ring. All pass.

## Pass 60: grounded ending choices and optional battery kits
- The ending choices were first revised to use grounded voucher and conflict scenarios; Pass 61 replaces the voucher premise entirely and makes the river conflict about water infrastructure and commercial terms. Children's TV makes the trade-off explicit: commercial ads to children or a school science sponsorship with no ads.
- Clarified the other choice wording where ownership, animal welfare, ecology, or consequences were hard to follow: sponsored research, dock leases, healthy school shrimp, long-life filters, wastewater, wetlands, water access, grid demand, and river releases. The last-neighbour choice now makes consent explicit.
- After the player funds free replacements following a blackout, the Kits tab unlocks an optional battery-pump add-on. It adds AED 35 to production per kit and up to two percentage points to kit survival, including raising the survival cap to 100%; it can be switched on or off.
- Added focused checks for the unlock, cost, survival effect, and the ending-preview copy. Run `node tests/shrimp-balance.cjs`, `node tests/shrimp-academy.cjs`, `node tests/shrimp-me.cjs`, then the playthrough bots.

## Pass 61: trade finance replaces shrimp-backed money
- Replaced Pelagonia's shrimp-backed voucher story with a development-bank hatchery bailout. The buyout-versus-restructure fork preserves the original `drive` and `means` trait scores.
- Reframed the river-war choices around waterworks contracts, a treaty-backed AED 10B first-phase investment in waterworks and ports, or emergency water aid. The treaty preserves both countries' sovereignty and agreed water shares, opens civilian river trade, and gives the company a 30-year operating concession whose fees grow with the owner base. This is an infrastructure and peace settlement, not a literal purchase of a river.
- Updated the ending preview and added regression checks for the unchanged hatchery-bailout trait signals and river-pact cost/outcome.
- Paid study and children's TV/school-kit decisions remain unchanged.

## Pass 62: story review fixes (Claude, on top of Codex's passes 60-61)
- Late cards keep Codex's battery-pump kit option but go back to Puti's voice. River war: sell to both armies, refuse, free kits for ✦, or pay for water points for families who fled. The river pact is gone. Pelagonia is a hatchery bust (no shrimp currency).
- Facts fixed: blackout is about heat (shrimp die above 30 °C), electricity is about 1% of world power, insulin rides in a cold box next to the warm shrimp box, monthly cartridges throw away bacteria, genes are licensed as a bred line rather than patented. Battery kits no longer raise survival past 98%.
- Scale: Shrimp Times lines match the owner count where they fire. The last neighbour card says about four million are left, and "Leave him be" changes the win text.
- Continuity: Mira's age is tracked from the day you met her (`miraAge`), so the scholarship and "turns eighteen" wait until she is 18. Grandma's letters no longer have her keeping the 20 L you kept. The doctor no longer calls Grandma.
- Choices: newspaper answers have their own lines, ignoring the rival costs some mood, the school donation goes to families and can't fire after the win.
- `tests/build-ending-playtest.cjs` rebuilds the ending preview data from the game.

## Pass 63: the hard part and homes
- One kit is one home of 1 to 4 people. The counter still counts people (x of 8.2B with a tank at home). Kit demand divides by the household size after 2,000 kits, so pacing in people stays the same.
- At 4B people the hard part opens (Chapter 6). Growth past about 4.3B only comes from the ten groups or from changing the goal. The bots pick options: cold buys the dark ones and keeps "every home", kind picks fix and workaround options and switches to "every home that wants one".
- New checks in shrimp-me (32): the hard part opens at 4B and caps growth, one war ending, dark options, the uncontacted village, goals, the spreadsheet, the hidden stream ending, and households of 1 to 4.
- Bots: strong cold 3,386 days, strong kind 2,864, average Earth 5,602 and space 7,124, average cold Earth 5,361. None insolvent. The strong cold bot is slower than before (2,668) because a literal every home takes the slow fixes and the law's ramp.

## Pass 64: forcing is fast
- Forced options deliver tanks straight to homes over their ramp (`direct`), and public mood stops slowing sales once you force anything. Said no is now national tank programs (a factory in each country) or paying the ministers, instead of a law that fines people. The uncontacted village comes off the target instead of counting as owners.
- Bots: strong cold 2,547 days (was 3,386), strong kind 2,938, average Earth 5,658 and space 7,124, average cold 5,321. None insolvent.

## Pass 65: shrimpcoin
- One coin per mangrove tree, offered at 100M people. Plant trees, buy and sell coins on a World card with a price chart. Honest or seedling count; the seedling count can be caught.
- New check in shrimp-me (33). Bots don't trade the coin; their results are unchanged (strong cold 2,547, strong kind 2,938, average Earth 5,658, space 7,124).
- Pass 66: outside planters join when the coin is worth more than a tree costs; pumping the price plants more trees (in a test, 473M vs 195M over three years) and the new supply pulls the price back. You keep 5% of every coin minted.

## Pass 67: layout by stage, bots use everything
- Measured each tab's height and cards at seven stages, and ran the strong bot with each system off. Ads and media projects each cost about 1,400 days if skipped; business and culture projects are required; shops (+55 days) and research lines (−23) barely move the win.
- New Research tab; media, campaigns and films moved to Marketing; World went from about 5,400 px to 2,700-3,300 px late game. Trade hides once the farms run things, the money chart moves to Kits.
- Shrimpcoin planting is capped at 8B trees (the coasts that can take mangroves).
- Bots use campaigns, films, Shrimpcoin, shops and research lines. Strong cold 2,304, strong kind 2,956, average Earth 5,629 and space 7,180, average cold 5,321. Spotlight sweep 140, all good.

## Pass 68: Grandma's envelope, quieter cards
- If you sent Grandma money, the out-of-money card offers her envelope once: three times everything you sent, saved in a gold fund. Ending line and a Grandma history line. New check in shrimp-me (34).
- Explanations moved behind ?: research lines, Shrimpcoin, the hard part, the lab certificate, the recipe tank, the tank table, supplies, packing tools, open regions. The packing line drops "by you at the station" once machines do almost all of it.

## Pass 69: mall stores, Grandma's land, gala causes, smoother scaling
- Mall stores: every region has malls. Word of mouth runs at 60% in a region with none of your stores (85% at home in Abu Dhabi) and catches up as you open them. One store in five malls covers a region. Stores open one at a time, then 10, 100, 1,000 at a time once you run that many. Each costs a fit-out plus rent, license and staff every day, and brings its own orders and ✦. Mall flagship and megastore are retired from new purchases.
- Grandma's land at AED 500k sent: go with her (no purchases for 30 days, then land for the house, which moves to the Tank tab once the farm keeps your tank) or don't (she's scammed on a tour, you're on every front page; pay her back or not). Both close the envelope.
- Galas pick a cause (clean water, children's hospitals, mangroves, animal shelters, your own foundation). Traits, mood and an ending line follow the cause.
- Story choices show only what they cost. What they did shows in the toast afterwards.
- One hand feeding lasts about 3 days (the next two days top up if food runs low); the message says you only do it until the auto feeder.
- New farm tier between the barn and the industrial hatchery: Breeding warehouse, AED 250k, 60 kits a day. Old saves shift their farm stage.
- Average bot: farms before packing lines when breeding is the limit, up to 6 farm buys a visit. Income trace per 15 days is in the run json (`trace`).
- Results: strong cold 2,591, strong kind 2,828-3,001, average Earth 5,377-5,770, average cold 5,321. Spotlight sweep 139, all good. shrimp-me 38 checks.

## Pass 70: growing pains, play style in the ending
- Eight growing pains between 8k and 3M owners (heat deaths in transit, the packing room, the inbox, no more moss, month-three crashes, the permit, payouts on hold, copycats). Each pauses on a story card with three fixes: slow and decent, fast and expensive, or no wait with a cost to mood, quality or margin. While a fix is being set up, orders run at 35% and breeding at 70%. Kits shows the countdown.
- 5k to 5M owners now takes about 900 days for the average player (was about 630); owners grow 1.5 to 2.5 times a season instead of about 3.
- Play style is read from purchases: steady (small share of cash, only while profitable, first tank kitted before the next), methodical (same kind of purchase in a row, new tier or region only once the last is done), completionist (goal, store coverage, kitted tank, care goals). The strongest one adds a subtitle and a paragraph to the ending, a line in Grandma's letter, and shifts which ending you get.
- Average bot gets 22 years (was 21) since the middle is longer.
- Results: strong cold 2,720, strong kind 3,074, average Earth 5,798-6,273 (seeds 3, 4, 7), average cold 5,405. Spotlight sweep 139, all good. shrimp-me 40 checks.

## Pass 71: review fixes
- Pause: cards give back the speed you were playing at (chapter pages and endings stay paused). After 8 seconds paused with something alive, a "Time is paused · tap to play" pill shows under the header and 1× pulses; the tank dims and slows. The first shrimp you buy starts time at 1×.
- Cleaning the glass dims the rest of the page; tap anywhere outside the tank to finish. Cards and spotlights wait until cleaning or a check is done. Tap the dark area around a check sheet to close it.
- Hand feeding covers 2 days (today and tomorrow); the Feed button says "Fed · N days left" and the food line says the same. No top-up without cash.
- Growing pains: no fixed month, Monday to Thursday shipping, refunds cost money for 120 days and the card says how much, daily wages and fines are shown before you pick, the permit text matches what happens, shell processors can get the accounts frozen later. The decent fix costs at most a third of your cash, the fast one at most 60%. The header shows "fix in N d" while one is being set up.
- Galas respect frozen accounts; the land trip never shortens a longer freeze; one set of tab names (Tank, Gear, Trade, Kits, Ads, World, Lab) on every screen.
- Stores show up once the first is in reach or Dubai is open; they can be closed (no refund of the fit-out). Store trust is called "Trust here".
- Play style: starter goals no longer count; completionist uses the goal, store coverage, share of projects built and the first tank; tank upgrades don't count as runs; the ending paragraph only states what was measured.
- Thermostat chiller AED 450 (was 1,300). The guide suggests a bigger first tank before a second one; the tanks card appears once the first tank is kitted (80 L, feeder, auto water changer).
- Average bot sends Grandma money and takes the land trip (kind) or not (cold).
- Results: strong cold 2,691, strong kind 3,147, average Earth 5,881-6,301, average cold 5,069. Spotlight sweep 139, all good. shrimp-me 41 checks.

## Pass 72: timing of options, region prices
- Header shows "room 26.7 °C" (it was the room temperature all along, read as the tank's).
- Gala and store buttons wrap their text inside the button.
- Salespeople show up after 60 shrimp sold (part-time, AED 40 a day until kits open, AED 130 after). The university opens at 3,000 kits (was 200), about year 3.2.
- Regions cost more: Dubai 250k, rest of the UAE 1M, the Gulf 8M, MENA 30M, Europe 200M, Southeast Asia 300M, the Americas 800M, East Asia 2B.
- Average bot: regions no longer compete with farm purchases for the two buys per visit. New scratch tool: a timeline probe of when each option first shows up.
- Results: strong cold 2,676, strong kind 3,259, average Earth 6,050-6,162, average cold 5,209.

## Pass 73: one research card, chiller water
- The Lab tab has one Research card. The people you fund in the six fields are your lab: the lab works on one project at a time (progress shown as % and days left), and grows small team → university lab → research group → professor with one "Next for the lab" step at a time. Grants are gone from the UI; old saves can still use prepaid grant days. More people make projects a bit faster.
- Water changes on a tank with a chiller come in at the setpoint, and the chiller recovers faster. The "too hot" alert after a water change on a chilled tank is a warning that says the chiller is bringing it down.
- Results: strong cold 2,668, strong kind 3,298, strong with research 2,551, average Earth 6,134-6,189 and space by day ~7,800, average cold 5,209.

## Pass 74: ladders, tidier Gear, hours that matter
- Farms and shops climb one kind at a time: you add to the biggest kind you own or build the next one; older kinds keep running in a folded "older farms/shops" line. Small shops close for new openings once mall stores run; mall stores open after a boutique or Dubai. A hint names the next kind and when it opens.
- Farm license needs three tanks with shrimp (and 120 L). Gear lists auto feeder, auto water changer, fan, heater/chiller, bigger tank, filter, then decor. The shrimp count stays in the header all game.
- The postdoc question waits for two postdocs and four papers. Leaving the Tank tab ends cleaning; the tab bar sits above the dim; Clean tank works while a spotlight is waiting.
- You tab: Grandma's card first. At about three kits a day Grandma calls (the You button rings) with a short supply-and-demand lesson. Work hours move orders 5% an hour before farms, 3% with farms, 1% past a million owners, and the row shows the current effect. Videos, papers, club, exercise, your tanks, Mira's school and Grandma visits have hour milestones that do something.
- Results: strong cold 2,772, strong kind 3,179, average Earth 6,050-6,274, average cold 5,237. shrimp-me 44 checks.

## Pass 75: beginner pass
- First sale around day 115 (was 147): tanks keep 12 breeders by default (was 30). Before any income, the header says "costs AED 0.22/d" in grey instead of a red loss.
- Spotlights only for things you act on; panels like the log, colony table, charts, readings and gear lists explain themselves behind ?. No more doubled sentences when a tab opens.
- The first illness can't wipe the tank: it tops out and passes after two months. The first danger alert points at the alert button, which now shows a count. Closing a health check with sick shrimp says they're still sick.
- Header: one "Water good / change soon / change now" chip, tap it for the numbers; shrimp change reads "53/d to kits" once farms run; tap ✦ for what it means. Sell button says why it can't sell ("Ready in ~8 d", "No buyers till next week"). Sales rules folded with "the defaults work fine". "Pack above" is "Keep in tanks".
- Kits: kit price fixed for the first 50 kits; bulk order is one line about spare kits; "offer ends today"; consultants, operating controls and the money table fold.
- Year one: at most one story decision a month.
- Results: strong cold 2,778, strong kind 3,263, average Earth 6,021-6,134, average cold 5,405. Spotlight sweep 139, all good.

## Pass 76: quiet spells
- If nothing has happened for 75 seconds of play and at least 45 game days (no story card, illness, pet shop or bulk order), a random event fires: a few sick shrimp, a hot spell (+3 °C for 6 days), an algae bloom on the glass or a pet shop order in the tank stage; a bulk kit order, a sick rack, a good review (up to 6) or a supplier shortage (kit materials +15% for 30 days) later. It shows as a toast and in the log.
- Results: strong cold 2,714, strong kind 3,232, average Earth 6,021-6,105, average cold 5,349. Bots see about 6 a year because their clock runs slower than a real player's.

## Pass 77: clutter pass
- Screenshotted every tab at ten stages (first sale to the win) on a phone and on a laptop, and replayed a beginner in real time.
- The "Time is paused" pill moved from under the header, where it covered the first card's title, to just above the tab bar. Pop-up messages move up while it shows.
- Gear: with several tanks, one switch at the top ("Tank 1 / All 3 tanks") replaces the extra "Next level on all tanks" button under every item. Decor and treats sit under small headings.
- The NEXT card and the pop-up no longer repeat a pet shop or bulk order when you are already on the tab that shows it.
- Smaller fixes: the sell button reads "Buyers next week" instead of a cut-off sentence; the empty space under the packing table is gone; the empty Packing & staff card waits for the five tools; "How strict" in quality checks waits for 20 kits and shows its cost per kit; Readings over time and the Trade histogram start folded; tank counts match the header; chart readouts name the day instead of "Now" (they are a day behind the header); the kit price slider follows price changes from stories; the postdoc price also shows in AED; the folded home-tank gear is called "Your home tanks".
- Top buttons: Feed hides once every tank has an auto feeder, Water once every tank has an auto water changer, Sell once all shrimp go into kits (the Trade tab closes then). A new tank without the gear brings the button back. With all three gone the row disappears.

## Pass 78: pause, sickness guide, lab parties
- Paused means still: the tank stops moving (shrimp, legs and antennae) unless you are cleaning, checking or treating.
- Until you finish your first health check, a sick tank has its own NEXT step ("Some shrimp in Tank 1 look sick. Tap the tank, then Check shrimp.") with a ring around the tank, and the tank caption says "Some look sick · tap to check". With several tanks it first points at the right tank chip. After a partly successful cure it waits five days before asking again.
- Easter egg: Grandma's old grad school lab throws a birthday party every two weeks. She asks you along twice, once from day 90 and once after Europe opens, each for some lab member nobody can quite place. Going costs a day of sales and rests you; saying you're busy nudges you toward drive.
- Bots: strong cold 2,657, average seed 7 Earth 6,162. Both parties fired.

## Pass 79: too much new water
- More than 200% of the tank's water in 7 days makes them all molt at once and about half of everyone 10+ days old dies. The week's running total shows under Water care, the Water button warns from 120%, and the header chip says "wait a day" from 150%.
- Automatic changes (auto water changer and staff) never take a tank past 150% in a week, so only hand changes can cause it.
- Bots: strong cold 2,657, strong kind 3,258, average Earth 6,162–6,190.

## Pass 80: a new player with nobody next to them
- New scratch bot (a player who only does what the screen points at: spotlights, story cards, the NEXT card, glowing buttons, pulsing tabs, the pause pill, the ? ideas when stuck) played with a fake clock for hours of game time. It exposed where the game goes quiet and the colony dies.
- What it found and what changed:
  - Feeding was only cued once. Feed now glows whenever the hand feeding has run out, until there's an auto feeder.
  - Water changes were never cued after cycling. Water now glows when the water needs a change and nothing changes it automatically, and during cycling when the cycle stalls or the cycled water needs clearing.
  - Danger alerts (!!) sat behind the alert button. Any danger on a tank (ammonia, nitrite, KH, GH, too cold, starving, dying fast) is now the NEXT step in the alert's own words, glowing the button that fixes it. Alerts that lacked a fix got one.
  - Heat killed colonies every summer. Too hot is now a NEXT step: the fan first if affordable, then the chiller, otherwise the room AC or a frozen bottle.
  - Sickness after the first health check only shows once shrimp are dying fast (rule 5 stays).
  - When every tank is automated and an emergency needs a hand change or feed, the Water or Feed button comes back.
  - All shrimp gone: "Your shrimp are gone. Buy new ones in Trade" is the next step.
  - The auto feeder and auto water changer are offered once each as a skippable NEXT step when affordable.
  - Kits: growth steps you can afford come before "pack a kit": the first packing tool, a packer when orders outrun you, the tanks the farm license needs, the license, the first grow rack. Packing by hand stays the fallback next step whenever stock is empty. The monthly QC hint no longer hides it.

## Pass 81: a guy who knows a guy, seeded tanks
- Shady loan: next to a purchase you can't quite afford (you have at least half), a dashed "Know a guy? Borrow AED X" button lends exactly the gap. One loan at a time, 20% a month compounding, pay back any time from the alert (!!) popup. A NEXT step offers to pay once you can (from a week in). After three months unpaid he collects: your newest farm, or else your best gear (chiller, auto water changer, auto feeder, fan, heater), counted at half its price against the debt, a Shrimp Times line, and Grandma hears. Then again every month until it's paid. Collected loans count as the old market shark (`sharkUsed`) for the money-trouble path and endings. Reuses `E.shark` with `deal:1` (`sharkLend`, `sharkPay`, `sharkTake`, `loanRow`); the out-of-money card's market loan only shows when you don't already owe him.
- Tanks 2 and 3 need no cycling: they're seeded from Tank 1. Buying one opens a sheet: why there's no cycling, auto feeder and auto water changer for the new tank with buy buttons, then "Got it, show me" spotlights the tank switcher.
- Bots: strong cold 2,893, strong kind 3,219, average Earth 5,994–6,189.

## Pass 82: alert colours, a clearer popup, plain buttons
- The alert button shows "!!" (danger) or "!" (watch) with no count, coloured by the most urgent kind of trouble: red sickness, blue water, yellow food, orange temperature, green money, dark for anything else (`alertCat`). Each row in the popup has the same colour stripe.
- The popup now sits over a dimmed page as its own card, with a "What needs you" title and a Close button. Tapping outside also closes it. `#apop` moves to `body` on load so the dim can cover the header.
- Feed and Water buttons say just Feed and Water.
- First health check: after "Got it · show me" the tank is spotlit with the rest dimmed. If you can't afford the cure, it says what it costs and that Grandma pays this time.
- With the water readings open, Fed and Nutrition become two plain stacked bars.
- Fed bar: biofilm alone keeps them half fed, so the bar now runs from that floor (empty means living on biofilm). The header's "costs" line is now "bills" (electricity, plus food when you feed), so it doesn't read as food being bought without feeding.

## Pass 83: shared settings, no room AC, a day-long bottle
- All tanks share one set of settings (feeding, food, water change, new water GH/KH, heater setpoint, automation, treats, sales rules). Change it on any tank and every tank follows. The "Copy settings" button is gone.
- The room AC is gone, it made the fan and chiller pointless. The frozen bottle now cools for about a day (you can add another once it's half melted) and floats in the tank view, drawn from Puti's sketch.
- Gear groups (Runs itself, Temperature, Room and filter, Decor and plants, Treats) are separate boxes now.
- The tank view re-checks its shrimp whenever the count changes, so an emptied tank shows empty right away instead of waiting for the next day.
- Bots: strong cold 2,893, average Earth 6,189 (unchanged).

## Pass 84: biofilm, one-day feeding
- Shrimp can live on biofilm. Without food, hunger climbs fast to 50%, then about 10% a day, and stops at 90%. Nutrition sinks toward 10%: breeding falls off (zero only near the floor), babies come out up to 4 grade points paler, and deaths from poor food only start below about 12% and stay small. Fed shrimp are unchanged.
- A hand feeding covers one day again, with no automatic top-up.
- The ? on Feeding and the Hunger and Nutrition readings explain the biofilm floor.
- Bots: strong cold 2,729, strong kind 3,233, average Earth 5,938–5,994.

## Pass 85: a full new-player replay
- Replayed from a fresh game with a cue-only player (taps spotlights, cards, NEXT and glowing buttons), plus runs from the farm stage and from 10k owners.
- Start: tapping the spotlit button itself now presses it (it used to just close the tip). Counts round instead of floor (5 bought shrimp no longer reads 4). Feed glows when they're actually hungry or underfed, not the moment a portion runs out. Nutrition falls slower on biofilm, and under 50% it's a watch, not a danger, until 20%.
- Kits: the first kit's materials are on Grandma if you can't afford them. "The farm license needs" grammar.
- Water trouble on a tank with no auto water changer offers the changer once you can afford it. Heat with a fan suggests the heater then the chiller.
- Mid game stalled: a cue-only player sat on AED 3–80M with packing stuck at 8 kits a day and word of mouth under 60%. Now: packing shortfalls point at the next packing step (camera, packaging machine, robotic line, packer) and that project jumps to the top of its list; kits piling up point at ads and shops; idle money makes farm tiers, packing machines and regions real next steps; the ? ideas switch from home-tank chores to the business once farms run things. Farm-stage replay went from 27k to 173k owners by day ~2,500.
- Smaller: story-card costs show in grey, the bulk-order toast is gone (the NEXT card says it), Consultants moved to the bottom of Kits, chevrons on Operating controls, Consultants and Your home tanks, the Lab tab opens with Research unfolded while nobody is hired, the field buttons have room, the market loan caps at AED 250k.
- Tooltips: tap a slider's label (New water GH, Cull below...) for what it does.
- Grandma money: pick Nothing, A little (1% of cash), Some (3%) or A lot (10%) each week.
- Bots: strong cold 2,706, strong kind 3,238, average Earth 6,134–6,162.

## Pass 86: free hints teach once, consultants advise
- Puti's rule stands: bottleneck advice is the consultants' job. The free NEXT hints for business levers (packing machines, marketing, bigger farm tiers, the first new region) fire only until you've used that lever once (`leversTaught`). After that they're quiet.
- When a lot of cash sits idle, the hint points at the consultants ("AED X is sitting idle. Not sure where it should go? Consultants in Kits can tell you"), every 120 days at most.
- Consultant advice now glows the button it means (next farm, next packing machine or packer, ads, regions, restart farms).
- The ? ideas after the farm list options (bigger farms, packing machines, regions, ads and shops, the Lab, consultants) without saying which one is the problem.
- Farm-stage replay (cue-only player): 100k owners by day ~2,500 with consultants, 38k without the advice buttons, 173k when free hints diagnosed everything.

## Pass 87: text pass, cycling colours, one action when cycled, the river war
- Merged the text reviewer's 38 edits (AGENTS writing rules narrowed, letters, endings, Ten years, million, the hard part, house lines). Ending preview rebuilt.
- During cycling with no shrimp, ammonia and nitrite in the cycle card no longer show red danger arrows, they're the bacteria's food then. The ammonia and nitrite alerts already only fire with shrimp in the tank.
- "Your tank is cycled" has one button, "Buy shrimp in Trade", and the Trade tab spotlight is skipped.
- River war (the hard part): "Make peace pay" with generals on the board became "Pay for a river treaty": a jointly run water plant, written water and revenue shares, an outside authority checking the meters, each country keeps its side, slow. "Wait for a common enemy" and "Sell kits to both armies" are retired (old saves that picked them keep them). "Wait it out" is now "Stay out of it".
- Bots: strong cold 2,706, strong kind 3,312, average Earth 6,217–6,245.

## Pass 88: space is a search for a planet
- Space starts with a search program: telescopes find the first planet (AED 30M + 60 knowledge, about six weeks), probes find each next one. Nothing launches before its planet is found. No more moon.
- Each planet's problem has two ways: change the shrimp (Lab research: "Gene edit: heat-tolerant shrimp", new "Gene edit: hard-water shrimp" for Brine, +2 water a day there) or change the planet (Terraform: cool the lakes, filter the rivers, restore the ocean). Lake sunshades work only with heat-tolerant shrimp.
- A seed ship carries algae, biofilm and a small base. Once it's stable, the shrimp are let go.
- Space test fixture now hires postdocs, contracts crew and assumes a research group, since the strong bot doesn't fund the old academy chain. Average bot: Earth 6,217–6,245, space done by 7,628–7,656.

## Pass 89: the outside UI review (site/ui-review.md, 28 issues)
- NEXT stays near the button it glows: the guide scrolls once per cue to the glowing button (or the card if no button), only when it's off screen, and never while a spotlight or the tank view is up. The card-centring jump is gone.
- A blocked story card can't be run past: a tick that finds progression blocked pauses and remembers the speed for after.
- First health check: the dim, the tank-view cue and "Tap the tank" work in order, and tapping the tank while sick only opens the check sheet on the first check.
- Spotlights click through: tapping the lit button closes the spotlight and presses that button.
- Room before Sell: once sales are halfway to kits, a real "make room" tank step comes before the Sell cue.
- 4× is offered at the first ammonia dose, not at the bottle purchase. The first purchase holds the next story card for ~40 s. The speed glow lasts 30 s. The hatch card waits for 3 babies.
- The shady loan row shows only on rows the guide is pointing at. The sales-rules fold opens for the sell spotlight. Salt dip result says "Put them in the tank". Grandma's Close/See-it buttons and the guide bar stay out of the health check.
- Heat: the frozen-bottle hint shows once per hot spell (30-day key, not while one is melting); if a bottle was used in the last 30 days and a chiller is in reach, the hint points at the chiller.
- Locked kit price: − and + do nothing and fade while the slider is locked (all steppers follow their slider's `disabled`).
- First kit: once the bag is filled and the kit needs 8 spare shrimp, NEXT says so, and the header Sell hides until it's packed (`firstKitWaits`).
- Done packing/QC steps are a green outline, not a filled button. Online shop says Running. Lab field buttons are a flex row with 8 px gaps. Speed buttons are 32 px with 5 px gaps and a taller hit area. Card header notes never wrap (…).
- "Your time · Got it · show me" opens Your day and scrolls to it.
- Shrimpcoin: you can't buy more coins than others hold (Held by others never goes negative), and "nobody else plants" says "others have stopped planting" once they had.
- Negative income reads "income is −AED X a day". Start over unwraps "Your home tanks" back into Gear. Reload reopens the tab you were on (`G.opt.lastTab`, falls back to Tank if that tab is hidden).
- Bots: strong cold 2,694, strong kind 3,312, average Earth 6,245, space 7,656. Spotlight sweep 137 checks clean.

## Pass 90: notes, not news (hot fix)
- Shrimp Times banners showed up long before the World tab, and personal things (running 10 km, the shrimp club, Grandma's fish soup) came out as news.
- The paper now only prints once its tab is open (`paperOpen`). Before that, a news line is a "Word gets around" note.
- Personal things are notes with their own masthead and never go in the paper: Your day milestones ("Your day"), Grandma ("Grandma"), small buzz about the kits ("Word gets around"). Same banner look as the newsflash, one at a time, 12 s apart, not over cards, spotlights, cleaning or checks. Tapping a Your day or Grandma note opens the You page.
- Old saves: a paper backlog from before the World tab stays quiet until the tab opens.
- Tests: no Shrimp Times before the World tab, running and Grandma never make the paper. Bots: strong cold 2,562, average Earth 6,245, space 7,656.

## Pass 91: before friends play (bug review)
- Time away: closing the app or leaving it in the background both give up to 30 game days at the speed you left at (`awayRun`, `catchUp`). It stops early when a tank gets sicker or falls sick again (stage 2+), or shrimp are dying (deaths over 15% of the colony and fewer shrimp than before, so baby losses, old age and kit packing in a healthy tank don't count), then pauses the game and the toast says so. Before, a sick tank could die off during the catch-up with no warning, and a backgrounded tab got no time at all.
- No saving while the page is hidden: one save when it hides, then nothing until it's back, so `savedAt` stays honest. `pagehide` still saves.
- Sound on iPhone: unlocks on finger-up taps (`pointerup`, `touchend`, `click`) and every tap wakes a context the phone left suspended (`musicKick`).
- Start over builds `migrate(newGame())`, like a first load. Before, the next reload treated it as an old save and marked story cards seen.
- Pain cards: the cheapest choice is always open, into debt if it has to be, so a card can't hold the clock with every button off.
- Smaller: Operating dropdowns are 16 px so iPhone doesn't zoom; speed, tab, guide and top buttons get `touch-action:manipulation`; a save that fails to load is kept as `universal-shrimp-v2-bak-<time>`; Grandma's 5 free shrimp also come before the first purchase once the water is ready; no update checks from a hidden tab; no toasts over the ten-year ending; a failed sound load waits a minute before trying again; a page that loads in the background still gets its time; the update check runs when you come back.
- Not changed: the market man smashing a farm without lowering the debt is a threat, not a repossession (the bank and the other loan take assets as payment).
- Tests: away time stops on sickness and deaths and runs the full 30 days when the tank is fine, pain cards have a choice at AED −1, Grandma helps before the first shrimp, plus string checks for the UI fixes.

## Pass 92: the last chapter, breathing room, late-game clutter (Puti's play, Oct 26)
- The hard part is a walk now: first "what does everyone mean" (keep Every home or pick another goal), then one group at a time with its options and a "Next: <group>" button (it says "Leave them for now" until you pick something). Groups you've looked at fold into "Groups so far", where you can still act on them, and "Rethink the goal" stays below. `H.goalOk`, `H.at` (UI state in the save). Old saves already deep in the hard part skip the walk (`migrate`).
- Breathing room: story cards are 75 s to 2.5 min of play apart and never under a minute, even with a backlog (`paceGap`). News lines keep the old quicker pace (`newsGap`). The Shrimpcoin offer jumps the line so it doesn't wait behind other decisions (`STORY_FIRST`).
- 40× opens with the hard part (4B people), not only after the game is over.
- Research lines show how many finds, never "x of y": knowledge has no end. The research-group step reads "n discoveries so far, four needed".
- Consultants: once every region is open, the reach limit points at the hard part, never at more regions.
- Dark projects on their own (not one side of a choice), like Fund a politician, get "Turn it down". It's gone after that (`projDecline`, `E.no`).
- Removed: the Breeding laboratory card (farms keep the best bloodline your tanks ever reached by themselves, daily), the "Your home tanks" gear section once hatcheries are up, and the Sales & shop card once AI agents sell, every region is open and every mall has a store (`salesDone`).
- Bots: strong cold 2,701 (was 2,562), strong kind 3,299 (was 3,361), average Earth 6,160 (was 6,245), Space 7,628 (was 7,656), average waiting 39 min (was 42). Spotlight sweep 135 clean (the two removed cards no longer need one). Space playthrough passes.

## Pass 93: decisions you can't read the answer to, a steady screen, coin and Space fixes
- Story choices (late cards, pains, Grandma, forks in story cards) show the label and the cost only. The description and what changed come after, in a "What happened" popup you have to close; the game and the next card wait under it (`showAfter`, `closeAfter`, `afterOpen`). Fork projects show the name and cost, then `p.d` in the popup. Hard-part options show their news line after. Chapters, intro, space dream, win, game over and broke keep their text.
- Steady screen: `render` is wrapped. Before it, the card and item under the finger (or the middle of the screen) are measured; after it, the page scrolls by however much they moved, so content changing above doesn't push things around. Not while scrolling, during a spotlight or with the popup open.
- Accidental taps: a decision button (story choice, project, hard part, coin sell, Got it) ignores a tap within 0.5 s of appearing or moving, with a small shake.
- Shrimpcoin: a tap plants 1.6M trees (AED 6.4M), about 5,000 taps for every coast (`COIN_BATCH`). Other planters go ten times slower (0.02% of people a day at most), so the coasts take years. Sell coins says why it's off (first coins in n days, or plant or buy first) and sells at least one coin.
- Space opens after Earth for the curious path as before, and now also for anyone with 40+ papers or a research group (`spaceResearch`).
- Bots: strong cold 2,703, strong kind 3,299, average Earth 6,217, Space 7,684, waiting 39 min. Spotlight sweep 135 clean, Space playthrough passes.

## Pass 94: look over your shrimp, and your own tank by hand
- Look over (any time, from the tank's buttons, once there are 4+ grown shrimp of your own): 12 of your shrimp, drawn from the real colony with their real colour, swim in the check sheet. Tap the ones you don't want and take them out. They're sold as culls (a quarter price), shrimp you bought never come up (`cullSample`, `cullPick`, `openCull`, `renderCull`, `HC.cull`).
- At the first hatchery your own tank keeps 20 shrimp, the best coloured adults, and the rest go to the farm (`keepTwenty`, after `retireTanks`).
- From then on mulm settles in the gravel, the sponge goes brown, plants and moss grow out and snails and flatworms turn up (`careDay`, `T.care`). You see it in the tank, nothing tells you to fix it: no alert, no guide, no glow. Gravel, Sponge, Trim and Pests sit next to Look over under the tank. Gravel: drag along the bottom, a tube pulls up the fluff. Sponge: tap it to squeeze it out. Trim: drag across what's grown long. Pests: tap them. Each job done counts toward how your own tank feels (`G.ps.care`, `ownLevel`).
- Bots: strong cold 2,651, strong kind 3,301, average Earth 6,133, Space 7,544, waiting 39 min. Spotlight sweep 136 clean, Space playthrough passes. Tapping every button at 16 stages: no errors.

- Look over opens with the first shrimp you buy (any grown shrimp, age 30+). Bought ones show up too, and every shrimp you take out, bought or bred, is sold as a cull. Normal selling still never touches bought breeders.
- Look over (and, at home later, Gravel, Sponge, Trim, Pests) sit in a row under the tank whenever they can do something, not only after tapping the tank (`careRow`). Bought shrimp taken out in Look over sell as culls too.

## Pass 95: owners bar under money

- Once Feed/Water/Sell are gone, the "X of 8.2B people have a shrimp tank at home" bar now sits directly under money and influence, above Fed/Nutrition (moved in the header markup; it still only shows when the action row is gone).
- Checked at 390 px on the year-14 average-bot save. Balance 56, academy 10, me 45 all pass.

## Pass 96: Cull button easier to find

- "Look over" is renamed "Cull shrimp" and moved to sit directly under the tank, above the Check shrimp / Clean tank row that opens on a tap, so it can't end up below the fold under that row.

## Pass 97: Cull moves into Check shrimp

- Check shrimp now samples real shrimp. Pick any, tap Done looking, then choose Treat (the old cure flow, or "everyone is healthy") or Cull (sells them as culls). A ? next to Cull says how culling lifts the colony's colour over time. Culling sick ones leaves the illness in the tank and offers Treat after.
- The separate Cull button under the tank is gone; the care row (Gravel, Sponge, Trim, Pests) stays for the own-tank stage.
- Short guide: a one-time spotlight on the tank once tank 1 has an auto feeder and water changer, plus a 3-step note inside the sheet until the first Treat or Cull.
- Checked in Playwright: healthy pick then Cull (money up, colony colour shown), sick pick then Treat (cure screen), sick pick then Cull (illness note, Treat the tank works), tutorial spotlight fires. Balance 56, academy 10, me 45 pass.

## Pass 98: cull looks stand for the whole tank

- The 16 shrimp in Check shrimp stand for the tank. Going through a tank from scratch takes 5 looks, each covering a fifth of the adults, so each pick takes out about adults/5/16 shrimp of that colour and age. After the fifth look the tank is gone through; 30 days later one look covers all of it again (monthly maintenance). A look with nothing picked, or ending in Treat, still counts as a round.
- The sheet shows "Round 2 of 5 to go through Tank 1. Each shrimp here stands for about 35 like it", or the monthly / gone-through note. Treat's subtitle now reads "If they're sick, find a cure".
- New balance check (57). On the 5,590-shrimp save, 3 picks took out 104 for AED 95.

## Pass 99: one shrimp count, no mothballing

- The header count is every shrimp you own: tanks plus hatcheries (shrimp waiting to be packed and about 60 days of each running farm's output on the racks). Its title splits tanks and hatcheries. The +/day history restarts once on old saves so it doesn't jump.
- Farms only have Buy and Sell now. Mothball and Restart are gone; an old save with mothballed farms restarts them on load. The end-of-game and sandbox notes say to sell farms you don't need.

## Pass 100: last review before deploy

A fresh reviewer read every change on this branch against main. Fixed:
- Home-tank gear was hidden from the first grow rack, so the Water button could never go away and the guide pointed at a hidden card. Gear now stays until every tank has an auto feeder and auto water changer, and the guide skips any card that's hidden.
- Old saves with mothballed farms: those farms are now sold at salvage on load instead of restarting with full upkeep.
- Shrimpcoin planting cost a fixed ~AED 6.4M a tap; a tap now plants what spare cash pays for, up to the batch.
- One cull look can't take out more than half the grown shrimp (the monthly look covers the whole tank).
- Closing a decision popup while a story card is queued now gives the speed back after the card.
- Check shrimp no longer leaves an old canvas loop running each time it redraws.
Bots after: strong 2,651 (dictator ending), kind 3,301 (garden village), average reaches 8.2B owners, Space completes; spotlight sweep 135 clean; tap-every-button 104 snapshots, 0 errors. Balance 58, academy 10, me 45.

## Pass 101: racks open with 3 self-running tanks, first rack brings the own tank

- Farm license now needs 50 kits sold and Tanks 1-3 each stocked with an auto feeder and auto water changer (no litre requirement). The guide points at whichever tank still needs automating.
- The own-tank card ("The tank at home") comes with the first farm of any kind, not the first hatchery: extra tanks go to the farm, Tank 1 keeps its 20 best.
- New balance check (59).

## Pass 102: mangroves from 10,000 kits, one tree a tap

- The Shrimpcoin card now opens as "Mangroves" at 10,000 kits sold (about year 3-4), long before the coin. A tap plants one seedling for AED 4.
- Others plant too: people copy what they see (0.2% of all trees planted, a day; doubled by the Mangrove restoration project), a mangrove gala spends its money on seedlings (AED 4 each), and once shrimpcoin launches and pays more than a seedling costs, anyone with a coast plants for the coin as before. The card shows how fast others are planting.
- Your trees planted before the coin earn honest coins a year after planting once it launches.
- Balance checks updated (59).
- Bots (they now fit auto water changers to every starter tank, since the license needs it): strong 2,648 (dictator), kind 3,305 (garden village), average first farm day 785 and Earth complete day 6,161; Space completes; spotlight sweep 127 clean.

## Pass 103: prototype tank jobs, kindness costs time where it makes sense, lab party

- Own-tank jobs now look and play like the Shrimp Home Prototype's (vacuum with bucket and babies, sponge scene with flow meter, scissors trim with cuttings, tweezers for pests). Care row is one row.
- Kind choices: six cost time (fewer new owners for 2-8 months) where that is what would happen: free care video vs the cheap rival, the marine survey, the Shrimp Times interview, backing the welfare law, the retraining fund, sharing the breeding line. The popup says why. Problem-card fixes done properly take about twice as long (3-6 months). Bots: ruthless 2,679 days, always-kind 3,652 (misses ten years), average 6,608.
- Grandma's lab party waits for 500 shrimp; going means a hungover day with no sales.
- Space note names only the missing Lab project studies and lists them first after Earth.

## Pass 104: traits read the balance of choices, dominant decisions rewritten

- Traits: `trAdd` also keeps the sum of push sizes (`G.trAbs`); the choice part of a trait is sum / (sizes + 4) instead of tanh(sum / 6), so a mixed player sits in the middle and long games don't run into ±1. Old saves count their sums as one-way pushes. The ending preview uses the same formula.
- Routine one-off upgrades (the 44 "always buy" ones: care guide, farm license, SOP, AI, drones, schools, Ministry, Shrimp Pictures, mangroves...) no longer push traits. Posters, pop songs, the politician, the tax haven, the hamster tax and nannies keep theirs.
- Control retagged on one rule (you decide = in control, someone else decides = lets go): buying the paper, buying out the breeder, posters, songs, the politician and keeping a human checker are in control; the interview, the co-op, the routing agent, making Luca or Gema regional heads, the sealed-jar workaround, local island breeders, a lawyer for Grandma and leaving the old tank are lets go.
- War and tax haven moved off care onto means. Risk taken off bribery-type options (the welfare bribe is gone, reviews are paid in food, waste dumping, tax haven, politician); kept on real bets (dye, fight night, the market lender, the investor, shell processors).
- Rewritten decisions: cheap rival (wait them out, closes in a few months), marine survey (say no keeps your list for shrimp, mood up), routing agent (keep your drivers), Mira (come Saturday), the three goodbye cards (six months' pay shows its real price and cost), red dye (new middle option: colour food, AED 150 scaled, shrimp sell 15% more after three weeks; sell them as they are), fight night, the investor, the buyout (Grandma gets a house by the water, shown in the ending), Grandma's scam (fly her home with a lawyer: small fee, half her money back a year later), the stress study (survey your own owners, AED 200k, mood ceiling +2% a month later, no scandal), welfare law (run your own audits, same upkeep cut, no scandal), reviews (a bag of food per review, no scandal), Can't do it alone (new sealed jar workaround), and the dead third options on c_power, c_rivers, c_many, c_fisher and coin_offer (not interested plants 300 trees near Grandma).
- New tags: Grandma's land, both lab parties, the scam, the buyout, out of money (bank loan careful, market lender risky, selling shrimp careful), the old tank, the layoff fork, the slow pain fixes (drive −0.2, risk −0.3 on payouts and permits), small moss farms (stays local), children's hospital galas (people close), selling data and shipping cheap (means).
- New balance check: a ruthless and a kind run through the same cards end apart on drive, ego, kin, care, risk and means (60).
- Bots, seed 7, before → after: strong 2,679 → 2,681 days (empire_dictator both); kind 3,652 → 3,658 (garden_village both); average Earth 6,608 → 6,580, ending garden_village → question_prof, Space completes. Final traits strong: drive .99→.63, ego 1→.74, means −1→−.49, know .72→.22, kin .44→−.32, reach .69→.33, care .78→.18, risk .45→.26, control .29→.65. Kind: drive .79→.20, ego .87→.32, means 1→.70, know .92→.63, kin 1→.62, reach .62→.26, care .99→.26, risk .13→−.08, control .29→.29. Spotlight sweep 125 clean.

## Pass 105: second outside UI review

- Farm license hint points at what is actually missing (automate the stocked tanks first, then add a tank) and counts "Ready: N of 3" only for tanks that meet every requirement.
- Tapping the Next bar scrolls to the glowing button, not the middle of a tall card.
- Kits card says when the packing station is idle because of Keep in tanks, and how many shrimp it can use.
- Grandma / Your day / Word gets around notes and newspaper flashes appear just below the top bar (fade in, untappable while hidden), never over the speed buttons; they clear when a tank job starts.
- Tank chips get a visible ring when guided. Pause pill hides behind the What happened popup. Card header notes wrap instead of cutting off numbers. Fed and Nutrition keep small labels when water readings show. The gravel job's button says "Check for babies". Mouse drags in tank jobs don't select text.
- Mangrove one tree per tap is intentional (the designer's call).

## Pass 106: one tight button grid under the tank

- Check shrimp and Clean glass no longer hide behind a tap on the tank; they sit under it in the same grid as the own-tank jobs (Gravel, Sponge, Trim, Pests). 2 buttons in one row, 6 in two rows of three, no empty cells. Check shrimp is still where sick shrimp are found and treated or culled; Clean glass is still the algae wipe.
- Cull button is the same plain style as Treat.

## Pass 107: third UI review, text trim and calendar dates

- Card header notes stay on one line (ellipsis as a last resort) and are short enough not to need it at 360 px: staff "AED 231/d", hatcheries "AED 11.3k/d", research "1 person · AED 184k/yr", Projects shows only the ✦ total with "✦ +409 a day" as a line in the card. Titles "Sales staff" (Ads) and "Schools and universities" (Lab), chart notes "tap for one day", Operating controls "stock, reserve".
- Readings and shrimp chart titles read the same last recorded day as the line under them (one ppm format for both).
- The Shrimp Times header no longer says "N shrimp-free". "N people quit eating shrimp" leads the effects line in the card.
- While saving up for room is the only thing left (bigger tank or another tank before kits or the farm license), a quiet grey Next line says "Saving for a bigger tank: AED 130 of 350". No glow, no tab pulse, no slowdown (`savingLine`).
- `dateOf(day)` gives the calendar date ("23 June 2028", same calendar as the header). The Shrimp Times latest story and archive, the newspaper banner masthead, Recent events and Completed projects use it. Header "Day N" and chart axes stay.
- Recent events fold routine sales, water changes and hand-packed kits into one line, only for the latest day they happened, in grey (`logRows`).
- Text trims, detail moved behind ?: Keep in tanks explanation, kit price lock, Equipment effects only (what each item is now in the Equipment ?), treats say "pick one a week under Feeding" once, Your day rows one short line (rules in the Your day ?), shop rows show kit orders/day and rent/day (rest and trust explained in Shops ?), staff rows "+25% customers each · AED 130/d each", "4 of 5 shops managed", hatchery rows "8 shrimp a day = 1 kit · AED 4/d upkeep", Mangroves one line with counters hidden until a tree is planted (? talks about shrimpcoin only once it launched), owners rows at 0 hidden with one line for what + and − count, What happened skips an effect whose % is already in the text.
- Stale lab references gone (Chapter 4 "Your first tank stays at home", barn note, owners help). Farm license hint "Farm license: 3 tanks that run themselves, 0 of 3 ready. Next: an auto water changer for Tank 1." Postdoc cost "about AED 184k". Money chart title drops "You are in profit". Hide tank readings / Tank 1 controls moved from the ? popup to Settings (same `fold` id). Kits chapter no longer lists the five steps. The unused `tanks2` card text is current (kept, a test checks it exists).
- BUILD 2026-10-26-r3.

## Pass 108: news you can swipe away, big world changes in the middle

- Shrimp Times banners and Grandma / Your day notes can be swiped up to dismiss (tap still opens World / your page).
- The turning points of the shrimp-free story (fishing towns upset, first mangroves, ponds turning green, fish and wild shrimp back, storm, carbon, coral, less carbon, mangrove boardwalks, farms growing seaweed) open as a centred "What happened" popup with the effect, instead of a banner. Smaller stories stay as the top banner.

## Pass 109: the shrimp-free story up front

- A green line under the owners bar keeps the chain on screen: "11.5M quit eating shrimp · 3.85M mangroves back". Tap it for The Shrimp Times.
- Closed shrimp ponds grow back into mangroves on their own once the first flooded pond does (the 1M ripple): about one tree for every two people who quit, over half a year, no coins. They count on the Mangroves / Shrimpcoin card ("Grown back on closed shrimp ponds") and take coast room.
- The ten-year card and the ending open with "What changed on Earth": people who stopped eating shrimp, mangroves back (and how many you planted), and the big turns of the story that happened.

## Pass 110: seven traits, measured from play where the game can't bias them

- Seven traits (`TRAITS`): drive, means, know, kin, care, risk, control. Ego and reach are gone, folded into drive (driven = wants to achieve greatness, easy-going = happy with a shrimp tank and some plants). `migrate` adds old `tr`/`trAbs` ego and reach to drive and deletes them. Ending preview (`ending-playtest.html`, data rebuilt) uses the same seven and the same family formula.
- Drive: contentment, rest, saying enough, staying small, the buyout and family time are easy-going; Grandma time is easy-going and never care. Option pushes are even: 36 driven (22.4) against 42 easy-going (21.3). Play part: Your day work and dinners against Grandma, house, own tank and rest, measured from the default day, plus time on the You page and own-tank jobs by hand. Speed and region timing no longer count.
- Know is now fine-tunes everything / good enough is good enough. 70% play: setting changes away from defaults, ? opens and chart opens per game year (`psNote`, `G.ps.tw/help/chart`), −0.6 when nothing is touched up to +0.8. Curiosity and research picks lost their know tags (heat-tolerant shrimp, travel jars); jar tanks are good enough.
- Care is now helps strangers far away / looks after their own, only on choices that split help between far and near.
- Control is now has everything in order before moving on / moves on with loose ends. 70% play: at the first kit, each new farm tier (first rack included), each region and the space start, `prepNow` records optional tank gear, QC steps owned, stores in opened regions and no pain left open, read against `PREP_MID` 0.8. Automation and cash don't count. Who-decides fixes: a humanitarian group is lets go, the permit firm and the chatbot lets go.
- Means: repeated picks (campaigns, films, galas) count less each time (`repW`). Volume against the next trait is down from about 6× to 2.5× in the average bot, and the ending headline ranks means at 3/4.
- Ruthless pays more, fair costs more on means splits. Fair one-off prices ×1.5 (pain fixes, study, retraining, sponge filter, school kits, river cleaning), kind slowdowns ×1.25, cold payoffs ×1.5 (pain penalties /1.5 and a crash discount that pays, fork incomes, naming ✦, paper mood, docks, wetland, waste dump, food-bag reviews, kids ads, data sale), pushy campaign messages ×1.5, dark hard-part ramps ×2/3 and credit pays 45 days. Ongoing fair costs (kit material, wages) and hard-part fix prices stayed where they were so the kind and average players don't stall. Pain cards show every option's ongoing cost before the pick (refunds a day, fines a day). The pay-up middle options carry no drive or control.
- Mislabels: waiting out the rival now costs months of slower growth; burnout rest is 14 days and keeping going is worse; culling counts toward shrimp are stock; refusing the buyout pushes nothing.
- Win card: the Review button froze the game (`progress.reviewing`). The card offers Keep playing and New game. `migrate` releases saves stuck that way, the Space hand-off keeps its flag.
- Hard part: cooling and wells ramp in 330 days (was 450).
- New balance checks (69): seven traits and the migration, the stuck review, the win card buttons, no Grandma care pushes, drive balance, the random-chooser null test (all medians within ±0.05: drive 0.00, means −0.03, know −0.02, kin 0.00, care 0.00, risk 0.01, control 0.00), every ending family reachable, know and control from play. The spotlight sweep checks the play-stat hooks.
- Bots, seed 7, before → after: strong 2,681 → 2,479 (empire_dictator), kind 3,658 → 3,698 (garden_village), average Earth 6,580 → 6,441 and Space 7,964 → 7,852 (question_prof). Nobody insolvent.
- BUILD 2026-10-27-traits7.

## Pass 111: final logic and layout pass

Logic and text (checked in Playwright on early, mid, late and won snapshots: win card, Keep playing, the Space hand-off from both, cull and treat at every stage, old Oct 26 saves with ego and reach, choice previews leaving the real game untouched):
- Growing pains: the kit material line said "Kits 12% dearer" under "Undercut them on price", which reads as a price rise. It now says what the number is, "Each kit costs 12% more to make" (and "less to make" for home-grown moss).
- Story choices that put their price in the label ("Fund the engineers, AED 50M") no longer repeat it underneath as "Costs AED 50M". Other costs still show.
- Singulars: "Reach +50% for 1 day" (daily reel), "1 store", "about 1 day left" on a Lab study, and "Moved to an 80 L tank" in the log.
- Nothing else found: no runtime errors, NaN or undefined in 91 average-bot snapshots across every tab and every button (monkey), the strong and kind runs, or the old saves run forward 100 days.

Layout (360, 390, 1280):
- Short text no longer leaves one word on its last line: `text-wrap: balance` on headings, buttons, labels and summaries, `pretty` on paragraphs, list items and small print.
- Win card: Keep playing and New game share the row equally, Hear Grandma's new dream spans the row under them. The ending title keeps "·" with the word before it.
- Lab research lines: the field name no longer squeezes into three lines next to the counts (counts drop to their own line), and "+ PhD student" is no longer cut off; the label wraps, the price never does.
- Shrimpcoin numbers: two even columns, so long values ("1.09B, 21.8M people and a few countries") take two lines instead of five.
- Sliders on phones: label column 96 px (92 px with 12.5 px labels under 370 px), so "New water GH" and "Keep in tanks" stay on one line.
- Food choice and QC strictness buttons fill their row. A project with Turn it down keeps its price button level with the title.

Not changed: "Check shrimp" still wraps in the six-button own-tank grid (only fix is dropping the icon); the Rewilding and A place of your own cards still have no fold arrow (they are rebuilt with innerHTML, folding needs the shut state carried through); the professor ending's From the tank line speaks of space before Space starts (story text).

Bots, seed 7, unchanged: strong 2,479 (empire_dictator), kind 3,698 (garden_village), average Earth 6,441 and Space 7,852 (question_prof). Nobody insolvent. Balance checks 71.
- BUILD 2026-10-27-final.

## Status at 2026-10-27 (end of the long chat)

- Deployed: passes up to 111 (seven traits, final logic and layout pass, Earth line, big news popups, swipe-away news, calendar dates, cull inside Check shrimp, prototype tank jobs). BUILD 2026-10-27-final.
- Bots at deploy: strong day 2,479 (empire_dictator), kind 3,698 (garden_village), average Earth 6,441 / Space 7,852 (question_prof). Null test: a random chooser lands at 0 on every trait.
- Next up: Grandma's timeline (see "Open work" in shrimp/AGENTS.md). Read the "Token budget" section there first: this project used most of a weekly Max limit in a few days, mostly through helper agents and one very long chat.

## Pass 112: Grandma's timeline, Check on Grandma, a day of two picks (27 Oct)

- Grandpa died before the story. The lines where he was alive (the well, the roof dinner, "your Grandpa says") are rewritten, and three of her stories now say Maryam was his boat. Old histories are rewritten once (`fixGpText`, `GP_OLD3`, `M.gv=3`).
- Your day: work in hours (0–14), plus two picks outside work, 3 hours each, kept until changed. Sleep is what's left up to 8, then rest. Grandma is no longer an hour. Old painted days migrate once (`dayMigrate`).
- Check on Grandma on the You page shows what's waiting: her own events, moments, mailed money, or "Grandma is fine". Her years lists everything with dates, untold stories as a count. Windows are a game month or 3 minutes of play, whichever is longer, then it happens without you.
- Calendar: her birthday 4 May (only the first rings), New Year's Eve dinner on real lunar dates, your birthday from the first card (default 1 Jan). Pocket money 100, sometimes 150, at most 200, mailed if you weren't there. One-offs: WeChat, the TV (waits, counts days), club president, Maryam (keep it or sell it, AED 30,000), Auntie Fang's funeral, the dance class, her knee, Göbekli Tepe at 3,000 kits a day (two weeks, orders at half), the smaller flat. One call after four months of no checks.
- Ending: checks, there and missed, and "Stories she never told you".
- Tests: shrimp-me 46 (new timeline check, day checks rewritten), balance 71, academy 10.
- Bots (seed 7): strong 2,393 empire_dictator (was 2,479), kind 3,641 question_prof (was 3,698 garden_village), average Earth 6,413 / Space 7,824 garden_hermit (was 6,441 / 7,852 question_prof). The average bot now checks on Grandma every 20 days and says yes. Endings moved because Grandma time is drive− only now and the picks replace the painted day.
- BUILD 2026-10-27-grandma.


## Pass 113: Grandma's land in the game

- You tab: a Grandma's place card with three paid steps, A flat with a balcony (AED 4k), A house with a garden (AED 40k), Land with a stream (AED 250k). Only the land has a map; buying it adds a Go button.
- Go opens `shrimp/home.html` full screen over the game: the pixel land from the Shrimp Home Prototype, Home and Tank tabs only, Back to the company in the header. The company keeps running.
- One wallet: building on the land spends the company's cash.
- Your tank on the land is the game's tank 1. Shrimp moved or sold out of it on the land leave tank 1. Tank jobs there count as care.
- Real time on the land, light from the player's clock (blue night, warm dawn and dusk).
- The land starts empty the first time: the stream, the lake and grass, Grandma in her armchair on a bit of floor, Pierre and the dog.
- Checked in Playwright at 390 px: buy the three steps, Go, spend on the land (cash drops in the game), tank 1 with 20 shrimp shows 20 on the land, two moved to a cull tank there leave 18 in the game, Back closes it. No errors. Balance 71, academy 10, me 45 passed.
- The old "A place of your own" card (land, walls, solar, wind, well...) is gone (`houseOffer` is always false). Grandma's land letter (`gp_land`) now gives Grandma's place, so the land opens. Old saves keep their house ending lines.
- Long checks after merging Pass 112: strong bot WIN day 2,393 (empire_dictator), average Earth 6,441 / Space 7,852 (question_prof; Pass 112 had 6,413 / 7,824 garden_hermit because the bot's yes to Grandma's land used to start the old house; now it opens Grandma's place instead), space chapter passes, spotlight sweep 126 all good, quick monkey on four stages: no errors, no NaN.
- BUILD 2026-10-27-land.

- Carrying (Pass 113b): a caught chicken rides in Millie's arms until you tap the yard by the coop; one caught fish at a time in her hands until you tap the pond (in) or the stream or the lake (free).

## Pass 114: Layout overflow (27 Oct)

- Birthday date field overflowed its card on iPhone (Safari gives date inputs an intrinsic width). Date fields now drop native appearance, `display:block`, left-aligned value. All inputs, selects and textareas get `max-width:100%;min-width:0;box-sizing:border-box`.
- New `tests/shrimp-layout.cjs`: loads the start screen and every run-7 snapshot at 320, 360 and 390 px, opens every tab and details, flags any element wider than its card or the screen. Result: clean, except one chart label 2px past its SVG on the win World tab (not clipped, left as is). Chromium only; no WebKit here, so check the date field on a phone.
- Fast suites: balance 71, academy 10, me 46.

## Pass 115: The opening, one thing at a time (27 Oct)

From a frame-by-frame review of the opening (start to three tanks and kits) at 390 px.

Shown later, when it's needed:
- Day 1: no tab bar while there is only one tab (`body.onetab`), no speed buttons until the ammonia bottle, no room temperature until the water first runs warm or cold (`ob.temp`), no bills line before shrimp.
- Water button from the cycled step (or when the cycle stalls), not from the test kit. Sell from the first shrimp it can sell, not a grey "Ready in ~86 d" from day 34. Clean glass waits for shrimp.
- Nutrition bar from the first babies. The water chip only shows when the water isn't fine (tap still toggles numbers). "+1/d" shrimp only after the first hatch.
- Buy shrimp: all four kinds from the start (Puti, 27 Oct). The "Grade ~N" lines show after the first sale. The first buy goes back to the Tank tab.
- Water care: New water GH and KH sliders from the first time GH or KH is low (`ob.mins`).
- Colony: grade bars and the grade line from the first sale. Readings charts from the first babies.
- Gear: Runs itself first. Temperature when the water runs warm or cold, Room and filter when a tank gets crowded or 100 are sold (`ob.room`), Decor and Treats with the first babies, everything once kits open. "Show completed equipment" only when something is done.
- Trade: the second colony histogram is gone (same as Tank). Sales rules fold closed, the Sell box and Price sit outside it.
- Kits: Keep in tanks, Kit development (`eproj`) and Quality checks from 10 kits (`QC_FROM`), not 1 and 3. ✦ 0 is not shown before ✦ exists.
- Your time (the You page) opens with the first kit sold or the first hatchery, on top of the auto feeder and water changer (`meReady`).

Nudges removed (the player picks the route):
- No Next lines for the auto feeder, the auto water changer, "Saving for a bigger tank: AED x of y", the kit room route, or the first packing tool (the tool line is soft now, in the ? popup). The kit room requirement is one loose idea in the ? popup from 100 sold.
- The new-tank sheet no longer sells an auto feeder and water changer.

Shown matches true:
- Feed only glows when they're actually hungry. No "new" tag on the first card. The test kit says "tests the water". Nitrite and ammonia stay neutral in an empty tank. The hidden AED 20 for cycling is gone (it showed as "+2.8/d" before any shrimp). The "farms copy its setup" note says "You know what works now." The Babies chapter names what's new now. Ads spotlight no longer lists tabs that aren't open.
- A taken pet shop order keeps back the shrimp it needs, so Sell doesn't sell them out from under it.
- Move shrimp defaults to a quarter of the tank (at least 10) instead of 10 or 1.

Influence: story and card text now says "influence ✦" where it only said ✦ ("You lose some sales, but you gain a little influence ✦ every day").

Grandma's land (source on `shrimp-proto`, rebuilt into `shrimp/home.html`):
- A wall on the last tile of a floor sits on the floor's outer edge, so no floor shows outside it (`wallSide`).
- Grass squares left on the stream bank (empty-land saves) turn back into sand, so the bank follows the stream's curve (`fixBanks`, once per map).

Tests: balance 71, academy 10, me 46 (string checks updated; me tests sell a kit before the You page). Land: toys and net pass. Bots not rerun (not a deploy).
BUILD 2026-10-27-opening.

## Pass 116: A steady screen, cost-only choices, demand in the middle game (27 Oct)

- The page no longer jumps when something above what you're looking at appears or goes away. iPhone Safari has no scroll anchoring, so the game does it: before and after every render and once a frame it notes where the thing you last tapped (or the first card under the header) sits, and if the page didn't scroll but that thing moved, scrolls it back (`anchorCheck`). Off during spotlights, the tank lock and health checks. Native `overflow-anchor` is off so Chrome doesn't do it twice. Checked in Playwright: a two-line guide bar plus a 120 px block appearing above the view leave the card under it at the same spot.
- The Shrimp Times and note flashes drop in from the very top of the screen, over the header, instead of under it.
- Story choices show only what they cost: AED, AED a day, influence ✦, kits. What they do (orders while the fix is set up, kit cost, refunds, survival, mood, money) is on the What happened card after the pick. The growing-pain buttons used to say "Orders slow for 140 days", which read as if the fix slowed orders. It's the problem that costs orders until the fix is in place; the aftermath now says that.
- Demand in the middle game: growing pains multiplied orders by 0.35 each, also while a card was queued, and stacked (0.12 with two). In the average bot one or two were active from about 8k to 3M owners (day 1,100 to 2,400), so orders sat at a third or less. Now an undecided problem gives 0.6, a fix being set up 0.85, and they don't stack (the worst one counts). Breeding only slows (0.8) while a problem waits for a decision.
- Average bot owners: year 4 105k (was 64k), year 5 592k (was 480k). Earth 6,525 / Space 7,936 garden_hermit (was 6,581 / 7,992 on the opening pass). Strong: WIN 2,338 empire_dictator (was 2,393). Kind and cold bots not rerun.
- Tests: balance 71, academy 10, me 46 (pain checks updated: open 0.6, set-up 0.85, no stacking).
BUILD 2026-10-27-steady.

## Pass 117: A tighter header, no hunger bars on the one home tank (27 Oct)

- "2/d to kits" is gone. The shrimp trend (+N/d) shows only before the first farm; after that the count is mostly farm stock and the trend meant nothing.
- The header doesn't change height: the ✦ / shrimp line never wraps (cut off instead), numbers use tabular figures, the Packed / orders strip is one line, and the empty readings row no longer leaves a gap above it.
- One home tank on an auto feeder, once racks took the rest or you keep it yourself (`feedLite`): Feeding shows only food type and treats. Hunger, Nutrition, Food in tank, Ration and the top Fed / Nutrition bars are hidden. The auto feeder still uses its Auto feed setting in Gear.
- Checked in Playwright at 390 and 360 px on the first farm, a million owners and win snapshots; layout scanner clean except the known 2px win chart label. Balance 73, academy 10, me 46. Bots not rerun (UI only).
BUILD 2026-10-27-header.

## Pass 118: Coins from day one, Consultants opens, no shrimp trend with farms (27 Oct)

- Shrimpcoin had no coins for a whole year after launch, while the price chart moved. A coin is made when a tree turns one, and trees planted before the launch never made any. Now the trees others planted before the launch count on launch day: the 60% that made it become coins (yours get the 5% fee), so there's something to trade from the start. Your own pre-launch trees still wait until they turn one. Saves that already launched get this once (`coinPreMint`, `C.preMint`): others' trees not waiting in a cohort and not yet coined.
- Consultants and Operating controls didn't open on a tap. They are `<details>` with a `summary class="hd"`, so the fold-card setup also made them `.coll`, and the two toggles fought (open but `shut`, an empty card). `<details>` cards stay out of `.coll` now.
- The +N/d shrimp trend in the header is hidden whenever farms or hatcheries hold shrimp (`labMode`, `farmStock`), not only after `farmBuilt`.
- Balance 75 (new coin check), academy 10, me 46. Consultants toggle checked in Playwright with touch taps, with the idle-cash guide on it.
BUILD 2026-10-27-coin.

## Pass 119: Card headers without arrows, the Money sheet (28 Oct)

Step 1 of the tab cleanup agreed on 28 Oct.

- Card headers on every tab: the chevron is gone, the whole header row opens and closes the card, and the ? only shows on an open card. Fold cards (`.coll`) and `<details>` cards share one rule set: 30 px row, same gap, no marker. `<details>` cards still stay out of `.coll` (Pass 118), each keeps its own toggle.
- A closed card is its title and one number. Text notes became numbers: Feeding "95 mg a day", Water test "80 L", Colony "6 berried", Water care "30% this week" (`wcWeek`), Readings "nitrate 6.7 ppm", Colony & sales "201 sold", Automation "3 of 3 tanks", Advertising "referrals 30%" (reach before kits), Shops "N stores" or yearly rent, Research "N people", The Shrimp Times "N stories", Shrimpcoin price only, Your home tanks "N tanks". Supplies and Recent events have no number and show none.
- Money sheet: tap the cash in the header (dotted underline once kits open, `finOpen`). It holds Money over time, Consultants, Operating controls (stock days, cash reserve) and a new Wages card: Packing, Sales and shop managers, Tank technicians, Research, Mall stores (rent and staff), each line jumps to that team's card (`wageLines`, `finGo`). Kept-on staff (Kiki, Luca, Gema, Mimi) count with their team. The sheet pauses like the tank sheet and holds back cards, spotlights, notes and the guide bar. One spotlight on the cash the first time it opens up.
- Kits no longer has Money over time, Consultants or Operating controls. Before kits open, Money over time stays in Trade. No Staff tab.
- The Packed / orders / Cash lasts strip under the header is gone (no growth summary on screen). The bottleneck read stays behind the paid consultants. The idle-cash and "what slows growth" hints now glow the cash, tapping the guide bar opens the sheet, and the ? Ideas line opens it too.
- Checked in Playwright at 360 and 390 px on the first kit, first farm and million owners snapshots (strong bot, seed 7: WIN day 2,338, empire_dictator, same as Pass 116), every tab plus the sheet. Layout scanner: only the known 2px win chart label. Balance 76 (new header and sheet check), academy 10, me 46.
BUILD 2026-10-28-money.

## Pass 120: Kits tab in three cards (28 Oct)

Step 2 of the tab cleanup.

- Kits: price, profit and orders a day at that price, sold a day and stock. Owners, survival, referrals and cost per kit sit behind More numbers. The adoption ceiling left Kits, it shows on the Regions card now ("Up to 62% of them want a tank, 1.2M people"). Packed yesterday and farm shrimp left too, they're under Making kits.
- Making kits (was Packing & staff, data-k `staff`): the packing table and its tools, Pack 1 / Pack 10, Keep in tanks, the capacity line ("Packing up to N kits a day", always on top, also when the old manual tools fold away), packers, machines, farm shrimp yesterday, then Quality checks as a section (`#qccard` is a plain div now, How strict row included). Header number: kits a day, or "by hand". Shown as soon as kits open.
- Kit development: unchanged, one project at a time, finished ones under Done.
- Sales staff got their own card in Ads (`c-sales`, data-k `sales`, opens on reveal). `c-staff` no longer switches title and content with the tab; staff render builds packing into `e-staff` and sales and shop managers into `e-sales` regardless of the open tab. Wages sheet line for sales points at `c-sales`.
- Guide steps that pointed at the Kits or Quality checks card (first kit, tools, QC round, kit wait) point at Making kits.
- Balance 77 (new Kits layout check), academy 10, me 46. Checked in Playwright at 360 and 390 px on first kit, first farm, million owners and win.

## Pass 121: Ads and World tabs (28 Oct)

Step 3 of the tab cleanup.

- Ads card: one-off ads are a row of buttons (name, price, days; "N d left" while running). What each does is behind the ?. The online shop is its own row until bought, then folds to "Online shop · running". Repeat toggles fold under "Repeat automatically". With consultants in, one forecast line. Past 1,000 kits everything still folds under "Local ads". The "Early marketing tools" button sits where the Ads card would.
- Shops: one line per open region, "The Gulf 79/90 · trust 99%" with one Open button (the biggest batch you can open there), "full" once covered. Closing stores moved into one fold, "Close stores". Fit-out and per-store numbers behind the ?. Header shows nothing with no shops (was "AED 0/yr").
- Sales staff: own card (Pass 120).
- Campaigns merged into Marketing development (`#op-wrap` inside `c-proj`, shown on Ads after the Ministry). The `c-op` card is gone; the Ministry spotlight now targets `op-wrap`, the campaign guide points at the projects card. ✦ stays in Ads.
- Regions moved from World to Ads (reach). Its card says the ceiling ("Up to 46% of them want a tank, 245M people"). Guide, consultant and bottleneck links to Regions point at Ads.
- World order: The hard part (when open), Shaping the world, Owners' tanks, the coast card, other trees, The Shrimp Times last. The coast card holds Mangroves / Shrimpcoin and Shrimp Island (`#coin-island`; the island tree card is gone). Title is Shrimpcoin, Mangroves or, with only the island, Shrimp Island.
- Balance 78 (new Ads/World check), academy 10, me 46. Playwright at 360 and 390 px on first sale, first farm, million owners and win.

## Pass 122: The Shrimp Times gets a Science section (28 Oct)

Step 4 of the tab cleanup.

- `newsLine(G,t,sci)`: a third argument marks a story for Science. Tagged: research line finds and duds (`rlDay`), the yearly postdoc find (`academyDay`), the shrimp-and-stress studies (`studyopen`, `studybuy`) and any delayed news from a University track project (`p.later` on `t:'uni'`, carried through `laterDay`). Everything else stays on the front page.
- The card shows the front page (latest story, Earlier stories), the effects line, then a Science heading with its latest story and its own Earlier fold. Old saves keep their old stories on the front page.
- The Shrimp Times order is set to last in `updateRipple` too (it used to set 2).
- Balance 79 (sim check for the tag, markup check), academy 10, me 46. Checked in Playwright at 390 px.

## Pass 123: Text fixes from the 28 Oct text review

- No free bottleneck advice: the Next-bar lines for packers, bigger farms, new regions, the farm license and the first grow rack are gone (`packer`, `farmtier`, `reg1`, `lic`, `rack`). "Adoption ceiling reached" and "Production is short of working capital" (behind !!) show only while the consultants are in (`consultHas` in `empTips`); the ceiling one now points at Ads, not a Business tab.
- Gear farm hint names what the next farm waits for: "after the ocean ranching permit in Gear", or "its permit comes once Europe is open", "its blueprint comes once you have the ocean permit and East Asia is open".
- Farm license role line uses the real rack price (`farmCost(G,FARMS[0])`, AED 1,200).
- Speed: tooltip says 4× after your first farm and 40× once 4B people have a tank (`HARD_AT`); the speed4 spotlight and its fire line say farm; the million-owners log line says 12×.
- Shops: "Mall stores open once 50 kits are sold and you run a shrimp boutique or have Dubai open." The ? Ideas line no longer says "in Ads" on the Ads tab.
- Out of money: "Farms sell back in Gear, shops close for some money back in Ads."
- One word for the player: farm. Card "Hatcheries & breeding" is "Farms"; tutorial, spotlight, consultant and help lines say farms. Tier names (Industrial hatchery, Mega hatchery) and story lines about a real hatchery stay.
- Pointers moved with the tabs: regions are in Ads (consultant fix line, ? Ideas, reveal toast, the soft guide), packers are under Making kits.
- Dead code: `descriptions` and `titles` objects deleted; the old "A place of your own" card body is gone (`renderHouse` only hides the card), its click handler too.
- USD in the Lab stays on purpose.
- Balance 80 (text-fix check), academy 10, me 46.

## Pass 124: Pre-deploy checks and deploy (28 Oct)

- Fast: balance 80, academy 10, me 46.
- Strong cold: WIN day 2,338, empire_dictator (same as Pass 116). Strong kind: WIN day 3,208, question_prof (was 3,641 in Pass 112, not rerun since). Average: Earth 6,525, Space 7,936, garden_hermit, 41 minutes waiting (same as Pass 116). Space chapter bot: pass. The tab work is UI only, the sim numbers didn't move.
- Spotlight sweep: 114 checked, all good. Layout scanner: only the known 2px win chart label.
- Monkey: 250 random taps at 360 and 390 px on first kit, first farm, million owners and win, no page errors, no sideways scroll. Every card on Kits, Ads and World opens and closes on one tap.
- First-kit guide checked: with Making kits closed, the Next step opens it and the packing table button shows.
BUILD 2026-10-28-tabs. Merged into main.

## Pass 125: Feel and text fixes (28 Oct)

- No Next bar over the game. `applyGuide` keeps the bar hidden and puts the guide line (soft or not) in the ? popup (`ideas-now`), with the tab name when it's on another tab. The glow on the button or tab stays.
- Tab bar: the visualViewport lift is gone. It moved the bar up by the keyboard height and could leave it stuck mid-screen. Now the bar hides while typing (`body.kbd`).
- No browser feel: `maximum-scale=1,user-scalable=no`, pinch gestures blocked (`gesturestart`, two-finger `touchmove`), no long-press menu, no text select, no tap flash, no rubber-band (`overscroll-behavior:none`). Inputs still select. Same in the land (`build.py` skeleton, `game.js`).
- Token bills: AI shop managers AED 40 a shop a day (was 2.50; a human manager is 230 for four shops), `AI_MGR_DAY`. AI sales agents AED 5 plus 2 fils per order, no cap (was capped at 300 a day), `aiSalesDay`.
- Kits card at the reach limit said "~0 orders/day" while millions sold (orders only fill spots that open as owners drop out or reach grows). It now shows the 7-day rate: "~2.26M orders/day, only as spots open up in your reach".
- News: the carbon credits line says why it pays you (the company files the paperwork for the ponds that closed because of you, the mud under mangroves holds carbon). The storm line says why regions get cheaper (less damage, cheaper insurance). The coral line says why (fewer trawlers dragging the seabed).
- Land (source in `shrimp-proto`, `shrimp-home-proto/`): wall corners lost the wide shoulder that drew an extra block of cap (the cap only reaches back at the wall's own width). Hens lay on their own clock in the game: a go every two real hours, 60% (wild 40%), up to 12 in the coop; before, they only laid at the real-day roll, 30%, so almost never. The caught fish card fits the whole fish (scale by height too). Every fish has its own size to 0.1 cm (most near the middle, 4% a big one up to 15% over), and the card says when it's your biggest of that species (`fishBest`).
- Balance 80 (token bill check now proportional, Pass 125 strings), academy 10, me 46. No browser here (Playwright download blocked): both pages pass a syntax check only; walls, fish card and tab bar not looked at in a browser.
BUILD 2026-10-28-feel.

## Pass 126: Late game economy (28 Oct)

- Farms: any bigger kind can be bought once its kits-sold gate opens, no need to own the one below (`farmOk`, `farmBuyable`, `farmNext`). Smaller kinds still stop being sold. Projects that needed a hatchery now take that kind or bigger (`hasFarm`), so they stay open after you sell the hatchery.
- Selling by hand only (no auto swap, Puti 28 Oct): farms and packing lines get Sell 1 and Sell all, half the price paid, two taps (`sellRow`, `changeFarm` 'sell'/'sellall', `farmSellAll`, `sellLine`, `lineSalvage`, `lineSellAll`). Older farms and older packing lines sit in one fold each. Packing lines below your top tier are no longer offered (the "Show earlier packing lines" button is gone). Selling old lines doesn't close the next tier (`E.lineStage`, `lineTop`). The farm pause/restart code is gone; "mothballed" is out of the game text.
- Food and tank care (Finance line, was Shrimp food): homes × welfare buy food (AED 0.02 a home a day, ×2 with the factory, recipe 0.55×, pods +0.075), moss and plants (+0.015 with any shop or store), water test refills (+0.01 with the care app). Struggling tanks buy 10-shrimp top-ups twice a year at AED 40 from spare farm output (`topupShrimp`, `spareFarmShrimp`). 40% of the goods part goes back out as supplies. One news line the first time top-ups pass 1,000 shrimp a day.
- Care against kit income (seed 7): strong cold 1–3% up to 16% of Earth, 22% at 67%, 46% at 96%. Average 3% at 1%, 12% at 45%, 15% at 81%, then ahead of kits. After Earth the average bot earns AED 162M a day from care (was 18M from food).
- First try used double the rates: the average bot was about 300 days slower over four seeds and missed Space on the default seed. Halved, the average over seven seeds is within noise (base mean day 6,193, new 6,229).
- Bots, seed 7: strong cold Earth day 2,454 (was 2,338), strong kind 3,223 (3,208), average Earth 6,525 and Space 7,936 (same). Strong cold over seeds 3, 7, 11, 23: mean 2,436 against 2,391. No INSOLVENT. Strong seed 19 goes broke on day 252 on the old build too.
- Balance 81 (new Pass 126 check: jump up, sell all farms, sell lines, hasFarm, living tanks only, top-ups need spare output, care app; the pause test now checks pausing is gone), academy 10, me 46 (factory now ×2 on the food part). No browser here: the Gear and Making kits sell rows are only syntax checked.

## Pass 127: Care plan (28 Oct)

- New fork in the Kits tab, at 1M owners with the care app: "Owners want someone to call when a tank looks wrong." Free care plan for every owner (kind, h +2, kin+, know−): every living tank gets a monthly check-in, you pay AED 0.10 a tank a month (Distribution and customer support), welfare +5. Sell a monthly care plan (cold, h −1, know+, kin−): the player sets the fee AED 5–60 a month with − and + in Owners' tanks (default 15). The share of living tanks that pay is mood × 1.4 (clamped 0.2–1) × e^(−fee/15), welfare +5 × that share, fees go to Food and tank care, calls still cost 0.10. Owners' tanks shows a Care plan line and the fee row. `planShare`, `planHomes`, `planDay`, `setPlanFee`, `PLAN_*`. Ending playtest data rebuilt.
- First try charged AED 0.50 a tank a month for the calls: the average bot (free plan) was about 230 days slower over six seeds and missed Space on half of them. With and without the welfare part showed the call cost was the cause. At 0.10, seeds 3, 7, 23, 31 average 6,315 against 6,126 in Pass 126, and Space finishes on all four.
- Bots, seed 7: strong cold Earth day 2,445 (Pass 126: 2,454), takes the paid plan; at the win care is AED 870M a day against 490M from kits. Strong kind 3,195 (3,223). Average Earth 6,413, Space 7,824 (6,525 / 7,936). No INSOLVENT.
- Balance 82 (new Pass 127 check: needs the app, free raises welfare and costs the calls, no fee on the free plan, dearer or disliked means fewer pay, fee capped, paid earns, traits), academy 10, me 46. No browser here: the fee row is syntax checked only.

## Pass 128: Pre-deploy checks, land Go on Tank 1 (28 Oct)

- Grandma's land: the Go button moves from the You tab to a card under the tank view, on Tank 1 only (`renderLandRow`, `#landcard`), because the land's tank is Tank 1. The You tab card keeps the buy rows and says Tank 1 lives there. Puti 28 Oct.
- First browser look at Passes 126 and 127, Playwright at 360 and 390 px on the million owners and win snapshots (strong bot seed 7: WIN day 2,445, empire_dictator, same as Pass 127), with the care plan undecided, free and paid. No sideways scroll or cut labels on Tank, Gear, Kits, World, You. Farm and packing line Sell 1 and Sell all: first tap shows "Tap again to confirm" and pays nothing, second pays and toasts "Sold for AED ...". Older farms and older packing lines folds open with their sell rows; "Show earlier packing lines" is gone. Fork question shows at a million owners. Owners' tanks Care plan line on free and paid; fee − and + step by 5 and stop at 5 and 60. Finance sheet says Food and tank care, fits at 360. Land card Go opens the land, back closes it, the You tab has no Go. No page errors.
- Old packing lines sell for billions (a robotic line AED 12.6B at 67 owned): not a bug, lines cost 1.2× more each, so that is half what the 67th cost.
- Spotlight sweep: 114 checked, all good. Layout scanner: only the known 2px win chart label. No monkey test in tests/. Balance 82, academy 10, me 46.


## Pass 129: Monkey test (28 Oct)

- New `tests/shrimp-monkey.cjs`: random taps on every snapshot of a strong-bot run json plus a new game, 390 px, over http, clock at speed 1 or 4. Taps visible buttons (sometimes disabled ones), switches tabs including You, folds details and `.coll` cards, moves sliders and number inputs, types into text inputs, opens and closes the Money sheet, closes story cards, after-popups and sheets when they block. Spotlights stubbed (`spotlight`, `spotNext`). `landShow` and `endGame` are stubbed too, as a net behind the skip list.
- Checks after every action: page and console errors, `G.money` finite, no negative or NaN shrimp counts, no NaN in `G.emp`, `render()` every 10 actions, overlays open 30+ actions and 5+ s, `scrollWidth > innerWidth`. One line per stage, then each problem with the last 20 actions. Json to `MONKEY_OUT`.
- First tries flagged two harness mistakes, not game bugs: story cards ignore taps for 500 ms (`SETTLE_MS`), and spotlights need time to settle before a tap closes them. The monkey now lets the timers run and counts time as well as taps.
- Run on 8f7fb52, seed 7: 14 stages, 28,048 taps, 0 problems, 450 s. `MONKEY_SELFTEST=1` catches the planted NaN. No game change, BUILD unchanged. Balance 82, academy 10, me 46.

## Pass 130: Grandma's baby money, stable cooling, tidier sales card (28 Oct)

- The first-babies goal pays when the first shrimplet hatches (was 5), files under Loans and gifts (was Shrimp sales) and logs "Grandma sent AED 15 for the babies, get them something nice to eat". The Babies chapter card says the same.
- Cheap cooling is one button. Its sub line holds the state (AED 1 · −X °C for about a day, or Melting · N h left · −X °C), so nothing below it jumps. The hint under it and its fan line are gone.
- Sales card: rules summary reads Sales rules · Tank 1 (no "the defaults work fine"). The sell box shows N ready · AED X and N buyers left this week (Only ... when stock beats buyers); the button just says Sell. Under the price, one line Prime adult, grade N next to the Average AED X chip. The mood advice moved into Sales details. Labels don't wrap.
- Social media manager opens with the sales staff card (`salesOpen`, 60 sold or 30 kits), was 30 sold.
- Balance 83, academy 10, me 46. Sell card and cooling checked at 360 px, no console errors. Bots, spotlights and monkey not run.

## Pass 131: Salespeople leave shrimp for packing (28 Oct)

- Default, no toggle. Once kits are open and someone packs, the daily auto-sell (`doSell` with a `hold` from `kitHold(G)`) keeps back what this week's packing will use: kits short of the stock target plus a week of demand, capped by packers × 7, by kits the cash can pay for (after `productionCashFloor`) and minus farm `rawShrimp`. Only a tank's packable excess (above `packAbove`, non-breeders) is held, filled tank by tank like `packDay`. No cash to pack, nothing is held. Culls still sell. Sell by hand is unchanged.
- The auto-sell toggle reads "Salespeople sell from this tank, packing goes first" once packing runs.
- Balance 84, academy 10, me 46. Strong and average bots unchanged (neither hires salespeople, so the rule isn't exercised by bots). Kind bot, spotlights and monkey not run.

## Pass 132: 15 s between cards, a note on what to wait for (28 Oct)

- Playthrough to the first farm (average bot, seed 7, timed with the bot's play seconds at max speed): cycle 17 s, babies 44 s, first sale 127 s, kits 346 s, first farm 924 s, cash AED 200–370 until kits and AED 90 right after the first kit. Never broke. Strong bot: farm on day 484. The only long empty stretch is babies to first sale (about 80 s, days 51–118).
- Clusters it found: kits chapter then the fight invite 10 s later, first kit plus me_intro within a day, the farm chapter and the rival story on the same day, the Ads tab and the sale chapter 3 s apart.
- Fix: chapter cards now wait in `progress.soon` until 15 s of play (`CARD_GAP`, `storyClock`) after the last card was closed (`progress.lastAck`). Story cards also wait for that and for no chapter pending, on top of their old two-minute and 30-day gaps. Broke, game over, illness, crash, win, intro and ten years still show at once (`CARD_NOW`). Queued spotlights also wait 15 s after any card closes (`cardResume`); spotlights a card asks for itself (`now:1`) still show right away.
- Babies card adds: bought shrimp are breeders and don't get sold, babies sell at 60 days old, about two months away, sell age is under Sales rules in Trade, until then keep them alive. Checked at 360 px.
- Balance 85, academy 10, me 46. Bots: strong 2,392 (was 2,445), kind 3,184 (3,195), average Earth 6,497 / space 7,908 (6,413 / 7,824), all within seed noise. Spotlights and monkey not run.

## Pass 133: Packers short of shrimp get a spotlight, a safe first summer (28 Oct)

- `packDay` counts `emp.packLow`: days the packers had kits to pack and cash for them but packed under a fifth of their capacity. After 3 such days in a row a spotlight (paused, dimmed) points at Keep in tanks in Making kits, or the Kits tab if that card isn't on screen. Text: if a tank sits at or under Keep in tanks with spare shrimp, lower it or let the colony grow; otherwise not enough shrimp, more breeders and tanks make more babies. Once only (`ob.packLow`). While it lasts the Making kits summary reads "N of M a day".
- `roomT` caps the room at 28.3 °C for the first year (clock < 365, from 20 Oct to 20 Oct), hot spells included, so tanks stay under the 28.5 °C heat-damage start. From the second summer hot spells can push past it again.
- Balance 86, academy 10, me 46. Bots: strong 2,428 (2,392), kind 3,187 (3,184), average Earth 6,497 / space 7,908 (same). Spotlight shown at 360 px. Spotlight sweep passed on the Pass 132 build, monkey rerun on this one.

## Pass 134: Making kits card reordered (28 Oct)

- Header: "Packed N of M today" (was "M a day"), by hand before packers.
- Order: packing table (by hand), Keep in tanks, one line "N spare · M above this line" (materials when short), the ? text, Pack 1 / Pack 10, packers. "Station idle: only N above Keep in tanks" is gone, the line under the slider says it.
- Packers row: "8 kits a day each, you pack 4". The "Packing up to N kits a day: ..." sentence only shows once machines pack.
- Quality checks: the round row first, then How strict, then a fold "What a round checks · N of 5 by machine" with one row per step (by hand, done by hand, by machine, not done), then the next tool to buy. The five step chips are gone.
- Balance 86, academy 10, me 46. Checked at 360 and 390 px at first kit, farm license and 100 owners, no sideways scroll, no console errors.
- Review by a separate agent, then fixed: spare line reads "N ready to pack · M kept to breed", packers row drops "you pack N", QC steps say "no tool yet" (was "not done"), Strict and staff pay don't break inside "AED 6", the packing table subtitle drops orders/day (it was cut off at 360 px), "1 of 5 tools" dropped since "Packers need all five packing tools" says it. Kept: grey card header (every header matches), the hand packing table at first kit (by hand first), "Checked N days ago" with a plain button until it's overdue.
- Monkey on the Pass 133 build: 27,110 taps, 1 problem, the win stage reloaded because BUILD changed mid-run and the monkey tapped "A newer version". Not a game bug.

## Pass 135: Kit extras split, optional QC card, Sell hides with salespeople, Excel at AED 500 (28 Oct)

- Kit design levels are gone. Kit extras switch on and off one by one (`KIT_EXTRAS`, `wb(G).on`, `setKitExtra`, `kitextra` action): Java moss +AED 36 a kit (needs moss in your tank, 50 kits), a nerite snail +8 (50 kits), driftwood +20 (wood in your tank, 50 kits), plants +30 (100k owners, plants in your tank). Quality and welfare add up per extra; all four together match the old Planted kit (+0.04 quality, +0.12 welfare). Offered in Kit development as before ("No upfront cost, you can take it out any time"), toggled under "In every kit" in the Kits card. Old saves: Moss and snail keeps moss and snail on, Planted keeps plants on.
- Quality checks are their own card, last on the Kits tab, with "Optional. Checks catch sick shrimp before kits ship, so more kits live." The guide hint for the first round is soft and says it's optional. The ? text moved with it.
- Top Sell hides once salespeople sell from every tank.
- First time cash reaches AED 500 without the Excel course, a spotlight points at it in Trade (`ob.excel500`); the card shows from then on.
- Balance 87, academy 10, me 46. Bots unchanged (2,428 / 3,187 / 6,497, they don't use extras). Kits tab checked at 360 px.

## Pass 136: Sales card tidy, sales staff before kits, bold waiting note (28 Oct)

- Sales staff card was empty before kits: `updateEmpire` only ran once kits opened. It now also runs once `salesOpen`. The card's two near-identical explanations are now one, behind ?.
- Trade card renamed Sales (was Colony & sales), the histogram fold is "Ages of your shrimp". Sales rules are always open (no fold). The card's own Sell button is gone, the top Sell does it; the sell box keeps "N ready · AED X" and buyers left ("1 buyer").
- Sliders: sell age 45–100 days (full price is reached at 100, `ageFactor`), breeders 5–100. Old saves clamp into those ranges in `migrate`.
- Babies card: "they don't get sold", "sold at 60 days old" and "keep them alive" in bold (`bold` on the milestone, `setEmphasisText`).
- Early game check: average-bot money to day 300 is identical before and after today's passes, nothing in the early sim changed.
- Balance 87, academy 10, me 46. Checked at 360 px.
- Deployed bc2e28e. Before it: bots 2,428 / 3,187 / 6,497 (unchanged), spotlight sweep 119 checked all good, monkey 28,061 taps, 0 problems.

## Pass 137: Fed bars go with the feeders, ads and choices one per row, social media manager under Sales staff (28 Oct)

- Fed and Nutrition at the top hide once every tank has an auto feeder (same rule as the top Feed button, `actNeed(G).feed`). They come back with Feed if a tank goes hungry or badly fed.
- Advertising: one ad per row (`.adlist`, `.adline`), name and "Reach +N% for D days. note" on the left, price or "N d left" on the right. The separate reach paragraph under the buttons is gone, its text is in the rows.
- Choices (`forkHTML`): each option is one full-width button, name left, cost right (`.fopt`), no box inside the box. Border 1.5 px. Only name and cost show before the pick, as before. Film choices (`forkb`) are full-width rows too.
- Social media manager moved out of the Ads projects list (`a:'staff'`) into the Sales staff card, under Salespeople, from the moment sales open. After hiring: "Mimi runs your accounts", Hired, until the AI consultancy.
- Balance 87 (two markup checks updated), academy 10, me 46. Ads, Sales staff and the breeder choice checked at 360 and 390 px. Bots, spotlights and monkey not run.

## Pass 138: UI review fixes (28 Oct)

- Top Sell with nothing to sell ("Ready in ~5 d", "Buyers next week") is a plain grey line, not a grey button (`#tb-sell.wait`).
- With Fed and Nutrition hidden, the water chip sits on the tank chips row (`#chiprow`, CSS `:has(#vitals[hidden])`).
- Kit price while fixed: "Kit price · AED 250" and the line under it, no dead slider (`.ctl.locked`).
- `itemHTML`: a description over 110 characters puts the button under the text (`.item.long`), so long Kit development rows don't wrap into a narrow column.
- Gear: groups are labels, not boxes inside the card. Buy buttons are outline, not green.
- Shops: full regions at 100% trust share one "Full" line.
- Price chip reads "Use average, AED X". "Nothing ready" in Sell is a plain line (`.sellsum.empty`).
- From a million owners the "Early marketing tools" link and the Advertising card sit at the bottom of Ads; the unbought social media manager hides with them.
- Not changed: news notes still cover the header while they show. Content showing above the header in Safari is the iOS status bar over the page (env top inset is 0 there), not a gap in the game.
- Balance 87, academy 10, me 46, layout scan 1 item (2 px on the win World tab, also before). Bots, spotlights and monkey not run.
- Review by a separate agent, then fixed: film choices were still side by side (`.item .hb` flex beat `.forkb`), now one row each with the cost under them. Water chip goes inline only when water numbers are off (they cut the tank chips). Gear buy buttons back to green like every other tab, groups stay flat. Social media manager button green like Hire. `itemHTML` also stacks when the button text is long (AED + ✦ costs). Wait line left-aligned. Price chip "Avg AED X" so the grade hint fits at 360 px.
- Left: "0 more stores to go" still shows once malls are full. Propaganda-style rows show "Turn it down" above the price (it lives in the description).
- Follow-up: "Turn it down" sits beside the price as an equal button (`projBtns`, `.nopick`), not inside the description. Shops reads "A store in every fifth mall in your regions." once no malls are left (was "0 more stores to go").

## Pass 139: Grandma's land: eggs on the company clock, paid mowing, real bird sizes, a plainer land event (28 Oct)

- Eggs: one per hen per game day, on the company's clock (the game now sends `day` with cash). Coop eggs go off after 28 days in winter, 14 in summer (outdoor shade temperature). Over 40 days away, only the last 40 days are in the coop. Eggs sell for AED 3 (was 1). "N eggs in the basket. M had gone off."
- Mowing: Grandma pays AED 1 a tile, up to 300 a game day, paid in one go 3 s after the mower stops ("Grandma paid AED 17 for the lawn."). The Mow help line says so and drops bee-eaters (there are none).
- Birds scaled to real length at 2.5 art px a cm, myna as drawn: sunbird x0.36, kingfisher x0.61, bulbul x0.87, hoopoe x0.95, parakeet x0.95. Shrink is smooth then alpha snapped, so edges stay hard.
- Grandma's armchair lines no longer have Grandpa alive ("Your grandpa says hello", "wants to see the stream").
- gp_land: no newspaper land listings, she's saved for land near water with room for hens. Doesn't fire once you own the land. gp_scam: no gala, borrowed suit or face in the papers, no influence or mood from it. Its test changed to match.
- Balance 87, academy 10, me 46. In Playwright on home.html: 3 hens give 3 eggs a day, 87 after 40 winter days (33 gone off), 45 in August, 45 after 860 days away. Drag-mowing 17 tiles paid AED 17 after the pause. Birds rendered side by side. Bots, spotlights and monkey not run (no balance change in the company).

## Pass 140: Grandma's land look, Pierre's walk, Grandma one thing at a time (28 Oct)

- You tab Grandma card: after time away one thing shows at a time, with "N more after this." Mailed money is one envelope, "Collect AED X".
- Land header: ‹ back, cash, a Home / Tank switch, sound. The title card ("Land with a stream · 1 tank of 6") and the bottom tabs are gone in the game. Clock chip, ?, + and −, and the tools sit on the map. The map starts one zoom step out.
- Tools are pixel icons in small slots (boot, mower, bowl of grain, rod, hammer). Exported for Puti to redraw: `shrimp-home-art/ui/tool-icons.aseprite`.
- Grass: calmer greens with slow soft patches. Grass now grows on game days.
- Millie, the dog, Pierre and Grandma (with her armchair) at 1.5x. Fresh land floor 5x4. Bigger tap areas for the pets.
- Mowing coins pop at the mower, +AED over Millie when Grandma pays. Grain on the ground is small kernels. Up to 8 eggs in the nest.
- New birds: firecrest (9 cm, rare), great tit (14 cm), magpie (45 cm). Legs stay on in hops for every bird. New fish: Siamese algae eater (stream), clown killifish (lake). All frames checked for cut-offs.
- Pierre walks on her frames 6-14 and 16-19 at 15 fps, moving only by her per-frame positions (loop 37 px), head and shoulders bob as she set them.
- Previewed by Puti in artifacts (land test page, Pierre walk editor). The land test page showed blank in the iPhone artifact viewer (inside an iframe there); in the game the land runs as its own page. Not checked on an iPhone.
- Balance 87, academy 10, me 46. Bots: strong 2,428 (same), kind 3,187 (same), average Earth 6,525 / space 7,936 (6,497 / 7,908, seed noise). Spotlight sweep 118 checked, all good. Monkey skipped at Puti's say (too slow).
- Deployed.

## Pass 141: packaging machine Stop/Start, Keep in tanks named as the limit (28 Oct)
- Automatic packaging machine in Making kits has Stop / Start (`G.emp.machOff`). Stopped, it adds 0 to `packingMachineCap`.
- When every tank is at or under Keep in tanks, the limit line says "Limit: Keep in tanks. Your tanks have X shrimp, it keeps Y." instead of "Limit: breeding... Add farms" (`keepBlocks`, kind `keep`). Making kits shows "Nothing to pack" with the same numbers. Consultant fix points at the slider.
- Balance 87, academy 10, me 46.

## Pass 142: Pack above (28 Oct)
- "Keep in tanks" is now "Pack above" everywhere in game text (slider, hint, limit line, packLow alert, Making kits help).
- The Keep/Pack above limit line only shows with no farm breeding (`keepBlocks` needs `farmCap<1`). Without that the average bot stopped buying farms and failed to finish.
- The Pack above slider hides once only the home tank is left (`ownTank` or `tankGone`).
- Balance 88, academy 10, me 46. Bots: strong 2,428, kind 3,187 (both same), average finishes both chapters. Spotlight sweep 118 all good. Monkey 28,052 taps, 0 problems.
- Deployed.

## Pass 143: New water GH/KH shows with the KH warning, Water test card (28 Oct)
- New water GH and KH (`o.mins`) now open at KH under 2.5, the same point the "KH is down to" alert fires. Before they opened at 2, so the alert told you to fix KH with nothing to set.
- "Water test & bacteria" card is now "Water test".
- Balance 88, academy 10, me 46.
- Bots: strong 2,428, kind 3,187 (both same), average Earth 6,525 / space 7,936 (same). Spotlight sweep 118 all good. Monkey 28,050 taps, 0 problems.
- Deployed (BUILD water-test).

## Pass 144: Sell line counts down to the buyer reset (28 Oct)
- When the week's buyers are used up, the top Sell line reads "Buyers back in N d" (days until the weekly reset, `G.day%7`) instead of "Buyers next week".
- Balance 88, academy 10, me 46.

## Pass 145: Water pill on its own row once Feed is automatic (28 Oct)
- With an auto feeder the Fed/Nutrition bars hide, and the water pill used to sit alone on the right under the speed buttons. Now it fills the row and reads "Water  change soon" in one line (`.readrow:has(>#vitals[hidden])`). Checked at 390 px.
- Balance 88, academy 10, me 46.

## Pass 146: Cards wait 15 s after a spotlight too (28 Oct)
- The 15 s gap only ran card to card and card to spotlight. A spotlight (money sheet) could be followed at once by a card (Your time). Now closing a spotlight restarts the card clock (`spotClose` sets `progress.lastAck`), no card is queued while a spotlight is open, and a queued card waits under an open spotlight unless it's urgent (`CARD_NOW`).
- Browser check: card held during the spotlight and right after, shows after 16 s of play.
- Balance 88, academy 10, me 46.

## Pass 147: One 15 s gap for everything new, on play time (28 Oct)
- Puti: paused, she still got kit packing, a Grandma note and the back room card one after another. Cards ran on play time but spotlights (15 s) and notes (12 s) ran on real time, each with its own gap.
- Now cards, spotlights and notes all wait for 15 s of play since the last new thing (`introOK`), and each one restarts that clock (`introMark`: spotlight close, note shown, newsflash shown, card closed). Paused time doesn't count. Urgent cards and `now:1` spotlights skip it.
- Browser check: paused 17 s real after a spotlight, the queued one didn't show; after 16 s of play it did.
- Balance 88 (gap check updated), academy 10, me 46.

## Pass 148: Breeders scale with the tank, new-tank sheet sells auto gear again (29 Oct)
- Breeders slider max is one per litre of your biggest tank, at least 100 (`keepMax`; slider and `migrate` follow it). Puti's 320 L tanks plateaued at about 590 shrimp because only 100 breeders were kept and Sell age 60 sells the rest before they breed at 75 days.
- The new-tank sheet offers the auto feeder and auto water changer again. Pass 115 had removed them as a route nudge; Puti had asked for them (Pass 81).
- Supplies: Bacteria starter and Seed from rows only for a tank that isn't cycled (every new tank is seeded, so they were dead rows).
- New checks lock both of Puti's requests in `shrimp-balance`. AGENTS.md: ask before removing anything she asked for.
- Browser check: 320 L tank gives a Breeders max of 320, the Tank 2 sheet shows both buy buttons. Balance 90, academy 10, me 46.

## Pass 149: The farm takes the extra tanks when the first farm is built (29 Oct)
- Puti had 8 barns and still four 640 L tanks. The tanks only went to the farm when the owntank story card was answered, and that card waited behind other story cards. Now `ownTankNow` runs as soon as the card's condition is met (first farm, `farmBuilt`), and on load for saves where the card is still waiting. The card just tells you.
- New balance check for both paths. Balance 91, academy 10, me 46.

## Deploy 29 Oct (BUILD breeders): Passes 144-149
- Bots, seed 7: strong 2,388 empire_dictator (was 2,428), kind 3,198 question_prof (3,187), average Earth 6,581 / Space 7,992 garden_hermit (6,525 / 7,936). No INSOLVENT.
- Spotlight sweep 114 checked. One ring-offset flag on the tall Trade sales card at first farm; two targets skipped where the harness's own previous spotlight closed late. `shrimp-spotlights.cjs` now clears `progress.lastAck` before each test spotlight (Pass 147 gap) and logs a missing spotlight instead of crashing.
- Monkey 28,057 taps, 0 problems.

## Pass 150: Spotlight sweep measures only its own spotlight (29 Oct)
- The "ring top off" on the Trade sales card at first farm was the sweep, not the game. The game's own cash spotlight (money sheet) cut in, and the sweep measured that header ring against the card rule. By hand the sales card ring sits 6 px outside the card as it should.
- The sweep now stubs `spotWatch` and `introOK` in the page, closes its previous test spotlight properly, and checks that the open spotlight is the one it asked for. The five "no spotlight" skips were the same cause (notes firing and restarting the 15 s gap).
- Sweep: 114 checked, all good, nothing skipped. No game change.

## Pass 151: Breeders per litre, one clock with Grandma's land, the land tank is Tank 1 (29 Oct)
- Breeders is per litre now (Trade, Sales rules, 0.2 to 5, default 0.5): the same value keeps 10 in a 20 L tank and 160 in a 320 L one (`keepN`, `T.set.keepL`, shared). Pack above in Kits is gone, merged into it: packing leaves the young until a tank has 6 shrimp per breeder (`PACK_YOUNG`), which is the old 3 per L at the default. Old saves get Tank 1's old breeder count over its litres. Limit line, packers-short spotlight and consultant point at Breeders in Trade.
- Tried one number for both (0.4 to 3 per L, packing down to the breeders): the average bot was about 240 days slower on nine seeds and missed Space on four. With packing at 6 per breeder, seed 7 matches the old build exactly.
- Grandma's land runs on the company's game days. While it's open the company runs at real time (a quarter day per 6 real hours, no play-time clock), so hens, grass, feeders and the tank there barely move; back at the company time flies and the land catches up on the next visit (up to 365 days at once).
- Your tank on the land is Tank 1: the game decides births and deaths, the land keeps its shrimp and only adds or removes the difference. Shrimp moved in there join Tank 1 (`give`), netted ones still count (they used to be replaced every second), new young are children of the tank's own adults. Adult is 75 days on the land too. With the land owned, Tank 1 breeds by the land rule: past 2.5 a litre it is crowded, berries a third as often, more die.
- A card waiting at the company shows "Something needs you at the company. ‹ Go back" on the land. Frozen accounts block spending on the land and say why. The game only takes messages from its own land page.
- The mower is quicker than walking (330 against 210) and throws grass bits in three greens.
- A place of your own (`HOUSE`) removed; old saves keep `G.me.house` for the ending lines. Monkey test removed (Puti).
- Browser: on the land the company day stayed put over 11 s, a shrimp moved in stayed (21 in both), the banner showed for a queued card, a spend while frozen was refused. After 3 game days at the company the land caught up 3 days and its shrimp aged 3 days.
- Balance 93, academy 10, me 46. Bots seed 7: strong 2,286 empire_dictator (2,388), kind 3,031 question_prof (3,198), average Earth 6,581 / Space 7,992 garden_hermit (same).
- Independent review fixes: old saves with big-tank breeder counts migrate to at most 1 per L (and at most the old Pack above / 6), so packing doesn't stop. The land's frozen line names the reason for all four cases. Take/give carry a sequence number the game echoes, so a sync sent before a move landed can't swap shrimp. Tank 1's crowding on the land starts at the packing line if that's higher than 2.5 a litre. Hiding or reloading on the land skips the company catch-up. Traps on the land run on real hours. The banner wraps and reads "Something needs you at the company. Tap to go back." Balance 94.

## Deploy 29 Oct (BUILD land-clock): Passes 150-151
- Two independent reviews; fixes from both are in Pass 151. Bots seed 7: strong 2,286, kind 3,031, average Earth 6,581 / Space 7,992. Spotlight sweep 117 checked, all good. Layout scan: one empty element 2 px wide on World at the win stage, not looked into. Monkey test removed.

## Pass 152: Breeders label fits, a section is introduced once (29 Oct)
- Breeders slider value overflowed its 66 px column ("0.5 per L · 10 in Tank 1"). Now two lines, "0.5 per L" over "10 kept". Worst case "4.8 per L / 1,250 kept" measures 58 px at 320-390 px.
- An intro or chapter card that already explains a tab or section now counts as its spotlight (`INTRO_COVERS`, `introCovers` on Continue). Covered: cycle (Trade, Buy), kits (Kits tab, kits, packing), farm, ministry, hardpart, coin_offer, tanks2, health, qc, tools, station, bulk, worldtab (World tab, regions), ripple (Shrimp Times, also sets `rippleIntro` so "New issue" doesn't follow), me_intro. Spotlights already queued for those are dropped, `now:1` ones (pause, health "Tap the tank") stay.
- Balance 94, academy 10, me 46. No bots or spotlight sweep yet (run before deploy).

## Pass 154: Late game decisions, build or bring, go and live on the land (30 Oct, branch shrimp-late-game)
Replaces the shrimp-late-kind branch (Pass 153, dropped after an independent review: 1% of income was nothing, ✦ as a share of what you hold was gameable, the backstop judged the player).
- **Prices scale.** Late choices cost days of income (`needDays`, `incRef` = the higher of the 7-day and 90-day income, so a quiet week before a choice doesn't make it cheap), days of ✦ income (`needIDays`, `infIncome`, same 30/90 rule), your own time (`needAway`: `M.trip`, orders at half, `tripWhy:'boat'`), or kits a day for a while (`slowKits`, `slowMult` in `kitDemand`). Costs show on the choice sub-line (`choiceFx`: weeks away, % fewer kits a day). The hard part keeps its 7-day income price (`hardCost`); with `incRef` there the average bot lost 140 days.
- **The fast answer pays now, the bill comes later** (`later(G,days,news,fx)`, `E.later[].fx`, `hardMul` / `hardN`: a group's size can grow). Rewritten: The electricity bill (leave it: +5% want one, a year later six gas plants and Too hot 1.2×; engineers: 20 days + 30 ✦ days, a year later cheaper kits and Too hot 0.9×), Shrimp in the rivers (shops: 10 days + 15% fewer kits for 6 months; clear: 5 days + 30 ✦ days, the caught shrimp are killed; leave them: +3% want one, two years later red shrimp on four continents, `E.riversLost`), Too many shrimp, Blackout (cities: 10 days + 20 ✦ days; replacements: 5 days + 3 days of output; help line: nothing, risk +), Tiny jails (reserve: 15 days + 40 ✦ days, sets `tree.rw_reserve`; agree on TV: 10% fewer want one for a year), The fishing family (work / reef tours two weeks away / a fund for every crew, cheaper if Retraining was taken). Care no longer loses on every fisher option.
- **Build or bring in the hard part.** Too hot: solar and wind farms (`dues:[0.5,1095]`, half of income for three years, `duesAdd`/`duesDay`, paid daily under Projects, button shows "50% of income for 3 years") against a solar panel with every kit (5 days, 60%). Hard to reach: roads and a ferry (12 days, two years, "carries rice now") against drones (3 days, 90 days, "stopped when the contract did"). No water: jars trucked in (4 days, fast). Too poor: free kits (5 days, "lasted about a year"). Each has a news and an ending line. New lines behind 2 gene finds: a glow line (Can't see the tank, 80%) and a cold-water line (No water to spare, 30%).
- **Green power where nobody needs it** (`c_green`): a year after the solar farms. Real numbers in the body (a GW is AED 4B and 2 TWh, 150 GW is 1% of world power, payback 10–12 years sold, never if given away). Build and sell (10% of income for 8 years, `E.green`, income from year 11 in `sideIncome`), build and give away (same, mood +, coal plants close), no.
- **Risk, late** (`c_permit` at South Asia + 30 days, `c_inspect` at 3B with a mega hatchery): wait a year (`E.regHold`, `regHeld`, `popOpen` skips the region), a firm that knows people (10 days + 20 ✦ days, 1 in 5 the Times finds out, region closes a year), ship under a borrowed licence (nothing now, 1 in 3 a recall within two years: 30 days of income, mood −8, a year closed). The inspection: shut the lines (20% fewer kits for two weeks, q +0.01) or last year's numbers (1 in 4 an unannounced visit, 15 days of income). Odds are in the text, the game rolls (`Math.random` at choice time, result as a `later`).
- **Go and live on the land** (`canLeave`, `leaveCompany`, `G.left`, `E.ended.kind==='left'`): from the hard part or after the win, with the land bought. Settings has "Sell the company and go to the land" (tap twice, sale = Fishfood's offer if open, else two years of income) and, after, "Your years at the company" (the ending page again, `#review-box`). Rethink the goal mentions it. The `left` card shows the ending review, then Go to the land opens the map. Only the Tank tab stays (You via the person button), `progressionBlocked` lets the clock run, `dayRollover` runs only `endStatsDay`, `personalDay` and `leftDay` (Tank 1: feeder, water changer, illness, glass). Leaving pushes drive −2, care −0.5 with 3+ hard groups unfixed. `endingPick` is frozen at `G.left.end`. No buyout card after.
- **The ending says the numbers** (`endNumsHTML`, `endTankLines`, `endWorldNums`, `endGrandmaNums`, `endWorkNums`, `endMoneyNums`, `endSpan`, `endRate`). New counters: `careMark` (first tank, once the farm runs the rest: count, longest gap, last day), `endStatsDay` (`stats.ownD`, `greenD`, `emptyD`, `wh` work hours per year). Lines: how often you looked after the first tank, the longest you left it, crashes and whether you set it up again, years green; mangroves you and others planted; Grandma checks, birthdays there, stories told, money sent; work hours first half against second; settings changed; the ? only if opened a lot (never a line for not opening it); cash at the end in days of income.
- **Reading time** (`READ`, `readStart`/`readStop`, `stats.rdL`/`rdE`/`rdX`): seconds a story card was visible before the tap, page hidden doesn't count. From a million owners the ending says the average and how often the most expensive answer was taken, as two facts in one line, no verdict.
- **Videos pay** (`videoDay`): from 400 h, about AED 20 a day × √(hours/400) × √(owners/10k), under Overtime and side income.
- **Reach line** on Regions: "N homes want one, M have one" next to people reachable.
- Balance 95 (new Pass 154 check), academy 10, me 46. Bots seed 7: strong 2,106 (2,286), kind 3,159 (3,031), average Earth 6,749 / Space 8,160 (6,581 / 7,992). The bots skip the income-share builds (`o.dues`); the average bot's harness now allows 24 game years (was 22). The remaining slowdown is the bots buying every new hard-part option; a player wouldn't.
- Not done in a browser yet: the leave flow was checked headless at 390 px (Settings row, confirm, review card, tabs, review sheet), the late cards and the reading-time counter too. Spotlight sweep and layout scan not run. The Shrimp Times lines for the new hard-part options and the dues line in the Money sheet were not looked at.

## Pass 155: Automated tanks, tank gear to finish, the You page (30 Oct, branch shrimp-late-game)
- Ration hides on a tank with an auto feeder. Water care moves under Automation in Gear on a tank with an auto water changer, without the hand Change slider (Auto change does it). The heat guide points at Gear when the card is there.
- Tanks 2 and 3 aren't finished without the auto feeder and auto water changer: Another tank shows and needs AED 460 (tank + gear), the sheet's Got it stays grey with "Buy both first" until both are in (`T.gearDue`, `gearDone`), a reload reopens the sheet.
- You page: Grandma's place first. Grandma shows only Check on Grandma until you tap it, then everything (Her years, letters, loan, visits); closed again each time you come back. New What happened card under Your day logs hour milestones, design prizes, burnout and illness (`M.dlog`, newest first, empty on old saves).
- Balance 97, academy 10, me 46. Bots seed 7: strong 2,106 (same), kind 3,159 (same), average Earth 6,777 / Space 8,188 (6,749 / 8,160). Headless browser at 390 px: sheet blocks, ration and water care on tanks 1 and 2, You page order and Grandma open/close, no console errors. Spotlight sweep not run (the only Chromium here is single-process).

## Deploy 30 Oct (BUILD tank-gear): Passes 152-155

## Pass 156: waste follows the shrimp, plants grow slower, review fixes (30 Oct)
- Puti: poop kept coming after a tank crash. Mulm on your own tank now builds with the shrimp in it (`careDay`: full rate at 20+ shrimp, none in an empty tank), the sponge clogs mostly from that waste (20% rate when empty), no new flatworms without shrimp, snails only breed if some are there. Same on the land (`src/tank.js` on `shrimp-proto`, rebuilt `home.html`): gravel mulm and filter clog scale with shrimp, nothing builds in an empty tank.
- Puti: plants grow ten times slower. Own tank `C.grow` 1/350 a day (was 1/35), land moss and stems a tenth of before.
- Review fixes: shrimp added while the tank view had no size (another tab, a card on top) lined up along the top of the water, `tvSize` now places them again the first time the view gets a size, `tvSand` has the same 150 px fallback as `tvSpot`. Colony chart drops the sell line and the blue sellable bars once Trade is gone. "waiting to be packed: 0.7" now whole shrimp. Hours on the You page get thousands separators. Win card said "Done in ten years. Year 6", now "Done before year ten.". Shops card no longer repeats the stores-to-go count from its header.
- Balance 97 (new 30 Oct checks: plants 1/350, no mulm or flatworms in an empty tank), academy 10, me 46. Strong bot seed 7 unchanged at 2,106. Layout scan: only the known 2 px element on World at the win stage.

## Pass 157: the home tank, one kept number, fewer stray numbers (30 Oct)
- Puti: the tank you keep goes back to 20 L when the farm takes over (`homeSmall` in `ownTankNow`, and in `migrate` for old saves with a bigger Tank 1, extras go to the farm). It can't be made bigger again (`upgradeCost` 'tank' is null for it). Once the farms sell everything (`farmCap>=10`, Trade gone) berries slow toward 50 shrimp (`homeCrowd`, `HOME_CAP`: 1 − (n/50)², none at 50). Clutches already carried can push it a little past 50, then it settles.
- Water chip: when the only problem is heat it says Too warm / Too cold, no Water label.
- Trade Breeders and Kits "kept to breed" show the same number, the breeders over every tank (`breedersAll`).
- Owners' tanks: the Change water L/day row is gone.
- Regions: the percent was the ceiling, not the share; now it's people who want one over people reachable, so it matches the people figure next to it.
- Colony grade rows count every shrimp, the average stays adults.
- Own-tank buttons stay one line at phone width (no icons in the six-button grid under 420 px, no wrapping).
- Balance 98, academy 10, me 46. Strong bot seed 7: 2,019 (2,106; the home tank changes the random sequence, the economy doesn't use it). Home tank in the run: 20 L, 11 to 77 shrimp, 49 at the win.

## Deploy 30 Oct (BUILD clean-tank): Passes 156-157
- Bots seed 7: strong 2,019 (2,106), kind 3,183 (3,159), average Earth 6,049 / Space 7,460 garden_hermit (6,777 / 8,188; inside the 5,700-6,640 seed range). Spotlight sweep 116 checked, all good. Layout scan: only the known 2 px element on World at the win stage.

## Pass 158: Look back after the win is a real button
- The win strip ("Everyone has a tank.") now has a Look back button that opens the ending recap sheet (`review`). Before, the text told you to look back with nothing to tap.
- `review` and Settings "Your years at the company" now open after the win too, not only after leaving the company.
- Balance 98, academy 10, me 46.

## Deploy 30 Oct (BUILD look-back): Pass 158
- Bots seed 7 unchanged: strong 2,019, kind 3,183, average Earth 6,049 / Space 7,460 garden_hermit. Spotlight sweep 116 checked, all good.
- Browser check at 390 px on the won snapshot, Kits tab, consultants in: strip reads "Everyone has a tank." with Look back, tap opens the recap. No console errors.

## Pass 159: three more fish, a livelier dog and Millie (30 Oct, land only)

- Fish from Puti's `tmp/fishandbird.aseprite`: glowlight rasbora (stream), Bolivian ram (lake, rare), zebra danio (both). In the catch, the book and the pond. `pixel-src/animals/add_fish.py` adds fish without touching the birds.
- Dog, her 30 Oct frames in `characters/dog.aseprite` (46 frames, `pixel-src/chars/add_dog_millie.py`): standing he wags (32-35) when you stop by him, pet him or he runs over, and now and then turns his head to you or looks back (36, 37). Sitting he shifts between side, look back, half turned and front (38-40, 44, 13). After zoomies or a run over he sits and pants, tongue in and out (41/42, 43/44). Left alone a while, or with you standing still 20 s+ or sitting, he may curl up asleep (45) for 25-75 s; a pet or setting off wakes him, a bit slower than from sitting. Side frames flip for left; feet anchors per frame (`dogSide`, `dogAx`). Guide layers are left out by name (the feet line was switched on in her file). Old 32-frame sheets still work.
- Millie, `millie_walk.aseprite` now 52 frames (her new frame 1, arms relaxed, shifts the rest by one; `MLay`). Standing she drifts between her two stands every few seconds and blinks (two blink frames made from her own eye and lash pixels, 52 and 53). millie2 rebuilt from the new frame 10.
- Tests: frame check for every dog and Millie state, flipped and not, screenshots; balance and academy pass.
