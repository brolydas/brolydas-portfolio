// Intelligence-only additions to the original daytime ink village.
// Original SVG additions use the vendored line-art pen and planted-foot gait.
import {el,pen,shape,limb,place,f,gait} from '../lib/ink.js';
import {W,LANE,clamp,lerp,smooth} from './kit.js';

export function createFutureVillage({svg,defs,scene,walkers,buildings,people,reduced}){
 const active=()=>document.documentElement.dataset.mode==='intelligence';
 const g=(parent,attrs={})=>el('g',attrs,parent);
 const path=(parent,d,attrs={})=>el('path',{d,fill:'none',stroke:'currentColor','stroke-width':.65,'stroke-linecap':'round','stroke-linejoin':'round',...attrs},parent);
 const rect=(parent,x,y,width,height,attrs={})=>el('rect',{x,y,width,height,...attrs},parent);
 const circle=(parent,cx,cy,r,attrs={})=>el('circle',{cx,cy,r,...attrs},parent);
 const ellipse=(parent,cx,cy,rx,ry,attrs={})=>el('ellipse',{cx,cy,rx,ry,...attrs},parent);
 const label=(parent,x,y,value,size=6,attrs={})=>{const n=el('text',{x,y,'text-anchor':'middle','font-size':size,'font-family':'monospace','letter-spacing':.7,fill:'#216c78',...attrs},parent);n.textContent=value;return n;};
 const cyan='#2c9ba5',dark='#335761',warm='#bb804a';
 const gradient=el('linearGradient',{id:'fv-beam',x1:0,y1:0,x2:0,y2:1},defs);
 [[0,'#68dfdb',.54],[.6,'#86dcca',.23],[1,'#a1e6d1',.06]].forEach(([offset,color,opacity])=>el('stop',{offset,'stop-color':color,'stop-opacity':opacity},gradient));
 const halo=el('radialGradient',{id:'fv-halo'},defs);
 [[0,'#70dce0',.48],[1,'#70dce0',0]].forEach(([offset,color,opacity])=>el('stop',{offset,'stop-color':color,'stop-opacity':opacity},halo));
 // Existing house geometry stays intact. Both small holograms have physical rooftop mounts.
 const signs=[];
 function sign(parent,x,y,type){
   const root=g(parent,{visibility:'hidden','pointer-events':'none'});
   path(root,'M'+(x-17)+' '+y+'h34l-4 -5h-26Z',{fill:'#b9c7c7',stroke:dark});
   rect(root,x-10,y-9,20,4,{rx:1,fill:'#d9e2e0',stroke:dark,'stroke-width':.65});
   ellipse(root,x,y-10,14,4,{fill:'url(#fv-halo)'});
   path(root,'M'+(x-8)+' '+(y-9)+'L'+(x-31)+' '+(y-35)+' M'+(x+8)+' '+(y-9)+'L'+(x+31)+' '+(y-35),{stroke:cyan,opacity:.48});
   const panel=g(root,{transform:'translate('+x+' '+(y-47)+')','pointer-events':'all',style:'cursor:pointer'});
   rect(panel,-34,-17,68,30,{rx:2,fill:'#f3fcfa','fill-opacity':.87,stroke:cyan,'stroke-width':.8});
   path(panel,'M-31 -11v-3h8 M23 -14h8v3 M-31 7v3h8 M23 10h8v-3',{stroke:cyan,'stroke-width':1});
   const name=label(panel,0,-8,({lab:'AI / LAB',service:'ROBO SERVICE',weather:'AIR TRAFFIC',tea:'SMART TEA'})[type],5.5);
   const graphic=g(panel);
   if(type==='lab'){
     const nodes=[[-20,-1],[-20,5],[-7,-3],[-7,3],[-7,9],[7,0],[7,6],[20,3]];
     for(const [a,b]of [[0,2],[0,3],[1,3],[1,4],[2,5],[3,5],[3,6],[4,6],[5,7],[6,7]])path(graphic,'M'+nodes[a].join(' ')+'L'+nodes[b].join(' '),{stroke:cyan,opacity:.7});
     nodes.forEach(([a,b])=>circle(graphic,a,b,1.35,{fill:'#e0faf5',stroke:cyan,'stroke-width':.5}));
   }else if(type==='weather'){
     for(const r of [4,8])circle(graphic,-13,3,r,{fill:'none',stroke:cyan,'stroke-width':.5});
     path(graphic,'M-13 3l6 -5 M2 -3h20 M2 3h13 M2 9h17',{stroke:cyan});
     circle(graphic,-9,0,1.3,{fill:cyan});
   }else if(type==='tea'){
     path(graphic,'M-10 -1h19v7q-2 5 -9 5t-10 -5Z M9 0h4q5 4 0 6H9 M-5 -4q-3 -3 0 -6 M2 -4q-3 -3 0 -6',{stroke:cyan});
   }else{
     path(graphic,'M-20 1h8v7h-8Z M-16 1v-4 M-18 4h1 M-15 4h1 M-9 4h11 M6 -1h14v9H6Z M9 3h8 M9 6h5',{stroke:cyan,'stroke-width':.8});
   }
   const scan=path(panel,'M-30 -3H30',{stroke:'#49c8ce',opacity:.55});
   let pulse=0;
   panel.addEventListener('pointerdown',e=>{if(!active()||reduced.matches)return;e.stopPropagation();pulse=1;});
   const title=el('title',{},panel);title.textContent=type==='lab'?'Tap to inspect the neural signal':'Tap to activate robot service display';
   signs.push({root,panel,scan,draw(t,dt){pulse=Math.max(0,pulse-dt*.7);scan.setAttribute('transform','translate(0 '+f(9*Math.sin(t*1.5)) +')');panel.setAttribute('opacity',f(.86+pulse*.14));}});
 }
 sign(buildings[0],122,184,'lab');
 sign(buildings[1],305,204,'weather');
 sign(buildings[2],635,228,'tea');
 sign(buildings[3],821,214,'service');
 // Keep the robot at the same human scale and lane as the original villagers.
 const walk=gait({kind:'walk',stride:19});
 const robots=[];
 function robot(x,y,dir,phase,accent,scale=.5,variant=0){
   const root=g(walkers,{visibility:'hidden',style:'cursor:pointer'});
   const farLeg=limb(root,4.6,.85),nearLeg=limb(root,4.6,.85),farArm=limb(root,3.4,.85);
   const torso=g(root),head=g(root);
   path(torso,'M30 44L35 38H46L51 44 48 70H33Z',{fill:variant===1?'#d7bfa2':variant===2?'#b8c9de':'#c5d6d3',stroke:dark,'stroke-width':1.1});
   path(torso,'M33 46H48 M35 66H46 M35 69H46',{stroke:dark});
   rect(torso,35,50,11,9,{rx:2,fill:'#f0f8f4',stroke:cyan,'stroke-width':.9});
   path(torso,'M38 54H43 M40.5 52V56',{stroke:cyan,'stroke-width':1});
   path(head,'M32 20L35 15H46L50 20V30L46 34H35L32 30Z',{fill:variant===1?'#f3e7d8':variant===2?'#dce5ef':'#e6eae3',stroke:dark,'stroke-width':1.1});
   rect(head,34,23,14,5,{rx:2,fill:'#315861'});
   circle(head,38,25.5,1.1,{fill:'#99f5e5'});circle(head,44,25.5,1.1,{fill:'#99f5e5'});
   path(head,'M41 15V10 M38 10H44',{stroke:dark});
   circle(head,41,9,1.7,{fill:accent});
   if(variant===1){
     path(torso,'M29 43l-6 6v15h9 M51 43l6 6v15h-8',{fill:'#b7a48a',stroke:dark});
     path(head,'M30 24h-3v7h3 M52 24h3v7h-3',{stroke:dark,'stroke-width':1.1});
   }
   if(variant===2){
     rect(torso,28,48,6,15,{rx:2,fill:'#829ab2',stroke:dark,'stroke-width':.65});
     path(head,'M30 19h22 M34 13h14',{stroke:dark,'stroke-width':1.05});
   }
   const nearArm=limb(root,3.4,.85);
   const boots=[path(root,'M0 0',{stroke:dark,'stroke-width':1.8}),path(root,'M0 0',{stroke:dark,'stroke-width':1.8})];
   const title=el('title',{},root);title.textContent='Tap robot to wave';
   const o={g:root,x,y,dir,phase,pulse:0};
   root.addEventListener('pointerdown',e=>{if(!active()||reduced.matches)return;e.stopPropagation();o.pulse=1;});
   o.draw=(t,dt)=>{
     o.pulse=Math.max(0,o.pulse-dt*.65);
     const wave=Math.sin(Math.PI*o.pulse),go=reduced.matches?0:1-wave*.92;
     o.phase+=dt/walk.period*go;o.x+=dir*walk.speed*scale*dt*go;
     if(o.x>W+35)o.x=-35;if(o.x<-35)o.x=W+35;
     place(root,o.x,o.y,dir,scale);
     const pose=walk.pose(o.phase,go);
     [farLeg,nearLeg].forEach((leg,i)=>leg.draw([pose.hip,pose.feet[i].knee,pose.feet[i].ankle]));
     pose.feet.forEach((foot,i)=>boots[i].setAttribute('d','M'+f(foot.ankle[0]-2)+' '+f(foot.ankle[1]+1)+'h6'));
     const a=(pose.feet[0].ankle[0]-40)*.65;
     farArm.draw([[34,45],[34-a,59],[34-a*1.3,74]]);
     nearArm.draw([[48,45],[48+a+wave*9,59-wave*13],[48+a*1.3+wave*5,74-wave*(45+Math.sin(t*9)*3)]]);
     head.setAttribute('transform','rotate('+f(-wave*8)+' 41 32)');
   };
   robots.push(o);return o;
 }
 robot(280,LANE.mid,1,.15,warm);
 robot(810,LANE.back,-1,.55,cyan);
 robot(70,LANE.front,1,.35,'#bb804a',.54,1);
 robot(525,LANE.back,-1,.8,'#7298b1',.43,2);
 // One sparse sci-fi event at a time. A captured adult boards the craft and leaves the scene.
 // Beam is in front of the buildings but behind the walkers; the saucer is above the beam.
 const beamLayer=g(scene,{visibility:'hidden','pointer-events':'none'});
 scene.insertBefore(beamLayer,walkers);
 const beam=path(beamLayer,'M0 0',{fill:'url(#fv-beam)',stroke:cyan,'stroke-width':.55,opacity:0});
 const ring=ellipse(beamLayer,0,0,17,4,{fill:'url(#fv-halo)',stroke:cyan,'stroke-width':.65,opacity:0});
 const craft=g(scene,{visibility:'hidden',style:'cursor:pointer'});
 const saucer=g(craft);
 ellipse(saucer,0,4,33,11,{fill:'url(#fv-halo)'});
 path(saucer,'M-25 0Q-20 -6 0 -7Q20 -6 25 0Q22 7 0 9Q-22 7 -25 0Z',{fill:'#b9c7c7',stroke:dark,'stroke-width':1});
 path(saucer,'M-11 -5Q-9 -17 0 -17Q9 -17 11 -5Z',{fill:'#c8efed',stroke:dark});
 path(saucer,'M-7 -8Q-6 -14 -1 -15 M-23 2Q0 10 23 2',{stroke:cyan});
 for(let x=-18;x<=18;x+=6)circle(saucer,x,4+2*(1-Math.abs(x)/18),1.2,{fill:'#f4e2a2',stroke:'#a58650','stroke-width':.35});
 const title=el('title',{},craft);title.textContent='Tap UFO to start a playful beam lift';
 let event=null,clock=0,next=6,sequence=0,requested=false;
 const ease=u=>smooth(0,1,clamp(u,0,1));
 function release(){
   if(event?.person&&!event.boarded){const p=event.person;p.futureHeld=false;p.g.removeAttribute('opacity');if(event.base)p.g.setAttribute('transform',event.base);}
 }
 function reset(){release();event=null;requested=false;clock=0;next=6;craft.setAttribute('visibility','hidden');beamLayer.setAttribute('visibility','hidden');}
 craft.addEventListener('pointerdown',e=>{if(!active()||reduced.matches)return;e.stopPropagation();requested=true;});
 function begin(){
   const possible=people.filter(p=>p.futureKind==='kimono'&&!p.done&&p.x>65&&p.x<895&&(p.x<260||p.x>700));
   const person=possible.length?possible[Math.floor(Math.random()*possible.length)]:null;
   const abduction=!!person&&(requested||sequence%2===1);
   event={age:0,person:abduction?person:null,x:abduction?person.x:(sequence%2?780:180),base:null,fromX:-55,fromY:77,boarded:false};
   sequence++;requested=false;
   craft.setAttribute('visibility','visible');beamLayer.setAttribute('visibility','visible');
 }
 function updateEvent(t,dt){
   clock+=dt;
   if(!event&&clock>=next)begin();
   if(!event)return;
   const e=event;e.age+=dt;const a=e.age;
   // Ordinary flyover, with alternating close encounters when an adult is available.
   if(!e.person){
     if(requested){const p=people.find(p=>p.futureKind==='kimono'&&!p.done&&p.x>65&&p.x<895&&(p.x<260||p.x>700));if(p){const u=clamp(a/8,0,1);e.person=p;e.x=p.x;e.age=0;e.fromX=-45+(W+90)*u;e.fromY=82+Math.sin(u*Math.PI)*16;requested=false;return;}}
     const u=clamp(a/8,0,1);craft.setAttribute('transform','translate('+f(-45+(W+90)*u)+' '+f(82+Math.sin(u*Math.PI)*16)+') scale(.8)');
     beam.setAttribute('opacity',0);ring.setAttribute('opacity',0);
     if(a>=8){event=null;craft.setAttribute('visibility','hidden');beamLayer.setAttribute('visibility','hidden');next=clock+10;}
     return;
   }
   const p=e.person;
   if(p.done&&!e.boarded){release();event=null;craft.setAttribute('visibility','hidden');beamLayer.setAttribute('visibility','hidden');next=clock+8;return;}
   if(a<2){e.x=p.x;const u=ease(a/2);craft.setAttribute('transform','translate('+f(lerp(e.fromX,e.x,u))+' '+f(lerp(e.fromY,165,u))+')');return;}
   if(!e.base&&!e.boarded){p.futureHeld=true;e.base=p.g.getAttribute('transform')||'';e.x=p.x;}
   const x=e.x,y=165+Math.sin(a*2)*1.2;
   const boarding=ease((a-3)/2.4);
   const lift=boarding*Math.max(0,p.y-(y+8));
   const fade=a<3?ease(a-2):a<5.4?1:1-ease((a-5.4)/.5);
   if(a<5.9){
     craft.setAttribute('transform','translate('+f(x)+' '+f(y)+')');
     const endY=lerp(p.y,y+8,ease((a-5.4)/.5));
     beam.setAttribute('d','M'+f(x-7)+' '+f(y+8)+'L'+f(x-19)+' '+f(endY)+'Q'+f(x)+' '+f(endY+7)+' '+f(x+19)+' '+f(endY)+'L'+f(x+7)+' '+f(y+8)+'Z');
     beam.setAttribute('opacity',f(fade*.9));ring.setAttribute('cx',x);ring.setAttribute('cy',endY);ring.setAttribute('opacity',f(fade));
     if(!e.boarded){
       p.g.setAttribute('transform','translate(0 '+f(-lift)+') '+e.base);
       p.g.setAttribute('opacity',f(1-ease((boarding-.70)/.30)));
       if(a>=5.4){
         // Remove the same live pedestrian and its auxiliary light, not a duplicate.
         e.boarded=true;p.futureHeld=false;p.done=true;p.remove();
         const i=people.indexOf(p);if(i>=0)people.splice(i,1);
       }
     }
   }else{
     if(!e.boarded){e.boarded=true;p.futureHeld=false;p.done=true;p.remove();const i=people.indexOf(p);if(i>=0)people.splice(i,1);}
     const u=ease((a-5.9)/2.1);craft.setAttribute('transform','translate('+f(lerp(x,W+55,u))+' '+f(lerp(y,70,u))+') scale('+f(1-u*.25)+')');
     beam.setAttribute('opacity',0);ring.setAttribute('opacity',0);
     if(a>=8){event=null;craft.setAttribute('visibility','hidden');beamLayer.setAttribute('visibility','hidden');next=clock+14;}
   }
 }
 let wasActive=false;
 return {
   robots,
   draw(t,dt){
     const on=active();
     if(on!==wasActive){reset();wasActive=on;}
     signs.forEach(o=>{o.root.style.display=on?'':'none';o.root.setAttribute('visibility',on?'visible':'hidden');if(on)o.draw(t,dt);});
     robots.forEach(o=>{o.g.style.display=on?'':'none';o.g.setAttribute('visibility',on?'visible':'hidden');if(on)o.draw(t,dt);});
     if(on&&!reduced.matches)updateEvent(t,dt);else if(event)reset();
   }
 };
}
