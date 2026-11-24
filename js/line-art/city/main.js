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
 svg.style.color='#b3c6d6';svg.style.setProperty('--paper','#182334');
 const defs=el('defs',{},svg);
 const gradient=(id,stops,radial=false)=>{
   const n=el(radial?'radialGradient':'linearGradient',radial?{id}:{id,x1:0,y1:0,x2:0,y2:1},defs);
   stops.forEach(([offset,color,opacity])=>el('stop',{offset,'stop-color':color,'stop-opacity':opacity},n));return 'url(#'+id+')';
 };
 const mist=gradient('future-atmosphere',[[0,'#090c1b',1],[.47,'#16172d',1],[.78,'#252139',1],[1,'#101827',1]]);
 const light=gradient('future-beam',[[0,'#48dfff',.30],[1,'#48dfff',0]]);
 const glow=gradient('future-glow',[[0,'#8eeaff',.6],[.45,'#30c8ff',.24],[1,'#30c8ff',0]],true);
 const violet=gradient('future-violet',[[0,'#ef91ff',.48],[.5,'#a851f6',.22],[1,'#a851f6',0]],true);
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
 const amber=gradient('future-amber',[[0,'#ffd89a',.65],[.45,'#ff9e51',.2],[1,'#ff9e51',0]],true);
 const horizon=g(svg);ellipse(horizon,580,345,620,194,{fill:violet,opacity:.38});ellipse(horizon,190,382,260,120,{fill:amber,opacity:.22});
 // Layered skyline in a pen-etched architectural elevation, with generous sky for the contact sign.
 const sky=g(svg,{opacity:.7});
 for(let i=0;i<44;i++){const x=between(0,W),y=between(15,265);if(x>330&&x<870&&y<150)continue;circle(sky,x,y,between(.35,1.1),{fill:'#b6dcff'});}
 p(sky,'M0 103 Q160 84 300 102 M917 100 Q1070 80 1200 102 M18 135 Q116 125 200 137 M1000 146 Q1110 135 1200 150',.6,{stroke:'#8193c3'});
 const far=g(svg,{opacity:.28});
 const mid=g(svg,{opacity:.64});
 const near=g(svg,{opacity:.96});
 function tower(parent,x,w,top,base,depth,style,accent){
  const q=g(parent), X=u=>f(x+w*u), Y=v=>f(top+(base-top)*v);
  const fill=depth===0?'#191b32':depth===1?'#202941':'#151e30';
  const silhouette=style===0
    ?'M'+X(0)+' '+base+'V'+Y(.32)+'L'+X(.12)+' '+Y(.32)+'V'+Y(.14)+'L'+X(.32)+' '+top+'H'+X(.72)+'L'+X(.92)+' '+Y(.14)+'V'+Y(.32)+'H'+X(1)+'V'+base+'Z'
    :style===1
    ?'M'+X(0)+' '+base+'L'+X(.1)+' '+Y(.26)+'L'+X(.25)+' '+Y(.16)+'V'+Y(.06)+'L'+X(.42)+' '+top+'H'+X(.70)+'L'+X(.85)+' '+Y(.06)+'V'+Y(.16)+'L'+X(.93)+' '+Y(.26)+'L'+X(1)+' '+base+'Z'
    :'M'+X(0)+' '+base+'V'+Y(.30)+'L'+X(.13)+' '+Y(.22)+'V'+Y(.06)+'L'+X(.29)+' '+top+'H'+X(.71)+'L'+X(.87)+' '+Y(.06)+'V'+Y(.22)+'L'+X(1)+' '+Y(.30)+'V'+base+'Z';
  const id='future-tower-'+Math.round(x+100)+'-'+depth;
  const clip=el('clipPath',{id},defs);el('path',{d:silhouette},clip);
  closed(q,silhouette,depth===2?1.2:.8,{fill,stroke:depth===2?'#9bafc4':'#60738f'});
  const inside=g(q,{'clip-path':'url(#'+id+')'});
  rect(inside,x+w*.72,top,w*.28,base-top,{fill:'#0b1426',opacity:.7});
  const grid=g(inside,{opacity:depth===0?.46:.84});
  const step=depth===2?17:13;
  for(let yy=top+16;yy<base-15;yy+=step){
    p(grid,'M'+x+' '+yy+'H'+(x+w),.55,{stroke:'#586a86'});
    for(let xx=x+10;xx<x+w-8;xx+=depth===2?13:10){
      if(rand()<.31){
       const c=rand()<.55?'#e7ad76':accent;
       rect(grid,xx,yy+3,depth===2?7:4,depth===2?6:4,{fill:c,opacity:between(.45,.92)});
      }else rect(grid,xx,yy+3,depth===2?7:4,depth===2?6:4,{fill:'#29364c',stroke:'#53617a','stroke-width':.35});
    }
  }
  for(const a of [.13,.26,.49,.72,.87])p(inside,'M'+X(a)+' '+top+'V'+base,depth===2?.8:.45,{stroke:'#62758b',opacity:.7});
  if(depth===2){
    for(const a of [.25,.58,.82]){
      const yy=top+(base-top)*a;
      closed(inside,'M'+x+' '+yy+'h'+w+'v10h-'+w+'Z',.8,{fill:'#28394d',stroke:'#7790a7'});
      p(inside,'M'+x+' '+(yy+2)+'H'+(x+w),1.8,{stroke:accent});
      p(inside,'M'+x+' '+(yy+2)+'H'+(x+w),5,{stroke:accent,opacity:.10});
    }
    for(const a of [.15,.84])p(inside,'M'+X(a)+' '+Y(.11)+'V'+Y(.96),1.5,{stroke:accent,opacity:.9});
    // Mechanical service pipes and louvered recesses.
    p(inside,'M'+X(.91)+' '+Y(.42)+'v24h-8v46h8v30',2,{stroke:'#95b0c2'});
    for(let i=0;i<5;i++)p(inside,'M'+X(.08)+' '+Y(.65+i*.025)+'H'+X(.24),1.4,{stroke:'#627e98'});
    ellipse(q,x+w*.47,top+(base-top)*.6,w*.70,(base-top)*.30,{fill:accent==='#f08ccf'?violet:glow,opacity:.13,'pointer-events':'none'});
  }
  p(q,'M'+X(.48)+' '+top+'v-23 M'+X(.48)+' '+(top-14)+'h13',.85,{stroke:'#91a3bb'});
  circle(q,x+w*.48,top-24,1.6,{fill:accent});
  return q;
 }
 // Three strongly differentiated landmark silhouettes; background towers remain quiet.
 const colors=['#66dfff','#f08ccf','#eab27b'];
 [[-36,104,243,1],[310,89,245,2],[438,68,211,1],[715,86,253,0],[840,94,205,2],[1153,90,238,1]].forEach(([x,w,y,k],i)=>tower(far,x,w,y,448,0,k,colors[i%3]));
 [[-25,86,265,0],[299,104,282,1],[800,103,266,2],[1150,88,290,0]].forEach(([x,w,y,k],i)=>tower(mid,x,w,y,474,1,k,colors[i%3]));
 const lab=tower(near,84,174,224,GROUND,2,colors[0]);
 const station=tower(near,458,274,300,GROUND,0,colors[2]);
 const ai=tower(near,942,182,210,GROUND,1,colors[1]);
 // Every wall sign, conduit, roof bracket and emitter belongs to its building group.
 function sign(parent,x,y,w,h,label,sub,accent){
   const panel=g(parent);
   ellipse(panel,x+w/2,y+h/2,w*.75,h*1.8,{fill:accent==='#f08ccf'?violet:glow,opacity:.75,'pointer-events':'none'});
   closed(panel,'M'+(x-4)+' '+(y+4)+'h4v'+(h-8)+'h-4Z M'+(x+w)+' '+(y+4)+'h4v'+(h-8)+'h-4Z',.9,{fill:'#23394e'});
   rect(panel,x,y,w,h,{rx:2,fill:'#141e31',stroke:accent,'stroke-width':1.1});
   rect(panel,x+3,y+3,w-6,h-6,{rx:1,fill:'#1b2940',stroke:accent,'stroke-width':.35});
   text(panel,x+w/2,y+12,label,8.5,{'text-anchor':'middle',fill:'#e7f5ff','letter-spacing':1});
   text(panel,x+w/2,y+23,sub,5.8,{'text-anchor':'middle',fill:accent,'letter-spacing':.7});
   p(panel,'M'+(x+w-10)+' '+(y+h)+'v9h6v9',.8,{stroke:accent});
   return panel;
 }
 sign(lab,103,285,133,31,'SYNTH / LAB','ROBOTICS & FLIGHT','#66dfff');
 sign(ai,965,285,139,31,'AI SYSTEMS','INFERENCE RESEARCH','#f08ccf');
 sign(station,525,345,150,31,'CENTRAL TRANSIT','MAGLEV PLATFORM 01','#eab27b');
 function facadeDetail(parent,x,y,w){
   closed(parent,'M'+x+' '+y+'h'+w+'v24h-'+w+'Z',.9,{fill:'#283a51'});
   for(let j=6;j<w-5;j+=9)p(parent,'M'+(x+j)+' '+(y+4)+'v16',.6);
   p(parent,'M'+(x+w-12)+' '+(y+24)+'v32h-14v27',1.3);
 }
 facadeDetail(lab,113,352,111);facadeDetail(ai,976,352,112);
 // Fixed roof-mounted projectors: the hologram is a functional display, not a floating ornament.
 const holograms=[];
 function rooftopDisplay(parent,x,roof,r,kind){
   const accent=kind==='air'?'#66dfff':'#f08ccf';
   const base=g(parent,{transform:'translate('+x+' '+roof+')'});
   const centerY=-r-24;
   closed(base,'M-'+(r*.8)+' 0 L-'+(r*.62)+' -11 H'+(r*.62)+' L'+(r*.8)+' 0Z',1,{fill:'#dce7eb'});
   closed(base,'M-'+(r*.46)+' -11 v-8 h'+(r*.92)+' v8Z',.9,{fill:'#283b55'});
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
     nodes.forEach(([a,b])=>circle(orbit,a,b,2.7,{fill:'#152438',stroke:accent,'stroke-width':.9}));
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
 const track=p(transit,trackD,20,{stroke:'#27384b','stroke-linecap':'butt'});
 const trackLength=track.getTotalLength();
 const at=d=>track.getPointAtLength(clamp(d,0,trackLength));
 for(let d=140;d<trackLength-120;d+=172){
   const a=at(d);
   if(a.x<0||a.x>W)continue;
   closed(transit,'M'+f(a.x-6)+' '+f(a.y+6)+'h12L'+f(a.x+4)+' 503H'+f(a.x-4)+'Z',.85,{fill:'#1d2a3d'});
   p(transit,'M'+f(a.x)+' '+f(a.y+14)+'V498',.5);
 }
 p(transit,trackD,20,{stroke:'#a2afc6','stroke-opacity':.72,'stroke-linecap':'butt'});
 p(transit,trackD,18,{stroke:'#293a50','stroke-linecap':'butt'});
 const lower=g(transit,{transform:'translate(0 6)'});
 p(lower,trackD,.7,{stroke:'#6a8d99','stroke-linecap':'butt'});
 p(transit,trackD,1.35,{stroke:'#61d5f5','stroke-linecap':'butt'});
 const train=g(transit),trainCars=[];
 for(let i=0;i<3;i++){
   const car=g(train);
   const body=i===0?'M-25 -4V-17Q-22 -23 -12 -23H12Q20 -22 27 -11L25 -4Z':'M-24 -4V-19Q-22 -23 -16 -23H18Q24 -23 24 -18V-4Z';
   closed(car,body,1.05,{fill:'#25354c'});
   p(car,'M-23 -6H23 M-23 -20H19',.7,{stroke:'#16839a'});
   for(let x=-18;x<13;x+=9)rect(car,x,-17,6,6,{rx:1,fill:'#c9ebff'});
   if(i===0)closed(car,'M14 -21Q21 -18 24 -12H14Z',.6,{fill:'#649dbb'});
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
   const root=g(vehicles,{style:'cursor:pointer'}),body=g(root),c=kind?'#f5a2ed':'#75e5ff';
   // Saucer-shaped craft with a glass canopy, luminous perimeter and scanning underside.
   ellipse(body,0,5,42,13,{fill:kind?violet:glow,opacity:.92});
   closed(body,'M-31 1 Q-25 -6 0 -8 Q25 -6 31 1 Q29 10 0 12 Q-29 10 -31 1Z',1.1,{fill:'#273a53',stroke:'#bbd5e6'});
   closed(body,'M-14 -6 Q-11 -22 0 -22 Q11 -22 14 -6Z',.9,{fill:'#39567a',stroke:c});
   p(body,'M-10 -10 Q-5 -20 0 -19',.8,{stroke:'#c4f2ff'});
   ellipse(body,0,1,31,7,stroke('#a4b7cd',.75));
   p(body,'M-25 5 Q0 15 25 5',1.1,{stroke:c});
   for(let i=-24;i<=24;i+=8)circle(body,i,6+2*(1-Math.abs(i)/24),1.5,{fill:c});
   const beam=closed(body,'M-9 10 L-35 57 H35 L9 10Z',.4,{fill:light,stroke:c,'stroke-opacity':.19,opacity:0});
   body.insertBefore(beam,body.firstChild);
   const title=el('title',{},root);title.textContent='Tap UFO to scan';
   return {root,body,beam,y,s,dir,offset,speed,pulse:0};
 }
 const cars=[craft(106,.70,1,160,37,0),craft(188,.95,-1,710,32,1),craft(271,1.05,1,325,42,0)];
 // Wide foreground deck, rail and tiled perspective. Robots are part of the street, not UI icons.
 const deck=g(svg);
 closed(deck,'M0 502 Q600 498 1200 502 V600 H0Z',1.3,{fill:'#142135'});
 p(deck,'M0 512H1200 M0 534H1200 M0 565H1200 M0 594H1200',.8,{stroke:'#51657f'});
 for(let x=-200;x<1400;x+=55)p(deck,'M'+f(600+(x-600)*.76)+' 502L'+x+' 600',.55,{stroke:'#455976'});
 p(deck,'M0 511H1200 M0 519H1200',1.3);for(let x=12;x<W;x+=62)p(deck,'M'+x+' 490V527',1);
 p(deck,'M0 490Q600 487 1200 490 M0 496H1200',1.05);
 // Reflected light from the city spills across the foreground paving.
 const reflections=g(deck,{'pointer-events':'none'});
 for(const [x,c]of [[170,'#66dfff'],[600,'#ffbc77'],[1040,'#f08ccf']]){
  for(let i=0;i<13;i++){
   const yy=519+i*6,xx=x+between(-31,31),w=between(8,54)*(1+i*.04);
   p(reflections,'M'+f(xx-w/2)+' '+yy+'h'+f(w),between(.6,2.0),{stroke:c,opacity:between(.10,.36)});
  }
 }
 const lamps=g(svg);
 for(const x of [42,391,775,1172]){
   p(lamps,'M'+x+' 510V450q0 -7 9 -7h11',1.3,{stroke:'#a2b5c9'});
   rect(lamps,x+9,442,13,4,{rx:1,fill:'#ffe5b2'});
   ellipse(lamps,x+15,457,29,36,{fill:amber,opacity:.72});
 }
 const robots=g(svg);
 function robot(x,y,s,dir,phase){
   const root=g(robots,{style:'cursor:pointer'}),fig=g(root),legA=limb(fig,5.3,1.1),legB=limb(fig,5.3,1.1),armA=limb(fig,4,1),body=closed(fig,'M29 43 L35 37 H46 L52 43 49 72 32 72Z',1.2,{fill:'#324963'}),armB=limb(fig,4,1);
   const neck=rect(fig,38,30,5,8,{...stroke(),fill:'#fff'}),head=g(fig);
   closed(head,'M31 17 L35 12 H46 L51 18 V29 L46 33 H35 L31 28Z',1.15,{fill:'#3b5470'});
   rect(head,34,20,14,5,{rx:2,fill:'#0e192b'});circle(head,38,22.5,1.1,{fill:'#61e0f5'});circle(head,44,22.5,1.1,{fill:'#61e0f5'});
   p(head,'M40 12V6 M37 6H43',.85);circle(head,40,5,1.4,{fill:'#168ca8'});
   rect(fig,36,46,11,10,{rx:2,fill:'#263a50',stroke:'#16849c','stroke-width':.8});p(fig,'M38 51H45 M41 48V54',.8,{stroke:'#16849c'});
   p(fig,'M34 65H47 M33 69H48',.7);
   const boots=[p(fig,'M0 0',2.2),p(fig,'M0 0',2.2)];
   const title=el('title',{},root);title.textContent='Tap robot to wave';
   return {root,fig,legA,legB,armA,armB,head,boots,x,y,s,dir,phase,pulse:0};
 }
 const bots=[robot(176,565,.77,1,.2),robot(825,551,.62,-1,.65),robot(1052,572,.82,-1,.1)];
 // Companion quadruped: moves with its owner; each of its four legs has a separate gait.
 const dog=g(robots,{style:'cursor:pointer'}),dogBody=g(dog),dogLegs=[];
 ellipse(dogBody,0,0,16,5,{fill:glow,opacity:.45});
 for(const x of [-12,-7,7,12]){
  const leg=g(dogBody);closed(leg,'M-2 0H2L3 7 1 15H-2L-1 7Z',.9,{fill:'#30445e'});
  circle(leg,0,6,1.6,{fill:'#83dcf5'});dogLegs.push({leg,x});
 }
 closed(dogBody,'M-16 -13 L-10 -17 H10 L16 -12 13 0H-13Z',1,{fill:'#425a74'});
 closed(dogBody,'M12 -13 L18 -21 25 -19 28 -11 19 -7 14 -9Z',.9,{fill:'#425a74'});
 closed(dogBody,'M18 -20L17 -27 23 -22Z',.8,{fill:'#6d84a0'});
 circle(dogBody,24,-16,1.5,{fill:'#8ceeff'});
 p(dogBody,'M-15 -11L-24 -19L-28 -18',1.7,{stroke:'#93b5d0'});
 p(dogBody,'M-9 -12H8 M-10 -6H11',.8,{stroke:'#a7c4dc'});
 rect(dogBody,-3,-14,7,4,{rx:1,fill:'#f1b677'});
 const dogTitle=el('title',{},dog);dogTitle.textContent='Tap the robot dog';
 let dogPulse=0;
 dog.addEventListener('pointerdown',()=>{dogPulse=1;});
 // Original transforming mech: shared chassis, articulated arms/legs and wheels fold into a rover.
 const mech=g(robots,{style:'cursor:pointer'});let mx=530,morph=0,target=0,mechDirection=1;
 const mechParts=[];
 function piece(d,color,a,b){
   const group=g(mech);closed(group,d,1.1,{fill:color,stroke:'#bdcce0'});
   mechParts.push({group,a,b});return group;
 }
 const metal='#39536e',panel='#6b85a0',dark='#23374e';
 const chassis=piece('M-18 -12L-12 -18H12L18 -12 15 13H-15Z',metal,[0,-49,0,1,1],[0,-13,0,1.65,.64]);
 p(chassis,'M-11 -9H11 M-9 -2H9 M-10 7H10',.9,{stroke:'#79e6fc'});
 const helmet=piece('M-9 -9H9L11 0 7 9H-7L-11 0Z',panel,[0,-77,0,1,1],[4,-24,0,1.2,.65]);
 rect(helmet,-7,-3,14,4,{rx:1,fill:'#75e5ff'});
 for(const side of [-1,1]){
   const shoulder=piece('M-7 -9H7L9 5 5 10H-6Z',panel,[side*23,-53,side*12,1,1],[side*24,-12,side*85,1,.85]);
   p(shoulder,'M-4 -5H4',1.5,{stroke:'#f0b87c'});
   const arm=piece('M-5 -8H5L6 9H-6Z',metal,[side*27,-32,side*9,1,1],[side*32,-10,90,1,1]);
   p(arm,'M0 -4V5',1,{stroke:'#71d8f6'});
   const leg=piece('M-8 -13H8L6 12H-6Z',dark,[side*10,-20,side*4,1,1],[side*14,-7,90,.8,1]);
   p(leg,'M-4 -8H4 M-4 4H4',.8,{stroke:'#a0bcd3'});
   const wheel=g(mech);circle(wheel,0,0,7,{fill:'#0a1322',stroke:'#a4b9d3','stroke-width':1});circle(wheel,0,0,3,{fill:'#6f8dab',stroke:'#6de3fc','stroke-width':.8});
   mechParts.push({group:wheel,a:[side*24,-46,0,.8,.8],b:[side*25,-4,0,1,1]});
 }
 const mechTitle=el('title',{},mech);mechTitle.textContent='Tap to transform mech into rover; tap again to unfold';
 const mechLabel=text(mech,0,13,'TAP TO TRANSFORM',6.5,{'text-anchor':'middle',fill:'#e6c491','letter-spacing':.6});
 mech.addEventListener('pointerdown',()=>{target=target?0:1;});

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
   for(const o of cars){o.pulse=Math.max(0,o.pulse-dt*.9);const x=((o.offset+time*o.speed)%(W+160)+W+160)%(W+160)-80;const X=o.dir>0?x:W-x;const Y=o.y+Math.sin(time*1.5+o.offset)*2+py*4-o.pulse*14;o.root.setAttribute('transform','translate('+f(X)+' '+f(Y)+') scale('+f(o.s*o.dir)+' '+f(o.s)+')');o.body.setAttribute('transform','rotate('+f(-o.pulse*5)+')');o.beam.setAttribute('opacity',f(o.pulse*.85));}
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
    const go=reduce.matches?0:1-wave*.92;
    o.phase+=dt*go;o.x+=o.dir*walk.speed*o.s*dt*go;if(o.x>W+45)o.x=-45;if(o.x<-45)o.x=W+45;
    place(o.root,o.x,o.y,o.dir,o.s);
    const pose=walkingPose(o.phase,go),hip=pose.hip;
    o.legA.draw([hip,pose.feet[0].knee,pose.feet[0].ankle]);o.legB.draw([hip,pose.feet[1].knee,pose.feet[1].ankle]);
    pose.feet.forEach((foot,i)=>o.boots[i].setAttribute('d','M'+f(foot.ankle[0]-2)+' '+f(foot.ankle[1]+1)+'h7'));
    const swing=(pose.feet[0].ankle[0]-40)*.65;
    o.armA.draw([[33,44],[33-swing,58],[33-swing*1.5,73]]);
    o.armB.draw([[48,44],[48+swing+wave*8,58-wave*15],[48+swing*1.5+wave*5,73-wave*(46+Math.sin(time*10)*3)]]);
    o.head.setAttribute('transform','rotate('+f(px*8-wave*9)+' 40 32)');
   }
   const owner=bots[0];
   dogPulse=Math.max(0,dogPulse-dt*1.15);
   dog.setAttribute('transform','translate('+f(owner.x-owner.dir*38)+' '+f(owner.y-13-Math.sin(dogPulse*Math.PI)*8)+') scale('+owner.dir+' 1)');
   dogLegs.forEach(({leg,x},i)=>leg.setAttribute('transform','translate('+x+' -1) rotate('+f(Math.sin(owner.phase*6.283+(i%2)*Math.PI+(i>1?Math.PI:0))*19)+')'));
   morph=smooth(morph,target,Math.min(1,dt*3.5));
   if(Math.abs(morph-target)<.005)morph=target;
   if(morph>.93){mx+=mechDirection*46*dt;if(mx>720){mx=720;mechDirection=-1;}if(mx<430){mx=430;mechDirection=1;}}
   const u=morph*morph*(3-2*morph);
   mech.setAttribute('transform','translate('+f(mx)+' 566)');
   for(const part of mechParts){
     const v=part.a.map((a,i)=>smooth(a,part.b[i],u));
     part.group.setAttribute('transform','translate('+f(v[0])+' '+f(v[1])+') rotate('+f(v[2])+') scale('+f(v[3])+' '+f(v[4])+')');
   }
   mechLabel.textContent=target?'TAP TO UNFOLD':'TAP TO TRANSFORM';
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
