# How Items Are Created in Table Loot Forge

A short plain-language paper for DMs and followers who want to know what this tool actually does — and what it does **not** do.

---

## 1. This is not a printed loot table

Table Loot Forge does **not** store a vault of finished official magic items and pick one at random.

When you tap **Create**, the app **builds** a new item on the spot from curated pieces: name parts, a named mechanics kit, a rarity stat band, a look paragraph, lore fragments, and a set bonus keyed off the name (gear only).

That is why two Rare Cloaks almost never match — and why the tool feels like a forge instead of a catalog.

---

## 2. What you choose

You always pick two things before Create works:

1. **Rarity** — Common, Uncommon, Rare, Very Rare, or Legendary
2. **Type / slot** — Weapon, Armor, Shield, Helmet, Cloak, Necklace, Ring, Gloves, Belt, Boots, Scroll, Potion, or Tincture

Those two choices are fixed for that roll. Everything else is rolled from tables.

---

## 3. What rarity means: a stat band

Rarity is a label **and** the numbers filled into kit placeholders:

| Band | Role |
| --- | --- |
| Bonus `{b}` | Attack / damage / AC / check bumps (0 → 3). If the filled bonus is 0, that line is **not printed**. |
| Save DC `{dc}` | Typical DC for effects that call for a save |
| Small / big dice `{d}` `{D}` | Damage, healing, similar magnitudes |
| Uses `{u}` | `1/day` → `at will` |
| Scroll tier | Which scroll family to use (cantrip → high-tier feel) |

| Rarity | Bonus | DC | Small / big dice | Uses | Scroll feel |
| --- | --- | --- | --- | --- | --- |
| Common | +0 | 11 | 1d4 / 1d6 | 1/day | cantrip |
| Uncommon | +1 | 13 | 1d6 / 2d6 | 1/day | 1st–2nd |
| Rare | +1 | 15 | 2d6 / 3d6 | 2/day | 3rd–4th |
| Very Rare | +2 | 16 | 3d6 / 4d8 | 3/day | 5th–6th |
| Legendary | +3 | 18 | 4d6 / 6d8 | at will | 7th–9th |

Items do not require attunement.

---

## 4. What type means: a template family

- **Gear slots** — lasting magic items. A **named kit** is picked for that slot (`Zephyr Shawl` + `Gust Step`, not stub titles like `R5` / `Fx5`). Placeholders are filled from the rarity band.
- **Scroll** — single-use spell-like effect from the rarity’s tier list.
- **Potion** — combat / utility quaff.
- **Tincture** — shorter herbal sip.

Kit pools come from `loot-kits-*.js`, `loot-kits-extra.js`, and the pack files `loot-kits-pack-<slot>-1.js` / `-2.js` / `-3.js`, plus rarity-tagged extras. Stub kits (`Useful X magic while worn`) are filtered out before the roll.

---

## 5. The Create pipeline

1. Load the rarity stat band.
2. Branch by type (gear / scroll / potion / tincture).
3. **Name** — gear: adjective + noun (or `X of the Y` / `The X Y`). Consumables: `Potion of …`, `Tincture of …`, `Scroll of …`.
4. **Mechanics** — pick one named kit; fill `{b}`, `{dc}`, `{d}`, `{D}`, `{u}`, damage type, skill, save. Drop any sentence that would say “gain no bonus.”
5. **Anti-repeat** — fingerprint the kit titles (or consumable name). If that signature is in the last ~60 used effects, re-roll up to ~12 times.
6. **Look** — one sensory paragraph for that type.
7. **Lore** — 2–3 sentences from origin + rumor + quirk fragments.
8. **Set bonus** — gear only. First name-word becomes the set (`Russet Drape` → Russet Set). Potions, tinctures, and scrolls skip this.
9. **Card + history + share** — same fields drive the on-screen card, the history list, Copy text, and the generated PNG.

Nothing in that pipeline is “look up finished item #47.” It is always combination + fill.

---

## 6. History and share

- History stores the last ~30 **full items** in `localStorage` on this device.
- History rows show look + properties (not name-only stubs).
- **Text players** / **Save image** send the **card image only**.
- **Copy card** copies player-facing text: name, category, look, properties, lore. No markdown. No `(DM)` asides.

Share from a history row uses the stored item, so players get the same card they would from the fresh Create.

---

## 7. What is deterministic vs random

**You control**

- Rarity → stat band
- Type → kit family and look pools
- Whether you share image or copy text

**The forge rolls**

- Name pattern and words
- Which named kit
- Damage type / skill / save when the kit needs them
- Look line and lore fragments
- Which generic set rider if the name is not a known theme word
- Whether a recent-effect collision forces a re-roll

Same inputs never guarantee the same output.

---

## 8. How a DM should treat conflicts

Treat every card as **5e-flavored homebrew**, not official Wizards material.

- If text fights your table, you win. Trim a clause or rename the item.
- Two jump bonuses from two Zephyr pieces do not stack; use the better one, then add the set rider.
- Scroll “tiers” are feel bands, not exact Player’s Handbook levels.
- The forge hands you a clear card between turns. Adjudication and story stay with you.

---

## 9. Main files

| File | Job |
| --- | --- |
| `loot.js` | Pipeline, history, category line |
| `loot-flavor.js` | Look + lore fragments |
| `loot-mech.js` | Kit pick, placeholder fill, stub filter |
| `loot-kits-*.js` / `loot-kits-pack-*.js` | Named kits per slot |
| `loot-potions.js` | Potions + tinctures |
| `loot-scrolls-*.js` | Scroll pools |
| `loot-card-tidy.js` | Drop zero-bonus sentences |
| `loot-hist.js` | Full text on history cards |
| `loot-sets.js` | Set chip + set bonus |
| `loot-share.js` | Player text + card PNG |
| `loot-no-attune.js` | Strip leftover attunement text |

Repo overview: [../README.md](../README.md)

---

*Table Loot Forge — fan tool for personal/table use. Not affiliated with Wizards of the Coast.*
