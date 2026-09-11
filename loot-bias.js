/* Table Loot Forge — Place/Theme rule bias */
(function(g){
  var PREFER={
    Road:{dmg:["thunder","force","fire","cold"], words:"travel speed dash far mile road endurance athletic".split(" ")},
    Camp:{dmg:["fire","poison","acid"], words:"stealth hide watch camp survival sneak dark".split(" ")},
    Ruin:{dmg:["necrotic","force","psychic","radiant"], words:"darkvision secret ancient undead ward stone".split(" ")},
    Body:{dmg:["poison","necrotic","psychic"], words:"hidden pocket charm fear personal".split(" ")},
    Goblin:{dmg:["poison","acid","fire"], words:"stealth sneak hide small darkvision trap".split(" ")},
    Bandit:{dmg:["force","thunder","fire"], words:"stealth surprise intimidation hide ambush".split(" ")},
    Undead:{dmg:["necrotic","cold","poison"], words:"necrotic frightened paralyzed grave death undead cold".split(" ")},
    Dragon:{dmg:["fire","poison","acid","cold","lightning"], words:"fear fly frighten hoard heat".split(" ")},
    Fey:{dmg:["psychic","force","radiant"], words:"charm misty teleport dream psychic fey".split(" ")},
    Sacred:{dmg:["radiant","force"], words:"radiant charm frightened fiend undead holy bless".split(" ")}
  };
  var AVOID={
    Road:{dmg:[], words:"trident aquatic swim".split(" ")},
    Camp:{dmg:["lightning"], words:"trident lance pike aquatic".split(" ")},
    Ruin:{dmg:[], words:"trident aquatic".split(" ")},
    Body:{dmg:["lightning"], words:"trident glaive pike aquatic".split(" ")},
    Goblin:{dmg:["radiant"], words:"holy saint radiant".split(" ")},
    Bandit:{dmg:["radiant"], words:"holy saint".split(" ")},
    Undead:{dmg:["radiant"], words:"radiant holy bless saint".split(" ")},
    Dragon:{dmg:[], words:[]},
    Fey:{dmg:["necrotic"], words:"necrotic grave undead".split(" ")},
    Sacred:{dmg:["necrotic","poison"], words:"necrotic poison venom grave".split(" ")}
  };
  var NOUN={
    Road:"Spear Javelin Bow Crossbow Blade Sword Hatchet Axe Dirk Saber".split(" "),
    Camp:"Hatchet Axe Bow Blade Dirk Cleaver Sting Razor".split(" "),
    Ruin:"Mace Flail Hammer Sword Blade Spire Morningstar War-pick".split(" "),
    Body:"Dirk Blade Razor Sting Brand Sword".split(" "),
    Goblin:"Dirk Hatchet Bow Sting Cleaver Dart".split(" "),
    Bandit:"Blade Sword Crossbow Whip Dirk Bow".split(" "),
    Undead:"Mace Flail Scythe Blade Morningstar".split(" "),
    Dragon:"Lance Spear Sword Glaive Blade".split(" "),
    Fey:"Bow Blade Whip Razor Dirk".split(" "),
    Sacred:"Mace Hammer War-pick Blade Sword".split(" ")
  };
  var ADJ={
    Road:"Ashen Dust Iron Keen Storm Flint Drift".split(" "),
    Camp:"Ember Cinder Ashen Feral Thorn Wild".split(" "),
    Ruin:"Hollow Obsidian Riven Umber Elder Blight".split(" "),
    Body:"Quiet Ivory Scarlet Shadow Rune".split(" "),
    Goblin:"Feral Thorn Nettle Ashen Wild".split(" "),
    Bandit:"Scarlet Riven Iron Shadow Keen".split(" "),
    Undead:"Hollow Blight Umber Frost Quiet".split(" "),
    Dragon:"Ember Cinder Crimson Gilded Obsidian".split(" "),
    Fey:"Mist Lunar Verdant Gleam Prism".split(" "),
    Sacred:"Gilded Ivory Dawn Hearth Rune".split(" ")
  };
  var BAD_NOUN={
    Road:["Trident"],
    Camp:["Trident","Lance","Pike"],
    Ruin:["Trident"],
    Body:["Trident","Glaive","Pike"],
    Goblin:["Lance","Trident"],
    Bandit:["Trident"],
    Undead:["Trident"],
    Dragon:[],
    Fey:["Trident","Maul"],
    Sacred:["Trident"]
  };
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function keys(){
    var place=g.TLF_place||"Any";
    var theme=g.TLF_theme||"Any";
    return {place:place, theme:theme, active: place!=="Any" || theme!=="Any"};
  }
  function bag(){
    var k=keys();
    var preferD=[], avoidD=[], preferW=[], avoidW=[];
    [k.place,k.theme].forEach(function(tag){
      var p=PREFER[tag], a=AVOID[tag];
      if(p){ preferD=preferD.concat(p.dmg||[]); preferW=preferW.concat(p.words||[]); }
      if(a){ avoidD=avoidD.concat(a.dmg||[]); avoidW=avoidW.concat(a.words||[]); }
    });
    return {preferD:preferD, avoidD:avoidD, preferW:preferW, avoidW:avoidW};
  }
  function has(text, word){
    return new RegExp("\\b"+word.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","i").test(text);
  }
  function scoreProps(props){
    var b=bag(), text="";
    (props||[]).forEach(function(p){ text+=" "+(p.title||"")+" "+(p.text||""); });
    var s=0, i;
    for(i=0;i<b.preferD.length;i++) if(has(text,b.preferD[i])) s+=3;
    for(i=0;i<b.preferW.length;i++) if(has(text,b.preferW[i])) s+=1;
    for(i=0;i<b.avoidD.length;i++) if(has(text,b.avoidD[i])) s-=5;
    for(i=0;i<b.avoidW.length;i++) if(has(text,b.avoidW[i])) s-=3;
    return s;
  }
  g.TLF_scoreProps=scoreProps;
  g.TLF_biasName=function(item){
    if(!item || item.type!=="Weapon") return item;
    var k=keys();
    if(!k.active) return item;
    var nouns=[];
    if(NOUN[k.theme]) nouns=nouns.concat(NOUN[k.theme]);
    if(NOUN[k.place]) nouns=nouns.concat(NOUN[k.place]);
    var ban=[];
    if(BAD_NOUN[k.theme]) ban=ban.concat(BAD_NOUN[k.theme]);
    if(BAD_NOUN[k.place]) ban=ban.concat(BAD_NOUN[k.place]);
    nouns=nouns.filter(function(n){ return ban.indexOf(n)<0; });
    if(!nouns.length) return item;
    var adjs=(ADJ[k.theme]||[]).concat(ADJ[k.place]||[]);
    if(!adjs.length) adjs="Iron Ember Hollow Mist".split(" ");
    var a=pick(adjs), n=pick(nouns);
    item.name=pick([a+" "+n, n+" of the "+a, "The "+a+" "+n]);
    return item;
  };
  var prev=g.TLF_gearFx;
  g.TLF_gearFx=function(type,r,s){
    if(typeof prev!=="function") return {properties:[], attune:false};
    if(!keys().active) return prev(type,r,s);
    var best=null, bestS=-999, i;
    for(i=0;i<8;i++){
      var out=prev(type,r,s)||{};
      var sc=scoreProps(out.properties);
      if(!best || sc>bestS){ best=out; bestS=sc; }
      if(sc>=3) break;
    }
    return best||prev(type,r,s);
  };
})(typeof window!=="undefined"?window:globalThis);
