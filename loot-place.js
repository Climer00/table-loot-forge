/* Table Loot Forge — Place + Theme + Found-with overlay */
(function(){
  var PLACE_KEY="tlf-place-v1";
  var THEME_KEY="tlf-theme-v1";
  var PLACES=["Any","Road","Camp","Ruin","Body"];
  var THEMES=["Any","Goblin","Bandit","Undead","Dragon","Fey","Sacred"];
  var LOOK={
    Road:["Dust lives in every seam. The finish is worn where a traveler's hand would rest.","Mile grit clings to it. A faded waymark is scratched on the underside.","It smells faintly of rain and hot iron. The strap has been mended twice on the road."],
    Camp:["The hem is cut short so it will not snag on brush. A faded clan stitch sits inside the collar.","Smoke and grease have stained the edges. Someone carved a tally of nights into the hidden face.","Patched leather, stolen thread, a stamp that does not match the rest of the kit."],
    Ruin:["Dust lives in the weave. The clasp is older than the cloth around it.","Moss-stain and broken inscription. Do not read the inner mark aloud.","The metal has the pale cast of a long-closed room. Grit still sits in the engraved lines."],
    Body:["A name is sewn into the lining, small and careful. The rest is pocket-worn.","Still warm from being carried close. A personal stitch does not match the rest of the work.","The strap is darkened where a thumb worried it. Whoever wore it meant to come back."]
  };
  var LORE={
    Road:["Lifted from a roadside shrine that had no priest left. Dust never quite settles on it.","A caravan sold it after the last mule died. The maker's mark is a coin with no mint.","Found under a milestone after a storm. Street prophets say it chooses who may keep it."],
    Camp:["Pulled from a cache under a canvas lean-to. The tally marks do not add up.","Taken off a bedroll that was still warm. Clan stitch inside, no clan left outside.","Found in a sack with dice and a stolen spoon. The camp moved on without it."],
    Ruin:["Pried from a lintel that had no door. The inscription breaks off mid-word.","It sat on a plinth that faced the wrong way. Dust moved around it, not over it.","Pulled from a crack in a mosaic floor. The tiles around it were newer than the rest."],
    Body:["Gifted by a dying scout who smiled as if the debt were paid.","Cut from a belt after the fight. The name in the lining is not the name on the board.","Still folded the way they wore it. A letter in the pocket is addressed to someone else."]
  };
  var THEME_LOOK={
    Goblin:["Crude lashings hold better work together. A yellowed tooth is tied to a loose end.","The finish is chewed and scratched. Someone has gnawed a grin into the hidden face.","It smells like wet fur and cheap dye. The fittings are mixed scrap, none of it matching."],
    Bandit:["A notch for every job is filed where a thumb would find it. The leather is road-dark.","A strip of stolen silk is bound over older wrap. The stamp has been filed off.","It looks like it was taken off someone who argued. The strap was cut and retied."],
    Undead:["A cold film never quite leaves the surface. The wrap smells faintly of myrrh and dust.","Pale salt crusts the seams. The metal drinks light instead of throwing it back.","Linen threads cling to it as if it were unwrapped, not forged."],
    Dragon:["Heat-haze still lives in the metal. A scale-pattern is pressed where a hand would rest.","It smells faintly of ozone and old coin. The edge holds a warmth that does not fade.","Soot from a hoard-fire is baked into the grain. It will not brush off."],
    Fey:["The color shifts if you look past it instead of at it. Dew never dries on the seam.","A hair-thin vine is grown through a rivet, still green. It should not be alive.","It rings like glass when you tap it, though it is not glass."],
    Sacred:["A worn blessing is cut on the inner face. Candle-soot darkens the hollows.","The maker left a saint-mark and then tried to scrape it off. The scrape failed.","It smells of incense and old stone. The wrap is altar-cloth, not pack-cloth."]
  };
  var THEME_LORE={
    Goblin:["A goblin market would not take it back. The clan mark is upside down on purpose.","Stolen from a chief who counted in teeth. The tally does not match the story.","Traded for a rusty nail and a dare. Goblin work hides under better paint."],
    Bandit:["Pulled from a highway purse after the last watch. The fence would not touch it.","A road crew left it when the job went loud. The silk wrap is from a better house.","Marked as shared loot, then kept. Nobody argued twice."],
    Undead:["It came up with the grave dirt. The priest would not say the prayer over it.","Unwrapped from a chest that was not a chest. Cold follows the person who carries it.","A barrow gift. The dead do not ask it back. They wait."],
    Dragon:["Pried from a hoard that still steamed. Coin-dust lives in every seam.","A wyrm coughed it up or slept on it. The heat in it does not match the room.","Taken while the beast was elsewhere. The hoard noticed."],
    Fey:["Paid as a guest-gift and meant as a joke. The joke is still running.","Left on a stump after a dance that lasted one night and three years.","A court token. Wearing it is an answer. Nobody told you the question."],
    Sacred:["Lifted from a side-altar after the last candle died. The saint's name is half gone.","A temple inventory listed it as missing, then as never present.","Blessed, then hidden, then found. The blessing did not take the second time."]
  };
  var JUNK_ANY=["a bent nail","a wax stub","a frayed cord","a scrap of paper with no name","a cracked bead","a pinch of road salt"];
  var JUNK_PLACE={
    Road:["a waymark chip","mule hair wound in twine","a coach-ticket stub","charcoal from a milestone"],
    Camp:["a stolen spoon","a pair of bone dice","stew-fat on a rag","a tally stick with the nights cut off"],
    Ruin:["a plaster flake","a mosaic tessera","a chip of dead-language stone","dust that will not brush off"],
    Body:["a folded scrap addressed to someone else","a home-stitch offcut","a thumb-worn bead","a letter that is blank now"]
  };
  var JUNK_THEME={
    Goblin:["a yellowed tooth","an upside-down clan bead","a rusty nail used as a pin"],
    Bandit:["a strip of stolen silk","a filed-off stamp","a notch-stick of old jobs"],
    Undead:["a burial copper","a strip of grave linen","a pinch of pale salt"],
    Dragon:["a flake of scale","coin-dust in a twist of cloth","hoard-soot that will not wipe"],
    Fey:["a leaf that is still wet","a hair-thin living vine","a dew-glass bead"],
    Sacred:["a candle stub","a saint-chip","a thread of altar-cloth"]
  };
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function rand(n){ return Math.floor(Math.random()*n); }
  function listAnd(bits){
    bits=bits.filter(Boolean);
    if(bits.length===1) return bits[0];
    if(bits.length===2) return bits[0]+" and "+bits[1];
    return bits.slice(0,-1).join(", ")+", and "+bits[bits.length-1];
  }
  function coinFor(rarity){
    if(rarity==="Common") return (2+rand(7))+" cp";
    if(rarity==="Uncommon") return (3+rand(10))+" sp";
    if(rarity==="Rare") return (2+rand(8))+" gp";
    if(rarity==="Very Rare") return (12+rand(18))+" gp";
    if(rarity==="Legendary") return (40+rand(41))+" gp";
    return (1+rand(6))+" sp";
  }
  function makeFound(item){
    var place=item.place||"Any";
    var theme=item.theme||"Any";
    var bits=[coinFor(item.rarity)];
    var pool=(JUNK_PLACE[place]||[]).concat(JUNK_ANY);
    bits.push(pick(pool));
    if(theme!=="Any" && JUNK_THEME[theme] && Math.random()<0.85) bits.push(pick(JUNK_THEME[theme]));
    else if(Math.random()<0.35) bits.push(pick(JUNK_ANY));
    return listAnd(bits)+".";
  }
  function loadKey(key, allowed){
    try{
      var s=localStorage.getItem(key);
      if(allowed.indexOf(s)>=0) return s;
    }catch(e){}
    return "Any";
  }
  function saveKey(key, prop, val){
    window[prop]=val;
    try{ localStorage.setItem(key,val); }catch(e){}
  }
  window.TLF_place=loadKey(PLACE_KEY, PLACES);
  window.TLF_theme=loadKey(THEME_KEY, THEMES);
  window.TLF_applyPlace=function(item){
    if(!item) return item;
    var place=window.TLF_place||"Any";
    var theme=window.TLF_theme||"Any";
    item.place=place;
    item.theme=theme;
    if(theme!=="Any" && THEME_LOOK[theme]) item.description=pick(THEME_LOOK[theme]);
    else if(place!=="Any" && LOOK[place]) item.description=pick(LOOK[place]);
    var loreBits=[];
    if(place!=="Any" && LORE[place]) loreBits.push(pick(LORE[place]));
    if(theme!=="Any" && THEME_LORE[theme]) loreBits.push(pick(THEME_LORE[theme]));
    if(loreBits.length) item.lore=loreBits.join(" ");
    item.found=makeFound(item);
    return item;
  };
  function paintGrid(id, attr, cur){
    var grid=document.getElementById(id);
    if(!grid) return;
    [].slice.call(grid.querySelectorAll(".btn")).forEach(function(b){
      b.classList.toggle("active", b.getAttribute(attr)===cur);
    });
  }
  function paint(){
    paintGrid("places","data-place", window.TLF_place||"Any");
    paintGrid("themes","data-theme", window.TLF_theme||"Any");
  }
  function fillGrid(gridId, list, attr, cls, saveFn){
    var grid=document.getElementById(gridId);
    if(!grid || grid.querySelector(".btn")) return;
    list.forEach(function(name){
      var b=document.createElement("button");
      b.type="button";
      b.className="btn "+cls;
      b.setAttribute(attr, name);
      b.textContent=name;
      b.addEventListener("click", function(){
        saveFn(name);
        paint();
      });
      grid.appendChild(b);
    });
  }
  function ensurePanel(id, afterId, titleHtml, gridId){
    var panel=document.getElementById(id);
    if(panel) return panel;
    var after=document.getElementById(afterId);
    if(!after||!after.parentNode) return null;
    panel=document.createElement("section");
    panel.className="panel";
    panel.id=id;
    panel.innerHTML='<label class="sec">'+titleHtml+'</label><div class="grid" id="'+gridId+'"></div>';
    after.parentNode.insertBefore(panel, after.nextSibling);
    return panel;
  }
  function mount(){
    ensurePanel("place-panel","type-panel",'3. Place <span class="place-opt">optional</span>',"places");
    ensurePanel("theme-panel","place-panel",'4. Theme <span class="place-opt">optional</span>',"themes");
    fillGrid("places", PLACES, "data-place", "place", function(p){ saveKey(PLACE_KEY,"TLF_place",p); });
    fillGrid("themes", THEMES, "data-theme", "theme", function(p){ saveKey(THEME_KEY,"TLF_theme",p); });
    if(!document.getElementById("tlf-place-css")){
      var st=document.createElement("style");
      st.id="tlf-place-css";
      st.textContent=".place-opt{font-weight:650;text-transform:none;letter-spacing:0;color:var(--muted);font-size:.65rem}.btn.place.active{border-color:#c9b8ff;background:linear-gradient(180deg,#2a2438,#1e1a28);color:#e0d4ff}.btn.theme.active{border-color:#e0a36b;background:linear-gradient(180deg,#3a2a18,#241c12);color:#f0d0a8}.chip-place{color:#c9b8ff;border-color:rgba(181,122,255,.45)}.chip-theme{color:#e0a36b;border-color:rgba(224,163,107,.45)}.found{margin:10px 0 0;font-size:.82rem;color:var(--muted);background:rgba(0,0,0,.14);border:1px dashed rgba(212,165,116,.3);padding:8px 10px;border-radius:8px}.found-label{font-weight:700;color:var(--copper);font-style:normal}";
      document.head.appendChild(st);
    }
    paint();
  }
  function addChip(meta, cls, text){
    if(!meta || !text || text==="Any") return;
    if(meta.querySelector("."+cls)) return;
    var chip=document.createElement("span");
    chip.className="chip "+cls;
    chip.textContent=text;
    meta.appendChild(chip);
  }
  function setFound(card, text){
    if(!card || !text) return;
    var block=card.querySelector(".found");
    if(!block){
      block=document.createElement("p");
      block.className="found";
      var inner=card.querySelector(".loot-card-inner")||card;
      var actions=inner.querySelector(".card-actions");
      if(actions) inner.insertBefore(block, actions);
      else inner.appendChild(block);
    }
    block.innerHTML="";
    var lab=document.createElement("span");
    lab.className="found-label";
    lab.textContent="Found with it:";
    block.appendChild(lab);
    block.appendChild(document.createTextNode(" "+text));
  }
  function decorateCard(card, item){
    if(!card || !item) return;
    var flavored=(item.place&&item.place!=="Any")||(item.theme&&item.theme!=="Any");
    if(flavored){
      var look=card.querySelector(".look");
      if(look && item.description) look.textContent=item.description;
      var lore=card.querySelector(".lore");
      if(lore && item.lore){
        lore.innerHTML="";
        var lab=document.createElement("span");
        lab.className="lore-label";
        lab.textContent="Lore:";
        lore.appendChild(lab);
        lore.appendChild(document.createTextNode(" "+item.lore));
      }
    }
    var meta=card.querySelector(".meta-row");
    addChip(meta,"chip-place",item.place);
    addChip(meta,"chip-theme",item.theme);
    setFound(card, item.found);
  }
  var pending=0;
  var flushTid=0;
  function retouchN(n){
    if(!n) return;
    var list;
    try{ list=JSON.parse(localStorage.getItem("tlf-history-v1")||"[]"); }catch(e){ return; }
    if(!list.length) return;
    var slice=list.slice(0, n);
    slice.forEach(function(item){ window.TLF_applyPlace(item); });
    try{ localStorage.setItem("tlf-history-v1", JSON.stringify(list)); }catch(e){}
    var card=document.querySelector("#result .loot-card");
    if(card) decorateCard(card, list[0]);
    var histCards=document.querySelectorAll("#history .hist-card");
    for(var i=0;i<slice.length && i<histCards.length;i++) decorateCard(histCards[i], slice[i]);
  }
  function hookBtn(){
    var btn=document.getElementById("create");
    if(!btn || btn.dataset.placeHook) return;
    btn.dataset.placeHook="1";
    var prev=btn.onclick;
    btn.onclick=function(){
      if(typeof prev==="function") prev.apply(this, arguments);
      pending++;
      clearTimeout(flushTid);
      flushTid=setTimeout(function(){
        var n=pending;
        pending=0;
        retouchN(n);
      }, 0);
    };
  }
  function start(){
    mount();
    hookBtn();
  }
  if(document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
  setTimeout(hookBtn, 0);
})();
