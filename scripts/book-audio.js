'use strict';
globalThis.BookAudio = class BookAudio {
  constructor(){this.muted=false;this.context=null;this.active=new Set();this.generation=0;this.buffers=new Map();}
  unlock(){
    try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      if(!this.context)this.context=new AC();
      if(this.context.state==='suspended')this.context.resume().catch(()=>{});
    }catch(_){} // Audio unavailability must never prevent reading.
  }
  stop(){this.generation++;for(const source of this.active){try{source.stop();}catch(_){}}}
  setMuted(value){this.muted=value;if(value)this.stop();}
  async playEffect(kind){
    if(this.muted||!this.context)return;
    const generation=this.generation;
    try{
      if(this.context.state==='suspended')await this.context.resume();
      if(this.muted||generation!==this.generation||this.context.state!=='running')return;
      const ctx=this.context,t=ctx.currentTime;
      const settings={metal:[900,.26,.045],wood:[380,.32,.065],click:[1600,.07,.04],focus:[650,.2,.025],pencil:[2400,.2,.035],brush:[1700,.26,.035],bark:[580,.3,.045],engine:[130,.85,.07],landing:[170,.4,.075],step:[500,.16,.045],zip:[2800,.32,.035],rumble:[90,1.1,.065]};
      const [frequency,duration,volume]=settings[kind]||settings.click;
      let buffer=this.buffers.get(kind);
      if(!buffer){buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate);const data=buffer.getChannelData(0);let low=0;
        for(let i=0;i<data.length;i++){const time=i/ctx.sampleRate,phase=i/data.length,noise=Math.random()*2-1;low=.94*low+.06*noise;
          if(kind==='metal')data[i]=(.45*Math.sin(time*2*Math.PI*870)+.25*Math.sin(time*2*Math.PI*1433)+noise*.15)*Math.exp(-phase*7);
          else if(kind==='engine'||kind==='rumble')data[i]=low*3*(.65+.35*Math.sin(time*2*Math.PI*13))+Math.sin(time*2*Math.PI*(kind==='engine'?52:37))*.12;
          else if(kind==='bark')data[i]=(noise*.45+Math.sin(time*2*Math.PI*(190-time*180))*.4)*Math.pow(Math.sin(Math.PI*phase),2);
          else if(kind==='zip')data[i]=noise*(.3+.7*Math.abs(Math.sin(time*2*Math.PI*75)));
          else data[i]=noise*(kind==='step'?Math.exp(-phase*5):.6+.4*Math.sin(Math.PI*phase));
        }this.buffers.set(kind,buffer);
      }
      const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type=kind==='metal'?'highpass':'lowpass';filter.frequency.value=frequency;filter.Q.value=.7;
      gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.02);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
      source.connect(filter).connect(gain).connect(ctx.destination);this.active.add(source);source.onended=()=>{this.active.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};source.start();
    }catch(_){} // Silent play remains fully usable.
  }
  async playTurn(){
    if(this.muted||!this.context)return;
    const generation=this.generation;
    try {
    if(this.context.state==='suspended')await this.context.resume();
    if(this.muted||generation!==this.generation||this.context.state!=='running')return;
    const ctx=this.context,n=ctx.sampleRate*.48,buffer=ctx.createBuffer(1,n,ctx.sampleRate),data=buffer.getChannelData(0);
    let last=0;for(let i=0;i<n;i++){last=.7*last+.3*(Math.random()*2-1);data[i]=last;}
    const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    source.buffer=buffer;filter.type='bandpass';filter.frequency.value=1400+Math.random()*350;filter.Q.value=.5;
    const t=ctx.currentTime;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.12,t+.08);gain.gain.exponentialRampToValueAtTime(.001,t+.46);
    source.connect(filter).connect(gain).connect(ctx.destination);this.active.add(source);
    source.onended=()=>{this.active.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};source.start();
    }catch(_){} // A rejected resume or unavailable audio device must not affect the book.
  }
};
