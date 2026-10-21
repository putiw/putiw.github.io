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

## Changed prices and capacity

| Purchase | Previous price | New price | Role |
|---|---:|---:|---|
| Packing bench | 300 | 300 | Owner: 1 kit/day; each packer adds 3/day |
| Packer wage/day | 80 | 35 | Recurring labour, released explicitly |
| Sealer | 8,000 | 1,800 | Owner: 4/day; each packer adds 8/day |
| Counting camera | 30,000 | 3,000 | Doubles owner/packer capacity |
| Packaging machine | 60,000 | 12,000 | Adds 20 automatic kits/day |
| AI consultancy | 100,000 | 20,000 | Sales/shop management; no longer gates packing |
| Grow rack | 2,000 | 2,000 | 8 shrimp/day |
| Barn | 30,000 | 30,000 | 80 shrimp/day |
| Industrial hatchery | 600,000 | 1,200,000 | 2,000 shrimp/day |
| Mega hatchery | 15,000,000 | 40,000,000 | 56,000 shrimp/day |
| Ocean ranch | 50,000,000 | 600,000,000 | 400,000 shrimp/day |
| Arcology | 1,500,000,000 | 15,000,000,000 | 8,000,000 shrimp/day |
| Shelf ad | 150 | 600 | Corrects unusually cheap sustained reach |
| Expo ad | 4,000 | 900 | Short, stock-dependent launch campaign |
| Daily reel | 25 | 10 | Small repeatable launch campaign |

Robotic packing expands through 400 / 12,000 / 120,000 / 2,000,000 kits/day,
costing AED 150k / 8M / 120M / 3B before repeated-purchase scaling. Each stage
requires its preceding stage, fulfilled sales and sufficient breeding supply.
Machines add capacity; buying them never silently dismisses paid employees.

Tank equipment, shrimp packs, consumables, regions, culture projects and most
quality projects retain their prices. Routine care already has a distinct,
low-cost benefit. Regional/cultural prices remain the expansion gates; their
return depends on population, saturation and existing supply, not a fixed payout.
Farm marginal capital per daily potential kit rises through industrial tiers,
removing the former ocean-tier discount. Repeated purchases retain their existing
cost scaling.

Shop kit-order capacity rises to 1.5 / 3 / 12 / 90 / 1,400 per day before
management, price and saturation. Stall rent falls from AED 15k to 6k/year.
Shop previews include fit-out, upfront annual rent, first licence, management
effectiveness and a marginal kit-sales return estimate. Sales staff now increase
kit orders as well as individual shrimp demand. AI sales match four salespeople's
maximum demand bonus; ongoing token costs remain visible and AI sales token costs cap at AED 300/day
before research discounts.

## Pacing and navigation

- 12×: first hatch plus automatic feeding and water changes.
- 40×: barn-scale supply, automated packing and seven consecutive profitable
  fulfilment days. Once earned, it remains unlocked.
- Packers: 10 kits sold. Sealer: 20. Camera: 30 plus sealer. Packaging machine:
  100 plus camera. First robot: 300 plus barn-scale supply.
- Later breeding tiers require preceding development and 20 / 300 / 10k /
  300k / 10M kits sold. Selling earlier assets does not erase that development.
- World and influence projects open at 100 kits sold. Existing expanded empires
  retain access. Shop tiers and larger advertising formats also appear in stages.
- Kits owns pricing, inventory, packing, packing employees, quality/material
  development and reserves. Equipment evolves into Operations with breeding
  facilities; personal-tank equipment folds into an optional laboratory section.
- Marketing owns launch ads, sales/shop staff and distribution. At scale, local
  ads fold away and owner stories, customer care, regional partnerships and the
  global owner community improve referrals/retention.
- World owns regions, adoption projects, campaigns and films. Individual shrimp
  trade remains reachable through Kits after its main tab gives way to Kits.

Purchase forecasts use current demand and capacity in the other stage. They
explicitly report no positive payback when capacity or customers are missing.
They include variable cost and the purchase's added upkeep; unrelated overhead,
future referral growth and uncertain future prices are not guaranteed returns.

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
