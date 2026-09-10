/* Remove attunement from cards (new and old history) */
(function(){
  function clean(card){
    if(!card) return;
    card.querySelectorAll(".chip.attune").forEach(function(el){ el.remove(); });
    const cat=card.querySelector(".category-line");
    if(cat) cat.textContent=String(cat.textContent||"").replace(/\s*\(requires attunement\)/i,"").trim();
  }
  function scan(){ document.querySelectorAll(".loot-card").forEach(clean); }
  const mo=new MutationObserver(scan);
  if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener("DOMContentLoaded",function(){ mo.observe(document.body,{childList:true,subtree:true}); scan(); });
  scan();
})();
