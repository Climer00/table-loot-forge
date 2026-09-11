/* Table Loot Forge — encounter crate (party stash) */
(function(){
  const WEAPON=["Weapon"];
  const DEFENSE=["Armor","Shield","Helmet"];
  const WORN=["Cloak","Necklace","Ring","Gloves","Belt","Boots"];
  const SIP=["Potion","Tincture","Scroll"];
  const MARK_KEY="tlf-crate-marks-v1";

  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function shuffle(a){
    const b=a.slice();
    for(let i=b.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      const t=b[i];b[i]=b[j];b[j]=t;
    }
    return b;
  }

  function bandFor(level){
    const n=Math.max(1,Math.min(20,+level||1));
    if(n<=4) return {main:"Common", splash:"Uncommon", up:"Rare", label:"tier 1–4"};
    if(n<=10) return {main:"Uncommon", splash:"Rare", up:"Very Rare", label:"tier 5–10"};
    if(n<=16) return {main:"Rare", splash:"Very Rare", up:"Legendary", label:"tier 11–16"};
    return {main:"Very Rare", splash:"Legendary", up:"Legendary", label:"tier 17–20"};
  }

  function stashCounts(players, kind){
    const p=Math.max(2,Math.min(8,+players||4));
    let gear=3, sips=2;
    if(p<=2){ gear=2; sips=1; }
    else if(p<=4){ gear=3; sips=2; }
    else if(p<=6){ gear=4; sips=3; }
    else { gear=5; sips=3; }
    return {players:p, gear:gear, sips:sips, show:kind==="Boss"};
  }

  function takeUnique(pools, used){
    for(let i=0;i<pools.length;i++){
      const avail=pools[i].filter(function(t){return !used.has(t);});
      if(avail.length){
        const t=pick(avail);
        used.add(t);
        return t;
      }
    }
    return null;
  }

  function planTypes(gearN, extra){
    const used=new Set();
    const gear=[];
    const first=takeUnique([WEAPON,DEFENSE], used);
    if(first) gear.push(first);
    const def=takeUnique([DEFENSE], used);
    if(def) gear.push(def);
    const worn=takeUnique([WORN], used);
    if(worn) gear.push(worn);
    while(gear.length<gearN){
      const t=takeUnique([WORN,DEFENSE,WEAPON], used);
      if(!t) break;
      gear.push(t);
    }
    let show=null;
    if(extra){
      show=takeUnique([WEAPON,WORN,DEFENSE], used) || pick(WEAPON.concat(DEFENSE).concat(WORN));
    }
    return {gear:gear, show:show};
  }

  function rarityPick(band, wantSplash){
    if(wantSplash) return band.splash;
    return Math.random()<0.22 ? band.splash : band.main;
  }

  function roleOf(type){
    if(type==="Weapon") return "Weapon";
    if(DEFENSE.indexOf(type)>=0) return "Defense";
    if(WORN.indexOf(type)>=0) return "Worn";
    return "Sip";
  }

  function buildPlan(players, level, kind){
    const counts=stashCounts(players, kind);
    const band=bandFor(level);
    const types=planTypes(counts.gear, counts.show);
    const items=[];
    types.gear.forEach(function(type,i){
      const splash=i===types.gear.length-1;
      items.push({rarity:rarityPick(band, splash), type:type, role:roleOf(type), tag:kind});
    });
    if(types.show){
      items.push({rarity:band.up, type:types.show, role:"Showpiece", tag:"Boss"});
    }
    const sipN=counts.sips;
    const sipBag=shuffle(SIP.concat(SIP));
    for(let i=0;i<sipN;i++){
      items.push({rarity:rarityPick(band, i===sipN-1), type:sipBag[i%sipBag.length], role:"Sip", tag:kind});
    }
    return {counts:counts, band:band, kind:kind, level:+level, items:items};
  }

  function clickIn(id, label){
    const root=document.getElementById(id);
    if(!root) return false;
    const btns=root.querySelectorAll(".btn");
    for(let i=0;i<btns.length;i++){
      if(btns[i].textContent===label){
        btns[i].click();
        return true;
      }
    }
    return false;
  }

  function forgeOne(rarity, type){
    if(!clickIn("rarities", rarity)) return false;
    if(!clickIn("types", type)) return false;
    const btn=document.getElementById("create");
    if(!btn || btn.disabled) return false;
    btn.click();
    return true;
  }

  function toast(msg){
    const t=document.getElementById("toast");
    if(!t) return;
    t.textContent=msg;
    t.classList.add("show");
    clearTimeout(toast._tid);
    toast._tid=setTimeout(function(){ t.classList.remove("show"); },1800);
  }

  function loadMarks(){
    try{
      const a=JSON.parse(localStorage.getItem(MARK_KEY)||"[]");
      return Array.isArray(a)?a:[];
    }catch(e){ return []; }
  }
  function saveMarks(a){
    try{ localStorage.setItem(MARK_KEY, JSON.stringify(a.slice(-80))); }catch(e){}
  }

  function paintCard(card, kind){
    if(!card) return;
    const boss=kind==="Boss";
    card.classList.remove("crate-chest","crate-boss");
    card.classList.add(boss?"crate-boss":"crate-chest");
    card.dataset.crateKind=kind;
    const meta=card.querySelector(".meta-row");
    if(meta && !meta.querySelector(".chip-crate")){
      const chip=document.createElement("span");
      chip.className="chip chip-crate";
      chip.textContent=boss?"BOSS":"CHEST";
      meta.appendChild(chip);
    }else if(meta){
      const chip=meta.querySelector(".chip-crate");
      if(chip) chip.textContent=boss?"BOSS":"CHEST";
    }
  }

  function markFresh(n, kind){
    const hist=[].slice.call(document.querySelectorAll("#history .loot-card"));
    const result=document.querySelector("#result .loot-card");
    const targets=hist.slice(0, n);
    if(result) targets.unshift(result);
    const marks=loadMarks();
    targets.forEach(function(card){
      paintCard(card, kind);
      marks.push({
        id:card.getAttribute("data-id")||"",
        name:((card.querySelector(".item-name")||{}).textContent||"").trim(),
        kind:kind,
        t:Date.now()
      });
    });
    saveMarks(marks);
  }

  function applyKnown(){
    const marks=loadMarks();
    if(!marks.length) return;
    document.querySelectorAll(".loot-card").forEach(function(card){
      if(card.dataset.crateKind) return;
      const id=card.getAttribute("data-id")||"";
      const name=((card.querySelector(".item-name")||{}).textContent||"").trim();
      let hit=null;
      for(let i=marks.length-1;i>=0;i--){
        const m=marks[i];
        if((id && m.id && m.id===id) || (name && m.name && m.name===name)){ hit=m; break; }
      }
      if(hit) paintCard(card, hit.kind);
    });
  }

  function renderManifest(plan, ok){
    const el=document.getElementById("crate-manifest");
    if(!el) return;
    const gear=plan.items.filter(function(it){return it.role!=="Sip";});
    const sips=plan.items.filter(function(it){return it.role==="Sip";});
    const lines=["<p class='crate-lead'>"+plan.kind+" · "+plan.counts.players+" players · level "+plan.level+" · "+plan.band.label+"</p>"];
    lines.push("<ul class='crate-list'>");
    plan.items.forEach(function(it){
      const mark=it.role==="Showpiece"?" showpiece":"";
      lines.push("<li class='crate-li"+mark+"'><span class='crate-role'>"+it.role+"</span> "+it.rarity+" "+it.type+"</li>");
    });
    lines.push("</ul>");
    lines.push("<p class='crate-foot'>"+gear.length+" gear · "+sips.length+" sips · gold frame = chest, ember frame = boss</p>");
    if(ok<plan.items.length){
      lines.push("<p class='crate-foot'>Forged "+ok+" of "+plan.items.length+". Tap Create if a slot failed.</p>");
    }
    el.innerHTML=lines.join("");
    el.hidden=false;
  }

  function $(sel){return document.querySelector(sel);}

  function openCrate(){
    const players=+$("#crate-players").textContent||4;
    const level=+$("#crate-level").textContent||3;
    const kindEl=document.querySelector(".crate-kind.active");
    const kind=kindEl?kindEl.getAttribute("data-kind"):"Chest";
    const plan=buildPlan(players, level, kind);
    let ok=0;
    plan.items.forEach(function(it){
      if(forgeOne(it.rarity, it.type)) ok++;
    });
    renderManifest(plan, ok);
    markFresh(ok, kind);
    setTimeout(function(){ markFresh(ok, kind); applyKnown(); }, 50);
    toast(kind+" opened · "+ok+" items");
    try{
      const hist=document.getElementById("history-panel");
      if(hist) hist.scrollIntoView({behavior:"smooth", block:"nearest"});
    }catch(e){}
  }

  function stepper(id, lo, hi, start){
    const wrap=document.getElementById(id);
    if(!wrap) return;
    const val=wrap.querySelector(".crate-val");
    val.textContent=String(start);
    wrap.querySelector("[data-dir='-']").onclick=function(){
      val.textContent=String(Math.max(lo, (+val.textContent||start)-1));
    };
    wrap.querySelector("[data-dir='+']").onclick=function(){
      val.textContent=String(Math.min(hi, (+val.textContent||start)+1));
    };
  }

  function mount(){
    if(document.getElementById("crate-panel")) return;
    const hint=document.getElementById("hint");
    const panel=document.createElement("section");
    panel.className="panel crate-panel";
    panel.id="crate-panel";
    panel.innerHTML=
      '<label class="sec">Crate · party stash</label>'+
      '<p class="crate-sub">After the fight. Not one item each — a shared pile.</p>'+
      '<div class="crate-row">'+
        '<div class="crate-step"><span class="crate-k">Players</span>'+
          '<div class="crate-stepper" id="crate-players-step">'+
            '<button type="button" class="crate-pm" data-dir="-">−</button>'+
            '<span class="crate-val" id="crate-players">4</span>'+
            '<button type="button" class="crate-pm" data-dir="+">+</button>'+
          '</div></div>'+
        '<div class="crate-step"><span class="crate-k">Level</span>'+
          '<div class="crate-stepper" id="crate-level-step">'+
            '<button type="button" class="crate-pm" data-dir="-">−</button>'+
            '<span class="crate-val" id="crate-level">3</span>'+
            '<button type="button" class="crate-pm" data-dir="+">+</button>'+
          '</div></div>'+
      '</div>'+
      '<div class="grid crate-kinds">'+
        '<button type="button" class="btn crate-kind active" data-kind="Chest">Chest</button>'+
        '<button type="button" class="btn crate-kind" data-kind="Boss">Boss</button>'+
      '</div>'+
      '<button type="button" class="crate-open" id="crate-open">Open crate</button>'+
      '<div class="crate-manifest" id="crate-manifest" hidden></div>';
    if(hint&&hint.parentNode) hint.parentNode.insertBefore(panel, hint.nextSibling);
    else document.body.appendChild(panel);

    if(!document.getElementById("tlt-crate-css")){
      const st=document.createElement("style");
      st.id="tlt-crate-css";
      st.textContent=
        ".crate-sub{margin:0 0 10px;font-size:.78rem;color:var(--muted)}"+
        ".crate-row{display:flex;gap:10px;margin-bottom:10px}"+
        ".crate-step{flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:8px 10px}"+
        ".crate-k{display:block;font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--copper);margin-bottom:6px}"+
        ".crate-stepper{display:flex;align-items:center;justify-content:space-between;gap:6px}"+
        ".crate-pm{appearance:none;border:1px solid rgba(107,124,147,.4);background:var(--card);color:var(--ink);width:40px;height:40px;border-radius:8px;font-size:1.2rem;font-weight:700}"+
        ".crate-val{font-size:1.15rem;font-weight:800;min-width:28px;text-align:center}"+
        ".crate-kinds{margin-bottom:10px}"+
        ".crate-kind.active{border-color:var(--teal);color:#fff;background:linear-gradient(180deg,#1a3330,#152826)}"+
        ".crate-open{width:100%;appearance:none;border:2px solid rgba(181,122,255,.55);background:linear-gradient(180deg,#2a2240,#1c1830);color:#e0c8ff;border-radius:12px;min-height:52px;font-size:.95rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase}"+
        ".crate-open:active{transform:scale(.98)}"+
        ".crate-manifest{margin-top:12px;background:rgba(0,0,0,.22);border:1px solid rgba(181,122,255,.25);border-radius:10px;padding:10px 12px}"+
        ".crate-lead{margin:0 0 8px;font-size:.82rem;color:var(--ink);font-weight:650}"+
        ".crate-list{margin:0;padding:0;list-style:none}"+
        ".crate-li{display:flex;gap:8px;align-items:baseline;font-size:.85rem;margin:0 0 6px;color:var(--ink)}"+
        ".crate-li.showpiece{color:#d0b0ff}"+
        ".crate-role{display:inline-block;min-width:72px;font-size:.65rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--copper)}"+
        ".crate-foot{margin:8px 0 0;font-size:.72rem;color:var(--muted)}"+
        ".loot-card.crate-chest{border:3px solid #e0b15a !important;box-shadow:0 0 0 3px #161a20,0 0 0 6px rgba(224,177,90,.9),0 6px 20px rgba(0,0,0,.35) !important}"+
        ".loot-card.crate-chest::before{border:1px dashed rgba(224,177,90,.6)}"+
        ".loot-card.crate-boss{border:3px solid #ff8a4a !important;box-shadow:0 0 0 3px #161a20,0 0 0 6px rgba(180,55,20,.95),0 0 22px rgba(255,107,53,.28) !important}"+
        ".loot-card.crate-boss::before{border:1px dashed rgba(255,138,74,.55)}"+
        ".chip-crate{color:#e0b15a;border-color:rgba(224,177,90,.55)}"+
        ".crate-boss .chip-crate{color:#ffb086;border-color:rgba(255,138,74,.55)}";
      document.head.appendChild(st);
    }

    stepper("crate-players-step",2,8,4);
    stepper("crate-level-step",1,20,3);
    panel.querySelectorAll(".crate-kind").forEach(function(b){
      b.onclick=function(){
        panel.querySelectorAll(".crate-kind").forEach(function(x){x.classList.toggle("active",x===b);});
      };
    });
    document.getElementById("crate-open").onclick=openCrate;
    applyKnown();
    const mo=new MutationObserver(function(){ applyKnown(); });
    mo.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
