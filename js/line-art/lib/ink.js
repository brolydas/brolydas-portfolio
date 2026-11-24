const NS = 'http://www.w3.org/2000/svg', PEN = 1.35, PAPER = '#fdfdfc', INK = 'currentColor';
function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (attrs.fill === PAPER) node.classList.add('pp');
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


export function joint(a, b, l1, l2, bend = 1) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const th = Math.atan2(dy, dx);
  const al = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const c1 = [a[0] + l1 * Math.cos(th - al), a[1] + l1 * Math.sin(th - al)];
  const c2 = [a[0] + l1 * Math.cos(th + al), a[1] + l1 * Math.sin(th + al)];
  return (c1[0] - c2[0]) * bend > 0 ? c1 : c2;
}

/** Point `len` away at `deg` from straight down (forward = positive). */
export const hang = (from, len, deg) => {
  const r = (deg * Math.PI) / 180;
  return [from[0] + len * Math.sin(r), from[1] + len * Math.cos(r)];
};

/** Periodic Catmull-Rom through [time, value] keys — the place for keyed or measured poses. */
export function curve(keys, period) {
  return (x) => {
    x = ((x % period) + period) % period;
    const n = keys.length;
    let i = n - 1;
    for (let j = 0; j < n; j++) if (keys[j][0] <= x) i = j;
    const k = (j) => { const w = Math.floor(j / n); const e = keys[((j % n) + n) % n]; return [e[0] + w * period, e[1]]; };
    const p0 = k(i - 1), p1 = k(i), p2 = k(i + 1), p3 = k(i + 2);
    const span = p2[0] - p1[0];
    const u = (x - p1[0]) / span;
    const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0])) * span;
    const m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0])) * span;
    const u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * p1[1] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[1] + (u3 - u2) * m2;
  };
}


export function inkDefs(svg, id = 'ink') {
  if (!svg.style.color) svg.style.color = '#1c1c1c';
  const defs = el('defs', {}, svg);
  const flt = el('filter', { id: `${id}-edge`, x: '-2%', y: '-2%', width: '104%', height: '104%' }, defs);
  el('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.6', numOctaves: 1, seed: 7, result: 'n' }, flt);
  el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 0.45, xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' }, flt);
  el('feGaussianBlur', { in: 'd', stdDeviation: 0.12 }, flt);
  const stripes = el('pattern', { id: `${id}-stripes`, width: 4, height: 2.2, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-12)' }, defs);
  el('rect', { width: 4, height: 2.2, fill: PAPER }, stripes);
  el('rect', { width: 4, height: 1.0, fill: INK }, stripes);
  return { defs, filter: `url(#${id}-edge)`, stripes: `url(#${id}-stripes)` };
}


export { el, pen, shape, blot, limb, f, pt, PEN, PAPER, shoe, place };