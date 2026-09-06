# How Items Are Created in Table Loot Forge

A short plain-language paper for DMs and followers who want to know what this tool actually does — and what it does **not** do.

---

## 1. This is not a printed loot table

Table Loot Forge does **not** store a big list of finished magic items and pick one at random.

There is no hidden vault of “Sword of the Ember King +2” waiting to be drawn. When you tap **Create**, the app **builds** a new item on the spot by combining curated pieces: name parts, a mechanics template, a rarity “stat band,” a sensory description, and lore fragments.

That is why two Rare Weapons almost never look the same — and why the tool feels like a forge instead of a catalog.

---

## 2. What you choose (deterministic inputs)

You always pick two things before Create works:

1. **Rarity** — Common, Uncommon, Rare, Very Rare, or Legendary  
2. **Type / slot** — Weapon, Armor, Shield, Helmet, Cloak, Necklace, Ring, Gloves, Belt, Boots, Scroll, Potion, or Tincture  

Those choices are fixed for that roll. Everything else is rolled from curated tables: description/lore in `loot-flavor.js`, gear templates in `loot-mech.js`, scroll/potion/tincture templates in `loot-consumables.js`, and assembly/UI in `loot.js`.

---

## 3. What rarity really means: a stat band

Rarity is not only a label on the card. It selects a **stat band** used to fill mechanical placeholders:

| Band field | Role at the table |
| --- | --- |
| Bonus (`b`) | Attack/damage/AC/check bumps (0 → 3 by rarity) |
| Save DC (`dc`) | Typical DCs for effects that call for a save |
| Small dice (`d`) / big dice (`D`) | Damage, healing, and similar magnitudes |
| Uses (`u`) | How often a limited power refreshes (`1/day` → `at will`) |
| Attunement chance (`a`) | How likely gear asks for attunement |
| Scroll tier (`sp`) | Which scroll template family to use (cantrip → high-tier feel) |

**Power scaling by rarity is intentional and preserved.** The forge expands *prose* (clearer adjudication, description, lore) around those numbers — it does not nerf Legendary down to Common flavor.

---

## 4. What type really means: a template family

Type chooses **which family of templates** can fire:

- **Gear slots** (Weapon through Boots) — lasting magic items. Names come from adjective + noun lists for that slot. Mechanics come from a random **gear template** for that slot, with `{placeholders}` filled from the rarity band (and random damage type, skill, save, etc.).
- **Scroll** — single-use spell-like effects. A named scroll is picked from the rarity’s scroll tier list; DC and attack bonus come from the band.
- **Potion** — consumable quaffs with fuller combat/utility text.
- **Tincture** — lighter, shorter herbal sips (still consumable homebrew).

So: rarity sets *how hard the numbers hit*; type sets *what kind of object* you are forging.

---

## 5. The Create pipeline (step by step)

On Create, roughly this happens:

1. **Load the rarity band** from the fixed `S{…}` table.  
2. **Branch by type** — gear vs scroll vs potion vs tincture.  
3. **Name** — for gear: random adjective(s) + noun for that slot (a few name patterns). For consumables/scrolls: patterned titles (`Scroll of …`, `Potion of …`, `Tincture of …`).  
4. **Mechanics** — pick one template string from that type’s pool; replace `{b}`, `{dc}`, `{d}`, `{D}`, `{u}`, `{t}`, `{sk}`, `{sv}`, and friends with live values. Gear may append an attunement clause based on rarity chance.  
5. **Description (Look)** — pick sensory/appearance prose from pools keyed to type (what it looks and feels like at the table).  
6. **Lore** — compose **2–3 sentences** from fragments: an **origin**, a **rumor** (sometimes rarity-tinged), and a **quirk/maker** note when the roll includes all three. Fragments are filtered toward the item’s type when possible.  
7. **Card assembly** — chips (rarity, slot, Homebrew, optional Attunement), Description, table-ready mechanics, lore; history + share/copy use the same fields.

Nothing in that pipeline is “look up finished item #47.” It is always combination + fill.

---

## 6. Why results feel unique

Uniqueness comes from **combinatorial explosion**:

- Many adjectives × many nouns × several name patterns  
- Multiple mechanics templates per type × many fill-ins (damage types, skills, saves)  
- Separate description pools per type  
- Lore built from origin × rumor × quirk fragments (type- and rarity-aware)

Even with the same rarity and type, the odds of an identical name + mechanics + look + lore bundle are low. That is the point of a forge.

---

## 7. What is deterministic vs random

**Deterministic (you control):**

- Rarity → which stat band  
- Type → which template family and name/look pools  
- UI rules — Create disabled until both are selected; homebrew labeling; history size; share/copy format  

**Random (the forge rolls):**

- Which name pattern and words  
- Which mechanics template  
- Which damage type / skill / save (when the template needs them)  
- Whether attunement is required (weighted by rarity)  
- Which description line  
- Which lore fragments and whether you get two or three sentences  

Same inputs never guarantee the same output.

---

## 8. How a DM should treat conflicts

Treat every card as **5e-flavored homebrew**, not official Wizards of the Coast material.

- If text fights your table’s rulings, **you win**. Trim a clause, change a damage type, or rename the item.  
- If two features stack weirdly with an official item, call it a variant or unique relic.  
- Scroll “tiers” are **feel bands**, not exact Player’s Handbook spell levels.  
- Attunement, action economy, and saves are written to be DM-fast — still override when fiction demands it.  

The forge’s job is to hand you a clear, shareable card between turns. Your job is adjudication and story.

---

## 9. What stays the same for players at the table

- Flow remains **rarity → type → Create**  
- Cards still show homebrew labeling  
- History (local) and Text players / Copy card still work  
- Shared plain text includes Description, Mechanics, and Lore  

Only the richness of the generated text — denser mechanics, a visible Look/Description, longer tied lore — has grown.

---

*Table Loot Forge — fan tool for personal/table use. Not affiliated with Wizards of the Coast.*
