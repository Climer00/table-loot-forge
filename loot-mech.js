/* Table Loot Forge — gear mechanics (named properties) */
(function(){
  var packs=[
    "loot-kits-pack-weapon-1.js","loot-kits-pack-weapon-2.js","loot-kits-pack-weapon-3.js",
    "loot-kits-pack-armor-1.js","loot-kits-pack-armor-2.js","loot-kits-pack-armor-3.js",
    "loot-kits-pack-shield-1.js","loot-kits-pack-shield-2.js","loot-kits-pack-shield-3.js",
    "loot-kits-pack-helmet-1.js","loot-kits-pack-helmet-2.js","loot-kits-pack-helmet-3.js",
    "loot-kits-pack-cloak-1.js","loot-kits-pack-cloak-2.js","loot-kits-pack-cloak-3.js",
    "loot-kits-pack-necklace-1.js","loot-kits-pack-necklace-2.js","loot-kits-pack-necklace-3.js",
    "loot-kits-pack-ring-1.js","loot-kits-pack-ring-2.js","loot-kits-pack-ring-3.js",
    "loot-kits-pack-gloves-1.js","loot-kits-pack-gloves-2.js","loot-kits-pack-gloves-3.js",
    "loot-kits-pack-belt-1.js","loot-kits-pack-belt-2.js","loot-kits-pack-belt-3.js",
    "loot-kits-pack-boots-1.js","loot-kits-pack-boots-2.js","loot-kits-pack-boots-3.js"
  ];
  for(var i=0;i<packs.length;i++){
    document.write('<script src="'+packs[i]+'?v=kits100b"><\/script>');
  }
})();
(function(g){
const pick=a=>a[Math.floor(Math.random()*a.length)];
const chance=p=>Math.random()<p;
const fill=(t,m)=>t.replace(/\{(\w+)\}/g,(_,k)=>m[k]!=null?m[k]:"{"+k+"}");
function attune(r,s){if(chance(s.a))return true;if(["Rare","Very Rare","Legendary"].includes(r)&&chance(.4))return true;return false;}
const DMG="fire cold lightning thunder acid poison necrotic radiant force psychic".split(" ");
const SK="Stealth Athletics Acrobatics Perception Insight Survival Intimidation Persuasion Arcana".split(" ");
const SV="Strength Dexterity Constitution Intelligence Wisdom Charisma".split(" ");
const RARITY_ADJ={
  Common:["Common","Uncommon"],
  Uncommon:["Common","Uncommon","Rare"],
  Rare:["Uncommon","Rare","Very Rare"],
  "Very Rare":["Rare","Very Rare","Legendary"],
  Legendary:["Very Rare","Legendary"]
};
function tidyZeroBonus(t){
  t=t.replace(/an?\s+\+0\s+bonus/gi,"no bonus");
  t=t.replace(/\+0\s+bonus/gi,"no bonus");
  return t;
}
function fillProps(props,m){return props.map(p=>({title:p.title,text:tidyZeroBonus(fill(p.text,m))}));}
function isStubKit(kit){
  if(!kit||!kit.length)return true;
  return kit.some(function(p){
    const t=String(p.title||"");
    const x=String(p.text||"");
    if(/^(C|U|R|V|L)\d/i.test(t))return true;
    if(/^C0\d/i.test(t))return true;
    if(/^Fx\d/i.test(t))return true;
    if(/\b(Wea|Arm|Shi|Hel|Clo|Nec|Rin|Glo|Bel|Boo)$/.test(t))return true;
    if(/Useful \w+ magic while worn/i.test(x))return true;
    if(/Wondrous \w+\. Useful magic/i.test(x))return true;
    return false;
  });
}
function poolFor(type,r){
  const base=g.TLF_GEAR_KITS||{};
  const byR=g.TLF_GEAR_KITS_R||{};
  let pool=(base[type]||[]).slice();
  const bands=RARITY_ADJ[r]||[r];
  bands.forEach(function(rr){
    const arr=((byR[rr]||{})[type])||[];
    pool=pool.concat(arr);
  });
  pool=pool.filter(function(k){return !isStubKit(k);});
  if(!pool.length) pool=[[{title:"Error",text:"Missing kits for "+type}]];
  return pool;
}
function gearFx(type,r,s){
  const t=pick(DMG),sk=pick(SK),sv=pick(SV),{dc,d,D,u}=s;
  let b=s.b||0;
  if(type==="Armor"||type==="Shield") b=Math.max(b,1);
  const str={Common:13,Uncommon:15,Rare:17,"Very Rare":19,Legendary:21}[r];
  const m={b:b,d,D,t,dc,u,sk,sv,str};
  const pool=poolFor(type,r);
  if(type==="Weapon"&&(r==="Very Rare"||r==="Legendary")&&Math.random()<0.08){
    pool.push([{title:"Cataclysm Edge",text:"You gain a +{b} bonus to attack rolls and damage rolls with this weapon."},{title:"Cone Burst",text:"Action ({u}): unleash a 30-foot cone of {t}. Each creature in the cone must make a DC {dc} Dexterity saving throw. On a failed save, a creature takes {D} {t} damage; on a successful save, half as much."}]);
  }
  const props=fillProps(pick(pool),m);
  return{properties:props,attune:attune(r,s)};
}
g.TLF_gearFx=gearFx;
g.TLF_DMG_TYPES=DMG;g.TLF_SKILLS=SK;g.TLF_SAVES=SV;
g.TLF_poolFor=poolFor;
})(typeof window!=="undefined"?window:globalThis);
