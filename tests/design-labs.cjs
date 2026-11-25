
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),vm=require('node:vm');
const {chromium}=require('playwright');
const root=process.cwd(),output=path.join(root,'test-results/design-labs'),exportsMap=new Map(),report=[],errors=[];
const pages=['ui-ux-lab.html','ui-zoo.html','lab-tools.html','lab-resources.html','motion-lab.html','scroll-lab.html','scroll-lab-play.html','ui-ux-experiments.html','pepper-club.html','tiny-games-for-moods.html'];
const record=(name,details)=>{report.push({name,passed:true,...details});console.log('PASS',name,JSON.stringify(details||{}));};
const read=p=>fs.readFile(path.join(root,p),'utf8');
(async()=>{
await fs.mkdir(output,{recursive:true});
for(const name of pages){const html=await read(name);const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');assert.equal((markup.match(/<h1\b/gi)||[]).length,1,name+' has one h1');assert.equal((markup.match(/<main\b/gi)||[]).length,1,name+' has one main');const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,name+' unique IDs');for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(match[2].trim()){if(/type=["'](?:application\/ld\+json|importmap)["']/.test(match[1]))JSON.parse(match[2]);else new vm.Script(match[2],{filename:name});}}}
for(const file of ['ui-ux-lab.js','motion-lab.js','motion-12.23.24.js','lab-experience.js','lab-specimens.js','lab-public.js','lab-tools.js','lab-mega.js','lab-cinematic.js'])new vm.Script(await read(file),{filename:file});
assert.equal(await read('scroll-lab.html'),await read('scroll-lab-play.html'));
assert.equal(await read('ui-zoo.html'),await read('ui-ux-lab.html'));
assert.equal(await read('pepper-club.html'),await read('Pepper Club - Hot sauce, fermented slow.html'));
const manifest=JSON.parse(await read('lab-data/manifest.json'));for(const [category,count]of Object.entries(manifest.counts)){assert.equal(JSON.parse(await read('lab-data/'+category+'.json')).length,count);}
for(const file of ['work.html','projects.html','js/projects.js']){const src=await read(file);assert.match(src,/url:'\/ui-ux-lab\.html', linkLabel:'Open the lab'/,file+' portfolio lab CTA opens homepage');assert.ok(!src.includes("url:'/scroll-lab-play.html', linkLabel:'Open the lab'"),file+' no old CTA');}
record('Portfolio Open the lab links target the cinematic homepage');
for(const name of ['ui-ux-lab.html','ui-zoo.html','scroll-lab.html','scroll-lab-play.html','motion-lab.html','lab-tools.html','lab-resources.html','ui-ux-experiments.html']){const html=await read(name);assert.match(html,/aria-label="UXCraft home"/,name+' UXCraft branding');assert.ok(!html.includes('UI/UX Lab'),name+' no old brand');}
assert.ok(JSON.parse(await read('vercel.json')).rewrites.some(r=>r.source==='/uxcraft'&&r.destination==='/ui-ux-lab.html'));
record('UXCraft brand, preserved aliases and new canonical entry alias');
record('Source syntax, landmarks, unique IDs, aliases and dataset counts');
const server=http.createServer(async(req,res)=>{try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(exportsMap.has(pathname)){res.setHeader('Content-Type','text/html');res.end(exportsMap.get(pathname));return;}let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(!path.extname(file))file+='.html';const data=await fs.readFile(file);const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'})[ext]||'text/plain');res.end(data);}catch{res.writeHead(404).end('Not found');}});
await new Promise(resolve=>server.listen(8777,'127.0.0.1',resolve));
let browser;
try{
browser=await chromium.launch();const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));const base='http://127.0.0.1:8777/';
const open=async name=>{await page.goto(base+name);await page.waitForLoadState('domcontentloaded');};
for(const name of pages){await open(name);if(name==='ui-ux-lab.html'||name==='ui-zoo.html')await page.locator('.ref-card').first().waitFor();if(name==='motion-lab.html')await page.locator('.motion-card').first().waitFor();for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,offscreen:[...document.querySelectorAll('h1,h2,nav,button,input')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.right>innerWidth+1||r.left<-1)}).map(e=>({tag:e.tagName,id:e.id,text:e.textContent.slice(0,50)})).slice(0,8)}));assert.ok(layout.scroll<=layout.width+1,name+' overflow at '+width+': '+JSON.stringify(layout));if([390,1440].includes(width)&&['ui-ux-lab.html','motion-lab.html','scroll-lab.html'].includes(name))await page.screenshot({path:path.join(output,name.replace('.html','')+'-'+width+'.png'),fullPage:true});}record('Responsive '+name,{widths:[320,390,768,1440]});}
await page.setViewportSize({width:1440,height:1000});
await open('ui-ux-lab.html');await page.locator('[data-menu-trigger="playground"]').click();
assert.equal(await page.locator('#lab-playground-menu a').count(),3);assert.ok(await page.locator('#lab-playground-menu').isVisible());
await page.keyboard.press('Escape');assert.equal(await page.locator('[data-menu-trigger="playground"]').getAttribute('aria-expanded'),'false');
await page.locator('[data-menu-trigger="resources"]').click();assert.equal(await page.locator('#lab-resources-menu .mega-link').count(),17);
assert.ok(await page.locator('#lab-resources-menu').isVisible());await page.locator('#lab-resources-menu a[href="/lab-resources.html#wireframe"]').click();
await page.waitForURL(u=>u.pathname.endsWith('/lab-resources.html')&&u.hash==='#wireframe',{waitUntil:'domcontentloaded'});assert.ok(await page.locator('#wireframe').isVisible());
await page.locator('#wireframe a').click();await page.waitForURL(u=>u.pathname.endsWith('/lab-tools.html')&&u.searchParams.get('fidelity')==='lo'&&u.hash==='#studio',{waitUntil:'domcontentloaded'});assert.equal(await page.locator('#design-fidelity').inputValue(),'lo');
await page.setViewportSize({width:320,height:800});await page.locator('[data-menu-trigger="resources"]').click();assert.ok(await page.locator('#lab-resources-menu').isVisible());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.keyboard.press('Escape');await page.setViewportSize({width:1440,height:1000});
for(const dest of ['scroll-lab.html','motion-lab.html','lab-tools.html']){await open('ui-ux-lab.html');await page.locator('[data-menu-trigger="playground"]').click();await Promise.all([page.waitForURL(u=>u.pathname.endsWith('/'+dest),{waitUntil:'domcontentloaded'}),page.locator('#lab-playground-menu a[href="/'+dest+'"]').click()]);assert.ok(await page.locator('main').isVisible());}record('Playground native navigation to all three labs');
await open('ui-ux-lab.html');await page.locator('#lab-dust').waitFor();assert.ok(await page.locator('#lab-dust').evaluate(e=>e.width>0&&e.height>0));
await page.locator('.cinematic-pause').click();assert.equal(await page.locator('.cinematic-pause').getAttribute('aria-pressed'),'true');
await page.locator('.cinematic-pause').click();assert.equal(await page.locator('.cinematic-pause').getAttribute('aria-pressed'),'false');
await page.evaluate(()=>scrollTo(0,document.querySelector('.lab-cinematic').offsetTop+innerHeight));await page.waitForFunction(()=>document.querySelector('#cinematic-chapter-label').textContent!=='The field');
await page.evaluate(()=>{const el=document.querySelector('.lab-cinematic'),stage=el.querySelector('.cinematic-sticky');scrollTo(0,el.offsetTop+el.offsetHeight-stage.offsetHeight-94);});
await page.waitForFunction(()=>[...document.querySelectorAll('.cinematic-card')].every(e=>+getComputedStyle(e).opacity>.999));
await page.waitForFunction(()=>+document.querySelector('.cinematic-card').style.getPropertyValue('--fan')>.98);
const cardBounds=await page.locator('.cinematic-card').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right}}).sort((a,b)=>a.left-b.left));
assert.ok(cardBounds[0].right<=cardBounds[1].left+8&&cardBounds[1].right<=cardBounds[2].left+8,'Final cards have minimal overlap: '+JSON.stringify(cardBounds));
await page.screenshot({path:path.join(output,'cinematic-solid-cards.png')});
await page.locator('.gateway-card[href="/motion-lab.html"]').click();await page.waitForURL(u=>u.pathname.endsWith('/motion-lab.html'));record('Particle homepage, pause, scroll chapters and gateway navigation');
record('Shared Playground and Resources menus, all 17 resource links, keyboard dismissal and mobile layout');
await open('lab-tools.html');
assert.equal(await page.locator('header .lab-portfolio').count(),0);
await page.locator('#tool-mode').selectOption('shape');assert.equal(await page.locator('#tool-preview svg path').count(),1);
await page.locator('#tool-mode').selectOption('halftone');assert.ok(await page.locator('#tool-preview svg circle').count()>10);
await page.locator('#design-type').selectOption('booking');await page.locator('[data-proto-next]').click();assert.match(await page.locator('#design-preview h3').textContent(),/Your details/);
await page.locator('[data-proto-next]').click();assert.match(await page.locator('#design-preview h3').textContent(),/booked/);
await page.locator('#contrast-fg').fill('#000000');await page.locator('#contrast-bg').fill('#ffffff');assert.equal(await page.locator('#contrast-ratio').textContent(),'21.00:1');
const exported=page.waitForEvent('download');await page.locator('#design-export').click();assert.equal((await exported).suggestedFilename(),'lab-prototype.html');
record('Public tools: material generator, connected prototype, contrast and HTML export');
await open('scroll-lab.html');
await page.locator('.lab-theme-toggle').waitFor();
assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'dark');
await page.locator('.lab-theme-toggle').click();assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'light');
await page.locator('#aperture-button').click();assert.equal(await page.locator('#aperture-button').getAttribute('aria-pressed'),'true');
await open('motion-lab.html');assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'light');
await page.locator('#lab-phase').fill('78');assert.equal(await page.locator('#lab-phase-value').textContent(),'78%');
await page.locator('.lab-scene-play').click();await page.waitForFunction(()=>document.querySelector('#lab-phase-value').textContent!=='78%');
await page.locator('.lab-scene-play').click();assert.equal(await page.locator('.lab-scene-play').getAttribute('aria-pressed'),'false');
await page.locator('.lab-theme-toggle').click();assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'dark');
await page.screenshot({path:path.join(output,'motion-lab-dark-hero.png')});
await page.locator('.lab-theme-toggle').click();await page.screenshot({path:path.join(output,'motion-lab-light-hero.png')});
await page.locator('.lab-theme-toggle').click();record('Live scene controls and persisted cross-lab theme');
await open('ui-ux-lab.html');await page.locator('.ref-card').first().waitFor();
assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'dark');
assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(16, 17, 16)');
await page.locator('[data-open]').first().click();
assert.equal(await page.locator('#detail-dialog').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(27, 29, 26)');
await page.keyboard.press('Escape');
await page.locator('.lab-theme-toggle').click();
assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'light');
await page.waitForFunction(()=>getComputedStyle(document.body).backgroundColor==='rgb(248, 247, 240)');
await open('ui-zoo.html');assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'light');
await open('scroll-lab.html');assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'light');
await open('ui-ux-lab.html');await page.locator('.ref-card').first().waitFor();
await page.locator('.lab-theme-toggle').click();assert.equal(await page.locator('html').getAttribute('data-lab-theme'),'dark');
record('Catalog dark/light, dialog surfaces, alias and cross-lab persistence');
await page.locator('[data-group="charts"]').click();await page.waitForFunction(()=>document.querySelectorAll('[data-specimen-kind^="chart-"]').length===12);
const chartKinds=new Set();for(let k=0;k<3;k++){for(const kind of await page.locator('[data-specimen-kind^="chart-"]').evaluateAll(els=>els.map(e=>e.dataset.specimenKind)))chartKinds.add(kind);if(k<2)await page.locator('#next-page').click();}assert.equal(chartKinds.size,25);
await page.locator('[data-group="motion"]').click();await page.waitForFunction(()=>document.querySelectorAll('[data-specimen-kind^="motion-"]').length===12);
const motionKinds=new Set(await page.locator('[data-specimen-kind^="motion-"]').evaluateAll(els=>els.map(e=>e.dataset.specimenKind)));await page.locator('#next-page').click();for(const kind of await page.locator('[data-specimen-kind^="motion-"]').evaluateAll(els=>els.map(e=>e.dataset.specimenKind)))motionKinds.add(kind);assert.equal(motionKinds.size,17);
await page.locator('[data-replay]').first().click();assert.equal(await page.locator('[data-animate-preview]').first().getAttribute('data-playing'),'true');
await page.locator('[data-group="ux-guidelines"]').click();await page.waitForFunction(()=>document.querySelectorAll('.ux-pair').length===12);assert.match(await page.locator('.ux-pair').first().textContent(),/Jump to section.*Smooth scroll to section/);await page.locator('[data-open]').first().click();assert.equal(await page.locator('[data-detail-replay]').count(),1);await page.keyboard.press('Escape');
record('25 chart types, 17 motion recipes, UX before-after and replay');
await page.locator('[data-group="typography"]').click();await page.waitForFunction(()=>document.querySelector('#result-status').textContent.startsWith('74 '));
await page.locator('#catalog-search').fill('Playfair');await page.waitForFunction(()=>document.querySelector('#result-status').textContent.includes('matching'));
assert.ok(await page.locator('.ref-card').count()>0);await page.locator('[data-open]').first().click();assert.equal(await page.locator('#detail-dialog').isVisible(),true);await page.locator('#sample-text').fill('A tested idea.');assert.equal(await page.locator('#font-heading').textContent(),'A tested idea.');await page.locator('#sample-size').fill('80');assert.equal(await page.locator('#size-value').textContent(),'80 px');await page.locator('#save-detail').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#detail-dialog').isVisible(),false);await page.locator('#saved-only').click();await page.waitForFunction(()=>document.querySelector('#result-status').textContent.includes('saved'));assert.ok(await page.locator('.ref-card').count()>=1);record('Font preview, size control, saved studies and keyboard dialog');
await page.locator('#reset-filters').click();await page.locator('[data-group="colors"]').click();await page.waitForFunction(()=>document.querySelector('#result-status').textContent.startsWith('194 '));await page.locator('[data-open]').first().click();assert.equal(await page.locator('#copy-detail').textContent(),'Copy CSS');await page.keyboard.press('Escape');
await page.locator('[data-group="stacks"]').click();await page.waitForFunction(()=>document.querySelector('#stack-filter').options.length===23);await page.locator('#stack-filter').selectOption('react');assert.ok((await page.locator('#result-status').textContent()).includes('studies'));await page.locator('#catalog-search').fill('nonexistent-study-000');await page.waitForFunction(()=>document.querySelector('#catalog-grid').textContent.includes('No matching studies'));await page.locator('[data-reset]').click();await page.waitForFunction(()=>document.querySelectorAll('.ref-card').length>0);record('Palette tokens, stack filtering and empty-state recovery');
await open('motion-lab.html');await page.locator('.motion-card').first().waitFor();assert.equal(await page.locator('.motion-card').count(),12);await page.locator('[data-category="Typography"]').click();assert.equal(await page.locator('.motion-card').count(),4);await page.locator('[data-category="All"]').click();
const templateIds=await page.locator('[data-template]').evaluateAll(els=>els.map(e=>e.dataset.template));
for(const id of templateIds){await page.locator('[data-template="'+id+'"]').click();await page.locator('#studio-text').fill('Test <idea> & clarity');await page.locator('#studio-duration').fill('0.5');await page.locator('#studio-progress').fill('100');assert.equal(await page.locator('#studio-progress-value').textContent(),'100%');await page.locator('#studio-play').click();await page.waitForFunction(()=>document.querySelector('#studio-play').textContent==='Play'&&document.querySelector('#studio-progress-value').textContent==='100%');const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#download-motion').click()]);const html=await fs.readFile(await download.path(),'utf8');assert.ok(html.includes('&lt;idea&gt;'));assert.ok(html.includes('&amp;'));for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);exportsMap.set('/__exports/'+id,html);await page.keyboard.press('Escape');}
record('All twelve templates: edit, scrub, play, download and exported syntax');
for(const id of templateIds){await page.goto(base+'__exports/'+id);await page.locator('#timeline').fill('100');await page.locator('#play').click();await page.waitForFunction(()=>document.querySelector('#play').textContent==='Play'&&document.querySelector('#timeline').value==='100');}
record('All twelve standalone exports play independently');
await open('motion-lab.html');await page.locator('[data-template]').first().click();await page.locator('#studio-text').fill('</script><script>window.XSS_TEST=1</script>');const [safeDownload]=await Promise.all([page.waitForEvent('download'),page.locator('#download-motion').click()]);const safeHtml=await fs.readFile(await safeDownload.path(),'utf8');exportsMap.set('/__exports/safety',safeHtml);await page.goto(base+'__exports/safety');assert.equal(await page.evaluate(()=>window.XSS_TEST),undefined);record('Export text remains inert HTML');
await page.emulateMedia({reducedMotion:'reduce'});await open('motion-lab.html');await page.locator('[data-template]').first().hover();assert.notEqual(await page.locator('[data-scene]').first().getAttribute('data-playing'),'true');await page.locator('[data-template]').first().click();await page.locator('#studio-play').click();assert.match(await page.locator('#studio-status').textContent(),/Reduced motion/);await page.locator('#studio-progress').fill('35');assert.equal(await page.locator('#studio-progress-value').textContent(),'35%');record('Reduced motion disables automatic playback but preserves manual control');
await page.emulateMedia({reducedMotion:'no-preference'});await open('scroll-lab.html');for(let i=0;i<6;i++){await page.locator('[data-demo]').nth(i).click();await page.locator('#progress').fill('100');assert.equal(await page.locator('#progress-value').textContent(),'100%');await page.locator('#show-code').click();const html=await page.locator('#source').textContent();exportsMap.set('/__exports/scroll-'+i,html);for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);await page.keyboard.press('Escape');}record('All six scroll experiments and code exports');
await open('ui-ux-experiments.html');await page.locator('#bed').click();assert.equal(await page.locator('#bed').getAttribute('aria-checked'),'true');await page.locator('#snr').fill('100');assert.match(await page.locator('#snv').textContent(),/100/);await page.locator('#fb').click();assert.match(await page.locator('#fc').textContent(),/1/);await page.locator('#hbtn').click();await page.locator('#hbtn').waitFor({state:'visible'});await page.waitForFunction(()=>!document.querySelector('#hbtn').disabled);await page.locator('#w').fill('Test');const [poster]=await Promise.all([page.waitForEvent('download'),page.locator('#dl').click()]);const png=await fs.readFile(await poster.path());assert.equal(png.subarray(1,4).toString(),'PNG');record('Interaction studies and PNG export');
await open('pepper-club.html');await page.locator('[data-add]').first().click();await page.locator('#basket-open').click();assert.match(await page.locator('#basket-items').textContent(),/Green Yuzu/);await page.keyboard.press('Escape');record('Pepper Club basket smoke check');
await open('tiny-games-for-moods.html');for(let i=0;i<14;i++){await page.locator('.card').nth(i).click();assert.equal(await page.locator('#play').isVisible(),true);await page.locator('#back').click();}record('All fourteen game launches');
assert.deepEqual(errors,[],'No uncaught page errors');record('No uncaught browser errors');
await fs.writeFile(path.join(output,'report.json'),JSON.stringify({passed:true,checks:report},null,2));
}catch(error){console.error(error);await fs.writeFile(path.join(output,'report.json'),JSON.stringify({passed:false,error:error.stack,checks:report,pageErrors:errors},null,2));process.exitCode=1;}finally{await browser?.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
