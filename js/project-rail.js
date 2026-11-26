import {escapeHTML as esc} from './projects.js';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const groups={design:[['all','All projects'],['interface','Interfaces'],['motion','Motion'],['play','Play']],intelligence:[['all','All projects'],['retrieval','Retrieval'],['vision','Vision'],['systems','Systems']]};
function category(p,mode){if(mode==='design')return p.id==='games'?'play':p.id==='scroll'?'motion':'interface';return ['rag','semantic','research','multimodal'].includes(p.id)?'retrieval':['vision','sudoku'].includes(p.id)?'vision':'systems';}
export function renderProjectRail(root,projects,mode){
 root._dispose?.();let disposed=false,cleanup=[],index=0,list=projects;
 root.classList.add('project-gallery');
 root.innerHTML='<div class="project-filters" role="group" aria-label="Filter selected work">'+groups[mode].map(([id,title])=>'<button type="button" data-project-filter="'+id+'" aria-pressed="'+(id==='all')+'">'+title+'</button>').join('')+'</div><div class="project-rail" tabindex="0" role="region" aria-label="Project gallery. Use Left and Right to browse."></div><div class="project-rail-controls"><button type="button" data-rail-prev>Previous</button><div class="project-browse"><span>Browse projects</span><sakuga-slider value="0" min="0" max="100" step="1" unit="%" label="Browse projects" name="project-position"></sakuga-slider></div><button type="button" data-rail-next>Next</button><p class="sr-only" aria-live="polite" data-rail-status></p></div>';
 const rail=root.querySelector('.project-rail'),slider=root.querySelector('sakuga-slider'),prev=root.querySelector('[data-rail-prev]'),next=root.querySelector('[data-rail-next]'),status=root.querySelector('[data-rail-status]');
 function selected(){const max=rail.scrollWidth-rail.clientWidth;index=max>1?Math.max(0,Math.min(list.length-1,Math.round(rail.scrollLeft/max*(list.length-1)))):0;slider.value=max>1?Math.round(rail.scrollLeft/max*100):0;slider.disabled=max<1;prev.disabled=index===0||max<1;next.disabled=index===list.length-1||max<1;status.textContent=list[index]?.title||'No projects';}
 function go(i){const card=rail.children[Math.max(0,Math.min(list.length-1,i))];if(card)rail.scrollTo({left:(rail.scrollWidth-rail.clientWidth)*Math.max(0,Math.min(list.length-1,i))/Math.max(1,list.length-1),behavior:reduce.matches?'instant':'smooth'});}
 function draw(){cleanup.forEach(fn=>fn());cleanup=[];rail.innerHTML=list.map(p=>'<article class="feature project-tile" data-project-id="'+esc(p.id)+'"><a class="project-cover" href="/work.html?mode='+mode+'&project='+esc(p.id)+'#project-index" aria-label="Read about '+esc(p.title)+'">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.title)+' project preview" loading="lazy" decoding="async">':'<div class="project-system" aria-hidden="true"><strong>'+esc(p.title)+'</strong>'+p.diagram.map((n,i)=>'<span style="--step:'+i+'">'+esc(n)+'</span>').join('')+'</div>')+'<canvas class="pixel-trace" aria-hidden="true"></canvas><span class="project-name">'+esc(p.title)+'</span></a><div class="project-summary"><h3>'+esc(p.kind)+'</h3><p>'+esc(p.description)+'</p></div></article>').join('');rail.scrollLeft=0;index=0;rail.querySelectorAll('.project-cover').forEach(cover=>cleanup.push(attachPixels(cover)));selected();}
 root.querySelectorAll('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{root.querySelectorAll('[data-project-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));list=projects.filter(p=>button.dataset.projectFilter==='all'||category(p,mode)===button.dataset.projectFilter);draw();}));
 slider.addEventListener('input',()=>{rail.scrollTo({left:(rail.scrollWidth-rail.clientWidth)*(+slider.value/100),behavior:'instant'});});prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));rail.addEventListener('scroll',selected,{passive:true});
 rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1));}if(e.key==='Home'||e.key==='End'){e.preventDefault();go(e.key==='Home'?0:list.length-1);}});
 let pointer=null,dragged=false;
 rail.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,left:rail.scrollLeft};dragged=false;});
 const move=e=>{if(!pointer||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.x;if(Math.abs(dx)>6){dragged=true;rail.classList.add('is-dragging');rail.scrollLeft=pointer.left-dx;e.preventDefault();}};
 const release=()=>{pointer=null;rail.classList.remove('is-dragging');setTimeout(()=>{dragged=false;},0);};
 rail.addEventListener('pointermove',move);window.addEventListener('pointerup',release);
 rail.addEventListener('click',e=>{if(dragged){e.preventDefault();dragged=false;}},true);
 rail.addEventListener('dragstart',e=>e.preventDefault());
 const ro=new ResizeObserver(selected);ro.observe(rail);draw();
 root._dispose=()=>{disposed=true;cleanup.forEach(fn=>fn());ro.disconnect();window.removeEventListener('pointerup',release);};
}
function attachPixels(cover){
 const canvas=cover.querySelector('canvas'),image=cover.querySelector('img'),context=canvas.getContext('2d');let frame=0,until=0,px=.5,py=.5;
 if(!context)return()=>{};
 function clear(){if(frame)cancelAnimationFrame(frame);frame=0;context?.clearRect(0,0,canvas.width,canvas.height);delete cover.dataset.pixelActive;}
 function paint(now){frame=0;if(reduce.matches||now>until||document.hidden||!cover.isConnected){clear();return;}const box=cover.getBoundingClientRect();canvas.width=Math.round(box.width);canvas.height=Math.round(box.height);const w=canvas.width,h=canvas.height,size=Math.max(13,Math.round(w/16)),fade=Math.min(1,(until-now)/180);
 context.clearRect(0,0,w,h);context.imageSmoothingEnabled=false;
 if(image?.complete&&image.naturalWidth){const iw=image.naturalWidth,ih=image.naturalHeight,scale=Math.max(w/iw,h/ih),ox=(iw-w/scale)/2,oy=0;for(let i=0;i<35;i++){const x=Math.floor((px*w+(Math.random()-.5)*w*.72)/size)*size,y=Math.floor((py*h+(Math.random()-.5)*h*.52)/size)*size;if(x<0||y<0||x+size>w||y+size>h)continue;context.globalAlpha=fade;context.drawImage(image,ox+x/scale,oy+y/scale,size/scale,size/scale,x+(i%3-1)*size*.35,y,size,size);}}
 else{context.fillStyle=getComputedStyle(cover).color;context.globalAlpha=.15*fade;for(let i=0;i<18;i++)context.fillRect(Math.round((px*w+(Math.random()-.5)*w*.6)/size)*size,Math.round((py*h+(Math.random()-.5)*h*.5)/size)*size,size,size);}
 cover.dataset.pixelActive='true';frame=requestAnimationFrame(paint);
 }
 function pulse(e){if(reduce.matches||e?.pointerType==='touch')return;const r=cover.getBoundingClientRect();if(e?.clientX){px=(e.clientX-r.left)/r.width;py=(e.clientY-r.top)/r.height;}until=performance.now()+430;if(!frame)frame=requestAnimationFrame(paint);}
 cover.addEventListener('pointermove',pulse);cover.addEventListener('pointerenter',pulse);cover.addEventListener('focus',pulse);cover.addEventListener('pointerleave',clear);cover.addEventListener('blur',clear);reduce.addEventListener('change',clear);
 return()=>{clear();reduce.removeEventListener('change',clear);};
}
