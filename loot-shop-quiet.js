/* Keep shop stocking and reroll off the history/observer hot path */
(function(){
  function refreshLater(){
    window.TLF_quiet=false;
    if(typeof window.TLF_renderHistory==="function"){
      try{ window.TLF_renderHistory(); }catch(e){ console.error(e); }
    }
  }

  function wrapOpen(){
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
        if(!busy || n>100){ refreshLater(); return; }
        setTimeout(tick, 80);
      })();
    };
    return true;
  }

  function wrapBoard(){
    var board=document.getElementById("shop-board");
    if(!board || board.dataset.qwrap) return !!board;
    board.dataset.qwrap="1";
    board.addEventListener("click", function(e){
      if(!e.target.closest(".shop-reroll")) return;
      window.TLF_quiet=true;
      setTimeout(function(){
        /* Reroll only needs the board + the result card. Rebuilding all of
           history here is what locked the tab. */
        window.TLF_quiet=false;
      }, 40);
    }, true);
    return true;
  }

  function boot(){
    wrapOpen();
    wrapBoard();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 0);
  setTimeout(boot, 250);
})();
