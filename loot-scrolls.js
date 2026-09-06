/* Table Loot Forge — scroll picker */
(function(g){
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fill=(t,m)=>t.replace(/\{(\w+)\}/g,(_,k)=>m[k]!=null?m[k]:"{"+k+"}");
const DMG="fire cold lightning thunder acid poison necrotic radiant force psychic".split(" ");
function fillProps(props,m){return props.map(p=>({title:p.title,text:fill(p.text,m)}));}
function scrollItem(r,s){
  const SCR=g.TLF_SCROLL_POOLS||{};
  const pool=SCR[s.sp]||SCR.cantrip;
  if(!pool||!pool.length) throw new Error("TLF: missing scroll pools");
  const [n,props]=pick(pool);
  const atk=3+s.b+(r==="Legendary"?2:r==="Very Rare"?1:0);
  const m={dc:s.dc,atk,d:s.d,D:s.D,t:pick(DMG)};
  const filled=fillProps(props,m);
  filled.unshift({title:"Spellcasting",text:"Spell save DC "+s.dc+"; spell attack bonus +"+atk+"."});
  return{name:"Scroll of "+n,slot:"Scroll",attune:false,properties:filled,effectId:"Scroll:"+n};
}
g.TLF_scrollItem=scrollItem;
})(typeof window!=="undefined"?window:globalThis);
