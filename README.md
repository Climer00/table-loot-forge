# Table Loot Forge

Homebrew loot generator for D&D 5e tables. Pick a rarity and a slot, tap **Create**, get one card you can read out between turns.

Cards follow familiar 5e shapes — rarity, slot, DC, dice, attunement — but the items are built on the spot, not pulled from the DMG. Everything is labeled **Homebrew**. Phone-first, big tap targets, no login, no build step.

Not affiliated with Wizards of the Coast.

## Open it

- **Live:** https://raw.githack.com/Climer00/table-loot-forge/main/index.html
- **Repo:** https://github.com/Climer00/table-loot-forge
- Or clone / download and open `index.html` in a browser.

If a phone still shows an old card after a push, hard-refresh the live URL (or bump the `?v=` query on the script tags in `index.html`).

## How to use

1. Pick a **Rarity** — Common, Uncommon, Rare, Very Rare, Legendary
2. Pick a **Type** — Weapon, Armor, Shield, Helmet, Cloak, Necklace, Ring, Gloves, Belt, Boots, Scroll, Potion, Tincture
3. Tap **Create** (it stays off until both are selected)
4. Read the card: name, category line, look, named properties, set bonus on gear, lore

Tap Create again anytime for another roll with the same filters.

**Table** is the single-column phone layout. **Desk** is the wide PC layout (controls left, cards right). The tabs sit at the top of the page and the last choice is saved on the device.

### History

Creates are stored in `localStorage` on this device (last ~30). History shows the full item — look and properties, not just the name. Tap a row to bring it back as the current card. **Clear history** only wipes this device.

Rows saved before the full-card update may still be stubs. Create those items once more and they store complete.

### Share

On the current card and on history rows:

| Button | What it does |
| --- | --- |
| **Text players** | Shares only the card image (PNG) through the phone share sheet |
| **Save image** | Same image — share sheet if the phone allows files, otherwise a download |
| **Copy card** | Copies player-facing text (no markdown, no DM asides) |

Look and properties wrap inside the image. The share does not also dump a text block under the picture.

## Crates (chest / boss)

For a pile after a fight, not a single item:

- Set **players** (2–8) and **party level** (1–20)
- Pick **Chest** or **Boss**
- Tap **Open crate**

This is a party stash, not one item per PC. Gear slots in the same crate do not repeat. Level picks the rarity band. Boss adds one showpiece a step above the band.

| Players | Gear | Sips (potion / tincture / scroll) |
| --- | --- | --- |
| 2 | 2 | 1 |
| 3–4 | 3 | 2 |
| 5–6 | 4 | 3 |
| 7–8 | 5 | 3 |

| Party level | Most of the pile | Splash | Boss showpiece |
| --- | --- | --- | --- |
| 1–4 | Common | Uncommon | Rare |
| 5–10 | Uncommon | Rare | Very Rare |
| 11–16 | Rare | Very Rare | Legendary |
| 17–20 | Very Rare | Legendary | Legendary |

Chest cards get a gold frame + **CHEST** chip. Boss cards get an ember frame + **BOSS** chip. Every item still goes through the normal Create path, then lands in History.

## What is on a card

1. **Name** — adjective + noun, or `X of the Y`
2. **Category line** — `Weapon (any), rare` / `Wondrous item (cloak), uncommon` / `Potion, common`
3. **Chips** — Homebrew, Attunement if needed, Set on gear, CHEST/BOSS if it came from a crate
4. **Look** — short appearance paragraph
5. **Named properties** — `Zephyr Shawl. …` then `Gust Step. …`
6. **Set bonus** — gear only; extra rider if the wearer also has another item with the same first name
7. **Lore** — origin / rumor / quirk

If a kit would have printed “you gain no bonus to …” that sentence is dropped.

## Set bonus

Sets only apply to lasting gear (weapons, armor, worn slots). Potions, tinctures, and scrolls never get a set chip or set line.

Two items that share a first name-word are a set:

- Russet Drape + Russet Band → **Russet Set**
- Seal of the Obsidian + Obsidian Helm → **Obsidian Set**

Wear two pieces: keep each item’s own properties, then add the set line. The same named property does not stack — use the better copy, then apply the set rider once. A third piece does not increase the set.

## Rarity stat bands

Rarity is the label **and** the numbers filled into kits (`{b}`, `{dc}`, `{d}`, `{D}`, `{u}`):

| Rarity | Bonus | DC | Small / big dice | Uses | Attune chance | Scroll feel |
| --- | --- | --- | --- | --- | --- | --- |
| Common | +0 | 11 | 1d4 / 1d6 | 1/day | ~5% | cantrip |
| Uncommon | +1 | 13 | 1d6 / 2d6 | 1/day | ~35% | 1st–2nd |
| Rare | +1 | 15 | 2d6 / 3d6 | 2/day | ~75% | 3rd–4th |
| Very Rare | +2 | 16 | 3d6 / 4d8 | 3/day | ~90% | 5th–6th |
| Legendary | +3 | 18 | 4d6 / 6d8 | at will | always | 7th–9th |

If `{b}` is 0, that bonus line is omitted from the card.

**Very Rare weapons** do not always print +2 attack and +2 damage. They pick a profile, then a job rider:

| Profile | Stats |
| --- | --- |
| Duelist | +2 attack |
| Brutal | +2 damage |
| Balanced | +1 attack and +1 damage |
| Hungry | no static bonus; extra 2d6 once per turn |
| Keen | crit 19–20 and +1 attack |
| Siege | +2 vs objects/structures, +1 vs creatures |

The second line is control, defense, movement, cover, anti-caster, and similar — not another copy of “extra 3d6.” Hungry never pairs with a second damage rider.

## How items are created

This is not a catalog of finished official items. Create combines:

- the rarity stat band above
- a **named kit** for that slot (real titles, not `R5` / `Fx5` stubs)
- name + look + lore fragments
- a set bonus on gear, keyed off the first name-word

Gear draws from base kits, extra kits, pack files (`loot-kits-pack-*-1/2/3.js`), and rarity-tagged extras. Consumables use `loot-potions.js` and `loot-scrolls-*.js`.

The forge keeps a local ring of recent effect signatures and re-rolls up to ~12 times so the same kit is less likely to land twice in a session.

Walkthrough: [docs/HOW-ITEMS-ARE-CREATED.md](docs/HOW-ITEMS-ARE-CREATED.md)

## File map

| File | Job |
| --- | --- |
| `index.html` | UI, script load order |
| `loot.js` | Create pipeline, history, category line |
| `loot-flavor.js` | Look + lore fragments |
| `loot-mech.js` | Pick kit, fill placeholders, drop stub kits |
| `loot-weapon-vr.js` | Very Rare weapon profiles + job riders |
| `loot-kits-*.js` / `loot-kits-pack-*.js` | Named property kits per slot |
| `loot-potions.js` | Potions + tinctures |
| `loot-scrolls-*.js` | Scroll pools |
| `loot-crate.js` | Chest / Boss party stash |
| `loot-desk.js` | Table / Desk layout switch |
| `loot-card-tidy.js` | Strip “no bonus” sentences |
| `loot-hist.js` | Restore full text on history cards |
| `loot-sets.js` | Set chip + set bonus (gear only) |
| `loot-share.js` | Player text + generated card image |
