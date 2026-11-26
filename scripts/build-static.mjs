import {cp,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
const destination=path.resolve('_site');await mkdir(destination,{recursive:true});
const excluded=new Set(['_site','.git','.github','node_modules','motion','tests','test-results','scripts','.taste-skill']);
for(const item of await readdir('.',{withFileTypes:true})){if(excluded.has(item.name)||item.name.startsWith('.'))continue;await cp(item.name,path.join(destination,item.name),{recursive:true,filter:p=>!p.split(path.sep).includes('node_modules')});}
console.log('Static site assembled with the compiled GSAP / Motion Canvas runtime.');
