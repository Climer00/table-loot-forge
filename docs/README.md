# Docs

App overview, live link, crates, sets, and the file map live in [../README.md](../README.md).

| Doc | What it covers |
| --- | --- |
| [HOW-ITEMS-ARE-CREATED.md](HOW-ITEMS-ARE-CREATED.md) | What Create actually does: rarity band, named kits, placeholders, anti-repeat, history, share |

Live: https://raw.githack.com/Climer00/table-loot-forge/e7ea11c85154be41c56b6cc0d2ce745158c0b888/index.html

Current behavior in short:

- Table path: rarity → type → Create
- Desk path: same generator, two-column PC layout
- Crate: party stash from player count + level; Chest or Boss
- Card: name, category, look, named kits, set bonus on gear, lore
- Sets: two items that share a first name-word; potions / tinctures / scrolls skipped
- Share: text to players; Save / Print for PNG, one card, or PDF
- History: last ~30 full items on this device; checkboxes print a 3×3 letter sheet
