import { useState, useEffect } from "react";

const FONT = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@100;200;300;400;600&display=swap";
const COR = "'Cormorant Garamond',Georgia,serif";
const JOS = "'Josefin Sans',sans-serif";

const TH = {
  IMP:{bg:"#000",s1:"#0d0d0d",s2:"#111",s3:"#161616",b1:"#1c1c1c",b2:"#282828",
    gold:"#c9a84c",goldDim:"#4a4030",glow:"rgba(201,168,76,0.10)",
    teal:"#18c48a",tealBg:"#061e16",tealBdr:"#0d5c4a",
    text:"#f5f0e8",t2:"#a8a090",t3:"#555045",
    shiftCol:"#44aa44",partnerCol:"#c47878",partnerInit:"H",partnerName:"Holli",
    name:"THE IMPERIUM",person:"Garrin",sub:"Uncrowned Operating System",
    decl:"Power from within cannot be revoked.",
    declSub:"Stand. Both feet on the floor. Speak this aloud.",
    axiom:"UNCROWNED. UNBOWED.\nUNBROKEN. UNFINISHED.",
    quote:"Plans collapse. Architecture endures.",
    shiftSelf:"OFF DUTY",shiftPartner:"NIGHT — 7P–7A",
    hydT:100,
    cPlan:"#c9a84c",cNour:"#e05828",cMind:"#9060f0",cBody:"#18c48a",cSoul:"#c9a84c",cMore:"#5888b0",cWork:"#e05828",
  },
  TEND:{bg:"#080504",s1:"#100c0a",s2:"#171008",s3:"#1e1510",b1:"#231810",b2:"#2e2016",
    gold:"#c47878",goldDim:"#4a2828",glow:"rgba(196,120,120,0.10)",
    teal:"#c47878",tealBg:"#2a100e",tealBdr:"#4a1e2a",
    text:"#f5e8e0",t2:"#c4a898",t3:"#806858",
    shiftCol:"#6080c4",partnerCol:"#c9a84c",partnerInit:"G",partnerName:"Garrin",
    name:"THE TENDING",person:"Holli",sub:"Unspent Operating System",
    decl:"The keeper of what matters is never powerless.",
    declSub:"Twenty minutes of quiet first. The rest waits.",
    axiom:"FELT. FAITHFUL.\nFULL. UNSPENT.",
    quote:"What you tend, you keep. What you keep, endures.",
    shiftSelf:"NIGHT — 7P–7A",shiftPartner:"OFF DUTY",
    hydT:96,
    cPlan:"#c47878",cNour:"#c06048",cMind:"#9878b0",cBody:"#c48054",cSoul:"#c47878",cMore:"#8090a8",cWork:"#c48054",
  }
};

// ── MEAL PLAN — 4 weeks, unique meals every day, same for both people ──
const WEEK_PLAN = [
  {week:"Week 1 — Jan 13",days:[
    {day:"Monday",    meals:{b:"Oats with banana and peanut butter",l:"Lentil soup with bread",d:"Sheet pan chicken thighs, potatoes, broccoli"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF","VEG"],d:["NF","GF","DF"]},batch:true},
    {day:"Tuesday",   meals:{b:"Scrambled eggs on toast",l:"Leftover sheet pan chicken",d:"Spaghetti with meat sauce"},tags:{b:["NF"],l:["NF","GF","DF"],d:["NF"]},batch:false},
    {day:"Wednesday", meals:{b:"Greek yogurt with honey and granola",l:"Tuna salad sandwich",d:"Baked salmon with rice and green beans"},tags:{b:["NF","GF"],l:["NF","DF"],d:["NF","GF","DF"]},batch:true},
    {day:"Thursday",  meals:{b:"Avocado toast with a fried egg",l:"Leftover baked salmon",d:"Black bean quesadillas with salad"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF"],d:["NF","VEG"]},batch:false},
    {day:"Friday",    meals:{b:"Banana smoothie with protein",l:"Leftover quesadillas",d:"Pork chops with mashed potatoes and peas"},tags:{b:["NF","GF","DF"],l:["NF","VEG"],d:["NF","GF"]},batch:false},
    {day:"Saturday",  meals:{b:"Overnight oats with berries",l:"Chicken wrap with hummus",d:"Beef stir-fry with rice"},tags:{b:["NF","GF","VEG"],l:["NF","DF"],d:["NF","GF","DF"]},batch:false},
    {day:"Sunday",    meals:{b:"Veggie omelette",l:"Shakshuka with bread",d:"Meal prep batch — double dinner"},tags:{b:["NF","GF","VEG"],l:["NF","VEG"],d:["NF"]},batch:true},
  ]},
  {week:"Week 2 — Jan 20",days:[
    {day:"Monday",    meals:{b:"Oats with banana and peanut butter",l:"Leftover Sunday batch",d:"Chicken and vegetable stir-fry with rice"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF"],d:["NF","GF","DF"]},batch:true},
    {day:"Tuesday",   meals:{b:"Scrambled eggs on toast",l:"Pasta salad with olives and feta",d:"Turkey meatballs, tomato sauce, pasta"},tags:{b:["NF"],l:["NF","VEG"],d:["NF"]},batch:false},
    {day:"Wednesday", meals:{b:"Greek yogurt with honey and granola",l:"Shakshuka with bread",d:"Baked salmon with rice and green beans"},tags:{b:["NF","GF"],l:["NF","VEG"],d:["NF","GF","DF"]},batch:true},
    {day:"Thursday",  meals:{b:"Avocado toast with a fried egg",l:"Leftover baked salmon",d:"Vegetable curry with chickpeas and rice"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF"],d:["NF","GF","DF","VEG"]},batch:false},
    {day:"Friday",    meals:{b:"Banana smoothie with protein",l:"Leftover curry",d:"Greek chicken with roasted vegetables"},tags:{b:["NF","GF","DF"],l:["NF","GF","DF","VEG"],d:["NF","GF","DF"]},batch:false},
    {day:"Saturday",  meals:{b:"Overnight oats with berries",l:"Minestrone soup",d:"Ground turkey tacos with black beans"},tags:{b:["NF","GF","VEG"],l:["NF","DF","VEG"],d:["NF","GF","DF"]},batch:false},
    {day:"Sunday",    meals:{b:"Veggie omelette",l:"Chicken and rice soup",d:"Meal prep batch — double dinner"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF"],d:["NF","GF","DF"]},batch:true},
  ]},
  {week:"Week 3 — Jan 27",days:[
    {day:"Monday",    meals:{b:"Oats with banana and peanut butter",l:"Lentil soup with bread",d:"White bean and kale soup"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF","VEG"],d:["NF","GF","DF","VEG"]},batch:true},
    {day:"Tuesday",   meals:{b:"Scrambled eggs on toast",l:"Leftover white bean soup",d:"Sheet pan chicken thighs, potatoes, broccoli"},tags:{b:["NF"],l:["NF","GF","DF","VEG"],d:["NF","GF","DF"]},batch:false},
    {day:"Wednesday", meals:{b:"Greek yogurt with honey and granola",l:"Black bean quesadillas",d:"Baked salmon with rice and green beans"},tags:{b:["NF","GF"],l:["NF","VEG"],d:["NF","GF","DF"]},batch:true},
    {day:"Thursday",  meals:{b:"Avocado toast with a fried egg",l:"Leftover baked salmon",d:"Beef stir-fry with rice"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF"],d:["NF","GF","DF"]},batch:false},
    {day:"Friday",    meals:{b:"Banana smoothie with protein",l:"Leftover beef stir-fry",d:"Greek chicken with roasted vegetables"},tags:{b:["NF","GF","DF"],l:["NF","GF","DF"],d:["NF","GF","DF"]},batch:false},
    {day:"Saturday",  meals:{b:"Overnight oats with berries",l:"Pasta salad with olives and feta",d:"Shakshuka with bread"},tags:{b:["NF","GF","VEG"],l:["NF","VEG"],d:["NF","VEG"]},batch:false},
    {day:"Sunday",    meals:{b:"Veggie omelette",l:"Tuna salad sandwich",d:"Meal prep batch — double dinner"},tags:{b:["NF","GF","VEG"],l:["NF","DF"],d:["NF"]},batch:true},
  ]},
  {week:"Week 4 — Feb 3",days:[
    {day:"Monday",    meals:{b:"Oats with banana and peanut butter",l:"Minestrone soup",d:"Vegetable curry with rice"},tags:{b:["NF","GF","VEG"],l:["NF","DF","VEG"],d:["NF","GF","DF","VEG"]},batch:true},
    {day:"Tuesday",   meals:{b:"Scrambled eggs on toast",l:"Leftover curry",d:"Lemon garlic shrimp with pasta"},tags:{b:["NF"],l:["NF","GF","DF","VEG"],d:["NF","DF"]},batch:false},
    {day:"Wednesday", meals:{b:"Greek yogurt with honey and granola",l:"Tuna salad sandwich",d:"Greek chicken with roasted vegetables"},tags:{b:["NF","GF"],l:["NF","DF"],d:["NF","GF","DF"]},batch:true},
    {day:"Thursday",  meals:{b:"Avocado toast with a fried egg",l:"Leftover Greek chicken",d:"Baked chicken thighs with roasted carrots"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF"],d:["NF","GF","DF"]},batch:false},
    {day:"Friday",    meals:{b:"Banana smoothie with protein",l:"Leftover baked chicken",d:"Chicken and vegetable soup"},tags:{b:["NF","GF","DF"],l:["NF","GF","DF"],d:["NF","GF","DF"]},batch:false},
    {day:"Saturday",  meals:{b:"Overnight oats with berries",l:"Chicken wrap with hummus",d:"Ground beef stuffed peppers with rice"},tags:{b:["NF","GF","VEG"],l:["NF","DF"],d:["NF","GF","DF"]},batch:false},
    {day:"Sunday",    meals:{b:"Veggie omelette",l:"Lentil soup with bread",d:"Spaghetti with meat sauce"},tags:{b:["NF","GF","VEG"],l:["NF","GF","DF","VEG"],d:["NF"]},batch:false},
  ]},
];

function Svg({path,size=20,color="currentColor",sw=1.5}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {path.split("|").map((d,i)=><path key={i} d={d}/>)}
  </svg>;
}
const IC = {
  home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M9 22V12h6v10",
  plan:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2|M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2|M9 12l2 2 4-4",
  leaf:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z|M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  more:"M3 6h18|M3 12h18|M3 18h18",
  check:"M20 6L9 17l-5-5",
  lock:"M5 11V7a7 7 0 0 1 14 0v4|M3 11h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  back:"M15 18l-6-6 6-6",
  brain:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.16|M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.16",
  heart:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  drop:"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",
  bell:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 0 1-3.46 0",
  x:"M18 6L6 18|M6 6l12 12",
};

function SigilImp() {
  return <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
    <line x1="4" y1="7" x2="32" y2="29" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="4" y1="7" x2="7" y2="4" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="4.5" cy="6" r="1.6" stroke="#c9a84c" strokeWidth="1" fill="none"/>
    <line x1="32" y1="7" x2="4" y2="29" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="32" y1="7" x2="29" y2="4" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="31.5" cy="6" r="1.6" stroke="#c9a84c" strokeWidth="1" fill="none"/>
    <path d="M18 3C15 7 13 12 13.5 17C14 21 16 23 18 25C20 23 22 21 22.5 17C23 12 21 7 18 3Z" fill="rgba(201,168,76,0.07)" stroke="#c9a84c" strokeWidth="0.9"/>
    <line x1="18" y1="5" x2="18" y2="25" stroke="#c9a84c" strokeWidth="0.5" strokeDasharray="1.5 1.2"/>
    <path d="M16 26.5L18 33L20 26.5" fill="none" stroke="#c9a84c" strokeWidth="0.9" strokeLinecap="round"/>
    <rect x="16.5" y="24.5" width="3" height="2" rx="0.8" fill="#0d5c4a" stroke="#18c48a" strokeWidth="0.5"/>
  </svg>;
}
function SigilTend() {
  return <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
    <path d="M18 31C18 31 5 21.5 5 13.5C5 9.2 8.2 6 12.5 6C15.1 6 17.2 7.5 18 9.2C18.8 7.5 20.9 6 23.5 6C27.8 6 31 9.2 31 13.5C31 21.5 18 31 18 31Z" fill="rgba(196,120,120,0.07)" stroke="#c47878" strokeWidth="1.1"/>
    <path d="M18 28C16 23 13.5 20 13.5 15.5C13.5 13.5 15 12 16.5 12.5C16.5 12.5 18 16 18 19C18 16 19.5 12.5 19.5 12.5C21 12 22.5 13.5 22.5 15.5C22.5 20 20 23 18 28Z" fill="rgba(196,120,120,0.15)" stroke="#c47878" strokeWidth="0.7" strokeLinecap="round"/>
  </svg>;
}

function Toggle({on,col,onChange}) {
  return <button onClick={onChange} style={{width:40,height:22,borderRadius:11,background:on?col:"#2a2a2a",border:"none",cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
    <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?21:3,transition:"left 0.2s"}}/>
  </button>;
}

function Checkbox({checked,col,onChange}) {
  return <button onClick={onChange} style={{width:22,height:22,border:`1.5px solid ${checked?col:col+"55"}`,borderRadius:4,background:checked?"rgba(0,0,0,0.3)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.15s"}}>
    {checked && <Svg path={IC.check} size={12} color={col} sw={2.5}/>}
  </button>;
}

// ── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [prof,setProf]   = useState("IMP");
  const [nav,setNav]     = useState("home");
  const [hub,setHub]     = useState(null);
  const [planTab,setPlanTab] = useState("today");
  const [nourTab,setNourTab] = useState("plan");
  const [moodTab,setMoodTab] = useState("log");
  const [expHome,setExpHome] = useState(null);
  const [done,setDone]   = useState({});
  const [cart,setCart]   = useState({});
  const [hyd,setHyd]     = useState({IMP:64,TEND:72});
  const [toast,setToast] = useState(null);
  const [moodScore,setMoodScore] = useState(6);
  const [moodNote,setMoodNote]   = useState("");
  const [showMood,setShowMood]   = useState(false);
  const [showAlarm,setShowAlarm] = useState(false);
  const [alPhase,setAlPhase]     = useState("ring");
  const [alSecs,setAlSecs]       = useState(300);
  const [showOT,setShowOT]       = useState(false);
  const [otVal,setOtVal]         = useState(null);
  const [sched,setSched]         = useState(null);
  const [workDays,setWorkDays]   = useState({Mon:false,Tue:false,Wed:true,Thu:true,Fri:false,Sat:true,Sun:true});
  const [shiftStart,setShiftStart] = useState("18:00");
  const [shiftEnd,setShiftEnd]     = useState("06:00");
  const [calOff,setCalOff]       = useState(0);
  const [selDay,setSelDay]       = useState(null);
  const [events,setEvents]       = useState({"2025-01-16":[{l:"Work — 6PM–6AM",t:"18:00",type:"work"}],"2025-01-20":[{l:"Doctor appt",t:"10:30",type:"personal"}]});
  const [evLabel,setEvLabel]     = useState("");
  const [evTime,setEvTime]       = useState("09:00");
  const [evDate,setEvDate]       = useState("2025-01-14");
  const [expWeek,setExpWeek]     = useState(null);

  // ── TOUR STATE ────────────────────────────────────────────────
  const [tourDone,setTourDone]   = useState(false);
  const [tourStep,setTourStep]   = useState(0);
  const [tourDiet,setTourDiet]   = useState({nutAllergy:false,gbp:false,mthfr:false,gerd:false,gf:false,df:false});
  const [tourSched,setTourSched] = useState(null);
  const [tourDay,setTourDay]     = useState("Sat");
  const [tourTime,setTourTime]   = useState("09:00");
  const [expDay,setExpDay]       = useState(null);

  // ── DIETARY SETTINGS — these filter the meal plan rotation ──
  const [diet,setDiet] = useState({
    nutAllergy: true,   // Holli is allergic to nuts — NF is a HARD FILTER
    gbp:        true,   // GBP on — adds guidance notes, surfaces GBP meals first in swaps
    mthfr:      true,   // MTHFR on — surfaces MTHFR★ meals first in swaps
    gerd:       false,
    glutenFree: false,
    dairyFree:  false,
  });

  const T   = TH[prof];
  const imp = prof === "IMP";
  const hydCur = hyd[prof];
  const hydPct = Math.min(100, Math.round((hydCur/T.hydT)*100));

  // ── Dietary filter: hard filters remove meals, priority filters sort ──
  function mealPassesFilter(tags) {
    if (!tags) return true;
    if (diet.nutAllergy && !tags.includes("NF")) return false;
    if (diet.gerd && !tags.includes("GERD")) return false;
    if (diet.glutenFree && !tags.includes("GF")) return false;
    if (diet.dairyFree && !tags.includes("DF")) return false;
    return true;
  }
  function anyMealBlocked(day) {
    return Object.entries(day.meals).some(([slot,_]) => {
      const tags = day.tags[slot];
      return !mealPassesFilter(tags);
    });
  }

  // ── Sleep window from schedule ──
  function sleepWin() {
    if (!sched) return null;
    const h = parseInt(shiftEnd.split(":")[0]);
    const today = new Date().toLocaleDateString("en-US",{weekday:"short"}).slice(0,3);
    const working = workDays[today];
    if (!working) return {wd:"9:30 PM",sl:"10:30 PM",wk:"6:30 AM",note:"Rest day"};
    const isNight = parseInt(shiftStart.split(":")[0]) >= 17;
    if (isNight) {
      const s = (h+1)%24;
      const w = (h+8)%24;
      const f = x => `${x===0?12:x>12?x-12:x}:00 ${x<12||x===0?"AM":"PM"}`;
      return {wd:f(s),sl:f(s),wk:f(w),note:"Night shift — darken the room"};
    }
    const wk = parseInt(shiftStart.split(":")[0])-1;
    const sl = wk-8;
    const f = x=>{const n=(x+24)%24;return `${n===0?12:n>12?n-12:n}:00 ${n<12||n===0?"AM":"PM"}`;};
    return {wd:f(sl+1),sl:f(sl),wk:f(wk),note:"Pre-shift — full 8 hours"};
  }
  const sw = sleepWin();

  // ── Planner items ──
  const ITEMS = imp ? [
    {id:"decl",label:"Morning Declaration",sub:"Stand. Both feet. Speak the Axiom aloud.",time:"Before all else",col:T.gold},
    {id:"b",label:"Breakfast — Oats with banana and peanut butter",time:"8:00 AM",col:T.cNour},
    {id:"hyd",label:"First 24 oz of water — before coffee",time:"9:00 AM",col:T.cBody},
    {id:"l",label:"Lunch — Lentil soup with bread",time:"12:30 PM",col:T.cNour},
    {id:"mid",label:"Midday Anchor — 12 minutes, timer, no screen",time:"2:00 PM",col:T.cMind},
    {id:"d",label:"Dinner — Sheet pan chicken, potatoes, broccoli",time:"6:00 PM",col:T.cNour},
    {id:"inv",label:"Evening Inventory — three questions in writing",time:"9:00 PM",col:T.cMind},
  ] : [
    {id:"quiet",label:"Morning Quiet — twenty minutes before anything",time:"Before all else",col:T.cMind},
    {id:"decl",label:"Morning Declaration — speak the Axiom aloud",time:"When ready",col:T.gold},
    {id:"b",label:"Breakfast — Oats with banana and peanut butter",time:"8:00 AM",col:T.cNour},
    {id:"l",label:"Lunch — Lentil soup with bread",time:"12:30 PM",col:T.cNour},
    {id:"d",label:"Dinner — Sheet pan chicken, potatoes, broccoli",time:"6:00 PM",col:T.cNour},
    {id:"yours",label:"Replenishment Session — two hours, once this week",time:"This week",col:T.cSoul},
    {id:"inv",label:"Evening Inventory — two questions in writing",time:"Before sleep",col:T.cMind},
  ];
  if (sw) ITEMS.push({id:"bed",label:`Bedtime — wind down ${sw.wd}, sleep by ${sw.sl}`,sub:`Wake: ${sw.wk} · ${sw.note}`,time:sw.wd,col:"#4a6a9a"});
  const done_count = ITEMS.filter(it=>done[it.id]).length;

  // Hydration history / plan history for charts
  const hydHist = [68,72,80,64,90,100,hydCur];
  const planHist = [5,7,7,4,6,7,done_count];
  const moodHist = [7,4,8,3,6,9,moodScore];
  const days7 = ["M","T","W","T","F","S","S"];

  function showT(m){setToast(m);setTimeout(()=>setToast(null),2000);}
  function addCart(name,cat="Other"){
    const k=name.toLowerCase();
    if(cart[k]){showT("Already in cart");return;}
    setCart(p=>({...p,[k]:{name,cat,checked:false}}));
    showT("Added: "+name);
  }
  function goNav(k){setNav(k);setHub(null);setShowMood(false);setShowOT(false);}

  // Calendar helpers
  function buildCal(){
    const now=new Date(2025,calOff,1);
    const y=now.getFullYear(),m=now.getMonth();
    const first=new Date(y,m,1).getDay();
    const days=new Date(y,m+1,0).getDate();
    const name=["January","February","March","April","May","June","July","August","September","October","November","December"][m];
    return {y,m,first,days,name};
  }
  const cal=buildCal();

  useEffect(()=>{
    if(alPhase!=="awake")return;
    if(alSecs<=0){setAlPhase("ring");setAlSecs(300);return;}
    const t=setInterval(()=>setAlSecs(s=>s-1),1000);
    return()=>clearInterval(t);
  },[alPhase,alSecs]);

  const NAV=[
    {k:"home",ic:IC.home,l:"Home",col:T.gold},
    {k:"planner",ic:IC.plan,l:"Planner",col:T.cPlan},
    {k:"nourish",ic:IC.leaf,l:"Nourish",col:T.cNour},
    {k:"more",ic:IC.more,l:"More",col:T.cMore},
  ];

  // ── GUIDED TOUR ──────────────────────────────────────────────
  const IMP_STEPS = [
    {
      key:"welcome",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          {imp?<SigilImp/>:<SigilTend/>}
          <div style={{fontFamily:COR,fontSize:28,color:T.gold,letterSpacing:"0.16em",textTransform:"uppercase",marginTop:20,marginBottom:10}}>{T.name}</div>
          <div style={{fontFamily:COR,fontSize:18,color:T.text,letterSpacing:"0.1em",marginBottom:20}}>You are {T.title}.</div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.8}}>
            {imp?"This app is your operating system. Not a habit tracker. Not a wellness app. An architecture for a specific kind of mind."
               :"This app tends what matters. Including you. Built around the way you already give — and what you need in return."}
          </div>
        </div>
      )
    },
    {
      key:"planner",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>📋</div>
          <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>Your Daily Planner</div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.9,textAlign:"left"}}>
            {["Your shift status","Morning declaration","Today's quote","Sleep window","Meals from your plan","Hydration tracker"].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:6}}>
                <span style={{color:T.gold}}>→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:T.t3,marginTop:12,fontStyle:"italic"}}>One screen. The whole day.</div>
        </div>
      )
    },
    {
      key:"schedule",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:40,marginBottom:12}}>🗓</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Your Work Schedule</div>
            <div style={{fontSize:13,color:T.t2,lineHeight:1.8}}>The planner builds your sleep window from your shifts. Set it once — it handles the rest. We don't assume anything.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {[["rotating_223","2-2-3 Rotating — law enforcement"],["rotating_nights","Rotating 12hr Nights"],["rotating_days","Rotating 12hr Days"],["rotating_mixed","Mixed Days & Nights"],["fixed_days","Fixed Days"],["variable","Mark each day manually"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTourSched(k)} style={{padding:"9px 12px",background:tourSched===k?`rgba(${imp?"201,168,76":"196,120,120"},0.1)`:T.s2,border:`1px solid ${tourSched===k?T.gold:T.b1}`,borderRadius:5,color:tourSched===k?T.gold:T.t2,fontSize:12,textAlign:"left",cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
      )
    },
    {
      key:"alarm",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>🔔</div>
          <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>The Alarm Is Loud</div>
          <div style={{fontSize:14,color:T.text,fontStyle:"italic",marginBottom:20}}>It will wake you.</div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.9,textAlign:"left"}}>
            {[["Volume buttons","don't stop it"],["SNOOZE","comes back in 9 minutes"],["DISMISS","stops it, but we check back"],["I'M UP","confirms awake, opens your day"]].map(([label,desc],i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                <span style={{color:T.gold,minWidth:80,fontWeight:700,fontSize:12}}>{label}</span>
                <span style={{color:T.t3,fontSize:12}}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      key:"dietary",
      render:()=>(
        <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>Dietary Settings</div>
            <div style={{fontSize:12,color:T.t3,lineHeight:1.6}}>This filters the meal plan. Hard filters remove meals. Priority filters sort them.</div>
          </div>
          <div style={{fontSize:9,color:"#c07040",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>HARD FILTERS — removes meals</div>
          {[["nutAllergy","Nut Allergy","#c07040"],["gerd","GERD","#c07040"],["gf","Gluten-Free","#c07040"],["df","Dairy-Free","#c07040"]].map(([k,l,col])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.b1}`}}>
              <span style={{fontSize:13,color:T.t2}}>{l}</span>
              <Toggle on={tourDiet[k]} col={col} onChange={()=>setTourDiet(p=>({...p,[k]:!p[k]}))}/>
            </div>
          ))}
          <div style={{fontSize:9,color:T.teal,letterSpacing:"0.12em",textTransform:"uppercase",margin:"12px 0 8px"}}>PRIORITY — surfaces best matches first</div>
          {[["gbp","GBP (Gastric Bypass)",T.teal],["mthfr","MTHFR",T.teal]].map(([k,l,col])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.b1}`}}>
              <span style={{fontSize:13,color:T.t2}}>{l}</span>
              <Toggle on={tourDiet[k]} col={col} onChange={()=>setTourDiet(p=>({...p,[k]:!p[k]}))}/>
            </div>
          ))}
          <div style={{fontSize:10,color:T.t3,marginTop:12,lineHeight:1.6}}>Changeable anytime in Nourish → Dietary Settings</div>
        </div>
      )
    },
    ...(imp?[]:[{
      key:"replenishment",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:36,marginBottom:12}}>🌿</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Your Replenishment Session</div>
            <div style={{fontSize:13,color:T.t2,lineHeight:1.8}}>Once per week. Two hours. Yours. Schedule it now so it repeats automatically and shows as protected time.</div>
          </div>
          <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Day of week</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
              <button key={d} onClick={()=>setTourDay(d)} style={{flex:1,padding:"8px 4px",background:tourDay===d?`rgba(196,120,120,0.1)`:T.s2,border:`1px solid ${tourDay===d?T.gold:T.b1}`,borderRadius:4,color:tourDay===d?T.gold:T.t3,fontSize:10,cursor:"pointer",textAlign:"center"}}>{d}</button>
            ))}
          </div>
          <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Start time</div>
          <input type="time" value={tourTime} onChange={e=>setTourTime(e.target.value)} style={{width:"100%",background:T.s2,border:`1px solid ${T.b1}`,borderRadius:5,padding:"10px",color:T.text,fontSize:16,fontFamily:COR,outline:"none",marginBottom:14}}/>
          <div style={{background:`rgba(${imp?"201,168,76":"196,120,120"},0.06)`,border:`1px solid ${T.gold}33`,borderRadius:6,padding:"9px 12px",fontSize:11,color:T.t2,lineHeight:1.6,marginBottom:4}}>
            Creates a recurring calendar event every {tourDay} at {tourTime.split(":")[0]>12?parseInt(tourTime.split(":")[0])-12:tourTime.split(":")[0]}:{tourTime.split(":")[1]} {tourTime.split(":")[0]>=12?"PM":"AM"} · Protected on shared calendar · Garrin sees it blocked
          </div>
        </div>
      )
    }]),
    {
      key:"mood",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>💬</div>
          <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>
            {imp?"You and Holli":"You and Garrin"}
          </div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.9}}>
            {["Your mood log is private.","Your raw words never leave this phone.","When you choose to share:"].map((line,i)=><div key={i}>{line}</div>)}
          </div>
          <div style={{marginTop:16,fontSize:13,color:T.t2,textAlign:"left",lineHeight:1.9}}>
            {[
              imp?"Your entry is translated into her language":"Your entry is translated into his language",
              imp?"She sees a tone, not a number":"He sees a tone, not a number",
              "You see theirs the same way",
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:6}}>
                <span style={{color:T.gold}}>→</span><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      key:"locked",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:20}}>The Forge Opens Slowly</div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.8,marginBottom:20}}>This app grows with you. Each phase unlocks after the previous one is stable. Not paywalled — staged.</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
            {[
              {label:imp?"Warrior Practice":"Keep Yourself",phase:"Phase 2",day:"Day 7"},
              {label:"Doctrine",phase:"Phase 3",day:"Day 14"},
              {label:"Holy Days & Household",phase:"Phase 4",day:"Day 30"},
              {label:imp?"Vel'nar & The Book":"The Book & The Rite",phase:"Phase 5",day:"Day 30"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.s1,border:`1px solid ${T.b1}`,borderRadius:7,padding:"10px 14px"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{color:T.t3,fontSize:16}}>🔒</span>
                  <span style={{fontSize:13,color:T.t3}}>{item.label}</span>
                </div>
                <span style={{fontSize:9,color:T.gold,letterSpacing:"0.06em"}}>{item.day}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:T.t3,marginTop:16,fontStyle:"italic"}}>Build the foundation first. Everything else is waiting.</div>
        </div>
      )
    },
    {
      key:"begin",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          {imp?<SigilImp/>:<SigilTend/>}
          <div style={{fontFamily:COR,fontSize:18,color:T.gold,letterSpacing:"0.18em",textTransform:"uppercase",lineHeight:1.9,marginTop:24,whiteSpace:"pre-line"}}>{T.axiom}</div>
        </div>
      )
    },
  ];

  if (!tourDone) {
    const steps = IMP_STEPS;
    const step = steps[tourStep] || steps[steps.length-1];
    const isLast = tourStep >= steps.length - 1;
    return (
      <div style={{minHeight:"100vh",background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 12px 48px",fontFamily:JOS}}>
        <style>{`@import url('${FONT}');*{box-sizing:border-box}::-webkit-scrollbar{display:none}button{font-family:${JOS}}`}</style>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {["IMP","TEND"].map(p=>{const col=TH[p].gold;return <button key={p} onClick={()=>{setProf(p);setTourStep(0);}} style={{padding:"7px 18px",background:prof===p?`rgba(${p==="IMP"?"201,168,76":"196,120,120"},0.1)`:"transparent",border:`1px solid ${prof===p?col:"#2a2a2a"}`,color:prof===p?col:"#444",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>{TH[p].person}</button>;})}
        </div>
        <div style={{width:370,height:740,background:T.bg,borderRadius:46,border:"9px solid #181818",boxShadow:"0 0 0 1.5px #2a2a2a,0 40px 80px rgba(0,0,0,0.9)",display:"flex",flexDirection:"column",overflow:"hidden",color:T.text}}>
          {/* Tour header */}
          <div style={{height:52,background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",padding:"0 16px",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {imp?<SigilImp/>:<SigilTend/>}
              <span style={{fontSize:9,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase"}}>Setup</span>
            </div>
            <button onClick={()=>setTourDone(true)} style={{background:"transparent",border:"none",color:T.t3,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>Skip Tour</button>
          </div>

          {/* Tour content */}
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {step.render()}
          </div>

          {/* Progress dots + nav */}
          <div style={{padding:"12px 20px 20px",background:imp?"#000":T.s1,borderTop:`1px solid ${T.b1}`,flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
              {steps.map((_,i)=><div key={i} style={{width:i===tourStep?18:6,height:6,borderRadius:3,background:i===tourStep?T.gold:T.b2,transition:"all 0.2s"}}/>)}
            </div>
            <div style={{display:"flex",gap:10}}>
              {tourStep>0&&<button onClick={()=>setTourStep(s=>s-1)} style={{flex:1,padding:"12px 0",background:"transparent",border:`1px solid ${T.b1}`,color:T.t3,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>← Back</button>}
              <button onClick={()=>{if(isLast){setTourDone(true);}else{setTourStep(s=>s+1);}}} style={{flex:2,padding:"12px 0",background:isLast?T.teal:T.gold,border:"none",color:isLast?imp?"#000":"#fff":"#000",fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",borderRadius:5,fontWeight:700}}>
                {isLast?`Begin >`:`Next →`}
              </button>
            </div>
          </div>
        </div>
        <div style={{marginTop:12,fontFamily:JOS,fontSize:8.5,color:"#333",letterSpacing:"0.2em",textTransform:"uppercase",textAlign:"center"}}>
          First-open guided tour · Profile toggle switches tradition
        </div>
      </div>
    );
  }

  // ── ALARM SCREEN ─────────────────────────────────────────────

  if(showAlarm) return (
    <div style={{minHeight:"100vh",background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 12px 48px",fontFamily:JOS}}>
      <style>{`@import url('${FONT}');*{box-sizing:border-box}button{font-family:${JOS}}`}</style>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["IMP","TEND"].map(p=><button key={p} onClick={()=>setProf(p)} style={{padding:"6px 14px",background:prof===p?`rgba(${p==="IMP"?"201,168,76":"196,120,120"},0.1)`:"transparent",border:`1px solid ${prof===p?TH[p].gold:"#2a2a2a"}`,color:prof===p?TH[p].gold:"#444",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>{TH[p].person}</button>)}
      </div>
      <div style={{width:370,height:740,background:alPhase==="ring"?"#000":T.bg,borderRadius:46,border:"9px solid #181818",boxShadow:"0 0 0 1.5px #2a2a2a,0 40px 80px rgba(0,0,0,0.9)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",padding:"40px 28px"}}>
        <button onClick={()=>{setShowAlarm(false);setAlPhase("ring");setAlSecs(300);}} style={{position:"absolute",top:20,right:20,background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:22,lineHeight:1}}>x</button>
        {alPhase==="ring"?(<>
          <div style={{fontFamily:COR,fontSize:74,fontWeight:300,color:"#fff",lineHeight:1,marginBottom:6,letterSpacing:"-2px"}}>5:30</div>
          <div style={{fontSize:9,color:"#444",letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:6}}>Wednesday, January 14</div>
          <div style={{fontSize:11,color:T.gold,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:52}}>{imp?"The system begins now":"Your day begins with you"}</div>
          <div style={{width:"82%",display:"flex",flexDirection:"column",gap:12}}>
            <button style={{width:"100%",padding:"16px 0",background:"transparent",border:`1px solid ${T.gold}`,color:T.gold,fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>SNOOZE (9 min)</button>
            <button onClick={()=>setAlPhase("awake")} style={{width:"100%",padding:"16px 0",background:"transparent",border:"1px solid #262626",color:"#555",fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>DISMISS</button>
            <button onClick={()=>{setShowAlarm(false);setAlPhase("ring");}} style={{background:"transparent",border:"none",color:T.text,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",padding:"10px 0"}}>I'M UP</button>
          </div>
        </>):(<>
          <div style={{fontSize:9,color:"#444",letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:18}}>Are you awake?</div>
          <div style={{fontFamily:COR,fontSize:40,color:T.text,lineHeight:1,marginBottom:8,textAlign:"center"}}>{imp?"Still here?":"Still with us?"}</div>
          <div style={{fontSize:12,color:T.t3,textAlign:"center",lineHeight:1.7,marginBottom:32}}>You dismissed your alarm.<br/>Locks in {String(Math.floor(alSecs/60)).padStart(2,"0")}:{String(alSecs%60).padStart(2,"0")}</div>
          <div style={{width:"78%",height:3,background:T.b2,borderRadius:2,marginBottom:8,overflow:"hidden"}}>
            <div style={{width:`${(alSecs/300)*100}%`,height:"100%",background:T.teal,transition:"width 1s linear"}}/>
          </div>
          <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:28}}>Haptic pulse every 60 seconds</div>
          <div style={{fontFamily:"monospace",fontSize:28,color:T.teal,marginBottom:36}}>{String(Math.floor(alSecs/60)).padStart(2,"0")}:{String(alSecs%60).padStart(2,"0")}</div>
          <button onClick={()=>{setShowAlarm(false);setAlPhase("ring");}} style={{width:"78%",padding:"17px 0",background:T.teal,border:"none",color:imp?"#000":"#fff",fontSize:12,letterSpacing:"0.16em",textTransform:"uppercase",cursor:"pointer",borderRadius:5,fontWeight:700}}>
            {"I'M AWAKE"}{imp?"":" ♡"}
          </button>
        </>)}
      </div>
    </div>
  );

  // ── MAIN PHONE ────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 12px 48px",fontFamily:JOS}}>
      <style>{`@import url('${FONT}');*{box-sizing:border-box}::-webkit-scrollbar{display:none}button{font-family:${JOS}}`}</style>

      {/* Profile toggle */}
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["IMP","TEND"].map(p=>{
          const col=TH[p].gold;
          return <button key={p} onClick={()=>{setProf(p);setNav("home");setHub(null);setDone({});setPlanTab("today");}} style={{padding:"7px 18px",background:prof===p?`rgba(${p==="IMP"?"201,168,76":"196,120,120"},0.1)`:"transparent",border:`1px solid ${prof===p?col:"#2a2a2a"}`,color:prof===p?col:"#444",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>{TH[p].person} / {p==="IMP"?"Imperium":"Tending"}</button>;
        })}
      </div>

      {/* Phone */}
      <div style={{width:370,height:740,background:T.bg,borderRadius:46,border:"9px solid #181818",boxShadow:"0 0 0 1.5px #2a2a2a,0 40px 80px rgba(0,0,0,0.9)",display:"flex",flexDirection:"column",overflow:"hidden",color:T.text,position:"relative"}}>

        {/* HEADER */}
        <div style={{height:52,background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",padding:"0 13px",gap:9,flexShrink:0}}>
          {imp?<SigilImp/>:<SigilTend/>}
          <div>
            <div style={{fontSize:10,fontWeight:200,color:T.text,letterSpacing:"0.28em",textTransform:"uppercase"}}>{T.name}</div>
            <div style={{fontSize:7,color:T.t3,letterSpacing:"0.2em",textTransform:"uppercase"}}>{T.sub}</div>
          </div>
          <div style={{marginLeft:"auto"}}>
            <div style={{fontSize:7,padding:"2px 8px",border:`1px solid ${T.goldDim}`,borderRadius:3,color:T.gold,background:T.glow,letterSpacing:"0.18em",textTransform:"uppercase"}}>PRE-RITE</div>
          </div>
        </div>

        {/* MOOD MODAL */}
        {showMood&&(
          <div style={{position:"absolute",inset:0,zIndex:50,background:"rgba(0,0,0,0.93)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
              <div style={{fontFamily:COR,fontSize:20,color:T.text,letterSpacing:"0.12em",textTransform:"uppercase"}}>Mood Journal</div>
              <button onClick={()=>setShowMood(false)} style={{background:"transparent",border:"none",color:T.t3,cursor:"pointer",fontSize:22,lineHeight:1}}>x</button>
            </div>
            <div style={{background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,display:"flex",flexShrink:0}}>
              {[["log","My Log"],["partner",T.partnerName],["history","History"]].map(([k,l])=>(
                <button key={k} onClick={()=>setMoodTab(k)} style={{flex:1,padding:"9px 4px",background:"none",border:"none",borderBottom:`2px solid ${moodTab===k?T.cMind:"transparent"}`,color:moodTab===k?T.cMind:T.t3,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>{l}</button>
              ))}
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
              {moodTab==="log"&&(<>
                <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Private — raw entry never leaves this device</div>
                <div style={{display:"flex",gap:2,marginBottom:8,justifyContent:"space-between"}}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                    <button key={n} onClick={()=>setMoodScore(n)} style={{flex:1,height:30,borderRadius:4,background:moodScore===n?T.teal:T.s3,border:`1px solid ${moodScore===n?T.teal:T.b1}`,color:moodScore===n?imp?"#000":"#fff":T.t3,fontSize:10,cursor:"pointer"}}>{n}</button>
                  ))}
                </div>
                <div style={{height:5,background:T.s3,borderRadius:3,marginBottom:8,overflow:"hidden"}}>
                  <div style={{width:`${moodScore*10}%`,height:"100%",background:moodScore<=3?"#9a4040":moodScore<=6?T.t2:T.teal,borderRadius:3,transition:"width 0.3s"}}/>
                </div>
                <div style={{background:T.s2,borderRadius:6,padding:"8px 12px",marginBottom:10,fontSize:12,color:T.t2,textAlign:"center",fontStyle:"italic"}}>
                  {moodScore<=2?"Depleted. Heavy. Not okay.":moodScore<=4?"Hard day. Running low.":moodScore<=6?"Managing. Present. Holding.":moodScore<=8?"Solid. Good capacity.":"Exceptional. Resourced and clear."}
                </div>
                <textarea value={moodNote} onChange={e=>setMoodNote(e.target.value)} placeholder="What's happening? (private — never shared raw)" style={{width:"100%",background:T.s3,border:`1px solid ${T.b1}`,borderRadius:6,padding:"10px",color:T.text,fontSize:13,resize:"none",height:72,fontFamily:JOS,outline:"none",marginBottom:10}}/>
                <div style={{background:T.s1,border:`1px solid ${T.cMind}55`,borderRadius:8,padding:"10px 12px",marginBottom:12}}>
                  <div style={{fontSize:8.5,color:T.cMind,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Auto-Translation — what {T.partnerName} will see</div>
                  <div style={{fontSize:13,color:T.text,lineHeight:1.7,fontStyle:"italic",marginBottom:6}}>
                    {moodScore<=2?(imp?"He's carrying something heavy today. No demands tonight. Just be near.":"She's in a hard place today. No processing. Presence only.")
                    :moodScore<=4?(imp?"He's running low today. A quiet evening without expectations is what helps.":"She's depleted today. Keep things low-key. Check in gently.")
                    :moodScore<=6?(imp?"He's managing today. Moderate load. A calm evening is welcome.":"She's holding steady. Present. A check-in is welcome.")
                    :moodScore<=8?(imp?"He's solid today. Good capacity. Connection and conversation are welcome.":"She's doing well. She'd welcome real time together.")
                    :(imp?"He's exceptional today. Clear, resourced. Great night for connection.":"She's at full capacity. Wonderful day. She'd love to connect.")}
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    {[1,2,3,4,5].map(d=><div key={d} style={{width:10,height:10,borderRadius:"50%",background:d<=Math.round(moodScore/2)?T.teal:T.s3,border:`1px solid ${T.b2}`}}/>)}
                  </div>
                  <div style={{fontSize:8.5,color:T.t3,marginTop:5}}>Dot score only · {imp?"INTJ→ESFJ":"ESFJ→INTJ"} · Raw number not shared</div>
                </div>
                <button onClick={()=>{showT("Shared with "+T.partnerName);setShowMood(false);setMoodNote("");}} style={{width:"100%",padding:"11px 0",background:T.teal,border:"none",color:imp?"#000":"#fff",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5,fontWeight:700}}>Share Translation with {T.partnerName} →</button>
                <div style={{fontSize:8.5,color:T.t3,marginTop:6,textAlign:"center"}}>Translation is automatic · Raw entry stays on this device</div>
              </>)}
              {moodTab==="partner"&&(<>
                <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Translated into your register · shared by {T.partnerName}</div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"14px",marginBottom:10}}>
                  <div style={{fontSize:8.5,color:T.t3,marginBottom:8}}>Today's State</div>
                  <div style={{display:"flex",gap:5,marginBottom:10}}>
                    {[1,2,3,4,5].map(d=><div key={d} style={{width:14,height:14,borderRadius:"50%",background:d<=4?T.teal:T.s3,border:`1px solid ${T.b2}`}}/>)}
                  </div>
                  <div style={{fontFamily:COR,fontSize:15,color:T.text,fontStyle:"italic",lineHeight:1.75,marginBottom:10}}>{imp?"She's steady today. The shift was manageable. She'd welcome a quiet evening in. Keep it low-key.":"He's solid today. Good day. Real conversation is welcome tonight."}</div>
                  <div style={{background:T.s2,borderLeft:`3px solid ${T.teal}`,borderRadius:"0 5px 5px 0",padding:"9px 12px"}}>
                    <div style={{fontSize:8.5,color:T.teal,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>What this means tonight</div>
                    <div style={{fontSize:12,color:T.t2,lineHeight:1.7}}>{imp?"She's resourced. Low-demand evening is still the right call. Check in gently.":"He's in a good place. This is a good night for real connection."}</div>
                  </div>
                </div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"12px",marginBottom:8}}>
                  <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{T.partnerName} — Last 7 Days</div>
                  <div style={{display:"flex",gap:4,alignItems:"flex-end",height:48,marginBottom:6}}>
                    {[5,7,6,8,4,7,7].map((s,i)=>(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <div style={{width:"100%",background:s>=7?T.teal:s>=5?T.t2:"#9a4040",borderRadius:"3px 3px 0 0",height:`${Math.round(s/10*48)}px`,opacity:i===6?1:0.6}}/>
                        <span style={{fontSize:7,color:T.t3}}>{days7[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>)}
              {moodTab==="history"&&(<>
                <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>Your entries — private · device only</div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"12px",marginBottom:10}}>
                  <div style={{fontSize:8.5,color:T.cMind,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Your Mood — Last 7 Days</div>
                  <div style={{display:"flex",gap:3,alignItems:"flex-end",height:52,marginBottom:6}}>
                    {moodHist.map((s,i)=>(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <div style={{width:"100%",background:s>=7?T.teal:s>=5?T.t2:"#9a4040",borderRadius:"3px 3px 0 0",height:`${Math.round(s/10*52)}px`,opacity:i===6?1:0.65,transition:"height 0.4s"}}/>
                        <span style={{fontSize:7,color:T.t3}}>{days7[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:7,padding:"9px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:moodScore>=7?T.tealBg:T.s3,border:`1px solid ${moodScore>=7?T.teal:T.b2}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontFamily:COR,fontSize:14,color:moodScore>=7?T.teal:T.t2}}>{moodScore}</span>
                  </div>
                  <div><div style={{fontSize:8.5,color:T.t3,marginBottom:1}}>Today</div><div style={{fontSize:12,color:T.t2}}>{moodScore<=4?"Hard day":moodScore<=6?"Managing":"Solid"}</div></div>
                </div>
              </>)}
            </div>
          </div>
        )}

        {/* OT MODAL */}
        {showOT&&(
          <div style={{position:"absolute",inset:0,zIndex:50,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:T.s2,border:`1px solid ${T.b2}`,borderRadius:12,padding:22,width:"100%"}}>
              <div style={{fontFamily:COR,fontSize:22,color:T.text,marginBottom:4,letterSpacing:"0.14em",textTransform:"uppercase"}}>Working Late?</div>
              <div style={{fontSize:12,color:T.t3,marginBottom:18,lineHeight:1.5}}>Tonight's alarms and sleep window adjust. Tomorrow unchanged.</div>
              {otVal?(<>
                <div style={{background:T.s3,border:`1px solid ${T.teal}`,borderRadius:8,padding:"14px",textAlign:"center",marginBottom:14}}>
                  <div style={{fontSize:12,color:T.teal,marginBottom:3}}>Overtime active</div>
                  <div style={{fontFamily:COR,fontSize:32,color:T.text}}>+{otVal} hours</div>
                </div>
                <button onClick={()=>{setOtVal(null);setShowOT(false);}} style={{width:"100%",padding:"11px 0",background:"transparent",border:`1px solid ${T.b1}`,color:T.t3,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>Cancel Overtime</button>
              </>):(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[1,2,4,"Custom"].map(h=><button key={h} onClick={()=>{setOtVal(typeof h==="number"?h:2);setShowOT(false);}} style={{padding:"16px 0",background:T.s3,border:`1px solid ${T.b1}`,color:T.text,fontFamily:COR,fontSize:typeof h==="number"?26:14,cursor:"pointer",borderRadius:6,textAlign:"center"}}>{h==="Custom"?"Custom":"+"+h+"h"}</button>)}
                </div>
              )}
              {!otVal&&<button onClick={()=>setShowOT(false)} style={{width:"100%",padding:"10px 0",background:"transparent",border:`1px solid ${T.b1}`,color:T.t3,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>Cancel</button>}
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div style={{flex:1,overflowY:"auto",background:T.bg}}>

          {/* ══ HOME ══════════════════════════════════════════ */}
          {nav==="home"&&!hub&&(
            <div style={{padding:"14px"}}>
              <div style={{fontFamily:COR,fontSize:26,color:T.text,letterSpacing:"0.12em",textTransform:"uppercase"}}>Home</div>
              <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Wednesday, January 14</div>

              {/* Shift strip */}
              <div style={{background:imp?"#000":T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"9px 13px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>{goNav("planner");setPlanTab("schedule");}}>
                <div style={{display:"flex",gap:14}}>
                  <span style={{fontSize:9,color:T.shiftCol,display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:T.shiftCol,display:"inline-block"}}/>{T.person[0]}: {T.shiftSelf}</span>
                  <span style={{fontSize:9,color:T.partnerCol,display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:T.partnerCol,display:"inline-block"}}/>{T.partnerInit}: {T.shiftPartner}</span>
                </div>
                {otVal&&<span style={{fontSize:9,color:"#c07040"}}>OT +{otVal}h</span>}
                <span style={{fontSize:9,color:T.t3}}>Schedule ›</span>
              </div>

              {/* Quote */}
              <div style={{background:T.s1,borderLeft:`3px solid ${T.gold}`,borderRadius:"0 8px 8px 0",padding:"10px 13px",marginBottom:10}}>
                <div style={{fontSize:8.5,color:T.goldDim,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>Today's Quote</div>
                <div style={{fontFamily:COR,fontSize:14,color:T.t2,fontStyle:"italic",lineHeight:1.7}}>"{T.quote}"</div>
              </div>

              {/* Charts strip */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"10px 10px 7px"}}>
                  <div style={{fontSize:7.5,color:"#4a8bb8",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:7}}>Hydration / 7d</div>
                  <div style={{display:"flex",gap:2,alignItems:"flex-end",height:28}}>
                    {hydHist.map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <div style={{width:"100%",background:v>=T.hydT?"#18c48a":"#4a8bb8",borderRadius:"2px 2px 0 0",height:`${Math.round((v/T.hydT)*28)}px`,opacity:i===6?1:0.5}}/>
                      <span style={{fontSize:6,color:T.t3}}>{days7[i]}</span>
                    </div>)}
                  </div>
                </div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"10px 10px 7px"}}>
                  <div style={{fontSize:7.5,color:T.cPlan,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:7}}>Completion / 7d</div>
                  <div style={{display:"flex",gap:2,alignItems:"flex-end",height:28}}>
                    {planHist.map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <div style={{width:"100%",background:v>=6?T.teal:v>=4?T.cPlan:"#6a4a4a",borderRadius:"2px 2px 0 0",height:`${Math.round((v/7)*28)}px`,opacity:i===6?1:0.5}}/>
                      <span style={{fontSize:6,color:T.t3}}>{days7[i]}</span>
                    </div>)}
                  </div>
                </div>
              </div>

              {/* Partner mood card */}
              <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"11px 13px",marginBottom:12,display:"flex",gap:12,alignItems:"center",cursor:"pointer"}} onClick={()=>{setShowMood(true);setMoodTab("partner");}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:`rgba(${imp?"196,120,120":"201,168,76"},0.1)`,border:`1px solid ${T.partnerCol}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontFamily:COR,fontSize:15,color:T.partnerCol}}>{T.partnerInit}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:8.5,color:T.t3,marginBottom:2}}>{T.partnerName} today</div>
                  <div style={{fontSize:12,color:T.t2,fontStyle:"italic"}}>{imp?"She's steady. Shift manageable. Low-key evening preferred.":"He's solid. Good day. Connection welcome tonight."}</div>
                </div>
                <div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:d<=4?T.teal:T.b2}}/>)}</div>
              </div>

              {/* Mind/Body/Soul */}
              <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Your Practice</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                {[{k:"mind",ic:IC.brain,l:"Mind",c:T.cMind,d:"Mood · Doctrine"},{k:"body",ic:IC.heart,l:"Body",c:T.cBody,d:"Practice · Hydration"},{k:"soul",ic:IC.star,l:"Soul",c:T.cSoul,d:"Holy Days · Rite"}].map(h=>(
                  <button key={h.k} onClick={()=>setHub(h.k)} style={{background:T.s1,border:`1px solid ${h.c}44`,borderRadius:10,padding:"13px 6px",cursor:"pointer",textAlign:"center"}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:5}}><Svg path={h.ic} size={20} color={h.c}/></div>
                    <div style={{fontFamily:COR,fontSize:13,color:h.c,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:1}}>{h.l}</div>
                    <div style={{fontSize:7.5,color:T.t3,lineHeight:1.4}}>{h.d}</div>
                  </button>
                ))}
              </div>

              {/* Axiom */}
              <div style={{background:T.glow,border:`1px solid ${T.b1}`,borderRadius:8,padding:"13px",textAlign:"center"}}>
                <div style={{fontFamily:COR,fontSize:15,color:T.text,letterSpacing:"0.14em",textTransform:"uppercase",lineHeight:1.7,whiteSpace:"pre-line"}}>{T.axiom}</div>
              </div>
            </div>
          )}

          {/* ══ HUB SCREENS ══ */}
          {nav==="home"&&hub&&(
            <div style={{padding:"14px"}}>
              <button onClick={()=>setHub(null)} style={{display:"flex",alignItems:"center",gap:5,background:"transparent",border:"none",color:T.t3,cursor:"pointer",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14,padding:0}}>
                <Svg path={IC.back} size={13} color={T.t3}/> Home
              </button>
              {hub==="mind"&&(<>
                <div style={{fontFamily:COR,fontSize:22,color:T.cMind,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>Mind</div>
                <button onClick={()=>setShowMood(true)} style={{width:"100%",background:T.s1,border:`1px solid ${T.cMind}44`,borderRadius:8,padding:"13px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",marginBottom:7,textAlign:"left"}}>
                  <div><div style={{fontSize:14,color:T.text,marginBottom:2}}>Mood Tracker</div><div style={{fontSize:10,color:T.t3}}>Log · auto-translate · share with {T.partnerName}</div></div>
                  <span style={{color:T.cMind,fontSize:16}}>›</span>
                </button>
                {[{l:"Daily Quote",s:"Today's line",open:true},{l:"Evening Inventory",s:"Questions in writing",open:true},{l:"Doctrine",s:"Canon · Oath · Litany",open:false,msg:"Opens at Day 14"},{l:"Shadow Work",s:"Eight positions",open:false,msg:"Opens at Day 14"}].map((it,i)=>(
                  <div key={i} style={{background:T.s1,border:`1px solid ${it.open?T.cMind+"33":T.b1}`,borderRadius:8,padding:"13px 14px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:it.open?1:0.6}}>
                    <div><div style={{fontSize:14,color:it.open?T.text:T.t3,marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:T.t3}}>{it.s}{it.msg&&<span style={{color:T.cMind}}> · {it.msg}</span>}</div></div>
                    {it.open?<span style={{color:T.cMind,fontSize:16}}>›</span>:<Svg path={IC.lock} size={13} color={T.t3+"66"}/>}
                  </div>
                ))}
              </>)}
              {hub==="body"&&(<>
                <div style={{fontFamily:COR,fontSize:22,color:T.cBody,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>Body</div>
                <div style={{background:T.s1,border:`1px solid #4a8bb844`,borderRadius:8,padding:"13px 14px",marginBottom:7}}>
                  <div style={{fontSize:8.5,color:"#4a8bb8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Hydration</div>
                  <div style={{fontFamily:COR,fontSize:22,color:T.text,marginBottom:6}}>{hydCur} / {T.hydT} oz</div>
                  <div style={{background:T.s3,borderRadius:4,height:5,marginBottom:8,overflow:"hidden"}}><div style={{width:`${hydPct}%`,height:"100%",background:"#4a8bb8",transition:"width 0.3s"}}/></div>
                  <div style={{display:"flex",gap:6}}>
                    {[8,16].map(oz=><button key={oz} onClick={()=>setHyd(h=>({...h,[prof]:Math.min(h[prof]+oz,T.hydT)}))} style={{flex:1,padding:"7px 0",background:T.s3,border:`1px solid ${T.b1}`,color:"#4a8bb8",fontSize:11,cursor:"pointer",borderRadius:4}}>+{oz}oz</button>)}
                  </div>
                </div>
                {[{l:imp?"Warrior Practice":"Keep Yourself",s:imp?"Iaido · Kyudo · Systema":"Foundation · Breathwork",open:false,msg:"Opens at Day 7"},{l:"Supplement Stack",s:"MTHFR protocol",open:true},{l:imp?"Physical Threshold":"Your Two Hours",s:imp?"Weekly Se integration":"Non-negotiable rest",open:true}].map((it,i)=>(
                  <div key={i} style={{background:T.s1,border:`1px solid ${it.open?T.cBody+"33":T.b1}`,borderRadius:8,padding:"13px 14px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:it.open?1:0.6}}>
                    <div><div style={{fontSize:14,color:it.open?T.text:T.t3,marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:T.t3}}>{it.s}{it.msg&&<span style={{color:T.cBody}}> · {it.msg}</span>}</div></div>
                    {it.open?<span style={{color:T.cBody,fontSize:16}}>›</span>:<Svg path={IC.lock} size={13} color={T.t3+"66"}/>}
                  </div>
                ))}
              </>)}
              {hub==="soul"&&(<>
                <div style={{fontFamily:COR,fontSize:22,color:T.cSoul,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>Soul</div>
                {[{l:"Holy Days",s:"Ten observances · Calendar",msg:"Opens at Day 30"},{l:imp?"Vel'nar":"Household",s:imp?"The sovereign language":"Partner · Activities",msg:"Opens at Day 30"},{l:"The Book",s:"Eight Who Carry the Fire",msg:"Opens at Gate 4"},{l:"Rite Progress",s:"Readiness tracking",msg:"Opens at Day 30"}].map((it,i)=>(
                  <div key={i} style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"13px 14px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:0.6}}>
                    <div><div style={{fontSize:14,color:T.t3,marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:T.t3}}>{it.s} · <span style={{color:T.cSoul}}>{it.msg}</span></div></div>
                    <Svg path={IC.lock} size={13} color={T.t3+"66"}/>
                  </div>
                ))}
              </>)}
            </div>
          )}

          {/* ══ PLANNER ══════════════════════════════════════ */}
          {nav==="planner"&&(
            <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
              <div style={{background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,display:"flex",flexShrink:0}}>
                {[["today","Today"],["calendar","Calendar"],["schedule","Schedule"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setPlanTab(k)} style={{flex:1,padding:"10px 4px",background:"none",border:"none",borderBottom:`2px solid ${planTab===k?T.cPlan:"transparent"}`,color:planTab===k?T.cPlan:T.t3,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:JOS}}>{l}</button>
                ))}
              </div>

              {planTab==="today"&&(
                <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontFamily:COR,fontSize:24,color:T.cPlan,letterSpacing:"0.12em",textTransform:"uppercase"}}>Planner</div>
                      <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase"}}>Wednesday, January 14</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:COR,fontSize:20,color:T.text}}>{done_count}/{ITEMS.length}</div>
                      <div style={{fontSize:8.5,color:T.t3}}>complete</div>
                    </div>
                  </div>
                  <div style={{background:T.s3,borderRadius:4,height:4,marginBottom:12,overflow:"hidden"}}>
                    <div style={{width:`${(done_count/ITEMS.length)*100}%`,height:"100%",background:T.cPlan,transition:"width 0.3s"}}/>
                  </div>
                  {sw&&(
                    <div style={{background:T.s1,borderLeft:`3px solid #4a6a9a`,borderRadius:"0 8px 8px 0",padding:"9px 13px",marginBottom:10}}>
                      <div style={{fontSize:8.5,color:"#4a6a9a",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>Tonight's Sleep Window</div>
                      <div style={{display:"flex",gap:16}}>
                        <span style={{fontSize:12,color:T.text}}>Wind down {sw.wd}</span>
                        <span style={{fontSize:12,color:T.text}}>Sleep {sw.sl}</span>
                        <span style={{fontSize:12,color:T.text}}>Wake {sw.wk}</span>
                      </div>
                    </div>
                  )}
                  <div style={{background:T.s1,borderLeft:`3px solid ${T.gold}`,borderRadius:"0 8px 8px 0",padding:"10px 13px",marginBottom:10}}>
                    <div style={{fontFamily:COR,fontSize:14,color:T.text,fontStyle:"italic",lineHeight:1.5,marginBottom:3}}>{T.decl}</div>
                    <div style={{fontSize:9,color:T.t3}}>{T.declSub}</div>
                  </div>
                  {ITEMS.map(item=>{
                    const isDone=!!done[item.id];
                    const isOpen=expHome===item.id;
                    return (
                      <div key={item.id} style={{background:T.s1,border:`1px solid ${isOpen?item.col+"66":T.b1}`,borderRadius:8,marginBottom:6,overflow:"hidden",opacity:isDone&&!isOpen?0.52:1,transition:"all 0.2s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px"}}>
                          <Checkbox checked={isDone} col={item.col} onChange={()=>setDone(p=>({...p,[item.id]:!p[item.id]}))}/>
                          <div style={{flex:1,cursor:"pointer"}} onClick={()=>setExpHome(isOpen?null:item.id)}>
                            <div style={{fontSize:8,color:T.t3,marginBottom:1}}>{item.time}</div>
                            <div style={{fontSize:13,color:isDone&&!isOpen?T.t3:T.text,textDecoration:isDone&&!isOpen?"line-through":"none",lineHeight:1.3}}>{item.label}</div>
                            {item.sub&&!isOpen&&<div style={{fontSize:9,color:item.col+"99",marginTop:1}}>{item.sub}</div>}
                          </div>
                          <span style={{width:5,height:5,borderRadius:"50%",background:item.col,flexShrink:0}}/>
                          <button onClick={()=>setExpHome(isOpen?null:item.id)} style={{background:"transparent",border:`1px solid ${T.b2}`,borderRadius:4,padding:"3px 7px",color:isOpen?item.col:T.t3,fontSize:8.5,cursor:"pointer"}}>{isOpen?"▲":"▼"}</button>
                        </div>
                        {isOpen&&(
                          <div style={{borderTop:`1px solid ${T.b1}`,padding:"12px 13px"}}>
                            <div style={{background:`rgba(${imp?"201,168,76":"196,120,120"},0.06)`,border:`1px solid ${item.col}44`,borderRadius:6,padding:"6px 10px",marginBottom:10,display:"flex",justifyContent:"space-between"}}>
                              <span style={{fontSize:9,color:item.col,letterSpacing:"0.18em",textTransform:"uppercase"}}>{item.id==="decl"?"DECLARATION":item.id==="quiet"?"MORNING QUIET":item.id==="hyd"?"HYDRATION":item.id==="mid"?"MIDDAY ANCHOR":item.id==="inv"?"INVENTORY":item.id==="yours"?"YOUR TIME":item.id==="bed"?"BEDTIME":"MEAL"}</span>
                            </div>
                            <p style={{fontSize:12,color:T.t2,lineHeight:1.7,margin:"0 0 10px"}}>
                              {item.id==="decl"&&(imp?"Stand. Both feet flat on the floor. Spine vertical. One full breath in through the nose — hold three counts — release. Then speak this aloud, with full voice: Power from within cannot be revoked. Uncrowned. Unbowed. Unbroken. Unfinished. Pause. Let it land. Do not rush. This is the frame for the entire day.":"Before the phone. Before conversation. Find twenty minutes that are yours alone. Sit down. If you have tea, make it. When you are ready — not before — stand. Breathe in fully, hold three counts, release. Then speak aloud: The keeper of what matters is never powerless. Felt. Faithful. Full. Unspent. Sit back down. Stay with it one more minute before the day begins.")}
                              {item.id==="quiet"&&"Before anything else asks something of you. Twenty minutes — not fifteen. Sit upright, feet on the floor. No screens. No planning. Let thoughts pass without chasing them. When the twenty minutes ends, you declare. Not before."}
                              {item.id==="hyd"&&"Drink 24 oz of water before 9:00 AM. Not coffee. Not tea. Water. Your body has been without it for 7–9 hours. Room temperature is absorbed faster than cold. Fill the bottle the night before and place it where you will see it first thing. Drink it before you look at your phone."}
                              {item.id==="mid"&&"Stop completely. Set a 12-minute timer. Step away from the screen. Breathe: 4 counts in through the nose, hold 4, 6 counts out through the mouth. Repeat for 3 minutes, then sit in silence for the remaining 9. When the timer ends, drink 8 oz of water before returning to work."}
                              {item.id==="inv"&&(imp?"Three questions in writing. Every night. What did I build today? What tried to take the wheel — and did it succeed? What do I know now that I did not know this morning? Two to three sentences per question. Brevity is the discipline.":"Two questions in writing. Every night. What did I keep today? What came from fullness — and what came from depletion? Two sentences each. Read it. Put it away. Do not solve anything tonight.")}
                              {item.id==="yours"&&(<>
                              <p style={{fontSize:12,color:T.t2,lineHeight:1.7,margin:"0 0 10px"}}>Once per week. Two hours that belong entirely to you. Not daily — that is not realistic. Weekly. The same window each week, protected on the calendar so it repeats automatically.</p>
                              <p style={{fontSize:12,color:T.t2,lineHeight:1.7,margin:"0 0 10px"}}>What counts: reading, a bath, a walk alone, creating, watching something that costs no relational energy. What does not count: household tasks, messages, planning. The week it does not happen is not a failure. Find it the next week.</p>
                              <div style={{background:"rgba(196,120,120,0.06)",border:"1px solid rgba(196,120,120,0.25)",borderRadius:6,padding:"9px 11px",marginBottom:10}}>
                                <div style={{fontSize:8.5,color:T.cSoul,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>Schedule it — repeats weekly</div>
                                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                                  {["Sat","Sun","Mon","Tue","Wed","Thu","Fri"].map(d=>(
                                    <button key={d} style={{padding:"5px 9px",background:d==="Sat"?`rgba(196,120,120,0.15)`:"transparent",border:`1px solid ${d==="Sat"?T.cSoul:T.b1}`,borderRadius:4,color:d==="Sat"?T.cSoul:T.t3,fontSize:10,cursor:"pointer"}}>{d}</button>
                                  ))}
                                </div>
                                <div style={{display:"flex",gap:8,marginBottom:8}}>
                                  <div style={{flex:1}}><div style={{fontSize:8,color:T.t3,marginBottom:2}}>Start</div><input type="time" defaultValue="09:00" style={{width:"100%",background:T.s3,border:`1px solid ${T.b1}`,borderRadius:4,padding:"6px",color:T.text,fontSize:12,outline:"none"}}/></div>
                                  <div style={{flex:1}}><div style={{fontSize:8,color:T.t3,marginBottom:2}}>Duration</div>
                                    <select style={{width:"100%",background:T.s3,border:`1px solid ${T.b1}`,borderRadius:4,padding:"6px",color:T.text,fontSize:12,outline:"none"}}>
                                      <option>90 minutes</option>
                                      <option selected>2 hours</option>
                                      <option>Custom</option>
                                    </select>
                                  </div>
                                </div>
                                <button onClick={()=>showT("Replenishment Session saved — repeats weekly")} style={{width:"100%",padding:"8px 0",background:T.tealBg,border:`1px solid ${T.teal}`,borderRadius:4,color:T.teal,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>Save — Add to Calendar Weekly</button>
                              </div>
                            </>)}
                              {item.id==="bed"&&`Wind down at ${sw&&sw.wd}. Sleep by ${sw&&sw.sl}. Wake at ${sw&&sw.wk}. ${sw&&sw.note}.`}
                              {(item.id==="b"||item.id==="l"||item.id==="d")&&"Today's meal. One household, one plan. See Nourish tab for full recipe and Add to Cart for ingredients."}
                            </p>
                            <button onClick={()=>{setDone(p=>({...p,[item.id]:true}));setExpHome(null);}} style={{width:"100%",padding:"9px 0",background:T.tealBg,border:`1px solid ${T.teal}`,color:T.teal,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>Complete</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {done_count===ITEMS.length&&<div style={{background:T.tealBg,border:`1px solid ${T.teal}`,borderRadius:8,padding:"12px",textAlign:"center",marginTop:4}}><div style={{fontFamily:COR,fontSize:18,color:T.teal,letterSpacing:"0.12em",textTransform:"uppercase"}}>{imp?"Day Complete.":"You tended everything today."}</div></div>}
                </div>
              )}

              {planTab==="calendar"&&(
                <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <button onClick={()=>setCalOff(o=>o-1)} style={{fontFamily:JOS,fontSize:16,padding:"6px 14px",border:`1px solid ${T.b2}`,borderRadius:5,background:"none",color:T.t2,cursor:"pointer"}}>‹</button>
                    <div style={{fontFamily:JOS,fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:T.cPlan}}>{cal.name} {cal.y}</div>
                    <button onClick={()=>setCalOff(o=>o+1)} style={{fontFamily:JOS,fontSize:16,padding:"6px 14px",border:`1px solid ${T.b2}`,borderRadius:5,background:"none",color:T.t2,cursor:"pointer"}}>›</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{fontSize:8.5,color:T.t3,textAlign:"center",padding:"3px 0"}}>{d}</div>)}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:14}}>
                    {Array(cal.first).fill(null).map((_,i)=><div key={"e"+i}/>)}
                    {Array(cal.days).fill(null).map((_,i)=>{
                      const d=i+1;
                      const dk=`${cal.y}-${String(cal.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                      const isToday=d===14&&cal.m===0;
                      const dow=new Date(cal.y,cal.m,d).getDay();
                      const dowN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dow];
                      const isWork=sched&&workDays[dowN.slice(0,3)];
                      const evts=events[dk]||[];
                      const isSel=selDay===dk;
                      return <div key={d} onClick={()=>setSelDay(isSel?null:dk)} style={{minHeight:42,border:`1px solid ${isToday?"rgba(201,168,76,0.5)":isSel?T.cPlan+"66":T.b1}`,borderRadius:5,background:isToday?"rgba(201,168,76,0.06)":isSel?`rgba(${imp?"201,168,76":"196,120,120"},0.06)`:"#0a0a0a",padding:4,cursor:"pointer"}}>
                        <div style={{fontSize:10,fontWeight:isToday?700:400,color:isToday?T.gold:T.t3,textAlign:"right",marginBottom:2}}>{d}</div>
                        {isWork&&<div style={{width:"100%",height:2,background:imp?"rgba(88,136,176,0.5)":"rgba(196,120,120,0.5)",borderRadius:1,marginBottom:2}}/>}
                        {evts.length>0&&<div style={{fontSize:7.5,color:T.cPlan,textAlign:"center"}}>{evts.length} evt</div>}
                      </div>;
                    })}
                  </div>
                  {selDay&&(
                    <div style={{background:T.s1,border:`1px solid ${T.cPlan}44`,borderRadius:8,padding:"12px 13px",marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{fontFamily:COR,fontSize:17,color:T.text}}>{new Date(selDay+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
                        <button onClick={()=>setSelDay(null)} style={{background:"transparent",border:"none",color:T.t3,cursor:"pointer",fontSize:16,lineHeight:1}}>x</button>
                      </div>
                      {(events[selDay]||[]).map((ev,i)=>(
                        <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.b1}`}}>
                          <span style={{fontSize:9,color:T.t3,minWidth:38}}>{ev.t}</span>
                          <span style={{flex:1,fontSize:13,color:T.t2}}>{ev.l}</span>
                          <span style={{fontSize:8,padding:"1px 5px",border:`1px solid ${T.b2}`,borderRadius:2,color:T.t3}}>{ev.type}</span>
                        </div>
                      ))}
                      {(events[selDay]||[]).length===0&&<div style={{fontSize:11,color:T.t3,fontStyle:"italic"}}>No events. Add below.</div>}
                    </div>
                  )}
                  <div style={{background:T.s2,border:`1px dashed ${T.b2}`,borderRadius:8,padding:"12px 13px"}}>
                    <div style={{fontSize:9,color:T.cPlan,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>+ Add Event</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 70px",gap:6,marginBottom:6}}>
                      <input value={evLabel} onChange={e=>setEvLabel(e.target.value)} placeholder="Event name..." style={{background:"#000",border:`1px solid ${T.b2}`,borderRadius:4,padding:"8px",color:T.text,fontSize:13,outline:"none",fontFamily:JOS}}/>
                      <input type="time" value={evTime} onChange={e=>setEvTime(e.target.value)} style={{background:"#000",border:`1px solid ${T.b2}`,borderRadius:4,padding:"8px 4px",color:T.text,fontSize:12,outline:"none"}}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:6}}>
                      <input type="date" value={evDate} onChange={e=>setEvDate(e.target.value)} style={{width:"100%",background:"#000",border:`1px solid ${T.b2}`,borderRadius:4,padding:"8px",color:T.text,fontSize:12,outline:"none"}}/>
                      <button onClick={()=>{if(!evLabel.trim())return;setEvents(p=>{const k=evDate;const cur=p[k]||[];return {...p,[k]:[...cur,{l:evLabel,t:evTime,type:"personal"}]};});setEvLabel("");showT("Event added");}} style={{padding:"8px 12px",border:`1px solid ${T.cPlan}66`,borderRadius:4,background:`rgba(${imp?"201,168,76":"196,120,120"},0.08)`,color:T.cPlan,cursor:"pointer",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase"}}>Add</button>
                    </div>
                  </div>
                </div>
              )}

              {planTab==="schedule"&&(
                <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
                  <div style={{fontFamily:COR,fontSize:22,color:T.cWork,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>Work Schedule</div>
                  {sw&&<div style={{background:T.s1,border:`1px solid ${T.teal}`,borderRadius:8,padding:"11px 13px",marginBottom:12}}>
                    <div style={{fontSize:8.5,color:T.teal,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>Tonight's Sleep Window</div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      {[["Wind down",sw.wd],["Sleep",sw.sl],["Wake",sw.wk]].map(([l,v])=>(
                        <div key={l}><div style={{fontSize:8.5,color:T.t3,marginBottom:1}}>{l}</div><div style={{fontFamily:COR,fontSize:17,color:T.text}}>{v}</div></div>
                      ))}
                    </div>
                    <div style={{fontSize:9,color:T.t3,fontStyle:"italic"}}>{sw.note}</div>
                  </div>}
                  <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"13px",marginBottom:8}}>
                    <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>Schedule Type</div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {[["rotating_223","2-2-3 Rotating (law enforcement)"],["rotating_nights","12hr Nights"],["rotating_days","12hr Days"],["rotating_mixed","Mixed Days & Nights"],["fixed_days","Fixed Days"],["variable","Mark each day manually"]].map(([k,l])=>(
                        <button key={k} onClick={()=>setSched(k)} style={{padding:"9px 11px",background:sched===k?`rgba(${imp?"24,196,138":"196,120,120"},0.08)`:T.s2,border:`1px solid ${sched===k?T.teal:T.b1}`,borderRadius:5,color:sched===k?T.teal:T.t2,fontSize:11,textAlign:"left",cursor:"pointer"}}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"13px",marginBottom:8}}>
                    <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Work Days — tap to toggle</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                        <button key={d} onClick={()=>setWorkDays(p=>({...p,[d]:!p[d]}))} style={{padding:"7px 10px",background:workDays[d]?`rgba(${imp?"24,196,138":"196,120,120"},0.1)`:T.s2,border:`1px solid ${workDays[d]?T.teal:T.b1}`,borderRadius:4,color:workDays[d]?T.teal:T.t3,fontSize:11,cursor:"pointer"}}>{d}</button>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <div style={{flex:1}}><div style={{fontSize:8.5,color:T.t3,marginBottom:3}}>Start</div><input type="time" value={shiftStart} onChange={e=>setShiftStart(e.target.value)} style={{width:"100%",background:T.s2,border:`1px solid ${T.b1}`,borderRadius:5,padding:"8px",color:T.text,fontSize:13,fontFamily:COR,outline:"none"}}/></div>
                      <div style={{color:T.t3,paddingTop:16}}>→</div>
                      <div style={{flex:1}}><div style={{fontSize:8.5,color:T.t3,marginBottom:3}}>End</div><input type="time" value={shiftEnd} onChange={e=>setShiftEnd(e.target.value)} style={{width:"100%",background:T.s2,border:`1px solid ${T.b1}`,borderRadius:5,padding:"8px",color:T.text,fontSize:13,fontFamily:COR,outline:"none"}}/></div>
                    </div>
                  </div>
                  <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"11px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setShowOT(true)}>
                    <div><div style={{fontSize:14,color:T.text}}>Working Late?</div><div style={{fontSize:10,color:T.t3}}>Push tonight's alarms and sleep window</div></div>
                    <span style={{color:"#c07040",fontSize:11}}>{otVal?`+${otVal}h active`:"+Overtime"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ NOURISH ══════════════════════════════════════ */}
          {nav==="nourish"&&(
            <div style={{padding:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontFamily:COR,fontSize:26,color:T.cNour,letterSpacing:"0.12em",textTransform:"uppercase"}}>Nourish</div>
                  <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase"}}>One plan · Both people · Settings filter the rotation</div>
                </div>
              </div>

              {/* DIETARY SETTINGS — PROMINENT AT TOP */}
              <div style={{background:T.s1,border:`2px solid ${diet.nutAllergy?"#c07040":T.b1}`,borderRadius:8,padding:"12px 13px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:9,color:diet.nutAllergy?"#c07040":T.t3,letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:700}}>Dietary Settings — Filters Meal Rotation</div>
                  <button onClick={()=>setNourTab(nourTab==="settings"?"plan":"settings")} style={{fontSize:9,color:T.cNour,background:"transparent",border:`1px solid ${T.cNour}44`,padding:"3px 8px",borderRadius:3,cursor:"pointer",letterSpacing:"0.08em"}}>{nourTab==="settings"?"Done":"Edit"}</button>
                </div>

                {nourTab==="settings"?(
                  <div>
                    <div style={{fontSize:8.5,color:"#c07040",marginBottom:10,fontWeight:700}}>HARD FILTERS — removes meals that do not match. Meals without the required tag are excluded from the rotation entirely.</div>
                    {[
                      {k:"nutAllergy",l:"Nut Allergy",sub:"HARD FILTER — only NF-tagged meals appear",warning:true},
                      {k:"gerd",l:"GERD",sub:"HARD FILTER — only GERD-safe meals appear",warning:false},
                      {k:"glutenFree",l:"Gluten-Free",sub:"HARD FILTER — only GF-tagged meals appear",warning:false},
                      {k:"dairyFree",l:"Dairy-Free",sub:"HARD FILTER — only DF-tagged meals appear",warning:false},
                    ].map(setting=>(
                      <div key={setting.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.b1}`}}>
                        <div>
                          <div style={{fontSize:13,color:diet[setting.k]?"#c07040":T.t2,marginBottom:2}}>{setting.l} {diet[setting.k]&&setting.warning&&<span style={{fontSize:9,color:"#c07040"}}>⚠ Active</span>}</div>
                          <div style={{fontSize:9,color:T.t3}}>{setting.sub}</div>
                        </div>
                        <Toggle on={diet[setting.k]} col="#c07040" onChange={()=>setDiet(p=>({...p,[setting.k]:!p[setting.k]}))}/>
                      </div>
                    ))}
                    <div style={{fontSize:8.5,color:T.t3,marginTop:10,marginBottom:6}}>PRIORITY FILTERS — surfaces best matches first in swap lists. Does not remove meals.</div>
                    {[
                      {k:"gbp",l:"GBP — Gastric Bypass",sub:"Surfaces GBP★ meals first · adds portion guidance on recipe cards"},
                      {k:"mthfr",l:"MTHFR",sub:"Surfaces MTHFR★ high-folate meals first in swap lists"},
                    ].map(setting=>(
                      <div key={setting.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.b1}`}}>
                        <div>
                          <div style={{fontSize:13,color:diet[setting.k]?T.teal:T.t2,marginBottom:2}}>{setting.l}</div>
                          <div style={{fontSize:9,color:T.t3}}>{setting.sub}</div>
                        </div>
                        <Toggle on={diet[setting.k]} col={T.teal} onChange={()=>setDiet(p=>({...p,[setting.k]:!p[setting.k]}))}/>
                      </div>
                    ))}
                  </div>
                ):(
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {diet.nutAllergy&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(192,112,40,0.1)",border:"1px solid rgba(192,112,40,0.4)",borderRadius:3,color:"#c07040"}}>⚠ NUT ALLERGY ON</span>}
                    {diet.gbp&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(24,196,138,0.08)",border:`1px solid ${T.teal}44`,borderRadius:3,color:T.teal}}>GBP</span>}
                    {diet.mthfr&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(24,196,138,0.08)",border:`1px solid ${T.teal}44`,borderRadius:3,color:T.teal}}>MTHFR</span>}
                    {diet.gerd&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(192,112,40,0.1)",border:"1px solid rgba(192,112,40,0.4)",borderRadius:3,color:"#c07040"}}>GERD</span>}
                    {diet.glutenFree&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(192,112,40,0.1)",border:"1px solid rgba(192,112,40,0.4)",borderRadius:3,color:"#c07040"}}>GF</span>}
                    {diet.dairyFree&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(192,112,40,0.1)",border:"1px solid rgba(192,112,40,0.4)",borderRadius:3,color:"#c07040"}}>DF</span>}
                    {!diet.nutAllergy&&!diet.gbp&&!diet.mthfr&&!diet.gerd&&!diet.glutenFree&&!diet.dairyFree&&<span style={{fontSize:9,color:T.t3}}>No filters active</span>}
                  </div>
                )}
              </div>

              {nourTab!=="settings"&&(
                <>
                  <div style={{display:"flex",gap:5,marginBottom:12}}>
                    {[["plan","4-Week Plan"],["cart","Grocery Cart"]].map(([k,l])=>(
                      <button key={k} onClick={()=>setNourTab(k)} style={{flex:1,padding:"7px 0",background:nourTab===k?`rgba(${imp?"224,88,40":"192,96,72"},0.1)`:T.s2,border:`1px solid ${nourTab===k?T.cNour:T.b1}`,color:nourTab===k?T.cNour:T.t3,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>{l}</button>
                    ))}
                  </div>

                  {nourTab==="plan"&&(
                    <>
                      {diet.nutAllergy&&<div style={{background:"rgba(192,112,40,0.08)",border:"1px solid rgba(192,112,40,0.3)",borderRadius:6,padding:"8px 12px",marginBottom:10,fontSize:10,color:"#c07040"}}>⚠ Nut Allergy filter ON — only NF-tagged meals shown. Meals without NF tag are flagged.</div>}
                      {WEEK_PLAN.map((wk,wi)=>(
                        <div key={wi} style={{background:T.s1,border:`1px solid ${expWeek===wi?T.cNour:T.b1}`,borderRadius:8,marginBottom:8,overflow:"hidden"}}>
                          <div onClick={()=>setExpWeek(expWeek===wi?null:wi)} style={{padding:"11px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",borderBottom:expWeek===wi?`1px solid ${T.b1}`:"none"}}>
                            <div>
                              <div style={{fontSize:8.5,color:T.cNour,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:2}}>Week {wi+1}</div>
                              <div style={{fontSize:14,color:T.text}}>{wk.week}</div>
                              <div style={{fontSize:9,color:T.t3,marginTop:2}}>7 days · 21 meals</div>
                            </div>
                            <span style={{color:expWeek===wi?T.cNour:T.t3,fontSize:16}}>{expWeek===wi?"▲":"▼"}</span>
                          </div>
                          {expWeek===wi&&wk.days.map((day,di)=>{
                            const dayKey=`${wi}-${di}`;
                            const isDayOpen=expDay===dayKey;
                            const hasBlocked=anyMealBlocked(day);
                            return (
                              <div key={di} style={{borderTop:`1px solid ${T.b1}`}}>
                                <div onClick={()=>setExpDay(isDayOpen?null:dayKey)} style={{padding:"9px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:isDayOpen?T.s2:"transparent"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                                    <span style={{width:6,height:6,borderRadius:"50%",background:hasBlocked?"#c07040":day.batch?T.teal:T.b2,flexShrink:0}}/>
                                    <span style={{fontSize:13,color:T.text}}>{day.day}</span>
                                    {day.batch&&<span style={{fontSize:8,color:T.teal,letterSpacing:"0.06em"}}>BATCH</span>}
                                    {hasBlocked&&<span style={{fontSize:8,color:"#c07040"}}>⚠ filter conflict</span>}
                                  </div>
                                  <span style={{color:isDayOpen?T.cNour:T.t3,fontSize:12}}>{isDayOpen?"▲":"▼"}</span>
                                </div>
                                {isDayOpen&&(
                                  <div style={{padding:"8px 13px 12px"}}>
                                    {["b","l","d"].map(slot=>{
                                      const mealName=day.meals[slot];
                                      const tags=day.tags[slot];
                                      const blocked=!mealPassesFilter(tags);
                                      return (
                                        <div key={slot} style={{background:blocked?"rgba(192,112,40,0.06)":T.s3,border:`1px solid ${blocked?"rgba(192,112,40,0.3)":T.b1}`,borderRadius:6,padding:"9px 11px",marginBottom:6}}>
                                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                                            <div>
                                              <div style={{fontSize:8,color:blocked?"#c07040":T.cNour,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>{slot==="b"?"Breakfast":slot==="l"?"Lunch":"Dinner"}</div>
                                              <div style={{fontSize:13,color:blocked?T.t3:T.text,textDecoration:blocked?"line-through":"none"}}>{mealName}</div>
                                              {blocked&&<div style={{fontSize:9,color:"#c07040",marginTop:2}}>Not NF-tagged — swap needed</div>}
                                            </div>
                                            <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end",maxWidth:100}}>
                                              {tags.map(t=><span key={t} style={{fontSize:7,padding:"1px 4px",border:`1px solid ${t==="NF"?"#5a9a5a":T.b2}`,borderRadius:2,color:t==="NF"?"#5a9a5a":T.t3}}>{t}</span>)}
                                            </div>
                                          </div>
                                          {!blocked&&<button onClick={()=>addCart(mealName)} style={{marginTop:7,width:"100%",padding:"6px 0",background:"transparent",border:`1px solid ${T.cNour}44`,borderRadius:4,color:T.cNour,fontSize:9,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>+ Add Ingredients to Cart</button>}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </>
                  )}

                  {nourTab==="cart"&&(
                    <>
                      <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>{Object.keys(cart).length} items · {Object.values(cart).filter(v=>v.checked).length} checked · Shared household list</div>
                      {Object.keys(cart).length===0?(
                        <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"24px",textAlign:"center"}}>
                          <div style={{fontSize:13,color:T.cNour,marginBottom:6}}>Open the 4-Week Plan and tap a meal</div>
                          <div style={{fontSize:11,color:T.t3}}>Tap "+ Add Ingredients to Cart" on any meal</div>
                        </div>
                      ):(
                        Object.entries(cart).map(([k,v])=>(
                          <div key={k} onClick={()=>setCart(p=>({...p,[k]:{...p[k],checked:!p[k].checked}}))} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${T.b1}`,cursor:"pointer"}}>
                            <div style={{width:18,height:18,border:`1px solid ${v.checked?T.teal:T.b2}`,borderRadius:3,background:v.checked?T.tealBg:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              {v.checked&&<Svg path={IC.check} size={10} color={T.teal} sw={2.5}/>}
                            </div>
                            <span style={{flex:1,fontSize:13,color:v.checked?T.t3:T.t2,textDecoration:v.checked?"line-through":"none"}}>{v.name}</span>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ MORE ════════════════════════════════════════ */}
          {nav==="more"&&(
            <div style={{padding:"14px",overflowY:"auto"}}>
              <div style={{fontFamily:COR,fontSize:26,color:T.cMore,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>More</div>
              <div style={{fontFamily:JOS,fontSize:9,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>Progress</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                {[["3","DAY STREAK",T.gold],["42%","READINESS",T.teal],["7","DAYS",T.cMind]].map(([v,l,c])=>(
                  <div key={l} style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontFamily:COR,fontSize:26,color:c,fontWeight:600,lineHeight:1}}>{v}</div>
                    <div style={{fontSize:7,color:T.t3,letterSpacing:"0.08em",marginTop:3,lineHeight:1.2}}>{l}</div>
                  </div>
                ))}
              </div>
              {[[moodHist,"Mood","0.1em",T.cMind],[hydHist,"Hydration (oz)","0.1em","#4a8bb8"],[planHist,"Completion","0.1em",T.cPlan]].map(([data,label,ls,col])=>(
                <div key={label} style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"11px",marginBottom:8}}>
                  <div style={{fontSize:8.5,color:col,letterSpacing:ls,textTransform:"uppercase",marginBottom:8}}>{label} — Last 7 Days</div>
                  <div style={{display:"flex",gap:3,alignItems:"flex-end",height:44,marginBottom:5}}>
                    {data.map((v,i)=>{
                      const maxV = label==="Hydration (oz)" ? T.hydT : 10;
                      const pct = Math.round((v/maxV)*44);
                      const bg = label==="Mood" ? (v>=7?T.teal:v>=5?T.t2:"#9a4040") : label==="Hydration (oz)" ? (v>=T.hydT?"#18c48a":"#4a8bb8") : (v>=6?T.teal:v>=4?T.cPlan:"#6a4a4a");
                      return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <div style={{width:"100%",background:bg,borderRadius:"2px 2px 0 0",height:`${pct}px`,opacity:i===6?1:0.6,transition:"height 0.4s"}}/>
                        <span style={{fontSize:6.5,color:T.t3}}>{days7[i]}</span>
                      </div>;
                    })}
                  </div>
                </div>
              ))}
              <div style={{fontFamily:JOS,fontSize:9,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8,marginTop:4}}>System</div>
              {[
                {l:"Mood Journal",s:"Log · auto-translate · share",action:()=>setShowMood(true)},
                {l:`${T.partnerName}'s Mood`,s:"Translated · partner feed",action:()=>{setShowMood(true);setMoodTab("partner");}},
                {l:"Dietary Settings",s:`NF: ${diet.nutAllergy?"ON ⚠":"off"} · GBP: ${diet.gbp?"on":"off"} · MTHFR: ${diet.mthfr?"on":"off"}`,action:()=>setNourTab("settings")},
                {l:"Alarms",s:"Manage · snooze · are-you-awake",action:()=>setShowAlarm(true)},
                {l:"Settings",s:"Profile · household · targets"},
              ].map((it,i)=>(
                <div key={i} onClick={it.action?()=>{it.action();if(it.l==="Dietary Settings")goNav("nourish");}:undefined} style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"11px 13px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:it.action?"pointer":"default"}}>
                  <div><div style={{fontSize:14,color:T.text,marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:T.t3}}>{it.s}</div></div>
                  <span style={{color:T.t3,fontSize:16}}>›</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NAV */}
        <div style={{height:60,background:imp?"#000":T.s1,borderTop:`1px solid ${T.b1}`,display:"flex",alignItems:"stretch",flexShrink:0}}>
          {NAV.map(tab=>{
            const active=nav===tab.k;
            return <button key={tab.k} onClick={()=>goNav(tab.k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2.5,background:"none",border:"none",borderTop:`2px solid ${active?tab.col:"transparent"}`,color:active?tab.col:T.t3+"66",cursor:"pointer",fontSize:7,letterSpacing:"0.08em",textTransform:"uppercase",padding:"6px 1px 3px",transition:"all 0.15s",minWidth:0}}>
              <Svg path={tab.ic} size={17} color={active?tab.col:T.t3+"55"}/>
              <span>{tab.l}</span>
            </button>;
          })}
        </div>
      </div>

      {toast&&<div style={{position:"fixed",bottom:52,left:"50%",transform:"translateX(-50%)",background:TH[prof].s2,border:`1px solid ${TH[prof].b2}`,borderRadius:4,padding:"7px 14px",fontFamily:JOS,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:TH[prof].text,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>{toast}</div>}
      <div style={{marginTop:14,fontFamily:JOS,fontSize:8.5,color:"#333",letterSpacing:"0.2em",textTransform:"uppercase",textAlign:"center"}}>
        Home: Mind · Body · Soul · Planner: Today / Calendar / Schedule · Nourish: dietary settings at top
      </div>
    </div>
  );
}
