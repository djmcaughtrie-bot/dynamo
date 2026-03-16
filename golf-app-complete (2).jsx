import { useState } from "react";

/* ─── TOKENS ─────────────────────────────────────────────────────────────────
   Blue header: #a3c5e9   Maroon CTA: #7b003a   Yellow accent: #ffe500
   Blue2: #95bfe5         White: #ffffff
──────────────────────────────────────────────────────────────────────────── */
const C = {
  headerBg: "#a3c5e9",
  headerBg2: "#95bfe5",
  maroon:   "#7b003a",
  yellow:   "#ffe500",
  white:    "#ffffff",
  bg:       "#f4f8fd",
  ink:      "#1c1c2e",
  sub:      "#596070",
  muted:    "#8a95a8",
  border:   "#d5e6f5",
  cardBg:   "#ffffff",
  navBg:    "#ffffff",
};

const serif  = { fontFamily:"'Bebas Neue','Impact','Arial Narrow',sans-serif", letterSpacing:"0.04em" };
const body   = { fontFamily:"'DM Sans','Helvetica Neue','Arial',sans-serif" };

const pg = { minHeight:"100vh", background:C.bg, color:C.ink, ...body };

const card = (border = C.border) => ({
  background: C.white,
  border: `1.5px solid ${border}`,
  borderRadius: 12,
  padding: "0.9rem 1rem",
});

const maroonBtn = {
  background: C.maroon,
  border: "none",
  borderRadius: 10,
  padding: "0.85rem 1.5rem",
  color: C.white,
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "1rem",
  width: "100%",
  ...serif,
};

const yellowBtn = {
  background: C.yellow,
  border: "none",
  borderRadius: 10,
  padding: "0.85rem 1.5rem",
  color: C.maroon,
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "1rem",
  width: "100%",
  ...serif,
};

const smBtn = {
  background: "transparent",
  border: `1.5px solid ${C.border}`,
  color: C.sub,
  borderRadius: 8,
  padding: "0.35rem 0.85rem",
  cursor: "pointer",
  fontSize: "0.8rem",
  ...body,
};

const lbl = {
  fontSize: "0.67rem",
  color: C.maroon,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  fontWeight: 700,
  ...body,
};

const divLine = {
  height: 3,
  background: `linear-gradient(to right, ${C.maroon}, ${C.headerBg})`,
  borderRadius: 2,
  margin: "0 0 1.35rem",
};

const inputS = {
  background: C.white,
  border: `1.5px solid ${C.border}`,
  borderRadius: 8,
  padding: "0.6rem 0.85rem",
  color: C.ink,
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  ...body,
};

const diffPal = {
  Beginner:     { bg:"#e6f4ee", text:"#1b6b3a" },
  Intermediate: { bg:"#fff5d6", text:"#7a5000" },
  Advanced:     { bg:"#fce8ef", text:C.maroon },
};

/* ─── PAGE HEADER ─────────────────────────────────────────────────────────── */
function PageHeader({ title, subtitle, onBack, right }) {
  return (
    <div style={{ background: C.headerBg, padding: "0 1.25rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"1rem", paddingBottom: subtitle ? "0.4rem" : "1rem" }}>
          {onBack
            ? <button onClick={onBack} style={{ ...smBtn, background:C.white+"cc", borderColor:"transparent" }}>← Back</button>
            : <div />}
          {right || <div />}
        </div>
        {title && (
          <div style={{ paddingBottom:"1.1rem" }}>
            <h1 style={{ ...serif, fontSize:"2.2rem", color:C.maroon, margin:"0 0 0.15rem", lineHeight:1.1 }}>{title}</h1>
            {subtitle && <p style={{ color:C.maroon+"bb", fontSize:"0.9rem", margin:0, ...body }}>{subtitle}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SHOT DATA ──────────────────────────────────────────────────────────── */
const SHOTS = [
  { id:"fade", name:"Fade", cat:"Shape", icon:"↗", sub:"Controlled left-to-right flight", diff:"Intermediate",
    setup:{ ballPosition:"Half ball forward of standard", stance:"Open — feet left of target", weight:"50/50", grip:"Slightly weakened" },
    clubface:"Aimed at target — open relative to swing path", swingPath:"Out-to-in relative to target along foot line",
    swingThought:'"Swing left, hold the face open"', tempo:"Smooth and controlled",
    range:["Pick a target 10 yards right, land on it","Rehearse open stance before each rep","Smooth outside-in path — not a wristy flip"],
    course:["Use when pin is tucked right or OB is left","Club up — fades fly shorter","Aim left of your final target"],
    watchOut:"Opening face too much = slice. Keep face square to target, not your feet." },
  { id:"draw", name:"Draw", cat:"Shape", icon:"↖", sub:"Powerful right-to-left flight", diff:"Intermediate",
    setup:{ ballPosition:"Half ball back of standard", stance:"Closed — feet right of target", weight:"55% trail", grip:"Strengthened — both hands clockwise" },
    clubface:"Aimed at target — closed relative to swing path", swingPath:"In-to-out relative to target along foot line",
    swingThought:'"Attack from the inside, release through"', tempo:"Slightly aggressive through the ball",
    range:["Tee higher to encourage upward strike","Trail elbow drops close to hip","Exaggerate closed stance to feel the path"],
    course:["Use when pin is tucked left or hole bends left","Draws roll — account for extra run","Play away from right-side trouble"],
    watchOut:"Over-rotating hands = snap hook." },
  { id:"hook", name:"Hook", cat:"Shape", icon:"↰", sub:"Sharp right-to-left curve", diff:"Advanced",
    setup:{ ballPosition:"Back of center", stance:"Significantly closed", weight:"60% trail", grip:"Very strong — both hands well clockwise" },
    clubface:"Closed to path", swingPath:"Aggressive in-to-out, full hip rotation and early release",
    swingThought:'"Roll the forearms hard through"', tempo:"Fast, aggressive — commit fully",
    range:["Feel trail forearm rolling over lead through impact","Swing well right with aggressive release"],
    course:["Curve around trees or sharp dogleg left","Hooks run — plan for significant rollout"],
    watchOut:"Half-measures go straight left. Commit fully or play a draw." },
  { id:"slice", name:"Intentional Slice", cat:"Shape", icon:"↱", sub:"Severe left-to-right curve", diff:"Advanced",
    setup:{ ballPosition:"Forward — off lead heel", stance:"Wide open — feet far left", weight:"50/50", grip:"Very weak — both hands counterclockwise" },
    clubface:"Open significantly — pointing right of target", swingPath:"Steep outside-in, cutting across ball",
    swingThought:'"Cut across — like slicing butter"', tempo:"Controlled — path creates curve, not speed",
    range:["Exaggerate open stance, feel out-to-in path","Try with 7-iron first"],
    course:["Only when obstacle sits directly in your line","Club up 2+ clubs — significant distance loss"],
    watchOut:"Requires even more open face and path than you think." },
  { id:"punch", name:"Punch", cat:"Control", icon:"→", sub:"Low boring flight under the wind", diff:"Intermediate",
    setup:{ ballPosition:"2 balls back of center", stance:"Slightly narrower", weight:"60% lead — stay there", grip:"Choke down 1 inch, hands forward" },
    clubface:"Square — forward press de-lofts naturally", swingPath:"Three-quarter backswing, firm lead wrist through",
    swingThought:'"Hands lead, club follows — quiet finish"', tempo:"Controlled and abbreviated",
    range:["Set shaft leaning toward target","Finish at hip height","Hit into headwind to see flight flatten"],
    course:["Club up 1–2 clubs","Perfect under wind or tree branches","Commit — half-hearted punches come out fat"],
    watchOut:"If ball goes high, weight shifted back. Keep lead side heavy." },
  { id:"knockdown", name:"Knockdown", cat:"Control", icon:"↓", sub:"Flight-controlled into the wind", diff:"Intermediate",
    setup:{ ballPosition:"1 ball back of standard", stance:"Standard width", weight:"55% lead", grip:"Slightly firmer" },
    clubface:"Square", swingPath:"Full backswing, three-quarter follow-through",
    swingThought:'"Swing through — hold the finish quiet"', tempo:"Smooth — not rushed",
    range:["Hit toward headwind to see flight flatten","Finish hands below shoulder height"],
    course:["Strong headwinds and under trees","More reliable than punch for longer irons"],
    watchOut:"Excess speed kills the flight. Smooth wins." },
  { id:"stinger", name:"Stinger", cat:"Control", icon:"⚡", sub:"Penetrating low bullet off the tee", diff:"Advanced",
    setup:{ ballPosition:"2 inches back of standard tee position", stance:"Slightly narrower, tee lower", weight:"55% lead", grip:"Standard — firm and even" },
    clubface:"Square", swingPath:"Full turn, steep compression down and through",
    swingThought:'"Cover the ball, hold the finish low"', tempo:"Aggressive but controlled",
    range:["Learn with 2-iron or hybrid before driver","Feel trapping ball against turf"],
    course:["Under wind or finding a tight fairway","Position over distance"],
    watchOut:"Tiger's shot. Don't debut it under pressure." },
  { id:"chip", name:"Chip & Run", cat:"Short Game", icon:"◌", sub:"Low running shot from around the green", diff:"Beginner",
    setup:{ ballPosition:"Back of stance", stance:"Narrow, slightly open. Flare lead foot.", weight:"70–80% lead", grip:"Choke down. No angle in lead wrist." },
    clubface:"Square", swingPath:"Rotate around lead side — grip butt points at lead hip at finish.",
    swingThought:'"Rotate around left side"', tempo:"Smooth and even",
    range:["Grip butt points at lead hip at finish","7i rolls most, PW rolls least","Land on specific spot 3 feet onto green"],
    course:["Default when you have green to work with","Land just onto putting surface","More green = less loft. Less green = more loft."],
    watchOut:"Lead wrist must never break down. Hands lead always." },
  { id:"pitch", name:"Pitch", cat:"Short Game", icon:"△", sub:"Mid-height 20–80 yard approach", diff:"Beginner",
    setup:{ ballPosition:"Center to slightly forward", stance:"Slightly open, narrower", weight:"55% lead", grip:"Choke down slightly" },
    clubface:"Square or slightly open", swingPath:"Wrists hinge on backswing. Lead hands through — hold the angle.",
    swingThought:'"Hinge back — carry the tray through"', tempo:"Even rhythm",
    range:["Pause at top — check wrists are hinged","Hit to 20, 30, 40, 50 yard targets","Divot starts after the ball"],
    course:["Carry rough or bunker to reach the pin","Lands softer than chip"],
    watchOut:"Scooping at impact. Hands must lead clubhead through." },
  { id:"flop", name:"Flop", cat:"Short Game", icon:"☁", sub:"Maximum height from a tight lie", diff:"Advanced",
    setup:{ ballPosition:"Forward — outside lead heel", stance:"Wide, open — feet 25–30° left", weight:"50/50", grip:"Open face FIRST — face to sky — THEN grip." },
    clubface:"Dramatically open — face looking at sky", swingPath:"Full swing along foot line. Face slides under ball.",
    swingThought:'"Under and through — commit fully"', tempo:"Full, committed — never decelerate",
    range:["Practise from fluffy rough before tight lies","20+ flops before trusting on course"],
    course:["ONLY when necessary — tight lie, no wind, lob wedge","R1 or R2 nearly always safer"],
    watchOut:"Decelerating = skull, shank, or chunk. Commit or don't hit it." },
  { id:"bunker", name:"Greenside Bunker", cat:"Short Game", icon:"◡", sub:"Splash shot from greenside sand", diff:"Intermediate",
    setup:{ ballPosition:"Forward — off lead heel", stance:"Wide, open, dig feet in", weight:"60% lead", grip:"Open face first, then grip" },
    clubface:"Open — face looking at sky", swingPath:"Swing along foot line. Enter sand 2 inches behind ball.",
    swingThought:'"Splash the sand — ball rides out"', tempo:"Near-full swing — accelerate through",
    range:["Draw a line — practise entering behind it","Finish high — quitting leaves club in sand"],
    course:["Sand or lob wedge only","Pick landing spot on green, not the hole"],
    watchOut:"Most amateurs swing too short. Near-full swing required." },
  { id:"uphill", name:"Uphill Lie", cat:"Specialty Lie", icon:"⬆", sub:"Ball on an upward slope", diff:"Intermediate",
    setup:{ ballPosition:"Forward — toward high side", stance:"Tilt spine to match slope", weight:"Favour trail foot", grip:"Standard" },
    clubface:"Aim slightly right", swingPath:"Follow the slope — swing up the hill",
    swingThought:'"Swing with the slope"', tempo:"Smooth",
    range:["Club down — uphill adds effective loft","Aim right — shot draws/pulls left"],
    course:["Club down 1–2 clubs","Aim right of target"],
    watchOut:"Not adjusting aim = every shot pulls left." },
  { id:"downhill", name:"Downhill Lie", cat:"Specialty Lie", icon:"⬇", sub:"Ball on a downward slope", diff:"Intermediate",
    setup:{ ballPosition:"Back — toward low side", stance:"Tilt into the slope", weight:"More on lead foot", grip:"Standard" },
    clubface:"Aim slightly left", swingPath:"Follow slope — swing down the hill",
    swingThought:'"Chase the ball down the slope"', tempo:"Controlled",
    range:["Club up — downhill reduces effective loft","Aim left — shot fades/pushes right"],
    course:["Club up 1–2 clubs","Ball runs more on landing"],
    watchOut:"Falling back into the hill mid-swing." },
  { id:"rough", name:"Rough Escape", cat:"Specialty Lie", icon:"🌿", sub:"Getting out of thick rough", diff:"Intermediate",
    setup:{ ballPosition:"Middle of stance", stance:"Slightly open", weight:"60% lead", grip:"Firm — rough closes the face" },
    clubface:"Slightly open", swingPath:"Steeper downswing — avoid grass grabbing hosel",
    swingThought:'"Grip firm, go steep, trust the exit"', tempo:"Aggressive",
    range:["Open face at address to pre-compensate","Heavy rough distance drops 20–40%"],
    course:["Priority: get back in play","Aim for widest part of fairway"],
    watchOut:"Decelerating through rough. Commit fully." },
];

/* ─── 3 RELEASES ─────────────────────────────────────────────────────────── */
const RELEASES = [
  { id:1, name:"Release 1", sub:"Chip & Run", tagline:"No wrist release — the foundation shot",
    color:C.maroon, icon:"①",
    principle:"Butt of grip points at lead hip in follow-through. Hands lead. Club follows. Always.",
    feels:"Like a long putting stroke — rock the shoulders, arms follow, no independent hand action.",
    when:"Any time you have green between you and the hole and no obstacle to carry. Default here first.",
    shots:[
      { id:"r1a", name:"Standard Chip & Run", icon:"◌", diff:"Beginner", sub:"Your go-to shot around the green",
        setup:{ ballPosition:"Back of stance", stance:"Narrow, flare lead foot", weight:"Favour lead side", grip:"Choke to bottom. Lift handle — no angle in lead wrist." },
        clubface:"Square", swingPath:"Rotate around lead side pivot. Grip butt points at lead hip at finish.",
        swingThought:'"Rotate around the left side"', tempo:"Same pace back and through.",
        range:["Grip butt points at lead hip at finish — check every shot","7i rolls most, PW rolls least","Pick landing spot 3 feet onto green"],
        course:["No obstacle = Release 1. Always.","Land just onto putting surface","More green = less loft. Less green = more loft."],
        watchOut:"Lead wrist breaks down = ball pops up." },
      { id:"r1b", name:"Long Chip (20–30m)", icon:"→", diff:"Beginner", sub:"Extended chip from further off the green",
        setup:{ ballPosition:"Middle-back of stance", stance:"Slightly wider but still narrow", weight:"60–65% lead", grip:"Choke down — build in a touch more length" },
        clubface:"Square", swingPath:"Longer arm swing, shoulder-controlled.",
        swingThought:'"Long smooth putting stroke"', tempo:"Slightly longer — same even rhythm",
        range:["7-iron maximises roll and control","Common error: wrist hinge — avoid"],
        course:["Beats a pitch from 20–30 yards off a firm green","Trust it — amateurs panic and flip from long range"],
        watchOut:"Length tempts wrist hinge. Keep lead wrist flat throughout." },
      { id:"r1c", name:"Chip from Tight Lie", icon:"▬", diff:"Intermediate", sub:"Release 1 from hardpan or closely mown turf",
        setup:{ ballPosition:"Slightly further back", stance:"Narrow as normal", weight:"65% lead", grip:"Choke down firmly." },
        clubface:"Square or slightly de-lofted — do NOT open on tight lie", swingPath:"Slightly steeper — pick the ball cleanly",
        swingThought:'"Nip it — don\'t dig it"', tempo:"Controlled and deliberate",
        range:["Lower-lofted club more forgiving from tight turf","Focus on front edge of ball"],
        course:["Don't attempt a flop from a tight lie","Smooth tempo is everything"],
        watchOut:"Opening the face on a tight lie = thin shot." },
    ] },
  { id:2, name:"Release 2", sub:"Soft Landing / Pitch", tagline:"Hinge and hold — the versatile mid-shot",
    color:"#935200", icon:"②",
    principle:"Hinge the wrists going back, then lead the hands through. Hold the angle — don't flip.",
    feels:"Like carrying a tray with your lead hand — wrists hinge back, then stay firm and carry through.",
    when:"When you need to carry an obstacle, land the ball shorter, or control a 20–80 yard approach.",
    shots:[
      { id:"r2a", name:"Standard Pitch", icon:"△", diff:"Beginner", sub:"The core Release 2 — 20 to 80 yards",
        setup:{ ballPosition:"Center to slightly forward", stance:"Slightly open, narrower", weight:"55% lead", grip:"Choke down slightly" },
        clubface:"Square", swingPath:"Wrists hinge going back. Lead hands pull through — hold angle.",
        swingThought:'"Hinge back — carry the tray through"', tempo:"Even rhythm — don't rush transition",
        range:["Pause at top — check wrists are hinged","Hit to 20, 30, 40, 50 yard targets","Divot must start after the ball"],
        course:["Use when you need to carry rough or a bunker","Vary distance with swing length, not speed"],
        watchOut:"Scooping — hands must lead clubhead through." },
      { id:"r2b", name:"High vs Low Pitch", icon:"↕", diff:"Intermediate", sub:"Controlling trajectory with Release 2",
        setup:{ ballPosition:"Forward = higher. Back = lower.", stance:"Slightly open", weight:"55–60% lead", grip:"Standard choke down" },
        clubface:"Slightly open for high. Square for standard.", swingPath:"Same Release 2 motion. Ball position creates trajectory.",
        swingThought:'"Ball position controls height — not the hands"', tempo:"Same rhythm for both",
        range:["High: ball forward, open face slightly","Low: ball back, hands forward","Practice hitting same distance at two heights"],
        course:["High pitch: pin is close, need ball to stop quickly","Low pitch: into wind or more green to work with"],
        watchOut:"Trying to help ball up causes a flip. Open face and trust the loft." },
      { id:"r2c", name:"Checking Pitch", icon:"⟳", diff:"Intermediate", sub:"Generating spin to stop ball quickly",
        setup:{ ballPosition:"Center", stance:"Slightly open", weight:"60% lead", grip:"Standard — clean grooves essential" },
        clubface:"Square — spin comes from clean contact, not open face", swingPath:"Steep descending blow. Ball first, then turf.",
        swingThought:'"Strike down — let the grooves do the work"', tempo:"Aggressive downswing",
        range:["Clean grooves before practising","From rough: no spin — plan for ball to release"],
        course:["Works best: clean lie, firm greens, 50–80 yards","From rough: play to middle of green"],
        watchOut:"Opening face and sliding under = kills spin." },
    ] },
  { id:3, name:"Release 3", sub:"Lob & Bunker", tagline:"Full release — height, softness, and sand",
    color:"#a03020", icon:"③",
    principle:"The clubface passes through under the ball. Hands release fully. Speed and loft together.",
    feels:"Like throwing a frisbee low under something. The face passes through and under — full release.",
    when:"Maximum height over an obstacle, very soft landing, or escaping a greenside bunker.",
    shots:[
      { id:"r3a", name:"Lob Shot", icon:"⌒", diff:"Intermediate", sub:"High, soft-landing shot with lob wedge",
        setup:{ ballPosition:"Slightly forward of center", stance:"Slightly open", weight:"50/50", grip:"Standard — soft hands allow the release" },
        clubface:"Square to slightly open — trust the 60° loft", swingPath:"Full hinge back. Full release through.",
        swingThought:'"Hinge fully, release fully — trust the loft"', tempo:"Smooth acceleration",
        range:["NOT the same as a flop — trust 60°","Feel the difference between holding (R2) and releasing (R3)"],
        course:["20–60 yards when ball needs to land and stop","Short-sided pins over bunker or rough"],
        watchOut:"Half-commitment produces worst results. Full release needs full commitment." },
      { id:"r3b", name:"Flop Shot", icon:"☁", diff:"Advanced", sub:"Maximum height from tight lie",
        setup:{ ballPosition:"Forward — outside lead heel", stance:"Wide, open — feet 25–30° left", weight:"50/50", grip:"Open face to sky FIRST — THEN grip." },
        clubface:"Dramatically open — face pointing skyward", swingPath:"Full swing along foot line. Full release.",
        swingThought:'"Under and through — commit fully"', tempo:"Bigger, fuller swing than you think. Never decelerate.",
        range:["Fluffy rough before tight lies","Open face BEFORE gripping"],
        course:["ONLY: tight lie, no wind, lob wedge, no better option","R1 or R2 nearly always safer"],
        watchOut:"Decelerating with open face = skull, shank, or chunk." },
      { id:"r3c", name:"Greenside Bunker", icon:"◡", diff:"Intermediate", sub:"Classic Release 3 splash shot",
        setup:{ ballPosition:"Forward — off lead heel", stance:"Wide, open, dig feet in", weight:"60% lead", grip:"Open face first, THEN grip" },
        clubface:"Open — face at sky", swingPath:"Swing along foot line. Enter sand 2 inches behind ball.",
        swingThought:'"Splash the sand — ball rides out"', tempo:"Near-full swing — accelerate through",
        range:["Draw line in sand — enter behind it every time","Finish high — quitting leaves club in sand"],
        course:["Sand or lob wedge only","Pick landing spot on green, not hole"],
        watchOut:"Most amateurs take too short a swing. Near-full swing required." },
      { id:"r3d", name:"Plugged Bunker", icon:"⬤", diff:"Advanced", sub:"Fried egg — different Release 3",
        setup:{ ballPosition:"Back of center", stance:"Square or slightly closed", weight:"60% lead", grip:"Close the face — opposite of normal bunker" },
        clubface:"Square to slightly closed — leading edge digs", swingPath:"Steep V-shaped — chop down. Minimal follow-through.",
        swingThought:'"Chop into the sand behind it"', tempo:"Aggressive steep downswing",
        range:["Completely different to standard bunker","Ball comes out lower, runs more"],
        course:["Accept lower flight and more roll","Successful escape to anywhere on green is a win"],
        watchOut:"Using open-face splash on a plugged ball makes it worse." },
    ] },
];

/* ─── GRIP DATA ──────────────────────────────────────────────────────────── */
const GRIP_FOUNDATIONS = [
  { id:"neutral", name:"Neutral Grip", icon:"🎯",
    desc:"Both hands work together with equal influence. The V's formed between thumb and forefinger on both hands point toward your right shoulder (for a right-handed player). Produces a neutral ball flight — neither draw nor fade biased.",
    howTo:["Place left hand on grip so the handle runs diagonally across the base of the fingers — not the palm","Wrap fingers around, thumb sitting just right of centre on top of the grip","V between thumb and forefinger points to right shoulder","Right hand comes in from below, fingers curling under the grip","Right thumb sits just left of centre, covering the left thumb","Right hand V mirrors the left — also pointing to right shoulder"],
    ballFlight:"Straight to slight natural shape. Starting point for all grip adjustments." },
  { id:"strong", name:"Strong Grip", icon:"↖",
    desc:"Both hands rotated clockwise (away from target). V's point well right of the right shoulder. Promotes a draw or hook by encouraging the club face to close through impact. Most amateurs who fight a slice benefit from strengthening slightly.",
    howTo:["Rotate left hand clockwise — you should see 3 or more knuckles when looking down at address","Left thumb moves further around the right side of the grip","Right hand also rotates clockwise — V points well right, outside right shoulder","Both hands feel 'more under' the grip than in a neutral position"],
    ballFlight:"Promotes right-to-left ball flight. Reduces a slice. Overdone = hook." },
  { id:"weak", name:"Weak Grip", icon:"↗",
    desc:"Both hands rotated anti-clockwise (toward target). V's point toward chin or left shoulder. Promotes a fade by encouraging the clubface to stay open through impact. Used intentionally by players who want to flight the ball left-to-right.",
    howTo:["Rotate left hand anti-clockwise — only 1 or 2 knuckles visible at address","Left thumb moves to the top or left side of the grip","Right hand also rotates anti-clockwise — V points toward chin or left shoulder","Both hands feel 'more on top' of the grip"],
    ballFlight:"Promotes left-to-right ball flight. Reduces a hook. Overdone = big fade or slice." },
];

const GRIP_TYPES = [
  { id:"overlap", name:"Vardon (Overlapping)", icon:"🤝", popular: true,
    desc:"The most common grip in golf. The little finger of the right hand sits on top of or between the index and middle finger of the left hand. Promotes unity between the hands.",
    whoFor:"Most adult golfers with average to large hands. The standard choice.",
    pros:["Encourages hands to work as a single unit","Reduces right-hand dominance","Natural feel for most golfers"],
    cons:["May feel insecure for golfers with smaller hands","Less suitable if you have arthritis or hand pain"] },
  { id:"interlock", name:"Interlocking", icon:"🔗", popular: true,
    desc:"The little finger of the right hand interlocks with the index finger of the left hand. Creates a very secure connection between the hands. Used by Tiger Woods and Jack Nicklaus.",
    whoFor:"Golfers with smaller hands, juniors, or anyone who feels the overlapping grip is insecure.",
    pros:["Very secure — hands can't separate","Good for smaller hands","Feels tight and controlled"],
    cons:["Can feel uncomfortable for some","Fingers can put pressure on each other and cause tension"] },
  { id:"baseball", name:"Ten Finger (Baseball)", icon:"⚾",
    desc:"All ten fingers on the grip — no overlap or interlock. The right little finger sits flush against the left index finger. The simplest grip.",
    whoFor:"Beginners, juniors, seniors, or golfers with hand/wrist pain.",
    pros:["Easiest to learn","More comfortable for arthritis sufferers","Can increase grip pressure without tension"],
    cons:["Hands may work independently rather than as a unit","Less widely used on tour — less coaching support"] },
];

const GRIP_CHECKLIST = [
  { id:"c1", step:"Left hand placement", check:"Handle runs across base of fingers, not palm. Diagonal from little finger to middle of index finger.", cue:"Hold the club up and let gravity pull it into your fingers — not your palm." },
  { id:"c2", step:"Left thumb position", check:"Sits just right of centre on top of grip. Not straight down the middle.", cue:"Some call this the 'short thumb' — don't let it stretch too far down." },
  { id:"c3", step:"Left hand V", check:"V between left thumb and forefinger points to right shoulder (neutral).", cue:"Look down at address — can you see 2–3 knuckles on your left hand?" },
  { id:"c4", step:"Right hand placement", check:"Fingers curl under the grip. Right palm faces target at address.", cue:"Right hand should feel like it's 'shaking hands' with the club, not wrapping over it." },
  { id:"c5", step:"Right thumb position", check:"Sits just left of centre, partially covering the left thumb.", cue:"The 'trigger finger' position — right index finger sits apart slightly from the others." },
  { id:"c6", step:"Right hand V", check:"V points in same direction as left hand V (to right shoulder for neutral).", cue:"Both V's should be parallel — this is your grip strength indicator." },
  { id:"c7", step:"Grip pressure", check:"5–6 out of 10. Firm but not tight. You should feel the weight of the clubhead.", cue:"Hold the club as you'd hold a tube of toothpaste without squeezing paste out." },
  { id:"c8", step:"Connection between hands", check:"No gap between hands. They work as one unit.", cue:"Right palm lightly covers left thumb. Hands touching throughout." },
];

const GRIP_TROUBLESHOOTING = [
  { problem:"Slicing (left-to-right for right-handers)", cause:"Grip too weak — clubface open at impact.", fix:"Rotate both hands clockwise. Aim to see 3 knuckles on the left hand at address. This is a stronger grip position.", drill:"Hit 10 shots with an exaggerated strong grip to feel the difference in ball flight." },
  { problem:"Hooking (right-to-left for right-handers)", cause:"Grip too strong — clubface closing aggressively through impact.", fix:"Rotate both hands anti-clockwise. Aim to see only 1–2 knuckles on the left hand. Weaken the grip gradually.", drill:"Hit shots focusing on V's pointing toward your chin, not outside your right shoulder." },
  { problem:"Ball flies low and left", cause:"Hands too far ahead at address ('forward press' in grip). Effective loft reduced and face closed.", fix:"Check grip pressure. Ensure right hand isn't overriding the left. Hands should be at or just slightly ahead of ball at address.", drill:"Check the shaft angle at address — should be just inside neutral, not dramatically forward." },
  { problem:"Grip slipping during swing", cause:"Grip pressure too light, grips worn, or sweaty conditions.", fix:"Re-grip clubs regularly (every 20–30 rounds). Use a golf towel. Slightly increase grip pressure without tensing forearms.", drill:"Practise swinging with rain gloves in wet conditions to understand secure grip pressure." },
  { problem:"Tension in forearms and shoulders", cause:"Grip pressure too tight (8–10 out of 10). Tension travels up the arms.", fix:"Consciously reduce grip pressure to 5. Waggle the club before each shot to check you're not gripping tight.", drill:"The waggle check: if you can freely waggle the clubhead, your grip pressure is probably right." },
  { problem:"Inconsistent contact — toe or heel hits", cause:"Grip changing between shots. Not re-gripping consistently.", fix:"Develop a consistent grip routine. Always start with the left hand in the same position using the same reference point.", drill:"Place a line on your grip with a marker to show neutral left hand position. Check it every rep." },
  { problem:"Pain or discomfort in hands", cause:"Grip too tight, incorrect placement (in palm not fingers), or worn grips causing compensatory pressure.", fix:"Check the grip sits in the fingers of the left hand, not the palm. Reduce grip pressure. Consider larger grip size if you have large hands.", drill:"Try an interlock grip if you use overlap — it can reduce the pressure needed for a secure hold." },
];

const GRIP_ADJUSTMENTS = [
  { shot:"Fade", adjustment:"Weaken grip slightly — rotate both hands anti-clockwise by about 10–15°. V's point more toward your chin.", why:"A weaker grip makes it harder for the hands to fully release, keeping the face slightly open at impact and promoting left-to-right flight." },
  { shot:"Draw", adjustment:"Strengthen grip slightly — rotate both hands clockwise by about 10–15°. V's point toward or outside your right shoulder.", why:"A stronger grip encourages the hands to release more aggressively, closing the face through impact and creating right-to-left spin." },
  { shot:"Flop Shot", adjustment:"Keep grip pressure very light (3–4 out of 10). Soft hands allow the full Release 3 to occur naturally.", why:"Tight grip pressure prevents the full wrist release needed for the flop shot. The clubhead needs to overtake the hands — tight hands stop this." },
  { shot:"Punch / Knockdown", adjustment:"Slightly firmer grip pressure (6–7 out of 10). This restricts the full release and keeps the face from turning over.", why:"A firmer grip encourages the 'hold off' finish that keeps the ball flight low and penetrating." },
  { shot:"Greenside Bunker", adjustment:"Grip should be set after opening the clubface, not before. Open face first — then take your grip.", why:"If you open the face after gripping, the hands close it back to square at impact. Gripping after opening locks the loft in position." },
  { shot:"Into the Wind", adjustment:"Choke down on the grip by 1–2 inches. Increases control and shortens the swing arc for better contact.", why:"Choking down reduces effective shaft length, giving more control in windy conditions and naturally promoting a lower ball flight." },
  { shot:"Rough Escape", adjustment:"Increase grip pressure to 7–8 out of 10, especially in the last three fingers of the left hand.", why:"Thick rough grabs the hosel and tries to close the face at impact. A firmer grip resists this and maintains face angle through the grass." },
  { shot:"Chipping (Release 1)", adjustment:"Choke down 1–2 inches. Maintain even grip pressure throughout — no tightening at impact.", why:"Choking down improves feel and control for short shots. Grip tightening at impact causes the wrist to flip and pop the ball up." },
];

/* ─── COURSE MANAGEMENT DATA ─────────────────────────────────────────────── */
const HOLE_TYPES = [
  { id:"dogleg-left", name:"Dogleg Left", icon:"↰", color:C.maroon,
    overview:"The hole bends left. Priority is setting up the best angle into the green — not maximising distance.",
    principles:[
      { title:"Tee on the right side of the box", body:"Opens up the widest angle around the corner. Teeing left feeds your shot directly into the dogleg." },
      { title:"Play to the corner — not past it", body:"Unless you can carry the corner comfortably, play to the landing zone that leaves the best approach angle." },
      { title:"A draw works with you", body:"A controlled draw follows the shape of the hole. A fade fights it and often ends up in the right rough." },
      { title:"Know your carry distance", body:"Identify exactly how far you need to carry to clear the corner. If you can't carry it comfortably, lay back." },
    ],
    missManagement:"Miss right on the tee — the fairway opens up right. Missing left puts you through the corner.",
    approachNote:"After a well-placed tee shot, don't give back the advantage by being aggressive to a tight pin." },
  { id:"dogleg-right", name:"Dogleg Right", icon:"↱", color:"#935200",
    overview:"The hole bends right. Position over distance — set up the angle, don't try to overpower the hole.",
    principles:[
      { title:"Tee on the left side of the box", body:"Opens up the corner angle and gives you more fairway. Teeing right feeds your shot into the corner." },
      { title:"A fade works with you", body:"A controlled left-to-right shot follows the contour. If you hit a natural draw, aim further left." },
      { title:"Cutting the corner = big risk", body:"Only attempt if you know your exact carry distance and the opening is wide enough." },
      { title:"Lay up to your favourite yardage", body:"If in doubt, lay up with an iron or hybrid to the distance you're most comfortable approaching from." },
    ],
    missManagement:"Miss left on the tee — more fairway left than right. Missing right feeds into trouble.",
    approachNote:"A dogleg right often leaves a longer approach. Check pin position before committing to a club." },
  { id:"par3", name:"Par 3", icon:"⬤", color:C.maroon,
    overview:"Every par 3 is a ball-striking test. One shot to the green. Your mindset, club selection, and target are everything.",
    principles:[
      { title:"Always take enough club", body:"The most common error on par 3s is taking too little club. When in doubt, take one more club and make a smooth swing." },
      { title:"Miss in the right place", body:"Identify where missing the green costs you least. The fat of the green is your primary target if the pin is tucked." },
      { title:"Wind is amplified on par 3s", body:"Without the fairway as a buffer, wind affects ball flight more dramatically. Add extra club into a headwind." },
      { title:"Danger behind the pin", body:"If there's water or OB behind the green, treat the pin as the back of your target window — not the centre." },
    ],
    missManagement:"Identify the safe miss before you pull a club. Front bunker short beats water left every time.",
    approachNote:"Par 3 strategy: take enough club, pick the fat of the green, make a smooth committed swing." },
  { id:"water-left", name:"Water Left", icon:"💧", color:"#1a5c8a",
    overview:"Water to the left creates a decisive risk zone. Your entire strategy must account for it.",
    principles:[
      { title:"Start the ball right of the water", body:"Your ball's starting line must be right of the water's edge. A shot that starts over water and draws back is one miss from disaster." },
      { title:"Favour a fade or hold-off shot", body:"A left-to-right shot works away from the water. If you're a natural draw hitter, aim further right." },
      { title:"Know the carry number", body:"How many yards to carry the water? Know this number before you take the club back. Between clubs, always take more." },
      { title:"The safe side is always right", body:"Rough right, bunker right — all acceptable. Left is the only miss that's unacceptable." },
    ],
    missManagement:"Always miss right. Short and right, rough and right — all acceptable. Left is never acceptable.",
    approachNote:"Even if the pin is left, your target window stops 10 yards right of the flag on this hole." },
  { id:"water-right", name:"Water Right", icon:"💦", color:"#1a5c8a",
    overview:"Water to the right demands your attention from address. The entire right side of the hole is gone.",
    principles:[
      { title:"Start the ball left of the water", body:"Your starting line must be left of the water. A hold-off fade toward water is a very high-risk shot." },
      { title:"Favour a draw or pull-draw", body:"A right-to-left shape works away from the water. If you're a natural fader, aim further left." },
      { title:"Take enough club into the green", body:"With water right, instinct is to overcook a draw. Take enough club to make a smooth confident swing." },
      { title:"Left rough beats the water every time", body:"You can make bogey from left rough. Water is an immediate 2+ shot penalty." },
    ],
    missManagement:"Always miss left. Rough left, bunker left, over the back left — all recoverable. Water right is not.",
    approachNote:"Aim at the left half of the green minimum. If pin is right and water is right, the pin doesn't exist today." },
  { id:"ob-left", name:"OB Left", icon:"🚧", color:C.maroon,
    overview:"Out of bounds to the left is stroke-and-distance — the worst penalty in golf.",
    principles:[
      { title:"Stroke and distance is catastrophic", body:"OB left isn't a one-shot penalty — you re-tee hitting 3. An aggressive line toward OB is not risk/reward. It's just risk." },
      { title:"Tee up on the left side of the box", body:"Points you right and gives maximum fairway to aim into. Teeing right feeds your shot toward OB." },
      { title:"A fade works for you here", body:"Controlled left-to-right shape moves the ball away from OB. If you draw, aim significantly further right." },
      { title:"Right rough is your friend", body:"Right rough is infinitely preferable to OB. Aim for right-centre of fairway and let the fade work." },
    ],
    missManagement:"Miss right every single time. Right rough, right bunker — anything right.",
    approachNote:"After a tee shot that stays right, your approach angle may be compromised. Take your medicine." },
  { id:"tight-pin", name:"Tight / Tucked Pin", icon:"📍", color:C.maroon,
    overview:"A pin tucked behind a bunker, against water, or in a corner of the green. Know when to attack and when to take your medicine.",
    principles:[
      { title:"First question: what's the penalty for missing?", body:"If missing the tight pin means a bunker, it may be worth attacking. If it means water or OB, the pin doesn't exist." },
      { title:"You need the right shot shape", body:"A tight left pin requires a controlled fade. A tight right pin needs a draw. Don't manufacture a shot you don't have today." },
      { title:"Where does a straight shot go?", body:"If you hit it exactly straight, where does it finish? If a straight shot is acceptable, the tight pin is attackable." },
      { title:"The number to the fat of the green", body:"Know yardage to middle AND flag. If they differ by more than 15 yards, use the middle distance." },
    ],
    missManagement:"On a tucked pin, always miss to the fat side — long and middle rather than short into the bunker.",
    approachNote:"Tour pros aim at tight pins because their dispersion is small enough. For most amateurs, fat of the green produces the same scoring average with fewer big numbers." },
  { id:"into-wind", name:"Into the Wind", icon:"💨", color:"#3a5a7a",
    overview:"A strong headwind is not an obstacle to overpower. Work with it. Swing easier, take more club.",
    principles:[
      { title:"Every 10mph headwind = 1–2 extra clubs", body:"A 20mph headwind can easily require two extra clubs. Always err on the side of more club." },
      { title:"Swing slower, not harder", body:"Swinging harder adds backspin and makes the ball balloon higher. A smooth 80% swing with more club keeps flight penetrating." },
      { title:"A lower ball flight wins", body:"Punch shots, knockdowns, and tight ball flights beat high floating shots into wind every time." },
      { title:"Leave the driver in the bag", body:"If you hit a towering driver, consider a 3-wood into a strong headwind. Lower launch cuts through wind more efficiently." },
    ],
    missManagement:"Into wind, shots hit short are more common than long. Miss to the front half of the green.",
    approachNote:"Take 2 clubs more, make a smooth swing, flight the ball lower." },
];

const MANAGEMENT_PRINCIPLES = [
  { title:"Play to the fat of the green, not the pin", body:"Unless you have a specific shot to attack a tight pin, the fat of the green is your default target on every approach." },
  { title:"Always know your acceptable miss", body:"Before every shot: if I miss this slightly, where does it go? The unacceptable miss is water, OB, or unplayable rough. Bias your aim toward the acceptable miss." },
  { title:"Protect your score after trouble", body:"Once in trouble, your only job is to get back in play as efficiently as possible. A bogey from a bad tee shot is fine. A triple from a hero shot is not." },
  { title:"Lay up to your favourite yardage", body:"Identify the yardage from which you hit your most consistent shots. On par 5s and long par 4s, make decisions that set up exactly that yardage." },
  { title:"Tee box position is a free advantage", body:"The tee box gives you two club-lengths of width to use strategically. Tee on the side of the trouble to aim away from it." },
  { title:"Play the shot in front of you, not the scorecard", body:"The biggest course management error is playing based on what you need to score. Every shot deserves full, objective attention." },
];

/* ─── ROUTINE TEMPLATES ──────────────────────────────────────────────────── */
const ROUTINE_TEMPLATES = [
  { id:"full", name:"Full Shot Routine", icon:"🏌️", steps:[
    { id:"s1", label:"Read the situation", note:"Distance, lie, wind, obstacles. Commit to a shot type." },
    { id:"s2", label:"Select your club", note:"Pick the right tool. Don't change your mind after this." },
    { id:"s3", label:"Visualise the shot", note:"See the full ball flight — shape, trajectory, landing, roll." },
    { id:"s4", label:"Pick an intermediate target", note:"Find a spot 2–3 feet in front of the ball on your target line." },
    { id:"s5", label:"Step into address", note:"Align to the intermediate target. Set feet, then body." },
    { id:"s6", label:"Check alignment", note:"Feet, hips, shoulders parallel to target line." },
    { id:"s7", label:"Final trigger thought", note:"One swing thought only. Fire and trust." },
  ]},
  { id:"short", name:"Short Game Routine", icon:"◌", steps:[
    { id:"s1", label:"Read the lie", note:"Tight? Fluffy? Rough? Determine which Release fits." },
    { id:"s2", label:"Choose your Release", note:"R1 (run it), R2 (pitch it), R3 (lob or bunker)?" },
    { id:"s3", label:"Pick a landing spot", note:"A specific spot on the green — not the hole." },
    { id:"s4", label:"Practice swing", note:"Feel the release and swing length needed." },
    { id:"s5", label:"Set up to your landing spot", note:"Aim the face at your landing spot, then build stance." },
    { id:"s6", label:"Commit and go", note:"One thought. Trust the landing spot. Execute." },
  ]},
  { id:"putt", name:"Putting Routine", icon:"🕳️", steps:[
    { id:"s1", label:"Read the green", note:"Check slope from behind ball and behind hole. High side always." },
    { id:"s2", label:"Pick your line", note:"Find the apex — highest point before the break." },
    { id:"s3", label:"Gauge the pace", note:"Walk the length if needed. Uphill needs more; downhill less." },
    { id:"s4", label:"Pick an intermediate target", note:"A spot 2 feet ahead on your start line." },
    { id:"s5", label:"Two practice strokes", note:"Feel the distance — not technique." },
    { id:"s6", label:"Set up and commit", note:"Aim face to intermediate target. Look once. Stroke." },
  ]},
];

/* ─── EXCUSE DATA ────────────────────────────────────────────────────────── */
const EXCUSE_LIBRARY = {
  "The Conditions":[
    { excuse:"The wind changed direction on every single hole. Completely unplayable.", delivery:"Say it with genuine bewilderment. Shake your head slowly." },
    { excuse:"The greens were so slow in the morning, then by the back nine they were like glass. You can't adjust that quickly.", delivery:"Said best while gesturing toward the green you just three-putted." },
    { excuse:"Playing into the sun on 7, 8, and 9. Couldn't see a thing. Should be a local rule.", delivery:"Squint slightly as you say it, for authenticity." },
    { excuse:"The course is playing two clubs longer today. Everything was coming up short.", delivery:"Universal. Applicable to any round at any time of year." },
    { excuse:"Wet rough grabs the club completely differently. You can't spin it, you can't control it.", delivery:"Works best immediately after a pitch that ran 30 feet past the pin." },
  ],
  "The Equipment":[
    { excuse:"I've been testing a new ball this week. Still finding the distances.", delivery:"Best deployed within the first three holes so you have the full round to lean on it." },
    { excuse:"Borrowed my mate's 3-wood. Completely different shaft. Can't trust it at all.", delivery:"Be specific about the shaft — 'too whippy' works well." },
    { excuse:"My grips are getting slippery. Really need to regrip before the next round.", delivery:"Rub your hands together as you say it. Very convincing." },
    { excuse:"My rangefinder was giving me wrong distances all day. I was flying everything.", delivery:"Works brilliantly if you play without a rangefinder." },
    { excuse:"Different tee this week — plastic instead of wood. Completely changed my feel off the tee.", delivery:"Nobody will question this. Nobody." },
  ],
  "The Body":[
    { excuse:"My back's been giving me grief since Tuesday. I was swinging completely differently.", delivery:"The evergreen. Ageless. Appropriate in any decade of your life." },
    { excuse:"Tight hamstrings today. Couldn't get my full turn. You could see it in the swing.", delivery:"Do a brief hamstring stretch as you say it." },
    { excuse:"Still a bit dehydrated from the week. Not at 100%. Completely affects your feel.", delivery:"Drink water visibly throughout the round for maximum effect." },
    { excuse:"New shoes. Blisters on both feet by the 7th. Couldn't concentrate on anything.", delivery:"Limp very slightly on the walk off the 18th." },
    { excuse:"My right elbow's been a bit inflamed. Trying not to let it affect the swing but it does.", delivery:"The elbow. Untestable. Unverifiable. Perfect." },
  ],
  "The Course":[
    { excuse:"The yardages on the card are completely wrong. I was short on every par 3.", delivery:"Reference a specific hole. '14 is definitely not 185' is a classic." },
    { excuse:"That pin position on 11 was genuinely unfair. Right behind the bunker.", delivery:"Bonus points if you made par from the right." },
    { excuse:"The fairway on 6 kicks everything into the rough. I hit a perfect drive and ended up in a divot.", delivery:"A divot! Even better than rough. Completely undeserved." },
    { excuse:"Slow play absolutely killed my rhythm. An hour wait on the 7th tee and I just went cold.", delivery:"The most legitimate excuse on this list. Use with confidence." },
    { excuse:"The rough is brutal at the moment. Four weeks without rain. Like hitting out of concrete.", delivery:"Works in any weather. Drought or monsoon." },
  ],
  "The Mind":[
    { excuse:"Just couldn't get into it today. The mind was elsewhere. You know how it is.", delivery:"Vague, plausible, and completely unverifiable. A masterpiece." },
    { excuse:"Busy week at work. Head's still full of it. Couldn't switch off properly.", delivery:"The work excuse. Generates sympathy and ends the conversation." },
    { excuse:"I've been working on a swing change and it's in between stages. You look worse before you look better.", delivery:"Covers any number of catastrophic shots. Blame the process." },
    { excuse:"Today wasn't bad golf — it was basically practice. I know exactly where I went wrong.", delivery:"The reframe. Today wasn't bad golf — it was research." },
    { excuse:"I was playing well and then someone behind us hit a shot and broke my focus on 9.", delivery:"Name no names. Imply everything." },
  ],
};

const ROULETTE_EXCUSES = [
  "The wind changed direction on every single hole.",
  "My back's been giving me grief since Tuesday.",
  "The yardages on the card are completely wrong.",
  "I've been testing a new ball. Still finding the distances.",
  "Couldn't get into it today. Head was elsewhere.",
  "Greens were slow in the morning, glass by the back nine.",
  "Borrowed a mate's 3-wood. Completely different shaft.",
  "Slow play on 7 killed my rhythm completely.",
  "Playing into the sun on half the holes. Should be a local rule.",
  "New shoes. Blisters by the 7th. Couldn't concentrate.",
  "Working on a swing change. You look worse before you look better.",
  "The rough is brutal right now. Like hitting out of concrete.",
  "Rangefinder giving wrong distances all day.",
  "Fairway on 6 kicks everything into the rough.",
  "Tight hamstrings. Couldn't get my full turn.",
  "Busy week at work. Head still full of it.",
  "Today wasn't bad golf — it was basically practice.",
  "Grips are getting slippery. Need to regrip.",
  "Elbow's been a bit inflamed. Trying not to let it affect the swing.",
  "Pin on 11 was genuinely unfair. Nobody's making par from the right.",
];

/* ─── AI HELPERS ─────────────────────────────────────────────────────────── */
async function callClaude(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200, messages:[{ role:"user", content:prompt }] })
  });
  const d = await r.json();
  return d.content.map(i => i.text||"").join("");
}

async function getAICaddie(ctx) {
  const text = await callClaude(`You are an expert golf caddie. Recommend the ideal shot for this situation.
Distance: ${ctx.distance}yd | Lie: ${ctx.lie} | Wind: ${ctx.wind} | Obstacles: ${ctx.obstacles} | Skill: ${ctx.skill} | Notes: ${ctx.notes||"none"}
Respond ONLY in JSON, no markdown: {"primaryShot":"name","club":"club","confidence":"High/Medium/Low","rationale":"2-3 sentences","keyAdjustments":["1","2","3"],"swingThought":"one thought","alternativeShot":"name","riskLevel":"Safe/Moderate/Aggressive","caddieNote":"one honest insight"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function getAIPracticePlan(ctx) {
  const text = await callClaude(`You are an expert golf coach. Create a structured practice session plan.
Duration: ${ctx.duration} minutes | Weak areas: ${ctx.weakAreas.join(", ")} | Skill: ${ctx.skill} | Focus: ${ctx.focus||"general"} | Equipment: ${ctx.equipment}
Respond ONLY in JSON, no markdown: {"sessionTitle":"title","totalTime":${ctx.duration},"warmup":{"duration":5,"description":"warmup"},"blocks":[{"title":"title","duration":10,"shots":["shot1"],"drill":"drill","reps":"X reps","focus":"focus","progression":"progression"}],"cooldown":{"duration":5,"description":"cooldown"},"sessionGoal":"one clear goal","coachNote":"one honest insight"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function getAIHolePlan(ctx) {
  const text = await callClaude(`You are an elite golf caddie and course management expert. Create a hole game plan.
Hole: ${ctx.description} | Par: ${ctx.par} | Yardage: ${ctx.yardage}yds | Wind: ${ctx.wind} | Conditions: ${ctx.conditions} | Skill: ${ctx.skill} | Handicap: ${ctx.handicap||"not specified"}
Respond ONLY in JSON, no markdown: {"holeAssessment":"2 sentence overview","primaryDanger":"biggest risk","teeStrategy":{"shotType":"type","target":"target","club":"club","reasoning":"why"},"approachStrategy":{"target":"target","club":"club","landingZone":"where to land","reasoning":"why"},"acceptableMiss":"recoverable miss","unacceptableMiss":"must avoid","shortGameNote":"if relevant","scoringGoal":"target score","mindsetCue":"one mindset cue"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function getAIExcuse(confession) {
  const text = await callClaude(`You are a golf excuse consultant — hilarious, world-class at turning genuine golfing disasters into plausible, dignified excuses.
The golfer confesses: "${confession}"
Respond ONLY in JSON, no markdown: {"excuse":"the full excuse to say out loud","delivery":"how to deliver it","confidenceRating":"Bulletproof/Solid/Risky","alternativeExcuse":"a backup"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function getPostRoundNarrative(holes) {
  const summary = holes.filter(h=>h.issue).map(h=>`Hole ${h.number}: ${h.issue}`).join(", ");
  const text = await callClaude(`You are a golf excuse consultant. Create a post-round narrative for the clubhouse.
Difficult moments: ${summary}
Create a flowing, natural-sounding 3-4 sentence story. Assign blame to conditions/equipment/circumstances — never the golfer's ability. End optimistically.
Respond ONLY in JSON, no markdown: {"narrative":"complete story","openingLine":"the hook","closingLine":"optimistic closer","headlineExcuse":"one-line summary"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

/* ─── NAV TABS ───────────────────────────────────────────────────────────── */
const TABS = [
  { id:"shots",     label:"Shots",      icon:"📚" },
  { id:"shortgame", label:"Short Game", icon:"⛳" },
  { id:"grip",      label:"Grip",       icon:"🤜" },
  { id:"strategy",  label:"Strategy",   icon:"🗺️" },
  { id:"routine",   label:"Routine",    icon:"🧘" },
  { id:"practice",  label:"Practice",   icon:"🎯" },
  { id:"caddie",    label:"Caddie",     icon:"🤖" },
  { id:"excuses",   label:"Excuses",    icon:"🤷" },
];

/* ─── ROOT APP ───────────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("shots");
  const [mode, setMode] = useState("course");
  const toggleMode = () => setMode(m => m==="range" ? "course" : "range");

  // Inject Google Fonts
  if (typeof document !== "undefined" && !document.getElementById("gf-bebas")) {
    const link = document.createElement("link");
    link.id = "gf-bebas";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }

  return (
    <div style={{ ...pg, paddingBottom:68 }}>
      {tab==="shots"     && <ShotsTab     mode={mode} onMode={toggleMode} />}
      {tab==="shortgame" && <ShortGameTab mode={mode} onMode={toggleMode} />}
      {tab==="grip"      && <GripTab />}
      {tab==="strategy"  && <StrategyTab />}
      {tab==="routine"   && <RoutineTab />}
      {tab==="practice"  && <PracticeTab />}
      {tab==="caddie"    && <CaddieTab />}
      {tab==="excuses"   && <ExcusesTab />}

      {/* Bottom Nav */}
      <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:C.white,
        borderTop:`2px solid ${C.headerBg}`, display:"flex", zIndex:100,
        boxShadow:"0 -2px 12px rgba(163,197,233,0.3)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, padding:"0.45rem 0.1rem 0.5rem", border:"none",
            background: tab===t.id ? C.headerBg : "transparent",
            cursor:"pointer", display:"flex", flexDirection:"column",
            alignItems:"center", gap:"0.1rem", transition:"background 0.15s"
          }}>
            <span style={{ fontSize:"1.05rem" }}>{t.icon}</span>
            <span style={{ fontSize:"0.55rem", ...body,
              color: tab===t.id ? C.maroon : C.muted,
              fontWeight: tab===t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ─── SHOTS TAB ──────────────────────────────────────────────────────────── */
const ALL_CATS = ["All","Shape","Control","Short Game","Specialty Lie"];

function ShotsTab({ mode, onMode }) {
  const [shot, setShot] = useState(null);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState(new Set());
  const tog = id => setFavs(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const filtered = SHOTS.filter(s => (cat==="All"||s.cat===cat) && s.name.toLowerCase().includes(q.toLowerCase()));

  if (shot) return <ShotDetail shot={shot} mode={mode} isFav={favs.has(shot.id)} onFav={() => tog(shot.id)} onBack={() => setShot(null)} onMode={onMode} />;

  return (
    <div>
      <PageHeader title="Shot Library" subtitle={`${mode==="range" ? "🎯 At the Range" : "⛳ On the Course"}`}
        right={<button onClick={onMode} style={{ ...smBtn, background:C.white+"cc", borderColor:"transparent" }}>{mode==="range" ? "⛳ Course" : "🎯 Range"}</button>} />
      <div style={{ maxWidth:720, margin:"0 auto", padding:"1.25rem" }}>
        <input style={{ ...inputS, marginBottom:"0.9rem" }} placeholder="Search shots..." value={q} onChange={e=>setQ(e.target.value)} />
        <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"1.25rem" }}>
          {ALL_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ ...smBtn, ...(cat===c ? { background:C.maroon, borderColor:C.maroon, color:C.white } : {}) }}>{c}</button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:"0.7rem" }}>
          {filtered.map(s => (
            <button key={s.id} onClick={() => setShot(s)} style={{ ...card(), cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:"0.2rem", color:C.ink }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.2rem" }}>
                <span style={{ fontSize:"1.4rem" }}>{s.icon}</span>
                <div style={{ display:"flex", gap:"0.3rem", alignItems:"center" }}>
                  {favs.has(s.id) && <span style={{ color:C.maroon, fontSize:"0.8rem" }}>★</span>}
                  <DiffBadge d={s.diff} />
                </div>
              </div>
              <div style={{ ...serif, fontSize:"1rem", fontWeight:700, color:C.ink }}>{s.name}</div>
              <div style={{ fontSize:"0.77rem", color:C.sub, lineHeight:1.3 }}>{s.sub}</div>
              <div style={{ fontSize:"0.65rem", color:C.maroon, marginTop:"0.2rem", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:700 }}>{s.cat}</div>
            </button>
          ))}
        </div>
        {filtered.length===0 && <p style={{ color:C.muted, textAlign:"center", padding:"2rem" }}>No shots found.</p>}
      </div>
    </div>
  );
}

function ShotDetail({ shot:s, mode, isFav, onFav, onBack, onMode }) {
  const keys = mode==="range" ? s.range : s.course;
  const LABELS = { ballPosition:"Ball Position", stance:"Stance", weight:"Weight", grip:"Grip" };
  return (
    <div>
      <PageHeader title={s.name} subtitle={s.sub}
        onBack={onBack}
        right={<div style={{display:"flex",gap:"0.4rem"}}>
          <button style={{...smBtn,background:C.white+"cc",borderColor:"transparent",...(isFav?{color:C.maroon}:{})}} onClick={onFav}>{isFav?"★":"☆"}</button>
          <button style={{...smBtn,background:C.white+"cc",borderColor:"transparent"}} onClick={onMode}>{mode==="range"?"⛳":"🎯"}</button>
        </div>} />
      <div style={{ maxWidth:650, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ display:"flex", gap:"0.5rem", alignItems:"center", marginBottom:"1.25rem" }}>
          <DiffBadge d={s.diff} />
          <span style={{ fontSize:"0.68rem", color:C.maroon, letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:700, background:C.headerBg+"55", padding:"0.15rem 0.5rem", borderRadius:12 }}>{s.cat}</span>
        </div>
        <div style={divLine} />
        <Sec title="Setup" icon="📐">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
            {Object.entries(s.setup).map(([k,v]) => (
              <div key={k} style={card()}>
                <div style={lbl}>{LABELS[k]||k}</div>
                <div style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.4, marginTop:"0.2rem" }}>{v}</div>
              </div>
            ))}
          </div>
        </Sec>
        <Sec title="Club Face" icon="🏌️"><InfoCard>{s.clubface}</InfoCard></Sec>
        <Sec title="Swing Path" icon="🔄"><InfoCard>{s.swingPath}</InfoCard></Sec>
        <Sec title="Swing Thought" icon="💭"><ThoughtCard>{s.swingThought}</ThoughtCard></Sec>
        <Sec title="Tempo" icon="🎵"><InfoCard>{s.tempo}</InfoCard></Sec>
        <Sec title={mode==="range" ? "🎯 Range — Key Points" : "⛳ Course — Key Points"} icon="">
          <KeyList items={keys} />
        </Sec>
        <WatchOut>{s.watchOut}</WatchOut>
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );
}

/* ─── SHORT GAME TAB ─────────────────────────────────────────────────────── */
function ShortGameTab({ mode, onMode }) {
  const [release, setRelease] = useState(null);
  const [shot, setShot] = useState(null);
  const [dtStep, setDtStep] = useState(null);

  if (shot && release) return <ReleaseShot shot={shot} release={release} mode={mode} onBack={() => setShot(null)} onMode={onMode} />;
  if (release) return <ReleaseDetail release={release} mode={mode} onBack={() => setRelease(null)} onShot={setShot} onMode={onMode} />;
  if (dtStep !== null) return <DecisionTree step={dtStep} setStep={setDtStep} onRelease={id => { setRelease(RELEASES.find(r=>r.id===id)); setDtStep(null); }} onBack={() => setDtStep(null)} />;

  return (
    <div>
      <PageHeader title="Short Game" subtitle="Dan Grieve's 3 Releases System"
        right={<button onClick={onMode} style={{...smBtn,background:C.white+"cc",borderColor:"transparent"}}>{mode==="range"?"⛳":"🎯"}</button>} />
      <div style={{ maxWidth:520, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ ...card(C.headerBg), marginBottom:"1rem", background:C.headerBg+"33" }}>
          <p style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.6, margin:0 }}>Three shots cover every situation around the green. Master the releases — not the shots.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem", marginBottom:"0.85rem" }}>
          {RELEASES.map(r => (
            <button key={r.id} onClick={() => setRelease(r)} style={{ ...card(`${r.color}55`), cursor:"pointer", display:"flex", gap:"1rem", alignItems:"center", textAlign:"left", color:C.ink }}>
              <div style={{ width:42, height:42, borderRadius:"50%", background:r.color+"15", border:`2px solid ${r.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>{r.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.1rem" }}>
                  <span style={{ ...serif, fontSize:"1rem", color:r.color, fontWeight:700 }}>{r.name}</span>
                  <span style={{ fontSize:"0.85rem", color:C.ink }}>— {r.sub}</span>
                </div>
                <div style={{ fontSize:"0.77rem", color:C.sub }}>{r.tagline}</div>
              </div>
              <span style={{ color:C.sub }}>→</span>
            </button>
          ))}
        </div>
        <button onClick={() => setDtStep(0)} style={{ ...card(C.maroon+"44"), width:"100%", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.85rem", color:C.ink, border:`1.5px solid ${C.maroon}44` }}>
          <span style={{ fontSize:"1.4rem" }}>🤔</span>
          <div style={{ flex:1, textAlign:"left" }}>
            <div style={{ ...serif, fontSize:"0.95rem", color:C.maroon, fontWeight:700, marginBottom:"0.1rem" }}>Which Release Do I Use?</div>
            <div style={{ fontSize:"0.77rem", color:C.sub }}>3 questions → the right shot, right now</div>
          </div>
          <span style={{ color:C.maroon }}>→</span>
        </button>
      </div>
    </div>
  );
}

function ReleaseDetail({ release:r, mode, onBack, onShot, onMode }) {
  return (
    <div>
      <PageHeader title={`${r.name} — ${r.sub}`} subtitle={r.tagline} onBack={onBack}
        right={<button onClick={onMode} style={{...smBtn,background:C.white+"cc",borderColor:"transparent"}}>{mode==="range"?"⛳":"🎯"}</button>} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ ...card(`${r.color}44`), marginBottom:"1.25rem", background:`${r.color}08` }}>
          <div style={lbl}>Key Principle</div>
          <p style={{ ...serif, fontSize:"1rem", color:r.color, fontStyle:"italic", margin:"0.25rem 0 0.75rem", lineHeight:1.5 }}>{r.principle}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
            <div style={card()}><div style={lbl}>How It Feels</div><div style={{fontSize:"0.85rem",color:C.ink,marginTop:"0.2rem",lineHeight:1.4}}>{r.feels}</div></div>
            <div style={card()}><div style={lbl}>When To Use</div><div style={{fontSize:"0.85rem",color:C.ink,marginTop:"0.2rem",lineHeight:1.4}}>{r.when}</div></div>
          </div>
        </div>
        <div style={{ ...lbl, marginBottom:"0.6rem" }}>Shots in this Release</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.55rem" }}>
          {r.shots.map(s => (
            <button key={s.id} onClick={() => onShot(s)} style={{ ...card(), cursor:"pointer", display:"flex", alignItems:"center", gap:"0.85rem", textAlign:"left", color:C.ink }}>
              <span style={{ fontSize:"1.3rem", width:28, textAlign:"center" }}>{s.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ ...serif, fontSize:"0.98rem", fontWeight:700, color:C.ink }}>{s.name}</div>
                <div style={{ fontSize:"0.77rem", color:C.sub, marginTop:"0.1rem" }}>{s.sub}</div>
              </div>
              <DiffBadge d={s.diff} />
              <span style={{ color:C.sub }}>→</span>
            </button>
          ))}
        </div>
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );
}

function ReleaseShot({ shot:s, release:r, mode, onBack, onMode }) {
  const keys = mode==="range" ? s.range : s.course;
  const LABELS = { ballPosition:"Ball Position", stance:"Stance", weight:"Weight", grip:"Grip" };
  return (
    <div>
      <PageHeader title={s.name} subtitle={s.sub} onBack={onBack}
        right={<button onClick={onMode} style={{...smBtn,background:C.white+"cc",borderColor:"transparent"}}>{mode==="range"?"⛳":"🎯"}</button>} />
      <div style={{ maxWidth:650, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", background:`${r.color}15`, border:`1.5px solid ${r.color}44`, borderRadius:20, padding:"0.2rem 0.7rem", fontSize:"0.78rem", color:r.color, fontWeight:700, marginBottom:"1rem" }}>{r.icon} {r.name} — {r.sub}</div>
        <div style={divLine} />
        <Sec title="Setup" icon="📐">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
            {Object.entries(s.setup).map(([k,v]) => (
              <div key={k} style={card()}><div style={lbl}>{LABELS[k]||k}</div><div style={{fontSize:"0.88rem",color:C.ink,lineHeight:1.4,marginTop:"0.2rem"}}>{v}</div></div>
            ))}
          </div>
        </Sec>
        <Sec title="Club Face" icon="🏌️"><InfoCard>{s.clubface}</InfoCard></Sec>
        <Sec title="Swing Path" icon="🔄"><InfoCard>{s.swingPath}</InfoCard></Sec>
        <Sec title="Swing Thought" icon="💭"><ThoughtCard color={r.color}>{s.swingThought}</ThoughtCard></Sec>
        <Sec title="Tempo" icon="🎵"><InfoCard>{s.tempo}</InfoCard></Sec>
        <Sec title={mode==="range" ? "🎯 Range — Key Points" : "⛳ Course — Key Points"} icon=""><KeyList items={keys} /></Sec>
        <WatchOut>{s.watchOut}</WatchOut>
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );
}

function DecisionTree({ step, setStep, onRelease, onBack }) {
  const Qs = [
    { q:"Is there a clear path to run the ball along the green?", hint:"No obstacle to carry, no deep rough between you and the putting surface.", yes:()=>onRelease(1), no:()=>setStep(1) },
    { q:"Do you need to carry an obstacle but a medium-height shot will do?", hint:"A bunker, rough, or slope — but you don't need maximum height.", yes:()=>onRelease(2), no:()=>setStep(2) },
    { q:"Are you in a greenside bunker?", hint:"If yes → R3 Bunker. If no → R3 Lob Shot.", yes:()=>onRelease(3), no:()=>onRelease(3) },
  ];
  const q = Qs[step];
  return (
    <div>
      <PageHeader title="Which Release?" subtitle={`Question ${step+1} of 3`} onBack={step===0 ? onBack : ()=>setStep(step-1)} />
      <div style={{ maxWidth:460, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ ...card(C.headerBg), marginBottom:"1.25rem", background:C.headerBg+"22" }}>
          <h2 style={{ ...serif, fontSize:"1.3rem", color:C.ink, margin:"0 0 0.6rem", lineHeight:1.4 }}>{q.q}</h2>
          <p style={{ color:C.sub, fontSize:"0.88rem", lineHeight:1.5, margin:0 }}>{q.hint}</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
          <button onClick={q.yes} style={{ ...card("#1b6b3a44"), cursor:"pointer", fontSize:"1.05rem", ...serif, color:"#1b6b3a", fontWeight:700, textAlign:"center", padding:"1rem" }}>Yes ✓</button>
          <button onClick={q.no} style={{ ...card(`${C.maroon}44`), cursor:"pointer", fontSize:"1.05rem", ...serif, color:C.maroon, fontWeight:700, textAlign:"center", padding:"1rem" }}>No ✗</button>
        </div>
      </div>
    </div>
  );
}


/* ─── GRIP ILLUSTRATIONS ─────────────────────────────────────────────────── */

function GripNeutralSVG() {
  return (
    <svg viewBox="0 0 320 200" style={{width:"100%",maxWidth:320,display:"block",margin:"0 auto"}} aria-label="Neutral grip hand position">
      {/* Club grip - vertical bar */}
      <rect x="148" y="10" width="24" height="180" rx="12" fill="#c8a882" stroke="#a07850" strokeWidth="1.5"/>
      {/* Left hand - main body */}
      <ellipse cx="160" cy="90" rx="42" ry="55" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.5"/>
      {/* Left hand fingers */}
      <rect x="122" y="50" width="14" height="38" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="136" y="44" width="14" height="42" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="170" y="44" width="14" height="42" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="184" y="50" width="14" height="36" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      {/* Left thumb - slightly right of center */}
      <ellipse cx="166" cy="62" rx="9" ry="18" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2" transform="rotate(-10,166,62)"/>
      {/* Right hand below */}
      <ellipse cx="160" cy="145" rx="40" ry="48" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.5"/>
      <rect x="124" y="108" width="13" height="34" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="137" y="103" width="13" height="38" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="170" y="103" width="13" height="38" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="183" y="108" width="13" height="32" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      {/* Right thumb - just left of center */}
      <ellipse cx="154" cy="120" rx="9" ry="17" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2" transform="rotate(8,154,120)"/>
      {/* V indicators */}
      <path d="M 175 72 L 192 58 L 200 70" fill="none" stroke="#7b003a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 171 128 L 186 115 L 194 127" fill="none" stroke="#7b003a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Arrow pointing right shoulder */}
      <path d="M 205 64 L 248 40" fill="none" stroke="#7b003a" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowMarker)"/>
      <path d="M 200 121 L 248 100" fill="none" stroke="#7b003a" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowMarker)"/>
      <defs>
        <marker id="arrowMarker" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#7b003a"/>
        </marker>
      </defs>
      {/* Labels */}
      <text x="250" y="44" fontSize="10" fill="#7b003a" fontWeight="700" fontFamily="DM Sans,sans-serif">V → Right</text>
      <text x="250" y="56" fontSize="10" fill="#7b003a" fontFamily="DM Sans,sans-serif">shoulder</text>
      {/* Knuckle dots - 2 visible */}
      <circle cx="136" cy="68" r="3.5" fill="#d4a870" opacity="0.8"/>
      <circle cx="150" cy="63" r="3.5" fill="#d4a870" opacity="0.8"/>
      <text x="108" y="200" fontSize="10" fill="#596070" fontFamily="DM Sans,sans-serif">2 knuckles visible</text>
    </svg>
  );
}

function GripStrongSVG() {
  return (
    <svg viewBox="0 0 320 200" style={{width:"100%",maxWidth:320,display:"block",margin:"0 auto"}} aria-label="Strong grip hand position">
      <rect x="148" y="10" width="24" height="180" rx="12" fill="#c8a882" stroke="#a07850" strokeWidth="1.5"/>
      {/* Left hand rotated clockwise */}
      <g transform="rotate(18,160,90)">
        <ellipse cx="160" cy="90" rx="42" ry="55" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.5"/>
        <rect x="122" y="50" width="14" height="38" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
        <rect x="136" y="44" width="14" height="42" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
        <rect x="170" y="44" width="14" height="42" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
        <rect x="184" y="50" width="14" height="36" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
        <ellipse cx="170" cy="60" rx="9" ry="18" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2" transform="rotate(-5,170,60)"/>
      </g>
      {/* Right hand rotated clockwise */}
      <g transform="rotate(16,160,145)">
        <ellipse cx="160" cy="145" rx="40" ry="48" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.5"/>
        <rect x="124" y="108" width="13" height="34" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
        <rect x="137" y="103" width="13" height="38" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
        <rect x="170" y="103" width="13" height="38" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
        <rect x="183" y="108" width="13" height="32" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
        <ellipse cx="158" cy="118" rx="9" ry="17" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2" transform="rotate(12,158,118)"/>
      </g>
      {/* V indicators pointing far right */}
      <path d="M 182 76 L 205 54 L 215 70" fill="none" stroke="#7b003a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 178 132 L 200 110 L 210 126" fill="none" stroke="#7b003a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 218 62 L 258 30" fill="none" stroke="#7b003a" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowMarker2)"/>
      <path d="M 213 118 L 258 90" fill="none" stroke="#7b003a" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowMarker2)"/>
      <defs>
        <marker id="arrowMarker2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#7b003a"/>
        </marker>
      </defs>
      <text x="258" y="34" fontSize="10" fill="#7b003a" fontWeight="700" fontFamily="DM Sans,sans-serif">V → Far</text>
      <text x="258" y="46" fontSize="10" fill="#7b003a" fontFamily="DM Sans,sans-serif">right</text>
      {/* 3 knuckle dots */}
      <circle cx="128" cy="72" r="3.5" fill="#d4a870" opacity="0.9"/>
      <circle cx="141" cy="64" r="3.5" fill="#d4a870" opacity="0.9"/>
      <circle cx="155" cy="59" r="3.5" fill="#d4a870" opacity="0.9"/>
      <text x="100" y="200" fontSize="10" fill="#596070" fontFamily="DM Sans,sans-serif">3+ knuckles visible → promotes draw</text>
    </svg>
  );
}

function GripWeakSVG() {
  return (
    <svg viewBox="0 0 320 200" style={{width:"100%",maxWidth:320,display:"block",margin:"0 auto"}} aria-label="Weak grip hand position">
      <rect x="148" y="10" width="24" height="180" rx="12" fill="#c8a882" stroke="#a07850" strokeWidth="1.5"/>
      {/* Left hand rotated counter-clockwise */}
      <g transform="rotate(-16,160,90)">
        <ellipse cx="160" cy="90" rx="42" ry="55" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.5"/>
        <rect x="122" y="50" width="14" height="38" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
        <rect x="136" y="44" width="14" height="42" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
        <rect x="170" y="44" width="14" height="42" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
        <rect x="184" y="50" width="14" height="36" rx="7" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
        <ellipse cx="158" cy="60" rx="9" ry="18" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2" transform="rotate(-18,158,60)"/>
      </g>
      {/* Right hand rotated counter-clockwise */}
      <g transform="rotate(-14,160,145)">
        <ellipse cx="160" cy="145" rx="40" ry="48" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.5"/>
        <rect x="124" y="108" width="13" height="34" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
        <rect x="137" y="103" width="13" height="38" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
        <rect x="170" y="103" width="13" height="38" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
        <rect x="183" y="108" width="13" height="32" rx="6" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
        <ellipse cx="150" cy="120" rx="9" ry="17" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2" transform="rotate(5,150,120)"/>
      </g>
      {/* V indicators pointing toward chin/left */}
      <path d="M 168 76 L 150 58 L 158 46" fill="none" stroke="#7b003a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 164 130 L 146 112 L 154 100" fill="none" stroke="#7b003a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 147 52 L 110 28" fill="none" stroke="#7b003a" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowMarker3)"/>
      <path d="M 143 106 L 106 82" fill="none" stroke="#7b003a" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowMarker3)"/>
      <defs>
        <marker id="arrowMarker3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#7b003a"/>
        </marker>
      </defs>
      <text x="10" y="28" fontSize="10" fill="#7b003a" fontWeight="700" fontFamily="DM Sans,sans-serif">V → Chin</text>
      <text x="10" y="40" fontSize="10" fill="#7b003a" fontFamily="DM Sans,sans-serif">or left</text>
      {/* Only 1 knuckle */}
      <circle cx="155" cy="64" r="3.5" fill="#d4a870" opacity="0.9"/>
      <text x="88" y="200" fontSize="10" fill="#596070" fontFamily="DM Sans,sans-serif">1 knuckle visible → promotes fade</text>
    </svg>
  );
}

function OverlapGripSVG() {
  return (
    <svg viewBox="0 0 280 160" style={{width:"100%",maxWidth:280,display:"block",margin:"0 auto"}} aria-label="Vardon overlapping grip">
      {/* Club top-down view */}
      <rect x="124" y="0" width="32" height="160" rx="6" fill="#c8a882" stroke="#a07850" strokeWidth="1.5"/>
      {/* Left hand fingers from left */}
      <rect x="60" y="30" width="70" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="55" y="52" width="75" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="58" y="74" width="72" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      {/* Left thumb on top of grip */}
      <ellipse cx="140" cy="24" rx="8" ry="14" fill="#f0c898" stroke="#d4a870" strokeWidth="1.2"/>
      {/* Right hand fingers from right */}
      <rect x="150" y="52" width="70" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="148" y="74" width="72" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="150" y="96" width="68" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      {/* Right little finger OVERLAPPING on top of left index */}
      <rect x="62" y="30" width="22" height="18" rx="9" fill="#dba870" stroke="#c4984a" strokeWidth="1.5"/>
      {/* Highlight the overlap */}
      <circle cx="73" cy="39" r="10" fill="none" stroke="#7b003a" strokeWidth="2.5" strokeDasharray="3,2"/>
      <path d="M 83 32 L 100 18" stroke="#7b003a" strokeWidth="1.5" markerEnd="url(#arrGrip1)"/>
      <defs>
        <marker id="arrGrip1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#7b003a"/>
        </marker>
      </defs>
      <text x="86" y="16" fontSize="10" fill="#7b003a" fontWeight="700" fontFamily="DM Sans,sans-serif">Little finger overlaps</text>
      {/* Right thumb */}
      <ellipse cx="136" cy="108" rx="8" ry="13" fill="#e8b870" stroke="#c4984a" strokeWidth="1.2"/>
    </svg>
  );
}

function InterlockGripSVG() {
  return (
    <svg viewBox="0 0 280 160" style={{width:"100%",maxWidth:280,display:"block",margin:"0 auto"}} aria-label="Interlocking grip">
      {/* Club */}
      <rect x="124" y="0" width="32" height="160" rx="6" fill="#c8a882" stroke="#a07850" strokeWidth="1.5"/>
      {/* Left hand fingers */}
      <rect x="58" y="30" width="68" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="55" y="52" width="71" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="58" y="74" width="68" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      {/* Left thumb */}
      <ellipse cx="140" cy="24" rx="8" ry="14" fill="#f0c898" stroke="#d4a870" strokeWidth="1.2"/>
      {/* Right hand fingers */}
      <rect x="150" y="52" width="70" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="148" y="74" width="72" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="150" y="96" width="68" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      {/* Interlocked fingers - right little through left index gap */}
      <path d="M 60 48 Q 73 44 76 39 Q 78 33 73 30 Q 80 28 84 34 Q 86 42 80 48 Z" fill="#dba870" stroke="#c4984a" strokeWidth="1.2"/>
      <path d="M 126 52 Q 119 48 116 42 Q 114 36 120 32 Q 113 28 108 34 Q 106 42 112 50 Z" fill="#f2c890" stroke="#d4a870" strokeWidth="1.2"/>
      {/* Highlight interlock */}
      <circle cx="95" cy="41" r="16" fill="none" stroke="#7b003a" strokeWidth="2.5" strokeDasharray="3,2"/>
      <path d="M 111 28 L 130 14" stroke="#7b003a" strokeWidth="1.5" markerEnd="url(#arrGrip2)"/>
      <defs>
        <marker id="arrGrip2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#7b003a"/>
        </marker>
      </defs>
      <text x="118" y="12" fontSize="10" fill="#7b003a" fontWeight="700" fontFamily="DM Sans,sans-serif">Fingers interlock</text>
      {/* Right thumb */}
      <ellipse cx="136" cy="108" rx="8" ry="13" fill="#e8b870" stroke="#c4984a" strokeWidth="1.2"/>
    </svg>
  );
}

function TenFingerGripSVG() {
  return (
    <svg viewBox="0 0 280 160" style={{width:"100%",maxWidth:280,display:"block",margin:"0 auto"}} aria-label="Ten finger baseball grip">
      {/* Club */}
      <rect x="124" y="0" width="32" height="160" rx="6" fill="#c8a882" stroke="#a07850" strokeWidth="1.5"/>
      {/* Left hand fingers */}
      <rect x="58" y="28" width="68" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="55" y="50" width="71" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      <rect x="58" y="72" width="68" height="18" rx="9" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2"/>
      {/* Left thumb */}
      <ellipse cx="140" cy="22" rx="8" ry="14" fill="#f0c898" stroke="#d4a870" strokeWidth="1.2"/>
      {/* Right hand fingers - ALL touching left, no overlap/interlock */}
      <rect x="150" y="50" width="70" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="148" y="72" width="72" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      <rect x="150" y="94" width="68" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      {/* Right little finger sits FLUSH against left index - show gap/join line */}
      <rect x="150" y="28" width="68" height="18" rx="9" fill="#ecc89a" stroke="#c4984a" strokeWidth="1.2"/>
      {/* Join line between right little finger and left index finger */}
      <line x1="150" y1="28" x2="150" y2="46" stroke="#7b003a" strokeWidth="2.5"/>
      {/* Right thumb */}
      <ellipse cx="136" cy="108" rx="8" ry="13" fill="#e8b870" stroke="#c4984a" strokeWidth="1.2"/>
      {/* Arrow pointing to the join */}
      <path d="M 150 20 L 178 8" stroke="#7b003a" strokeWidth="1.5" markerEnd="url(#arrGrip3)"/>
      <defs>
        <marker id="arrGrip3" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#7b003a"/>
        </marker>
      </defs>
      <text x="166" y="7" fontSize="10" fill="#7b003a" fontWeight="700" fontFamily="DM Sans,sans-serif">Fingers flush — no link</text>
      {/* 10 count label */}
      <text x="20" y="152" fontSize="10" fill="#596070" fontFamily="DM Sans,sans-serif">All 10 fingers on the grip</text>
    </svg>
  );
}

function GripPressureSVG() {
  return (
    <svg viewBox="0 0 300 120" style={{width:"100%",maxWidth:300,display:"block",margin:"0 auto"}} aria-label="Grip pressure scale">
      {/* Scale bar */}
      <rect x="20" y="44" width="260" height="16" rx="8" fill="#f0f6fc" stroke="#d5e6f5" strokeWidth="1.5"/>
      {/* Gradient fill to show range */}
      <defs>
        <linearGradient id="pressureGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a3c5e9"/>
          <stop offset="50%" stopColor="#7b003a" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#7b003a"/>
        </linearGradient>
      </defs>
      <rect x="20" y="44" width="260" height="16" rx="8" fill="url(#pressureGrad)" opacity="0.3"/>
      {/* Sweet spot marker 5-6 */}
      <rect x="138" y="40" width="52" height="24" rx="6" fill="#7b003a" opacity="0.15"/>
      <rect x="138" y="40" width="52" height="24" rx="6" fill="none" stroke="#7b003a" strokeWidth="2"/>
      {/* Tick marks */}
      {[0,1,2,3,4,5,6,7,8,9,10].map((n,i) => (
        <>
          <line key={"t"+n} x1={20+i*26} y1="40" x2={20+i*26} y2="64" stroke="#d5e6f5" strokeWidth="1"/>
          <text key={"l"+n} x={20+i*26} y="80" fontSize="10" textAnchor="middle" fill={n>=5&&n<=6?"#7b003a":"#8a95a8"} fontWeight={n>=5&&n<=6?"700":"400"} fontFamily="DM Sans,sans-serif">{n}</text>
        </>
      ))}
      {/* Labels */}
      <text x="20" y="100" fontSize="10" fill="#a3c5e9" fontFamily="DM Sans,sans-serif">Too loose</text>
      <text x="140" y="100" fontSize="10" fill="#7b003a" fontWeight="700" fontFamily="DM Sans,sans-serif">✓ Target zone</text>
      <text x="245" y="100" fontSize="10" fill="#7b003a" fontFamily="DM Sans,sans-serif">Too tight</text>
      {/* Toothpaste analogy */}
      <text x="150" y="20" fontSize="10" fill="#596070" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontStyle="italic">"Like holding a tube of toothpaste without squeezing paste out"</text>
    </svg>
  );
}

function GripHandPlacementSVG() {
  return (
    <svg viewBox="0 0 300 180" style={{width:"100%",maxWidth:300,display:"block",margin:"0 auto"}} aria-label="Left hand placement on grip - fingers not palm">
      {/* Club grip - diagonal */}
      <rect x="80" y="10" width="22" height="160" rx="11" fill="#c8a882" stroke="#a07850" strokeWidth="1.5" transform="rotate(-15,91,90)"/>
      {/* Palm line (wrong) */}
      <path d="M 60 40 Q 100 55 130 80" stroke="#c0644a" strokeWidth="2" strokeDasharray="5,4" fill="none"/>
      <text x="132" y="76" fontSize="9" fill="#c0644a" fontFamily="DM Sans,sans-serif">✗ Palm</text>
      {/* Finger line (correct) */}
      <path d="M 68 60 Q 105 72 132 94" stroke="#1b6b3a" strokeWidth="2.5" fill="none"/>
      <text x="133" y="92" fontSize="9" fill="#1b6b3a" fontWeight="700" fontFamily="DM Sans,sans-serif">✓ Fingers</text>
      {/* Left hand outline */}
      <ellipse cx="100" cy="100" rx="45" ry="58" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.5" transform="rotate(-15,100,100)" opacity="0.85"/>
      {/* Finger outlines */}
      <rect x="60" y="54" width="13" height="35" rx="6" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2" transform="rotate(-15,66,71)"/>
      <rect x="74" y="46" width="13" height="40" rx="6" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2" transform="rotate(-15,80,66)"/>
      <rect x="108" y="46" width="13" height="40" rx="6" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2" transform="rotate(-15,114,66)"/>
      <rect x="122" y="54" width="13" height="33" rx="6" fill="#f5d5b0" stroke="#d4a870" strokeWidth="1.2" transform="rotate(-15,128,70)"/>
      {/* Thumb */}
      <ellipse cx="106" cy="68" rx="9" ry="17" fill="#f0c898" stroke="#d4a870" strokeWidth="1.2" transform="rotate(-5,106,68)"/>
      {/* Diagonal line showing handle path */}
      <path d="M 55 62 L 78 90" stroke="#7b003a" strokeWidth="2" strokeDasharray="3,3"/>
      {/* Caption */}
      <text x="150" y="165" fontSize="10" fill="#596070" textAnchor="middle" fontFamily="DM Sans,sans-serif">Handle runs diagonally across finger base</text>
    </svg>
  );
}

/* ─── GRIP TAB ───────────────────────────────────────────────────────────── */
function GripTab() {
  const [view, setView] = useState("home"); // home | foundations | types | checklist | troubleshoot | adjustments
  const [checkState, setCheckState] = useState({});
  const [openTrouble, setOpenTrouble] = useState(null);

  const toggleCheck = id => setCheckState(p => ({ ...p, [id]: !p[id] }));
  const checkedCount = GRIP_CHECKLIST.filter(c => checkState[c.id]).length;

  if (view === "foundations") return (
    <div>
      <PageHeader title="Grip Foundations" subtitle="The three grip strengths explained" onBack={() => setView("home")} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        {GRIP_FOUNDATIONS.map(g => (
          <div key={g.id} style={{ ...card(`${C.maroon}33`), marginBottom:"1rem", overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.75rem" }}>
              <span style={{ fontSize:"1.8rem" }}>{g.icon}</span>
              <div>
                <div style={{ ...serif, fontSize:"1.1rem", color:C.maroon, fontWeight:700 }}>{g.name}</div>
                <div style={{ fontSize:"0.78rem", color:C.sub, marginTop:"0.1rem" }}>{g.ballFlight}</div>
              </div>
            </div>
            {/* Illustration */}
            <div style={{ background:C.bg, borderRadius:10, padding:"1rem 0.5rem", marginBottom:"1rem", border:`1px solid ${C.border}` }}>
              {g.id==="neutral" && <GripNeutralSVG/>}
              {g.id==="strong"  && <GripStrongSVG/>}
              {g.id==="weak"    && <GripWeakSVG/>}
            </div>
            <p style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.65, margin:"0 0 0.85rem" }}>{g.desc}</p>
            <div style={lbl}>How To Set It</div>
            <ul style={{ margin:"0.4rem 0 0", padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:"0.35rem" }}>
              {g.howTo.map((step,i) => (
                <li key={i} style={{ display:"flex", gap:"0.6rem", fontSize:"0.87rem", color:C.ink, lineHeight:1.45 }}>
                  <span style={{ width:18, height:18, borderRadius:"50%", background:C.maroon, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, flexShrink:0, marginTop:2 }}>{i+1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );

  if (view === "types") return (
    <div>
      <PageHeader title="Grip Styles" subtitle="Overlap, interlock, or ten-finger" onBack={() => setView("home")} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        {GRIP_TYPES.map(g => (
          <div key={g.id} style={{ ...card(g.popular ? `${C.maroon}44` : C.border), marginBottom:"1rem", overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.6rem" }}>
              <span style={{ fontSize:"1.8rem" }}>{g.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                  <span style={{ ...serif, fontSize:"1.1rem", color:C.maroon, fontWeight:700 }}>{g.name}</span>
                  {g.popular && <span style={{ fontSize:"0.65rem", background:C.maroon, color:C.white, borderRadius:10, padding:"0.1rem 0.45rem", fontWeight:700 }}>POPULAR</span>}
                </div>
                <div style={{ fontSize:"0.78rem", color:C.sub, marginTop:"0.1rem" }}>{g.whoFor}</div>
              </div>
            </div>
            {/* Illustration */}
            <div style={{ background:C.bg, borderRadius:10, padding:"1rem 0.5rem", marginBottom:"0.85rem", border:`1px solid ${C.border}` }}>
              {g.id==="overlap"   && <OverlapGripSVG/>}
              {g.id==="interlock" && <InterlockGripSVG/>}
              {g.id==="baseball"  && <TenFingerGripSVG/>}
            </div>
            <p style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.6, margin:"0 0 0.75rem" }}>{g.desc}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              <div style={card()}>
                <div style={{ ...lbl, color:"#1b6b3a" }}>Pros</div>
                {g.pros.map((p,i) => <div key={i} style={{ fontSize:"0.82rem", color:C.ink, marginTop:"0.25rem", lineHeight:1.4 }}>✓ {p}</div>)}
              </div>
              <div style={card()}>
                <div style={{ ...lbl, color:C.maroon }}>Cons</div>
                {g.cons.map((c,i) => <div key={i} style={{ fontSize:"0.82rem", color:C.ink, marginTop:"0.25rem", lineHeight:1.4 }}>✗ {c}</div>)}
              </div>
            </div>
          </div>
        ))}
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );

  if (view === "checklist") return (
    <div>
      <PageHeader title="Grip Checklist" subtitle={`${checkedCount} / ${GRIP_CHECKLIST.length} checked`} onBack={() => setView("home")}
        right={checkedCount===GRIP_CHECKLIST.length && <span style={{fontSize:"1.4rem"}}>✅</span>} />
      <div style={{ maxWidth:580, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ ...card(C.headerBg), background:C.headerBg+"22", marginBottom:"1rem" }}>
          <p style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.6, margin:"0 0 0.85rem" }}>Work through each point every time you take a grip. A consistent grip is the foundation of a consistent swing.</p>
          {/* Hand placement diagram */}
          <div style={{ background:C.white, borderRadius:10, padding:"0.85rem 0.5rem", marginBottom:"0.75rem", border:`1px solid ${C.border}` }}>
            <div style={{ ...lbl, textAlign:"center", marginBottom:"0.5rem" }}>Left Hand Placement</div>
            <GripHandPlacementSVG/>
          </div>
          {/* Pressure scale */}
          <div style={{ background:C.white, borderRadius:10, padding:"0.85rem 0.75rem", border:`1px solid ${C.border}` }}>
            <div style={{ ...lbl, textAlign:"center", marginBottom:"0.5rem" }}>Grip Pressure Scale</div>
            <GripPressureSVG/>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height:6, background:C.border, borderRadius:3, marginBottom:"1.25rem", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(checkedCount/GRIP_CHECKLIST.length)*100}%`, background:C.maroon, borderRadius:3, transition:"width 0.3s" }} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.55rem" }}>
          {GRIP_CHECKLIST.map(c => (
            <button key={c.id} onClick={() => toggleCheck(c.id)} style={{ ...card(checkState[c.id] ? `${C.maroon}55` : C.border), cursor:"pointer", textAlign:"left", display:"flex", gap:"0.85rem", alignItems:"flex-start", background: checkState[c.id] ? `${C.maroon}08` : C.white }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:checkState[c.id] ? C.maroon : C.bg, border:`2px solid ${checkState[c.id] ? C.maroon : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, transition:"all 0.15s" }}>
                {checkState[c.id] && <span style={{ color:C.white, fontSize:"0.7rem", fontWeight:700 }}>✓</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ ...serif, fontSize:"0.95rem", fontWeight:700, color: checkState[c.id] ? C.maroon : C.ink, marginBottom:"0.2rem" }}>{c.step}</div>
                <div style={{ fontSize:"0.83rem", color:C.sub, lineHeight:1.45, marginBottom:"0.3rem" }}>{c.check}</div>
                <div style={{ fontSize:"0.78rem", color:C.maroon, fontStyle:"italic" }}>💡 {c.cue}</div>
              </div>
            </button>
          ))}
        </div>
        {checkedCount === GRIP_CHECKLIST.length && (
          <div style={{ ...card(`${C.maroon}44`), marginTop:"1.25rem", textAlign:"center", background:`${C.maroon}08` }}>
            <div style={{ fontSize:"2rem", marginBottom:"0.4rem" }}>✅</div>
            <div style={{ ...serif, fontSize:"1.1rem", color:C.maroon, fontWeight:700 }}>Grip verified. Now go hit it.</div>
          </div>
        )}
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );

  if (view === "troubleshoot") return (
    <div>
      <PageHeader title="Grip Troubleshooting" subtitle="Diagnose your grip problem" onBack={() => setView("home")} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        {GRIP_TROUBLESHOOTING.map((t,i) => (
          <div key={i} style={{ marginBottom:"0.7rem" }}>
            <button onClick={() => setOpenTrouble(openTrouble===i ? null : i)} style={{ ...card(openTrouble===i ? `${C.maroon}55` : C.border), width:"100%", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", background: openTrouble===i ? `${C.maroon}08` : C.white }}>
              <div>
                <div style={{ ...serif, fontSize:"0.98rem", fontWeight:700, color:C.maroon }}>{t.problem}</div>
                <div style={{ fontSize:"0.78rem", color:C.sub, marginTop:"0.1rem" }}>Cause: {t.cause}</div>
              </div>
              <span style={{ color:C.maroon, fontSize:"1rem", flexShrink:0, marginLeft:"0.5rem" }}>{openTrouble===i ? "▲" : "▼"}</span>
            </button>
            {openTrouble===i && (
              <div style={{ ...card(), borderTop:"none", borderTopLeftRadius:0, borderTopRightRadius:0, borderColor:`${C.maroon}55` }}>
                <div style={lbl}>Fix</div>
                <p style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.6, margin:"0.25rem 0 0.75rem" }}>{t.fix}</p>
                <div style={lbl}>Drill</div>
                <p style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.6, margin:"0.25rem 0 0" }}>{t.drill}</p>
              </div>
            )}
          </div>
        ))}
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );

  if (view === "adjustments") return (
    <div>
      <PageHeader title="Grip Adjustments" subtitle="Shot-specific grip changes" onBack={() => setView("home")} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ ...card(C.headerBg), background:C.headerBg+"22", marginBottom:"1.25rem" }}>
          <p style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.6, margin:0 }}>Your grip isn't fixed. Subtle adjustments unlock different shot shapes, trajectories, and outcomes. These are the key changes to know.</p>
        </div>
        {GRIP_ADJUSTMENTS.map((a,i) => (
          <div key={i} style={{ ...card(), marginBottom:"0.7rem" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem" }}>
              <div style={{ ...serif, fontSize:"0.78rem", fontWeight:700, color:C.white, background:C.maroon, borderRadius:8, padding:"0.2rem 0.55rem", flexShrink:0, marginTop:2 }}>{a.shot}</div>
              <div>
                <div style={lbl}>Adjustment</div>
                <p style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.55, margin:"0.2rem 0 0.6rem" }}>{a.adjustment}</p>
                <div style={lbl}>Why It Works</div>
                <p style={{ fontSize:"0.85rem", color:C.sub, lineHeight:1.5, margin:"0.2rem 0 0" }}>{a.why}</p>
              </div>
            </div>
          </div>
        ))}
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );

  // HOME
  return (
    <div>
      <PageHeader title="Grip" subtitle="The only part of you touching the club" />
      <div style={{ maxWidth:500, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ ...card(C.headerBg), background:C.headerBg+"22", marginBottom:"1.25rem" }}>
          <p style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.65, margin:0 }}>Every swing deficiency can be traced back to the grip. It's the foundation of everything. Before working on your swing, check your grip.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
          {[
            { id:"foundations", icon:"📖", title:"Grip Foundations", desc:"Neutral, strong, and weak — what they do and how to set each one", color:C.maroon },
            { id:"types", icon:"🤝", title:"Grip Styles", desc:"Vardon, interlock, or ten-finger — which is right for you?", color:C.maroon },
            { id:"checklist", icon:"✅", title:"Grip Checklist", desc:"8 checkpoints to verify your grip before every session", color:C.maroon },
            { id:"troubleshoot", icon:"🔧", title:"Troubleshooting", desc:"Slicing, hooking, tension, inconsistency — diagnosed and fixed", color:C.maroon },
            { id:"adjustments", icon:"🎛️", title:"Shot Adjustments", desc:"Fade, draw, flop, punch — how to adjust your grip for each", color:C.maroon },
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{ ...card(`${item.color}33`), cursor:"pointer", display:"flex", alignItems:"center", gap:"1rem", textAlign:"left", color:C.ink }}>
              <span style={{ fontSize:"1.7rem", flexShrink:0 }}>{item.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ ...serif, fontSize:"1rem", color:item.color, fontWeight:700, marginBottom:"0.1rem" }}>{item.title}</div>
                <div style={{ fontSize:"0.8rem", color:C.sub, lineHeight:1.4 }}>{item.desc}</div>
              </div>
              <span style={{ color:item.color, flexShrink:0 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── STRATEGY TAB ───────────────────────────────────────────────────────── */
function StrategyTab() {
  const [view, setView] = useState("home");
  const [hole, setHole] = useState(null);

  if (view==="hole" && hole) return <HoleDetail hole={hole} onBack={() => setView("home")} />;
  if (view==="principles") return <PrinciplesView onBack={() => setView("home")} />;
  if (view==="planner") return <HolePlannerView onBack={() => setView("home")} />;

  return (
    <div>
      <PageHeader title="Course Strategy" subtitle="Smarter decisions. Fewer big numbers." />
      <div style={{ maxWidth:540, margin:"0 auto", padding:"1.25rem" }}>
        <button onClick={() => setView("planner")} style={{ ...card(`${C.maroon}44`), width:"100%", cursor:"pointer", display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1rem", textAlign:"left", color:C.ink }}>
          <span style={{ fontSize:"1.9rem" }}>🤖</span>
          <div style={{ flex:1 }}>
            <div style={{ ...serif, fontSize:"1rem", color:C.maroon, fontWeight:700, marginBottom:"0.1rem" }}>AI Hole Planner</div>
            <div style={{ fontSize:"0.8rem", color:C.sub, lineHeight:1.4 }}>Describe any hole — get a shot-by-shot game plan</div>
          </div>
          <span style={{ color:C.maroon }}>→</span>
        </button>
        <button onClick={() => setView("principles")} style={{ ...card(C.border), width:"100%", cursor:"pointer", display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem", textAlign:"left", color:C.ink }}>
          <span style={{ fontSize:"1.9rem" }}>📖</span>
          <div style={{ flex:1 }}>
            <div style={{ ...serif, fontSize:"1rem", color:C.maroon, fontWeight:700, marginBottom:"0.1rem" }}>Core Principles</div>
            <div style={{ fontSize:"0.8rem", color:C.sub }}>The 6 strategic foundations every golfer should know</div>
          </div>
          <span style={{ color:C.sub }}>→</span>
        </button>
        <div style={{ ...lbl, marginBottom:"0.65rem" }}>Situation Guides</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.65rem" }}>
          {HOLE_TYPES.map(h => (
            <button key={h.id} onClick={() => { setHole(h); setView("hole"); }} style={{ ...card(`${h.color}33`), cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:"0.25rem", color:C.ink, minHeight:90 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.1rem" }}>
                <span style={{ fontSize:"1.3rem" }}>{h.icon}</span>
                <span style={{ ...serif, fontSize:"0.9rem", color:h.color, fontWeight:700, lineHeight:1.2 }}>{h.name}</span>
              </div>
              <div style={{ fontSize:"0.75rem", color:C.sub, lineHeight:1.35 }}>{h.overview.slice(0,55)}...</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HoleDetail({ hole:h, onBack }) {
  return (
    <div>
      <PageHeader title={h.name} subtitle={h.overview} onBack={onBack} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        <div style={divLine}/>
        <Sec title="Strategic Principles" icon="📐">
          <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
            {h.principles.map((p,i) => (
              <div key={i} style={card()}>
                <div style={{ ...serif, fontSize:"0.95rem", color:C.maroon, fontWeight:700, marginBottom:"0.3rem" }}>{i+1}. {p.title}</div>
                <div style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.6 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </Sec>
        <Sec title="Miss Management" icon="🎯">
          <div style={{ ...card(`${C.maroon}44`), background:`${C.maroon}08` }}>
            <p style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.6, margin:0 }}>{h.missManagement}</p>
          </div>
        </Sec>
        <Sec title="Approach Note" icon="📍"><InfoCard>{h.approachNote}</InfoCard></Sec>
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );
}

function PrinciplesView({ onBack }) {
  return (
    <div>
      <PageHeader title="Core Principles" subtitle="The strategic foundations" onBack={onBack} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        {MANAGEMENT_PRINCIPLES.map((p,i) => (
          <div key={i} style={{ ...card(), marginBottom:"0.7rem" }}>
            <div style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:C.maroon, display:"flex", alignItems:"center", justifyContent:"center", ...serif, fontSize:"0.85rem", color:C.white, flexShrink:0 }}>{i+1}</div>
              <div>
                <div style={{ ...serif, fontSize:"1rem", color:C.maroon, fontWeight:700, marginBottom:"0.35rem" }}>{p.title}</div>
                <div style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.65 }}>{p.body}</div>
              </div>
            </div>
          </div>
        ))}
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );
}

function HolePlannerView({ onBack }) {
  const [form, setForm] = useState({ description:"", par:"4", yardage:"", wind:"none", conditions:"dry", skill:"intermediate", handicap:"" });
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const submit = async () => {
    if (!form.description) return;
    setLoading(true); setPlan(null); setErr(null);
    try { setPlan(await getAIHolePlan(form)); } catch { setErr("Couldn't generate the hole plan. Please try again."); }
    setLoading(false);
  };
  return (
    <div>
      <PageHeader title="AI Hole Planner" subtitle="Describe the hole. Get a game plan." onBack={plan ? ()=>setPlan(null) : onBack}
        right={plan && <button style={{...smBtn,background:C.white+"cc",borderColor:"transparent"}} onClick={()=>setPlan(null)}>Plan Another</button>} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        {!plan && (
          <>
            <div style={lbl}>Describe the hole</div>
            <textarea style={{ ...inputS, height:80, resize:"none", marginTop:"0.3rem", marginBottom:"1rem" }} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="e.g. 420 yard par 4, dogleg right at 230 yards, OB right, bunker guarding front left of green, pin tucked back right..." />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.85rem", marginBottom:"1.25rem" }}>
              {[["Par","par",["3","4","5"]],["Wind","wind",["none","light headwind","strong headwind","light tailwind","strong tailwind","left crosswind","right crosswind"]],["Conditions","conditions",["dry and firm","soft and wet","normal","links/coastal","parkland"]],["Skill Level","skill",["beginner","intermediate","low handicap","scratch"]]].map(([label,key,opts])=>(
                <div key={key}><div style={lbl}>{label}</div><Sel val={form[key]} onChange={v=>set(key,v)} opts={opts} /></div>
              ))}
              <div><div style={lbl}>Yardage</div><input style={{ ...inputS, marginTop:"0.3rem" }} type="number" placeholder="e.g. 420" value={form.yardage} onChange={e=>set("yardage",e.target.value)}/></div>
              <div><div style={lbl}>Handicap (optional)</div><input style={{ ...inputS, marginTop:"0.3rem" }} type="number" placeholder="e.g. 14" value={form.handicap} onChange={e=>set("handicap",e.target.value)}/></div>
            </div>
            {err && <div style={{ ...card(`${C.maroon}33`), marginBottom:"1rem", fontSize:"0.9rem", color:C.maroon }}>{err}</div>}
            <button onClick={submit} disabled={loading||!form.description} style={{ ...maroonBtn, opacity:loading||!form.description?0.5:1 }}>
              {loading ? "Building your game plan..." : "Get My Game Plan"}
            </button>
          </>
        )}
        {plan && (
          <div>
            <div style={{ ...card(`${C.maroon}33`), marginBottom:"1.25rem", background:`${C.maroon}06` }}>
              <div style={{ ...serif, fontSize:"1.3rem", color:C.maroon, marginBottom:"0.5rem" }}>Hole Assessment</div>
              <p style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.65, margin:"0 0 0.75rem" }}>{plan.holeAssessment}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
                <div style={{ ...card(`${C.maroon}33`), background:`${C.maroon}08` }}><div style={lbl}>Primary Danger</div><div style={{fontSize:"0.85rem",color:C.maroon,marginTop:"0.2rem",lineHeight:1.4}}>{plan.primaryDanger}</div></div>
                <div style={{ ...card("#1b6b3a33"), background:"#1b6b3a08" }}><div style={{...lbl,color:"#1b6b3a"}}>Scoring Goal</div><div style={{fontSize:"0.85rem",color:"#1b6b3a",marginTop:"0.2rem",lineHeight:1.4}}>{plan.scoringGoal}</div></div>
              </div>
            </div>
            <Sec title="Tee Strategy" icon="🏌️">
              <div style={card()}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"0.65rem" }}>
                  <div><div style={lbl}>Shot Type</div><div style={{...serif,fontSize:"0.9rem",color:C.maroon,marginTop:"0.15rem",fontWeight:600}}>{plan.teeStrategy?.shotType}</div></div>
                  <div><div style={lbl}>Club</div><div style={{...serif,fontSize:"0.9rem",color:C.maroon,marginTop:"0.15rem",fontWeight:600}}>{plan.teeStrategy?.club}</div></div>
                </div>
                <div><div style={lbl}>Target</div><div style={{fontSize:"0.88rem",color:C.ink,marginTop:"0.15rem"}}>{plan.teeStrategy?.target}</div></div>
                <div style={{marginTop:"0.5rem"}}><div style={lbl}>Why</div><div style={{fontSize:"0.85rem",color:C.sub,marginTop:"0.15rem",lineHeight:1.5}}>{plan.teeStrategy?.reasoning}</div></div>
              </div>
            </Sec>
            <Sec title="Approach Strategy" icon="📍">
              <div style={card()}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"0.65rem" }}>
                  <div><div style={lbl}>Target</div><div style={{...serif,fontSize:"0.9rem",color:C.maroon,marginTop:"0.15rem",fontWeight:600}}>{plan.approachStrategy?.target}</div></div>
                  <div><div style={lbl}>Club</div><div style={{...serif,fontSize:"0.9rem",color:C.maroon,marginTop:"0.15rem",fontWeight:600}}>{plan.approachStrategy?.club}</div></div>
                </div>
                <div><div style={lbl}>Land Here</div><div style={{fontSize:"0.88rem",color:C.ink,marginTop:"0.15rem"}}>{plan.approachStrategy?.landingZone}</div></div>
                <div style={{marginTop:"0.5rem"}}><div style={lbl}>Why</div><div style={{fontSize:"0.85rem",color:C.sub,marginTop:"0.15rem",lineHeight:1.5}}>{plan.approachStrategy?.reasoning}</div></div>
              </div>
            </Sec>
            <Sec title="Miss Management" icon="🎯">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                <div style={{ ...card("#1b6b3a33"), background:"#1b6b3a08" }}><div style={{...lbl,color:"#1b6b3a"}}>✓ Acceptable Miss</div><div style={{fontSize:"0.85rem",color:"#1b6b3a",marginTop:"0.2rem",lineHeight:1.5}}>{plan.acceptableMiss}</div></div>
                <div style={{ ...card(`${C.maroon}33`), background:`${C.maroon}08` }}><div style={lbl}>✗ Must Avoid</div><div style={{fontSize:"0.85rem",color:C.maroon,marginTop:"0.2rem",lineHeight:1.5}}>{plan.unacceptableMiss}</div></div>
              </div>
            </Sec>
            {plan.shortGameNote && <Sec title="Short Game Note" icon="◌"><InfoCard>{plan.shortGameNote}</InfoCard></Sec>}
            <ThoughtCard>{`"${plan.mindsetCue}"`}</ThoughtCard>
            <div style={{height:"1.5rem"}}/>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ROUTINE TAB ────────────────────────────────────────────────────────── */
function RoutineTab() {
  const [view, setView] = useState("home");
  const [templates, setTemplates] = useState(ROUTINE_TEMPLATES.map(t => ({ ...t, steps:[...t.steps.map(s=>({...s}))] })));
  const [active, setActive] = useState(null);
  const [editStep, setEditStep] = useState(null);
  const [runStep, setRunStep] = useState(0);
  const [checked, setChecked] = useState([]);

  const startRun = t => { setActive(t); setRunStep(0); setChecked([]); setView("run"); };
  const startEdit = t => { setActive(t); setView("edit"); };
  const addStep = tIdx => { const n=[...templates]; n[tIdx].steps.push({id:`s${Date.now()}`,label:"New step",note:"Describe this step..."}); setTemplates(n); };
  const removeStep = (tIdx,sIdx) => { const n=[...templates]; n[tIdx].steps.splice(sIdx,1); setTemplates(n); };
  const updateStep = (tIdx,sIdx,field,val) => { const n=[...templates]; n[tIdx].steps[sIdx][field]=val; setTemplates(n); };

  if (view==="run" && active) {
    const t = templates.find(x=>x.id===active.id)||active;
    const done = checked.length===t.steps.length;
    return (
      <div>
        <PageHeader title={t.name} subtitle={`${checked.length} / ${t.steps.length} complete`}
          onBack={() => setView("home")}
          right={done && <span style={{fontSize:"1.3rem"}}>✅</span>} />
        <div style={{ maxWidth:480, margin:"0 auto", padding:"1.25rem" }}>
          {done ? (
            <div style={{ textAlign:"center", padding:"2rem 0" }}>
              <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>✅</div>
              <h2 style={{ ...serif, fontSize:"1.6rem", color:C.maroon, marginBottom:"0.5rem" }}>Routine Complete</h2>
              <p style={{ color:C.sub, marginBottom:"1.5rem" }}>Commit and execute.</p>
              <button onClick={()=>{setChecked([]);setRunStep(0);}} style={{ ...maroonBtn, width:"auto", padding:"0.8rem 2rem" }}>Run Again</button>
            </div>
          ) : (
            <>
              <div style={{ ...card(`${C.maroon}44`), marginBottom:"1rem", padding:"1.25rem", background:`${C.maroon}06` }}>
                <div style={{ ...serif, fontSize:"1.3rem", color:C.maroon, marginBottom:"0.4rem" }}>{t.steps[runStep].label}</div>
                <div style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.5 }}>{t.steps[runStep].note}</div>
              </div>
              <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.5rem" }}>
                {runStep>0 && <button style={{ ...smBtn, flex:1, padding:"0.65rem" }} onClick={()=>{setRunStep(r=>r-1);setChecked(c=>c.filter(x=>x!==runStep-1));}}>← Prev</button>}
                <button onClick={()=>{setChecked(c=>[...new Set([...c,runStep])]);if(runStep<t.steps.length-1)setRunStep(r=>r+1);}}
                  style={{ ...maroonBtn, flex:2, padding:"0.65rem" }}>
                  {runStep===t.steps.length-1 ? "Complete ✓" : "Next →"}
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                {t.steps.map((s,i) => (
                  <div key={s.id} onClick={()=>setRunStep(i)} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.5rem 0.7rem", borderRadius:8, background:i===runStep?`${C.maroon}12`:C.white, border:`1.5px solid ${i===runStep?C.maroon:C.border}`, cursor:"pointer" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:checked.includes(i)?C.maroon:i===runStep?`${C.maroon}22`:C.bg, border:`1.5px solid ${checked.includes(i)?C.maroon:i===runStep?C.maroon:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", flexShrink:0 }}>
                      {checked.includes(i) ? <span style={{color:C.white,fontWeight:700}}>✓</span> : <span style={{color:i===runStep?C.maroon:C.muted,fontSize:"0.65rem"}}>{i+1}</span>}
                    </div>
                    <span style={{ fontSize:"0.88rem", color:i===runStep?C.maroon:C.sub }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (view==="edit" && active) {
    const tIdx = templates.findIndex(x=>x.id===active.id);
    const t = templates[tIdx];
    return (
      <div>
        <PageHeader title={`Edit: ${t.name}`} onBack={() => setView("home")} />
        <div style={{ maxWidth:500, margin:"0 auto", padding:"1.25rem" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.55rem", marginBottom:"1rem" }}>
            {t.steps.map((s,sIdx) => (
              <div key={s.id} style={card()}>
                {editStep&&editStep.tIdx===tIdx&&editStep.sIdx===sIdx ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                    <input style={inputS} value={s.label} onChange={e=>updateStep(tIdx,sIdx,"label",e.target.value)} placeholder="Step label"/>
                    <textarea style={{ ...inputS, height:60, resize:"none" }} value={s.note} onChange={e=>updateStep(tIdx,sIdx,"note",e.target.value)} placeholder="Step description..."/>
                    <div style={{ display:"flex", gap:"0.5rem" }}>
                      <button style={{ ...smBtn, flex:1 }} onClick={()=>setEditStep(null)}>Done ✓</button>
                      <button style={{ ...smBtn, color:C.maroon, borderColor:`${C.maroon}44` }} onClick={()=>removeStep(tIdx,sIdx)}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem" }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:C.maroon, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", color:C.white, flexShrink:0, marginTop:2 }}>{sIdx+1}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"0.92rem", color:C.ink, fontWeight:600, marginBottom:"0.15rem" }}>{s.label}</div>
                      <div style={{ fontSize:"0.8rem", color:C.sub, lineHeight:1.4 }}>{s.note}</div>
                    </div>
                    <button style={{ ...smBtn, padding:"0.2rem 0.5rem", fontSize:"0.75rem" }} onClick={()=>setEditStep({tIdx,sIdx})}>Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button style={{ width:"100%", background:"transparent", border:`1.5px dashed ${C.border}`, borderRadius:8, padding:"0.6rem", ...body, color:C.muted, cursor:"pointer", fontSize:"0.88rem", marginBottom:"1rem" }} onClick={()=>addStep(tIdx)}>+ Add Step</button>
          <button onClick={()=>startRun(t)} style={maroonBtn}>▶ Run This Routine</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Pre-Shot Routine" subtitle="Build it. Run it. Trust it." />
      <div style={{ maxWidth:500, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ ...card(C.headerBg), background:C.headerBg+"22", marginBottom:"1.25rem" }}>
          <p style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.6, margin:0 }}>A consistent pre-shot routine removes decision-making under pressure, builds commitment, and creates a reliable trigger for your best swing.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
          {templates.map(t => (
            <div key={t.id} style={{ ...card(), padding:"1rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.6rem" }}>
                <span style={{ fontSize:"1.3rem" }}>{t.icon}</span>
                <div>
                  <span style={{ ...serif, fontSize:"1rem", color:C.ink, fontWeight:700 }}>{t.name}</span>
                  <div style={{ fontSize:"0.75rem", color:C.sub }}>{t.steps.length} steps</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:"0.5rem" }}>
                <button onClick={()=>startRun(t)} style={{ ...maroonBtn, flex:2, padding:"0.55rem", fontSize:"0.9rem" }}>▶ Run</button>
                <button onClick={()=>startEdit(t)} style={{ ...smBtn, flex:1, padding:"0.55rem", textAlign:"center" }}>✏ Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PRACTICE TAB ───────────────────────────────────────────────────────── */
const WEAK_AREAS = ["Driver accuracy","Fairway woods","Long irons","Mid irons","Short irons","Wedge distance control","Spinning wedges","Chipping — Release 1","Pitching — Release 2","Lob shot — Release 3","Greenside bunkers","Fairway bunkers","Awkward lies","Course management","Putting — reading","Putting — pace","Mental game","Grip fundamentals"];

function PracticeTab() {
  const [weak, setWeak] = useState([]);
  const [duration, setDuration] = useState("60");
  const [skill, setSkill] = useState("intermediate");
  const [focus, setFocus] = useState("");
  const [equip, setEquip] = useState("full range");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const toggle = a => setWeak(p => p.includes(a) ? p.filter(x=>x!==a) : [...p,a]);
  const generate = async () => {
    if (!weak.length) return;
    setLoading(true); setPlan(null); setErr(null);
    try { setPlan(await getAIPracticePlan({ duration, weakAreas:weak, skill, focus, equipment:equip })); }
    catch { setErr("Couldn't generate your plan. Please try again."); }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Practice Planner" subtitle="Turn a bucket of balls into a purposeful session." />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        {!plan && (
          <>
            <div style={{ ...lbl, marginBottom:"0.5rem" }}>What Needs Work?</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", marginBottom:"1.25rem" }}>
              {WEAK_AREAS.map(a => (
                <button key={a} onClick={()=>toggle(a)} style={{ ...smBtn, padding:"0.3rem 0.7rem", fontSize:"0.8rem", ...(weak.includes(a)?{background:C.maroon,borderColor:C.maroon,color:C.white}:{}) }}>
                  {a}
                </button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.85rem", marginBottom:"1.25rem" }}>
              <div><div style={lbl}>Duration</div><Sel val={duration} onChange={setDuration} opts={["30","45","60","90","120"]} fmt={v=>`${v} minutes`}/></div>
              <div><div style={lbl}>Skill Level</div><Sel val={skill} onChange={setSkill} opts={["beginner","intermediate","low handicap","scratch"]}/></div>
              <div><div style={lbl}>Equipment</div><Sel val={equip} onChange={setEquip} opts={["full range","chipping area only","putting green only","full course","at home (no balls)"]}/></div>
              <div><div style={lbl}>Specific Focus</div><input style={{...inputS,marginTop:"0.3rem"}} value={focus} onChange={e=>setFocus(e.target.value)} placeholder="optional"/></div>
            </div>
            {err && <div style={{ ...card(`${C.maroon}33`), marginBottom:"1rem", fontSize:"0.9rem", color:C.maroon }}>{err}</div>}
            <button onClick={generate} disabled={loading||!weak.length} style={{ ...maroonBtn, opacity:loading||!weak.length?0.5:1 }}>
              {loading ? "Building your session..." : "Generate Session Plan"}
            </button>
            {!weak.length && <p style={{ color:C.muted, fontSize:"0.78rem", textAlign:"center", marginTop:"0.5rem" }}>Select at least one area above.</p>}
          </>
        )}
        {plan && (
          <div>
            <div style={{ ...card(`${C.maroon}33`), marginBottom:"1.25rem", background:`${C.maroon}06` }}>
              <div style={{ ...serif, fontSize:"1.4rem", color:C.maroon, marginBottom:"0.3rem" }}>{plan.sessionTitle}</div>
              <div style={{ fontSize:"0.78rem", color:C.maroon, fontWeight:700, marginBottom:"0.5rem" }}>{plan.totalTime} min session</div>
              <div style={lbl}>Session Goal</div>
              <p style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.5, margin:"0.2rem 0 0" }}>{plan.sessionGoal}</p>
            </div>
            <div style={{ ...card("#1b6b3a33"), marginBottom:"0.75rem", background:"#1b6b3a06" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.35rem" }}>
                <span style={{ ...serif, fontWeight:700, color:"#1b6b3a" }}>🌅 Warmup</span>
                <span style={{ fontSize:"0.75rem", color:C.sub }}>{plan.warmup?.duration} min</span>
              </div>
              <p style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.5, margin:0 }}>{plan.warmup?.description}</p>
            </div>
            {plan.blocks?.map((b,i) => (
              <div key={i} style={{ ...card(), marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.4rem" }}>
                  <div style={{ ...serif, fontSize:"0.98rem", color:C.maroon, fontWeight:700 }}>Block {i+1}: {b.title}</div>
                  <span style={{ fontSize:"0.75rem", color:C.sub, flexShrink:0 }}>{b.duration} min</span>
                </div>
                <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.5rem" }}>
                  {b.shots?.map(s => <span key={s} style={{ fontSize:"0.7rem", color:C.maroon, background:`${C.maroon}12`, border:`1px solid ${C.maroon}33`, borderRadius:20, padding:"0.1rem 0.45rem" }}>{s}</span>)}
                </div>
                <div style={lbl}>Drill</div>
                <p style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.5, margin:"0.2rem 0 0.5rem" }}>{b.drill}</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
                  <div style={card()}><div style={lbl}>Reps</div><div style={{fontSize:"0.82rem",color:C.ink,marginTop:"0.15rem"}}>{b.reps}</div></div>
                  <div style={card()}><div style={lbl}>Focus</div><div style={{fontSize:"0.82rem",color:C.ink,marginTop:"0.15rem"}}>{b.focus}</div></div>
                </div>
                {b.progression && <div style={{marginTop:"0.5rem"}}><div style={lbl}>Progression</div><p style={{fontSize:"0.82rem",color:C.sub,lineHeight:1.4,margin:"0.15rem 0 0"}}>{b.progression}</p></div>}
              </div>
            ))}
            <div style={{ ...card(), background:C.bg, marginBottom:"0.75rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.35rem" }}>
                <span style={{ ...serif, fontWeight:700, color:C.sub }}>🌇 Cooldown</span>
                <span style={{ fontSize:"0.75rem", color:C.sub }}>{plan.cooldown?.duration} min</span>
              </div>
              <p style={{ fontSize:"0.88rem", color:C.ink, lineHeight:1.5, margin:0 }}>{plan.cooldown?.description}</p>
            </div>
            <div style={{ ...card(`${C.maroon}44`), marginBottom:"1rem", background:`${C.maroon}06` }}>
              <div style={{ ...serif, fontSize:"0.82rem", color:C.maroon, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"0.35rem" }}>🏌️ Coach Says</div>
              <div style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.5 }}>{plan.coachNote}</div>
            </div>
            <button onClick={()=>{setPlan(null);setWeak([]);}} style={{ ...smBtn, width:"100%", padding:"0.65rem", textAlign:"center" }}>← Plan Another Session</button>
            <div style={{height:"1rem"}}/>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CADDIE TAB ─────────────────────────────────────────────────────────── */
function CaddieTab() {
  const [form, setForm] = useState({ distance:"", lie:"fairway", wind:"none", obstacles:"none", skill:"intermediate", notes:"" });
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const submit = async () => {
    if (!form.distance) return;
    setLoading(true); setResult(null); setErr(null);
    try { setResult(await getAICaddie(form)); } catch { setErr("Couldn't reach the AI caddie. Try again."); }
    setLoading(false);
  };
  const RC = { Safe:"#1b6b3a", Moderate:"#7a5000", Aggressive:C.maroon };
  const CC = { High:"#1b6b3a", Medium:"#7a5000", Low:C.maroon };

  return (
    <div>
      <PageHeader title="AI Caddie" subtitle="Describe your situation. Get the right shot." />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.85rem", marginBottom:"1.25rem" }}>
          <div><div style={lbl}>Distance to Pin (yards)</div><input style={{...inputS,marginTop:"0.3rem"}} type="number" placeholder="e.g. 45" value={form.distance} onChange={e=>set("distance",e.target.value)}/></div>
          <div><div style={lbl}>Skill Level</div><Sel val={form.skill} onChange={v=>set("skill",v)} opts={["beginner","intermediate","low handicap","scratch"]}/></div>
          <div><div style={lbl}>Lie</div><Sel val={form.lie} onChange={v=>set("lie",v)} opts={["fairway","rough","thick rough","tight/hardpan","uphill","downhill","sidehill-above","sidehill-below","greenside bunker","fairway bunker","fringe"]}/></div>
          <div><div style={lbl}>Wind</div><Sel val={form.wind} onChange={v=>set("wind",v)} opts={["none","light headwind","strong headwind","light tailwind","strong tailwind","left crosswind","right crosswind","gusty"]}/></div>
          <div><div style={lbl}>Obstacles</div><Sel val={form.obstacles} onChange={v=>set("obstacles",v)} opts={["none","bunker short","bunker long","trees","water short","water long","steep rough","tight pin"]}/></div>
          <div><div style={lbl}>Notes (optional)</div><input style={{...inputS,marginTop:"0.3rem"}} type="text" placeholder="e.g. firm greens..." value={form.notes} onChange={e=>set("notes",e.target.value)}/></div>
        </div>
        <button onClick={submit} disabled={loading||!form.distance} style={{ ...maroonBtn, opacity:loading||!form.distance?0.5:1, marginBottom:"0.5rem" }}>
          {loading ? "Reading the lie..." : "Get My Shot"}
        </button>
        {err && <div style={{ ...card(`${C.maroon}33`), color:C.maroon, fontSize:"0.9rem", marginTop:"0.75rem" }}>{err}</div>}
        {result && (
          <div style={{ marginTop:"1.5rem" }}>
            <div style={divLine}/>
            <div style={{ marginBottom:"1.25rem" }}>
              <div style={{ ...serif, fontSize:"1.9rem", color:C.maroon, fontWeight:700 }}>{result.primaryShot}</div>
              <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginTop:"0.4rem" }}>
                <span style={{ fontSize:"0.7rem", padding:"0.12rem 0.45rem", borderRadius:20, fontWeight:700, background:`${RC[result.riskLevel]}18`, color:RC[result.riskLevel], border:`1px solid ${RC[result.riskLevel]}44` }}>Risk: {result.riskLevel}</span>
                <span style={{ fontSize:"0.7rem", padding:"0.12rem 0.45rem", borderRadius:20, fontWeight:700, background:`${CC[result.confidence]}18`, color:CC[result.confidence], border:`1px solid ${CC[result.confidence]}44` }}>Confidence: {result.confidence}</span>
                <span style={{ fontSize:"0.7rem", background:`${C.maroon}12`, color:C.maroon, border:`1px solid ${C.maroon}33`, borderRadius:20, padding:"0.12rem 0.45rem", fontWeight:700 }}>{result.club}</span>
              </div>
            </div>
            <Sec title="Why This Shot" icon="🎯"><InfoCard>{result.rationale}</InfoCard></Sec>
            <Sec title="Key Adjustments" icon="📐"><KeyList items={result.keyAdjustments}/></Sec>
            <Sec title="Swing Thought" icon="💭"><ThoughtCard>{result.swingThought}</ThoughtCard></Sec>
            <Sec title="Alternative Shot" icon="↩"><InfoCard>{result.alternativeShot}</InfoCard></Sec>
            <div style={{ ...card(`${C.maroon}44`), background:`${C.maroon}06` }}>
              <div style={{ ...lbl, marginBottom:"0.35rem" }}>🏌️ Caddie Says</div>
              <div style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.5 }}>{result.caddieNote}</div>
            </div>
            <div style={{height:"1rem"}}/>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── EXCUSES TAB ────────────────────────────────────────────────────────── */
function ExcusesTab() {
  const [view, setView] = useState("home");
  const [libCat, setLibCat] = useState(Object.keys(EXCUSE_LIBRARY)[0]);
  const [confession, setConfession] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState(null);
  const [roulette, setRoulette] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [holes, setHoles] = useState(Array.from({length:18},(_,i)=>({number:i+1,issue:""})));
  const [narrative, setNarrative] = useState(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [narrativeErr, setNarrativeErr] = useState(null);
  const [copied, setCopied] = useState(null);

  const copyText = (text,id) => { navigator.clipboard?.writeText(text).catch(()=>{}); setCopied(id); setTimeout(()=>setCopied(null),2000); };
  const spin = () => {
    setSpinning(true); setRoulette(null); let count=0;
    const iv = setInterval(() => { setRoulette(ROULETTE_EXCUSES[Math.floor(Math.random()*ROULETTE_EXCUSES.length)]); count++; if(count>12){clearInterval(iv);setSpinning(false);} },100);
  };
  const generateAI = async () => {
    if (!confession.trim()) return;
    setAiLoading(true); setAiResult(null); setAiErr(null);
    try { setAiResult(await getAIExcuse(confession)); } catch { setAiErr("Couldn't generate your excuse. Perhaps that's a sign to just own it."); }
    setAiLoading(false);
  };
  const generateNarrative = async () => {
    const populated = holes.filter(h=>h.issue.trim());
    if (!populated.length) return;
    setNarrativeLoading(true); setNarrative(null); setNarrativeErr(null);
    try { setNarrative(await getPostRoundNarrative(populated)); } catch { setNarrativeErr("Couldn't build your narrative. The truth may be inescapable."); }
    setNarrativeLoading(false);
  };
  const CR = { "Bulletproof":"#1b6b3a", "Solid":"#7a5000", "Risky":C.maroon };

  if (view==="roulette") return (
    <div>
      <PageHeader title="Excuse Roulette" subtitle="Can't think of one? Let fate decide." onBack={() => setView("home")} />
      <div style={{ maxWidth:460, margin:"0 auto", padding:"1.25rem", textAlign:"center" }}>
        <div style={{ ...card(`${C.maroon}44`), minHeight:120, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem", marginBottom:"1.5rem", background:`${C.maroon}06` }}>
          {roulette ? <div style={{ ...serif, fontSize:"1.15rem", color:C.maroon, lineHeight:1.6, fontStyle:"italic" }}>"{roulette}"</div> : <div style={{ color:C.muted, fontSize:"0.9rem" }}>Press spin to receive your excuse</div>}
        </div>
        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"center" }}>
          <button onClick={spin} disabled={spinning} style={{ ...maroonBtn, width:"auto", padding:"0.85rem 2rem", opacity:spinning?0.7:1 }}>{spinning ? "Spinning..." : "🎰 Spin"}</button>
          {roulette && !spinning && <button onClick={()=>copyText(roulette,"roulette")} style={{ ...smBtn, padding:"0.85rem 1.25rem" }}>{copied==="roulette"?"Copied ✓":"Copy"}</button>}
        </div>
      </div>
    </div>
  );

  if (view==="generator") return (
    <div>
      <PageHeader title="AI Excuse Generator" subtitle="Confess. Receive excuse." onBack={() => { setView("home"); setAiResult(null); setConfession(""); }} />
      <div style={{ maxWidth:500, margin:"0 auto", padding:"1.25rem" }}>
        {!aiResult && (
          <>
            <div style={lbl}>What actually happened?</div>
            <textarea style={{ ...inputS, height:100, resize:"none", marginTop:"0.3rem", marginBottom:"1rem" }} value={confession} onChange={e=>setConfession(e.target.value)} placeholder="e.g. I three-putted five times, drove it OB on 4 and 13, and whiffed a chip on 17..."/>
            {aiErr && <div style={{ ...card(`${C.maroon}33`), color:C.maroon, fontSize:"0.88rem", marginBottom:"1rem", fontStyle:"italic" }}>{aiErr}</div>}
            <button onClick={generateAI} disabled={aiLoading||!confession.trim()} style={{ ...maroonBtn, opacity:aiLoading||!confession.trim()?0.5:1 }}>
              {aiLoading ? "Consulting the excuse consultant..." : "Generate My Excuse"}
            </button>
          </>
        )}
        {aiResult && (
          <div>
            <div style={{ ...card(`${(CR[aiResult.confidenceRating]||C.maroon)}33`), marginBottom:"1rem", padding:"1.25rem", background:`${CR[aiResult.confidenceRating]||C.maroon}06` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem" }}>
                <div style={lbl}>Your Excuse</div>
                <span style={{ fontSize:"0.7rem", padding:"0.12rem 0.45rem", borderRadius:20, fontWeight:700, background:`${CR[aiResult.confidenceRating]}18`, color:CR[aiResult.confidenceRating] }}>{aiResult.confidenceRating}</span>
              </div>
              <div style={{ ...serif, fontSize:"1.1rem", color:C.maroon, lineHeight:1.65, fontStyle:"italic", marginBottom:"0.9rem" }}>"{aiResult.excuse}"</div>
              <div style={lbl}>Delivery</div>
              <div style={{ fontSize:"0.85rem", color:C.sub, marginTop:"0.2rem", lineHeight:1.5 }}>{aiResult.delivery}</div>
            </div>
            {aiResult.alternativeExcuse && <div style={{ ...card(), marginBottom:"1rem" }}><div style={lbl}>Backup Excuse</div><div style={{ fontSize:"0.9rem", color:C.ink, marginTop:"0.2rem", lineHeight:1.5, fontStyle:"italic" }}>"{aiResult.alternativeExcuse}"</div></div>}
            <div style={{ display:"flex", gap:"0.6rem" }}>
              <button onClick={()=>copyText(aiResult.excuse,"ai")} style={{ ...smBtn, flex:1, padding:"0.6rem", textAlign:"center" }}>{copied==="ai"?"Copied ✓":"Copy Excuse"}</button>
              <button onClick={()=>{setAiResult(null);setConfession("");}} style={{ ...smBtn, flex:1, padding:"0.6rem", textAlign:"center" }}>Try Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (view==="postround") return (
    <div>
      <PageHeader title="Post-Round Narrative" subtitle="Mark the damage. Get the story." onBack={() => { setView("home"); setNarrative(null); setHoles(Array.from({length:18},(_,i)=>({number:i+1,issue:""}))); }} />
      <div style={{ maxWidth:500, margin:"0 auto", padding:"1.25rem" }}>
        {!narrative ? (
          <>
            <p style={{ color:C.sub, fontSize:"0.88rem", marginBottom:"1.25rem", lineHeight:1.5 }}>Note what went wrong on each hole. Leave blank if fine (or if you've chosen to forget it).</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem", marginBottom:"1.25rem", maxHeight:"50vh", overflowY:"auto" }}>
              {holes.map((h,i) => (
                <div key={h.number} style={{ display:"flex", alignItems:"center", gap:"0.65rem" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:h.issue?`${C.maroon}18`:C.bg, border:`1.5px solid ${h.issue?C.maroon:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", color:h.issue?C.maroon:C.muted, flexShrink:0, fontWeight:h.issue?700:400 }}>{h.number}</div>
                  <input style={{ ...inputS, fontSize:"0.85rem", padding:"0.45rem 0.75rem" }} placeholder={`Hole ${h.number} — what went wrong?`} value={h.issue} onChange={e=>{ const n=[...holes]; n[i]={...n[i],issue:e.target.value}; setHoles(n); }}/>
                </div>
              ))}
            </div>
            {narrativeErr && <div style={{ ...card(`${C.maroon}33`), color:C.maroon, fontSize:"0.88rem", marginBottom:"1rem", fontStyle:"italic" }}>{narrativeErr}</div>}
            <button onClick={generateNarrative} disabled={narrativeLoading||holes.every(h=>!h.issue.trim())} style={{ ...maroonBtn, opacity:narrativeLoading||holes.every(h=>!h.issue.trim())?0.5:1 }}>
              {narrativeLoading ? "Writing your story..." : "Build My Narrative"}
            </button>
          </>
        ) : (
          <div>
            <div style={{ ...card(`${C.maroon}44`), marginBottom:"1rem", padding:"1.25rem", background:`${C.maroon}06` }}>
              <div style={lbl}>Your Clubhouse Story</div>
              <div style={{ ...serif, fontSize:"1.1rem", color:C.maroon, lineHeight:1.75, marginTop:"0.5rem", fontStyle:"italic" }}>"{narrative.narrative}"</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"1rem" }}>
              <div style={card()}><div style={lbl}>The Hook</div><div style={{fontSize:"0.85rem",color:C.ink,marginTop:"0.2rem",lineHeight:1.5,fontStyle:"italic"}}>"{narrative.openingLine}"</div></div>
              <div style={card()}><div style={lbl}>One-Liner</div><div style={{fontSize:"0.85rem",color:C.ink,marginTop:"0.2rem",lineHeight:1.5,fontStyle:"italic"}}>"{narrative.headlineExcuse}"</div></div>
            </div>
            <div style={{ ...card(`${C.maroon}33`), marginBottom:"1rem", background:`${C.maroon}06` }}>
              <div style={{ ...lbl, marginBottom:"0.35rem" }}>🌅 The Closer</div>
              <div style={{ fontSize:"0.9rem", color:C.ink, lineHeight:1.5, fontStyle:"italic" }}>"{narrative.closingLine}"</div>
            </div>
            <div style={{ display:"flex", gap:"0.6rem" }}>
              <button onClick={()=>copyText(narrative.narrative,"narrative")} style={{ ...smBtn, flex:1, padding:"0.6rem", textAlign:"center" }}>{copied==="narrative"?"Copied ✓":"Copy Full Story"}</button>
              <button onClick={()=>{setNarrative(null);setHoles(Array.from({length:18},(_,i)=>({number:i+1,issue:""})));}} style={{ ...smBtn, flex:1, padding:"0.6rem", textAlign:"center" }}>Start Over</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (view==="library") return (
    <div>
      <PageHeader title="The Excuse Library" subtitle="30+ field-tested. Categorised for easy access." onBack={() => setView("home")} />
      <div style={{ maxWidth:540, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"1.25rem" }}>
          {Object.keys(EXCUSE_LIBRARY).map(cat => (
            <button key={cat} onClick={()=>setLibCat(cat)} style={{ ...smBtn, padding:"0.3rem 0.75rem", fontSize:"0.8rem", ...(libCat===cat?{background:C.maroon,borderColor:C.maroon,color:C.white}:{}) }}>{cat}</button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
          {EXCUSE_LIBRARY[libCat].map((item,i) => (
            <div key={i} style={card()}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.75rem" }}>
                <div style={{ flex:1 }}>
                  <div style={{ ...serif, fontSize:"1rem", color:C.maroon, lineHeight:1.55, marginBottom:"0.5rem", fontStyle:"italic" }}>"{item.excuse}"</div>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem" }}>
                    <span style={{ ...lbl, flexShrink:0 }}>Delivery:</span>
                    <span style={{ fontSize:"0.8rem", color:C.sub, lineHeight:1.4 }}>{item.delivery}</span>
                  </div>
                </div>
                <button onClick={()=>copyText(item.excuse,`lib-${i}`)} style={{ ...smBtn, padding:"0.25rem 0.6rem", fontSize:"0.75rem", flexShrink:0, marginTop:2 }}>{copied===`lib-${i}`?"✓":"Copy"}</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{height:"1.5rem"}}/>
      </div>
    </div>
  );

  // HOME
  return (
    <div>
      <PageHeader title="The Excuse Locker" subtitle="Because sometimes the golf was fine. It was everything else." />
      <div style={{ maxWidth:500, margin:"0 auto", padding:"1.25rem" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
          {[
            { id:"roulette",   icon:"🎰", title:"Excuse Roulette",         desc:"One tap. One excuse. No effort required." },
            { id:"generator",  icon:"🤖", title:"AI Excuse Generator",      desc:"Confess what actually happened. Get something you can say out loud." },
            { id:"postround",  icon:"📝", title:"Post-Round Narrative",     desc:"Mark the holes that went wrong. Get a full clubhouse story." },
            { id:"library",    icon:"📚", title:"The Excuse Library",       desc:"Browse 30+ field-tested excuses across 5 categories." },
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{ ...card(`${C.maroon}33`), cursor:"pointer", display:"flex", alignItems:"center", gap:"1rem", textAlign:"left", color:C.ink, background:`${C.maroon}04` }}>
              <span style={{ fontSize:"1.8rem", flexShrink:0 }}>{item.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ ...serif, fontSize:"1rem", color:C.maroon, fontWeight:700, marginBottom:"0.1rem" }}>{item.title}</div>
                <div style={{ fontSize:"0.8rem", color:C.sub, lineHeight:1.4 }}>{item.desc}</div>
              </div>
              <span style={{ color:C.maroon, flexShrink:0 }}>→</span>
            </button>
          ))}
        </div>
        <p style={{ color:C.muted, fontSize:"0.72rem", textAlign:"center", marginTop:"1.5rem", fontStyle:"italic" }}>No liability accepted for excuses used in medal rounds.</p>
      </div>
    </div>
  );
}

/* ─── SHARED COMPONENTS ──────────────────────────────────────────────────── */
function Sec({ title, icon, children }) {
  return (
    <div style={{ marginBottom:"1.3rem" }}>
      <div style={{ ...lbl, marginBottom:"0.5rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>{icon && <span>{icon}</span>}{title}</div>
      {children}
    </div>
  );
}
function InfoCard({ children }) {
  return <div style={{ background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:8, padding:"0.75rem 1rem", fontSize:"0.92rem", color:C.ink, lineHeight:1.55 }}>{children}</div>;
}
function ThoughtCard({ children, color }) {
  return (
    <div style={{ background:`${color||C.maroon}08`, border:`2px solid ${color||C.maroon}44`, borderRadius:10, padding:"1rem 1.2rem", fontSize:"1.1rem", fontStyle:"italic", color:color||C.maroon, textAlign:"center", ...serif }}>
      {children}
    </div>
  );
}
function KeyList({ items }) {
  return (
    <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"0.45rem" }}>
      {items?.map((k,i) => (
        <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.65rem", background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:8, padding:"0.6rem 0.85rem", fontSize:"0.88rem", color:C.ink, lineHeight:1.5 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:C.maroon, flexShrink:0, marginTop:7 }}/>
          <span>{k}</span>
        </li>
      ))}
    </ul>
  );
}
function WatchOut({ children }) {
  return (
    <div style={{ background:"#fce8ef", border:`1.5px solid ${C.maroon}55`, borderRadius:10, padding:"0.9rem 1.1rem" }}>
      <div style={{ ...lbl, marginBottom:"0.3rem" }}>⚠️ Watch Out</div>
      <div style={{ fontSize:"0.9rem", color:C.maroon, lineHeight:1.5 }}>{children}</div>
    </div>
  );
}
function DiffBadge({ d }) {
  const p = diffPal[d] || { bg:"#eee", text:"#666" };
  return <span style={{ fontSize:"0.67rem", padding:"0.12rem 0.45rem", borderRadius:20, fontWeight:700, background:p.bg, color:p.text }}>{d}</span>;
}
function Sel({ val, onChange, opts, fmt }) {
  return (
    <select style={{ ...inputS, cursor:"pointer", marginTop:"0.3rem" }} value={val} onChange={e=>onChange(e.target.value)}>
      {opts.map(o => <option key={o} value={o}>{fmt ? fmt(o) : o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
    </select>
  );
}
