/* Table Loot Forge — potions & tinctures */
(function(g){
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fill=(t,m)=>t.replace(/\{(\w+)\}/g,(_,k)=>m[k]!=null?m[k]:"{"+k+"}");
const DMG="fire cold lightning thunder acid poison necrotic radiant force psychic".split(" ");
const ADJ="Ashen Bright Cinder Crimson Dawn Dusk Ember Feral Frost Gilded Hollow Iron Jade Keen Lunar Mist Obsidian Quiet Riven Rune Scarlet Shadow Silver Storm Thorn Verdant Warden Wild Zephyr Blight Elder Glimmer Hearth Ivory Nettle Oaken Prism Quicksilver".split(" ");
function fillProps(props,m){return props.map(p=>({title:p.title,text:fill(p.text,m)}));}

const POT=[
["Vigor",[{title:"Vigor",text:"Action. Drink: regain {D} hit points, and you have advantage on Strength checks for 1 minute. Empty vial."}]],
["Clarity",[{title:"Clarity",text:"Bonus action. Drink: end the charmed and frightened conditions on yourself; you have advantage on Wisdom saving throws for 10 minutes."}]],
["Rush",[{title:"Rush",text:"Bonus action. Drink: your speed increases by 20 feet, and you can take the Dash action as a bonus action for 1 minute. When it ends, your speed is reduced by 10 feet for 1 minute."}]],
["Ironhide",[{title:"Ironhide",text:"Action. Drink: gain {D} temporary hit points and resistance to nonmagical bludgeoning, piercing, and slashing damage for 10 minutes."}]],
["Vanish",[{title:"Vanish",text:"Bonus action. Drink: you become invisible for 1 minute or until you attack or cast a spell."}]],
["Dragonbreath",[{title:"Dragonbreath",text:"Action. Drink, then exhale a 15-foot cone of {t}. Creatures in the cone make a DC {dc} Dexterity saving throw. Fail: {D} {t} damage. Success: half."}]],
["Night-Eye",[{title:"Night-Eye",text:"Action. Drink: gain darkvision out to 60 feet (or +60 feet if you already have it) for 1 hour."}]],
["Stoneblood",[{title:"Stoneblood",text:"Action. Drink: you are immune to being petrified, gain +2 AC, and your speed decreases by 10 feet for 10 minutes."}]],
["Heroism",[{title:"Heroism",text:"Action. Drink: at the start of each of your turns for 1 minute, you gain {d} temporary hit points (these don't stack with themselves beyond replacing the previous temporary HP from this potion)."}]],
["Spellfuel",[{title:"Spellfuel",text:"Action. Drink: regain one expended spell slot of the {sp} tier or lower (DM adjudicates exact level)."}]],
["Bullheart",[{title:"Bullheart",text:"Action. Drink: your Strength score becomes 21 for 1 hour (if already higher, gain +2 Strength, max 30 — DM)."}]],
["Catsteps",[{title:"Catsteps",text:"Bonus action. Drink: for 10 minutes you have advantage on Dexterity (Stealth) and Dexterity (Acrobatics) checks, and falling damage is reduced by {D}."}]],
["Mindfire",[{title:"Mindfire",text:"Action. Drink: for 10 minutes you have advantage on Intelligence checks and saving throws, and resistance to psychic damage."}]],
["Bloodboil",[{title:"Bloodboil",text:"Action. Drink: for 1 minute the first time you hit with a weapon attack each turn, deal an extra {d} fire damage."}]],
["Stillwater",[{title:"Stillwater",text:"Action. Drink: end the poisoned condition on yourself and gain advantage on Constitution saving throws for 1 hour."}]],
["Skyhook",[{title:"Skyhook",text:"Action. Drink: for 1 minute you gain a flying speed of 30 feet. If aloft when it ends, you fall."}]],
["Gills",[{title:"Gills",text:"Action. Drink: for 1 hour you can breathe underwater and gain a swimming speed equal to your walking speed."}]],
["Thornskin",[{title:"Thornskin",text:"Action. Drink: for 10 minutes when a creature hits you with a melee attack, it takes {d} piercing damage (no save)."}]],
["Truesight Sip",[{title:"Truesight Sip",text:"Action. Drink: for 10 minutes you have truesight out to 30 feet."}]],
["Phoenix Draught",[{title:"Phoenix Draught",text:"Action. Drink: for 1 minute if you are reduced to 0 hit points, you drop to 1 hit point instead (once), and you have resistance to fire damage."}]],
["Warmth",[{title:"Warmth",text:"Action. Drink: you have resistance to cold damage for 1 hour and automatically succeed on saves against extreme cold (DM)."}]],
["Cooling",[{title:"Cooling",text:"Action. Drink: you have resistance to fire damage for 1 hour and automatically succeed on saves against extreme heat (DM)."}]],
["Giantstep",[{title:"Giantstep",text:"Action. Drink: for 10 minutes your jumping distances are tripled and you ignore the first 10 feet of falling damage."}]],
["Keenmind",[{title:"Keenmind",text:"Action. Drink: for 10 minutes you have advantage on Wisdom (Perception) checks and can't be surprised while conscious."}]],
["Oakenhide",[{title:"Oakenhide",text:"Action. Drink: gain +1 AC for 10 minutes. If you haven't moved this turn, that bonus is +2 instead."}]],
["Second Wind",[{title:"Second Wind",text:"Action. Drink: regain {D} hit points. If you were below half your hit point maximum, regain {d} extra."}]],
["Silence Drop",[{title:"Silence Drop",text:"Bonus action. Drink: for 10 minutes your footsteps and voice make no sound unless you choose to speak."}]],
["Stormvein",[{title:"Stormvein",text:"Action. Drink: for 1 minute the first time you hit with a melee attack each turn, deal an extra {d} lightning damage."}]],
["Graveward",[{title:"Graveward",text:"Action. Drink: for 10 minutes undead have disadvantage on attack rolls against you."}]],
["True North",[{title:"True North",text:"Action. Drink: for 8 hours you always know which way is north and have advantage on Survival checks to avoid becoming lost."}]],
["Softfall",[{title:"Softfall",text:"Action. Drink: for 10 minutes you take no damage from falling 30 feet or less and always land on your feet."}]],
["Ironlung",[{title:"Ironlung",text:"Action. Drink: for 1 hour you can hold your breath twice as long and have advantage on saves against inhaled poison."}]],
["Battlerage",[{title:"Battlerage",text:"Bonus action. Drink: for 1 minute you have advantage on Strength saving throws and resistance to psychic damage. When it ends, you gain 1 level of exhaustion."}]],
["Mending Draft",[{title:"Mending Draft",text:"Action. Drink: end one condition on yourself from this list: blinded, deafened, paralyzed, or poisoned."}]],
["Farstep",[{title:"Farstep",text:"Bonus action. Drink: teleport up to 30 feet to an unoccupied space you can see. Empty vial."}]],
["Sunblood",[{title:"Sunblood",text:"Action. Drink: for 10 minutes you shed bright light 10 feet and dim light 10 feet more. Fiends and undead in the bright light have disadvantage on attack rolls against you."}]],
["Deeprest",[{title:"Deeprest",text:"Action. Drink during a short rest: you regain one extra Hit Die worth of hit points when you spend Hit Dice during that rest."}]],
["Spellward",[{title:"Spellward",text:"Action. Drink: for 1 minute you have advantage on saving throws against spells."}]]
];

const TIN=[
["Mint",[{title:"Mint",text:"Bonus action. Sip: regain {d} hit points. You can't benefit from another tincture for 1 minute."}]],
["Bitterroot",[{title:"Bitterroot",text:"Bonus action. Sip: you have advantage on the next Constitution saving throw you make within 10 minutes."}]],
["Foxglove",[{title:"Foxglove",text:"Bonus action. Sip: your walking speed increases by 10 feet until the end of your next turn."}]],
["Smokeleaf",[{title:"Smokeleaf",text:"Bonus action. Sip: you can hold your breath for 5 extra minutes, and you have advantage on the next Dexterity (Stealth) check you make within 10 minutes."}]],
["Riverglint",[{title:"Riverglint",text:"Bonus action. Sip: end the poisoned condition on yourself if it was caused by a nonmagical poison."}]],
["Embertea",[{title:"Embertea",text:"Bonus action. Sip: you have resistance to cold damage until the end of your next turn."}]],
["Moonnectar",[{title:"Moonnectar",text:"Bonus action. Sip: you have advantage on Wisdom (Insight) checks for 10 minutes."}]],
["Thornhoney",[{title:"Thornhoney",text:"Bonus action. Sip: the next time you hit with a weapon attack within 1 minute, the attack deals an extra {d} poison damage."}]],
["Saltvein",[{title:"Saltvein",text:"Bonus action. Sip: gain {d} temporary hit points for 10 minutes (doesn't stack with itself)."}]],
["Quietbark",[{title:"Quietbark",text:"Bonus action. Sip: you have advantage on Dexterity (Stealth) checks against creatures relying on hearing for 10 minutes."}]],
["Ironblossom",[{title:"Ironblossom",text:"Bonus action. Sip: you have advantage on the next Strength check or Strength saving throw you make within 10 minutes."}]],
["Starpetal",[{title:"Starpetal",text:"Bonus action. Sip: you have advantage on the next Intelligence (Arcana or Investigation) check you make within 10 minutes."}]],
["Wolfsbane Drop",[{title:"Wolfsbane Drop",text:"Bonus action. Sip: you have advantage on saving throws against being frightened until the end of your next turn."}]],
["Honeycomb Rush",[{title:"Honeycomb Rush",text:"Bonus action. Sip: you can take the Dash or Disengage action as part of this bonus action (choose one)."}]],
["Frostmint",[{title:"Frostmint",text:"Bonus action. Sip: you have resistance to fire damage until the end of your next turn."}]],
["Brightwort",[{title:"Brightwort",text:"Bonus action. Sip: you shed dim light in a 10-foot radius for 10 minutes and have advantage on saves against being blinded."}]],
["Shadowthyme",[{title:"Shadowthyme",text:"Bonus action. Sip: until the end of your next turn, opportunity attacks against you are made with disadvantage."}]],
["Goldenseal",[{title:"Goldenseal",text:"Bonus action. Sip: end one nonmagical disease affecting you, or gain advantage on your next Medicine check within 1 hour."}]],
["Pepperblood",[{title:"Pepperblood",text:"Bonus action. Sip: the next time you take damage within 1 minute, reduce that damage by {d}."}]],
["Dreamcap",[{title:"Dreamcap",text:"Bonus action. Sip: you are immune to magical sleep for 10 minutes and have advantage on saves against being charmed during that time."}]],
["Pinepitch",[{title:"Pinepitch",text:"Bonus action. Sip: you have advantage on the next Strength (Athletics) check to climb you make within 10 minutes."}]],
["Seaglass",[{title:"Seaglass",text:"Bonus action. Sip: you can hold your breath twice as long until you finish a short rest."}]],
["Ashroot",[{title:"Ashroot",text:"Bonus action. Sip: you have resistance to fire damage until the start of your next turn."}]],
["Coldsnap",[{title:"Coldsnap",text:"Bonus action. Sip: you have resistance to cold damage until the start of your next turn."}]],
["Lawleaf",[{title:"Lawleaf",text:"Bonus action. Sip: you have advantage on the next Insight check you make within 10 minutes."}]],
["Trailberry",[{title:"Trailberry",text:"Bonus action. Sip: you have advantage on the next Survival check to follow tracks you make within 1 hour."}]],
["Gravewort",[{title:"Gravewort",text:"Bonus action. Sip: you have advantage on the next saving throw against an undead's effect within 10 minutes."}]],
["Sunthistle",[{title:"Sunthistle",text:"Bonus action. Sip: you have advantage on the next saving throw against being blinded."}]],
["Nightshade Kiss",[{title:"Nightshade Kiss",text:"Bonus action. Sip: the next time you hit with a weapon within 1 minute, the target's speed is reduced by 10 feet until the start of your next turn."}]],
["Coppervein",[{title:"Coppervein",text:"Bonus action. Sip: you have advantage on the next Constitution save against exhaustion within 1 hour."}]],
["Hearthsip",[{title:"Hearthsip",text:"Bonus action. Sip: you automatically succeed on the next save against extreme cold you make within 1 hour (DM)."}]],
["Reedwater",[{title:"Reedwater",text:"Bonus action. Sip: swamp water and mud are not difficult terrain for you for 10 minutes."}]],
["Sparkleaf",[{title:"Sparkleaf",text:"Bonus action. Sip: the next time you take lightning or thunder damage within 1 minute, reduce it by {d}."}]],
["Vowpetal",[{title:"Vowpetal",text:"Bonus action. Sip: you have advantage on the next saving throw against being charmed."}]],
["Lastberry",[{title:"Lastberry",text:"Bonus action. Sip: if you are reduced to 0 hit points before the start of your next turn, drop to 1 instead. Then this benefit ends."}]],
["Maptea",[{title:"Maptea",text:"Bonus action. Sip: you know which way is north for 1 hour."}]],
["Stablegrain",[{title:"Stablegrain",text:"Bonus action. Sip: you have advantage on the next check to stay mounted within 10 minutes."}]],
["Glassdrop",[{title:"Glassdrop",text:"Bonus action. Sip: you have advantage on the next save against being blinded by flash or bright light."}]]
];

function potionItem(r,s){
  const [n,props]=pick(POT);
  const m={d:s.d,D:s.D,dc:s.dc,t:pick(DMG),sp:s.sp};
  return{name:"Potion of "+pick(ADJ)+" "+n,slot:"Potion",attune:false,properties:fillProps(props,m),effectId:"Potion:"+n};
}
function tinctureItem(r,s){
  const [n,props]=pick(TIN);
  const m={d:s.d,D:s.D,dc:s.dc,t:pick(DMG)};
  return{name:"Tincture of "+pick(ADJ)+" "+n,slot:"Tincture",attune:false,properties:fillProps(props,m),effectId:"Tincture:"+n};
}
g.TLF_potionItem=potionItem;
g.TLF_tinctureItem=tinctureItem;
})(typeof window!=="undefined"?window:globalThis);
