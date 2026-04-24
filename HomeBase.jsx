// HomeBase – Full App (React, self-contained)
// Repo: nashclark08-rgb/HomeBase
import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────
const T = {
  blue: '#007AFF', green: '#34C759', purple: '#5856D6',
  pink: '#FF6B9D', orange: '#FF9500', violet: '#AF52DE',
  red: '#FF3B30', label1: '#1C1C1E', label2: '#8E8E93',
  label3: '#C7C7CC', bg1: '#F2F2F7', bg2: '#FFFFFF',
  sep: '#F0F0F0',
};

// ── DATA ──────────────────────────────────────────────────────
const CHILDREN = [
  { id: 'alex', name: 'Alex', color: '#007AFF', bg: '#EBF3FF', initials: 'A', year: 'Year 4 · Class 3B' },
  { id: 'sam',  name: 'Sam',  color: '#34C759', bg: '#EAFAF0', initials: 'S', year: 'Year 2 · Class 1A' },
];
const PARENTS = [
  { id: 'mum', name: 'Mum', color: '#FF6B9D', bg: '#FFF0F6', initials: 'M', todaySchedule: ['Work 9:00–3:00pm', 'Pickup Alex 3:20pm', 'Soccer drop-off 3:45pm'], responsibilities: { alex: '3:20 pick-up', sam: '3:45 soccer drop-off' }, routines: [{ id:1, label:'Morning run', time:'6:30am', days:'Mon–Fri' },{ id:2, label:'School drop-off', time:'8:30am', days:'Mon–Fri' },{ id:3, label:'Yoga', time:'7:00pm', days:'Tue, Thu' }] },
  { id: 'dad', name: 'Dad', color: '#FF9500', bg: '#FFF8EE', initials: 'D', todaySchedule: ['Work 8:00–5:30pm', 'Pickup Alex 5:00pm'], responsibilities: { alex: '5:00 pick-up' }, routines: [{ id:1, label:'Gym', time:'6:00am', days:'Mon, Wed, Fri' },{ id:2, label:'Work commute', time:'7:45am', days:'Mon–Fri' },{ id:3, label:'Soccer coaching', time:'5:30pm', days:'Wednesday' }] },
];
const LOGISTICS = [{ id:'nan', name:'Nan', color:'#AF52DE', bg:'#F8EEFF', initials:'N', todayDriving:['Sam → Piano 4:00pm (22 Park Rd)','Sam ← Piano 4:45pm'], phone:'0412 345 678' }];
const TODAY_DATA = {
  alex: { school:{ subjects:['PE (sports uniform)','Music – bring recorder','Library'] }, packing:[{id:1,label:'Sports uniform',checked:false,pinned:false},{id:2,label:'Recorder',checked:true,pinned:false},{id:3,label:'Library book',checked:false,pinned:true},{id:4,label:'Hat',checked:false,pinned:false},{id:5,label:'Water bottle',checked:true,pinned:false}], afterSchool:[{id:1,time:'3:20',label:'Pick-up',detail:'Mum',caregiver:'Mum',fromLocation:'School Gate',icon:'🚗',isPickup:true},{id:2,time:'3:45',label:'Soccer Training',detail:'North Oval',caregiver:null,fromLocation:null,icon:'⚽',isPickup:false},{id:3,time:'5:00',label:'Pick-up',detail:'Dad',caregiver:'Dad',fromLocation:'North Oval',icon:'🚗',isPickup:true}] },
  sam:  { school:{ subjects:['Maths','Art','Reading Groups'] }, packing:[{id:1,label:'Lunch box',checked:false,pinned:false},{id:2,label:'Art smock',checked:false,pinned:false},{id:3,label:'Reading folder',checked:true,pinned:false},{id:4,label:'Water bottle',checked:false,pinned:false}], afterSchool:[{id:1,time:'3:20',label:'Pick-up',detail:'Dad',caregiver:'Dad',fromLocation:'School Gate',icon:'🚗',isPickup:true},{id:2,time:'4:00',label:'Piano Lesson',detail:'Nan driving · 22 Park Rd',caregiver:'Nan',fromLocation:null,icon:'🎹',isPickup:false},{id:3,time:'4:45',label:'Pick-up from Piano',detail:'Nan',caregiver:'Nan',fromLocation:'22 Park Rd',icon:'🚗',isPickup:true}] },
};
const CALENDAR_EVENTS = [
  {id:1,child:'alex',title:'Soccer Training',day:1,time:'3:45–5:00',location:'North Oval',dropoff:'Mum',pickup:'Dad',notes:'Bring shin pads',color:'#007AFF'},
  {id:2,child:'sam',title:'Piano Lesson',day:1,time:'4:00–4:45',location:'22 Park Rd',dropoff:'Nan',pickup:'Nan',notes:'',color:'#34C759'},
  {id:3,child:'alex',title:'Maths Club',day:2,time:'3:30–4:30',location:'Room 12',dropoff:'',pickup:'Mum',notes:'Bring calculator',color:'#007AFF'},
  {id:4,child:'sam',title:'Swimming',day:2,time:'4:30–5:30',location:'Aquatic Centre',dropoff:'Dad',pickup:'Mum',notes:'',color:'#34C759'},
  {id:5,child:'alex',title:'Playdate – Jake',day:4,time:'3:30–5:30',location:'14 Oak St',dropoff:'Mum',pickup:'Dad',notes:'Host: Sarah 0412 345 678',color:'#007AFF'},
  {id:6,child:'sam',title:"Doctor's Appt",day:2,time:'10:00–10:30',location:'Family Medical',dropoff:'',pickup:'',notes:'',color:'#34C759'},
];
const ASSESSMENTS = [
  {id:1,child:'alex',subject:'English',title:'Book Report',due:'May 3',daysLeft:11,reminder:true,calendar:true},
  {id:2,child:'alex',subject:'Science',title:'Volcano Project',due:'May 10',daysLeft:18,reminder:true,calendar:true},
  {id:3,child:'sam',subject:'Maths',title:'Times Tables Test',due:'Apr 28',daysLeft:6,reminder:true,calendar:false},
];
const NOTES = [
  {id:1,child:'alex',text:'Bring water bottle and extra snack Tuesday',date:'Mon 21 Apr'},
  {id:2,child:'sam',text:'Permission slip due Friday for excursion',date:'Mon 21 Apr'},
];
const WEEK_DAYS  = ['Mon','Tue','Wed','Thu','Fri'];
const WEEK_DATES = ['21','22','23','24','25'];

// ── GLOBAL CSS ────────────────────────────────────────────────
const GLOBAL_CSS = `
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', system-ui, sans-serif; background: #000; }
  .scroll { overflow-y: auto; -ms-overflow-style: none; scrollbar-width: none; }
  .scroll::-webkit-scrollbar { display: none; }
  @keyframes hb-pulse { 0%{transform:scale(1)} 40%{transform:scale(1.25)} 100%{transform:scale(1)} }
  @keyframes hb-slideDown { from{transform:translateY(-120%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes hb-slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes hb-allPacked { 0%{transform:scale(0.95);opacity:0} 60%{transform:scale(1.02)} 100%{transform:scale(1);opacity:1} }
  @keyframes tab-fade { from{transform:translateY(6px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes slide-in { from{transform:translateX(100%)} to{transform:translateX(0)} }
`;

// ── SHARED UI ─────────────────────────────────────────────────
function ProgressRing({ pct, color, size=36, stroke=3 }) {
  const r = (size - stroke*2)/2, circ = 2*Math.PI*r, dash = circ*pct;
  return <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color+'30'} strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:'stroke-dasharray 0.4s ease'}}/>
  </svg>;
}

function Avatar({ child, size=36, packingPct=null }) {
  const c = CHILDREN.find(ch=>ch.id===child)||CHILDREN[0];
  const showRing = packingPct !== null;
  const outer = showRing ? size+8 : size;
  return <div style={{width:outer,height:outer,position:'relative',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
    {showRing && <div style={{position:'absolute',inset:0}}><ProgressRing pct={packingPct} color={c.color} size={outer} stroke={3}/></div>}
    <div style={{width:size,height:size,borderRadius:'50%',background:c.bg,border:`2px solid ${c.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.38,fontWeight:700,color:c.color}}>{c.initials}</div>
    {showRing && packingPct===1 && <div style={{position:'absolute',bottom:0,right:0,width:16,height:16,borderRadius:8,background:c.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width="9" height="7" viewBox="0 0 9 7"><polyline points="1,3.5 3.5,6 8,1" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>}
  </div>;
}

function Badge({ label, color }) {
  return <span style={{background:color+'20',color,fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:20}}>{label}</span>;
}

function Toggle({ on, onChange }) {
  return <div onClick={()=>onChange(!on)} style={{width:51,height:31,borderRadius:16,background:on?'#34C759':'#E5E5EA',position:'relative',cursor:'pointer',transition:'background 0.2s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?22:2,width:27,height:27,borderRadius:'50%',background:'#fff',boxShadow:'0 2px 6px rgba(0,0,0,0.2)',transition:'left 0.2s'}}/>
  </div>;
}

function Checkbox({ checked, onChange, color='#007AFF', size=26, pulse=false }) {
  return <div onClick={onChange} style={{width:size,height:size,borderRadius:8,border:checked?'none':`2px solid #C7C7CC`,background:checked?color:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,transition:'all 0.15s',animation:pulse?'hb-pulse 0.35s ease':'none'}}>
    {checked && <svg width="14" height="10" viewBox="0 0 14 10"><polyline points="1,5 5,9 13,1" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
  </div>;
}

function BackButton({ onBack, label='' }) {
  return <button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:4,color:'#007AFF',fontSize:17,fontWeight:400,padding:0}}>
    <svg width="10" height="17" viewBox="0 0 10 17"><polyline points="9,1 1,8.5 9,16" stroke="#007AFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    {label}
  </button>;
}

function SectionHeader({ title }) {
  return <div style={{padding:'6px 16px 4px',fontSize:13,fontWeight:600,color:'#8E8E93',textTransform:'uppercase',letterSpacing:0.4}}>{title}</div>;
}

function Card({ children, style={} }) {
  return <div style={{background:'#fff',borderRadius:16,marginLeft:16,marginRight:16,boxShadow:'0 1px 4px rgba(0,0,0,0.08)',overflow:'hidden',...style}}>{children}</div>;
}

function Chevron() {
  return <svg width="8" height="13" viewBox="0 0 8 13"><polyline points="1,1 7,6.5 1,12" stroke="#C7C7CC" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>;
}

// ── NOTIFICATION BANNER ───────────────────────────────────────
function NotificationBanner({ notif, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 5000); return ()=>clearTimeout(t); }, []);
  return <div style={{position:'absolute',top:12,left:12,right:12,zIndex:999,background:'rgba(30,30,32,0.92)',backdropFilter:'blur(20px)',borderRadius:16,padding:'12px 14px',boxShadow:'0 8px 32px rgba(0,0,0,0.35)',animation:'hb-slideDown 0.35s cubic-bezier(.2,.8,.4,1)',cursor:'pointer'}} onClick={onDismiss}>
    <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
      <div style={{width:36,height:36,borderRadius:10,background:'#007AFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>🏠</div>
      <div style={{flex:1}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:13,fontWeight:700,color:'#fff'}}>HomeBase</span><span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>now</span></div>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.85)',marginTop:2,lineHeight:1.4}}>{notif}</div>
      </div>
    </div>
  </div>;
}

// ── SWIPEABLE CHECK ITEM ──────────────────────────────────────
function SwipeableCheckItem({ item, color, onCheck, isLast }) {
  const [offsetX, setOffsetX] = useState(0);
  const [pulse, setPulse] = useState(false);
  const startX = useRef(null);
  const handleCheck = () => { setPulse(true); setTimeout(()=>setPulse(false),400); onCheck(); };
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchMove  = (e) => { const dx = e.touches[0].clientX - startX.current; if (dx>0&&dx<80) setOffsetX(dx); };
  const onTouchEnd   = () => { if (offsetX>50&&!item.checked) handleCheck(); setOffsetX(0); };
  return <div style={{position:'relative',overflow:'hidden',borderBottom:isLast?'none':'1px solid #F2F2F7'}}>
    <div style={{position:'absolute',inset:0,background:color+'20',display:'flex',alignItems:'center',paddingLeft:16}}>
      <svg width="20" height="15" viewBox="0 0 20 15"><polyline points="1,7.5 7,13 19,1" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',background:'#fff',transform:`translateX(${offsetX}px)`,transition:offsetX===0?'transform 0.2s':'none'}}>
      <Checkbox checked={item.checked} onChange={handleCheck} color={color} pulse={pulse}/>
      <span style={{fontSize:16,color:item.checked?'#8E8E93':'#1C1C1E',textDecoration:item.checked?'line-through':'none',flex:1}}>{item.label}</span>
      {item.pinned && <span style={{fontSize:12,color:'#FF9500'}}>📌</span>}
    </div>
  </div>;
}

// ── MORNING MODE ──────────────────────────────────────────────
function MorningMode({ onExit }) {
  const [activeChild, setActiveChild] = useState('alex');
  const [packing, setPacking] = useState(()=>TODAY_DATA.alex.packing.map(p=>({...p})));
  const child = CHILDREN.find(c=>c.id===activeChild);
  const data = TODAY_DATA[activeChild];
  const packedCount = packing.filter(p=>p.checked).length;
  const pct = packing.length ? packedCount/packing.length : 0;
  const nextPickup = data.afterSchool.find(a=>a.isPickup);
  const switchChild = (id) => { setActiveChild(id); setPacking(TODAY_DATA[id].packing.map(p=>({...p}))); };
  return <div style={{flex:1,display:'flex',flexDirection:'column',background:child.color,overflow:'hidden'}}>
    <div style={{padding:'16px 20px 12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.7)',marginBottom:2}}>MORNING MODE</div>
          <div style={{fontSize:28,fontWeight:800,color:'#fff',letterSpacing:-0.5}}>Tuesday 22 Apr</div>
        </div>
        <button onClick={onExit} style={{background:'rgba(255,255,255,0.2)',border:'none',borderRadius:20,padding:'6px 14px',color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer'}}>Done</button>
      </div>
      <div style={{display:'flex',gap:8,marginTop:14}}>
        {CHILDREN.map(c => {
          const d = TODAY_DATA[c.id]; const cp = d.packing.filter(p=>p.checked).length/d.packing.length;
          return <button key={c.id} onClick={()=>switchChild(c.id)} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 14px 7px 7px',borderRadius:24,border:`2px solid ${activeChild===c.id?'#fff':'rgba(255,255,255,0.3)'}`,background:activeChild===c.id?'rgba(255,255,255,0.25)':'transparent',cursor:'pointer'}}>
            <Avatar child={c.id} size={30} packingPct={cp}/><span style={{fontSize:15,fontWeight:700,color:'#fff'}}>{c.name}</span>
          </button>;
        })}
      </div>
    </div>
    <div style={{flex:1,background:'#F2F2F7',borderRadius:'24px 24px 0 0',padding:'20px 0 0',overflow:'hidden',display:'flex',flexDirection:'column'}}>
      {nextPickup && <div style={{margin:'0 16px 14px',background:'#fff',borderRadius:16,padding:'12px 16px',display:'flex',alignItems:'center',gap:12,boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
        <div style={{fontSize:26}}>🚗</div>
        <div><div style={{fontSize:13,color:'#8E8E93',fontWeight:600}}>NEXT PICK-UP</div><div style={{fontSize:16,fontWeight:700,color:'#1C1C1E'}}>{nextPickup.time} · {nextPickup.caregiver}</div></div>
      </div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 16px 6px'}}>
        <SectionHeader title={`Packing · ${packedCount}/${packing.length}`}/>
        {pct===1 && <span style={{fontSize:13,fontWeight:700,color:'#34C759',paddingRight:16}}>All packed! ✅</span>}
      </div>
      <div className="scroll" style={{flex:1,overflowY:'auto'}}>
        <Card>
          {packing.map((item,i)=><SwipeableCheckItem key={item.id} item={item} color={child.color} onCheck={()=>setPacking(prev=>prev.map(p=>p.id===item.id?{...p,checked:!p.checked}:p))} isLast={i===packing.length-1}/>)}
        </Card>
        <div style={{height:12}}/>
        <SectionHeader title="School today"/>
        <Card style={{marginBottom:24}}>
          {data.school.subjects.map((s,i,arr)=><div key={i} style={{padding:'11px 16px',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none',fontSize:15,color:'#1C1C1E',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:7,height:7,borderRadius:4,background:child.color,flexShrink:0}}/>{s}
          </div>)}
        </Card>
      </div>
    </div>
  </div>;
}

// ── TODAY SCREEN ──────────────────────────────────────────────
function TodayScreen({ nav, showNotif, morningMode, setMorningMode }) {
  const [showFAB, setShowFAB] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const busyDays = WEEK_DAYS.map((_,i)=>CALENDAR_EVENTS.filter(e=>e.day===i).length);
  if (morningMode) return <MorningMode onExit={()=>setMorningMode(false)}/>;
  if (selectedParent) return <ParentDetailScreen parent={selectedParent} onBack={()=>setSelectedParent(null)}/>;
  return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
    <div style={{background:'#fff',padding:'12px 16px 0',borderBottom:'1px solid #F0F0F0'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <div style={{fontSize:26,fontWeight:800,letterSpacing:-0.5,color:'#1C1C1E'}}>Tuesday</div>
          <div style={{fontSize:14,color:'#8E8E93',marginTop:1}}>22 April · ☀️ 21° · Family day</div>
        </div>
        <div style={{display:'flex',gap:6,marginTop:4}}>
          <div style={{background:'#FFF3E0',border:'1px solid #FFB74D',borderRadius:10,padding:'4px 10px'}}><div style={{fontSize:10,fontWeight:700,color:'#E65100'}}>⚡ Busy</div></div>
          <button onClick={()=>setMorningMode(true)} style={{background:'#007AFF',border:'none',borderRadius:10,padding:'5px 10px',cursor:'pointer'}}><div style={{fontSize:10,fontWeight:700,color:'#fff'}}>☀️ Morning</div></button>
        </div>
      </div>
      <div style={{display:'flex',gap:4,margin:'10px 0'}}>
        {WEEK_DAYS.map((d,i)=><div key={d} style={{flex:1,textAlign:'center'}}>
          <div style={{fontSize:10,color:i===1?'#007AFF':'#8E8E93',fontWeight:i===1?700:400,marginBottom:3}}>{d}</div>
          <div style={{height:4,borderRadius:2,background:'#F2F2F7',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${Math.min(busyDays[i]/3,1)*100}%`,background:i===1?'#007AFF':'#C7C7CC',borderRadius:2}}/>
          </div>
        </div>)}
      </div>
    </div>
    <div className="scroll" style={{flex:1,overflowY:'auto',paddingTop:14,paddingBottom:80}}>
      <SectionHeader title="Children"/>
      <div style={{display:'flex',gap:10,padding:'0 16px',marginBottom:14}}>
        {CHILDREN.map(child => {
          const data = TODAY_DATA[child.id];
          const packing = data.packing;
          const packed = packing.filter(p=>p.checked).length;
          const pct = packing.length ? packed/packing.length : 0;
          const nextPickup = data.afterSchool.find(a=>a.isPickup);
          return <button key={child.id} onClick={()=>nav('dayDetail',{child:child.id})} style={{flex:1,background:'#fff',borderRadius:20,padding:'16px 14px',border:'none',cursor:'pointer',textAlign:'left',boxShadow:'0 2px 10px rgba(0,0,0,0.08)',borderTop:`4px solid ${child.color}`}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <Avatar child={child.id} size={40} packingPct={pct}/>
              <div style={{flex:1}}><div style={{fontSize:17,fontWeight:700,color:'#1C1C1E'}}>{child.name}</div><div style={{fontSize:12,color:'#8E8E93'}}>{child.year.split(' · ')[0]}</div></div>
              <svg width="8" height="13" viewBox="0 0 8 13"><polyline points="1,1 7,6.5 1,12" stroke={child.color} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:'#8E8E93',letterSpacing:0.4,marginBottom:4}}>SCHOOL</div>
              {data.school.subjects.slice(0,2).map((s,i)=><div key={i} style={{fontSize:13,color:'#3A3A3C',display:'flex',alignItems:'center',gap:6,marginBottom:2}}><div style={{width:5,height:5,borderRadius:3,background:child.color,flexShrink:0}}/>{s}</div>)}
            </div>
            <div style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><div style={{fontSize:11,fontWeight:700,color:'#8E8E93',letterSpacing:0.4}}>PACKED</div><div style={{fontSize:11,fontWeight:700,color:pct===1?'#34C759':child.color}}>{packed}/{packing.length}</div></div>
              <div style={{height:4,background:'#F2F2F7',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${pct*100}%`,background:pct===1?'#34C759':child.color,borderRadius:2,transition:'width 0.3s'}}/></div>
            </div>
            {nextPickup && <div style={{background:child.bg,borderRadius:10,padding:'7px 10px',display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:13}}>🚗</span><span style={{fontSize:12,fontWeight:600,color:child.color}}>{nextPickup.time} · {nextPickup.caregiver}</span>
            </div>}
          </button>;
        })}
      </div>
      <SectionHeader title="Parents"/>
      <div style={{display:'flex',gap:10,padding:'0 16px',marginBottom:14}}>
        {PARENTS.map(parent=><button key={parent.id} onClick={()=>setSelectedParent(parent)} style={{flex:1,background:'#fff',borderRadius:20,padding:'14px',border:'none',cursor:'pointer',textAlign:'left',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',borderTop:`4px solid ${parent.color}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div style={{width:38,height:38,borderRadius:19,background:parent.bg,border:`2px solid ${parent.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:parent.color}}>{parent.initials}</div>
            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:'#1C1C1E'}}>{parent.name}</div><div style={{fontSize:11,color:'#8E8E93'}}>Parent</div></div>
          </div>
          {parent.todaySchedule.slice(0,2).map((s,i)=><div key={i} style={{fontSize:12,color:'#3A3A3C',display:'flex',alignItems:'center',gap:6,marginBottom:3}}><div style={{width:5,height:5,borderRadius:3,background:parent.color,flexShrink:0}}/>{s}</div>)}
          {parent.todaySchedule.length>2 && <div style={{fontSize:11,color:parent.color,marginTop:3}}>+{parent.todaySchedule.length-2} more</div>}
        </button>)}
      </div>
      <SectionHeader title="Logistics · Today's drivers"/>
      {LOGISTICS.map(person=><div key={person.id} style={{background:'#fff',borderRadius:16,padding:'14px 16px',marginLeft:16,marginRight:16,marginBottom:10,boxShadow:'0 1px 4px rgba(0,0,0,0.07)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <div style={{width:38,height:38,borderRadius:19,background:person.bg,border:`2px solid ${person.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:person.color}}>{person.initials}</div>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:'#1C1C1E'}}>{person.name}</div><div style={{fontSize:11,color:person.color,fontWeight:600}}>🚗 Logistics</div></div>
          {person.phone && <div style={{fontSize:12,color:'#007AFF'}}>{person.phone}</div>}
        </div>
        {person.todayDriving.map((d,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,padding:'6px 0',borderTop:i===0?'1px solid #F2F2F7':'none'}}><span style={{fontSize:14}}>🚐</span><span style={{fontSize:13,color:'#3A3A3C',flex:1}}>{d}</span></div>)}
      </div>)}
      <SectionHeader title="Timeline"/>
      <Card style={{marginBottom:80,padding:'8px 0'}}>
        {[...CHILDREN.flatMap(child=>TODAY_DATA[child.id].afterSchool.map(e=>({...e,childId:child.id,childName:child.name,childColor:child.color})))].sort((a,b)=>a.time.localeCompare(b.time)).map((item,i,arr)=><div key={`${item.childId}-${item.id}`} style={{display:'flex',gap:10,padding:'9px 14px',position:'relative',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none'}}>
          <div style={{width:38,textAlign:'right',paddingTop:4,flexShrink:0}}><div style={{fontSize:12,fontWeight:600,color:'#8E8E93'}}>{item.time}</div></div>
          <div style={{width:28,height:28,borderRadius:14,background:item.childColor+'18',border:`2px solid ${item.childColor}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{item.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:'#1C1C1E'}}>{item.label}</div><div style={{fontSize:12,color:'#8E8E93'}}>{item.childName} · {item.detail}</div></div>
        </div>)}
      </Card>
    </div>
    <div style={{position:'absolute',bottom:74,right:20}}>
      {showFAB && <div style={{position:'absolute',bottom:64,right:0,display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
        {[{icon:'📷',label:'Photo / OCR',action:()=>{setShowFAB(false);showNotif('Photo capture coming soon 📷');}},{icon:'📝',label:'Quick note',action:()=>{setShowFAB(false);showNotif('Note saved to Lists 📝');}},{icon:'📆',label:'Add event',action:()=>setShowFAB(false)}].map(a=><button key={a.label} onClick={a.action} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',background:'#1C1C1E',borderRadius:24,border:'none',cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.3)'}}>
          <span style={{fontSize:18}}>{a.icon}</span><span style={{fontSize:15,fontWeight:600,color:'#fff'}}>{a.label}</span>
        </button>)}
      </div>}
      <button onClick={()=>setShowFAB(!showFAB)} style={{width:56,height:56,borderRadius:28,background:showFAB?'#636366':'#007AFF',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(0,122,255,0.4)',fontSize:28,color:'#fff',transition:'all 0.2s',transform:showFAB?'rotate(45deg)':'none'}}>+</button>
    </div>
  </div>;
}

// ── DAY DETAIL ────────────────────────────────────────────────
function DayDetailScreen({ params, onBack }) {
  const child = CHILDREN.find(c=>c.id===params.child)||CHILDREN[0];
  const data = TODAY_DATA[params.child];
  const [packing, setPacking] = useState(data.packing.map(p=>({...p})));
  const packed = packing.filter(p=>p.checked).length;
  const pct = packing.length ? packed/packing.length : 0;
  return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
    <div style={{background:child.bg,padding:'12px 16px 14px',borderBottom:`2px solid ${child.color}30`,display:'flex',alignItems:'center',gap:12}}>
      <BackButton onBack={onBack}/><div style={{flex:1,textAlign:'center'}}><div style={{fontSize:17,fontWeight:600,color:'#1C1C1E'}}>Tuesday 22 April</div><div style={{fontSize:13,color:child.color,fontWeight:600}}>{child.name}</div></div><div style={{width:50}}/>
    </div>
    <div className="scroll" style={{flex:1,overflowY:'auto',padding:'16px 0'}}>
      <SectionHeader title="School"/>
      <Card style={{marginBottom:12}}>
        {data.school.subjects.map((s,i,arr)=><div key={i} style={{padding:'12px 16px',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none',fontSize:15,color:'#1C1C1E',display:'flex',alignItems:'center',gap:10}}><div style={{width:8,height:8,borderRadius:4,background:child.color}}/>{s}</div>)}
      </Card>
      <SectionHeader title={`Packing · ${packed}/${packing.length}`}/>
      <Card style={{marginBottom:12}}>
        {packing.map((item,i)=><SwipeableCheckItem key={item.id} item={item} color={child.color} onCheck={()=>setPacking(prev=>prev.map(p=>p.id===item.id?{...p,checked:!p.checked}:p))} isLast={i===packing.length-1}/>)}
        {pct===1 && <div style={{padding:'11px 16px',background:'#EAFAF0',textAlign:'center',fontSize:14,fontWeight:700,color:'#34C759',animation:'hb-allPacked 0.4s ease'}}>✅ All packed for {child.name}!</div>}
      </Card>
      <SectionHeader title="After School"/>
      <Card style={{marginBottom:12,padding:'8px 0'}}>
        {data.afterSchool.map((item,i,arr)=><div key={item.id} style={{display:'flex',gap:12,padding:'10px 16px',position:'relative'}}>
          {i<arr.length-1 && <div style={{position:'absolute',left:40,top:34,bottom:-10,width:2,background:'#F2F2F7'}}/>}
          <div style={{textAlign:'right',width:36,paddingTop:6,flexShrink:0}}><div style={{fontSize:12,fontWeight:600,color:'#8E8E93'}}>{item.time}</div></div>
          <div style={{width:32,height:32,borderRadius:16,background:child.bg,border:`2px solid ${child.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{item.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:'#1C1C1E'}}>{item.label}</div><div style={{fontSize:13,color:'#8E8E93'}}>{item.detail}</div></div>
        </div>)}
      </Card>
      <SectionHeader title="Notes"/>
      <Card><div style={{padding:'14px 16px',fontSize:15,color:'#3A3A3C',fontStyle:'italic'}}>"Bring water bottle and extra snack"</div></Card>
    </div>
  </div>;
}

// ── PARENT DETAIL ─────────────────────────────────────────────
function ParentDetailScreen({ parent, onBack }) {
  return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
    <div style={{background:parent.bg,padding:'12px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:`2px solid ${parent.color}30`}}>
      <BackButton onBack={onBack}/><div style={{flex:1,textAlign:'center',fontSize:17,fontWeight:600}}>{parent.name}</div><button style={{background:'none',border:'none',color:'#007AFF',fontSize:15,cursor:'pointer'}}>Edit</button>
    </div>
    <div className="scroll" style={{flex:1,overflowY:'auto',padding:'16px 0'}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:16}}>
        <div style={{width:72,height:72,borderRadius:36,background:parent.bg,border:`3px solid ${parent.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontWeight:700,color:parent.color,marginBottom:8}}>{parent.initials}</div>
        <div style={{fontSize:20,fontWeight:700,color:'#1C1C1E'}}>{parent.name}</div>
        <div style={{fontSize:14,color:parent.color,fontWeight:600}}>Parent · Admin</div>
      </div>
      <SectionHeader title="Today's Schedule"/>
      <Card style={{marginBottom:12}}>
        {parent.todaySchedule.map((s,i,arr)=><div key={i} style={{padding:'12px 16px',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:7,height:7,borderRadius:4,background:parent.color,flexShrink:0}}/><span style={{fontSize:15,color:'#1C1C1E'}}>{s}</span>
        </div>)}
      </Card>
      <SectionHeader title="Pick-up responsibilities today"/>
      <Card style={{marginBottom:12}}>
        {Object.entries(parent.responsibilities).map(([childId,task],i,arr)=>{
          const child = CHILDREN.find(c=>c.id===childId);
          return <div key={childId} style={{padding:'12px 16px',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none',display:'flex',alignItems:'center',gap:10}}>
            <Avatar child={childId} size={30}/><div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:'#1C1C1E'}}>{child?.name}</div><div style={{fontSize:13,color:'#8E8E93'}}>{task}</div></div>
          </div>;
        })}
      </Card>
      <SectionHeader title="My Routines"/>
      <Card style={{marginBottom:12}}>
        {parent.routines.map((r,i)=><div key={r.id} style={{padding:'12px 16px',borderBottom:i<parent.routines.length-1?'1px solid #F2F2F7':'none'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div><div style={{fontSize:15,fontWeight:600,color:'#1C1C1E'}}>{r.label}</div><div style={{fontSize:13,color:'#8E8E93'}}>{r.time} · {r.days}</div></div><div style={{width:8,height:8,borderRadius:4,background:parent.color,marginTop:6}}/></div>
        </div>)}
      </Card>
    </div>
  </div>;
}

// ── CALENDAR SCREEN ───────────────────────────────────────────
function CalendarScreen() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  if (selectedEvent) {
    const [dropoff, setDropoff] = useState(!!selectedEvent.dropoff);
    const [pickup, setPickup] = useState(!!selectedEvent.pickup);
    return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
      <div style={{background:'#fff',padding:'12px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid #F2F2F7'}}>
        <BackButton onBack={()=>setSelectedEvent(null)}/><div style={{flex:1,textAlign:'center',fontSize:17,fontWeight:600}}>{selectedEvent.title}</div><button style={{background:'none',border:'none',color:'#007AFF',fontSize:15,cursor:'pointer'}}>Edit</button>
      </div>
      <div className="scroll" style={{flex:1,overflowY:'auto',padding:'16px 0'}}>
        <Card style={{marginBottom:12}}>
          <div style={{padding:'14px 16px',borderBottom:'1px solid #F2F2F7'}}><div style={{fontSize:15,fontWeight:600,color:'#1C1C1E'}}>📅 {WEEK_DAYS[selectedEvent.day]} 22 Apr · {selectedEvent.time}</div></div>
          {selectedEvent.location && <div style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:8}}><span>📍</span><span style={{fontSize:15,color:'#007AFF'}}>{selectedEvent.location}</span></div>}
        </Card>
        <Card style={{marginBottom:12}}>
          <div style={{padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #F2F2F7'}}>
            <div><div style={{fontSize:15,fontWeight:500}}>Drop-off required</div>{dropoff&&selectedEvent.dropoff&&<div style={{fontSize:13,color:'#8E8E93'}}>{selectedEvent.dropoff}</div>}</div><Toggle on={dropoff} onChange={setDropoff}/>
          </div>
          <div style={{padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><div style={{fontSize:15,fontWeight:500}}>Pick-up required</div>{pickup&&selectedEvent.pickup&&<div style={{fontSize:13,color:'#8E8E93'}}>{selectedEvent.pickup}</div>}</div><Toggle on={pickup} onChange={setPickup}/>
          </div>
        </Card>
        {selectedEvent.notes && <><SectionHeader title="Notes"/><Card style={{marginBottom:12}}><div style={{padding:'14px 16px',fontSize:15,color:'#3A3A3C',fontStyle:'italic'}}>"{selectedEvent.notes}"</div></Card></>}
        <div style={{display:'flex',gap:10,padding:'0 16px'}}>
          <button style={{flex:1,padding:'14px',borderRadius:14,border:'1.5px solid #007AFF',background:'#fff',color:'#007AFF',fontSize:16,fontWeight:600,cursor:'pointer'}}>Duplicate</button>
          <button style={{flex:1,padding:'14px',borderRadius:14,border:'1.5px solid #FF3B30',background:'#fff',color:'#FF3B30',fontSize:16,fontWeight:600,cursor:'pointer'}}>Delete</button>
        </div>
      </div>
    </div>;
  }
  const dayEvents = CALENDAR_EVENTS.filter(e=>e.day===selectedDay);
  return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
    <div style={{background:'#fff',padding:'12px 16px 0',borderBottom:'1px solid #F2F2F7'}}>
      <div style={{fontSize:28,fontWeight:700,letterSpacing:-0.5,color:'#1C1C1E',marginBottom:14}}>Calendar</div>
      <div style={{display:'flex',marginLeft:-16,marginRight:-16}}>
        {WEEK_DAYS.map((d,i)=><button key={d} onClick={()=>setSelectedDay(i)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'8px 4px 12px',border:'none',background:'transparent',cursor:'pointer',borderBottom:selectedDay===i?'3px solid #007AFF':'3px solid transparent'}}>
          <div style={{fontSize:12,color:selectedDay===i?'#007AFF':'#8E8E93',fontWeight:500}}>{d}</div>
          <div style={{width:34,height:34,borderRadius:17,marginTop:4,background:selectedDay===i?'#007AFF':'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{fontSize:17,fontWeight:600,color:selectedDay===i?'#fff':'#1C1C1E'}}>{WEEK_DATES[i]}</div>
          </div>
          <div style={{display:'flex',gap:3,marginTop:4,height:6}}>
            {CALENDAR_EVENTS.filter(e=>e.day===i).slice(0,3).map((e,j)=><div key={j} style={{width:6,height:6,borderRadius:3,background:e.color}}/>)}
          </div>
        </button>)}
      </div>
    </div>
    <div className="scroll" style={{flex:1,overflowY:'auto',padding:'12px 0 20px'}}>
      {dayEvents.length===0
        ? <div style={{textAlign:'center',padding:'60px 20px'}}><div style={{fontSize:48,marginBottom:12}}>🎉</div><div style={{fontSize:18,fontWeight:700,color:'#1C1C1E',marginBottom:6}}>Nothing on!</div><div style={{fontSize:15,color:'#8E8E93'}}>Enjoy a quiet afternoon.</div></div>
        : <>{
          <SectionHeader title={`${WEEK_DAYS[selectedDay]} ${WEEK_DATES[selectedDay]} April`}/>}
          {dayEvents.map(event=><button key={event.id} onClick={()=>setSelectedEvent(event)} style={{width:'calc(100% - 32px)',marginLeft:16,marginBottom:10,background:'#fff',borderRadius:16,padding:'14px 16px',border:'none',cursor:'pointer',textAlign:'left',boxShadow:'0 1px 4px rgba(0,0,0,0.08)',display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:4,height:50,borderRadius:2,background:event.color,flexShrink:0}}/>
            <Avatar child={event.child} size={36}/>
            <div style={{flex:1}}><div style={{fontSize:16,fontWeight:600,color:'#1C1C1E'}}>{event.title}</div><div style={{fontSize:13,color:'#8E8E93',marginTop:2}}>{event.time}</div>{event.location&&<div style={{fontSize:13,color:'#8E8E93'}}>📍 {event.location}</div>}</div>
            <Chevron/>
          </button>)}
        </>
      }
    </div>
  </div>;
}

// ── LISTS SCREEN ──────────────────────────────────────────────
function ListsScreen() {
  const [activeList, setActiveList] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [filterChild, setFilterChild] = useState('all');

  if (activeAssessment) {
    const [reminder, setReminder] = useState(activeAssessment.reminder);
    const [calendar, setCalendar] = useState(activeAssessment.calendar);
    return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
      <div style={{background:'#fff',padding:'12px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid #F2F2F7'}}>
        <BackButton onBack={()=>setActiveAssessment(null)}/><div style={{flex:1,textAlign:'center',fontSize:17,fontWeight:600}}>Assessment</div><div style={{width:50}}/>
      </div>
      <div className="scroll" style={{flex:1,overflowY:'auto',padding:'16px 0'}}>
        <Card style={{marginBottom:12}}>
          {[['Subject',activeAssessment.subject],['Title',activeAssessment.title],['Due date',activeAssessment.due],['Child',CHILDREN.find(c=>c.id===activeAssessment.child)?.name]].map(([l,v],i,arr)=><div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 16px',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none'}}>
            <span style={{fontSize:15,color:'#8E8E93'}}>{l}</span><span style={{fontSize:15,fontWeight:600,color:'#1C1C1E'}}>{v}</span>
          </div>)}
        </Card>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 16px',borderBottom:'1px solid #F2F2F7'}}><span style={{fontSize:15}}>Reminder (1 week before)</span><Toggle on={reminder} onChange={setReminder}/></div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 16px'}}><span style={{fontSize:15}}>Linked to calendar</span><Toggle on={calendar} onChange={setCalendar}/></div>
        </Card>
      </div>
    </div>;
  }

  if (activeList==='assessments') {
    const filtered = filterChild==='all' ? ASSESSMENTS : ASSESSMENTS.filter(a=>a.child===filterChild);
    return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
      <div style={{background:'#fff',padding:'12px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid #F2F2F7'}}>
        <BackButton onBack={()=>setActiveList(null)}/><div style={{flex:1,textAlign:'center',fontSize:17,fontWeight:600}}>Assessment Tasks</div><div style={{width:50}}/>
      </div>
      <div style={{background:'#fff',padding:'8px 16px 12px',display:'flex',gap:8}}>
        {[{id:'all',label:'All'},...CHILDREN.map(c=>({id:c.id,label:c.name}))].map(f=><button key={f.id} onClick={()=>setFilterChild(f.id)} style={{padding:'6px 14px',borderRadius:20,border:filterChild===f.id?'2px solid #007AFF':'2px solid #E5E5EA',background:filterChild===f.id?'#EBF3FF':'#fff',color:filterChild===f.id?'#007AFF':'#8E8E93',fontSize:14,fontWeight:600,cursor:'pointer'}}>{f.label}</button>)}
      </div>
      <div className="scroll" style={{flex:1,overflowY:'auto',padding:'12px 0'}}>
        {filtered.map(a=>{const urgent=a.daysLeft<=7; return <button key={a.id} onClick={()=>setActiveAssessment(a)} style={{width:'calc(100% - 32px)',marginLeft:16,marginBottom:10,background:'#fff',borderRadius:16,padding:'14px 16px',border:'none',cursor:'pointer',textAlign:'left',boxShadow:'0 1px 4px rgba(0,0,0,0.08)',display:'flex',gap:12,alignItems:'center'}}>
          <Avatar child={a.child} size={38}/><div style={{flex:1}}><div style={{fontSize:16,fontWeight:600,color:'#1C1C1E'}}>{a.title}</div><div style={{fontSize:13,color:'#8E8E93'}}>{a.subject} · Due {a.due}</div></div>
          <div style={{fontSize:12,fontWeight:700,color:urgent?'#FF3B30':'#34C759',background:urgent?'#FFF0EE':'#EAFAF0',padding:'3px 8px',borderRadius:10}}>{a.daysLeft}d left</div>
        </button>;})}
      </div>
    </div>;
  }

  if (activeList==='notes') {
    const filtered = filterChild==='all' ? NOTES : NOTES.filter(n=>n.child===filterChild);
    return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
      <div style={{background:'#fff',padding:'12px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid #F2F2F7'}}>
        <BackButton onBack={()=>setActiveList(null)}/><div style={{flex:1,textAlign:'center',fontSize:17,fontWeight:600}}>Notes</div><button style={{background:'none',border:'none',color:'#007AFF',fontSize:15,cursor:'pointer'}}>+ Add</button>
      </div>
      <div className="scroll" style={{flex:1,overflowY:'auto',padding:'12px 16px',display:'flex',flexDirection:'column',gap:10}}>
        {filtered.map(note=><div key={note.id} style={{background:'#fff',borderRadius:16,padding:'14px 16px',boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><Avatar child={note.child} size={22}/><span style={{fontSize:13,color:'#8E8E93'}}>{note.date}</span></div>
          <div style={{fontSize:15,color:'#1C1C1E'}}>{note.text}</div>
        </div>)}
      </div>
    </div>;
  }

  const categories = [
    {id:'uniforms',icon:'🧦',label:'Uniforms',sub:'School & sport'},
    {id:'kitchen',icon:'🛒',label:'Kitchen',sub:'Shopping list'},
    {id:'gifts',icon:'🎁',label:'Gifts',sub:'Birthdays & events'},
    {id:'assessments',icon:'📚',label:'Assessment Tasks',sub:`${ASSESSMENTS.length} tasks`,badge:ASSESSMENTS.filter(a=>a.daysLeft<=7).length},
    {id:'notes',icon:'📝',label:'Notes',sub:`${NOTES.length} notes`},
  ];
  return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
    <div style={{background:'#fff',padding:'12px 16px 14px',borderBottom:'1px solid #F2F2F7'}}><div style={{fontSize:28,fontWeight:700,letterSpacing:-0.5,color:'#1C1C1E'}}>Lists</div></div>
    <div className="scroll" style={{flex:1,overflowY:'auto',padding:'16px 0'}}>
      <Card>
        {categories.map((cat,i)=><button key={cat.id} onClick={()=>setActiveList(cat.id)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'14px 16px',display:'flex',alignItems:'center',gap:14,borderBottom:i<categories.length-1?'1px solid #F2F2F7':'none',textAlign:'left'}}>
          <div style={{width:44,height:44,borderRadius:12,background:'#F2F2F7',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center'}}>{cat.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:600,color:'#1C1C1E'}}>{cat.label}</div><div style={{fontSize:13,color:'#8E8E93'}}>{cat.sub}</div></div>
          {cat.badge>0 && <div style={{background:'#FF3B30',borderRadius:12,minWidth:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 6px'}}><span style={{fontSize:13,fontWeight:700,color:'#fff'}}>{cat.badge}</span></div>}
          <Chevron/>
        </button>)}
      </Card>
    </div>
  </div>;
}

// ── FAMILY SCREEN ─────────────────────────────────────────────
function FamilyScreen() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  if (selectedParent) return <ParentDetailScreen parent={selectedParent} onBack={()=>setSelectedParent(null)}/>;
  if (selectedChild) {
    const child = selectedChild;
    return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
      <div style={{background:child.bg,padding:'12px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:`2px solid ${child.color}30`}}>
        <BackButton onBack={()=>setSelectedChild(null)}/><div style={{flex:1,textAlign:'center',fontSize:17,fontWeight:600}}>{child.name}</div><button style={{background:'none',border:'none',color:'#007AFF',fontSize:15,cursor:'pointer'}}>Edit</button>
      </div>
      <div className="scroll" style={{flex:1,overflowY:'auto',padding:'20px 16px'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:20}}>
          <div style={{width:80,height:80,borderRadius:40,background:child.bg,border:`3px solid ${child.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,fontWeight:700,color:child.color,marginBottom:8}}>{child.initials}</div>
          <div style={{fontSize:22,fontWeight:700,color:'#1C1C1E'}}>{child.name}</div>
          <div style={{fontSize:15,color:'#8E8E93'}}>{child.year}</div>
        </div>
        <Card>
          {[['Default uniform','Sports (Tue/Thu), Standard'],['Recurring activities','Soccer, Swimming'],['Linked caregivers','Mum, Dad, Nan']].map(([l,v],i,arr)=><div key={l} style={{padding:'13px 16px',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none'}}>
            <div style={{fontSize:12,color:'#8E8E93',fontWeight:600,marginBottom:2}}>{l.toUpperCase()}</div><div style={{fontSize:15,color:'#1C1C1E'}}>{v}</div>
          </div>)}
        </Card>
      </div>
    </div>;
  }
  return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
    <div style={{background:'#fff',padding:'12px 16px 14px',borderBottom:'1px solid #F2F2F7'}}><div style={{fontSize:28,fontWeight:700,letterSpacing:-0.5,color:'#1C1C1E'}}>Family</div></div>
    <div className="scroll" style={{flex:1,overflowY:'auto',padding:'16px 0'}}>
      <SectionHeader title="Children"/>
      <Card style={{marginBottom:12}}>
        {CHILDREN.map((child,i)=><button key={child.id} onClick={()=>setSelectedChild(child)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'14px 16px',display:'flex',alignItems:'center',gap:12,borderBottom:i<CHILDREN.length-1?'1px solid #F2F2F7':'none'}}>
          <Avatar child={child.id} size={46}/><div style={{flex:1,textAlign:'left'}}><div style={{fontSize:17,fontWeight:600,color:'#1C1C1E'}}>{child.name}</div><div style={{fontSize:14,color:'#8E8E93'}}>{child.year}</div></div><Chevron/>
        </button>)}
      </Card>
      <SectionHeader title="Parents"/>
      <Card style={{marginBottom:12}}>
        {PARENTS.map((parent,i)=><button key={parent.id} onClick={()=>setSelectedParent(parent)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'14px 16px',display:'flex',alignItems:'center',gap:12,borderBottom:i<PARENTS.length-1?'1px solid #F2F2F7':'none'}}>
          <div style={{width:46,height:46,borderRadius:23,background:parent.bg,border:`2px solid ${parent.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,fontWeight:700,color:parent.color}}>{parent.initials}</div>
          <div style={{flex:1,textAlign:'left'}}><div style={{fontSize:17,fontWeight:600,color:'#1C1C1E'}}>{parent.name}</div><div style={{display:'flex',gap:6,marginTop:2}}><Badge label="Parent" color={parent.color}/><Badge label="Admin" color="#8E8E93"/></div></div>
          <Chevron/>
        </button>)}
      </Card>
      <SectionHeader title="Logistics · Taxi drivers"/>
      <Card style={{marginBottom:12}}>
        {LOGISTICS.map((lg,i)=><div key={lg.id} style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:12,borderBottom:i<LOGISTICS.length-1?'1px solid #F2F2F7':'none'}}>
          <div style={{width:46,height:46,borderRadius:23,background:lg.bg,border:`2px solid ${lg.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,fontWeight:700,color:lg.color}}>{lg.initials}</div>
          <div style={{flex:1}}><div style={{fontSize:17,fontWeight:600,color:'#1C1C1E'}}>{lg.name}</div><div style={{display:'flex',gap:6,marginTop:2,flexWrap:'wrap'}}><Badge label="🚗 Logistics" color={lg.color}/>{lg.phone&&<span style={{fontSize:12,color:'#007AFF',paddingTop:1}}>{lg.phone}</span>}</div></div>
          <Chevron/>
        </div>)}
      </Card>
      <div style={{padding:'0 16px'}}>
        <button style={{width:'100%',background:'#fff',borderRadius:16,padding:'14px',border:'2px dashed #C7C7CC',color:'#007AFF',fontSize:16,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span style={{fontSize:20}}>+</span> Invite family member</button>
      </div>
    </div>
  </div>;
}

// ── SETTINGS SCREEN ───────────────────────────────────────────
function SettingsScreen() {
  const [faceID, setFaceID] = useState(true);
  const [notifs, setNotifs] = useState(true);
  const [location, setLocation] = useState(false);
  const [emailSync, setEmailSync] = useState(false);
  return <div style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
    <div style={{background:'#fff',padding:'12px 16px 14px',borderBottom:'1px solid #F2F2F7'}}><div style={{fontSize:28,fontWeight:700,letterSpacing:-0.5,color:'#1C1C1E'}}>Settings</div></div>
    <div className="scroll" style={{flex:1,overflowY:'auto',padding:'16px 0'}}>
      <div style={{margin:'0 16px 16px'}}>
        <div style={{background:'linear-gradient(135deg, #007AFF, #5856D6)',borderRadius:16,padding:'20px'}}>
          <div style={{fontSize:14,color:'rgba(255,255,255,0.7)',marginBottom:4}}>Signed in as</div>
          <div style={{fontSize:18,fontWeight:700,color:'#fff'}}>sarah@family.com</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginTop:4}}>Admin · HomeBase Family</div>
        </div>
      </div>
      <SectionHeader title="Account & Security"/>
      <Card style={{marginBottom:12}}>
        {[{label:'Sign in with Apple',icon:'🍎',sub:'Connected'},{label:'Face ID / Touch ID',icon:'🔐',toggle:true,val:faceID,set:setFaceID},{label:'Manage devices',icon:'📱',sub:'2 devices'}].map((item,i,arr)=><div key={item.label} style={{padding:'13px 16px',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none',display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:20}}>{item.icon}</span><div style={{flex:1}}><div style={{fontSize:15,color:'#1C1C1E'}}>{item.label}</div>{item.sub&&<div style={{fontSize:13,color:'#8E8E93'}}>{item.sub}</div>}</div>
          {item.toggle ? <Toggle on={item.val} onChange={item.set}/> : <Chevron/>}
        </div>)}
      </Card>
      <SectionHeader title="Preferences"/>
      <Card style={{marginBottom:12}}>
        {[{label:'Notifications',icon:'🔔',val:notifs,set:setNotifs},{label:'Location Awareness',icon:'📍',val:location,set:setLocation,sub:'Auto pick-up prompts'},{label:'Email integrations',icon:'📧',val:emailSync,set:setEmailSync,sub:'Scan for school notices'}].map((item,i,arr)=><div key={item.label} style={{padding:'13px 16px',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none',display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:20}}>{item.icon}</span><div style={{flex:1}}><div style={{fontSize:15,color:'#1C1C1E'}}>{item.label}</div>{item.sub&&<div style={{fontSize:13,color:'#8E8E93'}}>{item.sub}</div>}</div><Toggle on={item.val} onChange={item.set}/>
        </div>)}
      </Card>
      <SectionHeader title="Data & Privacy"/>
      <Card style={{marginBottom:24}}>
        {['Family permissions','Download your data','Delete account'].map((label,i,arr)=><button key={label} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:i<arr.length-1?'1px solid #F2F2F7':'none'}}>
          <span style={{fontSize:15,color:label==='Delete account'?'#FF3B30':'#1C1C1E'}}>{label}</span>{label!=='Delete account'&&<Chevron/>}
        </button>)}
      </Card>
      <div style={{textAlign:'center',padding:'0 0 20px',color:'#C7C7CC',fontSize:13}}>HomeBase v1.0 · nashclark08-rgb/HomeBase</div>
    </div>
  </div>;
}

// ── ONBOARDING ────────────────────────────────────────────────
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const steps = [
    <div key="0" style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fff',padding:'40px 32px'}}>
      <div style={{width:80,height:80,borderRadius:22,background:'linear-gradient(135deg,#007AFF,#5856D6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,boxShadow:'0 8px 32px rgba(0,122,255,0.3)',marginBottom:28}}>🏠</div>
      <div style={{fontSize:26,fontWeight:800,color:'#1C1C1E',letterSpacing:-0.5,textAlign:'center',marginBottom:12}}>Welcome to HomeBase</div>
      <div style={{fontSize:14,color:'#8E8E93',lineHeight:1.5,textAlign:'center',marginBottom:40}}>Family logistics, made simple. School runs, packing lists, after-school pickups — all in one place.</div>
      <button onClick={()=>setStep(1)} style={{width:'100%',background:'#000',border:'none',borderRadius:14,padding:'15px',fontSize:17,fontWeight:600,color:'#fff',cursor:'pointer',marginBottom:12}}>
        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}><svg width="16" height="20" viewBox="0 0 16 20" fill="white"><path d="M13.5 10.3c0-2.8 2.3-4.1 2.4-4.2-1.3-1.9-3.3-2.2-4-2.2-1.7-.2-3.4 1-4.3 1-.9 0-2.2-1-3.6-1C1.6 3.9 0 5.3 0 8.4c0 3.3 3 9.6 4.3 9.6 1.2 0 1.7-1 3.2-1 1.5 0 1.9 1 3.2 1 1.3 0 3.2-5.5 3.8-7.7z"/></svg>Sign in with Apple</span>
      </button>
      <button onClick={()=>setStep(1)} style={{width:'100%',background:'#F2F2F7',border:'none',borderRadius:14,padding:'15px',fontSize:17,fontWeight:600,color:'#1C1C1E',cursor:'pointer'}}>Continue with Email</button>
    </div>,
    <div key="1" style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
      <div style={{background:'#fff',padding:'12px 16px 14px',display:'flex',justifyContent:'flex-end'}}><button onClick={()=>setStep(2)} style={{background:'none',border:'none',color:'#007AFF',fontSize:15,cursor:'pointer'}}>Skip</button></div>
      <div className="scroll" style={{flex:1,overflowY:'auto',padding:'20px 16px'}}>
        <div style={{fontSize:24,fontWeight:800,color:'#1C1C1E',marginBottom:6}}>Add your first child</div>
        <div style={{fontSize:14,color:'#8E8E93',marginBottom:20}}>Tell us about who you're coordinating for.</div>
        <div style={{background:'#fff',borderRadius:16,boxShadow:'0 1px 4px rgba(0,0,0,0.08)',padding:16}}>
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
            <div style={{width:60,height:60,borderRadius:30,border:'2px dashed #007AFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,flexShrink:0}}>👤</div>
            <div style={{flex:1}}><div style={{fontSize:14,color:'#8E8E93'}}>Tap to add a photo</div></div>
          </div>
          {['Name','Year / Grade','School'].map(ph=><div key={ph} style={{background:'#F2F2F7',borderRadius:10,padding:'12px 14px',marginBottom:10,fontSize:15,color:'#C7C7CC'}}>{ph}</div>)}
        </div>
        <button onClick={()=>setStep(2)} style={{width:'100%',background:'#007AFF',border:'none',borderRadius:14,padding:'15px',fontSize:17,fontWeight:600,color:'#fff',cursor:'pointer',marginTop:20}}>Continue →</button>
      </div>
    </div>,
    <div key="2" style={{flex:1,display:'flex',flexDirection:'column',background:'#F2F2F7',overflow:'hidden'}}>
      <div style={{background:'#fff',padding:'12px 16px 14px',display:'flex',justifyContent:'flex-end'}}><button onClick={onComplete} style={{background:'none',border:'none',color:'#007AFF',fontSize:15,cursor:'pointer'}}>Skip</button></div>
      <div className="scroll" style={{flex:1,overflowY:'auto',padding:'20px 16px'}}>
        <div style={{fontSize:24,fontWeight:800,color:'#1C1C1E',marginBottom:6}}>Invite a caregiver</div>
        <div style={{fontSize:14,color:'#8E8E93',marginBottom:20}}>Add the people who help with your family's logistics.</div>
        {[{icon:'👩‍👧',label:'Partner / Co-parent',role:'Full access'},{icon:'👴',label:'Grandparent',role:'Can view & update'},{icon:'🧑',label:'Other carer',role:'Logistics only'}].map(c=><button key={c.label} style={{width:'100%',background:'#fff',borderRadius:16,padding:'14px',border:'none',cursor:'pointer',textAlign:'left',boxShadow:'0 1px 4px rgba(0,0,0,0.08)',display:'flex',alignItems:'center',gap:14,marginBottom:10}}>
          <div style={{width:44,height:44,borderRadius:12,background:'#F2F2F7',fontSize:26,display:'flex',alignItems:'center',justifyContent:'center'}}>{c.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:600,color:'#1C1C1E'}}>{c.label}</div><Badge label={c.role} color="#007AFF"/></div>
          <Chevron/>
        </button>)}
        <button onClick={onComplete} style={{width:'100%',background:'#007AFF',border:'none',borderRadius:14,padding:'15px',fontSize:17,fontWeight:600,color:'#fff',cursor:'pointer',marginTop:10}}>All done → Let's go</button>
      </div>
    </div>,
  ];
  return steps[step] || null;
}

// ── TAB BAR ───────────────────────────────────────────────────
const TABS = [
  { id:'today', label:'Today', icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M16.9 16.9l1.5 1.5M5.6 18.4l1.4-1.4M16.9 7.1l1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id:'calendar', label:'Calendar', icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M3 9h18M8 2v4M16 2v4M7 13h2v2H7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id:'lists', label:'Lists', icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M4 6v.01M4 12v.01M4 18v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id:'family', label:'Family', icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="17" cy="9" r="2" stroke="currentColor" strokeWidth="2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 14c1.7 0 3 1.3 3 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id:'settings', label:'Settings', icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M12 2a10 10 0 000 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
];

// ── APP SHELL ─────────────────────────────────────────────────
export default function App() {
  const [onboarded, setOnboarded] = useState(() => {
    try { return !!localStorage.getItem('hb_onboarded'); } catch { return false; }
  });
  const [tab, setTab] = useState('today');
  const [navStack, setNavStack] = useState([]);
  const [morningMode, setMorningMode] = useState(false);
  const [notif, setNotif] = useState(null);

  const showNotif = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null), 5500); };
  const nav = (screen, params={}) => setNavStack(s=>[...s,{screen,params}]);
  const goBack = () => setNavStack(s=>s.slice(0,-1));

  const handleOnboardingComplete = () => {
    try { localStorage.setItem('hb_onboarded','1'); } catch {}
    setOnboarded(true);
  };

  if (!onboarded) return <>
    <style>{GLOBAL_CSS}</style>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#000'}}>
      <div style={{width:390,height:844,borderRadius:48,overflow:'hidden',position:'relative',background:'#F2F2F7',boxShadow:'0 40px 80px rgba(0,0,0,0.5)',display:'flex',flexDirection:'column'}}>
        <OnboardingScreen onComplete={handleOnboardingComplete}/>
      </div>
    </div>
  </>;

  const currentNav = navStack[navStack.length-1];

  const renderScreen = () => {
    if (currentNav) {
      if (currentNav.screen==='dayDetail') return <DayDetailScreen params={currentNav.params} onBack={goBack}/>;
    }
    if (tab==='today') return <TodayScreen nav={nav} showNotif={showNotif} morningMode={morningMode} setMorningMode={setMorningMode}/>;
    if (tab==='calendar') return <CalendarScreen/>;
    if (tab==='lists') return <ListsScreen/>;
    if (tab==='family') return <FamilyScreen/>;
    if (tab==='settings') return <SettingsScreen/>;
  };

  const changeTab = (id) => { setNavStack([]); setTab(id); setMorningMode(false); };

  return <>
    <style>{GLOBAL_CSS}</style>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#1a1a1a'}}>
      <div style={{width:390,height:844,borderRadius:48,overflow:'hidden',position:'relative',background:'#F2F2F7',boxShadow:'0 40px 80px rgba(0,0,0,0.5)',display:'flex',flexDirection:'column',fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro",system-ui,sans-serif'}}>
        {/* Dynamic Island */}
        <div style={{position:'absolute',top:11,left:'50%',transform:'translateX(-50%)',width:126,height:37,borderRadius:24,background:'#000',zIndex:50}}/>
        {/* Status Bar */}
        <div style={{height:59,background:'transparent',flexShrink:0,display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:'0 28px 8px',position:'absolute',top:0,left:0,right:0,zIndex:10,pointerEvents:'none'}}>
          <span style={{fontSize:17,fontWeight:600,color:'#1C1C1E'}}>9:41</span>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <svg width="17" height="12" viewBox="0 0 17 12"><rect x="0" y="6" width="3" height="6" rx="1" fill="#1C1C1E"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#1C1C1E"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#1C1C1E"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1C1C1E"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 3c2 0 3.8.9 5 2.2l1-1C12.5 2.5 10.4 1.5 8 1.5S3.5 2.5 2 4.2l1 1C4.2 3.9 6 3 8 3z" fill="#1C1C1E"/><path d="M8 6.5c1.1 0 2.1.5 2.8 1.2l1-1A5 5 0 008 5c-1.5 0-2.9.6-3.8 1.7l1 1A3.2 3.2 0 018 6.5z" fill="#1C1C1E"/><circle cx="8" cy="10.5" r="1.5" fill="#1C1C1E"/></svg>
            <svg width="26" height="13" viewBox="0 0 26 13"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="#1C1C1E" strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="18" height="9" rx="2" fill="#1C1C1E"/><path d="M24 4.5v4c.8-.3 1.5-1.2 1.5-2s-.7-1.7-1.5-2z" fill="#1C1C1E" fillOpacity="0.4"/></svg>
          </div>
        </div>
        {/* Main content */}
        <div style={{display:'flex',flexDirection:'column',flex:1,paddingTop:59,overflow:'hidden',position:'relative'}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',animation:'tab-fade 0.2s ease',position:'relative'}}>
            {renderScreen()}
            {notif && <NotificationBanner notif={notif} onDismiss={()=>setNotif(null)}/>}
          </div>
          {/* Tab Bar */}
          {!morningMode && !currentNav && <div style={{background:'rgba(249,249,249,0.95)',backdropFilter:'blur(20px)',borderTop:'0.5px solid rgba(0,0,0,0.12)',display:'flex',paddingBottom:8,flexShrink:0}}>
            {TABS.map(t=><button key={t.id} onClick={()=>changeTab(t.id)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'8px 0',border:'none',background:'transparent',cursor:'pointer',color:tab===t.id?'#007AFF':'#8E8E93',gap:2}}>
              {t.icon}<span style={{fontSize:10,fontWeight:500}}>{t.label}</span>
            </button>)}
          </div>}
          {/* Home indicator */}
          <div style={{height:8,display:'flex',justifyContent:'center',alignItems:'center',background:'transparent',flexShrink:0}}>
            <div style={{width:139,height:5,borderRadius:100,background:'rgba(0,0,0,0.25)'}}/>
          </div>
        </div>
      </div>
    </div>
  </>;
}
