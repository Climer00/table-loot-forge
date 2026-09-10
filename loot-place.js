/* Table Loot Forge — Place chips + look/lore overlay */
(function(){
  var KEY="tlf-place-v1";
  var PLACES=["Any","Road","Camp","Ruin","Body"];
  var LOOK={
    Road:[
      "Dust lives in every seam. The finish is worn where a traveler's hand would rest.",
      "Mile grit clings to it. A faded waymark is scratched on the underside.",
      "It smells faintly of rain and hot iron. The strap has been mended twice on the road.",
      "A ribbon of road-dust never quite brushes off. The weight sits ready, like it expects another mile.",
      "The surface is nicked from pack-frames and saddle rings. It still looks like it wants to move."
    ],
    Camp:[
      "The hem is cut short so it will not snag on brush. A faded clan stitch sits inside the collar.",
      "Smoke and grease have stained the edges. Someone carved a tally of nights into the hidden face.",
      "Patched leather, stolen thread, a stamp that does not match the rest of the kit.",
      "It smells like wet canvas and stew. The fittings are mixed metals, grabbed from more than one belt.",
      "A bit of twine and a bone bead hold a loose end. This was camp gear before it was anybody's prize."
    ],
    Ruin:[
      "Dust lives in the weave. The clasp is older than the cloth around it.",
      "Moss-stain and broken inscription. Do not read the inner mark aloud.",
      "The metal has the pale cast of a long-closed room. Grit still sits in the engraved lines.",
      "A flake of plaster clings to a seam. The maker's mark is half a letter and a crack.",
      "It feels colder than the air. Something in the ruin wanted it left where it lay."
    ],
    Body:[
      "A name is sewn into the lining, small and careful. The rest is pocket-worn.",
      "Still warm from being carried close. A personal stitch does not match the rest of the work.",
      "The strap is darkened where a thumb worried it. Whoever wore it meant to come back.",
      "Lint and a folded scrap of paper live in a hidden fold. The paper is blank now.",
      "It came off a belt or a throat, not a shelf. The wear is a person's wear."
    ]
  };
  var LORE={
    Road:[
      "Lifted from a roadside shrine that had no priest left. Dust never quite settles on it.",
      "A caravan sold it after the last mule died. Street prophets say it chooses who may keep it.",
      "Found under a milestone after a storm. The maker's mark is a coin with no mint.",
      "Traded at a crossroads for a meal and a name. It still smells of rain on hot iron.",
      "Taken from a coach that never arrived. Someone carved a road-prayer on the hidden face."
    ],
    Camp:[
      "Pulled from a goblin cache under a canvas lean-to. The tally marks do not add up.",
      "A bandit sergeant wore it until the last watch. The campfire still remembers the shape.",
      "Taken off a bedroll that was still warm. Clan stitch inside, no clan left outside.",
      "Looted from a mercenary cook-fire. Someone had wrapped it in a torn banner.",
      "Found in a sack with dice and a stolen spoon. The camp moved on without it."
    ],
    Ruin:[
      "Pried from a lintel that had no door. The inscription breaks off mid-word.",
      "It sat on a plinth that faced the wrong way. Dust in the ruin moved around it, not over it.",
      "Commissioned for a shrine that fell in on itself. Street prophets say it chooses who may keep it.",
      "Pulled from a crack in a mosaic floor. The tiles around it were newer than the rest.",
      "A dead language lives on the inner face. No one in the ruin would say it out loud."
    ],
    Body:[
      "Gifted by a dying scout who smiled as if the debt were paid.",
      "Cut from a belt after the fight. The name in the lining is not the name on the wanted board.",
      "Still folded the way they wore it. A letter in the pocket is addressed to someone else.",
      "Taken from cold fingers that had not yet let go. The stitch is a home stitch.",
      "Lifted from a coat that will not be claimed. Dust never quite settles on it."
    ]
  };
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function loadPlace(){
    try{
      var s=localStorage.getItem(KEY);
      if(PLACES.indexOf(s)>=0) return s;
    }catch(e){}
    return "Any";
  }
  function savePlace(p){
    window.TLF_place=p;
    try{ localStorage.setItem(KEY,p); }catch(e){}
  }
  window.TLF_place=loadPlace();
  window.TLF_applyPlace=function(item){
    if(!item) return item;
    var place=window.TLF_place||"Any";
    item.place=place;
    if(place==="Any") return item;
    var looks=LOOK[place], lores=LORE[place];
    if(looks&&looks.length) item.description=pick(looks);
    if(lores&&lores.length) item.lore=pick(lores);
    return item;
  };
  function paint(){
    var grid=document.getElementById("places");
    if(!grid) return;
    var cur=window.TLF_place||"Any";
    [].slice.call(grid.querySelectorAll(".btn")).forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-place")===cur);
    });
  }
  function mount(){
    var panel=document.getElementById("place-panel");
    var typePanel=document.getElementById("type-panel");
    if(!panel){
      if(!typePanel||!typePanel.parentNode) return;
      panel=document.createElement("section");
      panel.className="panel";
      panel.id="place-panel";
      var lab=document.createElement("label");
      lab.className="sec";
      lab.innerHTML='3. Place <span class="place-opt">optional</span>';
      var grid0=document.createElement("div");
      grid0.className="grid";
      grid0.id="places";
      panel.appendChild(lab);
      panel.appendChild(grid0);
      typePanel.parentNode.insertBefore(panel, typePanel.nextSibling);
    }
    var grid=document.getElementById("places");
    if(!grid) return;
    if(grid.querySelector(".btn")){ paint(); return; }
    PLACES.forEach(function(p){
      var b=document.createElement("button");
      b.type="button";
      b.className="btn place";
      b.setAttribute("data-place",p);
      b.textContent=p;
      b.addEventListener("click", function(){
        savePlace(p);
        paint();
      });
      grid.appendChild(b);
    });
    if(!document.getElementById("tlf-place-css")){
      var st=document.createElement("style");
      st.id="tlf-place-css";
      st.textContent=".place-opt{font-weight:650;text-transform:none;letter-spacing:0;color:var(--muted);font-size:.65rem}"+ ".btn.place.active{border-color:#c9b8ff;background:linear-gradient(180deg,#2a2438,#1e1a28);color:#e0d4ff}"+ ".chip-place{color:#c9b8ff;border-color:rgba(181,122,255,.45)}";
      document.head.appendChild(st);
    }
    paint();
  }
  if(document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
