/* Pause overlay observers during batch forge (shop / crate) */
(function(g){
  g.TLF_quiet = !!g.TLF_quiet;
  var Orig = window.MutationObserver;
  if(!Orig || Orig.__tlfWrapped) return;
  function Wrap(cb){
    var obs = new Orig(function(mut, o){
      if(g.TLF_quiet) return;
      try{ cb(mut, o); }catch(e){ console.error(e); }
    });
    return obs;
  }
  Wrap.prototype = Orig.prototype;
  Wrap.__tlfWrapped = true;
  window.MutationObserver = Wrap;
})(window);
