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
 const closed=(parent,d,w=.9,attrs={})=>{const n=shape(parent,w);n.setAttribute('d',d);if('fill' in attrs)n.classList.remove('pp');for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
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
 // A small, legible district: seven quiet silhouettes, four midground buildings,
 // and three signature facilities. No wall of repeated skyscrapers.
 const colors=['#167c96','#6752a7','#32677c'];
 [[-22,95,286,0],[225,68,257,1],[354,70,320,0],[436,65,246,2],[740,73,277,1],[833,63,320,0],[1155,90,260,1]].forEach(([x,w,y,k],i)=>tower(far,x,w,y,448,0,k,colors[i%3]));
 [[-18,76,270,0],[315,93,300,1],[740,105,270,2],[1150,88,292,1]].forEach(([x,w,y,k],i)=>tower(mid,x,w,y,474,1,k,colors[i%3]));
 const lab=tower(near,86,168,224,GROUND,2,colors[0]);
 const station=tower(near,475,250,300,GROUND,0,colors[2]);
 const ai=tower(near,947,176,210,GROUND,1,colors[1]);
 // Every wall sign, conduit, roof bracket and emitter belongs to its building group.
 function sign(parent,x,y,w,h,label,sub,accent){
   const panel=g(parent);
   closed(panel,'M'+(x-4)+' '+(y+4)+'h4v'+(h-8)+'h-4Z M'+(x+w)+' '+(y+4)+'h4v'+(h-8)+'h-4Z',.9,{fill:'#dbe5e8'});
   rect(panel,x,y,w,h,{rx:2,fill:'#fff',stroke:accent,'stroke-width':1.1});
   rect(panel,x+3,y+3,w-6,h-6,{rx:1,fill:'#f3fafb',stroke:accent,'stroke-width':.35});
   text(panel,x+w/2,y+12,label,8.5,{'text-anchor':'middle',fill:'#173b4a','letter-spacing':1});
   text(panel,x+w/2,y+23,sub,5.8,{'text-anchor':'middle',fill:accent,'letter-spacing':.7});
   p(panel,'M'+(x+w-10)+' '+(y+h)+'v9h6v9',.8,{stroke:accent});
   return panel;
 }
 sign(lab,103,260,133,31,'SYNTH / LAB','ROBOTICS & FLIGHT','#167c96');
 sign(ai,965,246,139,31,'AI SYSTEMS','INFERENCE RESEARCH','#7852b2');
 sign(station,525,325,150,31,'CENTRAL TRANSIT','MAGLEV PLATFORM 01','#32677c');
 function facadeDetail(parent,x,y,w){
   closed(parent,'M'+x+' '+y+'h'+w+'v24h-'+w+'Z',.9,{fill:'#f3f7f8'});
   for(let j=6;j<w-5;j+=9)p(parent,'M'+(x+j)+' '+(y+4)+'v16',.6);
   p(parent,'M'+(x+w-12)+' '+(y+24)+'v32h-14v27',1.3);
 }
 facadeDetail(lab,113,324,111);facadeDetail(ai,976,315,112);
 // Fixed roof-mounted projectors: the hologram is a functional display, not a floating ornament.
 const holograms=[];
 function rooftopDisplay(parent,x,roof,r,kind){
   const accent=kind==='air'?'#16849c':'#7852b2';
   const base=g(parent,{transform:'translate('+x+' '+roof+')'});
   const centerY=-r-24;
   closed(base,'M-'+(r*.8)+' 0 L-'+(r*.62)+' -11 H'+(r*.62)+' L'+(r*.8)+' 0Z',1,{fill:'#dce7eb'});
   closed(base,'M-'+(r*.46)+' -11 v-8 h'+(r*.92)+' v8Z',.9,{fill:'#f7fbfc'});
   ellipse(base,0,-20,r*.47,4,{fill:glow,stroke:accent,'stroke-width':.85});
   p(base,'M-'+(r*.42)+' -20 L-'+(r*.95)+' '+(centerY-r*.72)+' M'+(r*.42)+' -20 L'+(r*.95)+' '+(centerY-r*.72),.65,{stroke:accent,opacity:.6});
   const root=g(base,{transform:'translate(0 '+centerY+')',style:'cursor:pointer'});
   circle(root,0,0,r+4,{fill:'transparent'});
   circle(root,0,0,r*1.25,{fill:kind==='air'?glow:violet});
   const field=g(root,{opacity:.88});
   circle(field,0,0,r,{...stroke(accent,.85),'stroke-dasharray':'2 4'});
   const orbit=g(field);
   const scan=p(field,'M'+(-r*.75)+' 0H'+(r*.75),.9,{stroke:accent,opacity:.6});
   const dots=[];
   if(kind==='air'){
     // Airspace radar: three designated flight corridors and aircraft tracks.
     for(const k of [.33,.66,.92])circle(orbit,0,0,r*k,stroke(accent,.55));
     p(orbit,'M'+(-r)+' 0H'+r+' M0 '+(-r)+'V'+r,.55,{stroke:accent,opacity:.7});
     p(orbit,'M0 0L'+r*.88+' '+(-r*.26),1.1,{stroke:accent});
     for(let i=0;i<3;i++)dots.push(circle(field,0,0,1.8,{fill:accent}));
   }else{
     // Inference monitor: input layer, hidden layer and output layer with signal pulses.
     const nodes=[[-.67,-.40],[-.67,0],[-.67,.40],[0,-.60],[0,-.2],[0,.2],[0,.60],[.67,-.25],[.67,.25]].map(([a,b])=>[a*r,b*r]);
     for(let a=0;a<3;a++)for(let b=3;b<7;b++)p(orbit,'M'+nodes[a].join(' ')+'L'+nodes[b].join(' '),.55,{stroke:accent,opacity:.6});
     for(let a=3;a<7;a++)for(let b=7;b<9;b++)p(orbit,'M'+nodes[a].join(' ')+'L'+nodes[b].join(' '),.55,{stroke:accent,opacity:.6});
     nodes.forEach(([a,b])=>circle(orbit,a,b,2.7,{fill:'#fff',stroke:accent,'stroke-width':.9}));
     for(let i=0;i<3;i++)dots.push(circle(field,0,0,1.8,{fill:accent}));
   }
   const status=text(base,0,11,kind==='air'?'AIRSPACE RADAR':'NEURAL CORE',6.8,{'text-anchor':'middle',fill:accent,'letter-spacing':.7});
   const title=el('title',{},root);title.textContent=kind==='air'?'Activate air-traffic radar':'Trace the inference signal';
   holograms.push({root,field,orbit,scan,r,kind,dots,status,pulse:0,accent});
 }
 rooftopDisplay(lab,169,224,32,'air');
 rooftopDisplay(ai,1035,210,34,'neural');
 // One shared guideway path controls the deck, rails, supports AND each articulated train car.
 const transit=g(svg);
 const trackD='M-180 408 C60 408 170 388 325 399 S560 449 715 419 S960 370 1380 395';
 const track=p(transit,trackD,20,{stroke:'#d9e5e9','stroke-linecap':'butt'});
 const trackLength=track.getTotalLength();
 const at=d=>track.getPointAtLength(clamp(d,0,trackLength));
 for(let d=140;d<trackLength-120;d+=172){
   const a=at(d);
   if(a.x<0||a.x>W)continue;
   closed(transit,'M'+f(a.x-6)+' '+f(a.y+6)+'h12L'+f(a.x+4)+' 503H'+f(a.x-4)+'Z',.85,{fill:'#eff4f6'});
   p(transit,'M'+f(a.x)+' '+f(a.y+14)+'V498',.5);
 }
 p(transit,trackD,20,{stroke:'#20313a','stroke-opacity':.58,'stroke-linecap':'butt'});
 p(transit,trackD,18,{stroke:'#e6eef0','stroke-linecap':'butt'});
 const lower=g(transit,{transform:'translate(0 6)'});
 p(lower,trackD,.7,{stroke:'#6a8d99','stroke-linecap':'butt'});
 p(transit,trackD,1.35,{stroke:'#16839a','stroke-linecap':'butt'});
 const train=g(transit),trainCars=[];
 for(let i=0;i<3;i++){
   const car=g(train);
   const body=i===0?'M-25 -4V-17Q-22 -23 -12 -23H12Q20 -22 27 -11L25 -4Z':'M-24 -4V-19Q-22 -23 -16 -23H18Q24 -23 24 -18V-4Z';
   closed(car,body,1.05,{fill:'#fbfdfe'});
   p(car,'M-23 -6H23 M-23 -20H19',.7,{stroke:'#16839a'});
   for(let x=-18;x<13;x+=9)rect(car,x,-17,6,6,{rx:1,fill:'#7fa1ae'});
   if(i===0)closed(car,'M14 -21Q21 -18 24 -12H14Z',.6,{fill:'#b1d1de'});
   rect(car,-16,-4,10,3,{rx:1,fill:'#355565'});rect(car,9,-4,10,3,{rx:1,fill:'#355565'});
   trainCars.push(car);
 }
 function positionTrain(t){
   const lead=((t*52+610)%(trackLength-8))+4;
   trainCars.forEach((car,i)=>{
     const d=lead-i*51;
     if(d<2||d>trackLength-2){car.setAttribute('visibility','hidden');return;}
     const a=at(d),before=at(d-2),after=at(d+2);
     const angle=Math.atan2(after.y-before.y,after.x-before.x)*180/Math.PI;
     car.setAttribute('visibility','visible');
     car.setAttribute('transform','translate('+f(a.x)+' '+f(a.y)+') rotate('+f(angle)+')');
   });
 }
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
 const cars=[craft(104,.9,1,220,82,0),craft(177,1.15,-1,800,62,1),craft(263,1.35,1,100,92,0),craft(350,.85,-1,650,55,0)];
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
   far.setAttribute('transform','translate('+f(px*2)+' 0)');mid.setAttribute('transform','translate('+f(px*5)+' 0)');near.setAttribute('transform','translate('+f(px*7)+' 0)');
   positionTrain(time);
   for(const o of cars){o.pulse=Math.max(0,o.pulse-dt*.9);const x=((o.offset+time*o.speed)%(W+160)+W+160)%(W+160)-80;const X=o.dir>0?x:W-x;const Y=o.y+Math.sin(time*1.5+o.offset)*2+py*4-o.pulse*14;o.root.setAttribute('transform','translate('+f(X)+' '+f(Y)+') scale('+f(o.s*o.dir)+' '+f(o.s)+')');o.body.setAttribute('transform','rotate('+f(-o.pulse*8)+')');}
   for(const o of holograms){
     o.pulse=Math.max(0,o.pulse-dt*.55);
     o.field.setAttribute('opacity',f(.86+o.pulse*.14));
     if(o.kind==='air'){
       o.orbit.setAttribute('transform','rotate('+f(time*25+o.pulse*15)+')');
       o.dots.forEach((dot,i)=>{const angle=time*(.18+i*.04)+i*2.1;const r=o.r*(.36+i*.22);dot.setAttribute('cx',f(Math.cos(angle)*r));dot.setAttribute('cy',f(Math.sin(angle)*r));});
     }else{
       // Neural connections remain stable; packets travel from input to output.
       o.dots.forEach((dot,i)=>{const u=(time*(.45+o.pulse*.5)+i*.33)%1;dot.setAttribute('cx',f((u*1.34-.67)*o.r));dot.setAttribute('cy',f(Math.sin(u*Math.PI*2+i*2.1)*o.r*.23));});
     }
     o.scan.setAttribute('transform','translate(0 '+f(Math.sin(time*1.5)*o.r*.65)+')');
   }
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
