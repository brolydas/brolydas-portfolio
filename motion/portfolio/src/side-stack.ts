import {animate,scroll} from 'motion';
let mounted=false;
export function mountSideStack(){
 if(mounted)return;mounted=true;
 const story=document.querySelector<HTMLElement>('#side-stack-story');if(!story)return;
 const stage=story.querySelector<HTMLElement>('.side-stack-stage')!;
 const panels=[...story.querySelectorAll<HTMLElement>('[data-side-sheet]')];
 const media=matchMedia('(min-width: 901px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)');
 let dispose:(()=>void)|undefined;
 function setup(){dispose?.();dispose=undefined;if(!media.matches)return;
 story.classList.add('side-stack-enhanced');story.dataset.engine='motion';
 let current=0,animation:any,active=true;
 const clamp=(n:number)=>Math.max(0,Math.min(1,n));
 function paint(p:number){current=p;story.dataset.progress=p.toFixed(4);
 panels.forEach((panel,i)=>{if(i===0)return;const phase=clamp(p*4.8-(i-1)-.16),q=phase*phase*(3-2*phase);const x=(i%2?1:-1)*(1-q)*Math.min(230,stage.clientWidth*.18),y=(1-q)*(stage.clientHeight+150)+i*12,angle=(i%2?-1:1)*(1-q)*5;
 panel.style.transform='translate3d('+x+'px,'+y+'px,0) rotate('+angle+'deg)';panel.dataset.phase=q.toFixed(4);});
 }
 paint(0);
 const cancelScroll=scroll(p=>{animation?.stop();animation=animate(current,p,{duration:.14,ease:'easeOut',onUpdate:paint});},{target:story,offset:['start start','end end']});
 const handlers=panels.map((panel,i)=>{const onFocus=()=>{if(i===0)return;const pos=story.getBoundingClientRect().top+scrollY;window.scrollTo({top:pos+(story.offsetHeight-innerHeight)*Math.min(.98,(i+.18)/4.8),behavior:'instant'});};panel.addEventListener('focusin',onFocus);return()=>panel.removeEventListener('focusin',onFocus);});
 const anchor=(e:MouseEvent)=>{const a=(e.target as Element)?.closest('a[href="#about"]');if(a){e.preventDefault();const pos=story.getBoundingClientRect().top+scrollY;window.scrollTo({top:pos+(story.offsetHeight-innerHeight)*.26,behavior:'smooth'});}};
 document.addEventListener('click',anchor);
 const springs=panels.slice(2).map(panel=>{const content=panel.querySelector<HTMLElement>('.side-sheet-content')!;let control:any;
 const move=(e:PointerEvent)=>{if(e.pointerType==='touch')return;const r=panel.getBoundingClientRect();control?.stop();control=animate(content,{rotateZ:Math.max(-1.5,Math.min(1.5,((e.clientX-r.left)/r.width-.5)*3)),y:-4},{duration:.2});panel.dataset.spring='active';};
 const reset=()=>{control?.stop();control=animate(content,{rotateZ:0,y:0},{type:'spring',stiffness:190,damping:22,onComplete:()=>{panel.dataset.spring='rest';}});};
 panel.addEventListener('pointermove',move);panel.addEventListener('pointerleave',reset);return()=>{control?.stop();panel.removeEventListener('pointermove',move);panel.removeEventListener('pointerleave',reset);content.style.transform='';panel.dataset.spring='rest';};});
 dispose=()=>{active=false;animation?.stop();cancelScroll();handlers.forEach(fn=>fn());springs.forEach(fn=>fn());document.removeEventListener('click',anchor);story.classList.remove('side-stack-enhanced');delete story.dataset.engine;delete story.dataset.progress;panels.forEach(p=>{p.style.transform='';delete p.dataset.phase;});};
 }
 setup();media.addEventListener('change',setup);addEventListener('pagehide',e=>{if(!e.persisted){dispose?.();media.removeEventListener('change',setup);}},{once:true});
}
