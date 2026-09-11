/* Table Loot Forge — Forge | Shop job switch (stall now, full shop stacked) */
(function(){
  const JOB_KEY="tlf-job";
  const MARK_KEY="tlf-shop-marks-v1";
  const GEAR=["Weapon","Armor","Shield","Helmet","Cloak","Necklace","Ring","Gloves","Belt","Boots"];
  const ARMS=["Weapon","Armor","Shield"];
  const WORN=["Helmet","Cloak","Necklace","Ring","Gloves","Belt","Boots"];
  const SIP=["Potion","Tincture","Scroll"];

  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function shuffle(a){
    const b=a.slice();
    for(let i=b.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      const t=b[i];b[i]=b[j];b[j]=t;
    }
    return b;
  }

  function currentJob(){
    try{
      const s=localStorage.getItem(JOB_KEY);
      if(s==="shop"||s==="forge") return s;
    }catch(e){}
    return "forge";
  }

  function applyJob(job){
    const j=job==="shop"?"shop":"forge";
    document.documentElement.setAttribute("data-job", j);
    document.body.classList.toggle("job-shop", j==="shop");
    document.body.classList.toggle("job-forge", j==="forge");
    document.querySelectorAll(".job-tab").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-job")===j);
    });
    try{ localStorage.setItem(JOB_KEY, j); }catch(e){}
  }

  function bandFor(level){
    const n=Math.max(1,Math.min(20,+level||1));
    if(n<=4) return {main:"Common", splash:"Uncommon", up:"Rare"};
    if(n<=10) return {main:"Uncommon", splash:"Rare", up:"Very Rare"};
    if(n<=16) return {main:"Rare", splash:"Very Rare", up:"Legendary"};
    return {main:"Very Rare", splash:"Legendary", up:"Legendary"};
  }

  function rarityFor(level, wealth, slot){
    const band=bandFor(level);
    const w=wealth||"Fair";
    if(w==="Poor"){
      if(slot==="show" && Math.random()<0.2) return "Uncommon";
      return Math.random()<0.12 && +level>=3 ? "Uncommon" : "Common";
    }
    if(w==="Rich"){
      if(slot==="show") return band.up;
      return Math.random()<0.28 ? band.splash : band.main;
    }
    if(slot==="show") return band.splash;
    return Math.random()<0.22 ? band.splash : band.main;
  }

  function groupOf(type){
    if(ARMS.indexOf(type)>=0) return "Arms";
    if(WORN.indexOf(type)>=0) return "Worn";
    if(SIP.indexOf(type)>=0) return "Bottles";
    return "Oddments";
  }

  function planTypes(n, layout){
    const used=new Set();
    function take(pools){
      for(let i=0;i<pools.length;i++){
        const avail=pools[i].filter(function(t){return !used.has(t);});
        if(avail.length){
          const t=pick(avail);
          used.add(t);
          return t;
        }
      }
      const all=GEAR.concat(SIP).filter(function(t){return !used.has(t);});
      if(!all.length) return pick(GEAR.concat(SIP));
      const t=pick(all);
      used.add(t);
      return t;
    }
    const types=[];
    if(layout==="full"){
      types.push(take([ARMS]));
      types.push(take([ARMS]));
      types.push(take([WORN]));
      types.push(take([WORN]));
      types.push(take([SIP]));
      types.push(take([SIP]));
      types.push(take([SIP,WORN]));
      while(types.length<n) types.push(take([GEAR,SIP]));
    }else{
      types.push(take([ARMS]));
      types.push(take([WORN,ARMS]));
      types.push(take([SIP]));
      types.push(take([SIP]));
      types.push(take([WORN,SIP]));
      while(types.length<n) types.push(take([GEAR,SIP]));
    }
    return types.slice(0,n);
  }

  function nice(n){
    if(n<20) return Math.max(1, Math.round(n));
    if(n<100) return Math.round(n/5)*5;
    if(n<500) return Math.round(n/10)*10;
    if(n<2000) return Math.round(n/25)*25;
    if(n<10000) return Math.round(n/50)*50;
    return Math.round(n/100)*100;
  }

  function rollBetween(lo, hi){
    return lo+Math.random()*(hi-lo);
  }

  function priceOf(rarity, type, wealth){
    const sip=/potion|tincture|scroll/i.test(type);
    const tin=/tincture/i.test(type);
    const ranges={
      Common:{Poor:[18,40], Fair:[35,90], Rich:[60,140]},
      Uncommon:{Poor:[70,140], Fair:[160,420], Rich:[280,700]},
      Rare:{Poor:[350,700], Fair:[750,1800], Rich:[1300,3200]},
      "Very Rare":{Poor:[1600,3200], Fair:[3000,7500], Rich:[5500,13000]},
      Legendary:{Poor:[7000,14000], Fair:[11000,24000], Rich:[18000,38000]}
    };
    const row=ranges[rarity]||ranges.Common;
    const pair=row[wealth]||row.Fair;
    let n=rollBetween(pair[0], pair[1]);
    if(tin) n*=0.45;
    else if(sip) n*=0.38;
    return nice(n);
  }

  function clickIn(id, label){
    const root=document.getElementById(id);
    if(!root) return false;
    const btns=root.querySelectorAll(".btn");
    for(let i=0;i<btns.length;i++){
      if((btns[i].textContent||"").trim()===label){
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

  function latestCard(){
    return document.querySelector("#result .loot-card");
  }

  function cardBits(card){
    if(!card) return {name:"", cat:"", rarity:""};
    const name=((card.querySelector(".item-name")||{}).textContent||"").trim();
    const cat=((card.querySelector(".category-line")||{}).textContent||"").trim();
    let rarity="";
    ["legendary","veryrare","rare","uncommon","common"].forEach(function(k){
      if(card.classList.contains("r-"+k)){
        rarity={legendary:"Legendary", veryrare:"Very Rare", rare:"Rare", uncommon:"Uncommon", common:"Common"}[k];
      }
    });
    return {name:name, cat:cat, rarity:rarity};
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

  function paintCard(card, gp){
    if(!card) return;
    card.classList.add("crate-shop");
    card.dataset.crateKind="Shop";
    const meta=card.querySelector(".meta-row");
    if(meta && !meta.querySelector(".chip-shop")){
      const chip=document.createElement("span");
      chip.className="chip chip-shop";
      chip.textContent="SHOP";
      meta.appendChild(chip);
    }
    if(meta){
      let price=meta.querySelector(".chip-price");
      if(!price){
        price=document.createElement("span");
        price.className="chip chip-price";
        meta.appendChild(price);
      }
      price.textContent=gp+" gp";
    }
  }

  function remember(card, gp){
    const bits=cardBits(card);
    const marks=loadMarks();
    marks.push({
      id:card?card.getAttribute("data-id")||"":"",
      name:bits.name,
      kind:"Shop",
      gp:gp,
      t:Date.now()
    });
    saveMarks(marks);
  }

  function applyKnown(){
    const marks=loadMarks();
    if(!marks.length) return;
    document.querySelectorAll(".loot-card").forEach(function(card){
      const id=card.getAttribute("data-id")||"";
      const name=((card.querySelector(".item-name")||{}).textContent||"").trim();
      let hit=null;
      for(let i=marks.length-1;i>=0;i--){
        const m=marks[i];
        if((id && m.id && m.id===id) || (name && m.name && m.name===name)){ hit=m; break; }
      }
      if(hit) paintCard(card, hit.gp);
    });
  }

  function toast(msg){
    const t=document.getElementById("toast");
    if(!t) return;
    t.textContent=msg;
    t.classList.add("show");
    clearTimeout(toast._tid);
    toast._tid=setTimeout(function(){ t.classList.remove("show"); },1800);
  }

  function stepper(id, lo, hi, start){
    const wrap=document.getElementById(id);
    if(!wrap) return;
    const val=wrap.querySelector(".shop-val");
    val.textContent=String(start);
    wrap.querySelector("[data-dir='-']").onclick=function(){
      val.textContent=String(Math.max(lo, (+val.textContent||start)-1));
    };
    wrap.querySelector("[data-dir='+']").onclick=function(){
      val.textContent=String(Math.min(hi, (+val.textContent||start)+1));
    };
  }

  function layout(){
    const el=document.querySelector(".shop-layout.active");
    return el?el.getAttribute("data-layout"):"stall";
  }
  function wealth(){
    const el=document.querySelector(".shop-wealth.active");
    return el?el.getAttribute("data-wealth"):"Fair";
  }
  function listingsN(){
    return Math.max(4, Math.min(8, +document.getElementById("shop-count").textContent||6));
  }
  function levelN(){
    return Math.max(1, Math.min(20, +document.getElementById("shop-level").textContent||3));
  }

  let board=[];

  function renderBoard(){
    const el=document.getElementById("shop-board");
    if(!el) return;
    if(!board.length){
      el.hidden=true;
      el.innerHTML="";
      return;
    }
    const lay=layout();
    const parts=[];
    function rowHtml(it, i){
      return '<div class="shop-row" data-i="'+i+'">'+ 
        '<span class="shop-gp">'+it.gp+' gp</span>'+
        '<div class="shop-copy">'+
          '<strong class="shop-name">'+(it.name||it.type)+'</strong>'+
          '<span class="shop-meta">'+(it.rarity||"")+" · "+(it.cat||it.type)+"</span>"+
        "</div>"+
        '<button type="button" class="shop-reroll" data-i="'+i+'">Reroll</button>'+
      "</div>";
    }
    if(lay==="full"){
      const groups=["Arms","Worn","Bottles","Oddments"];
      groups.forEach(function(g){
        const rows=board.map(function(it,i){return {it:it,i:i};}).filter(function(x){return groupOf(x.it.type)===g;});
        if(!rows.length) return;
        parts.push('<p class="shop-dept">'+g+"</p>");
        rows.forEach(function(x){ parts.push(rowHtml(x.it, x.i)); });
      });
    }else{
      parts.push('<p class="shop-dept">Stall</p>');
      board.forEach(function(it,i){ parts.push(rowHtml(it,i)); });
    }
    el.innerHTML=parts.join("");
    el.hidden=false;
  }

  function fillSlot(i, rarity, type){
    if(!forgeOne(rarity, type)) return false;
    const card=latestCard();
    const bits=cardBits(card);
    const gp=priceOf(bits.rarity||rarity, type, wealth());
    if(card){
      paintCard(card, gp);
      remember(card, gp);
    }
    board[i]={
      rarity:bits.rarity||rarity,
      type:type,
      name:bits.name,
      cat:bits.cat,
      gp:gp
    };
    return true;
  }

  function openShop(){
    const n=listingsN();
    const lv=levelN();
    const w=wealth();
    const lay=layout();
    const types=planTypes(n, lay);
    board=[];
    let ok=0;
    types.forEach(function(type, i){
      const rare=rarityFor(lv, w, i===types.length-1?"show":"stock");
      if(fillSlot(i, rare, type)) ok++;
      else board[i]={rarity:rare, type:type, name:type, cat:type, gp:priceOf(rare,type,w)};
    });
    renderBoard();
    applyKnown();
    toast((lay==="full"?"Shop":"Stall")+" opened · "+ok+" listings");
    try{
      const boardEl=document.getElementById("shop-board");
      if(boardEl) boardEl.scrollIntoView({behavior:"smooth", block:"nearest"});
    }catch(e){}
  }

  function reroll(i){
    const it=board[i];
    if(!it) return;
    const lv=levelN();
    const rare=rarityFor(lv, wealth(), "stock");
    if(fillSlot(i, rare, it.type)){
      renderBoard();
      toast("Rerolled listing");
    }
  }

  function showRow(i){
    const it=board[i];
    if(!it || !it.name) return;
    const cards=[].slice.call(document.querySelectorAll("#history .loot-card, #result .loot-card"));
    for(let c=0;c<cards.length;c++){
      const nm=((cards[c].querySelector(".item-name")||{}).textContent||"").trim();
      if(nm===it.name){
        cards[c].scrollIntoView({behavior:"smooth", block:"center"});
        return;
      }
    }
  }

  function mountJobTabs(){
    if(document.querySelector(".job-tabs")) return;
    const bar=document.createElement("div");
    bar.className="job-tabs";
    bar.setAttribute("role","tablist");
    bar.innerHTML=
      '<button type="button" class="job-tab" data-job="forge">Forge</button>'+
      '<button type="button" class="job-tab" data-job="shop">Shop</button>';
    const header=document.querySelector("header");
    const modes=document.querySelector(".mode-tabs");
    if(header && modes) header.insertBefore(bar, modes);
    else if(header) header.appendChild(bar);
    else document.body.insertBefore(bar, document.body.firstChild);
    bar.addEventListener("click", function(e){
      const b=e.target.closest(".job-tab");
      if(!b) return;
      applyJob(b.getAttribute("data-job"));
    });
  }

  function mountPanel(){
    if(document.getElementById("shop-panel")) return;
    const panel=document.createElement("section");
    panel.className="panel shop-panel";
    panel.id="shop-panel";
    panel.innerHTML=
      '<label class="sec">Shop · stall</label>'+
      '<p class="shop-sub">Stock a counter. Place and Theme still flavor the goods. Forge is one item; this is the board.</p>'+
      '<div class="grid shop-layouts">'+
        '<button type="button" class="btn shop-layout active" data-layout="stall">Stall</button>'+
        '<button type="button" class="btn shop-layout" data-layout="full">Full shop</button>'+
      "</div>"+
      '<div class="shop-row-ctrls">'+
        '<div class="shop-step"><span class="shop-k">Level</span>'+
          '<div class="shop-stepper" id="shop-level-step">'+
            '<button type="button" class="shop-pm" data-dir="-">−</button>'+
            '<span class="shop-val" id="shop-level">3</span>'+
            '<button type="button" class="shop-pm" data-dir="+">+</button>'+
          "</div></div>"+
        '<div class="shop-step"><span class="shop-k">Listings</span>'+
          '<div class="shop-stepper" id="shop-count-step">'+
            '<button type="button" class="shop-pm" data-dir="-">−</button>'+
            '<span class="shop-val" id="shop-count">6</span>'+
            '<button type="button" class="shop-pm" data-dir="+">+</button>'+
          "</div></div>"+
      "</div>"+
      '<div class="grid shop-wealths">'+
        '<button type="button" class="btn shop-wealth" data-wealth="Poor">Poor</button>'+
        '<button type="button" class="btn shop-wealth active" data-wealth="Fair">Fair</button>'+
        '<button type="button" class="btn shop-wealth" data-wealth="Rich">Rich</button>'+
      "</div>"+
      '<button type="button" class="shop-open" id="shop-open">Open shop</button>'+
      '<div class="shop-board" id="shop-board" hidden></div>';

    const left=document.getElementById("desk-left");
    const crate=document.getElementById("crate-panel");
    if(left) left.appendChild(panel);
    else if(crate && crate.parentNode) crate.parentNode.insertBefore(panel, crate.nextSibling);
    else{
      const theme=document.getElementById("theme-panel");
      if(theme && theme.parentNode) theme.parentNode.insertBefore(panel, theme.nextSibling);
      else document.body.appendChild(panel);
    }

    stepper("shop-level-step",1,20,3);
    stepper("shop-count-step",4,8,6);

    panel.querySelectorAll(".shop-layout").forEach(function(b){
      b.onclick=function(){
        panel.querySelectorAll(".shop-layout").forEach(function(x){x.classList.toggle("active",x===b);});
        const lay=b.getAttribute("data-layout");
        const count=document.getElementById("shop-count");
        if(count && !board.length) count.textContent=lay==="full"?"8":"6";
        panel.querySelector(".sec").textContent=lay==="full"?"Shop · full":"Shop · stall";
        renderBoard();
      };
    });
    panel.querySelectorAll(".shop-wealth").forEach(function(b){
      b.onclick=function(){
        panel.querySelectorAll(".shop-wealth").forEach(function(x){x.classList.toggle("active",x===b);});
      };
    });
    document.getElementById("shop-open").onclick=openShop;
    document.getElementById("shop-board").addEventListener("click", function(e){
      const rer=e.target.closest(".shop-reroll");
      if(rer){
        e.preventDefault();
        reroll(+rer.getAttribute("data-i"));
        return;
      }
      const row=e.target.closest(".shop-row");
      if(row) showRow(+row.getAttribute("data-i"));
    });
  }

  function css(){
    if(document.getElementById("tlt-shop-css")) return;
    const st=document.createElement("style");
    st.id="tlt-shop-css";
    st.textContent=
      ".job-tabs{display:inline-flex;margin:10px 8px 0 0;border:1px solid var(--border);border-radius:999px;overflow:hidden;background:rgba(0,0,0,.22)}"+
      ".job-tab{appearance:none;border:none;background:transparent;color:var(--muted);font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:8px 16px;min-height:36px;cursor:pointer}"+
      ".job-tab.active{background:linear-gradient(180deg,#1a3330,#152826);color:#fff}"+
      "body.job-shop #rarity-panel,body.job-shop #type-panel,body.job-shop #create,body.job-shop #hint,body.job-shop #crate-panel{display:none !important}"+
      "body.job-forge #shop-panel{display:none !important}"+
      ".shop-sub{margin:0 0 10px;font-size:.78rem;color:var(--muted)}"+
      ".shop-layouts,.shop-wealths{margin-bottom:10px}"+
      ".shop-layout.active,.shop-wealth.active{border-color:var(--teal);color:#fff;background:linear-gradient(180deg,#1a3330,#152826)}"+
      ".shop-row-ctrls{display:flex;gap:10px;margin-bottom:10px}"+
      ".shop-step{flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:8px 10px}"+
      ".shop-k{display:block;font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--copper);margin-bottom:6px}"+
      ".shop-stepper{display:flex;align-items:center;justify-content:space-between;gap:6px}"+
      ".shop-pm{appearance:none;border:1px solid rgba(107,124,147,.4);background:var(--card);color:var(--ink);width:40px;height:40px;border-radius:8px;font-size:1.2rem;font-weight:700}"+
      ".shop-val{font-size:1.15rem;font-weight:800;min-width:28px;text-align:center}"+
      ".shop-open{width:100%;appearance:none;border:2px solid rgba(61,205,184,.5);background:linear-gradient(180deg,#1a3330,#152826);color:#b8f0e4;border-radius:12px;min-height:52px;font-size:.95rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase}"+
      ".shop-open:active{transform:scale(.98)}"+
      ".shop-board{margin-top:12px;background:rgba(0,0,0,.22);border:1px solid rgba(61,205,184,.25);border-radius:10px;padding:8px}"+
      ".shop-dept{margin:8px 6px 6px;font-size:.65rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--copper)}"+
      ".shop-row{display:flex;align-items:center;gap:8px;padding:8px 6px;border-bottom:1px solid rgba(212,165,116,.12);cursor:pointer}"+
      ".shop-row:last-child{border-bottom:none}"+
      ".shop-gp{flex:0 0 72px;font-size:.82rem;font-weight:800;color:#e0b15a}"+
      ".shop-copy{flex:1;min-width:0}"+
      ".shop-name{display:block;font-size:.9rem;color:var(--ink)}"+
      ".shop-meta{display:block;font-size:.72rem;color:var(--muted)}"+
      ".shop-reroll{appearance:none;border:1px solid rgba(107,124,147,.4);background:var(--bg2);color:var(--muted);border-radius:8px;padding:8px 10px;font-size:.7rem;font-weight:700;min-height:36px}"+
      ".loot-card.crate-shop{border:3px solid #3dcdb8 !important;box-shadow:0 0 0 3px #161a20,0 0 0 6px rgba(61,205,184,.55),0 6px 20px rgba(0,0,0,.35) !important}"+
      ".chip-shop,.chip-price{color:#9de8dc;border-color:rgba(61,205,184,.55)}"+
      "body.mode-desk header .job-tabs{margin-top:0}"+
      "body.mode-desk.job-shop #desk-left #place-panel,body.mode-desk.job-shop #desk-left #theme-panel{display:block}";
    document.head.appendChild(st);
  }

  function start(){
    css();
    mountJobTabs();
    mountPanel();
    applyJob(currentJob());
    applyKnown();
    const mo=new MutationObserver(function(){ applyKnown(); });
    mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
