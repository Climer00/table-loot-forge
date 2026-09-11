/* Wire bias names onto cards after Place overlay runs */
(function(){
  var prev=window.TLF_applyPlace;
  window.TLF_applyPlace=function(item){
    if(typeof prev==="function") item=prev(item)||item;
    if(typeof window.TLF_biasName==="function") window.TLF_biasName(item);
    return item;
  };
  function syncNames(){
    var list;
    try{ list=JSON.parse(localStorage.getItem("tlf-history-v1")||"[]"); }catch(e){ return; }
    if(!list.length) return;
    var result=document.querySelector("#result .item-name");
    if(result && list[0] && list[0].name) result.textContent=list[0].name;
    var hist=document.querySelectorAll("#history .hist-card .item-name");
    for(var i=0;i<hist.length && i<list.length;i++){
      if(list[i] && list[i].name) hist[i].textContent=list[i].name;
    }
  }
  function hook(){
    var btn=document.getElementById("create");
    if(!btn || btn.dataset.biasHook) return;
    btn.dataset.biasHook="1";
    var p=btn.onclick;
    btn.onclick=function(){
      if(typeof p==="function") p.apply(this, arguments);
      setTimeout(syncNames, 20);
    };
  }
  if(document.body) hook();
  else document.addEventListener("DOMContentLoaded", hook);
  setTimeout(hook, 0);
})();
