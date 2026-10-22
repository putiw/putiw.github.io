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
`/private/tmp/shrimp-tests`, or `REVIEW_OUTPUT` if supplied.

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

Academic progression and year-ten parallel space chapter:

```sh
node tests/shrimp-academy.cjs
REVIEW_ACADEMY=1 REVIEW_KIT_PRICE=250 REVIEW_OUTPUT=/private/tmp/shrimp-academy-play node tests/shrimp-playthrough.cjs
ACADEMY_RUN=/private/tmp/shrimp-academy-play/run-7.json node tests/shrimp-space-playthrough.cjs
```

The academic suite checks grant timing, idle/unfunded pauses, saved partial
work, effects applied to actual packing and machine purchases, funded career
requirements, teaching, old-save migration, Space opening at year ten,
Earth archival after victory, and both heat-management routes. The space
continuation starts from the ten-year snapshot, buys missions and habitat
systems through simulation actions, completes new research and all four worlds,
checks every completed habitat is sustainable at full capacity, and confirms
Earth adoption continues during the space journey.

The average-player replay uses the default kit price and buys one inexpensive
starter colony. It checks weekly while cycling and monthly after opening the
business, limits each visit to two investments, keeps the listed prices, and
does not calculate a perfect investment order. It completes the Earth and
space chapters without insolvency within 20 game years. This is a reproducible
conservative scenario, not observed human play data:

```sh
REVIEW_OUTPUT=/private/tmp/shrimp-average-monthly node tests/shrimp-average-playthrough.cjs
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
- Milestone card is compact: Grandpa's letter is folded into a "Grandpa's note" toggle (closed on each new milestone); smaller type on phones.
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
- Story: chapter pages at hatch (Ch 2 Small lives), kits (Ch 3 The first box), first farm (Ch 4 Scale), a million owners (Ch 5); story decision cards (Mira next door, the local paper, a cheaper rival, the routing agent, Room 4B, the marine survey, Grandpa on the roof) with small lasting effects (storyChoose). Feature intro cards (More tanks, Health check, Automate one step, Packing station, Bulk orders, World tab, Shrimp Times) pause, explain, and "Got it · show me" opens the tab. Legacy saves skip intros they are already past (progress.v2).
- Pacing: strong seeds 2,354–2,380 days; market+research 1,733; average Earth 6,292 days, 40.8 min waiting at top speed (+ hand packing and minigames).

## Voice pass (Claude)
- Story chapters, intros, events, Grandpa letters, space and win texts rewritten in a plain, short, comma-spliced voice. No flowery lines.
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
- Grandpa gives 5 shrimp if every tank is empty and cash is below AED 15 (every 60 days at most, before the farm).
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
- Space opens once everyone on Earth has a tank (`spaceOpen` = won), not at year ten. Winning early still jumps to the year-ten reunion for Grandpa's dream. Average bot starts space after Earth: seeds 7/1 Earth 5961/5951, space done 7292.
- Removed the call to prayer from Grandpa's star-gazing choice (now "until Grandma calls you in for dinner").

## Pass 48: no more Water/Fire, kind or cold paths, influence starts with Mira
- Water and Fire are gone. One public mood (`E.op.m`, `moodAdd`) sets how many will buy (`kitCap`) and referrals (`opMult`). Old two-faction saves migrate to their old overall appeal (`opFix`).
- Campaigns stay. Each offer has at least one honest message and one pushy one. Pushy ones move the mood more, some aren't true and can backfire later (Shrimp Times story, mood drop).
- Choices: 17 questions, each with a kind answer and a cold one (PROJ items with `fk`, question text in `FORK_Q`). Picking one closes the other. Cold answers are cheaper or pay every day (`dealsDay`: fish-food culls, filter cartridges, food pods, gene patent). Some cold answers come back later as news (`E.later`, `laterDay`): algae bloom, drained wetland, paid study, bribed inspector, fake reviews, bought politician. One choice shows per tab at a time.
- World is split into University, Media, Politics and Nature, one item per track. Costs mix money and ✦ by what makes sense (`m` and `i`). New: scholarships, lab name, stress study, gene, interview or buy the Shrimp Times, welfare law, buy a politician, tax haven, hamster tax, retraining or buying harbors, almond seed in every kit, Taiwan streams, take-back, solar farms, mangroves.
- Hidden heart (`E.heart`): kind choices, honest campaigns and kind film stories add, cold ones subtract. Never shown. It scales the good Shrimp Times stories (`heartMult`) and owners' welfare a little. The win card lists what the world looks like (`end` lines) and Grandpa's verdict (`endingVerdict`).
- Films: pick what each film is really about. Hidden effects (word of mouth, how many want one, mood, heart, flop chance), a Shrimp Times review on release. Films cost money and ✦. If you bought the Shrimp Times, every review is five stars and every story ends flattering you.
- Influence: no ✦ before Mira (`E.infOn`). Her story says what it is, every answer starts it. Old saves with ✦ keep it.
- Research opens at 200 kits. A postdoc for a year costs AED 50,000, then a PhD student AED 150,000 a year, then the AED 1M lab and bigger grants. First study: cheaper packing machines (lines, AI setup, camera, machines 25% less via `autoDisc`).
- Fixed: World projects only showed once every tank was fully upgraded (`inBiz` vs `business`).
- Bots: strong bot takes cold answers (`BOT_HEART=kind` flips), average bot kind ones (`BOT_HEART=cold` flips). Average bot opens new regions and the first research grant before extras. Its limit for both chapters is now 21 years (it already finished space on day 7292 of 7300).
- Pacing: strong bot cold day 2253, kind day 2449 (was 2499). Average bot Earth seeds 7/1: kind 6143/5990, cold 6047 (seed 7), space done 7488.
