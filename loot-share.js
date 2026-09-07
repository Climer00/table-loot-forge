/* Table Loot Forge — player text + card image */
(function(){
  const RCOLOR={
    Common:"#c5cdd6",
    Uncommon:"#9de0b0",
    Rare:"#8ec4ff",
    "Very Rare":"#d0b0ff",
    Legendary:"#ffc14d"
  };

  function playerize(s){
    return String(s||"")
      .replace(/\s*\((?:DM|dm)[^)]*\)/g,"")
      .replace(/\s*DM (?:may|adjudicates)[^.]*\./gi,"")
      .replace(/[ \t]+\n/g,"\n")
      .replace(/\n{3,}/g,"\n\n")
      .replace(/[ \t]{2,}/g," ")
      .trim();
  }

  function itemFromCard(card){
    if(!card) return null;
    const name=(card.querySelector(".item-name")||{}).textContent||"Item";
    const category=(card.querySelector(".category-line")||{}).textContent||"";
    const description=(card.querySelector(".look")||{}).textContent||"";
    const loreEl=card.querySelector(".lore");
    let lore="";
    if(loreEl) lore=loreEl.textContent.replace(/^\s*Lore:\s*/i,"");
    const properties=[].slice.call(card.querySelectorAll(".prop")).map(function(p){
      const tEl=p.querySelector(".prop-title");
      const title=((tEl&&tEl.textContent)||"").replace(/\.\s*$/,"");
      let text=p.textContent||"";
      if(title) text=text.replace(title,"").replace(/^\.\s*/,"");
      return {title:title.trim(), text:text.trim()};
    });
    const attune=!!card.querySelector(".chip.attune") || /\brequires attunement\b/i.test(category);
    let rarity="Common";
    const rm=category.match(/\b(very rare|legendary|uncommon|common|rare)\b/i);
    if(rm){
      const raw=rm[1].toLowerCase();
      rarity=raw==="very rare"?"Very Rare":raw.replace(/^\w/,function(c){return c.toUpperCase();});
    }
    const cleanCat=category.replace(/\s*\(requires attunement\)/i,"").trim();
    return {name:name.trim(), category:cleanCat, description:description.trim(), lore:lore.trim(), properties:properties, attune:attune, rarity:rarity};
  }

  function formatPlayerText(item){
    if(!item) return "";
    const lines=[item.name, item.category];
    if(item.attune) lines.push("Requires attunement");
    lines.push("");
    if(item.description){ lines.push(playerize(item.description)); lines.push(""); }
    (item.properties||[]).forEach(function(p){
      const title=playerize(p.title);
      const text=playerize(p.text);
      if(!title && !text) return;
      lines.push(title ? (title+". "+text) : text);
    });
    if(item.lore){ lines.push(""); lines.push(playerize(item.lore)); }
    lines.push("");
    lines.push("Homebrew");
    return lines.join("\n").replace(/\n{3,}/g,"\n\n").trim();
  }

  function wrapLines(ctx, text, maxWidth, font){
    if(font) ctx.font=font;
    const words=String(text||"").split(/\s+/);
    const lines=[];
    let line="";
    function flush(){ if(line){ lines.push(line); line=""; } }
    function breakWord(word){
      let chunk="";
      for(let i=0;i<word.length;i++){
        const test=chunk+word[i];
        if(ctx.measureText(test).width<=maxWidth) chunk=test;
        else{
          if(chunk) lines.push(chunk);
          chunk=word[i];
        }
      }
      return chunk;
    }
    for(let i=0;i<words.length;i++){
      const word=words[i];
      if(!word) continue;
      if(ctx.measureText(word).width>maxWidth){
        flush();
        line=breakWord(word);
        continue;
      }
      const test=line?line+" "+word:word;
      if(ctx.measureText(test).width<=maxWidth) line=test;
      else{
        flush();
        line=word;
      }
    }
    flush();
    return lines.length?lines:[""];
  }

  function drawRoundRect(ctx,x,y,w,h,r){
    const rr=Math.min(r,w/2,h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr,y);
    ctx.arcTo(x+w,y,x+w,y+h,rr);
    ctx.arcTo(x+w,y+h,x,y+h,rr);
    ctx.arcTo(x,y+h,x,y,rr);
    ctx.arcTo(x,y,x+w,y,rr);
    ctx.closePath();
  }

  const FONT_NAME="800 42px Segoe UI, system-ui, sans-serif";
  const FONT_CAT="italic 24px Segoe UI, system-ui, sans-serif";
  const FONT_BODY="24px Segoe UI, system-ui, sans-serif";
  const FONT_BODY_B="800 24px Segoe UI, system-ui, sans-serif";
  const FONT_LORE="italic 22px Segoe UI, system-ui, sans-serif";
  const FONT_CHIP="700 16px Segoe UI, system-ui, sans-serif";
  const FONT_FOOT="700 16px Segoe UI, system-ui, sans-serif";

  function measureCard(item){
    const W=900, pad=52, inner=W-pad*2, textW=inner-36;
    const c=document.createElement("canvas").getContext("2d");
    let y=70;
    y+=wrapLines(c,item.name,inner,FONT_NAME).length*50+6;
    y+=wrapLines(c,item.category,inner,FONT_CAT).length*32+16;
    y+=44;
    if(item.description){
      y+=wrapLines(c,playerize(item.description),textW,FONT_BODY).length*32+36;
    }
    (item.properties||[]).forEach(function(p){
      const block=(p.title?p.title+". ":"")+playerize(p.text);
      y+=wrapLines(c,block,textW,FONT_BODY).length*32+14;
    });
    y+=18;
    if(item.lore){
      y+=wrapLines(c,playerize(item.lore),inner,FONT_LORE).length*30+20;
    }
    y+=64;
    return Math.max(720, y+pad);
  }

  function renderCardCanvas(item){
    const W=900;
    const H=measureCard(item);
    const canvas=document.createElement("canvas");
    canvas.width=W;
    canvas.height=H;
    const ctx=canvas.getContext("2d");
    const accent=RCOLOR[item.rarity]||RCOLOR.Common;
    const pad=52;
    const inner=W-pad*2;
    const textW=inner-36;

    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,"#2a3340");
    bg.addColorStop(0.55,"#1e2530");
    bg.addColorStop(1,"#161b22");
    ctx.fillStyle=bg;
    drawRoundRect(ctx,0,0,W,H,36);
    ctx.fill();

    ctx.strokeStyle=accent;
    ctx.globalAlpha=0.8;
    ctx.lineWidth=8;
    drawRoundRect(ctx,10,10,W-20,H-20,30);
    ctx.stroke();
    ctx.globalAlpha=0.28;
    ctx.lineWidth=2;
    drawRoundRect(ctx,28,28,W-56,H-56,22);
    ctx.stroke();
    ctx.globalAlpha=1;

    let y=76;
    ctx.fillStyle=accent;
    wrapLines(ctx,item.name,inner,FONT_NAME).forEach(function(ln){
      ctx.fillText(ln,pad,y);
      y+=50;
    });
    y+=2;
    ctx.fillStyle="#8b97a8";
    wrapLines(ctx,item.category,inner,FONT_CAT).forEach(function(ln){
      ctx.fillText(ln,pad,y);
      y+=32;
    });
    y+=16;

    function chip(label,x,color){
      ctx.font=FONT_CHIP;
      const tw=ctx.measureText(label).width;
      const cw=tw+26, ch=30;
      ctx.fillStyle="rgba(0,0,0,0.35)";
      ctx.strokeStyle=color;
      ctx.lineWidth=2;
      drawRoundRect(ctx,x,y,cw,ch,15);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle=color;
      ctx.fillText(label,x+13,y+20);
      return cw+10;
    }
    let x=pad;
    x+=chip("HOMEBREW",x,"#3dcdb8");
    if(item.attune) chip("ATTUNEMENT",x,"#ffb86b");
    y+=48;

    if(item.description){
      const lines=wrapLines(ctx,playerize(item.description),textW,FONT_BODY);
      const boxH=lines.length*32+26;
      ctx.fillStyle="rgba(0,0,0,0.22)";
      ctx.fillRect(pad,y,inner,boxH);
      ctx.fillStyle="#3dcdb8";
      ctx.fillRect(pad,y,6,boxH);
      ctx.fillStyle="#e8edf2";
      ctx.font=FONT_BODY;
      let ty=y+30;
      lines.forEach(function(ln){ ctx.fillText(ln,pad+20,ty); ty+=32; });
      y+=boxH+18;
    }

    if((item.properties||[]).length){
      const drawn=[];
      let blockH=18;
      (item.properties||[]).forEach(function(p){
        const title=playerize(p.title);
        const text=playerize(p.text);
        const lines=wrapLines(ctx,(title?title+". ":"")+text,textW,FONT_BODY);
        drawn.push({title:title, lines:lines});
        blockH+=lines.length*32+12;
      });
      ctx.fillStyle="rgba(0,0,0,0.28)";
      ctx.fillRect(pad,y,inner,blockH);
      ctx.fillStyle="#ff6b35";
      ctx.fillRect(pad,y,6,blockH);
      let ty=y+34;
      drawn.forEach(function(d){
        d.lines.forEach(function(ln,i){
          if(i===0 && d.title){
            const prefix=d.title+". ";
            ctx.font=FONT_BODY_B;
            ctx.fillStyle="#d4a574";
            ctx.fillText(prefix,pad+20,ty);
            const pw=ctx.measureText(prefix).width;
            ctx.font=FONT_BODY;
            ctx.fillStyle="#e8edf2";
            ctx.fillText(ln.slice(prefix.length),pad+20+pw,ty);
          }else{
            ctx.font=FONT_BODY;
            ctx.fillStyle="#e8edf2";
            ctx.fillText(ln,pad+20,ty);
          }
          ty+=32;
        });
        ty+=12;
      });
      y+=blockH+20;
    }

    if(item.lore){
      ctx.strokeStyle="rgba(212,165,116,0.28)";
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(pad,y);
      ctx.lineTo(W-pad,y);
      ctx.stroke();
      y+=34;
      ctx.fillStyle="#8b97a8";
      wrapLines(ctx,playerize(item.lore),inner,FONT_LORE).forEach(function(ln){
        ctx.fillText(ln,pad,y);
        y+=30;
      });
    }

    ctx.fillStyle="#6b7c93";
    ctx.font=FONT_FOOT;
    ctx.fillText("TABLE LOOT FORGE  ·  HOMEBREW", pad, H-36);
    return canvas;
  }

  function canvasToBlob(canvas){
    return new Promise(function(resolve){
      if(canvas.toBlob) canvas.toBlob(function(b){ resolve(b); }, "image/png");
      else{
        const data=canvas.toDataURL("image/png");
        const bin=atob(data.split(",")[1]);
        const arr=new Uint8Array(bin.length);
        for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
        resolve(new Blob([arr],{type:"image/png"}));
      }
    });
  }

  function fileName(item){
    return String(item&&item.name||"loot-card").replace(/[^\w]+/g,"-").replace(/^-|-$/g,"")+".png";
  }

  function toast(msg){
    const t=document.getElementById("toast");
    if(!t) return;
    t.textContent=msg;
    t.classList.add("show");
    clearTimeout(toast._tid);
    toast._tid=setTimeout(function(){ t.classList.remove("show"); },1800);
  }

  async function copyText(text){
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        await navigator.clipboard.writeText(text);
        return true;
      }
    }catch(e){}
    try{
      const ta=document.createElement("textarea");
      ta.value=text;
      ta.setAttribute("readonly","");
      ta.style.position="fixed";
      ta.style.left="-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok=document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    }catch(e){ return false; }
  }

  async function downloadPng(blob, name){
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
  }

  async function shareImageOnly(item){
    const canvas=renderCardCanvas(item);
    const blob=await canvasToBlob(canvas);
    const name=fileName(item);
    const file=new File([blob], name, {type:"image/png"});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      try{
        await navigator.share({files:[file], title:item.name});
        toast("Card sent");
        return;
      }catch(e){ if(e&&e.name==="AbortError") return; }
    }
    if(navigator.share){
      try{
        await navigator.share({files:[file], title:item.name});
        toast("Card sent");
        return;
      }catch(e){ if(e&&e.name==="AbortError") return; }
    }
    await downloadPng(blob, name);
    toast("Image saved");
  }

  function enhanceCard(card){
    if(!card || card.dataset.shareReady) return;
    const actions=card.querySelector(".card-actions");
    if(!actions) return;
    card.dataset.shareReady="1";
    if(!actions.querySelector('[data-action="image"]')){
      const b=document.createElement("button");
      b.type="button";
      b.className="action-btn";
      b.setAttribute("data-action","image");
      b.textContent="Save image";
      actions.appendChild(b);
    }
    const share=actions.querySelector('[data-action="share"]');
    if(share) share.textContent="Text players";
  }

  document.addEventListener("click", function(e){
    const btn=e.target.closest('[data-action="share"],[data-action="copy"],[data-action="image"]');
    if(!btn) return;
    const card=btn.closest(".loot-card");
    const item=itemFromCard(card);
    if(!item) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const act=btn.getAttribute("data-action");
    if(act==="copy"){
      copyText(formatPlayerText(item)).then(function(ok){
        toast(ok?"Player text copied":"Couldn't copy");
        if(ok){
          btn.classList.add("copied");
          const prev=btn.textContent;
          btn.textContent="Copied!";
          setTimeout(function(){ btn.classList.remove("copied"); btn.textContent=prev; },1400);
        }
      });
      return;
    }
    shareImageOnly(item);
  }, true);

  function scan(){ document.querySelectorAll(".loot-card").forEach(enhanceCard); }
  const mo=new MutationObserver(scan);
  if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener("DOMContentLoaded", function(){ mo.observe(document.body,{childList:true,subtree:true}); scan(); });
  scan();
})();
