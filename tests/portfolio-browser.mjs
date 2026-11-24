import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, extname, sep } from 'node:path';

const root=process.cwd();
const sites=[
 ['pepper','Pepper Club - Hot sauce, fermented slow.html'],
 ['games','tiny-games-for-moods.html'],
 ['zoo','ui-zoo.html'],
 ['scroll','scroll-lab.html'],
 ['scroll-play','scroll-lab-play.html']
];
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{
 try {
  const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!path.startsWith(root+sep)) {res.writeHead(403);res.end();return;}
  const bytes=await readFile(path);
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});
  res.end(bytes);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port+'/';
const dir='test-results/portfolio';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function check(name,fn){
 try{await fn();results.push({name,pass:true});console.log('PASS '+name);}
 catch(e){results.push({name,pass:false,error:String(e)});console.error('FAIL '+name+': '+e);}
}
async function visit(name,file,width,height,scheme='light',reduced='reduce',fn=async()=>{}){
 const ctx=await browser.newContext({viewport:{width,height},colorScheme:scheme,reducedMotion:reduced,acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
 const page=await ctx.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 // Use the same anime.js version as the source to make tests independent of the CDN.
 await page.route('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',route=>route.fulfill({path:resolve('node_modules/animejs/lib/anime.min.js'),contentType:'application/javascript'}));
 try{
  const response=await page.goto(base+encodeURIComponent(file),{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200);
  await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]));
  await page.waitForTimeout(250);
  const dimensions=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,heading:document.querySelector('h1')?.textContent.trim()}));
  assert.ok(dimensions.heading,'No visible heading text');
  assert.ok(dimensions.scroll<=dimensions.viewport+2,'Horizontal overflow: '+JSON.stringify(dimensions));
  await page.screenshot({path:dir+'/'+name+'-'+width+'-'+scheme+'-'+reduced+'.png',animations:'disabled',timeout:15000});
  await fn(page);
  assert.deepEqual(errors,[],'Uncaught JavaScript errors');
 }finally{await ctx.close();}
}
async function pepper(p){
 const buttons=p.locator('#grid .add');assert.ok(await buttons.count()>=3);
 await buttons.first().click();assert.equal(await p.locator('#cc').innerText(),'1');
 await p.locator('#cart').click();assert.ok(await p.locator('#bag').evaluate(e=>e.open));
 assert.match(await p.locator('#bagtotal').innerText(),/Subtotal: \$[1-9]/);
 await p.locator('#bag [data-remove]').first().click();assert.equal(await p.locator('#cc').innerText(),'0');
 await p.keyboard.press('Escape');assert.equal(await p.locator('#bag').evaluate(e=>e.open),false);
 const slider=p.locator('#rng');await slider.focus();await slider.press('End');assert.equal(await slider.inputValue(),'5');
 assert.ok((await p.locator('#hl').innerText()).trim());
 assert.ok(await p.locator('#picks .add').count()>0);
 await p.locator('#picks .add').first().click();assert.equal(await p.locator('#cc').innerText(),'1');
}
async function games(p){
 const sound=p.locator('#sndb'),before=await sound.innerText();await sound.click();assert.notEqual(await sound.innerText(),before);
 assert.equal(await p.locator('#grid .card').count(),6);assert.equal(await p.locator('#bgrid .card').count(),8);
 for(const selector of ['#grid .card','#bgrid .card']){
  const count=await p.locator(selector).count();
  for(let i=0;i<count;i++){
   await p.locator(selector).nth(i).click();
   await p.locator('#play.open').waitFor();
   assert.ok(await p.locator('#back').isVisible());
   assert.equal(await p.locator('.wrap').evaluate(e=>e.inert),true);
   await p.keyboard.press('Escape');
   await p.waitForFunction(()=>!document.querySelector('#play').classList.contains('open'));
   assert.equal(await p.locator('.wrap').evaluate(e=>e.inert),false);
  }
 }
 await p.locator('#sur').click();await p.locator('#play.open').waitFor();await p.locator('#back').click();
}
async function zoo(p){
 const cat=p.locator('#bed');await cat.click();assert.equal(await cat.getAttribute('aria-checked'),'true');
 await cat.press('Space');assert.equal(await cat.getAttribute('aria-checked'),'false');
 await p.locator('#snr').focus();await p.locator('#snr').press('End');assert.match(await p.locator('#snv').innerText(),/100/);
 await p.locator('#hbtn').click();await p.waitForFunction(()=>!document.querySelector('#hbtn').disabled,{},{timeout:15000});
 await p.locator('#fb').click();assert.match(await p.locator('#fc').innerText(),/1/);
 const canvas=p.locator('#pc');assert.ok(await canvas.evaluate(c=>c.width>0&&c.height>0));
 await p.locator('.vb').last().click();assert.equal(await p.locator('.vb').last().getAttribute('aria-pressed'),'true');
 await p.locator('#rm').click();await p.locator('#fz').click();assert.match(await p.locator('#fz').innerText(),/Resume/);
 const download=p.waitForEvent('download',{timeout:15000});await p.locator('#dl').click();const d=await download;assert.match(d.suggestedFilename(),/\.png$/i);
}
async function lab(p){
 assert.ok(await p.locator('#chs .ch').count()>=10);
 const first=p.locator('#chs .ch').first(),slider=first.locator('input[type=range]');
 const old=await slider.inputValue();await slider.focus();await slider.press('End');assert.notEqual(await slider.inputValue(),old);
 await first.locator('.rs').click();
 await first.locator('.key').click();
 await p.waitForFunction(()=>document.querySelector('#dr').getAttribute('aria-hidden')==='false');
 for(const tab of ['h','c','j']){await p.locator('#tb [data-t="'+tab+'"]').click();assert.ok((await p.locator('#pre').innerText()).trim().length);}
 await p.locator('#c1').click();assert.ok((await p.evaluate(()=>navigator.clipboard.readText())).trim());
 await p.keyboard.press('Escape');await p.waitForFunction(()=>document.querySelector('#dr').getAttribute('aria-hidden')==='true');
 await p.locator('#sw').click();await p.locator('#chm').waitFor({state:'visible'});
 assert.ok(await p.locator('#chm .ch').count()>=10);
 await p.locator('#chm .ch').first().locator('.key').click();await p.locator('#dx').click();
 await p.locator('#sw').click();await p.locator('#chs').waitFor({state:'visible'});
}
const funcs={pepper,games,zoo,scroll:lab,'scroll-play':lab};
try{
 for(const [name,file] of sites){
  for(const [width,height] of [[390,844],[768,1024],[1024,768],[1440,900]]){
   await check(name+' '+width+' light layout',()=>visit(name,file,width,height,'light','reduce'));
  }
  await check(name+' 390 dark layout',()=>visit(name,file,390,844,'dark','reduce'));
  for(const [width,height] of [[390,844],[1440,900]]){
   await check(name+' '+width+' interaction',()=>visit(name,file,width,height,'light','no-preference',funcs[name]));
  }
 }
 await check('Scroll Lab copies identical',async()=>assert.deepEqual(await readFile(sites[3][1]),await readFile(sites[4][1])));
}finally{
 await browser.close();server.close();
 await writeFile(dir+'/results.json',JSON.stringify(results,null,2));
}
console.log(results.filter(x=>x.pass).length+'/'+results.length+' checks passed');
if(results.some(x=>!x.pass))process.exitCode=1;
