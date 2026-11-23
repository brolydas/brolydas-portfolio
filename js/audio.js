// A single opt-in audio bus. No sound is started by page load or scrolling.
export class PortfolioAudio {
  constructor(){this.enabled=false;this.context=null;this.buffers=new Map();this.pending=new Map();this.lastCue=0;this.ambient=[];this.visibility=()=>{if(this.context){if(document.hidden)this.context.suspend();else if(this.enabled)this.context.resume().catch(()=>{});}};document.addEventListener('visibilitychange',this.visibility);}
  async enable(){
    try{const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return false;if(!this.context){this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=.17;const limiter=this.context.createDynamicsCompressor();limiter.threshold.value=-16;limiter.ratio.value=8;this.master.connect(limiter);limiter.connect(this.context.destination);}await this.context.resume();this.enabled=true;return true;}catch{return false;}
  }
  disable(){this.enabled=false;this.stopAmbient();this.context?.suspend().catch(()=>{});}
  async load(name,url){if(this.buffers.has(name))return this.buffers.get(name);if(this.pending.has(name))return this.pending.get(name);const task=fetch(url).then(r=>{if(!r.ok)throw Error('Audio unavailable');return r.arrayBuffer();}).then(b=>this.context.decodeAudioData(b)).then(b=>{this.buffers.set(name,b);return b;}).catch(()=>null);this.pending.set(name,task);return task;}
  cue(kind='switch'){
    if(!this.enabled||!this.context||document.hidden)return;
    const now=this.context.currentTime;if(now-this.lastCue<.075)return;this.lastCue=now;
    const buffer=this.buffers.get(kind);
    if(buffer){const source=this.context.createBufferSource();source.buffer=buffer;source.connect(this.master);source.start();return;}
    const osc=this.context.createOscillator(),gain=this.context.createGain();osc.type='sine';const freq=kind==='open'?220:kind==='close'?130:330;osc.frequency.setValueAtTime(freq,now);osc.frequency.exponentialRampToValueAtTime(freq*.5,now+.12);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.28,now+.006);gain.gain.exponentialRampToValueAtTime(.0001,now+.16);osc.connect(gain);gain.connect(this.master);osc.start(now);osc.stop(now+.18);osc.onended=()=>{osc.disconnect();gain.disconnect();};
  }
  startAmbient(){if(!this.enabled||!this.context||this.ambient.length)return;const now=this.context.currentTime;[55,82.41].forEach((f,i)=>{const o=this.context.createOscillator(),g=this.context.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(i?.045:.065,now+1.4);o.connect(g);g.connect(this.master);o.start();this.ambient.push({o,g});});}
  stopAmbient(){for(const {o,g}of this.ambient){try{o.stop();}catch{}o.disconnect();g.disconnect();}this.ambient=[];}
  prepareCues(){if(this.context)for(const k of ['switch','open','close'])this.load(k,`/audio/${k}.wav`);}
  dispose(){this.stopAmbient();document.removeEventListener('visibilitychange',this.visibility);this.context?.close();}
}
