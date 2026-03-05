# AuraTables Implementation Todo

## Phase 1 – Foundation ✅
- [x] package.json with all deps
- [x] manifest.json (MV3)
- [x] vite.config.ts (CRXJS + Tailwind)
- [x] tsconfig.json
- [x] src/types/table.ts
- [x] src/types/settings.ts
- [x] src/db/schema.ts (Dexie)
- [x] src/db/queries.ts
- [x] src/store/ (tableSlice, uiSlice, settingsSlice, index)
- [x] src/utils/id.ts (nanoid + orderBetween)
- [x] src/utils/colors.ts
- [x] src/utils/export.ts
- [x] src/index.css (Tailwind v4 + CSS vars)
- [x] Static table layout (TableRoot → Header → Body → Row → Cell)
- [x] Placeholder icons

## Phase 2 – Cell Editing ✅
- [x] TextCell (with slash command trigger)
- [x] CheckboxCell
- [x] DateCell
- [x] UrlCell
- [x] SelectCell (dropdown)
- [x] MultiSelectCell (multi dropdown)
- [x] EmailCell
- [x] TableCell dispatcher

## Phase 3 – Drag and Drop ✅
- [x] DndContext in TableRoot
- [x] SortableContext in TableBody (rows)
- [x] SortableContext in TableHeader (columns)
- [x] useSortable in TableRow + ColumnHeader
- [x] DragOverlay
- [x] reorderRows / reorderColumns with orderBetween

## Phase 4 – Menus & Slash Commands ✅
- [x] ColumnMenu (rename, type, delete)
- [x] SelectOptionEditor (add/edit/recolor)
- [x] SlashCommandPalette
- [x] AddRowButton

## Phase 5 – Theme & Settings ✅
- [x] Options.tsx page
- [x] useSettings hook (CSS vars)
- [x] chrome.storage.sync integration
- [x] ColorPicker

## Phase 6 – Export & Polish ✅
- [x] export.ts (CSV + Markdown)
- [x] ExportMenu
- [x] TableToolbar (name edit, add column, export)
- [x] Column resize

## Remaining
- [ ] npm install + build verification
- [ ] Load unpacked in chrome://extensions

## Review
- Build pending, install deps first
