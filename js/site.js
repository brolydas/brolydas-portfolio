import {prepareLiquidTransition,cancelLiquidTransition} from './liquid-transition.js';
import {projects,modeFromURL,escapeHTML as esc} from './projects.js';
import {PortfolioAudio} from './audio.js';

export const audio=new PortfolioAudio();
export let mode=modeFromURL();
const root=document.documentElement;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let simpleMotion=reduced.matches;
const safeSession={get(k){try{return sessionStorage.getItem(k);}catch{return null;}},set(k,v){try{sessionStorage.setItem(k,v);}catch{}}};
const words={
 design:{first:'Made to',second:'be <em>felt.</em>',discipline:'Broly Das · UI/UX and visual design',description:'Interfaces, identities and interactions shaped around the people who use them.',caption:'Five explorations in commerce, motion and interactive play.',about:'I’m Broly Das. I work across UI/UX, visual identity and creative development. My practice moves between shaping an interface and building the interactions that make it feel right.',secondary:'On the other side of this portfolio, you’ll find my AI and machine learning work as Tharun Rongala. Use the switch below to explore it.',email:'brolydas853@gmail.com'},
 intelligence:{first:'Built to',second:'make <em>sense.</em>',discipline:'Tharun Rongala · AI and machine learning',description:'Retrieval, computer vision and learning systems built from research to working interfaces.',caption:'Seven projects in retrieval, agents, perception and model systems.',about:'I’m Tharun Rongala. I build AI and machine learning projects, with a focus on retrieval, agent orchestration and model-serving infrastructure. I work with Python, PyTorch and the tools around them.',secondary:'I also design interfaces and visual identities as Broly Das. Both sides of the practice share an interest in making complex things easier to understand.',email:'tharunr8533@gmail.com'}
};
function renderHeroVisual(){
 const el=document.getElementById('hero-visual');if(!el)return;
 if(mode==='design'){
  el.innerHTML='<a class="hero-art-main" href="/work.html?mode=design&project=pepper#project-index" aria-label="View Pepper Club project"><img fetchpriority="high" src="/project_assets/pepper_club_hero.png" alt="Pepper Club hot sauce storefront"></a><a class="hero-art-detail" href="/work.html?mode=design&project=kamewear#project-index" aria-label="View Kamewear project"><img src="/project_assets/Kamewear Anime Streetwear Homepage.png" alt="Kamewear streetwear storefront"></a><div class="hero-art-index"><span>In focus / 01</span><strong>Pepper Club</strong><span>Commerce / interaction</span></div>';
 }else{
  const p=projects.intelligence[0];
  el.innerHTML='<a class="hero-system" href="/work.html?mode=intelligence&project=rag#project-index" aria-label="Read Knowledge, retrieved project"><span class="system-title">Knowledge,<br><em>retrieved.</em></span><span class="system-flow" aria-hidden="true">'+p.diagram.map((step,i)=>'<span class="system-node" style="--n:'+i+'"><b>'+String(i+1).padStart(2,'0')+'</b><strong>'+esc(step)+'</strong></span>').join('')+'</span><span class="system-foot">Question → grounded answer <span>View the project ↗</span></span></a><div class="hero-art-index"><span>In focus / 01</span><strong>Multi-agent RAG</strong><span>Retrieval / research</span></div>';
 }
}
function diagramMarkup(p){return `<div class="diagram-preview" aria-label="${esc(p.title)} architecture">${p.diagram.map((n,i)=>`<div class="diagram-node">${esc(n)}<span aria-hidden="true">${i===p.diagram.length-1?'●':'↓'}</span></div>`).join('')}</div>`;}
function renderFeatured(){const el=document.querySelector('#featured-projects');if(!el)return;const selection=mode==='design'?projects.design.slice(0,3):[projects.intelligence[0],projects.intelligence[3],projects.intelligence[6]];el.innerHTML=selection.map(p=>`<article class="feature" style="--project-color:${p.color}"><a class="feature-visual" href="/work.html?mode=${mode}&project=${p.id}#project-index" aria-label="Read about ${esc(p.title)}">${p.image?`<span class="image-fallback" aria-hidden="true">${esc(p.title)}</span><img loading="lazy" decoding="async" src="${esc(p.image)}" alt="${esc(p.title)} project preview">`:diagramMarkup(p)}</a><div class="feature-copy"><div class="feature-meta"><span>${esc(p.kind)}</span><span>Selected work</span></div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><a class="text-link" href="/work.html?mode=${mode}&project=${p.id}#project-index">View project <span aria-hidden="true">↗</span></a></div></article>`).join('');el.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>img.classList.add('failed'),{once:true}));}
function kineticTitle(){if(simpleMotion)return;document.querySelectorAll('[data-hero-line]').forEach(el=>{let i=0;const walk=node=>{for(const child of Array.from(node.childNodes)){if(child.nodeType===Node.TEXT_NODE){const fragment=document.createDocumentFragment();for(const char of child.textContent){if(char===' '){fragment.append(' ');continue;}const span=document.createElement('span');span.className='letter';span.style.setProperty('--i',i++);span.textContent=char;fragment.append(span);}child.replaceWith(fragment);}else walk(child);}};el.setAttribute('aria-label',el.textContent);walk(el);el.querySelectorAll('.letter').forEach(x=>x.setAttribute('aria-hidden','true'));});}
export function setMode(next,{updateURL=true,animate=true}={}){
  if(!projects[next])return;const changed=next!==mode;
  const reveal=changed&&animate&&!simpleMotion?prepareLiquidTransition(next):null;
  mode=next;root.dataset.mode=mode;document.querySelectorAll('[data-mode-button]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modeButton===mode)));
  if(updateURL){const url=new URL(location.href);url.searchParams.set('mode',mode);url.searchParams.delete('project');history.replaceState({},'',url);}
  document.querySelectorAll('[data-work-link]').forEach(a=>{const url=new URL(a.href,location.origin);url.searchParams.set('mode',mode);a.href=url.pathname+url.search+url.hash;});
  const w=words[mode];const lines=document.querySelectorAll('[data-hero-line]');if(lines.length){lines[0].textContent=w.first;lines[1].innerHTML=w.second;}
  for(const [id,key]of [['discipline','discipline'],['hero-description','description'],['selected-caption','caption'],['about-copy','about']]){const e=document.getElementById(id);if(e)e.textContent=w[key];}
  const secondary=document.querySelector('.about-secondary');if(secondary)secondary.textContent=w.secondary;
  document.querySelectorAll('[data-email]').forEach(e=>{e.textContent=w.email;e.href=`mailto:${w.email}`;});
  const other=document.querySelector('[data-other-mode]');if(other)other.innerHTML=`Explore ${mode==='design'?'Intelligence':'Design'} <span aria-hidden="true">↗</span>`;
  const wordmark=document.querySelector('.wordmark');if(wordmark)wordmark.innerHTML=mode==='design'?'Broly<span>Das</span><small>Design & Intelligence</small>':'Tharun<span>Rongala</span><small>Design & Intelligence</small>';
  const heroNote=document.querySelector('.hero-note');if(heroNote)heroNote.innerHTML=mode==='design'?'Design<br>01 / 02':'Intelligence<br>02 / 02';
  renderHeroVisual();renderFeatured();
  reveal?.();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',mode==='design'?'#050404':'#faf9f6');
  const announcement=document.querySelector('#mode-announcement');if(announcement&&changed)announcement.textContent=(mode==='design'?'Design':'Intelligence')+' portfolio selected';
  if(changed)audio.cue('switch');document.dispatchEvent(new CustomEvent('portfolio:mode',{detail:{mode,changed}}));
}
function syncSound(){document.querySelectorAll('[data-sound]').forEach(b=>b.setAttribute('aria-pressed',String(audio.enabled)));document.querySelectorAll('[data-sound-label]').forEach(e=>e.textContent=audio.enabled?'Sound on':'Sound off');}
async function setSound(on){if(on){await audio.enable();audio.prepareCues();if(document.body.classList.contains('work-page'))audio.startAmbient();}else audio.disable();syncSound();}
document.querySelectorAll('[data-sound]').forEach(b=>b.addEventListener('click',async()=>{await setSound(!audio.enabled);if(audio.enabled)audio.cue('switch');}));
document.querySelectorAll('[data-mode-button]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.modeButton)));
document.querySelector('[data-other-mode]')?.addEventListener('click',()=>{setMode(mode==='design'?'intelligence':'design');document.getElementById('main').scrollIntoView({behavior:simpleMotion?'instant':'smooth'});});
addEventListener('popstate',()=>setMode(modeFromURL(),{updateURL:false}));
const gate=document.getElementById('sound-gate');
if(gate){if(!safeSession.get('portfolio-well-entered'))gate.showModal();gate.addEventListener('cancel',()=>safeSession.set('portfolio-well-entered','quiet'));gate.querySelectorAll('[data-enter]').forEach(b=>b.addEventListener('click',async()=>{await setSound(b.dataset.enter==='sound');safeSession.set('portfolio-well-entered',b.dataset.enter);gate.close();audio.cue('open');document.dispatchEvent(new Event('portfolio:enter'));}));}
reduced.addEventListener('change',e=>{simpleMotion=e.matches;if(simpleMotion)cancelLiquidTransition();root.classList.toggle('no-motion',simpleMotion);document.dispatchEvent(new CustomEvent('portfolio:motion',{detail:{reduced:simpleMotion}}));});
root.classList.toggle('no-motion',simpleMotion);
setMode(mode,{updateURL:false,animate:false});
addEventListener('pagehide',()=>audio.dispose(),{once:true});
