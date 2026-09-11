/* Tinctures: anoint / sling / mark — overrides sip kits */
(function(g){
  var pick=function(a){return a[Math.floor(Math.random()*a.length)];};
  var fill=function(t,m){return String(t).replace(/\{(\w+)\}/g,function(_,k){return m[k]!=null?m[k]:"{"+k+"}";});};
  var DMG="fire cold lightning thunder acid poison necrotic radiant force psychic".split(" ");
  var ADJ="Ashen Bright Cinder Crimson Dawn Dusk Ember Feral Frost Gilded Hollow Iron Jade Keen Lunar Mist Obsidian Quiet Riven Rune Scarlet Shadow Silver Storm Thorn Verdant Warden Wild Zephyr Blight Elder Glimmer Hearth Ivory Nettle Oaken Prism Quicksilver".split(" ");
  function fillProps(props,m){return props.map(function(p){return {title:p.title,text:fill(p.text,m)};});}
  var TIN=[
    ["Thornhoney","anoint",[{title:"Anoint",text:"Bonus action: coat one melee weapon or up to 3 pieces of ammo. The next hit with that weapon (or one coated piece) deals an extra {d} poison damage, and the target must succeed on a DC {dc} Constitution save or be poisoned until the end of its next turn. Then the coat is gone."}]],
    ["Nightshade Kiss","anoint",[{title:"Anoint",text:"Bonus action: coat one weapon. The next hit within 1 minute reduces the target's speed by 10 feet until the start of your next turn, and it takes {d} poison damage."}]],
    ["Ember Pitch","anoint",[{title:"Anoint",text:"Bonus action: coat one melee weapon. The next hit deals an extra {d} fire damage. If the target is wearing nonmagical cloth or hide, it ignites until it uses an action to douse itself."}]],
    ["Frostmint Oil","anoint",[{title:"Anoint",text:"Bonus action: coat one weapon or 5 pieces of ammo. The next hit deals an extra {d} cold damage and the target's speed is reduced by 10 feet until the end of its next turn."}]],
    ["Riverglint Wash","anoint",[{title:"Anoint",text:"Bonus action: rub onto a weapon, 10 pieces of ammo, or a set of clothes. For 10 minutes the coated gear ignores nonmagical poison. Does not end a poisoned condition already on a creature."}]],
    ["Quietbark Oil","mark",[{title:"Mark",text:"Action: paint a lock, hinge, or a 5-foot stretch of floor. For 10 minutes, opening that lock or crossing that stretch does not wake a sleeping creature, and Dexterity (Stealth) checks made there have advantage. One use."}]],
    ["Brightwort Flare","sling",[{title:"Sling",text:"Action: smash the vial at your feet or throw it 20 feet. Bright light in a 10-foot radius and dim light 10 feet beyond for 1 minute. Creatures in the bright light when it breaks make a DC {dc} Constitution save or are blinded until the end of their next turn."}]],
    ["Embertea Pitch","sling",[{title:"Sling",text:"Action: throw the vial at a point within 20 feet. Each creature in a 5-foot radius must succeed on a DC {dc} Dexterity save or take {D} fire damage and ignite until it uses an action to douse itself. Success: half damage, not ignited."}]],
    ["Smokeleaf Bomb","sling",[{title:"Sling",text:"Action: throw the vial at a point within 20 feet. A 10-foot-radius cloud of heavy smoke lasts until the end of your next turn. The area is heavily obscured."}]],
    ["Saltvein Dust","sling",[{title:"Sling",text:"Action: throw the vial at one creature within 20 feet. It must succeed on a DC {dc} Constitution save or have disadvantage on the next attack roll it makes before the end of its next turn."}]],
    ["Ironblossom Paste","anoint",[{title:"Anoint",text:"Bonus action: smear onto a weapon or a shield. The next Strength check or Strength save you make while holding that item within 10 minutes is made with advantage. Then the paste is spent."}]],
    ["Starpetal Ink","mark",[{title:"Mark",text:"Action: paint a rune on an object or a door. For 10 minutes you have advantage on Intelligence (Arcana or Investigation) checks about that marked thing, and you can see the mark through up to 1 inch of wood or cloth."}]],
    ["Wolfsbane Ward","mark",[{title:"Mark",text:"Action: paint a 5-foot circle on the ground. Beasts and lycanthropes treat the circle as difficult terrain for 10 minutes and have disadvantage on attack rolls against creatures inside it. One use."}]],
    ["Maptea Stain","mark",[{title:"Mark",text:"Action: dab onto a map, wall, or footprint. For 1 hour you know which way is north from the mark, and you have advantage on Wisdom (Survival) checks to follow tracks that pass it."}]],
    ["Gravewort Oil","anoint",[{title:"Anoint",text:"Bonus action: coat one weapon. The next hit against an undead within 1 minute deals an extra {d} radiant damage, and the undead has disadvantage on its next saving throw before the end of its next turn."}]],
    ["Sunthistle Wash","sling",[{title:"Sling",text:"Action: splash the vial on yourself or throw it 20 feet at an ally. The target has advantage on the next saving throw against being blinded it makes within 10 minutes, and sheds dim light in a 5-foot radius for 1 minute."}]],
    ["Shadowthyme","mark",[{title:"Mark",text:"Action: paint a cloak, boots, or a 5-foot patch of wall. For 10 minutes Dexterity (Stealth) checks made while wearing the marked gear or pressed to that wall have advantage against creatures relying on sight."}]],
    ["Sparkleaf Resin","anoint",[{title:"Anoint",text:"Bonus action: coat a metal weapon or 3 metal bolts. The next hit deals an extra {d} lightning damage. If the target is wearing metal armor, it has disadvantage on the save (if any) from this hit."}]],
    ["Vowpetal Seal","mark",[{title:"Mark",text:"Action: paint a token, ring, or forehead. For 10 minutes the marked creature has advantage on the next saving throw against being charmed. One creature, one use."}]],
    ["Lastberry Pitch","anoint",[{title:"Anoint",text:"Bonus action: coat a weapon. If you are reduced to 0 hit points before the start of your next turn while holding that weapon, you drop to 1 hit point instead and the coat is spent."}]],
    ["Reedwater Grease","mark",[{title:"Mark",text:"Action: paint boots or a 10-foot stretch of mud. For 10 minutes swamp, mud, and slick stone are not difficult terrain for the wearer or anyone crossing that stretch."}]],
    ["Glassdrop Vial","sling",[{title:"Sling",text:"Action: hurl the vial at a point within 20 feet. Creatures in a 5-foot radius must succeed on a DC {dc} Constitution save or be blinded until the end of their next turn by a sharp flash."}]],
    ["Coppervein Salve","anoint",[{title:"Anoint",text:"Bonus action: rub onto armor or a cloak. The wearer has advantage on the next Constitution save against exhaustion within 1 hour. Then the salve is spent."}]],
    ["Hearthsip Grease","anoint",[{title:"Anoint",text:"Bonus action: coat clothes or a cloak. For 1 hour the wearer automatically succeeds on the next save against extreme cold (DM). Then the grease is spent."}]],
    ["Stablegrain Wax","mark",[{title:"Mark",text:"Action: rub onto a saddle, reins, or boots. For 10 minutes the rider or wearer has advantage on the next check to stay mounted or keep footing on a moving animal."}]],
    ["Bitterroot Stain","anoint",[{title:"Anoint",text:"Bonus action: coat a weapon. After the next hit, you have advantage on the next Constitution save you make within 10 minutes. Then the stain is spent."}]],
    ["Foxglove Lash","anoint",[{title:"Anoint",text:"Bonus action: coat a weapon. The next time you hit within 1 minute, your walking speed increases by 10 feet until the end of your next turn."}]],
    ["Moonnectar Mark","mark",[{title:"Mark",text:"Action: dab onto your brow or a lens. For 10 minutes you have advantage on Wisdom (Insight) checks against creatures you can see."}]],
    ["Quietbark Pitch","sling",[{title:"Sling",text:"Action: smash the vial on the ground at your feet. Until the end of your next turn, your footsteps and the vial's break make no sound, and Wisdom (Perception) checks that rely on hearing have disadvantage against you."}]],
    ["Frostmint Bomb","sling",[{title:"Sling",text:"Action: throw the vial at a point within 20 feet. Each creature in a 5-foot radius must succeed on a DC {dc} Constitution save or take {d} cold damage and have its speed halved until the end of its next turn."}]]
  ];
  g.TLF_tinctureItem=function(r,s){
    var row=pick(TIN);
    var n=row[0],kind=row[1],props=row[2];
    var m={d:s.d,D:s.D,dc:s.dc,t:pick(DMG)};
    return {name:"Tincture of "+pick(ADJ)+" "+n,slot:"Tincture",kind:kind,attune:false,properties:fillProps(props,m),effectId:"Tincture:"+kind+":"+n};
  };
})(typeof window!=="undefined"?window:globalThis);
