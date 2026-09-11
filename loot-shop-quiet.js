/* Shop stocks in memory. Tap a row to show + pin it in History once. */
(function(){
  var GEAR="Weapon Armor Shield Helmet Cloak Necklace Ring Gloves Belt Boots".split(" ");
  var ARMS="Weapon Armor Shield".split(" ");
  var WORN="Helmet Cloak Necklace Ring Gloves Belt Boots".split(" ");
  var SIP="Potion Tincture Scroll".split(" ");
  var board=[];

  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function groupOf(type){
    if(ARMS.indexOf(type)>=0) return "Arms";
    if(WORN.indexOf(type)>=0) return "Worn";
    if(SIP.indexOf(type)>=0) return "Bottles";
    return "Oddments";
  }
  function bandFor(level){
    var n=Math.max(1,Math.min(20,+level||1));
    if(n<=4) return {main:"Common", splash:"Uncommon", up:"Rare"};
    if(n<=10) return {main:"Uncommon", splash:"Rare", up:"Very Rare"};
    if(n<=16) return {main:"Rare", splash:"Very Rare", up:"Legendary"};
    return {main:"Very Rare", splash:"Legendary", up:"Legendary"};
  }
  function rarityFor(level, wealth, slot){
    var band=bandFor(level), w=wealth||"Fair";
    if(w==="Poor") return Math.random()<0.12 && +level>=3 ? "Uncommon" : "Common";
    if(w==="Rich") return slot==="show" ? band.up : (Math.random()<0.28 ? band.splash : band.main);
    return slot==="show" ? band.splash : (Math.random()<0.22 ? band.splash : band.main);
  }
  function planTypes(n, layout){
    var used={};
    function take(pools){
      for(var p=0;p<pools.length;p++){
        var avail=pools[p].filter(function(t){return !used[t];});
        if(avail.length){ var t=pick(avail); used[t]=1; return t; }
      }
      var all=GEAR.concat(SIP).filter(function(t){return !used[t];});
      var x=pick(all.length?all:GEAR.concat(SIP)); used[x]=1; return x;
    }
    var types=[];
    if(layout==="full"){
      types.push(take([ARMS]), take([ARMS]), take([WORN]), take([WORN]), take([SIP]), take([SIP]), take([SIP,WORN]));
    }else{
      types.push(take([ARMS]), take([WORN,ARMS]), take([SIP]), take([SIP]), take([WORN,SIP]));
    }
    while(types.length<n) types.push(take([GEAR,SIP]));
    return types.slice(0,n);
  }
  function nice(n){
    if(n<20) return Math.max(1, Math.round(n));
    if(n<100) return Math.round(n/5)*5;
    if(n<500) return Math.round(n/10)*10;
    if(n<2000) return Math.round(n/25)*25;
    return Math.round(n/50)*50;
  }
  function priceOf(rarity, type, wealth){
    var sip=/potion|tincture|scroll/i.test(type), tin=/tincture/i.test(type);
    var ranges={
      Common:{Poor:[18,40], Fair:[35,90], Rich:[60,140]},
      Uncommon:{Poor:[70,140], Fair:[160,420], Rich:[280,700]},
      Rare:{Poor:[350,700], Fair:[750,1800], Rich:[1300,3200]},
      "Very Rare":{Poor:[1600,3200], Fair:[3000,7500], Rich:[5500,13000]},
      Legendary:{Poor:[7000,14000], Fair:[11000,24000], Rich:[18000,38000]}
    };
    var row=ranges[rarity]||ranges.Common;
    var pair=row[wealth]||row.Fair;
    var n=pair[0]+Math.random()*(pair[1]-pair[0]);
    if(tin) n*=0.45; else if(sip) n*=0.38;
    return nice(n);
  }
  function layout(){ var el=document.querySelector(".shop-layout.active"); return el?el.getAttribute("data-layout"):"stall"; }
  function wealth(){ var el=document.querySelector(".shop-wealth.active"); return el?el.getAttribute("data-wealth"):"Fair"; }
  function listingsN(){ return Math.max(4, Math.min(8, +(document.getElementById("shop-count")||{}).textContent||6)); }
  function levelN(){ return Math.max(1, Math.min(20, +(document.getElementById("shop-level")||{}).textContent||3)); }

  function flavor(item){
    if(!item) return item;
    try{ if(typeof window.TLF_applyPlace==="function") item=window.TLF_applyPlace(item)||item; }catch(e){}
    return item;
  }
  function makeItem(rarity, type){
    if(typeof window.TLF_generate!=="function") return null;
    return flavor(window.TLF_generate(rarity, type));
  }
  function fillSlot(i, rarity, type){
    var item=makeItem(rarity, type);
    if(!item){
      board[i]={rarity:rarity,type:type,name:type,cat:type,gp:priceOf(rarity,type,wealth()),item:null};
      return false;
    }
    board[i]={rarity:item.rarity||rarity,type:type,name:item.name,cat:item.category||type,gp:priceOf(item.rarity||rarity,type,wealth()),item:item};
    return true;
  }
  function renderBoard(){
    var el=document.getElementById("shop-board");
    if(!el) return;
    if(!board.length){ el.hidden=true; el.innerHTML=""; return; }
    var parts=[], lay=layout();
    function rowHtml(it,i){
      return '<div class="shop-row" data-i="'+i+'">'+ 
        '<span class="shop-gp">'+it.gp+' gp</span>'+
        '<div class="shop-copy"><strong class="shop-name">'+(it.name||it.type)+'</strong>'+
        '<span class="shop-meta">'+(it.rarity||"")+' · '+(it.cat||it.type)+'</span></div>'+
        '<button type="button" class="shop-reroll" data-i="'+i+'">Reroll</button></div>';
    }
    if(lay==="full"){
      ["Arms","Worn","Bottles","Oddments"].forEach(function(g){
        var rows=board.map(function(it,i){return {it:it,i:i};}).filter(function(x){return x.it && groupOf(x.it.type)===g;});
        if(!rows.length) return;
        parts.push('<p class="shop-dept">'+g+'</p>');
        rows.forEach(function(x){ parts.push(rowHtml(x.it,x.i)); });
      });
    }else{
      parts.push('<p class="shop-dept">Stall</p>');
      board.forEach(function(it,i){ parts.push(rowHtml(it,i)); });
    }
    el.innerHTML=parts.join("");
    el.hidden=false;
  }
  function showItem(item){
    if(item && typeof window.TLF_showItem==="function"){
      try{ window.TLF_showItem(item,{flash:true}); }catch(e){}
    }
  }
  function pinListing(hit){
    if(!hit || !hit.item) return;
    showItem(hit.item);
    var copy={};
    try{ copy=JSON.parse(JSON.stringify(hit.item)); }catch(e){ copy=hit.item; }
    copy.gp=hit.gp;
    copy.fromShop=true;
    var added=false;
    if(typeof window.TLF_keepItem==="function"){
      added=window.TLF_keepItem(copy);
    }
    toast(added?"Saved to history":"Already in history");
  }
  function toast(msg){
    var t=document.getElementById("toast");
    if(!t) return;
    t.textContent=msg; t.classList.add("show");
    clearTimeout(toast._tid);
    toast._tid=setTimeout(function(){ t.classList.remove("show"); },1800);
  }

  function openShop(){
    var btn=document.getElementById("shop-open");
    if(btn && btn.dataset.busy==="1") return;
    var n=listingsN(), lv=levelN(), w=wealth(), lay=layout();
    var types=planTypes(n, lay);
    board=[];
    if(btn){ btn.dataset.busy="1"; btn.textContent="Stocking…"; }
    window.TLF_quiet=true;
    var i=0, ok=0;
    function done(){
      if(btn){ btn.dataset.busy=""; btn.textContent="Open shop"; }
      renderBoard();
      toast((lay==="full"?"Shop":"Stall")+" opened · "+ok+" listings");
      try{
        if(board[0] && board[0].item) showItem(board[0].item);
      }finally{
        window.TLF_quiet=false;
      }
    }
    function step(){
      if(i>=types.length){ done(); return; }
      var type=types[i];
      var rare=rarityFor(lv, w, i===types.length-1?"show":"stock");
      try{ if(fillSlot(i, rare, type)) ok++; }catch(e){ board[i]={rarity:rare,type:type,name:type,cat:type,gp:priceOf(rare,type,w),item:null}; }
      i++;
      setTimeout(step, 0);
    }
    step();
  }
  function reroll(i){
    var it=board[i];
    if(!it) return;
    window.TLF_quiet=true;
    try{
      if(fillSlot(i, rarityFor(levelN(), wealth(), "stock"), it.type)){
        renderBoard();
        if(board[i] && board[i].item) showItem(board[i].item);
        toast("Rerolled listing · previous keep stays in history");
      }
    }finally{ window.TLF_quiet=false; }
  }


  function ensurePanel(){
    if(document.getElementById("shop-panel")) return true;
    var panel=document.createElement("section");
    panel.className="panel shop-panel";
    panel.id="shop-panel";
    panel.innerHTML=
      '<label class="sec">Shop · stall</label>'+
      '<div class="grid shop-layouts">'+
        '<button type="button" class="btn shop-layout active" data-layout="stall">Stall</button>'+
        '<button type="button" class="btn shop-layout" data-layout="full">Full shop</button></div>'+
      '<div class="shop-row-ctrls">'+
        '<div class="shop-step"><span class="shop-k">Level</span>'+
          '<div class="shop-stepper" id="shop-level-step">'+
            '<button type="button" class="shop-pm" data-dir="-">−</button>'+
            '<span class="shop-val" id="shop-level">3</span>'+
            '<button type="button" class="shop-pm" data-dir="+">+</button></div></div>'+
        '<div class="shop-step"><span class="shop-k">Listings</span>'+
          '<div class="shop-stepper" id="shop-count-step">'+
            '<button type="button" class="shop-pm" data-dir="-">−</button>'+
            '<span class="shop-val" id="shop-count">6</span>'+
            '<button type="button" class="shop-pm" data-dir="+">+</button></div></div></div>'+
      '<div class="grid shop-wealths">'+
        '<button type="button" class="btn shop-wealth" data-wealth="Poor">Poor</button>'+
        '<button type="button" class="btn shop-wealth active" data-wealth="Fair">Fair</button>'+
        '<button type="button" class="btn shop-wealth" data-wealth="Rich">Rich</button></div>'+
      '<button type="button" class="shop-open" id="shop-open">Open shop</button>'+
      '<div class="shop-board" id="shop-board" hidden></div>';
    var left=document.getElementById("desk-left");
    var crate=document.getElementById("crate-panel");
    if(left) left.appendChild(panel);
    else if(crate && crate.parentNode) crate.parentNode.insertBefore(panel, crate.nextSibling);
    else document.body.appendChild(panel);
    function step(id, lo, hi, start){
      var wrap=document.getElementById(id); if(!wrap) return;
      var val=wrap.querySelector(".shop-val");
      wrap.querySelector("[data-dir='-']").onclick=function(){ val.textContent=String(Math.max(lo,(+val.textContent||start)-1)); };
      wrap.querySelector("[data-dir='+']").onclick=function(){ val.textContent=String(Math.min(hi,(+val.textContent||start)+1)); };
    }
    step("shop-level-step",1,20,3);
    step("shop-count-step",4,8,6);
    panel.querySelectorAll(".shop-layout").forEach(function(b){
      b.onclick=function(){
        panel.querySelectorAll(".shop-layout").forEach(function(x){x.classList.toggle("active",x===b);});
        var lay=b.getAttribute("data-layout");
        var count=document.getElementById("shop-count");
        if(count && !board.length) count.textContent=lay==="full"?"8":"6";
      };
    });
    panel.querySelectorAll(".shop-wealth").forEach(function(b){
      b.onclick=function(){ panel.querySelectorAll(".shop-wealth").forEach(function(x){x.classList.toggle("active",x===b);}); };
    });
    if(!document.getElementById("tlt-shop-css")){
      var st=document.createElement("style"); st.id="tlt-shop-css";
      st.textContent=".shop-open{width:100%;min-height:52px;border-radius:12px;font-weight:800;border:2px solid rgba(61,205,184,.5);background:linear-gradient(180deg,#1a3330,#152826);color:#b8f0e4}"+
        ".shop-board{margin-top:12px;background:rgba(0,0,0,.22);border:1px solid rgba(61,205,184,.25);border-radius:10px;padding:8px}"+
        ".shop-row{display:flex;align-items:center;gap:8px;padding:8px 6px;cursor:pointer}"+
        ".shop-gp{flex:0 0 72px;font-weight:800;color:#e0b15a}.shop-copy{flex:1;min-width:0}"+
        ".shop-reroll{border:1px solid rgba(107,124,147,.4);background:var(--bg2);border-radius:8px;padding:8px 10px;min-height:36px}"+
        ".shop-layout.active,.shop-wealth.active{border-color:var(--teal);color:#fff;background:linear-gradient(180deg,#1a3330,#152826)}"+
        ".shop-row-ctrls{display:flex;gap:10px;margin-bottom:10px}.shop-step{flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:8px 10px}"+
        ".shop-stepper{display:flex;align-items:center;justify-content:space-between}.shop-pm{width:40px;height:40px;border-radius:8px}"+
        "body.job-shop #rarity-panel,body.job-shop #type-panel,body.job-shop #create,body.job-shop #hint,body.job-shop #crate-panel{display:none !important}"+
        "body.job-forge #shop-panel{display:none !important}";
      document.head.appendChild(st);
    }
    if(!document.querySelector(".job-tabs")){
      var bar=document.createElement("div"); bar.className="job-tabs"; bar.setAttribute("role","tablist");
      bar.innerHTML='<button type="button" class="job-tab" data-job="forge">Forge</button><button type="button" class="job-tab active" data-job="shop">Shop</button>';
      var header=document.querySelector("header");
      if(header) header.appendChild(bar);
      bar.addEventListener("click", function(e){
        var b=e.target.closest(".job-tab"); if(!b) return;
        var j=b.getAttribute("data-job");
        document.body.classList.toggle("job-shop", j==="shop");
        document.body.classList.toggle("job-forge", j==="forge");
        bar.querySelectorAll(".job-tab").forEach(function(x){ x.classList.toggle("active", x===b); });
      });
      document.body.classList.add("job-shop");
      document.body.classList.remove("job-forge");
    }
    return true;
  }

  function takeOver(){
    var btn=document.getElementById("shop-open");
    var panel=document.getElementById("shop-board");
    ensurePanel();
    btn=document.getElementById("shop-open");
    panel=document.getElementById("shop-board");
    if(!btn || !panel) return false;
    if(btn.dataset.direct==="1") return true;
    btn.dataset.direct="1";
    btn.onclick=function(e){ if(e) e.stopImmediatePropagation(); openShop(); };
    panel.addEventListener("click", function(e){
      var rer=e.target.closest(".shop-reroll");
      if(rer){ e.preventDefault(); e.stopPropagation(); reroll(+rer.getAttribute("data-i")); return; }
      var row=e.target.closest(".shop-row");
      if(row && board[+row.getAttribute("data-i")]){
        e.stopPropagation();
        var hit=board[+row.getAttribute("data-i")];
        if(hit && hit.item) pinListing(hit);
      }
    }, true);
    return true;
  }
  function boot(){ if(!takeOver()) setTimeout(boot, 50); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 0);
  setTimeout(boot, 300);
})();
