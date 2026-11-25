import {Player,Stage,Vector2} from '@motion-canvas/core';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import project from './project?project';
gsap.registerPlugin(ScrollTrigger);
let mounted=false;
export function mountFlow(){
 if(mounted)return;mounted=true;
 const board=document.querySelector<HTMLElement>('#flow-composition')!;
 const section=document.querySelector<HTMLElement>('#project-inquiry')!;
 const controls=document.querySelector<HTMLElement>('.composition-controls')!;
 const pause=document.querySelector<HTMLButtonElement>('#flow-pause')!;
 const slider=document.querySelector<HTMLInputElement>('#flow-position')!;
 const output=document.querySelector<HTMLOutputElement>('#flow-position-value')!;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const stage=new Stage(),size=new Vector2(960,640);
 stage.configure({size,resolutionScale:1,background:'#e8ebef'});
 const canvas=stage.finalBuffer;canvas.setAttribute('aria-hidden','true');board.append(canvas);
 project.logger.onLogged.subscribe(event=>console.warn('Motion Canvas:',event));
 const player=new Player(project,{size,fps:30,resolutionScale:1},{loop:false,muted:true});
 let duration=0,visible=false,paused=false,ready=false,disposed=false,manual=false,progress=0;
 const state={progress:0};
 function seek(value:number){progress=Math.max(0,Math.min(1,value));slider.value=String(Math.round(progress*100));output.textContent=Math.round(progress*100)+'%';if(ready){player.requestSeek(Math.round(progress*Math.max(0,duration-1)));player.activate();}}
 const render=async()=>{await stage.render(player.playback.currentScene,player.playback.previousScene);if(disposed)return;board.dataset.ready='true';board.dataset.frame=String(player.playback.frame);if(paused||!visible||reduced.matches)player.deactivate();};
 player.onRender.subscribe(render);
 player.onDurationChanged.subscribe(value=>{duration=value;});
 player.onRecalculated.subscribe(()=>{ready=true;board.dataset.duration=String(duration);seek(progress);});
 controls.hidden=false;
 const reading=document.createElement('div');reading.className='flow-reading-progress';reading.setAttribute('aria-hidden','true');document.body.append(reading);
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  gsap.to(reading,{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:0,end:()=>ScrollTrigger.maxScroll(window),scrub:true,invalidateOnRefresh:true}});
  gsap.to(state,{progress:1,ease:'none',onUpdate:()=>{if(!paused&&!manual)seek(state.progress);},scrollTrigger:{trigger:section,start:'top 80%',end:'bottom 25%',scrub:.45,invalidateOnRefresh:true}});
 });
 const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible&&!paused&&!reduced.matches)player.activate();else player.deactivate();});observer.observe(section);
 pause.addEventListener('click',()=>{paused=!paused;manual=false;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume motion':'Pause motion';if(paused)player.deactivate();else seek(state.progress);});
 slider.addEventListener('input',()=>{manual=true;paused=true;pause.setAttribute('aria-pressed','true');pause.textContent='Resume motion';seek(+slider.value/100);});
 function preference(){if(reduced.matches){paused=true;player.deactivate();controls.hidden=true;canvas.hidden=true;board.removeAttribute('data-ready');}else{paused=false;controls.hidden=false;canvas.hidden=false;board.dataset.ready='true';pause.setAttribute('aria-pressed','false');pause.textContent='Pause motion';seek(state.progress);}}
 reduced.addEventListener('change',preference);
 const refresh=()=>ScrollTrigger.refresh();document.addEventListener('portfolio:mode',refresh);document.fonts?.ready.then(refresh);
 const visibility=()=>{if(document.hidden)player.deactivate();else if(visible&&!paused&&!reduced.matches)player.activate();};
 document.addEventListener('visibilitychange',visibility);
 player.activate();board.dataset.engine='motion-canvas';
 addEventListener('pagehide',event=>{if(event.persisted)return;disposed=true;observer.disconnect();media.revert();player.onRender.unsubscribe(render);player.deactivate();reading.remove();reduced.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('portfolio:mode',refresh);},{once:true});
}

export function runIntro(dialog:HTMLDialogElement,done:()=>void){
 const letters=dialog.querySelectorAll('.intro-letters span');
 const timeline=gsap.timeline({onComplete:done});
 timeline.fromTo(letters,{x:(i:number)=>Math.cos(i*.9)*90,y:(i:number)=>Math.sin(i*.9)*65,rotation:(i:number)=>i*37-120,scale:.35},{x:0,y:0,rotation:0,scale:1,duration:.9,ease:'power3.inOut',stagger:.025})
 .to(letters,{x:(i:number)=>(i-3.5)*35,y:(i:number)=>Math.sin(i)*25,rotation:(i:number)=>(i-3.5)*12,scale:.7,duration:.45,ease:'power2.in',delay:.15});
 dialog.addEventListener('close',()=>timeline.kill(),{once:true});
}
let heroMounted=false;
export function mountHero(){
 if(heroMounted)return;heroMounted=true;
 const section=document.querySelector<HTMLElement>('#hero');if(!section)return;
 const media=gsap.matchMedia();let context:gsap.Context|undefined,first=true;
 function setup(){context?.revert();context=gsap.context(()=>{
 const picture=section.querySelector<HTMLElement>('.hero-visual');if(!picture)return;
 const lines=section.querySelectorAll<HTMLElement>('[data-hero-line]');
 if(first){lines.forEach(line=>{line.setAttribute('aria-label',line.textContent||'');const text=line.textContent||'';line.textContent='';for(const c of text){const span=document.createElement('span');span.className='hero-glyph';span.setAttribute('aria-hidden','true');span.textContent=c;line.append(span);}});
 const glyphs=section.querySelectorAll<HTMLElement>('.hero-glyph');
 gsap.from(glyphs,{x:(_i:number,el:HTMLElement)=>innerWidth*.48-(el.getBoundingClientRect().left+el.offsetWidth/2),y:(_i:number,el:HTMLElement)=>innerHeight*.42-(el.getBoundingClientRect().top+el.offsetHeight/2),rotation:(i:number)=>(i%2?1:-1)*(18+i*2),scale:.08,duration:1.05,stagger:{each:.025,from:'center'},ease:'power3.inOut',clearProps:'transform,willChange'});
 gsap.fromTo(picture,{scale:.86,y:35,rotation:-5},{scale:1,y:0,rotation:0,duration:1.3,ease:'power3.out',clearProps:'transform'});first=false;}
 gsap.to(picture,{scale:1.08,yPercent:-6,ease:'none',scrollTrigger:{trigger:section,start:'top top',end:'bottom top',scrub:.7,invalidateOnRefresh:true}});
 },section);section.dataset.motion='gsap';}
 function ready(){if(document.documentElement.classList.contains('intro-active'))return;setup();}
 media.add('(prefers-reduced-motion: no-preference)',()=>{ready();document.addEventListener('portfolio:intro-ready',ready);document.addEventListener('portfolio:mode',setup);return()=>{context?.revert();document.removeEventListener('portfolio:intro-ready',ready);document.removeEventListener('portfolio:mode',setup);};});
 addEventListener('pagehide',e=>{if(!e.persisted)media.revert();},{once:true});
}
