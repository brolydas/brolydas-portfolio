(()=>{'use strict';
const nav=document.querySelector('.lab-menu-nav');if(!nav)return;
const triggers=[...nav.querySelectorAll('[data-menu-trigger]')],reduced=matchMedia('(prefers-reduced-motion: reduce)');let current=null;
const warmed=new Set();const destinations=new Set(['/scroll-lab','/motion-lab','/lab-tools']);
function warm(link){if(!link||navigator.connection?.saveData||/^(slow-2g|2g)$/.test(navigator.connection?.effectiveType||''))return;const url=new URL(link.href,location.href);if(url.origin!==location.origin||!destinations.has(url.pathname)||url.pathname===location.pathname||warmed.has(url.pathname))return;warmed.add(url.pathname);const hint=document.createElement('link');hint.rel='prefetch';hint.href=url.pathname;hint.as='document';document.head.append(hint);}
function intent(e){const link=e.target.closest?.('a[href]');if(link)warm(link);}
document.addEventListener('pointerover',intent,{passive:true});document.addEventListener('focusin',intent);
function panel(b){return document.getElementById(b.getAttribute('aria-controls'));}
function close(restore=false){if(!current)return;const old=current;current=null;old.setAttribute('aria-expanded','false');panel(old).hidden=true;if(restore)old.focus();}
function open(b){if(current===b)return;close();current=b;b.setAttribute('aria-expanded','true');panel(b).hidden=false;}
triggers.forEach(b=>{b.addEventListener('click',()=>current===b?close():open(b));b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();open(b);panel(b).querySelector('a')?.focus();}});});
document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&current){e.preventDefault();close(true);}});
nav.addEventListener('focusout',e=>{if(e.relatedTarget&&!nav.contains(e.relatedTarget))close();});
// Never hide or animate the link's ancestor during activation. Let native anchor
// navigation finish first, including keyboard and touch activation.
window.addEventListener('hashchange',()=>close());
window.addEventListener('pagehide',()=>close());
})();