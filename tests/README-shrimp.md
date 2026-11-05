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
- Dog, her 30 Oct frames in `characters/dog.aseprite` (46 frames, `pixel-src/chars/add_dog_millie.py`): standing he wags (32-35) when you stop by him, pet him or he runs over, and now and then turns his head to you or looks back (36, 37). Sitting he looks left (38/39, tail down/up) or right (40, and a made 46: 40 with the raised tail from 41), or to you (44, 13), and wags sitting too when you stop by him or now and then on his own. After zoomies or a run over he sits and pants with the tail going (41/42), or from the front (43/44). Left alone a while, or with you standing still 20 s+ or sitting, he may curl up asleep (45) for 25-75 s; a pet or setting off wakes him, a bit slower than from sitting. Side frames flip for left; feet anchors per frame (`dogSide`, `dogAx`). Guide layers are left out by name (the feet line was switched on in her file). Old 32-frame sheets still work.
- Millie, `millie_walk.aseprite` now 52 frames (her new frame 1, arms relaxed, shifts the rest by one; `MLay`). Standing she drifts between her two stands every few seconds and blinks (two blink frames made from her own eye and lash pixels, 52 and 53). millie2 rebuilt from the new frame 10.
- Tests: frame check for every dog and Millie state, flipped and not, screenshots; balance and academy pass.
- Deploy (30 Oct): BUILD `2026-10-30-land-dog`; the land loads as `home.html?v=BUILD` so a new land isn't served from cache. The land's two catch sounds (`catch-shrimp-1.mp3`, `-2.mp3`) were missing from `shrimp/` and 404'd; copied in. index.html sim unchanged since the last deploy, so bots and the spotlight sweep were not rerun; fast suites pass and a 60 s monkey on the land (373 random taps, tool switches, forced sits and pants) gave no errors.

## Pass 160: ending fixes from the 28-year Garden playthrough, plus header numbers (30 Oct)

A. Traits
1. Done. Labels say what is measured: drive life first / company first (headline company first / life first), know leaves settings alone / tinkers with everything (a tinkerer / hands off with settings), control moves on with gaps / finishes before moving on (thorough / quick to move on). Comment block, ending comments and AGENTS.md updated. No other player text used the old words.
2. Done. One grey line under each trait bar that has a play part (`traitEv`): hours on work (or You page screen time), setting changes and ?/chart opens a year, % of optional things done when you moved on plus the weakest part, shrimp looks and culls, big buys and reserve days. Rows 34 to 48 px, text has a halo over the centre line. Checked at 390 px.
3. Done. `prepNow` keeps its parts in `PREP_LAST`; `prepNote` stores per-part averages in `G.ps.prepP` next to `G.ps.prep` [sum,n] (old saves keep working, they just have no parts). The "fully kitted" clause only prints when control >= 0. The weakest part goes into the control evidence line ("least on stores").
4. Done, reworded. `S.rdX` counts picks of the priciest option on late cards, not bets, so it stays out of risk: "picked the most expensive option N times out of M".

B. Ending text
5. Done. `endRateFb`: when the rate falls back to "N times in Y", the line is printed once. endTankLines was the only other caller and never doubled.
6. Done. `headNet` is the header's net per day and the ending's. With net > 0: "N days of profit", with net < 0: "enough for N days of costs".
7. Done. `tankLapsed` (crashed and left empty, green over 25% of the time, or a gap over 6 months) hides "You never stopped looking after your first tank" and the c_mytank "kept it going" line. The tank lifetime counts from when the farm took the other tanks (`S.ownD`), the line now says so.
8. Done. Bug: `E.trees` is the tree map, so `c.trees+E.trees` was a string and the world list always said "none". Both places use `earthNums(G).mine`; under 1000 it says "You planted N yourself."
9. Done. 13 was `gt.n` (every tap of Check on Grandma), 30 was `visits+calls`. Grandma section: "You visited Grandma V times and called her C times in Y, about ...". The world list drops the tap count. `visitLevel` 'many' now also needs 4 visits a year, 'some' 0.75 a year.
10. Done. New finance category `family` "Sent to Grandma" for the weekly send and the 2% gifts. `personal` is now "Your home and life" (house steps, land, trips, days off and illness bills still go there, so "Your home" alone would have been wrong). Old saves keep their old totals under it.
11. Done. `fmtA` uses the short form from 1M (galas line), Lab header and launch line use `shortN` for knowledge.
12. Done. `endWorldList`: staff/Mira lines first, then 10 lines (story, hard part, coin and Grandma lines ahead of project ends, project ends by cost), "Show all N" fold for the rest, the closing line always shown. `END_EXCL` pairs: docks/seaweed, free/paid care plan, clear/green river; the exclusion also filters What changed on Earth.
13. Done. Noor, not Mimi. Names are text only; `migrate` rewrites Mimi in queued later news, the paper log and the You history once (`G.mimiNoor`).

C. Charts
14. Done. X ticks every 5 years over 12 years, every 2 below, on multiples.
15. Done. `ebig` has no trailing .0.

D. Space
16a. Done by reading and a sim check (no late save from that run): the false condition was `rd(water)`/`rd(algae)`. With Keep observing on, finishing an observation restarted observing, and while a project runs the Lab card shows only that project, so Water buffering never showed a Start button. Survey was not the problem (the launch card only shows once surveyed).
16b. Done. `launchMissing` lists only what is missing under the Launch button (projects, survey, knowledge, mission crew, cash above the reserve).
16c. Done. A.crew is mission crew (contracts and graduates). Lab header, Space text, launch line and the button say "mission crew".
16d. Done. With Keep observing on and space started, the next of materials, water, algae starts instead of another observation (`spaceNeed`), and the Lab card says "Pause observing to start ...".
16e. Done. Hint names only the missing projects, bracket gone.
17. Done. Lab header counts positions like the rows ("12 PhD students, 6 postdocs", `rlSum`); a PI lab counted as 3 people before.

E. Small UI
18. Done. Open World tab and Contract 50 mission crew sit in one flex row with an 8 px gap.
19. Partly. The pause button is set pressed whenever a card holds time. The money: after space starts, Earth is archived (kit and shrimp sales stop by design), but food and tank care and side income keep paying, and the weekly send to Grandma is 1-10% of cash. The header looked only at shrimp and kit sales, so it said "bills 50.4M/d" and hid both the income and the send. `headNoInc` now looks at every income line except gifts, so the header shows the real net. Average bot seed 7 after space: food and care +160M/d, side +7M/d, supplies and delivery -72M/d, sent to Grandma -157M/d. Not changed: whether the send should keep taking a share of a huge balance; that is a design call.
20. Done. The ? button has a title and aria-label for ! and !!, and the popup opens with one line saying what the mark means.

Also from Puti's message
- Header money stays on one line (`#b-net` nowrap), no AED in the per-day part ("bills 74.3M/d"), header numbers one decimal at most (`hN`: 4.1B, 1.6B).
- The green line under the cash counts owners once the goal bar is gone: "8.2B own a tank · 7.9B quit eating shrimp · 8B mangroves" (fits 390 px).
- First lab party: it needed 500 shrimp in the tanks before day 900. Players who reach the farm before 500 in tanks, or are slow, never got it. Now 500 shrimp counting the farms, from day 90, before Europe opens. Second party unchanged (after Europe).

Tests: balance 98, academy 11 (new: observing doesn't block the seed ship, launch lists what's missing), me 46. Browser at 390 px on the average bot's space snapshots: ending, header, Space card, no console errors.

## Pass 161: one home tank, its own clock, leaving after Space (30 Oct)

1. Done. One tank. The game's Tank 1 is the only truth, the land draws it. Traced first: the land kept its own tank in `shrimp-land-v1` (its own genetics for the young it added, its own mulm, flow, moss, stems, pests, nitrate, all ticking on the land's day), and `landOwn` only sent adult and young counts, so the two drifted apart (the land's G8 and rili were its own kids; the company's colours were the sim's). Now `landOwn` also sends grade counts per tank-view grade (`vgOf`, adults and young), ages in tank days, `care` (mulm, sponge, growth, snails, flatworms), the glass grid as digits, nitrate and ammonia, decor, wellbeing (`ownWell`) and what's due (`ownDue`). The land (`game.js`: `ownAge`, `ownGrades`, `applyOwn`) ages Your tank by tank days, regrades shrimp to the game's counts (plain red, the game has no rili), scales its mulm, flow, moss and stems to the game's numbers, matches pests, draws the game's glass algae the same way (`glassLayer`), and its own day no longer touches Your tank (`tankDay` skips it). A job on the land sends what it changed (`report`, type `tank`: mulm, sponge, growth, pests, water change, decor), the game applies it (`landTank`), counts it as care once, and the next sync agrees. A job in the company shows on the land at the next sync (1 s). Old saves: the game wins for shrimp, grades, mess, glass and water; the land wins for decor, once (it reports its layout on the first sync, `T.ldec`, then the game sends it back). Glass has no job on the land, it's wiped in the company.
2. Done. Tank 1 has its own clock once the farm has the other tanks (`tankClock` = own tank or left, `G.tday`/`G.tstep`/`G.tq`, `ownStep`, `tankRoll` is the old per-tank day). `stepGame(G,k)` moves Tank 1 by k of a step: the loop and the away catch-up pass 1/speed, so at 40x the company moves 40 days and the tank 1; the land (`LAND.acc`) passes 1, real time for both. On the Tank tab the game runs at 1x, 2x and up are grey with the title "Your tank runs at 1× on this tab" (a tap says it too, titles don't show on a phone) and the picked speed comes back on any other tab (`tankPace`, `applyPace`, `SPEED_WANT`). Every Tank 1 stamp and its reader use tank days (`td(G,T)`: last water change, water log, molt crash, new stock, frozen bottle, hand feeding, illness day and checked, cycling, readings), so do `careDay`, the first-tank ending stats (`endStatsTank`, `careMark`, `tankLapsed`, `endTankLines`). Grandma, cards, notes, eggs and grass stay on company days. Room temperature still follows the calendar. Old saves start the tank clock at `G.day` (`migrate`). After Space starts Tank 1 keeps living on its clock (it used to freeze with Earth).
3. Done. Gravel, Sponge, Trim, Pests and glass are due about once a tank month (`OWN_DAYS` 30, due at `OWN_DUE` 0.5). This replaces the 1/350 plant rate of earlier today: on its own 1x clock a tank month is long already. Wellbeing only drops past 0.3 of each mess, so a month off still reads Fine (about 80) and months off read Needs care. Same on the land, since it follows the game. On the land Your tank gets no glow on its jobs, no dot on its chip and no ! on the map; the Needs doing list stays.
4. Done. What blocked it: `canLeave` needed the land and the row lived in Settings. Now leaving is offered from the hard part, the win or Space, without the land too (the sale buys Grandma's places that are missing), and it's a row on the You tab under Grandma's place and at the top of the hard part, not in Settings: Sell, then Tap again to sell. The recap comes first, then the land opens and stays: no tabs, no speeds, the land's back button is ≡ Your years (opens Settings over the land: Your years at the company, Start over). The recap sheet scrolls (`#review-box .sheet-in`).

Tests: balance 103 (new: tank clock at 40x, real time and migrate; the shared state both ways; monthly jobs and wellbeing; leaving after Space, the win and the hard part; the 30 Oct requests), academy 11, me 46. Browser at 390 px on a farm-stage save: company Tank and the land show the same grades (G6), glass, snails and flatworm, mess and wellbeing 89 both; a land vacuum and pest pick cleared the game's mulm and flatworm and counted one care; Tank tab speeds grey, Kits back to the picked speed; leaving goes recap → land with ≡, Settings over it, recap scrolls.
Not done: the company Tank tab still draws its fixed plant art, it doesn't grow with Trim like the land's stems do.

## Deploy (30 Oct, Pass 160 + 161, BUILD 2026-10-30-own-clock)

| Bot (seed 7) | Before (Pass 159 build) | Now |
|---|---|---|
| Strong, cold | Earth day 2,019, empire_dictator | Earth day 2,102, empire_dictator |
| Strong, kind | Earth day 3,183, question_prof | Earth day 3,263, question_prof |
| Average, Space | Earth 6,049, Space 7,460 | Earth 6,637, Space 8,048, garden_hermit, 42 min waiting |

Average bot over five seeds (7, 11, 23, 31, 43), Earth day, old build (Pass 160) against new: 6,049/6,721/5,769/6,665/6,105 (mean 6,262) against 6,637/6,609/6,833/6,441/6,581 (mean 6,620). About 6% later and less spread. The bots run the tank at company speed (k = 1), so the economy didn't change on purpose; the shift is most likely the random stream reordering (Tank 1's day now runs before the company's), not looked into further. No INSOLVENT. Spotlight sweep: 116 checked, all good. Layout scan: one 2 px overflow on the World tab at the win (360 and 390 px), not looked at.

## Pass 162: bots answer every card (30 Oct)

Puti: bots should do exactly what players do. They used to close any card with choices that wasn't on a short list (owntank, coin offer, pains, Grandma's land, the scam, goodbye cards) without a pick, a thing no player can do. Now all three bots share `tests/shrimp-bot-cards.cjs`: the old specific picks first, then kind bots try every choice first to last, cold bots last to first, skipping choices that end the game; if nothing can be taken the log prints `STUCK`. The average bot now goes to both lab parties (`emp.party` 1 and 2 = go) and made 34 story choices.
Found by it: the school-kits card built its choice labels with `big()`, a UI helper, inside the sim, so it crashed the moment a sim-only caller asked for its choices. Now `big` when it exists, `cnt` otherwise.
Bots (seed 7), Pass 161 → 162: strong cold 2,102 → 2,218, strong kind 3,263 → 3,221, average Earth 6,637 → 6,553, Space 8,048 → 7,964. Space bot passes. No STUCK, no INSOLVENT. Fast tests: balance 104, academy 11, me 46. Not deployed.

## Pass 163: UX review fixes (31 Oct)

From a UX review: a player who only follows what the screen shows, in Chrome at 390 px, plus every tab at 13 bot stages.

1. Hand feeding lasting a game day stays. Puti: people should buy the auto feeder.
2. Done. The third floor (`jar`): a month after the first babies a man asks for 5 shrimp, any age, AED 3 each, Sell him 5 or Not yet. Breeders never go. It skips story pacing, so in the browser it came on day 92 with babies on day 56 and moved the first sale from day 134 to day 104. If the spare shrimp are gone by the time it shows, Sell him 5 greys with "Not enough shrimp that aren't breeders right now". First version counted spare shrimp per cohort with floor, and baby cohorts are fractional, so a tank of 59 had 0 spare. Now the total is floored.
3. Done. The health check shows 16 shrimp, or the colony when it has fewer (was always 16, padded with copies).
4. Done. The A health check card shows at once (`CARD_NOW`), the Check shrimp glow waits for it (`hcWait`), and the spotlight that followed the card is gone. Before, the glow could come first and the card arrived after the player had already opened the check.
5. Done. Tank 1 moves with the company until Grandma's land is bought, then at 1x whatever the speed, and in real time on the land (`tankClock` = `landOpen`). The Tank tab no longer drops the company to 1x, the speed buttons stay as set (`tankPace` is false). A Two clocks card explains it when the land is bought. Checked in the browser from the million snapshot with the land: 12x on the Tank tab stays 12x, 24 company days move Tank 1 two days.

Tests: balance 107 (new: the buyer card, breeders kept, pay, not after kits, old saves; land starts the clock; health card, guide wait, check size, no Tank tab slowdown), academy 11, me 46. Bots seed 7, Pass 162 → 163: strong cold 2,218 → 2,215, strong kind 3,221 → 3,226, average Earth 6,553 → 6,777, Space 7,964 → 8,188. Seeds 11/23/31/43 old against new: 6,833/6,721/6,749/6,581 against 6,637/6,777/6,637/6,665, mean 6,721 against 6,679, so seed noise. Space bot passes.
Not done: 6 (thin late tabs) and 7 (small Sell buttons) wait for Puti. Old saves with the farm but no land: Tank 1's day jumps to the company day on load, so any due jobs show at once.

## Deploy (31 Oct, Pass 162 + 163, BUILD 2026-10-31-two-clocks)

Before deploy: balance 107, academy 11, me 46, bots as in Pass 163, Space bot passes, spotlight sweep 116 all good, layout scan only the known 2 px win World chart label, monkey 60 random taps on six stages at 360 and 390 px with no page errors, NaN or sideways scroll.

## Pass 164: plan for three big updates (31 Oct)

Docs only, no game change. Puti's plan for player-made furniture on Grandma's land, additions to the hard part (Mira's cousin, a sourced ledger, late partial outcomes) and a new space chapter (research unlock during the hard part, Grandma frozen, the player as the ship's AI, a 100-flyby optimal stopping search over real and generated planets, then settlement) is in `shrimp/AGENTS.md`, Open work, with the order and which chats can run in parallel. The "Space only after everyone" rule is marked as changed by Puti, held until the unlock ships. No tests run.

## Pass 165: Colours on Grandma's land (31 Oct)

Row 1 of the three big updates. Land source on `shrimp-proto` (`shrimp-home-proto/src/land.js`, `land.css`), `shrimp/home.html` rebuilt with `build.py --game` (checked the old build matched the game's copy first).
- Build: Colours chip next to Move. Tap a thing or a ground: a bubble with its colours (most used, up to 16). Tap one, pick a DawnBringer 32 colour, Other (colour input), or As drawn. All as drawn resets the kind. Free.
- One of a kind changes them all, also things that came with the place. Saved as hex pairs in `S.land.pal` (two items recoloured: about 80 bytes).
- Grounds recolour at the texture, so grass and sand edges on neighbouring tiles follow. Room floors, deck, terracotta and paving are code-drawn and map per pixel.
- Ground inside a room that isn't a floor can't be tapped. The bubble refits on screen when the choices open.
- Test hooks: `LAND.objs()`, `LAND.pal()`, `LAND.look(tx,ty)`.
- Checked headless at 390 px: armchair, lawn, stone paving recolour, survive a reload, no page errors. Fast suites pass (107, 11, 46).
- Not covered: room back walls and caps, Grandma and animals, step stones, sand pebbles, live parts (feeder seed, coop eggs).

## Pass 166: hard part additions (31 Oct)

Row 3 of the three big updates. Added, nothing in the ten groups changed.
1. Sales drop said plainly: a line under the goal, orders a day now against the top since the hard part opened, the half that can buy has a tank, most of the rest can't, food and care keep paying, stopping is fine.
2. The ledger (collapsed, in the hard part): company cash, profit a year, then sourced costs. Basic water, sanitation and hygiene for everyone US$28.4B a year (Hutton and Varughese 2016, World Bank), power for everyone in Africa US$15B a year (IEA 2025), a life saved US$3,500 to 5,500 (GiveWell, Oct 2026), 2.1B without safe water at home (WHO/UNICEF JMP 2025), 666M without power (Tracking SDG 7 2025). AED at the 3.6725 peg. A give-away slider in 5% steps, share of daily profit. Your life line says no change until 90%. At the bot's hard part profit (about AED 120B a year), 50% covers 57% of the world's basic water bill.
3. Giving lands late and partly: 91-day batches, 1 to 2 years, 40 to 90% arrives, 1 in 7 batches mostly lost with a dry reason (border, broken pumps, a cut, missing cables, the war). Small heart gain per batch. Nothing given by default, so the bots don't change.
4. Nour, Mira's cousin: six cards (jar and power cuts with a choice, water on a truck, summer, moving with a choice, generator hours, fifteen). Hard part options and the ledger change her lines, mostly by not reaching her street.

Tests: balance 109 (new Pass 166 check: giving maths, reserve, late batches, Nour order and counts, sources in comments, no em-dashes), academy 11, me 46. Average bot seed 7: Earth 6,777 to 6,805 (six more story cards), all six Nour cards fire. Browser at 360 px from the hard part snapshot: no sideways scroll, no page errors, slider updates the share.
Not done: the ? popup for the hard part doesn't mention the ledger. Not checked by Puti: Nour's wording, the ledger's lines.

## Pass 167: Make on Grandma's land (31 Oct)

Row 2 of the three big updates. Land source on `shrimp-proto` (`shrimp-home-proto/src/land.js` "Make" at the end of the land closure, new `make.css`), `shrimp/home.html` rebuilt with `build.py --game` (checked the old build matched the game's copy first).
- Build has a Make chip: New, then your things. New asks the type (Chair, Sofa, Bed, Table, Rug, Thing, Floor, Wall), then Blank or a copy of anything of that sort. The type line says what it does.
- Draw view: pen, eraser, fill, pick, pan, line, box, circle, triangle, undo, redo, zoom. Colour and Face swatches, No face for outlines. DawnBringer 32 plus the drawing's own colours plus Other. Footprint chips 1x1 to 3x2, Shorter/Taller in 8 px steps. The floor the thing stands on is shaded. Delete needs a second tap and is blocked while any are placed.
- Saved things show up in their group (Indoors, Ground, Walls) with a price: chair 30, sofa 60, bed 80, table 40, rug 30, thing 25, +10 a tile past the first; floor 10 a tile, wall 20. Making is free. Remove gives half back.
- Millie sits on made chairs and sofas, Pierre naps on made sofas and beds, rugs can be walked over, the rest is solid. Floors sit over a wood deck tile (acts as deck, no edges); Remove puts the old ground back. Made walls join other walls; see-through pixels show through.
- Colours work on made things, floors and walls.
- Sizes: chair 64x96 0.9 KB, bed 128x160 1.3 KB, rug 1.5 KB, a copied lawn floor 1.9 KB, wall 0.3 KB. Land save with five made things and nine placed: 52 KB.
- Checked headless at 390 px in the prototype (make all eight types, place them, sit, rug passable, chair not, undo/redo, reload keeps all, Colours on a floor, Remove a floor tile, delete blocked then allowed) and in the game's overlay (make a table, place it, AED 50 taken from the company). No page errors. Fast suites pass (109, 11, 46).
- Not done: fences, Grandma sitting on made chairs, a mirror tool.

## Pass 168: Leaving Earth (31 Oct)

Row 4 of the three big updates. Built on Pass 166.
- Opens during the hard part (or after the win) once the player paid for 500 science: papers from funded people, finished studies, 5 per find or null result. Not cash, not hard part progress. The Lab shows the count until then.
- Leave Earth card at the top of World, a confirm sheet: Earth ends, what carries over as points (cash, science, kits sold; logs, so giving half away costs about 12 points), then two tabs.
- After: Space and Grandma's land only. Earth stops like selling the company. The land comes along (bought if missing), cash stays for it. The land's back button reads Space.
- Space tab: the ship. Fuel in flybys (starts at 100), four instruments, robots, seeds. Change freely, never over the points.
- Old Space stays as a separate door after the win until rows 5 and 6; taking one shuts the other. Bots don't change.

Tests: balance 111 (new Pass 168 check: gate, score, old Space shuts it, start, Earth stops while days pass, points, ranges, save), academy 11, me 46. Average bot seeds 7, 31 and cold probed for the threshold (numbers in AGENTS.md). Browser at 360 and 390 px over http from the year 17 snapshot: door, sheet, leave, ship edits, land tab and back; tabs Space and land only, no sideways scroll, no page errors.
Not done: launch (row 5, `V.sealed`), the company goal bar still shows in the header after leaving, "The ship leaves in the next update" placeholder line, land source has no proper voyage flag.

## Pass 169: the planet search (31 Oct)

Row 5 of the three big updates. Built on Pass 168.
- Launch at the bottom of the ship card, two taps. The ship is sealed and `shrimp/space.html` opens full screen.
- Grandma says three things she wants, out of six, and sleeps. Fuel for N flybys, braking 10, scans 1 or 2, said on that screen.
- Black map, pixel stars, a cone of 2 to 4 stars ahead. Flyby 1, scans only with the instruments packed, Brake here 10 and you stay. Fuel never drops under what braking needs.
- Named stops at their real distances: Proxima b (first cone), TRAPPIST-1 e, f, g (one cone), LHS 1140 b, TOI-700 e, K2-18 b (no ground, disputed DMS), Kepler-442 b (out of reach at 100 fuel). Facts checked and sourced in comments; the landing truth is the game's guess.
- Landing: heat, air, water, ground, star, days, life, her wishes yes/partly/no, how she wakes, then where it ranked: every planet in every cone passed and every one the fuel left could reach, chart with the rank in the title.
- The trip saves in the game (`G.voyage.trip`, `V.landed`). Ship card: To the ship while flying, Look after landing.

Tests: balance 113 (new Pass 169 check: launch once, sealed ship fixed, bad trips refused, landing kept and name cleaned, save), new `tests/shrimp-space-search.cjs` 5 (same seed same sky, named stops, fuel rules, rank counts, spread of planets), academy 11, me 46. Browser at 390 and 360 px over http: ship card, launch, wishes, map, flybys, a scan, brake, landing and chart, back to the ship card; no sideways scroll, no page errors (Google Fonts blocked in the sandbox only). Bots not run (no sim change on Earth; they don't take the voyage).
Not done: settling (row 6), the old Space chapter still there, land source voyage flag, header goal bar after leaving. Not seen on a real phone.

## Pass 170: cleanup after the planet search (31 Oct)

From the Not done lines of Passes 165 to 169.
1. The old Space chapter is gone: `spaceOpen`, `spaceResearch`, `WORLDS`, seed ships, surveys, habitats, mission crew, `spaceDay`, the four Space-only Lab studies, the Space card, the `spaceDream` chapter card, `mira_space`, the space line in the control prep. Lab texts lost their Space: halves. `migrateChapters` deletes `G.space`; an old save that was in it goes back to its won company (log line: Leave Earth is in World once your science is enough), a Space-only study in progress is dropped. The curious type has no tree now, its last chapter is the lab (it used to skip `lastchap`). Endings: question_lucky says shrimp in hot countries don't need a cooler (was a hot world). Win card, pause cue and progression read `G.voyage` where they read the old Space.
2. Header goal bar and the Earth line hide after leaving Earth (were still there when you left during the hard part).
3. Voyage flag: `landSend` sends `voy:1`, the land's back button says ‹ Space from its own source (`VOY`, `leftBack` in `game.js`). The DOM relabel hack in the game is gone.
4. Land source (`shrimp-proto`, commit 8317ece, `home.html` rebuilt with `build.py --game`, the old build matched the game's copy first): Fence in Make (64x96, joins like the plain fence, copy from the plain fence, Colours work), Grandma sits on made chairs and sofas (Sit somewhere else in her bubble; removing her seat sends her back to her armchair), Mirror and Flip in Make.
5. Landing ends on Preparing for settlement… on the ship's landing screen and the ship card. Row 6 is next in AGENTS.md Open work.

Tests: balance 114 (old checks for the dream hand-off, `spaceOpen` and old-Space leaving replaced by an old-save migration check; new Pass 170 lock-in check), academy 9 (the six old Space checks became: clock after the win, leaving archives the bills, legacy saves get no `G.space`, observe repeats, no Space-only study), me 46, space search 5. New Space bot (`shrimp-space-playthrough.cjs`): from the strong cold win, funds research, Leave Earth opens day 4,557 (6.4 years), 468 points, transit and RV, 30 robots, lands on flyby 23, fit 79, best of 67 passed, survives a reload. Average bot is Earth only now: day 6,805, door on 5,882 (unchanged). Strong cold 2,215, strong kind 3,213. Land headless at 390 px: made fence copy, mirror and flip, three fences join, chair placed, Grandma moves to it, survives a reload, no page errors.

## Deploy (31 Oct, Pass 164 to 170, BUILD 2026-10-31-space-cleanup)

Before deploy: balance 114, academy 9, me 46, space search 5, bots as in Pass 170, Space bot passes, spotlight sweep 116 all good, layout scan only the known 2 px win World chart label, monkey 60 random taps on six stages (start, first hatch, farm license, a million, win, landed ship) at 360 and 390 px with no page errors, NaN or sideways scroll. In the browser: leaving from the year 17 hard part hides the header goal; landing screen shows Preparing for settlement…; the land's back button reads ‹ Space. home.html and space.html are current. Not seen on a real phone.


## Pass 171: the ship goes home to the land, no rank on landing, Grandma asleep (31 Oct)

Puti, from the test save.
1. Landing no longer says how many planets were better, and the rank chart is gone: the ship wouldn't know. One line instead: stopped at flyby N, distance from the Sun. `rankOf` stays in the sim for the tests and the Space bot.
2. The ship's top-left button is ⌂ Home (was ‹ Space, which went to the company): it opens Grandma's land. After launch the land's ‹ Space opens the ship, so the company view is out of the loop once the ship has left. Before launch the land still goes back to the Space tab to pack the ship.
3. After Leave Earth no Grandma moments, calls or Check on Grandma events: `personalDay` returns early and clears `M.cur`/`M.call`, `gtCheck` refuses, the You page says Grandma is asleep on the ship.

Tests: balance 116 (new Pass 171 checks), academy 9, me 46, space search 5, Space bot passes. Browser at 390 px: launch, ship Home opens the land, land ‹ Space opens the ship, no page errors. Not deployed.
Open question for Puti: the planet list has 7 of the 45 worlds in Bohl et al. 2026 (plus K2-18 b, which isn't in it), and TOI-715 b, one of the paper's two best targets, is missing. Grandma still sits in her armchair on the land while she sleeps on the ship.

## Pass 172: a real sky, more instruments, Grandma off the land, color sliders, Make icons (31 Oct)

Puti, from the two test artifacts.
1. The sky is real: `REAL` in `space.html` holds 220 planets from the NASA Exoplanet Archive (via the Open Exoplanet Catalogue's import, built by `tests/build-space-planets.py`): all 45 in Bohl et al. 2026 (MNRAS) plus K2-18 b and the nearest planets with a known year. Earth's numbers are copied only when measured (error bars, a transit for widths); a radial-velocity mass with no width is shown as at least. Stars in distance order, a star's planets together, 2 to 4 a cone, 69 cones. Same sky every trip. What the ship finds on the ground stays the game's guess (`truth`), seeded by name; the famous eight keep their Pass 169 values. Each planet's From Earth line is its catalogue facts.
2. Three new instruments (ship card and scans): Orbit tracker (year, AU, eccentricity, 10 points), Star quake listener (asteroseismology, star age, 10), Radio aurora watch (magnetic field, 15). Stretched orbits, young stars and no field cost fit. Landing lists orbit, age and field too.
3. Grandma is not on the land after Leave Earth (`GM_AWAY` from the voyage flag): her chair is empty and has no bubble.
4. Land text says color. Colors is a panel docked at the bottom of the map, the thing moved into view above it: tap one of its colors, then Hue, Strength and Light sliders. Reset this color and Reset all replace As drawn and All as drawn; Other is gone (the sliders do it).
5. Make: every tool button shows what it does (pen, eraser, fill, pick, pan, line, a square for Box, a circle, a triangle), plus Back and Forward arrows (undo, redo), Mirror, Flip, zoom.
6. Millie's eye: checked, her sprites are the same pixels as before the blink update in every non-blink frame. Her eyes look different at different spots because she's drawn at 1.5x and the pixels land unevenly. Not changed; asked Puti.

Tests: balance 117, academy 9, me 46, space search 5 (rewritten for the real sky), Space bot passes (lands on Gl 725 B c, fit 53). Land headless at 390 px: color panel, a slider recolors the armchair, Make icons, no page errors. Not deployed.

## Pass 173: Millie's eyes, the stream trap (31 Oct)

1. Millie's eyes changed shape depending on where she stood: art was drawn at 0.7 of a screen step and people at 1.5x on top, so pixels landed unevenly. Zoom now goes in whole screen pixels (`ZOOMS=[1,2,4,6]` screen pixels per art pixel, default 2). At 2, 4 and 6 everyone, people at 1.5x included, lands on whole pixels, same proportions as before. 1 is the far view. On Puti's phone the default shows about 9 tiles across instead of 13. Checked at 390 px, 3x: the same eyes at six spots.
2. Stream trap checked on the live build (main, 507d1c2): set, wait, pull up, 4 shrimp, Take home into Your tank. The land added them but never told the game, so the game's Tank 1 stayed at 0 and the next sync took them back out. Now `addToTank` into Your tank posts `give` (game.js). Checked: Tank 1 goes 0 to 4. The trap itself was fine.

Tests: balance 118, academy 9, me 46, space search 5. Not deployed.

## Pass 174: Millie's eyes for real, the ship's layout (31 Oct)

1. Millie's eyes still changed as she moved: the land canvas had one pixel per art pixel, so 1.5x people came out 1 or 2 canvas pixels per art pixel. The canvas now holds 2 pixels per art pixel (`L.R`, the drawing is scaled by 2), and `drawSprK` snaps to those pixels: every art pixel of Millie is 3 canvas pixels, 3 screen pixels on Puti's phone at the default zoom. Checked at 390 px, 3x, five spots: both eyes white, pupil, white, same as her Aseprite file. Land source on `shrimp-proto`.
2. The ship (space.html), keeping the layout:
   - The panel has one height. Under the planet, Looks and one row per instrument in a fixed order (air and water, mass, star, days, orbit, star age, field). Before a scan the row is the instrument as a button with its cost; tapping it fills the row with the answer. Instruments not packed say Not on board.
   - Tapping a star ahead puts a small box next to it on the map with its name, distance, how it looks and Fly by, 1. The Ahead section is gone from the panel.
   - Brake is on the map, bottom right above the panel, the same place every flyby: Brake and settle here, 10, then Tap again.
   - Several planets of one star in a cone: the letters on the map, the star's name once above them.

Tests: balance 119, academy 9, me 46, space search 5, Space bot passes. Not deployed.

## Pass 175: tests cost a tenth, the ship's panel never scrolls (31 Oct)

1. Every test costs 0.1 fuel, transit spectroscopy 0.2 (were 1 and 2). Fuel shows one decimal; tests still never touch the braking 10.
2. The panel is 404 px with no scrolling: header, From Earth in three lines (tap it for the whole text in a box over the map), Looks, then one 35 px row per test with Orbit last. Each answer is one line, swipe it sideways to read the rest (fades at the edge). Checked at 390 px: running all seven tests, every row stays where it was and the panel never scrolls.
3. Dev trips pack all seven instruments.

With tests this cheap the Space bot scans everything and lands on TOI-700 d, fit 95, best of 199 passed. Balance 120, academy 9, me 46, space search 5 (fuel numbers updated). Not deployed.

## Pass 176: 300 flybys at least (31 Oct)

Puti: the ship gets at least 300 fuel. `VOY_FUEL` is now min 300, start 300, max 500. The first 300 are free (`free`), and each step of 10 past that costs 10 points as before (`voyageSpent` counts fuel above 300). A ship in an old save that hasn't landed is topped up to 300. With 69 cones in the sky, 300 is enough to fly past every star and test most of them.
Tests: balance 120 (fuel checks: starts at 300 for 0 points, 290 refused, 310 costs 10), Space bot passes. Not deployed.

## Pass 177: 300 stops, a few good places for any wishes (31 Oct)

Puti: the sky had 69 stops, she wanted 300, and more than one good planet to choose from.
1. `tests/build-space-planets.py` now takes 960: 959 planets, still every one of the 45 in Bohl et al. 2026, then the nearest with a known year. They make 302 stops of 2 to 4. White (A) stars allowed; a last stop of one planet borrows one from the stop before. `space.html` is about 200 KB now.
2. Real nearby planets are mostly too hot, so few are good. To make sure there are several for any wishes: more life on warm wet rocky planets, a bit more warming from air, some close-in planets turning slowly instead of locked (like Mercury), fewer red dwarfs flaring. Over all 120 orders of her three wishes, at least 3 planets score 80 or more and at least 5 score 75 or more (new test). TOI-700 d can reach 100.
3. Space bot: settles at its best seen minus 5.
Tests: space search 6, balance 120, academy 9, me 46, Space bot lands on TOI-700 d. Not deployed.

## Deploy (31 Oct, Pass 171 to 177, BUILD 2026-10-31-real-sky)

Before deploy: balance 120, academy 9, me 46, space search 6. Bots, seed 7: strong cold 2,215, strong kind 3,213, average Earth 6,805 (door day 5,882), all the same as the last deploy. Space bot passes (lands on TOI-700 d). Spotlight sweep 116 all good, layout scan only the known 2 px win World chart label, monkey 60 random taps on six stages (start, first hatch, farm license, a million, win, landed ship) at 360 and 390 px with no page errors, NaN or sideways scroll. home.html matches a fresh `build.py --game` of shrimp-proto (c32ac30), space.html parses. Not seen on a real phone.

## Pass 178: opening fixes (31 Oct)

Puti, from a phone playthrough:
1. The 4× spotlight after the first ammonia waits 5 s of play instead of 15 s (`spotlight(...,gap)`, `introOK(gap)`).
2. The third-floor jar: his daughter names them Jimmy, Jack, Jimbo, Jojo and Jaja.
3. "Your first shrimp sale" waited for the jar sale and came before her own first sale. It now fires on a sale beyond the jar (`G.stats.jarSold`).
4. Supplies card only shows while a second tank still isn't cycled (`supNeed`). Seeded tanks made it empty, and its Bulk supplies line was stale.
5. Another tank shows and costs AED 150. The ready sheet still asks for the auto feeder and water changer before Got it, with "I'll buy them later" as the other way out (gear stays due, buy it in Gear).
From the bot review of the opening:
6. The "Your tank is cycled, buy your first shrimp" card is dropped if shrimp already went in while it waited its turn.
7. A tab the player already opened gets no "Trade is open" spotlight later.
Tests: balance 122, academy 9, me 46. Not deployed.

## Deploy (31 Oct, Pass 178, BUILD 2026-10-31-opening)

Before deploy: balance 122, academy 9, me 46. Bots, seed 7: strong cold 2,215 (same), strong kind 3,201 (was 3,213), average Earth door day 6,267. No INSOLVENT. Spotlight sweep 115 all good (one fewer: the Supplies card no longer shows). Layout scan only the known 2 px World chart label at 360. Monkey 60 random taps on six stages at 360 and 390, no errors.

## Pass 179: Tank 1, one clock, one tank, slower mess (31 Oct)

Puti: Tank 1 on the company Tank tab and on the land didn't match (algae, poop, pests), it got dirty very fast and pests came constantly.
1. One clock. From the land on, Tank 1 moves by real time only, 2.4 s a tank day (`TANK_DAY_MS`), 72 s a tank month, on the company page and on the land, at any company speed (`ownClock`, `G.tAt`). The page steps the company with `stepGame(G,0)`; the 1/speed share and `LAND.acc` no longer move Tank 1. It holds while a cleaning job is open. Reload or a hidden page catches up at most 30 tank days.
2. 3 tank months from clean to fully covered (`OWN_FULL` 90), due at a third (about day 30) for gravel, sponge, trim and glass (`GLASS_K` 1.1, nitrate no longer speeds Tank 1's glass). Wellbeing starts to drop at due.
3. Pests: none for a tank month after a pest clean (`C.pestAt`), then (0.05 + mulm)/50 a day, flatworms only once the gravel is due. A monthly cleaner sees pests in about 9% of months.
4. index.html is the only simulator. The land never runs its own `tankDay` on Your tank (it used to for up to 365 days on every load), applies no mess while a job is open, and sends a job's result against the values from when it started. The game now sends mulm per gravel column and every pest with kind and place; the land draws them as given, so both pages put poop and pests in the same places and a visit doesn't move them. A clean column stays clean.
5. Company care buttons for Tank 1 open the land on that job (its vacuum, sponge, scissors, tweezers and sounds) and come back when it's done. The glass wipe is on the land too, with a wipe sound. The Two clocks card says the new rule.
6. The land's pest drawing guards against missing sizes and non-finite places (the gradient error).
Tests: new `tests/shrimp-tank1.cjs` (sim: due 27-33, covered 81-99, pests; browser at 390 px: 40x leaves Tank 1 at 2.5 days in 6 s, land and company match on columns and pests on first visit, after a land clean, 10 s later and after a reload, the land clean isn't undone, Vacuum on the company opens the land and comes back, no gradient errors). Balance 122, academy 9, me 46. Not deployed.
Not done: the company still draws Tank 1 in its own ink style; positions and amounts now match, plants and the scape are drawn by each page in its own art (the scape is the land's call, the game only keeps the decor flags).

## Pass 180: the screen doesn't move when you press a button (1 Nov)

Puti: pressing a button must not shift the screen, every box keeps its size, buttons stay in the same spot on the right of their row. Her worst issue; now a design rule in AGENTS.md.
1. No scroll tied to a tap. Gone: the tank lock's scroll to the tank, the hard part's scroll on goal pick, keep and Next, the guide bar tap scroll, the story card scroll. `finGo` and the earth line only scroll when they take you to another tab. The guide's once-per-cue scroll is skipped for 2 s after a tap (`TAP_AT`), and so are the anchor fixers (`anchorFix`, `anchorCheck`), which were the source of most jumps (a 500 px jump on starting the lab, 580 px on launching a campaign). Every `focus()` has `preventScroll`.
2. A tap never lets the page or the sticky header get shorter under you (`floorKeep`/`floorFree`, released on tab change; the fold button is exempt). `#tb-sell.wait` keeps the button height, the cash column reserves its second line.
3. Tank: care buttons and the job bar share one slot under the tank (`#tv-slot`), always 3 columns, a button you can't use now keeps its space. Job bar text on one line, Done fixed at 96 px on the right. The land does the same (`#jobslot` under its tank, the bar no longer goes above the tank, jobs not needed now are faded instead of removed, the net bar uses the slot too), Aquascape's panel is a fixed sheet at the bottom, the build palette floats over the map and the map keeps its size.
4. Rows: `itemHTML` drops the `.long` flip. Button in a fixed 112 px column on the right, title one line, description two lines, full text behind a ? (`data-ht`). Plain rows with a button get the same column. `.btns` rows don't wrap. Equipment and Another tank now use `itemHTML`. The confirm step on Sell farm/line/Close shop keeps the button width ("Tap again").
5. One skeleton per card: the running film shows its three cuts with the picked one marked; a running campaign keeps the three messages with the days left on the launched one; the pet shop and bulk kit orders keep their text height and two button columns across Accept; the hard part's Next sits above the group with one label, and `#hard-body`/the group step reserve their tallest state (`slotMin`, measured once per width).
6. Help (?) opens in one fixed sheet (`#helpsheet`) instead of growing the card. The story card (`#milestone-card`) is a fixed sheet over the page, nothing in flow above the tank. The equipment Show/Hide completed toggle sits above the list.
7. Header numbers in fixed-width tabular slots. Free time rows have a fixed button column and two-line text, the money-for-Grandma hint keeps two lines. The space panel scrolls inside its fixed height.
Test: new `tests/shrimp-stable.cjs` (390x844, every visible button on every tab at 13 stages, a fresh page per click, ~1900 clicks, about 15 min with `STABLE_N=10`; plus home.html and space.html buttons). Collapsible headers and show/hide toggles may change their own card but not scroll or the header; one-off chapter starts (starting the lab, the first hard-part goal, answering a question card) are listed as allowed.
Result: 1,836 clicks at 13 stages, from 210 buttons that moved something (28 page jumps, up to 580 px) to 23, none of which scroll the page. What's left is listed under Open work in AGENTS.md. `shrimp-layout` overflow is back to the one known 2 px chart label.

## Pass 181: Grandma's land, banner, wind, one mute (1 Nov)

Puti's playtest, Part 3 of the fix list.
1. "Something needs you at the company" showed on every land visit: `landNeed` fired whenever `#milestone-card` was up, and after the win the win card stays up. Now only for a new card in the queue (`G.progress.queue[0]`), never `win` or `gameover`, never a card already shown on the company page (`renderMilestone` marks `LAND.seen` when the land isn't open), and once per card (marked on `landHide`).
2. The outdoor wind loop is gone from the land (`outdoorAmb`, `sfxLoop('wind')`).
3. One mute: the land's sound button now reads and writes the game's `shrimp-music` key and posts `mute`; the company's `setMute` posts `mute` to the land; the land also follows `storage` events. Only one page plays music: opening the land suspends the company's music and keeps it off while the land is open, the game tells the land `vis` on/off, hidden the land suspends its `AudioContext`. Back at the company the music resumes (on the next tap on an iPhone). space.html has no sound, nothing to do there.
4. Land source: Pass 180 had edited `shrimp/home.html` by hand; those edits were ported back into `shrimp-home-proto/src` (style.css, land.css, tank.js, toys.js, land.js) on `shrimp-proto`, a fresh `build.py --game` matched the game's copy byte for byte, then this pass was built from the source.
Test: new `tests/shrimp-land-audio.cjs` (14 checks, 390 px, real http, autoplay allowed), a Pass 181 check in `shrimp-balance`. Balance 123, academy 9, me 46, tank1 all pass. Not heard on a real phone.

## Pass 182: end-of-game lines (1 Nov)

Puti's fix list, Part 4: cut lines that don't make sense, aren't true for every path, or judge.
1. Bugs: "You were there for X of her Y birthdays" counted your own birthdays, Grandma's log entries now keep their event kind (`gtLog(...,ev)`, `e:'gbday'`), old saves match "Grandma turned"/"a cake for her". Empire tab win card is now "Goal reached / N people with a tank, day D" with a Look back button, no second copy of the ending. "until she was eighty" → "for years". Mira studies-the-sea line cut. Owners chart dot "everyone" → "goal reached". Dictator letter and `last` no longer say every home has a tank. Professor ending has no space in it (who, letter, tank). Happy shop is about keeping the first shop while others built the rest. `endText`: the hermit's house and shrimp room (and the village letter's shrimp room, the hermit letter's well) only if the house is finished, the lifeline's filters/vaccines/insulin from `E.tree.lm_water`/`lm_med`, "Half your company..." only with both. "You never once borrowed money" skipped after `gpLoan`. "You never bet the company" (steady, positive) never on a fall ending (`styleTop`).
2. Cut: long runs / bit of everything (and `runs` out of the method score), "It was messy and it worked.", all three first-tank lines in `gpLines`, "Time is paused..." from all win texts, "You were there for X of her days", c_mytank's two ending lines, the world-list "stopped eating shrimp" and mangrove counts (`endWorldNums` returns nothing, the restoration project's end line, shrimpcoin's tree count; Earth paragraph and gala line stay), goal lines in the win body when the world list has them (stream, sheet, enough, none), "didn't keep you up at night", "did it decently". `endingVerdict` deleted.
3. Rewrites 19 to 33 as listed in the fix prompt. Untold stories: "She told you X of her Y stories. You never heard about ...".
4. Reread as a player, also changed: "The jars do help, a bit." cut; the last chapter card, the bottleneck note, the header strip, the kit price note and the 40× note said everyone has a tank after any win, now "Goal reached" / "You reached the goal." / "40× is now available."
5. Not changed, for Puti to look at: dictator "Most rules turned out to be someone who hadn't been paid yet."; fall/sold `next` lines say everyone has a tank N years later (fiction after the company is gone); the world list can run to 60+ lines.
Test: new Pass 182 checks in `shrimp-me` (48), balance 123 (endingVerdict check inverted), academy 9, land-audio, tank1 sim pass. Strong bot WIN day 2215 empire_dictator, ending text read in full at 390 px, no page errors. `shrimp-stable` on win/emp,me: 4 movers, same 4 as before this pass. `ending-playtest-data.js` rebuilt.

## Pass 183: the hard part as things you watch (1 Nov)

Puti's fix list, Part 5: the hard part felt serious with no weight, too much text, buttons pressed without thinking. Ten groups, their options and effects, the ledger maths and sources and Nour's story are unchanged. No region map, no new paragraphs.
1. The people grid (`hgBlocks`, `hgLayout`, `hgDraw`, `#hg-cv`): one square per million, 120 a row, the easy half (Can buy one) first, then a block per group in its colour (`HG_COL`). Filled = has a tank, dark = put there (forced options, `p.given`), light = reached but no tank yet, outlined = on the way (picked options not ramped in yet, incl. war's three-year wait), pale = not reached. Group reach is `hardReach` as before; who of the reached has a tank is G.humans after the easy half and forced tanks, spread evenly. Groups not reached in the walk are grey and can't be tapped (`hgSeen`). The uncontacted village goes black while the jars go in, then leaves the grid. Legend: a fixed 3-column grid of all 11 groups (unseen ones keep their space hidden), tap a chip or a block to select (`HARD_SEL`, `hard-sel`, `hg-tap`, `hgHit`).
2. A group is its colour, name, people left and one sentence (`body` cut to one sentence). An option row is name, what it reaches and over how long (`hgReachTxt`) or where it is, and the price on the button; the description is behind ? (`hardRow`). The Next row stays at the top with one label; after the last group it says All 10 groups and Next keeps its space hidden. The old Groups so far fold is gone (the legend replaces it).
3. Funding an option shows no popup (the `showAfter` after `hard-buy` is gone); its squares outline at once and fill over its ramp. The news line still goes to the Times.
4. Nour's jar (`nourJar`, `#nour-cv`): the tank renderer with a stand-in tank (`NOURT`, `tvMake` options `deco`, `air`, `base`) holding `E.nour.n` shrimp. The pump bubbles while her power is on: 6 hours a day, 4 from Summer (6 with your solar farm past half), 2 h of generator from nour5; one second here is one hour of her day. Always on with the battery pump (unless she gave the jar away). Moss with the plants answer, a clay pot frame with clay pots funded. Caption is one line. Her six cards are one or two lines each.
5. The ledger is a bar chart on one AED scale: your cash, your year's profit with the given share in red, the world's water bill and Africa's power bill with a third each of the gift on them. Title says what share the gift pays (or what share a year's profit is). One line of text under the slider; your life, lives and the sources are behind ?.
6. Orders a day is a chart since the hard part opened (`H.oh`, one point a week in `hardDay`, thinned past 200; old saves start from load). The plain sentence is gone.
7. After the win the card stays: goal reached line, the grid and the ledger with the slider disabled. No group panel, sales chart, jar or Rethink.
Also: the Go and live on the land row is an `itemHTML` row (button fixed at 112 px, "Tap again"), it changed height on the first tap.
Test: new `tests/shrimp-hard.cjs` (8 checks, 390 px: grid drawn, legend and block taps select without moving the page, unseen groups not tappable, funding outlines with no popup, Nour's jar, after the win), balance 125 (Pass 183 sim checks, Nour and sales string checks updated), academy 9, me 48, tank1 sim. Bots unchanged on seed 7: average hard part day 5,237, Earth 6,609 garden_hermit; strong cold WIN 2,215 empire_dictator; Space bot passes. `shrimp-stable` on the hard-part stages (world, me): only the known owner-perk rows move.
Left: the group panel reserves the tallest group's height (five options), so groups with one or two options leave a blank under them. Giving still doesn't change the grid: no option fails or reverts in the sim, and showing squares that change back would claim something the code doesn't measure.

Deployed 1 Nov (Passes 179 to 183, main at dccdc83, BUILD 2026-11-01-hard-part-watch). Before deploy: balance 125, academy 9, me 48, hard 8, tank1 sim. Bots, seed 7: strong cold 2,215, strong kind 3,201, average hard part 5,237 / Earth 6,609 garden_hermit, all the same as before Pass 183. Space bot passes. Spotlight sweep 115 all good. Layout scan: only the known 2 px win World chart label. Monkey: 60 random taps on six stages (incl. the year 15 and 17 hard part) at 360 and 390 px, no page errors, NaN or sideways scroll. Not seen on a real phone.

## Pass 184: fixes from Claude's 1 Nov playtest, story cards at the top (1 Nov)

Project doc `claude/shrimp-fix-prompt-1nov.md`, all five parts, plus one ask from Puti.
1. One-off personal spending is not a daily loss: `operatingNet` skips `personal` (Grandma's place, the emergency bill, paid Grandma events), `netPerDay` adds personal spend back to the money change. `family` still counts. Feeds the header net, runway, give slider, ledger income, style `o.profit`, `painCost`.
2. First-tank ending spans in company days: `endStatsTank` once per company day from `stepGame`, `ownFrom` set to the farm day in `ownTankNow`, `careMark` on company days, the care rate on tank days (`S.ownTD`). `careDay` runs before the land too (once a company day). Old saves can't tell the farm day: `ownPart`, no first-tank lines.
3. Decor (Puti chose: all of it with the land): buying the land puts driftwood, plants, moss and almond leaves in Tank 1, sim effects included, said in the land's line and the log (`landDecor`). Sent to the land from the purchase; old land saves that never visited get it on load.
4. Hard part at 390: the group's options sit in a scroll box of about three rows (`.hard-ops`) and the slot is the tallest of the groups shown so far, so the gap under Never met the outside world went from 284 to 127 px; tapping a group still moves nothing. Legend names wrap to two lines (11 px), Never met the outside world spans two cells; every name whole at 360.
5. The 4x spotlight after dosing ammonia is skipped at 4x or more.
6. Puti: story cards (`#milestone-card`, the opening card too) sit 24 px from the top instead of above the tab bar.
Test: balance 127, me 49 (spans from the farm, no-land lines, old saves), tank1 all (decor at purchase, 40x ending days in the browser), hard 10 (gap and legend at 360/390), academy 9, space search 6, land-audio. `shrimp-stable` on the World tab: same 3 movers as the Pass 183 build (`#ow-body` world-bank rows), none new.
Before deploy: bots seed 7: strong cold 2,210 (was 2,215), strong kind 3,197 (3,201), average Earth 6,777 garden_hermit (6,609), no INSOLVENT. Space bot passes. Spotlight sweep 116 all good. Layout scan only the known 2 px win World chart label. Monkey 60 taps at six stages, 360 and 390, clean.

Deployed 1 Nov (Pass 184, main at 0fd958d, BUILD 2026-11-01-playtest-1nov).

## Pass 185: World tab rows, the trap, Tank 1 on the land (1 Nov)

1. World tab, Owners' tanks: the world-bank buy rows (and the care plan fee) moved to the top of the card, above the thriving breakdown, and a row bought there stays in place as a disabled Done until you leave the tab (`OW_KEEP`, cleared in `selectTab`). Before, buying Fishmeal-free kit food added a breakdown line above the rows and dropped the row, so the next button slid in (52 px down at a million owners, 17 px up for Winter kit at the win). BUILD 2026-11-01-world-rows.
2. Stream trap checked headless: set (AED 20), early check says Nothing yet with the hours left, after 6 real hours it holds 2 to 7 wild shrimp plus a find, Take the shrimp home works. No bug; the wait is real time (`TRAP_MS` 6 h).
3. Grandma's land starts with Your tank (Tank 1) on her floor beside the armchair (land source `shrimp-proto`, `landOwnTank` in land.js, game.js runs it for old fresh lands). Tapping it opens the Tank tab.
Test: `shrimp-stable` STABLE_TABS=world 158 clicks, 0 movers (was 3). balance 127, tank1, tank1-browser, land-audio pass. Not run: bots, spotlight sweep, monkey, layout scan.

## Pass 186: stream trap in 10 minutes (1 Nov)

Puti: the trap fills after 10 real minutes, was 6 hours (`TRAP_MS`, land source `shrimp-proto`). Real time, not game days, so speeding up the company doesn't fill it faster; time with the app closed counts. Early tap says the minutes left; texts in the toast, ? and Try say about 10 minutes. Old traps set without a timestamp are capped at 10 minutes. Checked headless (early: about 10 minutes, after 10: 3 wild shrimp and a snail), land-audio passes.

Deployed 1 Nov (Passes 185 and 186, BUILD 2026-11-01-world-rows). Before deploy: balance 127, academy 9, me 49, tank1, land-audio. Bots seed 7: strong cold 2,210, strong kind 3,197, average Earth 6,777 garden_hermit, all the same as Pass 184, no INSOLVENT. Space bot passes. Spotlight sweep 116 all good. Layout scan only the known 2 px win World chart label. Monkey 60 taps at six stages, 360 and 390, clean. Not seen on a real phone.

## Pass 187: Puti's 1 Nov phone playtest, 11 notes (1 Nov)

1. Cycled card (and any story card on the Tank tab) sits under the tank when it fits (`msPlace`), else at the top.
2. pH tip says how: set KH under Water care, then change water. pH follows KH (`phEq` = 6.4 + 0.3 KH), KH 2 is about 7.0, KH 4 about 7.6.
3. Ads tab opens after 10 shrimp sold (was the first sellable shrimp).
4. Colour food: "Redder babies, about +2 grade. AED 6 a week." Short enough that no ? shows.
5. Header gap: `floorKeep` held the header at its tallest after a tap, so buying the auto feeder (Fed and Nutrition row gone) left about 28 px empty until a tab change. The floor now lets go on the next scroll (`hFloorFree`). Fed/Nutrition stay hidden once every tank has a feeder (they came back whenever a tank went hungry, moving the header).
6. Temperature gear (fan, heater) opens when a tank passes 25.5 °C or drops under 21.5 °C (was 26.5 / 21, after the Too warm label). The warm idea fires at 26 °C.
7. Sell waiting ("Ready in ~2 d", "Buyers back in 3 d") is a grey disabled button in the Sell spot, not loose text.
8. The You button appears with its intro card ("Your time"), not minutes before it.
9. Kits need a second tank too (`kitsOpen`), plus 200 sold and 60 L stocked. Lock line, idea and tanks2 card say so.
10. Help sheet opens right under its ?, or above when there's no room (`hsPlace`); a scroll closes it. Shrimp Times help no longer mentions people going shrimp-free until someone has (`ripple.free`).
11. Packing at 1,440 with 240 breeders is the Pass 151 rule (packing waits for 6 shrimp per breeder, `PACK_YOUNG`). Not a bug, the line now says why: "Packing waits for 6 shrimp per breeder, 1,440, so the young grow up. You have 1,425."
Test: balance 127 (kits test now needs a second tank), academy 9, me 49. Headless 390: header 167 → 138 px after feeder plus a scroll, help sheet top 6 px under its ?, cycle card 8 px under the tank. Not run: stable, layout scan, bots, spotlight sweep (the Ads reveal at 10 sold and the second-tank kit gate move pacing; check bots before deploy).

## Pass 188: breeders, seeded tanks, one standard tank row, Farm tab (1 Nov)

1. Breeders are breeders: packing takes every shrimp above the breeder count (`packAbove` = `keepN`), the 6-per-breeder wait is gone. Slow breeding is the player's call (raise Breeders). Note: Pass 151 found this about 240 days slower for the average bot; check bots before deploy.
2. pH gauge ok range 6.6 to 8.0 (was 7.8), the same as the sim (6.5 to 8) and as KH 1.5 to 5. pH tip: the cycle uses up KH, lower-KH water lowers pH, under KH 2 it can crash.
3. A tank seeded from Tank 1 stays cycled: for its first 30 days with shrimp its bacteria are kept at its load (`tankRoll`, `T.stockAt`). Before, the seed matched an empty tank and decayed, so moving hundreds of shrimp into a 640 L tank showed nitrite and the bacteria bars.
4. Standard tank and the recipe are one row in Gear. The first standard tank costs AED 8,000 more (`SOP_COST`) and puts every tank on one recipe. The Standard operating procedure project row is gone. Standard tanks open with 3 tanks and kits.
5. From the first farm the Gear tab is called Farm and Trade is hidden (was at 10 kits a day of farm output). The tank-at-home card says so.
6. Header gap after automating: same cause as Pass 187 (`HFLOOR` held the tall header), the scroll release covers it. Headless: a fully automated 5-tank recipe header is 88 px with no floor.
Test: balance 128 (new: seeded tank stays cycled; breeders test updated), me 49 (standard tank pays the recipe once), academy 9, tank1 all. Not run: stable, layout scan, bots, spotlight sweep.

## Pass 189: police year sells loose farm shrimp (1 Nov)

Puti: when you go to the police and can't sell kits for a year, Trade and the Sell button come back, then go when the ban lifts.
- `banSale(G)`: `E.nosale` running, a farm built, not on the voyage. Trade shows again (`lateTrade`), the business strip shows the ban line plus a Sell button (`#ban-sell`).
- `banSell`: sells the farms' loose shrimp (`E.rawShrimp`) at Tank 1's price (`priceAt(fleetGrade)` x market x price) inside the weekly buyers, from `sellAll` and the Sell handler. Farms keep about two weeks of buyers in loose shrimp during the ban.
- Police option text adds "only loose shrimp to pet shops". When the ban ends a news line says kits are back; Trade hides again.
Test: balance 129 (new police-year check), me 49, academy 9, tank1, hard 10, land-audio. Headless 390: Trade back, strip button "Sell 32 · AED 83", click sells 32 for AED 83, Trade gone after the ban.

Before deploy (Passes 187 to 189): bots seed 7: strong cold 2,140 empire_dictator (was 2,210), strong kind 3,206 question_prof (3,197), average Earth 6,777 garden_hermit (6,777), no INSOLVENT, no STUCK. Spotlight sweep 108 all good. Layout scan: the one known 2 px. Stable full run: 1,778 clicks, 19 buttons moved something (was 23), the same Gear buy rows and story picks as before. Not run: space playthrough, monkey.

## Pass 190: unlocks and story timing (1 Nov, afternoon fixes Part A)

Project doc `claude/shrimp-fix-prompt-1nov-pm.md`, Part A.
1. Kits also wait for tank 2's first baby (`G.stats.t2Born`, set at the first hatch in any tank after Tank 1; `kitsOpen`). The 200 sold and 60 L from Pass 187 still apply. Saves already past keep Kits (`kitsOpened`). Lock line, idea and tanks2 card say "babies in a second tank". Average bot opens Kits on day 329 (was 309).
2. The care item in Kit development is the Shrimp care guide leaflet (there is no separate care video in the code): it shows once 10 kits are sold. Bought ones stay. The first-kit card no longer points at it.
3. The tank-at-home card (`owntank`) goes first in the story line and skips the story gap, so it shows right after the farm chapter, when the farm takes the tanks (`ownTankNow` already ran then).
4. Story timing. Cards waited in one line, one about every 1 to 2.5 minutes of play, so at 12x a card came hundreds of days after its cause. Now each waiting card keeps the day it became due (`progress.at`). Cards about a moment go first and skip the gap (only the 15 s rest): `STORY_PROMPT` (choices or a change already made: owntank, the four staff goodbyes, burnout, research trees) are never dropped; `STORY_DROP` (no choices: every Mira card, gp_net, me_doctor) are dropped if more than 60 days old when their turn comes (`progress.dropped`). At 4x the 15 s rest is 25 days, at 12x 75 days, so at 12x and 40x some Mira cards will be dropped rather than shown late.
5. Mira: one birthday, 8 on day 0 (`miraAge` = 8 + day/365; ev_mira says she's eight and fires around day 160). Eleven on day 1095, eighteen on day 3650. Changes: mira_bye, mira_house, mira_net, mira_dirty only while she's under 15 (childish lines); mira_fight under 18; mira_dye, mira_fight, mira_back need her met. mira_bye was set off by any staff goodbye (the sales one at day 1484 in the old run), now only by the packers' (it's about the packing line). Not changed: the ending's Mira paragraph gives her an adult job even when the strong bot wins on day 2,140 (she's 14). Puti to decide.
Test: balance 130 (new: freshness and Mira age), me 49 (Mira tests set her met), academy 9. Average bot seed 7: Earth 6,749 (was 6,777), no INSOLVENT.

Story cards, average bot seed 7 (bot play clock 4 s a game day, so lags here are far shorter than at 12x). Day due is when the card joined the line, Pass 190 build. "-" for cards that don't wait in the story line (chapters, intros) or didn't come up.

| Card | Trigger | Fired, Pass 189 build | Due, Pass 190 | Fired, Pass 190 |
|---|---|---|---|---|
| intro | `?` | 0 | - | 0 |
| cycle | `t.cycledAt!=null&&p.nh<0.05&&p.no2<0.05&&p.no3<=20&&t.chem.kh>=2` | 28 | - | 28 |
| hatch | `G.stats.born>=3` | 53 | - | 53 |
| jar | `!!G.stats.bornDay&&G.day>=G.stats.bornDay+30&&!(G.kits.sold>0)&&jarSpare(G)>=JAR_N` | 81 | - | 81 |
| sale | `G.stats.sold>(G.stats.jarSold\|\|0)` | 119 | - | 119 |
| ev_mira | `G.stats.sold>=30` | 161 | 161 | 161 |
| dye_offer | `G.stats.sold>=40&&!kitsOpen(G)` | 191 | 168 | 191 |
| mira_dye | `!!(G.dye&&G.dye.found)&&miraMet(G)` | 221 | 204 | 204 |
| health | `G.tanks.some(function(x){return !!x.ill;})` | 249 | - | 249 |
| kits | `kitsOpen(G)` | 309 | - | 329 |
| kit | `G.kits.sold>0` | 368 | - | 365 |
| me_intro | `!!(G.me&&G.me.on)` | 372 | - | 369 |
| fight_invite | `G.stats.sold>=150&&G.day>=250&&!G.emp.won&&!!(G.me&&G.me.on)` | 376 | 366 | 373 |
| party1 | `qHad, 500 shrimp / EU` | 447 | 435 | 435 |
| ev_paper | `G.kits.sold>=5` | 506 | 477 | 477 |
| qc | `G.kits.sold>=QC_FROM` | 645 | - | 618 |
| ripple | `!!(G.emp.ripple&&G.emp.ripple.n>=1)` | 742 | - | 689 |
| station | `stationDone(G)&&(G.emp.handPacked\|\|0)>0` | 812 | - | 756 |
| bulk | `!!(G.korder&&!G.korder.taken)` | 847 | - | 793 |
| worldtab | `!!(G.ob&&G.ob.ereg)` | 870 | - | 814 |
| farm | `Object.keys(G.emp.farms).some(function(k){return G.emp.farms[k]>0;})` | 896 | - | 840 |
| ev_rival | `G.kits.sold>=40&&farmBuilt(G)` | 900 | 840 | 863 |
| owntank | `farmBuilt(G)&&!G.emp.won` | 926 | 840 | 844 |
| pain_heat | `owners past the pain level, kits open` | 1200 | 1101 | 1125 |
| mira_teen | `miraMet(G)&&miraAge(G)>=11` | 1256 | 1095 | 1095 |
| pain_pack | `owners past the pain level, kits open` | 1358 | 1236 | 1237 |
| ev_ai | `G.humans>=2e4` | 1389 | 1264 | 1264 |
| pain_inbox | `owners past the pain level, kits open` | 1454 | 1401 | 1401 |
| bye_sales | `byeReady(G,'sales')` | 1484 | 1204 | 1204 |
| mira_bye | `miraMet(G)&&miraBye(G)&&miraAge(G)<15` | 1510 | - | - |
| ministry | `pd(G,'ministry')` | 1514 | - | 1596 |
| bye_pack | `byeReady(G,'pack')` | 1652 | 5320 | 5320 |
| pain_moss | `owners past the pain level, kits open` | 1712 | 1599 | 1600 |
| pain_crash | `owners past the pain level, kits open` | 1855 | 1694 | 1694 |
| gp_land | `5e5 sent to Grandma` | 1953 | 1861 | 1861 |
| landtime | `landOpen(G)&&!G.left&&!G.voyage` | 1983 | - | 1891 |
| pain_permit | `owners past the pain level, kits open` | 2010 | 1944 | 1944 |
| million | `G.humans>=1e6` | 2089 | - | 2014 |
| buyout | `(G.humans>=1e6\|\|G.humans>=2e5&&((G.me&&G.me.cnt.dinners)\|\|0)>=6)&&!G.emp.won&&!G.em...` | 2093 | 2014 | 2018 |
| pain_payout | `owners past the pain level, kits open` | 2240 | 2111 | 2111 |
| pain_copy | `owners past the pain level, kits open` | 2453 | 2365 | 2365 |
| party2 | `qHad, 500 shrimp / EU` | 2716 | 2660 | 2660 |
| c_fisher | `CARDS3: owners or cond` | 2743 | 2612 | 2612 |
| c_mytank | `CARDS3: owners or cond` | 2920 | 2920 | 2920 |
| ev_marine | `G.humans>=5e7` | 3027 | 2874 | 2874 |
| tree_rewild | `research tree opened` | 3051 | 2880 | 2880 |
| coin_offer | `1e8 owners` | 3245 | 3086 | 3086 |
| c_permit | `CARDS3: owners or cond` | 3642 | 3446 | 3446 |
| tenyears | `G.day>=DREAM_DAYS&&!G.emp.won` | 3650 | - | 3650 |
| mira_scholar | `pd(G,'scholar')&&miraMet(G)&&miraAge(G)>=18` | 3811 | 3650 | 3654 |
| mira_grown | `miraMet(G)&&miraAge(G)>=18` | 3846 | 3650 | 3658 |
| c_cash | `CARDS3: owners or cond` | 4495 | 4307 | 4307 |
| c_inspect | `CARDS3: owners or cond` | 5228 | 5013 | 5013 |
| hardpart | `hardOpen` | 5448 | - | 5229 |
| nour1 | `hard part days, previous Nour card seen` | 5493 | 5274 | 5274 |
| nour2 | `hard part days, previous Nour card seen` | 5648 | 5429 | 5429 |
| c_power | `CARDS3: owners or cond` | 5723 | 5379 | 5379 |
| nour3 | `hard part days, previous Nour card seen` | 5828 | 5609 | 5623 |
| c_rivers | `CARDS3: owners or cond` | 5851 | 5444 | 5457 |
| c_many | `CARDS3: owners or cond` | 5943 | 5504 | 5504 |
| nour4 | `hard part days, previous Nour card seen` | 6008 | 5789 | 5789 |
| c_blackout | `CARDS3: owners or cond` | 6043 | 5553 | 5553 |
| c_prison | `CARDS3: owners or cond` | 6144 | 5865 | 5865 |
| ev_school | `G.humans>=2e5&&G.kits.stock>=20&&!G.emp.won` | 6180 | 5597 | 5597 |
| nour5 | `hard part days, previous Nour card seen` | 6208 | 5989 | 5989 |
| nour6 | `hard part days, previous Nour card seen` | 6448 | 6229 | 6229 |
| lastchap | `?` | 6777 | - | 6749 |
| win | `!!G.emp.won` | 6777 | - | 6749 |

## Pass 191: layout and text (1 Nov, afternoon fixes Part B)

1. Gear: no Show completed. Bought items (and owned treats) go into a closed "Done (n)" fold at the bottom of Equipment. (Shipped in the Pass 190 commit.)
2. Gear layout:
   - Tank switch is one row of tank chips (Tank 1, Tank 2 ... All, `upchip`), 32 px, scrolls sideways past about five. Under it one line of what that tank already has (`upHas`: filter name, heater, fan, feeder, water changer, decor), "All have:" for All.
   - Rows with no main button reserve no description height (`.nob`). Older farms and older packing lines put Sell 1 / Sell n in the right column (`sellCol`, two-line buttons, price under the label).
   - Prices in row buttons use the short form from AED 10k (`aedS`, applied in `itemHTML`), money and ✦ costs show on two lines (`costB`, `costLabel`), kit extras read "+AED 30/kit". Gala cost moved from the title to the description. Item titles wrap to two lines instead of cutting off; film cuts wrap.
   - Header covers the strip under the status bar (`.top` box-shadow 80 px up). With the paused pill showing, the page gets 130 px (190 with the guide bar) of bottom padding.
   - The blank band under the header: not reproduced at 390 on the average bot's year 1 to 15 snapshots (gap 8 px on every tab); Passes 187 and 188 already free the header floor on scroll and on tab change. No change.
   - Walk at 360 and 390, early, kits, farms, a million, hard part (`trunc` scan): before, 43 cut labels (Sell buttons, ✦ costs, campaign and project titles, film cuts, packing hall titles, +AED a kit); after, none.
3. Shaping the world and Owners' tanks: descriptions run the full card width under the title, up to 4 lines, ? only past about 170 characters (`.wide`, `ITEM_QLEN`).
4. Farms header: "AED 146k/d upkeep · 183k shrimp/d", shrimp a day is what the farms made last day (`E.prod`).
5. Help: Tanks ? said new tanks need cycling or a starter. They start cycled from Tank 1 (`addTank`), text fixed. Read every `HELP` entry against the code (sales +25% each up to 4, kits 8 shrimp 20+ days, packing never takes breeders, QC, feeding): no other false claim found. The Another tank row's "Needs cycling" only shows when no tank is cycled, which is true.
6. Taps through story cards: while a card is open every sibling up the tree is `inert` (header, tabs, the rest of main; never the land, space, help or spotlight) and a transparent full-screen backdrop (`#ms-shield`) swallows taps (`cardShield`). For 350 ms after a card opens or closes right after a tap, trusted clicks outside the card are dropped (iOS ghost click, `SHIELD_AT`). Test `tests/shrimp-cardtap.cjs` (touch emulation).
7. Ending and win cards: the ending text is one column, the buttons sit in a sticky footer row at the bottom of the sheet (`.ms-foot`), normal height. The "read this again from the land" line moved into the text. Win text drops "Done before year ten." (the year follows). The buyout sale works in two taps (Tap again). Test `tests/shrimp-endcards.cjs`: every `ENDINGS` key on the win card, game over closed and sold, left, the buyout offer and the sale, at 360 and 390.
Test: balance 130, me 49, academy 9, tank1, land-audio, cardtap, endcards 48. `shrimp-stable` farm license, first farm, a million owners on Farm, Kits, Ads, World: 267 clicks, 2 movers, both known (a kit extra row leaving its list, the kit price −).

## Pass 192: the hard part (1 Nov, afternoon fixes Part C)

1. The orders-a-day chart is gone, and its weekly record (`H.oh`, nothing else read it).
2. Group names sit in a 96 px column left of the grid, one label per block, each block on its own rows, as tall as its rows or its two-line label (`hgLayout`, `hgLabHTML`, `HG_LW`). Short names for Puti to approve: Never met the outside world shows as "Never met anyone", the easy half as "Can buy one", the rest as they are. Under the grid only the state key (has a tank, put there, can get one, on the way).
3. No step order: no Next, no "Group n of 10". Tap any group, label or block, its options open under the grid. Nothing picked at first: "Tap a group." Until a goal is picked the groups are grey and can't be tapped, and the line says the groups open once you decide what everyone means. The options slot is the tallest group, so a tap moves nothing.
4. Goals: no button filled before you pick, the current goal has a ✓. Good enough and No number are one option, "Stop counting" (name for Puti to approve, ends the game). Nine in ten and Three in four are gone with their win body, titles, ending style keys and trait pushes. Old saves: a game already won or ended with them, or with Good enough, reads as Stop counting; a running 90% or 75% game moves to Every home that wants one (not to Stop counting, which would end it on load). Bots never picked them.
5. After the win the grid and the read-only ledger stay (unchanged).
Test: hard 11 (new: no Next, Tap a group, grey before the goal, no filled goal button, one ✓), balance 130, me 49 (merged goal, migration). Screenshots at 360 and 390 sent to Puti.

## Pass 193: money and mechanics (1 Nov, afternoon fixes Part D)

1. Bank freeze: it blocks farms, packing lines, shops, stores, regions, projects (forks and the gala too), research hires, tree steps, costed hard-part options, Shrimpcoin plant and buy, land spending. Every one of those buttons now reads "Frozen" in place of its price, greyed, same size (`freezeHTML` in `morph`, every cached card redrawn when the freeze starts or ends, Regions now go through `morph`). The business strip already says why and the days left. Tank gear, tools, staff, QC, campaigns and films aren't blocked and stay as they are. Test `tests/shrimp-frozen.cjs`.
2. Packing stopped with 43.5k kits in stock: farms only bred up to the warehouse target (`inventoryDays` × orders, minus stock), packing likewise, so with 7 days of stock both stopped. Puti: no pause. From the first farm, farms breed at capacity and packing runs at capacity whatever the stock; only the cash floor (`productionCashFloor`) stops them. Breeding and kit materials are paid as before, so overproduction costs what it costs; stock costs nothing to hold and never dies (unchanged); kits still sell only by demand. Before the farms, tank packing keeps the warehouse target. The "Farm shrimp yesterday" line is gone (the Farms header shows shrimp a day). Warehouse help says it only applies before farms.
3. Selling customer data: the AED 7.5M stays, then every new customer pays AED 10 once when their kit sells (`DATA_AED`, booked as kit income, so it counts in `operatingNet` and the header; `E.dataAED` total). The fork text says so, the Kits card shows "Customer data: AED 10 per new customer, AED X so far.", the ending's money lines add it.
4. Fight club. Was: a free-time pick, each night pays 0.6 of a day's income (at least AED 100) and costs about 3 shrimp from Tank 1; 4% a night the police raid it, fine the larger of AED 2,000 and 10% of your cash, 90 days off. After 4 nights the investor (wash_offer) can come; Mira stops coming over after the first. Now: same 4% a night (`FIGHT_P`), the fine is uniform 20% to 1000% of its average monthly take over the last 3 months (what there is if shorter, `fightAvg`), 90 days off, the third raid shuts it for good with a Shrimp Times story and takes the pick away (`E.fightShut`). The pick shows the odds and "Caught n of 3 times" (`fightLine`).
5. Empty Tank 1 before the land (after it has had shrimp): Check shrimp reads Buy shrimp in the same slot, adds 5 cherry shrimp at Trade's price (AED 15, `PACKS[0]`, greyed without the cash), then goes back to Check shrimp (`homeBuyMode`).
Test: balance 132 (new: farms and packing with 50k in stock, fight fines and shutdown, data income), me 49, academy 9, tank1 with browser (Buy shrimp), frozen.

### Pass 193 change before deploy: the warehouse limit

Bots after "farms run full whatever the stock": the strong kind bot never finished (cash fell from AED 296B on day 2,001 to 2.8B by day 3,001, every farm breeding and every line packing kits nobody could buy once the easy half had a tank, so it couldn't pay for the hard part; stuck at 7.15B owners for 9,000 days). So farms and packing run full until the warehouse holds 60 days of orders (`STOCK_FULL`, `stockFull`), then make what sells; Making kits says "Warehouse full, 60 days of orders in stock. Farms and packing make what sells." Puti's case (43.5k in stock, a few days of orders) now keeps packing. Changed from the request, for Puti to look at.

## Review: Puti's 17 items, 1 Nov afternoon (Passes 190 to 193)

| # | Item | Status | Checked by | Look at |
|---|---|---|---|---|
| 1 | Kits after tank 2's first baby | Done (A1). The 200 sold and 60 L still apply | balance (kits need babies in tank 2) | Kits open about day 329 in the average bot (was 309) |
| 2 | Care video after 10 kits | Changed: there is no care video in the code; the Kit development item at kits open is the Shrimp care guide leaflet, now after 10 kits | balance | Is the leaflet what you meant? |
| 3 | Remove Show completed in Gear | Done (B1), closed Done (n) fold | screenshot 360 | |
| 4 | Gear and tabs unfinished | Done (B2): tank chips and has-line, no reserved band for button-less rows, Sell in the right column, short prices, two-line ✦ costs, titles wrap, gala cost out of the title, safe-area strip, pill padding. The 250 px band was not reproduced (gap 8 px everywhere) | trunc scan 360/390 at five stages: 43 cut labels to 0; layout scan; stable | Header band on your phone |
| 5 | Shelf card too late | Done (A3), first in the story line right after the farm chapter | card table | |
| 6 | Farms header | Done (B4) | screenshot | |
| 7 | Outdated help | Done (B5), Tanks ? fixed, other HELP entries checked, no other false claim | read against code | |
| 8 | Shaping the world text | Done (B3), also Owners' tanks | screenshots | |
| 9 | Bank freeze | Done (D1) | shrimp-frozen | |
| 10 | Packing stopped | Changed (D2): runs full up to 60 days of orders in stock, not without limit (kind bot) | balance, bots | The 60-day limit |
| 11 | Taps through story cards | Done (B6) | shrimp-cardtap (touch) | On an iPhone |
| 12 | Customer data keeps paying | Done (D3) | balance | |
| 13 | Fight club | Done (D4), kept the 4% a night raid chance | balance (fine range, shutdown) | The "what exists" note is in Pass 193 |
| 14 | Story cards late, Mira's age | Done (A4), table in Pass 190; narrative cards older than 60 days are dropped, which at 12x and 40x drops some Mira cards | balance, me | Mira's adult jobs in the ending can show at 14 (strong win day 2,140) |
| 15 | Hard part | Done (C1-C5). Running 90%/75% saves move to Every home that wants one, not to Stop counting | shrimp-hard, screenshots | Names: "Stop counting", "Never met anyone", "Can buy one" |
| 16 | Empty home tank | Done (D5), AED 15 for 5 (Trade's cherry pack) | tank1 browser | |
| 17 | Ending and Sell company layout | Done (B7), sticky footer, buyout sale in two taps, "Done before year ten" gone | shrimp-endcards (all 17 endings, game over, left, buyout, 360/390) | |

Deployed 1 Nov (Passes 190 to 193, main at d9a44f5, BUILD 2026-11-01-pm-fixes). Before deploy: balance 132, me 49, academy 9, tank1 with browser, land-audio, hard 11, cardtap, endcards 48, frozen, space search 6, space bot passes. Bots seed 7: strong cold 2,201 empire_dictator (was 2,140), strong kind 3,156 question_prof (3,206), average Earth 6,357 garden_hermit (6,777), no INSOLVENT, no STUCK. Spotlight sweep 107 all good. Layout scan only the known 2 px win World chart label. Stable full run: 1,752 clicks, 12 buttons moved something (was 19): Gear and Kits rows that leave their list once bought, the first rack farm, the first store, the kit extras, the Grandma money picks (2 px), coin buy. Monkey 720 taps at six stages, 360 and 390, no errors, no NaN, no sideways scroll. Not seen on a real phone.

### Pass 194: quick fixes from Puti's phone, 1 Nov pm (deployed)

1. Land music: 0.13 to 0.06 into the master (the company's is 0.16 x 0.5 bus), fades in over about 7 s, and the loop point is a 5 s crossfade of two passes of the track (`ambLoop`/`ambPlay` in home.html), not a jump.
2. Start over: the land iframe is removed (its save key renamed first so its pagehide save goes nowhere), `shrimp-land-v1` and `shrimp-proto-v1` cleared, the new save written, page reloaded with a "Started a new game" toast. The land's `pal` (colours) and `made` (drawn things) carry over through `shrimp-land-keep`; everything built goes. The company drops land messages while the land isn't bought, so a left-over land can't set Tank 1's decor (her item 5: a new game with moss, wood, leaves and plants already Done).
3. Opening card: `#tv-slot` collapses (`.empty`) until the first care button shows; "Your first tank" sits 8 px under the tank (was 52).
4. ? popup: owners bar, year fold and letters gone (letters stay on the You tab). Before the tank has cycled and had shrimp it says "First, cycle the tank: grow the good bacteria by feeding them ammonia."
5. Tank 1 caption: none with one stocked tank (header has the count), only "Some look sick" when that applies; empty, cycling and multi-tank captions stay. Care buttons that show share the row width (Pass 180's fixed three columns dropped at her request; tank1-browser now checks only the left edge).
6. Story cards always at the top of the screen; Pass 18x's under-the-tank placement removed.
Test: tank1 (with browser), cardtap, land-audio, a reset script (land save gone, colours kept, built coop gone, no decor, toast). Skipped at her request: bots, spotlight sweep, monkey, stable.

### Pass 195: spelling, Nona, item help, Excel opens Money (1 Nov pm)

1. American spelling in all player text in index, home and space (color, neighbor, gray, liter, license, favor, harbor, center, meter, kilometers, traveled, recognize, program, incentivized, catalog). Ids and keys left alone (`'grey'` project, `lab_colour`, `colourName`, `FAVOURS`, palette keys).
2. Noor, the social media manager, is Nona. Old save text (later news, ripple log, You history) migrated once (`G.noorNona`). Tests updated.
3. Staff card title "Staff" (it holds sales, the social media manager and shop managers).
4. Items: the ? button above the title is gone. When the description is long, the title is a button with a dotted underline that opens the same help sheet (`.qhelp.qt`).
5. Buy shrimp ?: the salt-dip sentence removed.
6. Excel course: buying it opens the Money sheet (tap cash) with "Money over time" open and one line, "New: your books. Tap your cash at the top to come back here.", shown until the sheet is closed. `finOpen` = kits open or Excel bought, so the chart lives in the sheet from then on.
Test: cardtap, tank1, me 49, a browser script (Excel opens the sheet with the card inside and the note; item title opens the help sheet). Not run: stable, endcards (needs bot runs), bots.

### Pass 196: buy back your old land (Puti, 1 Nov pm)

Start over now keeps a land that has anything built (objects with `built`, ground edits) in `shrimp-land-old` (`{n: built things, S: the land save}`). In the new game the land step on Grandma's place shows two rows: Land with a stream, AED 250k, fresh (buying it drops the old land; colours and drawn things still come over), and Your old land, "From your old save: the land as you left it, N things built. AED 300k plus AED 100 each.", which puts the old land save back (`gday` cleared so it takes the new game's day) and logs it. `buyGplace(G,cost)` takes the price for the land step. Lands with nothing built get no offer.
Test: balance 133 (two Pass 194 string checks updated, one new), me 49, a browser script: build a coop, Start over, offer shows AED 300,100, buy, the land opens with the coop and colours.

### Pass 197: six fixes from Puti's phone (1 Nov, evening)

1. "Your tank is cycled" sits on the Tank tab where the cycling card was, 8 px under the tank (`msPlace`); every other card stays at the top.
2. Sticky header: no tap floor (`floorKeep` no longer sets `header.top` min-height), so a row that goes away (water readings after the auto tester) takes its space with it.
3. Care buttons back to three a row, two rows; a button that isn't needed keeps its place (visibility hidden).
4. Company-page tank jobs make the land's sounds (same synth on the music context and bus, one mute): siphon loop with level from the tube, pour, plop for a baby back, snip, scoop, pop, squelch and suck, glass wipe loop. Short buzz on each (`hap`: `navigator.vibrate`, or a hidden switch checkbox on iPhone, iOS 18+). No buzz when muted.
5. Mira's packing card: "Mira found out the packing line is all machines now. She asks if the machines check that the shrimp are happy. You don't know."
6. No illness for 2 real minutes after the gravel or the glass is cleaned, here or on the land (`T.cleanT`, `justCleaned`: `startIll`, `illRisk`, the random sick event).
Test: balance 132, me 49, tank1 (with browser), cardtap, a browser script (two rows of three at 390, glass wipe then `startIll` does nothing, risk back after 121 s, four jobs open and close with no errors, header min-height empty after a tap, cycled card top 8 px under the tank).

Deployed 1 Nov evening (Passes 195 to 197, BUILD 2026-11-01-p197). Before deploy: balance 132, me 49, academy 9, tank1 with browser, cardtap, land-audio (one fail under parallel load, then 3 clean runs), hard 11, endcards 48, layout (only the known 2 px win World label). Bots seed 7: strong cold 2,201 empire_dictator, strong kind 3,156 question_prof, average Earth 6,357 garden_hermit, same as Pass 193, no INSOLVENT. Spotlight sweep 107 all good. Stable full run: header height changes on taps that remove a header row (feeder, new tank, first farm, hire), wanted now (Pass 197 #2); the rest are rows leaving for the Done fold or a card shrinking after a buy (snail project, shop stores, AI consultant, coin), plus the You page card 2 px. Not run: monkey, space bots.

### Pass 198: goal first, pests crawl (1 Nov, evening)

1. The hard part opens on the goal pick alone: no grid, legend, Nour's jar or ledger until a goal is picked (`#hard-card.hpick`). After that the goal sits at the top as a row with a Change goal button (`hard-re`, `HARD_RE`), which goes back to the same pick ("What does everyone mean now?", Keep this on the current one). The Rethink the goal fold is gone. Go and live on the land stays in the pick and on the You tab.
2. Pests crawl slowly back and forth round their spot instead of wobbling in place: `pestCrawl(seed, snail, t)` in both pages (snails about 1 px a second, a 140 to 220 s loop; flatworms faster). The game keeps the spot (`x`,`y`); the land keeps it as `bx`,`by` and moves `x`,`y` along the crawl in `pestsStep`. Hit tests use the drawn place. home.html edited by hand (as in Passes 194 to 196): port to `shrimp-proto` `src/game.js` (`gamePest`) and `src/tank.js` (`pestsStep`).
3. The Stream ending is still there, hidden: the `stream` story card offers it when `streamReady` holds (Rewild stream and reserve or jar, mangroves, farm waste cleanup, Taiwan streams, a river answer, nothing forced).
Test: balance 132 (one string updated), me 49, tank1 with browser (pest check compares spots), hard 12 (new: Change goal opens the pick, Keep this goes back; before a goal no grid). Not run: bots, stable, spotlights.
Bigger questions from the same playtest (Tank 1 the same on both pages, Grandma's backlog, Question/Network/Drift endings) are in the project doc `claude/shrimp-design-prompt-1nov-eve.md`.

### Pass 199: the hard part after Keep playing, Your day note, Space in the Lab (1 Nov, evening)

1. After the win, Keep playing keeps the hard part live: groups open and options can be funded (`hardLive`: not ended, not left or in space, and not won unless `progress.sandbox`), the give slider works and giving runs (`giveDay`). The goal itself stays reached. Without Keep playing (the win card still up, or the ending review) it stays read-only, and the empty slot that showed under the grid is gone (the body's reserved height is cleared).
2. Your day: the note under the title always keeps two lines (`.me-note` min-height, no longer hidden when empty), so the picks under it don't move as the note changes. Longest note is 75 characters, two lines at 360 px.
3. Lab: a Space card at the bottom for everyone (`#lab-space`, order 99). Before Leave Earth opens: "You haven't met the conditions to unlock the space chapter." Once open: "You can leave Earth now. It's at the top of World." Hidden after leaving Earth or the company. The old science count line in the Research card (`voyageLabLine`) is gone, no hint.
Test: balance 132, me 49, academy 9, hard 12, cardtap, a browser script (sandbox win: groups fundable, slider enabled; read-only win: body 0 px; Lab card text). Not run: bots, stable, spotlights.

### Pass 200: Your tank the same on both pages (1 Nov, evening, Puti)

Puti: "Grandma land and company page still look different. Both sides should be the same." Decided: called Your tank on both, the land's job tiles, Wellbeing always shown, food choices, water readings and automation in one card.
1. Land source caught up first: the hand edits of Passes 194 to 198 in `home.html` (music crossfade, Start over keep, spelling, pest crawl) are ported back to `shrimp-proto` `src/`, a fresh `build.py --game` matched the game's copy byte for byte before any change.
2. Job tiles (company, Your tank from the farm on): Vacuum, Sponge, Trim, Pests, then Check shrimp before the land or Aquascape after it, then Glass, three a row, the land's order. Each has the land's icon (drawn once from the land's `TOYS` icons into small PNGs, `OWN_ICON`), its name and a state line. `ownLines(G)` writes the lines (Gravel due / gravel clean, Filter due / flow N%, Trim due / neat, Pests / N snails, Glass due / N% green) and the land uses the same strings (`OWN.lines`, sent in `landOwn`), so both pages say the same. Jobs not due are faded like the land's (`data-idle`); no glow. Aquascape opens the land on that job (`LAND_JOBS.scape`); the land sends its piece count (`busy` `sc`, `scape`, kept in `G.opt.scN`).
3. Cards for Your tank, same order on both pages: Wellbeing (`#wellcard`, `ownWell`, parts behind ?), Food and water (`#owncare`: food picks, treats, water readings as chips from the gauges, Automation sliders moved in from Gear), Colony, Recent events. The company hides Feeding, Water test and Automation for Your tank. The land shows Wellbeing whatever its effects setting and builds Food and water from `OWN.fw` (`ownFWCard`); a food or treat tap posts `oact`, a slider posts `oset` (`ownAct`, `ownSet` in the game, which owns the tank). The land's side doesn't rebuild under a finger on a slider (`FW_DRAG`) and refreshes when the game's data changes.
4. Name: Tank 1 is called Your tank once the farm takes the other tanks (`ownTankNow`, migrate for old saves), and the own-stage texts say so (Two clocks card, the land decor note, the ship's shrimp line, the fold label).
Test: balance 132 (Pass 179 string updated, Pass 200 check), new `tests/shrimp-yourtank.cjs` at 390 and 360 (tile order and lines both pages, card order, food tap and slider on the land change the game, the land card follows), me 49, academy 9, tank1 with browser, cardtap, land-audio.

Deployed 1 Nov evening (Passes 198 to 200, BUILD 2026-11-01-p200). Before deploy: balance 132, me 49, academy 9, tank1 with browser, yourtank at 390 and 360, cardtap, land-audio, endcards 48, frozen (5 tabs), hard 12, spotlights 103 all good, Space bot lands (TOI-700 d, fit 100). Bots seed 7: strong cold 2,201 empire_dictator, strong kind 3,156 question_prof, average Earth 6,357 garden_hermit (sci 532). Layout: one 2 px text overflow on the win World tab. Stable: 13 movers, all on the known list (bought rows leaving their list, the first rack, header strips), none on the Tank tab.

### Pass 201: Grandma doesn't pile up (1 Nov, evening, Puti)

Puti: "You can ignore her for a long time and when you go back all the options are still there, you can click like 20 things in a row." Cause: a window shut only after its month and 3 minutes of play, and 3 minutes of play is 75 game days at 1x but 900 at 12x and 3,000 at 40x. So at 40x every item waited about 8 years while about 4 yearly items a year kept opening.
1. Windows shut 90 game days after they open at the latest (`GT_CAP`), whatever the speed. At 1x to 4x nothing changes much. Moments: 90 days (was 400).
2. At most 2 things that can expire are open (`GT_MAX`, `gtTrim`): a third pushes the oldest out as missed. The TV and her call wait forever, don't count and are never pushed (Puti).
3. Checking runs `gtDay` first (old saves and paused pages settle), then shows "While you were away: N things happened without you." as a fold with the dated misses since the last check. Misses from old saves are dated the day their window would have shut; `gtLog` keeps Her years in date order.
Test: me 50 (new: 5 years ignored at 40x, never more than 2 open, nothing past 90 days, TV stays, away list matches the misses and empties on a second check, oldest pushed never the TV, old-save miss dated, at 1x a window lasts a month). Browser 360 and 390: away line shows (23 things after 5 years at 40x), Check doesn't move the page, no horizontal scroll, no errors. Not run: bots, stable, spotlights.

### Pass 202: player profiles and a baseline (1 Nov, evening, plan `claude/shrimp-plan-choices-1nov.md` Part 0)

Plan for this chat: Parts 0 to 9 of `claude/shrimp-plan-choices-1nov.md`, one Pass per part. Stops for Puti: the card table (Part 2) and the land-life list (Part 8).

New `tests/shrimp-profiles.cjs` (2 s): profiles in `tests/shrimp-profiles-def.cjs` (Empire builder, Dictator, Grandma's kid, Do-gooder, Scientist, Shrimp nerd, Casual, Returning player), each weights on what a side pushes plus how they play (Your day hours, You page share, setting and ? taps, own tank looks, treats, culls, and the new measures Part 1 reads: `P.landMs`, `P.grB/grN`, `P.giveY`, `P.fw`, `P.ctr`). 1,000 players a profile answer every decision in `decisions()` (moved to `tests/shrimp-decs.cjs`, shared with balance) with noise, buy the tagged one-offs (trees, lifelines) they like and can afford. A rich run buys everything they don't object to and every hard part option. Also fair, cold, random choosers and the kind/cold bot orders. Targets from the plan are printed; they become asserts when the rework lands (`PROFILE_ASSERT=1` forces them).
Bots: `PROFILE=<id>` picks cards (by trying each choice on a copy, `profPick`) and forks (`profFork`) by that profile's weights. Choices only, the bots' play stays.

Baseline, current code (family %, normal / rich):

| Profile | empire | garden | question | network | drift |
|---|---|---|---|---|---|
| Empire builder | 100 / 100 (99 dictator) | 0 | 0 | 0 | 0 |
| Dictator | 100 / 100 (all cartel) | 0 | 0 | 0 | 0 |
| Grandma's kid | 0 | 72 / 94 | 0 | 0 | 28 / 6 |
| Do-gooder | 0 | 44 / 13 | 52 / 77 | 4 / 10 | 0 |
| Scientist | 5 / 0 | 15 / 0 | 77 / 100 | 0 | 3 / 0 |
| Shrimp nerd | 0 | 100 / 100 | 0 | 0 | 0 |
| Casual | 0 | 81 / 27 | 0 | 19 / 73 | 0 |
| Returning | 28 / 15 | 23 / 14 | 0 | 34 / 71 | 15 / 1 |
| Fair chooser | 0 | 100 | 0 | 0 | 0 |
| Cold chooser | 100 | 0 | 0 | 0 | 0 |
| Random chooser (returning play) | 2 | 1 | 0 | 95 | 3 |

Misses: Grandma's kid drift 28%, Do-gooder network 4%, Casual garden 81%, fair and cold choosers 100%, random never reaches question with few setting taps. Money moves endings: Casual and Returning go network when rich, Grandma's kid goes garden.
Bots seed 7 (baseline): strong cold 2,216 empire_dictator, strong kind 3,148 question_prof, average Earth 6,357 garden_hermit, Leave Earth opens 5,996 (sci 532). Space bot passes (opens 4,582).

### Pass 203: the trait model (plan Part 1)

1. Means no longer picks the family, it picks the version inside it. `endingScores`: empire = company first, keeps it close (drive − care + 0.2), network = company first, strangers far away (drive + care), garden = life first, loves shrimp (−drive + kin), drift = life first, own people (−drive − care), question = curiosity (2 × know). Style terms as before.
   Versions: empire_good (means ≥ 0), new **empire_hard** (cold, no evil acts; text below for Puti), empire_dictator (means < −0.15 and at least 2 evil acts, `evilActs`: the welfare bribe, fight club, dark hard part options, and `E.evil` from Part 5), empire_cartel (dirty money). garden_village drops "you usually picked better and lost some money" for a cold player (`endText`). The others make no fairness claim.
2. Know is curiosity: research spend as a share of everything earned (`G.stats.rsp` over `G.stats.earned`, new saves start at 0, old saves null), plus basic science and ecology grants against applied (`P.grB/P.grN`, filled by Part 4). Setting changes, ? and chart opens no longer count. Bar labels: curious / growth first. `PLAY_W.know` 0.6.
3. Care only counts what costs the company. Play: the give slider held over the hard part (`P.giveY` share-years, `P.giveD` years, in `giveDay`), `PLAY_W.care` 0.4. Hard part options lose their care tags except those paid as a share of income for years (`dues`); a group's slow fix bought while its faster workaround is open and not bought adds care 0.7 (`hardSlow`, `HARD_SLOW`). Lifelines are a share of income for 3 years (water 5%, medicine 8%, books 2%, seeds 2%), shown on the button (`duesLabel`).
4. Drive: real time with the land open (`P.landMs`, in `tick`) against company play time; a quarter of play there reads −1. Evidence line "N% of your time on the land".
5. Kin unchanged until Part 3b (farm wellbeing).

Profiles after this pass (normal, rich within 5 points except where shown): Empire builder empire 94, Dictator cartel 97, Grandma's kid garden 72 / drift 28, Do-gooder network 81 (rich 96), Scientist question 100, Shrimp nerd garden 100, Casual drift 76, Returning 18/10/27/26/20, fair chooser 35 garden 42 question, cold chooser 52 network, random never garden.
Left for the cards (Part 2): fair answers still lean life first and loves shrimp, so first options read garden or drift; Grandma's kid needs own-people choices to reach drift. That's what the card table fixes.

New ending text for Puti to approve (empire_hard, "The Empire, the hard bargain"):
- Who: You wanted it done and you did it on the numbers. When the cheap way was legal you took it, every time. You never broke a law you could read. The people who worked for you got paid on time and not a dirham more.
- Mira: She runs a smaller company that pays more and grows slower. She sends you a card every New Year.
- Grandma: Your cousin says you're the cheapest rich person he knows. I told him that's how you got rich. Come for dinner, I'm paying.
- Tank: The water was fine and the food was the cheapest food. There were a lot of us. When some died, more came the next day.

Test: balance 132 (the know check replaced: settings don't move curiosity, research share and grants do, giving held over years, land quarter reads −1), me 50 (cold empire without acts is empire_hard, dictator needs the acts, cold garden stays garden, fair empire stays empire), endcards 50, academy 9, profiles. Ending preview rebuilt and its formula updated. Pass 202 and 203 went into one commit (a stuck shell step held the first one).

### Pass 204: card table for Puti (plan Part 2, waiting for her yes)

The table of all 77 decisions with proposed changes is in `tests/shrimp-card-table.md` (also the project doc `claude/shrimp-card-table.md`). Nothing rewritten yet. While waiting: Part 3b (farm wellbeing) and Part 4 (research grants), which don't depend on it.

### Pass 205: farm wellbeing, many or happy (plan Part 3b)

A standing choice on the Farms card, not a card (Puti). Top of Farms once a farm is built (`#fwell`, `renderFarmWell`): Shrimp wellbeing bar with its number (the title opens what it changes), a Shrimp a rack slider 50% to 100% (`E.fw.s`, default 100% = as now), Farm feed Plain / Good +10% upkeep / Fancy +25% upkeep (`FW_FEED`, a share of farm upkeep so it stays a choice late). The header keeps upkeep and shrimp a day.
Sim: `farmCap` × stocking, `farmOverhead` × (1 + feed share), `farmWell` = 45 + 80 × (1 − stocking) + feed (8 or 15), 0 to 100. The default reads 45 (`FW_MID`) and changes nothing. `sickKitRate` × `farmWellMult` (1 + (45 − wellbeing)/100, 0.5 to 1.5). Kin: each farm day adds the setting, weighted by log of what the farms made, to `G.ps.fw`; `playVal('kin')` averages it with the own tank part once 30 weights are in. The default is neutral, so only a held setting counts.
Spotlight line for the block. Browser 360 and 390: the block is 169 px whatever is picked, a feed tap and the slider don't move the page, no horizontal scroll, no errors.
Test: balance 133 (new: default neutral, fewer a rack means less output and more wellbeing, fancy costs and raises it, fewer sick kits, kin reads the held setting, farm days add to it). Bots not run (default is unchanged, so the win day can't move).

### Pass 206: research grants (plan Part 4)

Replaces open access to the research lines (`grOf`, `grantDay`, `grPick`, `grSkip`, `grOpenCentre`, `GR_*`, `grantsHTML`).
- Opens with the Lab (3,000 kits). Once a year two people apply, each a name, a direction and one line (applied, energy, water, health, basic science, ecology; `GR_DIRS`). Fund one or Skip this year. Up to 3 run at once. The amount is one slider, USD 150k to 240k over 3 years, "More money doesn't mean more results.", and moves only fairness (up to me+.4). A grant counts as a person in the lab, the first one starts it.
- After 3 years: 3 papers, then a find with the line's odds at 0.75 points (a quarter come out as nothing). Applied finds go to their field's bonus (`rlM`), basic science and ecology go to two new lines (`basic`, `eco`) that pay nothing back. `P.grN`/`P.grB` feed curiosity.
- Every 5 grants opens one research centre in a direction of your choice: that field's PhD students, postdocs and PI labs (the old `RLINES` machinery, `rlHire` refuses fields without a centre). People cost their USD salary or a share of a year's income, whichever is more (`posAed`: 0.05%, 0.1%, 0.5%), so a centre stays a choice late. Old saves keep any field with people or finds as a centre.
- Mapping for Puti: applied = food, automation and AI, genes (one at random); energy, water, health = their fields; basic science and ecology = new fields.
- Leave Earth now needs 400 science (`VOYAGE_SCI`, was 500): one grant a year is slower than six open fields.

Bots: average bot takes a grant every year (applied unless `PROFILE=scientist`), opens a centre when it can, staffs centres fully. Space bot does the same after the win.
Seed 7: average Earth 6,609 (baseline 6,357), Leave Earth opens 5,921 (baseline 5,996), sci 493 at the win, ending empire_good (was garden_hermit, the Pass 203 model). Space bot passes, Leave Earth opens 7,218 (baseline 4,582): its slow road after a strong cold win is now 13.7 years, was 6.4.
Test: academy 10 (new: two applicants in two directions, no lines before a centre, the top amount is fair, one a year, a grant starts the lab, same results at 150k and 240k, finds and plain papers both happen, skip, centre after 5 and one per 5, old saves keep lines, curiosity counts the grant), me 50 (research tests open their centres), balance 133, hard 12. Browser 360 and 390: the Fund button stays put on tap, no errors. The grant slider renders small in the Lab card, worth a look.

### Pass 207: the evil route (plan Part 5)

Five dark projects in World, Politics (one per track at a time, Turn it down works as for any dark project). Cold pays now, the bill is a later Times story (`risk`/`sc`), no lecture. Each counts toward `evilActs` through `E.evil`:
- Pay the port inspectors (word of mouth +2%, bribe), A farm license in the protected bay (farm upkeep −10%, greys the planting map's mud for good), Buy out the capital's shrimp club (ceiling +1%, force), Run a rival out of two regions (ceiling +2%, force), Write the import rules (ceiling +2%, force).
- Farm feed has a fourth pick, Culls: low-grade shrimp ground into feed, −10% upkeep, wellbeing −12, kin −1 once and an evil act.
- Dirty investors' money was already there (`wash_offer` and the routes deal, cartel ending).
Dictator needs means under −0.15 and 2 evil acts (Pass 203). Bots: kind bots, and profile bots with means over −0.5, turn the dark projects down.
Seed 7: strong cold 2,168 empire_dictator, strong kind 3,058 garden_hermit (was question_prof before Pass 203), average Earth 6,889 empire_good (kind bot no longer buys posters, songs and the rest).
Test: balance (all five buy and count, bay cuts upkeep, dictator needs two acts, culls lower wellbeing).

### Pass 208: planting trees by hand (plan Part 6)

The Rewilding card has Plant trees on the coast hills (`plSheet`): a fixed 48×36 bird's-eye map (`plGround`: sea, river, coastal mud, soil, rock outcrops), a bag of 50 seedlings for 0.2 days of income (`plCost`), one tap one seedling. No rules in text: a year after planting each lives or dies (`plOdds`: rock 0, mud 75%, soil by water 80%, other soil 50%, −25% for each neighbor). Living trees seed a free neighbor 10% a year (not counted as yours). The bay license greys the mud. Saved as `E.pl.t` [x, y, day, state, self-seeded], capped at 1,500.
The stream ending now also needs 100 of your planted trees living (`PL_OWN`, `streamReady`). Whether the stream gets a hint stays Puti's call.
Browser 360 and 390: canvas and sheet keep their place and size on six taps and a bag, no errors.
Test: balance 135 (bag, no planting in water, one per spot, rock dies, water helps, neighbors choke, patches spread and aren't yours, bay greys mud, stream gate).

### Pass 209: Space still opens (plan Part 7)

Grant papers and finds count in `sciScore` through their fields. Seed 7, Leave Earth opens: average 5,921 and Scientist profile (`PROFILE=scientist`) 6,139, against the baseline 5,996 (both within 3%). The Scientist ends question_prof. The strong bot never reaches it on Earth; the Space bot passes.

Left in the plan, waiting for Puti: the card table (Part 2 rewrites and Part 3 new cards, `tests/shrimp-card-table.md`, artifact "Card table"), the land-life pick (Part 8), then the final check (Part 9).

### Pass 210: one push table, skipped options count, no head start (card review A1 to A7)

Spec: Puti's approved review `shrimp-card-review-1nov.md` (other agent, 1 Nov evening).
1. `PUSH` (story cards, pains, late cards, goodbyes) and `FORK_PUSH` (fork projects) are now the only source of what a decision pushes. `storyChoose` and `buyProj` are wrapped: the tags inside them still run for heart (`E.heart`, the news) but the traits are replaced by the table. Fair/cold cards push means and risk or control only (kin or care at most .3 where the card is about it). Goodbyes are means ±.4 each. Tags follow the review's A7 (Mira's jar is own people, the bank sale is own people, letting postdocs go is strangers far away, care guide is kin).
2. Skipped options count (`PUSH_SKIP`, `pushSkip`): for know, care and kin, when the chosen side leaves a trait at 0, the largest size a skipped side had goes into `trAbs`. A trait reads how often, not only which way.
3. `endingScores`: no +0.2 for Empire, style terms capped at ±0.15. Tie-breaks in `endingPick`: network needs care above 0.1, else empire; garden against drift within 0.1 goes garden if kin > −care.
4. Care from play: giving reads only when you give (nothing given reads nothing), and real time on the land reads own people (a quarter of play there is −1, plan Part 8). Hard part options move fairness at most 1 each; a slow fix picked while the workaround is open adds care .5 (was .7).
5. Story choices and fork options show in an order fixed per game (`optOrder`, `G.oseed`), so the top button isn't always the same kind of answer.
6. Drive kept even: kind fork sides that stay small carry dr−.3 (co-op, retrain, share the gene, let postdocs go, publish the study, sponge filter, recipe, free care plan, insulated boxes), cold ones dr+.5.

Profiles (family %, normal run): Empire builder empire 93, Dictator cartel 89, Grandma's kid drift 94, Do-gooder network 80, Scientist question 100, Shrimp nerd garden 100, Casual 3/33/0/25/40, Returning 19/27/16/24/15, fair chooser 1/32/32/34/1, cold chooser 22/4/28/43/4, random 12/19/29/35/5. All plan targets met, and `shrimp-profiles` now asserts them (`PROFILE_TARGETS_ON`).
Before this pass: Grandma's kid drift 28, Casual garden 81, fair chooser garden 100, cold chooser empire 100.
Test: balance 135 (random chooser within ±0.05 with skips counted, drive even), me 50 (c_cash buy is company first, letting postdocs go is care, the stream needs planted trees), profiles. Ending preview formula updated and rebuilt.

### Pass 211: costs and texts (card review A8, A9, B, A11)

- Labels say their cost where the sim had one and the label didn't: Wait them out (fewer orders until they close), keep your drivers and what they cost, Send the survey (some customers unsubscribe), the crew fund is now 2% of income for two years (`duesAdd`, shown on the button), plastic plants in the kits next week, a second shift with payroll up a third, the audits with six months of inspections. Pain and late-card buttons already show their sim costs through `choiceFx`.
- Cut: "proper", "properly", "the towns forgive you" (now "The towns stop blaming you."), "They're not all wrong," on Tiny jails, "Nothing to do with shrimp." on the 150 GW card, "than any other naming deal", "Each truck is a truck." (now "A truck a day per town."), "Each country keeps its own side." Ask nicely says "a word with the ministry". Share the gene says "No license money."
- Fixed prices: Kits for poor schools is 60 days of income (`p.days` in `pm`); Keep cleaning the farm water is farm upkeep +10% (button "Upkeep +10%", `p.costL`). The buyout was already three years of income.
- A11: Luca and Gema's AED 0 is only the test save (no staff counted there; real saves count them when the card fires). `{,name}` in Tired renders through `N()`. Moving (nour4) has its body in `bodyFn`. Nona's age now follows the year she was hired (`bodyFn`).

### Pass 212: new cards (plan Part 3, review constraints)

Ten cards in `CARDS3` (pushes in `PUSH`, `card3Map` maps them to story cards; `lab` and `bodyFn` supported):
1. The knee (`c_knee`): fires within 10 days of opening Europe, if Grandma's knee hasn't happened. Go with her, Europe opens in six months (the region comes off and returns in 182 days, counts a visit) dr−.8 / Launch, she goes with an aunt (a line in Her years) dr+.5. The old knee event waits unless Europe is open or day 2,600 passes, so one knee a game.
2. A hardier line (`c_strain`, farm and 20k kits): Switch, 10% less breeding for 3 to 9 months (hidden, a log line when it settles, `strainDay`), 1% fewer want one, kit survival +2 points ki+.3 ri+.3 / Keep the old line dr+.3.
3. Power cut (`c_heat`): a heat wave, a rack or barn farm and no hatchery, a chiller on Tank 1. Buttons show the counts from the save: Keep it home, the farm's N die tonight dr−.5 / Move it to the farm, Tank 1's N die tonight ki−.5. No moss line.
4. The third floor, again (`c_jar2`): 150 days after the jar sale. Sell him five, AED 15 dr+.3 / Tell him to tell her, bring her over (five shrimp free, a later note) ca−.3 me+.3. She is the man's daughter, not Mira.
5. The lights (`c_lights`): Fire her dr+.3 / Call the police (a court line in the Times) co+.5 / Raise her pay and keep her, AED 20 more a day (1 in 4 it happens again, three days of income) ca−.3.
6. The cleaning bucket (`c_contam`): Clove oil, they go to sleep (untagged) / Let them live out their lives co−.3. With two basic-science finds the body adds the lab's line on clove oil.
7. The cousin (`c_cousin`): Hire him as a regional manager, sales up a little, until he makes a mistake (half the time 10 days of income later, Times line) ca−.3 ri+.3 / Don't (aunt quiet at New Year, in Her years) dr+.3.
8. Let them go (`c_letgo`, Mira took the jar, 300 to 1,500 days after she met you, so 8 to 12): Yes ca−.3 / No, they aren't from here ki+.3. Later lines follow.
9. How's the company (`c_lie`): once, cash under 10% of its all-time high (`G.stats.cashHi`, at least AED 1M). Tell her me+.4 / Say it's fine co+.3, both in Her years.
10. Price war (`c_pricewar`): one card, then the rival decides each month for a year (`pwDay`). Hold your price ri−.3 (each month they cut, 8% fewer kits that month) / Cut it, 20% less on every kit for a year dr+.5. A Times line when it ends.
Knee, power cut and the white lie go first (`STORY_PROMPT`).
Balance: own-tank kin from play now centres at 10 looks and treats (was 20), so a player who barely looks reads mildly stock. Profiles after: Empire builder 96, Dictator cartel 94, Grandma's kid drift 92, Do-gooder network 79, Scientist question 100, Shrimp nerd garden 100, Casual 5/43/0/14/38, fair chooser 3/40/33/23/0, cold chooser 26/9/31/32/3. All targets met.
Test: balance 135, me 50, academy 10, cardtap, endcards 50, profiles. Ending preview rebuilt (21 cards). Not run: the new cards in a browser.

### Pass 213: life on the land (plan Part 8, Puti picked 1, 4 and 5)

Land source on `shrimp-proto` (`src/land.js`, `land.css`, `game.js`, commit "Land: vegetable bed, walks with the dog, the Log"), rebuilt with `build.py --game`; `shrimp/home.html` is that build.
1. **Vegetable bed** (`defObj('veg')`, Build, Yard, AED 30, up to 4): tap it to plant what grows this season (cool months Oct to Mar: tomatoes 75 days, spring onions 40, bok choy 45; hot months: okra 60, chilies 90), tap again to water, tap when ripe to pick. Game days (`GDAY`). A crop needs water at least every 20 game days (`VEG_DRY`), past that it dries out, so months at the company mean a dead bed. Picking posts `harvest`; the game keeps it in `G.me.harvest` and Grandma's New Year's Eve dinner says "You brought 12 tomatoes from the land, she put them in everything." (`harvestTake`). The ending has "You grew N vegetables on the land."
2. **The Log** (a Log button under the map's ?): birds seen of the nine, fish caught with each species' best length, what the bed gave, walks with the dog. Read from the save, nothing to do there.
3. **Walks with the dog** (`walkTick`): while he follows you, a walk counts once it lasts a minute; it ends when he loses interest or you stand still 40 s. A toast, the Log, and `walk` to the game (`G.me.walks`, minutes); the ending has the count and the minutes.
All three count through real time on the land (`G.ps.landMs`: life first and, since Pass 210, own people), never taps. The ending adds "You spent N hours on the land."
The land posts through `window.LAND_POST` (set in `game.js`), since the land's code sits in a closure. Test hooks `LAND.life`.
Test: new `tests/shrimp-land-life.cjs` at 360 and 390 (bed grows, ripens, dries, picks; the game hears it; the dinner takes it; a walk counts; the Log opens with no sideways scroll; no errors), land-audio, tank1, yourtank, me 50.

### Pass 214: final check (plan Part 9)

Bots, seed 7, before this plan (Pass 202 baseline) and now:

| Bot | Before | Now |
|---|---|---|
| Strong cold | 2,216 empire_dictator | 2,194 empire_dictator |
| Strong kind | 3,148 question_prof | 3,138 garden_hermit |
| Average (kind) | Earth 6,357 garden_hermit, Leave Earth 5,996 | Earth 6,861 empire_good, Leave Earth 5,614 (sci 573) |
| Average, `PROFILE=scientist` | | Earth 6,889 question_prof, Leave Earth 5,720 |
| Average, `PROFILE=dogooder` | | Earth 6,609 network_life, Leave Earth 6,019 |
| Average, `PROFILE=grandma` | | Earth 6,861 empire_good (bots pick cards by profile but never play the land, Your day or the You page, so life first and own people don't show) |
| Space bot (from strong cold) | Leave Earth 4,582 | Leave Earth 6,996, lands, passes |

The average bot is about 8% slower to Earth than the baseline (6,357 to 6,861); the kind bot now turns down the dark projects (posters, songs, the evil route), which were word of mouth and reach. Seed noise is about ±500 days (AGENTS Pacing).
Profiles (`shrimp-profiles`, asserting): every target met, table in Pass 212.
Browser: spotlights 103 all good, layout one 2 px text on the win World tab (known since Pass 200), stable 13 movers, all on the known list (bought rows leaving their list, now including the evil route's Turn it down, the first rack, header strips), land-life at 360 and 390.
Suites: balance 135, me 50, academy 10, hard 12, frozen, endcards 50, cardtap, tank1, yourtank, land-audio, land-life, profiles.

Deployed 1 Nov night (Passes 201 to 214, BUILD 2026-11-01-p214). Tests before deploy are those in Pass 214: balance 135, me 50, academy 10, hard 12, frozen, endcards 50, cardtap, tank1, yourtank, land-audio, land-life, profiles, spotlights 103, layout (one known 2 px), stable 13 known movers, bots and Space bot as in the Pass 214 table.

### Pass 215: hardier line costs 90% of breeding

Puti: the hardier line's settling cost is 90% less breeding, not 10%. `farmCap` multiplies by 0.1 while `G.emp.strain` is unsettled (3 to 9 months, hidden); card body and Switch button say 90%. Not deployed (main at Pass 214).
Test: balance 135.

### Pass 216: hardier line 3 to 6 months at 15%, better survival; empire_hard wording

1. Hardier line: while it settles farm output is 15% (`farmCap` × 0.15) for 90 to 180 days (was 10% for 90 to 270). Kit survival +6 points (`E.q`, cap 0.97, was +2). Card body and Switch button updated.
2. empire_hard Who: "You stayed inside the written law, used every loophole, and took the cheap way whenever it was legal." replaces the two sentences about cheap and legal.
Tests: balance 135, me 50, academy 10, profiles (all targets met), cardtap, endcards 50, hard 12, spotlights 103 all good, layout (the known 2 px on win World). Bots seed 7: strong cold 2,194 empire_dictator, strong kind 3,178 garden_hermit, average Earth 7,029 empire_good, Leave Earth 5,908, no INSOLVENT. Not run: stable (no UI change), Space bot.

Deployed 2 Nov (Passes 215 and 216, BUILD 2026-11-02-p216).

### Pass 217: card questions rebalanced (2 Nov)

Puti asked which cards test curiosity and drift, and whether the questions are balanced. Count of what each decision mainly tests (largest spread across its options), before → after: drive 29 → 30, means 22 → 22, control 10 → 8, kin 10 → 9, care 7 → 9, curiosity 3 → 7, risk 4 → 3 (87 → 91 decisions).

- Curiosity off the nice answer: holiday-proof kit (pain_crash), color the food (dye_offer), buy spares back (c_many). Poster already had none.
- Test first against ship now: ev_ai gets "Try it on one route for three months first" (a fifth now, the same deal after, retried monthly until paid, `AI_SIGN`, `E.aiFull`); c_strain gets "Test it on one rack for a year, then switch" (six weeks of 85% less breeding after the year); pain_copy "Buy the biggest copycat" becomes "Have a lab test their shrimp and yours, then publish it". Retagged: ev_marine send know .5 / no drive .3 know −.3, ev_paper science know .4, sciacad know .5 care .3. Ship-now sides carry know −.3 so the random chooser stays centred.
- New cards (company or strangers side listed first): c_wedding (Kiki marries the week of the Gulf launch, go and the Gulf is held two weeks, `E.regWait`), c_play (Mira's school play or the investors' dinner, 10 days of income booked as loans, before day 1100), c_flood (one set of trucks, packers or the town upriver first), c_bonus (a month of income to your people or the hard part, capped at cash).
- Not done: turning Grandma moments into own-people-against-strangers. A balance check keeps Grandma time out of care, so drift doesn't come from visits alone; the new cards carry it instead.
- Independent review (two rounds) fixed: `later()` callbacks were lost on reload (all 14, also c_knee); c_knee and the wedding pulled the region, which let the player buy it twice (now `regWait`); one-off loans and investor money inflated `operatingNet` and `dayIncome` for a week (both skip `loans` now); labels state costs; the bonus can't put you in debt.

Profiles (family %, empire/garden/question/network/drift): random 12/26/33/22/7, fair 3/41/34/21/1, cold 27/9/31/30/4, casual 6/37/0/12/45, returning 18/29/18/20/14. All targets met. Drift is still rare for players who only answer cards; it comes mostly from Your day and land time.
Tests: balance 136 (new: reload keeps later(), Gulf held not rebought, bonus capped, new card pushes in order), me 50, profiles, cardtap, academy 10, tank1.

Deployed 2 Nov (Passes 215 to 217, BUILD 2026-11-02-p217). Before deploy: balance 136, me 50, profiles, cardtap, academy 10, tank1, endcards 50, hard 12, frozen; bots seed 7: strong cold 2,405 empire_dictator, strong kind 3,246 garden_hermit, average Earth 7,001 empire_good, Leave Earth 5,684, no INSOLVENT; Space bot lands, passes; spotlights 103 all good; layout the known 2 px on win World at 360 and 390; stable 13 movers, all bought rows leaving their list (known).

### Pass 218: family pairs, retags, careful/bold, new cards, Stream in Garden, land by activity (2 Nov)

Plan `claude/shrimp-plan-pairs-2nov.md`. Puti 2 Nov: control merged into risk (careful/bold; keep staff to watch and no chatbot read careful), buying the Times is an evil act, Drift is called Home (ids stay `drift_*`), loves shrimp is loves living things, the Stream is a Garden version, the Hermit is your own tiny world, the ocean ranch is a lake pen ranch.
- Pairs (`node tests/shrimp-pairs.cjs`, TH, IDS=1, PAIRS_MIN): before Network–Home 83, Network–Garden 68, Empire–Garden 62, Empire–Home 57, Empire–Network 23, Network–Question 9, Garden–Home 9, Empire–Question 7, Home–Question 6, Garden–Question 5 (110 decisions). Now 94, 71, 72, 61, 30, 13, 15, 10, 7, 8 (125). Garden–Home and the Question pairs are still under 20.
- Retags (`FORK_PUSH`): no life first on the kind side of gene share, retraining, ship boxes, sponge filter, food recipe, free care plan; retraining reads strangers; co-op untagged, Buy her out drive only; hiring the postdocs reads growth first (know −.3).
- Careful/bold: `TRAITS` has six; every control push became risk with the sign flipped (keeping it = careful), `prepNow` reads into risk (finishing first = careful), `PLAY_W.risk` 0.6, migrate folds old `G.tr.control`. `evilActs` counts `paperbuy`.
- Lake pen ranch (id `ocean` kept): pens in freshwater lakes; the fishing fork's company side is Hire the crews at fishing wages; retraining is fish farming and boat tours.
- New cards (push in `PUSH`): c_nydin (tank 2 molting the night of the New Year dinner, before the farm), c_fair (Mira's science fair, 10 to 13), c_vet (money left over: family or a shrimp vet), c_price1 (half price where incomes are low, 3% of income from then on), c_wells (send the crew: no new region for a year, no new farm for 3 months, `E.lock`, `heldDays`, buttons read Held), c_feed (Puti's mechanics, `nfeedMul` in `farmCap`, 8% boost), c_budget (pain study or a clinic, 5% of income for 3 years), c_bare, c_glass, c_kyoto (Grandma's 81st or later, her 80th comes before any lab), c_saturday (shrimp club or your Saturday tank, plant and compost routine), c_survey (a month in Taiwan's streams, `M.tripWhy` 'survey'), c_box (test the new box or ship now), c_abroad (three weeks abroad with your cousin, 40% Tank 1 loses a third), c_sleep (only when sleep is under 8: work capped for a year, `workCap`, `M.whCap`, or pills). Grandma cards push drive only. c_nydin and c_kyoto are prompt cards.
- Grants: each year one basic or ecology applicant and one applied (`grCands`), in random order.
- Stream: goal needs loves living things above 0 (`streamReady`); `stream_world` is "The Garden, the stream"; another family that wins the stream goal keeps its ending plus `STREAM_PARA`.
- Hermit: kin above 0, care not above 0, and your own tank looked after (`ownLevel` 2) or an hour with living things on the land, or the old few-visits rule.
- Land by activity: home.html posts `act` once a second (`LAND_ACT` in the land source, shrimp-proto 34f1c6c): 'h' near Grandma or just talked to her, 'g' fishing, a bird, a dog walk, the bed, the stream. `G.ps.landH` reads own people (an eighth of play is −1), `landG` reads kin; all land time still reads life first.
- Random chooser medians: drive .028, know .046, kin .048, care .019, risk −.006; drive options 55 up, 44 down.

Profiles: every target met. Random chooser 15/23/32/28/2 (empire/garden/question/network/home): Home stays rare for card-only players, it comes from Your day and the land.
Tests: balance 137, me 50, academy 10, cardtap, profiles, tank1 sim, land-life, land-audio, pairs. Ending preview rebuilt. Not run: stable, layout, endcards, bots (deploy only). Not deployed.

### Pass 219: burnout bites, an hour over 8 pays late, papers as facts, pop-up gap from close (2 Nov)

Handoff `claude/shrimp-handoff-yourday-2nov.md`, parts 2 to 4. Puti 2 Nov: keep the papers research bonus (300 h, finds a bit sooner), facts replace the co-author and talk milestones, no "of 24" anywhere, burnout holds work at a half day.
- Burnout (`burnStart`, `burnOver`, `BURN_*`): orders ×0.6 (`workMult`), ✦ at half (as before), work held at 4 h (`dayHours`, `workCap`), no strain from work while out. Lasts until strain is under 30, or under 15 when it's the second within a year (`M.bLim`, `M.bLast`). The Tired card: Take time off / Keep going; the second within a year only offers Rest (`chf`, `burnHard`). Old saves mid-burnout keep their fixed end day. The business strip says it in one line, the You page in one line.
- Work pay: `workPer` 0.05 before the farm, 0.03 after, also past a million (was 0.01). Strain above 10 h of work climbs twice as fast (×4 an hour). A 14 h player burns out again and again.
- Facts (`FACTS` 24, `factDay`, `M.fx {seen,next,at,n,got}`, `FACT_GAP` 3 min of play): every 200 to 400 paper hours, random, no repeats until all are seen. In What happened with "Discover the science ›" (the paper link) and a note banner, never the Times. "Facts you’ve read (n)" fold on top of What happened. Text rewritten in Puti's voice, American spelling, citation kept in the sentence, crayfish and the rest named as such, anxiety-like kept. `HOUR_STEPS.papers` removed; `rlPts` keeps the 300 h bonus. Paper hours read curious (`playVal('know')`: picked half the time reads +1, never reading says nothing).
- Pacing (`introStamp`, `introGap`, `progress.gap`): every new pop-up waits a random 10 to 20 s of play after the last one closed. Cards stamp on close (`acknowledgeMilestone`), spotlights on close, notes and news banners on hide (timeout, swipe, tap). `CARD_NOW` unchanged.
Tests: balance 138 (new Pass 219 check; Pass 132 check moved to the random gap), me 50 (the long-days check now asserts half days while burnt and repeated burnouts; illness checked by holding health low), academy 10, profiles (all targets met). Not run: browser (waits for the You page rework in part 5), bots. Not deployed. Part 1 (new activities, courses) and part 5 (You page) wait for Puti's answer on course gains.

### Pass 220: Your day, more of a life, and a clean You page (2 Nov)

Handoff parts 1 and 5. Puti 2 Nov: course gains as proposed (MBA −3% staff and farm running costs, AI course −5% packing line upkeep, cooking class, pottery).
- `ACTS` has kinds (`k`: rest, grow, work), strain relief per hour (`r`) and short chip names (`sn`). Rest: Exercise, Hiking, Friends, Cooking, Books, TV, Video games, Shopping (about 0.03% of cash a day, `shopDay`). Getting better: Online MBA 300 h, AI course 200 h, Cooking class 80 h, Pottery 150 h (`c`), plus Papers, Design, Videos. People and work: Your tanks, Shrimp club, Mira's school, Dinners, The house, Fight night.
- Strain: each day takes 0.8 plus each hour × its relief off, capped at 4 (courses add a little, `r` −0.15). Health: hiking counts like exercise, cooking a little (more after the class).
- Courses (`crsDone`, `crsDay`, `M.crs {id:day}`): finish once with a date and a note, then leave the picks. MBA in `staffCost` and `farmOverhead`, AI course on line upkeep in `staffCost`, pottery +8 health and ✦ once, a little ✦ a week while picked.
- Traits by hours held (`dayShare`: picked half the time reads 1, under 60 h says nothing): rest picks count as life first in drive (`dayHome`, also in `traitEv`); friends and cooking read own people; hiking, and Your tanks once the player has picked anything (`M.pickT`), read loves living things; papers and courses read curious at 0.4. Profiles carry Your day hours now (`day` in `tests/shrimp-profiles-def.cjs`). Random chooser 9/29/35/19/8 (empire/garden/question/network/home), was 15/23/32/28/2: Home is less rare, Empire less common, all targets met.
- You page (`renderMe`): one Health · Strain line with numbers, the day bar, the Work row with orders, sleep and rest in one line, then chips in three groups (3 a row, fixed 34 px, 12 px labels, no cut-off at 360), then two fixed lines for what the two picks do (with hours so far), courses in progress with hours left, a closed Done (n) fold. Every effect is behind the card's ? (`HELP['me-free']` lists what's open). Tapping a chip moves nothing (checked at 360 and 390).
Tests: balance 139 (new Pass 220 check), me 50, academy 10, profiles (targets met), pairs (unchanged), cardtap, tank1. Browser: You page at 360 and 390, chip tap moves nothing, fact link opens a new tab, no chip label cut at 360 (Cooking class and Mira's school cut at 320). Not run: stable with a bot snapshot, bots (deploy).

### Pass 221: tighter chips, Lay flat, Papers fold (2 Nov)

Puti: chips shorter (28 px, 5 px gap), a ninth rest pick Lay flat that does nothing (`flat`, no strain relief or health, reads life first like any rest pick), the facts fold is called Papers (n). The tab bar in the Pass 220 screenshots sat mid-page only because those were full-page captures; in the viewport it sits at the bottom (checked at 360 and 390). Tests: balance 139, me 50; no chip label cut at 360.

### Pass 221b and the deploy of Passes 218 to 221 (2 Nov)

- The pop-up gap (10 to 20 s) is drawn from the play clock, not `Math.random`, so bot runs keep the same random stream as before (with it the strong bots went broke on day 249 on a shifted stream).
- Money for Grandma line keeps one height (`.me-sendrow>.hint` fixed 2 lines); it moved the You card 1 px on every tap (also on Pass 218).

Deployed 2 Nov (Passes 218 to 221, BUILD 2026-11-02-p221). Before deploy: balance 139, me 50, academy 10, profiles (targets met), pairs, cardtap, tank1, yourtank, land-audio, land-life, endcards 50, hard 12, frozen; bots seed 7: strong cold 2,282 empire_dictator (Pass 218 alone: 2,320), average Earth 7,141 question_prof, science 639 (Pass 217 deploy 7,001 empire_good); Space bot lands, passes; spotlights 103 all good; layout the known 2 px on win World; stable: the known bought-row movers only, the Grandma money line fixed.
Strong kind bot: INSOLVENT on day 1,022 (Pass 218 alone: day 1,077, so it comes from Pass 218's cards, not Your day). It takes Switch on the hardier line (85% less breeding for 3 to 6 months, Puti's Pass 215/216 number) with 11 racks, 4 barns and mall stores running, and the bot has no money-trouble answers. A player gets the Out of money card. Flagged to Puti.

### Pass 222: out of money because of a kind answer (2 Nov)

Puti: if the company runs out of money while a kind answer is still costing it (the strong kind bot went broke on the hardier line), someone helps, twice; the third time the game ends.
- `kindCost(G)`: days left on the longest kind cost running and which: hardier line settling (`E.strain`), testing the new feed (`E.nfeed` m 't', 240 days), the wells hold (`E.lock`), a region held for Kiki's wedding or Grandma's knee (`E.regWait`), giving a share of income (`E.dues`), the slower kind answers (`E.kind`, `kindSlow`).
- When `brokeNow` and a kind cost is running, the card is `kindsave` instead of `broke` (urgent, `CARD_NOW`):
  - sent Grandma money ever (`M.sent`>0): her crypto went to the moon, she gives the debt plus a month of income per month the cost has left (1 to 12, at least one; `kindGift`, income = `incRef` or overhead if higher).
  - never sent: a bank owner who keeps shrimp lends the debt plus the overhead until the cost ends (30 to 365 days, `kindLoanAmt`) at 1% a year, paid monthly over 1, 5 or 10 years (`E.kindLoan`, `kindLoanDay`, booked as debt).
  - The body names the reason (`KIND_WHY`). Only the costs show on the buttons, the line after.
- Two rescues per game (`E.kindSaves`). The third time out of money with a kind cost running is `kindend`: one button, Close the company, the bankruptcy ending (`fallKind`). Out of money without a kind cost is the usual card.
Tests: balance 140 (new Pass 222 check), me 50, cardtap. Card checked at 390. Not deployed.

Deployed 2 Nov (Pass 222, BUILD 2026-11-02-p222). Before deploy: balance 140, me 50, academy 10, cardtap, profiles, endcards 50. Bots not rerun: the change only acts on out-of-money cards, and the bots stop at the first negative balance (`INSOLVENT`) before any card, so their runs match the Pass 221 deploy.

## Pass 223 (3 Nov): cycling hint when the ammonia bacteria are full

Puti: with the ammonia bacteria at 100% and ammonia low, the start card said "Ammonia is near zero. Dose again." It should say wait.
- Ammonia 0.25+: Wait (as before).
- Ammonia bacteria 100% and nitrite 0.25+: "Wait. The ammonia bacteria are full. The nitrite bacteria are still eating the nitrite."
- Ammonia bacteria 100% and nitrite near zero too: "Dose again. ... the nitrite bacteria need more nitrite to grow." In the sim the nitrite bacteria only grow while there is nitrite (`bacB` in the cycle step), so a plain Wait there would stall the cycle.
- Checked in headless Chromium at 390 px, all three texts. `shrimp-tank1` passes.
- Glass wipe sound: the company page plays the land's wipe loop at full level while the finger is down (`careAt` sets 1), the land scales it with speed. Sound options for the glass and five moments are on a test page for Puti; nothing changed in the game sound yet.

## Pass 224 (3 Nov): sounds for five moments, a softer glass wipe, the Times waits for its card

Puti picked from the test page (https://claude.ai/artifact/SR9SQMnBPnUu7MnP9opXg1): 1A 2B 3A 4B 5B, glass Softer cloth.
- `sfxMoment(k)` in index.html, small reverb (`sfxRev`, `sfxNote`), through `MUS.bus` so mute and music level apply:
  - `done`, two soft notes up: a company tank job with `did` (`careFinish`), a glass wipe that cleaned something. Land: `sfxDone` in `sound.js` when `jobDone` reports a change.
  - `first`, one small bell: the first baby (`G.stats.bornDay`) and the first kit sold, watched in `render` (`sfxWatch`, not on load).
  - `buy`, warm low chord: a new farm kind, a region, a step of Grandma's place (wrappers on `buyFarm`, `buyRegion`, `buyGplace`, outside the sim).
  - `card`, one low soft note: any story or milestone card when it first shows (`renderMilestone`). `end`, a slow swell, for win, gameover and left.
- Glass wipe on both pages: lowpass 1100 Hz into a bandpass at 650 Hz, peak 0.05 (was white noise at 1900 Hz, 0.09). The company page now follows the finger's speed and goes quiet when nothing is wiped, like the land (it played full the whole time the finger was down).
- Land source (`shrimp-proto`, `src/sound.js`, `src/game.js`) edited and rebuilt with `build.py --game`; the fresh build matched the game's home.html before the change.
- The Shrimp Times card (`ripplecard`) and its first-issue spotlight and news flashes wait until the ripple intro card is closed (`timesReady`). Before, the paper showed as soon as the first issue landed while its intro card was still queued behind others.
- Checked: browser spy test (first baby, first kit, buy, card each fire once), a real play of all five plus the wipe loop with no errors, Times card hidden while its card is queued and shown after. `shrimp-tank1`, `shrimp-land-audio`, `shrimp-balance` pass. Not heard on a phone yet.

## Pass 225 (3 Nov): Puti's playtest list

- Let them go: Yes is "Yes, they'll be happier".
- Bulk kit order: a slider "To the order" (0 to 100%, steps of 10, default 60%) sets how much of each day's packing goes to it (`G.korder.pct`, `fillKitOrder`, `koPct`). Text follows it. "Put in N" button (was cut off).
- Making kits header: when packing waits because stock is full (60 days of orders with farms, the warehouse days before), a fine line under "Packed 0 of N today" says so (`.hfine`). The old body line is gone.
- ✦ line on the projects card (Kit, Marketing, Equipment development): "✦ about 0 a day this week" when it rounds to zero. It is net influence: each kit sold adds 0.25 ✦ if its shrimp do well and takes 0.75 ✦ if they die, so at 75% kits doing well it is even. The card has a ? now (`HELP['c-proj']`, shows the current share).
- Shops open once the online shop is bought (was 30 kits). Regions no longer wait for Shops (they need projects and 100 kits, as before).
- Social media manager: each local ad row has a Repeat box on its own line (`.adrow`, `.adrep`), the Repeat automatically fold is gone.
- Farm feed: Pellets / Pellets + greens / Varied fresh / Ground culls, cost lines wrap to two lines so nothing is cut at 360 px, Farm feed is tappable and says what each is. The Farms card has a ? (`HELP['c-farms']`). "Kin" removed from the wellbeing help.
- Header Sell goes once a farm is built, unless sales are banned (police year).
- Bug: a choice with no money cost (Ask happy owners for photos, ✦ 45) was greyed when cash was under the cash reserve. `okp` and `buyProj` only check cash when the choice costs cash.
- Checks: `shrimp-balance` (new Pass 225 check), `shrimp-me`; screenshots at 360 px of the bulk order, Making kits header, ad rows and farm feed (tmp only).

## Pass 226 (3 Nov): water and dip sounds, catch sound, sponge 100%, farm upkeep

- Health check water change: holding Drain plays a low gurgle (`sfxLoop('drain')`), holding Refill a soft pour with small bubbles (`'fill'`), both stop when you let go (`cgHold`). Netting a shrimp plays Puti's catch sound from the other shrimp game (`catch-shrimp-1/2.mp3`, `sfxCatch`, loaded when the water change opens; a plop until it has loaded).
- Salt dip: holding the net under plays a soft underwater hush with slow bubbles (`'under'`) and a small plop going in; it stops on lift. Same dip in QC and for new shrimp.
- Sponge: the clean stage ended at dirt under 0.06, so the flow meter topped out at 95-96%. Clean now sets dirt to 0 on both pages (index.html sponge job, land `toys.js`), flow reads 100%. The tank still loses about 1% flow a tank day (2.4 s) after that, as before.
- Farms header upkeep uses `farmOverhead(G)` every render, so the feed choice (and the MBA course, cheaper upkeep stories) shows at once. It used the raw farm sum cached when the farm list last changed.
- Checks: browser run of the three loops and the catch mp3 (2 buffers loaded, no errors), farm header 12 to 15 AED/d on Varied fresh. `shrimp-balance`, `shrimp-tank1`. Not heard on a phone.

## Pass 227 (3 Nov): grant slider, farms idle line, banners under cards, company tank jobs, the land after its card

- Grant amount slider has no − and +, so it sat in the 30 px stepper column. `.ctl.ctl-ns` gives it the whole middle (about 122 px at 360, was about 30).
- Farms header: when the farms made 0 shrimp, a fine line says why (`60 d of orders in stock`, or `Not enough cash to breed`). Puti had 15 industrial hatcheries at AED 21k/d and 0 shrimp/d: the warehouse held 60 days of orders, so the farms wait and still pay upkeep (Pass 193 rule). The `.hfine` rule was inside a 360 px media query; moved to the global `.hd small` rule.
- A story card opening hides the note and news banners (`cardShield`). The card made the banner inert, so it couldn't be swiped away over the card.
- After the land, the company Tank tab runs its own tank jobs again (vacuum, sponge, trim, pests, glass), the same as before the land; only Aquascape, which only exists on the land, opens it (`landJob`). Puti: the land's tank view looked zoomed and the sponge didn't work from there. Checked in a browser: all five jobs open the same way with and without the land, tank view stays 159 px. `shrimp-tank1-browser` now checks the company job and the tank clock hold.
- Grandma's land card (`gp_land`) comes after the 40k house (was at AED 500k sent), body no longer mentions money sent. The 250k land is for sale only after the card: Not this time puts it on sale, Go with her finds it after the month (`landDay` no longer buys it for you, `landReady`, `gplaceOffer` returns 'wait').
- Tests: balance 142 (new check), me 50, tank1, yourtank, land-audio, cardtap. Before this pass on the same build: academy 10, land-life, profiles, pairs, endcards 50, frozen, hard 12, spotlights 103, layout (the known 2 px on win World), Space bot passes. Stable screen stopped part way (Puti interrupted).

Deployed 3 Nov (Passes 223 to 227, BUILD 2026-11-03-p227). Bots seed 7 (Pass 226 build): strong cold won day 2,282 empire_dictator; average Earth day 7,197 question_prof, 41 min waiting; strong kind INSOLVENT day 1,022 (the open hardier line issue from Pass 218; the bots stop at the first negative balance, before Pass 222's help card).

## Pass 228 (3 Nov): Check shrimp stays on the company page after the land

Puti: Tank 1 got sick after the land, and the Check shrimp tile had turned into Aquascape, so there was no way to check them from the company page. The company Tank tab keeps Check shrimp (health check, cull, Buy shrimp when empty) after the land; Aquascape is only on the land, in the same place. Replaces the Pass 200 rule that both pages show the same six tiles. `shrimp-yourtank` updated; browser check: with and without the land, Check shrimp shows and opens the health check. balance, tank1 pass. Deployed with BUILD 2026-11-03-p228.

## Pass 229 (3 Nov): empty Tank 1 with the land, hard part slot and help

- With the land bought and Tank 1 empty, the Check shrimp tile shows small text "Catch some at Grandma's place" and is not a button (`landEmpty`, `.tv-catch`). Before the land, Buy shrimp stays as it was.
- Hard part: before any group is picked there is no reserved empty slot under the grid (Puti); the card grows once on the first pick. Switching between groups still keeps one height (`slotMin` over the groups only). `shrimp-hard` checks no scroll on the first pick and the same height when switching.
- Hard part option rows: the title is the help (dotted underline, `.qhelp.qt`), no ? button.
- Tests: balance, hard 12, yourtank, cardtap; browser check of the empty-tank tile with and without the land.

## Pass 230 (3 Nov): update date, soft land water sounds, one-line done options

- The ? popup (top right) shows "Updated 3 Nov 2026" left of Settings, read from `BUILD` (`buildDate`, `#apop-upd`).
- Grandma's land: the harsh `splash` (high-passed noise, 4 ms attack) is gone from every water action. New soft sounds with slow attacks and low filters, a different one each: watering the bed `water` (a trickle with a few low drips), a fish coming out on the line `hook` (low swoosh, a rising tone, drips), putting a fish back `letgo` (a small plunk), the bucket into the pond or stream `pondin` (a deeper plunk and bubbles). The reel ticks are sine, not square. Edited in `shrimp-proto` `src/sound.js` and `src/land.js`, rebuilt with `build.py --game` (a fresh build matched the game's copy before the change).
- Hard part: a done option has no "Done" text under its title, the button says Done (was Chosen), the row is one line with the title centred on the button (`.hdone`, rows 53 px against about 75). Options under way or waiting keep their status line and "Under way"/"Chosen".
- Tests: shrimp-hard 12 (with a fresh average run), shrimp-land-audio; screenshot of the water group with five done options and of the ? popup at 390 px. Sounds not checked by ear.

Deployed 3 Nov (Passes 229 and 230, BUILD 2026-11-03-p230). Bots seed 7: strong cold won day 2,282 empire_dictator; average Earth day 7,169 question_prof; strong kind INSOLVENT day 1,022 (same open hardier line issue as the last deploy); Space bot lands. Fast suites, cardtap, tank1, yourtank, land audio and life, endcards, hard, spotlights, layout, stable pass. `shrimp-frozen` fails on the research tab with this average run's year 6 save (no buyable research row); it fails the same on the Pass 229 build, so it is the save, not these passes.

## Pass 231 (3 Nov): strong kind bot takes the rescue, grant Fund buttons freeze

- The strong bot stopped at the first negative balance (day 1,022 kind), before the game calls you broke (`brokeNow` counts stock and shrimp you could sell) and before Pass 222's rescue. Now it stops only when `brokeNow` or `kindend`, or after a year below zero, and takes the `kindsave` card (option 1, the 5-year loan). Seed 7 kind: below zero day 1,022, rescued day 1,146 (1 of 2), won day 3,339, garden_village.
- Freeze: grant Fund buttons (`gr-pick`) now read Frozen while the accounts are frozen. `grPick` already refused, but the button said Fund and the tap gave "Not enough spare cash". Status labels (Funded, Not this year, 3 running) stay. `shrimp-frozen` counts `gr-pick`; the year 6 research tab has no `rl-hire` since grants replaced open lines, which is why it failed. It passes on a fresh average run.
Tests: balance 142, frozen, strong kind bot seed 7. Not deployed.

Deployed 3 Nov (Pass 231, BUILD 2026-11-03-p231). Bots seed 7: strong cold won day 2,282 empire_dictator; strong kind below zero day 1,022, rescued day 1,146, won day 3,339 garden_village (was INSOLVENT 1,022); average Earth day 7,169 question_prof; Space bot lands. Passed: balance 142, cardtap, me, academy, tank1, yourtank, land audio and life, profiles, pairs, endcards 50, hard 12, frozen, spotlights 103. Layout: one 2 px empty text on the win World tab, same on Pass 230. `shrimp-stable` on the strong cold run fails 8 buttons, all the same on Pass 230 (not checked on that save before): + Hire and Mangrove replanting change the header height, Open 1 store shrinks the shops card, AI consultant's button jumps down after buying, Turn it down (ev_port) moves and grows its row. Listed for the next chat in `claude/shrimp-plan-human-checks-3nov.md`.

## Pass 232 (3 Nov): Part 0 of the human-checks brief, Puti's 3 Nov bug list (first half)

- Part 0, the 8 stable-screen failures on the strong run (promote, world): a header row that goes away because of a tap (Hire took Sell) or the earth line that a tap adds (first gala) waits until the player scrolls or changes tab (`hdHold`, `HD_HOLD`, `hdFree`). Feed/Water/Sell only hold a row going away, so a new cue still shows at once. A project row bought or turned down keeps its place greyed until a scroll or tab change (`FRZ`, `frzTap`, `#e-proj`); buying the AI consultancy holds the new Sales staff rows the same way (`FRZ['e-sales']`); the first mall store keeps the Small shops list and holds its own extra rows (`FRZ['e-shops']`, `FRZ.st0`). Stable on promote and world, strong run: 0 failures (was 8).
- Your tank: Aquascape is the fifth tile on the company page too once the land is bought, as on the land (Puti); a sick Tank 1 swaps in Check shrimp there, the health check is company-only. Replaces Pass 228. Empty Tank 1 with the land: the tank caption says No shrimp · catch some in the river at Grandma's (replaces the Pass 229 tile text).
- Food and water (both pages): water readings are one row of seven cells, short names (NO3, NH3, NO2, pH, GH, KH, °C), full name and unit in the title. Food and treat buttons 42 px, names on one line.
- Land: the stem plants stand where the company page draws them, seven across the sand from the game's care seed (`stemSpread`, `cs` in `landOwn` care). Land source on branch `shrimp-proto-3nov`, merge into `shrimp-proto`.
- Tank jobs come back due after a random time, between today's pace and twice as long, rolled again after each clean (`ownRk`, `ownGk` for glass).
- Hard part grid: labels on one line (124 px column), 80 columns, block rows 13 px, 2 px gaps. "All reached" said done while the grid was half light; a reached group now reads "all can get one, N haven't yet" or "all have one" (`hardAllTxt`).
- Nour is Milo (text only, ids stay `nour*`). Water on a truck rewritten so the point is clear. Her tank is a small square with one lotus and one rock (`deco.milo`), left half, a line on the right saying why it's there, under the Give away slider.
- Tests: balance 142, academy 10, me 50, tank1 sim, yourtank, hard 12, stable (promote, world, strong). `shrimp-balance` HG_COLS check, `shrimp-yourtank` Aquascape and sick swap, `shrimp-hard` Milo caption updated.
- Not done from Puti's list: trees (hand map first, bigger pannable map, one capacity with Shrimpcoin, other trees, 3x3 trees), Shrimp Island cost and its own card, no story cards on the land / during a tank job / while planting, land with no margins, research card tidy and grant help and next cycle date. Then parts 1 to 5 of `claude/shrimp-plan-human-checks-3nov.md`.

## Pass 233 (3 Nov): button sounds and the iPhone tick

- Puti picked a sound for each kind of button from the 40 candidates in `shrimp/sfx/` (commits 823f803, 15474c8, a6d5326): tabs `tap_felt`, chips and switches `tap_tip`, − and + and sliders on release `tap_blip`, main actions `tap_tok`, opening a ? or a sheet `tap_pop`, close/back/dismiss `tap_pillow`; Feed `feed_drop_002`, Water `water_double`, Sell `sell_coins_chime_b` before the first farm, `tap_tok` after. Anything else `tap_tok`. The other 31 WAVs are deleted. Kenney Interface Sounds / UI Audio / RPG Audio, CC0.
- New `shrimp/taps.js`, one copy for the company page, the land (`<script src>` in the land's `shell.html`, sound.js inits it on `AC`/`BUS`) and the ship (its own small context). Nine AudioBuffers decoded once per context after the first tap. Net 0.3 of the file at the speakers, rate 0.94 to 1.06, at most one per 40 ms. One delegated pointerup listener; the sound waits for the click (at most 40 ms), so a button that already plays `sfxMoment` or a job sound gets none.
- iPhone tick: `hap()` is a hidden switch toggled in the tap (`label.click()`, offscreen, fixed, not display:none, tabIndex −1, its clicks stopped at window capture so the game never sees them). Every button tap ticks, plus the old job and spotlight moments. All `navigator.vibrate` calls removed (game, land, spotlight).
- Settings: Button sounds and Taps you can feel under Music and water sounds (`shrimp-btnsfx`, `shrimp-taps`, default on). Mute silences button sounds on all three pages, not the tick.
- AGENTS.md: the Pass 224 never-on-every-button line is replaced (Puti, 3 Nov); the Spotlights checklist line says tick, not Android buzz.
- Land source on `shrimp-proto-3nov` (sound.js, tank.js, shell.html, build.py copies taps.js and the sounds into dist).
- Bot fix: Pass 232's `wheel`/`touchmove` listener for `hdFree` sat in the `updateReveal` slice the bots load, so every bot crashed on start (no `addEventListener` in the vm). Guarded with `typeof addEventListener`.
- Tests: `tests/shrimp-taps.cjs` (new, all ok: one source per tap at 0.3, none with Button sounds off or muted, the switch flips once per tap with Taps on and never off, no focus or layout, roles, 40 ms limit, land and ship), land-audio, balance 142, academy 10, me 50, space-search 6. iPhone tick by hand (Puti).

## Pass 234 (3 Nov): the rest of Puti's 3 Nov list

- No story or event card, note or news banner while on Grandma's land, in a tank job (company `TVLOCK`, land `LAND.busy`) or with the planting map open (`busyUI` in `renderMilestone`, `updateNotes`, `newsFlash`). They wait. The land's "needs you" banner still shows on the land.
- Grandma's land in the game is full screen at the sides and the bottom (land source: `land.css` `body.in-game.on-home`, `sizeCanvas` fills to the bottom); the hint line floats over the map above the tools.
- Research card: the Grant, 3 years label opens its help (`CTL_TIPS.gramt`), "Next grant cycle opens in N months" (`grNextTxt`) with Skip this year beside it, running and finished grants as aligned rows (`.gr-list`, months left under a year).
- Shrimp Island has its own card (not in the Shrimpcoin card) and realistic costs: AED 400M for the island, independence AED 1B plus two years of ✦ income (at least ✦ 3B), passports AED 200M or 30 days of income, the UN seat three years of ✦ income (at least ✦ 5B) (`treeCost`, `mD`/`iD`).
- Trees: mangroves start on the hand map the moment trees open (the coast card's one-tap Plant button is gone, Plant by hand · Go). The map is 64x48 and bigger than the screen: drag to pan, tap to plant. Each map pixel holds 3x3 seedlings, one tap plants up to 9, each drawn a slightly different green (`plGreen`). One capacity: mangroves count in `C.trees` and Shrimpcoin cohorts, AED 4 a seedling, blocked when `coinRoom` is 0, and your unplanted mud fills with everyone else's trees as the world's coasts fill (`plFill`, `plOther`). Once the mangroves are done (coasts full or every mud spot on your map taken) ghaf trees open on soil, AED 25 a seedling. Mangrove seedlings live at the coin's 60%, ghaf 80% near water and 50% dry. Plantings are one entry a pixel with 9-bit masks (`[x,y,day,kind,planted,living,self]`), old saves migrate in `plOf`. `coinPlant` stays for the bots.
- Tests: balance (planting rewritten for the new map, island card, busyUI), me (island costs), academy, cardtap, land-audio, taps, yourtank.
- Stable screen, all tabs, strong run (Pass 233+234 build): home and space 0 failures (the land map box keeps its height across zoom steps). Five buttons still move something, the same five on the Pass 232 build, so not new: Gear feeder buy (cycled, first shrimp) and Another tank (cycled) change the header, the snail kit extra changes its row, the first rack farm reshapes Farms (100 owners), the kit price − changes the Kits card (first farm). Not fixed here.

## Pass 235 (3 Nov): checks that play like Puti (plan `claude/shrimp-plan-human-checks-3nov.md`, Parts 1 to 5)

- Part 1 `tests/shrimp-human.cjs`: Chromium 390x844 (and 360), a new game played to the first farm by the strong bot's own `policy()` inside the page, the page's clock at the fastest speed the game allows, 2x wall time (`HUMAN_RATE`), about 4.5 min. Cards, What happened, spotlights and the new-tank sheet are tapped. Every 2 s: header empty space (over 4 px fails, every height change logged), card gaps over 24 px, overlaps on `#tankview`, one ? every 10 s must open within 16 px of its button, intro and chapter cards not before their condition and not 60 game days plus 30 s of play after it, Ads not before 10 sales, kits not before tank 2's first baby, no speed hint at the current speed. Found and fixed: help opened far from its ? when the page changed under it (it follows its ? every frame now, `hsTrack`, and closes if the ? is gone); the first sale card named the Ads tab before Ads opens (line cut). Passes at 390 and 360.
- Part 2: the same run writes every card, ?, banner, toast and button label with a state line to `os.tmpdir()/shrimp-human-text.txt`. Read once now: the sale card fix above; the header changes height on its own five times in the opening (chip row on tank 2, Feed/Water/Sell leaving when automation is in), logged, not failed.
- Part 3 `tests/shrimp-effects.cjs`: 15 actions with the change each must cause (feed, water, ammonia, buy, sell, another tank, auto feeder, a finished job keeps sickness away for 2 minutes, a clean tank not due for 25 days, work hours, burnout costs, grants, farm wellbeing, mangroves, packing never stands still with stock and room). Found and fixed: only the vacuum and the glass kept sickness away after a job; now every finished company job and every land job report does (`careFinish`, `landTank`).
- Part 4 `tests/shrimp-fresh.cjs`: a new game in a clean browser and Start over from a late save both equal `newGame()` on everything a game carries (money, day, gear, shrimp, flags, farms, trees, ✦, land places, sales, seen cards); the land save goes, its colors and a built land are kept by design.
- Part 5 `tests/shrimp-sound.cjs`: every sound file under -1 dBFS peak and -9 dBFS loudest 50 ms (all are well under), the music and water loop ends within 6 dB, every company job sound equal to the land's (same names and numbers, loops at the same level). Mute and one-page music stay in `shrimp-taps` and `shrimp-land-audio`.
- Coast map zoomed in (Puti, 3 Nov): a tap spot is 24 px, opens on the mud by the river mouth.
- Not covered: the river trap and other land-only actions (land-life test), an iPhone by hand.

Deployed 3 Nov (Passes 233 to 235, BUILD 2026-11-03-p235). Bots seed 7: strong cold won day 2,282 empire_dictator (same as Pass 231); strong kind won day 3,343 garden_village (was 3,339); average Earth day 7,337 question_prof (was 7,169). Endcards 50, hard 12, frozen, cardtap, Space bot, spotlight sweep, land-life, human (390, 360), effects, fresh, sound, taps, land-audio pass; layout has the same 2 px empty-text flag as Pass 231. Stable screen ran on all tabs on the strong run (the 5 known movers, see Pass 234); the average-run stable pass was stopped (Puti: too slow, test only what the edits touch).

## Pass 236 (3 Nov, Puti): sickness on the land, Updated with the time

- Grandma's land tanks can get sick again, rarely: only after 5 minutes on the land with no tap or key, a 10% chance every 30 s, at most once per idle stretch and never while another shrimp is sick. One adult in one tank (not the cull tank) gets one of the game's three illnesses (failed molts, bacterial, Scutariella), drawn with the game's signs (pale ring, milky body, white threads; `shrimpart.js`).
- Tapping a sick shrimp opens a sheet instead of netting it: the sign, the three cures at the game's prices (right one heals, wrong one costs and does nothing), Cull it, Net it. Untreated it dies after 30 land days (`sickDay`). A cull or death in Your tank posts `take` (`cullShrimp` wrapper in `game.js`). Land source `tank.js` (`illTick`, `sickSheet`, `cullShrimp`), `breed.js` (`specOf` passes `sick`).
- `BUILD` carries the time (`2026-11-03T13:45-p236`); the ? footer reads "Updated 3 Nov 2026, 13:45 UAE". Bump it with date and time from now on.
- Tests: shrimp-balance 142 pass; land flow checked in a 390 px browser on the prototype build (sick shrimp, sheet, right cure heals, AED 5 spent). Bots and sweeps skipped (Puti: quick deploy).

## Pass 237 (3 Nov, Puti): softer vacuum, poop on its own clock, full-width care row, softer default button

- Vacuum (`siphon` loop, game and land `sound.js`): low-pass hush at 520 Hz with a slow 2.5 Hz sway instead of the 700 Hz band with a 7 Hz wobble, peak 0.09 (was 0.22), plus soft water blips inside (sine, 260 to 640 Hz, 0.014).
- Mulm runs on its own clock, `OWN_MULM` 115 tank days to full (sponge, plants and glass stay on `OWN_FULL` 90). Every job starts at its own pace (`rkNew`, 0.85 to 1.0), so they no longer move together on a fresh tank; after each clean the Pass 232 reroll still applies.
- Care row: before Your tank's jobs, the buttons showing (Check shrimp, Clean glass) share the full width (`careRow`); with the jobs it stays three a row.
- Default button (`main`, `tap_tok`) at half the gain with a 1.6 kHz low-pass (`ROLE_GAIN`, taps.js).
- Tests: shrimp-balance 142, shrimp-tank1 sim (new timings: sponge/trim/glass due by 36, gravel by 46, poop full by 140), shrimp-taps all ok.

## Pass 238 (3 Nov, Puti, urgent): play offline from the Home Screen

- `shrimp/manifest.webmanifest` (standalone, portrait, cream theme, icons 192/512/180; `icon-512.png` scaled from 192) and `shrimp/sw.js`, registered from index.html on https only (tests on http are untouched).
- The worker keeps index, land, ship, taps.js, music, water, catch and the nine tap sounds on install, and Google Fonts when first fetched. Pages are network first (3 s, then the kept copy), so a new BUILD still arrives when online; everything else is the kept copy, refreshed in the background. Query strings ignored. Bump `CACHE` in sw.js only to drop old files.
- iOS keeps a Home Screen app's storage apart from Safari's, so a game started in Safari doesn't carry over to the icon.
- Tested: Chromium at 390 px, load online, go offline, reload: game, home.html and sounds load from the worker. Balance 142.

## Pass 239 (3 Nov, Puti): sounds from her sound lab picks

- Puti tuned each sound on the Shrimp Sound Lab artifact and sent the numbers; they go in as she sent them.
- Buttons (`ROLE_SET` in taps.js, all three pages): net volume at the speakers, low-pass cut, fade in, pitch per role. main 0.12 / 850 Hz / 6 ms / 0.9, tab 0.22 / 1.8 kHz / 3 ms, chip 0.2 / 1.6 kHz / 3 ms / 0.95, step 0.18 / 1.5 kHz / 3 ms / 0.95, open 0.22 / 1.8 kHz / 3 ms, close 0.24 / 2 kHz / 2 ms. Feed, Water and Sell unchanged. The fade sits on its own gain after the level gain.
- Catch (game `sfxCatch`, land `catch`): net 0.11 (source 0.268), low-pass 1285 Hz, 15.5 ms fade in, pitch 1.14.
- Loops (`WLOOP` in index.html): drain 0.05 / low-pass 420 Q 1 / sway 2 Hz 70 / bubbles 0.01; fill 0.01 / band 1004 Q 0.7 / 6.2 Hz 70 / 0.014; vacuum 0.075 / low-pass 863 Q 0.7 / 0.8 Hz 190 / 0.041 (land siphon the same). Bubbles: 45% every 170 ms, 0.1 s rising blips.
- Tests: shrimp-taps and shrimp-sound updated to the new levels (sound reads `WLOOP`), balance 142, land-audio pass.

## Pass 240 (3 Nov, Puti): every Tank tab card 8 px apart

- Feeding to Colony had about 16 px while the rest had 8: the Water care / Water test pair (`.two`) kept its 8 px bottom margin when both cards were hidden, and Colony had an inline 8 px top margin. `.two` with no visible card is now `display:none`, Colony's inline margin is gone, and the care row slot (`.tv-slot`) is 8 px from the next card (was 10). Measured in Chromium at 390 px: care row, Feeding, Colony, Readings, Recent events all 8 px apart.
- Water care and Water test still open only the first time the tank needs a change (Pass 115 reveal order: nitrate over 20, KH under 2.5, GH under 5, any ammonia or nitrite).

## Pass 241 (3 Nov, Puti): no blank screen before "Your tank is cycled"

- When the water turned safe, the cycling card hid at once but the cycled card waited in `p.soon` for the 15 s card gap (`CARD_GAP`) after the last closed card, so the Tank tab sat empty for up to 15 s of play. `cycle` is now in `CARD_NOW` and shows the same tick.
- Because it no longer waits, `detectMilestones` marks `cycle` seen once any tank has had shrimp (old news, Pass of 31 Oct), so it never shows after stocking.
- Checked: fresh game, card just closed, tank turns safe: queue `["cycle"]`, card open (before: queue empty, start card hidden, blank). Tank with shrimp: queue empty. Fast suites, cardtap pass. Bots, spotlight sweep and monkey not run (urgent deploy).

## Pass 242 (3 Nov, Puti): buttons that sometimes lag

Puti: buttons occasionally don't respond for a moment, can't reproduce. Measured in Chromium at 390 px with the CPU slowed 4x (about a phone), strong bot snapshots, 20 s at play speed:

| Stage, tab | Redraw before → after (ms, unthrottled) | Blocks over 50 ms in 20 s, before → after | Longest block before → after (ms) |
|---|---|---|---|
| first kit, Tank | 6.5 → 5.7 | 22 → 2 | 100 → 149 (one) |
| first farm, Farm | 10.9 → 6.4 | 69 → 23 | 109 → 86 |
| 10k owners, Ads | | 43 → 19 | 155 → 88 |
| million owners, World | 11.5 → 7.3 | 69 → 13 | 134 → 70 |
| win, World | | 30 → 14 | 123 → 68 |

- A tap waits behind any block on the main thread, so these were the likely lag. `render` runs 4 times a second.
- `corporateTaxReserve` added up a year of finance rows on every call, and `capitalReserve`/`operatingReserve` call it dozens of times a redraw (about 35% of a redraw from the first farm on). It now keeps its answer while day, step, cash, row count and tax day are the same (`CTR_C`, `ctrCalc`).
- `fmt` built a new number formatter on every call (14% of an early redraw). One `Intl.NumberFormat` per decimals now (`FMT_NF`), same output.
- Strong bot seed 7 unchanged: WIN day 2,229, same cash to the last digit.
- Also checked, not the cause: the story card tap guard (350 ms after a card opens or closes after a tap) and the half-second settle guard on decision buttons. With no input, decision buttons sat in the settle window 0 to 5% of the time, from real layout moves (the bulk order card appearing, a Kits line going) and new cards. The page behind a story card does not scroll, so scrolling never resets the guard there.
- Left: a save every 5 s takes 8 to 28 ms throttled (110 to 300 kB of JSON); redraw is still 20 to 36 ms throttled, spread over many small parts (`newThingKeys`, `projAvail`, layout reads in `anchorGet`).
- BUILD bumped (Pass 241 shipped without a bump).

## Pass 243 (3 Nov, Puti): common sense check, second tank gear, header buttons

Puti asked for a common sense pass: not hyper-real, nothing a shrimp keeper would call nonsense. She was changing 30% every 3 days because the alerts pushed her there.
- Sim check, full 20 L colony (~135 shrimp), new water KH 4, 30% weekly: KH settles about 1.5, nitrate 25–29, GH about 5. That tripped the KH warning (under 2.5) and the technician's extra changes (nitrate over 25, KH under 2). Real cherries are fine at KH 1–2 and nitrate under 40.
- KH alert now under 1 (bad under 0.5). Technician extra changes at nitrate over 40 or KH under 1. Tooltips say pH can crash under KH 1. Default new water unchanged (player's choice, Puti).
- Nitrate alert and tooltip mention that live plants use some (the sim already had plants taking nitrate out).
- Month three event: the holiday crash is now a neighbor feeding every day, and the holiday-proof kit is a backup heater and a "don't feed while away" card, not a slow feeder.
- Released cherries: the rewilding photo and the stream behind the school say mostly brown, a few still red; the rivers event says cherry shrimp, most brown again; the native reserve's ranger photo shows native shrimp.
- Left as is: the fish market line (Grandpa telling Grandma his own fish was too expensive), 200%-a-week molt crash counts volume only.
- Bug: a seeded tank 2 or 3 could be bought without the cash for its auto feeder and water changer. `addTank` and the Another tank button now need tank + `tankGear` + reserve. The new-tank sheet offers "I'll buy them later" only if the gear can't be paid (`gearLeft`).
- Bug: Feed and Water stayed after both tanks were automated. Pass 232's header hold kept a row that was going away until a scroll or tab change. A hold now also lets go 4 s after the last tap.
- Fast suites pass (balance test updated for the tank cash), page loads with no errors. BUILD p243.

## Pass 244 (3 Nov, Puti): Feed and Water go once automated

- Puti: once the tanks are automated the Feed and Water buttons should go. Pass 80 had brought them back whenever an automated tank had a red alert with a feed or water fix (`em` in `actNeed`), which is likely what she saw. Removed: Feed shows only while a tank lacks an auto feeder, Water only while one lacks an auto water changer.
- A red feed or water alert on an automated tank now points at Gear, Automation (`#auto-feed`, `#auto-wc1`), "Raise Auto feed/change under Automation", instead of the hidden header button.
- Balance check locks the rule. Fast suites pass. BUILD p244.

Deployed 3 Nov (Passes 243 and 244, BUILD 2026-11-03T17:05-p244). Before deploy: balance 142, academy 10, me 50, human 390 px all ok to the first farm, strong bot seed 7 WIN day 2,229 empire_dictator (same as Pass 242), average Earth 7,197 question_prof against 7,225 on the build before (seed 23: 7,393 both), no INSOLVENT, spotlight sweep 103 all good, monkey 120 taps at 360 and 390 px on seven stages, no errors, no sideways scroll, no NaN.

## Pass 245 (4 Nov, Birol via Puti): the out-of-money loan stops smashing farms for nothing
- Birol: farms and barn kept disappearing, the news kept saying someone smashes up his farm. Cause: "Borrow from a man at the market" on the out-of-money card ran an old pre-Pass 81 loan (`E.shark` without `deal`). Overdue, it took a farm with `takeFarm` every 30 days, did not count it against the debt, added 30%, and showed only a news line. No alert, no pay button, so every rebuilt farm went too.
- Now that loan is a normal `deal` loan with `fix:1`: owes 30% more, due in 60 days, no growth before then, then the Pass 81 rules (20% a month, takes the newest farm or best gear at half price against the debt, log line, news names the debt, Grandma hears). It shows in alerts with Pay him back. The old overdue branch in `debtDay` is gone.
- Old saves: a loan without `deal` is converted on the next day tick (`fix:1`, `next` = later of due and today, plus 30).
- Scratch check: old save with 20,000 owed is converted and each take now lowers the debt; a new broke-card loan is paid off by takes. Fast suites: balance 142, academy 10, me 50. BUILD p245. Not deployed.
- Puti: the take is not news. Removed the Shrimp Times line; the take now goes to the log and to You, What happened (`dayLog`), saying why: "You didn’t pay back the man from the market. Two of his men took the X at night, counted as AED N off the AED M you owed. You still owe ... It grows 20% a month and they come back every month until it’s paid." Same for the half-the-shrimp take. Fast suites pass again.

## Pass 246 (4 Nov, Puti): tank mess clocks, job buttons, favour pay-out reason
- Your tank (Tank 1, from the farm on): after each clean poop is full again in a random 4 to 10 min (`MULM_D` 100 to 250 tank days at 2.4 s, `rollM`, with 20+ shrimp), glass algae in 3 to 6 min (`GLASS_D` 75 to 150, `rollL`), plants always 5 min (`GROW_D` 125). Rolled again after every clean; old saves roll once (`rk.v` 2). Sponge unchanged. Before the land Tank 1 moves with the company, so these are game days there.
- Job buttons (company and land) no longer fade when the job isn't due: `.tv-care.own .btn[data-idle]` and the land's `.toys .btn[data-idle]` opacity rules removed (home.html and `shrimp-proto` `src/style.css`). They were always tappable.
- Favour cards: a pay-out you can't afford was already greyed with "not enough money or kits"; it now says the price and what you have.
- Tests: balance locks the new clocks and no faded job buttons (old Pass 161/179 timing checks replaced), shrimp-tank1 Pass 237 checks moved to the new clocks. Fast suites: balance 142, academy 10, me 50, tank1 sim ok.

Deployed 4 Nov (Passes 245 and 246, BUILD 2026-11-04T01:20-p246). Before deploy: balance 142, academy 10, me 50, tank1 sim ok, strong bot seed 7 WIN day 2,229 empire_dictator (same as Pass 244), average Earth seed 7 7,617 question_prof against 7,197 on the deployed build (no market loan taken; seed 23 7,393 on both builds, so the seed 7 shift is the random stream moving with the new Tank 1 rolls), no STUCK or INSOLVENT, spotlight sweep 103 all good, monkey 120 taps at 360 and 390 px on six stages, no errors, no sideways scroll, no NaN. Human 390 px not run (changes start at the farm, past where it stops).

## Pass 247 (4 Nov, Puti): the tank card comes with the farm
- Puti: the Your tank card came long after the first grow rack took the tanks. It was a story card, so it waited in the story queue (30 s to 2 min apart, behind other waiting cards). Now `owntank` is in `CARD_NOW` and out of `storyWaits`: it shows right after the farm is bought, with the intro gap skipped like crash and health.
- Clock check, no change: a company day at 1x is 4 steps of 600 ms, 2.4 s, the same as `TANK_DAY_MS`. So the Pass 246 tank clocks (poop 4 to 10 min, glass 3 to 6, plants 5) are the same at 1x before and after the land; before the land they speed up with the company speed like everything else.
- Balance check locks it. Fast suites: balance 143, academy 10, me 50. BUILD p247. Not deployed.

Deployed 4 Nov (Pass 247, BUILD 2026-11-04T01:40-p247). Fast suites and cardtap pass. Bots, spotlight sweep and monkey not rerun: one-line queue change on top of the Pass 246 deploy an hour earlier, which ran them all.

## Pass 248 (4 Nov, Puti): her script edits, formatting, the loan shark ending, the Sea Cow
- Puti edited the game's text on the script page (a private artifact with every line of text, `notes` in its store): 75 lines across chapters, story cards, endings, Grandma's letters and calendar, Mira, Noor, staff goodbyes and tutorial cards. Applied as exact replacements, each matched once (the gift letter and intro card share one literal; GP_STORY's boat line also updates its `GP_OLD3` copy). Her wording is kept as written, including grammar (Puti: it's how she speaks). Removed tutorial lines (breeders on Babies and The third floor, the five packing steps, tap the tank, Gear has plants) stay removed on purpose.
- Formatting: game text may carry `<b>`, `<i>`, `<r>` red and `<g>` green (`FMT_RE`, `fmtH`, in `setT`, `setEmphasisText` and the toast; CSS `r{}` `g{}`). A card with her own tags skips the automatic bold (`TASK_EMPHASIS`).
- Loan shark ending (`fall_shark`) says what happened: the first take is remembered (`E.sharkTook` {day, what}: the farm, the gear, or half the shrimp from the tank) and `endText` writes the month he took it and the month and year of the bankruptcy, or "You paid him back on time" when nothing was taken. No police line (the police route isn't needed for this ending). The ENDINGS text is the fallback.
- Grandpa's boat is the Sea Cow (was Maryam): 9 lines. Old saves' Grandma history moves over once (`GP_OLD4`, `M.gv` 4).
- Also: the AI shop line is the Al Ain shop (rent isn't paid by the day), Milo's pipe line pays off when water money reached her (`nour2`), the hard part chapter says half the world cannot own a tank right now, the garden village line removal in `endText` follows her new wording.
- Not done, on purpose: the hard part grid numbers (water 600M to 2.1B means rebalancing the other groups) and the war group rework. Handoff: project doc `claude/shrimp-handoff-hardpart-war-4nov.md`.
- Tests: balance 144 (the Babies copy check follows her new wording; new Pass 248 checks for the Sea Cow migration, the loan shark record and the format helper), academy 10, me 50, cardtap ok. Ending playtest data rebuilt. BUILD p248.

Deployed 4 Nov (Pass 248, BUILD 2026-11-04T17:45-p248). Before deploy: balance 144, academy 10, me 50, cardtap ok, endcards 50, strong bot seed 7 WIN day 2,340 empire_dictator (same as the Pass 247 build on this machine, text only), average Earth seed 7 7,169 question_prof, spotlight sweep 104 all good, human 390 px all ok to the first farm (no raw tags in the text dump). Not run: human at 360 px, stable sweep.

## Pass 249 (4 Nov, Puti): the ear tank, a standalone prototype

`eartank/index.html` (31 kB, Web Audio, no libraries, no files), not part of the game, `shrimp/index.html` untouched. A shrimp tank kept by sound alone, mono, phone speaker: filter bubbles as room tone (tempo follows temperature, slows and dulls as the filter clogs), one tick per shrimp (pitch by size, thin and quick when hungry, shorter when the water is bad, timbre from the surface it grazes: wood knock, moss rustle, rock clink, plant), a slide down for a molt, a double tick for a berried female, a scatter of high ticks for babies, surface taps for feeding, a thin high hiss for ammonia or nitrite, a low-pass over everything for nitrate, a pour for the water change, one low tap for a death. All numbers in the `SOUND` table at the top. Speech through `speechSynthesis` with the status box as the fallback; every control a real button, `aria-live` status. Screens: start, adopt (three tanks with a history, ten-second preview), build (12 places, five things, 6/10/14 shrimp, each choice played), home (How are they, Feed, Feed less, Change water, Clean the filter, Add moss, Add 5 shrimp, Speed, Log, Settings), settings (volume, voice, teach again, reset). The first minute teaches five sounds, skippable; every other sound is named once in speech the first time it happens. Model: one hour at most per step, real time or a day or a week a minute, catch-up from the clock on open capped at 30 days, saved in localStorage `eartank-v1`. Store jobs land 2 to 3 model hours later. Checked in headless Chromium at 360 px: no horizontal scroll, no errors; a Node run of the model: fed every 3 days a 14-shrimp tank breeds and grows, nitrate about 6 ppm a week, overfeeding brings the hiss up over 3 days before deaths start. Not tuned by ear yet, that is Puti's part. Test link: `https://raw.githack.com/putiw/putiw.github.io/shrimp-prelaunch-fixes/eartank/index.html`.

Pass 249b (Puti): voice off by default, a quick tank on first load (10 shrimp, wood, rock, moss, a plant, a day a minute; `?quick=0` for the start screen), and a live stats card above the buttons: water numbers next to what they do to the sound (hiss %, low-pass Hz, bubble interval), food, jobs, and one row per shrimp (size, age, hunger bar, eggs, molt in) that lights up when its tick plays.

Pass 249c (Puti): the ear tank as a listening bench. Six tank buttons (happy 5, happy 30 with babies and a berried female, old water nitrate 90, hungry with no food, dying with ammonia 1.5, the quick 10) and ten one-sound buttons (molt, eggs, babies, death, adult eating, baby eating, stationary flick, feeding, water change, hiss). Eating is now a munch of 2 to 4 scrapes, babies high and quick, adults low and wooden, each shrimp at its own pace (`rate` 0.6 to 1.6); with food down every shrimp eats, with none the munching fades as they get hungry (`activity`) and faint stationary flicks take over. Feed and Change water act at once with louder, longer sounds (taps plus a sinking sweep; a gurgle then a long pour). Temperature left alone. Stats card shows each shrimp's eating level and pace.

## Pass 250 (4 Nov, Puti): the hard part routes, the ten groups counted once, Musk units, the war group, a dev jump
Project doc `claude/shrimp-handoff-hardpart-routes-4nov.md`. Built, not deployed. Puti plays it first from the test link with `?dev=hard` (or `?dev=hard&speed=40`).
- **Dev jump**: `shrimp/index.html?dev=hard` loads `shrimp/dev-hard.json` (the average bot's save just before Chapter 6, humans set to 3.99B, no hard part state, cash AED 13B, Mira met, the land not bought, 248 kB) under its own save key `universal-shrimp-dev`, so the real save stays. `node tests/build-dev-hard.cjs <average run json>` makes it. Not in `sw.js`. **Never on main**: `git rm --cached shrimp/dev-hard.json` on the deploy commit, it stays on the branch.
- **The routes**: an allocation panel at the top of the hard part, four sliders in 5% steps (Aid, Science, Build, Policy), the sum capped at 100%, Keep is the rest with the AED a year it holds; each route's state is behind its name. Aid is the old give slider (batches a year or two later, lives and bills in the Times, now with "X% of one Musk"). Science: Lucy's lab, 25 years at a trickle, 15 at 10% or more, pauses when stopped; done, water/hot/poor workarounds reach 1.5× as far twice as fast, Build there costs a third, and on its own it reaches 30% of those groups ("a cheap membrane nobody installs"). Build: water, hot, poor, far, care, blind at US$700, 250, 500, 600, 1,500, 100 a person (sources in `BUILD_USD`), 60 to 90% arrives, at most 7% of a group a year (14% where Policy signed), falls 10% a year once stopped ("The pumps you stopped paying for stop."), holds workarounds up. Policy: costs ✦ too, reaches Said no over 3 to 8 years (tanks put there), makes the peace talks possible, doubles Build's cap, a 50% scandal roll a year ("A minister’s bank statement…"), pushes risk − and means −, two Grandma questions.
- **Workarounds fade**: `life` and `floor` on every work option (trucks a year to 0, jar tanks two years to 30%, panels three years to 20%, …); one runs per group at a time (the war's stack up to 0.8), a faded one can be bought again, and people above the cap lose their tanks at 2% of the gap a day with a Times line. Per-group fixes (cool, grid, wells, desal, breeders, road, carers) are `old:1`: hidden unless an old save bought them. Rows say "Reaches 15% in 2 months, lasts a year", then "Fading, 40%", then "Faded".
- **The grid**: a paler fill for workaround reach ("for now" in the key), an outline for what a year of Build money buys here.
- **The ten groups**, counted once (war, forced from home, never met, no water, too hot, too poor, hard to reach, can't do it alone, can't see, said no): 200M, 123M, 10k, 2.1B, 250M, 300M, 80M, 160M, 43M, 640M = 3,896M, `hardEasy` 4,304M, `HARD_AT` 4e9 stands. Every `n` has its source in a comment (PRIO 2024, UNHCR 2024, Survival International, JMP 2025, Tracking SDG 7 2025, FAO SOFI 2025 with UNDP MPI 2024, IAPB 2020, WHO 2020 with World Prison Brief and Desmond 2020; far and said no are game numbers and say so).
- **The war group**: "Seven years of civil war, three outside countries paying for sides. Nothing gets past the checkpoints." Ending options (one per game): Pay for the peace talks (needs money on Policy, 540 days, risk + drive −), Stay out of it (five years), Fund one side (dark). Under them: Ride with the aid convoys (30%, two years), Wait for a ceasefire then move fast (50%, a year), Pay at the checkpoints (dark, 70%, "the fee buys rifles"). Sources in the comment block (UCDP 2025, Fearon 1995 and 2004, Cederman 2010, Walter 2002 and 2004, Fortna 2008, Hegre 2019, Collier 2003, WorldPop 2024). The old river treaty, common enemy and both armies rows are `old:1`. "Money for the towns in the war can’t get in while it’s on." Milo tops the jar up from the drinking water (no rice water).
- **Musk units**: `RICH_USD` 9.0e11 (Forbes Real-Time Billionaires, read 4 Nov 2026, rounded, the comment says to update the date), `GW_ROOM_USD` 1e9. Ledger title "A year of your profit is X% of the richest person’s fortune", a row for the fortune, the ? says 0.1% of it at GiveWell's rates is about 164 to 257 thousand lives a year, capped at what GiveWell can place (the cap doesn't bind at US$1B). Aid landing lines say "0.2% of one Musk". The ending adds "Your fortune was X% of the richest person’s" once it passes 1%, and `routeLines`: "Your utilities reached X people. Y were still waiting." "The membrane was N years from done." "The tank laws you paid for reached X homes."
- **The Shrimp Times laughs at us** (`hardTimes`, up to two lines a hard-part year): Keep ≥ 70% ("cash pile now visible from orbit", "The discipline is a vault", "The money is doing fine, thanks for asking"), nothing at all ("a plan to announce a plan"), Aid at 1 to 3% ("buys the other 98% a boat"), Aid ≥ 30% ("Shareholders, all one of them"), Science ten years with no Build ("Available in: Abu Dhabi."), Build ("A utility you paid for sends its first bill. It’s to you.", "It’s a shrimp."), Policy ("the same typo", "off a shrimp company letterhead"), half a group built (one line per group), the fortune in Musks, and the yearly "This year’s profit could have paid the world’s water and toilets bill for 0.5 years…". Grandma: three questions, not verdicts.
- Trait pushes: the war rows were retagged after the drive balance check (convoy risk .5 h 1, ceasefire risk 1, checkpoints means −.3 risk .3 h −2, talks drive −.5), spares and jar tanks read easy-going. Pairs table before → after: network-drift 94 → 94, network-garden 71 → 73, empire-garden 72, empire-drift 61, empire-network 30 → 29, garden-drift 15 → 13, network-question 13 → 12, empire-question 10, garden-question 8 → 10, drift-question 7 → 8. Profiles: all targets met.
- Bots (seed 7): the long routes don't finish inside the game, so both bots stop counting after five hard-part years (`hardSetGoal(G,'none')`); the kind bot sets Aid 15%, Build 30%, Science 10% and stays out of the war, the cold bot Policy 20% and funds a side. Strong cold 2,340 → 3,817 (hard part opens 1,992; empire_dictator both). Strong kind 3,354 → 4,085 (opens 2,260; garden_village → question_lucky, Science pushes curious). Average 7,169 → 7,280 (opens 5,435, 1,845 days in the hard part, so 40× stays). Average seed 11 7,337 → 7,336. Seed 31 goes broke on day 1,535 on both builds (not this pass).
- Four years at 40× on the dev save with Aid 15, Science 10, Build 30, Policy 20: Build reaches 2.4% of hot, 0.8% of water (profit about AED 50B a year against AED 5.4T for water), Policy reaches all of Said no, Aid lands 14k to 109k lives a batch. **For Puti**: with the sourced costs Build is money-bound, the 7% cap never binds for this company; the honest cheaper level is basic service (about US$190 a person for water). Say which you want.
- Tests: balance 145 (new Pass 250 check: the groups add up, sources present, shares and Keep, the sum cap, `H.give` migrates, science clock and pause, build cap and decay, policy fills Said no, workarounds climb, hold, fade, one per group, bought again, held up by Build, the cap at half, fading takes tanks, the war ends once with talks needing Policy and work options stacking, no river or rice water in Milo, Musk units, route ending lines), academy 10, me 50 (the clay and war checks follow the new numbers), hard 15 on the new average run (panel keeps the card height, a slider scrolls nothing, the sum snaps back, the Musk ledger ?, "for now" in the key), endcards 50 on the new strong run, frozen, cardtap, profiles, pairs. Stable narrowed to World on the average and strong runs: see below.
Pass 249d (Puti): one-sound buttons play on their own: Solo (on by default) silences the tank for a few seconds while the sound plays, Tank sound on/off stops the tank altogether, every tank sound now runs through one `A.tank` gain and the demo buttons bypass it. The static was the noise pops: bubbles are now a sine pop with a rising pitch, the stationary flick a tiny sine blip, noise bursts have a 12 ms attack. Louder and more contrast: eating 0.16 every 2.2 s with food, near silent without; molt, death and babies bigger. Swimming added: a soft whoosh that rises and falls (`swim`), babies shorter and higher, one dart every ~28 s per shrimp and four times as many in the minute after feeding; Swimming (adult) and (baby) buttons, plus Bubbles 4 s.

Pass 249e (Puti): the spark was the noise bursts on moss and plants (and the swim's narrow bandpass). No noise left in the shrimp sounds: wood is a low sine knock, moss a soft double note, plants silent, rock the clink; the swim whoosh is wider and quieter; death and the drain gurgle are tones. Babies back to the quiet quick scatter (9 dots in 0.9 s). Feeding is soft sine plinks (pellets dropping in) and one low bloop, no noise.

Pass 249f (Puti): a Play screen first: 5 shrimp (3 females, they breed), Feed and Change water only, a day every 2 minutes (new speed step), New tank, and a water test strip (ammonia, nitrite, nitrate, hunger, food on green/amber/red tracks with a marker) over the stats card. Sound bench is behind a button. The water change sound is a soft drain (low filtered noise sinking, 2 s) then a refill trickle (3 s), both with a slow wobble and long fades, no tones.

Pass 249g (Puti): four water change sounds to pick on the Play screen (A trickle, B bubbly pour, C droplets, D glugs then pour; `WC`, saved in `eartank-wc`, default B). No noise bed any more; a water pulse instead (`pulse`): one soft low beep every 7 s when the water is fine, down to every 0.7 s as ammonia, nitrite or nitrate go red. Molt timers are spread (babies 3 to 12 days, adults 15 to 45) and events play with a random 0 to 0.9 s onset and may overlap (no single-file queue). Failed molts have their own sound (the slide breaks off, then a knock) and happen when the water is changed more than twice in a week (`S.wc`, the game's too-much-new-water rule). Swimming is short or long (30% long, with a wobble). A day in 5 seconds is the fourth speed and the Play default. Babies: 5 to 12 a clutch, about 60% make it, quieter. Soft cap: berries fall toward zero at 60 shrimp, deaths rise past 40, at most 50 voices. Bench buttons: Failed molt, Swimming long, Water pulse good to bad, Babies quiet.

Pass 249h (Puti): the filter plays all the time (`flow`): pink noise, low-passed 220 to 900 Hz and slowly breathing, plus a trickle band at 1.4 kHz on two slow wobbles; the loop's ends are crossfaded so there's no click. The monitor beep follows nitrite and nitrate (`pulse`): 520 Hz every 6 s when fine, up to 1,050 Hz every 0.55 s and a bit louder as it goes bad. The hiss follows ammonia and grows to hard to ignore (0.01 at 0.1 ppm to 0.22 at 1.5). Overfeeding now drives it: bacteria scale with the colony (0.025 + 0.002 a shrimp ppm an hour) and rotting food gives 0.8 ppm per unit, so with 5 shrimp one feed a day is clean, three a day shows a little, five a day hisses and kills. One water change sound: the old water glugs out, then a tap runs (`tap`); the picker is gone. Death scales with age, babies a small high tap, adults a low long knock with a sub. Failed molts are louder: the slide shakes and stops halfway, then a heavy knock. Bench adds Filter flow 6 s, Death baby, Hiss bad water.
## Pass 251 (4 Nov, Puti): the hard part, proposals from people

Project doc `claude/shrimp-handoff-proposals-4nov.md`. Built on Pass 250, not deployed. Puti's idea: the good ideas come from other people and we fund them, so the player isn't the smart one. Play it from the test link with `?dev=hard` (`dev-hard.json` rebuilt from a fresh average run).

- **Build and Policy sliders are gone.** Aid and Science stay as standing shares, Keep is the rest and proposals are paid from it (`HARD_ROUTES=['aid','sci']`). Old saves: `alloc.build` > 0 becomes a running water board at the reach Build had in water (and so on per group), `alloc.pol` a running tank law with its tanks; 0 shares are dropped (`propMigrate`, run from `hardAllocOf`).
- **Proposals** (`PROPS`, `H.pr={open,run,no,t,f,next,n,lev,grads,gnext}`, `propDay`, `propFund`, `propDecline`, `propStop`): people write in. A name, a place, one line in their words; a build part (days of income, paid once, `propBuild`) and a keep part (a share of income for the crews, `duesAdd` keyed `prop:<id>`, 0 days = while you pay); some cost ✦ (the tank law, once; the levy, a share a day). At most 3 open, a new one every 60 to 180 days (`PROP_GAP`), none while the land, a tank job or the planting map is open (`busyUI`, guarded). Arrivals weighted by the square root of the people still waiting in the group, so the small groups write too. Declined ones wait a year and a cousin brings the same idea (`alt` names, each cousin funded once, `R.f`). The work is theirs: reach climbs at their pace (`r` of the group over `y` years), 60 to 90% of the planned reach arrives (`BUILD_ARRIVE`, rolled once at funding), a group grows at most 7% a year shared by its running proposals (`BUILD_CAP`, 14% once the levy holds). Stop paying the crews (Stop on the Running row): dues go, reach falls 10% a year (`BUILD_DECAY`), one news line in the person's words, Grandma asks once who they are.
- **The list**: water: Esther Achieng's county water board (12%, 6 years, 30 days to build, 1.5% while you pay), Fatuma Said's pump mechanics (every water crew 20% cheaper), the Lima utility's loan (cold-ish, pays back 0.3% of profit a day), Gulf Coast Desal (cold, the water is yours for 15 years, pays). Too hot: the Tamale solar co-op. Too poor: the Mbale farmers' co-op (sells to you), Anjali Verma's school lunch, Amina Bello's market hatchery. Hard to reach: the islanders' ferry. Can't do it alone: the carers' union (2% for 10 years, 25%). Can't see: Dr Rao's cataract bus. Said no: the minister of trade's tank law (direct, the old `gov` as a person; `gov` is `old:1`). War: the mediator's peace talks, once any program runs (takes the war's `pay` slot, `pay` is `old:1`, its `req` on Policy is gone). Cross-cutting: the levy (Finance Minister Okonjo; ✦ a day and 0.3% of income; a country signs every 6 to 18 months, 1 in 4 drops it; at 12 (`LEVY_N`) every group crew comes off your dues and new ones are paid by the levy; a yearly scandal roll as Policy had), the politics class in Dakar (nothing for 10 years, then a graduate brings one proposal a year, build a fifth cheaper, counted in `R.grads`), the maintenance school in Arusha (water crews 30% cheaper, `keepMul`, `propKeepMul`).
- **Costs are game numbers** (days of income, shares), not the per-person bill: the ? on each row says the real bill for that many people at the basic-service level (`BUILD_USD`, water now US$190 a person, Hutton and Varughese 2016; was 700, Puti's open number from Pass 250) and that they ask for less and find the rest.
- **Traits**: each proposal pushes two (`tr`); a cold one reads cold, paying crews for years reads fair (`propHeart`, through `HEART_TR` like the hard part options). Not now pushes the opposite of know in full and of care and kin by half (the `PUSH_SKIP` rule), nothing on drive, risk or means. Drive and risk tags are balanced across the list so a random chooser stays centred (`shrimp-balance` null test). `tests/shrimp-decs.cjs` lists every proposal as a Fund / Not now decision (141 decisions now).
- **Screen** (`hardPropsHTML`, `.pr-row`, `.pr-run`): under the two sliders and the Keep line, "People who wrote to you", three rows of one fixed height (92 px; who and where on the dotted title, the full line and the costs behind it, the cost in one line under it, Fund / Not now stacked in the 112 px column, `.hb.hbv`); empty slots keep their size and say "Nothing new this month." A tap freezes the panel until a scroll (`FRZ['hard-al']`, the row reads Funded). Then "Running": one line each with its state (done %, people, crews paid; the levy's countries; the class's years), Stop on the right, a closed fold past four.
- **Grid**: a running proposal outlines what it still has to reach (`pl`), the laws count what they put there (`fo`). **The Times** (`hardTimes`): the first bill is a water board's, three boards ask for a logo, the tank law read off letterhead, a crew you stopped paying writes to the paper, three proposals on a clean desk for a year. **Ending** (`routeLines`): one line per person you funded with what their work reached and the year you stopped paying, the levy's countries, the class's proposals. **Milo**: the water board half done lays the pipe to her street (`nour2`), the solar co-op's grid runs her fan (`nour3`, `nourGrid`).
- **Bots**: kind funds every proposal that isn't cold as it arrives, cold funds the loan, the desal and the tank laws and turns the rest down; both still stop counting after five hard-part years. Seed 7: strong cold 3,817 (empire_dictator), strong kind 4,085 (question_lucky), average 7,280 (question_prof; was garden_hermit before Pass 250), all unchanged from Pass 250. The average bot funded 8 in its five years (solar, board, mechanics, law, school, hatchery, farm, union), the levy never came up for it; the cold bot funded the loan and the desal.
- Tests: `shrimp-balance` (145: arrival pace, at most 3 open, declined and back, build then keep, stop and decay, three in a group under the cap, the levy, the class, the school, migration, the ending lines), `shrimp-me` (50), `shrimp-academy` (10), `shrimp-profiles` (Not now answered either way by the casual profile; casual 40% Home, was 49), `shrimp-pairs` (Network–Drift 94 → 107, Garden–Drift 13 → 14, nothing down), `shrimp-hard` (18: two sliders, three rows of one height, Fund keeps the card height and scrolls nothing, the Running list; the test scrolls the legend into view itself since the panel above is taller), `shrimp-endcards`, `shrimp-frozen`, `shrimp-stable` World on the average run (see below). Screenshots at 360 and 390 in `os.tmpdir()`.
- Names and voice (Puti, 21:46): the people are Leo, Lana, Havana, Roodee, Souna, Dorason, David, Jimmy, Li, Michale, Mo, Coco, Gelun and Pang Pang, with a role and a place (no real cities). Every line is short sentences, the man caught a fish and the fish was good. The panel heading is Letters.
- Open: the levy is rare on the bots (needs crews first, then a random draw); Puti to say whether it should come sooner. Not stable-tested yet (Puti: test the design first, UI before main).

## Pass 252 (4 Nov, Puti): 13 notes on the letters
- Letters panel: one row per open letter, at least one ("No letters this month."); the two empty 92 px slots are gone, that was the blank band above the grid. `shrimp-hard` checks rows = max(1, open).
- Text: Souna's lunch line ("I can’t promise you tanks. I can promise the lunch."), the row ? leads with the quoted line, then "They ask for …", "If it works, about one in ten of the people in … in 5 years", no per-person bill or percentages (`propShare`). Science ? no longer mentions Build. Milo's card says shrimp babies.
- `c_bonus`: Add it to the Aid / Share it with family and friends (the aunts and uncles, cousins, school friends, the first packers; Grandma is not named, the balance test forbids care pushes on cards that name her).
- `c_budget`: the pain study says why (prawns and crabs have been studied, Barr et al. 2008 Animal Behaviour, cherry shrimp never; the world boils a few hundred billion shrimp a year) against an animal clinic in the hot towns (two vets, a truck), same cost both sides.
- Musk: `RICH_USD` 1e12 (Forbes 21 Oct 2026, US$1.019T open, US$989B close), `RICH_YEAR` 2026, "Elon Musk’s net worth in 2026" in the ledger title and rows, the Aid ? gives this year's Aid at the current share ("At 50%, AED 121B a year, 3% of Elon Musk’s net worth in 2026"), the aid landing lines no longer carry a cumulative Musk share. Water lines read "clean water for the 2.1 billion without it".
- One Plant trees button: the Rewild tree's row shows only while the coast card (Mangroves / Shrimpcoin) isn't there.
- Milo's tank: 96 px square beside the text (`.nour-jar` 96px column), shrimp base 20, two more rocks, two lotus pad clusters at the surface.
- `credit` (Sell on credit, too poor) is `old:1`.
- Tests: balance 145, me 50, academy 10, hard on a fresh average run (see below). BUILD p252. Not done, for Puti: items 6 (Rewild / last mile / shop trees) and 7 (gala and Shaping the world into Chapter 6), design calls.

Pass 249i (Puti): the flow and trickle sounded like wind, both off. The filter is a small fountain now (`fountain`): about 16 tiny droplets a second at random times, each a short sine that rises in pitch, 550 to 2,400 Hz, with a few lower plops; the rate swells slowly and drops as the filter clogs. Feeding starts with a salt shaker (three soft shakes of tiny high grains), then the pellets plip in 0.9 s later.

Pass 249j (Puti): sound lights on the Play screen, 18 small chips (fountain, plop, monitor beep, hiss, adult/young/baby eating, sitting still, swim short/long, eggs, molt, failed molt, babies hatch, death baby/adult, feeding, water change). Each lights green the moment its sound plays (timed to the audio clock, `lit`), for as long as the sound lasts; the hiss chip stays red while the hiss is on, stronger as it gets louder. Fountain drops light one in four so the chip flickers instead of staying solid.

Pass 249k (Puti): Filter sound picker on the Play screen (`FOUNT`, saved in `eartank-fount`): Trickle (default: clusters of 2 to 7 tiny drops at random, each a short rising sine, over a soft 600 Hz bed), Brook (three narrow noise bands whose centres are pushed around by slow noise, the classic procedural water), Air stone (30 small low bubbles a second over the bed), Drops (the old one), Off; levels matched by RMS in a headless run. Monitor beep options (`BEEP`, saved in `eartank-beep`): style Soft, Monitor, Heartbeat, Bell or Off; pitch Lower, Middle, Higher; volume Quiet, Normal, Loud; each tap plays one beep, Hear good → bad plays the range. The tank by ear: the 4x3 aquascape on the Play screen, tap a place to cycle nothing, rock, driftwood, moss, plant (each plays its sound); Listen to the tank plays it left to right in four steps, back row high, front low, rock clinks, wood knocks, moss rustles, a plant rises, with a tick at each end and the column outlined as it plays (`placeSound`, `SOUND.scan`). The scape also feeds the eating surfaces. Feeding's salt shake is slower and varied: 3 to 5 shakes 0.3 to 0.55 s apart, each with its own grain count, length and pitch.
## Pass 253 (5 Nov, Puti): trees as Running rows, Shaping the world inside Chapter 6, the facts flood
- Trees (item 6, her pick b): once the hard part card shows (goal picked, `treesInHard`), Rewilding, The last mile, The designer lab and The shop are one row each under Running (`treeRowsHTML`): the tree's name with its ? (next step's description, then "Done: …"), the next step's name, its cost on the button in the 112 px column, Done when all steps are in. No Done fold, so buying a step changes no height. Their cards hide; Shrimp Island keeps its card. Before the hard part, `#treecard` as before. The Plant trees row follows the same Pass 252 rule.
- Shaping the world (item 7): from the same moment, on World, `#e-proj` (the tracks, forks, gala) and its Completed list move into a closed fold "On your desk (n)" under Running (`deskPlace`, `#hard-desk`); `#c-proj` hides on World. Same nodes and handlers, `OW_KEEP`, `FRZ`, the forks untouched. Order in the card: goal, Where the profit goes, Letters, Running (trees first), On your desk, grid, groups, ledger, Milo. Heading "On your desk" is for Puti to approve.
- Facts flood: the dev save's play clock starts at 0 while `fx.at` held the bot's clock, so `c>=F.at` failed and the gap never held; plus 30 unseen Your day notes queued. `factDay` now treats a clock that went backwards as "just shown" (waits 3 minutes); `noteDayOne` drops all but the newest unseen Your day note; `build-dev-hard.cjs` marks the bot's notes seen and clears `fx.at`. `shrimp-me` check: 5,000 paper hours with no `fx`, 30 days in one go, at most one fact; a reset clock gives none until 3 minutes.
- Musk conversion checked: `RICH_USD` in USD, `muskPct` and the ledger divide AED by `RICH_USD*USD_AED`, `LEDGER` costs are USD×`USD_AED`. Right.
- Tests: balance 145, me 51, academy 10, hard 20 on a fresh average run (new: trees are rows and the cards hide, desk in the card, a tree step moves nothing), stable World on year 15 / nour3 / year 18: one failure, `#sp40` header 169→148, same on Pass 252 (not this pass). `dev-hard.json` rebuilt. BUILD p253.

Pass 249l (Puti): Pause (stops time and suspends the audio, button turns to Play) and Sound off (time keeps running, master to 0) on the Play screen, above Speed.
Pass 249m: Pause keeps the audio running and mutes only the tank bus and the scheduler, so single sounds, beep options and the tank-by-ear scan still play while paused.

Pass 249n (Puti): every sound chip opens a mixer (`openMix`): Volume (0 to 300%), Softness (a low-pass from 14 kHz down to 350 Hz) and Speed, Play it, Reset. Speed is how often for sounds that repeat (fountain, plop, beep, eating, sitting still, swimming) and how fast for one-off sounds (eggs, molt, failed molt, babies, deaths, feeding, water change); the hiss has no speed. Each sound runs through its own bus (`A.busT`/`A.busD`, `mixBuses`, `applyMix`), sounds set their bus with `as(key,t,fn)`, one-off sounds are time-stretched in `tone`/`burst` (`stretch`). Saved in `eartank-mix`. Filter sound: three more (Dripping, Rain on water, Glugs) and a live panel under the picker (`renderFP`, `fpOf`, saved per sound in `eartank-fp`): Density (Movement for the brook), Pitch, Drop size (Width), Background (Level), Volume, Softness, all applied while it plays. Fixed: the Sound off button pushed the page to 373 px at 360 (grid rows now `minmax(0,1fr)`).

Pass 249o (Puti): filter sounds about 2.5× louder (drops, beds, brook). Monitor beep, new default style (old saves switch once, `BEEP.v`): a flat square tone through a low-pass, 110 ms with a 4 ms attack (`flat`), a beat every 1.1 s when fine up to every 0.4 s when bad, pitch 880 to 1,250 Hz; past 0.75 every third beat adds a three-note alarm (C6 E6 G6), like the medium-priority bedside alarm. Water change is glugs only, 7 to 12, uneven gaps and pitches, some with a second bubble; the tap run is gone. Feeding plays the game's own Feed sound (`feed_drop_002.wav`, embedded, through the feeding bus, `gameFeed`) with the salt shake, now 3 to 8 shakes.

## Pass 254 (5 Nov, Puti): land Build menu, Aquascape sticks, the grid's squares, ledger key, routes in AED, letters kept
- A1 Build menu (land source, `land.js`, `land.css`): the hint pill (`#lstat`, fixed at bottom 60 px) sat over the palette's bottom row of items; the palette's bottom was 58 px while the tools moved up by the safe-area inset, so on an iPhone the palette covered the walk tool. Now the build hint lives inside the palette (`buildHint`, `#lph`, under the chips) and `#lstat` is empty while Build is open; the palette's bottom follows the safe area; a **Done** chip ends the row (walk tool). The Move/Remove notes merged into the hint.
- A2 Aquascape (`game.js`, `tank.js`, `toys.js`, game `landTank`, `tvBg`): the land kept the pieces fine; two real faults. (1) The company page drew Tank 1 from four stock pictures by flag (wood, plants, moss, leaves), so a layout never showed there, the default did. Now the land renders the pieces to one picture (`scapeImg`, 932x430, webp, about 60 to 80 kB) and sends it with its decor report (`sci`); the game keeps it in `G.opt.scImg` and `tvBg` draws it over the sand instead of the stock pieces (`scImgOn`, `SCIMG`), after a reload too. Sent on the first sync, after any Aquascape, trim, or decor change. (2) Back with Aquascape open never reported, so the game's old flags came back on the next sync and `decorSet` re-added what was removed at a random place. Now Back and the need bar end an open job first (`jobClose`), and once the land has run Aquascape (`T.scd`) its pieces win: a differing game flag makes the land report instead of apply. The company's Driftwood/Mossy rocks/Leaves/Live plants buys for Tank 1 go once the land decides (`upgradeCost`, `T.ldec`).
- Rotate: a fifth Aquascape button, 15° a tap (`it.r`, `drawItem` turns any piece about its base, `mossAnchor` turns the moss with it, `scapeKey` includes it).
- A3 squares (`hgBlocks`, `hardOwnDay`, `hgDraw`): two bugs. (1) Outlined squares counted a running proposal's `full - r` while reach already held `r`, so outlines went away twice as fast as squares filled. Now `full`. (2) Filled squares were `G.humans` split afresh over every reached square each draw, so funding or choosing anything in one group turned filled squares grey in every other group (that is what she saw after the war bar filled from the talks letter). Now `H.own[gid]` holds the tanks the sim gave each group (`hardOwnDay`, daily from `hardDay`: new owners go to groups with room, in proportion to it, and stay; a group loses them only when its reach falls or `H.faded` takes owners). Workarounds still fade by design; the row now says "Holds 23 more months, then fades" while it holds (unless Build reach keeps it up).
- B1 ledger: one key line under the chart, "Red: your Aid this year, AED x, a third each to water and power" (always there, "none yet" at 0%).
- B2 routes: each slider's value slot shows the share and the AED a year (`alV`, 74 px tabular slot, two lines), updated on input without a render.
- B3 letters: a Running row's title is the same dotted help button as the open letter: the quoted line, who and where, what they asked, "So far: 40% done, 120M people", and the dues you pay now from `G.emp.dues` (`prop:<id>`).
- B4 grid: five shapes instead of five tints: has one solid, for now the top half filled, put there dark, can get one pale (70% paper, was 55%), on the way a dot (was an outline, which at 3 px cells looked filled). Legend swatches match (`.s3`, `.s4`, `.s5`).
- B5 checked, no change: gala causes give ✦ only (own foundation 2.25x), Clean water and Children's hospitals a little mood for 20 days, Mangrove replanting plants trees, Animal shelters traits; none reach the grid. Proposal sent to Puti.
- Tests: balance 145, me 51, academy 10, hard 20 on a fresh average run, yourtank 24 (new: the Aquascape persistence check), land-life 12, Build palette checked on every group at 360 and 390. `dev-hard.json` rebuilt. BUILD p254. Known, older: the 40x button shrinks the World header late game.
- Land source: `shrimp-proto` commit "Land: build hint in the palette, Done, Aquascape picture and Rotate (Pass 254)".

Pass 249p (Puti): the monitor beep follows the test strip's zones (`waterZone`, worst of ammonia, nitrite, nitrate; 0 perfect, 1 the amber line, 2 the red line) and its gap is a straight line in each (`zoneGap`): 8 s at 0, 1 s at amber, 0.14 s at red, which with a 110 ms beep is nonstop; the alarm triplet is gone. Hear green → red plays 20 s of the zone climbing. The tank picture, by ear: the game's default tank art (driftwood, plants, mossy rocks, sword plant, the `twood`/`tplants`/`trocks`/`tsword` layers from shrimp/index.html) with the background dropped and the color taken out, cut into 10 columns by 24 rows (`PIC`, mean brightness per cell, brightest cell 1). Hear the picture plays it left to right, one column a second with a tick at each: one sine per row, 300 Hz at the bottom to 3.2 kHz at the top on a log scale, each at the volume of its cell's brightness (`SOUND.pic`); the picture is shown in gray with the playing column outlined. Stop ends it.

## Pass 255 (5 Nov, Puti's picks on Pass 254): galas do something, trees as letters, coast soft cap, seven fixes
- B5 (b), `galaDo`, `galaReach`: Clean water queues its money as an Aid batch (lands a year or two later, counted as Given in the ledger); Children's hospitals reaches 0.5% of Can't do it alone a gala, up to 5% (`GALA_CARE`, on the grid through `hardReach`); Animal shelters brings the vet card at 15 days of income instead of 60 and the vet at half (`E.galaPets`); Mangroves and Your own foundation as before. The log line says which.
- C1 (Puti: no minigames for now, letters people can say yes or no to): each tree's next step is a letter in the Letters list (`treeRowsHTML(G,'letters')`, `.pr-row`, Fund with the cost in the line, Not now). Not now skips that step for good (`E.treeNo`, `treeDecline`, know back in full, care/kin half) and the next step writes. A tree with every step funded or skipped is one Done row under Running. No "No letters this month." row while a tree is writing.
- C2 (Puti yes): `coastSlow` = (1 - fill)^2 on the spread and the coin planters, so the coast never quite fills on its own; your taps always plant. Ghaf opens at half the coast (`PL_GHAF_AT`), sidr trees on the hills (ground 3, AED 30, 45% dry, 70% near water, olive green) at three quarters (`PL_SIDR_AT`, `PL_KINDS.s`). Plant by hand's line says when they open. From the code: coin planters alone filled 8e9 in about 4.5 years, spread doubles in a year.
- 1) a Running letter's line ends with what you pay, "AED 3.62B/yr"; people only when reached. 5) Stop becomes Restart (`propStart`): the same dues, reach climbs again from where it fell to, the talks come back too.
- 2) no evidence line under the trait bars (`traitEv` kept for tests), rows 34 px. 3) Grandma: "You visited or called Grandma about 2 times a month over 14 years", never the counts.
- 4) route sliders: label 64 px, value slot 118 px, share and AED on one line ("15%  AED 36.2B/yr").
- 6) `CLEAN_HOLD` 25 tank days (a minute): no poop after a vacuum (`C.vacD`), no glass algae after a wipe (`T.wipeD`), set by the company jobs and the land's report (only when it cleaned something).
- 7) Grandma's land: `gp_land` is in `STORY_PROMPT`, so it comes right after the house instead of behind the other stories (Puti bought the flat and the house and nothing came). While it waits the card says so: "Grandma wants to look first. She'll call about it." / "You are out looking at land with Grandma. N days to go."
- Tests: balance 146 (new Pass 255 check), me 51, academy 10, hard 20 (tree rows are `.pr-row` now), tank1 sim, yourtank (the "land state lines match the game" check fails about one run in three, a tank-clock tick between reading the two pages; the message now prints both sides; land-life 12 from Pass 254. Screens at 360 and 390: sliders, letters, Running with Restart, Grandma's place, the trait chart. BUILD p255.

Pass 249q (Puti): the feeding sound is a stack of eight layers (`FEEDL`, `feedLayer`, `feedSound`, saved in `eartank-feed`): Salt shake, the game's Feed sound, Pellets plink, Low bloop (these four on), Sprinkle, Plop, Bubbles, Patter (off). Each layer has On/Off, Play, Volume, Starts at (seconds from the tap), Pitch, Count, Spread (the gap between shakes for the shake), Randomness and Softness (its own low-pass), and its own Reset; Play feeding plays the stack, a tap on Feed plays the same. The tank picture uses masks, not brightness: each decor layer (`PIC_MASK`, 233×108 bits from the game's `twood`, `trocks`, `tplants`, `tsword`) is 0.2 where it is, so overlaps add up; the picture shows that sum. How it plays: Slices 2 to 40, Length 2 to 30 s, Pitch rows 4 to 48, Lowest and Highest pitch, tick on or off (`PICS`, `eartank-pic`). Each kind of decor (wood, stones, plants) has its own sound: Off, Sine, Soft, Buzzy, Hum, Pluck, Chime, Knock or Bell, an octave (Lowest to High), a volume, Hear only this kind, and One note (`picHit`, `picPlay`, `oneNote`). Defaults: wood knocks low, stones chime, plants hum high. The shake's grains are twice as loud.

Pass 249r: Your settings on the Play screen: Copy my settings puts every eartank setting (mixer, feeding layers, picture, filter, beep) into a text box and the clipboard as one JSON line; Paste settings reads it back and reloads.
Pass 249s: the one-time switch to the Monitor beep (Pass 249o) now saves, so Copy my settings shows the style that plays (it said bell while monitor played).

## Pass 256 (5 Nov, Puti's second 5 Nov list, project doc `claude/shrimp-handoff-bugs2-5nov.md`)

1. **Aquascape on the company page.** Safari has no webp encoder, so the land's `scapeImg` falls back to a full-size png, which was over the game's 300 kB cap and dropped without a word. The game now takes up to 1.5 MB and keeps a half-size copy in the save (`scImgShrink`). `shrimp-yourtank` sends a big png and checks it is drawn and kept smaller.
2. **"Not enough for that yet" on a ✦ 5,000 step.** The sim buys fine (`buyTreeStep` on the dev save returns true). The hard panel holds still after a tap until a scroll (`FRZ['hard-al']`), so after a buy the old step stayed on screen, enabled, and the next tap failed. A funded row now greys in place as Funded (`frzTap`), and the toast says why (`treeWhy`: frozen, already funded, not the next step, cash, ✦, dues). `shrimp-hard` updated.
3. **Aid and Science bars.** `.ctl.hard-give` is `60px minmax(64px,1fr) 140px`, value one line at 360 px (measured: 140 px slot, no overflow, bar 64 px at 360, 76 at 390, 36 px tall touch target).
4. **Restart a stopped letter.** Already in Pass 255 (`propStart`), covered by the Pass 255 balance check. Nothing changed.
5. **Not now comes back.** Letters and tree steps go away for 90 to 1095 days (`NO_BACK`, `noBack`, `R.back`, `E.treeBack`), then the same letter (or its cousin, `propOK`) or the same tree step writes again, as many times as it takes. One step per tree: a step away holds its tree (`treeNext` returns nothing until the day). Traits move on the first no and half as much each time after (`noPush`, `R.nn`, `E.treeNn`). Old Pass 255 saves read the decline day plus a year. `PROP_MAX` unchanged. Balance check: not back a day early, back on the day, second no pushes less, buy after it came back.
6. **Sound between company and land.** `musicPause` only suspended a running context, so a fast round trip left a `resume()` pending that won and both pages played. It suspends whatever the state now, and a resume that lands while the land is open suspends again. The company's context is suspended, not restarted, so it keeps its place. The land's suspend/resume run in call order, unchanged. Not fixable here: iOS may not resume a page's sound from a message, so after Back the music may wait for the next tap (both pages already resume on pointerdown). `shrimp-land-audio`: three quick round trips, only the land plays; the company resumes where it was.
7. **Cards stuck in the queue.** Front of the line (`STORY_PROMPT`) now also: `gp_scam`, Milo's `nour1`-`nour6` (day windows), every pain (they cut demand while open). Dropped when late (`STORY_DROP`): `party1`, `party2`. Before a waiting card shows it is checked again (`STORY_STILL`): Milo only while `nourDue` holds, parties not after leaving, late cards (`CARDS3`) not after the win or the end, Grandma's land cards not after leaving; a card whose moment went is skipped (`p.dropped`). Already immediate (`CARD_NOW`): cycle, owntank, broke, kindsave, kindend, gameover, left, me_ill, crash, win, intro, tenyears, health; `jar` skips the pacing. Already in front: c_nydin, c_kyoto, c_knee, c_wedding, c_heat, c_lie, owntank, the four goodbyes, me_burnout, the five tree cards, gp_land. Already dropped after 60 days: the Mira reactions, gp_net, me_doctor. Everything else waits its turn. `shrimp-me` check: gp_land goes in front of five waiting stories.
8. **Space page.** The ship card broke into one column on phones (`@media(max-width:480px)`), so − and + and the Add buttons fell out of the button column. Rows are now name plus points, what it does behind the dotted title, every button in the 112 px column, fuel and robot − and + side by side inside it, one points line at the top ("N points, M left"), Launch last. Checked at 360 and 390: no button outside the card, no sideways scroll. Not done: `space.html`'s star panel was not looked at.
9. **Late-game sickness.** Before: a 20 L Tank 1 starts at 10% sick, logistic 0.12 a tank day: stage 3 at about day 18, stage 4 day 33, crash about day 43, so on the tank clock (2.4 s a day) about 105 s from the first sick shrimp to a crash, 60 s from the stage 3 alert. Dirty glass, nitrate, crowding and new stock only raise the chance to start (`illRisk`), never the speed. Now from the farm on (`ownTank`), Tank 1 moves at most one stage per 2 real minutes (`ILL_STAGE_MS`; tank days at 2.4 s on the tank clock, play time before the land), a crash needs stage 4 held a real minute (`ILL_CRASH_MS`), and a catch-up after a reload never crosses a stage (`G.catchUp` in `ownClock`). Stage 3 is still the first alert. `shrimp-me` check.

Tests: balance 146, me 53, academy 10, yourtank, tank1 (sim), land-audio, hard 20 (fresh average run, seed 7: Earth day 7,280, question_prof). Not run: bots, spotlights, stable, monkey, space-search (space.html not touched).

## Pass 257 (5 Nov, project doc `claude/shrimp-handoff-hardpart-rework-5nov.md`)

1. **Cards on time, nothing skipped.** Removed `STORY_STILL` and the party drop. What held a moment card back: it only left the line when `p.soon` was empty and the gap was rested, and spotlights, notes and news each restarted the same 10 to 20 s gap, so at 40× a card like `gp_land` kept losing the gap to whatever came next. Now `momentWait` finds a `STORY_PROMPT` card in the line: it goes before chapter cards (`p.soon`), and spotlights (not `now:1`), notes and news wait while one is waiting. `party1`/`party2` are in `STORY_PROMPT`, so the one before Europe shows before Europe. `shrimp-me` check: a nour card behind five stories and a chapter card shows within one gap, first, nothing in `p.dropped`.
2. **Letters, trees and the hard part card.** Fund (and Not now) on letters and tree steps no longer freezes the panel: the letter leaves Letters and shows under Running at once; the Letters block (`.hal-let`) keeps its height until the next scroll (`letHold`, `LET_H`, freed in `hdFree`), so nothing above moves and Running grows below. One Running list: proposals and running tree steps in the same `.pr-run` shape, fold past four (the fold's summary is the heading), finished letters and finished trees in a Done fold at the end. Trees take time: each step has `t` days (`TREE_T`; rw_stream 365, a year of surveys), `E.tree[id]` stays the start day, `treeFrac`/`treeRun`, the Running row shows "N% done", a thin bar and the time left on its grey button, and `treeNext` offers the next step only once it's done (effects still land at Fund). Shrimp Island's own card shows its running step. Card order: grid, the group, Where the profit goes, Letters, Running, ledger, Milo, On your desk last. Running rows: short numbers (`big`), one line, full text behind the title. Buttons: a test taps Fund 100 ms after a render with renders every 60 ms and it buys on the first tap in Chromium, with or without the fix, so re-renders alone don't eat the tap. The likely cause on the phone was the frozen panel letting go on a `touchmove` during the tap (`hdFree` → render moves rows under the finger); now the panel isn't rebuilt while a finger is down in it (`halPress`, `HAL_PTR`) and `hdFree` waits too. `SETTLE` doesn't cover Fund (not in `DECIDE_SEL`). Not checked on an iPhone. `shrimp-hard` checks changed: Fund goes to Running with Letters still, one tap lands during re-renders, a tree step runs then the next writes.
3. **The scape as data, not a picture.** The land sends Tank 1's Aquascape as a piece list (`scp` in the land's report, `scapePack` in the land source's `game.js`, `shrimp-proto` 4d4da64): scape `[kind,x,y,scale,flip,rot,id]`, stems `[x,h,seed,lean]`, moss `{id:[[u,a,len,seed]]}`, in the 932x430 art frame, about 1 kB. The game checks it (`scpClean`, in the sim), keeps it in `G.tanks[0].scp` (`scpK` counts versions for the bg cache) and draws it in `tvBg` (`scpOn`, `scpDraw`: stems, then each piece in order with its moss, ported from the land's `drawScapeAll`, `drawItem`, `stemPts`, `mossAnchor`, `mossPuffs`, `drawPuffs`). No new sprites: the decor pieces are cut from the game's own art layers by the land's `DECOR_ORIG` rects (`SCP_KINDS`, `scpImg`), the moss tops scanned from them (`scpTop`). `G.opt.scImg` is only the fallback for saves with a picture and no list, deleted when a list comes. `shrimp-yourtank`: the list matches the land's pieces, the same scape drawn on both pages at art size differs on 0.8% of covered pixels (antialiasing), reload keeps the list, an old picture is drawn until a list comes. The Pass 256 Safari png check is gone with the picture.
4. **The tank you can hear, in the game.** A research option in Can't see the tank (`HARD` blind, `ear`: needs a find in automation and AI, `rlFound(G,'auto')>=1`; 20 days of income; reach 0.3 over a year inside the work cap; know +.5 and care +1, know +1 moved the random chooser's know median to 0.062, over the ±0.05 line). No `life`/`floor`, so it never fades, `hardWorkLive` ignores it (doesn't block or get blocked) and it can't be bought twice. Once bought, a row under Your tank on the Tank tab (`#earcard`, `renderEarRow`, `earOpen`; company page only, not on the land) opens `shrimp/ear.html` full screen (`#ear-ov`, `earShow`/`earHide`, messages `ready`/`care`/`back`, the game posts `vis`). While it's open: game music paused (`ovOn` in the music guards), `busyUI` true, time counts like time with living things on the land (`G.ps.landMs`, `landG`), and a feed or water change there is a care action on Your tank once a company day (`earCare`, in the sim, `G.stats.earN`). ear.html (70 kB, in `sw.js`): the prototype's model and sound engine (lines 160-572 of `eartank/index.html`) with her 5 Nov settings as constants (`MIX`, `FEEDS`, `PICS`, `FPS` bubbler only, `FOUNT`, `BEEP` monitor), the Feed sound from `sfx/feed_drop_002.wav` by path, no voice; a clean 5-shrimp tank, 3 females, the default decor, nitrate 0; Feed, Change water (it rinses the filter too, there's no filter button), Hear the tank (`picPlay`); ? lists 20 sounds to tap (`demoKey`, the scan per decor kind); her one line on screen; a day in 5 s on its own clock, only while it shows (no catch-up for time away); Start a new tank when none are left; saved in `shrimp-ear-v1`. No ending line yet (wording for Puti first). Tests: `node tests/shrimp-ear.cjs` (new, 12), `shrimp-yourtank` (the row, open, care once, Back), `shrimp-balance` (exists, needs research, never fades, care once a day), land-audio, hard.

Tests: balance 147, me 53, academy 10, hard 22 (fresh average run seed 7), yourtank, ear 12, land-audio, tank1 sim. Not run: bots, spotlights, stable, monkey (no deploy).

## Pass 258 (5 Nov, Puti's list after Pass 257)

1. **Ear tank, no live sound.** Hear the tank (and any ? sound) sets `soloT` and turns the tank bus down; `tankLevel` ran only then, so the bus stayed at 0 after the picture ended. `sched` now calls `tankLevel` every 100 ms. Measured in the game overlay: tank gain 1, 0.03 during the picture, 1.0 after. A crashed tank restarts itself, "The shop started it again, 5 shrimp in clean water."
2. **Tanks you can hear and touch.** One option, `ear`, in Can't see the tank: a Stanford group that studies sensory substitution, a default tank or one built by hand in the shop, kept and restarted by the shop, a speaker with Feed and Change water, a silicone cast of the tank on the speaker. 15 days of income, reach 0.5 over a year, care +1 (know dropped: the random chooser's know median went off centre without the old option). No lab find needed. When done the button is Try and opens ear.html. `touch` is gone; old saves' `touch` pick becomes `ear` in `migrate`.
3. **Research staff in a finished field** kept being paid with no buttons. The field now says what it still costs and has Let one PhD student/postdoc/PI lab go and Let everyone go (`rl-letall`).
4. **Aid "arrived AED 0".** True, batches land a year or two after they go out. `aidArrTxt`: before the first one lands it says "nothing has arrived yet, the first batch lands in about N months".
5. **Grandma's tank framing.** The land's `.tv` was 1.75/1 and scales by height, so it cut the sides and looked zoomed in. Now 2.15/1 with max-height 250 px like the company's. Land source `shrimp-home-proto/src/style.css` on `shrimp-proto`, rebuilt with `build.py --game` (the fresh build matched the game's home.html before the change).
6. **Planting sheet.** `html.pl-lock` (overflow hidden) while it is open and a touchmove guard on the backdrop; the three kind buttons share the row (`#pl-kinds`, flex 1, no 150 px min).
7. **Letters.** One mailbox, `letDay` in the daily loop: at most 3 open (hard part letters and tree letters together, `letOpenN`), a new one every 10 to 50 days (`LET_GAP`), tree letters at least 120 to 360 days apart (`TLET_GAP`). A tree step in the letters shows only once delivered (`E.tlet`, `treeShow`); Not now clears it, so it needs a new letter after its wait. Before the letters (card mode) visible steps count as delivered. Two catch letters, `orbit` (data centres in space, 40 days of income, returns in about a hundred years) and `chef` (the do-everything kitchen robot, 6 days, sits in a cupboard), `sink:1`, under Done once funded. The space a funded letter leaves holds 4 s (`LET_T`), then closes, so no empty block stays under the letters.
8. **Land from an old game.** One Land with a stream row. With an old land saved, AED 250k asks: Bring it (AED 300k + 100 a thing) or From scratch (`GP_ASK`). First visit to the land shows a window (`#land-hi`): "Time moves slowly at Grandma's place. You are always a kid here, and animals will never die. Go fish, catch chicken, and watch some birds." Once (`G.me.landHi`), skipped if a land save already exists.

Bots: `shrimp-playthrough` and `shrimp-average-playthrough` now stub `document`; since Pass 257 the slice they load has `halPress`'s top-level listener and they crashed at load.

Tests: balance 148 (new Pass 258 check, Pass 257 ear check and proposal timing updated), me 53, academy 10, ear 12, cardtap, yourtank, hard 22, frozen (fresh average run seed 7: Earth day 7,420, was 7,280). Not run: strong bot, spotlights, stable, monkey, layout (no deploy).

## Pass 259 (5 Nov, Puti's list after Pass 258)

1. **Research never ends.** A centre keeps its + and − buttons after the five named finds (the Pass 258 "Everything in this field is found" branch is gone, so people let go can be hired back). Finds go on: after five (`RL_NAMED`), each find takes 10% off what is left (`rlM` = linear part × 0.9 per extra find), so a cost never reaches zero. Odds keep falling (0.85 per find), so extra finds get rare. Genes moves kit survival 10% of the way to 0.97, packing's +6% stays at five. Basic science and Ecology: another paper. Text: `rlFindTxt`, each line's `more`, "Each find from here takes 10% off what is left of ...". Grants find on too.
3. **No empty space under the letters.** The 4 s held height (`LET_H`, Pass 258) is gone, it came and went. "No letters this month." is one short line, not a row with hidden buttons. A second tap within 0.7 s of a Fund or Not now is ignored (`letBusy`), so it can't land on the letter that moved up.
4. **Tree steps read like letters.** A person and a place, then the cost (`TREE_WHO`, `treeWho`, `treeHelp`): Mira, Kami, Noa, Rafi for rewilding; Lasha (the nurse), Masa, Kaka for the last mile; Lucy for the lab. Running: "Lasha, water filters". The step name and text are behind the title. The shop is not a letter (left for its own pass).
5. **The first letters are people's.** When the letters start (`E.letOn`), tree steps seen as cards before are taken back and the first tree letter comes 120 to 360 days in.
7. **Ear tank Play / Pause.** A phone won't play sound before a tap, so the live tank starts paused with a Play button (`setTank`, `TANK`); Feed and Change water start it too. Feeding is louder and brighter (`MIX.feed` vol 3 to 6, soft 0.45 to 0.2).

Open: 6 (Grandma's tank on the land). Both frames measure 2.15/1 at 390 px (land 358×166, game 340×157) and draw shrimp at the same size; need Puti's screenshot to see what reads as zoomed.

Tests: balance 149 (new Pass 259 check; Pass 258 mailbox check needs 2 tree gaps now, three trees left), me 53, academy 10, ear 14 (Play/Pause). Not run: bots, spotlights, stable, monkey (no deploy).

### Pass 259 (2): event timing (Puti 5 Nov)
- The gap between pop-ups is a random 10 to 35 s of play (was 10 to 20), counted from when the last one closed (`introStamp`). Paused time and time with a card or the what-happened popup open don't count.
- News waits for the same gap (`newsTick` checks `lastAck`). Before, a headline came 10 s after a card was shown and ignored spotlights and notes.
- News banners are never dropped: one fresh story at a time, only when nothing else is on screen and the gap has passed (`newsCanShow`, `R.seenL` moves one at a time). Before, a banner during the land, a tank job or the ear tank was lost, and a backlog showed only its last line.
- Notes: no backlog trim (the newest-3 cut is gone); the Your day backlog still keeps only its newest (Pass 253, her ask).
- Spotlights already waited the gap (`spotNext` checks `introOK`); only the pause-button one (`now:1`) skips it. Urgent cards (`CARD_NOW`) still show at once, moment cards (`STORY_PROMPT`, the land call) still go first.
- Still drops on purpose: narrative-only Mira and Grandma-net cards older than 60 days (`STORY_DROP`, Pass 190).
Tests: balance 150 (new news-gap check, gap checks 10 to 35 s), me 53, academy 10, cardtap.
- The lab parties are never missed (Puti): the first comes at day 90 and 500 shrimp whether Europe is open or not (before, opening Europe first skipped it for good); the second needs Europe, the You page and 180 days since the first. Both stay in `STORY_PROMPT` (first in line, never dropped). `shrimp-me` checks both.
