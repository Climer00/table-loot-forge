/* Table Loot Forge — gear mechanics */
(function(g){
const pick=a=>a[Math.floor(Math.random()*a.length)];
const chance=p=>Math.random()<p;
const fill=(t,m)=>t.replace(/\{(\w+)\}/g,(_,k)=>m[k]!=null?m[k]:"{"+k+"}");
function attune(r,s){if(chance(s.a))return " Requires attunement.";if(["Rare","Very Rare","Legendary"].includes(r)&&chance(.4))return " Requires attunement.";return "";}
const DMG="fire cold lightning thunder acid poison necrotic radiant force psychic".split(" ");
const SK="Stealth Athletics Acrobatics Perception Insight Survival Intimidation Persuasion Arcana".split(" ");
const SV="Strength Dexterity Constitution Intelligence Wisdom Charisma".split(" ");
const ADJ="Ashen Bright Cinder Crimson Dawn Dusk Ember Feral Frost Gilded Hollow Iron Jade Keen Lunar Mist Obsidian Quiet Riven Rune Scarlet Shadow Silver Storm Thorn Verdant Warden Wild Zephyr Blight Elder Glimmer Hearth Ivory Nettle Oaken Prism Quicksilver".split(" ");


function gearFx(type,r,s){
  const t=pick(DMG),sk=pick(SK),sv=pick(SV),{b,dc,d,D,u}=s;
  const str={Common:13,Uncommon:15,Rare:17,"Very Rare":19,Legendary:21}[r];
  const P={
    Weapon:[
      "Weapon (any you are proficient with). While wielding it you gain a +{b} bonus to attack rolls and damage rolls. Once per turn when you hit a creature with this weapon, you can deal an extra {d} {t} damage. Action economy: this extra damage is free on a hit (no extra action).",
      "Weapon. You gain a +{b} bonus to attack rolls with this weapon. When you score a critical hit, the target must succeed on a DC {dc} Strength saving throw or fall prone. On a success, nothing else happens beyond the critical hit.",
      "Weapon. You gain a +{b} bonus to damage rolls with this weapon. Bonus action ({u}): your next hit with this weapon before the end of your next turn deals an extra {D} {t} damage. If you miss, the charge is still spent.",
      "Weapon. Your attacks with this weapon score a critical hit on a roll of 19 or 20. Hit ({u}): the target must succeed on a DC {dc} Constitution saving throw or it can’t take reactions until the start of your next turn. On a success, no reaction lock.",
      "Weapon with the thrown property (range 20/60) in addition to its normal properties. You gain a +{b} bonus to attack rolls with it. After you throw it, it returns to your hand at the end of your turn (no action).",
      "Weapon. You gain a +{b} bonus to attack rolls with this weapon. Attacks with it ignore half cover (treat as no cover for that attack)."
    ],
    Armor:[
      "Armor (choose light, medium, or heavy when you claim it; DM may fix one). While wearing it you gain a +{b} bonus to AC. Action ({u}): you gain resistance to {t} damage for 1 minute (concentration not required). Uses refresh on a long rest unless noted.",
      "Armor. While wearing it you gain a +{b} bonus to AC. You have advantage on death saving throws.",
      "Armor. While wearing it you gain a +{b} bonus to AC. When a creature hits you with a melee attack ({u}), it takes {d} {t} damage. No save.",
      "Armor. While wearing it you gain a +{b} bonus to AC. You can don or doff this armor as an action (instead of the usual longer times)."
    ],
    Shield:[
      "Shield. While holding it you gain a +{b} bonus to AC (this stacks with the shield’s normal +2). Reaction ({u}), when you are hit by an attack: gain +2 AC against that attack (possibly turning the hit into a miss). Declare before damage.",
      "Shield. While holding it you have resistance to {t} damage. Bonus action ({u}): shield bash — one target within 5 ft takes {d} bludgeoning damage (magical). No attack roll; DM may call for a shove contest instead.",
      "Shield. While holding it you gain a +{b} bonus to AC. Allies within 5 feet of you gain +1 AC against ranged attacks while you hold the shield.",
      "Shield. Action ({u}): shove a 10-foot line (5 ft wide). Each creature in the line must succeed on a DC {dc} Strength saving throw or be pushed 10 feet away and knocked prone. On a success, no push/prone."
    ],
    Helmet:[
      "Head (helmet/circlet). While wearing it you gain a +{b} bonus to {sk} checks. You also gain darkvision out to 60 feet (or +30 feet if you already have darkvision).",
      "Head. While wearing it you have advantage on saving throws against being charmed. Action ({u}): end the frightened condition on yourself.",
      "Helm. While wearing it and conscious, you can’t be surprised. You also gain a +{b} bonus to Wisdom (Perception) checks that rely on sight.",
      "Circlet. Action ({u}): cast detect thoughts (save DC {dc}), concentration up to 1 minute. On a failed save the target’s surface thoughts are readable as the spell; on a success, they notice the probe and can shut you out."
    ],
    Cloak:[
      "Shoulders (cloak). While wearing it you have advantage on Dexterity (Stealth) checks. Action ({u}): mist lightly obscures your space for 1 minute (creatures have disadvantage on Perception checks relying on sight to see you in that mist).",
      "Cloak. While wearing it you gain a +{b} bonus to AC or to saving throws (choose one when you attune or first wear it; DM locks the choice). You also have resistance to {t} damage.",
      "Mantle. Action ({u}): for 10 minutes you leave no tracks and can’t be tracked by nonmagical means.",
      "Cloak. Reaction ({u}), when you are hit by a ranged attack: the attack misses instead. Declare after the hit is announced, before damage."
    ],
    Necklace:[
      "Neck. While wearing it you gain a +{b} bonus to {sv} saving throws.",
      "Amulet. Action ({u}): you regain {D} hit points (you can’t exceed half your hit point maximum with this healing). No save.",
      "Pendant. While wearing it you can breathe underwater, and you have advantage on saving throws against inhaled poison.",
      "Talisman. Action ({u}): cast sanctuary on yourself (save DC {dc}). On a failed save an attacker must choose a new target or waste the attack; on a success, sanctuary doesn’t protect you from that creature."
    ],
    Ring:[
      "Ring. While wearing it you gain a +{b} bonus to spell attack rolls and spell save DCs — or, if you prefer (DM), +{b} to checks with one ability of your choice. Pick when you first put it on.",
      "Ring. Bonus action ({u}): teleport up to 30 feet to an unoccupied space you can see (misty step). No attack/save.",
      "Ring. While wearing it you have resistance to {t} damage. Reaction ({u}), when you take that damage type: ignore that damage type until the start of your next turn.",
      "Band. Reaction ({u}), when you fail a saving throw: reroll the save and use the new roll. Once used, that charge is spent."
    ],
    Gloves:[
      "Hands. While wearing them you gain a +{b} bonus to Strength (Athletics) checks, and climbing doesn’t cost extra movement.",
      "Gauntlets. Your unarmed strikes deal {d} bludgeoning damage (magical) and you gain a +{b} bonus to attack rolls with unarmed strikes.",
      "Gloves. Action ({u}): mage hand for 1 minute (can carry up to 20 pounds). No attack; hand vanishes early if you cast another spell with somatic components (DM call).",
      "Grips. You have advantage on checks to keep hold of an object or creature, and you can’t be disarmed against your will unless the disarmer wins a contested check ({u} if you want the advantage only sometimes — otherwise always on)."
    ],
    Belt:[
      "Waist. While wearing it your Strength score is {str} (if your Strength is already higher, you instead gain +2 Strength, max 30 — DM). No action.",
      "Belt. Bonus action ({u}): take the Dash action.",
      "Girdle. Your carrying capacity is doubled, and you have advantage on checks and saves against being shoved or knocked prone.",
      "Sash. When you spend a Hit Die to recover hit points ({u}): roll the Hit Die as normal, then regain an extra {D} hit points."
    ],
    Boots:[
      "Feet. While wearing them your walking speed increases by 10 feet, and nonmagical difficult terrain doesn’t cost you extra movement.",
      "Boots. Bonus action ({u}): triple your jump distances this turn; landing doesn’t provoke opportunity attacks until the end of the turn.",
      "Treads. While wearing them you can walk on water and soft ground (mud, snow) as if it were solid earth. Difficult terrain from those surfaces doesn’t apply.",
      "Striders. Climbing doesn’t cost extra movement. Action ({u}): gain a climb speed equal to your walking speed and move across ceilings (spider climb) for 10 minutes."
    ]
  };
  if(type==="Weapon"&&(r==="Very Rare"||r==="Legendary"))P.Weapon.push("Weapon. You gain a +{b} bonus to attack rolls and damage rolls with this weapon. Action ({u}): unleash a 30-foot cone of {t}. Each creature in the cone must make a DC {dc} Dexterity saving throw. On a failed save, a creature takes {D} {t} damage; on a successful save, half as much.");
  let m=fill(pick(P[type]),{b:b||0,d,D,t,dc,u,sk,sv,str});
  if(!b)m=m.replace(/\+0 /g,"no bonus ");
  return m+attune(r,s);
}

g.TLF_gearFx=gearFx;
})(typeof window!=="undefined"?window:globalThis);
