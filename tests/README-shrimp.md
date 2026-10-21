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
