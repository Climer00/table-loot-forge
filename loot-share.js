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
    if(loreEl){
      lore=loreEl.textContent.replace(/^\s*Lore:\s*/i,"");
    }
    const properties=[].slice.call(card.querySelectorAll(".prop")).map(function(p){
      const tEl=p.querySelector(".prop-title");
      const title=((tEl&&tEl.textContent)||"").replace(/\.\s*$/,"");
      let text=p.textContent||"";
      if(title) text=text.replace(title,"").replace(/^\.\s*/,"");
      return {title:title.trim(), text:text.trim()};
    });
    const attune=!!card.querySelector(".chip.attune");
    let rarity="Common";
    const rm=category.match(/,\s*(common|uncommon|rare|very rare|legendary)\s*$/i);
    if(rm){
      const raw=rm[1].toLowerCase();
      rarity=raw==="very rare"?"Very Rare":raw.replace(/^\w/,function(c){return c.toUpperCase();});
    }
    return {name:name.trim(), category:category.trim(), description:description.trim(), lore:lore.trim(), properties:properties, attune:attune, rarity:rarity};
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
    if(item.lore){
      lines.push("");
      lines.push(playerize(item.lore));
    }
    lines.push("");
    lines.push("Homebrew");
    return lines.join("\n").replace(/\n{3,}/g,"\n\n").trim();
  }

  function wrapLines(ctx, text, maxWidth){
    const words=String(text||"").split(/\s+/);
    const lines=[];
    let line="";
    for(let i=0;i<words.length;i++){
      const test=line?line+" "+words[i]:words[i];
      if(ctx.measureText(test).width<=maxWidth) line=test;
      else{
        if(line) lines.push(line);
        line=words[i];
      }
    }
    if(line) lines.push(line);
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

  function measureCard(item){
    const W=900;
    const pad=56;
    const inner=W-pad*2;
    const c=document.createElement("canvas").getContext("2d");
    let y=64;
    c.font="800 44px Segoe UI, system-ui, sans-serif";
    y+=wrapLines(c,item.name,inner).length*52+8;
    c.font="italic 26px Segoe UI, system-ui, sans-serif";
    y+=wrapLines(c,item.category,inner).length*34+18;
    y+=40;
    if(item.description){
      c.font="26px Segoe UI, system-ui, sans-serif";
      y+=wrapLines(c,playerize(item.description),inner-24).length*34+36;
    }
    (item.properties||[]).forEach(function(p){
      const block=(p.title?p.title+". ":"")+playerize(p.text);
      c.font="26px Segoe UI, system-ui, sans-serif";
      y+=wrapLines(c,block,inner-24).length*34+16;
    });
    y+=20;
    if(item.lore){
      c.font="italic 24px Segoe UI, system-ui, sans-serif";
      y+=wrapLines(c,playerize(item.lore),inner).length*32+24;
    }
    y+=70;
    return Math.max(1180, y+pad);
  }

  function renderCardCanvas(item){
    const W=900;
    const H=measureCard(item);
    const canvas=document.createElement("canvas");
    canvas.width=W;
    canvas.height=H;
    const ctx=canvas.getContext("2d");
    const accent=RCOLOR[item.rarity]||RCOLOR.Common;
    const pad=56;
    const inner=W-pad*2;

    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,"#2a3340");
    bg.addColorStop(0.55,"#1e2530");
    bg.addColorStop(1,"#161b22");
    ctx.fillStyle=bg;
    drawRoundRect(ctx,0,0,W,H,36);
    ctx.fill();

    ctx.strokeStyle=accent;
    ctx.globalAlpha=0.75;
    ctx.lineWidth=8;
    drawRoundRect(ctx,10,10,W-20,H-20,30);
    ctx.stroke();
    ctx.globalAlpha=0.28;
    ctx.lineWidth=2;
    drawRoundRect(ctx,28,28,W-56,H-56,22);
    ctx.stroke();
    ctx.globalAlpha=1;

    let y=72;
    ctx.fillStyle=accent;
    ctx.font="800 44px Segoe UI, system-ui, sans-serif";
    wrapLines(ctx,item.name,inner).forEach(function(ln){
      ctx.fillText(ln,pad,y);
      y+=52;
    });
    y+=4;
    ctx.fillStyle="#8b97a8";
    ctx.font="italic 26px Segoe UI, system-ui, sans-serif";
    wrapLines(ctx,item.category,inner).forEach(function(ln){
      ctx.fillText(ln,pad,y);
      y+=34;
    });
    y+=14;

    function chip(label,x,color){
      ctx.font="700 18px Segoe UI, system-ui, sans-serif";
      const tw=ctx.measureText(label).width;
      const cw=tw+28, ch=32;
      ctx.fillStyle="rgba(0,0,0,0.35)";
      ctx.strokeStyle=color;
      ctx.lineWidth=2;
      drawRoundRect(ctx,x,y,cw,ch,16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle=color;
      ctx.fillText(label,x+14,y+22);
      return cw+10;
    }
    let x=pad;
    x+=chip("HOMEBREW",x,"#3dcdb8");
    if(item.attune) chip("ATTUNEMENT",x,"#ffb86b");
    y+=52;

    if(item.description){
      const lines=wrapLines(ctx,playerize(item.description),inner-28);
      const boxH=lines.length*34+28;
      ctx.fillStyle="rgba(0,0,0,0.22)";
      ctx.fillRect(pad,y,inner,boxH);
      ctx.fillStyle="#3dcdb8";
      ctx.fillRect(pad,y,6,boxH);
      ctx.fillStyle="#e8edf2";
      ctx.font="26px Segoe UI, system-ui, sans-serif";
      let ty=y+32;
      lines.forEach(function(ln){ ctx.fillText(ln,pad+22,ty); ty+=34; });
      y+=boxH+22;
    }

    if((item.properties||[]).length){
      let blockH=16;
      const drawn=[];
      ctx.font="26px Segoe UI, system-ui, sans-serif";
      (item.properties||[]).forEach(function(p){
        const title=playerize(p.title);
        const text=playerize(p.text);
        const lines=wrapLines(ctx,(title?title+". ":"")+text,inner-28);
        drawn.push({title:title, lines:lines});
        blockH+=lines.length*34+12;
      });
      ctx.fillStyle="rgba(0,0,0,0.28)";
      ctx.fillRect(pad,y,inner,blockH);
      ctx.fillStyle="#ff6b35";
      ctx.fillRect(pad,y,6,blockH);
      let ty=y+36;
      drawn.forEach(function(d){
        d.lines.forEach(function(ln,i){
          if(i===0 && d.title){
            const prefix=d.title+". ";
            ctx.font="800 26px Segoe UI, system-ui, sans-serif";
            ctx.fillStyle="#d4a574";
            ctx.fillText(prefix,pad+22,ty);
            const pw=ctx.measureText(prefix).width;
            ctx.font="26px Segoe UI, system-ui, sans-serif";
            ctx.fillStyle="#e8edf2";
            ctx.fillText(ln.slice(prefix.length),pad+22+pw,ty);
          }else{
            ctx.font="26px Segoe UI, system-ui, sans-serif";
            ctx.fillStyle="#e8edf2";
            ctx.fillText(ln,pad+22,ty);
          }
          ty+=34;
        });
        ty+=12;
      });
      y+=blockH+24;
    }

    if(item.lore){
      ctx.strokeStyle="rgba(212,165,116,0.28)";
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(pad,y);
      ctx.lineTo(W-pad,y);
      ctx.stroke();
      y+=36;
      ctx.fillStyle="#8b97a8";
      ctx.font="italic 24px Segoe UI, system-ui, sans-serif";
      wrapLines(ctx,playerize(item.lore),inner).forEach(function(ln){
        ctx.fillText(ln,pad,y);
        y+=32;
      });
      y+=8;
    }

    ctx.fillStyle="#6b7c93";
    ctx.font="700 18px Segoe UI, system-ui, sans-serif";
    ctx.fillText("TABLE LOOT FORGE  ·  HOMEBREW", pad, H-40);
    return canvas;
  }

  function canvasToBlob(canvas){
    return new Promise(function(resolve){
      if(canvas.toBlob){
        canvas.toBlob(function(b){ resolve(b); }, "image/png");
      }else{
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

  async function shareItem(item, wantImage){
    const text=formatPlayerText(item);
    const canvas=renderCardCanvas(item);
    const blob=await canvasToBlob(canvas);
    const name=fileName(item);
    const file=new File([blob], name, {type:"image/png"});
    if(wantImage){
      if(navigator.canShare && navigator.canShare({files:[file]})){
        try{
          await navigator.share({files:[file], title:item.name, text:text});
          toast("Shared card");
          return;
        }catch(e){ if(e&&e.name==="AbortError") return; }
      }
      await downloadPng(blob, name);
      toast("Image saved");
      return;
    }
    if(navigator.share){
      try{
        if(navigator.canShare && navigator.canShare({files:[file], text:text})){
          await navigator.share({title:item.name+" (Homebrew)", text:text, files:[file]});
          toast("Sent to players");
          return;
        }
        await navigator.share({title:item.name+" (Homebrew)", text:text});
        toast("Text ready to send");
        return;
      }catch(e){ if(e&&e.name==="AbortError") return; }
    }
    const ok=await copyText(text);
    toast(ok?"Player text copied":"Couldn't copy");
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
    if(act==="image") shareItem(item, true);
    else if(act==="copy"){
      copyText(formatPlayerText(item)).then(function(ok){
        toast(ok?"Player text copied":"Couldn't copy");
        if(ok){
          btn.classList.add("copied");
          const prev=btn.textContent;
          btn.textContent="Copied!";
          setTimeout(function(){ btn.classList.remove("copied"); btn.textContent=prev; },1400);
        }
      });
    }else{
      shareItem(item, false);
    }
  }, true);

  function scan(){ document.querySelectorAll(".loot-card").forEach(enhanceCard); }
  const mo=new MutationObserver(scan);
  if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener("DOMContentLoaded", function(){ mo.observe(document.body,{childList:true,subtree:true}); scan(); });
  scan();
})();
