/* Pointer-led image planes. No scroll reveals; reduced motion keeps a still composition. */
(()=>{const hero=document.querySelector('.home-page .hero');if(!hero)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,nextX=0,nextY=0;
function paint(){frame=0;hero.style.setProperty('--hero-x',nextX+'px');hero.style.setProperty('--hero-y',nextY+'px');}
function reset(){nextX=nextY=0;if(!frame)frame=requestAnimationFrame(paint);}
hero.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();nextX=(e.clientX-r.left-r.width/2)*.018;nextY=(e.clientY-r.top-r.height/2)*.018;if(!frame)frame=requestAnimationFrame(paint);},{passive:true});
hero.addEventListener('pointerleave',reset);reduce.addEventListener('change',reset);
addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame);});
})();