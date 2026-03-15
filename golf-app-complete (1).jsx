import { useState } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const gold="#c9a84c",cream="#f5f0e6",muted="#a0956a";
const g900="#0e1a0e",g800="#162316",g700="#1f321f",g600="#2d4a2d",g500="#3d643d";
const serif={fontFamily:"'Playfair Display',Georgia,serif"};
const body={fontFamily:"Georgia,'Times New Roman',serif"};
const pg={minHeight:"100vh",background:`linear-gradient(160deg,${g900} 0%,${g800} 50%,#111a0c 100%)`,color:cream,...body};
const card=(border=g500)=>({background:`linear-gradient(135deg,${g700},${g800})`,border:`1px solid ${border}`,borderRadius:10,padding:"0.9rem 1rem"});
const smBtn={background:"transparent",border:`1px solid ${g500}`,color:muted,borderRadius:8,padding:"0.35rem 0.8rem",cursor:"pointer",fontSize:"0.8rem",...body};
const miniLbl={fontSize:"0.67rem",color:gold,letterSpacing:"0.07em",textTransform:"uppercase"};
const diffColor={Beginner:"#7eb87e",Intermediate:"#d4a843",Advanced:"#c0644a"};

// ─── SHOT DATA ────────────────────────────────────────────────────────────────
const SHOTS=[
  {id:"fade",name:"Fade",cat:"Shape",icon:"↗",sub:"Controlled left-to-right flight",diff:"Intermediate",
   setup:{ballPosition:"Half ball forward of standard",stance:"Open — feet left of target",weight:"50/50",grip:"Slightly weakened"},
   clubface:"Aimed at target — open relative to swing path",swingPath:"Out-to-in relative to target along foot line",
   swingThought:'"Swing left, hold the face open"',tempo:"Smooth and controlled",
   range:["Pick target 10 yards right, land on it","Rehearse open stance before each rep","Focus on smooth outside-in path — not a wristy flip"],
   course:["Use when pin is tucked right or OB is left","Club up — fades fly shorter","Aim left of your final target"],
   watchOut:"Opening the face too much = slice. Keep face square to target, not your feet."},
  {id:"draw",name:"Draw",cat:"Shape",icon:"↖",sub:"Powerful right-to-left flight",diff:"Intermediate",
   setup:{ballPosition:"Half ball back of standard",stance:"Closed — feet right of target",weight:"55% trail",grip:"Strengthened — both hands clockwise"},
   clubface:"Aimed at target — closed relative to swing path",swingPath:"In-to-out relative to target along foot line",
   swingThought:'"Attack from the inside, release through"',tempo:"Slightly aggressive through the ball",
   range:["Tee higher to encourage upward strike","Trail elbow drops close to hip on downswing","Exaggerate closed stance to feel the path"],
   course:["Use when pin is tucked left or hole bends left","Draws roll — account for extra run","Great for playing away from right-side trouble"],
   watchOut:"Over-rotating hands = snap hook."},
  {id:"hook",name:"Hook",cat:"Shape",icon:"↰",sub:"Sharp right-to-left curve",diff:"Advanced",
   setup:{ballPosition:"Back of center",stance:"Significantly closed",weight:"60% trail",grip:"Very strong — both hands well clockwise"},
   clubface:"Closed to path",swingPath:"Aggressive in-to-out, full hip rotation and early release",
   swingThought:'"Roll the forearms hard through"',tempo:"Fast, aggressive — commit fully",
   range:["Feel trail forearm rolling over lead through impact","Swing well right of target with aggressive release"],
   course:["Curve around trees or sharp dogleg left","Hooks run — plan for significant rollout"],
   watchOut:"Half-measures go straight left. Commit fully or play a draw."},
  {id:"punch",name:"Punch",cat:"Control",icon:"→",sub:"Low boring flight under the wind",diff:"Intermediate",
   setup:{ballPosition:"2 balls back of center",stance:"Slightly narrower",weight:"60% lead — stay there",grip:"Choke down 1 inch, hands forward"},
   clubface:"Square — forward press de-lofts naturally",swingPath:"Three-quarter backswing, firm lead wrist through",
   swingThought:'"Hands lead, club follows — quiet finish"',tempo:"Controlled and abbreviated",
   range:["Set shaft leaning toward target — feel it throughout","Finish at hip height","Hit into headwind to see flight flatten"],
   course:["Club up 1–2 clubs","Perfect under wind or tree branches","Commit — half-hearted punches come out fat"],
   watchOut:"If ball goes high, weight shifted back. Keep lead side heavy."},
  {id:"knockdown",name:"Knockdown",cat:"Control",icon:"↓",sub:"Flight-controlled into the wind",diff:"Intermediate",
   setup:{ballPosition:"1 ball back of standard",stance:"Standard width",weight:"55% lead",grip:"Slightly firmer"},
   clubface:"Square",swingPath:"Full backswing, three-quarter follow-through",
   swingThought:'"Swing through — hold the finish quiet"',tempo:"Smooth — not rushed",
   range:["Hit toward headwind to see flight flatten","Finish with hands below shoulder height"],
   course:["Strong headwinds and under trees","More reliable than punch for longer irons"],
   watchOut:"Excess speed kills the flight. Smooth wins."},
  {id:"stinger",name:"Stinger",cat:"Control",icon:"⚡",sub:"Penetrating low bullet off the tee",diff:"Advanced",
   setup:{ballPosition:"2 inches back of standard tee position",stance:"Slightly narrower, tee lower",weight:"55% lead",grip:"Standard — firm and even"},
   clubface:"Square",swingPath:"Full turn, steep compression down and through",
   swingThought:'"Cover the ball, hold the finish low"',tempo:"Aggressive but controlled",
   range:["Learn with 2-iron or hybrid before driver","Feel trapping the ball against turf"],
   course:["Under wind or finding a tight fairway","Position over distance"],
   watchOut:"Tiger's shot. Don't debut it under pressure."},
  {id:"chip",name:"Chip & Run",cat:"Short Game",icon:"◌",sub:"Low running shot from around the green",diff:"Beginner",
   setup:{ballPosition:"Back of stance",stance:"Narrow, slightly open. Flare lead foot.",weight:"70–80% lead",grip:"Choke down. No angle in lead wrist."},
   clubface:"Square",swingPath:"Rotate around lead side — grip butt points at lead hip at finish. No wrist hinge.",
   swingThought:'"Rotate around left side"',tempo:"Smooth and even",
   range:["Check grip butt points at lead hip at finish","Try 7i, 9i, PW — note roll distance","Land on specific spot 3 feet onto green"],
   course:["Default when you have green to work with","Land just onto putting surface and let it roll"],
   watchOut:"Lead wrist must never break down. Hands lead always."},
  {id:"pitch",name:"Pitch",cat:"Short Game",icon:"△",sub:"Mid-height 20–80 yard approach",diff:"Beginner",
   setup:{ballPosition:"Center to slightly forward",stance:"Slightly open, narrower",weight:"55% lead",grip:"Choke down slightly"},
   clubface:"Square or slightly open",swingPath:"Wrists hinge on backswing. Lead hands through — hold the angle.",
   swingThought:'"Hinge back — carry the tray through"',tempo:"Even rhythm",
   range:["Pause at top — check wrists are hinged","Hit to 20, 30, 40, 50 yard targets","Divot starts after the ball"],
   course:["Carry rough or bunker to reach the pin","Lands softer than chip"],
   watchOut:"Scooping at impact. Hands must lead clubhead through."},
  {id:"flop",name:"Flop",cat:"Short Game",icon:"☁",sub:"Maximum height from a tight lie",diff:"Advanced",
   setup:{ballPosition:"Forward — outside lead heel",stance:"Wide, open — feet 25–30° left",weight:"50/50",grip:"Open face FIRST — face to sky — THEN grip."},
   clubface:"Dramatically open — face looking at sky",swingPath:"Full swing along foot line. Face slides under ball.",
   swingThought:'"Under and through — commit fully"',tempo:"Full, committed — never decelerate",
   range:["Practise from fluffy rough before tight lies","20+ flops before trusting on course"],
   course:["ONLY when necessary — tight lie, no wind, lob wedge","R1 or R2 is nearly always safer"],
   watchOut:"Decelerating = skull, shank, or chunk. Commit or don't hit it."},
  {id:"bunker",name:"Greenside Bunker",cat:"Short Game",icon:"◡",sub:"Splash shot from greenside sand",diff:"Intermediate",
   setup:{ballPosition:"Forward — off lead heel",stance:"Wide, open, dig feet in",weight:"60% lead",grip:"Open face first, then grip"},
   clubface:"Open — face looking at sky",swingPath:"Swing along foot line. Enter sand 2 inches behind ball.",
   swingThought:'"Splash the sand — ball rides out"',tempo:"Near-full swing — accelerate through",
   range:["Draw a line — practise entering behind it","Finish high — quitting leaves club in sand"],
   course:["Sand or lob wedge only","Pick landing spot on green, not the hole"],
   watchOut:"Most amateurs swing too short. Near-full swing required."},
  {id:"uphill",name:"Uphill Lie",cat:"Specialty Lie",icon:"⬆",sub:"Ball on an upward slope",diff:"Intermediate",
   setup:{ballPosition:"Forward — toward high side",stance:"Tilt spine to match slope",weight:"Favour trail foot",grip:"Standard"},
   clubface:"Aim slightly right — uphill creates draw/pull bias",swingPath:"Follow the slope — swing up the hill",
   swingThought:'"Swing with the slope"',tempo:"Smooth — slope slows your turn",
   range:["Club down — uphill adds effective loft","Aim right — shot will draw/pull left"],
   course:["Club down 1–2 clubs","Aim right of target"],
   watchOut:"Not adjusting aim = every shot pulls left."},
  {id:"downhill",name:"Downhill Lie",cat:"Specialty Lie",icon:"⬇",sub:"Ball on a downward slope",diff:"Intermediate",
   setup:{ballPosition:"Back — toward low side",stance:"Tilt into the slope",weight:"More on lead foot",grip:"Standard"},
   clubface:"Aim slightly left",swingPath:"Follow slope — swing down the hill",
   swingThought:'"Chase the ball down the slope"',tempo:"Controlled",
   range:["Club up — downhill reduces effective loft","Aim left — shot will fade/push right"],
   course:["Club up 1–2 clubs","Ball runs more on landing"],
   watchOut:"Falling back into the hill mid-swing."},
  {id:"rough",name:"Rough Escape",cat:"Specialty Lie",icon:"🌿",sub:"Getting out of thick rough",diff:"Intermediate",
   setup:{ballPosition:"Middle of stance",stance:"Slightly open",weight:"60% lead",grip:"Firm — rough closes the face"},
   clubface:"Slightly open",swingPath:"Steeper downswing — avoid grass grabbing hosel",
   swingThought:'"Grip firm, go steep, trust the exit"',tempo:"Aggressive",
   range:["Open face at address to pre-compensate for closure","Heavy rough distance drops 20–40%"],
   course:["Priority: get back in play","Aim for widest part of fairway"],
   watchOut:"Decelerating through rough. Commit fully."},
];

// ─── 3 RELEASES DATA ─────────────────────────────────────────────────────────
const RELEASES=[
  {id:1,name:"Release 1",sub:"Chip & Run",tagline:"No wrist release — the foundation shot",color:"#7eb87e",icon:"①",
   principle:"Butt of grip points at lead hip in follow-through. Hands lead. Club follows. Always.",
   feels:"Like a long putting stroke — rock the shoulders, arms follow, no independent hand action.",
   when:"Any time you have green between you and the hole and no obstacle to carry. Default here first.",
   shots:[
    {id:"r1a",name:"Standard Chip & Run",icon:"◌",diff:"Beginner",sub:"Your go-to shot around the green",
     setup:{ballPosition:"Back of stance",stance:"Narrow, flare lead foot. Feet a clubhead's width apart.",weight:"Favour lead side",grip:"Choke to bottom. Lift handle — no angle in lead wrist."},
     clubface:"Square",swingPath:"Rotate around lead side pivot. Grip butt points at lead hip at finish.",
     swingThought:'"Rotate around the left side"',tempo:"Same pace back and through.",
     range:["Grip butt should point at lead hip at finish — check every shot","Different clubs roll different amounts: 7i rolls most, PW least","Pick a specific landing spot 3 feet onto green"],
     course:["No obstacle = Release 1. Always.","Land just onto putting surface, let it roll","More green = less loft. Less green = more loft."],
     watchOut:"Lead wrist breaks down = ball pops up. Handle must lead."},
    {id:"r1b",name:"Long Chip (20–30m)",icon:"→",diff:"Beginner",sub:"Extended chip from further off the green",
     setup:{ballPosition:"Middle-back of stance",stance:"Slightly wider but still narrow",weight:"60–65% lead",grip:"Choke down — build in a touch more length"},
     clubface:"Square",swingPath:"Longer arm swing, shoulder-controlled. More like a 30-foot putt.",
     swingThought:'"Long smooth putting stroke"',tempo:"Slightly longer — same even rhythm",
     range:["7-iron maximises roll and control from distance","Common error: wrist hinge — avoid. Go longer, not wristier"],
     course:["From 20–30 yards off a firm green, beats a pitch almost every time","Trust it — amateurs panic and flip from long range"],
     watchOut:"Length tempts you to add wrist hinge. Keep lead wrist flat throughout."},
    {id:"r1c",name:"Chip from Tight Lie",icon:"▬",diff:"Intermediate",sub:"Release 1 from hardpan or closely mown turf",
     setup:{ballPosition:"Slightly further back",stance:"Narrow as normal",weight:"65% lead",grip:"Choke down firmly. Maintain lead wrist angle."},
     clubface:"Square or slightly de-lofted — do NOT open on tight lie",swingPath:"Slightly steeper — pick the ball cleanly",
     swingThought:'"Nip it — don\'t dig it"',tempo:"Controlled and deliberate",
     range:["Lower-lofted club more forgiving than wedge from tight turf","Focus on front edge of ball","Square or closed face only on tight lies"],
     course:["Don't attempt a flop from tight lie — Release 1 is safest","Smooth tempo is everything"],
     watchOut:"Opening the face on a tight lie = thin shot."},
    {id:"r1d",name:"Chip from Rough",icon:"🌿",diff:"Intermediate",sub:"Modified Release 1 from fringe or collar rough",
     setup:{ballPosition:"Back of stance",stance:"Slightly open",weight:"65–70% lead",grip:"Firm grip"},
     clubface:"Slightly open — rough closes it at impact",swingPath:"Slightly steeper",
     swingThought:'"Firm grip, steeper path — commit through"',tempo:"Slightly more aggressive",
     range:["Open face at address to pre-compensate for closure","Ball from thin rough comes out hot (flier)"],
     course:["Flier from rough = ball lands hot and runs","Commit through — decelerating in rough is fatal"],
     watchOut:"Decelerating is most common error in rough."},
  ]},
  {id:2,name:"Release 2",sub:"Soft Landing / Pitch",tagline:"Hinge and hold — the versatile mid-shot",color:"#d4a843",icon:"②",
   principle:"Hinge the wrists going back, then lead the hands through. Hold the angle — don't flip.",
   feels:"Like carrying a tray with your lead hand — wrists hinge back, then stay firm and carry through.",
   when:"When you need to carry an obstacle, land the ball shorter, or control a 20–80 yard approach.",
   shots:[
    {id:"r2a",name:"Standard Pitch",icon:"△",diff:"Beginner",sub:"The core Release 2 — 20 to 80 yards",
     setup:{ballPosition:"Center to slightly forward",stance:"Slightly open, narrower",weight:"55% lead",grip:"Choke down slightly"},
     clubface:"Square",swingPath:"Wrists hinge going back. Lead hands pull through — hold angle. Don't flip.",
     swingThought:'"Hinge back — carry the tray through"',tempo:"Even rhythm — don't rush transition",
     range:["Pause at top — check wrists are hinged","Hit to 20, 30, 40, 50 yard targets","Divot must start after the ball"],
     course:["Use when you need to carry rough or a bunker","Varies distance with swing length, not speed"],
     watchOut:"Scooping — hands must lead clubhead through."},
    {id:"r2b",name:"High vs Low Pitch",icon:"↕",diff:"Intermediate",sub:"Controlling trajectory with Release 2",
     setup:{ballPosition:"Forward = higher. Back = lower.",stance:"Slightly open",weight:"55–60% lead",grip:"Standard choke down"},
     clubface:"Slightly open for high. Square for standard.",swingPath:"Same Release 2 motion. Ball position creates trajectory.",
     swingThought:'"Ball position controls height — not the hands"',tempo:"Same rhythm for both.",
     range:["High: ball forward, open face slightly","Low: ball back, hands forward","Practice hitting same distance at two heights"],
     course:["High pitch: pin is close, need ball to stop quickly","Low pitch: into wind or more green to work with"],
     watchOut:"Trying to 'help' ball up causes a flip. Open face and trust the loft."},
    {id:"r2c",name:"Checking Pitch",icon:"⟳",diff:"Intermediate",sub:"Generating spin to stop ball quickly",
     setup:{ballPosition:"Center",stance:"Slightly open",weight:"60% lead",grip:"Standard — clean grooves essential"},
     clubface:"Square — spin comes from clean contact, not open face",swingPath:"Steep descending blow. Ball first, then turf.",
     swingThought:'"Strike down — let the grooves do the work"',tempo:"Aggressive downswing",
     range:["Clean grooves before practising","From rough: no spin — plan for ball to release"],
     course:["Works best: clean lie, firm greens, 50–80 yards","From rough: play to middle of green"],
     watchOut:"Opening face and sliding under = kills spin. Descending strike creates it."},
    {id:"r2d",name:"Pitch from Rough",icon:"🌱",diff:"Intermediate",sub:"Release 2 adjusted for grass behind ball",
     setup:{ballPosition:"Center or slightly forward",stance:"Slightly open",weight:"60% lead",grip:"Firm grip — one club more lofted"},
     clubface:"Open slightly",swingPath:"Steeper downswing",
     swingThought:'"Go through it — not into it"',tempo:"Committed — never decelerate",
     range:["Thick rough: ball can come out as a flier OR very soft — read the lie","Intermediate rough: R2 works well — grip firmer"],
     course:["Flier lie: club down, aim short, expect it to run","Buried lie: open face, steep, get on green"],
     watchOut:"Flier from rough catches most golfers by surprise. Always account for it."},
  ]},
  {id:3,name:"Release 3",sub:"Lob & Bunker",tagline:"Full release — height, softness, and sand",color:"#c0644a",icon:"③",
   principle:"The clubface passes through under the ball. Hands release fully. Speed and loft together.",
   feels:"Like throwing a frisbee low under something. The face passes through and under — full release.",
   when:"Maximum height over an obstacle, very soft landing, or escaping a greenside bunker.",
   shots:[
    {id:"r3a",name:"Lob Shot",icon:"⌒",diff:"Intermediate",sub:"High, soft-landing shot with lob wedge",
     setup:{ballPosition:"Slightly forward of center",stance:"Slightly open",weight:"50/50",grip:"Standard — soft hands allow the release"},
     clubface:"Square to slightly open — trust the 60° loft",swingPath:"Full hinge back. Full release through — face passes under ball.",
     swingThought:'"Hinge fully, release fully — trust the loft"',tempo:"Smooth acceleration",
     range:["NOT the same as a flop — trust 60°","Feel difference between 'holding' (R2) and 'releasing' (R3)"],
     course:["20–60 yards when ball needs to land and stop","Short-sided pins over bunker or rough"],
     watchOut:"Half-commitment produces worst results. Full release needs full commitment."},
    {id:"r3b",name:"Flop Shot",icon:"☁",diff:"Advanced",sub:"Maximum height from tight lie",
     setup:{ballPosition:"Forward — outside lead heel",stance:"Wide, open — feet 25–30° left",weight:"50/50",grip:"Open face to sky FIRST — THEN grip."},
     clubface:"Dramatically open — face pointing skyward",swingPath:"Full swing along foot line. Full release — face slides under ball.",
     swingThought:'"Under and through — commit fully"',tempo:"Bigger, fuller swing than you think. Never decelerate.",
     range:["Fluffy rough before tight lies","Open face BEFORE gripping"],
     course:["ONLY: tight lie, no wind, lob wedge, no better option","R1 or R2 is nearly always safer"],
     watchOut:"Decelerating with open face = skull, shank, or chunk."},
    {id:"r3c",name:"Greenside Bunker",icon:"◡",diff:"Intermediate",sub:"Classic Release 3 splash shot",
     setup:{ballPosition:"Forward — off lead heel",stance:"Wide, open, dig feet in",weight:"60% lead",grip:"Open face first, THEN grip"},
     clubface:"Open — face at sky",swingPath:"Swing along foot line. Full Release 3 — enter sand 2 inches behind ball.",
     swingThought:'"Splash the sand — ball rides out"',tempo:"Near-full swing — accelerate through",
     range:["Draw line in sand — enter behind it every time","Finish high — quitting leaves club in sand"],
     course:["Sand or lob wedge only","Pick landing spot on green, not hole"],
     watchOut:"Most amateurs take too short a swing. Near-full swing required."},
    {id:"r3d",name:"Plugged Bunker",icon:"⬤",diff:"Advanced",sub:"Fried egg — different Release 3",
     setup:{ballPosition:"Back of center",stance:"Square or slightly closed",weight:"60% lead",grip:"Close the face — opposite of normal bunker"},
     clubface:"Square to slightly closed — leading edge digs",swingPath:"Steep V-shaped — chop down. Minimal follow-through.",
     swingThought:'"Chop into the sand behind it"',tempo:"Aggressive steep downswing",
     range:["Completely different to standard bunker","Ball comes out lower, runs more"],
     course:["Accept lower flight and more roll","Successful escape to anywhere on green is a win"],
     watchOut:"Using open-face splash on a plugged ball makes it worse. Close face, go steep."},
  ]},
];

// ─── COURSE MANAGEMENT DATA ───────────────────────────────────────────────────
const HOLE_TYPES=[
  {id:"dogleg-left",name:"Dogleg Left",icon:"↰",color:"#7eb87e",
   overview:"The hole bends left. Your priority is to set up the best angle into the green — not to maximise distance.",
   principles:[
     {title:"Tee ball position matters",body:"Tee on the right side of the box to open up the widest angle around the corner. A ball teed on the left forces you into the trees."},
     {title:"Play to the corner — not past it",body:"Unless you can carry the corner, play to the landing zone that leaves you the best approach angle. Cutting the corner saves distance but adds massive risk."},
     {title:"A draw works with you",body:"A controlled draw follows the shape of the hole. A fade fights it and often ends up in the right rough with an obstructed approach."},
     {title:"Know your carry distance",body:"Identify exactly how far you need to carry to clear the corner. If you can't carry it comfortably, lay back to the widest part of the fairway."},
   ],
   missManagement:"Miss right on the tee — the fairway opens up right. Missing left puts you through the corner into trouble.",
   approachNote:"After a well-placed tee shot, you'll have a shorter, more open approach. Don't give back the advantage by being aggressive to a tight pin."},
  {id:"dogleg-right",name:"Dogleg Right",icon:"↱",color:"#d4a843",
   overview:"The hole bends right. Position over distance — set up the angle, don't try to overpower the hole.",
   principles:[
     {title:"Tee on the left side of the box",body:"Opens up the corner angle and gives you more fairway to work with. Teeing on the right feeds your tee shot directly into the corner."},
     {title:"A fade works with you",body:"A controlled left-to-right shot follows the contour of the hole. If you hit a natural draw, aim further left and let the draw bring it back."},
     {title:"Aggressive corner cutting = big risk",body:"Only attempt to cut the corner if you know your exact carry distance and the opening is wide enough. One tree between you and the green ruins your round."},
     {title:"Lay up to your favourite yardage",body:"If in doubt, lay up with an iron or hybrid to the yardage you're most comfortable approaching from."},
   ],
   missManagement:"Miss left on the tee — more fairway left than right. Missing right feeds the ball through the dogleg into trouble or the rough.",
   approachNote:"A dogleg right often leaves a longer approach. Check pin position before committing to a club — tight right pins require a fade or precise distance control."},
  {id:"par3",name:"Par 3",icon:"⬤",color:"#c0644a",
   overview:"Every par 3 is a ball-striking test. One shot to the green. Your mindset, club selection, and target are everything.",
   principles:[
     {title:"Always take enough club",body:"The most common error on par 3s is taking too little club. Most greens are deeper than they look. When in doubt, take one more club and make a smooth swing."},
     {title:"Miss in the right place",body:"Before selecting a pin, identify where missing the green costs you least. Identify the fat of the green — the widest section — and make that your primary target if the pin is tucked."},
     {title:"Wind is amplified on par 3s",body:"Without the fairway as a buffer, wind affects ball flight more dramatically on a par 3. Add extra club into a headwind and consider the trajectory carefully."},
     {title:"Danger behind the pin",body:"If there's water, OB, or a severe slope behind the green, treat the pin as the back of your target window — not the centre."},
   ],
   missManagement:"Identify the safe miss before you pull a club. Front bunker short is better than water left. Determine which side costs least, then bias your target that direction.",
   approachNote:"Par 3 strategy is simple: take enough club, pick the fat of the green, and make a smooth committed swing. Bogey from the fat of the green is always available. A tight pin is a bonus."},
  {id:"par5-reachable",name:"Par 5 — Reachable",icon:"⚡",color:"#c9a84c",
   overview:"A reachable par 5 is where eagles and birdies are made — and where big numbers happen. Respect the risk.",
   principles:[
     {title:"Can you actually reach in two?",body:"Be honest. 'Reachable' means you can comfortably reach the green in regulation, not that you can hit the best shot of your life and get there. If you need a hero shot to reach, lay up."},
     {title:"The layup game wins",body:"A well-executed layup to your favourite wedge yardage gives you a real birdie chance. A poor second shot from 240 yards usually gives you a bogey."},
     {title:"Second shot is the most important",body:"On a reachable par 5, the decision on hole 2 defines the hole. Identify what you need: clear the water, carry the bunker, reach a certain yardage. Set that as your binary test."},
     {title:"Fairway wood or long iron second",body:"If going for it in two, fairway wood or hybrid is more reliable than a driver off the deck. Ball position and a sweeping motion is everything."},
   ],
   missManagement:"If going for it in two: miss short of the green, not through it. Short gives you a chip/bunker shot. Through the back on a par 5 often means an impossible up-and-down.",
   approachNote:"Lay up to your best wedge distance — 50, 80, or 100 yards depending on your strongest partial shot. Hitting a wedge from your favourite distance beats any forced long iron."},
  {id:"par5-long",name:"Par 5 — Long / Unreach.",icon:"⬆",color:"#7eb87e",
   overview:"You cannot reach this green in two. This is a 3-shot hole. Play it like one.",
   principles:[
     {title:"This is a birdie hole — play it conservatively",body:"An unreachable par 5 is actually a low-pressure scoring opportunity. Three good shots always gives you a birdie putt. Don't manufacture pressure that isn't there."},
     {title:"Plan your three shots from the green back",body:"Where do you want to be for your third shot? What's your favourite wedge distance? Plan your layup target backwards from there."},
     {title:"First layup is the most important shot",body:"Your second shot on a 3-shot par 5 determines everything. Lay up to the yardage that leaves you a full, comfortable wedge — not a partial one."},
     {title:"Avoid hero shots into danger",body:"Long par 5s often have water or bunkers protecting the green. The carry is massive — don't try to shortcut the hole with a low-percentage third shot."},
   ],
   missManagement:"On the second layup: miss to the widest section of the fairway. You don't need to be pin-high — you need a clean lie for your third shot.",
   approachNote:"Your third shot is a full or partial wedge from your favourite distance. This is a controlled scoring shot — not a pressure shot. Pick a landing spot on the green, not the hole."},
  {id:"water-left",name:"Water Left",icon:"💧",color:"#4a90d4",
   overview:"Water to the left creates a decisive risk zone. Your entire strategy must account for the water — where you aim, your shot shape, and your miss.",
   principles:[
     {title:"Start the ball right of the water",body:"Your ball's starting line must be right of the water's edge, not over it. A shot that starts over water and draws back is one miss from disaster."},
     {title:"Favour a fade or hold-off shot",body:"A left-to-right shot works away from the water. If you're a natural draw hitter, aim further right and let the draw bring it back — but be aware of where a straight shot lands."},
     {title:"Know the carry number",body:"How many yards to carry the water? Know this number before you take the club back. If you're between clubs, always take more."},
     {title:"The safe side is always right",body:"Missing right may cost you a chip from rough or a longer approach. Missing left potentially costs you two shots. Right is always the correct miss."},
   ],
   missManagement:"Always miss right. Short and right, rough and right — all of these are acceptable. Left is the only miss that's unacceptable.",
   approachNote:"Even if the pin is left, your target window stops 10 yards right of the flag on this hole. The water makes a left miss too expensive."},
  {id:"water-right",name:"Water Right",icon:"💦",color:"#4a90d4",
   overview:"Water to the right demands your attention from address. The entire right side of the hole is gone.",
   principles:[
     {title:"Start the ball left of the water",body:"Your starting line must be left of the water. A hold-off fade that starts straight and cuts toward water is a very high-risk shot on this hole."},
     {title:"Favour a draw or pull-draw",body:"A right-to-left shape works away from the water. If you're a natural fader, aim further left and allow for the fade — but note where a straight shot finishes."},
     {title:"Take enough club into the green",body:"With water right, the instinct is to overcook a draw and dump it left. Take enough club that you can make a smooth, confident swing."},
     {title:"Left rough beats the water every time",body:"You can make bogey from left rough. Water is an immediate 2+ shot penalty. There is no contest."},
   ],
   missManagement:"Always miss left. Rough left, bunker left, over the back left — all recoverable. Water right is not.",
   approachNote:"Aim at the left half of the green minimum. If the pin is right and water is right, the pin does not exist for you today. Middle of the green is your hole."},
  {id:"ob-left",name:"OB Left",icon:"🚧",color:"#c0644a",
   overview:"Out of bounds to the left is stroke-and-distance — the worst penalty in golf. Your entire game plan must account for it.",
   principles:[
     {title:"Stroke and distance is catastrophic",body:"OB left isn't a one-shot penalty — it's a complete disaster. You re-tee and are hitting 3. Accept that an aggressive line toward OB is not a risk/reward calculation. It's just risk."},
     {title:"Tee up on the left side of the box",body:"Teeing on the left side points you right and gives you the maximum fairway to aim into. Teeing right feeds your tee shot toward the OB."},
     {title:"A fade works for you here",body:"A controlled left-to-right shape moves the ball away from OB. If you hit a natural draw, aim significantly further right to allow for the curve."},
     {title:"The right side of the fairway is your friend",body:"Right rough is infinitely preferable to OB. Aim for the right-centre of the fairway and let the fade work. Right rough is a recoverable position."},
   ],
   missManagement:"Miss right every single time. Right rough, right bunker — anything right. The consequences of going left are too severe.",
   approachNote:"After a tee shot that stays right, your approach angle may be compromised. Take your medicine. A shot from the right rough to the fat of the green is always the right play."},
  {id:"tight-pin",name:"Tight / Tucked Pin",icon:"📍",color:"#c0644a",
   overview:"A pin tucked behind a bunker, against water, or in a corner of the green. The best players in the world miss this pin regularly. Know when to attack and when to take your medicine.",
   principles:[
     {title:"First question: what's the penalty for missing?",body:"If the penalty for missing the tight pin is a bunker or rough chip, it may be worth attacking. If the penalty is water or OB, the pin doesn't exist. Aim for the fat of the green."},
     {title:"You need the right shot shape",body:"A tight left pin requires a controlled fade that lands softly. A tight right pin needs a draw. If you don't have that shot in your bag today, don't try to manufacture it."},
     {title:"Where does a straight shot go?",body:"If you hit it exactly straight — no curve, no spin — where does it finish? If a straight shot is an acceptable result, the tight pin is attackable."},
     {title:"The number to the fat of the green",body:"Know the yardage to the middle of the green AND to the flag. If they differ by more than 15 yards, the pin is genuinely tucked. Use the middle distance."},
   ],
   missManagement:"On a tucked pin, your acceptable miss is always to the fat side — long and middle rather than short and right into the bunker.",
   approachNote:"Tour professionals aim at tight pins because their dispersion is small enough to make it worthwhile. For most amateurs, aiming at the fat of the green produces the same scoring average with far fewer big numbers."},
  {id:"into-wind",name:"Into the Wind",icon:"💨",color:"#a0956a",
   overview:"A strong headwind is not an obstacle to overpower. It's a condition to work with. Swing easier, take more club.",
   principles:[
     {title:"Every 10mph headwind = 1–2 extra clubs",body:"A 20mph headwind can easily require two extra clubs. Most amateurs take one club too few into wind and watch it fall short. Always err on the side of more club."},
     {title:"Swing slower, not harder",body:"The instinct is to swing harder into wind. This adds backspin and actually makes the ball balloon higher. A smooth 80% swing with more club keeps the flight penetrating."},
     {title:"A lower ball flight wins",body:"Into wind: punch shots, knockdowns, and a tight ball flight beat high floating shots every time. Use a lower loft if possible and flight the ball under the wind."},
     {title:"Leave the driver in the bag",body:"If you hit a towering driver, consider a 3-wood or hybrid into a strong headwind. Lower launch and less spin cuts through the wind more efficiently."},
   ],
   missManagement:"Into wind, shots hit short are more common than long. Leave yourself with an uphill putt — miss to the front half of the green rather than long.",
   approachNote:"Into wind: take 2 clubs more, make a smooth swing, flight the ball lower. Your 150-yard carry club is now a 130-yard club. Don't let ego make the decision."},
  {id:"downwind",name:"Downwind",icon:"🌬️",color:"#7eb87e",
   overview:"A tailwind adds distance but reduces backspin and the ability to stop the ball on the green. Plan accordingly.",
   principles:[
     {title:"Club down — but not as much as you think",body:"A tailwind helps carry but doesn't add as much distance as most golfers expect — typically 1 club worth in a moderate tailwind. Don't underclub so much that you're now guessing."},
     {title:"Ball won't stop — land it short",body:"Reduced backspin means the ball runs out significantly on landing. Aim for the front portion of the green or even short of it and let the ball release to the hole."},
     {title:"Shots feel easier — but scoring doesn't get easier",body:"Downwind approach shots are actually harder to judge than into-wind shots because of the reduced stopping power. Take your time and think about where you want the ball to land."},
     {title:"Short game adjustments",body:"Downwind pitch and chip shots release more than normal. A tight downwind chip to a short pin requires extra care — the ball will run out significantly."},
   ],
   missManagement:"Downwind = miss short. The ball will find the back of everything. Take slightly less club and land it on the front half of the green.",
   approachNote:"The key question downwind isn't how far you can hit it — it's where does the ball need to land for it to finish at the hole. Work back from that landing spot."},
];

const MANAGEMENT_PRINCIPLES=[
  {title:"Play to the fat of the green, not the pin",body:"Unless you have a specific shot to attack a tight pin, the fat of the green is your default target on every approach. It maximises your chance of being on the green in regulation and removes most penalty risks."},
  {title:"Always know your 'acceptable miss'",body:"Before every shot, ask: if I miss this slightly, where does it go? The acceptable miss is where missing is recoverable. The unacceptable miss is water, OB, or unplayable rough. Bias your aim toward the acceptable miss."},
  {title:"Score management: protect your score",body:"Once you're in trouble, your only job is to get back in play as efficiently as possible. A bogey from a bad tee shot is fine. A triple bogey from trying to be a hero is not. The recovery shot is the most important shot in golf."},
  {title:"Lay up to your favourite yardage",body:"Identify the yardage from which you hit your most consistent shots — often 80, 100, or 120 yards. On par 5s and long par 4s, make decisions that set up that exact yardage. A wedge from 100 yards beats a forced 5-iron every time."},
  {title:"Tee box position is a free advantage",body:"The tee box gives you two club-lengths of width to use strategically. Tee up on the side of the trouble to aim away from it. This single adjustment eliminates one side of the hole."},
  {title:"Play the shot in front of you, not the scorecard",body:"The biggest course management error is playing based on what you need to score, not what the shot requires. Every shot deserves your full, objective attention. Good course management means the scorecard takes care of itself."},
];

// ─── AI HELPERS ───────────────────────────────────────────────────────────────
async function callClaude(prompt){
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:prompt}]})});
  const d=await r.json();
  return d.content.map(i=>i.text||"").join("");
}

async function getAICaddie(ctx){
  const text=await callClaude(`You are an expert golf caddie. Recommend the ideal shot for this situation.
Distance: ${ctx.distance}yd | Lie: ${ctx.lie} | Wind: ${ctx.wind} | Obstacles: ${ctx.obstacles} | Skill: ${ctx.skill} | Notes: ${ctx.notes||"none"}
Respond ONLY in JSON, no markdown: {"primaryShot":"name","club":"club","confidence":"High/Medium/Low","rationale":"2-3 sentences","keyAdjustments":["1","2","3"],"swingThought":"one thought","alternativeShot":"name","riskLevel":"Safe/Moderate/Aggressive","caddieNote":"one honest insight"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function getAIPracticePlan(ctx){
  const text=await callClaude(`You are an expert golf coach. Create a structured practice session plan.
Duration: ${ctx.duration} minutes | Weak areas: ${ctx.weakAreas.join(", ")} | Skill: ${ctx.skill} | Focus: ${ctx.focus||"general"} | Equipment: ${ctx.equipment}
Respond ONLY in JSON, no markdown: {"sessionTitle":"title","totalTime":${ctx.duration},"warmup":{"duration":5,"description":"warmup"},"blocks":[{"title":"block title","duration":10,"shots":["shot1"],"drill":"drill description","reps":"X reps","focus":"focus","progression":"how to progress"}],"cooldown":{"duration":5,"description":"cooldown"},"sessionGoal":"one clear goal","coachNote":"one honest insight"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function getAIHolePlan(ctx){
  const text=await callClaude(`You are an elite golf caddie and course management expert. Create a hole-by-hole game plan for this golfer.
Hole description: ${ctx.description}
Par: ${ctx.par} | Yardage: ${ctx.yardage} yards | Wind: ${ctx.wind} | Conditions: ${ctx.conditions} | Skill level: ${ctx.skill}
Handicap: ${ctx.handicap||"not specified"}

Provide a shot-by-shot strategy for this hole.
Respond ONLY in JSON, no markdown: {
  "holeAssessment": "2 sentence overview of this hole's demands",
  "primaryDanger": "the single biggest risk on this hole",
  "teeStrategy": {"shotType":"shot shape/type","target":"where to aim","club":"club recommendation","reasoning":"why"},
  "approachStrategy": {"target":"where on the green","club":"estimated club","landingZone":"where to land the ball","reasoning":"why"},
  "acceptableMiss": "where a slightly missed shot is still recoverable",
  "unacceptableMiss": "what you must avoid at all costs",
  "shortGameNote": "if relevant — any short game or putting notes for this green",
  "scoringGoal": "realistic target score and how to achieve it",
  "mindsetCue": "one mindset or attitude cue for this hole"
}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

// ─── EXCUSE DATA ─────────────────────────────────────────────────────────────
const EXCUSE_LIBRARY={
  "The Conditions":[
    {excuse:"The wind changed direction on every single hole. Completely unplayable.",delivery:"Say it with genuine bewilderment. Shake your head slowly."},
    {excuse:"The greens were so slow in the morning, then by the back nine they were like glass. You can't adjust that quickly.",delivery:"Said best while gesturing toward the green you just three-putted."},
    {excuse:"Playing into the sun on 7, 8, and 9. Couldn't see a thing. Should be a local rule.",delivery:"Squint slightly as you say it, for authenticity."},
    {excuse:"That breeze looks calm but it's swirling up there. Completely invisible. Tour pros talk about it all the time.",delivery:"Look upward knowingly. Peer pressure the group into agreeing."},
    {excuse:"Wet rough grabs the club completely differently. You can't spin it, you can't control it. Nothing works.",delivery:"Works best immediately after a pitch that ran 30 feet past the pin."},
    {excuse:"The course is playing two clubs longer today. Everything was coming up short.",delivery:"Universal. Applicable to any round at any time of year."},
  ],
  "The Equipment":[
    {excuse:"I've been testing a new ball this week. Still finding the distances.",delivery:"Best deployed within the first three holes so you have the full round to lean on it."},
    {excuse:"Borrowed my mate's 3-wood. Completely different shaft. Can't trust it at all.",delivery:"Be specific about the shaft — 'too whippy' works well."},
    {excuse:"My grips are getting slippery. Really need to regrip before the next round.",delivery:"Rub your hands together as you say it. Very convincing."},
    {excuse:"The driver face is going. I can tell. It's not launching the same way.",delivery:"Advanced move. Requires a straight face and complete commitment."},
    {excuse:"Different tee this week — plastic instead of wood. Completely changed my feel off the tee.",delivery:"Nobody will question this. Nobody."},
    {excuse:"My rangefinder was giving me wrong distances all day. I was flying everything.",delivery:"Works brilliantly if you play without a rangefinder."},
  ],
  "The Body":[
    {excuse:"My back's been giving me grief since Tuesday. I was swinging completely differently.",delivery:"The evergreen. Ageless. Appropriate in any decade of your life."},
    {excuse:"Tight hamstrings today. Couldn't get my full turn. You could see it in the swing.",delivery:"Do a brief hamstring stretch as you say it."},
    {excuse:"I played yesterday as well. Legs are completely gone. Dead on my feet by the 12th.",delivery:"The double-round excuse. Respectable and sympathetic."},
    {excuse:"Still a bit dehydrated from the week. Not at 100%. Completely affects your feel.",delivery:"Drink water visibly throughout the round for maximum effect."},
    {excuse:"New shoes. Blisters on both feet by the 7th. Couldn't concentrate on anything.",delivery:"Limp very slightly on the walk off the 18th."},
    {excuse:"My right elbow's been a bit inflamed. Trying not to let it affect the swing but it does.",delivery:"The elbow. Untestable. Unverifiable. Perfect."},
  ],
  "The Course":[
    {excuse:"The yardages on the card are completely wrong. I was short on every par 3.",delivery:"Reference a specific hole. '14 is definitely not 185' is a classic."},
    {excuse:"That pin position on 11 was genuinely unfair. Right behind the bunker. Nobody's making par from the right.",delivery:"Bonus points if you made par from the right."},
    {excuse:"The fairway on 6 kicks everything into the rough. I hit a perfect drive and ended up in a divot.",delivery:"A divot! Even better than rough. Completely undeserved."},
    {excuse:"These greens are bumpy from all the traffic. Ball was bouncing all over the place on the approach.",delivery:"Delivered best while walking off a green you three-putted."},
    {excuse:"Slow play absolutely killed my rhythm. An hour wait on the 7th tee and I just went cold.",delivery:"The most legitimate excuse on this list. Use with confidence."},
    {excuse:"The rough is brutal at the moment. Four weeks without rain. Like hitting out of concrete.",delivery:"Works in any weather. Drought or monsoon."},
  ],
  "The Mind":[
    {excuse:"Just couldn't get into it today. The mind was elsewhere. You know how it is.",delivery:"Vague, plausible, and completely unverifiable. A masterpiece."},
    {excuse:"Busy week at work. Head's still full of it. Couldn't switch off properly.",delivery:"The work excuse. Generates sympathy and ends the conversation."},
    {excuse:"I was playing well and then someone behind us hit a shot and it completely broke my focus on 9.",delivery:"Name no names. Imply everything."},
    {excuse:"I've been working on a swing change and it's in between stages at the moment. You look worse before you look better.",delivery:"Covers any number of catastrophic shots. Blame the process."},
    {excuse:"The group in front was so slow it completely ruined my warm-up and my momentum.",delivery:"Pace of play: the gift that keeps on giving."},
    {excuse:"I know where I went wrong. I've figured it out. Today was basically practice.",delivery:"The reframe. Today wasn't bad golf — it was research."},
  ],
};

const ROULETTE_EXCUSES=[
  "The wind changed direction on every single hole.",
  "My back's been giving me grief since Tuesday.",
  "The yardages on the card are completely wrong.",
  "I've been testing a new ball this week. Still finding the distances.",
  "Couldn't get into it today. Head was elsewhere.",
  "The greens were so slow in the morning, then like glass by the back nine.",
  "Borrowed a mate's 3-wood. Completely different shaft.",
  "Slow play on 7 killed my rhythm completely.",
  "Playing into the sun on half the holes. Should be a local rule.",
  "New shoes. Blisters by the 7th. Couldn't concentrate.",
  "I was working on a swing change. You look worse before you look better.",
  "The rough is brutal right now. Like hitting out of concrete.",
  "My rangefinder was giving wrong distances all day.",
  "The fairway on 6 kicks everything into the rough. Perfect drive, ended up in a divot.",
  "Tight hamstrings. Couldn't get my full turn.",
  "Busy week at work. Head still full of it. Couldn't switch off.",
  "The greens are bumpy from all the traffic. Ball was bouncing all over.",
  "My grips are getting slippery. Need to regrip before next time.",
  "Today was basically practice. I know exactly what went wrong.",
  "The pin on 11 was genuinely unfair. Nobody's making par from the right side.",
];

async function getAIExcuse(confession){
  const text=await callClaude(`You are a golf excuse consultant — a hilarious, world-class expert at turning genuine golfing disasters into plausible, dignified excuses that can be delivered in the clubhouse with a straight face.

The golfer confesses: "${confession}"

Generate a clubhouse-ready excuse. It should be:
- Plausible enough that no one will directly challenge it
- Slightly self-deprecating but ultimately blame-deflecting
- Specific enough to sound genuine (vague excuses are suspicious)
- Funny without being obviously a joke
- No longer than 2-3 sentences

Respond ONLY in JSON, no markdown:
{"excuse":"the full excuse to say out loud","delivery":"one sentence on how to deliver it for maximum effect","confidenceRating":"Bulletproof/Solid/Risky","alternativeExcuse":"a backup if the first one doesn't land"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function getPostRoundNarrative(holes){
  const summary=holes.filter(h=>h.issue).map(h=>`Hole ${h.number}: ${h.issue}`).join(", ");
  const text=await callClaude(`You are a golf excuse consultant. Create a complete post-round narrative that a golfer can use in the clubhouse to explain a difficult round.

The difficult moments were: ${summary}

Create a flowing, natural-sounding story that a golfer could actually say out loud. It should:
- Connect the incidents into a coherent narrative of misfortune
- Sound genuine and slightly unlucky rather than incompetent
- Be 3-4 sentences maximum — something you'd actually say
- Assign blame to conditions, equipment, or circumstances — never the golfer's ability
- End on an optimistic note about next time

Respond ONLY in JSON, no markdown:
{"narrative":"the complete clubhouse story to tell","openingLine":"the first sentence — the hook","closingLine":"the optimistic closer","headlineExcuse":"one-line summary excuse if they only want the short version"}`);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const TABS=[
  {id:"shots",label:"Shots",icon:"📚"},
  {id:"shortgame",label:"Short Game",icon:"⛳"},
  {id:"course",label:"Strategy",icon:"🗺️"},
  {id:"routine",label:"Routine",icon:"🧘"},
  {id:"practice",label:"Practice",icon:"🎯"},
  {id:"caddie",label:"Caddie",icon:"🤖"},
  {id:"excuses",label:"Excuses",icon:"🤷"},
];

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("shots");
  const [shotMode,setShotMode]=useState("course");
  return(
    <div style={{...pg,paddingBottom:72}}>
      {tab==="shots"&&<ShotsTab mode={shotMode} onMode={()=>setShotMode(m=>m==="range"?"course":"range")}/>}
      {tab==="shortgame"&&<ShortGameTab mode={shotMode} onMode={()=>setShotMode(m=>m==="range"?"course":"range")}/>}
      {tab==="course"&&<CourseManagementTab/>}
      {tab==="routine"&&<RoutineTab/>}
      {tab==="practice"&&<PracticeTab/>}
      {tab==="caddie"&&<CaddieTab/>}
      {tab==="excuses"&&<ExcusesTab/>}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:g900,borderTop:`1px solid ${g600}`,display:"flex",zIndex:100}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"0.5rem 0.1rem 0.55rem",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.12rem"}}>
            <span style={{fontSize:"1.15rem"}}>{t.icon}</span>
            <span style={{fontSize:"0.58rem",...body,color:tab===t.id?gold:muted,fontWeight:tab===t.id?700:400}}>{t.label}</span>
            {tab===t.id&&<div style={{width:3,height:3,borderRadius:"50%",background:gold}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SHOTS TAB ────────────────────────────────────────────────────────────────
const ALL_CATS=["All","Shape","Control","Short Game","Specialty Lie"];
function ShotsTab({mode,onMode}){
  const [shot,setShot]=useState(null);
  const [cat,setCat]=useState("All");
  const [q,setQ]=useState("");
  const [favs,setFavs]=useState(new Set());
  const toggleFav=id=>setFavs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const filtered=SHOTS.filter(s=>(cat==="All"||s.cat===cat)&&s.name.toLowerCase().includes(q.toLowerCase()));
  if(shot)return<ShotDetail shot={shot} mode={mode} isFav={favs.has(shot.id)} onFav={()=>toggleFav(shot.id)} onBack={()=>setShot(null)} onMode={onMode}/>;
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
        <div>
          <h1 style={{...serif,fontSize:"2rem",color:gold,margin:"0 0 0.2rem"}}>Shot Library</h1>
          <div style={pillStyle}><span>{mode==="range"?"🎯":"⛳"}</span><span>{mode==="range"?"At the Range":"On the Course"}</span></div>
        </div>
        <button style={smBtn} onClick={onMode}>{mode==="range"?"⛳ Course":"🎯 Range"}</button>
      </div>
      <input style={searchStyle} placeholder="Search shots..." value={q} onChange={e=>setQ(e.target.value)}/>
      <div style={{display:"flex",gap:"0.4rem",marginBottom:"1.25rem",flexWrap:"wrap"}}>
        {ALL_CATS.map(c=><button key={c} style={{...smBtn,...(cat===c?{background:gold,borderColor:gold,color:g900}:{})}} onClick={()=>setCat(c)}>{c}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"0.7rem"}}>
        {filtered.map(s=>(
          <button key={s.id} onClick={()=>setShot(s)} style={{...card(),cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:"0.25rem",color:cream}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.2rem"}}>
              <span style={{fontSize:"1.4rem"}}>{s.icon}</span>
              <div style={{display:"flex",gap:"0.3rem",alignItems:"center"}}>
                {favs.has(s.id)&&<span style={{color:gold,fontSize:"0.8rem"}}>★</span>}
                <span style={diffBadge(s.diff)}>{s.diff}</span>
              </div>
            </div>
            <div style={{...serif,fontSize:"1.05rem",fontWeight:700}}>{s.name}</div>
            <div style={{fontSize:"0.78rem",color:muted,lineHeight:1.3}}>{s.sub}</div>
            <div style={{fontSize:"0.67rem",color:gold,marginTop:"0.2rem",letterSpacing:"0.08em",textTransform:"uppercase"}}>{s.cat}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ShotDetail({shot:s,mode,isFav,onFav,onBack,onMode}){
  const keys=mode==="range"?s.range:s.course;
  const LABELS={ballPosition:"Ball Position",stance:"Stance",weight:"Weight",grip:"Grip"};
  return(
    <div style={{maxWidth:650,margin:"0 auto",padding:"1.5rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <button style={smBtn} onClick={onBack}>← Back</button>
        <div style={{display:"flex",gap:"0.45rem"}}>
          <button style={{...smBtn,...(isFav?{borderColor:gold,color:gold}:{})}} onClick={onFav}>{isFav?"★ Saved":"☆ Save"}</button>
          <button style={smBtn} onClick={onMode}>{mode==="range"?"⛳ Course":"🎯 Range"}</button>
        </div>
      </div>
      <div style={{display:"flex",gap:"1rem",alignItems:"flex-start",marginBottom:"1.25rem"}}>
        <span style={{fontSize:"2.8rem"}}>{s.icon}</span>
        <div>
          <h1 style={{...serif,fontSize:"1.9rem",color:gold,margin:"0 0 0.2rem"}}>{s.name}</h1>
          <p style={{color:muted,margin:"0 0 0.5rem",fontSize:"0.95rem"}}>{s.sub}</p>
          <span style={diffBadge(s.diff)}>{s.diff}</span>
        </div>
      </div>
      <div style={divStyle}/>
      <Sec title="Setup" icon="📐">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
          {Object.entries(s.setup).map(([k,v])=>(
            <div key={k} style={card()}><div style={miniLbl}>{LABELS[k]||k}</div><div style={{fontSize:"0.88rem",color:cream,lineHeight:1.4,marginTop:"0.2rem"}}>{v}</div></div>
          ))}
        </div>
      </Sec>
      <Sec title="Club Face" icon="🏌️"><InfoCard>{s.clubface}</InfoCard></Sec>
      <Sec title="Swing Path" icon="🔄"><InfoCard>{s.swingPath}</InfoCard></Sec>
      <Sec title="Swing Thought" icon="💭"><ThoughtCard color={gold}>{s.swingThought}</ThoughtCard></Sec>
      <Sec title="Tempo" icon="🎵"><InfoCard>{s.tempo}</InfoCard></Sec>
      <Sec title={mode==="range"?"🎯 Range — Key Points":"⛳ Course — Key Points"} icon="">
        <KeyList items={keys} dotColor={gold}/>
      </Sec>
      <WatchOut>{s.watchOut}</WatchOut>
      <div style={{height:"1.5rem"}}/>
    </div>
  );
}

// ─── SHORT GAME TAB ───────────────────────────────────────────────────────────
function ShortGameTab({mode,onMode}){
  const [release,setRelease]=useState(null);
  const [shot,setShot]=useState(null);
  const [step,setStep]=useState(null);
  if(shot&&release)return<ReleaseShot shot={shot} release={release} mode={mode} onBack={()=>setShot(null)} onMode={onMode}/>;
  if(release)return<ReleaseDetail release={release} mode={mode} onBack={()=>setRelease(null)} onShot={setShot} onMode={onMode}/>;
  if(step!==null)return<DecisionTree step={step} setStep={setStep} onRelease={id=>{setRelease(RELEASES.find(r=>r.id===id));setStep(null);}} onBack={()=>setStep(null)}/>;
  return(
    <div style={{maxWidth:500,margin:"0 auto",padding:"2rem 1.25rem"}}>
      <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
        <div style={{fontSize:"2.5rem",marginBottom:"0.4rem"}}>⛳</div>
        <h1 style={{...serif,fontSize:"2rem",color:gold,margin:"0 0 0.2rem"}}>Short Game</h1>
        <p style={{...serif,fontSize:"0.95rem",color:gold+"cc",margin:"0 0 0.5rem",fontStyle:"italic"}}>Dan Grieve's 3 Releases System</p>
        <p style={{color:muted,fontSize:"0.88rem",lineHeight:1.5,maxWidth:360,margin:"0 auto"}}>Three shots cover every situation around the green. Master the releases, not the shots.</p>
      </div>
      <ModePill mode={mode} onToggle={onMode}/>
      <div style={{display:"flex",flexDirection:"column",gap:"0.7rem",margin:"1rem 0 0.85rem"}}>
        {RELEASES.map(r=>(
          <button key={r.id} onClick={()=>setRelease(r)} style={{...card(`${r.color}44`),cursor:"pointer",display:"flex",gap:"1rem",alignItems:"center",color:cream,textAlign:"left"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:r.color+"22",border:`2px solid ${r.color}66`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.1rem"}}>
                <span style={{...serif,fontSize:"1rem",color:r.color,fontWeight:700}}>{r.name}</span>
                <span style={{fontSize:"0.85rem",color:cream}}>— {r.sub}</span>
              </div>
              <div style={{fontSize:"0.78rem",color:muted}}>{r.tagline}</div>
              <div style={{fontSize:"0.68rem",color:r.color+"99",marginTop:"0.15rem"}}>{r.shots.length} shots</div>
            </div>
            <span style={{color:muted}}>→</span>
          </button>
        ))}
      </div>
      <button onClick={()=>setStep(0)} style={{...card(`${gold}55`),width:"100%",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.85rem",color:cream,border:`1px solid ${gold}55`}}>
        <span style={{fontSize:"1.5rem"}}>🤔</span>
        <div style={{flex:1,textAlign:"left"}}>
          <div style={{...serif,fontSize:"0.95rem",color:gold,fontWeight:700,marginBottom:"0.1rem"}}>Which Release Do I Use?</div>
          <div style={{fontSize:"0.78rem",color:muted}}>3 questions → the right shot, right now</div>
        </div>
        <span style={{color:gold}}>→</span>
      </button>
    </div>
  );
}

function ReleaseDetail({release:r,mode,onBack,onShot,onMode}){
  return(
    <div style={{maxWidth:600,margin:"0 auto",padding:"1.5rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <button style={smBtn} onClick={onBack}>← Back</button>
        <button style={{...smBtn,borderColor:r.color+"66",color:r.color}} onClick={onMode}>{mode==="range"?"⛳ Course":"🎯 Range"}</button>
      </div>
      <div style={{...card(`${r.color}44`),marginBottom:"1.25rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem"}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:r.color+"22",border:`2px solid ${r.color}77`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.7rem"}}>{r.icon}</div>
          <div><div style={{...serif,fontSize:"1.4rem",color:r.color,fontWeight:700,lineHeight:1}}>{r.name}</div><div style={{fontSize:"0.95rem",color:cream}}>{r.sub}</div></div>
        </div>
        <p style={{color:cream,fontSize:"0.9rem",lineHeight:1.6,margin:"0 0 0.75rem"}}>{r.tagline}.</p>
        <div style={{height:1,background:r.color+"33",margin:"0.6rem 0"}}/>
        <div style={{marginBottom:"0.5rem"}}><div style={miniLbl}>Key Principle</div><p style={{color:gold,fontStyle:"italic",fontSize:"0.9rem",margin:"0.15rem 0 0",lineHeight:1.5}}>{r.principle}</p></div>
        <div style={{marginBottom:"0.5rem"}}><div style={miniLbl}>How It Feels</div><p style={{color:cream,fontSize:"0.88rem",margin:"0.15rem 0 0",lineHeight:1.5}}>{r.feels}</p></div>
        <div><div style={miniLbl}>When To Use</div><p style={{color:cream,fontSize:"0.88rem",margin:"0.15rem 0 0",lineHeight:1.5}}>{r.when}</p></div>
      </div>
      <div style={{...serif,fontSize:"0.78rem",color:r.color,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.6rem"}}>Shots in this Release</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
        {r.shots.map(s=>(
          <button key={s.id} onClick={()=>onShot(s)} style={{...card(),cursor:"pointer",display:"flex",alignItems:"center",gap:"0.85rem",textAlign:"left",color:cream}}>
            <span style={{fontSize:"1.4rem",width:28,textAlign:"center"}}>{s.icon}</span>
            <div style={{flex:1}}><div style={{...serif,fontSize:"0.98rem",fontWeight:700}}>{s.name}</div><div style={{fontSize:"0.78rem",color:muted,marginTop:"0.1rem"}}>{s.sub}</div></div>
            <span style={diffBadge(s.diff)}>{s.diff}</span>
            <span style={{color:muted}}>→</span>
          </button>
        ))}
      </div>
      <div style={{height:"1.5rem"}}/>
    </div>
  );
}

function ReleaseShot({shot:s,release:r,mode,onBack,onMode}){
  const keys=mode==="range"?s.range:s.course;
  const LABELS={ballPosition:"Ball Position",stance:"Stance",weight:"Weight",grip:"Grip"};
  return(
    <div style={{maxWidth:650,margin:"0 auto",padding:"1.5rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <button style={smBtn} onClick={onBack}>← {r.name}</button>
        <button style={{...smBtn,borderColor:r.color+"66",color:r.color}} onClick={onMode}>{mode==="range"?"⛳ Course":"🎯 Range"}</button>
      </div>
      <div style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",background:r.color+"18",border:`1px solid ${r.color}44`,borderRadius:20,padding:"0.2rem 0.7rem",fontSize:"0.78rem",color:r.color,marginBottom:"0.85rem"}}>{r.icon} {r.name} — {r.sub}</div>
      <div style={{display:"flex",gap:"1rem",alignItems:"flex-start",marginBottom:"1.25rem"}}>
        <span style={{fontSize:"2.8rem"}}>{s.icon}</span>
        <div><h1 style={{...serif,fontSize:"1.9rem",color:gold,margin:"0 0 0.2rem"}}>{s.name}</h1><p style={{color:muted,margin:"0 0 0.5rem",fontSize:"0.95rem"}}>{s.sub}</p><span style={diffBadge(s.diff)}>{s.diff}</span></div>
      </div>
      <div style={divStyle}/>
      <Sec title="Setup" icon="📐">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
          {Object.entries(s.setup).map(([k,v])=>(<div key={k} style={card()}><div style={miniLbl}>{LABELS[k]||k}</div><div style={{fontSize:"0.88rem",color:cream,lineHeight:1.4,marginTop:"0.2rem"}}>{v}</div></div>))}
        </div>
      </Sec>
      <Sec title="Club Face" icon="🏌️"><InfoCard>{s.clubface}</InfoCard></Sec>
      <Sec title="Swing Path" icon="🔄"><InfoCard>{s.swingPath}</InfoCard></Sec>
      <Sec title="Swing Thought" icon="💭"><ThoughtCard color={r.color}>{s.swingThought}</ThoughtCard></Sec>
      <Sec title="Tempo" icon="🎵"><InfoCard>{s.tempo}</InfoCard></Sec>
      <Sec title={mode==="range"?"🎯 Range — Key Points":"⛳ Course — Key Points"} icon=""><KeyList items={keys} dotColor={r.color}/></Sec>
      <WatchOut>{s.watchOut}</WatchOut>
      <div style={{height:"1.5rem"}}/>
    </div>
  );
}

function DecisionTree({step,setStep,onRelease,onBack}){
  const Qs=[
    {q:"Is there a clear path to run the ball along the green?",hint:"No obstacle to carry, no deep rough between you and the putting surface.",yes:()=>onRelease(1),no:()=>setStep(1)},
    {q:"Do you need to carry an obstacle but a medium-height shot will do?",hint:"A bunker, rough, or slope — but you don't need maximum height.",yes:()=>onRelease(2),no:()=>setStep(2)},
    {q:"Are you in a greenside bunker?",hint:"If yes → R3 Bunker. If no → R3 Lob Shot.",yes:()=>onRelease(3),no:()=>onRelease(3)},
  ];
  const q=Qs[step];
  return(
    <div style={{maxWidth:460,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.75rem"}}>
        <button style={smBtn} onClick={step===0?onBack:()=>setStep(step-1)}>← Back</button>
        <div style={{...serif,fontSize:"0.78rem",color:gold,letterSpacing:"0.06em",textTransform:"uppercase"}}>Question {step+1} of 3</div>
      </div>
      <div style={{...card(),marginBottom:"1.25rem"}}>
        <h2 style={{...serif,fontSize:"1.3rem",color:cream,margin:"0 0 0.6rem",lineHeight:1.4}}>{q.q}</h2>
        <p style={{color:muted,fontSize:"0.88rem",lineHeight:1.5,margin:0}}>{q.hint}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
        <button onClick={q.yes} style={{...card("#7eb87e44"),cursor:"pointer",fontSize:"1.05rem",...serif,color:"#7eb87e",fontWeight:700,textAlign:"center",padding:"1rem"}}>Yes ✓</button>
        <button onClick={q.no} style={{...card("#c0644a44"),cursor:"pointer",fontSize:"1.05rem",...serif,color:"#c0644a",fontWeight:700,textAlign:"center",padding:"1rem"}}>No ✗</button>
      </div>
    </div>
  );
}

// ─── COURSE MANAGEMENT TAB ────────────────────────────────────────────────────
function CourseManagementTab(){
  const [view,setView]=useState("home"); // home | hole | principles | planner
  const [activeHole,setActiveHole]=useState(null);

  if(view==="hole"&&activeHole) return<HoleTypeDetail hole={activeHole} onBack={()=>setView("home")}/>;
  if(view==="principles") return<PrinciplesView onBack={()=>setView("home")}/>;
  if(view==="planner") return<HolePlannerView onBack={()=>setView("home")}/>;

  return(
    <div style={{maxWidth:540,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{marginBottom:"1.5rem"}}>
        <h1 style={{...serif,fontSize:"2rem",color:gold,margin:"0 0 0.2rem"}}>Course Strategy</h1>
        <p style={{color:muted,fontSize:"0.88rem",lineHeight:1.5}}>Smarter decisions. Fewer big numbers. Lower scores.</p>
      </div>

      {/* AI Hole Planner */}
      <button onClick={()=>setView("planner")} style={{...card(`${gold}66`),width:"100%",cursor:"pointer",display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.25rem",textAlign:"left",color:cream}}>
        <span style={{fontSize:"2rem"}}>🤖</span>
        <div style={{flex:1}}>
          <div style={{...serif,fontSize:"1rem",color:gold,fontWeight:700,marginBottom:"0.1rem"}}>AI Hole Planner</div>
          <div style={{fontSize:"0.8rem",color:muted,lineHeight:1.4}}>Describe any hole — get a shot-by-shot game plan tailored to your skill level</div>
        </div>
        <span style={{color:gold,fontSize:"1.1rem"}}>→</span>
      </button>

      {/* Core Principles */}
      <button onClick={()=>setView("principles")} style={{...card(`${gold}44`),width:"100%",cursor:"pointer",display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.25rem",textAlign:"left",color:cream}}>
        <span style={{fontSize:"2rem"}}>📖</span>
        <div style={{flex:1}}>
          <div style={{...serif,fontSize:"1rem",color:gold,fontWeight:700,marginBottom:"0.1rem"}}>Core Principles</div>
          <div style={{fontSize:"0.8rem",color:muted,lineHeight:1.4}}>The 6 strategic principles every golfer should know</div>
        </div>
        <span style={{color:gold,fontSize:"1.1rem"}}>→</span>
      </button>

      {/* Hole type guides */}
      <div style={{...serif,fontSize:"0.78rem",color:gold,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.65rem"}}>Situation Guides</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
        {HOLE_TYPES.map(h=>(
          <button key={h.id} onClick={()=>{setActiveHole(h);setView("hole");}} style={{...card(`${h.color}33`),cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:"0.3rem",color:cream,minHeight:90}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.1rem"}}>
              <span style={{fontSize:"1.4rem"}}>{h.icon}</span>
              <span style={{...serif,fontSize:"0.95rem",color:h.color,fontWeight:700,lineHeight:1.2}}>{h.name}</span>
            </div>
            <div style={{fontSize:"0.77rem",color:muted,lineHeight:1.35}}>{h.overview.slice(0,60)}...</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function HoleTypeDetail({hole:h,onBack}){
  return(
    <div style={{maxWidth:600,margin:"0 auto",padding:"1.5rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <button style={smBtn} onClick={onBack}>← Back</button>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"0.85rem",marginBottom:"1.25rem"}}>
        <span style={{fontSize:"2.8rem"}}>{h.icon}</span>
        <div>
          <h1 style={{...serif,fontSize:"1.9rem",color:h.color,margin:"0 0 0.2rem"}}>{h.name}</h1>
          <p style={{color:muted,margin:0,fontSize:"0.9rem",lineHeight:1.5}}>{h.overview}</p>
        </div>
      </div>
      <div style={divStyle}/>

      <Sec title="Strategic Principles" icon="📐">
        <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
          {h.principles.map((p,i)=>(
            <div key={i} style={card()}>
              <div style={{...serif,fontSize:"0.95rem",color:h.color,fontWeight:700,marginBottom:"0.3rem"}}>{i+1}. {p.title}</div>
              <div style={{fontSize:"0.88rem",color:cream,lineHeight:1.6}}>{p.body}</div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec title="Miss Management" icon="🎯">
        <div style={{background:`linear-gradient(135deg,${g700},${g800})`,border:`1px solid ${h.color}55`,borderRadius:10,padding:"0.9rem 1rem"}}>
          <div style={{fontSize:"0.88rem",color:cream,lineHeight:1.6}}>{h.missManagement}</div>
        </div>
      </Sec>

      <Sec title="Approach Note" icon="📍"><InfoCard>{h.approachNote}</InfoCard></Sec>

      <div style={{height:"1.5rem"}}/>
    </div>
  );
}

function PrinciplesView({onBack}){
  return(
    <div style={{maxWidth:600,margin:"0 auto",padding:"1.5rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <button style={smBtn} onClick={onBack}>← Back</button>
      </div>
      <h1 style={{...serif,fontSize:"1.9rem",color:gold,margin:"0 0 0.3rem"}}>Core Principles</h1>
      <p style={{color:muted,fontSize:"0.88rem",marginBottom:"1.5rem"}}>The strategic foundations every golfer should internalise.</p>
      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {MANAGEMENT_PRINCIPLES.map((p,i)=>(
          <div key={i} style={card()}>
            <div style={{display:"flex",gap:"0.75rem",alignItems:"flex-start"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:gold+"22",border:`1px solid ${gold}55`,display:"flex",alignItems:"center",justifyContent:"center",...serif,fontSize:"0.88rem",color:gold,flexShrink:0}}>{i+1}</div>
              <div>
                <div style={{...serif,fontSize:"1rem",color:gold,fontWeight:700,marginBottom:"0.35rem"}}>{p.title}</div>
                <div style={{fontSize:"0.88rem",color:cream,lineHeight:1.65}}>{p.body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{height:"1.5rem"}}/>
    </div>
  );
}

function HolePlannerView({onBack}){
  const [form,setForm]=useState({description:"",par:"4",yardage:"",wind:"none",conditions:"dry",skill:"intermediate",handicap:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const [plan,setPlan]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(null);

  const submit=async()=>{
    if(!form.description)return;
    setLoading(true);setPlan(null);setErr(null);
    try{setPlan(await getAIHolePlan(form));}
    catch{setErr("Couldn't generate the hole plan. Please try again.");}
    setLoading(false);
  };

  return(
    <div style={{maxWidth:600,margin:"0 auto",padding:"1.5rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
        <button style={smBtn} onClick={()=>{if(plan){setPlan(null);}else{onBack();}}}>← Back</button>
        {plan&&<button style={smBtn} onClick={()=>setPlan(null)}>Plan Another</button>}
      </div>
      <h1 style={{...serif,fontSize:"1.9rem",color:gold,margin:"0 0 0.25rem"}}>🤖 AI Hole Planner</h1>
      <p style={{color:muted,fontSize:"0.88rem",marginBottom:"1.25rem"}}>Describe the hole. Get a tailored game plan.</p>

      {!plan&&(
        <>
          <div style={{marginBottom:"1rem"}}>
            <div style={miniLbl}>Describe the hole</div>
            <textarea style={{...inputS,height:80,resize:"none",marginTop:"0.3rem"}} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="e.g. 420 yard par 4, dogleg right at 230 yards, OB right, bunker guarding front left of green, pin tucked back right..."/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem",marginBottom:"1.25rem"}}>
            <div><div style={miniLbl}>Par</div><Sel val={form.par} onChange={v=>set("par",v)} opts={["3","4","5"]}/></div>
            <div><div style={miniLbl}>Yardage</div><input style={inputS} type="number" placeholder="e.g. 420" value={form.yardage} onChange={e=>set("yardage",e.target.value)}/></div>
            <div><div style={miniLbl}>Wind</div><Sel val={form.wind} onChange={v=>set("wind",v)} opts={["none","light headwind","strong headwind","light tailwind","strong tailwind","left crosswind","right crosswind"]}/></div>
            <div><div style={miniLbl}>Conditions</div><Sel val={form.conditions} onChange={v=>set("conditions",v)} opts={["dry and firm","soft and wet","normal","links/coastal","parkland"]}/></div>
            <div><div style={miniLbl}>Skill Level</div><Sel val={form.skill} onChange={v=>set("skill",v)} opts={["beginner","intermediate","low handicap","scratch"]}/></div>
            <div><div style={miniLbl}>Handicap (optional)</div><input style={inputS} type="number" placeholder="e.g. 14" value={form.handicap} onChange={e=>set("handicap",e.target.value)}/></div>
          </div>
          {err&&<div style={{...card("#c0644a44"),marginBottom:"1rem",color:"#e8cdc4",fontSize:"0.9rem"}}>{err}</div>}
          <button onClick={submit} disabled={loading||!form.description} style={{width:"100%",background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:10,padding:"0.9rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"1rem",opacity:loading||!form.description?0.6:1}}>
            {loading?"Building your game plan...":"Get My Game Plan"}
          </button>
        </>
      )}

      {plan&&(
        <div>
          {/* Assessment */}
          <div style={{...card(`${gold}44`),marginBottom:"1.25rem"}}>
            <div style={{...serif,fontSize:"1.3rem",color:gold,marginBottom:"0.5rem"}}>Hole Assessment</div>
            <p style={{color:cream,fontSize:"0.9rem",lineHeight:1.65,margin:"0 0 0.75rem"}}>{plan.holeAssessment}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
              <div style={card("#c0644a44")}><div style={miniLbl}>Primary Danger</div><div style={{fontSize:"0.85rem",color:"#e8cdc4",marginTop:"0.2rem",lineHeight:1.4}}>{plan.primaryDanger}</div></div>
              <div style={card("#7eb87e44")}><div style={miniLbl}>Scoring Goal</div><div style={{fontSize:"0.85rem",color:"#d8f0d8",marginTop:"0.2rem",lineHeight:1.4}}>{plan.scoringGoal}</div></div>
            </div>
          </div>

          {/* Tee Strategy */}
          <Sec title="Tee Strategy" icon="🏌️">
            <div style={card()}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.65rem"}}>
                <div><div style={miniLbl}>Shot Type</div><div style={{fontSize:"0.88rem",color:gold,marginTop:"0.15rem",fontWeight:600}}>{plan.teeStrategy?.shotType}</div></div>
                <div><div style={miniLbl}>Club</div><div style={{fontSize:"0.88rem",color:gold,marginTop:"0.15rem",fontWeight:600}}>{plan.teeStrategy?.club}</div></div>
              </div>
              <div><div style={miniLbl}>Target</div><div style={{fontSize:"0.88rem",color:cream,marginTop:"0.15rem"}}>{plan.teeStrategy?.target}</div></div>
              <div style={{marginTop:"0.5rem"}}><div style={miniLbl}>Why</div><div style={{fontSize:"0.88rem",color:muted,marginTop:"0.15rem",lineHeight:1.5}}>{plan.teeStrategy?.reasoning}</div></div>
            </div>
          </Sec>

          {/* Approach */}
          <Sec title="Approach Strategy" icon="📍">
            <div style={card()}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.65rem"}}>
                <div><div style={miniLbl}>Target</div><div style={{fontSize:"0.88rem",color:gold,marginTop:"0.15rem",fontWeight:600}}>{plan.approachStrategy?.target}</div></div>
                <div><div style={miniLbl}>Club</div><div style={{fontSize:"0.88rem",color:gold,marginTop:"0.15rem",fontWeight:600}}>{plan.approachStrategy?.club}</div></div>
              </div>
              <div><div style={miniLbl}>Land the Ball Here</div><div style={{fontSize:"0.88rem",color:cream,marginTop:"0.15rem"}}>{plan.approachStrategy?.landingZone}</div></div>
              <div style={{marginTop:"0.5rem"}}><div style={miniLbl}>Why</div><div style={{fontSize:"0.88rem",color:muted,marginTop:"0.15rem",lineHeight:1.5}}>{plan.approachStrategy?.reasoning}</div></div>
            </div>
          </Sec>

          {/* Miss management */}
          <Sec title="Miss Management" icon="🎯">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
              <div style={card("#7eb87e44")}><div style={miniLbl}>✓ Acceptable Miss</div><div style={{fontSize:"0.88rem",color:"#d8f0d8",marginTop:"0.2rem",lineHeight:1.5}}>{plan.acceptableMiss}</div></div>
              <div style={card("#c0644a44")}><div style={miniLbl}>✗ Avoid At All Costs</div><div style={{fontSize:"0.88rem",color:"#e8cdc4",marginTop:"0.2rem",lineHeight:1.5}}>{plan.unacceptableMiss}</div></div>
            </div>
          </Sec>

          {plan.shortGameNote&&<Sec title="Short Game / Putting Note" icon="◌"><InfoCard>{plan.shortGameNote}</InfoCard></Sec>}

          {/* Mindset */}
          <ThoughtCard color={gold}>{`"${plan.mindsetCue}"`}</ThoughtCard>
          <div style={{height:"1.5rem"}}/>
        </div>
      )}
    </div>
  );
}

// ─── ROUTINE TAB ──────────────────────────────────────────────────────────────
const ROUTINE_TEMPLATES=[
  {id:"full",name:"Full Shot Routine",icon:"🏌️",steps:[
    {id:"s1",label:"Read the situation",note:"Distance, lie, wind, obstacles. Commit to a shot type."},
    {id:"s2",label:"Select your club",note:"Pick the right tool. Don't change your mind after this."},
    {id:"s3",label:"Visualise the shot",note:"See the full ball flight — shape, trajectory, landing, roll."},
    {id:"s4",label:"Pick an intermediate target",note:"Find a spot 2–3 feet in front of the ball on your target line."},
    {id:"s5",label:"Step into address",note:"Align to the intermediate target. Set feet, then body."},
    {id:"s6",label:"Check alignment",note:"Feet, hips, shoulders parallel to target line."},
    {id:"s7",label:"Final trigger thought",note:"One swing thought only. Fire and trust."},
  ]},
  {id:"short",name:"Short Game Routine",icon:"◌",steps:[
    {id:"s1",label:"Read the lie",note:"Tight? Fluffy? Rough? Determine which Release fits."},
    {id:"s2",label:"Choose your Release",note:"R1 (run it), R2 (pitch it), R3 (lob or bunker)?"},
    {id:"s3",label:"Pick a landing spot",note:"A specific spot on the green — not the hole."},
    {id:"s4",label:"Practice swing",note:"Feel the release and swing length needed."},
    {id:"s5",label:"Set up to your landing spot",note:"Aim the face at your landing spot, then build stance."},
    {id:"s6",label:"Commit and go",note:"One thought. Trust the landing spot. Execute."},
  ]},
  {id:"putt",name:"Putting Routine",icon:"🕳️",steps:[
    {id:"s1",label:"Read the green",note:"Check slope from behind ball and behind hole. High side always."},
    {id:"s2",label:"Pick your line",note:"Find the apex — highest point before the break."},
    {id:"s3",label:"Gauge the pace",note:"Walk the length if needed. Uphill needs more; downhill less."},
    {id:"s4",label:"Pick an intermediate target",note:"A spot 2 feet ahead on your start line."},
    {id:"s5",label:"Two practice strokes",note:"Feel the distance — not technique."},
    {id:"s6",label:"Set up and commit",note:"Aim face to intermediate target. Look once. Stroke."},
  ]},
];

function RoutineTab(){
  const [view,setView]=useState("home");
  const [templates,setTemplates]=useState(ROUTINE_TEMPLATES.map(t=>({...t,steps:[...t.steps.map(s=>({...s}))]})));
  const [activeTemplate,setActiveTemplate]=useState(null);
  const [editStep,setEditStep]=useState(null);
  const [runStep,setRunStep]=useState(0);
  const [checked,setChecked]=useState([]);

  const startRun=(t)=>{setActiveTemplate(t);setRunStep(0);setChecked([]);setView("run");};
  const startBuild=(t)=>{setActiveTemplate(t);setView("build");};
  const addStep=(tIdx)=>{const n=[...templates];n[tIdx].steps.push({id:`s${Date.now()}`,label:"New step",note:"Describe this step..."});setTemplates(n);};
  const removeStep=(tIdx,sIdx)=>{const n=[...templates];n[tIdx].steps.splice(sIdx,1);setTemplates(n);};
  const updateStep=(tIdx,sIdx,field,val)=>{const n=[...templates];n[tIdx].steps[sIdx][field]=val;setTemplates(n);};

  if(view==="run"&&activeTemplate){
    const t=templates.find(x=>x.id===activeTemplate.id)||activeTemplate;
    const done=checked.length===t.steps.length;
    return(
      <div style={{maxWidth:480,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
          <button style={smBtn} onClick={()=>setView("home")}>✕ End</button>
          <div style={{...serif,fontSize:"0.82rem",color:gold}}>{t.icon} {t.name}</div>
          <div style={{...serif,fontSize:"0.82rem",color:muted}}>{checked.length}/{t.steps.length}</div>
        </div>
        {done?(
          <div style={{textAlign:"center",padding:"2rem 0"}}>
            <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>✅</div>
            <h2 style={{...serif,fontSize:"1.6rem",color:gold,marginBottom:"0.5rem"}}>Routine Complete</h2>
            <p style={{color:muted,marginBottom:"1.5rem"}}>Commit and execute.</p>
            <button onClick={()=>{setChecked([]);setRunStep(0);}} style={{background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:10,padding:"0.8rem 2rem",color:g900,...serif,fontWeight:700,cursor:"pointer",fontSize:"1rem"}}>Run Again</button>
          </div>
        ):(
          <div>
            <div style={{...card(`${gold}66`),marginBottom:"1rem",padding:"1.25rem"}}>
              <div style={{...serif,fontSize:"1.3rem",color:gold,marginBottom:"0.4rem"}}>{t.steps[runStep].label}</div>
              <div style={{color:cream,fontSize:"0.9rem",lineHeight:1.5}}>{t.steps[runStep].note}</div>
            </div>
            <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.5rem"}}>
              {runStep>0&&<button style={{...smBtn,flex:1,padding:"0.65rem"}} onClick={()=>{setRunStep(r=>r-1);setChecked(c=>c.filter(x=>x!==runStep-1));}}>← Prev</button>}
              <button onClick={()=>{setChecked(c=>[...new Set([...c,runStep])]);if(runStep<t.steps.length-1)setRunStep(r=>r+1);}}
                style={{flex:2,background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:8,padding:"0.65rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"1rem"}}>
                {runStep===t.steps.length-1?"Complete ✓":"Next →"}
              </button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
              {t.steps.map((s,i)=>(
                <div key={s.id} onClick={()=>setRunStep(i)} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.5rem 0.7rem",borderRadius:8,background:i===runStep?gold+"22":g700,border:`1px solid ${i===runStep?gold+"66":g500}`,cursor:"pointer"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:checked.includes(i)?"#7eb87e":i===runStep?gold+"44":g600,border:`1px solid ${checked.includes(i)?"#7eb87e":i===runStep?gold:g500}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",flexShrink:0}}>{checked.includes(i)?"✓":i+1}</div>
                  <span style={{fontSize:"0.88rem",color:i===runStep?cream:muted}}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if(view==="build"&&activeTemplate){
    const tIdx=templates.findIndex(x=>x.id===activeTemplate.id);
    const t=templates[tIdx];
    return(
      <div style={{maxWidth:500,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
          <button style={smBtn} onClick={()=>setView("home")}>← Back</button>
          <div style={{...serif,fontSize:"0.9rem",color:gold}}>{t.icon} {t.name}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.55rem",marginBottom:"1rem"}}>
          {t.steps.map((s,sIdx)=>(
            <div key={s.id} style={{...card(),padding:"0.75rem 0.9rem"}}>
              {editStep&&editStep.tIdx===tIdx&&editStep.sIdx===sIdx?(
                <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                  <input style={inputS} value={s.label} onChange={e=>updateStep(tIdx,sIdx,"label",e.target.value)} placeholder="Step label"/>
                  <textarea style={{...inputS,height:60,resize:"none"}} value={s.note} onChange={e=>updateStep(tIdx,sIdx,"note",e.target.value)} placeholder="Step description..."/>
                  <div style={{display:"flex",gap:"0.5rem"}}>
                    <button style={{...smBtn,flex:1}} onClick={()=>setEditStep(null)}>Done ✓</button>
                    <button style={{...smBtn,borderColor:"#c0644a44",color:"#c0644a"}} onClick={()=>removeStep(tIdx,sIdx)}>Remove</button>
                  </div>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"flex-start",gap:"0.75rem"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:gold+"22",border:`1px solid ${gold}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",color:gold,flexShrink:0,marginTop:2}}>{sIdx+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"0.92rem",color:cream,fontWeight:600,marginBottom:"0.15rem"}}>{s.label}</div>
                    <div style={{fontSize:"0.8rem",color:muted,lineHeight:1.4}}>{s.note}</div>
                  </div>
                  <button style={{...smBtn,padding:"0.2rem 0.5rem",fontSize:"0.75rem"}} onClick={()=>setEditStep({tIdx,sIdx})}>Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button style={{width:"100%",background:"transparent",border:`1px dashed ${g500}`,borderRadius:8,padding:"0.6rem",...body,color:muted,cursor:"pointer",fontSize:"0.88rem",marginBottom:"1rem"}} onClick={()=>addStep(tIdx)}>+ Add Step</button>
        <button onClick={()=>startRun(t)} style={{width:"100%",background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:10,padding:"0.8rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"1rem"}}>Run This Routine →</button>
      </div>
    );
  }

  return(
    <div style={{maxWidth:500,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{marginBottom:"1.5rem"}}>
        <h1 style={{...serif,fontSize:"2rem",color:gold,margin:"0 0 0.2rem"}}>Pre-Shot Routine</h1>
        <p style={{color:muted,fontSize:"0.9rem",margin:0}}>Build your routine. Run it every shot. Trust it under pressure.</p>
      </div>
      <div style={{...card(),marginBottom:"1.25rem"}}>
        <div style={miniLbl}>Why It Matters</div>
        <p style={{color:cream,fontSize:"0.88rem",lineHeight:1.6,margin:"0.3rem 0 0"}}>A consistent pre-shot routine is one of the biggest differentiators between amateur and tour-level performance. It removes decision-making under pressure, builds commitment, and creates a reliable trigger for your best swing.</p>
      </div>
      <div style={{...serif,fontSize:"0.78rem",color:gold,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.65rem"}}>Your Routines</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
        {templates.map(t=>(
          <div key={t.id} style={{...card(),padding:"1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.6rem"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.1rem"}}>
                  <span style={{fontSize:"1.3rem"}}>{t.icon}</span>
                  <span style={{...serif,fontSize:"1rem",color:cream,fontWeight:700}}>{t.name}</span>
                </div>
                <div style={{fontSize:"0.75rem",color:muted}}>{t.steps.length} steps</div>
              </div>
            </div>
            <div style={{display:"flex",gap:"0.5rem"}}>
              <button onClick={()=>startRun(t)} style={{flex:2,background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:8,padding:"0.55rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"0.9rem"}}>▶ Run</button>
              <button onClick={()=>startBuild(t)} style={{...smBtn,flex:1,padding:"0.55rem",textAlign:"center"}}>✏ Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRACTICE TAB ─────────────────────────────────────────────────────────────
const WEAK_AREAS=["Driver accuracy","Fairway woods","Long irons","Mid irons","Short irons","Wedge distance control","Spinning wedges","Chipping — Release 1","Pitching — Release 2","Lob shot — Release 3","Greenside bunkers","Fairway bunkers","Awkward lies","Course management","Putting — reading","Putting — pace","Mental game"];
function PracticeTab(){
  const [weak,setWeak]=useState([]);
  const [duration,setDuration]=useState("60");
  const [skill,setSkill]=useState("intermediate");
  const [focus,setFocus]=useState("");
  const [equip,setEquip]=useState("full range");
  const [plan,setPlan]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(null);
  const toggle=a=>setWeak(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a]);
  const generate=async()=>{
    if(weak.length===0)return;
    setLoading(true);setPlan(null);setErr(null);
    try{setPlan(await getAIPracticePlan({duration,weakAreas:weak,skill,focus,equipment:equip}));}
    catch{setErr("Couldn't generate your plan. Please try again.");}
    setLoading(false);
  };
  return(
    <div style={{maxWidth:600,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{marginBottom:"1.25rem"}}>
        <h1 style={{...serif,fontSize:"2rem",color:gold,margin:"0 0 0.2rem"}}>Practice Planner</h1>
        <p style={{color:muted,fontSize:"0.9rem"}}>Turn a bucket of balls into a purposeful session.</p>
      </div>
      {!plan&&(
        <>
          <div style={{...serif,fontSize:"0.78rem",color:gold,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.5rem"}}>What Needs Work?</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1.25rem"}}>
            {WEAK_AREAS.map(a=>(
              <button key={a} onClick={()=>toggle(a)} style={{...smBtn,padding:"0.3rem 0.7rem",fontSize:"0.8rem",...(weak.includes(a)?{background:gold,borderColor:gold,color:g900}:{})}}>
                {a}
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem",marginBottom:"1.25rem"}}>
            <div><div style={miniLbl}>Session Duration</div><Sel val={duration} onChange={setDuration} opts={["30","45","60","90","120"]} fmt={v=>`${v} minutes`}/></div>
            <div><div style={miniLbl}>Skill Level</div><Sel val={skill} onChange={setSkill} opts={["beginner","intermediate","low handicap","scratch"]}/></div>
            <div><div style={miniLbl}>Available Equipment</div><Sel val={equip} onChange={setEquip} opts={["full range","chipping area only","putting green only","full course","at home (no balls)"]}/></div>
            <div><div style={miniLbl}>Specific Focus (optional)</div><input style={inputS} value={focus} onChange={e=>setFocus(e.target.value)} placeholder="e.g. bunker play"/></div>
          </div>
          {err&&<div style={{...card("#c0644a44"),marginBottom:"1rem",color:"#e8cdc4",fontSize:"0.9rem"}}>{err}</div>}
          <button onClick={generate} disabled={loading||weak.length===0} style={{width:"100%",background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:10,padding:"0.9rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"1rem",opacity:loading||weak.length===0?0.6:1}}>
            {loading?"Building your session...":"Generate Session Plan"}
          </button>
          {weak.length===0&&<p style={{color:muted,fontSize:"0.78rem",textAlign:"center",marginTop:"0.5rem"}}>Select at least one area to work on.</p>}
        </>
      )}
      {plan&&(
        <div>
          <div style={{...card(`${gold}44`),marginBottom:"1.25rem"}}>
            <div style={{...serif,fontSize:"1.4rem",color:gold,marginBottom:"0.3rem"}}>{plan.sessionTitle}</div>
            <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.6rem"}}>
              <span style={{...diffBadge("Beginner"),background:"#7eb87e22",color:"#7eb87e"}}>{plan.totalTime} min</span>
            </div>
            <div style={miniLbl}>Session Goal</div>
            <p style={{color:cream,fontSize:"0.9rem",lineHeight:1.5,margin:"0.2rem 0 0"}}>{plan.sessionGoal}</p>
          </div>
          <div style={{...card("#7eb87e33"),marginBottom:"0.75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.35rem"}}>
              <div style={{...serif,fontSize:"0.95rem",color:"#7eb87e",fontWeight:700}}>🌅 Warmup</div>
              <span style={{fontSize:"0.75rem",color:muted}}>{plan.warmup?.duration} min</span>
            </div>
            <p style={{color:cream,fontSize:"0.88rem",lineHeight:1.5,margin:0}}>{plan.warmup?.description}</p>
          </div>
          {plan.blocks?.map((b,i)=>(
            <div key={i} style={{...card(),marginBottom:"0.75rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.4rem"}}>
                <div style={{...serif,fontSize:"0.98rem",color:gold,fontWeight:700}}>Block {i+1}: {b.title}</div>
                <span style={{fontSize:"0.75rem",color:muted,flexShrink:0}}>{b.duration} min</span>
              </div>
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>
                {b.shots?.map(s=><span key={s} style={{fontSize:"0.7rem",color:cream,background:g600,border:`1px solid ${g500}`,borderRadius:20,padding:"0.1rem 0.45rem"}}>{s}</span>)}
              </div>
              <div style={miniLbl}>Drill</div>
              <p style={{color:cream,fontSize:"0.88rem",lineHeight:1.5,margin:"0.2rem 0 0.5rem"}}>{b.drill}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
                <div style={card()}><div style={miniLbl}>Reps</div><div style={{fontSize:"0.82rem",color:cream,marginTop:"0.15rem"}}>{b.reps}</div></div>
                <div style={card()}><div style={miniLbl}>Focus</div><div style={{fontSize:"0.82rem",color:cream,marginTop:"0.15rem"}}>{b.focus}</div></div>
              </div>
              {b.progression&&<div style={{marginTop:"0.5rem"}}><div style={miniLbl}>Progression</div><p style={{color:muted,fontSize:"0.82rem",lineHeight:1.4,margin:"0.15rem 0 0"}}>{b.progression}</p></div>}
            </div>
          ))}
          <div style={{...card("#a0956a33"),marginBottom:"0.75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.35rem"}}>
              <div style={{...serif,fontSize:"0.95rem",color:muted,fontWeight:700}}>🌇 Cooldown</div>
              <span style={{fontSize:"0.75rem",color:muted}}>{plan.cooldown?.duration} min</span>
            </div>
            <p style={{color:cream,fontSize:"0.88rem",lineHeight:1.5,margin:0}}>{plan.cooldown?.description}</p>
          </div>
          <div style={{background:"linear-gradient(135deg,#0e1a20,#101e14)",border:`1px solid ${gold}44`,borderRadius:10,padding:"0.9rem 1.1rem",marginBottom:"1rem"}}>
            <div style={{...serif,fontSize:"0.82rem",color:gold,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"0.35rem"}}>🏌️ Coach Says</div>
            <div style={{color:"#e8f0c8",fontSize:"0.9rem",lineHeight:1.5}}>{plan.coachNote}</div>
          </div>
          <button onClick={()=>{setPlan(null);setWeak([]);}} style={{...smBtn,width:"100%",padding:"0.65rem",textAlign:"center",fontSize:"0.9rem"}}>← Plan Another Session</button>
          <div style={{height:"1rem"}}/>
        </div>
      )}
    </div>
  );
}

// ─── CADDIE TAB ───────────────────────────────────────────────────────────────
function CaddieTab(){
  const [form,setForm]=useState({distance:"",lie:"fairway",wind:"none",obstacles:"none",skill:"intermediate",notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(null);
  const submit=async()=>{
    if(!form.distance)return;
    setLoading(true);setResult(null);setErr(null);
    try{setResult(await getAICaddie(form));}catch{setErr("Couldn't reach the AI caddie. Try again.");}
    setLoading(false);
  };
  const RC={Safe:"#7eb87e",Moderate:"#d4a843",Aggressive:"#c0644a"};
  const CC={High:"#7eb87e",Medium:"#d4a843",Low:"#c0644a"};
  return(
    <div style={{maxWidth:600,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{marginBottom:"1.25rem"}}>
        <h1 style={{...serif,fontSize:"2rem",color:gold,margin:"0 0 0.2rem"}}>🤖 AI Caddie</h1>
        <p style={{color:muted,fontSize:"0.9rem"}}>Describe your situation. Get the right shot.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem",marginBottom:"1.25rem"}}>
        <div><div style={miniLbl}>Distance to Pin (yards)</div><input style={inputS} type="number" placeholder="e.g. 45" value={form.distance} onChange={e=>set("distance",e.target.value)}/></div>
        <div><div style={miniLbl}>Skill Level</div><Sel val={form.skill} onChange={v=>set("skill",v)} opts={["beginner","intermediate","low handicap","scratch"]}/></div>
        <div><div style={miniLbl}>Lie</div><Sel val={form.lie} onChange={v=>set("lie",v)} opts={["fairway","rough","thick rough","tight/hardpan","uphill","downhill","sidehill-above","sidehill-below","greenside bunker","fairway bunker","fringe"]}/></div>
        <div><div style={miniLbl}>Wind</div><Sel val={form.wind} onChange={v=>set("wind",v)} opts={["none","light headwind","strong headwind","light tailwind","strong tailwind","left crosswind","right crosswind","gusty"]}/></div>
        <div><div style={miniLbl}>Obstacles</div><Sel val={form.obstacles} onChange={v=>set("obstacles",v)} opts={["none","bunker short","bunker long","trees","water short","water long","steep rough","tight pin"]}/></div>
        <div><div style={miniLbl}>Notes (optional)</div><input style={inputS} type="text" placeholder="e.g. firm greens..." value={form.notes} onChange={e=>set("notes",e.target.value)}/></div>
      </div>
      <button onClick={submit} disabled={loading||!form.distance} style={{width:"100%",background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:10,padding:"0.9rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"1rem",opacity:loading||!form.distance?0.6:1,marginBottom:"0.5rem"}}>
        {loading?"Reading the lie...":"Get My Shot"}
      </button>
      {err&&<div style={{...card("#c0644a44"),color:"#e8cdc4",fontSize:"0.9rem",marginTop:"0.75rem"}}>{err}</div>}
      {result&&(
        <div style={{marginTop:"1.5rem"}}>
          <div style={divStyle}/>
          <div style={{marginBottom:"1.25rem"}}>
            <div style={{...serif,fontSize:"1.9rem",color:gold,fontWeight:700}}>{result.primaryShot}</div>
            <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginTop:"0.4rem"}}>
              <span style={{...diffBadge(""),background:RC[result.riskLevel]+"22",color:RC[result.riskLevel]}}>Risk: {result.riskLevel}</span>
              <span style={{...diffBadge(""),background:CC[result.confidence]+"22",color:CC[result.confidence]}}>Confidence: {result.confidence}</span>
              <span style={{fontSize:"0.7rem",color:gold,background:gold+"18",border:`1px solid ${gold}33`,borderRadius:20,padding:"0.12rem 0.45rem",letterSpacing:"0.07em",textTransform:"uppercase"}}>{result.club}</span>
            </div>
          </div>
          <Sec title="Why This Shot" icon="🎯"><InfoCard>{result.rationale}</InfoCard></Sec>
          <Sec title="Key Adjustments" icon="📐"><KeyList items={result.keyAdjustments} dotColor={gold}/></Sec>
          <Sec title="Swing Thought" icon="💭"><ThoughtCard color={gold}>{result.swingThought}</ThoughtCard></Sec>
          <Sec title="Alternative Shot" icon="↩"><InfoCard>{result.alternativeShot}</InfoCard></Sec>
          <div style={{background:"linear-gradient(135deg,#0e1a20,#101e14)",border:`1px solid ${gold}44`,borderRadius:10,padding:"0.9rem 1.1rem"}}>
            <div style={{...serif,fontSize:"0.82rem",color:gold,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"0.35rem"}}>🏌️ Caddie Says</div>
            <div style={{color:"#e8f0c8",fontSize:"0.9rem",lineHeight:1.5}}>{result.caddieNote}</div>
          </div>
          <div style={{height:"1rem"}}/>
        </div>
      )}
    </div>
  );
}


// ─── EXCUSES TAB ─────────────────────────────────────────────────────────────
function ExcusesTab(){
  const [view,setView]=useState("home");
  const [libCat,setLibCat]=useState(Object.keys(EXCUSE_LIBRARY)[0]);
  const [confession,setConfession]=useState("");
  const [aiResult,setAiResult]=useState(null);
  const [aiLoading,setAiLoading]=useState(false);
  const [aiErr,setAiErr]=useState(null);
  const [roulette,setRoulette]=useState(null);
  const [spinning,setSpinning]=useState(false);
  const [holes,setHoles]=useState(Array.from({length:18},(_,i)=>({number:i+1,issue:""})));
  const [narrative,setNarrative]=useState(null);
  const [narrativeLoading,setNarrativeLoading]=useState(false);
  const [narrativeErr,setNarrativeErr]=useState(null);
  const [copied,setCopied]=useState(null);

  const copyText=(text,id)=>{navigator.clipboard?.writeText(text).catch(()=>{});setCopied(id);setTimeout(()=>setCopied(null),2000);};

  const spin=()=>{
    setSpinning(true);setRoulette(null);let count=0;
    const iv=setInterval(()=>{setRoulette(ROULETTE_EXCUSES[Math.floor(Math.random()*ROULETTE_EXCUSES.length)]);count++;if(count>12){clearInterval(iv);setSpinning(false);}},100);
  };

  const generateAI=async()=>{
    if(!confession.trim())return;
    setAiLoading(true);setAiResult(null);setAiErr(null);
    try{setAiResult(await getAIExcuse(confession));}catch{setAiErr("Couldn't generate your excuse. Perhaps that's a sign to just own it.");}
    setAiLoading(false);
  };

  const generateNarrative=async()=>{
    const populated=holes.filter(h=>h.issue.trim());
    if(populated.length===0)return;
    setNarrativeLoading(true);setNarrative(null);setNarrativeErr(null);
    try{setNarrative(await getPostRoundNarrative(populated));}catch{setNarrativeErr("Couldn't build your narrative. The truth may be inescapable.");}
    setNarrativeLoading(false);
  };

  const CR={"Bulletproof":"#7eb87e","Solid":"#d4a843","Risky":"#c0644a"};

  if(view==="home") return(
    <div style={{maxWidth:500,margin:"0 auto",padding:"2rem 1.25rem"}}>
      <div style={{textAlign:"center",marginBottom:"2rem"}}>
        <div style={{fontSize:"3rem",marginBottom:"0.4rem"}}>🤷</div>
        <h1 style={{...serif,fontSize:"2.2rem",color:gold,margin:"0 0 0.3rem"}}>The Excuse Locker</h1>
        <p style={{color:muted,fontSize:"0.9rem",lineHeight:1.5,maxWidth:340,margin:"0 auto"}}>Because sometimes the golf was fine. It was everything else.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
        {[
          {id:"roulette",icon:"🎰",title:"Excuse Roulette",desc:"One tap. One excuse. No effort required.",color:gold},
          {id:"generator",icon:"🤖",title:"AI Excuse Generator",desc:"Confess what actually happened. Get something you can say out loud.",color:"#7eb87e"},
          {id:"postround",icon:"📝",title:"Post-Round Narrative",desc:"Mark the holes that went wrong. Get a full clubhouse story.",color:"#d4a843"},
          {id:"library",icon:"📚",title:"The Excuse Library",desc:"Browse 30+ field-tested excuses across 5 categories.",color:"#c0644a"},
        ].map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)} style={{...card(`${item.color}44`),cursor:"pointer",display:"flex",alignItems:"center",gap:"1rem",textAlign:"left",color:cream}}>
            <span style={{fontSize:"1.8rem",flexShrink:0}}>{item.icon}</span>
            <div style={{flex:1}}>
              <div style={{...serif,fontSize:"1rem",color:item.color,fontWeight:700,marginBottom:"0.1rem"}}>{item.title}</div>
              <div style={{fontSize:"0.8rem",color:muted,lineHeight:1.4}}>{item.desc}</div>
            </div>
            <span style={{color:item.color,fontSize:"1.1rem",flexShrink:0}}>→</span>
          </button>
        ))}
      </div>
      <p style={{color:muted,fontSize:"0.72rem",textAlign:"center",marginTop:"1.5rem",fontStyle:"italic"}}>No liability accepted for excuses used in medal rounds.</p>
    </div>
  );

  if(view==="roulette") return(
    <div style={{maxWidth:460,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.75rem"}}>
        <button style={smBtn} onClick={()=>setView("home")}>← Back</button>
        <div style={{...serif,fontSize:"0.82rem",color:gold}}>🎰 Excuse Roulette</div>
      </div>
      <p style={{color:muted,fontSize:"0.9rem",marginBottom:"1.5rem",textAlign:"center"}}>Can't think of an excuse? Let fate decide.</p>
      <div style={{...card(`${gold}66`),minHeight:120,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem",marginBottom:"1.5rem",textAlign:"center"}}>
        {roulette?<div style={{...serif,fontSize:"1.15rem",color:cream,lineHeight:1.6,fontStyle:"italic"}}>"{roulette}"</div>:<div style={{color:muted,fontSize:"0.9rem"}}>Press spin to receive your excuse</div>}
      </div>
      <div style={{display:"flex",gap:"0.75rem",justifyContent:"center"}}>
        <button onClick={spin} disabled={spinning} style={{background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:10,padding:"0.85rem 2rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"1.05rem",opacity:spinning?0.7:1}}>
          {spinning?"Spinning...":"🎰 Spin"}
        </button>
        {roulette&&!spinning&&<button onClick={()=>copyText(roulette,"roulette")} style={{...smBtn,padding:"0.85rem 1.25rem"}}>{copied==="roulette"?"Copied ✓":"Copy"}</button>}
      </div>
    </div>
  );

  if(view==="generator") return(
    <div style={{maxWidth:500,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <button style={smBtn} onClick={()=>{setView("home");setAiResult(null);setConfession("");}}>← Back</button>
        <div style={{...serif,fontSize:"0.82rem",color:"#7eb87e"}}>🤖 AI Generator</div>
      </div>
      <h2 style={{...serif,fontSize:"1.6rem",color:gold,margin:"0 0 0.3rem"}}>Confess. Receive Excuse.</h2>
      <p style={{color:muted,fontSize:"0.88rem",marginBottom:"1.25rem",lineHeight:1.5}}>Tell us exactly what happened. We'll give you something you can say in the clubhouse.</p>
      {!aiResult&&(
        <>
          <div style={miniLbl}>What actually happened?</div>
          <textarea style={{...inputS,height:100,resize:"none",marginTop:"0.3rem",marginBottom:"1rem"}} value={confession} onChange={e=>setConfession(e.target.value)} placeholder="e.g. I three-putted five times, drove it OB on 4 and 13, and whiffed a chip on 17..."/>
          {aiErr&&<div style={{...card("#c0644a44"),color:"#e8cdc4",fontSize:"0.88rem",marginBottom:"1rem",fontStyle:"italic"}}>{aiErr}</div>}
          <button onClick={generateAI} disabled={aiLoading||!confession.trim()} style={{width:"100%",background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:10,padding:"0.9rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"1rem",opacity:aiLoading||!confession.trim()?0.6:1}}>
            {aiLoading?"Consulting the excuse consultant...":"Generate My Excuse"}
          </button>
        </>
      )}
      {aiResult&&(
        <div>
          <div style={{...card(`${(CR[aiResult.confidenceRating]||gold)}44`),marginBottom:"1rem",padding:"1.25rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"}}>
              <div style={miniLbl}>Your Excuse</div>
              <span style={{fontSize:"0.7rem",padding:"0.12rem 0.45rem",borderRadius:20,fontWeight:600,background:(CR[aiResult.confidenceRating]||gold)+"22",color:CR[aiResult.confidenceRating]||gold}}>{aiResult.confidenceRating}</span>
            </div>
            <div style={{...serif,fontSize:"1.1rem",color:cream,lineHeight:1.65,fontStyle:"italic",marginBottom:"0.9rem"}}>"{aiResult.excuse}"</div>
            <div style={miniLbl}>Delivery</div>
            <div style={{fontSize:"0.85rem",color:muted,marginTop:"0.2rem",lineHeight:1.5}}>{aiResult.delivery}</div>
          </div>
          {aiResult.alternativeExcuse&&<div style={{...card(),marginBottom:"1rem"}}><div style={miniLbl}>Backup Excuse</div><div style={{fontSize:"0.9rem",color:cream,marginTop:"0.2rem",lineHeight:1.5,fontStyle:"italic"}}>"{aiResult.alternativeExcuse}"</div></div>}
          <div style={{display:"flex",gap:"0.6rem"}}>
            <button onClick={()=>copyText(aiResult.excuse,"ai")} style={{...smBtn,flex:1,padding:"0.6rem",textAlign:"center"}}>{copied==="ai"?"Copied ✓":"Copy Excuse"}</button>
            <button onClick={()=>{setAiResult(null);setConfession("");}} style={{...smBtn,flex:1,padding:"0.6rem",textAlign:"center"}}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );

  if(view==="postround") return(
    <div style={{maxWidth:500,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <button style={smBtn} onClick={()=>{setView("home");setNarrative(null);setHoles(Array.from({length:18},(_,i)=>({number:i+1,issue:""})));}}>← Back</button>
        <div style={{...serif,fontSize:"0.82rem",color:"#d4a843"}}>📝 Post-Round Narrative</div>
      </div>
      {!narrative?(
        <>
          <h2 style={{...serif,fontSize:"1.5rem",color:gold,margin:"0 0 0.25rem"}}>Mark the Damage</h2>
          <p style={{color:muted,fontSize:"0.88rem",marginBottom:"1.25rem",lineHeight:1.5}}>Note what went wrong on each hole. Leave blank if fine (or if you've chosen to forget it).</p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1.25rem",maxHeight:"50vh",overflowY:"auto",paddingRight:"0.25rem"}}>
            {holes.map((h,i)=>(
              <div key={h.number} style={{display:"flex",alignItems:"center",gap:"0.65rem"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:h.issue?gold+"33":g700,border:`1px solid ${h.issue?gold+"66":g500}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",color:h.issue?gold:muted,flexShrink:0,fontWeight:h.issue?700:400}}>{h.number}</div>
                <input style={{...inputS,fontSize:"0.85rem",padding:"0.45rem 0.75rem"}} placeholder={`Hole ${h.number} — what went wrong?`} value={h.issue} onChange={e=>{const n=[...holes];n[i]={...n[i],issue:e.target.value};setHoles(n);}}/>
              </div>
            ))}
          </div>
          {narrativeErr&&<div style={{...card("#c0644a44"),color:"#e8cdc4",fontSize:"0.88rem",marginBottom:"1rem",fontStyle:"italic"}}>{narrativeErr}</div>}
          <button onClick={generateNarrative} disabled={narrativeLoading||holes.every(h=>!h.issue.trim())} style={{width:"100%",background:`linear-gradient(135deg,${gold},#b8922a)`,border:"none",borderRadius:10,padding:"0.9rem",...serif,color:g900,fontWeight:700,cursor:"pointer",fontSize:"1rem",opacity:narrativeLoading||holes.every(h=>!h.issue.trim())?0.6:1}}>
            {narrativeLoading?"Writing your story...":"Build My Narrative"}
          </button>
          {holes.every(h=>!h.issue.trim())&&<p style={{color:muted,fontSize:"0.78rem",textAlign:"center",marginTop:"0.5rem"}}>Note at least one difficult hole above.</p>}
        </>
      ):(
        <div>
          <div style={{...card(`${gold}55`),marginBottom:"1rem",padding:"1.25rem"}}>
            <div style={miniLbl}>Your Clubhouse Story</div>
            <div style={{...serif,fontSize:"1.1rem",color:cream,lineHeight:1.75,marginTop:"0.5rem",fontStyle:"italic"}}>"{narrative.narrative}"</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"1rem"}}>
            <div style={card()}><div style={miniLbl}>The Hook</div><div style={{fontSize:"0.85rem",color:cream,marginTop:"0.2rem",lineHeight:1.5,fontStyle:"italic"}}>"{narrative.openingLine}"</div></div>
            <div style={card()}><div style={miniLbl}>One-Liner</div><div style={{fontSize:"0.85rem",color:cream,marginTop:"0.2rem",lineHeight:1.5,fontStyle:"italic"}}>"{narrative.headlineExcuse}"</div></div>
          </div>
          <div style={{background:"linear-gradient(135deg,#0e1a20,#101e14)",border:`1px solid ${gold}44`,borderRadius:10,padding:"0.9rem 1.1rem",marginBottom:"1rem"}}>
            <div style={{...serif,fontSize:"0.82rem",color:gold,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"0.35rem"}}>🌅 The Closer</div>
            <div style={{color:"#e8f0c8",fontSize:"0.9rem",lineHeight:1.5,fontStyle:"italic"}}>"{narrative.closingLine}"</div>
          </div>
          <div style={{display:"flex",gap:"0.6rem"}}>
            <button onClick={()=>copyText(narrative.narrative,"narrative")} style={{...smBtn,flex:1,padding:"0.6rem",textAlign:"center"}}>{copied==="narrative"?"Copied ✓":"Copy Full Story"}</button>
            <button onClick={()=>{setNarrative(null);setHoles(Array.from({length:18},(_,i)=>({number:i+1,issue:""})));}} style={{...smBtn,flex:1,padding:"0.6rem",textAlign:"center"}}>Start Over</button>
          </div>
        </div>
      )}
    </div>
  );

  if(view==="library") return(
    <div style={{maxWidth:540,margin:"0 auto",padding:"1.75rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <button style={smBtn} onClick={()=>setView("home")}>← Back</button>
        <div style={{...serif,fontSize:"0.82rem",color:"#c0644a"}}>📚 Excuse Library</div>
      </div>
      <h2 style={{...serif,fontSize:"1.6rem",color:gold,margin:"0 0 0.25rem"}}>The Library</h2>
      <p style={{color:muted,fontSize:"0.88rem",marginBottom:"1.25rem"}}>30+ field-tested excuses. Categorised for easy access under pressure.</p>
      <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"1.25rem"}}>
        {Object.keys(EXCUSE_LIBRARY).map(cat=>(
          <button key={cat} style={{...smBtn,padding:"0.3rem 0.75rem",fontSize:"0.8rem",...(libCat===cat?{background:gold,borderColor:gold,color:g900}:{})}} onClick={()=>setLibCat(cat)}>{cat}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
        {EXCUSE_LIBRARY[libCat].map((item,i)=>(
          <div key={i} style={card()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"0.75rem"}}>
              <div style={{flex:1}}>
                <div style={{...serif,fontSize:"1rem",color:cream,lineHeight:1.55,marginBottom:"0.5rem",fontStyle:"italic"}}>"{item.excuse}"</div>
                <div style={{display:"flex",alignItems:"flex-start",gap:"0.5rem"}}>
                  <span style={{...miniLbl,flexShrink:0}}>Delivery:</span>
                  <span style={{fontSize:"0.8rem",color:muted,lineHeight:1.4}}>{item.delivery}</span>
                </div>
              </div>
              <button onClick={()=>copyText(item.excuse,`lib-${i}`)} style={{...smBtn,padding:"0.25rem 0.6rem",fontSize:"0.75rem",flexShrink:0,marginTop:2}}>{copied===`lib-${i}`?"✓":"Copy"}</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{height:"1.5rem"}}/>
    </div>
  );

  return null;
}


// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Sec({title,icon,children}){
  return(
    <div style={{marginBottom:"1.3rem"}}>
      <div style={{...serif,fontSize:"0.8rem",color:gold,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"0.5rem",display:"flex",alignItems:"center",gap:"0.4rem"}}>{icon&&<span>{icon}</span>}{title}</div>
      {children}
    </div>
  );
}
function InfoCard({children}){return<div style={{background:g700,border:`1px solid ${g500}`,borderRadius:8,padding:"0.75rem 1rem",fontSize:"0.92rem",color:cream,lineHeight:1.5}}>{children}</div>;}
function ThoughtCard({children,color}){return<div style={{background:`linear-gradient(135deg,${g600},${g700})`,border:`1px solid ${(color||gold)}55`,borderRadius:10,padding:"1rem 1.2rem",fontSize:"1.1rem",fontStyle:"italic",color:color||gold,textAlign:"center"}}>{children}</div>;}
function KeyList({items,dotColor}){
  return(
    <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"0.45rem"}}>
      {items?.map((k,i)=>(
        <li key={i} style={{display:"flex",alignItems:"flex-start",gap:"0.65rem",background:g700,border:`1px solid ${g500}`,borderRadius:8,padding:"0.6rem 0.85rem",fontSize:"0.88rem",color:cream,lineHeight:1.5}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:dotColor||gold,flexShrink:0,marginTop:7}}/>
          <span>{k}</span>
        </li>
      ))}
    </ul>
  );
}
function WatchOut({children}){
  return(
    <div style={{background:"linear-gradient(135deg,#2a1a14,#1e1208)",border:"1px solid #c0644a55",borderRadius:10,padding:"0.9rem 1.1rem"}}>
      <div style={{...serif,fontSize:"0.8rem",color:"#c0644a",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"0.3rem"}}>⚠️ Watch Out</div>
      <div style={{color:"#e8cdc4",fontSize:"0.9rem",lineHeight:1.5}}>{children}</div>
    </div>
  );
}
function ModePill({mode,onToggle}){
  return(
    <div style={{display:"flex",background:g800,borderRadius:10,padding:"0.2rem",border:`1px solid ${g500}`}}>
      {["range","course"].map(m=>(
        <button key={m} onClick={()=>{if(mode!==m)onToggle();}} style={{flex:1,padding:"0.45rem",borderRadius:8,border:"none",cursor:"pointer",fontSize:"0.88rem",...body,background:mode===m?gold:"transparent",color:mode===m?g900:muted,fontWeight:mode===m?700:400}}>
          {m==="range"?"🎯 Range":"⛳ Course"}
        </button>
      ))}
    </div>
  );
}
function Sel({val,onChange,opts,fmt}){
  return(
    <select style={{...inputS,cursor:"pointer",marginTop:"0.3rem"}} value={val} onChange={e=>onChange(e.target.value)}>
      {opts.map(o=><option key={o} value={o} style={{background:g700}}>{fmt?fmt(o):o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
    </select>
  );
}

// ─── MICRO STYLES ─────────────────────────────────────────────────────────────
const diffBadge=(d)=>({fontSize:"0.68rem",padding:"0.12rem 0.45rem",borderRadius:20,fontWeight:600,background:(diffColor[d]||"#aaa")+"22",color:diffColor[d]||"#aaa"});
const divStyle={height:1,background:`linear-gradient(to right,transparent,${g500},transparent)`,margin:"0 0 1.4rem"};
const searchStyle={width:"100%",background:g700,border:`1px solid ${g500}`,borderRadius:8,padding:"0.65rem 1rem",color:cream,fontSize:"0.95rem",...body,marginBottom:"0.9rem",boxSizing:"border-box",outline:"none"};
const inputS={background:g700,border:`1px solid ${g500}`,borderRadius:8,padding:"0.6rem 0.85rem",color:cream,fontSize:"0.9rem",...body,outline:"none",width:"100%",boxSizing:"border-box"};
const pillStyle={display:"inline-flex",alignItems:"center",gap:"0.4rem",background:`${gold}18`,border:`1px solid ${gold}44`,borderRadius:20,padding:"0.22rem 0.7rem",fontSize:"0.78rem",color:gold};
