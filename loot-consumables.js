/* Table Loot Forge — consumable mechanics */
(function(g){
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fill=(t,m)=>t.replace(/\{(\w+)\}/g,(_,k)=>m[k]!=null?m[k]:"{"+k+"}");
const DMG="fire cold lightning thunder acid poison necrotic radiant force psychic".split(" ");
const ADJ="Ashen Bright Cinder Crimson Dawn Dusk Ember Feral Frost Gilded Hollow Iron Jade Keen Lunar Mist Obsidian Quiet Riven Rune Scarlet Shadow Silver Storm Thorn Verdant Warden Wild Zephyr Blight Elder Glimmer Hearth Ivory Nettle Oaken Prism Quicksilver".split(" ");
const SCR={
  cantrip:[
    ["Sparkneedle","Cantrip. Action. Make a ranged spell attack (+{atk}) against a creature within 60 feet. Hit: {d} piercing damage plus {d} {t} damage. Miss: no effect. Scroll crumbles after casting."],
    ["Dustwhisper","Cantrip. Action. One creature you can see within 30 feet must succeed on a DC {dc} Wisdom saving throw or have disadvantage on the next attack roll it makes before the end of its next turn. Success: no effect."],
    ["Pebbleward","Cantrip. Action. Touch a willing creature: until the start of your next turn, it gains +2 AC against the next attack against it. Then ends."],
    ["Inkblink","Cantrip. Bonus action. You teleport up to 10 feet to an unoccupied space you can see, and a 5-foot cube of magical ink lightly obscures that space until the start of your next turn."],
    ["Hearthhiss","Cantrip. Action. A 5-foot cube adjacent to you flares with {t}. Each creature in the cube must succeed on a DC {dc} Dexterity saving throw or take {d} {t} damage. Success: no damage."]
  ],
  "1st–2nd":[
    ["Chain of Binding Light","1st–2nd-tier feel. Action. One creature within 30 feet must succeed on a DC {dc} Strength saving throw or be restrained for 1 minute (concentration). The target can repeat the save at the end of each of its turns; success ends the effect."],
    ["Surge of Mending Ash","1st–2nd-tier feel. Action. Touch a creature: it regains {D} hit points and ends one disease or the poisoned condition on it."],
    ["Howl of the Split Sky","1st–2nd-tier feel. Action. 15-foot cone. Each creature in the cone makes a DC {dc} Constitution saving throw. Fail: {D} thunder damage and deafened until the end of its next turn. Success: half damage, not deafened."],
    ["Veil of Borrowed Night","1st–2nd-tier feel. Action. You and willing allies of your choice within 10 feet become invisible for 1 minute. The effect ends early on a creature when it attacks or casts a spell."],
    ["Thornstep Gate","1st–2nd-tier feel. Action. Teleport up to 30 feet to an unoccupied space you can see. Creatures within 5 feet of your start or end space take {d} piercing damage (no save)."]
  ],
  "3rd–4th":[
    ["Sunder the False Wall","3rd–4th-tier feel. Action. 20-foot-radius sphere centered on a point within 60 feet. Creatures make a DC {dc} Dexterity saving throw. Fail: {D} force damage (objects take double). Success: half."],
    ["Covenant of Shared Breath","3rd–4th-tier feel. Action. Up to six creatures of your choice within 30 feet regain {D} hit points and gain temporary hit points equal to your level (or 10, if higher)."],
    ["Mirror of Hungry Steps","3rd–4th-tier feel. Action. Three illusory duplicates of you appear in your space for 1 minute (as mirror image). When a duplicate is destroyed, the attacker takes {d} psychic damage (no save)."],
    ["Saltfire Brand","3rd–4th-tier feel. Action. Ranged spell attack (+{atk}) against a creature within 60 feet. Hit: {D} {t} damage, and attack rolls against the target have advantage until the start of your next turn. Miss: no effect."],
    ["Quiet of the Deep Vault","3rd–4th-tier feel. Action. Create a 30-foot-radius sphere of silence centered on a point within 60 feet (concentration, up to 10 minutes). Chosen creatures you designate when you cast are immune to thunder damage while inside."]
  ],
  "5th–6th":[
    ["Crown of Living Storms","5th–6th-tier feel. Action. For 1 minute, when you hit with a spell attack, the target takes an extra {d} lightning damage."],
    ["Unmake the Binding","5th–6th-tier feel. Action. End one spell of 5th level or lower on a target you can see within 60 feet. Against a higher-level effect, make an ability check with DC {dc}; success ends it."],
    ["Procession of Iron Ghosts","5th–6th-tier feel. Action. Two specters appear in unoccupied spaces within 30 feet (AC 16, 30 HP, +{atk} to hit, {d} force damage). They act on your turn for 1 minute, then vanish."],
    ["Heart of the Mountain Gate","5th–6th-tier feel. Action. Create a wall of stone (as the spell, DM scales) — or seal a doorway/portal. Creatures that try to force it make a DC {dc} Strength check; failure means no passage this try."],
    ["Bloom of Severed Fate","5th–6th-tier feel. Reaction, when a creature you can see within 60 feet succeeds on a saving throw: force a reroll. The creature can resist with a DC {dc} Charisma saving throw; success keeps the original result."]
  ],
  "7th–9th":[
    ["Edict of the Last Bell","7th–9th-tier feel. Action. Enemies of your choice within 30 feet must succeed on a DC {dc} Wisdom saving throw or drop to 0 hit points if they have fewer than 50 hit points; otherwise they take {D} radiant damage. Success: half the radiant damage (and no drop to 0)."],
    ["Road That Was Never Built","7th–9th-tier feel. Action. You and up to eight willing creatures within 10 feet teleport to a location within 100 miles that you have seen. Arrivals appear in the nearest safe unoccupied spaces."],
    ["Ashen Starfall","7th–9th-tier feel. Action. 40-foot-radius sphere centered on a point within 120 feet. Creatures make a DC {dc} Dexterity saving throw. Fail: {D} {t} damage plus {d} bludgeoning. Success: half."],
    ["Name Written in Sunrise","7th–9th-tier feel. Action. Touch a creature that died within the last 24 hours: it returns to life with 1 hit point and no levels of exhaustion from this revival."],
    ["Throne of Borrowed Time","7th–9th-tier feel. Action. Take an extra turn immediately after this one ends. When that extra turn ends, you gain 1 level of exhaustion. The scroll burns to ash."]
  ]
};
function scrollItem(r,s){const [n,m]=pick(SCR[s.sp]||SCR.cantrip);const atk=3+s.b+(r==="Legendary"?2:r==="Very Rare"?1:0);return{name:"Scroll of "+n,slot:"Scroll",attune:false,mechanics:fill("Scroll (single use, homebrew). Spell save DC {dc}; spell attack bonus +{atk}. "+m,{dc:s.dc,atk,d:s.d,D:s.D,t:pick(DMG)})};}
const POT=[
  ["Vigor","Action. Drink: regain {D} hit points, and you have advantage on Strength checks for 1 minute. Empty vial."],
  ["Clarity","Bonus action. Drink: end the charmed and frightened conditions on yourself; you have advantage on Wisdom saving throws for 10 minutes."],
  ["Rush","Bonus action. Drink: your speed increases by 20 feet, and you can take the Dash action as a bonus action for 1 minute. When it ends, your speed is reduced by 10 feet for 1 minute."],
  ["Ironhide","Action. Drink: gain {D} temporary hit points and resistance to nonmagical bludgeoning, piercing, and slashing damage for 10 minutes."],
  ["Vanish","Bonus action. Drink: you become invisible for 1 minute or until you attack or cast a spell."],
  ["Dragonbreath","Action. Drink, then exhale a 15-foot cone of {t}. Creatures in the cone make a DC {dc} Dexterity saving throw. Fail: {D} {t} damage. Success: half."],
  ["Night-Eye","Action. Drink: gain darkvision out to 60 feet (or +60 feet if you already have it) for 1 hour."],
  ["Stoneblood","Action. Drink: you are immune to being petrified, gain +2 AC, and your speed decreases by 10 feet for 10 minutes."],
  ["Heroism","Action. Drink: at the start of each of your turns for 1 minute, you gain {d} temporary hit points (these don’t stack with themselves beyond replacing the previous temporary HP from this potion)."],
  ["Spellfuel","Action. Drink: regain one expended spell slot of the {sp} tier or lower (DM adjudicates exact level)."]
];
const TIN=[
  ["Mint","Bonus action. Sip: regain {d} hit points. You can’t benefit from another tincture for 1 minute."],
  ["Bitterroot","Bonus action. Sip: you have advantage on the next Constitution saving throw you make within 10 minutes."],
  ["Foxglove","Bonus action. Sip: your walking speed increases by 10 feet until the end of your next turn."],
  ["Smokeleaf","Bonus action. Sip: you can hold your breath for 5 extra minutes, and you have advantage on the next Dexterity (Stealth) check you make within 10 minutes."],
  ["Riverglint","Bonus action. Sip: end the poisoned condition on yourself if it was caused by a nonmagical poison."],
  ["Embertea","Bonus action. Sip: you have resistance to cold damage until the end of your next turn."],
  ["Moonnectar","Bonus action. Sip: you have advantage on Wisdom (Insight) checks for 10 minutes."],
  ["Thornhoney","Bonus action. Sip: the next time you hit with a weapon attack within 1 minute, the attack deals an extra {d} poison damage."],
  ["Saltvein","Bonus action. Sip: gain {d} temporary hit points for 10 minutes (doesn’t stack with itself)."],
  ["Quietbark","Bonus action. Sip: you have advantage on Dexterity (Stealth) checks against creatures relying on hearing for 10 minutes."]
];
function potionItem(r,s){const[n,m]=pick(POT);return{name:"Potion of "+pick(ADJ)+" "+n,slot:"Potion",attune:false,mechanics:"Potion (consumable, homebrew). "+fill(m,{d:s.d,D:s.D,dc:s.dc,t:pick(DMG),sp:s.sp})};}
function tinctureItem(r,s){const[n,m]=pick(TIN);return{name:"Tincture of "+pick(ADJ)+" "+n,slot:"Tincture",attune:false,mechanics:"Tincture (consumable, homebrew — lighter/shorter than a potion). "+fill(m,{d:s.d,D:s.D,dc:s.dc,t:pick(DMG)})};}

g.TLF_scrollItem=scrollItem;g.TLF_potionItem=potionItem;g.TLF_tinctureItem=tinctureItem;
})(typeof window!=="undefined"?window:globalThis);
