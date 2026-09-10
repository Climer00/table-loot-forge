/* Table / Desk layout switch */
(function(){
  const KEY="tlf-mode";

  function current(){
    try{
      const s=localStorage.getItem(KEY);
      if(s==="desk"||s==="table") return s;
    }catch(e){}
    return window.innerWidth>=960?"desk":"table";
  }

  function apply(mode){
    const m=mode==="desk"?"desk":"table";
    document.documentElement.setAttribute("data-mode", m);
    document.body.classList.toggle("mode-desk", m==="desk");
    document.body.classList.toggle("mode-table", m==="table");
    document.querySelectorAll(".mode-tab").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-mode")===m);
    });
    try{ localStorage.setItem(KEY, m); }catch(e){}
  }

  function mountTabs(){
    if(document.querySelector(".mode-tabs")) return;
    const bar=document.createElement("div");
    bar.className="mode-tabs";
    bar.setAttribute("role","tablist");
    bar.innerHTML=
      '<button type="button" class="mode-tab" data-mode="table">Table</button>'+
      '<button type="button" class="mode-tab" data-mode="desk">Desk</button>';
    const header=document.querySelector("header");
    if(header) header.appendChild(bar);
    else document.body.insertBefore(bar, document.body.firstChild);
    bar.addEventListener("click", function(e){
      const b=e.target.closest(".mode-tab");
      if(!b) return;
      apply(b.getAttribute("data-mode"));
    });
  }

  function ids(){
    const panels=[].slice.call(document.querySelectorAll("body > section.panel, #desk-left > section.panel"));
    panels.forEach(function(p){
      if(p.querySelector("#rarities") && !p.id) p.id="rarity-panel";
      if(p.querySelector("#types") && !p.id) p.id="type-panel";
    });
  }

  function wrapCols(){
    if(document.getElementById("desk-left")) return;
    const left=document.createElement("div");
    left.id="desk-left";
    const right=document.createElement("div");
    right.id="desk-right";
    const nodes=["rarity-panel","type-panel","create","hint","crate-panel"].map(function(id){return document.getElementById(id);});
    const header=document.querySelector("header");
    const anchor=header&&header.nextSibling;
    document.body.insertBefore(left, anchor||null);
    nodes.forEach(function(n){ if(n) left.appendChild(n); });
    const res=document.getElementById("result");
    const hist=document.getElementById("history-panel");
    if(res) document.body.insertBefore(right, res);
    if(res) right.appendChild(res);
    if(hist) right.appendChild(hist);
  }

  if(!document.getElementById("tlt-desk-css")){
    const st=document.createElement("style");
    st.id="tlt-desk-css";
    st.textContent=
      ".mode-tabs{display:inline-flex;margin-top:12px;border:1px solid var(--border);border-radius:999px;overflow:hidden;background:rgba(0,0,0,.22)}"+
      ".mode-tab{appearance:none;border:none;background:transparent;color:var(--muted);font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:8px 16px;min-height:36px;cursor:pointer}"+
      ".mode-tab.active{background:linear-gradient(180deg,#3a2818,#2a1e14);color:#fff}"+
      "#desk-left,#desk-right{display:contents}"+
      "body.mode-desk{max-width:1180px;padding:18px 22px 36px;display:grid;grid-template-columns:minmax(280px,340px) minmax(0,1fr);gap:14px 22px;align-items:start}"+
      "body.mode-desk header{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 24px;text-align:left;margin-bottom:0}"+
      "body.mode-desk header h1{font-size:1.7rem}"+
      "body.mode-desk header .mode-tabs{margin-top:0}"+
      "body.mode-desk #desk-left,body.mode-desk #desk-right{display:flex;flex-direction:column;gap:12px;min-width:0}"+
      "body.mode-desk #create{margin-top:0}"+
      "body.mode-desk #hint{margin:0}"+
      "body.mode-desk footer{grid-column:1 / -1;margin-top:8px}"+
      "body.mode-desk #history.hist-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}"+
      "body.mode-desk .hist-card{height:100%}"+
      "body.mode-desk .loot-card{margin-bottom:0}"+
      "body.mode-desk #result .loot-card{margin-bottom:0}"+
      "body.mode-desk .btn{min-height:42px}"+
      "@media (max-width:860px){body.mode-desk{display:block;max-width:440px;padding:calc(12px + var(--st)) 14px calc(24px + var(--sb))}body.mode-desk header{display:block;text-align:center}body.mode-desk #desk-left,body.mode-desk #desk-right{display:contents}body.mode-desk #history.hist-list{display:flex;flex-direction:column}}";
    document.head.appendChild(st);
  }

  function start(){
    ids();
    wrapCols();
    mountTabs();
    apply(current());
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
