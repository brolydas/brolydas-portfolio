// Intelligence: original futuristic ink city, using the existing line-art SVG pen primitives.
// Live vector geometry; no raster background. GSAP enhances pointer motion when available.
import {el,pen,shape,limb,place,f,gait} from '../lib/ink.js';

const walk=gait({kind:'walk',stride:22});
const section=document.querySelector('#contact');
const host=section?.querySelector('[data-city-art]');
if(host)mount(section,host);

function mount(section,host){
 const W=1200,H=600,GROUND=504;
 const svg=el('svg',{viewBox:'0 0 1200 600','aria-hidden':'true',focusable:'false'},host);
 svg.style.color='#20313a';svg.style.setProperty('--paper','#fff');
 const defs=el('defs',{},svg);
 const gradient=(id,stops,radial=false)=>{
   const n=el(radial?'radialGradient':'linearGradient',radial?{id}:{id,x1:0,y1:0,x2:0,y2:1},defs);
   stops.forEach(([offset,color,opacity])=>el('stop',{offset,'stop-color':color,'stop-opacity':opacity},n));return 'url(#'+id+')';
 };
 const mist=gradient('future-atmosphere',[[0,'#ffffff',1],[.54,'#f5f8fa',1],[1,'#e1e9ec',1]]);
 const light=gradient('future-beam',[[0,'#087f99',.19],[1,'#087f99',0]]);
 const glow=gradient('future-glow',[[0,'#42d9ff',.42],[.55,'#32c4e0',.15],[1,'#32c4e0',0]],true);
 const violet=gradient('future-violet',[[0,'#9154cf',.32],[1,'#9154cf',0]],true);
 const g=(parent=svg,attrs={})=>el('g',attrs,parent);
 const p=(parent,d,w=.9,attrs={})=>{const n=pen(parent,w);n.setAttribute('d',d);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
 const closed=(parent,d,w=.9,attrs={})=>{const n=shape(parent,w);n.setAttribute('d',d);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
 const rect=(parent,x,y,width,height,attrs={})=>el('rect',{x,y,width,height,...attrs},parent);
 const circle=(parent,cx,cy,r,attrs={})=>el('circle',{cx,cy,r,...attrs},parent);
 const ellipse=(parent,cx,cy,rx,ry,attrs={})=>el('ellipse',{cx,cy,rx,ry,...attrs},parent);
 const text=(parent,x,y,value,size=9,attrs={})=>{const n=el('text',{x,y,'font-size':size,'font-family':'monospace','letter-spacing':1.4,fill:'currentColor',...attrs},parent);n.textContent=value;return n;};
 const stroke=(color='currentColor',width=.8)=>({fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'});
 let seed=7341;const rand=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
 const between=(a,b)=>a+(b-a)*rand();
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 rect(svg,0,0,W,H,{fill:mist});
 // Layered skyline in a pen-etched architectural elevation, with generous sky for the contact sign.
 const sky=g(svg,{opacity:.32});
 for(let i=0;i<44;i++){const x=between(0,W),y=between(15,265);if(x>330&&x<870&&y<150)continue;circle(sky,x,y,between(.35,1.1),{fill:'#376075'});}
 p(sky,'M0 103 Q160 84 300 102 M917 100 Q1070 80 1200 102 M18 135 Q116 125 200 137 M1000 146 Q1110 135 1200 150',.6,{stroke:'#6a8493'});
 const far=g(svg,{opacity:.28});
 const mid=g(svg,{opacity:.64});
 const near=g(svg,{opacity:.96});
 function tower(parent,x,w,top,base,depth,style,accent){
  const y=base,roof=top,ledge=style===1?10:style===2?18:4;
  const q=g(parent);
  // Side elevation, inset panels, service ribs, rooftop antennae and communications equipment.
  closed(q,'M'+x+' '+y+' V'+(roof+ledge)+' L'+(x+w*.18)+' '+roof+' H'+(x+w*.84)+' L'+(x+w)+' '+(roof+ledge)+' V'+y+'Z',1,{fill:depth===0?'#f6f9fa':depth===1?'#fff':'#edf2f4'});
  closed(q,'M'+(x+w)+' '+(roof+ledge)+' l'+(w*.16)+' 12 V'+y+' H'+(x+w)+'Z',.7,{fill:'#dfe7eb'});
  p(q,'M'+(x+5)+' '+y+' V'+(roof+ledge+6)+' H'+(x+w-5)+' V'+y,.65);
  if(style===1){p(q,'M'+(x+w*.38)+' '+roof+' v-16 h'+(w*.24)+' v16 M'+(x+w*.5)+' '+(roof-16)+' v-24',.85);circle(q,x+w*.5,roof-40,1.6,{fill:accent});}
  if(style===2){closed(q,'M'+(x+w*.2)+' '+roof+' l'+(w*.14)+' -22 h'+(w*.34)+' l'+(w*.12)+' 22Z',.8,{fill:'#f6f9fa'});p(q,'M'+(x+w*.5)+' '+(roof-22)+' v-29 M'+(x+w*.36)+' '+(roof-36)+' h'+(w*.28),.7);}
  if(style===0){rect(q,x+w*.25,roof-9,w*.5,9,{...stroke(),fill:'#e9eef0'});}
  const floor=depth===0?10:depth===1?13:16;
  let windows='',lit='',ribs='';
  for(let yy=roof+ledge+12;yy<y-10;yy+=floor){
    ribs+='M'+f(x+4)+' '+f(yy+6)+'H'+f(x+w-4);
    for(let xx=x+9;xx<x+w-8;xx+=depth===2?12:9){
      const d='M'+f(xx)+' '+f(yy)+'h'+(depth===2?5:3)+'v'+(depth===2?5:3)+'h-'+(depth===2?5:3)+'Z';
      if(rand()<.13)lit+=d;else if(rand()>.19)windows+=d;
    }
  }
  if(ribs)p(q,ribs,.35,{opacity:.5});
  if(windows)p(q,windows,.35,{opacity:.62});
  if(lit)p(q,lit,.45,{stroke:accent,fill:accent,opacity:.62});
  if(depth===2){
    p(q,'M'+(x+w*.13)+' '+(roof+24)+' V'+(y-12)+' M'+(x+w*.89)+' '+(roof+24)+' V'+(y-12),1.1,{stroke:accent,opacity:.65});
    for(let yy=roof+34;yy<y-28;yy+=66)p(q,'M'+(x+4)+' '+yy+'H'+(x+w-4),1.2);
  }
  return q;
 }
 const colors=['#167c96','#6752a7','#32677c'];
 for(let x=-15,i=0;x<W;x+=43,i++)tower(far,x,between(25,43),between(180,337),448,0,i%3,colors[i%3]);
 const towers=[
  [-12,90,157,1], [77,80,221,2], [169,92,119,1], [263,67,229,0],
  [334,60,302,1],[412,67,260,2],[484,78,286,0],[564,83,250,2],[652,72,302,1],
  [732,78,234,1],[813,67,184,2],[887,91,136,1],[988,90,203,2],[1080,105,113,1],[1187,50,187,0]
 ];
 towers.forEach(([x,w,y,s],i)=>tower(mid,x,w,y,474,1,s,colors[i%3]));
 const foreground=[[-35,105,215,1],[72,107,279,0],[204,106,248,2],[898,108,238,2],[1022,115,193,1],[1150,90,265,0]];
 foreground.forEach(([x,w,y,s],i)=>tower(near,x,w,y,GROUND,2,s,colors[i%3]));
 // Layered rooftop structures, exterior ducts, ladders, industrial bridges.
 for(const [x,y,w] of [[100,318,88],[221,288,71],[915,286,76],[1043,234,85]]){
   const k=g(near);closed(k,'M'+x+' '+y+' h'+w+' v20 h-'+w+'Z',.9,{fill:'#f9fbfb'});
   for(let dx=5;dx<w-4;dx+=9)p(k,'M'+(x+dx)+' '+(y+4)+'v12',.6);
   p(k,'M'+(x+w-12)+' '+(y+20)+'v33h-15v44',1.6);
 }
 const transit=g(svg);
 closed(transit,'M-20 420 C180 406 310 389 481 399 S802 457 1220 375 L1220 394 C802 476 670 433 481 419 S180 426 -20 441Z',1.2,{fill:'#e5edf0'});
 p(transit,'M-20 425 C180 411 310 394 481 404 S802 462 1220 380',1.1,{stroke:'#16839a'});
 p(transit,'M-20 434 C180 420 310 403 481 413 S802 471 1220 389',.7);
 for(const [x,y]of [[138,427],[356,419],[560,428],[766,448],[1038,424]]){closed(transit,'M'+x+' '+y+' l13 0 l-4 78 h-8Z',.9,{fill:'#f5f8f9'});p(transit,'M'+(x+4)+' '+(y+5)+'v65',.6);}
 const train=g(transit);
 closed(train,'M-87 0 Q-99 10 -88 16 H78 Q96 10 80 0Z',1,{fill:'#f4f9fa'});
 p(train,'M-74 4H76 M-74 11H76',.8,{stroke:'#16839a'});for(let x=-65;x<72;x+=14)rect(train,x,5,9,5,{fill:'#577c8b',rx:1});
 // Holographic science displays: transparent projection volumes, orbit rings, nodes and scanlines.
 const holo=g(svg);
 function hologram(x,y,r,kind){
   const root=g(holo,{transform:'translate('+x+' '+y+')',style:'cursor:pointer'});
   const hit=circle(root,0,0,r+12,{fill:'transparent'});
   ellipse(root,0,r+15,r*.72,7,{fill:glow});
   p(root,'M'+(-r*.64)+' '+(r+12)+' L'+(-r)+' '+(-r*.8)+' M'+(r*.64)+' '+(r+12)+' L'+r+' '+(-r*.8),.6,{stroke:'#1088a6',opacity:.55});
   circle(root,0,0,r*1.15,{fill:kind==='globe'?glow:violet});
   const field=g(root,{opacity:.9});
   circle(field,0,0,r,{...stroke('#167c96',.9),'stroke-dasharray':'3 5'});
   const orbit=g(field);
   if(kind==='globe'){
    circle(orbit,0,0,r*.83,stroke('#168ca8',.9));
    for(const a of [-60,-30,0,30,60])ellipse(orbit,0,0,r*.82,r*.82*Math.max(.13,Math.abs(Math.cos(a*Math.PI/180))),{...stroke('#168ca8',.6),transform:'rotate('+a+' 0 0)'});
    for(const a of [-.55,-.25,.25,.55])p(orbit,'M'+f(-r*Math.sqrt(1-a*a)*.82)+' '+f(a*r*.82)+'H'+f(r*Math.sqrt(1-a*a)*.82),.5,{stroke:'#168ca8'});
   }else{
    const pts=[[-.55,-.4],[-.65,.15],[-.25,.65],[.1,-.65],[.65,-.3],[.6,.3],[.22,.63],[0,0]].map(([a,b])=>[a*r,b*r]);
    for(const [a,b] of [[0,3],[0,1],[0,7],[1,2],[1,7],[2,6],[2,7],[3,4],[3,7],[4,5],[4,7],[5,6],[5,7],[6,7]])p(orbit,'M'+pts[a].join(' ')+'L'+pts[b].join(' '),.85,{stroke:'#7852b2'});
    pts.forEach(([a,b],i)=>circle(orbit,a,b,i===7?4:2.3,{fill:'#fff',stroke:'#7852b2','stroke-width':1}));
   }
   const scan=p(field,'M'+(-r*.76)+' 0H'+(r*.76),1.2,{stroke:'#02a9c8',opacity:.8});
   ellipse(root,0,r+13,r*.74,5,stroke('#167c96',.8));text(root,0,r+31,kind==='globe'?'MODEL // 03':'NEURAL CORE',6.5,{'text-anchor':'middle',fill:'#216b81'});
   const title=el('title',{},root);title.textContent='Tap to activate hologram';
   return {root,field,orbit,scan,r,pulse:0,hit};
 }
 const holograms=[hologram(303,215,48,'globe'),hologram(965,173,51,'network')];
 const sign=(x,y,w,h,label,accent)=>{const n=g(holo);rect(n,x-9,y-9,w+18,h+18,{rx:8,fill:accent==='blue'?glow:violet});rect(n,x,y,w,h,{rx:2,fill:'#ffffff','fill-opacity':.84,stroke:accent==='blue'?'#16849c':'#7952b0','stroke-width':1});text(n,x+w/2,y+h*.65,label,9,{'text-anchor':'middle',fill:accent==='blue'?'#136d83':'#67429c'});p(n,'M'+(x+4)+' '+(y+h-4)+'H'+(x+w-4),.8,{stroke:accent==='blue'?'#25a9c0':'#9b64cf'});};
 sign(73,304,94,27,'SYNTH / LAB','blue');sign(1028,300,99,28,'AI // SYSTEMS','violet');sign(907,371,81,20,'ROBOTICS','blue');
 const vehicles=g(svg);
 function craft(y,s,dir,offset,speed,kind){
   const root=g(vehicles,{style:'cursor:pointer'}),body=g(root);
   const c=kind?'#7852b2':'#16849c';
   // Thin propulsion trails taper behind the body, separate from the cabin and engine.
   p(body,'M-46 8 H-14 M-40 11 H-17',.8,{stroke:c,opacity:.45});
   ellipse(body,-9,9,20,6,{fill:kind?violet:glow});
   closed(body,'M-17 3 L-10 -4 Q-4 -8 7 -8 L16 -3 23 0 27 5 21 9 H-19 L-25 5Z',1.1,{fill:'#fff'});
   closed(body,'M-9 -4 Q-3 -9 7 -7 L15 -2 H-11Z',.7,{fill:'#b8d1dc'});
   p(body,'M-20 3 H23 M-14 7 H13 M-7 -4 L-6 -2 M5 -6 L9 -2',.55);
   p(body,'M-20 10H-7 M12 10H22',2,{stroke:c});circle(body,24,4,1.7,{fill:'#fff',stroke:c,'stroke-width':.7});
   return {root,body,y,s,dir,offset,speed,pulse:0};
 }
 const cars=[craft(96,.9,1,220,82,0),craft(174,1.2,-1,800,62,1),craft(265,1.5,1,100,92,0),craft(337,.8,-1,650,55,0),craft(399,1.08,1,420,74,1)];
 // Wide foreground deck, rail and tiled perspective. Robots are part of the street, not UI icons.
 const deck=g(svg);
 closed(deck,'M0 502 Q600 498 1200 502 V600 H0Z',1.3,{fill:'#f5f8f9'});
 p(deck,'M0 512H1200 M0 534H1200 M0 565H1200 M0 594H1200',.8,{stroke:'#78909c'});
 for(let x=-200;x<1400;x+=55)p(deck,'M'+f(600+(x-600)*.76)+' 502L'+x+' 600',.55,{stroke:'#93a7b1'});
 p(deck,'M0 511H1200 M0 519H1200',1.3);for(let x=12;x<W;x+=62)p(deck,'M'+x+' 490V527',1);
 p(deck,'M0 490Q600 487 1200 490 M0 496H1200',1.05);
 const robots=g(svg);
 function robot(x,y,s,dir,phase){
   const root=g(robots,{style:'cursor:pointer'}),fig=g(root),legA=limb(fig,5.3,1.1),legB=limb(fig,5.3,1.1),armA=limb(fig,4,1),body=closed(fig,'M29 43 L35 37 H46 L52 43 49 72 32 72Z',1.2,{fill:'#fff'}),armB=limb(fig,4,1);
   const neck=rect(fig,38,30,5,8,{...stroke(),fill:'#fff'}),head=g(fig);
   closed(head,'M31 17 L35 12 H46 L51 18 V29 L46 33 H35 L31 28Z',1.15,{fill:'#edf4f7'});
   rect(head,34,20,14,5,{rx:2,fill:'#173b4a'});circle(head,38,22.5,1.1,{fill:'#61e0f5'});circle(head,44,22.5,1.1,{fill:'#61e0f5'});
   p(head,'M40 12V6 M37 6H43',.85);circle(head,40,5,1.4,{fill:'#168ca8'});
   rect(fig,36,46,11,10,{rx:2,fill:'#e8f1f4',stroke:'#16849c','stroke-width':.8});p(fig,'M38 51H45 M41 48V54',.8,{stroke:'#16849c'});
   p(fig,'M34 65H47 M33 69H48',.7);
   const boots=[p(fig,'M0 0',2.2),p(fig,'M0 0',2.2)];
   const title=el('title',{},root);title.textContent='Tap robot to wave';
   return {root,fig,legA,legB,armA,armB,head,boots,x,y,s,dir,phase,pulse:0};
 }
 const bots=[robot(177,564,.72,1,.2),robot(814,551,.62,-1,.65),robot(1052,570,.8,-1,.1),robot(456,548,.59,1,.38)];
 // Re-use the original planted-foot solver, exported from the first contact implementation below.
 const pedestrians=bots;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let pointerX=0,pointerY=0,px=0,py=0,visible=false,raf=0,last=0,time=0,gsap=null;
 const active=()=>document.documentElement.dataset.mode==='intelligence';
 const smooth=(a,b,u)=>a+(b-a)*u;
 let quickX=null,quickY=null;
 // GSAP is optional; the native frame loop remains fully functional offline or if a CDN is blocked.
 const pointerState={x:0,y:0};
 function resetPointer(){pointerX=pointerY=0;quickX?.(0);quickY?.(0);}
 function pointer(e){if(!active()||reduce.matches)return;const b=host.getBoundingClientRect();if(!b.width||!b.height)return;pointerX=clamp((e.clientX-b.left)/b.width*2-1,-1,1);pointerY=clamp((e.clientY-b.top)/b.height*2-1,-1,1);quickX?.(pointerX);quickY?.(pointerY);}
 function poke(o){if(reduce.matches)return;o.pulse=1;}
 [...holograms,...cars,...bots].forEach(o=>o.root.addEventListener('pointerdown',()=>poke(o),{passive:true}));
 section.addEventListener('pointermove',pointer,{passive:true});section.addEventListener('pointerleave',resetPointer);section.addEventListener('pointercancel',resetPointer);
 function draw(dt){
   time+=dt;
   if(gsap){px=pointerState.x;py=pointerState.y;}else{px=smooth(px,pointerX,Math.min(1,dt*5));py=smooth(py,pointerY,Math.min(1,dt*5));}
   far.setAttribute('transform','translate('+f(px*3)+' '+f(py*2)+')');mid.setAttribute('transform','translate('+f(px*7)+' '+f(py*3)+')');near.setAttribute('transform','translate('+f(px*10)+' '+f(py*4)+')');
   const tx=((time*44+530)%1450)-125;const ty=407+18*Math.sin((tx-480)/260);train.setAttribute('transform','translate('+f(tx)+' '+f(ty)+')');
   for(const o of cars){o.pulse=Math.max(0,o.pulse-dt*.9);const x=((o.offset+time*o.speed)%(W+160)+W+160)%(W+160)-80;const X=o.dir>0?x:W-x;const Y=o.y+Math.sin(time*1.5+o.offset)*2+py*4-o.pulse*14;o.root.setAttribute('transform','translate('+f(X)+' '+f(Y)+') scale('+f(o.s*o.dir)+' '+f(o.s)+')');o.body.setAttribute('transform','rotate('+f(-o.pulse*8)+')');}
   for(const [i,o]of holograms.entries()){o.pulse=Math.max(0,o.pulse-dt*.55);o.field.setAttribute('opacity',f(.77+.13*Math.sin(time*1.7+i)+o.pulse*.1));o.orbit.setAttribute('transform','rotate('+f(time*(i?7:10)+px*8)+')');o.scan.setAttribute('transform','translate(0 '+f(Math.sin(time*2+i)*o.r*.7)+')');}
   for(const o of pedestrians){
    o.pulse=Math.max(0,o.pulse-dt*.65);
    const wave=o.pulse>0?Math.sin(Math.PI*Math.min(1,o.pulse*1.4)):.0;
    const go=1-wave*.92;
    o.phase+=dt*go;o.x+=o.dir*32*o.s*dt*go;if(o.x>W+45)o.x=-45;if(o.x<-45)o.x=W+45;
    place(o.root,o.x,o.y,o.dir,o.s);
    const pose=walkingPose(o.phase,go),hip=pose.hip;
    o.legA.draw([hip,pose.feet[0].knee,pose.feet[0].ankle]);o.legB.draw([hip,pose.feet[1].knee,pose.feet[1].ankle]);
    pose.feet.forEach((foot,i)=>o.boots[i].setAttribute('d','M'+f(foot.ankle[0]-2)+' '+f(foot.ankle[1]+1)+'h7'));
    const swing=(pose.feet[0].ankle[0]-40)*.65;
    o.armA.draw([[33,44],[33-swing,58],[33-swing*1.5,73]]);
    o.armB.draw([[48,44],[48+swing+wave*8,58-wave*15],[48+swing*1.5+wave*5,73-wave*(46+Math.sin(time*10)*3)]]);
    o.head.setAttribute('transform','rotate('+f(px*8-wave*9)+' 40 32)');
   }
 }
 function frame(now){raf=0;if(!visible||!active()||document.hidden||reduce.matches)return;draw(last?Math.min(.035,(now-last)/1000):0);last=now;raf=requestAnimationFrame(frame);}
 function sync(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;if(visible&&active()&&!document.hidden&&!reduce.matches)raf=requestAnimationFrame(frame);else resetPointer();}
 const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);sync();});observer.observe(host);
 document.addEventListener('portfolio:mode',sync);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);
 draw(0);
 // Load GSAP only after the scene is visible, and never rely on it for rendering.
 if(!reduce.matches)import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm').then(m=>{gsap=m.gsap||m.default?.gsap||m.default;if(!gsap?.quickTo){gsap=null;return;}pointerState.x=px;pointerState.y=py;quickX=gsap.quickTo(pointerState,'x',{duration:.55,ease:'power3.out'});quickY=gsap.quickTo(pointerState,'y',{duration:.55,ease:'power3.out'});}).catch(()=>{gsap=null;});
 addEventListener('pagehide',e=>{if(e.persisted)return;observer.disconnect();if(raf)cancelAnimationFrame(raf);document.removeEventListener('portfolio:mode',sync);document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',sync);section.removeEventListener('pointermove',pointer);section.removeEventListener('pointerleave',resetPointer);section.removeEventListener('pointercancel',resetPointer);gsap?.killTweensOf(pointerState);});
}
// Same gait solver already vendored in the portfolio's line-art library.
function walkingPose(phase,go){return walk.pose(phase,go);}
