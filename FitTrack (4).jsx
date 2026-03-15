import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ── Styles ────────────────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }
  .ft-root {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0f; color: #e8e8f0;
    min-height: 100vh; max-width: 430px; margin: 0 auto;
  }
  .ft-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px;
    background: #13131e; border-top: 1px solid #1e1e2e;
    display: flex; align-items: center;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    scrollbar-width: none; padding: 6px 0 20px; z-index: 100;
    gap: 0;
  }
  .ft-nav::-webkit-scrollbar { display: none; }
  .ft-nav-btn {
    background: none; border: none; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    color: #555570; font-size: 8.5px; font-family: 'DM Sans', sans-serif;
    font-weight: 500; letter-spacing: .04em; text-transform: uppercase; transition: color .2s;
    flex-shrink: 0; padding: 4px 10px; min-width: 52px;
  }
  .ft-nav-btn.active { color: #c8f135; }
  .ft-nav-btn svg { width: 20px; height: 20px; }
  .ft-screen { padding: 56px 20px 100px; min-height: 100vh; }
  .ft-heading { font-family: 'Bebas Neue', sans-serif; letter-spacing: .06em; }
  .ft-card {
    background: #13131e; border: 1px solid #1e1e2e;
    border-radius: 16px; padding: 20px; margin-bottom: 14px;
  }
  .ft-tag {
    display: inline-block; background: rgba(200,241,53,.12); color: #c8f135;
    font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    padding: 3px 10px; border-radius: 100px;
  }
  .ft-input {
    width: 100%; background: #0f0f1a; border: 1px solid #1e1e2e;
    border-radius: 10px; padding: 12px 14px;
    color: #e8e8f0; font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color .2s;
  }
  .ft-input:focus { border-color: #c8f135; }
  .ft-input::placeholder { color: #444458; }
  .ft-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555570' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center; cursor: pointer;
  }
  .ft-btn {
    width: 100%; padding: 14px; border-radius: 12px; border: none; cursor: pointer;
    font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: .1em;
    background: #c8f135; color: #0a0a0f; transition: opacity .2s, transform .1s;
  }
  .ft-btn:active { transform: scale(.98); opacity: .85; }
  .ft-btn:disabled { opacity: .4; cursor: not-allowed; }
  .ft-btn-ghost { background: transparent; color: #c8f135; border: 1.5px solid #c8f135; }
  .ft-btn-sm { width: auto; padding: 8px 18px; font-size: 14px; border-radius: 8px; }
  .ft-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
  .ft-stat-card { background: #13131e; border: 1px solid #1e1e2e; border-radius: 14px; padding: 16px; }
  .ft-stat-label { font-size: 10px; color: #555570; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .ft-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: .04em; color: #c8f135; }
  .ft-tooltip { background: #13131e; border: 1px solid #1e1e2e; border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #e8e8f0; }
  .ft-chat { display: flex; flex-direction: column; gap: 12px; }
  .ft-bubble { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.5; }
  .ft-bubble.user { align-self: flex-end; background: #c8f135; color: #0a0a0f; font-weight: 500; border-bottom-right-radius: 4px; }
  .ft-bubble.ai { align-self: flex-start; background: #13131e; border: 1px solid #1e1e2e; color: #c8c8d8; border-bottom-left-radius: 4px; }
  .ft-send-btn { width: 46px; height: 46px; border-radius: 50%; background: #c8f135; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ft-send-btn:disabled { opacity: .4; }
  ::-webkit-scrollbar { width: 0; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .ft-pulse { animation: pulse 1.4s ease-in-out infinite; }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .ft-slide-up { animation: slideUp .35s ease forwards; }
  .routine-card { border-radius: 18px; padding: 20px; margin-bottom: 14px; cursor: pointer; transition: transform .15s; border: 1.5px solid transparent; }
  .routine-card:active { transform: scale(.98); }
  .routine-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .exercise-step { display: flex; gap: 14px; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #1e1e2e; }
  .exercise-step:last-child { border-bottom: none; }
  .step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(200,241,53,.15); color: #c8f135; font-family: 'Bebas Neue'; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .diff-pill { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 2px 8px; border-radius: 100px; }
  .prog-phase { border-radius: 16px; margin-bottom: 14px; overflow: hidden; border: 1.5px solid #1e1e2e; }
  .prog-phase-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; cursor: pointer; background: #13131e; }
  .prog-workout-header { display: flex; align-items: center; justify-content: space-between; padding: 13px 18px; cursor: pointer; background: #0f0f1a; border-top: 1px solid #1e1e2e; }
  .prog-ex-row { padding: 9px 18px 9px 52px; border-top: 1px solid #171727; background: #0a0a14; }
  .tutorial-card { background: #13131e; border-radius: 10px; padding: 12px 14px; margin: 2px 18px 8px 52px; border-left: 3px solid #c8f135; }
  .prog-check { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid #333350; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; transition: all .2s; background: transparent; }
  .prog-check.done { background: #c8f135; border-color: #c8f135; }
  .progress-bar-bg { height: 6px; background: #1e1e2e; border-radius: 3px; overflow: hidden; margin-top: 8px; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #c8f135, #8fb82a); border-radius: 3px; transition: width .6s ease; }
  /* EXERCISE LIBRARY */
  .ex-lib-item { background: #13131e; border: 1px solid #1e1e2e; border-radius: 12px; margin-bottom: 10px; overflow: hidden; }
  .ex-lib-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; cursor: pointer; }
  .ex-lib-body { padding: 12px 14px; border-top: 1px solid #1e1e2e; background: #0f0f1a; }
  .home-alt-card { background: rgba(56,184,124,.07); border-radius: 8px; padding: 8px 10px; margin-top: 8px; border-left: 3px solid #38b87c; }
  .home-alt-equip { font-size: 10px; color: #38b87c; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 4px; }
  /* CABLE */
  .cable-cat-pill { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; cursor: pointer; transition: all .2s; border: 1.5px solid transparent; }
  .cable-routine-card { border-radius: 18px; padding: 18px; margin-bottom: 12px; cursor: pointer; transition: transform .15s; border: 1.5px solid transparent; }
  .cable-routine-card:active { transform: scale(.98); }
  .cable-ex-row { display: flex; gap: 12px; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #1e1e2e; }
  .cable-ex-row:last-child { border-bottom: none; }
  .cable-num { width: 26px; height: 26px; border-radius: 50%; background: rgba(99,179,237,.15); color: #63b3ed; font-family: 'Bebas Neue'; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .cable-set-badge { font-size: 10px; font-weight: 700; color: #63b3ed; background: rgba(99,179,237,.12); padding: 2px 8px; border-radius: 100px; display: inline-block; margin-top: 3px; }
  /* REST TIMER */
  .timer-overlay { position: fixed; inset: 0; background: rgba(10,10,15,.92); z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .timer-fab { position: fixed; bottom: 90px; right: 20px; width: 52px; height: 52px; border-radius: 50%; background: #c8f135; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(200,241,53,.4); z-index: 99; transition: transform .15s; }
  .timer-fab:active { transform: scale(.92); }
  .timer-preset { flex: 1; padding: 12px 8px; border-radius: 10px; border: 1.5px solid #1e1e2e; background: #13131e; cursor: pointer; font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: .06em; color: #888899; transition: all .2s; text-align: center; }
  .timer-preset.active { border-color: #c8f135; color: #c8f135; background: rgba(200,241,53,.08); }
  /* LIFT TRACKER */
  .lift-row { background: #13131e; border: 1px solid #1e1e2e; border-radius: 12px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: border-color .2s; }
  .lift-row:active { border-color: #c8f135; }
  .pb-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(200,241,53,.12); color: #c8f135; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 100px; }
  /* SUPERSET */
  .ss-bracket { width: 4px; border-radius: 2px; margin-right: 8px; flex-shrink: 0; align-self: stretch; min-height: 100%; }
  .ss-label { font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; padding: 2px 7px; border-radius: 100px; }
  .ss-group { border: 1.5px dashed; border-radius: 14px; padding: 6px 8px 8px; margin-bottom: 10px; }
  /* VOLUME */
  .vol-ring { position: relative; display: flex; align-items: center; justify-content: center; }
  .vol-bar { height: 8px; border-radius: 4px; transition: width .6s ease; }
  /* SCHEDULER */
  .sched-day { border-radius: 12px; padding: 10px 8px; border: 1.5px solid #1e1e2e; background: #13131e; min-height: 72px; }
  .sched-day.today { border-color: #c8f135; }
  .sched-slot { font-size: 10px; font-weight: 600; padding: 4px 6px; border-radius: 6px; margin-top: 4px; cursor: pointer; line-height: 1.3; }
  .sched-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 20px; }
  /* RECOVERY */
  .rec-protocol-card { border-radius: 18px; padding: 20px; margin-bottom: 14px; cursor: pointer; transition: transform .15s; border: 1.5px solid transparent; }
  .rec-protocol-card:active { transform: scale(.98); }
  .rec-phase-block { border-radius: 12px; padding: 14px; margin-bottom: 10px; border: 1px solid; }
  .rec-step { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
  .rec-step:last-child { border-bottom: none; }
  .rec-step-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; }
  .rec-timer-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; cursor: pointer; font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: .1em; transition: all .2s; }
  @keyframes steam { 0%,100%{opacity:.3;transform:translateY(0) scaleX(1)} 50%{opacity:.7;transform:translateY(-8px) scaleX(1.2)} }
  .steam-anim { animation: steam 2s ease-in-out infinite; }
  /* GENERATOR */
  .gen-chip { display: inline-flex; align-items: center; gap: 5px; padding: 8px 14px; border-radius: 100px; border: 1.5px solid; cursor: pointer; font-family: 'DM Sans'; font-size: 12px; font-weight: 600; transition: all .2s; white-space: nowrap; }
  .gen-chip.selected { border-color: #c8f135; background: rgba(200,241,53,.12); color: #c8f135; }
  .gen-chip:not(.selected) { border-color: #1e1e2e; background: #13131e; color: #555570; }
  .gen-section-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #555570; margin: 16px 0 8px; }
  .gen-ex-card { background: #13131e; border-radius: 14px; padding: 14px; margin-bottom: 10px; border: 1px solid #1e1e2e; }
  @keyframes gen-pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  .gen-loading-bar { height: 3px; border-radius: 2px; background: linear-gradient(90deg, #c8f135, #6c63ff, #c8f135); background-size: 200%; animation: gen-pulse 1.5s ease-in-out infinite; }
  /* 1RM */
  .orm-zone { border-radius: 10px; padding: 10px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
  .orm-calc-input { background: #0a0a0f; border: 1.5px solid #1e1e2e; border-radius: 10px; color: #e8e8f0; font-family: 'Bebas Neue'; font-size: 28px; text-align: center; width: 100%; padding: 10px; outline: none; }
  .orm-calc-input:focus { border-color: #c8f135; }
  /* SHARE CARD */
  .share-overlay { position: fixed; inset: 0; background: rgba(5,5,10,.95); z-index: 300; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
  .workout-card { width: 340px; background: #0a0a0f; border-radius: 24px; overflow: hidden; border: 1.5px solid #1e1e2e; flex-shrink: 0; }
  .workout-card-header { padding: 24px 24px 16px; background: linear-gradient(135deg, #0d1f00, #1a3800); }
  .workout-card-body { padding: 16px 24px 24px; }
  .muscle-tag { display: inline-block; background: rgba(200,241,53,.1); color: #c8f135; font-size: 10px; font-weight: 600; letter-spacing: .05em; padding: 2px 8px; border-radius: 100px; margin-bottom: 8px; }
  .view-toggle { display: flex; background: #13131e; border-radius: 10px; padding: 3px; margin-bottom: 18px; }
  .view-toggle-btn { flex: 1; padding: 8px; border: none; border-radius: 8px; cursor: pointer; font-family: "'DM Sans'"; font-size: 12px; font-weight: 600; transition: all .2s; background: transparent; color: #555570; }
  .view-toggle-btn.active { background: #c8f135; color: #0a0a0f; }
  /* STRETCH SCREEN */
  .stretch-area-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .stretch-area-card { background: #13131e; border: 1.5px solid #1e1e2e; border-radius: 14px; padding: 14px 12px; cursor: pointer; transition: all .2s; text-align: center; }
  .stretch-area-card:active { transform: scale(.96); }
  .stretch-area-card.selected { border-color: #c8f135; background: rgba(200,241,53,.06); }
  .duration-btn { flex: 1; padding: 14px 8px; border-radius: 12px; border: 1.5px solid #1e1e2e; background: #13131e; cursor: pointer; transition: all .2s; text-align: center; }
  .duration-btn.selected { border-color: #c8f135; background: rgba(200,241,53,.08); }
  .timer-ring-track { fill: none; stroke: #1e1e2e; stroke-width: 8; }
  .timer-ring-fill { fill: none; stroke: #c8f135; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset .9s linear; transform-origin: center; transform: rotate(-90deg); }
  .timer-ring-fill.resting { stroke: #6c63ff; }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .fade-in-up { animation: fadeInUp .3s ease forwards; }
  /* GOLF PROGRAMS */
  .golf-prog-card { border-radius: 18px; padding: 20px; margin-bottom: 12px; cursor: pointer; transition: transform .15s, border-color .2s; border: 1.5px solid transparent; }
  .golf-prog-card:active { transform: scale(.98); }
  .golf-prog-card.selected { outline: 2.5px solid #38b87c; outline-offset: 2px; }
  .golf-week-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 14px; }
  .golf-week-dot { height: 28px; border-radius: 6px; cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; font-size: 10px; font-family: 'Bebas Neue'; letter-spacing: .04em; border: 1.5px solid #1e1e2e; }
  .golf-ex-row { display: flex; gap: 12px; align-items: flex-start; padding: 11px 0; border-bottom: 1px solid #1e1e2e; }
  .golf-ex-row:last-child { border-bottom: none; }
  .golf-set-badge { display: inline-flex; gap: 4px; align-items: center; background: rgba(56,184,124,.12); color: #38b87c; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 100px; margin-top: 4px; }
  .phase-tab { flex: 1; padding: 10px 6px; border-radius: 10px; border: 1.5px solid #1e1e2e; background: #13131e; cursor: pointer; font-family: 'DM Sans'; font-size: 11px; font-weight: 600; color: #555570; transition: all .2s; text-align: center; }
  .phase-tab.active { background: rgba(56,184,124,.12); border-color: #38b87c; color: #38b87c; }
  /* CARDIO */
  .cardio-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .cardio-type-btn { background: #13131e; border: 1.5px solid #1e1e2e; border-radius: 14px; padding: 16px 12px; cursor: pointer; transition: all .2s; text-align: center; }
  .cardio-type-btn:active { transform: scale(.96); }
  .cardio-type-btn.selected { border-color: var(--ccolor); background: rgba(var(--ccolor-rgb),.08); }
  .cardio-history-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #1e1e2e; }
  .cardio-history-row:last-child { border-bottom: none; }
  .time-btn { background: #13131e; border: 1.5px solid #1e1e2e; border-radius: 8px; padding: 8px 14px; cursor: pointer; font-family: 'DM Sans'; font-size: 13px; color: #888899; transition: all .2s; }
  .time-btn.sel { background: rgba(200,241,53,.1); border-color: #c8f135; color: #c8f135; font-weight: 600; }
`;
document.head.appendChild(style);

// ── Constants ─────────────────────────────────────────────────────────────────
const MUSCLE_GROUPS = ["Chest","Back","Shoulders","Arms","Core","Legs","Glutes","Full Body","Cardio"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const today = () => new Date().toISOString().split("T")[0];
const fmtDate = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric"});


// ── Exercise Tutorial Library ─────────────────────────────────────────────────
const TUTORIALS = {
  "Band Pull-Aparts": { muscles: "Rear delts, mid-traps, rhomboids", how: "Hold band at chest height, arms straight. Pull band apart until it touches your chest. Squeeze shoulder blades together at end range.", tip: "Keep arms at shoulder height throughout — don't let them drift down." },
  "One-Arm Dumbbell Row": { muscles: "Lats, mid-back, biceps", how: "Brace one knee and hand on a bench. Pull dumbbell to your hip, keeping elbow close. Lower under control.", tip: "Think 'elbow to pocket' — not 'hand to armpit'." },
  "Face Pull": { muscles: "Rear delts, rotator cuff, upper traps", how: "Attach band or cable at face height. Pull toward your face, flaring elbows high and wide. Externally rotate at the top.", tip: "Elbows should finish higher than your wrists at the top of each rep." },
  "Kettlebell Deadlift": { muscles: "Glutes, hamstrings, lower back, traps", how: "Hinge at hips, chest up, slight bend in knees. Grip kettlebell between feet. Drive through heels and extend hips to stand tall.", tip: "The bar path is vertical — keep the kettlebell close to your legs throughout." },
  "Bird Dog": { muscles: "Erector spinae, glutes, core stabilisers", how: "All fours, spine neutral. Extend opposite arm and leg simultaneously. Hold 2s, return without touching the ground.", tip: "Imagine balancing a glass of water on your lower back — no tilting." },
  "Doorway Chest Stretch": { muscles: "Pectorals, anterior deltoid", how: "Place forearms on doorframe at 90°. Step one foot forward and lean gently through. Hold 30–60s.", tip: "Try different arm heights (low, mid, high) to target different parts of the chest." },
  "Dumbbell Floor Press": { muscles: "Chest, triceps, anterior deltoid", how: "Lie on floor, dumbbells at chest. Press straight up. Floor limits the range, protecting the shoulder at the bottom.", tip: "Tuck your elbows at ~45° — not flared wide — to protect the shoulder." },
  "Incline Dumbbell Press": { muscles: "Upper chest, anterior deltoid, triceps", how: "Set bench to 30–45°. Press dumbbells up and slightly inward at the top. Control the descent over 2–3 seconds.", tip: "A lower incline (30°) emphasises upper chest more than a steep 60° angle." },
  "Dumbbell Pullover": { muscles: "Lats, serratus anterior, long head of triceps, chest", how: "Lie perpendicular on bench, hips dropped. Hold one dumbbell with both hands. Arc it back over head in a big sweep. Return with control.", tip: "Let the ribcage expand and stretch at the bottom — that's the key benefit for posture." },
  "Plank (bench-supported)": { muscles: "Transverse abdominis, erectors, glutes", how: "Forearms on bench, toes on floor. Keep body in a straight line from head to heels. Breathe through the hold.", tip: "Squeeze your glutes and think 'pull the floor toward you' with your elbows for more core activation." },
  "Side Plank": { muscles: "Obliques, hip abductors, core", how: "Support on one forearm and the side of your foot. Lift hips so your body is straight. Hold without sagging.", tip: "Stack feet or stagger them for more stability if needed." },
  "Thoracic Extension": { muscles: "Thoracic erectors, rhomboids", how: "Sit a foam roller perpendicular to your spine at mid-back. Support your head, arms crossed on chest. Gently arch back over the roller. Move it up the spine.", tip: "Don't hyperextend the lower back — the movement should come from the mid-back." },
  "Wall Angels": { muscles: "Lower traps, serratus anterior, shoulder external rotators", how: "Stand with back flat against wall, arms in 'W' position. Slide arms up to 'Y' while keeping every part of your back, arms, and wrists in contact with the wall.", tip: "If your lower back arches off the wall, bend your knees slightly and tilt the pelvis." },
  "Chin Tucks": { muscles: "Deep cervical flexors, upper back", how: "Sit or stand tall. Gently draw your chin straight back (making a 'double chin'). Hold 3–5s. Release.", tip: "Think of it as lengthening the back of your neck, not just tucking your chin down." },
  "Standing Band Chest Opener": { muscles: "Pectorals, anterior deltoids, biceps", how: "Anchor band at chest height. Face away, hold band behind you. Walk forward until you feel a stretch across the chest. Hold or pulse gently.", tip: "Keep a tall posture — don't let the chest collapse or shoulders round forward." },
  "Deep Diaphragmatic Breathing": { muscles: "Diaphragm, intercostals, transverse abdominis", how: "Place one hand on chest, one on belly. Inhale deeply through nose — belly should rise first, then chest. Exhale fully. 5–10 breaths.", tip: "This expands the rib cage and trains the breathing muscles to reduce chest tightness over time." },
  "Push-up": { muscles: "Chest, triceps, anterior deltoid, serratus anterior", how: "Hands slightly wider than shoulders. Lower with control (3s), pause at bottom, press up. Keep a rigid body line throughout.", tip: "The 'push-up plus' cue: at the top, protract your shoulder blades forward for an extra inch of press." },
  "Seated Shoulder Press": { muscles: "Deltoids, triceps, upper traps", how: "Sit upright, dumbbells at ear level. Press straight up overhead. Lower under control to just above ear level.", tip: "Don't lean back excessively — keep a tall spine to keep it shoulder-dominant." },
  "Pallof Press": { muscles: "Obliques, transverse abdominis, anti-rotation core", how: "Stand sideways to a cable or anchored band. Hold at chest height. Press arms straight out and hold 2–3s, then return. Resist rotating toward the anchor.", tip: "The further you stand from the anchor, the harder it is. Stay square — that's the whole point." },
  "Barbell or Dumbbell Row": { muscles: "Lats, mid-traps, rhomboids, biceps", how: "Hinge to ~45°, row to your lower chest/upper abdomen. Squeeze at the top. Lower under control.", tip: "Initiate with your elbow, not your bicep — pull from the lats." },
  "Lat Pulldown or Pull-up": { muscles: "Lats, biceps, mid-back, teres major", how: "Grip just wider than shoulders. Pull bar/yourself up until bar reaches chin/chest. Lean slightly back. Control the descent.", tip: "Engage your lats before pulling by thinking 'put your shoulder blades in your back pockets'." },
  "Rear Delt Fly": { muscles: "Posterior deltoid, rhomboids, mid-traps", how: "Hinge to ~45° or lie on an incline. With soft elbows, raise dumbbells out to the sides like opening wings. Squeeze at top.", tip: "Use lighter weight than you think — this is a small muscle. Focus on the squeeze, not the weight." },
  "Kettlebell Swing": { muscles: "Glutes, hamstrings, lower back, lats, forearms", how: "Hike the bell back with a hip hinge. Drive your hips explosively forward — the bell floats to shoulder height. Let gravity bring it back, hinging again.", tip: "It's a hip hinge, not a squat — the power comes from snapping the hips, not lifting with the arms." },
  "Goblet Squat": { muscles: "Quads, glutes, core, upper back (isometric)", how: "Hold a weight at chest height, feet shoulder-width. Squat deep, keeping elbows inside knees. Chest tall throughout.", tip: "Use the weight as a counterbalance to sit deeper with an upright torso." },
  "Romanian Deadlift": { muscles: "Hamstrings, glutes, lower back", how: "Stand tall, soft knee bend. Hinge at hips, pushing them back. Lower bar down legs until you feel a big hamstring stretch. Drive hips forward to stand.", tip: "Think 'proud chest' on the way down — that cue keeps the spine neutral." },
  "Step-ups": { muscles: "Quads, glutes, hamstrings, single-leg stability", how: "Step onto a box, drive through the heel of your working leg to stand tall. Don't push off with the trailing foot.", tip: "A higher step increases the glute demand; a lower step is more quad-focused." },
  "Barbell Incline Press": { muscles: "Upper chest, anterior deltoid, triceps", how: "Set bench to 30–45°. Unrack, lower bar to upper chest with 3s eccentric. Drive up powerfully.", tip: "Tuck elbows at ~75° (not fully flared or fully tucked) to maximise upper chest involvement." },
  "Dumbbell Fly": { muscles: "Chest (stretch-focused), anterior deltoid", how: "Lie flat or on incline, dumbbells above chest. With a slight elbow bend, lower arms wide until you feel a deep chest stretch. Return with a 'hugging a barrel' arc.", tip: "Think stretch and squeeze — flies are for range of motion, not loading heavy weight." },
  "Overhead Press": { muscles: "Deltoids, triceps, upper traps, serratus anterior", how: "Bar at shoulder level, narrow grip, brace core. Press straight up, slightly behind the ears at the top. Lower under control.", tip: "Squeeze your glutes at the top — it protects the lower back from hyperextending." },
  "Push-up Plus": { muscles: "Serratus anterior, chest, triceps", how: "Standard push-up but at the top, push the ground away and round your upper back slightly — protracting the shoulder blades fully.", tip: "The 'plus' at the top is the key — that serratus activation improves shoulder stability significantly." },
  "Pull-up or Lat Pulldown": { muscles: "Lats, biceps, mid-back", how: "Full hang, shoulder-width grip. Pull until chin clears the bar, lower fully under control. Dead hang between reps.", tip: "If you can't do full pull-ups yet, lat pulldowns with the same cues give the same stimulus." },
  "Barbell Row": { muscles: "Upper back, lats, rear delts, biceps", how: "Hinge to ~45°, overhand grip. Pull bar to lower chest, flare elbows slightly to 45°. Full retraction at the top.", tip: "Pause for 1s at the top of each rep to ensure full scapular retraction." },
  "Planks": { muscles: "Core, glutes, shoulders (isometric)", how: "Forearms on floor, toes on floor. Straight line from head to heels. Breathe steadily. Don't let hips sag or pike.", tip: "Squeeze your glutes hard — it protects your lower back and makes the core work harder." },
  "Side Planks": { muscles: "Obliques, hip abductors, shoulder stabilisers", how: "One forearm, stack feet or stagger for stability. Lift hips. Keep a straight line from head to feet.", tip: "If it's too hard, drop your bottom knee. Work up to full side plank over time." },
  "Thoracic Rotations": { muscles: "Thoracic erectors, rotator muscles of spine", how: "Lie on side, knees bent to 90°. Top arm sweeps open along the floor, following with your eyes. Return. Keep knees stacked.", tip: "Try to get the back of your hand flat on the floor opposite — that's full thoracic rotation." },
  "Doorway Stretch + Deep Breathing": { muscles: "Pectorals, intercostals, diaphragm", how: "Set up in a doorway stretch. Once in the stretch, take 5 deep diaphragmatic breaths, expanding the ribcage into the stretch on each inhale.", tip: "Combining the stretch with breathing makes each inhale actively expand the chest further." },
  "Deadlift": { muscles: "Full posterior chain: glutes, hamstrings, erectors, lats, traps", how: "Bar over mid-foot. Grip just outside knees. Brace, push the floor away. Keep bar close to legs. Lock out hips and knees simultaneously at the top.", tip: "Treat it like a leg press — you're pushing the floor away, not pulling the bar up." },
  "Dumbbell Bench Press": { muscles: "Chest, triceps, anterior deltoid", how: "Lie flat, dumbbells at chest. Press up and slightly inward. Lower under control. Dumbbells allow more range of motion than a bar.", tip: "A slight arch in the upper back is fine — it's natural. Avoid excessive lower back arch." },
  // Dave's Home Workout exercises
  "Standing Bar Overhead Press": { muscles: "Deltoids (all heads), triceps, upper traps, serratus anterior", how: "Bar at shoulder height. Brace core and glutes. Press straight up, clearing your nose, then slightly back at the top. Lower under control.", tip: "Squeeze your glutes at lockout — it protects the lower back from hyperextending under load." },
  "Barbell Bent Over Rows": { muscles: "Lats, mid-traps, rhomboids, rear delts, biceps", how: "Hinge to ~45°, overhand grip slightly wider than shoulders. Pull bar to your lower chest/upper stomach. Pause 1s at the top, lower slowly.", tip: "Lead with your elbows, not your hands — think 'drive elbow to hip pocket'." },
  "Single Kettlebell Lateral Raise": { muscles: "Medial deltoid, supraspinatus", how: "Hold kettlebell at side. Raise arm out to shoulder height with a slight elbow bend. Pause at the top, lower slowly over 2-3 seconds. Alternate sides.", tip: "Keep your thumb slightly lower than your pinky at the top — that 'pouring' cue maximises medial delt activation." },
  "Band Boxing": { muscles: "Hip flexors, hip extensors, core stability", how: "Anchor a band around ankles or calves. Standing tall, drive one knee up and forward in a controlled 'boxing' motion. Keep the standing leg slightly bent. Alternate legs.", tip: "Think tall spine — don't lean back as the knee comes up. The resistance challenges your standing hip stability." },
  "Butterfly Kicks": { muscles: "Hip flexors, lower abs, core", how: "Lie flat, hands under your lower back. Raise both legs a few inches off the floor. Alternately flutter kick up and down in small controlled movements.", tip: "The lower your legs, the harder it is. If your back arches off the floor, raise your legs higher." },
  "Plate Wood Chop": { muscles: "Obliques, lats, glutes, rotational core", how: "Hold a weight plate with both hands. Rotate and lower it diagonally across your body toward one hip, pivoting the back foot. Drive it back up diagonally to the opposite shoulder. Keep arms nearly straight.", tip: "The power comes from rotating through your hips, not just your arms — think 'hip leads the hands'." },
  "One Arm Kettlebell Fly": { muscles: "Chest (pec major, stretch-focused), anterior deltoid", how: "Lie on a bench or floor. Hold kettlebell by the handle in one hand. With a soft elbow, lower your arm out to the side until you feel a deep chest stretch. Return with a hugging arc.", tip: "Go lighter than you think — the arc path puts the chest under stretch at the weakest point. Control is everything." },
  "Dumbbell Squats": { muscles: "Quads, glutes, hamstrings, core", how: "Hold dumbbells at your sides or at shoulders. Feet shoulder-width. Sit back and down, keeping chest tall. Hip crease below parallel. Drive through heels to stand.", tip: "Push your knees out in the same direction as your toes throughout — this protects the knee and opens the hips." },
  "Hip Bridge": { muscles: "Glutes, hamstrings, lower back (isometric)", how: "Lie on your back, knees bent, feet flat. Drive hips toward the ceiling by squeezing glutes hard. Hold at the top for 1-2s. Lower slowly.", tip: "At the top, your body should form a straight line from knees to shoulders. Avoid hyperextending the lower back." },
  "Russian Twist": { muscles: "Obliques, transverse abdominis, hip flexors", how: "Sit with knees bent, lean back slightly to engage the core. Hold a weight or clasp hands. Rotate torso fully side to side, touching the floor (or air) beside each hip.", tip: "The rotation should come from your ribcage, not just your arms — feel the oblique doing the work." },
  "Dumbbell Standing Shoulder Press": { muscles: "Deltoids, triceps, upper traps", how: "Stand with dumbbells at ear height, palms forward. Press straight up overhead until arms are fully extended. Lower under control to ear level.", tip: "Standing version adds core demand vs seated — brace your abs throughout to avoid lower back sway." },
  "Crunches": { muscles: "Rectus abdominis (upper), obliques", how: "Lie flat, knees bent. Place hands behind your head lightly. Curl your upper back off the floor by contracting your abs, not by pulling your neck. Lower under control.", tip: "Focus on shortening the distance between your ribs and hips — that's the actual crunch movement. Neck stays neutral." },
  "Decline Press Ups": { muscles: "Upper chest, anterior deltoid, triceps", how: "Place feet on a raised surface (bench, step). Hands on floor slightly wider than shoulders. Lower chest toward the floor, elbows at ~45°. Press up powerfully.", tip: "The higher your feet, the more upper chest and shoulder involvement. Keep your body rigid throughout." },
  "Band Press": { muscles: "Glutes, hip flexors, core (anti-rotation)", how: "Anchor a band at ankle height. Stand sideways to the anchor. Drive one knee up against the band resistance, controlling the return. Like a standing march with resistance.", tip: "Keep your standing hip stable and avoid leaning — this also trains single-leg balance and hip stability." },
  "Lay Down Leg Raises": { muscles: "Hip flexors, lower abs, core", how: "Lie flat, hands under your lower back for support. Keep legs straight (or slight knee bend). Raise both legs to 90°, then lower slowly without touching the floor.", tip: "The slower you lower your legs, the harder it is. Breathe out on the way up to brace the core." },
  "Split Squat": { muscles: "Quads, glutes, hamstrings, single-leg stability", how: "Stand in a long lunge stance. Lower your back knee toward the floor, keeping your front shin vertical. Drive through your front heel to stand. Keep torso upright throughout.", tip: "Elevating the back foot (Bulgarian split squat) increases the range and difficulty significantly." },
  "Landmine Press": { muscles: "Chest, anterior deltoid, triceps, core", how: "Anchor one end of a barbell in a corner or landmine attachment. Grip the free end at shoulder height with both hands or one. Press the bar up and forward in an arc. Control it back.", tip: "The angled pressing path is easier on the shoulder than a vertical press — great for shoulder issues or variety." },
  "Negative Pull Ups": { muscles: "Lats, biceps, brachialis, rear delts", how: "Jump or step to the top position (chin above bar). Slowly lower yourself over 3-5 seconds until arms are fully extended. Step or jump back up for each rep.", tip: "The slower the descent, the more strength you build. Aim for 5 full seconds on the way down." },
  "Roll Outs": { muscles: "Transverse abdominis, rectus abdominis, lats, hip flexors", how: "Kneel behind an ab wheel or barbell. Roll forward slowly, keeping hips in line with body. Extend as far as you can without your hips dropping. Pull back by contracting your abs.", tip: "Start with a shorter range of motion and build up. If your hips sag, you've gone too far — that's lower back stress." },
  "Press Ups": { muscles: "Chest, triceps, anterior deltoid, serratus anterior", how: "Hands slightly wider than shoulders, feet together. Lower with control (3s), pause at the bottom, press up. Keep a rigid plank position throughout.", tip: "At the top, push the floor away and protract your shoulder blades forward for full chest activation." },
  // ── Yoga & Stretches ──────────────────────────────────────────────────────
  "Child's Pose": { muscles: "Lower back, hips, quads, ankles, shoulders (passive stretch)", how: "Kneel with knees hip-width apart, toes together. Sit hips back toward heels. Walk arms forward until they're straight and forehead rests on the mat. Breathe deeply into your lower back. Hold 30–60s.", tip: "If hips don't reach heels, place a folded blanket between thighs and calves. Wider knees makes it easier on a tight lower back." },
  "Downward Dog": { muscles: "Hamstrings, calves, spine, shoulders, arches of feet", how: "Start on all fours. Tuck toes and lift hips toward the ceiling, forming an inverted V. Press the floor away with your hands and try to push your heels toward the ground. Relax your head between your arms.", tip: "Bent knees are fine if hamstrings are tight — prioritise a long spine over straight legs. Alternate bending one knee then the other to warm up the calves." },
  "Low Lunge (Anjaneyasana)": { muscles: "Hip flexors, quads, groin, psoas", how: "From all fours or downward dog, step one foot forward between your hands. Lower the back knee to the floor. Lift your torso upright and gently push your hips forward and down until you feel a stretch along the front of the back hip. Arms can reach overhead.", tip: "Tuck your pelvis slightly — this deepens the hip flexor stretch considerably. Don't let your front knee drift past your toes." },
  "Pigeon Pose": { muscles: "Piriformis, glutes, hip external rotators, hip flexors", how: "From downward dog, bring one knee forward behind the same-side wrist. Extend the other leg straight back. Square your hips toward the mat. Either stay upright or fold forward, forehead toward the floor. Hold 5–10 breaths per side.", tip: "Place a folded blanket or block under the hip of the front leg if it doesn't reach the floor — this protects the knee and makes the stretch more even." },
  "Seated Forward Fold (Paschimottanasana)": { muscles: "Hamstrings, calves, lower back, spine", how: "Sit with legs straight in front of you, spine tall. Inhale and reach arms up. Exhale and hinge from the hips — not the waist — folding forward. Hold shins, ankles, or feet. Hold 30–60s breathing steadily.", tip: "The movement should come from the hips, not the back. A slight bend in the knees is fine. Use a strap around the feet if you can't reach comfortably." },
  "Sphinx Pose": { muscles: "Lower back extensors, abdominals (stretch), chest, hip flexors", how: "Lie on your stomach. Place forearms on the floor, elbows under shoulders. Press into forearms and lift your chest, keeping hips on the floor. Gaze forward. Hold 30–60s.", tip: "Sphinx is gentler than Cobra — keep elbows down and don't push too high. You should feel a mild lower back compression, not pain." },
  "Cobra Pose": { muscles: "Spine extensors, chest, abdominals (stretch), hip flexors", how: "Lie on stomach. Place hands under shoulders. Press into palms and lift chest off the floor, straightening arms partially. Keep hips on the floor and shoulders away from ears.", tip: "Don't fully straighten the arms unless very flexible — a gentle bend keeps the lower back safer. Engage the glutes lightly." },
  "Supine Twist": { muscles: "Spine rotators, outer hips, glutes, IT band, lower back", how: "Lie on your back. Draw one knee to your chest, then cross it over to the opposite side of your body. Extend the opposite arm out to the side and look away from your knee. Use the other hand to gently press the knee down. Hold 30–60s each side.", tip: "Both shoulders should stay on the floor — prioritise keeping the shoulder grounded over getting the knee to the mat." },
  "Bridge Pose": { muscles: "Glutes, hamstrings, hip flexors (stretch), lower back, chest (opening)", how: "Lie on your back, knees bent, feet flat. Press into your feet and squeeze your glutes to lift your hips as high as comfortable. Optionally clasp hands under your back. Hold 30–60s, then lower slowly.", tip: "Drive your knees forward over your toes as you lift — this keeps the glutes working and protects the lower back." },
  "Happy Baby (Ananda Balasana)": { muscles: "Inner groin, hips, lower back, sacrum", how: "Lie on your back. Draw knees to chest. Grab the outer edges of your feet (or shins). Open knees wide toward armpits and gently pull them down. Rock gently side to side to massage the lower back. Hold 30–60s.", tip: "Keep your sacrum on the floor. If you can't reach your feet, hold behind the knees or thighs — the stretch is the same." },
  "Thread the Needle": { muscles: "Thoracic spine (rotation), neck, upper back, shoulders", how: "Start on all fours. Slide one arm under your body, palm up, until your shoulder and ear rest on the floor. The other hand can press gently into the floor ahead. Feel the rotation through the upper back. Hold 30s each side.", tip: "Stack your hips directly above your knees throughout — don't let them shift sideways. Breathe into the upper back to deepen the rotation." },
  "Legs Up the Wall (Viparita Karani)": { muscles: "Hamstrings (gentle), lower back, nervous system (restorative)", how: "Sit sideways against a wall, then swing your legs up as you lie down. Scoot your hips close to the wall. Legs rest straight up. Arms out to the sides, palms up. Close your eyes. Hold 3–10 minutes.", tip: "Place a folded blanket under your hips to tilt the pelvis and make it more restorative. This is one of the best poses for recovery and stress relief." },
  "Warrior II (Virabhadrasana II)": { muscles: "Quads, glutes, hip abductors, hip flexors, shoulders (isometric)", how: "Stand with feet wide apart. Turn front toes forward, back foot at 90°. Bend front knee over front ankle. Arms reach horizontally, gaze over front middle finger. Sink deeper. Hold 30–60s each side.", tip: "Front knee tracks over the little toe — don't let it collapse inward. Imagine pressing the floor apart with both feet to activate the inner thighs." },
  "Triangle Pose (Trikonasana)": { muscles: "Hamstrings, inner thighs, obliques, IT band, chest (open)", how: "Stand with feet wide. Straighten the front leg. Reach the front arm forward and hinge at the hip, lowering the hand to the shin, a block, or the floor. Top arm reaches to the ceiling. Turn the chest open. Hold 30–60s each side.", tip: "Don't collapse into the bottom hand — think of the pose as a long side stretch, not a bend. Press the top arm up to open the chest more." },
  "Butterfly Pose (Baddha Konasana)": { muscles: "Inner thighs, groin, hips, lower back", how: "Sit tall. Bring the soles of your feet together and let your knees fall open. Hold your feet with both hands. Sit tall, or hinge forward from the hips to deepen. Hold 30–60s.", tip: "Don't press your knees down — let gravity do the work. The closer your feet are to your hips, the more intense the groin stretch." },
  "Standing Forward Fold": { muscles: "Hamstrings, calves, lower back, spine (decompression)", how: "Stand with feet hip-width apart. Hinge forward from the hips and let your upper body hang. Grab opposite elbows or let arms hang. Gently shift weight forward toward the balls of your feet. Hold 30–60s.", tip: "Bend your knees slightly if your hamstrings are very tight. This takes the strain off the lower back and makes it a better hamstring stretch." },
  "Seated Spinal Twist (Ardha Matsyendrasana)": { muscles: "Thoracic rotators, obliques, outer hip, IT band", how: "Sit with legs straight. Cross one foot over the opposite knee, planting it flat. Hug the raised knee with the opposite elbow and place the other hand behind you. Sit tall and rotate toward the raised knee on each exhale. Hold 30–60s each side.", tip: "The sit-tall cue is crucial — lengthening the spine before you twist dramatically increases the rotation you can achieve." },
  "Reclined Figure Four (Supta Kapotasana)": { muscles: "Piriformis, glutes, hip external rotators", how: "Lie on your back, knees bent. Cross one ankle over the opposite thigh. Flex the top foot. Pull the bottom thigh toward your chest until you feel a deep glute stretch. Hold 30–60s each side.", tip: "This is the supine version of Pigeon Pose — easier on the knees and great if Pigeon feels too intense. The more you flex the top foot, the safer it is for the knee." },
};

// ── Home Equipment Alternatives ───────────────────────────────────────────────
// User's kit: dumbbells · kettlebells · bench · resistance bands ·
//             foam roller · landmine · squat rack · 4×10kg plates · barbell
const HOME_ALTS = {
  // UPPER BODY
  "Barbell Bench Press":         { equip:"Bench + Barbell", alt:"Load barbell on squat rack. Lie on bench, unrack and press. Same movement, full load available." },
  "Incline Dumbbell Press":      { equip:"Bench + Dumbbells", alt:"Set bench to 30–45°. Press dumbbells up and inward. Exactly the same — no substitution needed." },
  "Barbell Incline Press":       { equip:"Bench + Barbell", alt:"Set bench to 30–45° and rack it in the squat rack. Same exercise with a barbell." },
  "Overhead Press":              { equip:"Barbell or Dumbbells", alt:"Press barbell overhead from squat rack (set J-hooks to shoulder height), or do standing dumbbell shoulder press." },
  "Seated Shoulder Press":       { equip:"Dumbbells + Bench", alt:"Sit on bench, press dumbbells overhead. No change needed — you have the kit." },
  "Dumbbell Shoulder Press":     { equip:"Dumbbells", alt:"You have these — no substitution needed. Stand or sit on bench." },
  "Dumbbell Floor Press":        { equip:"Dumbbells", alt:"Lie on the floor and press dumbbells up. Works perfectly — the floor limits range and protects the shoulder." },
  "Push-up":                     { equip:"Bodyweight", alt:"Standard floor push-up. To increase load, elevate feet on bench. For more range, use a pair of dumbbells as handles." },
  "Push-up Plus":                { equip:"Bodyweight", alt:"Same as push-up — add the scapular protraction at the top. Dumbbells as handles increase range if needed." },
  "Dumbbell Fly":                { equip:"Dumbbells + Bench", alt:"Lie on bench, arc dumbbells out wide. You have the exact kit needed." },
  "One Arm Kettlebell Fly":      { equip:"Kettlebell + Bench", alt:"Use a kettlebell by the horn. Lie on bench, arc it out. Identical to the prescribed movement." },
  "Dumbbell Pullover":           { equip:"Dumbbell + Bench", alt:"Lie across bench, hold one dumbbell with both hands overhead. Arc it back over your head. Perfect setup." },

  // BACK & PULLING
  "Lat Pulldown or Pull-up":     { equip:"Squat Rack", alt:"Attach a band to the pull-up bar on your squat rack and do assisted pull-ups, or full pull-ups if able." },
  "Pull-up or Lat Pulldown":     { equip:"Squat Rack", alt:"Use the pull-up bar on your squat rack. Loop a resistance band for assistance, or do full pull-ups." },
  "Weighted Pull-Ups":           { equip:"Squat Rack + Plates", alt:"Use the pull-up bar on your squat rack. Add a weight plate to a dipping belt or hold a dumbbell between your knees." },
  "Barbell or Dumbbell Row":     { equip:"Barbell or Dumbbells", alt:"Use the barbell for bent-over rows, or do dumbbell rows with one knee on the bench." },
  "Dumbbell Row":                { equip:"Dumbbell + Bench", alt:"One knee and hand on bench, row dumbbell to hip. You have the exact kit." },
  "One-Arm Dumbbell Row":        { equip:"Dumbbell + Bench", alt:"Knee and hand on bench, pull dumbbell to hip. Perfect — you have the kit." },
  "Barbell Row":                 { equip:"Barbell", alt:"Hinge to 45°, row barbell to lower chest. You have the barbell — no substitution needed." },
  "Cable Row":                   { equip:"Resistance Band", alt:"Anchor a band to a low point (under a door, or foot). Sit on the floor and row both hands to your hips." },
  "Seated Cable Row":            { equip:"Resistance Band", alt:"Sit on floor, band looped around feet, row handles to hips with a squeeze at the end." },
  "Home Bodyweight Row":         { equip:"Barbell + Squat Rack", alt:"Set barbell low in the squat rack at hip height. Hang underneath and row your chest to the bar — a proper Australian pull-up." },
  "Tri-Pause Bodyweight Row":    { equip:"Barbell + Squat Rack", alt:"Set barbell in squat rack at hip height. Same Australian pull-up with the 3 pauses at mid, peak, and mid." },
  "Supinated Bodyweight Row":    { equip:"Barbell + Squat Rack", alt:"Australian pull-up with underhand (supinated) grip. Set the barbell low in the squat rack." },
  "Front Lever Row":             { equip:"Squat Rack", alt:"Use the pull-up bar. From an inverted hang, pull to horizontal. Use a resistance band for assistance." },
  "Lat Stretch (side reach)":    { equip:"Squat Rack", alt:"Hold the upright of the squat rack at arm height, lean sideways with hips out. Full lat stretch." },

  // LEGS
  "Barbell Back Squat":          { equip:"Squat Rack + Barbell", alt:"Load the barbell in the squat rack — you have the full setup. Set J-hooks to shoulder height, squat to depth." },
  "Barbell Squat or Goblet Squat":{ equip:"Squat Rack or Kettlebell", alt:"Full barbell back squat in the squat rack, or goblet squat holding a kettlebell at chest." },
  "Goblet Squat":                { equip:"Kettlebell or Dumbbell", alt:"Hold KB or DB at chest. You have both — no substitution needed." },
  "Leg Press":                   { equip:"Barbell + Squat Rack", alt:"Do barbell back squats instead — more effective for overall leg development. Same leg muscles." },
  "Romanian Deadlift":           { equip:"Barbell or Dumbbells", alt:"Use the barbell (most effective) or hold two dumbbells. Keep the bar or weights close to your legs." },
  "Deadlift":                    { equip:"Barbell + Plates", alt:"Load plates onto the barbell. Set up with bar over mid-foot. You have the full setup — no substitution needed." },
  "Kettlebell Deadlift":         { equip:"Kettlebell or Barbell", alt:"Use the kettlebell between your feet, or use the barbell for more load." },
  "Single-Leg RDL":              { equip:"Dumbbell or Kettlebell", alt:"Hold one DB or KB in the opposite hand. Hip hinge on one leg, maintain balance." },
  "Nordic Curl":                 { equip:"Squat Rack or Bench", alt:"Anchor feet under the barbell set low in the squat rack, or tuck them under the bench. Same eccentric movement." },
  "Bulgarian Split Squat":       { equip:"Bench + Dumbbells", alt:"Back foot on bench, hold dumbbells at sides. You have the exact equipment — full exercise available." },
  "Walking Lunges":              { equip:"Dumbbells or Barbell", alt:"Hold dumbbells at your sides, or load a barbell on your back in the squat rack for stepping lunges." },
  "Step-ups":                    { equip:"Bench + Dumbbells", alt:"Step onto the bench while holding dumbbells. Works perfectly — you have the exact setup." },
  "Standing Calf Raise":         { equip:"Squat Rack + Barbell", alt:"Set a barbell on your back in the squat rack and do calf raises off the edge of a plate for range." },

  // CORE
  "Pallof Press":                { equip:"Resistance Band", alt:"Anchor a band at chest height to the squat rack upright. Step sideways, hold with both hands, press straight out and resist rotating." },
  "Cable Woodchop":              { equip:"Resistance Band", alt:"Anchor band high on the squat rack upright. In a split stance, pull diagonally down and across. Same diagonal pattern." },
  "Hanging Knee Raise":          { equip:"Squat Rack", alt:"Use the pull-up bar on your squat rack. Hang and raise knees to chest. Identical movement." },
  "Ab Wheel Rollout":            { equip:"Barbell + Plates", alt:"Load small plates on the barbell and use it as an ab wheel — roll forward from kneeling. Wider and very effective." },
  "Cable Woodchop / Downward Cable Rotation": { equip:"Resistance Band", alt:"Loop a band high on the squat rack. Pull diagonally down and across in a split stance." },
  "Downward Cable Rotation":     { equip:"Resistance Band", alt:"Anchor band high on squat rack. Split stance, pull diagonally down and across to mimic the downswing." },

  // SHOULDERS / ROTATOR CUFF
  "Face Pull":                   { equip:"Resistance Band", alt:"Anchor band at face height around the squat rack upright. Pull toward face, elbows high and wide. Identical effect." },
  "Cable Face Pull":             { equip:"Resistance Band", alt:"Loop band at face height on the squat rack. Pull toward face with external rotation at the top." },
  "Band Pull-Aparts":            { equip:"Resistance Band", alt:"You have bands — same exercise, no substitution needed. Arms at shoulder height, pull apart to chest." },
  "External Rotation (band)":    { equip:"Resistance Band", alt:"Loop band at elbow height on the squat rack. Elbow at 90°, rotate forearm outward. Perfect rotator cuff exercise." },
  "Lateral Band Walk":           { equip:"Resistance Band", alt:"Band around ankles. Step sideways in a half-squat. You have the band — no substitution needed." },
  "Resistance Band Swing Drill": { equip:"Resistance Band", alt:"Anchor band to the squat rack at hip height. Grip end in golf posture, simulate the downswing at speed." },

  // POWER / EXPLOSIVE
  "Kettlebell Swing":            { equip:"Kettlebell", alt:"You have kettlebells — no substitution needed. Hip hinge, explosive drive." },
  "High-to-Low Cable Chop":      { equip:"Resistance Band", alt:"Anchor band high on the squat rack. Split stance, pull the band diagonally down and across at full speed." },
  "Rotational Medicine Ball Throw": { equip:"Kettlebell or Dumbbell", alt:"Hold a light dumbbell or small KB. Rotate and throw/swing it diagonally. Lighter is better for speed." },
  "Medicine Ball Slam":          { equip:"Dumbbell or Kettlebell", alt:"Hold a light dumbbell. Reach overhead and slam it down to the floor as fast as possible. Use a rubber mat." },
  "Transition Slam":             { equip:"Dumbbell", alt:"Hold a light dumbbell with both hands. Wind up and slam it toward your trail foot. Focus on speed, not load." },
  "Rotational Chest Throw":      { equip:"Dumbbell", alt:"Light dumbbell held in trail hand. Wind up and drive it diagonally into the floor. Lead side on opposite side." },
  "Landmine Press":              { equip:"Landmine + Barbell", alt:"You have the landmine — insert the barbell and press it. Identical to the prescribed movement." },
  "Jump Squat":                  { equip:"Bodyweight", alt:"Bodyweight or hold a light dumbbell at chest. Full squat, then explode vertically. Land softly through hips." },

  // FUNCTIONAL / MISC
  "Farmer Carry":                { equip:"Dumbbells or Kettlebells", alt:"Hold a heavy dumbbell or kettlebell in each hand. Walk with a tall spine. You have the kit." },
  "Glute Bridge":                { equip:"Barbell + Plates", alt:"Load a barbell across your hips (use a foam roller for padding) for a proper hip thrust. Add plates for load." },
  "Hip Bridge":                  { equip:"Barbell", alt:"Roll the barbell over your hips (foam roller underneath for comfort) and drive up. Hip thrust with load." },
  "Split Squat":                 { equip:"Dumbbells or Barbell", alt:"Hold dumbbells at sides or load a barbell on your back. Long lunge stance, lower back knee." },
  "Deadbug Hold":                { equip:"Bodyweight", alt:"No equipment needed — floor exercise. Press lower back flat, extend opposite arm and leg, hold." },
  "Eccentric Wrist Curls":       { equip:"Dumbbell", alt:"Use the lightest dumbbell you have. Slow 3s lowering. You have the kit." },
  "Jefferson Curl":              { equip:"Barbell or Dumbbell", alt:"Hold one dumbbell with both hands, or use a barbell. Stand on plates for more range — curl down vertebra by vertebra." },
  "Weighted Side Bend":          { equip:"Dumbbell or Kettlebell", alt:"Hold one DB or KB in one hand, bend sideways as far as possible. You have the exact kit." },
  "Rotational Twist":            { equip:"Dumbbell or Plate", alt:"Hold a 10kg plate or dumbbell at chest height. Rotate hips and torso with a foot pivot." },
  "Reverse Hyperextension":      { equip:"Bench", alt:"Lie face-down on the bench, hips at the edge, legs hanging. Raise both legs to parallel. Exactly this movement." },
  "Cyclist Squat":               { equip:"Dumbbells + Plates", alt:"Heels elevated on the 10kg plates (stacked). Hold dumbbells at sides. Deep narrow-stance squat." },
  "Thoracic Extension on Roller":{ equip:"Foam Roller", alt:"You have the foam roller — no substitution. Place across mid-back and arch over it gently." },
  "Foam Roll Quads":             { equip:"Foam Roller", alt:"You have it. Lie face-down, roller under quads. Slowly roll up and down the quad, pausing on tender spots." },
  "Foam Roll IT Band":           { equip:"Foam Roller", alt:"Side-lying, roller under the outside of the thigh. Slow deliberate rolls from hip to knee." },
  "Foam Roll Upper Back":        { equip:"Foam Roller", alt:"Perpendicular to spine. Arms crossed. Roll up and down the upper back and mid-back." },
};

// Helper: get home alt for an exercise
const getHomeAlt = name => HOME_ALTS[name] || null;

// ── Pectus Carinatum 12-Week Program ─────────────────────────────────────────
const PECTUS_PROGRAM = {
  id: "pectus-12week",
  name: "Pectus Carinatum 12-Week Plan",
  subtitle: "Posture · Strength · Balanced Chest",
  emoji: "🫁",
  totalWeeks: 12,
  phases: [
    {
      id: "p1",
      name: "Foundation & Activation",
      weeks: "Weeks 1–4",
      weekRange: [1,4],
      color: "#6c63ff",
      goal: "Establish balanced muscle activation, correct posture habits, and prepare joints and connective tissue.",
      frequency: "3 sessions/week (e.g. Mon–Wed–Fri) + daily mobility",
      workouts: [
        {
          id: "p1-a",
          name: "Workout A — Posterior Chain",
          tag: "Upper",
          exercises: [
            { name: "Band Pull-Aparts",       sets: "3", reps: "15",    weight: "" },
            { name: "One-Arm Dumbbell Row",   sets: "3", reps: "10/side",weight: "" },
            { name: "Face Pull",              sets: "3", reps: "15",    weight: "" },
            { name: "Kettlebell Deadlift",    sets: "3", reps: "8",     weight: "" },
            { name: "Bird Dog",               sets: "3", reps: "10/side",weight: "" },
            { name: "Doorway Chest Stretch",  sets: "2", reps: "60s",   weight: "" },
          ],
        },
        {
          id: "p1-b",
          name: "Workout B — Chest & Core",
          tag: "Upper",
          exercises: [
            { name: "Dumbbell Floor Press",   sets: "3", reps: "10",    weight: "" },
            { name: "Incline Dumbbell Press", sets: "3", reps: "10",    weight: "" },
            { name: "Dumbbell Pullover",      sets: "3", reps: "12",    weight: "" },
            { name: "Plank (bench-supported)",sets: "3", reps: "30s",   weight: "" },
            { name: "Side Plank",             sets: "2", reps: "20s/side",weight: "" },
            { name: "Thoracic Extension",     sets: "2", reps: "60s",   weight: "" },
          ],
        },
        {
          id: "p1-daily",
          name: "Daily Mobility",
          tag: "Daily",
          exercises: [
            { name: "Wall Angels",                    sets: "2", reps: "10",    weight: "" },
            { name: "Chin Tucks",                     sets: "3", reps: "10",    weight: "" },
            { name: "Standing Band Chest Opener",     sets: "2", reps: "30s",   weight: "" },
            { name: "Deep Diaphragmatic Breathing",   sets: "1", reps: "10 breaths", weight: "" },
          ],
        },
      ],
    },
    {
      id: "p2",
      name: "Strength & Structure",
      weeks: "Weeks 5–8",
      weekRange: [5,8],
      color: "#f5a623",
      goal: "Build visible muscle across the chest, shoulders, and back while maintaining symmetry.",
      frequency: "3 sessions/week, alternating A & B with optional lower body",
      workouts: [
        {
          id: "p2-a",
          name: "Upper A — Push",
          tag: "Push",
          exercises: [
            { name: "Incline Dumbbell Press", sets: "4", reps: "8",     weight: "" },
            { name: "Push-up",               sets: "3", reps: "10-15",  weight: "" },
            { name: "Seated Shoulder Press", sets: "3", reps: "10",     weight: "" },
            { name: "Dumbbell Pullover",     sets: "3", reps: "12",     weight: "" },
            { name: "Pallof Press",          sets: "3", reps: "10/side",weight: "" },
          ],
        },
        {
          id: "p2-b",
          name: "Upper B — Pull",
          tag: "Pull",
          exercises: [
            { name: "Barbell or Dumbbell Row",sets: "4", reps: "8",     weight: "" },
            { name: "Lat Pulldown or Pull-up",sets: "3", reps: "8-10",  weight: "" },
            { name: "Rear Delt Fly",          sets: "3", reps: "12",    weight: "" },
            { name: "Face Pull",              sets: "3", reps: "15",    weight: "" },
            { name: "Kettlebell Swing",       sets: "3", reps: "10",    weight: "" },
          ],
        },
        {
          id: "p2-c",
          name: "Lower Body (Optional)",
          tag: "Lower",
          exercises: [
            { name: "Goblet Squat",          sets: "3", reps: "10",     weight: "" },
            { name: "Romanian Deadlift",     sets: "3", reps: "10",     weight: "" },
            { name: "Step-ups",              sets: "3", reps: "10/side",weight: "" },
          ],
        },
      ],
    },
    {
      id: "p3",
      name: "Refinement & Definition",
      weeks: "Weeks 9–12",
      weekRange: [9,12],
      color: "#ff4d4d",
      goal: "Refine chest shape, continue strength gains, and maintain posture improvements.",
      frequency: "4 sessions/week: Push · Pull · Core+Mobility · Optional Full Body",
      workouts: [
        {
          id: "p3-push",
          name: "Push Day",
          tag: "Push",
          exercises: [
            { name: "Barbell Incline Press", sets: "4", reps: "6",     weight: "" },
            { name: "Dumbbell Fly",          sets: "3", reps: "12",    weight: "" },
            { name: "Overhead Press",        sets: "3", reps: "8",     weight: "" },
            { name: "Push-up Plus",          sets: "3", reps: "12",    weight: "" },
          ],
        },
        {
          id: "p3-pull",
          name: "Pull Day",
          tag: "Pull",
          exercises: [
            { name: "Pull-up or Lat Pulldown",sets: "4", reps: "6-8",   weight: "" },
            { name: "Barbell Row",            sets: "4", reps: "6",     weight: "" },
            { name: "Rear Delt Fly",          sets: "3", reps: "15",    weight: "" },
            { name: "Band Pull-Aparts",       sets: "3", reps: "15",    weight: "" },
          ],
        },
        {
          id: "p3-core",
          name: "Core + Mobility Day",
          tag: "Core",
          exercises: [
            { name: "Planks",                        sets: "3", reps: "45s",    weight: "" },
            { name: "Side Planks",                   sets: "3", reps: "30s/side",weight: "" },
            { name: "Thoracic Rotations",            sets: "2", reps: "10/side",weight: "" },
            { name: "Doorway Stretch + Deep Breathing",sets:"2",reps: "5 breaths",weight:"" },
          ],
        },
        {
          id: "p3-full",
          name: "Full Body (Optional)",
          tag: "Full",
          exercises: [
            { name: "Deadlift",              sets: "3", reps: "5",      weight: "" },
            { name: "Kettlebell Swing",      sets: "3", reps: "12",     weight: "" },
            { name: "Dumbbell Bench Press",  sets: "3", reps: "10",     weight: "" },
            { name: "Barbell or Dumbbell Row",sets:"3", reps: "10",     weight: "" },
          ],
        },
      ],
    },
  ],
};
const BW_ROUTINES = [
  {
    id: "bw-fundamentals",
    category: "Bodyweight",
    name: "Full Body Fundamentals",
    emoji: "🤜",
    level: "Beginner",
    duration: "35 min",
    color: "#f0a500",
    bg: "linear-gradient(135deg, #1a1200 0%, #2a1e00 100%)",
    description: "Tom Merrick's foundational at-home strength circuit. Paired sets of push, pull and legs — zero equipment needed. Build to 6+ reps before progressing.",
    source: "Bodyweight Warrior",
    exercises: [
      { name: "Incline Push Up",         sets: "3", reps: "8-12",    weight: "", note: "Hands elevated on a surface; elbows ~45°; full range" },
      { name: "Home Bodyweight Row",     sets: "3", reps: "8-12",    weight: "", note: "Lie under a table; pull chest to edge; stay hollow" },
      { name: "Bodyweight Squat",        sets: "3", reps: "10-15",   weight: "", note: "Hip crease below parallel; heels planted; chest tall" },
      { name: "Lying Leg Raise",         sets: "3", reps: "10",      weight: "", note: "Lower back pressed down; slow descent; don't let feet touch" },
      { name: "Single Leg Wall Sit",     sets: "2", reps: "20s/leg", weight: "", note: "One leg extended; thigh parallel to floor; squeeze glute" },
      { name: "Oblique Plank",           sets: "3", reps: "20s/side",weight: "", note: "Side plank; hip up; rotate top elbow to floor and back" },
    ],
  },
  {
    id: "bw-strength",
    category: "Bodyweight",
    name: "Calisthenics Strength",
    emoji: "⚙️",
    level: "Intermediate",
    duration: "45 min",
    color: "#f0a500",
    bg: "linear-gradient(135deg, #1a1200 0%, #2a1e00 100%)",
    description: "Tom's intermediate at-home program. Superset push and pull with tempo control — the 2-1-X-1 method builds real strength without a gym.",
    source: "Bodyweight Warrior",
    exercises: [
      { name: "Pike Push Up",            sets: "4", reps: "6-10",   weight: "", note: "Inverted V; lower crown toward floor; 2s down, explode up" },
      { name: "Diamond Push Up",         sets: "4", reps: "6-10",   weight: "", note: "Superset w/ Pike PU; hands form triangle; triceps focus" },
      { name: "Tri-Pause Bodyweight Row",sets: "4", reps: "6-8",    weight: "", note: "Pause at mid, top, mid — 1s each; full retraction at top" },
      { name: "Cyclist Squat",           sets: "3", reps: "10-12",  weight: "", note: "Heels elevated; narrow stance; deep knee bend; quad dominant" },
      { name: "Pseudo Planche Push Up",  sets: "3", reps: "6-8",    weight: "", note: "Hands at hips; lean forward; protract shoulder blades at top" },
      { name: "Reverse Plank Extension", sets: "3", reps: "10",     weight: "", note: "Hands behind; lift hips; extend one leg at a time" },
      { name: "Reverse Hyperextension",  sets: "3", reps: "12",     weight: "", note: "Prone on table edge; raise legs to parallel; squeeze glutes" },
    ],
  },
  {
    id: "bw-daily-mobility",
    category: "Bodyweight",
    name: "5-Move Daily Mobility",
    emoji: "🌅",
    level: "All Levels",
    duration: "10 min",
    color: "#f0a500",
    bg: "linear-gradient(135deg, #1a1200 0%, #2a1e00 100%)",
    description: "Tom Merrick's signature daily 5. Do this every morning, as a work break, or before bed — the minimum effective dose for staying mobile and injury-free.",
    source: "Bodyweight Warrior",
    exercises: [
      { name: "Dead Hang",               sets: "3", reps: "30s",     weight: "", note: "From bar or rings; relax shoulders fully; decompress spine" },
      { name: "90/90 Hip Stretch",       sets: "2", reps: "60s/side",weight: "", note: "Both legs at 90°; sit tall; rotate between internal & external" },
      { name: "Deep Squat Hold",         sets: "3", reps: "45s",     weight: "", note: "Feet hip-width; full depth; hands in prayer; stay relaxed" },
      { name: "Hip Flexor Stretch",      sets: "2", reps: "45s/side",weight: "", note: "Low lunge; back knee down; drive hips forward; tall spine" },
      { name: "Elephant Walks",          sets: "2", reps: "10/side", weight: "", note: "Hinge forward; straight legs; alternate pressing heel to floor" },
    ],
  },
  {
    id: "bw-skills",
    category: "Bodyweight",
    name: "Handstand & Skills",
    emoji: "🙌",
    level: "Advanced",
    duration: "40 min",
    color: "#f0a500",
    bg: "linear-gradient(135deg, #1a1200 0%, #2a1e00 100%)",
    description: "Tom's skills program: daily handstand practice paired with L-sit and front lever progressions. The cornerstone of the Bodyweight Warrior system.",
    source: "Bodyweight Warrior",
    exercises: [
      { name: "Wall Handstand Hold",     sets: "5", reps: "20-30s",  weight: "", note: "Chest to wall; straight body line; press through shoulders; do daily" },
      { name: "Pike Handstand Hold",     sets: "4", reps: "15-20s",  weight: "", note: "Feet on box; hips over hands; builds press-to-handstand strength" },
      { name: "Tuck L-Sit Hold",         sets: "4", reps: "10-15s",  weight: "", note: "Parallel bars or floor; knees tucked; arms straight; protract scapula" },
      { name: "Natural Hamstring Curl",  sets: "3", reps: "5-6",     weight: "", note: "Kneel, anchor feet; lower slowly with straight body; 4s eccentric" },
      { name: "Shrimp Squat",            sets: "3", reps: "5-8/leg", weight: "", note: "Back foot held behind; lower back knee to just off floor; stay upright" },
      { name: "Tuck Front Lever Hold",   sets: "4", reps: "8-12s",   weight: "", note: "From dead hang; tuck knees; raise body to parallel; hold tension" },
      { name: "Supinated Bodyweight Row",sets: "3", reps: "8-10",    weight: "", note: "Palms facing you; full retraction; 1s pause at chest; slow negative" },
    ],
  },
];

const GOLF_ROUTINES = [
  {
    id: "golf-warmup",
    category: "Golf",
    name: "Pre-Round Warm-Up",
    emoji: "⛳",
    level: "All Levels",
    duration: "15 min",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #071a10 0%, #0d2c1a 100%)",
    description: "A dynamic warm-up targeting hips, thoracic spine & shoulders — the 3 most important areas for golfers. Do this before any round or range session.",
    source: "J Golf Fitness",
    exercises: [
      { name: "Seated Hip Internal Rotation", sets: "2", reps: "10/side",   weight: "", note: "Smooth controlled reps — don't force range of motion" },
      { name: "Squat to Forward Fold",        sets: "2", reps: "10",        weight: "", note: "Move slowly: deep squat → forward fold → back. Stay relaxed" },
      { name: "PVC Rotations",                sets: "2", reps: "10/side",   weight: "", note: "Hinge at hips, rotate through full range. Golf club works too" },
      { name: "Pigeon Pose Stretch",          sets: "2", reps: "30s/side",  weight: "", note: "Hold and breathe — hips take a beating in golf" },
      { name: "Arm Circles + Cross-Body",     sets: "2", reps: "10 each",   weight: "", note: "Big slow circles, then cross-body shoulder stretch" },
      { name: "Torso Rotation in Golf Stance",sets: "2", reps: "10/side",   weight: "", note: "Club across chest, rotate fully back and through" },
    ],
  },
  {
    id: "golf-swing-speed",
    category: "Golf",
    name: "Swing Speed Power",
    emoji: "💨",
    level: "Intermediate",
    duration: "30 min",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #071a10 0%, #0d2c1a 100%)",
    description: "3-exercise rotational power circuit from J Golf Fitness. Builds the explosive hip-to-torso sequencing that directly translates into more clubhead speed.",
    source: "J Golf Fitness",
    exercises: [
      { name: "High-to-Low Cable Chop",        sets: "4", reps: "8/side",  weight: "",      note: "Split stance; rotate upper body only; pull rope down and across" },
      { name: "Dumbbell Rotational Swing",      sets: "4", reps: "10/side", weight: "8-12kg", note: "Golf posture; hips turn naturally; core controls the movement" },
      { name: "Rotational Medicine Ball Slam",  sets: "4", reps: "8/side",  weight: "4-6kg",  note: "Athletic stance; drive ball down and across; focus on speed" },
      { name: "Pallof Press",                   sets: "3", reps: "12/side", weight: "",       note: "Anti-rotation; builds core stability for swing control" },
      { name: "Lateral Band Walk",              sets: "3", reps: "15/side", weight: "",       note: "Band around ankles; stay low; activates glutes for ground force" },
    ],
  },
  {
    id: "golf-flexibility",
    category: "Golf",
    name: "Golf Flexibility & Mobility",
    emoji: "🔄",
    level: "Beginner",
    duration: "20 min",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #071a10 0%, #0d2c1a 100%)",
    description: "Most swing flaws are physical, not technical. These stretches from J Golf Fitness address the 3 key restrictions that limit rotation: hips, T-spine, and glutes.",
    source: "J Golf Fitness",
    exercises: [
      { name: "PVC Rotations",            sets: "3", reps: "10/side",   weight: "", note: "Hinge at hips parallel to floor; rotate through upper back only" },
      { name: "Hip Internal Rotations",   sets: "3", reps: "15",        weight: "", note: "Yoga block between knees; spread toes; stay tall. Opens hips for power transfer" },
      { name: "Seated Piriformis Stretch",sets: "3", reps: "30s/side",  weight: "", note: "Ankle over knee; chest tall; hinge forward. Frees glute tension" },
      { name: "Open Book Stretch",        sets: "3", reps: "10/side",   weight: "", note: "Side-lying; rotate top arm open; follow with eyes. T-spine mobility" },
      { name: "90/90 Hip Stretch",        sets: "2", reps: "60s/side",  weight: "", note: "Both legs at 90°; sit tall; don't let hips lift" },
      { name: "Thoracic Extension on Roller", sets: "2", reps: "60s",   weight: "", note: "Foam roller across mid-back; arms crossed; breathe into the stretch" },
    ],
  },
  {
    id: "golf-shoulder",
    category: "Golf",
    name: "Shoulder Stability for Golf",
    emoji: "🏌️",
    level: "Beginner",
    duration: "20 min",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #071a10 0%, #0d2c1a 100%)",
    description: "Shoulder issues are one of the most common golf injuries. This J Golf Fitness routine strengthens the serratus, rear delts & upper back to keep your shoulders healthy.",
    source: "J Golf Fitness",
    exercises: [
      { name: "Side-Lying Serratus Press",    sets: "3", reps: "10/side",  weight: "light DB", note: "Lie on side; press top shoulder toward ceiling; slow and controlled" },
      { name: "Foam Roller Chest Opener",     sets: "3", reps: "30s",      weight: "",         note: "Roller along spine; arms open out to sides; chin tucked; breathe deep" },
      { name: "Face Pulls",                   sets: "3", reps: "12",       weight: "band",     note: "Thumbs back; elbows high and wide; squeeze shoulder blades at peak" },
      { name: "Band Pull-Aparts",             sets: "3", reps: "15",       weight: "band",     note: "Arms straight at chest height; pull band to chest; slow negative" },
      { name: "Y-T-W Raises",                sets: "3", reps: "10 each",  weight: "light DB", note: "Prone or on incline; trace Y, T, and W shapes with arms; rear delt focus" },
    ],
  },
];

// ── Fit For Golf (Mike Carroll) Routines ──────────────────────────────────────
const FFG_ROUTINES = [
  {
    id: "ffg-mobility",
    category: "Golf",
    name: "5-Move Daily Golf Mobility",
    emoji: "🔁",
    level: "All Levels",
    duration: "5 min",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #071a10 0%, #0d2c1a 100%)",
    description: "Mike Carroll's core daily mobility routine. Just 3–5 minutes done consistently can unlock more rotation, ease stiffness, and prime your body before every round.",
    source: "Fit For Golf",
    exercises: [
      { name: "Hip Rotations",                      sets: "1", reps: "20/dir/leg",  weight: "",      note: "Golf posture, paper plate under one foot. Rotate thigh in & out — maximise range each rep" },
      { name: "Cat-Cow Spine Flexion & Extension",  sets: "1", reps: "20",          weight: "",      note: "All fours, arms straight. Crunch chin & tailbone together, then stretch apart — full range" },
      { name: "Half-Kneeling Thoracic Rotation",    sets: "1", reps: "20/side",     weight: "",      note: "Fingertips on temples, half-kneeling. Rotate chest as far as possible — hips stay square" },
      { name: "Shoulder Circles",                   sets: "1", reps: "10/direction",weight: "",      note: "Arm fully extended like an iron bar throughout. Trace the biggest circle possible each rep" },
      { name: "Cervical Rotation",                  sets: "1", reps: "10/side",     weight: "",      note: "Slow turn head as far as possible each way. Gradually increase range on each rep" },
    ],
  },
  {
    id: "ffg-core",
    category: "Golf",
    name: "Golf Core — 4 Planes",
    emoji: "🌀",
    level: "Intermediate",
    duration: "25 min",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #071a10 0%, #0d2c1a 100%)",
    description: "Mike Carroll's four-plane core system trusted by PGA Tour pros. Real multi-directional strength — not crunches — that transfers directly into a more powerful, stable swing.",
    source: "Fit For Golf",
    exercises: [
      { name: "Deadlift",                sets: "3", reps: "3-5",     weight: "",       note: "Hinge at hips; bar close to shins; brace entire trunk. King of posterior chain exercises" },
      { name: "Extended Range Sit Up",   sets: "3", reps: "5-8",     weight: "",       note: "Lie over a bench to extend range beyond flat. Slow and controlled — not a crunch" },
      { name: "Weighted Side Bend",      sets: "3", reps: "10/side", weight: "light",  note: "Hold dumbbell in one hand; bend as far sideways as possible; feel full oblique & QL stretch" },
      { name: "Downward Cable Rotation", sets: "3", reps: "5-8/side",weight: "",       note: "Set up like golf transition. Drive pelvis and torso to separate — mimic the downswing pattern" },
    ],
  },
  {
    id: "ffg-medball-speed",
    category: "Golf",
    name: "Med Ball Speed Circuit",
    emoji: "💥",
    level: "Intermediate",
    duration: "20 min",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #071a10 0%, #0d2c1a 100%)",
    description: "Mike Carroll's explosive med ball circuit for swing speed. Use a 2–6 lb ball only — light enough to move fast. 3 rounds of 5 reps each, 30–60s rest between exercises.",
    source: "Fit For Golf",
    exercises: [
      { name: "Transition Slam",        sets: "3", reps: "5/side", weight: "2-6 lb ball", note: "Wind up fast, slam ball down just outside trail foot. Trains obliques & lats like the downswing" },
      { name: "Rotational Chest Throw", sets: "3", reps: "5/side", weight: "2-6 lb ball", note: "Wind up and drive ball into ground with trail arm. Lead side on one side, trail side on other" },
      { name: "Med Ball Slam",          sets: "3", reps: "5",      weight: "2-6 lb ball", note: "Reach overhead to stretch lats & abs fully, then rip ball into ground. Use a non-rubber ball!" },
    ],
  },
  {
    id: "ffg-lower-back",
    category: "Golf",
    name: "Lower Back Relief",
    emoji: "🔧",
    level: "All Levels",
    duration: "10 min",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #071a10 0%, #0d2c1a 100%)",
    description: "Mike Carroll's 3-exercise lower back routine targeting all 3 key spinal functions: flexion, lateral bend, and rotation. Great for chronic back stiffness from golf.",
    source: "Fit For Golf",
    exercises: [
      { name: "Jefferson Curl",     sets: "2", reps: "10",      weight: "light", note: "Stand on low step, hold light weight. Curl down vertebra by vertebra; breathe and reach deeper at bottom" },
      { name: "Weighted Side Bend", sets: "2", reps: "10/side", weight: "light", note: "Dumbbell in one hand; bend to that side as far as possible; feel full oblique & QL stretch" },
      { name: "Rotational Twist",   sets: "2", reps: "10/side", weight: "light", note: "Light weight at chest height; rotate hips & torso fully, pivot foot; slow to end of range each rep" },
    ],
  },
];

// ── Dave's Home Workouts (Definition Body Coaching) ───────────────────────────
const DAVE_ROUTINES = [
  {
    id: "dave-workout-1",
    category: "Dave's",
    name: "Home Workout A",
    emoji: "🏠",
    level: "Intermediate",
    duration: "45 min",
    color: "#e040fb",
    bg: "linear-gradient(135deg, #150820 0%, #200d30 100%)",
    description: "Overhead pressing and barbell rows as the main strength lifts, with KB lateral raises, goblet squats, and a band + core superset circuit to finish.",
    source: "Definition Body Coaching",
    exercises: [
      { name: "Standing Bar Overhead Press", sets: "4", reps: "10-15",     weight: "Bar +2×5kg",  note: "Main lift — 4 working sets. Brace core and glutes throughout." },
      { name: "Barbell Bent Over Rows",      sets: "4", reps: "10-12",     weight: "Bar +2×10kg", note: "Main lift — 4 working sets. Pull to lower chest, 1s pause at top." },
      { name: "Single Kettlebell Lateral Raise", sets: "3", reps: "12/side", weight: "6kg",        note: "Alternate sides each rep. Slow 3s descent." },
      { name: "Goblet Squats",               sets: "3", reps: "20",        weight: "10kg DB",     note: "Hold at chest. Full depth, chest tall throughout." },
      { name: "Band Boxing",                 sets: "3", reps: "30s/leg",   weight: "band",        note: "⚡ Superset with Butterfly Kicks — no rest between the two." },
      { name: "Butterfly Kicks",             sets: "3", reps: "30s",       weight: "",            note: "⚡ Into after Band Boxing — 3 rounds total of the superset." },
      { name: "Band Rows",                   sets: "3", reps: "30s/side",  weight: "band",        note: "⚡ Superset with Plate Wood Chop — no rest between the two." },
      { name: "Plate Wood Chop",             sets: "3", reps: "10/side",   weight: "5kg",         note: "⚡ Into after Band Rows — pivot back foot, diagonal drive." },
    ],
  },
  {
    id: "dave-workout-2",
    category: "Dave's",
    name: "Home Workout B",
    emoji: "🏠",
    level: "Intermediate",
    duration: "45 min",
    color: "#e040fb",
    bg: "linear-gradient(135deg, #150820 0%, #200d30 100%)",
    description: "Chest-focused session: barbell rows and KB fly as main lifts, DB bench press and squats as accessory work, with a hip bridge/Russian twist and shoulder press/crunch superset circuit.",
    source: "Definition Body Coaching",
    exercises: [
      { name: "Barbell Bent Over Rows",        sets: "4", reps: "10-12",     weight: "Bar +2×10kg (+2kg last set)", note: "Main lift. Add an extra 2kg plate each end on the last set." },
      { name: "One Arm Kettlebell Fly",         sets: "4", reps: "8-12",      weight: "8kg KB",     note: "Main lift. Control the stretch — use the KB handle for a deeper range." },
      { name: "Dumbbell Bench Press",           sets: "3", reps: "12-15",     weight: "10kg",       note: "Additional lift." },
      { name: "Dumbbell Squats",                sets: "3", reps: "15-20",     weight: "10kg",       note: "Additional lift. Full depth, heels planted." },
      { name: "Hip Bridge",                     sets: "3", reps: "20",        weight: "",           note: "⚡ Superset with Russian Twist — go straight into it." },
      { name: "Russian Twist",                  sets: "3", reps: "45s",       weight: "",           note: "⚡ Into after Hip Bridge — 3 rounds of the superset." },
      { name: "Dumbbell Standing Shoulder Press",sets:"3", reps: "12",        weight: "10kg",       note: "⚡ Superset with Crunches — go straight into it." },
      { name: "Crunches",                       sets: "3", reps: "45s",       weight: "",           note: "⚡ Into after Shoulder Press — 3 rounds of the superset." },
      { name: "Band Boxing",                    sets: "3", reps: "30s/leg",   weight: "band",       note: "Additional finisher — 3 sets." },
    ],
  },
  {
    id: "dave-workout-3",
    category: "Dave's",
    name: "Home Workout C",
    emoji: "🏠",
    level: "Intermediate",
    duration: "40 min",
    color: "#e040fb",
    bg: "linear-gradient(135deg, #150820 0%, #200d30 100%)",
    description: "Decline press ups and barbell rows lead, followed by band press/leg raise supersets, band rows/side plank supersets, bodyweight split squats, and band boxing finisher.",
    source: "Definition Body Coaching",
    exercises: [
      { name: "Decline Press Ups",    sets: "4", reps: "up to 10",    weight: "",                note: "Main lift. Feet on bench/step. Goes heavier automatically due to the angle." },
      { name: "Barbell Bent Over Rows",sets:"4", reps: "10-12",       weight: "Bar +2×10kg (+2kg last 2 sets)", note: "Main lift. Extra 2kg each end on the final two sets." },
      { name: "Band Press",           sets: "3", reps: "15/leg",      weight: "band",            note: "⚡ Superset with Lay Down Leg Raises." },
      { name: "Lay Down Leg Raises",  sets: "3", reps: "up to 40s",   weight: "",                note: "⚡ Into after Band Press — 3 rounds total." },
      { name: "Band Rows",            sets: "3", reps: "15/leg",      weight: "band",            note: "⚡ Superset with Side Plank." },
      { name: "Side Plank",           sets: "3", reps: "30s/side",    weight: "",                note: "⚡ Into after Band Rows — 3 rounds total." },
      { name: "Split Squat",          sets: "3", reps: "15/leg",      weight: "",                note: "Bodyweight only. Long stance, back knee to just off the floor." },
      { name: "Band Boxing",          sets: "3", reps: "30s/leg",     weight: "band",            note: "Additional finisher — 3 sets." },
    ],
  },
  {
    id: "dave-workout-4",
    category: "Dave's",
    name: "Home Workout D",
    emoji: "🏠",
    level: "Intermediate",
    duration: "45 min",
    color: "#e040fb",
    bg: "linear-gradient(135deg, #150820 0%, #200d30 100%)",
    description: "Landmine press and negative pull ups build shoulder and back strength, followed by band row/press-up and dumbbell squat/band press supersets, finishing with a roll out/wood chop circuit.",
    source: "Definition Body Coaching",
    exercises: [
      { name: "Landmine Press",       sets: "4", reps: "10",          weight: "10kg plate",     note: "Main lift. Go heavier after set 1 if it feels too easy." },
      { name: "Negative Pull Ups",    sets: "4", reps: "2-5",         weight: "",               note: "Main lift. Jump to top, lower over 3-5s. Use a tree branch or bar." },
      { name: "Band Rows",            sets: "3", reps: "up to 1 min/leg", weight: "band",       note: "⚡ Superset with Press Ups." },
      { name: "Press Ups",            sets: "3", reps: "10",          weight: "",               note: "⚡ Into after Band Rows — 3 rounds total." },
      { name: "Dumbbell Squats",      sets: "3", reps: "up to 15",    weight: "10kg",           note: "⚡ Superset with Band Press." },
      { name: "Band Press",           sets: "3", reps: "up to 1 min/leg", weight: "band",       note: "⚡ Into after Dumbbell Squats — 3 rounds total." },
      { name: "Roll Outs",            sets: "3", reps: "up to 30s",   weight: "",               note: "⚡ Superset with Plate Wood Chop. Ab wheel or barbell." },
      { name: "Plate Wood Chop",      sets: "3", reps: "10/side",     weight: "plate",          note: "⚡ Into after Roll Outs — 2-3 rounds total." },
    ],
  },
];

const YOGA_ROUTINES = [
  {
    id: "yoga-full-body-stretch",
    category: "Stretches",
    name: "Full Body Reset",
    emoji: "🌿",
    level: "All Levels",
    duration: "25 min",
    color: "#00bcd4",
    bg: "linear-gradient(135deg, #041518 0%, #072228 100%)",
    description: "A complete head-to-toe stretch sequence. Hold each pose 30–60s. Perfect after any workout, on rest days, or before bed to release the day's tension.",
    source: "Women's Health",
    exercises: [
      { name: "Child's Pose",                      sets: "1", reps: "60s",       weight: "", note: "Exhale into the pose. Breathe into your lower back." },
      { name: "Cat-Cow Spine Flexion & Extension",  sets: "1", reps: "10 rounds", weight: "", note: "Inhale = Cow (belly drops). Exhale = Cat (spine rounds)." },
      { name: "Thread the Needle",                  sets: "1", reps: "30s/side",  weight: "", note: "From all fours — slide arm under, shoulder to floor." },
      { name: "Downward Dog",                       sets: "1", reps: "60s",       weight: "", note: "Pedal heels to warm up calves and hamstrings." },
      { name: "Low Lunge (Anjaneyasana)",            sets: "1", reps: "45s/side",  weight: "", note: "Tuck pelvis to deepen the hip flexor stretch." },
      { name: "Pigeon Pose",                        sets: "1", reps: "60s/side",  weight: "", note: "Fold forward to deepen. Use a blanket under the hip if needed." },
      { name: "Seated Forward Fold (Paschimottanasana)", sets: "1", reps: "60s", weight: "", note: "Hinge from hips, not waist. Use a strap if needed." },
      { name: "Supine Twist",                       sets: "1", reps: "45s/side",  weight: "", note: "Both shoulders stay grounded. Look away from the knee." },
      { name: "Bridge Pose",                        sets: "1", reps: "45s",       weight: "", note: "Squeeze glutes, drive knees forward. Release slowly." },
      { name: "Happy Baby (Ananda Balasana)",        sets: "1", reps: "60s",       weight: "", note: "Rock gently side to side to massage the lower back." },
      { name: "Legs Up the Wall (Viparita Karani)",  sets: "1", reps: "3 min",    weight: "", note: "The most restorative finish. Close your eyes and breathe." },
    ],
  },
  {
    id: "yoga-hip-opener",
    category: "Stretches",
    name: "Hip & Lower Body Opener",
    emoji: "🦋",
    level: "Beginner",
    duration: "20 min",
    color: "#00bcd4",
    bg: "linear-gradient(135deg, #041518 0%, #072228 100%)",
    description: "Targets the hips, groin, glutes, and hamstrings — the areas that seize up most from sitting. Great for golfers, runners, and anyone with tight hips.",
    source: "Women's Health",
    exercises: [
      { name: "Reclined Figure Four (Supta Kapotasana)", sets: "1", reps: "60s/side", weight: "", note: "The gentler supine version of Pigeon. Flex top foot to protect the knee." },
      { name: "Low Lunge (Anjaneyasana)",           sets: "1", reps: "60s/side",  weight: "", note: "Tuck pelvis and press hips forward for a deep hip flexor stretch." },
      { name: "Butterfly Pose (Baddha Konasana)",   sets: "1", reps: "90s",       weight: "", note: "Let gravity open the knees — don't press them down." },
      { name: "Pigeon Pose",                        sets: "1", reps: "90s/side",  weight: "", note: "Fold forward and rest forehead on arms for maximum release." },
      { name: "Warrior II (Virabhadrasana II)",     sets: "1", reps: "45s/side",  weight: "", note: "Sink deeper into the front knee each breath." },
      { name: "Triangle Pose (Trikonasana)",        sets: "1", reps: "45s/side",  weight: "", note: "Use a block if you can't reach the floor comfortably." },
      { name: "Seated Spinal Twist (Ardha Matsyendrasana)", sets: "1", reps: "45s/side", weight: "", note: "Sit tall first, then twist. Length before rotation." },
      { name: "Happy Baby (Ananda Balasana)",       sets: "1", reps: "60s",       weight: "", note: "Finish with this to fully release the inner groin and lower back." },
    ],
  },
  {
    id: "yoga-back-relief",
    category: "Stretches",
    name: "Back Relief & Spine",
    emoji: "🏛️",
    level: "All Levels",
    duration: "15 min",
    color: "#00bcd4",
    bg: "linear-gradient(135deg, #041518 0%, #072228 100%)",
    description: "Specifically designed for back tension, stiffness, and lower back pain. Safe for most people — move gently and never force any position.",
    source: "Women's Health",
    exercises: [
      { name: "Cat-Cow Spine Flexion & Extension",  sets: "2", reps: "10 rounds", weight: "", note: "Move slowly — feel each vertebra moving." },
      { name: "Child's Pose",                       sets: "1", reps: "90s",       weight: "", note: "Arms forward. Breathe into the lower back on every inhale." },
      { name: "Thread the Needle",                  sets: "1", reps: "45s/side",  weight: "", note: "Releases the upper and mid back rotation." },
      { name: "Sphinx Pose",                        sets: "2", reps: "60s",       weight: "", note: "Gentle backbend. Mild compression in lower back is normal." },
      { name: "Supine Twist",                       sets: "1", reps: "60s/side",  weight: "", note: "Let gravity do the work — no forcing." },
      { name: "Reclined Figure Four (Supta Kapotasana)", sets: "1", reps: "60s/side", weight: "", note: "Tight glutes are often the cause of lower back pain." },
      { name: "Legs Up the Wall (Viparita Karani)", sets: "1", reps: "5 min",     weight: "", note: "Decompresses the spine and calms the nervous system." },
    ],
  },
  {
    id: "yoga-morning",
    category: "Stretches",
    name: "5-Minute Morning Wake-Up",
    emoji: "☀️",
    level: "All Levels",
    duration: "5 min",
    color: "#00bcd4",
    bg: "linear-gradient(135deg, #041518 0%, #072228 100%)",
    description: "A quick full-body wake-up you can do before coffee. Hold each pose for just 30 seconds. Consistent daily practice creates more change than occasional long sessions.",
    source: "Women's Health",
    exercises: [
      { name: "Cat-Cow Spine Flexion & Extension", sets: "1", reps: "8 rounds",  weight: "", note: "Start slowly and let the spine wake up." },
      { name: "Downward Dog",                      sets: "1", reps: "30s",       weight: "", note: "Pedal the heels and breathe deeply." },
      { name: "Low Lunge (Anjaneyasana)",           sets: "1", reps: "30s/side", weight: "", note: "Counter all that overnight hip flexor shortening." },
      { name: "Standing Forward Fold",              sets: "1", reps: "30s",      weight: "", note: "Gently shake your head yes and no to release neck tension." },
      { name: "Seated Spinal Twist (Ardha Matsyendrasana)", sets: "1", reps: "30s/side", weight: "", note: "Sit tall, breathe, rotate a little more on each exhale." },
    ],
  },
];

const ROUTINES_ALL = [...DAVE_ROUTINES, ...YOGA_ROUTINES, ...BW_ROUTINES, ...GOLF_ROUTINES, ...FFG_ROUTINES,
  {
    id: "flexibility-beginner",
    category: "Flexibility",
    name: "Morning Mobility Flow",
    emoji: "🧘",
    level: "Beginner",
    duration: "20 min",
    color: "#6c63ff",
    bg: "linear-gradient(135deg, #1a1830 0%, #2a2050 100%)",
    description: "A gentle full-body stretch to wake up your joints and improve range of motion.",
    exercises: [
      { name: "Cat-Cow Stretch",      sets: "3", reps: "10",          weight: "", note: "Slow, controlled movement" },
      { name: "Child's Pose",         sets: "3", reps: "30s hold",    weight: "", note: "Breathe deeply into lower back" },
      { name: "Hip Flexor Stretch",   sets: "2", reps: "45s/side",    weight: "", note: "Keep hips squared forward" },
      { name: "Thoracic Rotation",    sets: "2", reps: "10/side",     weight: "", note: "Rotate from mid-back, not neck" },
      { name: "Standing Forward Fold",sets: "3", reps: "30s hold",    weight: "", note: "Soft bend in knees is fine" },
      { name: "Pigeon Pose",          sets: "2", reps: "60s/side",    weight: "", note: "Great for hip flexors & glutes" },
    ],
  },
  {
    id: "flexibility-advanced",
    category: "Flexibility",
    name: "Deep Stretch & Splits Prep",
    emoji: "🤸",
    level: "Advanced",
    duration: "35 min",
    color: "#6c63ff",
    bg: "linear-gradient(135deg, #1a1830 0%, #2a2050 100%)",
    description: "Targeted deep stretching to build serious flexibility and work toward the splits.",
    exercises: [
      { name: "Dynamic Leg Swings",   sets: "3", reps: "15/side",     weight: "", note: "Front-to-back and side-to-side" },
      { name: "Pancake Stretch",      sets: "3", reps: "60s hold",    weight: "", note: "Walk hands forward between legs" },
      { name: "Lizard Lunge",         sets: "3", reps: "90s/side",    weight: "", note: "Lower front knee, open hips" },
      { name: "Straddle Side Stretch",sets: "3", reps: "45s/side",    weight: "", note: "Reach over extended leg" },
      { name: "Half Splits",          sets: "3", reps: "60s/side",    weight: "", note: "Flex foot, hinge from hips" },
      { name: "Full Splits Hold",     sets: "2", reps: "90s/side",    weight: "", note: "Use blocks under hips if needed" },
    ],
  },
  {
    id: "strength-upper",
    category: "Strength",
    name: "Upper Body Power",
    emoji: "💪",
    level: "Intermediate",
    duration: "45 min",
    color: "#f5a623",
    bg: "linear-gradient(135deg, #1e1608 0%, #2e2010 100%)",
    description: "Compound-focused upper body session to build chest, back, and shoulder strength.",
    exercises: [
      { name: "Barbell Bench Press",   sets: "4", reps: "6",  weight: "70kg", note: "3s down, explode up" },
      { name: "Bent-Over Barbell Row", sets: "4", reps: "8",  weight: "60kg", note: "Lead with elbows, chest up" },
      { name: "Overhead Press",        sets: "3", reps: "8",  weight: "45kg", note: "Brace core, full lockout" },
      { name: "Weighted Pull-Ups",     sets: "3", reps: "6",  weight: "10kg", note: "Full hang at bottom" },
      { name: "Incline Dumbbell Press",sets: "3", reps: "10", weight: "28kg", note: "45° angle, controlled descent" },
      { name: "Cable Face Pull",       sets: "3", reps: "15", weight: "20kg", note: "External rotation at top" },
    ],
  },
  {
    id: "strength-lower",
    category: "Strength",
    name: "Lower Body Strength",
    emoji: "🦵",
    level: "Intermediate",
    duration: "50 min",
    color: "#f5a623",
    bg: "linear-gradient(135deg, #1e1608 0%, #2e2010 100%)",
    description: "Heavy leg day covering quads, hamstrings, glutes, and calves.",
    exercises: [
      { name: "Barbell Back Squat",  sets: "5", reps: "5",      weight: "80kg",  note: "Hip crease below parallel" },
      { name: "Romanian Deadlift",   sets: "4", reps: "8",      weight: "70kg",  note: "Push hips back, not down" },
      { name: "Leg Press",           sets: "3", reps: "12",     weight: "120kg", note: "Full range, don't lock knees" },
      { name: "Walking Lunges",      sets: "3", reps: "12/leg", weight: "20kg",  note: "Dumbbells at sides" },
      { name: "Nordic Curl",         sets: "3", reps: "6",      weight: "",      note: "Slow eccentric, 4-5s down" },
      { name: "Standing Calf Raise", sets: "4", reps: "20",     weight: "40kg",  note: "Full stretch at bottom" },
    ],
  },
  {
    id: "hiit-full",
    category: "HIIT",
    name: "Fat-Burning HIIT Blast",
    emoji: "🔥",
    level: "Intermediate",
    duration: "30 min",
    color: "#ff4d4d",
    bg: "linear-gradient(135deg, #1e0808 0%, #2e1010 100%)",
    description: "High-intensity intervals to torch calories and build cardiovascular endurance.",
    exercises: [
      { name: "Burpees",               sets: "4", reps: "40s on / 20s off", weight: "", note: "Full extension at jump" },
      { name: "Jump Squats",           sets: "4", reps: "40s on / 20s off", weight: "", note: "Land softly, absorb through hips" },
      { name: "Mountain Climbers",     sets: "4", reps: "40s on / 20s off", weight: "", note: "Keep hips level, fast knees" },
      { name: "Push-Up to T-Rotation", sets: "4", reps: "40s on / 20s off", weight: "", note: "Rotate hip to ceiling" },
      { name: "Box Jumps",             sets: "4", reps: "40s on / 20s off", weight: "", note: "Step down to protect knees" },
      { name: "Sprint in Place",       sets: "4", reps: "40s on / 20s off", weight: "", note: "Drive knees up, pump arms" },
    ],
  },
  {
    id: "hiit-beginner",
    category: "HIIT",
    name: "Beginner Cardio Intervals",
    emoji: "⚡",
    level: "Beginner",
    duration: "20 min",
    color: "#ff4d4d",
    bg: "linear-gradient(135deg, #1e0808 0%, #2e1010 100%)",
    description: "Low-impact intervals to build your cardio base without overwhelming your joints.",
    exercises: [
      { name: "Marching in Place",       sets: "3", reps: "45s on / 15s off", weight: "", note: "Pump arms, lift knees" },
      { name: "Step Touch",              sets: "3", reps: "45s on / 15s off", weight: "", note: "Stay light on feet" },
      { name: "Squat to Heel Raise",     sets: "3", reps: "45s on / 15s off", weight: "", note: "Rise up on toes at top" },
      { name: "Low-Impact Skaters",      sets: "3", reps: "45s on / 15s off", weight: "", note: "Wide side steps, no jump" },
      { name: "Standing Bicycle Crunch", sets: "3", reps: "45s on / 15s off", weight: "", note: "Elbow to opposite knee" },
    ],
  },
  {
    id: "core-strength",
    category: "Core",
    name: "Core & Abs Sculpt",
    emoji: "🎯",
    level: "Intermediate",
    duration: "25 min",
    color: "#00c9a7",
    bg: "linear-gradient(135deg, #061a17 0%, #0a2820 100%)",
    description: "A targeted core session mixing stability, anti-rotation, and direct ab work.",
    exercises: [
      { name: "Dead Bug",           sets: "4", reps: "10/side", weight: "",     note: "Lower back flat on floor" },
      { name: "Plank",              sets: "3", reps: "60s",     weight: "",     note: "Squeeze glutes and core" },
      { name: "Cable Woodchop",     sets: "3", reps: "12/side", weight: "15kg", note: "Pivot feet, rotate from hips" },
      { name: "Hanging Knee Raise", sets: "3", reps: "15",      weight: "",     note: "No swinging, slow down" },
      { name: "Ab Wheel Rollout",   sets: "3", reps: "10",      weight: "",     note: "Fully extend, pull back with abs" },
      { name: "Side Plank",         sets: "3", reps: "45s/side",weight: "",     note: "Hip up, don't sag" },
    ],
  },
  {
    id: "yoga-flow",
    category: "Yoga",
    name: "Vinyasa Power Flow",
    emoji: "🌊",
    level: "Intermediate",
    duration: "40 min",
    color: "#c17fe0",
    bg: "linear-gradient(135deg, #160a20 0%, #221030 100%)",
    description: "A dynamic yoga sequence linking breath to movement for strength and mindfulness.",
    exercises: [
      { name: "Sun Salutation A",         sets: "5", reps: "full rounds",       weight: "", note: "Inhale up, exhale fold" },
      { name: "Warrior I → II → III",     sets: "3", reps: "5 breaths ea/side", weight: "", note: "Ground through back foot" },
      { name: "Crow Pose",                sets: "3", reps: "30s hold",           weight: "", note: "Knees on upper triceps" },
      { name: "Boat Pose",                sets: "3", reps: "5 breaths",          weight: "", note: "Lean back, lift legs together" },
      { name: "Wheel Pose",               sets: "3", reps: "5 breaths",          weight: "", note: "Push through palms and feet" },
      { name: "Seated Forward Fold",      sets: "3", reps: "60s",                weight: "", note: "Hinge at hips, not waist" },
    ],
  },
  {
    id: "recovery",
    category: "Recovery",
    name: "Rest Day Recovery",
    emoji: "💆",
    level: "All Levels",
    duration: "30 min",
    color: "#4ecdc4",
    bg: "linear-gradient(135deg, #061816 0%, #0d2422 100%)",
    description: "Foam rolling and gentle stretching to reduce soreness and speed up recovery.",
    exercises: [
      { name: "Foam Roll Quads",      sets: "2", reps: "60s/leg",  weight: "", note: "Pause on tender spots 20-30s" },
      { name: "Foam Roll IT Band",    sets: "2", reps: "60s/side", weight: "", note: "Slow, deliberate rolls" },
      { name: "Foam Roll Upper Back", sets: "2", reps: "60s",      weight: "", note: "Arms crossed on chest" },
      { name: "Supine Twist",         sets: "2", reps: "60s/side", weight: "", note: "Both shoulders on the floor" },
      { name: "Figure 4 Stretch",     sets: "2", reps: "60s/side", weight: "", note: "Flex top foot, pull closer" },
      { name: "Legs Up The Wall",     sets: "1", reps: "5 min",    weight: "", note: "Great for circulation and calm" },
    ],
  },
];

// Keep ROUTINES as alias
const ROUTINES = ROUTINES_ALL;

const CATEGORIES = ["All", "Dave's", "Stretches", "Golf", "Bodyweight", ...Array.from(new Set(ROUTINES_ALL.filter(r=>!["Golf","Bodyweight","Dave's","Stretches"].includes(r.category)).map(r => r.category)))];

// ── Icons ──────────────────────────────────────────────────────────────────────
const Icon = {
  home:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  plus:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>,
  chart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 20h18M5 20V10M9 20V6M13 20V12M17 20V4"/></svg>,
  routines: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h2M14 14h2M8 18h2M14 18h2"/></svg>,
  programs: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
  stretch: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.686 2 6 4.686 6 8c0 2.122 1.046 3.996 2.647 5.148L6 21h12l-2.647-7.852C16.954 11.996 18 10.122 18 8c0-3.314-2.686-6-6-6z"/><path d="M9 14.5c1-.5 2-.5 3 0s2 .5 3 0"/></svg>,
  golf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="18" r="3"/><path d="M12 15V3"/><path d="M12 3l5 3.5"/></svg>,
  cardio: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h3l3-8 4 16 3-8h5"/></svg>,
  cable: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="4" height="18" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/><path d="M7 8h10M7 12h10M7 16h10"/><circle cx="12" cy="12" r="2.5"/></svg>,
  stats: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 20h18M5 20V10M9 20V6M13 20V12M17 20V4"/></svg>,
  recovery: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C9 2 6 5 6 8c0 2 1 3.5 2.5 4.5S11 14 11 16v1h2v-1c0-2 .5-3 2-3.5S18 10 18 8c0-3-3-6-6-6z"/><path d="M9 21h6M10 18h4"/></svg>,
  generate: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.8 5.5H20l-4.9 3.6 1.8 5.5L12 14l-4.9 3.6 1.8-5.5L4 8.5h6.2z"/><path d="M19 19l2 2M5 5l2 2" strokeLinecap="round"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  bot:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M8 8V5a4 4 0 018 0v3"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/><path d="M9 18s1 1.5 3 1.5 3-1.5 3-1.5"/></svg>,
  send:     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  trash:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>,
  back:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>,
  flame:    <svg viewBox="0 0 24 24" fill="#c8f135"><path d="M12 2C8 7 6 10 6 13a6 6 0 0012 0c0-3-2-6-6-11z"/></svg>,
  clock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>,
};

// ── Storage ────────────────────────────────────────────────────────────────────
const useStorage = (key, init) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const save = v => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, save];
};

// ── API key helper ─────────────────────────────────────────────────────────────
const getApiKey = () => {
  try { return localStorage.getItem("fittrack_api_key") || ""; } catch { return ""; }
};

// ── AI helper ──────────────────────────────────────────────────────────────────
async function askAI(messages, workouts) {
  const key = getApiKey();
  if (!key) throw new Error("NO_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are FitAI, a knowledgeable, motivating personal trainer inside a workout tracking app. The user's recent workout history: ${JSON.stringify(workouts.slice(-10))}. Be concise (2-4 sentences), practical, and encouraging. Use workout data when relevant.`,
      messages,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.find(b => b.type === "text")?.text || "Sorry, couldn't connect.";
}

// ═════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═════════════════════════════════════════════════════════════════════════════

// ── Workout Share Card ────────────────────────────────────────────────────────
function WorkoutCard({ workout, onClose }) {
  const cardRef = useRef(null);
  const [copying, setCopying] = useState(false);

  const totalVol = workout.exercises.reduce((s,e) => {
    const kg = parseFloat(e.weight)||0;
    return s + (parseFloat(e.sets)||0)*(parseFloat(e.reps)||0)*kg;
  }, 0);

  // Download as PNG via html-to-image approach using canvas
  const downloadCard = async () => {
    setCopying(true);
    try {
      // Build a standalone HTML string and open in a new tab for screenshot
      const exRows = workout.exercises.slice(0,8).map(e =>
        `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #1e1e2e;font-size:12px">
          <span style="color:#c8c8d8">${e.name}</span>
          <span style="color:#c8f135;font-weight:700">${e.sets||'—'}×${e.reps||'—'}${e.weight?' @ '+e.weight+'kg':''}</span>
        </div>`
      ).join('');
      const more = workout.exercises.length > 8 ? `<div style="font-size:11px;color:#555570;padding-top:6px">+${workout.exercises.length-8} more exercises</div>` : '';
      const volLine = totalVol > 0 ? `<div style="font-size:11px;color:#f5a623;margin-top:4px">Total volume: ${Math.round(totalVol).toLocaleString()}kg</div>` : '';
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'DM Sans',sans-serif}</style>
        </head><body>
        <div style="width:360px;background:#0a0a0f;border-radius:24px;overflow:hidden;border:1.5px solid #1e1e2e">
          <div style="padding:24px;background:linear-gradient(135deg,#0d1f00,#1a3800)">
            <div style="font-size:10px;color:#c8f135;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">FITTRACK · ${new Date(workout.date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div>
            <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#e8e8f0;letter-spacing:.04em;line-height:1.1;margin-bottom:8px">${workout.name.toUpperCase()}</div>
            <div style="display:flex;gap:12px;font-size:11px;color:#888899">
              <span>💪 ${workout.exercises.length} exercises</span>
              <span>📂 ${workout.group}</span>
              ${totalVol > 0 ? `<span>⚖️ ${Math.round(totalVol).toLocaleString()}kg volume</span>` : ''}
            </div>
          </div>
          <div style="padding:16px 24px 24px">
            <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#555570;margin-bottom:10px">EXERCISES</div>
            ${exRows}${more}${volLine}
            <div style="margin-top:18px;padding-top:14px;border-top:1px solid #1e1e2e;display:flex;justify-content:space-between;align-items:center">
              <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#c8f135;letter-spacing:.06em">FITTRACK</div>
              <div style="font-size:10px;color:#333350">Built with FitTrack</div>
            </div>
          </div>
        </div>
        </body></html>`;
      const blob = new Blob([html], {type:'text/html'});
      const url = URL.createObjectURL(blob);
      window.open(url,'_blank');
    } catch(e) { console.error(e); }
    setCopying(false);
  };

  // Native share if available
  const shareText = () => {
    const lines = [
      `💪 ${workout.name}`,
      `📅 ${new Date(workout.date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'})}`,
      '',
      ...workout.exercises.slice(0,8).map(e => `• ${e.name}${e.sets?' — '+e.sets+'×'+e.reps:''}${e.weight?' @ '+e.weight+'kg':''}`),
      workout.exercises.length > 8 ? `(+${workout.exercises.length-8} more)` : '',
      '',
      totalVol > 0 ? `Total volume: ${Math.round(totalVol).toLocaleString()}kg` : '',
      '',
      'Logged with FitTrack 💪',
    ].filter(l => l !== undefined).join('\n');

    if (navigator.share) {
      navigator.share({ title: workout.name, text: lines }).catch(()=>{});
    } else {
      navigator.clipboard.writeText(lines).then(() => {
        setCopying(true); setTimeout(()=>setCopying(false), 2000);
      });
    }
  };

  return (
    <div className="share-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ width:"100%", maxWidth:390, display:"flex", flexDirection:"column", gap:16, alignItems:"center" }}>

        {/* The card preview */}
        <div className="workout-card" ref={cardRef}>
          <div className="workout-card-header">
            <div style={{ fontSize:9, color:"#c8f135", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>
              FITTRACK · {new Date(workout.date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}
            </div>
            <div className="ft-heading" style={{ fontSize:30, lineHeight:1.1, marginBottom:10 }}>{workout.name.toUpperCase()}</div>
            <div style={{ display:"flex", gap:12, fontSize:11, color:"#888899", flexWrap:"wrap" }}>
              <span>💪 {workout.exercises.length} exercises</span>
              <span>📂 {workout.group}</span>
              {totalVol > 0 && <span>⚖️ {Math.round(totalVol).toLocaleString()}kg vol</span>}
            </div>
          </div>
          <div className="workout-card-body">
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555570", marginBottom:10 }}>Exercises</div>
            {workout.exercises.slice(0,8).map((e,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:i<Math.min(workout.exercises.length,8)-1?"1px solid #1a1a2e":"none" }}>
                <span style={{ fontSize:12, color:"#c8c8d8" }}>{e.name}</span>
                <span style={{ fontSize:11, color:"#c8f135", fontWeight:700 }}>
                  {e.sets&&e.reps?`${e.sets}×${e.reps}`:''}
                  {e.weight?` @ ${e.weight}kg`:''}
                </span>
              </div>
            ))}
            {workout.exercises.length > 8 && (
              <div style={{ fontSize:11, color:"#555570", paddingTop:6 }}>+{workout.exercises.length-8} more</div>
            )}
            <div style={{ marginTop:16, paddingTop:12, borderTop:"1px solid #1a1a2e", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div className="ft-heading" style={{ fontSize:16, color:"#c8f135" }}>FITTRACK</div>
              <div style={{ fontSize:9, color:"#333350" }}>fittrack.app</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:10, width:"100%" }}>
          <button onClick={shareText}
            style={{ flex:2, padding:"14px", borderRadius:12, border:"none", cursor:"pointer",
              background:"#c8f135", color:"#0a0a0f", fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:".08em" }}>
            {copying ? "✓ COPIED!" : navigator.share ? "⬆️ SHARE" : "📋 COPY TEXT"}
          </button>
          <button onClick={downloadCard}
            style={{ flex:1, padding:"14px", borderRadius:12, border:"1.5px solid #1e1e2e", cursor:"pointer",
              background:"#13131e", color:"#888899", fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:".08em" }}>
            🖼️
          </button>
          <button onClick={onClose}
            style={{ flex:1, padding:"14px", borderRadius:12, border:"1.5px solid #1e1e2e", cursor:"pointer",
              background:"transparent", color:"#555570", fontFamily:"'Bebas Neue'", fontSize:18 }}>
            ✕
          </button>
        </div>
        <div style={{ fontSize:11, color:"#444458" }}>🖼️ opens a printable card in a new tab · Share copies text</div>
      </div>
    </div>
  );
}

function HomeScreen({ workouts }) {
  const [shareWorkout, setShareWorkout] = useState(null);
  const totalExercises = workouts.reduce((s, w) => s + w.exercises.length, 0);
  const weekly = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const count = workouts.filter(w => w.date === key).reduce((s, w) => s + w.exercises.length, 0);
    return { day: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], count };
  });
  const recent = [...workouts].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);

  return (
    <div className="ft-screen ft-slide-up">
      {shareWorkout && <WorkoutCard workout={shareWorkout} onClose={()=>setShareWorkout(null)}/>}
      <div style={{ marginBottom: 28 }}>
        <div className="ft-tag" style={{ marginBottom: 8 }}>Today's Overview</div>
        <h1 className="ft-heading" style={{ fontSize: 42, lineHeight: 1 }}>LET'S<br/>GET IT</h1>
      </div>
      <div className="ft-stat-grid">
        <div className="ft-stat-card"><div className="ft-stat-label">Sessions</div><span className="ft-stat-val">{workouts.length}</span></div>
        <div className="ft-stat-card"><div className="ft-stat-label">Exercises</div><span className="ft-stat-val">{totalExercises}</span></div>
      </div>
      <div className="ft-card">
        <div style={{ fontSize: 12, color: "#555570", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Weekly Activity</div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={weekly} barSize={18}>
            <XAxis dataKey="day" tick={{ fill: "#555570", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Bar dataKey="count" fill="#c8f135" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {recent.length > 0 ? (
        <div>
          <div style={{ fontSize: 12, color: "#555570", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Recent</div>
          {recent.map(w => (
            <div key={w.id} className="ft-card" style={{ padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: ".06em" }}>{w.name}</div>
                  <div style={{ fontSize: 12, color: "#555570", marginTop: 2 }}>{fmtDate(w.date)} · {w.exercises.length} exercises</div>
                </div>
                <button onClick={() => setShareWorkout(w)}
                  style={{ background:"none", border:"1px solid #1e1e2e", borderRadius:8, cursor:"pointer",
                    color:"#555570", padding:"6px 10px", fontSize:14, flexShrink:0, marginLeft:10,
                    transition:"all .2s" }}
                  title="Share workout card">
                  ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#444458" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💪</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22 }}>No workouts yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Tap Routines to get started</div>
        </div>
      )}
    </div>
  );
}

// ── EXERCISE LIBRARY ─────────────────────────────────────────────────────────
function ExerciseLibraryView() {
  const [search, setSearch] = useState("");
  const [openEx, setOpenEx] = useState(null);
  const [muscleFilter, setMuscleFilter] = useState("All");

  const allExercises = Object.entries(TUTORIALS).map(([name, data]) => ({ name, ...data }));

  // Derive muscle group tags from muscles string
  const MUSCLE_FILTERS = ["All", "Chest", "Back", "Shoulders", "Core", "Legs", "Glutes", "Arms", "Stretches"];
  const matchesMuscle = (muscles, filter) => {
    if (filter === "All") return true;
    const m = muscles.toLowerCase();
    if (filter === "Chest") return m.includes("chest") || m.includes("pec");
    if (filter === "Back") return m.includes("lat") || m.includes("back") || m.includes("trap") || m.includes("rhom") || m.includes("row");
    if (filter === "Shoulders") return m.includes("delt") || m.includes("shoulder") || m.includes("rotator");
    if (filter === "Core") return m.includes("core") || m.includes("oblique") || m.includes("ab") || m.includes("plank");
    if (filter === "Legs") return m.includes("quad") || m.includes("hamstring") || m.includes("calf") || m.includes("squat");
    if (filter === "Glutes") return m.includes("glute") || m.includes("hip") || m.includes("bridge") || m.includes("piriformis");
    if (filter === "Arms") return m.includes("bicep") || m.includes("tricep") || m.includes("forearm");
    if (filter === "Stretches") return m.includes("stretch") || m.includes("spine") || m.includes("fascia") || m.includes("passive") || m.includes("thoracic") || m.includes("groin") || m.includes("nervous");
    return true;
  };

  const filtered = allExercises
    .filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()) || ex.muscles.toLowerCase().includes(search.toLowerCase()))
    .filter(ex => matchesMuscle(ex.muscles, muscleFilter))
    .sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div>
      {/* Search */}
      <input className="ft-input" placeholder="🔍  Search exercises or muscles…" value={search}
        onChange={e => setSearch(e.target.value)} style={{ marginBottom: 12 }} />

      {/* Muscle filter pills */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
        {MUSCLE_FILTERS.map(f => (
          <button key={f} onClick={() => setMuscleFilter(f)}
            style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 100, border: "1.5px solid", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans'", transition: "all .2s",
              background: muscleFilter === f ? "#c8f135" : "transparent",
              borderColor: muscleFilter === f ? "#c8f135" : "#1e1e2e",
              color: muscleFilter === f ? "#0a0a0f" : "#555570" }}>{f}</button>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "#555570", marginBottom: 12 }}>{filtered.length} exercises</div>

      {filtered.map(ex => {
        const isOpen = openEx === ex.name;
        return (
          <div key={ex.name} className="ex-lib-item">
            <div className="ex-lib-header" onClick={() => setOpenEx(isOpen ? null : ex.name)}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#e8e8f0", marginBottom: 3 }}>{ex.name}</div>
                <div style={{ fontSize: 10, color: "#888899" }}>{ex.muscles.split(",").slice(0,2).join(", ")}{ex.muscles.split(",").length > 2 ? " +" + (ex.muscles.split(",").length - 2) + " more" : ""}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555570" strokeWidth="2"
                style={{ transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            {isOpen && (
              <div className="ex-lib-body">
                <div className="muscle-tag">💪 {ex.muscles}</div>
                <div style={{ fontSize: 12, color: "#c8c8d8", lineHeight: 1.65, marginBottom: 10 }}>{ex.how}</div>
                <div style={{ fontSize: 11, color: "#888899", background: "rgba(200,241,53,.06)", padding: "8px 10px", borderRadius: 8 }}>
                  <span style={{ color: "#c8f135", fontWeight: 600 }}>💡 </span>{ex.tip}
                </div>
                {(() => { const ha = getHomeAlt(ex.name); return ha ? (
                  <div className="home-alt-card">
                    <div className="home-alt-equip">🏠 {ha.equip}</div>
                    <div style={{ fontSize: 11, color: "#b8e6cc", lineHeight: 1.5 }}>{ha.alt}</div>
                  </div>
                ) : null; })()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RoutinesScreen({ onStartRoutine }) {
  const [view, setView] = useState("routines"); // "routines" | "library"
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = cat === "All" ? ROUTINES : ROUTINES.filter(r => r.category === cat);

  const levelColor = lvl => {
    if (lvl === "Beginner" || lvl === "All Levels") return "#c8f135";
    if (lvl === "Intermediate") return "#f5a623";
    return "#ff4d4d";
  };

  if (selected) return (
    <div className="ft-screen ft-slide-up">
      <button onClick={() => setSelected(null)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#c8f135", display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 14, fontFamily: "'DM Sans'" }}>
        {Icon.back} Back to routines
      </button>
      <div style={{ background: selected.bg, borderRadius: 20, padding: "24px 20px", marginBottom: 20, border: `1.5px solid ${selected.color}33` }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>{selected.emoji}</div>
        <div className="ft-tag" style={{ background: `${selected.color}22`, color: selected.color, marginBottom: 10 }}>{selected.category}</div>
        <h2 className="ft-heading" style={{ fontSize: 32, lineHeight: 1.1, marginBottom: 10 }}>{selected.name.toUpperCase()}</h2>
        <p style={{ fontSize: 13, color: "#aaa8c0", lineHeight: 1.6, marginBottom: 16 }}>{selected.description}</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888899" }}>
            <span style={{ width: 14, height: 14, display: "inline-flex" }}>{Icon.clock}</span> {selected.duration}
          </div>
          <div className="diff-pill" style={{ background: `${levelColor(selected.level)}22`, color: levelColor(selected.level) }}>{selected.level}</div>
          <div className="diff-pill" style={{ background: "rgba(255,255,255,.07)", color: "#888899" }}>{selected.exercises.length} exercises</div>
          {selected.source && <div className="diff-pill" style={{ background: "rgba(200,241,53,.1)", color: "#c8f135" }}>📺 {selected.source}</div>}
        </div>
      </div>
      <div className="ft-card">
        <div style={{ fontSize: 12, color: "#555570", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Exercise List</div>
        {selected.exercises.map((ex, i) => (
          <div key={i} className="exercise-step">
            <div className="step-num">{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{ex.name}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#c8f135", marginBottom: 4 }}>
                {ex.sets && <span>{ex.sets} sets</span>}
                {ex.reps && <span>· {ex.reps}</span>}
                {ex.weight && <span>· {ex.weight}</span>}
              </div>
              {ex.note && <div style={{ fontSize: 12, color: "#555570", fontStyle: "italic" }}>{ex.note}</div>}
            </div>
          </div>
        ))}
      </div>
      <button className="ft-btn" onClick={() => onStartRoutine(selected)}>START THIS WORKOUT</button>
    </div>
  );

  return (
    <div className="ft-screen ft-slide-up">
      <div className="ft-tag" style={{ marginBottom: 8 }}>Workout Library</div>
      <h1 className="ft-heading" style={{ fontSize: 36, marginBottom: 16 }}>{view === "routines" ? "ROUTINES" : "EXERCISES"}</h1>

      {/* View toggle */}
      <div className="view-toggle" style={{ marginBottom: 16 }}>
        <button className={`view-toggle-btn ${view==="routines"?"active":""}`} onClick={()=>setView("routines")} style={{ fontFamily:"'DM Sans'" }}>
          📋 Routines ({ROUTINES.length})
        </button>
        <button className={`view-toggle-btn ${view==="library"?"active":""}`} onClick={()=>setView("library")} style={{ fontFamily:"'DM Sans'" }}>
          📚 Exercise Library ({Object.keys(TUTORIALS).length})
        </button>
      </div>

      {view === "library" ? <ExerciseLibraryView /> : (
        <>
          {/* Category filter */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 100, border: "1.5px solid", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans'", transition: "all .2s",
                  background: cat === c ? "#c8f135" : "transparent", borderColor: cat === c ? "#c8f135" : "#1e1e2e", color: cat === c ? "#0a0a0f" : "#555570" }}>{c}</button>
            ))}
          </div>
          {filtered.map(r => (
            <div key={r.id} className="routine-card" style={{ background: r.bg, border: `1.5px solid ${r.color}33` }} onClick={() => setSelected(r)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 36 }}>{r.emoji}</span>
                <div className="diff-pill" style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.55)" }}>{r.level}</div>
              </div>
              <div className="routine-badge" style={{ background: `${r.color}22`, color: r.color, marginBottom: 8 }}>{r.category}</div>
              <div className="ft-heading" style={{ fontSize: 22, marginBottom: 6 }}>{r.name.toUpperCase()}</div>
              <div style={{ fontSize: 12, color: "#888899", lineHeight: 1.5, marginBottom: 14 }}>{r.description}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#666680" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 13, height: 13, display: "inline-flex" }}>{Icon.clock}</span>{r.duration}
                  </span>
                  <span>{r.exercises.length} exercises</span>
                </div>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {Icon.check}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── REST TIMER (global floating component) ────────────────────────────────────
function RestTimer({ visible, onClose }) {
  const PRESETS = [30, 60, 90, 120, 180];
  const [selected, setSelected] = useState(90);
  const [custom, setCustom] = useState("");
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [done, setDone] = useState(false);

  const duration = custom ? parseInt(custom) || 90 : selected;
  const progress = running || done ? (duration - timeLeft) / duration : 0;
  const circ = 2 * Math.PI * 54;

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) { setRunning(false); setDone(true); return; }
    const id = setInterval(() => setTimeLeft(t => { if (t <= 1) { setRunning(false); setDone(true); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, [running, timeLeft]);

  const start = () => { setTimeLeft(duration); setDone(false); setRunning(true); };
  const reset = () => { setRunning(false); setDone(false); setTimeLeft(duration); };
  const pickPreset = (s) => { setSelected(s); setCustom(""); setRunning(false); setDone(false); setTimeLeft(s); };

  if (!visible) return null;

  return (
    <div className="timer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:"100%", maxWidth:380, padding:"0 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", width:"100%", alignItems:"center" }}>
          <div className="ft-heading" style={{ fontSize:28, letterSpacing:".06em" }}>REST TIMER</div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#555570", fontSize:22, lineHeight:1 }}>✕</button>
        </div>

        {/* Ring */}
        <div style={{ position:"relative", width:170, height:170 }}>
          <svg width="170" height="170" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none" stroke="#1a1a2e" strokeWidth="8"/>
            <circle cx="64" cy="64" r="54" fill="none"
              stroke={done ? "#c8f135" : "#6c63ff"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              style={{ transform:"rotate(-90deg)", transformOrigin:"center", transition:"stroke-dashoffset .9s linear, stroke .3s" }}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            {done ? (
              <div style={{ fontSize:42, lineHeight:1 }}>✅</div>
            ) : (
              <>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:52, color:"#e8e8f0", lineHeight:1 }}>
                  {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}
                </div>
                <div style={{ fontSize:11, color:"#555570", letterSpacing:".08em", textTransform:"uppercase" }}>
                  {running ? "resting" : "set timer"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Presets */}
        <div style={{ display:"flex", gap:8, width:"100%" }}>
          {PRESETS.map(s => (
            <button key={s} className={`timer-preset ${!custom && selected===s ? "active" : ""}`}
              onClick={() => pickPreset(s)}>
              {s < 60 ? `${s}s` : `${s/60}m`}
            </button>
          ))}
        </div>

        {/* Custom */}
        <div style={{ display:"flex", gap:10, width:"100%", alignItems:"center" }}>
          <input className="ft-input" type="number" placeholder="Custom seconds…" value={custom}
            onChange={e => { setCustom(e.target.value); setRunning(false); setDone(false); setTimeLeft(parseInt(e.target.value)||0); }}
            style={{ flex:1 }}/>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:12, width:"100%" }}>
          {!running && !done && (
            <button className="ft-btn" onClick={start} disabled={duration <= 0}
              style={{ flex:2, background:"#6c63ff", color:"#fff" }}>▶  START</button>
          )}
          {running && (
            <button className="ft-btn" onClick={() => setRunning(false)}
              style={{ flex:2, background:"transparent", color:"#6c63ff", border:"1.5px solid #6c63ff" }}>⏸  PAUSE</button>
          )}
          {(running || done) && (
            <button className="ft-btn" onClick={reset}
              style={{ flex:1, background:"transparent", color:"#555570", border:"1.5px solid #1e1e2e" }}>↺ RESET</button>
          )}
        </div>
      </div>
    </div>
  );
}

// Superset colour palette
const SS_COLORS = ["#c8f135","#6c63ff","#f5a623","#ff6b6b","#4ecdc4","#c17fe0","#38b87c","#ff9800"];

function LogScreen({ onSave, prefill }) {
  const [name, setName] = useState(prefill?.name || "");
  const [group, setGroup] = useState(prefill?.group || "Chest");
  // Each exercise now carries an optional ssGroup (null | 0..7) to mark superset membership
  const [exercises, setExercises] = useState(
    prefill?.exercises?.length
      ? prefill.exercises.map(e => ({ ssGroup: null, ...e }))
      : [{ name:"", sets:"", reps:"", weight:"", ssGroup:null }]
  );
  const [saved, setSaved] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [ssCounter, setSsCounter] = useState(0); // next colour index

  const addEx = () => setExercises(e => [...e, { name:"", sets:"", reps:"", weight:"", ssGroup:null }]);
  const removeEx = i => setExercises(e => e.filter((_,j) => j !== i));
  const updateEx = (i, f, v) => setExercises(e => e.map((ex,j) => j===i ? {...ex, [f]:v} : ex));

  // Mark two adjacent exercises as a superset. If already in one, remove them.
  const toggleSuperset = (i) => {
    const ex = exercises[i];
    const next = exercises[i+1];
    if (!next) return;
    if (ex.ssGroup !== null && ex.ssGroup === next.ssGroup) {
      // un-link — clear ssGroup from both
      setExercises(e => e.map((x,j) => (j===i||j===i+1) ? {...x, ssGroup:null} : x));
    } else {
      // link — assign new colour group
      const grp = ssCounter % SS_COLORS.length;
      setSsCounter(c => c+1);
      setExercises(e => e.map((x,j) => (j===i||j===i+1) ? {...x, ssGroup:grp} : x));
    }
  };

  const handleSave = () => {
    const valid = exercises.filter(e => e.name.trim());
    if (!name.trim() || !valid.length) return;
    onSave({ id:Date.now(), name:name.trim(), group, date:today(), exercises:valid });
    setSaved(true);
    setTimeout(() => {
      setSaved(false); setName(""); setGroup("Chest");
      setExercises([{ name:"", sets:"", reps:"", weight:"", ssGroup:null }]);
      setSsCounter(0);
    }, 1800);
  };

  if (saved) return (
    <div className="ft-screen" style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
      <div style={{ fontSize:72 }}>✅</div>
      <div className="ft-heading" style={{ fontSize:36, marginTop:16, textAlign:"center" }}>WORKOUT SAVED!</div>
      <div style={{ color:"#555570", marginTop:8 }}>Keep crushing it.</div>
    </div>
  );

  // Build display list — consecutive same-ssGroup exercises are visually grouped
  const renderExercises = () => {
    const rows = [];
    let i = 0;
    while (i < exercises.length) {
      const ex = exercises[i];
      const ssG = ex.ssGroup;
      // Is this the start of a superset pair?
      if (ssG !== null && exercises[i+1]?.ssGroup === ssG) {
        const color = SS_COLORS[ssG % SS_COLORS.length];
        rows.push(
          <div key={`ss-${i}`} className="ss-group" style={{ borderColor: color+"55", background: color+"08" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <span className="ss-label" style={{ background:color+"22", color }}>⚡ Superset</span>
              <span style={{ fontSize:10, color:"#555570" }}>No rest between these two</span>
            </div>
            {[i, i+1].map(j => renderExRow(j, color))}
            {i+1 < exercises.length && (
              <button onClick={() => toggleSuperset(i)}
                style={{ marginTop:6, background:"none", border:`1px solid ${color}44`, borderRadius:6, cursor:"pointer", color:color+"99", fontSize:10, padding:"3px 10px", fontFamily:"'DM Sans'" }}>
                Remove superset
              </button>
            )}
          </div>
        );
        i += 2;
      } else {
        rows.push(
          <div key={i}>
            {renderExRow(i, null)}
            {/* "Link as superset" button — only shown between two standalone exercises */}
            {i < exercises.length-1 && exercises[i+1]?.ssGroup === null && (
              <button onClick={() => toggleSuperset(i)}
                style={{ display:"block", margin:"-2px auto 8px", background:"none", border:"1px solid #1e1e2e", borderRadius:6, cursor:"pointer", color:"#444458", fontSize:10, padding:"3px 14px", fontFamily:"'DM Sans'" }}>
                ⚡ Link as superset ↕
              </button>
            )}
          </div>
        );
        i++;
      }
    }
    return rows;
  };

  const renderExRow = (i, ssColor) => {
    const ex = exercises[i];
    return (
      <div key={i} style={{ marginBottom:8, background:"#0f0f1a", borderRadius:12, padding:"12px 14px" }}>
        <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
          {ssColor && <div style={{ width:3, borderRadius:2, background:ssColor, alignSelf:"stretch", flexShrink:0 }}/>}
          <input className="ft-input" placeholder="Exercise name" value={ex.name}
            onChange={e=>updateEx(i,"name",e.target.value)} style={{ flex:1, background:"#13131e" }} />
          {exercises.length > 1 && (
            <button onClick={()=>removeEx(i)} style={{ background:"none",border:"none",cursor:"pointer",color:"#555570",padding:4 }}>
              {Icon.trash}
            </button>
          )}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["sets","reps","weight"].map(f => (
            <input key={f} className="ft-input" placeholder={f==="weight"?"kg":f}
              value={ex[f]} onChange={e=>updateEx(i,f,e.target.value)}
              style={{ flex:1, textAlign:"center", background:"#13131e" }} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="ft-screen ft-slide-up" style={{ paddingBottom:120 }}>
      <RestTimer visible={timerOpen} onClose={()=>setTimerOpen(false)} />
      {prefill && (
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16,padding:"10px 14px",background:"rgba(200,241,53,.08)",borderRadius:10,border:"1px solid rgba(200,241,53,.2)" }}>
          {prefill.emoji && <span style={{ fontSize:20 }}>{prefill.emoji}</span>}
          <span style={{ fontSize:13,color:"#c8f135" }}>Loaded: <strong>{prefill.name}</strong></span>
        </div>
      )}
      <div className="ft-tag" style={{ marginBottom:8 }}>New Session</div>
      <h1 className="ft-heading" style={{ fontSize:36, marginBottom:24 }}>LOG WORKOUT</h1>
      <div className="ft-card">
        <div style={{ display:"flex",gap:10,marginBottom:14 }}>
          <input className="ft-input" placeholder="Workout name" value={name}
            onChange={e=>setName(e.target.value)} style={{ flex:2 }} />
          <select className="ft-input ft-select" value={group} onChange={e=>setGroup(e.target.value)} style={{ flex:1 }}>
            {MUSCLE_GROUPS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div style={{ fontSize:12,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10 }}>Exercises</div>
        {renderExercises()}
        <button className="ft-btn ft-btn-ghost ft-btn-sm" onClick={addEx} style={{ width:"100%",marginTop:6 }}>
          + Add Exercise
        </button>
      </div>
      <button className="ft-btn" onClick={handleSave} disabled={!name.trim()}>SAVE WORKOUT</button>
      <button className="timer-fab" onClick={()=>setTimerOpen(true)} title="Rest Timer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="2.2">
          <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
        </svg>
      </button>
    </div>
  );
}


// ── VOLUME TRACKER ───────────────────────────────────────────────────────────
function VolumeTracker({ workouts }) {
  const [period, setPeriod] = useState("week");

  const now = new Date();
  const cutoff = period === "week"
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    : period === "month"
    ? new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    : new Date(0);

  const inRange = workouts.filter(w => new Date(w.date) >= cutoff);

  const sessionVol = inRange
    .map(w => {
      const tons = w.exercises.reduce((s,e) => {
        return s + (parseFloat(e.sets)||0)*(parseFloat(e.reps)||0)*(parseFloat(e.weight)||0);
      }, 0);
      return { date:w.date, name:w.name.slice(0,10), tons:Math.round(tons) };
    })
    .filter(s => s.tons > 0)
    .sort((a,b) => a.date.localeCompare(b.date));

  const groupVol = {};
  inRange.forEach(w => {
    const tons = w.exercises.reduce((s,e) =>
      s+(parseFloat(e.sets)||0)*(parseFloat(e.reps)||0)*(parseFloat(e.weight)||0), 0);
    groupVol[w.group] = (groupVol[w.group]||0)+tons;
  });
  const groupData = Object.entries(groupVol).sort((a,b)=>b[1]-a[1]).map(([g,v])=>({g,v:Math.round(v)}));

  const weeklyVol = Array.from({length:8},(_,i) => {
    const wEnd = new Date(); wEnd.setDate(wEnd.getDate()-i*7);
    const wStart = new Date(wEnd); wStart.setDate(wStart.getDate()-6);
    const label = wEnd.toLocaleDateString("en-GB",{day:"numeric",month:"short"});
    const tons = workouts
      .filter(w => { const d=new Date(w.date); return d>=wStart&&d<=wEnd; })
      .reduce((s,w) => s+w.exercises.reduce((es,e) =>
        es+(parseFloat(e.sets)||0)*(parseFloat(e.reps)||0)*(parseFloat(e.weight)||0), 0), 0);
    return { label, tons:Math.round(tons) };
  }).reverse();

  const totalTons = sessionVol.reduce((s,x)=>s+x.tons,0);
  const avgPerSession = sessionVol.length ? Math.round(totalTons/sessionVol.length) : 0;
  const maxSession = sessionVol.length ? Math.max(...sessionVol.map(s=>s.tons)) : 0;

  const Tip = ({active,payload,label}) => active&&payload?.length
    ? <div className="ft-tooltip"><div style={{color:"#c8f135"}}>{label}</div><div>{payload[0].value.toLocaleString()}kg</div></div>
    : null;

  if (!workouts.length||totalTons===0) return (
    <div style={{textAlign:"center",padding:"40px 0",color:"#444458"}}>
      <div style={{fontSize:40,marginBottom:12}}>⚖️</div>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:20}}>No volume data yet</div>
      <div style={{fontSize:12,marginTop:4}}>Log workouts with sets, reps AND weight to track tonnage</div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {[["week","7 Days"],["month","30 Days"],["all","All Time"]].map(([k,l]) => (
          <button key={k} onClick={()=>setPeriod(k)}
            style={{flex:1,padding:"9px 0",borderRadius:10,border:`1.5px solid ${period===k?"#c8f135":"#1e1e2e"}`,
              background:period===k?"rgba(200,241,53,.1)":"#13131e",cursor:"pointer",fontFamily:"'DM Sans'",
              fontSize:12,fontWeight:600,color:period===k?"#c8f135":"#555570",transition:"all .2s"}}>{l}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {label:"Total Volume", val:totalTons>999?`${(totalTons/1000).toFixed(1)}t`:`${totalTons}kg`, color:"#c8f135"},
          {label:"Avg / Session",val:`${avgPerSession}kg`, color:"#f5a623"},
          {label:"Best Session", val:`${maxSession}kg`,    color:"#c17fe0"},
        ].map(s=>(
          <div key={s.label} className="ft-stat-card" style={{textAlign:"center"}}>
            <div style={{fontSize:9,color:"#555570",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{s.label}</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:s.color,lineHeight:1}}>{s.val}</div>
          </div>
        ))}
      </div>

      {weeklyVol.some(w=>w.tons>0) && (
        <div className="ft-card">
          <div style={{fontSize:12,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Weekly Tonnage</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyVol} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
              <XAxis dataKey="label" tick={{fill:"#555570",fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="tons" fill="#c8f135" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {sessionVol.length>0 && (
        <div className="ft-card">
          <div style={{fontSize:12,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Volume Per Session</div>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={sessionVol}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
              <XAxis dataKey="name" tick={{fill:"#555570",fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip content={<Tip/>}/>
              <Line type="monotone" dataKey="tons" stroke="#f5a623" strokeWidth={2.5} dot={{fill:"#f5a623",r:3}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {groupData.length>0 && (
        <div className="ft-card">
          <div style={{fontSize:12,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Volume by Muscle Group</div>
          {groupData.map(({g,v})=>(
            <div key={g} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                <span>{g}</span><span style={{color:"#c8f135",fontWeight:600}}>{v.toLocaleString()}kg</span>
              </div>
              <div style={{height:8,background:"#1e1e2e",borderRadius:4}}>
                <div className="vol-bar" style={{width:`${(v/groupData[0].v)*100}%`,background:"linear-gradient(90deg,#c8f135,#8fb82a)"}}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── LIFT PROGRESSION TRACKER ──────────────────────────────────────────────────
// ── 1RM Formulas (Epley is most widely used; show all three for comparison) ──
const calc1RM = (weight, reps) => {
  if (!weight || !reps || reps < 1) return null;
  const w = parseFloat(weight), r = parseInt(reps);
  if (isNaN(w) || isNaN(r) || r < 1) return null;
  if (r === 1) return w;
  return {
    epley:   Math.round(w * (1 + r / 30)),
    brzycki: Math.round(w / (1.0278 - 0.0278 * r)),
    lander:  Math.round((100 * w) / (101.3 - 2.67123 * r)),
  };
};

const ORM_ZONES = [
  { pct: 95, label: "1–2 RM",  goal: "Max Strength",   color: "#ff4444" },
  { pct: 90, label: "3 RM",    goal: "Strength",        color: "#ff6b35" },
  { pct: 85, label: "5 RM",    goal: "Heavy Strength",  color: "#f5a623" },
  { pct: 80, label: "6–8 RM",  goal: "Strength/Hypertrophy", color: "#ffd600" },
  { pct: 75, label: "8–10 RM", goal: "Hypertrophy",     color: "#c8f135" },
  { pct: 70, label: "10–12 RM",goal: "Hypertrophy",     color: "#38b87c" },
  { pct: 65, label: "12–15 RM",goal: "Muscle Endurance",color: "#4ecdc4" },
  { pct: 60, label: "15–20 RM",goal: "Endurance",       color: "#63b3ed" },
];

// ── Standalone 1RM Calculator ─────────────────────────────────────────────────
function OneRMCalculator() {
  const [weight, setWeight] = useState("");
  const [reps,   setReps]   = useState("");
  const result = calc1RM(weight, reps);
  const bestEst = result ? Math.round((result.epley + result.brzycki + result.lander) / 3) : null;

  return (
    <div>
      <div style={{ fontSize:11, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:12 }}>
        Calculate your estimated 1-rep max from any working set
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        <div>
          <div style={{ fontSize:10, color:"#888899", textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>Weight (kg)</div>
          <input type="number" className="orm-calc-input" placeholder="100" value={weight}
            onChange={e => setWeight(e.target.value)}/>
        </div>
        <div>
          <div style={{ fontSize:10, color:"#888899", textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>Reps completed</div>
          <input type="number" className="orm-calc-input" placeholder="5" value={reps}
            onChange={e => setReps(e.target.value)}/>
        </div>
      </div>

      {bestEst && (
        <div className="ft-slide-up">
          {/* Hero 1RM */}
          <div style={{ textAlign:"center", padding:"20px", background:"linear-gradient(135deg,#0d1f00,#1a3800)", borderRadius:16, marginBottom:16, border:"1.5px solid #c8f13544" }}>
            <div style={{ fontSize:11, color:"#c8f135", textTransform:"uppercase", letterSpacing:".1em", fontWeight:700, marginBottom:6 }}>Estimated 1RM</div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:72, color:"#c8f135", lineHeight:1 }}>{bestEst}<span style={{ fontSize:28 }}>kg</span></div>
            <div style={{ fontSize:11, color:"#888899", marginTop:6 }}>Average of three validated formulas</div>
          </div>

          {/* Formula breakdown */}
          <div className="ft-card" style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Formula Breakdown</div>
            {[
              { name:"Epley",   val:result.epley,   note:"Most widely used" },
              { name:"Brzycki", val:result.brzycki, note:"Best for 2–10 reps" },
              { name:"Lander",  val:result.lander,  note:"Conservative" },
            ].map(f => (
              <div key={f.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid #1e1e2e" }}>
                <div>
                  <span style={{ fontSize:13, color:"#e8e8f0", fontWeight:600 }}>{f.name}</span>
                  <span style={{ fontSize:10, color:"#555570", marginLeft:8 }}>{f.note}</span>
                </div>
                <span style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:"#c8c8d8" }}>{f.val}kg</span>
              </div>
            ))}
          </div>

          {/* Training zones */}
          <div className="ft-card">
            <div style={{ fontSize:11, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:12 }}>Training Zones</div>
            {ORM_ZONES.map(z => {
              const load = Math.round(bestEst * z.pct / 100);
              return (
                <div key={z.pct} className="orm-zone" style={{ background:`${z.color}10`, border:`1px solid ${z.color}25` }}>
                  <div>
                    <span style={{ fontSize:12, fontWeight:700, color:z.color }}>{z.pct}%</span>
                    <span style={{ fontSize:11, color:"#888899", marginLeft:8 }}>{z.label}</span>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:"#e8e8f0", lineHeight:1 }}>{load}kg</div>
                    <div style={{ fontSize:9, color:z.color, fontWeight:600 }}>{z.goal}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function LiftTracker({ workouts }) {
  const [search, setSearch] = useState("");
  const [selectedLift, setSelectedLift] = useState(null);
  const [ormTab, setOrmTab] = useState("history"); // "history" | "1rm"

  const liftMap = {};
  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      if (!ex.name.trim()) return;
      const wt = parseFloat(ex.weight);
      if (!wt || isNaN(wt)) return;
      if (!liftMap[ex.name]) liftMap[ex.name] = [];
      liftMap[ex.name].push({ date: w.date, weight: wt, reps: ex.reps, sets: ex.sets, workoutName: w.name });
    });
  });

  const lifts = Object.entries(liftMap)
    .map(([name, entries]) => {
      const sorted = [...entries].sort((a,b) => a.date.localeCompare(b.date));
      const pb = Math.max(...entries.map(e => e.weight));
      const pbEntry = sorted.find(e => e.weight === pb);
      const latest = sorted[sorted.length - 1];
      const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
      const trend = prev ? latest.weight - prev.weight : 0;
      // Best estimated 1RM from all entries (highest Epley result)
      const best1RM = entries.reduce((best, e) => {
        const r = calc1RM(e.weight, e.reps);
        if (!r) return best;
        const avg = Math.round((r.epley + r.brzycki + r.lander) / 3);
        return avg > best ? avg : best;
      }, 0);
      return { name, entries: sorted, pb, pbEntry, latest, trend, count: entries.length, best1RM };
    })
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.count - a.count);

  const Tip = ({ active, payload, label }) => active && payload?.length
    ? <div className="ft-tooltip"><div style={{color:"#c8f135"}}>{fmtDate(label)}</div><div>{payload[0].value}kg</div></div>
    : null;

  if (selectedLift) {
    const l = lifts.find(x => x.name === selectedLift);
    if (!l) { setSelectedLift(null); return null; }
    const chartData = l.entries.map(e => ({ date: e.date, weight: e.weight }));
    const allSame = l.entries.every(e => e.weight === l.entries[0].weight);

    // Best 1RM entry for the pre-filled calculator
    const pbReps = l.pbEntry?.reps || "1";
    const ormResult = calc1RM(l.pb, pbReps);
    const bestEst = ormResult && ormResult !== l.pb
      ? Math.round((ormResult.epley + ormResult.brzycki + ormResult.lander) / 3)
      : (ormResult === l.pb ? l.pb : null);

    return (
      <div>
        <button onClick={() => setSelectedLift(null)}
          style={{ background:"none", border:"none", cursor:"pointer", color:"#c8f135", display:"flex", alignItems:"center", gap:6, marginBottom:16, fontSize:13, fontFamily:"'DM Sans'" }}>
          {Icon.back} All lifts
        </button>

        <h2 className="ft-heading" style={{ fontSize:26, marginBottom:4 }}>{l.name.toUpperCase()}</h2>
        <div style={{ fontSize:12, color:"#555570", marginBottom:14 }}>{l.count} logged sessions</div>

        {/* Sub-tab toggle */}
        <div className="view-toggle" style={{ marginBottom:16 }}>
          <button className={`view-toggle-btn ${ormTab==="history"?"active":""}`} onClick={()=>setOrmTab("history")} style={{fontFamily:"'DM Sans'"}}>📈 History</button>
          <button className={`view-toggle-btn ${ormTab==="1rm"?"active":""}`} onClick={()=>setOrmTab("1rm")} style={{fontFamily:"'DM Sans'"}}>💯 1RM & Zones</button>
        </div>

        {ormTab === "1rm" ? (
          <div>
            {/* Auto-filled from PB */}
            {bestEst && (
              <div style={{ textAlign:"center", padding:"20px", background:"linear-gradient(135deg,#0d1f00,#1a3800)", borderRadius:16, marginBottom:16, border:"1.5px solid #c8f13544" }}>
                <div style={{ fontSize:10, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>Based on PB: {l.pb}kg × {pbReps} reps</div>
                <div style={{ fontSize:10, color:"#c8f135", textTransform:"uppercase", letterSpacing:".1em", fontWeight:700, marginBottom:6 }}>Estimated 1RM</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:68, color:"#c8f135", lineHeight:1 }}>{bestEst}<span style={{ fontSize:26 }}>kg</span></div>
                {ormResult && ormResult !== l.pb && (
                  <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:10, fontSize:11, color:"#888899" }}>
                    <span>Epley: {ormResult.epley}kg</span>
                    <span>Brzycki: {ormResult.brzycki}kg</span>
                    <span>Lander: {ormResult.lander}kg</span>
                  </div>
                )}
              </div>
            )}
            {/* Training zones from best estimate */}
            {bestEst && (
              <div className="ft-card">
                <div style={{ fontSize:11, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:12 }}>Training Zones for {l.name}</div>
                {ORM_ZONES.map(z => {
                  const load = Math.round(bestEst * z.pct / 100);
                  return (
                    <div key={z.pct} className="orm-zone" style={{ background:`${z.color}10`, border:`1px solid ${z.color}22` }}>
                      <div>
                        <span style={{ fontSize:12, fontWeight:700, color:z.color }}>{z.pct}%</span>
                        <span style={{ fontSize:11, color:"#888899", marginLeft:8 }}>{z.label}</span>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:"#e8e8f0", lineHeight:1 }}>{load}kg</div>
                        <div style={{ fontSize:9, color:z.color, fontWeight:600 }}>{z.goal}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!bestEst && (
              <div style={{ textAlign:"center", padding:"30px 0", color:"#444458" }}>
                <div style={{ fontSize:11 }}>Log reps alongside weight to calculate 1RM</div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
              {[
                { label:"Personal Best", val:`${l.pb}kg`, color:"#c8f135" },
                { label:"Est. 1RM",      val: bestEst ? `${bestEst}kg` : "—", color:"#f5a623" },
                { label:"Trend",         val: l.trend > 0 ? `+${l.trend}kg` : l.trend < 0 ? `${l.trend}kg` : "→",
                  color: l.trend > 0 ? "#38b87c" : l.trend < 0 ? "#ff6b6b" : "#888899" },
              ].map(s => (
                <div key={s.label} className="ft-stat-card" style={{ textAlign:"center" }}>
                  <div style={{ fontSize:9, color:"#555570", textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:s.color, lineHeight:1 }}>{s.val}</div>
                </div>
              ))}
            </div>

            {chartData.length > 1 && !allSame && (
              <div className="ft-card" style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:14 }}>Weight Over Time</div>
                <ResponsiveContainer width="100%" height={130}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
                    <XAxis dataKey="date" tick={{fill:"#555570",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={d=>fmtDate(d)}/>
                    <YAxis domain={["auto","auto"]} tick={{fill:"#555570",fontSize:9}} axisLine={false} tickLine={false} width={32}/>
                    <Tooltip content={<Tip/>}/>
                    <Line type="monotone" dataKey="weight" stroke="#c8f135" strokeWidth={2.5} dot={{fill:"#c8f135",r:3}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div style={{ fontSize:11, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>History</div>
            <div className="ft-card">
              {[...l.entries].reverse().map((e, i) => {
                const orm = calc1RM(e.weight, e.reps);
                const ormAvg = orm && orm !== e.weight ? Math.round((orm.epley + orm.brzycki + orm.lander) / 3) : null;
                return (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<l.entries.length-1?"1px solid #1e1e2e":"none" }}>
                    <div>
                      <div style={{ fontSize:12, color:"#888899" }}>{fmtDate(e.date)}</div>
                      <div style={{ fontSize:11, color:"#555570" }}>{e.workoutName}</div>
                      {ormAvg && <div style={{ fontSize:10, color:"#f5a623", marginTop:2 }}>~{ormAvg}kg 1RM est.</div>}
                    </div>
                    <div style={{ textAlign:"right", display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ fontSize:11, color:"#888899" }}>{e.sets}×{e.reps}</div>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:e.weight===l.pb?"#c8f135":"#e8e8f0", lineHeight:1 }}>{e.weight}kg</div>
                      {e.weight === l.pb && <span className="pb-badge">PB</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (lifts.length === 0) return (
    <div style={{ textAlign:"center", padding:"40px 0", color:"#444458" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🏋️</div>
      <div style={{ fontFamily:"'Bebas Neue'", fontSize:20 }}>No weight data yet</div>
      <div style={{ fontSize:12, marginTop:4 }}>Log workouts with weights in the kg field to track progression</div>
    </div>
  );

  return (
    <div>
      <input className="ft-input" placeholder="🔍  Search lifts…" value={search}
        onChange={e => setSearch(e.target.value)} style={{ marginBottom:14 }}/>
      <div style={{ fontSize:11, color:"#555570", marginBottom:10 }}>{lifts.length} tracked lifts</div>
      {lifts.map(l => (
        <div key={l.name} className="lift-row" onClick={() => setSelectedLift(l.name)}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#e8e8f0", marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</div>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                <span className="pb-badge">PB {l.pb}kg</span>
                {l.best1RM > 0 && <span style={{ fontSize:10, background:"rgba(245,166,35,.12)", color:"#f5a623", padding:"2px 7px", borderRadius:100, fontWeight:700 }}>~{l.best1RM}kg 1RM</span>}
                <span style={{ fontSize:11, color:"#555570" }}>{l.count} sessions</span>
                {l.trend !== 0 && <span style={{ fontSize:11, color:l.trend>0?"#38b87c":"#ff6b6b", fontWeight:600 }}>{l.trend>0?"↑":"↓"}{Math.abs(l.trend)}kg</span>}
              </div>
            </div>
            <div style={{ textAlign:"right", marginLeft:12 }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:26, color:"#c8f135", lineHeight:1 }}>{l.latest.weight}kg</div>
              <div style={{ fontSize:10, color:"#555570", marginTop:2 }}>last: {fmtDate(l.latest.date)}</div>
            </div>
          </div>
          {l.entries.length > 2 && (
            <div style={{ marginTop:10, height:36 }}>
              <ResponsiveContainer width="100%" height={36}>
                <LineChart data={l.entries.map(e=>({w:e.weight}))}>
                  <Line type="monotone" dataKey="w" stroke="#c8f135" strokeWidth={1.5} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProgressScreen({ workouts }) {
  const [tab, setTab] = useState("stats");
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? workouts : workouts.filter(w => w.group === filter);
  const byDate = {};
  filtered.forEach(w => { byDate[w.date] = (byDate[w.date]||0)+1; });
  const sessionData = Object.entries(byDate).sort((a,b)=>a[0].localeCompare(b[0])).slice(-10).map(([date,count])=>({date:fmtDate(date),count}));
  const exData = [...filtered].sort((a,b)=>a.date.localeCompare(b.date)).slice(-10).map(w=>({name:w.name.slice(0,8),ex:w.exercises.length}));
  const groupCount = {};
  workouts.forEach(w => { groupCount[w.group] = (groupCount[w.group]||0)+1; });
  const groupData = Object.entries(groupCount).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([g,c])=>({g,c}));
  const Tip = ({ active, payload, label }) => active && payload?.length
    ? <div className="ft-tooltip"><div style={{color:"#c8f135"}}>{label}</div><div>{payload[0].value} {payload[0].name}</div></div>
    : null;

  if (!workouts.length) return (
    <div className="ft-screen" style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
      <div style={{ fontSize:48,marginBottom:12 }}>📊</div>
      <div className="ft-heading" style={{ fontSize:22 }}>NO DATA YET</div>
      <div style={{ fontSize:13,color:"#555570",marginTop:4 }}>Log some workouts first!</div>
    </div>
  );

  return (
    <div className="ft-screen ft-slide-up">
      <div className="ft-tag" style={{ marginBottom:8 }}>Analytics</div>
      <h1 className="ft-heading" style={{ fontSize:36, marginBottom:16 }}>PROGRESS</h1>

      {/* Tab toggle */}
      <div className="view-toggle" style={{ marginBottom:20 }}>
        <button className={`view-toggle-btn ${tab==="stats"?"active":""}`}  onClick={()=>setTab("stats")}  style={{fontFamily:"'DM Sans'"}}>📊 Stats</button>
        <button className={`view-toggle-btn ${tab==="volume"?"active":""}`} onClick={()=>setTab("volume")} style={{fontFamily:"'DM Sans'"}}>⚖️ Volume</button>
        <button className={`view-toggle-btn ${tab==="lifts"?"active":""}`}  onClick={()=>setTab("lifts")}  style={{fontFamily:"'DM Sans'"}}>🏋️ Lifts</button>
        <button className={`view-toggle-btn ${tab==="1rm"?"active":""}`}    onClick={()=>setTab("1rm")}    style={{fontFamily:"'DM Sans'"}}>💯 1RM</button>
      </div>

      {tab==="lifts"  ? <LiftTracker workouts={workouts}/> :
       tab==="volume" ? <VolumeTracker workouts={workouts}/> :
       tab==="1rm"    ? <OneRMCalculator/> :
       (
        <>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:18 }}>
            {["All",...MUSCLE_GROUPS].map(g=>(
              <button key={g} onClick={()=>setFilter(g)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:100, border:"1.5px solid", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'DM Sans'", transition:"all .2s", background:filter===g?"#c8f135":"transparent", borderColor:filter===g?"#c8f135":"#1e1e2e", color:filter===g?"#0a0a0f":"#555570" }}>{g}</button>
            ))}
          </div>
          {sessionData.length>0 && <div className="ft-card"><div style={{fontSize:12,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Sessions Over Time</div><ResponsiveContainer width="100%" height={120}><LineChart data={sessionData}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/><XAxis dataKey="date" tick={{fill:"#555570",fontSize:10}} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip content={<Tip/>}/><Line type="monotone" dataKey="count" name="sessions" stroke="#c8f135" strokeWidth={2.5} dot={{fill:"#c8f135",r:3}}/></LineChart></ResponsiveContainer></div>}
          {exData.length>0 && <div className="ft-card"><div style={{fontSize:12,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Exercises Per Session</div><ResponsiveContainer width="100%" height={120}><BarChart data={exData} barSize={20}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/><XAxis dataKey="name" tick={{fill:"#555570",fontSize:10}} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip content={<Tip/>}/><Bar dataKey="ex" name="exercises" fill="#c8f135" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>}
          {groupData.length>0 && <div className="ft-card"><div style={{fontSize:12,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Top Muscle Groups</div>{groupData.map(({g,c})=>(<div key={g} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}><span>{g}</span><span style={{color:"#c8f135"}}>{c}</span></div><div style={{height:6,background:"#1e1e2e",borderRadius:3}}><div style={{height:"100%",width:`${(c/groupData[0].c)*100}%`,background:"#c8f135",borderRadius:3}}/></div></div>))}</div>}
        </>
      )}
    </div>
  );
}

function CoachScreen({ workouts }) {
  const [messages, setMessages] = useState([{ role:"assistant", text:"Hey! I'm FitAI, your personal coach. I can see your workout history and give you personalized tips. What would you like to know?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const quickPrompts = ["What should I train today?","Review my recent workouts","Tips to improve recovery","How can I add more variety?"];

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role:"user", text:msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const reply = await askAI(newMessages.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text})), workouts);
      setMessages(m => [...m, { role:"assistant", text:reply }]);
    } catch(e) {
      const msg = e.message === "NO_KEY"
        ? "No API key set. Go to Settings (⚙️ in the nav) to add your Anthropic API key."
        : "Connection issue. Please try again!";
      setMessages(m => [...m, { role:"assistant", text: msg }]);
    }
    setLoading(false);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  return (
    <div className="ft-screen ft-slide-up" style={{ paddingBottom:160 }}>
      <div className="ft-tag" style={{ marginBottom:8 }}>Powered by Claude</div>
      <h1 className="ft-heading" style={{ fontSize:36, marginBottom:20 }}>AI COACH</h1>
      {messages.length===1 && <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>{quickPrompts.map(p=><button key={p} onClick={()=>send(p)} style={{background:"#13131e",border:"1px solid #1e1e2e",borderRadius:100,color:"#c8c8d8",fontSize:12,padding:"8px 14px",cursor:"pointer",fontFamily:"'DM Sans'"}}>{p}</button>)}</div>}
      <div className="ft-chat">
        {messages.map((m,i)=><div key={i} className={`ft-bubble ${m.role==="assistant"?"ai":"user"}`}>{m.text}</div>)}
        {loading && <div className="ft-bubble ai ft-pulse">Thinking…</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"10px 20px",background:"#0a0a0f",display:"flex",gap:10,alignItems:"flex-end"}}>
        <input className="ft-input" placeholder="Ask your coach…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} style={{borderRadius:24}}/>
        <button className="ft-send-btn" onClick={()=>send()} disabled={!input.trim()||loading}><span style={{color:"#0a0a0f",display:"flex"}}>{Icon.send}</span></button>
      </div>
    </div>
  );
}

}

// ── PROGRAMS ──────────────────────────────────────────────────────────────────
function ProgramsScreen({ onStartWorkout }) {
  const [completedWorkouts, setCompleted] = useStorage("fittrack_prog_pectus", []);
  const [openPhases, setOpenPhases] = useState(["p1"]);
  const [openWorkouts, setOpenWorkouts] = useState([]);
  const [openTutorials, setOpenTutorials] = useState([]);
  const [currentWeek, setCurrentWeek] = useStorage("fittrack_prog_week", 1);

  const doneCount = completedWorkouts.length;

  const togglePhase = id => setOpenPhases(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const toggleWorkout = id => setOpenWorkouts(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const toggleTutorial = id => setOpenTutorials(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);

  const markDone = wid => {
    const key = `${currentWeek}-${wid}`;
    setCompleted(completedWorkouts.includes(key) ? completedWorkouts.filter(k=>k!==key) : [...completedWorkouts, key]);
  };
  const isDone = wid => completedWorkouts.includes(`${currentWeek}-${wid}`);

  const phaseForWeek = wk => PECTUS_PROGRAM.phases.find(p => wk >= p.weekRange[0] && wk <= p.weekRange[1]);
  const currentPhase = phaseForWeek(currentWeek);

  const tagColor = t => ({ Push:"#f5a623", Pull:"#6c63ff", Core:"#00c9a7", Lower:"#4ecdc4", Full:"#c17fe0", Daily:"#c8f135", Upper:"#ff4d4d" }[t] || "#888");

  const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>;
  const Chevron = ({ open }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition:"transform .2s", transform: open?"rotate(180deg)":"rotate(0deg)" }}><path d="M6 9l6 6 6-6"/></svg>;
  const InfoIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;

  return (
    <div className="ft-screen ft-slide-up">
      <div style={{ marginBottom: 24 }}>
        <div className="ft-tag" style={{ marginBottom: 8 }}>12-Week Plan</div>
        <h1 className="ft-heading" style={{ fontSize: 32, lineHeight: 1.1, marginBottom: 6 }}>
          {PECTUS_PROGRAM.emoji} {PECTUS_PROGRAM.name.toUpperCase()}
        </h1>
        <p style={{ fontSize: 12, color: "#888899", marginBottom: 14 }}>{PECTUS_PROGRAM.subtitle}</p>

        {/* Week tracker card */}
        <div className="ft-card" style={{ marginBottom: 0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color:"#555570", textTransform:"uppercase", letterSpacing:".08em" }}>Current Week</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize: 30, color:"#c8f135", lineHeight: 1 }}>
                {currentWeek} <span style={{ fontSize:14, color:"#888899", fontFamily:"'DM Sans'" }}>/ 12</span>
              </div>
              {currentPhase && <div style={{ fontSize:11, color: currentPhase.color, marginTop: 2 }}>{currentPhase.name}</div>}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setCurrentWeek(Math.max(1,currentWeek-1))} style={{ width:32, height:32, borderRadius:8, background:"#1e1e2e", border:"none", cursor:"pointer", color:"#e8e8f0", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
              <button onClick={()=>setCurrentWeek(Math.min(12,currentWeek+1))} style={{ width:32, height:32, borderRadius:8, background:"#1e1e2e", border:"none", cursor:"pointer", color:"#e8e8f0", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#555570", marginBottom:6 }}>
            <span>Sessions completed</span><span style={{ color:"#c8f135" }}>{doneCount} total</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width:`${Math.min(100, (currentWeek-1)/12*100)}%` }}/>
          </div>
          {/* 12-week timeline */}
          <div style={{ display:"flex", gap:3, marginTop:10 }}>
            {Array.from({length:12},(_,i)=>{
              const w=i+1, ph=phaseForWeek(w), isCur=w===currentWeek, isPast=w<currentWeek;
              return <div key={w} onClick={()=>setCurrentWeek(w)} title={`Week ${w}`}
                style={{ flex:1, height:7, borderRadius:3, cursor:"pointer", transition:"all .2s",
                  background: isCur?"#c8f135" : isPast ? "#4a7a20" : (ph ? ph.color+"44" : "#1e1e2e"),
                  outline: isCur ? "2px solid #c8f13566" : "none" }}/>;
            })}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#444458", marginTop:4 }}>
            <span>Ph.1</span><span>Ph.2</span><span>Ph.3</span><span>Wk 12</span>
          </div>
        </div>
      </div>

      {/* Phases */}
      {PECTUS_PROGRAM.phases.map(phase => {
        const isOpen = openPhases.includes(phase.id);
        const isActive = currentPhase?.id === phase.id;
        return (
          <div key={phase.id} className="prog-phase" style={{ borderColor: isActive ? phase.color+"55" : "#1e1e2e" }}>
            <div className="prog-phase-header" onClick={()=>togglePhase(phase.id)}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:".06em" }}>{phase.name.toUpperCase()}</span>
                  {isActive && <span style={{ fontSize:9, background:phase.color+"22", color:phase.color, padding:"2px 8px", borderRadius:100, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" }}>Active</span>}
                </div>
                <div style={{ fontSize:11, color:"#888899" }}>{phase.weeks} · {phase.workouts.length} workouts</div>
              </div>
              <div style={{ color:"#555570" }}><Chevron open={isOpen}/></div>
            </div>

            {isOpen && <>
              <div style={{ padding:"10px 18px", background:"#0a0a14", borderTop:"1px solid #1e1e2e" }}>
                <div style={{ fontSize:11, color:"#888899", lineHeight:1.5 }}>🎯 {phase.goal}</div>
                <div style={{ fontSize:11, color:"#555570", marginTop:4 }}>📅 {phase.frequency}</div>
              </div>

              {phase.workouts.map(workout => {
                const isWOpen = openWorkouts.includes(workout.id);
                const done = isDone(workout.id);
                return (
                  <div key={workout.id}>
                    <div className="prog-workout-header" onClick={()=>toggleWorkout(workout.id)}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
                        <div className={`prog-check ${done?"done":""}`} onClick={e=>{e.stopPropagation();markDone(workout.id);}}>
                          {done && <CheckIcon/>}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:done?"#555570":"#e8e8f0", textDecoration:done?"line-through":"none" }}>{workout.name}</div>
                          <div style={{ display:"flex", gap:6, marginTop:3 }}>
                            <span style={{ fontSize:10, background:tagColor(workout.tag)+"22", color:tagColor(workout.tag), padding:"1px 7px", borderRadius:100, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" }}>{workout.tag}</span>
                            <span style={{ fontSize:10, color:"#555570" }}>{workout.exercises.length} exercises</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <button onClick={e=>{e.stopPropagation();onStartWorkout(workout,phase);}}
                          style={{ fontSize:11, padding:"5px 12px", borderRadius:8, background:"#c8f135", border:"none", cursor:"pointer", fontFamily:"'Bebas Neue'", letterSpacing:".06em", color:"#0a0a0f" }}>
                          START
                        </button>
                        <div style={{ color:"#555570" }}><Chevron open={isWOpen}/></div>
                      </div>
                    </div>

                    {isWOpen && workout.exercises.map((ex,ei)=>{
                      const tKey=`${workout.id}-${ei}`;
                      const tOpen=openTutorials.includes(tKey);
                      const tut=TUTORIALS[ex.name];
                      return (
                        <div key={ei}>
                          <div className="prog-ex-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, fontWeight:500, color:"#c8c8d8" }}>{ex.name}</div>
                              <div style={{ fontSize:11, color:"#c8f135", marginTop:2 }}>
                                {ex.sets} sets · {ex.reps}{ex.weight?` · ${ex.weight}`:""}
                              </div>
                            </div>
                            {tut && (
                              <button onClick={()=>toggleTutorial(tKey)}
                                style={{ background:tOpen?"rgba(200,241,53,.15)":"rgba(255,255,255,.06)", border:"none", cursor:"pointer", color:tOpen?"#c8f135":"#666680", borderRadius:6, padding:"5px 8px", display:"flex", alignItems:"center", gap:4, fontSize:11, fontFamily:"'DM Sans'", transition:"all .2s", flexShrink:0, marginLeft:8 }}>
                                <InfoIcon/> {tOpen?"Hide":"How to"}
                              </button>
                            )}
                          </div>
                          {tOpen && tut && (
                            <div className="tutorial-card">
                              <div style={{ fontSize:10, color:"#c8f135", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", marginBottom:6 }}>💪 {tut.muscles}</div>
                              <div style={{ fontSize:12, color:"#c8c8d8", lineHeight:1.6, marginBottom:8 }}>{tut.how}</div>
                              <div style={{ fontSize:11, color:"#888899", background:"rgba(200,241,53,.06)", padding:"6px 10px", borderRadius:6 }}>
                                <span style={{ color:"#c8f135", fontWeight:600 }}>💡 </span>{tut.tip}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>}
          </div>
        );
      })}

      {/* Outcomes */}
      <div className="ft-card" style={{ border:"1px solid rgba(200,241,53,.2)", background:"rgba(200,241,53,.03)" }}>
        <div style={{ fontSize:12, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Expected Outcomes at Week 12</div>
        {["Improved posture — shoulders back, spine tall","More balanced chest appearance","Stronger upper body (chest, back, shoulders)","Reduced discomfort when resting"].map((o,i)=>(
          <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
            <span style={{ color:"#c8f135", fontSize:14, flexShrink:0 }}>✓</span>
            <span style={{ fontSize:13, color:"#c8c8d8" }}>{o}</span>
          </div>
        ))}
      </div>
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// GOLF PROGRAMS DATA + SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const GOLF_PROGRAMS = [
  {
    id:"pre-game", name:"Pre-Game Warm-Up", subtitle:"10-min activation before any round",
    emoji:"⛳", color:"#c8f135", textDark:true, bg:"linear-gradient(135deg,#0d1f00,#1a3800)",
    tag:"Warm-Up", duration:"10 min", frequency:"Before every round",
    goal:"Prime the body for golf — activate glutes, open hips, loosen the thoracic spine and shoulders.",
    sessions:[{
      id:"pre-s1", name:"Pre-Round Activation", tag:"Warm-Up",
      exercises:[
        {name:"Hip 90/90 Rotations",    sets:"2",reps:"10 each side", weight:"",note:"Sit on floor, both legs at 90°. Rotate forward and back."},
        {name:"Thoracic Rotations",      sets:"2",reps:"10 each side", weight:"",note:"Seated or kneeling, rotate upper body with arms crossed."},
        {name:"Glute Bridge",            sets:"2",reps:"15",           weight:"",note:"Drive hips to ceiling, squeeze glutes at top. 2s hold."},
        {name:"Band Pull-Aparts",        sets:"2",reps:"15",           weight:"Light band",note:"Arms at shoulder height, pull band to chest."},
        {name:"Hip Hinge Drill",         sets:"2",reps:"10",           weight:"",note:"Hands behind head, hinge at hips keeping spine neutral."},
        {name:"Lateral Band Walk",       sets:"2",reps:"10 each way",  weight:"Light band",note:"Half squat, step side to side. Feel glute medius fire."},
        {name:"Arm Circles + Swings",    sets:"1",reps:"30s",          weight:"",note:"Full circles then cross-body swings. Loosen the shoulder capsule."},
        {name:"Practice Swing (Slow)",   sets:"1",reps:"10",           weight:"",note:"50% speed. Focus on hip rotation and balanced finish."},
        {name:"Practice Swing (75%)",    sets:"1",reps:"10",           weight:"",note:"Build to 75% speed. Feel the sequence — hips lead, arms follow."},
        {name:"Club Twists",             sets:"1",reps:"10 each way",  weight:"Iron",note:"Hold club at both ends across shoulders. Rotate fully each way."},
      ]
    }],
  },
  {
    id:"off-season", name:"Off-Season Strength", subtitle:"Build power for next season",
    emoji:"💪", color:"#ff6b6b", textDark:false, bg:"linear-gradient(135deg,#1e0404,#2e0808)",
    tag:"Strength", duration:"55 min", frequency:"3× per week",
    goal:"Build the foundational strength that translates to clubhead speed and injury resilience.",
    sessions:[
      {
        id:"off-s1", name:"Lower Body Power", tag:"Lower",
        exercises:[
          {name:"Barbell Back Squat",       sets:"4",reps:"5",   weight:"Heavy",  note:"Below parallel. Brace the core throughout."},
          {name:"Romanian Deadlift",        sets:"3",reps:"8",   weight:"Moderate",note:"Hip hinge, feel hamstring stretch at the bottom."},
          {name:"Bulgarian Split Squat",    sets:"3",reps:"8 each",weight:"DBs",  note:"Rear foot elevated. Tall spine, drive through front heel."},
          {name:"Nordic Curl",              sets:"3",reps:"5",   weight:"",       note:"Eccentric-focus. Lower as slowly as possible."},
          {name:"Cable Hip Abduction",      sets:"3",reps:"15 each",weight:"Cable",note:"Slow and controlled. Fire the glute medius."},
        ]
      },
      {
        id:"off-s2", name:"Upper Body Push/Pull", tag:"Upper",
        exercises:[
          {name:"Barbell Bench Press",      sets:"4",reps:"5",    weight:"Heavy", note:"Controlled descent, explosive press."},
          {name:"Barbell Row",              sets:"4",reps:"6",    weight:"Heavy", note:"Horizontal pull. Squeeze shoulder blades at top."},
          {name:"Dumbbell Shoulder Press",  sets:"3",reps:"10",   weight:"Moderate",note:"Seated, neutral grip. Full range."},
          {name:"Weighted Pull-Ups",        sets:"3",reps:"6",    weight:"Bodyweight+",note:"Full hang to chin over bar."},
          {name:"Cable Face Pull",          sets:"3",reps:"15",   weight:"Light-moderate",note:"Elbows high and wide. External rotation at peak."},
        ]
      },
      {
        id:"off-s3", name:"Full Body Power", tag:"Full",
        exercises:[
          {name:"Deadlift",                 sets:"4",reps:"4",    weight:"Heavy", note:"Explosive hip extension. Bar stays close to legs."},
          {name:"Overhead Press",           sets:"3",reps:"6",    weight:"Moderate-heavy",note:"Brace and squeeze glutes. Bar finishes over mid-foot."},
          {name:"Kettlebell Swing",         sets:"4",reps:"12",   weight:"Heavy KB",note:"Hip hinge — not a squat. Explosive hip snap."},
          {name:"Pallof Press",             sets:"3",reps:"12 each",weight:"Cable",note:"Anti-rotation. Do NOT rotate toward the cable."},
          {name:"Landmine Press",           sets:"3",reps:"10 each",weight:"Barbell",note:"Single arm. Rotate through the thoracic spine."},
        ]
      },
    ],
  },
  {
    id:"in-season", name:"In-Season Maintenance", subtitle:"Stay strong without fatigue",
    emoji:"🏌️", color:"#f5a623", textDark:false, bg:"linear-gradient(135deg,#1e1000,#2e1800)",
    tag:"Maintain", duration:"40 min", frequency:"2× per week",
    goal:"Maintain strength and mobility through the season without accumulating fatigue that hurts your game.",
    sessions:[
      {
        id:"in-s1", name:"Strength Maintain", tag:"Full",
        exercises:[
          {name:"Goblet Squat",             sets:"3",reps:"8",    weight:"Heavy KB",note:"Counterbalance squat. Full depth."},
          {name:"Single Arm Cable Row",     sets:"3",reps:"10 each",weight:"Moderate",note:"Rotate slightly at the top. Mimic the backswing."},
          {name:"Dumbbell Romanian Deadlift",sets:"3",reps:"10",  weight:"Moderate",note:"Feel the hamstring load. Controlled return."},
          {name:"Landmine Press",           sets:"3",reps:"8 each",weight:"Barbell",note:"Rotational press. Full shoulder stability demand."},
          {name:"Pallof Press",             sets:"2",reps:"12 each",weight:"Cable",note:"Core stability. Resist rotation."},
        ]
      },
      {
        id:"in-s2", name:"Power & Speed", tag:"Power",
        exercises:[
          {name:"Resistance Band Swing Drill",sets:"3",reps:"10 each",weight:"Band",note:"Simulate downswing against band resistance. Focus on hip fire."},
          {name:"Cable Woodchop (High to Low)",sets:"3",reps:"10 each",weight:"Moderate",note:"Pivot back foot. Power from hips not arms."},
          {name:"Kettlebell Swing",          sets:"3",reps:"10",   weight:"Heavy KB",note:"Explosive. Same hip sequence as the downswing."},
          {name:"Jump Squat",                sets:"3",reps:"6",    weight:"Bodyweight",note:"Full squat, then explode. Land soft."},
          {name:"Medicine Ball Slam",        sets:"3",reps:"8",    weight:"Light",note:"Overhead, slam down with rotation. Maximum intent."},
        ]
      },
    ],
  },
  {
    id:"mobility", name:"Daily Mobility Flow", subtitle:"Move better, hit further",
    emoji:"🔄", color:"#4ecdc4", textDark:false, bg:"linear-gradient(135deg,#041518,#072228)",
    tag:"Mobility", duration:"20 min", frequency:"Daily",
    goal:"Maintain the range of motion needed for a full shoulder turn and powerful hip rotation.",
    weeklySchedule:["Full Flow","Full Flow","Hip Focus","Full Flow","T-Spine & Shoulder","Full Flow","Rest"],
    sessions:[
      {
        id:"mob-s1", name:"Full Mobility Flow", tag:"Daily",
        exercises:[
          {name:"Cat-Cow",                  sets:"1",reps:"10 slow",weight:"",note:"Breathe in for cow, out for cat."},
          {name:"Thread the Needle",        sets:"1",reps:"8 each side",weight:"",note:"Maximum thoracic rotation. Follow with your eyes."},
          {name:"Hip 90/90 Switches",       sets:"1",reps:"10",    weight:"",note:"Rotate through both hip positions smoothly."},
          {name:"World's Greatest Stretch", sets:"1",reps:"5 each side",weight:"",note:"Lunge, hand inside foot, rotate up to ceiling."},
          {name:"Downward Dog to Cobra",    sets:"1",reps:"8 flows",weight:"",note:"Full spine movement. Take 3s in each position."},
          {name:"Thoracic Extension on Roller",sets:"1",reps:"60s",weight:"Foam Roller",note:"Upper back over roller. Arms crossed. Breathe out as you extend."},
        ]
      },
      {
        id:"mob-s2", name:"Hip Focus", tag:"Hips",
        exercises:[
          {name:"Pigeon Pose R",            sets:"1",reps:"60s",   weight:"",note:"Square hips. Fold forward to intensify."},
          {name:"Pigeon Pose L",            sets:"1",reps:"60s",   weight:"",note:"Square hips. Fold forward to intensify."},
          {name:"Low Lunge R",              sets:"1",reps:"60s",   weight:"",note:"Tuck pelvis, drive hips forward."},
          {name:"Low Lunge L",              sets:"1",reps:"60s",   weight:"",note:"Tuck pelvis, drive hips forward."},
          {name:"Lateral Band Walk",        sets:"2",reps:"10 each way",weight:"Band",note:"Activate the glute meds."},
        ]
      },
      {
        id:"mob-s3", name:"T-Spine & Shoulder", tag:"Upper",
        exercises:[
          {name:"Thread the Needle",        sets:"2",reps:"10 each",weight:"",note:"Maximum rotation. Pause at the end range."},
          {name:"Wall Angel",               sets:"2",reps:"10",    weight:"",note:"Full back contact. Slide arms overhead without losing contact."},
          {name:"Doorway Chest Opener",     sets:"2",reps:"30s each",weight:"",note:"Step through the doorway. Breathe into the stretch."},
          {name:"Cross Body Stretch R",     sets:"1",reps:"45s",   weight:"",note:"Pull arm across, keep shoulder down."},
          {name:"Cross Body Stretch L",     sets:"1",reps:"45s",   weight:"",note:"Pull arm across, keep shoulder down."},
          {name:"Thoracic Extension on Roller",sets:"1",reps:"90s",weight:"Foam Roller",note:"Work up and down the thoracic spine."},
        ]
      },
    ],
  },
  {
    id:"swing-speed", name:"Swing Speed Training", subtitle:"Add yards to your driver",
    emoji:"💨", color:"#c17fe0", textDark:false, bg:"linear-gradient(135deg,#160820,#200d30)",
    tag:"Power", duration:"35 min", frequency:"2× per week, not before a round",
    goal:"Train the rotational power and fast-twitch muscle patterns that directly increase clubhead speed.",
    sessions:[
      {
        id:"spd-s1", name:"Rotational Power", tag:"Power",
        exercises:[
          {name:"Cable Woodchop (High to Low)",sets:"4",reps:"8 each",weight:"Moderate-heavy",note:"Explosive rotation. Pivot the back foot fully."},
          {name:"Rotational Medicine Ball Throw",sets:"3",reps:"8 each",weight:"Light MB",note:"Maximum intent. Speed is the goal, not load."},
          {name:"Kettlebell Swing",            sets:"4",reps:"8",    weight:"Heavy",note:"Explosive hip extension. Exact same pattern as the downswing."},
          {name:"Half-Kneeling Cable Press",   sets:"3",reps:"10 each",weight:"Moderate",note:"Hip-to-shoulder connection. Feel the diagonal drive."},
          {name:"Transition Slam",             sets:"3",reps:"6 each",weight:"Light",note:"Wind up, then fire diagonally downward. Full speed."},
        ]
      },
      {
        id:"spd-s2", name:"Lower Body Drive", tag:"Lower",
        exercises:[
          {name:"Jump Squat",                  sets:"4",reps:"5",    weight:"Bodyweight",note:"Explode vertically. Land soft. This trains leg drive off the ground."},
          {name:"Cable Pull-Through",          sets:"3",reps:"12",   weight:"Moderate",note:"Hip drive pattern. Same sequence as the downswing initiation."},
          {name:"Single-Leg RDL",              sets:"3",reps:"8 each",weight:"Light DB",note:"Balance and posterior chain. Crucial for stable address position."},
          {name:"Lateral Band Walk",           sets:"3",reps:"12 each",weight:"Heavy band",note:"Glute medius drives lateral stability in the swing."},
        ]
      },
    ],
  },
  {
    id:"injury-prev", name:"Injury Prevention", subtitle:"Stay on the course all year",
    emoji:"🛡️", color:"#38b87c", textDark:false, bg:"linear-gradient(135deg,#001a0c,#002818)",
    tag:"Rehab", duration:"25 min", frequency:"2× per week",
    goal:"Strengthen the areas most commonly injured in golfers: lower back, shoulder, and wrist/elbow.",
    sessions:[
      {
        id:"inj-s1", name:"Lower Back Protection", tag:"Core",
        exercises:[
          {name:"Dead Bug Hold",             sets:"3",reps:"10 each",weight:"",note:"Press lower back into floor throughout. Control is everything."},
          {name:"Bird Dog",                  sets:"3",reps:"10 each",weight:"",note:"Extend opposite arm and leg. Do NOT rotate the hips."},
          {name:"Glute Bridge",              sets:"3",reps:"15",    weight:"Bodyweight",note:"Activate glutes — weak glutes = lower back stress."},
          {name:"Pallof Press",              sets:"3",reps:"12 each",weight:"Light cable",note:"Anti-rotation spine stability."},
          {name:"Jefferson Curl",            sets:"2",reps:"8",    weight:"Very light",note:"Slow controlled spinal flexion. Builds resilience."},
        ]
      },
      {
        id:"inj-s2", name:"Shoulder Stability", tag:"Shoulder",
        exercises:[
          {name:"Cable Face Pull",           sets:"3",reps:"20",   weight:"Light",note:"Rear delt and external rotator health. Non-negotiable."},
          {name:"Band Pull-Aparts",          sets:"3",reps:"20",   weight:"Light band",note:"Arms at shoulder height. Constant tension."},
          {name:"External Rotation (band)",  sets:"3",reps:"15 each",weight:"Light band",note:"Elbow at 90°, rotate forearm out. Slow and controlled."},
          {name:"Prone IT Raises",           sets:"2",reps:"10",   weight:"No weight",note:"I, then Y, then T. Mid-back and rotator cuff."},
          {name:"Wall Angel",                sets:"2",reps:"10",   weight:"",note:"All back contact. Mobility and stability combined."},
        ]
      },
      {
        id:"inj-s3", name:"Elbow & Wrist Rehab", tag:"Arms",
        exercises:[
          {name:"Eccentric Wrist Curls",     sets:"3",reps:"15",   weight:"Very light",note:"Slow 3s lowering. Builds tendon resilience."},
          {name:"Cable Reverse Curl",        sets:"3",reps:"15",   weight:"Very light",note:"Forearm extensors. Prevents golfer's elbow."},
          {name:"Weighted Side Bend",        sets:"2",reps:"15 each",weight:"Light DB",note:"Full side range. Protects the oblique insertion."},
          {name:"Forearm Stretch",           sets:"2",reps:"45s each",weight:"",note:"Both flexors and extensors. Hold each direction."},
        ]
      },
    ],
  },
];

// ── Golf Session Runner ───────────────────────────────────────────────────────
function GolfSessionRunner({ session, program, onBack, onLog }) {
  const [checked, setChecked] = useState({});
  const [openEx, setOpenEx]   = useState(null);

  const toggle   = i  => setChecked(c => ({ ...c, [i]: !c[i] }));
  const allDone  = session.exercises.every((_,i) => checked[i]);
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="ft-screen ft-slide-up">
      <button onClick={onBack}
        style={{ background:"none",border:"none",cursor:"pointer",color:program.color,display:"flex",alignItems:"center",gap:6,marginBottom:20,fontSize:13,fontFamily:"'DM Sans'" }}>
        {Icon.back} Back
      </button>

      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
        <span style={{ fontSize:28 }}>{program.emoji}</span>
        <div>
          <div style={{ fontSize:10,color:program.color,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:2 }}>
            {program.name} · {session.tag}
          </div>
          <h2 className="ft-heading" style={{ fontSize:22,lineHeight:1 }}>{session.name.toUpperCase()}</h2>
        </div>
      </div>

      <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"#555570",marginBottom:6 }}>
        <span>Progress</span>
        <span style={{ color:program.color }}>{doneCount}/{session.exercises.length}</span>
      </div>
      <div className="progress-bar-bg" style={{ marginBottom:18 }}>
        <div className="progress-bar-fill" style={{ width:`${(doneCount/session.exercises.length)*100}%`,
          background:`linear-gradient(90deg,${program.color},${program.color}99)` }}/>
      </div>

      {session.exercises.map((ex, i) => {
        const tut = TUTORIALS[ex.name];
        const isOpen = openEx === i;
        const done = checked[i];
        return (
          <div key={i} style={{ background:"#13131e",borderRadius:14,marginBottom:10,
            border:`1.5px solid ${done ? program.color+"44":"#1e1e2e"}`,overflow:"hidden",transition:"border-color .3s" }}>
            <div style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"14px" }}>
              <div onClick={() => toggle(i)}
                style={{ width:26,height:26,borderRadius:"50%",border:`1.5px solid ${done?program.color:"#333350"}`,
                  background:done?program.color:"transparent",display:"flex",alignItems:"center",
                  justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1,transition:"all .2s" }}>
                {done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:14,fontWeight:600,color:done?"#555570":"#e8e8f0",
                  textDecoration:done?"line-through":"none",marginBottom:4 }}>{ex.name}</div>
                <div style={{ fontSize:11,color:program.color,fontWeight:700,marginBottom:ex.note?4:0 }}>
                  {ex.sets} sets · {ex.reps}{ex.weight ? ` · ${ex.weight}` : ""}
                </div>
                {ex.note && <div style={{ fontSize:11,color:"#888899",fontStyle:"italic",lineHeight:1.5 }}>{ex.note}</div>}
              </div>
              {tut && (
                <button onClick={() => setOpenEx(isOpen ? null : i)}
                  style={{ background:isOpen?`${program.color}20`:"rgba(255,255,255,.06)",border:"none",
                    cursor:"pointer",color:isOpen?program.color:"#666680",borderRadius:6,
                    padding:"6px 8px",display:"flex",alignItems:"center",gap:4,
                    fontSize:11,fontFamily:"'DM Sans'",flexShrink:0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  {isOpen?"Hide":"How to"}
                </button>
              )}
            </div>
            {isOpen && tut && (
              <div style={{ padding:"0 14px 14px 52px",background:"#0f0f1a",borderTop:"1px solid #1e1e2e" }}>
                <div style={{ fontSize:10,color:program.color,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6 }}>💪 {tut.muscles}</div>
                <div style={{ fontSize:12,color:"#c8c8d8",lineHeight:1.65,marginBottom:8 }}>{tut.how}</div>
                <div style={{ fontSize:11,background:"rgba(200,241,53,.06)",padding:"8px 10px",borderRadius:8,color:"#888899" }}>
                  <span style={{ color:"#c8f135",fontWeight:600 }}>💡 </span>{tut.tip}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {allDone && (
        <div className="ft-slide-up" style={{ marginTop:8 }}>
          <div style={{ textAlign:"center",padding:"14px 0 10px",color:program.color,fontSize:14 }}>
            ⭐ Session complete — great work!
          </div>
          <button className="ft-btn" onClick={() => onLog(session, program)}
            style={{ background:program.color,color:program.textDark?"#0a0a0f":"#fff",marginBottom:10 }}>
            LOG THIS SESSION
          </button>
          <button className="ft-btn ft-btn-ghost" onClick={onBack}>Done</button>
        </div>
      )}
    </div>
  );
}

// ── Golf Programs Main Screen ─────────────────────────────────────────────────
function GolfProgramsScreen({ onLogWorkout }) {
  const [selectedProg, setSelectedProg] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [cat, setCat] = useState("All");

  const CATS = ["All","Warm-Up","Strength","Maintain","Mobility","Power","Rehab"];
  const filtered = cat === "All" ? GOLF_PROGRAMS : GOLF_PROGRAMS.filter(p => p.tag === cat);

  const handleLog = (session, program) => {
    onLogWorkout({
      name: session.name,
      emoji: program.emoji,
      group: "Full Body",
      exercises: session.exercises.map(e => ({ name:e.name, sets:e.sets, reps:e.reps, weight:e.weight||"" })),
    });
    setActiveSession(null);
    setSelectedProg(null);
  };

  if (activeSession && selectedProg) {
    return (
      <GolfSessionRunner
        session={activeSession}
        program={selectedProg}
        onBack={() => setActiveSession(null)}
        onLog={handleLog}
      />
    );
  }

  if (selectedProg) {
    return (
      <div className="ft-screen ft-slide-up">
        <button onClick={() => setSelectedProg(null)}
          style={{ background:"none",border:"none",cursor:"pointer",color:selectedProg.color,
            display:"flex",alignItems:"center",gap:6,marginBottom:20,fontSize:13,fontFamily:"'DM Sans'" }}>
          {Icon.back} All programs
        </button>

        <div style={{ background:selectedProg.bg,borderRadius:20,padding:"22px 20px",marginBottom:20,
          border:`1.5px solid ${selectedProg.color}33` }}>
          <div style={{ fontSize:46,marginBottom:12 }}>{selectedProg.emoji}</div>
          <div style={{ fontSize:9,background:`${selectedProg.color}22`,color:selectedProg.color,
            padding:"2px 10px",borderRadius:100,fontWeight:700,letterSpacing:".08em",
            textTransform:"uppercase",display:"inline-block",marginBottom:10 }}>{selectedProg.tag}</div>
          <h2 className="ft-heading" style={{ fontSize:26,lineHeight:1.1,marginBottom:6 }}>
            {selectedProg.name.toUpperCase()}
          </h2>
          <p style={{ fontSize:12,color:"#aaa8c0",lineHeight:1.6,marginBottom:12 }}>{selectedProg.goal}</p>
          <div style={{ display:"flex",gap:16,fontSize:11,color:"#888899" }}>
            <span>⏱ {selectedProg.duration}</span>
            <span>📅 {selectedProg.frequency}</span>
          </div>
        </div>

        {selectedProg.weeklySchedule && (
          <div className="ft-card" style={{ marginBottom:16 }}>
            <div style={{ fontSize:11,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10 }}>Weekly Schedule</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4 }}>
              {["M","T","W","T","F","S","S"].map((d,i) => (
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:9,color:"#555570",marginBottom:4 }}>{d}</div>
                  <div style={{ fontSize:8,fontWeight:600,color: selectedProg.weeklySchedule[i]==="Rest"?"#333350":selectedProg.color,
                    background:selectedProg.weeklySchedule[i]==="Rest"?"transparent":`${selectedProg.color}18`,
                    borderRadius:6,padding:"4px 2px",lineHeight:1.3 }}>
                    {selectedProg.weeklySchedule[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ fontSize:11,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10 }}>
          Sessions ({selectedProg.sessions.length})
        </div>
        {selectedProg.sessions.map((session, i) => (
          <div key={i} onClick={() => setActiveSession(session)}
            style={{ background:"#13131e",border:`1.5px solid ${selectedProg.color}33`,borderRadius:16,
              padding:"16px 18px",marginBottom:10,cursor:"pointer",transition:"transform .15s" }}
            onMouseDown={e=>e.currentTarget.style.transform="scale(.98)"}
            onMouseUp={e=>e.currentTarget.style.transform=""}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div>
                <div style={{ fontSize:9,background:`${selectedProg.color}22`,color:selectedProg.color,
                  padding:"2px 8px",borderRadius:100,fontWeight:700,letterSpacing:".08em",
                  textTransform:"uppercase",display:"inline-block",marginBottom:6 }}>{session.tag}</div>
                <div style={{ fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:".04em" }}>
                  {session.name.toUpperCase()}
                </div>
                <div style={{ fontSize:11,color:"#888899",marginTop:2 }}>
                  {session.exercises.length} exercises
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedProg.color} strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ft-screen ft-slide-up">
      <div className="ft-tag" style={{ marginBottom:8 }}>On the Course</div>
      <h1 className="ft-heading" style={{ fontSize:36,marginBottom:6 }}>GOLF PROGRAMS</h1>
      <p style={{ fontSize:12,color:"#555570",marginBottom:18 }}>
        {GOLF_PROGRAMS.length} structured programs designed around golf performance.
      </p>

      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:20 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ flexShrink:0,padding:"7px 14px",borderRadius:100,border:"1.5px solid",cursor:"pointer",
              fontSize:11,fontWeight:600,fontFamily:"'DM Sans'",transition:"all .2s",
              background:cat===c?"#c8f135":"transparent",
              borderColor:cat===c?"#c8f135":"#1e1e2e",
              color:cat===c?"#0a0a0f":"#555570" }}>{c}</button>
        ))}
      </div>

      {filtered.map(prog => (
        <div key={prog.id} onClick={() => setSelectedProg(prog)}
          style={{ background:prog.bg,border:`1.5px solid ${prog.color}33`,borderRadius:18,
            padding:"18px",marginBottom:12,cursor:"pointer",transition:"transform .15s" }}
          onMouseDown={e=>e.currentTarget.style.transform="scale(.98)"}
          onMouseUp={e=>e.currentTarget.style.transform=""}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:32 }}>{prog.emoji}</span>
              <div>
                <div style={{ fontSize:9,background:`${prog.color}22`,color:prog.color,
                  padding:"2px 8px",borderRadius:100,fontWeight:700,letterSpacing:".08em",
                  textTransform:"uppercase",display:"inline-block",marginBottom:4 }}>{prog.tag}</div>
                <div className="ft-heading" style={{ fontSize:20,lineHeight:1 }}>{prog.name.toUpperCase()}</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={prog.color} strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
          <div style={{ fontSize:12,color:"#888899",lineHeight:1.5,marginBottom:10 }}>{prog.subtitle}</div>
          <div style={{ display:"flex",gap:12,fontSize:11,color:"#555570" }}>
            <span>⏱ {prog.duration}</span>
            <span>📅 {prog.frequency}</span>
            <span>{prog.sessions.length} session{prog.sessions.length>1?"s":""}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BEND-STYLE STRETCH APP DATA & COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Each exercise: { name, dur: {quick,standard,deep}, cue, breathe }
const mkS = (name, q, s, d, cue, breathe) => ({ name, dur:{quick:q,standard:s,deep:d}, cue, breathe: breathe||"Breathe slowly and deeply throughout." });

const STRETCH_LIBRARY = {
  // LOWER BACK
  "Constructive Rest":       mkS("Constructive Rest",       0,  0, 60, "Lie on back, knees bent & feet flat. Let everything go heavy. The floor holds you.",           "5 deep belly breaths. Each exhale, sink deeper into the floor."),
  "Knee-to-Chest":           mkS("Knee-to-Chest",          30, 45, 60, "Pull both knees gently into your chest. Rock slowly side to side.",                            "Inhale to lengthen, exhale to draw knees closer."),
  "Supine Twist R":          mkS("Supine Twist Right",      30, 45, 60, "Right knee drops left across your body. Left arm wide. Shoulders stay grounded.",              "Inhale to create length, exhale to release deeper into the twist."),
  "Supine Twist L":          mkS("Supine Twist Left",       30, 45, 60, "Left knee drops right. Right arm wide. Breathe into the rotation.",                           "Inhale to create length, exhale to release deeper into the twist."),
  "Cat-Cow":                 mkS("Cat-Cow",                 40, 60, 75, "All fours. Inhale = belly drops, head lifts (Cow). Exhale = spine rounds, chin tucks (Cat).",  "Inhale for Cow, exhale for Cat. 8–12 slow rounds."),
  "Child's Pose":            mkS("Child's Pose",            45, 60, 90, "Wide knees, toes together, arms forward. Forehead melts to the mat.",                          "Breathe into your lower back. Feel it expand on every inhale."),
  "Sphinx":                  mkS("Sphinx Pose",              0, 45, 60, "Lie on belly. Forearms under shoulders, elbows under elbows. Lift chest gently.",              "Breathe into your chest and belly. Mild compression is normal."),
  "Legs Up Wall":            mkS("Legs Up the Wall",         0,  0,120, "Hips against wall, legs vertical. Arms out, palms up. Close your eyes.",                       "Slow 4-count inhale, 6-count exhale. Pure restoration."),

  // NECK
  "Ear to Shoulder R":       mkS("Ear to Shoulder R",       30, 45, 60, "Right ear toward right shoulder. Left hand rests on lap — no pulling. Breathe.",              "Inhale to lengthen the left side, exhale to deepen the stretch."),
  "Ear to Shoulder L":       mkS("Ear to Shoulder L",       30, 45, 60, "Left ear toward left shoulder. Right hand rests on lap. Breathe.",                            "Inhale to lengthen the right side, exhale to deepen the stretch."),
  "Chin Tucks":              mkS("Chin Tucks",               30, 30, 45, "Draw chin straight back (double chin). Hold 3s. Release. Repeat.",                            "Breathe normally. Lengthen the back of your neck on each rep."),
  "Neck Forward Fold":       mkS("Neck Forward Fold",        30, 45, 60, "Chin to chest. Clasp hands behind head for gentle weight — never force.",                     "Inhale to prepare, exhale and let the weight of your hands deepen."),
  "Thread the Needle":       mkS("Thread the Needle",         0, 45, 60, "From all fours, slide one arm under. Ear and shoulder rest on floor. Each side.",             "Inhale fully, then exhale and sink deeper into the rotation."),

  // HIPS
  "Reclined Figure Four":    mkS("Reclined Figure Four",    30, 45, 75, "Cross ankle over opposite thigh. Flex top foot hard. Pull thigh toward chest.",                "Exhale and gently draw the legs closer. No force — let it open."),
  "Low Lunge R":             mkS("Low Lunge Right",          30, 45, 60, "Right foot forward, left knee down. Tuck pelvis and press hips forward. Tall spine.",          "Inhale to lift, exhale to sink the hips forward and down."),
  "Low Lunge L":             mkS("Low Lunge Left",           30, 45, 60, "Left foot forward, right knee down. Tuck pelvis and press hips forward.",                     "Inhale to lift, exhale to sink the hips forward and down."),
  "Pigeon R":                mkS("Pigeon Pose Right",         45, 60, 90, "Right shin forward. Square hips. Stay upright or fold over the leg.",                        "Exhale to fold deeper. If it's intense, breathe into that intensity."),
  "Pigeon L":                mkS("Pigeon Pose Left",          45, 60, 90, "Left shin forward. Square hips. Stay upright or fold over the leg.",                         "Exhale to fold deeper. Let the breath do the releasing."),
  "Butterfly":               mkS("Butterfly Pose",           30, 45, 60, "Soles together, knees wide. Sit tall. Let gravity gently open the hips.",                    "Inhale to lengthen the spine. Exhale, fold forward from the hips."),
  "Happy Baby":              mkS("Happy Baby",               30, 45, 60, "Grab outer feet. Open knees toward armpits. Rock slowly side to side.",                       "Let each exhale release more weight into the floor."),
  "90-90 Hips":              mkS("90/90 Hip Stretch",         0, 45, 60, "Both legs at 90°. Sit tall. Explore rotating between internal & external hip rotation.",       "Breathe into each position. Stay 3–5 breaths each way."),

  // SHOULDERS
  "Cross Body R":            mkS("Cross-Body Right",         30, 45, 60, "Pull right arm straight across chest with left hand. Keep shoulder down.",                   "Exhale and gently increase the pull."),
  "Cross Body L":            mkS("Cross-Body Left",          30, 45, 60, "Pull left arm straight across chest with right hand.",                                        "Exhale and gently increase the pull."),
  "Doorway Chest Opener":    mkS("Doorway Chest Opener",     30, 45, 60, "Forearms on doorframe at 90°. Step one foot through and lean gently forward.",               "Inhale to expand the chest. Exhale to step slightly further through."),
  "Eagle Arms":              mkS("Eagle Arms",               30, 40, 60, "Cross elbows, forearms wrap, palms press. Lift elbows to shoulder height.",                  "Inhale — elbows rise. Exhale — pull forearms away from face."),
  "Wall Angel":              mkS("Wall Angels",               0, 45, 60, "Back flat against wall. Arms in W. Slowly slide up to Y keeping all contact with the wall.",  "Exhale as arms slide up. If you lose contact, that's your limit today."),
  "Side-Lying Windmill R":   mkS("Side-Lying Windmill R",    0, 40, 60, "Lie on left side. Top arm sweeps open along floor following with your eyes.",                 "Inhale to open, exhale fully and sink the arm toward the floor."),
  "Side-Lying Windmill L":   mkS("Side-Lying Windmill L",    0, 40, 60, "Lie on right side. Top arm sweeps open along floor following with your eyes.",                "Inhale to open, exhale fully and sink the arm toward the floor."),

  // POSTURE
  "Thoracic Roll":           mkS("Thoracic Extension",        0, 45, 60, "Foam roller across mid-back. Arms crossed on chest. Gently arch over the roller. Move it up.",  "Exhale as you extend over each segment. Inhale between positions."),
  "Cobra":                   mkS("Cobra Pose",               30, 40, 60, "Hands under shoulders. Lift chest and hold. Hips stay on floor. Gaze forward.",               "Inhale to rise, exhale to lengthen the front of the body."),
  "Prone IT":                mkS("Prone I-Y-T Raises",         0, 30, 45, "Lie face down. Lift arms into I shape, hold. Then Y. Then T. Very light or no weight.",       "Exhale on each lift. Breathe steadily throughout the holds."),

  // QUADS
  "Standing Quad R":         mkS("Standing Quad Right",      30, 40, 60, "Balance on left foot. Pull right heel to glute. Stand tall. Use a wall if needed.",           "Breathe steadily. Squeeze the glute of the stretching leg."),
  "Standing Quad L":         mkS("Standing Quad Left",       30, 40, 60, "Balance on right foot. Pull left heel to glute.",                                             "Breathe steadily. Squeeze the glute of the stretching leg."),
  "Kneeling Quad R":         mkS("Kneeling Quad Right",      30, 45, 60, "Kneel on right knee. Pull right foot toward glute with right hand.",                         "Inhale to lengthen, exhale to gently increase the pull."),
  "Kneeling Quad L":         mkS("Kneeling Quad Left",       30, 45, 60, "Kneel on left knee. Pull left foot toward glute with left hand.",                            "Inhale to lengthen, exhale to gently increase the pull."),
  "Couch Stretch R":         mkS("Couch Stretch Right",       0, 45, 60, "Right foot on sofa/wall behind. Left foot forward. Sit tall and drive hips to floor.",        "Each exhale, soften and let the hips sink lower."),
  "Couch Stretch L":         mkS("Couch Stretch Left",        0, 45, 60, "Left foot on sofa/wall behind. Right foot forward. Sit tall.",                               "Each exhale, soften and let the hips sink lower."),

  // FEET & ANKLES
  "Toe Spreading":           mkS("Toe Spreading",            20, 30, 45, "Spread toes as wide as possible. Hold. Release. Repeat. Works best barefoot.",               "Breathe normally. Feel the arches of your feet wake up."),
  "Ankle Circles R":         mkS("Ankle Circles Right",      30, 45, 60, "Slow full circles clockwise, then counter-clockwise. 10 each direction.",                    "Breathe normally. Make the circles as large and smooth as possible."),
  "Ankle Circles L":         mkS("Ankle Circles Left",       30, 45, 60, "Slow full circles clockwise, then counter-clockwise. 10 each direction.",                    "Breathe normally. Make the circles as large and smooth as possible."),
  "Calf Stretch R":          mkS("Calf Stretch Right",       30, 45, 60, "Hands on wall, right foot back, heel pressed hard into floor.",                              "Exhale and lean forward to deepen. Feel the Achilles stretch."),
  "Calf Stretch L":          mkS("Calf Stretch Left",        30, 45, 60, "Hands on wall, left foot back, heel pressed hard into floor.",                               "Exhale and lean forward to deepen."),
  "Plantar Fascia":          mkS("Plantar Fascia Stretch",   30, 45, 60, "Kneel, toes tucked under. Sit back onto heels gently. Intense — use a folded blanket.",       "Steady breathing. This one is uncomfortable but very effective."),
  "Elephant Walks":          mkS("Elephant Walks",           30, 40, 50, "Hinge forward, both legs as straight as possible. Alternate pressing each heel down.",        "Each exhale, press one heel into the floor a little further."),

  // HAMSTRINGS
  "Forward Fold":            mkS("Standing Forward Fold",    30, 45, 60, "Feet hip-width. Hinge from hips — not the waist. Let the upper body hang heavy.",            "Each exhale, soften the knees slightly and let gravity do the work."),
  "Seated Forward Fold":     mkS("Seated Forward Fold",      30, 45, 75, "Legs straight in front. Hinge from hips. Hold shins, ankles, or feet.",                      "Inhale to lengthen your spine. Exhale to fold a little deeper."),
  "Supine Hamstring R":      mkS("Supine Hamstring Right",   30, 45, 60, "Lie on back. Loop a towel/band around right foot. Extend leg toward ceiling.",               "Exhale to gently pull the leg closer. Never lock or force."),
  "Supine Hamstring L":      mkS("Supine Hamstring Left",    30, 45, 60, "Lie on back. Loop a towel/band around left foot. Extend leg toward ceiling.",                "Exhale to gently pull the leg closer."),
  "Half Splits R":           mkS("Half Splits Right",         0, 45, 75, "From low lunge. Straighten right leg. Flex foot. Hinge forward from hips.",                  "Inhale to lengthen the spine, exhale to fold over the straight leg."),
  "Half Splits L":           mkS("Half Splits Left",          0, 45, 75, "From low lunge. Straighten left leg. Flex foot. Hinge forward from hips.",                   "Inhale to lengthen the spine, exhale to fold over the straight leg."),

  // WAKE UP
  "Full Body Stretch":       mkS("Full Body Stretch",        20, 30, 45, "Lying down. Arms overhead, point toes. Stretch from fingertips to toes. Then relax.",        "Inhale fully as you stretch out. Exhale and completely release."),
  "Morning Supine Twist R":  mkS("Gentle Twist Right",       20, 30, 40, "Lying on back. Right knee drops left gently. No force — let gravity do it.",                 "Breathe into the stretch. Let each exhale soften it further."),
  "Morning Supine Twist L":  mkS("Gentle Twist Left",        20, 30, 40, "Left knee drops right gently.",                                                               "Breathe into the stretch."),
  "Downward Dog":            mkS("Downward Dog",             30, 40, 60, "All fours. Lift hips into inverted V. Pedal heels. Press floor away with hands.",            "5 slow breaths. Each exhale, try to lengthen the spine more."),
  "Mountain Breath":         mkS("Mountain Pose + Breathing", 0, 30, 60, "Stand tall, feet hip-width. 5 deep belly breaths. Set your intention for the day.",          "4-count inhale through nose. 6-count exhale through mouth."),

  // SPLITS
  "Lizard R":                mkS("Lizard Pose Right",         40, 55, 75, "Low lunge, right foot forward. Both hands inside foot. Lower onto forearms if possible.",    "Each exhale, soften the hips toward the floor. No bouncing."),
  "Lizard L":                mkS("Lizard Pose Left",          40, 55, 75, "Low lunge, left foot forward. Both hands inside foot.",                                     "Each exhale, soften the hips toward the floor."),
  "Standing Side Lunge R":   mkS("Side Lunge Right",          0, 45, 60, "Wide stance. Bend right knee deeply. Left leg stays straight. Groin and hip opener.",        "Inhale to prepare. Exhale and sink deeper into the right hip."),
  "Standing Side Lunge L":   mkS("Side Lunge Left",           0, 45, 60, "Wide stance. Bend left knee deeply. Right leg stays straight.",                              "Inhale to prepare. Exhale and sink deeper into the left hip."),
  "Full Splits Hold":        mkS("Splits Hold",               0,  0, 90, "Only go as far as comfortable. Use blocks under hips as needed. Breathe.",                   "Long slow exhales. This is a patience pose — never force it."),

  // RELAX / NIGHT
  "Legs Up Wall Restore":    mkS("Legs Up the Wall",         60, 90,120, "Hips against wall. Legs straight up. Palms up. Close your eyes completely.",                 "4 in, 6 out. Longer exhale signals the nervous system to calm down."),
  "Savasana":                mkS("Savasana",                 60, 90,120, "Lie completely still. Let go of controlling anything. Just exist.",                          "Natural breathing only. Observe each breath without changing it."),
  "Reclined Butterfly":      mkS("Reclined Butterfly",       40, 55, 75, "Lie on back. Soles of feet together, knees fall open. Arms at sides.",                       "Exhale and let the knees droop lower. Complete surrender."),
  "Body Scan":               mkS("Body Scan",                 0, 60, 90, "Lie flat. Mentally travel from toes to crown, releasing each part on each exhale.",           "One slow breath per body part. No hurry."),
};

// Curated programmes: each has quick/standard/deep versions
const STRETCH_PROGRAMS = [
  {
    id: "lower-back",
    name: "Lower Back",
    emoji: "🔵",
    color: "#4ecdc4",
    bg: "linear-gradient(135deg, #041518 0%, #07222a 100%)",
    tagline: "Decompress & release",
    benefit: "Relieves chronic lower-back tension, decompresses the spine, and calms the nervous system.",
    quick:    ["Cat-Cow","Child's Pose","Supine Twist R","Supine Twist L","Knee-to-Chest"],
    standard: ["Cat-Cow","Child's Pose","Supine Twist R","Supine Twist L","Knee-to-Chest","Sphinx","Reclined Figure Four"],
    deep:     ["Constructive Rest","Cat-Cow","Child's Pose","Supine Twist R","Supine Twist L","Knee-to-Chest","Sphinx","Pigeon R","Pigeon L","Legs Up Wall"],
  },
  {
    id: "neck",
    name: "Neck & Upper Back",
    emoji: "🔴",
    color: "#ff6b6b",
    bg: "linear-gradient(135deg, #1e0404 0%, #2e0a0a 100%)",
    tagline: "Release screen tension",
    benefit: "Undoes the damage of sitting at screens. Releases the upper traps, SCM, and deep cervical muscles.",
    quick:    ["Ear to Shoulder R","Ear to Shoulder L","Chin Tucks","Neck Forward Fold"],
    standard: ["Chin Tucks","Ear to Shoulder R","Ear to Shoulder L","Neck Forward Fold","Thread the Needle","Eagle Arms"],
    deep:     ["Chin Tucks","Ear to Shoulder R","Ear to Shoulder L","Neck Forward Fold","Thread the Needle","Eagle Arms","Wall Angel","Doorway Chest Opener"],
  },
  {
    id: "hips",
    name: "Hips",
    emoji: "🟤",
    color: "#f5a623",
    bg: "linear-gradient(135deg, #1e1000 0%, #2e1a00 100%)",
    tagline: "Open & mobilise",
    benefit: "The most impactful area for whole-body movement. Open hips reduce lower-back pain and improve athletic performance.",
    quick:    ["Reclined Figure Four","Low Lunge R","Low Lunge L","Butterfly"],
    standard: ["Reclined Figure Four","Low Lunge R","Low Lunge L","Butterfly","Pigeon R","Pigeon L"],
    deep:     ["90-90 Hips","Low Lunge R","Low Lunge L","Lizard R","Lizard L","Pigeon R","Pigeon L","Butterfly","Happy Baby"],
  },
  {
    id: "shoulders",
    name: "Shoulders",
    emoji: "🟣",
    color: "#c17fe0",
    bg: "linear-gradient(135deg, #160820 0%, #200d30 100%)",
    tagline: "Undo tightness",
    benefit: "Releases the pecs, front delts, and rotator cuff. Essential for anyone who sits, lifts overhead, or plays golf.",
    quick:    ["Cross Body R","Cross Body L","Doorway Chest Opener","Eagle Arms"],
    standard: ["Cross Body R","Cross Body L","Doorway Chest Opener","Eagle Arms","Thread the Needle","Wall Angel"],
    deep:     ["Cross Body R","Cross Body L","Doorway Chest Opener","Eagle Arms","Thread the Needle","Wall Angel","Side-Lying Windmill R","Side-Lying Windmill L"],
  },
  {
    id: "posture",
    name: "Posture",
    emoji: "🟢",
    color: "#4caf50",
    bg: "linear-gradient(135deg, #041008 0%, #081a0c 100%)",
    tagline: "Stand tall",
    benefit: "Counteracts the desk posture that rounds shoulders and compresses the spine. Opens the chest and activates the mid-back.",
    quick:    ["Chin Tucks","Doorway Chest Opener","Cat-Cow","Cobra"],
    standard: ["Chin Tucks","Wall Angel","Doorway Chest Opener","Cat-Cow","Thoracic Roll","Cobra"],
    deep:     ["Chin Tucks","Wall Angel","Doorway Chest Opener","Cat-Cow","Thoracic Roll","Cobra","Prone IT","Sphinx","Child's Pose"],
  },
  {
    id: "quads",
    name: "Quads",
    emoji: "🟡",
    color: "#ffd600",
    bg: "linear-gradient(135deg, #1a1600 0%, #2a2200 100%)",
    tagline: "Front thigh release",
    benefit: "Relieves tight quads and hip flexors — the muscles most shortened by sitting. Directly reduces lower-back strain.",
    quick:    ["Standing Quad R","Standing Quad L","Low Lunge R","Low Lunge L"],
    standard: ["Standing Quad R","Standing Quad L","Kneeling Quad R","Kneeling Quad L","Low Lunge R","Low Lunge L"],
    deep:     ["Kneeling Quad R","Kneeling Quad L","Couch Stretch R","Couch Stretch L","Low Lunge R","Low Lunge L","Pigeon R","Pigeon L"],
  },
  {
    id: "feet",
    name: "Feet & Ankles",
    emoji: "🦶",
    color: "#ff8a65",
    bg: "linear-gradient(135deg, #1a0800 0%, #2a1000 100%)",
    tagline: "Often overlooked",
    benefit: "Better foot and ankle mobility improves posture, reduces knee and hip pain, and is essential for golfers and runners.",
    quick:    ["Toe Spreading","Ankle Circles R","Ankle Circles L","Calf Stretch R","Calf Stretch L"],
    standard: ["Toe Spreading","Ankle Circles R","Ankle Circles L","Calf Stretch R","Calf Stretch L","Plantar Fascia"],
    deep:     ["Toe Spreading","Ankle Circles R","Ankle Circles L","Calf Stretch R","Calf Stretch L","Plantar Fascia","Elephant Walks"],
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    emoji: "🔶",
    color: "#ff9800",
    bg: "linear-gradient(135deg, #1a0a00 0%, #2a1200 100%)",
    tagline: "Unlock the back chain",
    benefit: "Tight hamstrings are a primary driver of lower-back pain and poor posture. Regular release improves everything.",
    quick:    ["Forward Fold","Seated Forward Fold","Supine Hamstring R","Supine Hamstring L"],
    standard: ["Forward Fold","Seated Forward Fold","Supine Hamstring R","Supine Hamstring L","Half Splits R","Half Splits L"],
    deep:     ["Forward Fold","Downward Dog","Seated Forward Fold","Supine Hamstring R","Supine Hamstring L","Half Splits R","Half Splits L","Elephant Walks"],
  },
  {
    id: "wake-up",
    name: "Wake Up",
    emoji: "☀️",
    color: "#ffeb3b",
    bg: "linear-gradient(135deg, #1a1600 0%, #2a2200 100%)",
    tagline: "Start moving",
    benefit: "Gently energises the whole body without overloading it first thing in the morning. Sets you up for the day.",
    quick:    ["Full Body Stretch","Morning Supine Twist R","Morning Supine Twist L","Cat-Cow"],
    standard: ["Full Body Stretch","Morning Supine Twist R","Morning Supine Twist L","Cat-Cow","Downward Dog","Low Lunge R","Low Lunge L"],
    deep:     ["Full Body Stretch","Morning Supine Twist R","Morning Supine Twist L","Knee-to-Chest","Cat-Cow","Child's Pose","Downward Dog","Low Lunge R","Low Lunge L","Forward Fold","Mountain Breath"],
  },
  {
    id: "splits",
    name: "Splits Prep",
    emoji: "🤸",
    color: "#e91e63",
    bg: "linear-gradient(135deg, #1a0010 0%, #2a0018 100%)",
    tagline: "Progressive flexibility",
    benefit: "A safe, progressive approach to splits. Patience is the practice — never force end-range positions.",
    quick:    ["Low Lunge R","Low Lunge L","Half Splits R","Half Splits L"],
    standard: ["Low Lunge R","Low Lunge L","Lizard R","Lizard L","Half Splits R","Half Splits L"],
    deep:     ["Low Lunge R","Low Lunge L","Lizard R","Lizard L","Pigeon R","Pigeon L","Standing Side Lunge R","Standing Side Lunge L","Half Splits R","Half Splits L","Full Splits Hold"],
  },
  {
    id: "full-body",
    name: "Full Body",
    emoji: "🌿",
    color: "#00bcd4",
    bg: "linear-gradient(135deg, #041518 0%, #072228 100%)",
    tagline: "Complete reset",
    benefit: "A head-to-toe sequence that hits every major area. Perfect after any workout, on rest days, or before bed.",
    quick:    ["Cat-Cow","Child's Pose","Low Lunge R","Low Lunge L","Forward Fold","Supine Twist R","Supine Twist L"],
    standard: ["Cat-Cow","Child's Pose","Downward Dog","Low Lunge R","Low Lunge L","Pigeon R","Pigeon L","Seated Forward Fold","Supine Twist R","Supine Twist L","Happy Baby"],
    deep:     ["Cat-Cow","Child's Pose","Downward Dog","Low Lunge R","Low Lunge L","Lizard R","Lizard L","Pigeon R","Pigeon L","Butterfly","Seated Forward Fold","Supine Twist R","Supine Twist L","Happy Baby","Legs Up Wall"],
  },
  {
    id: "relax",
    name: "Relax / Sleep",
    emoji: "🌙",
    color: "#5c6bc0",
    bg: "linear-gradient(135deg, #060820 0%, #0d1030 100%)",
    tagline: "Wind down",
    benefit: "Activates the parasympathetic nervous system. Long passive holds calm the mind and prepare the body for deep sleep.",
    quick:    ["Child's Pose","Supine Twist R","Supine Twist L","Happy Baby","Legs Up Wall Restore"],
    standard: ["Child's Pose","Reclined Figure Four","Supine Twist R","Supine Twist L","Reclined Butterfly","Happy Baby","Legs Up Wall Restore"],
    deep:     ["Child's Pose","Reclined Figure Four","Supine Twist R","Supine Twist L","Reclined Butterfly","Happy Baby","Legs Up Wall Restore","Body Scan","Savasana"],
  },
];

const DURATION_OPTIONS = [
  { key:"quick",    label:"Quick",    mins:"5 min",   sub:"4–6 exercises", color:"#c8f135" },
  { key:"standard", label:"Standard", mins:"10 min",  sub:"6–9 exercises", color:"#f5a623" },
  { key:"deep",     label:"Deep",     mins:"15+ min", sub:"8–15 exercises", color:"#c17fe0" },
];

const REST_S = 5; // seconds rest between exercises

// ── Bend-style Timer Session ──────────────────────────────────────────────────
function BendSession({ program, durationKey, onComplete, onExit }) {
  const exercises = program[durationKey]
    .map(name => ({ ...STRETCH_LIBRARY[name], key: name }))
    .filter(e => e && e.dur[durationKey] > 0);

  const totalTime = exercises.reduce((s,e) => s+e.dur[durationKey], 0) + Math.max(0, exercises.length-1)*REST_S;

  const [idx, setIdx]         = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.dur[durationKey] || 30);
  const [resting, setResting]  = useState(false);
  const [restLeft, setRestLeft] = useState(REST_S);
  const [paused, setPaused]    = useState(false);
  const [elapsed, setElapsed]  = useState(0);
  const [done, setDone]        = useState(false);
  const [started, setStarted]  = useState(false);

  const current = exercises[idx];
  const next    = exercises[idx+1];
  const exDur   = current?.dur[durationKey] || 30;
  const progress = resting ? (REST_S - restLeft)/REST_S : (exDur - timeLeft)/exDur;
  const circ = 2 * Math.PI * 54;
  const fmtMSS = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  useEffect(() => {
    if (!started || paused || done) return;
    const id = setInterval(() => {
      setElapsed(e => e+1);
      if (resting) {
        setRestLeft(r => {
          if (r <= 1) {
            const nxt = idx+1;
            if (nxt >= exercises.length) { setDone(true); return REST_S; }
            setIdx(nxt); setTimeLeft(exercises[nxt].dur[durationKey]);
            setResting(false); setRestLeft(REST_S); return REST_S;
          }
          return r-1;
        });
      } else {
        setTimeLeft(t => {
          if (t <= 1) {
            if (idx < exercises.length-1) setResting(true);
            else setDone(true);
            return 0;
          }
          return t-1;
        });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [started, paused, done, resting, idx]);

  const skip = () => {
    const nxt = idx+1;
    if (nxt >= exercises.length) { setDone(true); return; }
    setIdx(nxt); setTimeLeft(exercises[nxt].dur[durationKey]);
    setResting(false); setRestLeft(REST_S);
  };

  // ── Done screen
  if (done) return (
    <div className="ft-screen" style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",background:"#0a0a0f" }}>
      <div style={{ fontSize:72, marginBottom:16 }}>✨</div>
      <div className="ft-heading" style={{ fontSize:38, letterSpacing:".1em", marginBottom:8 }}>COMPLETE</div>
      <div style={{ fontSize:14, color:"#888899", marginBottom:4 }}>{program.name} · {DURATION_OPTIONS.find(d=>d.key===durationKey)?.label}</div>
      <div style={{ fontSize:13, color:program.color, marginBottom:32 }}>{exercises.length} exercises · {fmtMSS(totalTime)}</div>
      <div style={{ width:"100%" }}>
        <button className="ft-btn" style={{ marginBottom:10, background:program.color, color:["#ffeb3b","#c8f135","#ffd600","#f5a623"].includes(program.color)?"#0a0a0f":"#fff" }}
          onClick={onComplete}>Done</button>
      </div>
    </div>
  );

  // ── Pre-start countdown screen
  if (!started) return (
    <div className="ft-screen ft-slide-up" style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center" }}>
      <button onClick={onExit} style={{ position:"absolute",top:56,left:20,background:"none",border:"none",cursor:"pointer",color:"#555570",fontSize:13,fontFamily:"'DM Sans'",display:"flex",alignItems:"center",gap:4 }}>
        {Icon.back} Exit
      </button>
      <div style={{ fontSize:52, marginBottom:16 }}>{program.emoji}</div>
      <div className="ft-heading" style={{ fontSize:32, marginBottom:6 }}>{program.name.toUpperCase()}</div>
      <div style={{ fontSize:13, color:"#888899", marginBottom:8 }}>{DURATION_OPTIONS.find(d=>d.key===durationKey)?.label} · {exercises.length} exercises</div>
      <div style={{ fontSize:12, color:program.color, lineHeight:1.6, maxWidth:280, margin:"0 auto 24px" }}>
        Find a comfortable space. You'll be guided through each hold with breathing cues.
      </div>
      <div className="ft-card" style={{ width:"100%", textAlign:"left", marginBottom:24 }}>
        {exercises.slice(0,4).map((ex,i) => (
          <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<3?"1px solid #1e1e2e":"none" }}>
            <span style={{ fontSize:12,color:"#c8c8d8" }}>{ex.name}</span>
            <span style={{ fontSize:11,color:program.color }}>{ex.dur[durationKey]}s</span>
          </div>
        ))}
        {exercises.length > 4 && <div style={{ fontSize:11,color:"#444458",paddingTop:7 }}>+ {exercises.length-4} more</div>}
      </div>
      <button className="ft-btn" onClick={() => setStarted(true)}
        style={{ background:program.color, color:["#ffeb3b","#c8f135","#ffd600","#f5a623"].includes(program.color)?"#0a0a0f":"#fff" }}>
        BEGIN SESSION
      </button>
    </div>
  );

  // ── Active session
  return (
    <div style={{ background:"#0a0a0f", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Top bar */}
      <div style={{ padding:"56px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onExit} style={{ background:"none",border:"none",cursor:"pointer",color:"#555570",display:"flex",alignItems:"center",gap:4,fontSize:13,fontFamily:"'DM Sans'" }}>
          {Icon.back} Exit
        </button>
        <div style={{ fontSize:12,color:"#555570" }}>{idx+1} / {exercises.length}</div>
        <div style={{ fontSize:12,color:program.color,fontFamily:"'Bebas Neue'",letterSpacing:".06em" }}>
          {fmtMSS(Math.max(0,totalTime-elapsed))} left
        </div>
      </div>

      {/* Overall progress dots */}
      <div style={{ display:"flex",gap:4,padding:"0 20px 20px" }}>
        {exercises.map((_,i) => (
          <div key={i} style={{ flex:1,height:3,borderRadius:2,transition:"all .3s",
            background: i<idx ? program.color : i===idx ? program.color : "#1e1e2e",
            opacity: i<idx ? 0.5 : 1 }}/>
        ))}
      </div>

      {/* Big timer ring */}
      <div style={{ flex:1, display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 20px 20px",gap:0 }}>
        <div style={{ position:"relative",width:160,height:160,marginBottom:28 }}>
          <svg width="160" height="160" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none" stroke="#1a1a2e" strokeWidth="8"/>
            <circle cx="64" cy="64" r="54" fill="none"
              stroke={resting ? "#6c63ff" : program.color}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ*(1-progress)}
              style={{ transform:"rotate(-90deg)", transformOrigin:"center", transition:"stroke-dashoffset 0.9s linear, stroke 0.3s" }}/>
          </svg>
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            {resting ? (
              <>
                <div style={{ fontFamily:"'Bebas Neue'",fontSize:42,color:"#6c63ff",lineHeight:1 }}>{restLeft}</div>
                <div style={{ fontSize:11,color:"#6c63ff",letterSpacing:".1em",textTransform:"uppercase" }}>rest</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily:"'Bebas Neue'",fontSize:52,color:"#e8e8f0",lineHeight:1 }}>{timeLeft}</div>
                <div style={{ fontSize:11,color:"#555570",letterSpacing:".08em",textTransform:"uppercase" }}>sec</div>
              </>
            )}
          </div>
        </div>

        {/* Exercise info */}
        <div key={`${idx}-${resting}`} className="ft-slide-up" style={{ textAlign:"center",width:"100%",maxWidth:340 }}>
          {resting ? (
            <div>
              <div style={{ fontSize:11,color:"#6c63ff",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10 }}>Up next</div>
              <div className="ft-heading" style={{ fontSize:26 }}>{next?.name.toUpperCase()}</div>
              <div style={{ fontSize:12,color:"#555570",marginTop:6 }}>Get into position</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:10,color:program.color,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10,fontWeight:700 }}>
                {durationKey === "deep" ? "DEEP HOLD" : durationKey === "standard" ? "HOLD" : "QUICK HOLD"}
              </div>
              <div className="ft-heading" style={{ fontSize:28,marginBottom:14,lineHeight:1.1 }}>
                {current?.name.toUpperCase()}
              </div>
              <div style={{ fontSize:13,color:"#aaa8c0",lineHeight:1.65,marginBottom:12 }}>
                {current?.cue}
              </div>
              <div style={{ fontSize:12,color:program.color,fontStyle:"italic",background:`${program.color}10`,padding:"8px 14px",borderRadius:10,lineHeight:1.5 }}>
                🌬 {current?.breathe}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display:"flex",gap:12,marginTop:28,width:"100%" }}>
          <button onClick={() => setPaused(p=>!p)}
            style={{ flex:2,padding:"15px",borderRadius:12,border:`1.5px solid ${paused?program.color:"#333350"}`,cursor:"pointer",fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:".1em",transition:"all .2s",
              background:paused?program.color:"transparent",color:paused?"#0a0a0f":program.color }}>
            {paused ? "▶  RESUME" : "⏸  PAUSE"}
          </button>
          <button onClick={skip}
            style={{ flex:1,padding:"15px",borderRadius:12,border:"1.5px solid #1e1e2e",background:"transparent",cursor:"pointer",fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:".1em",color:"#444458" }}>
            SKIP ›
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Bend-style Stretches Screen ─────────────────────────────────────────
function StretchesScreen() {
  const [streak, setStreak] = useStorage("fittrack_stretch_streak", { count:0, lastDate:null });
  const [completedToday, setCompletedToday] = useStorage("fittrack_stretch_today", []);
  const [activeSession, setActiveSession] = useState(null); // { program, durationKey }
  const [view, setView]     = useState("home"); // "home" | "program"
  const [selectedProg, setSelectedProg] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const handleComplete = () => {
    // Update streak
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yKey = yesterday.toISOString().split("T")[0];
    const newStreak = (streak.lastDate === today) ? streak.count :
                      (streak.lastDate === yKey)  ? streak.count + 1 : 1;
    setStreak({ count: newStreak, lastDate: today });
    setCompletedToday(prev => [...new Set([...prev, activeSession.program.id])]);
    setActiveSession(null);
  };

  if (activeSession) {
    return <BendSession
      program={activeSession.program}
      durationKey={activeSession.durationKey}
      onComplete={handleComplete}
      onExit={() => setActiveSession(null)}
    />;
  }

  if (selectedProg) {
    const done = completedToday.includes(selectedProg.id);
    return (
      <div className="ft-screen ft-slide-up">
        <button onClick={() => setSelectedProg(null)} style={{ background:"none",border:"none",cursor:"pointer",color:selectedProg.color,display:"flex",alignItems:"center",gap:6,marginBottom:20,fontSize:13,fontFamily:"'DM Sans'" }}>
          {Icon.back} All routines
        </button>

        {/* Hero */}
        <div style={{ background:selectedProg.bg,borderRadius:22,padding:"24px 20px",marginBottom:20,border:`1.5px solid ${selectedProg.color}33`,position:"relative",overflow:"hidden" }}>
          {done && <div style={{ position:"absolute",top:14,right:14,fontSize:10,background:"rgba(200,241,53,.15)",color:"#c8f135",padding:"3px 10px",borderRadius:100,fontWeight:700,letterSpacing:".08em" }}>✓ DONE TODAY</div>}
          <div style={{ fontSize:52,marginBottom:12 }}>{selectedProg.emoji}</div>
          <div className="ft-heading" style={{ fontSize:30,marginBottom:6 }}>{selectedProg.name.toUpperCase()}</div>
          <div style={{ fontSize:13,color:selectedProg.color,marginBottom:10,fontWeight:600 }}>{selectedProg.tagline}</div>
          <div style={{ fontSize:12,color:"#aaa8c0",lineHeight:1.6 }}>{selectedProg.benefit}</div>
        </div>

        {/* Duration selector */}
        <div style={{ fontSize:11,color:"#888899",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12 }}>Choose Duration</div>
        {DURATION_OPTIONS.map(d => {
          const exList = selectedProg[d.key].map(n => STRETCH_LIBRARY[n]).filter(Boolean);
          const totalSecs = exList.reduce((s,e) => s+e.dur[d.key], 0) + Math.max(0,exList.length-1)*REST_S;
          const mins = Math.ceil(totalSecs/60);
          return (
            <div key={d.key} onClick={() => setActiveSession({ program:selectedProg, durationKey:d.key })}
              style={{ background:"#13131e",border:`1.5px solid ${d.color}33`,borderRadius:16,padding:"16px 18px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all .15s" }}
              onMouseDown={e => e.currentTarget.style.transform="scale(.98)"} onMouseUp={e => e.currentTarget.style.transform=""}>
              <div style={{ width:48,height:48,borderRadius:12,background:`${d.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <div style={{ fontFamily:"'Bebas Neue'",fontSize:20,color:d.color,lineHeight:1,textAlign:"center" }}>{mins}<div style={{ fontSize:9,letterSpacing:".04em" }}>MIN</div></div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Bebas Neue'",fontSize:20,letterSpacing:".06em",color:"#e8e8f0" }}>{d.label.toUpperCase()}</div>
                <div style={{ fontSize:11,color:"#888899",marginTop:2 }}>{exList.length} exercises · {d.sub}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          );
        })}

        {/* Exercise preview */}
        <div style={{ fontSize:11,color:"#888899",textTransform:"uppercase",letterSpacing:".08em",margin:"18px 0 10px" }}>What's included (standard)</div>
        <div className="ft-card">
          {selectedProg.standard.map((name,i) => {
            const ex = STRETCH_LIBRARY[name];
            return ex ? (
              <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<selectedProg.standard.length-1?"1px solid #1e1e2e":"none" }}>
                <span style={{ fontSize:12,color:"#c8c8d8" }}>{ex.name}</span>
                <span style={{ fontSize:11,color:selectedProg.color }}>{ex.dur.standard}s</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  }

  // ── Home view
  const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  const featured = STRETCH_PROGRAMS.find(p => p.id === "full-body");
  const dailySuggestion = STRETCH_PROGRAMS[new Date().getDay() % STRETCH_PROGRAMS.length];

  return (
    <div className="ft-screen ft-slide-up">
      {/* Header with streak */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <div className="ft-tag" style={{ marginBottom:8 }}>Daily Practice</div>
          <h1 className="ft-heading" style={{ fontSize:36,lineHeight:1 }}>STRETCH</h1>
        </div>
        {streak.count > 0 && (
          <div style={{ textAlign:"center",background:"rgba(255,152,0,.12)",border:"1.5px solid rgba(255,152,0,.3)",borderRadius:12,padding:"10px 14px" }}>
            <div style={{ fontSize:22 }}>🔥</div>
            <div style={{ fontFamily:"'Bebas Neue'",fontSize:24,color:"#ff9800",lineHeight:1 }}>{streak.count}</div>
            <div style={{ fontSize:9,color:"#888899",letterSpacing:".08em",textTransform:"uppercase" }}>day streak</div>
          </div>
        )}
      </div>

      {/* Today's pick */}
      <div style={{ fontSize:11,color:"#888899",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10 }}>Today's Pick · {todayName}</div>
      <div onClick={() => setSelectedProg(dailySuggestion)}
        style={{ background:dailySuggestion.bg,border:`1.5px solid ${dailySuggestion.color}44`,borderRadius:20,padding:"20px",marginBottom:20,cursor:"pointer" }}
        onMouseDown={e=>e.currentTarget.style.transform="scale(.98)"} onMouseUp={e=>e.currentTarget.style.transform=""}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ fontSize:44 }}>{dailySuggestion.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10,color:dailySuggestion.color,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:4 }}>Recommended</div>
            <div className="ft-heading" style={{ fontSize:24,marginBottom:4 }}>{dailySuggestion.name.toUpperCase()}</div>
            <div style={{ fontSize:11,color:"#888899" }}>{dailySuggestion.tagline}</div>
          </div>
          {completedToday.includes(dailySuggestion.id)
            ? <div style={{ width:32,height:32,borderRadius:"50%",background:"#c8f135",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
              </div>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dailySuggestion.color} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          }
        </div>
        {/* Quick-start buttons */}
        <div style={{ display:"flex",gap:8,marginTop:14 }}>
          {DURATION_OPTIONS.map(d => (
            <button key={d.key} onClick={e => { e.stopPropagation(); setActiveSession({program:dailySuggestion,durationKey:d.key}); }}
              style={{ flex:1,padding:"9px 4px",borderRadius:10,border:`1.5px solid ${d.color}44`,background:`${d.color}10`,cursor:"pointer",fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:".08em",color:d.color,transition:"all .15s" }}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* All routines grid */}
      <div style={{ fontSize:11,color:"#888899",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12 }}>All Routines</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
        {STRETCH_PROGRAMS.map(prog => {
          const done = completedToday.includes(prog.id);
          return (
            <div key={prog.id} onClick={() => setSelectedProg(prog)}
              style={{ background:prog.bg,border:`1.5px solid ${done?prog.color:prog.color+"33"}`,borderRadius:16,padding:"16px 14px",cursor:"pointer",transition:"transform .15s",position:"relative" }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"} onMouseUp={e=>e.currentTarget.style.transform=""}>
              {done && (
                <div style={{ position:"absolute",top:10,right:10,width:18,height:18,borderRadius:"50%",background:"#c8f135",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                </div>
              )}
              <div style={{ fontSize:30,marginBottom:8 }}>{prog.emoji}</div>
              <div style={{ fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:".04em",marginBottom:3,color:"#e8e8f0" }}>{prog.name}</div>
              <div style={{ fontSize:10,color:"#888899",lineHeight:1.4 }}>{prog.tagline}</div>
              <div style={{ fontSize:9,color:prog.color,marginTop:6,fontWeight:700 }}>5–15 min</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// CARDIO SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const CARDIO_TYPES = [
  { id:"running",    label:"Running",      emoji:"🏃", color:"#ff6b6b", unit:"km" },
  { id:"cycling",    label:"Cycling",      emoji:"🚴", color:"#f5a623", unit:"km" },
  { id:"swimming",   label:"Swimming",     emoji:"🏊", color:"#4ecdc4", unit:"km" },
  { id:"walking",    label:"Walking",      emoji:"🚶", color:"#c8f135", unit:"km" },
  { id:"rowing",     label:"Rowing",       emoji:"🚣", color:"#6c63ff", unit:"km" },
  { id:"hiit",       label:"HIIT",         emoji:"⚡", color:"#ff4d4d", unit:null  },
  { id:"elliptical", label:"Elliptical",   emoji:"🔄", color:"#00bcd4", unit:"km" },
  { id:"stairmaster",label:"Stair Master", emoji:"🪜", color:"#c17fe0", unit:null  },
  { id:"jump-rope",  label:"Jump Rope",    emoji:"⏰", color:"#38b87c", unit:null  },
  { id:"golf-walk",  label:"Golf Walk",    emoji:"⛳", color:"#4caf50", unit:"km" },
  { id:"kayaking",   label:"Kayaking",     emoji:"🛶", color:"#00897b", unit:"km" },
  { id:"other",      label:"Other",        emoji:"🏅", color:"#888899", unit:null  },
];

const QUICK_TIMES = [15, 20, 30, 45, 60, 90];

function CardioScreen({ onSave }) {
  const [cardioLogs, setCardioLogs] = useStorage("fittrack_cardio", []);
  const [step, setStep] = useState("type");
  const [selectedType, setSelectedType] = useState(null);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("00");
  const [distance, setDistance] = useState("");
  const [distUnit, setDistUnit] = useState("km");
  const [effort, setEffort] = useState(null);
  const [note, setNote] = useState("");

  const reset = () => {
    setStep("type"); setSelectedType(null); setMinutes(""); setSeconds("00");
    setDistance(""); setEffort(null); setNote("");
  };

  const fmtDuration = (mins, secs) => {
    const m = parseInt(mins||0), s = parseInt(secs||0);
    if (m === 0 && s === 0) return "--";
    if (s === 0) return `${m} min`;
    return `${m}m ${s}s`;
  };

  const estimateCals = (type, mins) => {
    const m = parseInt(mins||0); if (!m) return null;
    const mets = { running:9, cycling:7, swimming:8, walking:4, rowing:8, hiit:10, elliptical:6, stairmaster:9, "jump-rope":11, "golf-walk":4, kayaking:5, other:6 };
    return Math.round((mets[type.id]||6) * 75 * (m/60));
  };

  const handleSave = () => {
    const totalMins = parseInt(minutes||0) + parseInt(seconds||0)/60;
    if (!selectedType || totalMins <= 0) return;
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      typeId: selectedType.id, typeName: selectedType.label,
      emoji: selectedType.emoji, color: selectedType.color,
      minutes: parseInt(minutes||0), seconds: parseInt(seconds||0),
      distance: distance ? parseFloat(distance) : null,
      distUnit, effort, note: note.trim(),
    };
    setCardioLogs([entry, ...cardioLogs]);
    onSave({
      id: entry.id, name: `${selectedType.emoji} ${selectedType.label}`,
      group: "Cardio", date: entry.date,
      exercises: [{ name: selectedType.label, sets:"1",
        reps: `${entry.minutes}m${entry.seconds>0?` ${entry.seconds}s`:""}${entry.distance?` · ${entry.distance}${distUnit}`:""}`,
        weight:"" }],
    });
    setStep("done");
  };

  if (step === "done") {
    const last = cardioLogs[0];
    return (
      <div className="ft-screen ft-slide-up" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:12 }}>
        <div style={{ fontSize:64 }}>{selectedType?.emoji}</div>
        <h1 className="ft-heading" style={{ fontSize:36 }}>LOGGED!</h1>
        <div style={{ fontSize:14, color:"#888899" }}>{selectedType?.label}</div>
        <div style={{ display:"flex", gap:20, marginTop:6 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:"#c8f135" }}>{fmtDuration(minutes, seconds)}</div>
            <div style={{ fontSize:11, color:"#555570" }}>Duration</div>
          </div>
          {distance && <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:"#c8f135" }}>{distance}{distUnit}</div>
            <div style={{ fontSize:11, color:"#555570" }}>Distance</div>
          </div>}
          {effort && <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28 }}>{"😌🙂😤😰🔥"[effort-1]}</div>
            <div style={{ fontSize:11, color:"#555570" }}>Effort</div>
          </div>}
        </div>
        <button className="ft-btn" style={{ marginTop:16 }} onClick={reset}>Log Another</button>
      </div>
    );
  }

  if (step === "log" && selectedType) {
    const cals = estimateCals(selectedType, minutes);
    return (
      <div className="ft-screen ft-slide-up">
        <button onClick={() => setStep("type")} style={{ background:"none", border:"none", cursor:"pointer", color:"#c8f135", display:"flex", gap:4, alignItems:"center", fontSize:13, fontFamily:"'DM Sans'", marginBottom:20 }}>
          {Icon.back} Change activity
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24, padding:"16px 18px", borderRadius:16, background:`${selectedType.color}11`, border:`1.5px solid ${selectedType.color}33` }}>
          <span style={{ fontSize:42 }}>{selectedType.emoji}</span>
          <div>
            <div className="ft-heading" style={{ fontSize:28 }}>{selectedType.label.toUpperCase()}</div>
            <div style={{ fontSize:11, color:"#888899", marginTop:2 }}>{new Date().toLocaleDateString("en-GB",{ weekday:"long", day:"numeric", month:"long" })}</div>
          </div>
        </div>

        {/* Duration */}
        <div style={{ fontSize:12, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Duration</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          {QUICK_TIMES.map(t => (
            <button key={t} className={`time-btn ${parseInt(minutes||0)===t&&seconds==="00"?"sel":""}`}
              onClick={() => { setMinutes(String(t)); setSeconds("00"); }}>
              {t < 60 ? `${t} min` : `${t/60}hr`}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:22, alignItems:"center" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:"#555570", marginBottom:4 }}>Minutes</div>
            <input className="ft-input" type="number" placeholder="0" value={minutes}
              onChange={e => setMinutes(e.target.value)} style={{ textAlign:"center", fontSize:24, fontFamily:"'Bebas Neue'", letterSpacing:".04em" }}/>
          </div>
          <div style={{ color:"#555570", fontSize:24, paddingTop:18, fontWeight:300 }}>:</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:"#555570", marginBottom:4 }}>Seconds</div>
            <input className="ft-input" type="number" placeholder="00" min="0" max="59" value={seconds}
              onChange={e => setSeconds(e.target.value)} style={{ textAlign:"center", fontSize:24, fontFamily:"'Bebas Neue'", letterSpacing:".04em" }}/>
          </div>
          {cals && (
            <div style={{ textAlign:"center", paddingTop:18, minWidth:52 }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:selectedType.color, lineHeight:1 }}>{cals}</div>
              <div style={{ fontSize:9, color:"#555570" }}>~kcal</div>
            </div>
          )}
        </div>

        {/* Distance */}
        {selectedType.unit && (
          <>
            <div style={{ fontSize:12, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>
              Distance <span style={{ color:"#444458", textTransform:"none", fontWeight:400, fontSize:11 }}>(optional)</span>
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:22, alignItems:"center" }}>
              <input className="ft-input" type="number" placeholder="0.0" value={distance}
                onChange={e => setDistance(e.target.value)} style={{ flex:2, textAlign:"center", fontSize:24, fontFamily:"'Bebas Neue'", letterSpacing:".04em" }}/>
              <div style={{ display:"flex", gap:6 }}>
                {["km","mi"].map(u => (
                  <button key={u} onClick={() => setDistUnit(u)}
                    style={{ padding:"12px 16px", borderRadius:10, border:`1.5px solid ${distUnit===u?selectedType.color:"#1e1e2e"}`,
                      background:distUnit===u?`${selectedType.color}15`:"#13131e", cursor:"pointer", fontSize:13, fontWeight:600,
                      color:distUnit===u?selectedType.color:"#555570", fontFamily:"'DM Sans'" }}>{u}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Effort */}
        <div style={{ fontSize:12, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>
          Effort <span style={{ color:"#444458", textTransform:"none", fontWeight:400, fontSize:11 }}>(optional)</span>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:22 }}>
          {[{val:1,label:"Easy",emoji:"😌"},{val:2,label:"Light",emoji:"🙂"},{val:3,label:"Moderate",emoji:"😤"},{val:4,label:"Hard",emoji:"😰"},{val:5,label:"Max",emoji:"🔥"}].map(e => (
            <button key={e.val} onClick={() => setEffort(effort===e.val?null:e.val)}
              style={{ flex:1, padding:"10px 4px", borderRadius:10, border:`1.5px solid ${effort===e.val?selectedType.color:"#1e1e2e"}`,
                background:effort===e.val?`${selectedType.color}15`:"#13131e", cursor:"pointer", textAlign:"center", transition:"all .15s" }}>
              <div style={{ fontSize:20 }}>{e.emoji}</div>
              <div style={{ fontSize:9, color:effort===e.val?selectedType.color:"#555570", marginTop:3, fontWeight:600 }}>{e.label}</div>
            </button>
          ))}
        </div>

        {/* Note */}
        <div style={{ fontSize:12, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>
          Note <span style={{ color:"#444458", textTransform:"none", fontWeight:400, fontSize:11 }}>(optional)</span>
        </div>
        <input className="ft-input" placeholder="e.g. Felt strong, new route, intervals…"
          value={note} onChange={e => setNote(e.target.value)} style={{ marginBottom:24 }}/>

        <button className="ft-btn" onClick={handleSave} disabled={!minutes || parseInt(minutes) <= 0}
          style={{ background:selectedType.color, color:["#c8f135","#f5a623","#ffeb3b"].includes(selectedType.color)?"#0a0a0f":"#fff" }}>
          SAVE CARDIO
        </button>
      </div>
    );
  }

  // Type picker + history
  const recentLogs = cardioLogs.slice(0, 5);
  const totalThisWeek = (() => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
    return cardioLogs.filter(l => new Date(l.date) >= weekAgo).reduce((s,l) => s + l.minutes + (l.seconds||0)/60, 0);
  })();

  return (
    <div className="ft-screen ft-slide-up">
      <div className="ft-tag" style={{ marginBottom:8 }}>Quick Log</div>
      <h1 className="ft-heading" style={{ fontSize:36, marginBottom:4 }}>CARDIO</h1>
      <p style={{ fontSize:12, color:"#555570", marginBottom:20 }}>Choose an activity to log your session.</p>

      {totalThisWeek > 0 && (
        <div className="ft-card" style={{ padding:"14px 18px", marginBottom:20, display:"flex", gap:20, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>This Week</div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:32, color:"#c8f135", lineHeight:1 }}>
              {Math.round(totalThisWeek)}<span style={{ fontSize:14, color:"#888899", fontFamily:"'DM Sans'" }}> min</span>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", gap:3 }}>
              {Array.from({length:7},(_,i)=>{
                const d=new Date(); d.setDate(d.getDate()-(6-i));
                const key=d.toISOString().split("T")[0];
                const mins=cardioLogs.filter(l=>l.date===key).reduce((s,l)=>s+l.minutes+(l.seconds||0)/60,0);
                return <div key={i} style={{ flex:1, height:28, borderRadius:4, transition:"opacity .3s",
                  background:`rgba(200,241,53,${mins>0?Math.min(0.9,(mins/60)*0.8+0.2):0.1})` }}/>;
              })}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#444458", marginTop:4 }}>
              <span>7 days ago</span><span>Today</span>
            </div>
          </div>
        </div>
      )}

      <div className="cardio-type-grid">
        {CARDIO_TYPES.map(t => (
          <button key={t.id} className="cardio-type-btn" onClick={() => { setSelectedType(t); setStep("log"); }}>
            <div style={{ fontSize:30, marginBottom:6 }}>{t.emoji}</div>
            <div style={{ fontSize:13, fontWeight:600, color:"#e8e8f0" }}>{t.label}</div>
            {t.unit && <div style={{ fontSize:10, color:"#555570", marginTop:2 }}>+ distance</div>}
          </button>
        ))}
      </div>

      {recentLogs.length > 0 && (
        <>
          <div style={{ fontSize:11, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Recent</div>
          <div className="ft-card">
            {recentLogs.map((log) => (
              <div key={log.id} className="cardio-history-row">
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{log.emoji}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#e8e8f0" }}>{log.typeName}</div>
                    <div style={{ fontSize:11, color:"#555570" }}>
                      {new Date(log.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
                      {log.effort ? ` · ${"😌🙂😤😰🔥"[log.effort-1]}` : ""}
                      {log.note ? ` · ${log.note.slice(0,30)}` : ""}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:log.color, lineHeight:1 }}>
                    {fmtDuration(log.minutes, log.seconds||0)}
                  </div>
                  {log.distance && <div style={{ fontSize:11, color:"#888899" }}>{log.distance}{log.distUnit}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CABLE MACHINE — DATA & SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const CABLE_TUTORIALS = {
  // CHEST
  "Cable Crossover (High)":       { muscles:"Pec major (lower fibres), anterior deltoid", sets:"3-4", reps:"12-15", attach:"Stirrups high", how:"Set pulleys above shoulder height. Step forward, arms wide, pull handles together in a hugging arc. Hands meet at hips.", tip:"Keep a soft elbow bend throughout. Squeeze the chest hard at the point where the hands meet." },
  "Cable Crossover (Low)":        { muscles:"Pec major (upper fibres), anterior deltoid", sets:"3-4", reps:"12-15", attach:"Stirrups low", how:"Set pulleys at ankle height. Pull handles upward and together, finishing at chest height with hands meeting.", tip:"The upward angle shifts emphasis to the upper chest. Lead with your elbows, not your hands." },
  "Cable Chest Fly (Mid)":        { muscles:"Pec major, anterior deltoid", sets:"3", reps:"12-15", attach:"Stirrups mid", how:"Pulleys at chest height. One-step stagger stance. Pull both handles together in a wide hugging arc, hands meeting at chest height.", tip:"Imagine you're hugging a large barrel. The stretch at the start is as valuable as the contraction." },
  "Single Arm Cable Press":       { muscles:"Chest, triceps, anterior deltoid, core (anti-rotation)", sets:"3", reps:"10-12/side", attach:"Stirrup mid", how:"Stand sideways, one handle at shoulder height. Press forward in a horizontal arc, rotating slightly. Resist the rotation in your core.", tip:"The anti-rotation demand makes this a great unilateral core exercise as much as a chest press." },

  // BACK & PULLING
  "Seated Cable Row":             { muscles:"Lats, mid-traps, rhomboids, biceps", sets:"4", reps:"10-12", attach:"V-bar or stirrups low", how:"Sit facing the low pulley, feet braced. Pull the handle to your lower chest, driving elbows back and squeezing shoulder blades together.", tip:"Pause 1s at full retraction before a slow 3s return. Full stretch at the front — let the shoulders round slightly." },
  "Cable Straight-Arm Pulldown":  { muscles:"Lats, teres major, long head of triceps", sets:"3", reps:"12-15", attach:"Straight bar or rope high", how:"Face the high pulley, arms nearly straight with soft elbows. Pull the bar to your thighs in a big sweeping arc, keeping the arms extended.", tip:"This isolates the lats without bicep involvement. Think of 'pushing the bar into your thighs' rather than pulling." },
  "Cable High Row":               { muscles:"Mid-traps, rear delts, rhomboids", sets:"3", reps:"12-15", attach:"Rope or stirrups high", how:"Stand facing a high pulley. Pull the rope to your forehead, elbows flared high and wide. Like a face pull but with full range.", tip:"Drive the elbows back past your ears at the top. The higher the elbows, the more rear deltoid involvement." },
  "Single Arm Cable Row":         { muscles:"Lats, mid-back, biceps, core (anti-rotation)", sets:"3", reps:"10-12/side", attach:"Stirrup low", how:"Stand facing the low pulley. Row one handle to your hip, rotating the torso slightly. Resist the rotation on the return.", tip:"The rotation at the top mimics the lat engagement in the golf downswing. Excellent for rotational athletes." },
  "Cable Pull-Through":           { muscles:"Glutes, hamstrings, lower back (hip hinge pattern)", sets:"3", reps:"15", attach:"Rope low", how:"Stand facing away from the low pulley. Bend forward in a hip hinge, pulling the rope between your legs. Drive hips forward to stand.", tip:"Think of it as a cable kettlebell swing — the power comes from the hip drive, not pulling with your arms." },
  "Cable Pullover":               { muscles:"Lats, teres major, serratus anterior, long head triceps", sets:"3", reps:"12-15", attach:"Rope or bar high", how:"Face the high pulley, kneel or stand. With arms extended, pull the cable from overhead down to your thighs in a long arc.", tip:"Keep the arms nearly straight throughout. Full stretch overhead before the arc down." },

  // SHOULDERS
  "Cable Lateral Raise":          { muscles:"Medial deltoid, supraspinatus", sets:"3-4", reps:"12-15/side", attach:"Stirrup low", how:"Stand side-on, cable at ankle height. Raise the handle up and out to shoulder height with a slight elbow bend. Slow 3s descent.", tip:"The cable provides constant tension through the full range — better than dumbbells which lose tension at the top." },
  "Cable Front Raise":            { muscles:"Anterior deltoid, upper chest", sets:"3", reps:"12-15", attach:"Straight bar or stirrups low", how:"Face away from the pulley. Pull the bar forward and upward to shoulder height with straight arms.", tip:"Keep the shoulder blades pinned back. Don't let the traps shrug to compensate." },
  "Cable Face Pull":              { muscles:"Rear delts, external rotators, mid-traps", sets:"3-4", reps:"15-20", attach:"Rope high", how:"Pull the rope toward your face, spreading the ends outward. Elbows high and wide. External rotation at the peak.", tip:"The most important shoulder health exercise on the cable machine. 15–20 reps with controlled form every session." },
  "Cable Upright Row":            { muscles:"Medial deltoid, upper traps, biceps", sets:"3", reps:"12", attach:"Straight bar or EZ-bar low", how:"Stand facing the low pulley. Pull the bar up the front of your body, elbows leading, until bar reaches chin level.", tip:"Keep the bar close to your body throughout. Elbows should always be higher than the wrists." },
  "Cable Arnold Press (Single)":  { muscles:"All 3 deltoid heads, triceps", sets:"3", reps:"10/side", attach:"Stirrup mid", how:"Hold one handle at shoulder height, palm facing you. As you press overhead, rotate the palm forward. Reverse on descent.", tip:"The rotation recruits all three deltoid heads in one movement. Use lighter weight than a standard press." },

  // ARMS
  "Cable Bicep Curl":             { muscles:"Biceps brachii, brachialis", sets:"3", reps:"12-15", attach:"Straight bar or EZ-bar low", how:"Stand facing the low pulley. Curl the bar up to shoulder height with elbows fixed at your sides. Squeeze at the top.", tip:"The cable provides constant tension through the full range — the peak is as challenging as the mid-range." },
  "Cable Hammer Curl":            { muscles:"Brachialis, brachioradialis, biceps", sets:"3", reps:"12-15", attach:"Rope low", how:"Hold the rope ends with a neutral (hammer) grip. Curl up keeping the palms facing each other throughout. Don't let the elbows drift forward.", tip:"This builds the brachialis — the muscle that pushes the bicep peak up. Often undertrained." },
  "Cable Overhead Tricep Extension":{ muscles:"Triceps brachii (long head)", sets:"3", reps:"12-15", attach:"Rope high", how:"Face away from the high pulley. Hold the rope overhead with elbows pointing to the ceiling. Extend forearms forward.", tip:"The long head of the tricep is best worked when the arm is overhead. This targets what dips and pushdowns miss." },
  "Cable Tricep Pushdown":        { muscles:"Triceps brachii (lateral & medial heads)", sets:"3-4", reps:"12-15", attach:"Rope or straight bar high", how:"Face the high pulley. Keeping upper arms fixed at sides, push the handle down until arms are fully extended.", tip:"Using a rope lets you rotate the wrists outward at the bottom for a stronger contraction in the lateral head." },
  "Cable Reverse Curl":           { muscles:"Brachioradialis, biceps (long head), forearm extensors", sets:"3", reps:"12-15", attach:"Straight bar low", how:"Overhand grip (palms down). Curl the bar as normal. The forearm extensors and brachioradialis must work harder.", tip:"Builds forearm thickness and grip — directly relevant for golf club control." },

  // CORE & ROTATION
  "Cable Woodchop (High to Low)": { muscles:"Obliques, lats, glutes, rotational core", sets:"3-4", reps:"10-12/side", attach:"Stirrup or rope high", how:"Stand sideways to high pulley in split stance. Pull the handle diagonally down and across the body, rotating through the hips. Pivot the back foot.", tip:"The power comes from rotating through the hips, not just the arms. Perfect for golf-specific rotational strength." },
  "Cable Woodchop (Low to High)": { muscles:"Obliques, serratus anterior, shoulder", sets:"3", reps:"10-12/side", attach:"Stirrup or rope low", how:"Pull diagonally upward from ankle to opposite shoulder. Pivot back foot. Follow with the gaze.", tip:"Trains the same diagonal pattern as many golf shots and throwing sports." },
  "Pallof Press":                 { muscles:"Obliques, transverse abdominis, anti-rotation core", sets:"3", reps:"10-12/side", attach:"Stirrup mid", how:"Stand sideways to the pulley, handle at chest. Press straight out and hold 2–3s. Resist rotating toward the cable. Return.", tip:"The whole point is what you don't do — not rotating. The closer to the pulley, the harder it is." },
  "Pallof Press (Overhead)":      { muscles:"Serratus anterior, core stabilisers, shoulder", sets:"3", reps:"10/side", attach:"Stirrup mid", how:"Same as Pallof Press but press the handle overhead instead of forward. Resist lateral flexion and rotation.", tip:"Adds a shoulder stability challenge. Builds the overhead stability needed in the golf follow-through." },
  "Cable Russian Twist":          { muscles:"Obliques, rotational core, hip flexors", sets:"3", reps:"12/side", attach:"Stirrup mid", how:"Sit on the floor, cable to your side. Arms extended, rotate away from the pulley and back. Control both directions.", tip:"The cable adds resistance to the rotation — more effective than bodyweight for building rotational strength." },
  "Cable Crunch":                 { muscles:"Rectus abdominis, obliques", sets:"3", reps:"12-15", attach:"Rope high", how:"Kneel facing the high pulley, rope ends by your temples. Crunch down and forward, bringing elbows toward knees. Resist on the way back up.", tip:"Keep your hips still — all movement should come from the spine. Slow 3s return is where the real work happens." },
  "Rotational Cable Press":       { muscles:"Chest, anterior deltoid, obliques, core", sets:"3", reps:"10/side", attach:"Stirrup mid", how:"Stand sideways, cable at shoulder. Press forward and rotate through the torso as the arm extends. Core resists the twist.", tip:"Combines upper body pressing with rotation — directly mimics the power sequence in a golf swing." },

  // LEGS & GLUTES
  "Cable Squat":                  { muscles:"Quads, glutes, hamstrings, core", sets:"3", reps:"12-15", attach:"V-bar or rope low", how:"Stand facing the low pulley, feet shoulder-width. Hold the handle at chest. Squat to depth, using the cable as a counterbalance.", tip:"The counterbalance lets you sit upright more easily — great for mobility-limited squatters." },
  "Cable Romanian Deadlift":      { muscles:"Hamstrings, glutes, lower back", sets:"3", reps:"10-12", attach:"Straight bar or stirrups low", how:"Stand facing the low pulley, slight forward lean. Push hips back and lower the bar, keeping it close. Drive hips forward to stand.", tip:"Keep tension in the cable throughout the movement. The constant pull forces you to maintain a neutral spine." },
  "Cable Kickback":               { muscles:"Glutes, hamstrings", sets:"3", reps:"12-15/side", attach:"Ankle strap low", how:"Strap around ankle, face the pulley. On one leg, kick the strapped leg directly behind you, squeezing the glute at the top.", tip:"Keep your hips square and avoid rotating the pelvis. Short range, full glute squeeze." },
  "Cable Hip Abduction":          { muscles:"Glute medius, TFL, hip abductors", sets:"3", reps:"15/side", attach:"Ankle strap low", how:"Strap around one ankle, stand sideways. Lift the leg out to the side against the cable resistance. Slow return.", tip:"Essential for hip stability in the golf swing. Weak glute meds cause the hip to drop on the follow-through." },
  "Cable Lunge":                  { muscles:"Quads, glutes, hamstrings, hip flexors", sets:"3", reps:"10/side", attach:"Stirrup low", how:"Hold the handle at your chest. Step back into a lunge against the cable tension. The cable adds forward lean resistance.", tip:"The cable challenges your balance and core stability on top of the leg work." },
  "Cable Glute Kickback (Donkey)":{ muscles:"Glutes, core stability", sets:"3", reps:"15/side", attach:"Ankle strap low", how:"On all fours facing the pulley. Kick the strapped leg up and back. Keep hips level — don't rotate.", tip:"Isolates the glutes completely. Keep the knee bent 90° and focus on squeezing the glute at the top." },

  // FULL BODY / FUNCTIONAL
  "Cable Thruster":               { muscles:"Quads, glutes, deltoids, triceps, core", sets:"3", reps:"10", attach:"Stirrups low", how:"Clean two handles to shoulders. Squat deep, then drive up explosively — use that momentum to press the handles overhead.", tip:"The transition from squat to press should be one fluid movement powered by the leg drive." },
  "Cable Clean":                  { muscles:"Full posterior chain, traps, shoulders", sets:"3", reps:"8", attach:"Rope or stirrups low", how:"Hinge at hips, drive explosively through the hips and 'catch' the cable at shoulder height — pulling elbows high and through.", tip:"Teaches the same explosive hip extension needed in the golf downswing and any athletic sport." },
  "Kneeling Cable Chop":          { muscles:"Obliques, serratus, shoulder, hip flexors", sets:"3", reps:"10/side", attach:"Stirrup high", how:"Kneel on one knee facing perpendicular to the pulley. Pull the handle diagonally down and across. Tall kneeling — no leaning.", tip:"Kneeling removes the lower body — all the rotation comes from the core and hips." },
  "Cable Pull-Through (Single Leg)":{ muscles:"Glutes, hamstrings, core stability", sets:"3", reps:"10/side", attach:"Rope low", how:"Balance on one leg facing away from the cable. Hinge forward, let the cable pull between the legs, then drive the hip to stand.", tip:"The balance challenge adds a huge stabilisation demand — excellent for ankle-to-hip kinetic chain." },
  "Half-Kneeling Cable Press":    { muscles:"Chest, anterior deltoid, triceps, glutes, core", sets:"3", reps:"10/side", attach:"Stirrup mid", how:"Half-kneel sideways to the cable. Press the handle forward and slightly across the body. The hip-to-shoulder alignment is key.", tip:"The half-kneeling position forces a glute squeeze on the down knee — combines stability and pressing." },
  "Cable Romanian Deadlift (Single Leg)": { muscles:"Hamstrings, glutes, hip stabilisers", sets:"3", reps:"8-10/side", attach:"Stirrup low", how:"Balance on one leg, cable in opposite hand. Hinge back on the standing leg, letting the cable trail. Drive through the hip to stand.", tip:"Builds the single-leg posterior chain stability needed in the golf address and follow-through." },
};

const CABLE_ROUTINES = [
  {
    id:"cable-chest-shoulders",
    name:"Chest & Shoulders",
    emoji:"💪",
    category:"Push",
    color:"#e07b54",
    bg:"linear-gradient(135deg, #1e0c00 0%, #2e1200 100%)",
    goal:"Build chest width and shoulder roundness using constant cable tension that free weights can't match.",
    frequency:"2× per week, 48hr gap",
    duration:"40 min",
    exercises:[
      CABLE_TUTORIALS["Cable Crossover (High)"],
      CABLE_TUTORIALS["Cable Crossover (Low)"],
      CABLE_TUTORIALS["Cable Chest Fly (Mid)"],
      CABLE_TUTORIALS["Single Arm Cable Press"],
      CABLE_TUTORIALS["Cable Lateral Raise"],
      CABLE_TUTORIALS["Cable Face Pull"],
    ].map((t,i) => ({ ...t, id:i })),
  },
  {
    id:"cable-back-biceps",
    name:"Back & Biceps",
    emoji:"🔵",
    category:"Pull",
    color:"#63b3ed",
    bg:"linear-gradient(135deg, #000d1e 0%, #001428 100%)",
    goal:"Build a thick, wide back with constant cable tension. The variety of angles here can't be replicated with a barbell alone.",
    frequency:"2× per week",
    duration:"45 min",
    exercises:[
      CABLE_TUTORIALS["Seated Cable Row"],
      CABLE_TUTORIALS["Cable Straight-Arm Pulldown"],
      CABLE_TUTORIALS["Cable High Row"],
      CABLE_TUTORIALS["Single Arm Cable Row"],
      CABLE_TUTORIALS["Cable Pullover"],
      CABLE_TUTORIALS["Cable Bicep Curl"],
      CABLE_TUTORIALS["Cable Hammer Curl"],
    ].map((t,i) => ({ ...t, id:i })),
  },
  {
    id:"cable-arms",
    name:"Arms",
    emoji:"💪",
    category:"Arms",
    color:"#b794f4",
    bg:"linear-gradient(135deg, #0d0020 0%, #160030 100%)",
    goal:"Target the biceps, triceps, and forearms with constant cable tension for maximum muscle stimulus throughout the full range.",
    frequency:"1–2× per week",
    duration:"35 min",
    exercises:[
      CABLE_TUTORIALS["Cable Bicep Curl"],
      CABLE_TUTORIALS["Cable Hammer Curl"],
      CABLE_TUTORIALS["Cable Reverse Curl"],
      CABLE_TUTORIALS["Cable Tricep Pushdown"],
      CABLE_TUTORIALS["Cable Overhead Tricep Extension"],
    ].map((t,i) => ({ ...t, id:i })),
  },
  {
    id:"cable-shoulders-rehab",
    name:"Shoulder Health",
    emoji:"🛡️",
    category:"Rehab",
    color:"#68d391",
    bg:"linear-gradient(135deg, #001a0a 0%, #002814 100%)",
    goal:"Build the rotator cuff, rear delts, and scapular stabilisers that protect the shoulder joint. Essential for golfers and lifters.",
    frequency:"2–3× per week — pairs with any session",
    duration:"25 min",
    exercises:[
      CABLE_TUTORIALS["Cable Face Pull"],
      CABLE_TUTORIALS["Cable Lateral Raise"],
      CABLE_TUTORIALS["Cable High Row"],
      CABLE_TUTORIALS["Cable Upright Row"],
      CABLE_TUTORIALS["Cable Front Raise"],
    ].map((t,i) => ({ ...t, id:i })),
  },
  {
    id:"cable-core-rotation",
    name:"Core & Rotation",
    emoji:"🌀",
    category:"Core",
    color:"#f6ad55",
    bg:"linear-gradient(135deg, #1a0e00 0%, #2a1600 100%)",
    goal:"Build anti-rotation strength, oblique power, and the rotational mechanics that drive athletic performance — especially the golf swing.",
    frequency:"2–3× per week",
    duration:"30 min",
    exercises:[
      CABLE_TUTORIALS["Cable Woodchop (High to Low)"],
      CABLE_TUTORIALS["Cable Woodchop (Low to High)"],
      CABLE_TUTORIALS["Pallof Press"],
      CABLE_TUTORIALS["Pallof Press (Overhead)"],
      CABLE_TUTORIALS["Rotational Cable Press"],
      CABLE_TUTORIALS["Cable Crunch"],
    ].map((t,i) => ({ ...t, id:i })),
  },
  {
    id:"cable-legs-glutes",
    name:"Legs & Glutes",
    emoji:"🦵",
    category:"Lower",
    color:"#fc8181",
    bg:"linear-gradient(135deg, #1a0000 0%, #2a0404 100%)",
    goal:"Train the entire lower body with cable resistance — especially the glutes and posterior chain. The constant tension improves mind-muscle connection.",
    frequency:"2× per week",
    duration:"45 min",
    exercises:[
      CABLE_TUTORIALS["Cable Romanian Deadlift"],
      CABLE_TUTORIALS["Cable Squat"],
      CABLE_TUTORIALS["Cable Kickback"],
      CABLE_TUTORIALS["Cable Hip Abduction"],
      CABLE_TUTORIALS["Cable Lunge"],
      CABLE_TUTORIALS["Cable Pull-Through"],
    ].map((t,i) => ({ ...t, id:i })),
  },
  {
    id:"cable-full-body",
    name:"Full Body Power",
    emoji:"⚡",
    category:"Full Body",
    color:"#f6e05e",
    bg:"linear-gradient(135deg, #1a1600 0%, #2a2200 100%)",
    goal:"A compound full-body session that builds strength, power, and coordination. The cable allows seamless loading across all planes of motion.",
    frequency:"2× per week",
    duration:"50 min",
    exercises:[
      CABLE_TUTORIALS["Cable Clean"],
      CABLE_TUTORIALS["Cable Thruster"],
      CABLE_TUTORIALS["Seated Cable Row"],
      CABLE_TUTORIALS["Cable Woodchop (High to Low)"],
      CABLE_TUTORIALS["Cable Romanian Deadlift"],
      CABLE_TUTORIALS["Pallof Press"],
      CABLE_TUTORIALS["Cable Face Pull"],
    ].map((t,i) => ({ ...t, id:i })),
  },
  {
    id:"cable-golf-specific",
    name:"Golf Power",
    emoji:"⛳",
    category:"Golf",
    color:"#38b87c",
    bg:"linear-gradient(135deg, #001a0c 0%, #002818 100%)",
    goal:"Cable machine exercises that directly map to the golf swing mechanics — rotational strength, hip drive, anti-rotation stability, and upper body sequencing.",
    frequency:"2× per week in-season, 3× off-season",
    duration:"40 min",
    exercises:[
      CABLE_TUTORIALS["Cable Woodchop (High to Low)"],
      CABLE_TUTORIALS["Rotational Cable Press"],
      CABLE_TUTORIALS["Cable Pull-Through"],
      CABLE_TUTORIALS["Kneeling Cable Chop"],
      CABLE_TUTORIALS["Pallof Press"],
      CABLE_TUTORIALS["Cable Hip Abduction"],
      CABLE_TUTORIALS["Half-Kneeling Cable Press"],
      CABLE_TUTORIALS["Cable Face Pull"],
    ].map((t,i) => ({ ...t, id:i })),
  },
  {
    id:"cable-functional",
    name:"Functional Strength",
    emoji:"🏗️",
    category:"Functional",
    color:"#76e4f7",
    bg:"linear-gradient(135deg, #001820 0%, #002430 100%)",
    goal:"Train movement patterns rather than isolated muscles. Unilateral and rotational loading that builds real-world and athletic strength.",
    frequency:"2–3× per week",
    duration:"45 min",
    exercises:[
      CABLE_TUTORIALS["Half-Kneeling Cable Press"],
      CABLE_TUTORIALS["Single Arm Cable Row"],
      CABLE_TUTORIALS["Kneeling Cable Chop"],
      CABLE_TUTORIALS["Cable Romanian Deadlift (Single Leg)"],
      CABLE_TUTORIALS["Cable Pull-Through (Single Leg)"],
      CABLE_TUTORIALS["Pallof Press"],
      CABLE_TUTORIALS["Cable Lateral Raise"],
    ].map((t,i) => ({ ...t, id:i })),
  },
];

const CABLE_CATS = ["All","Push","Pull","Arms","Core","Lower","Full Body","Golf","Functional","Rehab"];

// ── Cable Session Runner ──────────────────────────────────────────────────────
function CableSessionRunner({ routine, onDone, onLog }) {
  const [checked, setChecked] = useState({});
  const [openEx, setOpenEx] = useState(null);

  const toggle = i => setChecked(c => ({ ...c, [i]: !c[i] }));
  const allDone = routine.exercises.every((_,i) => checked[i]);
  const doneCount = Object.values(checked).filter(Boolean).length;

  const InfoIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
  const CheckIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>;

  return (
    <div className="ft-screen ft-slide-up">
      <button onClick={onDone} style={{ background:"none",border:"none",cursor:"pointer",color:routine.color,display:"flex",gap:4,alignItems:"center",fontSize:13,fontFamily:"'DM Sans'",marginBottom:20 }}>
        {Icon.back} Back
      </button>

      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:6 }}>
        <span style={{ fontSize:30 }}>{routine.emoji}</span>
        <div>
          <div style={{ fontSize:10,color:routine.color,textTransform:"uppercase",letterSpacing:".08em",fontWeight:700,marginBottom:2 }}>Cable · {routine.category}</div>
          <h2 className="ft-heading" style={{ fontSize:24,lineHeight:1 }}>{routine.name.toUpperCase()}</h2>
        </div>
      </div>

      <div style={{ display:"flex",gap:14,fontSize:11,color:"#555570",marginBottom:14 }}>
        <span>⏱ {routine.duration}</span>
        <span>📅 {routine.frequency}</span>
      </div>

      <div style={{ fontSize:12,color:"#aaa8c0",lineHeight:1.6,marginBottom:16,background:`${routine.color}0d`,padding:"10px 14px",borderRadius:10,borderLeft:`3px solid ${routine.color}44` }}>
        {routine.goal}
      </div>

      {/* Progress */}
      <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"#555570",marginBottom:6 }}>
        <span>Session progress</span>
        <span style={{ color:routine.color }}>{doneCount}/{routine.exercises.length} done</span>
      </div>
      <div className="progress-bar-bg" style={{ marginBottom:18 }}>
        <div className="progress-bar-fill" style={{ width:`${doneCount/routine.exercises.length*100}%`,background:`linear-gradient(90deg,${routine.color},${routine.color}99)` }}/>
      </div>

      {routine.exercises.map((ex, i) => {
        const isOpen = openEx === i;
        const done = checked[i];
        return (
          <div key={i} style={{ background:"#13131e",borderRadius:14,marginBottom:10,border:`1.5px solid ${done?routine.color+"44":"#1e1e2e"}`,overflow:"hidden",transition:"border-color .3s" }}>
            <div className="cable-ex-row" style={{ padding:"14px" }}>
              {/* Check */}
              <div onClick={() => toggle(i)}
                style={{ width:26,height:26,borderRadius:"50%",border:`1.5px solid ${done?routine.color:"#333350"}`,background:done?routine.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1,transition:"all .2s" }}>
                {done && <CheckIcon/>}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:14,fontWeight:600,color:done?"#555570":"#e8e8f0",textDecoration:done?"line-through":"none",marginBottom:4 }}>{ex.name}</div>
                {/* Attachment */}
                <div style={{ fontSize:10,color:"#444458",marginBottom:5 }}>🔗 {ex.attach}</div>
                <div className="cable-set-badge" style={{ color:routine.color,background:`${routine.color}15` }}>{ex.sets} sets · {ex.reps}</div>
                <div style={{ fontSize:11,color:"#555570",marginTop:6,fontStyle:"italic",lineHeight:1.5 }}>{ex.tip}</div>
              </div>
              <button onClick={() => setOpenEx(isOpen ? null : i)}
                style={{ background:isOpen?`${routine.color}15`:"rgba(255,255,255,.06)",border:"none",cursor:"pointer",color:isOpen?routine.color:"#666680",borderRadius:6,padding:"6px 8px",display:"flex",alignItems:"center",gap:4,fontSize:11,fontFamily:"'DM Sans'",flexShrink:0 }}>
                <InfoIcon/> {isOpen?"Hide":"How to"}
              </button>
            </div>
            {isOpen && (
              <div style={{ padding:"0 14px 14px 52px",background:"#0f0f1a",borderTop:"1px solid #1e1e2e" }}>
                <div style={{ fontSize:10,color:routine.color,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6 }}>💪 {ex.muscles}</div>
                <div style={{ fontSize:12,color:"#c8c8d8",lineHeight:1.65,marginBottom:8 }}>{ex.how}</div>
                <div style={{ fontSize:11,background:"rgba(99,179,237,.07)",padding:"8px 10px",borderRadius:8,color:"#888899" }}>
                  <span style={{ color:routine.color,fontWeight:600 }}>💡 </span>{ex.tip}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {allDone && (
        <div className="ft-slide-up" style={{ marginTop:8 }}>
          <div style={{ textAlign:"center",padding:"14px 0 10px",color:routine.color,fontSize:14 }}>⭐ All exercises done — great work!</div>
          <button className="ft-btn" onClick={() => onLog(routine)}
            style={{ background:routine.color,color:["#f6e05e","#c8f135"].includes(routine.color)?"#0a0a0f":"#fff",marginBottom:10 }}>
            LOG THIS SESSION
          </button>
          <button className="ft-btn ft-btn-ghost" onClick={onDone}>Done</button>
        </div>
      )}
    </div>
  );
}

// ── Cable Main Screen ─────────────────────────────────────────────────────────
function CableScreen({ onLogWorkout }) {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [inSession, setInSession] = useState(false);

  const filtered = cat === "All" ? CABLE_ROUTINES : CABLE_ROUTINES.filter(r => r.category === cat);

  if (inSession && selected) {
    return (
      <CableSessionRunner
        routine={selected}
        onDone={() => setInSession(false)}
        onLog={r => {
          onLogWorkout({ name:`🔌 ${r.name}`, emoji:"🔌", group: r.category==="Lower"?"Legs":r.category==="Core"?"Core":"Full Body",
            exercises: r.exercises.map(e => ({ name:e.name, sets:e.sets, reps:e.reps, weight:"" })) });
          setInSession(false);
        }}
      />
    );
  }

  if (selected && !inSession) {
    return (
      <div className="ft-screen ft-slide-up">
        <button onClick={() => setSelected(null)} style={{ background:"none",border:"none",cursor:"pointer",color:selected.color,display:"flex",alignItems:"center",gap:6,marginBottom:20,fontSize:13,fontFamily:"'DM Sans'" }}>
          {Icon.back} All routines
        </button>

        {/* Hero */}
        <div style={{ background:selected.bg,borderRadius:20,padding:"22px 20px",marginBottom:20,border:`1.5px solid ${selected.color}33` }}>
          <div style={{ fontSize:40,marginBottom:10 }}>{selected.emoji}</div>
          <div style={{ fontSize:9,background:`${selected.color}22`,color:selected.color,padding:"3px 10px",borderRadius:100,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",display:"inline-block",marginBottom:10 }}>{selected.category}</div>
          <h2 className="ft-heading" style={{ fontSize:28,lineHeight:1.1,marginBottom:8 }}>{selected.name.toUpperCase()}</h2>
          <p style={{ fontSize:12,color:"#aaa8c0",lineHeight:1.6,marginBottom:14 }}>{selected.goal}</p>
          <div style={{ display:"flex",gap:16,fontSize:11,color:"#888899" }}>
            <span>⏱ {selected.duration}</span>
            <span>📅 {selected.frequency}</span>
            <span>📋 {selected.exercises.length} exercises</span>
          </div>
        </div>

        {/* Exercise list */}
        <div className="ft-card" style={{ marginBottom:16 }}>
          <div style={{ fontSize:11,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10 }}>Exercises</div>
          {selected.exercises.map((ex,i) => (
            <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<selected.exercises.length-1?"1px solid #1e1e2e":"none" }}>
              <div>
                <div style={{ fontSize:13,color:"#c8c8d8",fontWeight:500 }}>{ex.name}</div>
                <div style={{ fontSize:10,color:"#444458",marginTop:1 }}>🔗 {ex.attach}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11,color:selected.color,fontWeight:600 }}>{ex.sets} × {ex.reps}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="ft-btn" onClick={() => setInSession(true)}
          style={{ background:selected.color,color:["#f6e05e","#f6ad55","#c8f135"].includes(selected.color)?"#0a0a0f":"#fff" }}>
          START SESSION ▶
        </button>
      </div>
    );
  }

  return (
    <div className="ft-screen ft-slide-up">
      <div className="ft-tag" style={{ marginBottom:8 }}>Machine</div>
      <h1 className="ft-heading" style={{ fontSize:36,marginBottom:6 }}>CABLE MACHINE</h1>
      <p style={{ fontSize:12,color:"#555570",marginBottom:18 }}>
        {CABLE_ROUTINES.length} structured routines. Constant tension through full range — the cable machine's superpower over free weights.
      </p>

      {/* Category filter */}
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:20 }}>
        {CABLE_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ flexShrink:0,padding:"6px 14px",borderRadius:100,border:"1.5px solid",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans'",transition:"all .2s",
              background:cat===c?"#63b3ed":"transparent",borderColor:cat===c?"#63b3ed":"#1e1e2e",color:cat===c?"#0a0a0f":"#555570" }}>{c}</button>
        ))}
      </div>

      {filtered.map(r => (
        <div key={r.id} className="cable-routine-card" style={{ background:r.bg,border:`1.5px solid ${r.color}33` }} onClick={() => setSelected(r)}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:32 }}>{r.emoji}</span>
              <div>
                <div style={{ fontSize:9,background:`${r.color}22`,color:r.color,padding:"2px 8px",borderRadius:100,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",display:"inline-block",marginBottom:4 }}>{r.category}</div>
                <div className="ft-heading" style={{ fontSize:20,lineHeight:1 }}>{r.name.toUpperCase()}</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <div style={{ fontSize:11,color:"#888899",lineHeight:1.5,marginBottom:10 }}>{r.goal.slice(0,110)}…</div>
          <div style={{ display:"flex",gap:14,fontSize:10,color:"#555570" }}>
            <span>⏱ {r.duration}</span>
            <span>{r.exercises.length} exercises</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── WORKOUT SCHEDULER ─────────────────────────────────────────────────────────
const SCHED_COLORS = ["#c8f135","#6c63ff","#f5a623","#ff6b6b","#4ecdc4","#c17fe0","#38b87c","#ff9800","#63b3ed","#e91e63"];

function SchedulerScreen({ workouts, onNavigateToLog, routinesAll }) {
  const [schedule, setSchedule] = useStorage("fittrack_schedule", {});
  const [weekOffset, setWeekOffset] = useState(0);
  const [picking, setPicking] = useState(null); // date string picking for
  const [search, setSearch] = useState("");

  // Build the 7-day window
  const getWeekDays = (offset) => Array.from({length:7}, (_,i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1 + i + offset * 7); // Mon-Sun
    return d.toISOString().split("T")[0];
  });

  const days = getWeekDays(weekOffset);
  const todayKey = new Date().toISOString().split("T")[0];
  const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  // All plannable sources: routines + recent workout names
  const allItems = [
    ...routinesAll.map(r => ({ id:r.id, name:r.name, emoji:r.emoji, category:r.category, color:r.color||"#c8f135" })),
    ...Array.from(new Set(workouts.map(w=>w.name))).map(n => ({ id:`w-${n}`, name:n, emoji:"💪", category:"Custom", color:"#888899" })),
  ];

  const filtered = allItems.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));

  const addToDay = (dateKey, item) => {
    const existing = schedule[dateKey] || [];
    const colorIdx = Object.values(schedule).flat().length % SCHED_COLORS.length;
    setSchedule({ ...schedule, [dateKey]: [...existing, { ...item, schColor: SCHED_COLORS[colorIdx] }] });
    setPicking(null);
    setSearch("");
  };

  const removeFromDay = (dateKey, idx) => {
    const updated = (schedule[dateKey]||[]).filter((_,i)=>i!==idx);
    setSchedule({ ...schedule, [dateKey]: updated });
  };

  const weekLabel = () => {
    if (weekOffset === 0) return "This Week";
    if (weekOffset === 1) return "Next Week";
    if (weekOffset === -1) return "Last Week";
    const start = new Date(days[0]);
    return start.toLocaleDateString("en-GB",{day:"numeric",month:"short"});
  };

  // Completion check — did a logged workout match this scheduled item on this day?
  const isCompleted = (dateKey, item) =>
    workouts.some(w => w.date === dateKey && w.name.toLowerCase().includes(item.name.toLowerCase().slice(0,8)));

  return (
    <div className="ft-screen ft-slide-up" style={{ paddingBottom:100 }}>
      <div className="ft-tag" style={{ marginBottom:8 }}>Planning</div>
      <h1 className="ft-heading" style={{ fontSize:36, marginBottom:4 }}>SCHEDULE</h1>
      <p style={{ fontSize:12, color:"#555570", marginBottom:16 }}>Plan your week. Tap any day to add a session from your library.</p>

      {/* Week nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <button onClick={()=>setWeekOffset(w=>w-1)}
          style={{ background:"#13131e", border:"1px solid #1e1e2e", borderRadius:8, cursor:"pointer", padding:"8px 14px", color:"#888899", fontFamily:"'Bebas Neue'", fontSize:16 }}>‹ Prev</button>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:".06em", color: weekOffset===0?"#c8f135":"#e8e8f0" }}>{weekLabel()}</div>
        <button onClick={()=>setWeekOffset(w=>w+1)}
          style={{ background:"#13131e", border:"1px solid #1e1e2e", borderRadius:8, cursor:"pointer", padding:"8px 14px", color:"#888899", fontFamily:"'Bebas Neue'", fontSize:16 }}>Next ›</button>
      </div>

      {/* 7-day grid */}
      <div className="sched-grid">
        {days.map((dateKey, di) => {
          const isToday = dateKey === todayKey;
          const slots = schedule[dateKey] || [];
          const d = new Date(dateKey);
          return (
            <div key={dateKey} className={`sched-day ${isToday?"today":""}`}
              style={{ borderColor: isToday?"#c8f135":"#1e1e2e" }}>
              {/* Day header */}
              <div style={{ fontSize:9, fontWeight:700, color:isToday?"#c8f135":"#555570", textTransform:"uppercase", letterSpacing:".06em", marginBottom:3 }}>{DAY_LABELS[di]}</div>
              <div style={{ fontSize:11, color:isToday?"#c8f135":"#888899", fontWeight:600, marginBottom:6 }}>{d.getDate()}</div>
              {/* Scheduled sessions */}
              {slots.map((s, si) => {
                const done = isCompleted(dateKey, s);
                return (
                  <div key={si} className="sched-slot"
                    style={{ background:`${s.schColor}18`, color:done?"#4a7a20":s.schColor, textDecoration:done?"line-through":"none",
                      borderLeft:`2px solid ${s.schColor}`, paddingLeft:5, opacity:done?0.7:1 }}
                    onClick={() => removeFromDay(dateKey, si)}
                    title="Tap to remove">
                    {s.emoji} {s.name.slice(0,12)}
                  </div>
                );
              })}
              {/* Add button */}
              <div onClick={() => setPicking(picking===dateKey?null:dateKey)}
                style={{ marginTop:4, fontSize:14, color: picking===dateKey?"#c8f135":"#333350", cursor:"pointer", textAlign:"center", lineHeight:1 }}>
                {picking===dateKey?"✕":"+"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Picker panel */}
      {picking && (
        <div className="ft-card ft-slide-up" style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:"#888899", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>
            Add to {new Date(picking).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"short"})}
          </div>
          <input className="ft-input" placeholder="Search routines or workouts…"
            value={search} onChange={e=>setSearch(e.target.value)} style={{ marginBottom:12 }}/>
          <div style={{ maxHeight:220, overflowY:"auto" }}>
            {filtered.slice(0,30).map(item => (
              <div key={item.id} onClick={() => addToDay(picking, item)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0",
                  borderBottom:"1px solid #1e1e2e", cursor:"pointer" }}>
                <span style={{ fontSize:18 }}>{item.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:"#e8e8f0" }}>{item.name}</div>
                  <div style={{ fontSize:10, color:"#555570" }}>{item.category}</div>
                </div>
                <span style={{ fontSize:18, color:"#c8f135" }}>+</span>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ fontSize:12, color:"#444458", padding:"10px 0" }}>No matches</div>}
          </div>
        </div>
      )}

      {/* Upcoming sessions summary */}
      {(() => {
        const upcoming = days
          .filter(d => d >= todayKey)
          .flatMap(d => (schedule[d]||[]).map(s => ({ ...s, date:d })))
          .filter(s => !isCompleted(s.date, s))
          .slice(0,5);
        return upcoming.length > 0 ? (
          <div>
            <div style={{ fontSize:11, color:"#888899", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Up Next</div>
            <div className="ft-card">
              {upcoming.map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<upcoming.length-1?"1px solid #1e1e2e":"none" }}>
                  <span style={{ fontSize:20 }}>{s.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500, color:"#e8e8f0" }}>{s.name}</div>
                    <div style={{ fontSize:11, color:s.schColor }}>
                      {new Date(s.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
                    </div>
                  </div>
                  <button onClick={onNavigateToLog}
                    style={{ fontSize:11, padding:"5px 12px", borderRadius:8, background:"#c8f135", border:"none", cursor:"pointer", fontFamily:"'Bebas Neue'", letterSpacing:".06em", color:"#0a0a0f" }}>
                    LOG
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECOVERY SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const RECOVERY_PROTOCOLS = [
  {
    id: "post-hard",
    name: "Post Hard Session",
    subtitle: "After heavy lifting or intense cardio",
    emoji: "💪",
    color: "#ff6b6b",
    bg: "linear-gradient(135deg, #1e0404 0%, #2e0808 100%)",
    best: "Within 2 hours of training",
    duration: "~60 min",
    science: "Combining cold water with heat contrast maximises blood flow, reduces DOMS, and accelerates muscle protein synthesis. The pool flush removes metabolic waste; the sauna drives growth hormone.",
    phases: [
      {
        name: "Pool Flush",
        icon: "🏊", color: "#4ecdc4", duration: "10 min",
        steps: [
          { icon:"🏊", label:"Easy swim or walk", detail:"Low intensity only — flush the muscles, don't stress them. Focus on full range arm and leg movement.", duration:"10 min" },
        ]
      },
      {
        name: "Cold Contrast",
        icon: "🥶", color: "#63b3ed", duration: "10 min",
        steps: [
          { icon:"🥶", label:"Cold pool immersion", detail:"Get in the coldest water available. Submerge up to shoulders. Focus on controlled breathing — in through nose, out through mouth.", duration:"3 min" },
          { icon:"🔥", label:"Warm shower or hot tub", detail:"Raise your body temperature back up fully. Feel the vasodilation.", duration:"3 min" },
          { icon:"🥶", label:"Cold again", detail:"Second cold hit. Your body adapts faster the second time.", duration:"2 min" },
          { icon:"🔥", label:"Warm finish", detail:"Finish warm before the sauna.", duration:"2 min" },
        ]
      },
      {
        name: "Sauna",
        icon: "🔥", color: "#f5a623", duration: "20 min",
        steps: [
          { icon:"🔥", label:"Dry sauna — first round", detail:"Sit or lie on the upper bench. Aim for 80–90°C. Focus on deep diaphragmatic breathing. Sweat is the point.", duration:"10 min" },
          { icon:"🥤", label:"Cool down & hydrate", detail:"Step out, cool down with a cold shower. Drink at least 500ml of water or electrolyte drink.", duration:"3 min" },
          { icon:"🔥", label:"Sauna — second round", detail:"Return for a second round. Heart rate elevation here stimulates growth hormone release.", duration:"7 min" },
        ]
      },
      {
        name: "Steam Room",
        icon: "💨", color: "#c17fe0", duration: "10 min",
        steps: [
          { icon:"💨", label:"Steam room — respiratory focus", detail:"Steam is more humid than sauna — better for airways and skin. Breathe slowly and deeply. Great for loosening tight chest and upper body.", duration:"8 min" },
          { icon:"❄️", label:"Cold shower to close", detail:"End with cold to close the pores, reduce inflammation, and lock in recovery. 30–60 seconds is enough.", duration:"2 min" },
        ]
      },
      {
        name: "Cooldown Stretch",
        icon: "🧘", color: "#38b87c", duration: "10 min",
        steps: [
          { icon:"🧘", label:"Supine twist — both sides", detail:"Lie on your back, knee drops across body. The elevated core temperature makes this dramatically more effective.", duration:"60s/side" },
          { icon:"🧘", label:"Figure four stretch", detail:"Glute and piriformis release while the muscles are warm.", duration:"60s/side" },
          { icon:"🧘", label:"Child's pose", detail:"Full lower back decompression. Let everything go.", duration:"90s" },
          { icon:"🧘", label:"Legs up the wall", detail:"Passively drain lactic acid from the legs. The ultimate recovery position.", duration:"3 min" },
        ]
      },
    ],
  },
  {
    id: "active-recovery",
    name: "Active Recovery Day",
    subtitle: "Low-intensity movement to promote healing",
    emoji: "🌊",
    color: "#4ecdc4",
    bg: "linear-gradient(135deg, #041518 0%, #072228 100%)",
    best: "Day after intense training or on rest days",
    duration: "~45 min",
    science: "Active recovery increases blood flow to damaged muscle tissue without creating new damage. The pool is perfect — buoyancy reduces joint stress while water resistance keeps the heart rate elevated gently.",
    phases: [
      {
        name: "Pool — Easy Movement",
        icon: "🏊", color: "#4ecdc4", duration: "20 min",
        steps: [
          { icon:"🚶", label:"Pool walking or water jogging", detail:"Walk or jog slowly through waist-deep water. The resistance improves circulation without impact.", duration:"5 min" },
          { icon:"🏊", label:"Easy freestyle swimming", detail:"No push for pace. Focus on long, full strokes and controlled breathing. Stay aerobic — you should be able to hold a conversation.", duration:"10 min" },
          { icon:"🤸", label:"Pool mobility — leg swings & arm circles", detail:"Use the pool wall for stability. Swing legs forward/back and side/side. Circles with arms. The water's resistance makes these highly effective.", duration:"5 min" },
        ]
      },
      {
        name: "Steam Room",
        icon: "💨", color: "#c17fe0", duration: "15 min",
        steps: [
          { icon:"💨", label:"Steam room — 10 minutes", detail:"The humid heat loosens connective tissue and promotes lymphatic drainage. Focus on slow breathing into the belly.", duration:"10 min" },
          { icon:"🥤", label:"Hydrate", detail:"500ml+ of water. Add electrolytes if you trained hard the day before.", duration:"2 min" },
          { icon:"💨", label:"Final 5 minutes", detail:"Sit quietly. The steam room activates the parasympathetic nervous system — let your heart rate drop.", duration:"5 min" },
        ]
      },
      {
        name: "Cooldown",
        icon: "🧘", color: "#38b87c", duration: "10 min",
        steps: [
          { icon:"❄️", label:"Cool shower", detail:"Not freezing — just comfortably cool. Brings the body back to baseline.", duration:"2 min" },
          { icon:"🧘", label:"Full body stretching", detail:"Use the Stretch tab for the 5-minute Morning or Full Body routine while your muscles are warm.", duration:"8 min" },
        ]
      },
    ],
  },
  {
    id: "sauna-protocol",
    name: "Sauna Longevity Protocol",
    subtitle: "Heat adaptation for health & performance",
    emoji: "🔥",
    color: "#f5a623",
    bg: "linear-gradient(135deg, #1e1000 0%, #2e1800 100%)",
    best: "3–4× per week. Avoid within 4 hours of sleep.",
    duration: "~35 min",
    science: "Research shows 20+ min sauna sessions 4× weekly reduce cardiovascular mortality by 40%. Heat stress triggers heat shock proteins, growth hormone release, and neuroplasticity. This protocol follows Huberman Lab and Dr. Rhonda Patrick protocols.",
    phases: [
      {
        name: "Preparation",
        icon: "🥤", color: "#38b87c", duration: "5 min",
        steps: [
          { icon:"🥤", label:"Pre-sauna hydration", detail:"Drink 500ml of water before entering. Add a pinch of salt or electrolytes — you will sweat significantly.", duration:"5 min" },
        ]
      },
      {
        name: "Round 1",
        icon: "🔥", color: "#f5a623", duration: "12 min",
        steps: [
          { icon:"🔥", label:"Dry sauna — 80–90°C", detail:"Sit at mid-bench level. Focus on slow nasal breathing. Resist the urge to check your phone. Let your mind settle.", duration:"12 min" },
          { icon:"❄️", label:"Cold plunge or shower", detail:"Step out and go cold immediately. 1–2 minutes cold water or shower. This is where the contrast adaptation happens.", duration:"2 min" },
        ]
      },
      {
        name: "Round 2",
        icon: "🔥", color: "#f5a623", duration: "15 min",
        steps: [
          { icon:"🔥", label:"Sauna — upper bench", detail:"The upper bench is hotter. Stay for the full time — this is where growth hormone is most significantly elevated.", duration:"15 min" },
          { icon:"❄️", label:"Cold contrast", detail:"Cold shower or pool. Stay cold until you feel your heart rate drop — usually 1–3 minutes.", duration:"2 min" },
        ]
      },
      {
        name: "Round 3 (Optional)",
        icon: "🔥", color: "#ff9800", duration: "10 min",
        steps: [
          { icon:"🔥", label:"Final sauna round", detail:"Advanced users only. If you can maintain controlled breathing and feel strong, add a third round.", duration:"10 min" },
          { icon:"❄️", label:"Full cold finish", detail:"End with cold every time, never heat. This locks in the cardiovascular and neurological benefits.", duration:"2 min" },
        ]
      },
      {
        name: "Rehydrate",
        icon: "🥤", color: "#63b3ed", duration: "Ongoing",
        steps: [
          { icon:"🥤", label:"Post-sauna rehydration", detail:"Drink 1 litre of water slowly over the next 30 minutes. Replace sodium with food or electrolytes if you did multiple rounds.", duration:"30 min" },
        ]
      },
    ],
  },
  {
    id: "contrast-therapy",
    name: "Contrast Therapy",
    subtitle: "Hot/cold cycling for maximum recovery",
    emoji: "☯️",
    color: "#63b3ed",
    bg: "linear-gradient(135deg, #000d1e 0%, #001428 100%)",
    best: "Post-training or as a standalone recovery session",
    duration: "~30 min",
    science: "Alternating between heat vasodilation and cold vasoconstriction creates a 'vascular pumping' effect — rapidly flushing metabolites and delivering oxygen and nutrients to muscle tissue. More effective than either alone.",
    phases: [
      {
        name: "The Cycling Protocol",
        icon: "☯️", color: "#63b3ed", duration: "24 min",
        steps: [
          { icon:"🔥", label:"Sauna or steam — Round 1", detail:"3 minutes of heat. Get to a comfortably high internal temperature.", duration:"3 min" },
          { icon:"🥶", label:"Cold pool or shower — Round 1", detail:"Immediate immersion. Stay cold for at least 1 full minute. Control your breathing.", duration:"1 min" },
          { icon:"🔥", label:"Sauna or steam — Round 2", detail:"Back to heat. Your body acclimates faster on the second round.", duration:"3 min" },
          { icon:"🥶", label:"Cold — Round 2", detail:"Colder for longer this time. Push to 2 minutes if comfortable.", duration:"2 min" },
          { icon:"🔥", label:"Sauna or steam — Round 3", detail:"The longest heat phase. Your thermoregulation is now working hard — this is where the adaptation happens.", duration:"5 min" },
          { icon:"🥶", label:"Cold — Round 3", detail:"Hold 2 minutes. Breathe through the discomfort — nasal breathing keeps the nervous system calmer.", duration:"2 min" },
          { icon:"🔥", label:"Final heat", detail:"Last heat round. Focus on breathing, let your mind go quiet.", duration:"5 min" },
          { icon:"❄️", label:"Final cold — always end cold", detail:"Never end on heat — always finish cold. This is the rule. 1 minute minimum.", duration:"1 min" },
        ]
      },
      {
        name: "Recharge",
        icon: "🧘", color: "#38b87c", duration: "5 min",
        steps: [
          { icon:"🧘", label:"Seated rest", detail:"Sit quietly for 5 minutes before dressing. Let the cardiovascular system settle. Deep breathing only.", duration:"5 min" },
        ]
      },
    ],
  },
  {
    id: "morning-activation",
    name: "Morning Activation",
    subtitle: "Wake the body and prime for the day",
    emoji: "☀️",
    color: "#ffeb3b",
    bg: "linear-gradient(135deg, #1a1600 0%, #2a2200 100%)",
    best: "Before breakfast. Not after evening training.",
    duration: "~25 min",
    science: "Cold water in the morning triggers cortisol and adrenaline — healthy morning hormones that sharpen focus. A brief sauna hit raises core temperature, mimicking the body's natural rise that promotes wakefulness. Steam opens the airways.",
    phases: [
      {
        name: "Cold Pool or Shower",
        icon: "🥶", color: "#63b3ed", duration: "3 min",
        steps: [
          { icon:"🥶", label:"Cold immersion — face first", detail:"Submerge face briefly first — activates the mammalian dive reflex, instantly slowing heart rate. Then full body submersion.", duration:"3 min" },
        ]
      },
      {
        name: "Sauna",
        icon: "🔥", color: "#f5a623", duration: "10 min",
        steps: [
          { icon:"🔥", label:"Sauna — 10 minutes", detail:"After cold, the heat feels dramatic. This contrast is what wakes the nervous system fully. Better than caffeine for alert focus.", duration:"10 min" },
        ]
      },
      {
        name: "Steam Room",
        icon: "💨", color: "#c17fe0", duration: "8 min",
        steps: [
          { icon:"💨", label:"Steam — breathe deeply", detail:"Inhale the steam fully. 4 counts in, 6 counts out. Clears the airways, opens the sinuses, and signals calm alertness.", duration:"8 min" },
        ]
      },
      {
        name: "Cold Close",
        icon: "❄️", color: "#63b3ed", duration: "2 min",
        steps: [
          { icon:"❄️", label:"End cold", detail:"60–90 seconds of cold water. This is what locks in the morning energy — the norepinephrine boost lasts 3–6 hours.", duration:"90s" },
        ]
      },
    ],
  },
  {
    id: "sleep-prep",
    name: "Sleep Preparation",
    subtitle: "Wind down for deep restorative sleep",
    emoji: "🌙",
    color: "#5c6bc0",
    bg: "linear-gradient(135deg, #060820 0%, #0d1030 100%)",
    best: "1–2 hours before bed. Avoid intense cold — it raises alertness.",
    duration: "~35 min",
    science: "Core body temperature must drop 1–3°F to initiate sleep. A warm sauna followed by a cool (not cold) shower accelerates this drop. Steam relaxes the respiratory system. Avoid ice baths within 3 hours of sleep — they elevate norepinephrine and delay sleep onset.",
    phases: [
      {
        name: "Steam Room",
        icon: "💨", color: "#c17fe0", duration: "15 min",
        steps: [
          { icon:"💨", label:"Steam — parasympathetic mode", detail:"Sit quietly. Eyes closed. Steam activates the vagus nerve, pulling the body into parasympathetic rest mode. Don't talk, don't scroll.", duration:"10 min" },
          { icon:"💨", label:"Continue if comfortable", detail:"Stay up to 15 minutes. You should feel sleepy — that's the point.", duration:"5 min" },
        ]
      },
      {
        name: "Warm Sauna (not hot)",
        icon: "🔥", color: "#f5a623", duration: "10 min",
        steps: [
          { icon:"🔥", label:"Lower bench — moderate heat", detail:"Sit on the lower bench — cooler than the top. 65–75°C is ideal. This warms core temperature gently before the drop.", duration:"10 min" },
        ]
      },
      {
        name: "Cool-Down",
        icon: "🚿", color: "#63b3ed", duration: "5 min",
        steps: [
          { icon:"🚿", label:"Warm to cool shower — NOT cold", detail:"Gradually decrease the temperature to lukewarm, then slightly cool. Never ice cold before sleep — it raises alertness and delays sleep onset.", duration:"3 min" },
          { icon:"🧘", label:"Pool walk (optional)", detail:"If the pool is available, a slow walk in the water for 5 minutes at this stage accelerates core temperature drop.", duration:"5 min" },
        ]
      },
      {
        name: "Body Wind-Down",
        icon: "🧘", color: "#5c6bc0", duration: "5 min",
        steps: [
          { icon:"🧘", label:"Legs up the wall", detail:"5 minutes. Focus only on breathing. By this point your core temperature should be dropping and melatonin rising.", duration:"5 min" },
        ]
      },
    ],
  },
  {
    id: "swim-recovery",
    name: "Pool Recovery Session",
    subtitle: "Low-impact full-body flush",
    emoji: "🏊",
    color: "#38b87c",
    bg: "linear-gradient(135deg, #041810 0%, #082818 100%)",
    best: "Any day — especially when too sore for gym work",
    duration: "~35 min",
    science: "Water's hydrostatic pressure acts like a full-body compression garment, reducing swelling and improving venous return. The cool temperature (most pools ~28°C) reduces inflammation. Buoyancy allows full range movement with zero joint impact.",
    phases: [
      {
        name: "Easy Swim",
        icon: "🏊", color: "#38b87c", duration: "20 min",
        steps: [
          { icon:"🏊", label:"Freestyle — easy pace", detail:"Long, slow strokes. Think 40–50% effort. You should be able to speak in short sentences. Full arm extension on every stroke.", duration:"8 min" },
          { icon:"🏊", label:"Backstroke", detail:"Backstroke uses different muscle groups to freestyle — important for balanced recovery. Opens the chest and stretches the hip flexors.", duration:"4 min" },
          { icon:"🤸", label:"Pool stretching", detail:"Float on your back and bring knees to chest. Use the wall for hip flexor and calf stretches. The buoyancy makes these feel weightless.", duration:"4 min" },
          { icon:"🏊", label:"Easy choice — any stroke", detail:"Choose whatever feels most comfortable. Finish at very low effort — you should feel more energised than when you arrived.", duration:"4 min" },
        ]
      },
      {
        name: "Hydrotherapy",
        icon: "💧", color: "#4ecdc4", duration: "10 min",
        steps: [
          { icon:"💧", label:"Water walking — deep end", detail:"Walk or jog in the deep end using a float belt if available. The resistance is significant without any impact.", duration:"5 min" },
          { icon:"💧", label:"Standing water massage", detail:"Stand in front of a pool jet if available. Let the pressure work on tight areas — calves, lower back, shoulders.", duration:"5 min" },
        ]
      },
      {
        name: "Finish",
        icon: "🔥", color: "#f5a623", duration: "5 min",
        steps: [
          { icon:"🔥", label:"Quick sauna (optional)", detail:"5 minutes of dry heat after the pool accelerates the recovery response. The temperature contrast from cool pool to hot sauna is very effective.", duration:"5 min" },
          { icon:"🥤", label:"Hydrate and refuel", detail:"Drink water immediately — swimming is dehydrating despite being in water. Add protein within 30 minutes if post-training.", duration:"ongoing" },
        ]
      },
    ],
  },
];

// ── Recovery session timer ────────────────────────────────────────────────────
function RecoverySession({ protocol, onDone }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [stepIdx, setStepIdx]   = useState(0);
  const [timerSec, setTimerSec] = useState(null);
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [done, setDone]         = useState(false);
  const [checkedSteps, setChecked] = useState({});

  const allSteps = protocol.phases.flatMap((p,pi) => p.steps.map((s,si) => ({ ...s, phaseIdx:pi, stepIdx:si, phaseName:p.name, phaseColor:p.color })));
  const currentPhase = protocol.phases[phaseIdx];
  const currentStep  = currentPhase?.steps[stepIdx];
  const totalSteps   = allSteps.length;
  const doneSteps    = Object.keys(checkedSteps).length;

  // Parse duration string into seconds
  const parseDur = str => {
    if (!str || str === "ongoing") return null;
    const m = str.match(/(\d+)\s*(min|sec|s\b)/i);
    if (!m) return null;
    return parseInt(m[1]) * (m[2].toLowerCase().startsWith("min") ? 60 : 1);
  };

  useEffect(() => {
    if (!running || timerSec === null) return;
    if (timerSec <= 0) { setRunning(false); return; }
    const id = setInterval(() => setTimerSec(t => { if (t<=1){setRunning(false);return 0;} return t-1; }), 1000);
    return () => clearInterval(id);
  }, [running, timerSec]);

  const startTimer = () => {
    const secs = parseDur(currentStep?.duration);
    if (secs) { setTimerSec(secs); setRunning(true); }
  };

  const checkStep = () => {
    const key = `${phaseIdx}-${stepIdx}`;
    setChecked(c => ({ ...c, [key]: true }));
    // Advance
    if (stepIdx < currentPhase.steps.length - 1) {
      setStepIdx(s => s+1); setTimerSec(null); setRunning(false);
    } else if (phaseIdx < protocol.phases.length - 1) {
      setPhaseIdx(p => p+1); setStepIdx(0); setTimerSec(null); setRunning(false);
    } else {
      setDone(true);
    }
  };

  const fmtSec = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  if (done) return (
    <div className="ft-screen" style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:16 }}>
      <div style={{ fontSize:72 }}>✨</div>
      <div className="ft-heading" style={{ fontSize:36 }}>RECOVERED</div>
      <div style={{ fontSize:14,color:"#888899" }}>{protocol.name}</div>
      <div style={{ fontSize:12,color:protocol.color,marginTop:4 }}>All {totalSteps} steps complete</div>
      <button className="ft-btn" style={{ marginTop:16,background:protocol.color,color:["#ffeb3b","#c8f135","#f5a623"].includes(protocol.color)?"#0a0a0f":"#fff" }}
        onClick={onDone}>Done</button>
    </div>
  );

  const stepDurSecs = parseDur(currentStep?.duration);
  const progress = timerSec !== null && stepDurSecs ? (stepDurSecs - timerSec) / stepDurSecs : 0;
  const circ = 2 * Math.PI * 48;

  return (
    <div className="ft-screen ft-slide-up">
      <button onClick={onDone} style={{ background:"none",border:"none",cursor:"pointer",color:protocol.color,display:"flex",gap:4,alignItems:"center",fontSize:13,fontFamily:"'DM Sans'",marginBottom:20 }}>
        {Icon.back} Exit
      </button>

      {/* Progress */}
      <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"#555570",marginBottom:6 }}>
        <span>{protocol.emoji} {protocol.name}</span>
        <span style={{ color:protocol.color }}>{doneSteps}/{totalSteps} steps</span>
      </div>
      <div className="progress-bar-bg" style={{ marginBottom:20 }}>
        <div className="progress-bar-fill" style={{ width:`${(doneSteps/totalSteps)*100}%`,background:`linear-gradient(90deg,${protocol.color},${protocol.color}99)` }}/>
      </div>

      {/* Phase header */}
      <div style={{ fontSize:10,color:currentPhase?.color,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8 }}>
        {currentPhase?.icon} Phase {phaseIdx+1} of {protocol.phases.length} — {currentPhase?.name}
      </div>

      {/* Current step */}
      <div style={{ background:"#13131e",borderRadius:18,padding:"20px",border:`1.5px solid ${protocol.color}33`,marginBottom:20 }}>
        <div style={{ display:"flex",gap:16,alignItems:"flex-start",marginBottom:16 }}>
          <div className="rec-step-icon" style={{ background:`${currentStep ? currentPhase.color : protocol.color}22`,fontSize:24 }}>
            {currentStep?.icon}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:".04em",marginBottom:6 }}>{currentStep?.label.toUpperCase()}</div>
            <div style={{ fontSize:13,color:"#aaa8c0",lineHeight:1.6 }}>{currentStep?.detail}</div>
          </div>
        </div>

        {/* Timer */}
        {stepDurSecs ? (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
            <div style={{ position:"relative",width:120,height:120 }}>
              <svg width="120" height="120" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="48" fill="none" stroke="#1a1a2e" strokeWidth="7"/>
                <circle cx="55" cy="55" r="48" fill="none" stroke={protocol.color} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={circ*(1-progress)}
                  style={{ transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dashoffset .9s linear" }}/>
              </svg>
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                {timerSec !== null ? (
                  <>
                    <div style={{ fontFamily:"'Bebas Neue'",fontSize:32,color:"#e8e8f0",lineHeight:1 }}>{fmtSec(timerSec)}</div>
                    <div style={{ fontSize:9,color:"#555570",textTransform:"uppercase",letterSpacing:".08em" }}>{running?"going":"paused"}</div>
                  </>
                ) : (
                  <div style={{ fontSize:12,color:protocol.color,fontWeight:600,textAlign:"center",padding:"0 8px" }}>{currentStep?.duration}</div>
                )}
              </div>
            </div>
            <div style={{ display:"flex",gap:10,width:"100%" }}>
              {timerSec === null ? (
                <button className="rec-timer-btn" onClick={startTimer}
                  style={{ background:protocol.color,color:["#ffeb3b","#c8f135","#f5a623"].includes(protocol.color)?"#0a0a0f":"#fff" }}>
                  ▶ START TIMER
                </button>
              ) : (
                <>
                  <button className="rec-timer-btn" onClick={()=>setRunning(r=>!r)}
                    style={{ flex:2,background:"transparent",color:protocol.color,border:`1.5px solid ${protocol.color}` }}>
                    {running ? "⏸ PAUSE" : "▶ RESUME"}
                  </button>
                  <button className="rec-timer-btn" onClick={checkStep}
                    style={{ flex:1,background:"#1e1e2e",color:"#888899",border:"none" }}>
                    DONE ✓
                  </button>
                </>
              )}
            </div>
            {timerSec !== null && running && (
              <div style={{ fontSize:11,color:"#444458" }}>Timer running — tap DONE ✓ when finished</div>
            )}
          </div>
        ) : (
          <button className="rec-timer-btn" onClick={checkStep}
            style={{ background:protocol.color,color:["#ffeb3b","#c8f135","#f5a623"].includes(protocol.color)?"#0a0a0f":"#fff" }}>
            DONE ✓ — NEXT STEP
          </button>
        )}
      </div>

      {/* Remaining steps in this phase */}
      {currentPhase?.steps.slice(stepIdx+1).length > 0 && (
        <div>
          <div style={{ fontSize:11,color:"#555570",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8 }}>Up next in this phase</div>
          {currentPhase.steps.slice(stepIdx+1).map((s,i) => (
            <div key={i} style={{ display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1e1e2e",opacity:.6 }}>
              <span style={{ fontSize:16 }}>{s.icon}</span>
              <span style={{ fontSize:12,color:"#888899" }}>{s.label}</span>
              <span style={{ marginLeft:"auto",fontSize:11,color:"#555570" }}>{s.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Recovery Main Screen ──────────────────────────────────────────────────────
function RecoveryScreen() {
  const [selected, setSelected] = useState(null);
  const [inSession, setInSession] = useState(false);
  const [loggedToday, setLoggedToday] = useStorage("fittrack_recovery_today", []);

  const todayKey = new Date().toISOString().split("T")[0];

  const handleComplete = (proto) => {
    const key = `${todayKey}-${proto.id}`;
    setLoggedToday(prev => [...new Set([...prev, key])]);
    setInSession(false);
  };

  const isDoneToday = (id) => loggedToday.includes(`${todayKey}-${id}`);

  const FACILITY_TAGS = [
    { label:"All", id:"all" },
    { label:"🏊 Pool", id:"pool" },
    { label:"🔥 Sauna", id:"sauna" },
    { label:"💨 Steam", id:"steam" },
  ];
  const [facilityFilter, setFacilityFilter] = useState("all");

  const facilityMap = {
    pool:  ["post-hard","active-recovery","swim-recovery","contrast-therapy","morning-activation","sleep-prep"],
    sauna: ["post-hard","sauna-protocol","contrast-therapy","morning-activation","sleep-prep","swim-recovery"],
    steam: ["post-hard","active-recovery","contrast-therapy","morning-activation","sleep-prep"],
  };

  const filtered = facilityFilter === "all"
    ? RECOVERY_PROTOCOLS
    : RECOVERY_PROTOCOLS.filter(p => facilityMap[facilityFilter]?.includes(p.id));

  if (inSession && selected) {
    return <RecoverySession protocol={selected} onDone={() => { handleComplete(selected); setSelected(null); }}/>;
  }

  if (selected) {
    return (
      <div className="ft-screen ft-slide-up">
        <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",cursor:"pointer",color:selected.color,display:"flex",alignItems:"center",gap:6,marginBottom:20,fontSize:13,fontFamily:"'DM Sans'" }}>
          {Icon.back} All protocols
        </button>

        {/* Hero */}
        <div style={{ background:selected.bg,borderRadius:20,padding:"22px 20px",marginBottom:20,border:`1.5px solid ${selected.color}33`,position:"relative" }}>
          {isDoneToday(selected.id) && (
            <div style={{ position:"absolute",top:14,right:14,fontSize:10,background:"rgba(200,241,53,.15)",color:"#c8f135",padding:"3px 10px",borderRadius:100,fontWeight:700 }}>✓ Done today</div>
          )}
          <div style={{ fontSize:46,marginBottom:12 }}>{selected.emoji}</div>
          <h2 className="ft-heading" style={{ fontSize:28,lineHeight:1.1,marginBottom:6 }}>{selected.name.toUpperCase()}</h2>
          <div style={{ fontSize:12,color:selected.color,fontWeight:600,marginBottom:10 }}>{selected.subtitle}</div>
          <div style={{ fontSize:12,color:"#aaa8c0",lineHeight:1.6,marginBottom:14 }}>{selected.science}</div>
          <div style={{ display:"flex",gap:16,fontSize:11,color:"#888899" }}>
            <span>⏱ {selected.duration}</span>
            <span>📅 {selected.best}</span>
          </div>
        </div>

        {/* Phase overview */}
        <div style={{ fontSize:11,color:"#888899",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10 }}>Protocol</div>
        {selected.phases.map((phase,pi) => (
          <div key={pi} className="rec-phase-block" style={{ borderColor:`${phase.color}33`,background:`${phase.color}08`,marginBottom:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
              <span style={{ fontSize:18 }}>{phase.icon}</span>
              <div>
                <div style={{ fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:".06em",color:"#e8e8f0" }}>{phase.name.toUpperCase()}</div>
                <div style={{ fontSize:10,color:phase.color }}>{phase.duration} · {phase.steps.length} step{phase.steps.length>1?"s":""}</div>
              </div>
            </div>
            {phase.steps.map((s,si) => (
              <div key={si} className="rec-step" style={{ borderColor:`${phase.color}15` }}>
                <div className="rec-step-icon" style={{ background:`${phase.color}15`,width:28,height:28,fontSize:14 }}>{s.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12,fontWeight:600,color:"#e8e8f0",marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:11,color:"#888899" }}>{s.duration}</div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <button className="ft-btn" onClick={()=>setInSession(true)}
          style={{ background:selected.color,color:["#ffeb3b","#c8f135","#f5a623"].includes(selected.color)?"#0a0a0f":"#fff" }}>
          START PROTOCOL ▶
        </button>
      </div>
    );
  }

  // Today's recovered sessions
  const todayDone = RECOVERY_PROTOCOLS.filter(p => isDoneToday(p.id));

  return (
    <div className="ft-screen ft-slide-up">
      <div className="ft-tag" style={{ marginBottom:8 }}>Rest & Repair</div>
      <h1 className="ft-heading" style={{ fontSize:36, marginBottom:6 }}>RECOVERY</h1>
      <p style={{ fontSize:12,color:"#555570",marginBottom:16 }}>
        Guided protocols using the pool, sauna and steam room. Recovery is where adaptation happens.
      </p>

      {/* Today's status */}
      {todayDone.length > 0 && (
        <div className="ft-card" style={{ marginBottom:16,border:"1px solid rgba(200,241,53,.2)",background:"rgba(200,241,53,.04)" }}>
          <div style={{ fontSize:11,color:"#c8f135",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8 }}>✓ Completed Today</div>
          {todayDone.map(p => (
            <div key={p.id} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
              <span style={{ fontSize:16 }}>{p.emoji}</span>
              <span style={{ fontSize:13,color:"#888899" }}>{p.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Science callout */}
      <div style={{ background:"rgba(99,179,237,.08)",border:"1px solid rgba(99,179,237,.2)",borderRadius:14,padding:"14px 16px",marginBottom:20 }}>
        <div style={{ fontSize:11,color:"#63b3ed",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6 }}>💡 Why recovery matters</div>
        <div style={{ fontSize:12,color:"#aaa8c0",lineHeight:1.6 }}>
          Adaptation happens during rest, not training. The pool, sauna, and steam room are among the most evidence-backed recovery tools available — used by elite athletes worldwide. Even one session per week produces measurable benefits.
        </div>
      </div>

      {/* Facility filter */}
      <div style={{ display:"flex",gap:8,marginBottom:16 }}>
        {FACILITY_TAGS.map(t => (
          <button key={t.id} onClick={()=>setFacilityFilter(t.id)}
            style={{ flex:1,padding:"9px 4px",borderRadius:10,border:`1.5px solid ${facilityFilter===t.id?"#63b3ed":"#1e1e2e"}`,
              background:facilityFilter===t.id?"rgba(99,179,237,.1)":"#13131e",cursor:"pointer",fontFamily:"'DM Sans'",
              fontSize:11,fontWeight:600,color:facilityFilter===t.id?"#63b3ed":"#555570",transition:"all .2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Protocol cards */}
      {filtered.map(proto => (
        <div key={proto.id} className="rec-protocol-card" style={{ background:proto.bg,border:`1.5px solid ${isDoneToday(proto.id)?"#c8f135":proto.color}33` }}
          onClick={()=>setSelected(proto)}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:34 }}>{proto.emoji}</span>
              <div>
                <div style={{ fontSize:9,background:`${proto.color}22`,color:proto.color,padding:"2px 8px",borderRadius:100,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",display:"inline-block",marginBottom:4 }}>
                  {proto.duration}
                </div>
                <div className="ft-heading" style={{ fontSize:20,lineHeight:1 }}>{proto.name.toUpperCase()}</div>
              </div>
            </div>
            {isDoneToday(proto.id)
              ? <div style={{ width:28,height:28,borderRadius:"50%",background:"#c8f135",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                </div>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={proto.color} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            }
          </div>
          <div style={{ fontSize:12,color:proto.color,fontWeight:600,marginBottom:6 }}>{proto.subtitle}</div>
          <div style={{ fontSize:11,color:"#888899",lineHeight:1.5,marginBottom:10 }}>{proto.best}</div>
          {/* Phase chips */}
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {proto.phases.map((ph,i) => (
              <span key={i} style={{ fontSize:10,background:`${ph.color}18`,color:ph.color,padding:"2px 8px",borderRadius:100,fontWeight:600 }}>
                {ph.icon} {ph.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC ROUTINE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

const GEN_OPTIONS = {
  time: [
    { id:"15", label:"15 min", emoji:"⚡" },
    { id:"30", label:"30 min", emoji:"🕐" },
    { id:"45", label:"45 min", emoji:"🕐" },
    { id:"60", label:"60 min", emoji:"💪" },
    { id:"75", label:"75 min", emoji:"🔥" },
    { id:"90", label:"90 min", emoji:"🏆" },
  ],
  location: [
    { id:"home",       label:"Home Gym",         emoji:"🏠", detail:"Dumbbells, KBs, bench, barbell, squat rack, resistance bands, landmine, foam roller" },
    { id:"gym_cable",  label:"Full Gym",          emoji:"🏋️", detail:"Full gym including cable machine, all machines, free weights" },
    { id:"pool",       label:"Pool",              emoji:"🏊", detail:"Pool-based resistance and conditioning work" },
    { id:"park",       label:"Outdoors",          emoji:"🌳", detail:"Bodyweight only, running, park equipment if available" },
    { id:"bodyweight", label:"No Equipment",      emoji:"🤸", detail:"Pure bodyweight — anywhere, any time" },
    { id:"golf_range", label:"Golf Range/Course", emoji:"⛳", detail:"With warm-up drills and swing-specific preparation" },
  ],
  goal: [
    { id:"strength",    label:"Build Strength",  emoji:"💪" },
    { id:"hypertrophy", label:"Build Muscle",    emoji:"📈" },
    { id:"fat_loss",    label:"Fat Loss",        emoji:"🔥" },
    { id:"power",       label:"Athletic Power",  emoji:"⚡" },
    { id:"endurance",   label:"Endurance",       emoji:"🏃" },
    { id:"golf_perf",   label:"Golf Performance",emoji:"⛳" },
    { id:"mobility",    label:"Mobility & Flex", emoji:"🧘" },
    { id:"recovery_g",  label:"Active Recovery", emoji:"🌊" },
  ],
  focus: [
    { id:"full",       label:"Full Body",       emoji:"🫀" },
    { id:"upper",      label:"Upper Body",      emoji:"💪" },
    { id:"lower",      label:"Lower Body",      emoji:"🦵" },
    { id:"push",       label:"Push",            emoji:"⬆️" },
    { id:"pull",       label:"Pull",            emoji:"⬇️" },
    { id:"core",       label:"Core",            emoji:"🎯" },
    { id:"posterior",  label:"Posterior Chain", emoji:"🔙" },
    { id:"cardio_f",   label:"Cardio",          emoji:"❤️" },
  ],
  intensity: [
    { id:"light",    label:"Light",    emoji:"😌", detail:"60–65% effort — deload or recovery day" },
    { id:"moderate", label:"Moderate", emoji:"😤", detail:"70–75% — solid, productive training session" },
    { id:"hard",     label:"Hard",     emoji:"🥵", detail:"80–85% — challenging and demanding" },
    { id:"max",      label:"Maximum",  emoji:"💀", detail:"90%+ — all out, nothing left in the tank" },
  ],
  experience: [
    { id:"beginner",     label:"Beginner",     emoji:"🌱" },
    { id:"intermediate", label:"Intermediate", emoji:"🌿" },
    { id:"advanced",     label:"Advanced",     emoji:"🌳" },
  ],
};

function ChipGroup({ options, selected, onSelect }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {options.map(o => {
        const isSelected = selected === o.id;
        return (
          <button key={o.id} className={`gen-chip ${isSelected?"selected":""}`} onClick={() => onSelect(o.id)}>
            <span>{o.emoji}</span> {o.label}
          </button>
        );
      })}
    </div>
  );
}

function GeneratorScreen({ workouts, onSaveWorkout }) {
  const [sel, setSel] = useState({
    time:"45", location:"gym_cable", goal:"hypertrophy",
    focus:"full", intensity:"moderate", experience:"intermediate", notes:"",
  });
  const [phase, setPhase]   = useState("form");
  const [result, setResult] = useState(null);
  const [saved, setSaved]   = useState(false);
  const [loadMsg, setLoadMsg] = useState("Analysing your preferences…");

  const set = (k,v) => setSel(s => ({ ...s, [k]:v }));

  const LOADING_MSGS = [
    "Analysing your preferences…",
    "Selecting the best exercises…",
    "Calculating sets, reps and rest…",
    "Sequencing for maximum effect…",
    "Adding coaching cues…",
    "Almost ready…",
  ];

  const generate = async () => {
    setPhase("loading"); setSaved(false);
    let mi = 0;
    const iv = setInterval(() => { mi=(mi+1)%LOADING_MSGS.length; setLoadMsg(LOADING_MSGS[mi]); }, 1800);
    const locOpt = GEN_OPTIONS.location.find(o=>o.id===sel.location);
    const hist = workouts.slice(-8).map(w=>`${w.date}: ${w.name} — ${w.exercises.map(e=>e.name).join(", ")}`).join("\n") || "No history yet";
    const prompt = `You are an expert personal trainer. Generate a complete structured workout for these specs:

TIME: ${sel.time} minutes
LOCATION/EQUIPMENT: ${locOpt?.label} — ${locOpt?.detail}
GOAL: ${GEN_OPTIONS.goal.find(o=>o.id===sel.goal)?.label}
FOCUS: ${GEN_OPTIONS.focus.find(o=>o.id===sel.focus)?.label}
INTENSITY: ${GEN_OPTIONS.intensity.find(o=>o.id===sel.intensity)?.label} — ${GEN_OPTIONS.intensity.find(o=>o.id===sel.intensity)?.detail}
EXPERIENCE: ${GEN_OPTIONS.experience.find(o=>o.id===sel.experience)?.label}
${sel.notes?"EXTRA NOTES: "+sel.notes:""}

RECENT TRAINING (avoid repeating same muscles from last 48h):
${hist}

Return ONLY valid JSON with this exact structure — no markdown, no preamble:
{
  "name": "creative specific workout name",
  "tagline": "one punchy sentence",
  "warmup": [{"name":"","duration":"","cue":""}],
  "mainWork": [{"name":"","sets":"","reps":"","rest":"","weight":"e.g. RPE 7 or moderate","cue":"1-2 sentence coaching tip","superset":false,"supersetWith":""}],
  "cooldown": [{"name":"","duration":"","cue":""}],
  "coachNote": "2-3 personalised sentences about what makes this session effective",
  "estimatedCalories": "e.g. 320-400",
  "keyPrinciple": "one key training principle this session applies"
}

Rules: supersets get superset:true on the FIRST of the pair only, with supersetWith naming the next exercise. For ≤30 min sessions use supersets/circuits. Only use equipment available. Match exercises to experience level. For golf goals include rotational and stability work.`;

    try {
      const key = getApiKey();
      if (!key) { setPhase("nokey"); clearInterval(iv); return; }
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, messages:[{role:"user",content:prompt}] }),
      });
      const data = await res.json();
      const raw = data.content?.find(b=>b.type==="text")?.text || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setResult(parsed); setPhase("result");
    } catch(e) { setPhase("error"); }
    finally { clearInterval(iv); }
  };

  const handleSave = () => {
    if(!result) return;
    onSaveWorkout({
      id:Date.now(), name:result.name,
      group:GEN_OPTIONS.focus.find(o=>o.id===sel.focus)?.label||"Full Body",
      date:today(),
      exercises:result.mainWork.map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||"",ssGroup:null})),
    });
    setSaved(true);
  };

  if (phase==="loading") return (
    <div className="ft-screen" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,textAlign:"center"}}>
      <div style={{position:"relative",width:90,height:90}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{position:"absolute",inset:i*14,borderRadius:"50%",border:"2px solid",
            borderColor:["#c8f135","#6c63ff","#f5a623"][i],opacity:.7-i*.2,
            animation:`gen-pulse ${1.2+i*.3}s ease-in-out infinite`}}/>
        ))}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>⚡</div>
      </div>
      <div className="ft-heading" style={{fontSize:28}}>GENERATING</div>
      <div style={{fontSize:13,color:"#888899",maxWidth:260,lineHeight:1.6}}>{loadMsg}</div>
      <div className="gen-loading-bar" style={{width:240,marginTop:8}}/>
    </div>
  );

  if (phase==="nokey") return (
    <div className="ft-screen" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,textAlign:"center"}}>
      <div style={{fontSize:56}}>🔑</div>
      <div className="ft-heading" style={{fontSize:24}}>API KEY NEEDED</div>
      <div style={{fontSize:13,color:"#888899",maxWidth:280,lineHeight:1.6}}>The Workout Generator needs your Anthropic API key. Add it in Settings — tap ⚙️ in the nav.</div>
      <button className="ft-btn" onClick={() => setPhase("form")} style={{marginTop:8}}>Back</button>
    </div>
  );

  if (phase==="error") return (
    <div className="ft-screen" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,textAlign:"center"}}>
      <div style={{fontSize:56}}>⚠️</div>
      <div className="ft-heading" style={{fontSize:24}}>GENERATION FAILED</div>
      <div style={{fontSize:13,color:"#888899"}}>Connection issue — please try again.</div>
      <button className="ft-btn" onClick={()=>setPhase("form")} style={{marginTop:8}}>Try Again</button>
    </div>
  );

  if (phase==="result" && result) return (
    <div className="ft-screen ft-slide-up" style={{paddingBottom:120}}>
      <button onClick={()=>setPhase("form")}
        style={{background:"none",border:"none",cursor:"pointer",color:"#c8f135",display:"flex",alignItems:"center",gap:6,marginBottom:20,fontSize:13,fontFamily:"'DM Sans'"}}>
        {Icon.back} Regenerate
      </button>

      <div style={{background:"linear-gradient(135deg,#0f1a00,#1a2e00)",border:"1.5px solid #c8f13533",borderRadius:20,padding:"20px",marginBottom:20}}>
        <div style={{fontSize:10,color:"#c8f135",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>
          ⚡ AI Generated · {sel.time} min · {GEN_OPTIONS.location.find(o=>o.id===sel.location)?.label}
        </div>
        <h2 className="ft-heading" style={{fontSize:26,lineHeight:1.1,marginBottom:8}}>{result.name?.toUpperCase()}</h2>
        <p style={{fontSize:13,color:"#aaa8c0",lineHeight:1.6,marginBottom:12}}>{result.tagline}</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[
            {label:GEN_OPTIONS.goal.find(o=>o.id===sel.goal)?.label, color:"#c8f135"},
            {label:result.keyPrinciple, color:"#6c63ff"},
            {label:result.estimatedCalories?`~${result.estimatedCalories} kcal`:null, color:"#f5a623"},
          ].filter(t=>t.label).map((t,i)=>(
            <span key={i} style={{fontSize:10,background:`${t.color}18`,color:t.color,padding:"3px 10px",borderRadius:100,fontWeight:700}}>{t.label}</span>
          ))}
        </div>
      </div>

      {result.coachNote && (
        <div style={{background:"rgba(108,99,255,.08)",border:"1px solid rgba(108,99,255,.2)",borderRadius:14,padding:"12px 16px",marginBottom:20}}>
          <div style={{fontSize:10,color:"#6c63ff",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>🧠 Coach's Note</div>
          <div style={{fontSize:12,color:"#c8c8d8",lineHeight:1.65}}>{result.coachNote}</div>
        </div>
      )}

      {result.warmup?.length>0 && (<>
        <div className="gen-section-label">🔥 Warm-Up</div>
        {result.warmup.map((ex,i)=>(
          <div key={i} className="gen-ex-card" style={{borderLeft:"3px solid #f5a62355"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:600,color:"#e8e8f0"}}>{ex.name}</span>
              <span style={{fontSize:11,color:"#f5a623",fontWeight:700}}>{ex.duration}</span>
            </div>
            <div style={{fontSize:11,color:"#888899",lineHeight:1.5}}>{ex.cue}</div>
          </div>
        ))}
      </>)}

      {result.mainWork?.length>0 && (<>
        <div className="gen-section-label">💪 Main Workout</div>
        {result.mainWork.map((ex,i)=>(
          <div key={i} className="gen-ex-card"
            style={{borderLeft:`3px solid ${ex.superset?"#6c63ff":"#c8f135"}55`,background:ex.superset?"rgba(108,99,255,.06)":"#13131e"}}>
            {ex.superset && ex.supersetWith && (
              <div style={{fontSize:9,color:"#6c63ff",fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>
                ⚡ SUPERSET WITH {ex.supersetWith.toUpperCase()}
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <span style={{fontSize:14,fontWeight:700,color:"#e8e8f0",flex:1,marginRight:8}}>{ex.name}</span>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:12,color:"#c8f135",fontWeight:700}}>{ex.sets} × {ex.reps}</div>
                <div style={{fontSize:10,color:"#555570",marginTop:1}}>Rest: {ex.rest}</div>
              </div>
            </div>
            <div style={{fontSize:11,color:"#f5a623",fontWeight:600,marginBottom:6}}>⚖️ {ex.weight}</div>
            <div style={{fontSize:11,color:"#888899",lineHeight:1.55,fontStyle:"italic"}}>{ex.cue}</div>
          </div>
        ))}
      </>)}

      {result.cooldown?.length>0 && (<>
        <div className="gen-section-label">🧘 Cool-Down</div>
        {result.cooldown.map((ex,i)=>(
          <div key={i} className="gen-ex-card" style={{borderLeft:"3px solid #38b87c55"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:600,color:"#e8e8f0"}}>{ex.name}</span>
              <span style={{fontSize:11,color:"#38b87c",fontWeight:700}}>{ex.duration}</span>
            </div>
            <div style={{fontSize:11,color:"#888899",lineHeight:1.5}}>{ex.cue}</div>
          </div>
        ))}
      </>)}

      <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:10}}>
        {saved
          ? <div style={{textAlign:"center",padding:"14px",color:"#c8f135",fontSize:13,fontWeight:600}}>✅ Saved to workout log!</div>
          : <button className="ft-btn" onClick={handleSave} style={{background:"#c8f135",color:"#0a0a0f"}}>SAVE TO LOG</button>
        }
        <button className="ft-btn ft-btn-ghost" onClick={generate}>⚡ REGENERATE</button>
      </div>
    </div>
  );

  // Form
  const canGen = sel.time && sel.location && sel.goal && sel.focus && sel.intensity && sel.experience;
  return (
    <div className="ft-screen ft-slide-up" style={{paddingBottom:120}}>
      <div className="ft-tag" style={{marginBottom:8}}>Powered by Claude</div>
      <h1 className="ft-heading" style={{fontSize:36,marginBottom:4,lineHeight:1}}>WORKOUT<br/>GENERATOR</h1>
      <p style={{fontSize:12,color:"#555570",marginBottom:4}}>Tell it what you want — get a perfectly tailored session.</p>
      <div style={{fontSize:11,color:"#444458",marginBottom:20}}>Your recent training history is automatically included to avoid overloading the same muscles.</div>

      <div className="gen-section-label">⏱ Time available</div>
      <ChipGroup options={GEN_OPTIONS.time} selected={sel.time} onSelect={v=>set("time",v)}/>

      <div className="gen-section-label">📍 Location</div>
      <ChipGroup options={GEN_OPTIONS.location} selected={sel.location} onSelect={v=>set("location",v)}/>
      {sel.location && <div style={{fontSize:11,color:"#444458",margin:"-2px 0 8px",paddingLeft:2}}>{GEN_OPTIONS.location.find(o=>o.id===sel.location)?.detail}</div>}

      <div className="gen-section-label">🎯 Goal</div>
      <ChipGroup options={GEN_OPTIONS.goal} selected={sel.goal} onSelect={v=>set("goal",v)}/>

      <div className="gen-section-label">💪 Muscle focus</div>
      <ChipGroup options={GEN_OPTIONS.focus} selected={sel.focus} onSelect={v=>set("focus",v)}/>

      <div className="gen-section-label">🔥 Intensity</div>
      <ChipGroup options={GEN_OPTIONS.intensity} selected={sel.intensity} onSelect={v=>set("intensity",v)}/>
      {sel.intensity && <div style={{fontSize:11,color:"#444458",margin:"-2px 0 8px",paddingLeft:2}}>{GEN_OPTIONS.intensity.find(o=>o.id===sel.intensity)?.detail}</div>}

      <div className="gen-section-label">🌱 Experience</div>
      <ChipGroup options={GEN_OPTIONS.experience} selected={sel.experience} onSelect={v=>set("experience",v)}/>

      <div className="gen-section-label">📝 Anything else? <span style={{color:"#333350",fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></div>
      <textarea className="ft-input" placeholder="e.g. avoid squats — knee is sore / focus on explosive work / played golf this morning…"
        value={sel.notes} onChange={e=>set("notes",e.target.value)} rows={3}
        style={{resize:"none",lineHeight:1.6,fontFamily:"'DM Sans'",fontSize:13}}/>

      <button className="ft-btn" onClick={generate} disabled={!canGen}
        style={{marginTop:20,background:canGen?"#c8f135":"#1e1e2e",color:canGen?"#0a0a0f":"#333350",transition:"all .3s",fontSize:16,letterSpacing:".1em"}}>
        ⚡ GENERATE MY WORKOUT
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsScreen() {
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem("fittrack_api_key") || ""; } catch { return ""; }
  });
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(false);

  const save = () => {
    try {
      localStorage.setItem("fittrack_api_key", apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch(e) { alert("Could not save key"); }
  };

  const clear = () => {
    setApiKey("");
    try { localStorage.removeItem("fittrack_api_key"); } catch {}
  };

  const hasKey = apiKey.trim().length > 10;

  return (
    <div className="ft-screen ft-slide-up">
      <div className="ft-tag" style={{ marginBottom:8 }}>Configuration</div>
      <h1 className="ft-heading" style={{ fontSize:36, marginBottom:20 }}>SETTINGS</h1>

      {/* API Key */}
      <div className="ft-card" style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <span style={{ fontSize:24 }}>🔑</span>
          <div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:".06em" }}>ANTHROPIC API KEY</div>
            <div style={{ fontSize:11, color:"#555570" }}>Required for AI Coach & Workout Generator</div>
          </div>
        </div>

        <div style={{ background:"rgba(99,179,237,.07)", border:"1px solid rgba(99,179,237,.2)", borderRadius:10, padding:"10px 14px", marginBottom:14 }}>
          <div style={{ fontSize:11, color:"#63b3ed", fontWeight:700, marginBottom:6 }}>How to get a key</div>
          <div style={{ fontSize:11, color:"#aaa8c0", lineHeight:1.6 }}>
            1. Go to <span style={{ color:"#63b3ed" }}>console.anthropic.com</span>{"\n"}
            2. Sign up / log in → API Keys → Create Key{"\n"}
            3. Copy it and paste below
          </div>
        </div>

        <div style={{ position:"relative", marginBottom:12 }}>
          <input
            className="ft-input"
            type={visible ? "text" : "password"}
            placeholder="sk-ant-api03-..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{ paddingRight:48, fontFamily:"monospace", fontSize:12 }}
          />
          <button onClick={() => setVisible(v => !v)}
            style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#555570", fontSize:16 }}>
            {visible ? "🙈" : "👁️"}
          </button>
        </div>

        {hasKey && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, fontSize:11, color:"#38b87c" }}>
            <span>✓</span> Key entered ({apiKey.slice(0,12)}…)
          </div>
        )}

        <div style={{ display:"flex", gap:10 }}>
          <button className="ft-btn" onClick={save} style={{ flex:2, background: saved?"#38b87c":"#c8f135", color:"#0a0a0f" }}>
            {saved ? "✓ SAVED" : "SAVE KEY"}
          </button>
          {hasKey && (
            <button className="ft-btn ft-btn-ghost" onClick={clear} style={{ flex:1, color:"#ff6b6b", borderColor:"#ff6b6b33" }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Security note */}
      <div style={{ background:"rgba(245,166,35,.07)", border:"1px solid rgba(245,166,35,.2)", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#f5a623", fontWeight:700, marginBottom:6 }}>🔒 Security note</div>
        <div style={{ fontSize:11, color:"#aaa8c0", lineHeight:1.6 }}>
          Your key is stored only on this device in browser localStorage. It is never sent anywhere except directly to api.anthropic.com. Don't share your key with anyone.
        </div>
      </div>

      {/* App info */}
      <div className="ft-card">
        <div style={{ fontSize:11, color:"#555570", textTransform:"uppercase", letterSpacing:".08em", marginBottom:12 }}>About</div>
        {[
          { label:"App", val:"FitTrack" },
          { label:"Nav tabs", val:"12 screens" },
          { label:"Storage", val:"Device only (localStorage)" },
          { label:"AI model", val:"Claude Sonnet 4" },
        ].map(r => (
          <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #1e1e2e" }}>
            <span style={{ fontSize:12, color:"#888899" }}>{r.label}</span>
            <span style={{ fontSize:12, color:"#c8c8d8", fontWeight:500 }}>{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function FitTrack() {
  const [tab, setTab] = useState("home");
  const [workouts, setWorkouts] = useStorage("fittrack_workouts", []);
  const [routinePrefill, setRoutinePrefill] = useState(null);

  const saveWorkout = w => { setWorkouts([...workouts, w]); setRoutinePrefill(null); };

  const handleStartRoutine = r => {
    setRoutinePrefill({
      name: r.name, emoji: r.emoji || "💪",
      group: r.category==="Strength"?"Full Body":r.category==="HIIT"?"Cardio":r.category==="Golf"?"Full Body":r.category==="Core"?"Core":r.category==="Lower Body"?"Legs":"Full Body",
      exercises: (r.exercises||[]).map(e => ({ name:e.name||"", sets:e.sets||"", reps:e.reps||"", weight:e.weight||"" })),
    });
    setTab("log");
  };

  const handleStartProgramWorkout = (workout) => {
    setRoutinePrefill({
      name: workout.name, emoji: "🫁",
      group: workout.tag==="Push"||workout.tag==="Full"?"Chest":workout.tag==="Pull"?"Back":workout.tag==="Core"?"Core":workout.tag==="Lower"?"Legs":"Full Body",
      exercises: workout.exercises.map(e => ({ name:e.name, sets:e.sets, reps:e.reps, weight:e.weight||"" })),
    });
    setTab("log");
  };

  const handleGolfLog = (workout) => {
    setRoutinePrefill({
      name: workout.name, emoji: workout.emoji||"⛳", group: "Full Body",
      exercises: workout.exercises.map(e => ({ name:e.name, sets:e.sets, reps:e.reps, weight:e.weight||"" })),
    });
    setTab("log");
  };

  const handleCableLog = (workout) => {
    setRoutinePrefill({
      name: workout.name, emoji: "🔌", group: workout.group||"Full Body",
      exercises: workout.exercises.map(e => ({ name:e.name, sets:e.sets, reps:e.reps, weight:e.weight||"" })),
    });
    setTab("log");
  };

  const schedIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h2M14 14h2M8 18h2"/></svg>;

  const navItems = [
    { id:"home",      label:"Home",    icon:Icon.home },
    { id:"generate",  label:"Build",   icon:Icon.generate },
    { id:"schedule",  label:"Plan",    icon:schedIcon },
    { id:"cardio",    label:"Cardio",  icon:Icon.cardio },
    { id:"cable",     label:"Cable",   icon:Icon.cable },
    { id:"stretch",   label:"Stretch", icon:Icon.stretch },
    { id:"recovery",  label:"Recover", icon:Icon.recovery },
    { id:"golf",      label:"Golf",    icon:Icon.golf },
    { id:"routines",  label:"Library", icon:Icon.routines },
    { id:"log",       label:"Log",     icon:Icon.plus },
    { id:"progress",  label:"Stats",   icon:Icon.stats },
    { id:"coach",     label:"AI",      icon:Icon.bot },
    { id:"settings",  label:"Keys",    icon:Icon.settings },
  ];

  return (
    <div className="ft-root">
      {tab==="home"     && <HomeScreen workouts={workouts}/>}
      {tab==="generate" && <GeneratorScreen workouts={workouts} onSaveWorkout={saveWorkout}/>}
      {tab==="schedule" && <SchedulerScreen workouts={workouts} onNavigateToLog={()=>setTab("log")} routinesAll={ROUTINES_ALL}/>}
      {tab==="cardio"   && <CardioScreen onSave={saveWorkout}/>}
      {tab==="cable"    && <CableScreen onLogWorkout={handleCableLog}/>}
      {tab==="stretch"  && <StretchesScreen/>}
      {tab==="recovery" && <RecoveryScreen/>}
      {tab==="golf"     && <GolfProgramsScreen onLogWorkout={handleGolfLog}/>}
      {tab==="routines" && <RoutinesScreen onStartRoutine={handleStartRoutine}/>}
      {tab==="log"      && <LogScreen onSave={saveWorkout} prefill={routinePrefill}/>}
      {tab==="progress" && <ProgressScreen workouts={workouts}/>}
      {tab==="programs" && <ProgramsScreen onStartWorkout={handleStartProgramWorkout}/>}
      {tab==="coach"    && <CoachScreen workouts={workouts}/>}
      {tab==="settings" && <SettingsScreen/>}
      <nav className="ft-nav">
        {navItems.map(n => (
          <button key={n.id} className={`ft-nav-btn ${tab===n.id?"active":""}`}
            onClick={()=>{ if(n.id==="log") setRoutinePrefill(null); setTab(n.id); }}>
            {n.icon}{n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
