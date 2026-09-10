/* Very Rare weapons: attack profiles + job riders (options A+B) */
(function(g){
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function fill(s,m){
    return String(s||"").replace(/\{(b|d|D|t|dc|u|sk|sv|str)\}/g,function(_,k){
      return m[k]!=null?String(m[k]):"";
    });
  }

  const PROFILES=[
    {id:"Duelist", title:"Duelist", text:"You gain a +2 bonus to attack rolls with this weapon."},
    {id:"Brutal", title:"Brutal", text:"You gain a +2 bonus to damage rolls with this weapon."},
    {id:"Balanced", title:"Balanced", text:"You gain a +1 bonus to attack rolls and a +1 bonus to damage rolls with this weapon."},
    {id:"Hungry", title:"Hungry", text:"This weapon has no static bonus to attack or damage. Once per turn when you hit, deal an extra 2d6 damage of the weapon's type."},
    {id:"Keen", title:"Keen", text:"Your attacks with this weapon score a critical hit on a roll of 19 or 20. You gain a +1 bonus to attack rolls with it."},
    {id:"Siege", title:"Siege", text:"You gain a +2 bonus to attack and damage rolls against objects and structures, or a +1 bonus against creatures."}
  ];

  const RIDERS=[
    {tag:"control", title:"Binding Cut", text:"Hit ({u}): the target must succeed on a DC {dc} Strength saving throw or its speed becomes 0 until the end of its next turn. Success: no speed lock."},
    {tag:"control", title:"Trip Line", text:"When you hit a creature no more than one size larger than you ({u}): it must succeed on a DC {dc} Dexterity saving throw or fall prone."},
    {tag:"control", title:"Guard Break", text:"Hit ({u}): the target can't take reactions until the start of your next turn (no save)."},
    {tag:"control", title:"Drive Back", text:"Hit ({u}): if the target is Large or smaller, you push it 10 feet away from you (no save)."},
    {tag:"control", title:"Hitch", text:"Hit ({u}): the target's speed is reduced by 15 feet until the end of its next turn (no save). This does not stack with itself."},
    {tag:"defense", title:"Riposte Guard", text:"Reaction ({u}), when a creature misses you with a melee attack: make one attack with this weapon against it."},
    {tag:"defense", title:"Brace", text:"When you hit ({u}): you gain a +2 bonus to AC until the start of your next turn."},
    {tag:"defense", title:"Parry Pulse", text:"Reaction ({u}), when you are hit by a melee attack: reduce the damage by {D}."},
    {tag:"defense", title:"Warding Turn", text:"When you take the Attack action with this weapon ({u}): until the start of your next turn, the first attack against you is made with disadvantage."},
    {tag:"action", title:"Second Measure", text:"Once per short rest, when you take the Attack action with this weapon, you can make one extra attack with it."},
    {tag:"action", title:"Fade Step", text:"After you hit ({u}): you can move up to 10 feet without provoking opportunity attacks."},
    {tag:"action", title:"Opening Cut", text:"You have advantage on the first attack roll you make with this weapon in each combat."},
    {tag:"action", title:"Lunge", text:"Once per turn, you can increase this weapon's reach by 5 feet for one attack. After that attack, you can't use Lunge again until the start of your next turn."},
    {tag:"field", title:"Split Line", text:"Action ({u}): a 15-foot line from you. Each creature in the line must make a DC {dc} Dexterity saving throw. Fail: {D} {t} damage. Success: half."},
    {tag:"field", title:"Mark Ground", text:"Bonus action ({u}): choose a 5-foot square you can see within 20 feet. Until the start of your next turn it is difficult terrain, and the first creature that enters it takes {d} {t} damage (no save)."},
    {tag:"field", title:"Hook Cast", text:"This weapon gains thrown (20/60) until the end of your turn ({u}). If it does not already return, it comes back to your hand at the end of that turn."},
    {tag:"utility", title:"Seeker", text:"Attacks with this weapon ignore half cover."},
    {tag:"utility", title:"Recall", text:"This weapon has the thrown property (20/60) in addition to its normal properties. After you throw it, it returns to your hand at the end of your turn (no action)."},
    {tag:"utility", title:"Night Edge", text:"You have advantage on attack rolls with this weapon against creatures in dim light or darkness if you can see the target."},
    {tag:"utility", title:"Iron Sight", text:"Being within 5 feet of a hostile creature does not impose disadvantage on ranged attacks with this weapon."},
    {tag:"anti", title:"Magebreak", text:"Hit ({u}): if the target is concentrating, it makes the Constitution save to maintain concentration with disadvantage."},
    {tag:"anti", title:"Gravebite", text:"Once per turn when you hit an undead creature, deal an extra 1d8 radiant damage."},
    {tag:"anti", title:"Giantbane", text:"When you hit a creature that is Large or larger, deal an extra {d} damage of the weapon's type. This extra damage does not apply to objects."},
    {tag:"anti", title:"Oath Edge", text:"You have advantage on the first attack you make with this weapon against a creature that hit one of your allies since the end of your last turn."},
    {tag:"anti", title:"Cut Word", text:"Hit ({u}): if the target is casting a spell with a verbal component (DM call), it must succeed on a DC {dc} Constitution saving throw or the spell fails and the slot is spent."},
    {tag:"damage", title:"Once-Notch", text:"The first time you hit a creature on your turn, deal an extra {d} {t} damage. A given creature takes this extra damage only once per turn."},
    {tag:"damage", title:"Charged Edge", text:"Bonus action ({u}): your next hit with this weapon before the end of your next turn deals an extra {D} {t} damage. If you miss, the charge is spent."}
  ];

  function vrWeaponProps(s){
    const dmg=(g.TLF_DMG_TYPES&&g.TLF_DMG_TYPES.length)?g.TLF_DMG_TYPES:["fire","cold","lightning","necrotic","radiant"];
    const m={
      b:2,
      d:s&&s.d||"3d6",
      D:s&&s.D||"4d8",
      dc:s&&s.dc||16,
      u:s&&s.u||"3/day",
      t:pick(dmg)
    };
    const profile=pick(PROFILES);
    let pool=RIDERS;
    if(profile.id==="Hungry") pool=RIDERS.filter(function(r){return r.tag!=="damage";});
    const rider=pick(pool);
    return [
      {title:profile.title, text:fill(profile.text,m)},
      {title:rider.title, text:fill(rider.text,m)}
    ];
  }

  const prev=g.TLF_gearFx;
  g.TLF_gearFx=function(type,r,s){
    if(typeof prev==="function"){
      const out=prev(type,r,s)||{};
      if(type==="Weapon"&&r==="Very Rare"){
        out.properties=vrWeaponProps(s);
      }
      return out;
    }
    if(type==="Weapon"&&r==="Very Rare"){
      return {properties:vrWeaponProps(s), attune:true};
    }
    return {properties:[{title:"Error", text:"Missing loot-mech.js"}], attune:false};
  };
})(typeof window!=="undefined"?window:globalThis);
