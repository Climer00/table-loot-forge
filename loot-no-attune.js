/* Remove attunement from cards without retriggering a mutation loop */
(function(){
  function clean(card){
    if(!card || card.dataset.attuneClean==="1") return;
    var dirty=false;
    card.querySelectorAll(".chip.attune").forEach(function(el){ el.remove(); dirty=true; });
    var cat=card.querySelector(".category-line");
    if(cat && /\(requires attunement\)/i.test(cat.textContent||"")){
      cat.textContent=String(cat.textContent).replace(/\s*\(requires attunement\)/i,"").trim();
      dirty=true;
    }
    card.dataset.attuneClean="1";
    return dirty;
  }
  var pending=false;
  function scan(){
    if(pending) return;
    pending=true;
    requestAnimationFrame(function(){
      pending=false;
      document.querySelectorAll(".loot-card").forEach(clean);
    });
  }
  var mo=new MutationObserver(function(recs){
    for(var i=0;i<recs.length;i++){
      var n=recs[i].target;
      if(n && n.closest && n.closest(".loot-card") && (n.closest(".loot-card").dataset.attuneClean==="1")) continue;
      scan();
      return;
    }
  });
  function start(){
    scan();
    if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
