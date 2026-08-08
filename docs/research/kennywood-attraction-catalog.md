# Kennywood Attraction catalog (research draft)

**Ticket:** [#3 Research and draft the Kennywood Attraction catalog](https://github.com/blocher/kennywood/issues/3)  
**Retrieved:** 2026-08-08 (UTC)  
**Board membership source:** Queue-Times park `312` live list only

## Question

What is the curated Attraction catalog for Kennywood Waits — mapping each Queue-Times ride id for park 312 to Ride type and Height filter facts?

## Sources

| Source | Role | URL |
| --- | --- | --- |
| Queue-Times park 312 `queue_times.json` | Board membership (ride id + name only) | https://queue-times.com/parks/312/queue_times.json |
| Kennywood Accessibility — Individual Ride Information | Primary Height filter / companion / max-height wording | https://www.kennywood.com/accessibility/ |
| Kennywood Attractions index + per-Attraction pages | Primary Ride type labels; cross-check height bands | https://www.kennywood.com/discover-the-park/attractions/ |

Out of scope for this draft: weight limits, casts/prosthetics, exceptional-size fit rules (Eligibility v1 is height envelope only).

## Ride type taxonomy

### Starting set (from product language)

`roller coaster` · `thrill ride` · `other non-kid ride` · `dark ride / walk-on` · `kiddie ride`

### Adapted set (recommended)

Kennywood first-party Attraction pages publish a category label (and a separate intensity such as Mild / Moderate / Intense Thrill). Intensity is **not** used as Ride type here — it is orthogonal.

Observed first-party category labels on Attractions in the Queue-Times board:

| First-party label | Example Attractions | Notes |
| --- | --- | --- |
| Roller Coaster | Phantom’s Revenge, Exterminator, Jack Rabbit, … | Exterminator is labeled Roller Coaster; copy also calls it a dark coaster |
| Thrill Ride | Aero 360, Black Widow, Spinvasion, SwingShot | |
| Family Ride | Kangaroo, Turtle | |
| Dark Ride | Ghostwood Estate, Noah’s Ark, Old Mill | Noah’s Ark is a walk-through funhouse |
| Water Ride | Raging Rapids, Pittsburg\* Plunge | |

Accessibility also groups a **Children’s Rides** section (Lil’ Phantom, Whippersnapper, …). None of those ids appear in the current Queue-Times board.

**Proposed Ride type set (one per Attraction):**

1. `roller coaster`
2. `thrill ride`
3. `family ride` — replaces starting `other non-kid ride`
4. `dark ride / walk-on` — first-party `Dark Ride`, including walk-throughs
5. `water ride` — first-party `Water Ride` (clearer than folding into thrill)
6. `kiddie ride` — accessibility Children’s Rides (unused on current board)

Seasonal holiday-only board rows without a first-party Attraction page are marked `unknown` until confirmed.

## Height filter conventions

- Heights are in **inches**, as published.
- **Height filter envelope** for Eligibility: lowest height that may ride (including companion-supervised bands) through any published maximum.
- Companion bands are recorded separately; v1 Eligibility assumes a supervising companion is available.
- Absolute **min = unknown** when the park publishes no numeric floor (only “under X with companion” / infants rules).
- Do **not** invent values. Conflicts between Accessibility and Attraction pages are called out; envelope uses the Accessibility Individual Ride Information text unless noted.

## Catalog (Queue-Times board membership)

Snapshot: **20** rides from `https://queue-times.com/parks/312/queue_times.json` on 2026-08-08 UTC (`lands` empty; flat `rides` array).

| QT id | Queue-Times name | Ride type (proposed) | Height filter envelope (in) | Companion / max notes | Gaps |
| --- | --- | --- | --- | --- | --- |
| 11037 | Aero 360 | thrill ride | 48 – none | Solo min 48″; no companion band; no max | First-party page label: Thrill Ride. Accessibility + Attractions agree 48″. |
| 11027 | Black Widow | thrill ride | 52 – none | Solo min 52″; no companion band; no max | First-party: Thrill Ride. Agree 52″. |
| 11029 | Exterminator | roller coaster | 46 – none | Companion **46″–59″**; solo ≥60″; no max | First-party: Roller Coaster (also marketed as dark coaster). Agree 46″ / 46–59 companion. |
| 11036 | Ghostwood Estate | dark ride / walk-on | **unknown** – none | Companion for shorter riders; infants not permitted; no max | First-party: Dark Ride. **Conflict at 46″:** Accessibility: “46″ and under” need companion; Attraction page: “under 46″”. No absolute min published → envelope min **unknown**. |
| 12431 | Gingerbread Express | unknown | **unknown** – unknown | — | Seasonal Holiday Lights name on Queue-Times. **Not** listed on Accessibility Individual Ride Information. No first-party Attraction page found under that name. Secondary coverage often aliases it to Olde Kennywood Railroad; **not used here** without first-party confirmation. Candidate if confirmed same Attraction: Family Ride; under 46″ companion; infants permitted; envelope min unknown (OKR Accessibility / Attraction page). |
| 11032 | Jack Rabbit | roller coaster | 42 – none | Companion **42″–48″**; solo ≥48″ assumed at upper bound; no max | First-party: Roller Coaster. Accessibility + Attractions agree wording “between 42″ and 48″” companion. Exact inclusivity of 48″ in the companion band is slightly ambiguous in prose; treat 48″ as solo-capable (matches Attraction Min 42″ + companion band to 48″). |
| 11025 | Kangaroo | family ride | 42 – none | Companion **42″–48″**; no max | First-party: Family Ride. Agree 42″ / 42–48 companion. |
| 12448 | Noah’s Ark | dark ride / walk-on | **unknown** – none | Under 46″ with companion; infants not permitted; no max | First-party: Dark Ride (walk-through). Accessibility: “under 46″”; Attraction agrees. Envelope min **unknown** (no absolute floor). |
| 11035 | Old Mill | dark ride / walk-on | **unknown** – none | Under 46″ with companion; infants not permitted; no max | First-party: Dark Ride. Agree. Envelope min **unknown**. |
| 11031 | Phantom's Revenge | roller coaster | 48 – none | Solo min 48″; no companion band; no max | First-party: Roller Coaster. Agree 48″. |
| 14916 | Pittsburg\* Plunge | water ride | 36 – none | Companion **36″–46″**; no max | First-party: Water Ride. Accessibility: “at least 36″”; “between 36″ and 46″” companion. Attraction agrees. |
| 11030 | Racer | roller coaster | 46 – none | Solo min 46″; no companion band; no max | First-party: Roller Coaster. Agree 46″. |
| 12113 | Raging Rapids | water ride | 43 – none | Companion **43″–51″**; no max | First-party: Water Ride. Agree 43″ / 43–51 companion. |
| 14377 | Rudolph the Red-Nosed Reindeer Experience | dark ride / walk-on *(provisional)* | **unknown** – unknown | — | Seasonal Holiday Lights entry on Queue-Times. **Not** on Accessibility Individual Ride Information. Park Holiday Lights marketing describes meeting Rudolph characters / immersive holiday experience (walk-oriented), not a height-restricted ride. Height filter **unknown**; Ride type provisional until a first-party Attraction page exists. |
| 11024 | Sky Rocket | roller coaster | 52 – none | Companion **52″–55″**; solo ≥56″; no max | First-party: Roller Coaster. Agree 52″ / 52–55 companion. |
| 11891 | Spinvasion | thrill ride | 48 – none | Solo min 48″; no companion band; no max | First-party: Thrill Ride. Agree 48″. |
| 11034 | Steel Curtain | roller coaster | 52 – **77** | Solo min 52″; **max 77″**; no companion band | First-party page (`/attractions/the-steel-curtain/`): Roller Coaster; Min 52 / Max 77. Accessibility agrees 52″ and max 77″. |
| 11033 | SwingShot | thrill ride | 48 – none | Solo min 48″; no companion band; no max | First-party: Thrill Ride. Agree 48″. |
| 11028 | Thunderbolt | roller coaster | 52 – none | Solo min 52″; no companion band; no max. Accessibility: “Partner is required to ride.” | First-party: Roller Coaster. Height agree 52″. Partner requirement is **not** modeled in Height filter / Eligibility v1. |
| 11026 | Turtle | family ride | **unknown** – none | 46″ and under / under 46″ with companion; infants not permitted; no max | First-party: Family Ride. **Conflict at 46″:** Accessibility “46″ and under”; Attraction “under 46″”. Envelope min **unknown**. |

## Unresolved gaps

1. **Seasonal QT-only Attractions** — Gingerbread Express (`12431`) and Rudolph the Red-Nosed Reindeer Experience (`14377`): no Accessibility Individual Ride rows; heights unknown. Product map already flags seasonal QT entries as unspecified.
2. **Companion-band boundary inclusivity** — Several rides say “between A″ and B″” without stating whether B″ is companion or solo. Catalog assumes companion through B″ inclusive and solo above B″ unless first-party clarifies.
3. **46″ companion phrasing conflict** — Ghostwood Estate and Turtle (and several non-board Attractions) disagree between Accessibility (“46″ and under”) and Attraction pages (“under 46″”) at exactly 46″.
4. **No absolute min** — Ghostwood Estate, Noah’s Ark, Old Mill, Turtle: Height filter min remains **unknown** for numeric Eligibility until the park publishes a floor (infant exclusion is not a height).
5. **Thunderbolt partner rule** — Height-only Eligibility will over-admit solo Riders relative to park policy.
6. **Board coverage vs park inventory (updated 2026-08-08)** — Queue-Times still lists only **20** Attractions for park 312. First-party Kennywood Accessibility / Attractions pages list many more (Cosmic Chaos, Wave Swinger, Musik Express, Potato Smash, Auto Race, Merry-Go-Round, Whip, Pirate, Olde Kennywood Railroad, Paddle Boats, Kenny’s Cargo Drop, and Children’s / Kiddieland Attractions). **Cosmic Chaos** is a live Thrill Ride (Min 48″) on kennywood.com and Accessibility, but it has **no Queue-Times wait row** — that is why it was absent from the QT-only board. Product now catalogs those first-party Attractions with local ids (`900001+`) and lists them with Wait `—` / “no wait data” until QT adds them.
7. **Height Requirements PDF** — A `KNW_2025_HeightRequirements.pdf` link appears in search indexes but returned 404 at research time; Accessibility + Attraction pages were used instead.

## First-party Attractions without Queue-Times waits (final pass)

Retrieved 2026-08-08 from Accessibility Individual Ride Information + Attraction pages. Live QT `queue_times.json` rechecked the same day — still no ids for these names.

| Local id | Name | Ride type | Height envelope (in) | Sources |
| --- | --- | --- | --- | --- |
| 900002 | Cosmic Chaos | thrill ride | 48 – none | Attraction Thrill Ride; Accessibility ≥48″ |
| 900004 | Musik Express | thrill ride | 50 – none | Attraction Thrill Ride; Accessibility ≥50″ |
| 900008 | Pirate | thrill ride | 39 – none | Attraction Thrill Ride; Accessibility ≥39″ / companion 39–48″; Attractions index Temporarily Unavailable |
| 900001 | Auto Race | family ride | unknown – none | Attraction Family Ride; Accessibility under 46″ companion |
| 900003 | Merry-Go-Round | family ride | unknown – none | Attraction Family Ride; Accessibility under 46″ companion |
| 900005 | Wave Swinger | family ride | 46 – none | Attraction Family Ride; Accessibility ≥46″ |
| 900006 | Whip | family ride | unknown – none | Attraction Family Ride; Accessibility 46″ and under companion |
| 900007 | Potato Smash | family ride | 42 – none | Attraction Family Ride; Accessibility ≥42″ / companion 42–48″ |
| 900009 | Olde Kennywood Railroad | family ride | unknown – none | Attraction Family Ride; Accessibility 46″ and under companion |
| 900010 | Paddle Boats | family ride | unknown – none | Attraction Family Ride; fee; under 46″ companion |
| 900011 | Kenny's Cargo Drop | family ride | 42 – none | Attraction Family Ride; Accessibility ≥42″ (also under Children’s Rides) |
| 900012 | Coal Haulin’ Convoy | family ride | unknown – none | Attraction Family Ride; under 36″ companion |
| 900015 | Fire Bustin’ Brigade | family ride | unknown – none | Attraction Family Ride; under 36″ companion; Temporarily Unavailable |
| 900018 | Parker's Cloud Cruisers | family ride | unknown – none | Attraction Family Ride; under 36″ companion |
| 900017 | Lil’ Phantom | kiddie ride | unknown – none | Product: Kids (Attraction page says Roller Coaster / Kiddieland); under 36″ companion |
| 900013 | Crazy Trolley | kiddie ride | unknown – none | Accessibility Children’s Rides; under 42″ companion |
| 900014 | Dizzy Dynamo | kiddie ride | unknown – none | Accessibility Children’s Rides; under 36″ companion |
| 900016 | Kenny's Karousel | kiddie ride | 36 – 52 | Accessibility Children’s Rides |
| 900019 | Red Baron | kiddie ride | 36 – 56 | Accessibility Children’s Rides |
| 900020 | Steel City Choppers | kiddie ride | 36 – 56 | Accessibility Children’s Rides |
| 900021 | Turtle Chase | kiddie ride | unknown – none | Accessibility Children’s Rides; under 42″ companion |
| 900022 | Wacky Wheel | kiddie ride | 36 – 52 | Accessibility Children’s Rides |
| 900023 | Whippersnapper | kiddie ride | 36 – 52 | Accessibility Children’s Rides |
| 900024 | Whirlwind | kiddie ride | 36 – 48 | Accessibility Children’s Rides |

## Recommendation for product language

Adopt the adapted Ride type set above (`family ride` + `water ride` instead of `other non-kid ride`). Keep intensity (Mild / Moderate / Intense) out of Ride type filters unless a later ticket wants a second axis.

## Citations (per claim class)

- Board membership / QT ids / names: Queue-Times `queue_times.json` for park 312 (retrieved 2026-08-08 UTC; rechecked same day — Cosmic Chaos still absent).
- Height wording: Kennywood Accessibility Individual Ride Information for each named ride (retrieved 2026-08-08 UTC).
- Ride type labels and height cross-checks: Kennywood Attraction pages linked from https://www.kennywood.com/discover-the-park/attractions/ (retrieved 2026-08-08 UTC), including `/attractions/the-steel-curtain/` for Steel Curtain and `/attractions/cosmic-chaos/` for Cosmic Chaos.
