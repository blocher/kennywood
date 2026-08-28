# Kennywood Wait Times

A day-of, phone-first board of live attraction wait times at Kennywood, with optional filtering by who in your group can ride.

## Language

**Attraction**:
A named ride or experience at Kennywood that can appear on the board with a wait time and eligibility constraints.
_Avoid_: Ride (when referring to the catalog entity — fine colloquially), attraction listing

**Wait time**:
The current estimated queue length for an Attraction, in minutes, from Queue-Times (or an equivalent live source).
_Avoid_: Queue length, ETA, line time

**Group**:
The set of people (first name + height) stored for this device, used only to filter Attractions by who can ride.
_Avoid_: Party, family, guests, visitors

**Rider**:
One person in the Group, identified by first name and height.
_Avoid_: Guest, member, person (when referring to a Group entry)

**Ride type**:
A coarse category used to filter Attractions. Locked set from Kennywood first-party labels: roller coaster, thrill ride, family ride, dark ride / walk-on, water ride, kiddie ride. Each Attraction has exactly one.
_Avoid_: Zone, category (unless referring to Ride type), kid ride (say kiddie ride), dark ride / walkthrough (say dark ride / walk-on)

**Land**:
A named park area an Attraction sits in. Locked set from Kennywood first-party names: Area 412, Kenny Lane, Kennyville, Kennywood Junction, Kiddieland, Lost Kennywood, Main Midway, Steelers Country, The Lagoon. Each Attraction has at most one.
_Avoid_: Zone, area (when naming the filter), Queue-Times land

**Attraction catalog**:
The hand-maintained map from live-source ride ids to Ride type, Land, Height filter, and related eligibility facts, curated from Kennywood’s published accessibility materials and other public sources.
_Avoid_: Ride database, metadata file (when speaking in domain terms)

**Height filter**:
The Attraction’s published height rules — companion minimum, solo minimum, and maximum — reduced for filtering to a rideable envelope (lowest allowed height through any maximum). V1 treats a missing companion minimum as no floor when a companion is present.
_Avoid_: Height requirement (when naming the filter UI concept)

**Wait range**:
A lower and upper bound on Wait time (minutes) used to filter the board; an Attraction matches if its current Wait time lies inside the bounds.
_Avoid_: Wait buckets, wait presets

**Height range**:
A lower and upper bound on hypothetical Rider height (inches) used to filter the board; an Attraction matches only if every height from lower through upper (inclusive) falls inside that Attraction’s Height filter envelope.
_Avoid_: Height slider (UI-only), height band filter

**Eligibility**:
Whether a chosen subset of Riders may ride an Attraction: every selected Rider’s height falls inside that Attraction’s rideable height envelope (including bands that officially require a supervising companion). V1 assumes a companion is available — it does not check other Riders in the Group for companion status. Selecting one or more Riders turns Eligibility filtering on for that subset; clearing the selection turns it off.
_Avoid_: Can ride, allowed, permitted
