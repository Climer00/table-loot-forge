# Table Loot Forge

A phone-friendly loot maker for DMs who need an item *right now*.

Pick a rarity, pick a slot, hit Create. You get one homebrew card: name, what it looks like, what it does, a little lore. Numbers follow 5e habits (rarities, DCs, dice) but the items themselves are made up. Every card is marked Homebrew.

Not an official treasure list. Not affiliated with Wizards of the Coast.

## Open it

- Live: https://raw.githack.com/Climer00/table-loot-forge/main/index.html
- Or download the repo and open `index.html`. No install, no build.

If the page looks stuck on an old version, hard-refresh. Phones love cached scripts.

## The two-tap path

1. Rarity (Common through Legendary)
2. Type (weapon, armor, worn slots, scroll, potion, tincture)
3. Create

Hit Create again with the same picks if you don't like the roll.

**Table** mode is the skinny phone column. **Desk** mode is the wide PC layout — controls on the left, cards on the right. Tabs are at the top. The page remembers which one you used.

## After a fight: crates

If you want a pile instead of one item, use **Crate**.

- Set player count and party level
- Chest or Boss
- Open crate

It's a shared stash, not one gift per PC. Slots don't repeat (you won't get four rings). Level picks the rarity band. Boss adds one extra showpiece a step above the rest.

Chest cards get a gold frame and a CHEST chip. Boss cards get an ember frame and a BOSS chip.

## History and sharing

Last ~30 creates stay on this device.

- Tap a history row to bring it back
- **Text players** / **Save image** send the card picture only
- **Copy card** copies the words you'd read to the table (no markdown, no DM notes)

Old history from before the full-card update may only have a name. Make that item again and it stores complete.

## What's on a card

Name, category line, a look paragraph, named properties, lore.

If a kit would have printed "you gain no bonus to …" that line is dropped.

**Sets** only show on lasting gear (weapons, armor, worn stuff). Two items that share a first name — Russet Drape and Russet Band — pick up a Russet Set line. Each piece still does its own thing. The set is extra. Same named bonus does not double. A third piece doesn't make the set stronger.

Potions, tinctures, and scrolls do not get sets.

## Rarity numbers

Rarity is the label and the numbers that get plugged into the kit.

| Rarity | Bonus | DC | Small / big dice | Uses | Attune? | Scroll feel |
| --- | --- | --- | --- | --- | --- | --- |
| Common | +0 | 11 | 1d4 / 1d6 | 1/day | almost never | cantrip |
| Uncommon | +1 | 13 | 1d6 / 2d6 | 1/day | sometimes | 1st–2nd |
| Rare | +1 | 15 | 2d6 / 3d6 | 2/day | usually | 3rd–4th |
| Very Rare | +2 | 16 | 3d6 / 4d8 | 3/day | almost always | 5th–6th |
| Legendary | +3 | 18 | 4d6 / 6d8 | at will | always | 7th–9th |

Very Rare weapons also pick a profile instead of always printing +2 to hit and damage: Duelist, Brutal, Balanced, Hungry, Keen, or Siege. The second line is a job (control, defense, movement, and so on), not another copy of "extra 3d6."

## How a card gets built

Create does not look up a finished official item. It mixes:

- the rarity numbers above
- a named kit for that slot
- name / look / lore scraps
- a set line on gear, if the name matches a theme

It also tries not to hand you the same kit twice in a row.

Longer walkthrough: [docs/HOW-ITEMS-ARE-CREATED.md](docs/HOW-ITEMS-ARE-CREATED.md)

## Files, if you're poking around

| File | What it's for |
| --- | --- |
| `index.html` | The page |
| `loot.js` | Create, history |
| `loot-flavor.js` | Looks and lore |
| `loot-mech.js` | Pick a kit and fill in the numbers |
| `loot-kits-*.js` | Gear kits |
| `loot-weapon-vr.js` | Very Rare weapon profiles |
| `loot-potions.js` / `loot-scrolls-*.js` | Sips and scrolls |
| `loot-crate.js` | Chest / Boss pile |
| `loot-desk.js` | Table / Desk layout |
| `loot-sets.js` | Set bonus on gear |
| `loot-share.js` | Player text and card image |
| `loot-hist.js` | Full text on history rows |
