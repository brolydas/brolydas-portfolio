(()=>{'use strict';
const nav=document.querySelector('.lab-menu-nav');if(!nav)return;
const triggers=[...nav.querySelectorAll('[data-menu-trigger]')],reduced=matchMedia('(prefers-reduced-motion: reduce)');let current=null;
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