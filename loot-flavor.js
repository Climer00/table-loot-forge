/* Table Loot Forge — description + lore pools */
(function(g){
/* —— Description (Look) pools by family —— */
const LOOK_GEAR={
  Weapon:[
    "The blade (or head) catches torchlight with a restless gleam, as if eager for the next swing. Leather wrapping on the grip is worn smooth by hands that never finished their stories.",
    "Fine etching crawls along the metal like frost-veins. When you turn it, the weight settles into your palm with unnatural balance — ready, almost listening.",
    "Old blood has stained the fuller in patterns that never quite wash out. A soft metallic note rings if you tap the edge against stone.",
    "The weapon feels slightly warmer than the room. Runes near the guard flare briefly whenever combat starts nearby."
  ],
  Armor:[
    "Plates (or layered hide) are fitted with a craftsman’s care: joints move without squeal. Dust in the seams glitters like powdered mica.",
    "The armor smells faintly of oil and rain. Embossed motifs — beasts, stars, or shields — shift with the light as you breathe.",
    "Scuffs from old battles remain, but polish still answers a cloth. Wearing it settles your shoulders as if someone else once stood taller in it.",
    "A lining of soft dyed cloth cushions the weight. At the collar, a maker’s knot of thread that won’t fray."
  ],
  Shield:[
    "The face is scarred by arrows and blades that never found flesh. A painted emblem has half-flaked away, leaving a ghost of heraldry.",
    "Wood (or metal) hums under a knuckle-tap. The strap is soft leather, replaced more recently than the rest.",
    "Edge binding is copper-bright; the boss has been hammered true. When raised, it seems to catch more light than it should.",
    "A charm of braided grass or wire hangs from the grip — someone’s luck, long overdue to be claimed."
  ],
  Helmet:[
    "The helm sits snug without pinching. Inside, padding smells of cedar and old smoke.",
    "Visor slits or cheek guards) frame your vision like a doorway. Tiny notches along the rim look like tally marks.",
    "Metal cools your temples. Engraving around the brow suggests eyes that watch the horizon for you.",
    "A plume-socket (empty) and a chin-strap buckle that still clicks cleanly. Dust motes dance in the eye-slits."
  ],
  Cloak:[
    "Heavy wool (or silk) drapes with a soft hush. The hem is stained by roads you haven’t walked yet.",
    "Lining is a darker shade than the shell; when you flip it, colors drink the lantern light.",
    "A clasp shaped like a leaf, fang, or coin holds firm. The fabric smells of pine resin and night air.",
    "Threads catch the light in a faint shimmer, as if mist were woven into the weave."
  ],
  Necklace:[
    "The pendant rests cold against skin, then slowly matches your warmth. Chain links are uneven — handmade, not mint-perfect.",
    "A stone or charm at the center seems to hold a tiny storm of color when you tilt it.",
    "Soft leather cord (or fine metal) leaves a pale line on the neck after long wear. It ticks faintly against armor.",
    "Etching on the back is a prayer, a map scrap, or a name half-filed away."
  ],
  Ring:[
    "The band is slightly irregular, shaped by a hammer rather than a mold. It slides on with a quiet finality.",
    "A set stone (or seal face) flashes when you gesture. Inside the band, a whisper-thin inscription.",
    "Metal tastes of copper if you touch it to your tongue. It never quite warms to room temperature.",
    "Edges are smooth from years of nervous turning. It feels heavier than its size suggests."
  ],
  Gloves:[
    "Leather creaks softly; knuckles are reinforced with discreet plates or stitching. Fingers flex without drag.",
    "Palms are scored by rope and steel. The lining is fleece-warm or silk-cool depending on the hour.",
    "A faint scent of oil and crushed herbs clings to the cuffs. Clasps close with a neat click.",
    "Embroidery along the wrists looks like wards — or just vanity that survived a dozen owners."
  ],
  Belt:[
    "The buckle is heavier than it looks. Pouches and loops hang ready for tools you haven’t packed yet.",
    "Leather is dark with oil; stitching is tight and proud. It cinches with a satisfying pull.",
    "A secondary strap holds a charm or empty sheath. The smell is tannery and travel dust.",
    "Metal fittings refuse rust. When worn, your posture settles — as if the belt remembers how heroes stand."
  ],
  Boots:[
    "Soles are thick but quiet on stone. The uppers hug the ankle without biting.",
    "Mud ghosts linger in the stitching. Laces (or buckles) have been replaced more than once.",
    "Warm lining waits for cold roads. A faint jingle of a hidden coin or charm answers each step.",
    "Toe caps show honest wear. Standing in them, your balance feels a half-step surer."
  ]
};
const LOOK_SCROLL=[
  "Rolled vellum tied with a faded ribbon. Ink smells of iron and candle soot; the script leans as if written in a hurry.",
  "A stiff scroll-case of lacquered wood. Inside, glyphs shimmer when the case opens, then settle into readable lines.",
  "Edges are singed; the center is pristine. A wax seal bears a symbol no local temple claims.",
  "The parchment is cool and slightly damp, like cave air. Reading it aloud raises the hair on your arms."
];
const LOOK_POTION=[
  "A thick glass vial with a cork wired shut. Liquid swirls with slow ribbons of color that never fully mix.",
  "Stopper shaped like a bead or tooth. The brew catches light like gemstone dust suspended in syrup.",
  "Label half-peeled; only a warning glyph remains. Warmth pulses faintly through the glass when held.",
  "A leather sleeve protects the bottle. Uncorked, it smells of spice, ozone, and something sweetly wrong."
];
const LOOK_TINCTURE=[
  "A slim dropper-vial no larger than a finger. Herbal sediment settles at the bottom like green snow.",
  "Wax-dipped neck; a tiny paper tag names the dose in a cramped hand. The liquid is thin and bright.",
  "Smells of crushed mint and bitter root. A single sip’s worth — no more — waits inside.",
  "Glass is green-tinted; the cork is branded with a leaf. It clinks softly against a healer’s kit."
];

/* —— Lore fragments: origin + rumor + quirk (compose 2–3 sentences) —— */
const LORE_ORIGIN={
  _any:[
    "Forged in a roadside forge that vanished overnight.",
    "Pulled from a chest that refused to stay shut.",
    "Recovered from a flooded vault beneath a collapsed shrine.",
    "Traded across three borders for a promise no one kept.",
    "Commissioned by a captain who never returned from the last march.",
    "Found wrapped in a map that leads nowhere useful.",
    "Lifted from a museum case during a blackout that lasted one song.",
    "Gifted by a dying scout who smiled as if the debt were paid."
  ],
  Weapon:["Quenched in rainwater collected on a battlefield.","Smith-blessed with a prayer that cuts both ways.","First swung in a duel that ended before blood hit the dust."],
  Armor:["Fitted to a hero whose name the bards argue about.","Riveted under a blue moon by a guild that no longer exists.","Taken off a mannequin in a sealed armory."],
  Shield:["Painted for a house whose banners burned last winter.","Carried through a siege that never made the histories.","Hung above a tavern hearth until the hearth went cold."],
  Helmet:["Worn by a watch captain who saw too many dawns.","Pulled from a barrow where the dead slept lightly.","Cast from metal scrap of a fallen bell."],
  Cloak:["Woven on a loom that only works in fog.","Stolen from a stage costume and never returned.","Dyed with ash from a city that rebuilt itself."],
  Necklace:["Strung with beads from a river that changed course.","Blessed (or cursed) at a roadside shrine.","Last heirloom of a family that forgot its own crest."],
  Ring:["Cut from a coin of a mint that never was.","Slipped onto a finger in a dream that left a mark.","Sealed a pact spoken in a language both parties pretended to know."],
  Gloves:["Sewn for a climber who vanished mid-ascent.","Oiled with a recipe sold only at midnight markets.","Won in a wager over a locked door."],
  Belt:["Buckle cast from a shattered sword.","Cinched a diplomat through three failed treaties.","Found coiled like a snake beside an empty camp."],
  Boots:["Walked a pilgrimage route scrubbed from modern charts.","Resoled by a cobbler who charged in secrets.","Left outside a circle of standing stones at dawn."],
  Scroll:["Copied by a scribe who refused to sleep until it was done.","Smuggled in a hollow bone past three checkpoints.","Ink mixed with ash from a burned spellbook."],
  Potion:["Brewed in a copper still that sings when the moon is high.","Bottled during a thunderstorm that never touched the ground.","Recipe torn from a herbalist’s private ledger."],
  Tincture:["Steeped from herbs gathered on the wrong side of a ward-line.","Measured drop by drop by an apothecary with shaking hands.","Labelled in a cipher only healers bother to learn."]
};
const LORE_RUMOR={
  _any:[
    "Locals claim it hums before storms.",
    "A tavern rumor says three owners died smiling.",
    "Street prophets say it chooses who may keep it.",
    "Someone offered a kingdom’s ransom and left empty-handed.",
    "A faded tag reads: return if you survive.",
    "Bards disagree whether it brings luck or collects it.",
    "A wanted poster once mentioned it by a different name.",
    "Children dare each other to touch it and count to ten."
  ],
  Common:["Most folk shrug it off as junk with a story.","It turns up in pawn shops more often than it should."],
  Uncommon:["Collectors quietly ask after pieces like this.","A guild apprentice swore it saved their life once."],
  Rare:["Rumor puts a duke’s agent on the trail.","Temples debate whether to sanctify or sequester it."],
  "Very Rare":["Whole companies have broken apart arguing over who should carry it.","A sage’s letter warns: power this deep leaves fingerprints on fate."],
  Legendary:["Prophecies mention something that matches this description too closely.","Kings have started wars for less — and ended them for the same."]
};
const LORE_QUIRK={
  _any:[
    "Still warm, as if it remembers the last fight.",
    "Smells faintly of rain on hot iron.",
    "The maker’s mark is a coin with no mint.",
    "Blessed by someone who no longer believes in gods.",
    "Scratched with traveler’s tally marks — none recent.",
    "A soft tick answers nearby magic, like a clock finding time.",
    "Dust never quite settles on it.",
    "In absolute silence you can almost hear a heartbeat."
  ],
  Weapon:["The edge never dulls in story — only in practice, stubbornly.","It rings a clear note when drawn near lies."],
  Armor:["Joints never squeak, even after mud and salt.","Wearers report dreams of standing watch."],
  Shield:["Arrows that miss leave no scratch on the paint.","It feels lighter when raised for someone else."],
  Helmet:["Whispers of wind inside even on still days.","You notice more exits than you used to."],
  Cloak:["Hem never quite gets soaked through.","Shadows linger a second longer beneath it."],
  Necklace:["Pulse in the pendant syncs with yours after a minute.","It grows faintly warm near betrayal."],
  Ring:["Turns itself slightly when danger approaches.","Leaves a pale band that fades slowly."],
  Gloves:["Fingertips tingle before a climb or a catch.","They never fully dry after rain — and never mildew."],
  Belt:["Buckle warms when you steel yourself to speak.","Pouches seem to hold one extra coin overnight."],
  Boots:["Steps sound softer to enemies than to friends.","They always find the dry path through dew."],
  Scroll:["Ink rearranges if you look away too long.","The case refuses to open for the unworthy — or the impatient."],
  Potion:["Sediment forms a tiny constellation, then dissolves.","Uncorked, candles nearby lean toward it."],
  Tincture:["One drop stains cloth the color of new leaves.","The taste is gone before you can name it."]
};


g.TLF_LOOK_GEAR=LOOK_GEAR;g.TLF_LOOK_SCROLL=LOOK_SCROLL;g.TLF_LOOK_POTION=LOOK_POTION;g.TLF_LOOK_TINCTURE=LOOK_TINCTURE;
g.TLF_LORE_ORIGIN=LORE_ORIGIN;g.TLF_LORE_RUMOR=LORE_RUMOR;g.TLF_LORE_QUIRK=LORE_QUIRK;
})(typeof window!=="undefined"?window:globalThis);
