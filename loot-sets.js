/* Table Loot Forge — set bonus from shared name */
(function(){
  const THEME={
    zephyr:"While you wear another {set} item, your jumping distance increases by an extra 5 feet and Gust-like flight from {set} items does not stack — use the longest flight, then add this 5 feet. In addition to each item's other properties.",
    gust:"While you wear another {set} item, once per short rest you can take the Dash action as a bonus action. In addition to each item's own properties; a third {set} item adds nothing more.",
    storm:"While you wear another {set} item, the first time you deal lightning or thunder damage on your turn, add 1d4 of that type. In addition to each item's own properties; does not stack from a third piece.",
    gale:"While you wear another {set} item, falling damage you take is reduced by 10 feet worth. In addition to each item's own properties.",
    frost:"While you wear another {set} item, the first weapon hit you land each turn deals extra 1d4 cold. Resistances from {set} items do not stack. In addition to each item's other properties.",
    rime:"While you wear another {set} item, ice and snow are not difficult terrain for you. In addition to each item's own properties; a third {set} item adds nothing more.",
    ember:"While you wear another {set} item, the first weapon hit you land each turn deals extra 1d4 fire. Resistances from {set} items do not stack. In addition to each item's other properties.",
    cinder:"While you wear another {set} item, you can light or snuff a nonmagical flame within 15 feet (no action). In addition to each item's own properties.",
    ash:"While you wear another {set} item, you have advantage on the first Constitution save you make after you take fire damage. In addition to each item's own properties.",
    obsidian:"While you wear another {set} item, critical hits against you deal damage as normal hits once per short rest. In addition to each item's own properties.",
    iron:"While you wear another {set} item, you have advantage on the first Strength check or save you make each short rest. In addition to each item's own properties.",
    silver:"While you wear another {set} item, your unarmed strikes and natural weapons count as silvered. In addition to each item's own properties; this does not stack extra silvering.",
    moon:"While you wear another {set} item, you have darkvision 10 feet (or +10 feet). In addition to each item's own properties; ranges do not stack beyond the best single item plus this 10 feet.",
    shadow:"While you wear another {set} item, opportunity attacks against you have disadvantage while you are in dim light. In addition to each item's own properties.",
    sable:"While you wear another {set} item, you have advantage on one Stealth check you make per short rest. In addition to each item's own properties.",
    russet:"While you wear another {set} item, you have advantage on the first Wisdom (Survival or Perception) check you make each short rest. In addition to each item's own properties.",
    verdant:"While you wear another {set} item, difficult terrain from plants does not cost you extra movement. In addition to each item's own properties.",
    thorn:"While you wear another {set} item, when a creature hits you with a melee attack, it takes 1 piercing (no save) once per turn. In addition to each item's own properties.",
    ward:"While you wear another {set} item, you gain +1 AC until the start of your next turn the first time you are hit after rolling initiative. In addition to each item's own properties; AC bonuses of the same type still do not stack.",
    aegis:"While you wear another {set} item, once per short rest you can impose disadvantage on one attack against you (no action, after you see the roll but before it hits). In addition to each item's own properties.",
    oath:"While you wear another {set} item, you have advantage on saves against being frightened. In addition to each item's own properties; advantage does not stack.",
    grave:"While you wear another {set} item, undead have disadvantage on the first attack they make against you after you roll initiative. In addition to each item's own properties.",
    bone:"While you wear another {set} item, you know whether a corpse you touch died within the last 24 hours. In addition to each item's own properties.",
    star:"While you wear another {set} item, you shed dim light 5 feet that you can toggle (no action). In addition to each item's own properties.",
    dawn:"While you wear another {set} item, you have advantage on the first save against being blinded you make each short rest. In addition to each item's own properties.",
    dusk:"While you wear another {set} item, you have advantage on Initiative if you are in dim light. In addition to each item's own properties.",
    river:"While you wear another {set} item, swimming does not cost extra movement. In addition to each item's own properties.",
    tide:"While you wear another {set} item, you can hold your breath twice as long. In addition to each item's own properties; durations use the better copy, then this doubles once.",
    hearth:"While you wear another {set} item, you and allies within 5 feet automatically succeed on saves against extreme cold. In addition to each item's own properties.",
    forge:"While you wear another {set} item, you have resistance to fire from nonmagical forge-heat and can handle a heat metal target without taking that damage once per short rest. In addition to each item's own properties.",
    rune:"While you wear another {set} item, you have advantage on the first Intelligence (Arcana) check you make each short rest. In addition to each item's own properties.",
    seal:"While you wear another {set} item, you have advantage on the first saving throw you make against being charmed each short rest. In addition to each item's own properties."
  };

  const GENERIC=[
    "While you wear or hold another {set} item, once per short rest you can reroll one attack roll, ability check, or saving throw (you must use the new roll). This is in addition to each item's own properties. The same named property does not double. A third {set} item does not increase this.",
    "While you wear or hold another {set} item, you have advantage on the first saving throw you make after rolling initiative. In addition to each item's own properties; advantage does not stack, and a third {set} item adds nothing more.",
    "While you wear or hold another {set} item, you gain 1d6 temporary hit points when you finish a short rest. In addition to each item's own properties. Temporary hit points from {set} items do not stack — take the highest, then add this once.",
    "While you wear or hold another {set} item, your walking speed increases by 5 feet. In addition to each item's own properties. Speed bonuses from the same {set} use the best single item, then add this 5 feet once."
  ];

  function pick(a){return a[Math.floor(Math.random()*a.length)];}

  function setNameFrom(name){
    const n=String(name||"").replace(/^\s*The\s+/i,"").trim();
    const of=n.match(/^(.+?)\s+of the\s+(.+)$/i);
    if(of) return of[2].split(/\s+/)[0];
    const of2=n.match(/^(.+?)\s+of\s+(.+)$/i);
    if(of2) return of2[2].split(/\s+/)[0];
    return n.split(/\s+/)[0]||"Kindred";
  }

  function setText(set){
    const key=set.toLowerCase();
    const tmpl=THEME[key]||pick(GENERIC);
    return tmpl.replace(/\{set\}/g,set);
  }

  function addSetToCard(card){
    if(!card || card.dataset.setReady) return;
    const nameEl=card.querySelector(".item-name");
    if(!nameEl) return;
    const set=setNameFrom(nameEl.textContent);
    card.dataset.setReady="1";
    card.dataset.setName=set;

    const title=set+" Set";
    const text=setText(set);

    const props=card.querySelector(".props-block");
    if(props && !props.querySelector(".set-bonus")){
      const p=document.createElement("p");
      p.className="prop set-bonus";
      p.innerHTML='<strong class="prop-title">'+esc(title)+'.</strong> '+esc(text);
      props.appendChild(p);
    }

    const titles=card.querySelector(".prop-titles");
    if(titles && titles.textContent.indexOf("Set")===-1){
      titles.textContent=titles.textContent+" · "+title;
    }

    const meta=card.querySelector(".meta-row");
    if(meta && !meta.querySelector(".chip-set")){
      const chip=document.createElement("span");
      chip.className="chip chip-set";
      chip.textContent="Set: "+set;
      meta.appendChild(chip);
    }
  }

  function esc(s){
    return String(s||"").replace(/[&<>"']/g,function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
    });
  }

  if(!document.getElementById("tlt-set-css")){
    const st=document.createElement("style");
    st.id="tlt-set-css";
    st.textContent=".chip-set{color:#c9b8ff;border-color:rgba(181,122,255,.45)}.prop.set-bonus .prop-title{color:#c9b8ff}";
    document.head.appendChild(st);
  }

  function scan(){ document.querySelectorAll(".loot-card").forEach(addSetToCard); }
  const mo=new MutationObserver(scan);
  if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener("DOMContentLoaded",function(){ mo.observe(document.body,{childList:true,subtree:true}); scan(); });
  scan();
})();
