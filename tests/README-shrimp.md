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

Academic progression and parallel space chapter:

```sh
node tests/shrimp-academy.cjs
REVIEW_ACADEMY=1 REVIEW_KIT_PRICE=250 REVIEW_OUTPUT=/private/tmp/shrimp-academy-play node tests/shrimp-playthrough.cjs
ACADEMY_RUN=/private/tmp/shrimp-academy-play/run-7.json node tests/shrimp-space-playthrough.cjs
```

The academic suite checks prepaid budgets, idle/unfunded pauses, saved partial
work, effects applied to actual packing and machine purchases, funded career
requirements, teaching, old-save migration, independent year-ten access, Earth
archival after victory, and both heat-management routes. The space continuation
uses the anniversary state produced by the full Earth replay, buys missions and
habitat systems through simulation actions, completes new research and all four
worlds, checks every completed habitat is sustainable at full capacity, and
asserts Earth adoption grew during the space journey.

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
