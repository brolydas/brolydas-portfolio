// Contact illustration — adapted from JDhruv14/line-art-animation (MIT).
// Upstream gait, open-stroke limb and spring primitives; new portfolio-specific scene.
// See js/line-art-LICENSE.txt for the original copyright and license.
const NS = 'http://www.w3.org/2000/svg', PEN = 1.35, PAPER = 'var(--contact-paper)', INK = 'currentColor';
function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (parent) parent.appendChild(node);
  return node;
}
const f = n => n.toFixed(2);
const pt = p => f(p[0])+' '+f(p[1]);
const pen = (parent, w = PEN) => el('path', {fill:'none',stroke:INK,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'}, parent);
const shape = (parent, w = PEN) => el('path', {fill:PAPER,stroke:INK,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'}, parent);
const blot = parent => el('path',{fill:INK},parent);
const path = (parent,d,w=1,filled=false) => {const p=filled?shape(parent,w):pen(parent,w);p.setAttribute('d',d);return p;};
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const minJerk = (s) => s * s * s * (10 - 15 * s + 6 * s * s);

function knee(hip, ankle, l1, l2) {
  const dx = ankle[0] - hip[0], dy = ankle[1] - hip[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const th = Math.atan2(dy, dx);
  const al = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const c1 = [hip[0] + l1 * Math.cos(th - al), hip[1] + l1 * Math.sin(th - al)];
  const c2 = [hip[0] + l1 * Math.cos(th + al), hip[1] + l1 * Math.sin(th + al)];
  return c1[0] > c2[0] ? c1 : c2; // knees bend forward
}

const GAIT_PRESETS = {
  // natural adult walk, ~2 steps/s
  walk: { period: 1.0, duty: 0.62, stride: 24, lift: 3.4, heelOff: 15, heelKick: 0, thigh: 23, shin: 23, ankleY: 118.4, ground: 120, toe: 4.2 },
  // kimono, tight skirt, geta: shorter stride, very low lift
  shuffle: { period: 0.9, duty: 0.64, stride: 18, lift: 2.4, heelOff: 12, heelKick: 0, thigh: 23, shin: 23, ankleY: 116, ground: 120, toe: 4.2 },
  // child's or adult's run: short ground contact, flight phase, heel kick
  run: { period: 0.5, duty: 0.36, stride: 16, lift: 12, heelOff: 10, heelKick: 3.5, thigh: 13, shin: 13, ankleY: 118, ground: 120, toe: 3 },
};

function gait(opts = {}) {
  const kind = opts.kind ?? 'walk';
  const o = { ...GAIT_PRESETS[kind], ...opts, kind };
  const { period, duty, stride: S, lift, heelOff, heelKick, thigh, shin, ankleY, ground, toe } = o;
  const reach = (thigh + shin) * 0.983; // a planted leg is nearly, not perfectly, straight
  const restHip = ankleY - reach;
  const speed = S / (duty * period);

  const foot = (u) => {
    u = ((u % 1) + 1) % 1;
    if (u < duty) {
      const x = 40 + S / 2 - (S * u) / duty;
      const peel = smooth(duty - 0.14, duty, u);
      const th = (heelOff * peel * Math.PI) / 180;
      const px = x + toe, py = ground, ox = -toe, oy = ankleY - ground; // pivot on the toe, on the ground
      return { ankle: [px + ox * Math.cos(th) - oy * Math.sin(th), py + ox * Math.sin(th) + oy * Math.cos(th)], pitch: heelOff * peel, stance: true };
    }
    const s = (u - duty) / (1 - duty);
    const x = 40 - S / 2 + S * minJerk(s) - heelKick * Math.sin(Math.PI * Math.min(1, s * 1.6));
    const y = ankleY - lift * Math.pow(Math.sin(Math.PI * Math.pow(s, heelKick ? 0.7 : 1)), 1.2);
    return { ankle: [x, y], pitch: heelOff * Math.pow(1 - smooth(0, 0.55, s), 1.4), stance: false };
  };

  return {
    ...o,
    speed,
    pose(phase, go = 1) {
      const raw = [foot(phase), foot(phase + 0.5)];
      if (go < 1) raw.forEach((fo, i) => {
        const rest = 40 + (i ? -2 : 2);
        fo.ankle = [rest + (fo.ankle[0] - rest) * go, ankleY + (fo.ankle[1] - ankleY) * go];
        fo.pitch *= go; fo.stance = true;
      });
      let hipY = restHip;
      const half = (((phase % 0.5) + 0.5) % 0.5);
      if (heelKick && go >= 1) {
        // run: compress over the planted foot, highest mid-flight
        hipY = half < duty ? restHip + 1.4 * Math.sin((Math.PI * half) / duty) : restHip - 2.6 * Math.sin((Math.PI * (half - duty)) / (0.5 - duty));
      } else {
        // walk: lowest at double support, highest as the legs pass
        for (const fo of raw) if (fo.stance) {
          const dx = fo.ankle[0] - 40;
          hipY = Math.max(hipY, fo.ankle[1] - Math.sqrt(Math.max(1, reach * reach - dx * dx)));
        }
      }
      const hip = [40, hipY];
      const feet = raw.map((fo) => ({ ...fo, knee: knee(hip, fo.ankle, thigh, shin) }));
      const front = feet[0].ankle[0] >= feet[1].ankle[0] ? 0 : 1;
      return { hip, feet, front, bob: hipY - restHip };
    },
  };
}

function limb(parent, width, w = PEN) {
  const g = el('g', {}, parent);
  const fill = el('path', { fill: PAPER }, g);
  const a = pen(g, w), b = pen(g, w);
  const half = (width - w) / 2;
  return {
    g,
    draw(joints, endGap = [0.4, 0.9]) {
      const s = joints[0], e = joints[joints.length - 1];
      let c = [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2];
      if (joints.length === 3) { const m = joints[1]; c = [m[0] + 0.55 * (m[0] - c[0]), m[1] + 0.55 * (m[1] - c[1])]; }
      const P = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16, u = 1 - t;
        P.push([u * u * s[0] + 2 * u * t * c[0] + t * t * e[0], u * u * s[1] + 2 * u * t * c[1] + t * t * e[1]]);
      }
      const side = (sgn) => P.map((p, i) => {
        const q = P[Math.min(P.length - 1, i + 1)], o = P[Math.max(0, i - 1)];
        const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1;
        return [p[0] - (dy / l) * half * sgn, p[1] + (dx / l) * half * sgn];
      });
      const L = side(1), R = side(-1);
      fill.setAttribute('d', 'M' + L.map(pt).join('L') + 'L' + R.slice().reverse().map(pt).join('L') + 'Z');
      const cut = (arr, gap) => arr.slice(0, arr.length - Math.round(gap * 2));
      a.setAttribute('d', 'M' + cut(L, endGap[0]).map(pt).join('L'));
      b.setAttribute('d', 'M' + cut(R, endGap[1]).map(pt).join('L'));
    },
  };
}


function spring(stiffness = 40, damping = 6, x = 0) {
  return {
    x, v: 0,
    step(target, dt) { this.v += (stiffness * (target - this.x) - damping * this.v) * dt; this.x += this.v * dt; return this.x; },
    kick(v) { this.v += v; },
  };
}


function shoe(node, ankle, toe=0) {
  const r=toe*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
  const S=(x,y)=>[ankle[0]+x*c-y*s,ankle[1]+x*s+y*c];
  node.setAttribute('d','M'+pt(S(-1.6,-.6))+' L'+pt(S(4.6,-.2))+' Q'+pt(S(6.6,.4))+' '+pt(S(5.6,1.6))+' L'+pt(S(-1.4,1.5))+' Q'+pt(S(-2.2,.5))+' '+pt(S(-1.6,-.6))+'Z');
}
const place=(g,x,y,dir,s)=>g.setAttribute('transform','translate('+f(x)+' '+f(y)+') scale('+f(dir*s)+' '+f(s)+') translate(-40 -120)');
const mix=(a,b,u)=>a+(b-a)*u;

function mountContactScene(section, host) {
  const W=680,H=350,ground=288;
  const svg=el('svg',{viewBox:'0 0 '+W+' '+H,preserveAspectRatio:'xMaxYMid meet','aria-hidden':'true',focusable:'false'},host);
  const scene=el('g',{},svg);
  const distant=el('g',{opacity:.4},scene);
  path(distant,'M10 211 Q49 176 87 203 T168 195 Q211 169 250 196 M392 198 Q430 158 469 182 T568 168 T680 171',.7);
  path(distant,'M12 255 Q69 246 135 255 M162 242 Q195 237 228 242 M576 253 Q624 248 675 253',.7);
  // Open architectural elevation, a little workshop at the meeting point.
  const studio=el('g',{opacity:.78},scene);
  path(studio,'M383 287 L383 150 Q456 147 532 150 L532 287 Z',1.05,true);
  path(studio,'M370 151 Q452 145 544 151 L525 133 Q458 130 389 134Z',1.05,true);
  path(studio,'M386 155 Q456 153 530 155 M390 161 L526 161 M391 147 L398 135 M407 147 L414 134 M424 147 L431 133 M441 147 L448 133 M458 147 L465 133 M475 147 L482 134 M492 147 L499 134 M509 147 L516 135 M526 148 L529 140',.55);
  path(studio,'M395 174 L520 174 L520 195 L395 195Z M400 178 L515 178 M400 191 L515 191',.8,true);
  path(studio,'M400 207 L448 207 L448 263 L400 263Z M406 213 L442 213 L442 257 L406 257Z M424 213 L424 257 M406 235 L442 235',.85,true);
  path(studio,'M460 287 L460 207 L516 207 L516 287 M466 287 L466 214 L510 214 L510 287 M466 245 L510 245 M488 214 L488 245 M503 263 l3 0',.9);
  path(studio,'M395 266 L453 266 M382 277 L399 277 M519 277 L533 277 M381 287 L534 287',.75);
  // The sign is an illustration, not an extra interface label.
  const sign=el('g',{'font-size':8,'font-family':'monospace','letter-spacing':1.7,fill:INK,'text-anchor':'middle'},studio);
  const signText=el('text',{x:457.5,y:187},sign); signText.textContent='OPEN STUDIO';
  const hanging=el('g',{},studio);
  path(hanging,'M543 163 L559 163 L559 174 M552 174 L566 174 L569 190 L549 190Z M553 179 L565 179 M553 187 L565 187',.8,true);
  const lamp=spring(22,4);
  const foliage=[];
  function tree(x,y,scale,variant){
    const tree=el('g',{transform:'translate('+x+' '+y+') scale('+scale+')'},scene);
    path(tree,'M-8 0 Q-5 -32 -3 -67 Q-13 -89 -24 -103 M4 0 Q2 -42 5 -67 Q22 -91 30 -111 M-3 -67 Q0 -96 -5 -126',1.2);
    const crown=el('g',{},tree);
    path(crown,variant?'M-40 -95 Q-63 -112 -47 -133 Q-53 -153 -29 -155 Q-25 -177 -4 -171 Q17 -185 30 -162 Q54 -163 55 -142 Q73 -127 56 -113 Q60 -91 35 -90 Q16 -76 1 -92 Q-21 -79 -40 -95Z':'M-43 -93 Q-61 -108 -46 -125 Q-57 -144 -36 -156 Q-34 -179 -11 -175 Q6 -190 22 -172 Q49 -175 48 -153 Q67 -143 57 -123 Q70 -101 44 -95 Q27 -78 10 -92 Q-12 -76 -26 -94 Q-36 -86 -43 -93Z',.9,true);
    path(crown,'M-39 -124 Q-29 -132 -23 -126 M-14 -149 Q-5 -160 5 -153 M16 -129 Q24 -142 34 -136 M-14 -109 Q-5 -119 4 -115 M27 -105 Q35 -112 43 -110',.62);
    foliage.push({crown,force:spring(18,4),phase:variant?1.7:0});
    path(tree,'M-20 0 Q-8 -4 0 0 Q11 -3 20 0',.7);
  }
  tree(106,ground,1.03,0);tree(610,ground,1.12,1);
  path(scene,'M8 288 Q174 286 333 288 T680 288 M8 299 Q174 297 333 299 T680 299',1);
  for(let x=12;x<W;x+=33)path(scene,'M'+x+' 289 l-2 9',.48);
  // Bench and a small plant: a quiet place to meet.
  const bench=el('g',{opacity:.82},scene);
  path(bench,'M166 258 L222 258 L222 262 L166 262Z M169 263 L169 280 M219 263 L219 280 M170 246 L218 246 L218 253 L170 253Z M172 253 L172 258 M216 253 L216 258',.8,true);
  path(scene,'M349 273 L364 273 L361 287 L352 287Z M357 273 Q343 257 349 254 Q357 252 357 273 M357 273 Q365 248 370 255 Q374 263 357 273',.8,true);

  const walk=gait({kind:'walk'}), figures=[];
  function person(x,dir,scale,style,phase){
    const g=el('g',{},scene), far=limb(g,3.6), legs=[limb(g,4.2),limb(g,4.2)], shoes=[blot(g),blot(g)];
    const coat=shape(g), seam=pen(g,.7), scarf=shape(g,.8), headGroup=el('g',{},g);
    const head=el('ellipse',{cx:42,cy:31.6,rx:4.4,ry:5.4,fill:PAPER,stroke:INK,'stroke-width':1.1},headGroup);
    const hair=shape(headGroup,.8);
    const near=limb(g,3.6), bag=shape(g,.9), handle=pen(g,.8);
    const p={g,far,legs,shoes,coat,seam,scarf,headGroup,head,hair,near,bag,handle,x,dir,scale,style,phase,go:1,gesture:-1,look:spring(50,10),cloth:spring(30,6),arms:[spring(55,9),spring(55,9)]};
    figures.push(p);
  }
  person(195,1,1.14,0,.12);person(555,-1,.99,1,.63);
  let pointer=null,windAim=0,lastPointer=null,wind=spring(20,7),time=0;
  let frame=0,last=0,visible=false,destroyed=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const interactiveTarget=e=>e.target instanceof Element && e.target.closest('a,button,input,textarea,select,label,[role="button"]');
  function coords(e){
    const matrix=svg.getScreenCTM(); if(!matrix)return null;
    const point=svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;
    return point.matrixTransform(matrix.inverse());
  }
  function move(e){
    if(reduced.matches)return;
    pointer=coords(e);
    const now=performance.now();
    if(lastPointer)windAim=clamp(windAim+(e.clientX-lastPointer.x)/Math.max(8,now-lastPointer.t)*.7,-2.4,2.4);
    lastPointer={x:e.clientX,t:now};
  }
  function leave(){pointer=null;lastPointer=null;windAim=0;}
  function click(e){
    if(reduced.matches||interactiveTarget(e)||e.button!==0)return;
    const pos=coords(e);if(!pos||pos.x<0||pos.x>W||pos.y<0||pos.y>H)return;
    const nearest=figures.reduce((a,b)=>Math.abs(a.x-pos.x)<Math.abs(b.x-pos.x)?a:b);
    if(Math.abs(nearest.x-pos.x)<100 && nearest.gesture<0)nearest.gesture=0;
    lamp.kick(2.2);
    foliage.forEach(o=>o.force.kick(pos.x<W/2?1.8:-1.8));
  }
  const ease=t=>smooth(0,1,t);
  function draw(dt){
    time+=dt;
    windAim*=Math.exp(-dt*1.9);
    const breeze=wind.step(windAim+.2*Math.sin(time*.7),dt);
    foliage.forEach(o=>{const a=o.force.step(breeze*3+.65*Math.sin(time+o.phase),dt);o.crown.setAttribute('transform','rotate('+f(a)+' 0 -82)');});
    hanging.setAttribute('transform','rotate('+f(lamp.step(breeze*4,dt))+' 559 163)');
    for(const o of figures){
      let gesture=0;
      if(o.gesture>=0){
        o.gesture+=dt;
        const t=o.gesture;
        gesture=t<.4?ease(t/.4):t<1.25?1:1-ease((t-1.25)/.5);
        if(t>=1.75){o.gesture=-1;gesture=0;}
      }
      o.go=mix(o.go,1-gesture,1-Math.exp(-dt*12));
      const go=reduced.matches?0:o.go;
      o.phase+=dt/walk.period*go;
      o.x+=o.dir*walk.speed*o.scale*dt*go;
      if(o.x>W+45)o.x=-45;
      if(o.x< -45)o.x=W+45;
      place(o.g,o.x,ground,o.dir,o.scale);
      const p=walk.pose(o.phase,go), b=p.bob, sh=[41,41+b];
      p.feet.forEach((foot,j)=>{o.legs[j].draw([p.hip,foot.knee,foot.ankle],[.3,.8]);shoe(o.shoes[j],foot.ankle,foot.pitch);});
      o.g.insertBefore(o.legs[p.front].g,o.coat);o.g.insertBefore(o.shoes[p.front],o.coat);
      const k=p.feet[p.front].knee,a=p.feet[p.front].ankle,fx=Math.max(k[0]+2.4,46.4);
      o.coat.setAttribute('d','M35 '+f(42+b)+' Q40 '+f(39+b)+' 46 '+f(42+b)+' L'+f(fx-.6)+' '+f(69+b)+' Q'+f(fx)+' 80 '+f(Math.max(fx,a[0]-4))+' 88 Q40 90 32 89 L33 '+f(69+b)+'Z');
      o.seam.setAttribute('d','M43 '+f(44+b)+' Q44 '+f(60+b)+' 44 82 M36 72 l6 0');
      const look=pointer&&Math.abs(pointer.x-o.x)<155?clamp((pointer.y-(ground-100*o.scale))*.14,-13,13):0;
      const tilt=o.look.step(look-gesture*9,dt);
      o.headGroup.setAttribute('transform','translate(0 '+f(b)+') rotate('+f(tilt)+' 42 36)');
      o.hair.setAttribute('d',o.style?'M37 31 Q35 22 43 23 Q49 23 47 31 Q44 26 37 31Z':'M35 29 Q38 24 40 23 Q45 21 47 27 L49 29Z');
      const flow=o.cloth.step(-5-o.dir*breeze*3-go*2,dt);
      o.scarf.setAttribute('d','M38 '+f(36+b)+' Q42 '+f(39+b)+' 46 '+f(36+b)+' L46 '+f(39+b)+' Q41 '+f(43+b)+' 38 '+f(40+b)+' Q'+f(34+flow*.5)+' '+f(46+b)+' '+f(37+flow)+' '+f(52+b)+' L'+f(40+flow)+' '+f(53+b)+' Q'+f(37+flow*.5)+' '+f(46+b)+' 41 '+f(41+b)+'Z');
      const legSwing=(p.feet[0].ankle[0]-40)/(walk.stride/2);
      const arms=o.arms.map((s,j)=>s.step((j?1:-1)*legSwing*15*go,dt)*Math.PI/180);
      function arm(which,angle,near){
        const shoulder=[sh[0]+(near?1.5:-1),sh[1]+2];
        let elbow=[shoulder[0]+17*Math.sin(angle),shoulder[1]+17*Math.cos(angle)];
        let hand=[elbow[0]+16*Math.sin(angle+.15),elbow[1]+16*Math.cos(angle+.15)];
        if(near&&gesture>0){
          elbow=[mix(elbow[0],54,gesture),mix(elbow[1],44+b,gesture)];
          hand=[mix(hand[0],48+Math.sin(time*10)*2,gesture),mix(hand[1],26+b,gesture)];
        }
        which.draw([shoulder,elbow,hand],[.2,.5]);return hand;
      }
      const farHand=arm(o.far,arms[0],false);arm(o.near,arms[1],true);
      const [bx,by]=farHand;
      o.bag.setAttribute('d','M'+f(bx-6)+' '+f(by+3)+' L'+f(bx+6)+' '+f(by+3)+' L'+f(bx+6)+' '+f(by+13)+' L'+f(bx-6)+' '+f(by+13)+'Z');
      o.handle.setAttribute('d','M'+f(bx-2)+' '+f(by+3)+' Q'+f(bx)+' '+f(by-1)+' '+f(bx+2)+' '+f(by+3));
    }
  }
  function tick(now){
    frame=0;if(destroyed||!visible||document.hidden||reduced.matches)return;
    draw(last?Math.min((now-last)/1000,1/30):0);last=now;
    frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(frame){cancelAnimationFrame(frame);frame=0;}last=0;
    if(destroyed)return;
    if(reduced.matches){leave();figures.forEach(o=>{o.gesture=-1;o.go=0;});draw(0);return;}
    if(visible&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);sync();});
  observer.observe(section);
  section.addEventListener('pointermove',move,{passive:true});
  section.addEventListener('pointerleave',leave);
  section.addEventListener('pointercancel',leave);
  section.addEventListener('pointerdown',click,{passive:true});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  draw(0);
  const cleanup=()=>{destroyed=true;sync();observer.disconnect();section.removeEventListener('pointermove',move);section.removeEventListener('pointerleave',leave);section.removeEventListener('pointercancel',leave);section.removeEventListener('pointerdown',click);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);};
  addEventListener('pagehide',e=>{if(!e.persisted)cleanup();});
}
const section=document.querySelector('#contact');
const host=section?.querySelector('[data-contact-art]');
if(section&&host)mountContactScene(section,host);
