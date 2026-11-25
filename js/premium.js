/* Hero movement is owned by GSAP in the compiled portfolio runtime. */
(()=>{const section=document.querySelector('#hero');if(!section)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return;
import('/assets/portfolio-flow/runtime.js').then(m=>m.mountHero?.()).catch(()=>{section.dataset.motion='still';});
})();