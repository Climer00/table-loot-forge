/* Table Loot Forge — gear mechanics (named properties) */
(function(g){
const pick=a=>a[Math.floor(Math.random()*a.length)];
const chance=p=>Math.random()<p;
const fill=(t,m)=>t.replace(/\{(\w+)\}/g,(_,k)=>m[k]!=null?m[k]:"{"+k+"}");
function attune(r,s){if(chance(s.a))return true;if(["Rare","Very Rare","Legendary"].includes(r)&&chance(.4))return true;return false;}
const DMG="fire cold lightning thunder acid poison necrotic radiant force psychic".split(" ");
const SK="Stealth Athletics Acrobatics Perception Insight Survival Intimidation Persuasion Arcana".split(" ");
const SV="Strength Dexterity Constitution Intelligence Wisdom Charisma".split(" ");
function fillProps(props,m){return props.map(p=>({title:p.title,text:fill(p.text,m).replace(/\+0 /g,"no bonus ")}));}
function gearFx(type,r,s){
  const t=pick(DMG),sk=pick(SK),sv=pick(SV),{b,dc,d,D,u}=s;
  const str={Common:13,Uncommon:15,Rare:17,"Very Rare":19,Legendary:21}[r];
  const m={b:b||0,d,D,t,dc,u,sk,sv,str};
  const base=g.TLF_GEAR_KITS||{};
  const P={};
  Object.keys(base).forEach(k=>{P[k]=(base[k]||[]).slice();});
  if(type==="Weapon"&&(r==="Very Rare"||r==="Legendary")){
    P.Weapon=P.Weapon||[];
    P.Weapon.push([{title:"Cataclysm Edge",text:"You gain a +{b} bonus to attack rolls and damage rolls with this weapon."},{title:"Cone Burst",text:"Action ({u}): unleash a 30-foot cone of {t}. Each creature in the cone must make a DC {dc} Dexterity saving throw. On a failed save, a creature takes {D} {t} damage; on a successful save, half as much."}]);
  }
  const pool=P[type]||[[{title:"Error",text:"Missing kits for "+type}]];
  const props=fillProps(pick(pool),m);
  return{properties:props,attune:attune(r,s)};
}
g.TLF_gearFx=gearFx;
g.TLF_DMG_TYPES=DMG;g.TLF_SKILLS=SK;g.TLF_SAVES=SV;
})(typeof window!=="undefined"?window:globalThis);
