/* Specific item kinds — never "Weapon (any)" */
(function(g){
  var W_BASE={
    Sting:"dagger",Dirk:"dagger",Razor:"dagger",Fang:"dagger",Dart:"dagger",Talon:"dagger",
    Blade:"shortsword",Brand:"shortsword",Edge:"shortsword",Sword:"shortsword",Knotblade:"shortsword",
    Saber:"scimitar",
    Bow:"shortbow",Crossbow:"light crossbow",
    Hatchet:"handaxe",Cleaver:"handaxe",Axe:"battleaxe",
    Hammer:"light hammer",Maul:"maul",
    Spear:"spear",Javelin:"javelin",Lance:"lance",Pike:"pike",Glaive:"glaive",Spire:"spear",
    Flail:"flail",Mace:"mace",Morningstar:"morningstar",Whip:"whip",Trident:"trident",
    Scythe:"glaive","War-pick":"war pick"
  };
  var ARM_L="Vest Jacket Wrap Coat Guardcoat Corslet Shell".split(" ");
  var ARM_M="Mail Scale Brigandine Lamellar Hauberk Overmail Harness".split(" ");
  var ARM_H="Plate Cuirass Carapace Aegis Ward".split(" ");
  var SH_B="Buckler Targe Roundel".split(" ");
  var SH_T="Pavise Wallguard Door Plate".split(" ");

  function lastNoun(name){
    var s=String(name||"").replace(/^The\s+/i,"").trim();
    var m=s.match(/^(.+?)\s+of the\s+/i);
    if(m) s=m[1].trim();
    var parts=s.split(/\s+/);
    return parts[parts.length-1]||"";
  }
  function has(arr,n){return arr.indexOf(n)>=0;}
  function isHigh(r){return r==="Rare"||r==="Very Rare"||r==="Legendary";}

  function weaponKind(noun,rarity){
    var k=W_BASE[noun]||"shortsword";
    if(isHigh(rarity)){
      if((noun==="Blade"||noun==="Sword"||noun==="Brand"||noun==="Edge")&&k==="shortsword") k="longsword";
      if(k==="shortbow") k="longbow";
      if(k==="light hammer") k="warhammer";
      if(k==="light crossbow") k="heavy crossbow";
      if(noun==="Axe") k="greataxe";
    }
    return k;
  }
  function armorKind(noun){
    if(has(ARM_L,noun)) return "light";
    if(has(ARM_H,noun)) return "heavy";
    return "medium";
  }
  function shieldKind(noun){
    if(has(SH_B,noun)) return "buckler";
    if(has(SH_T,noun)) return "tower shield";
    return "shield";
  }
  function wondrousKind(type,noun){
    // Category uses the simple slot name (belt/ring/cloak…), not fancy nouns like "cincture"
    var fallback={Helmet:"helmet",Cloak:"cloak",Necklace:"necklace",Ring:"ring",Gloves:"gloves",Belt:"belt",Boots:"boots"};
    return fallback[type]||String(type||"item").toLowerCase();
  }

  function kindOf(type,name,rarity,item){
    if(type==="Potion"||type==="Scroll") return "";
    if(type==="Tincture"){
      if(item&&item.kind&&/^(anoint|sling|mark)$/.test(item.kind)) return item.kind;
      var title=item&&item.properties&&item.properties[0]&&item.properties[0].title;
      var t=String(title||"").toLowerCase();
      if(t==="sling"||t==="mark"||t==="anoint") return t;
      return "anoint";
    }
    var noun=lastNoun(name);
    if(type==="Weapon") return weaponKind(noun,rarity);
    if(type==="Armor") return armorKind(noun);
    if(type==="Shield") return shieldKind(noun);
    return wondrousKind(type,noun);
  }

  function categoryLine(item){
    var type=item.type, rarity=String(item.rarity||"").toLowerCase(), kind=item.kind||"";
    var cat;
    if(type==="Weapon") cat="Weapon ("+(kind||"shortsword")+")";
    else if(type==="Armor") cat="Armor ("+(kind||"medium")+")";
    else if(type==="Shield") cat="Shield ("+(kind||"shield")+")";
    else if(type==="Potion") cat="Potion";
    else if(type==="Scroll") cat="Scroll";
    else if(type==="Tincture") cat="Tincture ("+(kind||"anoint")+")";
    else cat="Wondrous item ("+(kind||String(type||"item").toLowerCase())+")";
    return cat+", "+rarity;
  }

  function applyKind(item){
    if(!item) return item;
    item.kind=kindOf(item.type,item.name,item.rarity,item);
    item.category=categoryLine(item);
    return item;
  }

  g.TLF_kindOf=kindOf;
  g.TLF_applyKind=applyKind;

  var prev=g.TLF_applyPlace;
  g.TLF_applyPlace=function(item){
    if(typeof prev==="function") item=prev(item)||item;
    return applyKind(item);
  };

  function syncCat(){
    var list;
    try{ list=JSON.parse(localStorage.getItem("tlf-history-v1")||"[]"); }catch(e){ return; }
    if(!list.length) return;
    var line=document.querySelector("#result .category-line");
    if(line&&list[0]&&list[0].category) line.textContent=list[0].category;
    var hist=document.querySelectorAll("#history .hist-card .category-line");
    for(var i=0;i<hist.length&&i<list.length;i++){
      if(list[i]&&list[i].category) hist[i].textContent=list[i].category;
    }
  }
  function hook(){
    var btn=document.getElementById("create");
    if(!btn||btn.dataset.kindHook) return;
    btn.dataset.kindHook="1";
    var p=btn.onclick;
    btn.onclick=function(){
      if(typeof p==="function") p.apply(this,arguments);
      setTimeout(syncCat,30);
    };
  }
  if(document.body) hook();
  else document.addEventListener("DOMContentLoaded", hook);
  setTimeout(hook,0);
})(typeof window!=="undefined"?window:globalThis);
