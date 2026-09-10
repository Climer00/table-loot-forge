/* Table Loot Forge — history checkboxes + letter 3x3 print */
(function(){
  var locked=false;
  function toast(msg){
    var t=document.getElementById("toast");
    if(!t) return;
    t.textContent=msg;
    t.classList.add("show");
    clearTimeout(toast._tid);
    toast._tid=setTimeout(function(){ t.classList.remove("show"); },1800);
  }
  function itemFromCard(card){
    if(!card) return null;
    var name=((card.querySelector(".item-name")||{}).textContent||"Item").trim();
    var category=((card.querySelector(".category-line")||{}).textContent||"").trim();
    var description=((card.querySelector(".look")||{}).textContent||"").trim();
    var loreEl=card.querySelector(".lore");
    var lore=loreEl?loreEl.textContent.replace(/^\s*Lore:\s*/i,"").trim():"";
    var properties=[].slice.call(card.querySelectorAll(".prop")).map(function(p){
      var tEl=p.querySelector(".prop-title");
      var title=((tEl&&tEl.textContent)||"").replace(/\.\s*$/,"");
      var text=p.textContent||"";
      if(title) text=text.replace(title,"").replace(/^\.\s*/,"");
      return {title:title.trim(), text:text.trim()};
    }).filter(function(p){ return p.title || p.text; });
    return {name:name, category:category, description:description, lore:lore, properties:properties};
  }
  function esc(s){
    return String(s||"").replace(/&/g,"\u0026amp;").replace(/</g,"\u0026lt;").replace(/>/g,"\u0026gt;").replace(/"/g,"\u0026quot;").replace(/'/g,"\u0026#39;");
  }
  function selectedCards(){
    return [].slice.call(document.querySelectorAll(".hist-card")).filter(function(card){
      var box=card.querySelector(".hist-check");
      return box && box.checked;
    });
  }
  function addBox(card){
    if(!card || card.querySelector(".hist-pick")) return;
    var lab=document.createElement("label");
    lab.className="hist-pick";
    lab.title="Select for 3x3 sheet";
    var box=document.createElement("input");
    box.type="checkbox";
    box.className="hist-check";
    box.setAttribute("aria-label","Select card");
    lab.appendChild(box);
    lab.addEventListener("click", function(e){ e.stopPropagation(); syncBar(); });
    lab.addEventListener("pointerdown", function(e){ e.stopPropagation(); });
    card.insertBefore(lab, card.firstChild);
  }
  function ensureCss(){
    if(document.getElementById("tlf-hprint-css")) return;
    var st=document.createElement("style");
    st.id="tlf-hprint-css";
    st.textContent=[
      ".hist-card{position:relative}",
      ".hist-pick{position:absolute;top:10px;right:10px;z-index:8;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:#12151a;border:1px solid #3dcdb8;border-radius:8px}",
      ".hist-pick input{width:16px;height:16px;margin:0;accent-color:#3dcdb8}",
      ".hist-card .card-top{padding-right:38px}",
      "#hist-sheet-wrap{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 10px}",
      "#hist-sheet-btn,#hist-sheet-all{appearance:none;border:1px solid rgba(61,205,184,.4);background:#1a1f27;color:#3dcdb8;border-radius:10px;padding:8px 12px;font-size:.75rem;font-weight:700;min-height:40px;cursor:pointer}",
      "#hist-sheet-all{border-color:rgba(107,124,147,.4);color:#8b97a8}",
      "#hist-sheet-count{font-size:.72rem;color:#8b97a8}"
    ].join("");
    document.head.appendChild(st);
  }
  function ensureBar(){
    var panel=document.getElementById("history-panel");
    if(!panel || document.getElementById("hist-sheet-btn")) return;
    var wrap=document.createElement("div");
    wrap.id="hist-sheet-wrap";
    var count=document.createElement("span");
    count.id="hist-sheet-count";
    count.textContent="0 selected";
    var all=document.createElement("button");
    all.type="button";
    all.id="hist-sheet-all";
    all.textContent="Select all";
    var btn=document.createElement("button");
    btn.type="button";
    btn.id="hist-sheet-btn";
    btn.textContent="Print 3\u00d73 PDF";
    wrap.appendChild(count);
    wrap.appendChild(all);
    wrap.appendChild(btn);
    var hint=document.getElementById("hist-hint");
    if(hint && hint.parentNode===panel) panel.insertBefore(wrap, hint.nextSibling);
    else panel.insertBefore(wrap, document.getElementById("history"));
    all.addEventListener("click", function(e){
      e.preventDefault();
      var boxes=[].slice.call(document.querySelectorAll(".hist-check"));
      var allOn=boxes.length && boxes.every(function(b){ return b.checked; });
      boxes.forEach(function(b){ b.checked=!allOn; });
      syncBar();
    });
    btn.addEventListener("click", function(e){
      e.preventDefault();
      printSelected();
    });
  }
  function syncBar(){
    var n=selectedCards().length;
    var count=document.getElementById("hist-sheet-count");
    var all=document.getElementById("hist-sheet-all");
    if(count) count.textContent=n+" selected";
    if(all){
      var boxes=document.querySelectorAll(".hist-check");
      var allOn=boxes.length && [].every.call(boxes, function(b){ return b.checked; });
      all.textContent=allOn?"Clear picks":"Select all";
    }
  }
  function miniCard(item){
    var props=(item.properties||[]).map(function(p){
      return "<p class='p'><b>"+esc(p.title)+(p.title?".":"")+"</b> "+esc(p.text)+"</p>";
    }).join("");
    return "<article class='mini'><h2>"+esc(item.name)+"</h2>"+
      (item.category?"<p class='cat'>"+esc(item.category)+"</p>":"")+
      (item.description?"<p class='look'>"+esc(item.description)+"</p>":"")+
      (props?"<div class='props'>"+props+"</div>":"")+
      (item.lore?"<p class='lore'>"+esc(item.lore)+"</p>":"")+
      "<p class='foot'>Table Loot Forge \u00b7 Homebrew</p></article>";
  }
  function buildHtml(items){
    var pages=[];
    for(var i=0;i<items.length;i+=9){
      var slice=items.slice(i,i+9);
      var slots="";
      for(var s=0;s<9;s++) slots += slice[s] ? "<div class='slot'>"+miniCard(slice[s])+"</div>" : "<div class='slot empty'></div>";
      pages.push("<section class='page'>"+slots+"</section>");
    }
    return "<!doctype html><html><head><meta charset='utf-8'><title>Loot sheet</title><style>"+
      "@page{size:letter;margin:0.4in}"+ "html,body{margin:0;padding:0;background:#fff;color:#111;font-family:Segoe UI,system-ui,sans-serif}"+ ".page{width:7.7in;height:10.2in;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:0.14in;page-break-after:always;box-sizing:border-box}"+ ".page:last-child{page-break-after:auto}"+ ".slot{border:1px solid #222;border-radius:6px;overflow:hidden;padding:0.08in 0.1in;box-sizing:border-box;background:#fff}"+ ".slot.empty{border-style:dashed;border-color:#ccc;background:#fafafa}"+ ".mini{height:100%;overflow:hidden}"+ ".mini h2{font-size:11pt;line-height:1.15;margin:0 0 2pt}"+ ".mini .cat{font-size:8pt;font-style:italic;color:#444;margin:0 0 4pt}"+ ".mini .look{font-size:8pt;line-height:1.25;margin:0 0 4pt}"+ ".mini .props .p{font-size:8pt;line-height:1.25;margin:0 0 3pt}"+ ".mini .lore{font-size:7.5pt;font-style:italic;color:#444;margin:6pt 0 0}"+ ".mini .foot{font-size:7pt;color:#666;margin:6pt 0 0}"+ "</style></head><body>"+pages.join("")+"</body></html>";
  }
  function printSelected(){
    var cards=selectedCards();
    if(!cards.length){ toast("Check cards in History first"); return; }
    var items=cards.map(itemFromCard).filter(Boolean);
    if(!items.length){ toast("Those cards have no text yet"); return; }
    var html=buildHtml(items);
    var frame=document.getElementById("tlf-sheet-frame");
    if(frame) frame.remove();
    frame=document.createElement("iframe");
    frame.id="tlf-sheet-frame";
    frame.setAttribute("aria-hidden","true");
    frame.style.cssText="position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0";
    document.body.appendChild(frame);
    frame.onload=function(){
      try{ frame.contentWindow.focus(); frame.contentWindow.print(); }
      catch(e){ toast("Could not open print dialog"); }
    };
    frame.srcdoc=html;
    toast(items.length+" card"+(items.length===1?"":"s")+" on letter 3\u00d73");
  }
  function scan(){
    if(locked) return;
    locked=true;
    try{
      ensureCss();
      ensureBar();
      document.querySelectorAll(".hist-card").forEach(addBox);
      syncBar();
    }finally{
      locked=false;
    }
  }
  var mo=new MutationObserver(function(){
    if(locked) return;
    mo.disconnect();
    scan();
    if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  });
  function start(){
    scan();
    if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
