/* Restore full item text on history cards so share works */
(function(){
  function list(){
    try{
      const a=JSON.parse(localStorage.getItem("tlf-history-v1")||"[]");
      return Array.isArray(a)?a:[];
    }catch(e){ return []; }
  }
  function esc(s){
    return String(s||"").replace(/[&<>"']/g,function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
    });
  }
  function findItem(card){
    const id=card.getAttribute("data-id");
    const name=((card.querySelector(".item-name")||{}).textContent||"").trim();
    const rows=list();
    if(id){
      for(let i=0;i<rows.length;i++) if(rows[i]&&rows[i].id===id) return rows[i];
    }
    for(let i=0;i<rows.length;i++) if(rows[i]&&rows[i].name===name) return rows[i];
    return null;
  }
  function hydrate(card){
    if(!card || !card.classList.contains("hist-card") || card.dataset.hydrated) return;
    const item=findItem(card);
    if(!item) return;
    const props=item.properties||[];
    if(!props.length && !item.description) return;
    card.dataset.hydrated="1";
    const inner=card.querySelector(".loot-card-inner");
    if(!inner) return;
    if(item.description && !inner.querySelector(".look")){
      const look=document.createElement("p");
      look.className="look";
      look.textContent=item.description;
      const meta=inner.querySelector(".meta-row");
      const actions=inner.querySelector(".card-actions");
      if(meta&&meta.nextSibling) inner.insertBefore(look, meta.nextSibling);
      else if(actions) inner.insertBefore(look, actions);
      else inner.appendChild(look);
    }
    if(props.length && !inner.querySelector(".props-block")){
      const block=document.createElement("div");
      block.className="card-block props-block";
      props.forEach(function(p){
        const el=document.createElement("p");
        el.className="prop";
        el.innerHTML='<strong class="prop-title">'+esc(p.title)+'.</strong> '+esc(p.text);
        block.appendChild(el);
      });
      const titles=inner.querySelector(".prop-titles");
      const actions=inner.querySelector(".card-actions");
      if(titles && titles.parentNode) titles.parentNode.replaceWith(block);
      else if(actions) inner.insertBefore(block, actions);
      else inner.appendChild(block);
    }
    if(card.dataset.setReady){
      delete card.dataset.setReady;
    }
  }
  if(!document.getElementById("tlt-hist-css")){
    const st=document.createElement("style");
    st.id="tlt-hist-css";
    st.textContent=".hist-card .look{display:block;margin:0 0 10px}.hist-card .props-block{display:block}.hist-card .lore{display:none}";
    document.head.appendChild(st);
  }
  function scan(){ document.querySelectorAll(".hist-card").forEach(hydrate); }
  var scanTimer=null;
  function scheduleScan(){
    if(scanTimer) clearTimeout(scanTimer);
    scanTimer=setTimeout(function(){ scanTimer=null; scan(); }, 50);
  }
  function observeRoot(){
    return document.getElementById("history") || document.getElementById("history-panel") || document.body;
  }
  const mo=new MutationObserver(scheduleScan);
  function start(){
    scan();
    var root=observeRoot();
    if(root) mo.observe(root,{childList:true,subtree:true});
  }
  if(document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
