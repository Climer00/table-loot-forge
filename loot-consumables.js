/* Table Loot Forge — consumables shim (pools in loot-potions.js / loot-scrolls.js) */
(function(g){
if(!g.TLF_potionItem||!g.TLF_tinctureItem||!g.TLF_scrollItem){
  console.error("TLF: load loot-potions.js and loot-scrolls.js before loot-consumables.js");
}
})(typeof window!=="undefined"?window:globalThis);
