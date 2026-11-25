(()=>{'use strict';
const fx=window.SakugaFX;if(!fx)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
Object.assign(fx.P,{fill:'#fffaf0',shade:'#ffd5a5',line:'#b34a10',accent:'#ff7900',ink:'#211b17',sfx:['#211b17','#fffaf0']});
const $=s=>document.querySelector(s);
function nativeButton(old){if(!old||!customElements.get('sakuga-button'))return;const b=document.createElement('sakuga-button');b.id=old.id;b.className='kw-sakuga-button';b.setAttribute('variant','secondary');b.textContent=old.textContent;old.replaceWith(b);}
nativeButton($('#lookbook-open'));
const field=$('#product-search');
if(field&&customElements.get('sakuga-input')&&typeof HTMLElement.prototype.attachInternals==='function'){
 const b=document.createElement('sakuga-input');b.id=field.id;b.setAttribute('type','search');b.setAttribute('label','Find your fit');b.setAttribute('placeholder',field.placeholder);field.replaceWith(b);
}
const noMotion=()=>reduce.matches||fx.calm;
const point=el=>fx.at(el);
function press(el,small=false){if(noMotion()||!el?.isConnected)return;el.animate([{transform:'scale(1)'},{transform:'scale(1.055,.86)',offset:.22},{transform:'scale(.98,1.08)',offset:.52},{transform:'scale(1)'}],{duration:small?290:420,easing:'cubic-bezier(.22,1,.36,1)'});}
function pop(el,major=false){if(noMotion()||!el?.isConnected)return;const c=point(el);press(el,!major);
 if(major){fx.shards(c.x,c.y,{n:9,speed:165,size:6,life:.65,arc:Math.PI*1.6,grav:280});fx.puff(c.x-c.w*.45,c.y+8,{n:3,size:9,vx:-26,life:.58});fx.puff(c.x+c.w*.45,c.y+8,{n:3,size:9,vx:26,life:.58});fx.sfx('don',c.x,c.y-49,{size:95,life:.7,col:'#211b17',edge:'#fffaf0'});fx.ticks(c.x+c.w*.5,c.y-7,{n:4,r:8,len:18,life:.35});}
 else{fx.ticks(c.x+c.w*.35,c.y-8,{n:3,len:13,r:7,life:.32});fx.puff(c.x-c.w*.35,c.y+5,{n:2,size:5,vx:-15,life:.36});}
}
let notifyTimer=0;
window.KamewearVFX={confirm(message){
 const bag=$('#cart-toggle');pop(bag,true);
 if(noMotion()||!customElements.get('sakuga-toast'))return false;
 let el=$('#kw-sakuga-toast');if(!el){el=document.createElement('sakuga-toast');el.id='kw-sakuga-toast';el.setAttribute('duration','3');document.body.append(el);}
 el.show(message);clearTimeout(notifyTimer);notifyTimer=setTimeout(()=>el.remove(),5000);return true;
}};
document.addEventListener('click',e=>{
 const el=e.target.closest?.('button,a');if(!el||el.disabled||noMotion()||el.closest('sakuga-button'))return;
 // Native dialog top layer covers page canvas; use local motion for size controls.
 if(el.matches('[data-size]')){press(el,true);el.classList.remove('kw-size-hit');void el.offsetWidth;el.classList.add('kw-size-hit');return;}
 if(el.closest('dialog'))return;
 if(el.matches('.button.primary[href^="#"]'))pop(el,true);
 else if(el.matches('[data-filter],.category,.add,#search-toggle,#menu-toggle'))pop(el);
 else if(el.matches('[data-product]'))press(el,true);
},true);
})();