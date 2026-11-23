import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {projects,escapeHTML as esc} from './projects.js';
import {audio,mode,setMode} from './site.js';

const journey=document.querySelector('.well-journey');
const canvas=document.querySelector('#well-canvas');
const caption=document.querySelector('.well-caption');
const title=document.querySelector('[data-scene-title]');
const copy=document.querySelector('[data-scene-copy]');
const depth=document.querySelector('[data-depth]');
const hoverLabel=document.querySelector('[data-hover-label]');
const list=document.querySelector('#project-list');
const caseDialog=document.querySelector('#case-dialog');
const caseContent=document.querySelector('#case-content');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let scene,renderer,composer,camera,clock,raycaster,pointer,lastStage=-1;
let rings=[],screens=[],floor,observer,largeScreen,focusPanel,ringLights,streaks,hovered=null;
let progress=0,previousScroll=scrollY,velocity=0,targetVelocity=0,paused=false,raf=0,selected=null,selection=0,disposeTextures=[],surfaces=new Map(),lastMediaFrame=0;

function projectLink(p){return p.url?'<a class="text-link" href="'+esc(p.url)+'" target="'+(p.url.startsWith('http')?'_blank':'_self')+'" rel="noopener">'+esc(p.linkLabel||'Open the project')+' <span aria-hidden="true">↗</span></a>':'';}
function renderIndex(){
  list.innerHTML=projects[mode].map((p,i)=>`<article class="project-row"><div><small>${String(i+1).padStart(2,'0')} / ${esc(p.kind)}</small><h3>${esc(p.title)}</h3></div><p>${esc(p.description)}</p><button data-project="${esc(p.id)}">Read this project</button></article>`).join('');
  list.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>openCase(projects[mode].find(p=>p.id===b.dataset.project))));
  document.querySelector('[data-index-caption]').textContent=mode==='design'?'Design, interaction and the experiments in between.':'Retrieval, perception and the systems that connect them.';
}
function openCase(p){
  if(!p)return;
  caseContent.innerHTML=`<p class="case-kind">${esc(p.kind)}</p><h2 id="case-title">${esc(p.title)}</h2><p>${esc(p.description)}</p>${p.image?`<img class="case-image" src="${esc(p.detail||p.image)}" alt="${esc(p.title)} project image" onerror="this.hidden=true">`:''}<div class="case-body"><div><h3>The question</h3><p>${esc(p.problem)}</p></div><div><h3>The approach</h3><p>${esc(p.approach)}</p></div></div><p class="case-tools">${esc(p.tools)}</p>${projectLink(p)}`;
  caseDialog.showModal();audio.cue('open');
}
document.querySelector('[data-case-close]').addEventListener('click',()=>caseDialog.close());
caseDialog.addEventListener('click',e=>{if(e.target===caseDialog)caseDialog.close();});
renderIndex();
const requested=new URLSearchParams(location.search).get('project');
if(requested){const p=projects[mode].find(x=>x.id===requested);if(p)openCase(p);}

function makeTexture(p){
  if(surfaces.has(p.id))return surfaces.get(p.id).texture;
  const canvas=document.createElement('canvas');canvas.width=800;canvas.height=480;
  const board=document.createElement('canvas');board.width=800;board.height=960;
  const surface={p,canvas,ctx:canvas.getContext('2d'),board,brush:board.getContext('2d'),image:null,detail:null,texture:null};
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);surface.texture=texture;
  surfaces.set(p.id,surface);disposeTextures.push(texture);
  const load=(key,url)=>{if(!url)return;const image=new Image();image.onload=()=>{surface[key]=image;drawBoard(surface);paintSurface(surface,progress);};image.src=url;};
  drawBoard(surface);paintSurface(surface,0);load('image',p.image);load('detail',p.detail);
  return texture;
}
function drawBoard(surface){
  const {p,brush:ctx,image,detail}=surface,accent=p.color||'#607e92';
  ctx.fillStyle='#090c0e';ctx.fillRect(0,0,800,960);
  if(image){
    const draw=(source,y)=>{const scale=Math.max(800/source.width,480/source.height),w=source.width*scale,h=source.height*scale;ctx.save();ctx.beginPath();ctx.rect(0,y,800,480);ctx.clip();ctx.drawImage(source,(800-w)/2,y,w,h);ctx.restore();};
    draw(image,0);draw(detail||image,480);return;
  }
  ctx.fillStyle='#101b21';ctx.fillRect(0,0,800,960);
  ctx.strokeStyle=accent;ctx.lineWidth=3;
  for(let i=0;i<5;i++){
    const x=65+i*145,y=260+Math.sin(i*1.5)*40;
    if(i){const prev=65+(i-1)*145,py=260+Math.sin((i-1)*1.5)*40;ctx.beginPath();ctx.moveTo(prev+38,py);ctx.lineTo(x-38,y);ctx.stroke();}
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f2ede4';ctx.font='22px Jost, sans-serif';ctx.textAlign='center';ctx.fillText(p.diagram?.[i]||'',x,y+58,130);
  }
  ctx.textAlign='left';ctx.fillStyle='#f2ede4';ctx.font='italic 64px Georgia,serif';ctx.fillText(p.title,40,610,720);
  ctx.strokeStyle=accent;ctx.beginPath();ctx.moveTo(40,650);ctx.lineTo(760,650);ctx.stroke();
  ctx.fillStyle='#b7c9cd';ctx.font='27px Jost,sans-serif';
  const words=p.description.split(/\s+/);let line='',y=710;
  for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>710){ctx.fillText(line,40,y);y+=44;line=word;}else line=next;}ctx.fillText(line,40,y);
}
function paintSurface(surface,position){
  const top=Math.max(0,Math.min(480,position*480));
  surface.ctx.drawImage(surface.board,0,top,800,480,0,0,800,480);
  surface.texture.needsUpdate=true;
}
function silhouette(){
  const body=new THREE.Group();
  const coat=new THREE.Mesh(new THREE.ConeGeometry(.35,1.25,10),new THREE.MeshStandardMaterial({color:'#15191d',roughness:1}));
  coat.position.y=1.05;body.add(coat);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.19,12,8),new THREE.MeshStandardMaterial({color:'#2d2928',roughness:1}));
  head.position.y=1.95;body.add(head);
  for(const x of [-.14,.14]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,.75,7),new THREE.MeshStandardMaterial({color:'#111517'}));leg.position.set(x,.34,0);body.add(leg);}
  body.position.set(0,-14.7,0);body.rotation.y=.45;return body;
}
function buildWorld(){
  scene=new THREE.Scene();scene.background=new THREE.Color('#050404');scene.fog=new THREE.FogExp2('#050404',.025);
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',alpha:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;
  camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,90);
  composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.18,.28,1.18));
  composer.addPass(new OutputPass());
  // The camera begins above the mouth of the well and continues to look down.
  camera.position.set(0,29,3);camera.lookAt(0,-7,0);
  clock=new THREE.Clock();raycaster=new THREE.Raycaster();pointer=new THREE.Vector2();
  scene.add(new THREE.AmbientLight('#9c9fac',1.45));
  const key=new THREE.PointLight('#e8dfd2',85,32);key.position.set(2,6,5);scene.add(key);
  const blue=new THREE.PointLight('#003153',220,18);blue.position.set(0,-12,0);scene.add(blue);
  const floorMat=new THREE.MeshStandardMaterial({color:'#002f54',emissive:'#003153',emissiveIntensity:1.3,roughness:1});
  floor=new THREE.Mesh(new THREE.CircleGeometry(5.7,72),floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-15;scene.add(floor);
  const floorRim=new THREE.Mesh(new THREE.RingGeometry(5.65,5.69,72),new THREE.MeshBasicMaterial({color:'#9db0be',side:THREE.DoubleSide,transparent:true,opacity:.45}));
  floorRim.rotation.x=-Math.PI/2;floorRim.position.y=-14.99;scene.add(floorRim);
  observer=silhouette();scene.add(observer);
  const lights=[];
  for(const [radius,height] of [[11.5,7],[9.3,2.5],[7.2,-2]])for(let i=0;i<96;i++){const a=i*Math.PI*2/96;lights.push(Math.cos(a)*radius,height,Math.sin(a)*radius);}
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(lights,3));
  ringLights=new THREE.Points(lg,new THREE.PointsMaterial({color:'#b8d5e8',size:.23,transparent:true,opacity:0,sizeAttenuation:true,depthWrite:false}));scene.add(ringLights);
  const streakPositions=[];for(let i=0;i<48;i++){const a=i*Math.PI*2/48,r=5.9+(i%4)*1.6,y=8-(i%5)*5.5;streakPositions.push(Math.cos(a)*r,y,Math.sin(a)*r,Math.cos(a)*r,y-2.7,Math.sin(a)*r);}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(streakPositions,3));
  streaks=new THREE.LineSegments(sg,new THREE.LineBasicMaterial({color:'#aebdcc',transparent:true,opacity:0,depthWrite:false}));scene.add(streaks);
  const content=projects[mode];
  for(let row=0;row<5;row++){
    const group=new THREE.Group(),count=5,radius=9.4-row*.73,height=3.45;
    const rim=new THREE.Mesh(new THREE.TorusGeometry(radius+height*.6,.015,5,80),new THREE.MeshBasicMaterial({color:row===4?'#31506b':'#373035',transparent:true,opacity:.45}));
    rim.rotation.x=Math.PI/2;rim.position.y=height*.5;group.add(rim);
    for(let i=0;i<count;i++){
      const project=content[(i+row*2)%content.length];
      const angle=i*Math.PI*2/count+(row%2?.38:0),width=Math.PI*2/count*.70;
      const geometry=new THREE.CylinderGeometry(radius,radius,height,20,1,true,angle,width);
      // Lean the upper edge outward. Each curved surface now faces the
      // descending overhead camera, as the screens do in the reference.
      const positions=geometry.getAttribute('position');
      for(let vertex=0;vertex<positions.count;vertex++){
        const x=positions.getX(vertex),y=positions.getY(vertex),z=positions.getZ(vertex);
        const distance=Math.hypot(x,z);
        const leaned=distance+y*2.15;
        positions.setXYZ(vertex,x*leaned/distance,y,z*leaned/distance);
      }
      positions.needsUpdate=true;geometry.computeVertexNormals();
      const uv=geometry.getAttribute('uv');for(let v=0;v<uv.count;v++)uv.setX(v,1-uv.getX(v));uv.needsUpdate=true;
      const mat=new THREE.MeshBasicMaterial({map:makeTexture(project),color:'#a7a5a0',side:THREE.DoubleSide,transparent:true,opacity:row<2?.93:.96});
      const screen=new THREE.Mesh(geometry,mat);screen.userData={project,row,angle,home:null};group.add(screen);screens.push(screen);
      const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:'#665865',transparent:true,opacity:.14}));screen.add(edge);
    }
    group.position.y=7-row*5.25;scene.add(group);rings.push(group);
  }
  const featureGeometry=new THREE.CylinderGeometry(5.9,5.9,2.25,36,1,true,Math.PI*.25,Math.PI*.47);
  const featurePositions=featureGeometry.getAttribute('position');
  for(let vertex=0;vertex<featurePositions.count;vertex++){
    const x=featurePositions.getX(vertex),y=featurePositions.getY(vertex),z=featurePositions.getZ(vertex),distance=Math.hypot(x,z),leaned=distance+y*1.8;
    featurePositions.setXYZ(vertex,x*leaned/distance,y,z*leaned/distance);
  }
  featurePositions.needsUpdate=true;featureGeometry.computeVertexNormals();
  const featureUV=featureGeometry.getAttribute('uv');for(let v=0;v<featureUV.count;v++)featureUV.setX(v,1-featureUV.getX(v));featureUV.needsUpdate=true;
  largeScreen=new THREE.Mesh(featureGeometry,new THREE.MeshBasicMaterial({map:makeTexture(content[0]),side:THREE.DoubleSide}));
  largeScreen.position.y=-12.3;scene.add(largeScreen);
  document.body.classList.add('well-available');
}
function layout(){
  if(!renderer)return;
  const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);composer.setSize(w,h);camera.aspect=w/h;camera.fov=w<650?72:55;camera.updateProjectionMatrix();
}
function getProgress(){
  const max=journey.offsetHeight-innerHeight;return Math.max(0,Math.min(1,(scrollY-journey.offsetTop)/Math.max(max,1)));
}
function changeCaption(){
  const stages=[['Into the work.','Each screen holds a different idea.'],['Closer to the details.','The collection changes as you descend.'],['A point of view.','Choose a screen to inspect the work.'],['The observer.','One project holds the centre of the room.'],['Back to the surface.','The full index continues below.']];
  const index=progress<.13?0:progress<.39?1:progress<.64?2:progress<.86?3:4;
  if(index!==lastStage){lastStage=index;title.textContent=stages[index][0];copy.textContent=stages[index][1];if(!reduced.matches){let n=0;const label=title.textContent;title.setAttribute('aria-label',label);title.innerHTML='';for(const char of label){const span=document.createElement('span');span.textContent=char===' '?' ':char;span.className='letter';span.style.setProperty('--i',n++);span.setAttribute('aria-hidden','true');title.append(span);}}}
  caption.hidden=progress<.12;depth.textContent=progress<.12?'At the surface':progress<.79?'Descending / '+Math.round(progress*100)+'%':'At the centre';
  document.querySelector('.well-intro').style.opacity=String(Math.max(0,1-progress*8));
  document.querySelector('.well-progress').style.transform='scaleX('+progress+')';
}
function onScroll(){
  const next=scrollY;targetVelocity=Math.max(-1,Math.min(1,(next-previousScroll)/60));previousScroll=next;progress=getProgress();changeCaption();
  if(progress>.86){hovered=null;hoverLabel.textContent='';if(selected){selected.material.opacity=1;selected=null;selection=0;if(focusPanel){scene.remove(focusPanel);focusPanel.geometry.dispose();focusPanel.material.dispose();focusPanel=null;}document.body.classList.remove('screen-selected');document.querySelector('[data-selected-open]').hidden=true;}}
  canvas.style.opacity=String(Math.min(1,.33+progress*4));
}
function animate(){
  raf=requestAnimationFrame(animate);
  if(paused||document.hidden)return;
  const dt=Math.min(clock.getDelta(),.05);
  velocity=THREE.MathUtils.damp(velocity,targetVelocity,3,dt);targetVelocity=THREE.MathUtils.damp(targetVelocity,0,5,dt);
  const end=progress>.83?(progress-.83)/.17:0;
  const y=THREE.MathUtils.lerp(24,-6,Math.min(progress/.7,1))+end*40;
  const z=THREE.MathUtils.lerp(3,1,Math.min(progress/.83,1))+end*3;
  camera.position.y=THREE.MathUtils.damp(camera.position.y,y,2.6,dt);
  camera.position.z=THREE.MathUtils.damp(camera.position.z,z,2.6,dt);
  const lookY=progress>.83?THREE.MathUtils.lerp(-14,7,end):THREE.MathUtils.lerp(0,-15,Math.min(progress/.83,1));
  camera.lookAt(0,lookY,0);
  rings.forEach((ring,i)=>{ring.rotation.y=progress*(i%2?-.92:1.08)*(1+i*.38)+velocity*(i%2?-.2:.2)*(1+i*.3);});
  screens.forEach(screen=>{if(screen!==selected)screen.material.opacity=(screen.userData.row<2?.93:.96)*Math.max(0,1-end*1.45);});
  if(performance.now()-lastMediaFrame>80){lastMediaFrame=performance.now();for(const surface of surfaces.values())paintSurface(surface,Math.min(1,progress*1.2+Math.abs(velocity)*.025));}
  if(largeScreen){const sequence=progress*projects[mode].length,active=projects[mode][Math.min(projects[mode].length-1,Math.floor(sequence))];if(largeScreen.userData.id!==active.id){largeScreen.material.map=makeTexture(active);largeScreen.userData.id=active.id;}const slit=Math.min(1,(sequence%1)*7);largeScreen.scale.y=.04+.96*Math.sin(slit*Math.PI/2);largeScreen.material.transparent=true;largeScreen.material.opacity=Math.max(0,1-end*1.45);}
  ringLights.material.opacity=Math.min(1,end*1.65);streaks.material.opacity=Math.min(.28,Math.abs(velocity)*.22);
  observer.rotation.y=THREE.MathUtils.damp(observer.rotation.y,(selected||hovered)?.userData.angle+Math.PI/2||.45,2.5,dt);
  if(selected&&selection<1){
    selection=Math.min(1,selection+dt*1.25);const ease=1-Math.pow(1-selection,3);
    selected.material.opacity=1-ease*.83;
    const target=new THREE.Vector3(0,-.45,-6.5).applyMatrix4(camera.matrixWorld);
    focusPanel.position.lerpVectors(focusPanel.userData.origin,target,ease);
    focusPanel.quaternion.copy(camera.quaternion);
    focusPanel.scale.set(.35+ease*.85,.45+ease*.65,1);
    focusPanel.material.opacity=ease;
    if(selection===1)document.querySelector('[data-selected-open]').hidden=false;
  }
  composer.render();
}
function screenAt(e){
  if(!renderer)return null;
  const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);
  return raycaster.intersectObjects(screens,false)[0]?.object||null;
}
canvas.addEventListener('pointermove',e=>{const hit=screenAt(e);hovered=hit;canvas.style.cursor=hit?'pointer':'';hoverLabel.textContent=hit?hit.userData.project.title:'';});
canvas.addEventListener('click',e=>{const hit=screenAt(e);if(!hit)return;
  if(selected)selected.material.opacity=1;
  if(focusPanel){scene.remove(focusPanel);focusPanel.geometry.dispose();focusPanel.material.dispose();}
  selected=hit;selection=0;hit.updateWorldMatrix(true,false);
  const origin=hit.getWorldPosition(new THREE.Vector3());
  focusPanel=new THREE.Mesh(new THREE.PlaneGeometry(5.2,3.1,24,1),new THREE.MeshBasicMaterial({map:hit.material.map,side:THREE.DoubleSide,transparent:true,opacity:0,depthTest:false}));
  focusPanel.renderOrder=99;focusPanel.position.copy(origin);focusPanel.userData.origin=origin;scene.add(focusPanel);
  document.body.classList.add('screen-selected');
  audio.cue('open');hoverLabel.textContent=hit.userData.project.title+' / selected';
});
document.querySelector('[data-selected-open]').addEventListener('click',()=>{if(selected)openCase(selected.userData.project);});
document.querySelector('[data-pause]').addEventListener('click',e=>{paused=!paused;e.currentTarget.textContent=paused?'Resume motion':'Pause motion';e.currentTarget.setAttribute('aria-pressed',String(paused));if(!paused)clock.getDelta();});
document.addEventListener('portfolio:mode',()=>{renderIndex();if(renderer){destroyWorld();if(!reduced.matches)startWorld();}selected=null;document.body.classList.remove('screen-selected');document.querySelector('[data-selected-open]').hidden=true;});
function destroyWorld(){
  cancelAnimationFrame(raf);if(scene)scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});
  disposeTextures.forEach(t=>t.dispose());disposeTextures=[];surfaces.clear();composer?.dispose();composer=null;renderer?.dispose();renderer=null;rings=[];screens=[];focusPanel=null;lastStage=-1;document.body.classList.remove('well-available');
}
function startWorld(){try{buildWorld();layout();onScroll();animate();}catch(error){console.warn('Project well unavailable',error);document.body.classList.add('webgl-failed');document.querySelector('.well-error').hidden=false;document.querySelector('.well-error').textContent='The project index is ready below.';}}
if(!reduced.matches)startWorld();
addEventListener('resize',layout);addEventListener('scroll',onScroll,{passive:true});
document.addEventListener('portfolio:motion',e=>{if(e.detail.reduced){destroyWorld();}else if(!renderer){document.body.classList.remove('webgl-failed');startWorld();}});
addEventListener('pagehide',destroyWorld,{once:true});
