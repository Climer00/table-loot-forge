/* Keep shop stocking off the history/observer hot path */
(function(){
  function wrap(){
    var btn=document.getElementById("shop-open");
    if(!btn || btn.dataset.qwrap) return !!btn;
    var prev=btn.onclick;
    if(typeof prev!=="function") return false;
    btn.dataset.qwrap="1";
    btn.onclick=function(){
      window.TLF_quiet=true;
      try{ prev.apply(this, arguments); }catch(e){ window.TLF_quiet=false; throw e; }
      var n=0;
      (function tick(){
        n++;
        var busy=btn.dataset.busy==="1" || /stocking/i.test(btn.textContent||"");
        if(!busy || n>100){
          window.TLF_quiet=false;
          if(typeof window.TLF_renderHistory==="function") window.TLF_renderHistory();
          return;
        }
        setTimeout(tick, 80);
      })();
    };
    return true;
  }
  if(!wrap()){
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", wrap);
    setTimeout(wrap, 0);
    setTimeout(wrap, 250);
  }
})();
