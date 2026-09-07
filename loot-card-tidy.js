/* Drop +0 / "no bonus" grant lines from cards */
(function(g){
  function drop(t){
    t=String(t||"");
    t=t.replace(/an?\s+\+0\s+bonus/gi,"no bonus").replace(/\+0\s+bonus/gi,"no bonus");
    if(!/no bonus/i.test(t)) return t.trim();
    t=t.replace(/\bwhile (?:wearing|holding|wielding) (?:it|them|this \w+) you gain no bonus to [^.]+\.\s*/gi,"");
    t=t.replace(/\byou gain no bonus to [^.]+\.\s*/gi,"");
    t=t.replace(/\bgain no bonus to [^.]+\.\s*/gi,"");
    return t.split(/(?<=[.!?])\s+/).filter(function(s){
      s=s.trim();
      if(!s) return false;
      if(/no bonus/i.test(s) && /gain/i.test(s)) return false;
      return true;
    }).join(" ").replace(/\s+/g," ").trim();
  }
  function scrub(out){
    if(!out||!out.properties) return out;
    out.properties=out.properties.map(function(p){
      return {title:p.title,text:drop(p.text)};
    }).filter(function(p){return String(p.text||"").length;});
    if(!out.properties.length){
      out.properties=[{title:"Minor Charm",text:"While you wear or hold this item, you have advantage on one check type chosen when you first claim it (DM locks it)."}];
    }
    return out;
  }
  var orig=g.TLF_gearFx;
  if(typeof orig==="function"){
    g.TLF_gearFx=function(type,r,s){return scrub(orig(type,r,s));};
  }
})(typeof window!=="undefined"?window:globalThis);
