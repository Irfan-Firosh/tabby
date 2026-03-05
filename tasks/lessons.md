# Lessons Learned

## Project Setup
- `npm create vite@latest` interactive prompt requires TTY — can't use in non-interactive shells; create package.json manually instead
- CRXJS v2 beta supports MV3 with Vite 6

## Build Gotchas
- Dexie base class has its own `tables` property (a `Table[]` array) — naming your class property `tables` causes TS2416. Use `tablesStore` instead.
- `pnpm` is required; `npm` is blocked by a pre-tool hook.

## Architecture Decisions
- Separate cell storage (cell per DB record) avoids rewriting entire rows on single-cell edits
- Fractional indexing with `orderBetween` means drag-reorder = 1 DB write
- `Map<string, Cell>` in Zustand gives O(1) cell lookup by `${rowId}_${columnId}` composite key
- Tailwind v4 uses `@import "tailwindcss"` not `@tailwind base/components/utilities`
- CSS variables for accent + row-height enable dynamic theming without re-renders
