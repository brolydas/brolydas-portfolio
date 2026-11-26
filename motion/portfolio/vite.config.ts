import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import {resolve} from 'node:path';
const plugin=(motionCanvas as any).default||motionCanvas;
export default defineConfig({
 base:'/assets/portfolio-flow/',
 plugins:[plugin({project:'./src/project.ts'})],
 build:{outDir:resolve('../../assets/portfolio-flow'),emptyOutDir:true,
 rollupOptions:{input:{runtime:resolve('src/runtime.ts')},output:{entryFileNames:'[name].js',chunkFileNames:'chunk-[hash].js'}}}
});