(()=>{'use strict';
const section=document.querySelector('.lab-cinematic'),stage=document.querySelector('[data-cinematic]'),canvas=document.querySelector('#lab-dust');if(!section||!stage||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),pause=stage.querySelector('.cinematic-pause'),cards=[...stage.querySelectorAll('.cinematic-card')],bar=stage.querySelector('.cinematic-progress i');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
let seed=4127;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const N=3600,points=[];for(let i=0;i<N;i++){const a=rand()*Math.PI*2,b=rand()*2-1,r=.45+Math.pow(rand(),.65)*1.8,v=Math.sqrt(1-b*b),phase=rand()*Math.PI*2;points.push({x:r*v*Math.cos(a),y:r*b,z:r*v*Math.sin(a),a,phase,j:rand(),size:.4+rand()*1.35,band:i%3});}
let w=0,h=0,dpr=1,frame=0,visible=false,paused=reduce.matches,target=0,p=0,px=0,py=0,tx=0,ty=0,mx=-999,my=-999,last=0,clock=0,dirty=true,theme=document.documentElement.dataset.labTheme;
function resize(){const r=stage.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;ensure();}
function scroll(){const r=section.getBoundingClientRect(),s=stage.getBoundingClientRect(),top=parseFloat(getComputedStyle(stage).top)||0;target=clamp((top-r.top)/Math.max(1,r.height-s.height));if(reduce.matches||paused)p=target;dirty=true;ensure();}
function pointer(e){if(paused||e.pointerType==='touch')return;const r=stage.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;tx=(mx/w-.5)*2;ty=(my/h-.5)*2;ensure();}
function leave(){tx=ty=0;mx=my=-999;dirty=true;ensure();}
function draw(){if(!w||!h)return;ctx.clearRect(0,0,w,h);const light=theme==='light',mobile=w<690,centerX=w*(mobile?.64:.73),centerY=h*(mobile?.57:.48),scale=Math.min(w*(mobile?.29:.23),h*.36),morph=smooth(p*2.15),spread=smooth((p-.53)*2.15),zoom=1+1.25*smooth(p*1.7)-.38*spread,ry=clock*.075+px*.26+p*.92,rx=py*.19+.12;const cy=Math.cos(ry),sy=Math.sin(ry),cx=Math.cos(rx),sx=Math.sin(rx);const count=mobile?2200:N;
const glow=ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,Math.max(w,h)*.56);glow.addColorStop(0,light?'rgba(86,124,68,.12)':'rgba(140,190,109,.15)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
for(let i=0;i<count;i++){const q=points[i],a=q.a+clock*.035,ring=1.05+q.j*.28;let x=mix(q.x,Math.cos(a)*ring,morph),y=mix(q.y,Math.sin(a)*ring,morph),z=mix(q.z,(q.band-1)*.52+.22*Math.sin(a*3+q.phase),morph);x+=spread*(q.band-1)*.66;y+=spread*Math.sin(q.phase)*.4;z+=Math.sin(clock*.6+q.phase)*.035;const X=x*cy+z*sy,Z=-x*sy+z*cy,Y=y*cx-Z*sx,depth=y*sx+Z*cx;const k=4.2/(4.2-depth),xx=centerX+X*scale*k*zoom,yy=centerY+Y*scale*k*zoom;let dx=xx-mx,dy=yy-my,dist=Math.hypot(dx,dy),force=!paused&&dist<128?(1-dist/128)**2*40:0;const size=clamp(q.size*k*(.68+zoom*.24),.5,2.8);const alpha=clamp((.24+q.j*.45)*k*(1-.38*spread),.08,.8);ctx.fillStyle=light?(q.band===0?'#476749':'#708873'):(q.band===0?'#d6f477':q.band===1?'#9ebda5':'#e5eadf');ctx.globalAlpha=alpha;ctx.fillRect(xx+(dist>0?dx/dist*force:0),yy+(dist>0?dy/dist*force:0),size,size);}
ctx.globalAlpha=1;
}
function compose(){
 const entry=smooth((p-.12)*2.8),fan=smooth((p-.48)*2.15),mobile=w<690;
 const stackWidth=w*(mobile?.88:.49),spacing=mix(mobile?9:23,stackWidth*.345,fan);
 for(let i=0;i<cards.length;i++){
  const offset=1-i,depth=-offset*68*entry*(1-fan);
  // Fade only on entrance. Once revealed, each card is fully opaque.
  const opacity=smooth((p-.12-i*.035)*8);
  cards[i].style.opacity=String(opacity);
  cards[i].style.setProperty('--fan',String(fan));
  cards[i].style.width=mix(mobile?43:65,31.5,fan)+'%';
  cards[i].style.height=mix(mobile?88:90,mobile?86:69,fan)+'%';
  cards[i].style.transform='translate(-50%,-50%) translate3d('+(offset*spacing+px*5*(1-fan))+'px,'+(-offset*mix(mobile?7:18,mobile?2:7,fan)+py*5*(1-fan))+'px,'+depth+'px) rotateY('+mix(-22+px*5,-3,fan)+'deg) rotateX('+mix(10+py*4,2,fan)+'deg) rotateZ('+(offset*mix(8,2,fan))+'deg) scale('+mix(.74+entry*.26,1,fan)+')';
 }
 bar.style.transform='scaleX('+p+')';const idx=p<.28?0:p<.72?1:2;stage.dataset.scrollPhase=String(idx);
}
function ensure(){if(visible&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
function tick(now){frame=0;if(!visible||document.hidden)return;const dt=last?Math.min(.05,(now-last)/1000):.016;last=now;if(!paused){clock+=dt;const a=1-Math.exp(-dt*7);p=mix(p,target,a);px=mix(px,tx,a);py=mix(py,ty,a);}else{p=target;px=py=0;}draw();compose();dirty=false;if(!paused)ensure();else last=0;}
function setPause(v){paused=v;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume motion':'Pause motion';pause.setAttribute('aria-label',paused?'Resume particle animation':'Pause particle animation');leave();if(paused){p=target;dirty=true;}ensure();}
pause.addEventListener('click',()=>setPause(!paused));reduce.addEventListener('change',e=>setPause(e.matches));stage.addEventListener('pointermove',pointer,{passive:true});stage.addEventListener('pointerleave',leave);window.addEventListener('scroll',scroll,{passive:true});const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;last=0;if(visible){scroll();ensure();}else if(frame){cancelAnimationFrame(frame);frame=0;}});io.observe(stage);const ro=new ResizeObserver(resize);ro.observe(stage);new MutationObserver(()=>{theme=document.documentElement.dataset.labTheme;dirty=true;ensure();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-lab-theme']});document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;}else ensure();});resize();scroll();setPause(paused);
})();