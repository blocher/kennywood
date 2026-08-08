# PROTOTYPE — Kennywood Waits board

Throwaway UI prototype for [issue #5](https://github.com/blocher/kennywood/issues/5).

**Question:** What should the Kennywood Waits first viewport / core interaction feel like?

## Run

```bash
cd prototype/waits-board
npm install
npm run dev
```

Open the printed localhost URL. Switch variants with the bottom bar or `←` / `→`, or:

- `?variant=A` — Stadium scoreboard (huge monospace waits)
- `?variant=B` — Poster stack (name-as-hero, wait stamp)
- `?variant=C` — Meter strip (proportional bars + chip rail)

Mock data only — no live Queue-Times. Filters / Group sheets are interactive stubs.
