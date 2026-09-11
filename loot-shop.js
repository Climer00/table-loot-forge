/* Table Loot Forge — Shop panel mount only. Stocking is loot-shop-quiet.js. */
(function(){
  const JOB_KEY="tlf-job";
  function currentJob(){
    try{ const s=localStorage.getItem(JOB_KEY); if(s==="shop"||s==="forge") return s; }catch(e){}
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
  function stepper(id, lo, hi, start){
    const wrap=document.getElementById(id); if(!wrap) return;
    const val=wrap.querySelector(".shop-val");
    val.textContent=String(start);
    wrap.querySelector("[data-dir='-']").onclick=function(){
      val.textContent=String(Math.max(lo, (+val.textContent||start)-1));
    };
    wrap.querySelector("[data-dir='+']").onclick=function(){
      val.textContent=String(Math.min(hi, (+val.textContent||start)+1));
    };
  }
  function mountJobTabs(){
    if(document.querySelector(".job-tabs")) return;
    const bar=document.createElement("div");
    bar.className="job-tabs"; bar.setAttribute("role","tablist");
    bar.innerHTML='<button type="button" class="job-tab" data-job="forge">Forge</button><button type="button" class="job-tab" data-job="shop">Shop</button>';
    const header=document.querySelector("header");
    const modes=document.querySelector(".mode-tabs");
    if(header && modes) header.insertBefore(bar, modes);
    else if(header) header.appendChild(bar);
    else document.body.insertBefore(bar, document.body.firstChild);
    bar.addEventListener("click", function(e){
      const b=e.target.closest(".job-tab"); if(!b) return;
      applyJob(b.getAttribute("data-job"));
    });
  }
  function mountPanel(){
    if(document.getElementById("shop-panel")) return;
    const panel=document.createElement("section");
    panel.className="panel shop-panel"; panel.id="shop-panel";
    panel.innerHTML=
      '<label class="sec">Shop · stall</label>'+
      '<p class="shop-sub">Stock a counter. Place and Theme still flavor the goods. Forge is one item; this is the board.</p>'+
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
        if(count) count.textContent=lay==="full"?"8":"6";
        panel.querySelector(".sec").textContent=lay==="full"?"Shop · full":"Shop · stall";
      };
    });
    panel.querySelectorAll(".shop-wealth").forEach(function(b){
      b.onclick=function(){
        panel.querySelectorAll(".shop-wealth").forEach(function(x){x.classList.toggle("active",x===b);});
      };
    });
  }
  function css(){
    if(document.getElementById("tlt-shop-css")) return;
    const st=document.createElement("style"); st.id="tlt-shop-css";
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
      ".chip-shop,.chip-price{color:#9de8dc;border-color:rgba(61,205,184,.55)}";
    document.head.appendChild(st);
  }
  function start(){
    css(); mountJobTabs(); mountPanel(); applyJob(currentJob());
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
