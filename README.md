# Table Loot Forge

On-the-spot **D&D 5e-flavored homebrew** loot generator for DMs. Pick a rarity, pick a type/slot, tap **Create** — get one table-ready **loot card** with a sensory **Description**, denser table-ready **mechanics**, and **2–3 sentences of lore**.

Built for mid-session speed: big tap targets, phone-first, adjudication-simple. Effects are familiar in shape (rarities, slots, DCs, dice) but freer than official items — everything is labeled **homebrew**.

UI is a charcoal/ember **loot forge** (not purple mystical) — quick DM drops mid-session.

## Open it

- **Repo:** https://github.com/Climer00/table-loot-forge
- **Live (main):** https://raw.githack.com/Climer00/table-loot-forge/main/index.html
- **Pinned (best share):** `https://raw.githack.com/Climer00/table-loot-forge/<commitSha>/index.html`
- Clone/download and open `index.html` in a browser (zero build). Keep `loot-flavor.js`, `loot-mech.js`, `loot-consumables.js`, and `loot.js` next to it if opening as local files.

## How to use

1. Select a **Rarity** — Common, Uncommon, Rare, Very Rare, Legendary  
2. Select a **Type** — Weapon, Armor, Shield, Helmet, Cloak, Necklace, Ring, Gloves, Belt, Boots, Scroll, Potion, Tincture  
3. Tap **Create** (enabled only when both are selected)  
4. Read the **loot card**: name, rarity/type chips, **Description** (look/feel), **table-ready mechanics**, and **lore** (2–3 sentences)  

Tap Create again anytime for another roll with the same filters.

### History

Creates are saved in **localStorage** (last ~30). The **History** section lists past cards — tap one to show it as the current card again. Use **Clear history** to wipe the list.

### Share / text to players

On each card (current + history):

- **Text players** / Share — uses the system share sheet (`navigator.share`) when available (title + plain-text card body). Great on iPhone for Messages, AirDrop, etc.
- **Copy card** — copies formatted plain text ready for iMessage/SMS/Discord (fallback on desktop when share isn’t available).
- On mobile without share: optional **Open in Messages** (`sms:?&body=`) with a shortened body.

Plain text looks like:

```
⚔️ NAME
Rarity · Type
Description: ...
Mechanics: ...
Lore: ...
(Homebrew)
```

## Design notes

- **Scrolls** — single-use spell-ish effects scaled by rarity (cantrip → high-level feel); homebrew names OK  
- **Potions** — clearer combat/utility quaffs  
- **Tinctures** — lighter, shorter herbal-alchemical sips  
- **Gear** — lasting magic items for the chosen slot; power (DC, dice, uses, attunement) scales with rarity  


## How items are created

This is **not** a fixed list of finished magic items. On Create, the app randomly combines curated template tables (rarity stat bands, type templates, name lists, description/lore fragments). For a plain-language walkthrough aimed at DMs and followers, see:

**[docs/HOW-ITEMS-ARE-CREATED.md](docs/HOW-ITEMS-ARE-CREATED.md)** — *How Items Are Created in Table Loot Forge*

## Share intent

Made to drop in a DM notes doc, Discord, or phone bookmark so you can forge loot between turns without leaving the table — then **Text players** or **Copy card** to hand it off fast.

## License / affiliation

Fan tool for personal/table use. Not affiliated with Wizards of the Coast.
