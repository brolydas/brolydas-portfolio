// A diagonal liquid boundary: black always occupies the upper-right side.
let active = null;
const NS = 'http://www.w3.org/2000/svg';
export function prepareLiquidTransition(next) {
  active?.();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const w = innerWidth, h = innerHeight, scroll = scrollY;
  const layer = document.createElement('div');
  layer.className = 'liquid-transition';
  layer.inert = true;
  layer.setAttribute('aria-hidden', 'true');
  const old = document.createElement('div');
  old.className = document.body.className + ' liquid-snapshot';
  old.style.cssText = `position:absolute;inset:0;overflow:hidden;background:${getComputedStyle(document.documentElement).backgroundColor}`;
  const content = document.createElement('div');
  content.style.cssText = `position:absolute;top:${-scroll}px;left:0;width:${document.documentElement.clientWidth}px`;
  const props = ['color','background-color','border-top-color','border-bottom-color','border-left-color','border-right-color','outline-color','font-size','line-height','letter-spacing','transform','opacity','box-shadow','padding-left','padding-right','padding-top','padding-bottom','margin-left','margin-right','margin-top','margin-bottom','width','height','max-width','min-height'];
  for (const original of document.body.children) {
    if (['SCRIPT','DIALOG'].includes(original.tagName) || original.classList.contains('liquid-transition')) continue;
    const copy = original.cloneNode(true);
    const sources = [original,...original.querySelectorAll('*')];
    const copies = [copy,...copy.querySelectorAll('*')];
    sources.forEach((source,i) => {
      const target = copies[i], style = getComputedStyle(source);
      props.forEach(p => target.style.setProperty(p,style.getPropertyValue(p)));
      target.style.animation = 'none'; target.style.transition = 'none';
      target.removeAttribute('id');
      // These are a visual snapshot, never live controls or query targets.
      [...target.attributes].filter(a=>a.name.startsWith('data-')).forEach(a=>target.removeAttribute(a.name));
      if (source instanceof HTMLCanvasElement) {
        try { target.getContext('2d')?.drawImage(source,0,0); } catch {}
      }
    });
    if (getComputedStyle(original).position === 'fixed') old.append(copy);
    else content.append(copy);
  }
  old.append(content);layer.append(old);
  const svg = document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;overflow:visible';
  const id='liquid-mask-'+Math.random().toString(36).slice(2);
  svg.innerHTML=`<defs><clipPath id="${id}" clipPathUnits="userSpaceOnUse"><path/></clipPath></defs><path class="liquid-edge" fill="none" stroke="#050404" stroke-linecap="round" stroke-width="5"/><g fill="#050404"></g>`;
  const mask=svg.querySelector('clipPath path'), edge=svg.querySelector('.liquid-edge'), particles=svg.querySelector('g');
  const drops=Array.from({length:26},()=>{const c=document.createElementNS(NS,'ellipse');particles.append(c);return c;});
  const tendrils=Array.from({length:11},()=>{const p=document.createElementNS(NS,'path');particles.append(p);return p;});
  old.style.clipPath=`url(#${id})`;layer.append(svg);
  let raf=0, finished=false;
  const finish=()=>{if(finished)return;finished=true;cancelAnimationFrame(raf);layer.remove();document.documentElement.classList.remove('liquid-running');if(active===finish)active=null;};
  return () => {
    document.body.append(layer);document.documentElement.classList.add('liquid-running');active=finish;
    const start=performance.now(), duration=2100;
    const draw=now=>{
      const t=Math.min(1,(now-start)/duration);
      const eased=t*t*(3-2*t);
      const threshold=next==='intelligence' ? -.42+2.84*eased : 2.42-2.84*eased;
      const amp=Math.sin(Math.PI*t)*Math.min(w*.08,95);
      const boundary=y=>w*(threshold-1+y/h)+amp*(.55*Math.sin(y/h*13+t*6)+.3*Math.sin(y/h*31-t*9)+.15*Math.sin(y/h*57+t*5));
      const points=[];for(let y=-h*.3;y<=h*1.3;y+=h/120)points.push([boundary(y),y]);
      const line=points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
      const side=next==='intelligence'?w*5:-w*5;
      mask.setAttribute('d',`${line} L${side},${h*1.4} L${side},${-h*.4} Z`);
      edge.setAttribute('d',line);
      tendrils.forEach((p,i)=>{
        const y=((i*.61803398875+.1)%1)*h, x=boundary(y);
        const reach=amp*(.7+.8*Math.sin(i*4+t*7)**2), thickness=amp*.12;
        const bend=Math.sin(i*3+t*8)*reach*.4;
        p.setAttribute('d',`M${x+8},${y-thickness} C${x-reach*.4},${y-thickness} ${x-reach*.65},${y+bend-15} ${x-reach},${y+bend} C${x-reach*.45},${y+bend-5} ${x-reach*.3},${y+thickness} ${x+12},${y+thickness}Z`);
      });
      drops.forEach((drop,i)=>{
        const y=((i*.61803398875)%1)*h;
        const phase=(t*2+i*.173)%1;
        const distance=(18+phase*100)*Math.sin(Math.PI*t);
        const x=boundary(y)-distance;
        const r=(2+(i%5)*1.2)*Math.sin(Math.PI*phase)*Math.sin(Math.PI*t);
        drop.setAttribute('cx',x);drop.setAttribute('cy',y+Math.sin(i+t*9)*12);
        drop.setAttribute('rx',Math.max(0,r*2.4));drop.setAttribute('ry',Math.max(0,r*.65));
        drop.setAttribute('transform',`rotate(-32 ${x} ${y})`);
      });
      if(t<1)raf=requestAnimationFrame(draw);else finish();
    };
    draw(start);
    addEventListener('resize',finish,{once:true});
    setTimeout(finish,duration+300);
  };
}
export function cancelLiquidTransition(){active?.();}

