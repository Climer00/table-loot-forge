(function(){
const R=["Common","Uncommon","Rare","Very Rare","Legendary"];
const T=["Weapon","Armor","Shield","Helmet","Cloak","Necklace","Ring","Gloves","Belt","Boots","Scroll","Potion","Tincture"];
const RC={Common:"rarity-common",Uncommon:"rarity-uncommon",Rare:"rarity-rare","Very Rare":"rarity-veryrare",Legendary:"rarity-legendary"};
const RCLASS={Common:"r-common",Uncommon:"r-uncommon",Rare:"r-rare","Very Rare":"r-veryrare",Legendary:"r-legendary"};
const S={Common:{b:0,dc:11,d:"1d4",D:"1d6",u:"1/day",a:.05,sp:"cantrip"},Uncommon:{b:1,dc:13,d:"1d6",D:"2d6",u:"1/day",a:.35,sp:"1st–2nd"},Rare:{b:1,dc:15,d:"2d6",D:"3d6",u:"2/day",a:.75,sp:"3rd–4th"},"Very Rare":{b:2,dc:16,d:"3d6",D:"4d8",u:"3/day",a:.9,sp:"5th–6th"},Legendary:{b:3,dc:18,d:"4d6",D:"6d8",u:"at will",a:1,sp:"7th–9th"}};
const ADJ="Ashen Bright Cinder Crimson Dawn Dusk Ember Feral Frost Gilded Hollow Iron Jade Keen Lunar Mist Obsidian Quiet Riven Rune Scarlet Shadow Silver Storm Thorn Verdant Warden Wild Zephyr Blight Elder Glimmer Hearth Ivory Nettle Oaken Prism Quicksilver".split(" ");
const DMG="fire cold lightning thunder acid poison necrotic radiant force psychic".split(" ");
const SK="Stealth Athletics Acrobatics Perception Insight Survival Intimidation Persuasion Arcana".split(" ");
const SV="Strength Dexterity Constitution Intelligence Wisdom Charisma".split(" ");
const N={Weapon:"Blade Cleaver Fang Flail Glaive Hammer Lance Mace Pike Razor Saber Spear Sword Talon Brand Dirk Hatchet Maul Scythe Sting".split(" "),Armor:"Aegis Carapace Cuirass Harness Mail Plate Shell Vest Ward Jacket Coat Hauberk Scale".split(" "),Shield:"Bulwark Guard Aegis Barrier Buckler Rampart Ward Targe Plate Door".split(" "),Helmet:"Helm Crown Circlet Mask Visor Diadem Casque Browguard Cowl-helm Hood-cap".split(" "),Cloak:"Cloak Mantle Shawl Cape Wrap Drape Veil Tabard Shroud Poncho".split(" "),Necklace:"Amulet Pendant Torc Choker Locket Talisman Collar Medallion Charm Sigil".split(" "),Ring:"Band Ring Loop Seal Signet Hoop Coil Wheel Knot".split(" "),Gloves:"Gloves Gauntlets Grips Mitts Handwraps Claws Fists Palms".split(" "),Belt:"Belt Sash Girdle Cincture Cord Waistband Strap Cinch Baldric".split(" "),Boots:"Boots Greaves Treads Sandals Striders Steps Soles Pathfinders Spurs".split(" ")};
const SL={Weapon:"Weapon",Armor:"Armor",Shield:"Shield",Helmet:"Head",Cloak:"Shoulders",Necklace:"Neck",Ring:"Ring",Gloves:"Hands",Belt:"Waist",Boots:"Feet"};


const LOOK_GEAR=typeof TLF_LOOK_GEAR!=="undefined"?TLF_LOOK_GEAR:{};
const LOOK_SCROLL=typeof TLF_LOOK_SCROLL!=="undefined"?TLF_LOOK_SCROLL:[];
const LOOK_POTION=typeof TLF_LOOK_POTION!=="undefined"?TLF_LOOK_POTION:[];
const LOOK_TINCTURE=typeof TLF_LOOK_TINCTURE!=="undefined"?TLF_LOOK_TINCTURE:[];
const LORE_ORIGIN=typeof TLF_LORE_ORIGIN!=="undefined"?TLF_LORE_ORIGIN:{_any:[]};
const LORE_RUMOR=typeof TLF_LORE_RUMOR!=="undefined"?TLF_LORE_RUMOR:{_any:[]};
const LORE_QUIRK=typeof TLF_LORE_QUIRK!=="undefined"?TLF_LORE_QUIRK:{_any:[]};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const chance=p=>Math.random()<p;
const fill=(t,m)=>t.replace(/\{(\w+)\}/g,(_,k)=>m[k]!=null?m[k]:"{"+k+"}");
function nameOf(type){const a=pick(ADJ),n=pick(N[type]);return pick([a+" "+n,n+" of the "+a,"The "+a+" "+n,pick(ADJ)+" "+a+" "+n]);}
function attune(r,s){if(chance(s.a))return " Requires attunement.";if(["Rare","Very Rare","Legendary"].includes(r)&&chance(.4))return " Requires attunement.";return "";}
function composeLore(type,rarity){
  const o=pick([].concat(LORE_ORIGIN._any,LORE_ORIGIN[type]||[]));
  const ru=pick([].concat(LORE_RUMOR._any,LORE_RUMOR[rarity]||[]));
  const q=pick([].concat(LORE_QUIRK._any,LORE_QUIRK[type]||[]));
  const parts=chance(.55)?[o,ru,q]:chance(.5)?[o,q]:[o,ru];
  return parts.join(" ");
}
function lookOf(type){
  if(type==="Scroll")return pick(LOOK_SCROLL);
  if(type==="Potion")return pick(LOOK_POTION);
  if(type==="Tincture")return pick(LOOK_TINCTURE);
  return pick(LOOK_GEAR[type]||LOOK_GEAR.Weapon);
}

const gearFx=typeof TLF_gearFx!=="undefined"?TLF_gearFx:function(){return "Missing loot-mech.js";};
const scrollItem=typeof TLF_scrollItem!=="undefined"?TLF_scrollItem:function(){return {name:"Scroll",slot:"Scroll",attune:false,mechanics:""};};
const potionItem=typeof TLF_potionItem!=="undefined"?TLF_potionItem:function(){return {name:"Potion",slot:"Potion",attune:false,mechanics:""};};
const tinctureItem=typeof TLF_tinctureItem!=="undefined"?TLF_tinctureItem:function(){return {name:"Tincture",slot:"Tincture",attune:false,mechanics:""};};
function generate(rarity,type){const s=S[rarity];let item;if(type==="Scroll")item=scrollItem(rarity,s);else if(type==="Potion")item=potionItem(rarity,s);else if(type==="Tincture")item=tinctureItem(rarity,s);else{const at=attune(rarity,s);item={name:nameOf(type),slot:SL[type],attune:!!at.trim(),mechanics:gearFx(type,rarity,s)};}return{name:item.name,rarity,type,slot:item.slot,mechanics:item.mechanics,description:lookOf(type),lore:composeLore(type,rarity),attune:!!item.attune};}

const HISTORY_KEY="tlf-history-v1",HISTORY_MAX=30;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const canShare=typeof navigator!=="undefined"&&typeof navigator.share==="function";
const isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent||"");
function loadHistory(){try{const a=JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]");return Array.isArray(a)?a:[];}catch(e){return[];}}
function saveHistory(a){try{localStorage.setItem(HISTORY_KEY,JSON.stringify(a.slice(0,HISTORY_MAX)));}catch(e){}}
function pushHistory(item){const e=Object.assign({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7)},item);const n=[e].concat(loadHistory().filter(h=>!(h.name===item.name&&h.mechanics===item.mechanics))).slice(0,HISTORY_MAX);saveHistory(n);return n;}
function formatPlainText(item){return "⚔️ "+item.name+"\n"+item.rarity+" · "+item.type+"\nDescription: "+(item.description||"")+"\nMechanics: "+item.mechanics+"\nLore: "+item.lore+"\n(Homebrew)";}
function formatSmsBody(item){let b="⚔️ "+item.name+"\n"+item.rarity+" · "+item.type+"\n"+item.mechanics;return b.length>280?b.slice(0,277)+"…":b;}
function showToast(msg){const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(showToast._tid);showToast._tid=setTimeout(()=>t.classList.remove("show"),1800);}
async function copyText(text){try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(text);return true;}}catch(e){}try{const ta=document.createElement("textarea");ta.value=text;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.left="-9999px";document.body.appendChild(ta);ta.select();const ok=document.execCommand("copy");document.body.removeChild(ta);return ok;}catch(e){return false;}}
async function shareOrCopy(item,btn){const text=formatPlainText(item),title=item.name+" (Homebrew)";if(canShare){try{await navigator.share({title,text});showToast("Shared");return;}catch(e){if(e&&e.name==="AbortError")return;}}const ok=await copyText(text);if(ok){showToast("Card copied");if(btn){btn.classList.add("copied");btn.textContent="Copied!";setTimeout(()=>{btn.classList.remove("copied");btn.textContent="Copy card";},1400);}}else showToast("Couldn’t copy — select text manually");}
function cardHtml(item,opts){opts=opts||{};const compact=!!opts.compact,idAttr=opts.id?(' data-id="'+esc(opts.id)+'"'):"",rc=RCLASS[item.rarity]||"r-common";const chips=['<span class="chip rarity">'+esc(item.rarity)+'</span>','<span class="chip slot">'+esc(item.slot||item.type)+'</span>','<span class="chip">Homebrew</span>'];if(item.attune)chips.push('<span class="chip attune">Attunement</span>');const shareLabel=canShare?"Text players":"Copy card",shareClass=canShare?"action-btn primary share-btn":"action-btn primary copy-btn";let sms="";if(!canShare&&isMobile)sms='<a class="sms-link show" href="sms:?&body='+encodeURIComponent(formatSmsBody(item))+'">Open in Messages</a>';const actions='<div class="card-actions" onclick="event.stopPropagation()"><button type="button" class="'+shareClass+'" data-action="share">'+shareLabel+'</button>'+(canShare?'<button type="button" class="action-btn copy-btn" data-action="copy">Copy card</button>':'')+'</div>'+sms;const desc=compact?"":(item.description?'<div class="card-block"><p class="block-label">Description</p><p class="look">'+esc(item.description)+'</p></div>':"");const lore=compact?'':'<div class="card-block"><p class="block-label">Lore</p><p class="lore">'+esc(item.lore)+'</p></div>';return '<article class="loot-card '+rc+(compact?" hist-card":"")+'"'+idAttr+'><div class="loot-card-inner"><div class="card-top"><h2 class="item-name">'+esc(item.name)+'</h2></div><div class="meta-row">'+chips.join("")+'</div>'+desc+'<div class="card-block"><p class="block-label">'+(compact?"Mechanics":"Table-ready mechanics")+'</p><p class="mechanics">'+esc(item.mechanics)+'</p></div>'+lore+actions+'</div></article>';}
function bindCardActions(root,item){if(!root)return;const shareBtn=root.querySelector('[data-action="share"]'),copyBtn=root.querySelector('[data-action="copy"]');if(shareBtn)shareBtn.onclick=e=>{e.stopPropagation();shareOrCopy(item,shareBtn);};if(copyBtn)copyBtn.onclick=async e=>{e.stopPropagation();const ok=await copyText(formatPlainText(item));if(ok){showToast("Card copied");copyBtn.classList.add("copied");const prev=copyBtn.textContent;copyBtn.textContent="Copied!";setTimeout(()=>{copyBtn.classList.remove("copied");copyBtn.textContent=prev;},1400);}else showToast("Couldn’t copy");};}
let selR=null,selT=null,currentItem=null;
const re=document.getElementById("rarities"),te=document.getElementById("types"),btn=document.getElementById("create"),hint=document.getElementById("hint"),res=document.getElementById("result");
const histEl=document.getElementById("history"),histEmpty=document.getElementById("history-empty"),clearBtn=document.getElementById("clear-history");
function sync(){const ok=!!(selR&&selT);btn.disabled=!ok;hint.textContent=!selR&&!selT?"Pick a rarity and a type":!selR?"Pick a rarity":!selT?"Pick a type":"Ready — tap Create";}
R.forEach(r=>{const b=document.createElement("button");b.type="button";b.className="btn "+(RC[r]||"");b.textContent=r;b.onclick=()=>{selR=r;re.querySelectorAll(".btn").forEach(x=>x.classList.toggle("active",x.textContent===r));sync();};re.appendChild(b);});
T.forEach(t=>{const b=document.createElement("button");b.type="button";b.className="btn type";b.textContent=t;b.onclick=()=>{selT=t;te.querySelectorAll(".btn").forEach(x=>x.classList.toggle("active",x.textContent===t));sync();};te.appendChild(b);});
function showItem(item,opts){opts=opts||{};currentItem=item;res.classList.remove("empty");res.classList.remove("flash");void res.offsetWidth;if(opts.flash!==false)res.classList.add("flash");res.innerHTML=cardHtml(item,{});bindCardActions(res.querySelector(".loot-card"),item);try{res.scrollIntoView({behavior:"smooth",block:"nearest"});}catch(e){}}
function renderHistory(){const list=loadHistory();if(!histEl)return;histEl.innerHTML="";if(histEmpty)histEmpty.hidden=list.length>0;if(clearBtn)clearBtn.hidden=list.length===0;list.forEach(entry=>{const wrap=document.createElement("div");wrap.innerHTML=cardHtml(entry,{compact:true,id:entry.id});const card=wrap.firstChild;card.onclick=()=>showItem(entry,{flash:true});bindCardActions(card,entry);histEl.appendChild(card);});}
if(clearBtn)clearBtn.onclick=()=>{if(!loadHistory().length)return;if(!confirm("Clear all history?"))return;saveHistory([]);renderHistory();showToast("History cleared");};
btn.onclick=()=>{if(!selR||!selT)return;const item=generate(selR,selT);pushHistory(item);showItem(item,{flash:true});renderHistory();};
renderHistory();
sync();
})();
