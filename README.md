# Table Loot Forge

On-the-spot **D&D 5e-flavored homebrew** loot generator for DMs.
Pick a rarity, pick a type/slot, tap **Create** — get one table-ready **loot card** in a Beyond/DMG hybrid layout: category line, look, named properties, set bonus, and lore.

Built for mid-session speed: big tap targets, phone-first, adjudication-simple. Effects are familiar in shape (rarities, slots, DCs, dice) but freer than official items. Everything is labeled **Homebrew**.

## Open it

- **Repo:** https://github.com/Climer00/table-loot-forge
- **Live:** https://raw.githack.com/Climer00/table-loot-forge/main/index.html
- Or clone/download and open `index.html` in a browser (zero build, no install).

If a phone still shows an old card after a push, hard-refresh that live URL (or bump the `?v=` query on the script tags in `index.html`).

## How to use

1. Select a **Rarity** — Common, Uncommon, Rare, Very Rare, Legendary
2. Select a **Type** — Weapon, Armor, Shield, Helmet, Cloak, Necklace, Ring, Gloves, Belt, Boots, Scroll, Potion, Tincture
3. Tap **Create** (enabled only when both are selected)
4. Read the card: name, category line, look, named properties, **set bonus**, lore

Tap Create again anytime for another roll with the same filters.

### History

Creates are saved in **localStorage** (last ~30). History now shows the **full item** (look + properties), not just the name. Tap a row to bring it back as the current card. **Clear history** wipes the list on this device only.

Older rows saved before this update may still be stubs. Create those items once more and they store complete.

### Share to players

On the current card and on history rows:

| Button | What it does |
| --- | --- |
| **Text players** | Shares **only the card image** (PNG) through the phone share sheet |
| **Save image** | Same image — share sheet if the phone allows files, otherwise downloads the PNG |
| **Copy card** | Copies clean player text (no markdown, no DM asides) |

The image wraps look and properties inside the frame. It does not send a second text block under the picture.

## What is on a card

1. **Name** — adjective + noun (or `X of the Y`)
2. **Category line** — `Weapon (any), rare` / `Wondrous item (cloak), uncommon` / `Potion, common`
3. **Chips** — Homebrew, Attunement (if needed), **Set: Russet** (from the shared first name)
4. **Look** — short appearance paragraph
5. **Named properties** — `Zephyr Shawl. …` then `Gust Step. …`
6. **Set bonus** — extra rider if the wearer also has another item with the same first name. Does **not** double the same property. A third piece does not increase the set bonus.
7. **Lore** — origin / rumor / quirk

Zero-bonus lines are stripped. If a kit would have said “you gain no bonus to …” that sentence is not printed.

## Set bonus

Items that share a first name-word are a set:

- Russet Drape + Russet Band → **Russet Set**
- Seal of the Obsidian + Obsidian Helm → **Obsidian Set**

Wear two pieces from the same set: keep each item’s own properties, then add the set line. Same named property does not stack; use the better copy, then apply the set rider once.

## Rarity stat bands

Rarity is a label **and** the numbers filled into kits (`{b}`, `{dc}`, `{d}`, `{D}`, `{u}`):

| Rarity | Bonus | DC | Small / big dice | Uses | Attune chance | Scroll feel |
| --- | --- | --- | --- | --- | --- | --- |
| Common | +0 | 11 | 1d4 / 1d6 | 1/day | ~5% | cantrip |
| Uncommon | +1 | 13 | 1d6 / 2d6 | 1/day | ~35% | 1st–2nd |
| Rare | +1 | 15 | 2d6 / 3d6 | 2/day | ~75% | 3rd–4th |
| Very Rare | +2 | 16 | 3d6 / 4d8 | 3/day | ~90% | 5th–6th |
| Legendary | +3 | 18 | 4d6 / 6d8 | at will | always | 7th–9th |

If `{b}` is 0, that bonus line is omitted from the card.

## How items are created

This is **not** a catalog of finished official items. Create combines curated tables:

- rarity stat band
- a **named kit** for that slot (real titles, not `R5` / `Fx5` stubs)
- name + look + lore fragments
- set bonus keyed off the name

Gear draws from base kits + extra kits + pack files (`loot-kits-pack-*-1/2/3.js`) plus rarity-tagged extras. Consumables use `loot-potions.js` and `loot-scrolls-*.js`.

The forge keeps a local ring of recent effect signatures and re-rolls up to ~12 times so the same kit is less likely to land twice in a session.

Plain-language walkthrough: **[docs/HOW-ITEMS-ARE-CREATED.md](docs/HOW-ITEMS-ARE-CREATED.md)**  
Docs index: **[docs/README.md](docs/README.md)**

## File map

| File | Job |
| --- | --- |
| `index.html` | Phone UI + script load order |
| `loot.js` | Create pipeline, history, category line |
| `loot-flavor.js` | Look + lore fragments |
| `loot-mech.js` | Pick kit, fill placeholders, drop stub kits |
| `loot-kits-*.js` / `loot-kits-pack-*.js` | Named property kits per slot |
| `loot-potions.js` | Potions + tinctures |
| `loot-scrolls-*.js` | Scroll pools + picker |
| `loot-card-tidy.js` | Strip “no bonus” sentences |
| `loot-hist.js` | Restore full text on history cards |
| `loot-sets.js` | Set chip + set bonus line |
| `loot-share.js` | Player text + generated card image |

## License / affiliation

Fan tool for personal/table use. Not affiliated with Wizards of the Coast.
