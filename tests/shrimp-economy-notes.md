# Shrimp production and purchase balance

The supply chain is breeding → shrimp holding → packing → finished stock →
customers. Every kit uses eight shrimp. Farms store potential kits/day in `out`
internally; the interface reports their actual shrimp/day. Farms never create
finished kits directly.

Breeding costs AED 12 per eight shrimp. Packing consumes the current materials
cost (initially AED 100). Distribution is charged for each sale, including
hand-packed kits. Production protects cash and tax reserves, budgets for both
breeding and materials, and slows when the warehouse or shrimp holding is full.
Holding targets at most three days of useful supply; warehouse settings remain
3/7/14 days. Profitable production can use a smaller operating cash floor when
cash is constrained, while still protecting accrued annual tax.

## Prices and capacity (24 Oct 2026)

Values come straight from `shrimp/index.html`. Check the code before quoting them.

**Home tanks.** Bigger tank steps 20/40/80/160/320/640 L cost AED 150/350/900/2,500/6,500. Second and third tanks AED 150 each, then standard tanks 4 to 12 after the SOP project. Winter heater AED 60, thermostat chiller AED 450. Gear lists auto feeder, auto water changer, fan, heater, tank, filter, then decor and treats.

**Water.** More than 200% of a tank's water changed in 7 days makes the colony molt at once and about half of everyone 10+ days old dies (`WC_CRASH`). Automatic changes stop at 150% a week (`WC_AUTO_MAX`).

**Hand packing.** Five steps a kit, five tools (bag stand AED 200 up to the box jig AED 1,500). All five make the packing station (AED 3,800, owner 1 kit/day, packers +3/day each). Second packing table AED 1,800 (owner 4/day, packers +8/day). Packers AED 35/day, salespeople AED 130/day (AED 40 part-time before kits open), shop managers AED 230/day. Kit price is locked at the start price for the first 50 kits.

**Robotic packing.**

| Stage | Cost | Kits/day | Upkeep/day | Needs kits sold |
|---|---:|---:|---:|---:|
| Robotic packing line | 150k | 400 | 20 | 300 |
| Automated packing hall | 8M | 12,000 | 2,400 | 10,000 |
| Regional packing hub | 120M | 120,000 | 48,000 | 300,000 |
| Global packing network | 3B | 2M | 2M | 10M |

**Farms.** One tier at a time: the next tier opens at its kit count (`FARM_AT`), and once you build it the older tier stops being sold (`farmBuyable`). Each extra farm of a type costs 9% more.

| Farm | Cost | Kits/day | Upkeep/day | Opens at kits sold |
|---|---:|---:|---:|---:|
| Commercial grow rack | 1,200 | 1 | 4 | farm licence |
| Shrimp barn | 30k | 10 | 60 | 20 |
| Breeding warehouse | 250k | 60 | 300 | 100 |
| Industrial hatchery | 1.2M | 250 | 1,200 | 300 |
| Mega hatchery | 20M | 7,000 | 35,000 | 10,000 |
| Ocean shrimp ranch | 300M | 50,000 | 250,000 | 300,000 + project |
| Shrimp arcology | 7.5B | 1M | 6M | 10M + project |

The farm licence needs three tanks with shrimp in them.

**Shops.** Weekend stall AED 1,500, pet shop corner AED 4,000, boutique AED 75,000, one tier at a time. Once the first mall store opens, no new small shops. Mall stores: fit-out AED 150k and AED 800/day each, times a regional factor (`MALL_F`). The goal is one store in five malls per region (`STORE_SHARE`). Stores raise trust in their region, which multiplies word of mouth: 85% at home and 60% elsewhere with no stores, up to 100%.

**Regions.** Abu Dhabi free, Dubai 250k, rest of the UAE 1M, the Gulf 8M, MENA 30M, Europe 200M, Southeast Asia 300M, the Americas 800M, East Asia 2B, then South Asia and Africa.

**Research.** The Lab tab opens at 3,000 kits sold (`ACADEMY_AT`). PhD students, postdocs (USD 50k a year base) and PI labs in six fields, paid daily until you stop. Staff also raise the research rate.

## Pacing and navigation

- Speeds: 4× while the tank cycles empty, 2× with shrimp, 4× after the first farm, 12× once earned, 40× after the win (`maxSpeed`).
- Tabs: Tank, Gear, Trade, Kits, Ads, World, Lab, plus the You page under the person button. Trade closes once farms make 10+ kits a day (`labMode`).
- Gear holds tank equipment, then farms and the breeding lab. After the first farm, the home tank gear folds into "Your home tanks".
- Ads holds advertising, sales staff, shops and mall stores, media projects and campaigns.
- World holds owners' tanks, regions, The Shrimp Times, politics and nature, Shrimpcoin and the hard part.
- The top Feed, Water and Sell buttons hide once every tank has an auto feeder, every tank has an auto water changer, and Trade has closed.

Purchase forecasts (with consultants) use current demand and capacity in the other stage. They say so when there's no payback.

## Existing saves

Migration is versioned and idempotent. Finished stock and farm counts remain.
Old farms receive matching legacy packing capacity, including mothballed farms
that may later restart. New farms require separate packing. Old farm salvage
uses the previous purchase-price curve, preventing a windfall from repricing.
Existing research, preferences, certifications and historical milestone handling
remain intact.

## Verification limits

Focused engine checks cover resource conservation, capacity, reserve protection,
migration, unlocks and recovery. Seeded full-game runs exercise real purchases
and must reach worldwide adoption without insolvency. These are strategy replays,
not evidence that every strategy is optimal or that human pacing is settled.
Browser checks cover actual purchases, all business tabs, phone layout, legacy
saves and the ending. Future tuning should use player behaviour as well as these
deterministic checks.

## Grandma’s ten-year dream

The opening gifts an empty tank and a hopeful ten-year challenge. The tracker
uses elapsed game time, with exact remaining days inside the journal. Opening
the journal pauses time. Letters accompany the first hatch, first kit, first
farm and millionth owner; the archive retains their original dates.

At day 3,650, an unfinished run pauses for a celebration with a snapshot of
its owners. It continues after acknowledgement. Worldwide adoption remains the
ultimate ending, with an extra achievement for finishing on or before day 3,650.
There is no death event, lost progress or failure state for passing ten years.
Existing games gain historical letters without replaying the opening, and an
existing game already past ten years does not invent an anniversary owner count.

Ocean and arcology construction prices were reduced from 600M/15B to 300M/7.5B
to make the achievement reachable while leaving early care, unlocks, production
capacity and packing requirements unchanged. Capital per daily potential kit
still rises from mega hatchery (5,714 AED) to ocean (6,000) to arcology (7,500).
This does not guarantee that every pricing or expansion strategy meets ten years.

## Research and Space

Research is the Lab tab (see above). Space opens only after every home on Earth has a tank, and only for curious players (`spaceOpen`). It never opens at year ten. Settled habitats fold into a summary, and the space ending doesn't stop unfinished Earth adoption.
