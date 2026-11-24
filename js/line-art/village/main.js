// Ink village — a Japanese street from dawn to night, drawn in pen.
// Drag the sun or moon to change the time; move the pointer to make wind;
// click people, windows, lanterns, the fūrin, the cat, the birds, the water.
import { el, inkDefs, f } from '../lib/ink.js';
import { W, H, LANE, WATER, rnd, pick, clamp, lerp, smooth, rgb, hex, mix } from './kit.js';
import { createSky, palette as basePalette } from './sky.js';
import { buildStreet } from './houses.js';
import { buildCanal } from './canal.js';
import { createKimono, createCyclist, createKid, createBoat } from './people.js';
import { createCat, createSparrows, createSwallows, createPetals, createSmoke } from './critters.js';
import {createFutureVillage} from './future.js?v=1';

const section=document.querySelector('#contact'),host=section.querySelector('[data-contact-art]'),card=section;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const modeTau=()=>document.documentElement.dataset.mode==='intelligence' ? .58 : .90;
function palette(tau){
 const P=basePalette(tau),dark=document.documentElement.dataset.mode!=='intelligence';
 return {...P,top:dark?[0,0,0]:[255,255,255],bot:dark?[0,0,0]:[255,255,255],paper:dark?[7,7,7]:[255,255,255],ink:dark?[241,237,224]:[24,24,24],inkT:dark?1:0,lamp:dark?1:0,night:dark?1:0,sunset:0};
}
function run(draw){
 let id=0,last=0,t=0,visible=false;
 function frame(now){id=0;if(!visible||document.hidden||reduced.matches)return;const dt=last?Math.min((now-last)/1000,.033):1/60;last=now;t+=dt;draw(t,dt);id=requestAnimationFrame(frame);}
 function sync(){if(id)cancelAnimationFrame(id);id=0;last=0;if(visible&&!document.hidden&&!reduced.matches)id=requestAnimationFrame(frame);}
 const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);sync();});observer.observe(section);
 const refresh=()=>{draw(t,0);sync();};
 document.addEventListener('portfolio:mode',refresh);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',refresh);
 draw(0,0);
 addEventListener('pagehide',e=>{if(!e.persisted){observer.disconnect();if(id)cancelAnimationFrame(id);document.removeEventListener('portfolio:mode',refresh);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',refresh);}});
}
const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'village', 'aria-hidden':'true', focusable:'false' });
const ink = inkDefs(svg, 'v');
host.appendChild(svg);
const defs = ink.defs;
const grad = (id, stops, attrs = {}) => { const g = el(attrs.radial ? 'radialGradient' : 'linearGradient', attrs.radial ? { id } : { id, x1: attrs.x1 ?? 0, y1: 0, x2: attrs.x2 ?? 1, y2: 0 }, defs); stops.forEach(([o, c, a]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, g)); };
grad('v-beamR', [[0, '#fff1c2', 0.55], [1, '#fff1c2', 0]]);
grad('v-beamL', [[0, '#fff1c2', 0], [1, '#fff1c2', 0.55]]);
grad('v-cateye', [[0, '#e8ff9a', 1], [1, '#c8ff6a', 0]], { radial: true });

const layer = (parent = svg, attrs = {}) => el('g', attrs, parent);
const skyL = layer();
const scene = layer(svg, { filter: ink.filter });
const back = layer(scene), birdsL = layer(scene), ground = layer(scene), houses = layer(scene), front = layer(scene);
const catL = layer(scene), walkers = layer(scene), canalL = layer(scene), boatL = layer(scene), willowL = layer(scene), petalL = layer(scene, { style: 'pointer-events:none' });
const glow = layer(svg, { style: 'mix-blend-mode:screen;pointer-events:none' });

// ------------------------------------------------------------------ time
let tau=modeTau();
const LIFE=1,TRAFFIC=1;

// ------------------------------------------------------------------ wind from the pointer
let wind = 0.3, windTarget = 0.3, lastX = null, lastT = 0;
section.addEventListener('pointermove', (e) => {
  const now = performance.now();
  if (lastX !== null && !svg.classList.contains('scrubbing')) windTarget = clamp(windTarget + ((e.clientX - lastX) / Math.max(8, now - lastT)) * 0.8, -2.4, 2.4);
  lastX = e.clientX; lastT = now;
});
const on = (node, fn) => node.addEventListener('pointerdown', (e) => { if(reduced.matches)return; e.stopPropagation(); fn(e); });
const toSvg = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };

// ------------------------------------------------------------------ world
const sky = createSky(svg, skyL, defs, {
  onScrub: () => {},
  onShoot: () => palette(tau).night > 0.4,
});
const street = buildStreet({ back, houses, front, glow }, defs);
const canal = buildCanal({ ground, canalL, willowL, glow }, defs);
const smoke = createSmoke(back, street.chimney);
const sparrows = createSparrows(birdsL, { wireY: street.wireY });
const swallows = createSwallows(birdsL);
const petals = createPetals(petalL, { blossoms: street.blossoms, canal });
const cat = createCat(catL, glow, { x: 548, y: 330 });
const boat = createBoat(boatL, glow, { onRipple: (x, y) => canal.ring(x, y, 2) });

// reflections in the water under every light source
street.windows.forEach((w) => canal.addRefl(() => w.lit, (w.x0 + w.x1) / 2, Math.min(40, (w.x1 - w.x0) * 0.8)));
street.lanterns.forEach((l) => canal.addRefl(() => smooth(l.thr, l.thr + 0.2, P.lamp), l.x, 8));
canal.addRefl(() => smooth(0.2, 0.45, P.lamp), 446, 14);

// interactions on the scenery
street.lanterns.forEach((l) => { l.grp.style.cursor = 'pointer'; on(l.grp, () => l.poke()); });
street.norens.forEach((n) => { n.grp.style.cursor = 'pointer'; on(n.grp, () => n.poke()); });
const hits = layer(scene);
const hitPath = (d, title, fn) => { const n = el('path', { d, fill: 'transparent', style: 'cursor:pointer' }, hits); el('title', {}, n).textContent = title; on(n, fn); return n; };
hitPath(street.shoji.hit, 'Knock on the window', () => street.shoji.poke());
hitPath('M402 202 L422 202 L422 236 L402 236Z', 'Ring the wind chime', () => street.furin.poke());
let shake = 0;
street.canopy.style.cursor = 'pointer';
on(street.canopy, () => { shake = 1; petals.burst(46); });
on(sparrows.hit, () => sparrows.flush());
on(cat.hit, () => cat.poke());
on(boat.g, () => boat.poke());
willowL.style.cursor = 'pointer';
on(willowL, () => canal.willowPoke());
const waterHit = el('rect', { x: 0, y: WATER, width: W, height: H - WATER, fill: 'transparent', style: 'cursor:pointer' }, canalL);
on(waterHit, (e) => { const p = toSvg(e); canal.poke(p.x, p.y); });
canalL.insertBefore(waterHit, canalL.children[2] || null);

// ------------------------------------------------------------------ villagers
const people = [];
const spawn = { kimono: 0, bike: 7, kid: 4 };
function addPerson(kind, x) {
  const dir = Math.random() < 0.5 ? 1 : -1;
  const sx = x ?? (dir > 0 ? -60 : W + 60);
  let p;
  if (kind === 'kimono') p = createKimono(walkers, glow, { dir, x: sx, y: LANE.back + rnd(-1, 1), lantern: P.lamp > 0.5 });
  if (kind === 'bike') p = createCyclist(walkers, glow, { dir, x: sx, y: LANE.front + rnd(-1, 1) });
  if (kind === 'kid') p = createKid(walkers, glow, { dir, x: sx, y: LANE.mid + rnd(-1, 1) });
  on(p.g, () => { p.poke(); if (p.kind === 'bike') setTimeout(() => sparrows.flush(), 150); });
  p.futureKind=kind;people.push(p);
}

const future=createFutureVillage({svg,defs,scene,walkers,buildings:street.buildings,people,reduced});
// ------------------------------------------------------------------ hud

// ------------------------------------------------------------------ frame
let P = palette(tau);
let started = false;
run((t, dt) => {
  dt=dt||0;
  tau=modeTau();
  P = palette(tau);
  svg.style.color = rgb(P.ink);
  svg.style.setProperty('--paper', rgb(P.paper));
  card.style.setProperty('--ink', rgb(P.ink));

  windTarget = lerp(windTarget, 0.3 + 0.25 * Math.sin(t * 0.21) + 0.15 * Math.sin(t * 0.67), 0.012);
  wind = lerp(wind, windTarget, 0.05);

  sky.draw(tau, t, dt, P, wind);
  street.applyRed(P);
  const sinceDusk = (tau - 0.75 + 1) % 1;
  street.windows.forEach((w) => {
    let lit = smooth(w.thr, w.thr + 0.25, P.lamp);
    if (w.lateOff < 9 && sinceDusk > w.lateOff - 0.75 && sinceDusk < 0.5) lit = 0;
    w.lit = dt===0?lit:lerp(w.lit,lit,.08);
    w.n.style.fill = rgb(mix(P.paper, mix(hex('#ffd58a'), hex('#f0a24e'), w.warmth), w.lit * 0.92));
    w.glow.setAttribute('opacity', f(w.lit * 0.8));
  });
  const L = street.lamp, lampOn = smooth(0.2, 0.45, P.lamp);
  L.node.style.fill = rgb(mix(P.paper, hex('#fff1c9'), lampOn));
  L.cone.setAttribute('opacity', f(lampOn * 0.75));
  L.glow.setAttribute('opacity', f(lampOn));

  street.norens.forEach((n) => n.draw(t, dt, wind, tau, P));
  street.lanterns.forEach((l) => l.draw(t, dt, wind, P));
  street.furin.draw(t, dt, wind);
  street.shoji.draw(t, dt, P);
  shake = Math.max(0, shake - dt * 1.5);
  street.canopy.setAttribute('transform', `translate(${f(Math.sin(t * 40) * shake * 2.4 + wind * 0.9)} ${f(Math.cos(t * 31) * shake * 1.2)})`);

  smoke.draw(t, dt, P, wind, tau);
  sparrows.draw(t, dt, P);
  swallows.draw(t, dt, P);
  petals.draw(t, dt, P, wind);
  cat.draw(t, dt, P);
  canal.draw(t, dt, P, wind, null, tau, lampOn);
  boat.draw(t, dt * LIFE, P, wind);

  // villagers: spawn on their own schedules, draw back-to-front
  if (!started) { started = true; addPerson('kimono', 150); addPerson('kimono', 730); addPerson('bike', 560); addPerson('kid', 420); }
  const dayish = tau > 0.28 && tau < 0.72, lateNight = tau > 0.96 || tau < 0.22;
  for (const k in spawn) {
    spawn[k] -= dt * TRAFFIC;
    if (spawn[k] < 0) {
      if (k === 'kimono') { spawn[k] = rnd(10, 18); if (!lateNight || Math.random() < 0.3) addPerson('kimono'); }
      if (k === 'bike') { spawn[k] = rnd(9, 16); if (!lateNight) addPerson('bike'); }
      if (k === 'kid') { spawn[k] = rnd(14, 24); if (dayish) addPerson('kid'); }
    }
  }
  for (let i = people.length - 1; i >= 0; i--) { const p = people[i]; if(!p.futureHeld)p.draw(t, dt * LIFE, P, wind); if (p.done) { p.remove(); people.splice(i, 1); } else if (p.ringing && Math.random() < dt * 4) sparrows.flush(); }
  future.draw(t,dt);
  [...people,...future.robots].sort((a,b)=>a.y-b.y).forEach(p=>walkers.appendChild(p.g));

});

