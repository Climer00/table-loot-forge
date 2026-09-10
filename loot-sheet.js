/* Table Loot Forge — history checkboxes + 3x3 letter sheet */
(function(){
  function toast(msg){
    const t=document.getElementById("toast");
    if(!t) return;
    t.textContent=msg;
    t.classList.add("show");
    clearTimeout(toast._tid);
    toast._tid=setTimeout(function(){ t.classList.remove("show"); },1800);
  }

  function itemFromCard(card){
    if(!card) return null;
    const name=((card.querySelector(".item-name")||{}).textContent||"Item").trim();
    const category=((card.querySelector(".category-line")||{}).textContent||"").replace(/\s*\(requires attunement\)/i,"").trim();
    const description=((card.querySelector(".look")||{}).textContent||"").trim();
    const loreEl=card.querySelector(".lore");
    let lore="";
    if(loreEl) lore=loreEl.textContent.replace(/^\s*Lore:\s*/i,"").trim();
    const properties=[].slice.call(card.querySelectorAll(".prop")).map(function(p){
      const tEl=p.querySelector(".prop-title");
      const title=((tEl&&tEl.textContent)||"").replace(/\.\s*$/,"");
      let text=p.textContent||"";
      if(title) text=text.replace(title,"").replace(/^\.\s*/,"");
      return {title:title.trim(), text:text.trim()};
    }).filter(function(p){ return p.title || p.text; });
    if(!name) return null;
    return {name:name, category:category, description:description, lore:lore, properties:properties};
  }

  function esc(s){
    return String(s||"").replace(/[&<>"']/g,function(c){
      return ({"&":"&","<":"<",">":">",'"':""","'":"&#39;"})[c];
    });
  }

  function selectedCards(){
    return [].slice.call(document.querySelectorAll(".hist-card")).filter(function(card){
      const box=card.querySelector(".hist-check");
      return box && box.checked;
    });
  }

  function addBox(card){
    if(!card || !card.classList.contains("hist-card") || card.querySelector(".hist-pick")) return;
    const lab=document.createElement("label");
    lab.className="hist-pick";
    lab.title="Select for 3x3 sheet";
    lab.innerHTML='<input type="checkbox" class="hist-check" aria-label="Select card">';
    lab.addEventListener("click", function(e){ e.stopPropagation(); syncBar(); });
    lab.addEventListener("pointerdown", function(e){ e.stopPropagation(); });
    card.insertBefore(lab, card.firstChild);
  }

  function ensureCss(){
    if(document.getElementById("tlf-sheet-css")) return;
    const st=document.createElement("style");
    st.id="tlf-sheet-css";
    st.textContent=".hist-card{position:relative;padding-top:2px;}"+ ".hist-pick{position:absolute;top:8px;right:8px;z-index:4;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:rgba(18,21,26,.88);border:1px solid rgba(212,165,116,.35);border-radius:8px;}"+ ".hist-pick input{width:16px;height:16px;margin:0;accent-color:#3dcdb8;}"+ ".hist-card .card-top{padding-right:34px;}"+ "#hist-sheet-wrap{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}"+ "#hist-sheet-btn,#hist-sheet-all{appearance:none;border:1px solid rgba(61,205,184,.4);background:#1a1f27;color:#3dcdb8;border-radius:10px;padding:8px 12px;font-size:.75rem;font-weight:700;min-height:40px;cursor:pointer;}"+ "#hist-sheet-all{border-color:rgba(107,124,147,.4);color:#8b97a8;}"+ "#hist-sheet-count{font-size:.72rem;color:#8b97a8;}";
    document.head.appendChild(st);
  }

  function ensureBar(){
    const panel=document.getElementById("history-panel");
    if(!panel || document.getElementById("hist-sheet-btn")) return;
    const row=panel.querySelector(".sec-row")||panel;
    const wrap=document.createElement("div");
    wrap.id="hist-sheet-wrap";
    wrap.innerHTML='<span id="hist-sheet-count">0 selected</span>'+
      '<button type="button" id="hist-sheet-all">Select all</button>'+
      '<button type="button" id="hist-sheet-btn">Print 3\u00d73 PDF</button>';
    row.appendChild(wrap);
    document.getElementById("hist-sheet-all").onclick=function(e){
      e.preventDefault();
      const boxes=[].slice.call(document.querySelectorAll(".hist-check"));
      const allOn=boxes.length && boxes.every(function(b){ return b.checked; });
      boxes.forEach(function(b){ b.checked=!allOn; });
      this.textContent=allOn?"Select all":"Clear picks";
      syncBar();
    };
    document.getElementById("hist-sheet-btn").onclick=function(e){
      e.preventDefault();
      printSelected();
    };
  }

  function syncBar(){
    const n=selectedCards().length;
    const count=document.getElementById("hist-sheet-count");
    const all=document.getElementById("hist-sheet-all");
    if(count) count.textContent=n+" selected";
    if(all){
      const boxes=document.querySelectorAll(".hist-check");
      const allOn=boxes.length && [].every.call(boxes, function(b){ return b.checked; });
      all.textContent=allOn?"Clear picks":"Select all";
    }
  }

  function miniCard(item){
    const props=(item.properties||[]).map(function(p){
      return '<p class="p"><b>'+esc(p.title)+(p.title?".":"")+'</b> '+esc(p.text)+"</p>";
    }).join("");
    return '<article class="mini">'+ '<h2>'+esc(item.name)+'</h2>'+ (item.category?'<p class="cat">'+esc(item.category)+'</p>':'')+ (item.description?'<p class="look">'+esc(item.description)+'</p>':'')+ (props?'<div class="props">'+props+'</div>':'')+ (item.lore?'<p class="lore">'+esc(item.lore)+'</p>':'')+ '<p class="foot">Table Loot Forge \u00b7 Homebrew</p>'+ '</article>';
  }

  function buildHtml(items){
    const pages=[];
    for(let i=0;i<items.length;i+=9){
      const slice=items.slice(i,i+9);
      let slots="";
      for(let s=0;s<9;s++){
        slots += slice[s] ? '<div class="slot">'+miniCard(slice[s])+'</div>' : '<div class="slot empty"></div>';
      }
      pages.push('<section class="page">'+slots+'</section>');
    }
    return "<!doctype html><html><head><meta charset='utf-8'><title>Loot sheet</title><style>"+
      "@page{size:letter;margin:0.4in;}"+ "html,body{margin:0;padding:0;background:#fff;color:#111;font-family:'Segoe UI',system-ui,sans-serif;}"+ ".page{width:7.7in;height:10.2in;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:0.14in;page-break-after:always;box-sizing:border-box;}"+ ".page:last-child{page-break-after:auto;}"+ ".slot{border:1px solid #222;border-radius:6px;overflow:hidden;padding:0.08in 0.1in;box-sizing:border-box;background:#fff;}"+ ".slot.empty{border-style:dashed;border-color:#ccc;background:#fafafa;}"+ ".mini{height:100%;overflow:hidden;}"+ ".mini h2{font-size:11pt;line-height:1.15;margin:0 0 2pt;}"+ ".mini .cat{font-size:8pt;font-style:italic;color:#444;margin:0 0 4pt;}"+ ".mini .look{font-size:8pt;line-height:1.25;margin:0 0 4pt;}"+ ".mini .props .p{font-size:8pt;line-height:1.25;margin:0 0 3pt;}"+ ".mini .lore{font-size:7.5pt;font-style:italic;color:#444;margin:6pt 0 0;}"+ ".mini .foot{font-size:7pt;color:#666;margin:6pt 0 0;}"+ "@media screen{body{background:#333;padding:16px;} .page{background:#fff;margin:0 auto 16px;box-shadow:0 8px 24px rgba(0,0,0,.35);} }"+
      "</style></head><body>"+pages.join("")+"</body></html>";
  }

  function printSelected(){
    const cards=selectedCards();
    if(!cards.length){
      toast("Check cards in History first");
      return;
    }
    const items=cards.map(itemFromCard).filter(Boolean);
    if(!items.length){
      toast("Those cards have no text yet");
      return;
    }
    const html=buildHtml(items);
    let frame=document.getElementById("tlf-sheet-frame");
    if(frame) frame.remove();
    frame=document.createElement("iframe");
    frame.id="tlf-sheet-frame";
    frame.setAttribute("aria-hidden","true");
    frame.style.cssText="position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;";
    document.body.appendChild(frame);
    frame.onload=function(){
      try{
        frame.contentWindow.focus();
        frame.contentWindow.print();
      }catch(e){
        toast("Could not open print dialog");
      }
    };
    frame.srcdoc=html;
    toast(items.length+" card"+(items.length===1?"":"s")+" on letter 3\u00d73");
  }

  function scan(){
    ensureCss();
    ensureBar();
    document.querySelectorAll(".hist-card").forEach(addBox);
    syncBar();
  }

  const mo=new MutationObserver(scan);
  if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener("DOMContentLoaded", function(){ mo.observe(document.body,{childList:true,subtree:true}); scan(); });
  scan();
})();
