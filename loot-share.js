/* Table Loot Forge — player text + card image + print/PDF */
(function(){
  const RCOLOR={Common:"#c5cdd6",Uncommon:"#9de0b0",Rare:"#8ec4ff","Very Rare":"#d0b0ff",Legendary:"#ffc14d"};
  function playerize(s){
    return String(s||"").replace(/\s*\((?:DM|dm)[^)]*\)/g,"").replace(/\s*DM (?:may|adjudicates)[^.]*\./gi,"").replace(/[ \t]+\n/g,"\n").replace(/\n{3,}/g,"\n\n").replace(/[ \t]{2,}/g," ").trim();
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
    let rarity="Common";
    const rm=category.match(/\b(very rare|legendary|uncommon|common|rare)\b/i);
    if(rm){
      const raw=rm[1].toLowerCase();
      rarity=raw==="very rare"?"Very Rare":raw.replace(/^\w/,function(c){return c.toUpperCase();});
    }
    const cleanCat=category.replace(/\s*\(requires attunement\)/i,"").trim();
    return {name:name.trim(), category:cleanCat, description:description.trim(), lore:lore.trim(), properties:properties, attune:false, rarity:rarity};
  }
  function formatPlayerText(item){
    if(!item) return "";
    const lines=[item.name, item.category, ""];
    if(item.description){ lines.push(playerize(item.description)); lines.push(""); }
    (item.properties||[]).forEach(function(p){
      const title=playerize(p.title), text=playerize(p.text);
      if(!title && !text) return;
      lines.push(title ? (title+". "+text) : text);
    });
    if(item.lore){ lines.push(""); lines.push(playerize(item.lore)); }
    lines.push("", "Homebrew");
    return lines.join("\n").replace(/\n{3,}/g,"\n\n").trim();
  }
  function wrapLines(ctx, text, maxWidth, font){
    if(font) ctx.font=font;
    const words=String(text||"").split(/\s+/);
    const lines=[]; let line="";
    function flush(){ if(line){ lines.push(line); line=""; } }
    function breakWord(word){
      let chunk="";
      for(let i=0;i<word.length;i++){
        const test=chunk+word[i];
        if(ctx.measureText(test).width<=maxWidth) chunk=test;
        else { if(chunk) lines.push(chunk); chunk=word[i]; }
      }
      return chunk;
    }
    for(let i=0;i<words.length;i++){
      const word=words[i]; if(!word) continue;
      if(ctx.measureText(word).width>maxWidth){ flush(); line=breakWord(word); continue; }
      const test=line?line+" "+word:word;
      if(ctx.measureText(test).width<=maxWidth) line=test; else { flush(); line=word; }
    }
    flush(); return lines.length?lines:[""];
  }
  function drawRoundRect(ctx,x,y,w,h,r){
    const rr=Math.min(r,w/2,h/2);
    ctx.beginPath(); ctx.moveTo(x+rr,y);
    ctx.arcTo(x+w,y,x+w,y+h,rr); ctx.arcTo(x+w,y+h,x,y+h,rr);
    ctx.arcTo(x,y+h,x,y,rr); ctx.arcTo(x,y,x+w,y,rr); ctx.closePath();
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
    if(item.description) y+=wrapLines(c,playerize(item.description),textW,FONT_BODY).length*32+36;
    (item.properties||[]).forEach(function(p){
      y+=wrapLines(c,(p.title?p.title+". ":"")+playerize(p.text),textW,FONT_BODY).length*32+14;
    });
    y+=18;
    if(item.lore) y+=wrapLines(c,playerize(item.lore),inner,FONT_LORE).length*30+20;
    y+=64;
    return Math.max(720, y+pad);
  }
  function renderCardCanvas(item){
    const W=900, H=measureCard(item);
    const canvas=document.createElement("canvas"); canvas.width=W; canvas.height=H;
    const ctx=canvas.getContext("2d");
    const accent=RCOLOR[item.rarity]||RCOLOR.Common;
    const pad=52, inner=W-pad*2, textW=inner-36;
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,"#2a3340"); bg.addColorStop(0.55,"#1e2530"); bg.addColorStop(1,"#161b22");
    ctx.fillStyle=bg; drawRoundRect(ctx,0,0,W,H,36); ctx.fill();
    ctx.strokeStyle=accent; ctx.globalAlpha=0.8; ctx.lineWidth=8; drawRoundRect(ctx,10,10,W-20,H-20,30); ctx.stroke();
    ctx.globalAlpha=0.28; ctx.lineWidth=2; drawRoundRect(ctx,28,28,W-56,H-56,22); ctx.stroke(); ctx.globalAlpha=1;
    let y=76;
    ctx.fillStyle=accent;
    wrapLines(ctx,item.name,inner,FONT_NAME).forEach(function(ln){ ctx.fillText(ln,pad,y); y+=50; });
    y+=2; ctx.fillStyle="#8b97a8";
    wrapLines(ctx,item.category,inner,FONT_CAT).forEach(function(ln){ ctx.fillText(ln,pad,y); y+=32; });
    y+=16;
    function chip(label,x,color){
      ctx.font=FONT_CHIP; const tw=ctx.measureText(label).width, cw=tw+26, ch=30;
      ctx.fillStyle="rgba(0,0,0,0.35)"; ctx.strokeStyle=color; ctx.lineWidth=2;
      drawRoundRect(ctx,x,y,cw,ch,15); ctx.fill(); ctx.stroke();
      ctx.fillStyle=color; ctx.fillText(label,x+13,y+20); return cw+10;
    }
    chip("HOMEBREW",pad,"#3dcdb8"); y+=48;
    if(item.description){
      const lines=wrapLines(ctx,playerize(item.description),textW,FONT_BODY);
      const boxH=lines.length*32+26;
      ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.fillRect(pad,y,inner,boxH);
      ctx.fillStyle="#3dcdb8"; ctx.fillRect(pad,y,6,boxH);
      ctx.fillStyle="#e8edf2"; ctx.font=FONT_BODY;
      let ty=y+30; lines.forEach(function(ln){ ctx.fillText(ln,pad+20,ty); ty+=32; }); y+=boxH+18;
    }
    if((item.properties||[]).length){
      const drawn=[]; let blockH=18;
      (item.properties||[]).forEach(function(p){
        const title=playerize(p.title), text=playerize(p.text);
        const lines=wrapLines(ctx,(title?title+". ":"")+text,textW,FONT_BODY);
        drawn.push({title:title, lines:lines}); blockH+=lines.length*32+12;
      });
      ctx.fillStyle="rgba(0,0,0,0.28)"; ctx.fillRect(pad,y,inner,blockH);
      ctx.fillStyle="#ff6b35"; ctx.fillRect(pad,y,6,blockH);
      let ty=y+34;
      drawn.forEach(function(d){
        d.lines.forEach(function(ln,i){
          if(i===0 && d.title){
            const prefix=d.title+". ";
            ctx.font=FONT_BODY_B; ctx.fillStyle="#d4a574"; ctx.fillText(prefix,pad+20,ty);
            const pw=ctx.measureText(prefix).width;
            ctx.font=FONT_BODY; ctx.fillStyle="#e8edf2"; ctx.fillText(ln.slice(prefix.length),pad+20+pw,ty);
          } else { ctx.font=FONT_BODY; ctx.fillStyle="#e8edf2"; ctx.fillText(ln,pad+20,ty); }
          ty+=32;
        }); ty+=12;
      });
      y+=blockH+20;
    }
    if(item.lore){
      ctx.strokeStyle="rgba(212,165,116,0.28)"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(W-pad,y); ctx.stroke(); y+=34;
      ctx.fillStyle="#8b97a8";
      wrapLines(ctx,playerize(item.lore),inner,FONT_LORE).forEach(function(ln){ ctx.fillText(ln,pad,y); y+=30; });
    }
    ctx.fillStyle="#6b7c93"; ctx.font=FONT_FOOT;
    ctx.fillText("TABLE LOOT FORGE  \u00b7  HOMEBREW", pad, H-36);
    return canvas;
  }
  function canvasToBlob(canvas){
    return new Promise(function(resolve){
      if(canvas.toBlob) canvas.toBlob(function(b){ resolve(b); }, "image/png");
      else {
        const data=canvas.toDataURL("image/png"); const bin=atob(data.split(",")[1]);
        const arr=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
        resolve(new Blob([arr],{type:"image/png"}));
      }
    });
  }
  function slug(item){ return String(item&&item.name||"loot-card").replace(/[^\w]+/g,"-").replace(/^-|-$/g,"").toLowerCase()||"loot-card"; }
  function fileName(item){ return slug(item)+".png"; }
  function toast(msg){
    const t=document.getElementById("toast"); if(!t) return;
    t.textContent=msg; t.classList.add("show"); clearTimeout(toast._tid);
    toast._tid=setTimeout(function(){ t.classList.remove("show"); },1800);
  }
  async function copyText(text){
    try{ if(navigator.clipboard&&navigator.clipboard.writeText){ await navigator.clipboard.writeText(text); return true; } }catch(e){}
    try{
      const ta=document.createElement("textarea"); ta.value=text; ta.setAttribute("readonly","");
      ta.style.position="fixed"; ta.style.left="-9999px"; document.body.appendChild(ta); ta.select();
      const ok=document.execCommand("copy"); document.body.removeChild(ta); return ok;
    }catch(e){ return false; }
  }
  function downloadBlob(blob, name){
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
  }
  function cardInches(canvas){
    const wIn=2.5, hIn=Math.max(3.5, +(wIn*canvas.height/canvas.width).toFixed(3));
    return {wIn:wIn, hIn:hIn, wPt:wIn*72, hPt:hIn*72};
  }
  function canvasToJpeg(canvas, quality){
    const data=canvas.toDataURL("image/jpeg", quality||0.92);
    const bin=atob(data.split(",")[1]); const arr=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i); return arr;
  }
  function makePdf(jpegBytes, pxW, pxH, pageW, pageH){
    const enc=new TextEncoder();
    const objects={};
    objects[1]={body:"<< /Type /Catalog /Pages 2 0 R >>"};
    objects[2]={body:"<< /Type /Pages /Kids [3 0 R] /Count 1 >>"};
    objects[3]={body:"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+pageW.toFixed(2)+" "+pageH.toFixed(2)+"] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>"};
    objects[4]={body:"<< /Type /XObject /Subtype /Image /Width "+pxW+" /Height "+pxH+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+jpegBytes.length+" >>", stream:jpegBytes};
    const draw=pageW.toFixed(2)+" 0 0 "+pageH.toFixed(2)+" 0 0 cm /Im0 Do";
    objects[5]={body:"<< /Length "+draw.length+" >>", stream:enc.encode(draw)};
    const out=[]; function emit(s){ out.push(typeof s==="string"?enc.encode(s):s); }
    function sizeSoFar(){ return out.reduce(function(a,b){return a+b.length;},0); }
    emit("%PDF-1.4\n"); const off=[0];
    for(let n=1;n<=5;n++){
      off[n]=sizeSoFar(); const o=objects[n];
      if(o.stream){ emit(n+" 0 obj\n"+o.body+"\nstream\n"); emit(o.stream); emit("\nendstream\nendobj\n"); }
      else { emit(n+" 0 obj\n"+o.body+"\nendobj\n"); }
    }
    const xref=sizeSoFar(); let xrefStr="xref\n0 6\n0000000000 65535 f \n";
    for(let n=1;n<=5;n++) xrefStr+=String(off[n]).padStart(10,"0")+" 00000 n \n";
    emit(xrefStr); emit("trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF");
    const buf=new Uint8Array(sizeSoFar()); let p=0; out.forEach(function(b){ buf.set(b,p); p+=b.length; });
    return new Blob([buf],{type:"application/pdf"});
  }
  function ensureExportUi(){
    if(document.getElementById("tlf-export")) return;
    const style=document.createElement("style");
    style.textContent="#tlf-export{position:fixed;inset:0;z-index:80;display:none;align-items:flex-end;justify-content:center;}#tlf-export.show{display:flex;}#tlf-export .back{position:absolute;inset:0;background:rgba(0,0,0,.55);}#tlf-export .sheet{position:relative;width:100%;max-width:440px;background:#1a1f27;border:1px solid rgba(212,165,116,.28);border-radius:16px 16px 0 0;padding:16px 14px calc(16px + env(safe-area-inset-bottom,0px));}#tlf-export h3{margin:0 0 6px;font-size:.95rem;color:#d4a574;}#tlf-export p{margin:0 0 12px;color:#8b97a8;font-size:.8rem;}#tlf-export .opt{width:100%;margin:0 0 8px;appearance:none;border:1px solid rgba(107,124,147,.4);background:#222933;color:#e8edf2;border-radius:10px;padding:12px 14px;font-size:.92rem;font-weight:700;min-height:48px;cursor:pointer;}#tlf-export .opt.primary{border-color:rgba(61,205,184,.45);color:#3dcdb8;}#tlf-export .opt.ghost{border-color:transparent;color:#8b97a8;background:transparent;}";
    document.head.appendChild(style);
    const wrap=document.createElement("div"); wrap.id="tlf-export";
    wrap.innerHTML='<div class="back" data-export="cancel"></div><div class="sheet"><h3>Export card</h3><p>2.5 inch wide item card. Print it, or save a PDF.</p><button type="button" class="opt primary" data-export="png">Save PNG</button><button type="button" class="opt" data-export="print">Print card</button><button type="button" class="opt" data-export="pdf">Save PDF</button><button type="button" class="opt ghost" data-export="cancel">Cancel</button></div>';
    document.body.appendChild(wrap);
    wrap.addEventListener("click", function(e){
      const b=e.target.closest("[data-export]"); if(!b) return;
      const kind=b.getAttribute("data-export"), item=wrap._item; hideExport();
      if(!item || kind==="cancel") return; runExport(item, kind);
    });
  }
  function showExport(item){ ensureExportUi(); const wrap=document.getElementById("tlf-export"); wrap._item=item; wrap.classList.add("show"); }
  function hideExport(){ const wrap=document.getElementById("tlf-export"); if(wrap) wrap.classList.remove("show"); }
  function printCard(item){
    const canvas=renderCardCanvas(item), dim=cardInches(canvas), url=canvas.toDataURL("image/png");
    const title=String(item.name||"Loot card").replace(/[<>&]/g,"");
    const html="<!doctype html><html><head><meta charset='utf-8'><title>"+title+"</title><style>@page{size:"+dim.wIn+"in "+dim.hIn+"in;margin:0;}html,body{margin:0;padding:0;background:#fff;}img{width:"+dim.wIn+"in;height:"+dim.hIn+"in;display:block;}</style></head><body><img src='"+url+"' alt='card'></body></html>";
    let frame=document.getElementById("tlf-print-frame");
    if(frame) frame.remove();
    frame=document.createElement("iframe");
    frame.id="tlf-print-frame";
    frame.setAttribute("aria-hidden","true");
    frame.style.cssText="position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none;";
    document.body.appendChild(frame);
    frame.onload=function(){
      try{ frame.contentWindow.focus(); frame.contentWindow.print(); }
      catch(err){ toast("Could not open print dialog"); }
    };
    frame.srcdoc=html;
  }
  async function savePdf(item){
    const canvas=renderCardCanvas(item), dim=cardInches(canvas);
    downloadBlob(makePdf(canvasToJpeg(canvas,0.92), canvas.width, canvas.height, dim.wPt, dim.hPt), slug(item)+".pdf");
    toast("PDF saved");
  }
  async function savePng(item){
    downloadBlob(await canvasToBlob(renderCardCanvas(item)), fileName(item)); toast("Image saved");
  }
  async function runExport(item, kind){
    try{ if(kind==="png") return savePng(item); if(kind==="print") return printCard(item); if(kind==="pdf") return savePdf(item); }
    catch(e){ toast("Could not export card"); }
  }
  async function sharePlayerText(item){
    const text=formatPlayerText(item), title=item.name+" (Homebrew)";
    if(navigator.share){ try{ await navigator.share({title:title, text:text}); toast("Text sent"); return; }catch(e){ if(e&&e.name==="AbortError") return; } }
    toast((await copyText(text))?"Player text copied":"Couldn't copy");
  }
  function enhanceCard(card){
    if(!card || card.dataset.shareReady) return;
    const actions=card.querySelector(".card-actions"); if(!actions) return;
    card.dataset.shareReady="1";
    if(!actions.querySelector('[data-action="image"]')){
      const b=document.createElement("button"); b.type="button"; b.className="action-btn"; b.setAttribute("data-action","image"); b.textContent="Save / Print"; actions.appendChild(b);
    } else actions.querySelector('[data-action="image"]').textContent="Save / Print";
    const share=actions.querySelector('[data-action="share"]'); if(share) share.textContent="Text players";
  }
  document.addEventListener("click", function(e){
    const btn=e.target.closest('[data-action="share"],[data-action="copy"],[data-action="image"]');
    if(!btn) return;
    const card=btn.closest(".loot-card"), item=itemFromCard(card); if(!item) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    const act=btn.getAttribute("data-action");
    if(act==="copy"){
      copyText(formatPlayerText(item)).then(function(ok){
        toast(ok?"Player text copied":"Couldn't copy");
        if(ok){ btn.classList.add("copied"); const prev=btn.textContent; btn.textContent="Copied!"; setTimeout(function(){ btn.classList.remove("copied"); btn.textContent=prev; },1400); }
      }); return;
    }
    if(act==="share"){ sharePlayerText(item); return; }
    showExport(item);
  }, true);
  function scan(){ document.querySelectorAll(".loot-card").forEach(enhanceCard); }
  const mo=new MutationObserver(scan);
  if(document.body) mo.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener("DOMContentLoaded", function(){ mo.observe(document.body,{childList:true,subtree:true}); scan(); });
  scan();
})();
