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
