
/* Real-time optical instruments; Canvas 2D, local Motion runtime, no new dependencies. */
(()=>{
'use strict';
const root=document.documentElement,body=document.body,reduce=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,u)=>a+(b-a)*u;
const themeButton=document.querySelector('.lab-theme-toggle');
let theme=root.dataset.labTheme==='light'?'light':'dark';
function applyTheme(next,save=true){
 theme=next;root.dataset.labTheme=theme;
 themeButton?.setAttribute('aria-pressed',String(theme==='light'));
 themeButton?.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');
 document.querySelector('meta[name=theme-color]')?.setAttribute('content',theme==='dark'?'#101110':'#f8f7f0');
 if(save)try{localStorage.setItem('lab-color-mode',theme);}catch{}
}
applyTheme(theme,false);
let themeAnimation;
themeButton?.addEventListener('click',()=>{
 const next=theme==='dark'?'light':'dark';
 applyTheme(next);
 if(window.Motion?.animate&&!reduce.matches){
  themeAnimation?.cancel?.();
  const metal=themeButton.querySelector('.theme-metal');
  // Animate the sheen, not the position (the CSS capsule owns translation).
  themeAnimation=Motion.animate(metal,{opacity:[.82,1]},{duration:.35,ease:[.22,1,.36,1]});
 }
});
addEventListener('storage',e=>{if(e.key==='lab-color-mode'&&['dark','light'].includes(e.newValue))applyTheme(e.newValue,false);});
const scene=document.querySelector('[data-lab-scene]'),canvas=scene?.querySelector('canvas');
if(!scene||!canvas)return;
const ctx=canvas.getContext('2d',{alpha:false});
if(!ctx){scene.dataset.canvasUnavailable='true';return;}
const isScroll=scene.dataset.labScene==='scroll';
const play=scene.querySelector('.lab-scene-play'),pause=scene.querySelector('.lab-scene-pause');
const phaseInput=scene.querySelector('#lab-phase'),phaseValue=scene.querySelector('#lab-phase-value');
const progressBars=[...document.querySelectorAll('[data-page-progress]')];
let w=0,h=0,dpr=1,frame=0,last=0,visible=false,ambient=isScroll&&!reduce.matches,phase=.28,t=0;
let mx=0,my=0,tx=0,ty=0,opening=0,targetOpen=0,scroll=0,dirty=true,destroyed=false;
let phaseAnimation=null;
const color=isScroll?{
 top:'#111b16',bottom:'#26332a',grid:'#9aaa8e',accent:'#e4f4a2',dark:[37,76,62],mid:[112,163,111],light:[228,246,166],edge:[238,254,196]
}:{
 top:'#171722',bottom:'#3b293d',grid:'#c5a8bd',accent:'#f4bc9f',dark:[57,38,80],mid:[151,89,135],light:[248,194,153],edge:[255,231,188]
};
function scrollUpdate(){
 const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 scroll=clamp(scrollY/max);
 progressBars.forEach(n=>n.style.transform='scaleX('+scroll+')');
 if(isScroll){dirty=true;ensure();}
}
function resize(){
 const r=scene.getBoundingClientRect();if(r.width<=0||r.height<=0)return;
 w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.65);
 canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
 dirty=true;ensure();
}
function pointer(e){
 if(reduce.matches||e.pointerType==='touch')return;
 const r=scene.getBoundingClientRect();
 tx=clamp((e.clientX-r.left)/r.width*2-1,-1,1);
 ty=clamp((e.clientY-r.top)/r.height*2-1,-1,1);
 dirty=true;ensure();
}
function resetPointer(){tx=ty=0;dirty=true;ensure();}
function setPhase(v){phase=clamp(v);if(phaseInput)phaseInput.value=String(Math.round(phase*100));if(phaseValue)phaseValue.textContent=Math.round(phase*100)+'%';dirty=true;ensure();}
function setAmbient(on){
 ambient=on&&!reduce.matches;
 if(play){play.setAttribute('aria-pressed',String(ambient));play.textContent=ambient?'Pause':'Play';}
 if(pause){pause.setAttribute('aria-pressed',String(!ambient));pause.textContent=ambient?'Pause':'Resume';pause.setAttribute('aria-label',ambient?'Pause ambient animation':'Resume ambient animation');}
 dirty=true;ensure();
}
play?.addEventListener('click',()=>{if(reduce.matches){setPhase(phase>=.99?0:1);return;}setAmbient(!ambient);});
pause?.addEventListener('click',()=>{if(!reduce.matches)setAmbient(!ambient);});
phaseInput?.addEventListener('input',e=>{setAmbient(false);setPhase(+e.target.value/100);});
document.addEventListener('lab:aperture',e=>{targetOpen=e.detail.open?1:0;if(reduce.matches)opening=targetOpen;dirty=true;ensure();});
function rgba(a,b,u,alpha=1){return 'rgba('+a.map((n,i)=>Math.round(mix(n,b[i],u))).join(',')+','+alpha+')';}
function draw(){
 if(!w||!h)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);
 const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,color.top);bg.addColorStop(1,color.bottom);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 // An architectural grid and a subtle backlight make the central sculpture legible.
 const cx=w*.50+mx*8,cy=h*.43+my*7,scale=Math.min(w*.27,h*.29);
 const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.62);
 glow.addColorStop(0,isScroll?'rgba(178,219,125,.14)':'rgba(233,155,181,.17)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 ctx.strokeStyle=isScroll?'rgba(210,231,189,.075)':'rgba(235,207,229,.075)';ctx.lineWidth=.65;
 const unit=32;ctx.beginPath();for(let x=24;x<w;x+=unit){ctx.moveTo(x,52);ctx.lineTo(x,h-61);}for(let y=52;y<h-61;y+=unit){ctx.moveTo(24,y);ctx.lineTo(w-24,y);}ctx.stroke();
 ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=isScroll?'rgba(210,231,189,.13)':'rgba(235,207,229,.14)';ctx.setLineDash([3,6]);ctx.beginPath();ctx.ellipse(0,0,scale*1.53,scale*1.18,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(-scale*1.7,0);ctx.lineTo(scale*1.7,0);ctx.moveTo(0,-scale*1.36);ctx.lineTo(0,scale*1.36);ctx.stroke();ctx.restore();
 // Continuous 3D mathematical surface. Project all sample points; painter-sort quads by depth.
 // The scroll instrument is a twisted annular aperture; the motion instrument a time-varying torus knot.
 const angleY=(isScroll?-.32:.26)+mx*.33+(isScroll?scroll*.42:0);
 const angleX=.29+my*.24,spin=isScroll?t*.12:phase*Math.PI*2;
 const cY=Math.cos(angleY),sY=Math.sin(angleY),cX=Math.cos(angleX),sX=Math.sin(angleX);
 function project(x,y,z){const ax=x*cY+z*sY,az=-x*sY+z*cY;const ay=y*cX-az*sX,zz=y*sX+az*cX;const k=3.8/(3.8-zz);return {x:cx+ax*scale*k,y:cy+ay*scale*k,z:zz};}
 const n=108,m=12,verts=[];
 for(let i=0;i<=n;i++){
  const u=i/n*Math.PI*2,theta=u+spin;
  const row=[];
  for(let j=0;j<=m;j++){
   const v=j/m*Math.PI*2;
   let x,y,z;
   if(isScroll){
    const radius=.91+opening*.27+.10*Math.cos(3*u+spin);
    const tube=.32*(1-opening*.47);
    const twist=v+2*u+Math.sin(spin)*.32;
    x=(radius+tube*Math.cos(twist))*Math.cos(theta);
    y=(radius+tube*Math.cos(twist))*Math.sin(theta);
    z=tube*Math.sin(twist)+.24*Math.sin(3*u+spin)*(1-opening*.55);
   }else{
    const wave=phase*Math.PI*2,rad=.92+.27*Math.cos(3*u+wave),tube=.19+.035*Math.sin(2*u+wave);
    const a=2*u+spin*.32;
    x=(rad+tube*Math.cos(v))*Math.cos(a);
    y=(rad+tube*Math.cos(v))*Math.sin(a);
    z=.34*Math.sin(3*u+wave)+tube*Math.sin(v);
   }
   row.push(project(x,y,z));
  }
  verts.push(row);
 }
 const faces=[];
 for(let i=0;i<n;i++)for(let j=0;j<m;j++){
  const a=verts[i][j],b=verts[i+1][j],c=verts[i+1][j+1],d=verts[i][j+1];
  const z=(a.z+b.z+c.z+d.z)/4,ux=b.x-a.x,uy=b.y-a.y,vx=d.x-a.x,vy=d.y-a.y;
  const nz=ux*vy-uy*vx;const shade=clamp(.52+.28*Math.cos(j/m*2*Math.PI+.6)+z*.25+(nz>0?.1:-.08));
  faces.push({a,b,c,d,z,shade,i,j});
 }
 faces.sort((a,b)=>a.z-b.z);
 for(const f of faces){
  const {a,b,c,d,z,shade,i,j}=f;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();
  ctx.fillStyle=shade<.52?rgba(color.dark,color.mid,shade/.52):rgba(color.mid,color.light,(shade-.52)/.48);ctx.fill();
  ctx.lineWidth=.45;
  ctx.strokeStyle=rgba(color.dark,color.edge,clamp(shade+.18),.28);ctx.stroke();
 }
 // A small, regular set of orbital traces gives the surface dimensional scale.
 ctx.save();ctx.translate(cx,cy);ctx.rotate(angleY*.45);
 ctx.strokeStyle=isScroll?'rgba(225,247,165,.56)':'rgba(250,208,183,.54)';ctx.lineWidth=.8;
 ctx.beginPath();ctx.ellipse(0,0,scale*1.62,scale*.67,-.38,spin*.17,spin*.17+Math.PI*1.15);ctx.stroke();
 ctx.beginPath();ctx.ellipse(0,0,scale*1.62,scale*.67,.75,spin*.17+Math.PI,spin*.17+Math.PI*1.88);ctx.stroke();ctx.restore();
 const fade=ctx.createLinearGradient(0,h*.64,0,h);fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(1,isScroll?'rgba(12,19,14,.88)':'rgba(21,15,25,.9)');ctx.fillStyle=fade;ctx.fillRect(0,h*.64,w,h*.36);
}
function moving(){return !reduce.matches&&(ambient||Math.abs(tx-mx)>.002||Math.abs(ty-my)>.002||Math.abs(targetOpen-opening)>.002);}
function ensure(){if(!destroyed&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
function tick(now){
 frame=0;if(destroyed||!visible||document.hidden)return;
 const dt=last?Math.min(.033,(now-last)/1000):0;last=now;
 if(reduce.matches){mx=my=tx=ty=0;opening=targetOpen;}
 else{
  const k=1-Math.exp(-dt*7);mx=mix(mx,tx,k);my=mix(my,ty,k);opening=mix(opening,targetOpen,k);
  if(ambient){t+=dt;if(!isScroll)setPhase((phase+dt/6)%1);}
 }
 draw();dirty=false;
 if(moving())ensure();else last=0;
}
const io=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);last=0;if(visible){dirty=true;ensure();}else if(frame){cancelAnimationFrame(frame);frame=0;}});
io.observe(scene);
const ro=new ResizeObserver(resize);ro.observe(scene);
const visibility=()=>{last=0;if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;}else ensure();};
const reducedChanged=()=>{if(reduce.matches){setAmbient(false);tx=ty=mx=my=0;}dirty=true;ensure();};
scene.addEventListener('pointermove',pointer,{passive:true});scene.addEventListener('pointerleave',resetPointer);
addEventListener('scroll',scrollUpdate,{passive:true});document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',reducedChanged);
resize();scrollUpdate();setAmbient(ambient);
addEventListener('pagehide',e=>{if(e.persisted)return;destroyed=true;if(frame)cancelAnimationFrame(frame);io.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',reducedChanged);removeEventListener('scroll',scrollUpdate);});
})();
