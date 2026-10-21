(async()=>{
  const out=[];
  function context(){
    const node=()=>({connect(other){return other;},disconnect(){}});
    return {state:'suspended',sampleRate:100,currentTime:0,destination:node(),
      async resume(){this.state='running';},
      createBuffer(ch,n){return {getChannelData:()=>new Float32Array(n)};},
      createBufferSource(){return Object.assign(node(),{start(){},stop(){this.onended?.();}});},
      createBiquadFilter(){return Object.assign(node(),{frequency:{},Q:{}});},
      createGain(){return Object.assign(node(),{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}}});}};
  }
  const assert=(v,m)=>{if(!v)throw Error(m);};
  async function test(name,fn){try{await fn();out.push('PASS '+name);}catch(e){out.push('FAIL '+name+': '+e.message);}}
  await test('first turn waits for audio resume',async()=>{const a=new BookAudio();a.context=context();await a.playTurn();assert(a.active.size===1,'first rustle missing');});
  await test('mute stops active and suppresses subsequent sound',async()=>{const a=new BookAudio();a.context=context();a.context.state='running';await a.playTurn();a.setMuted(true);await a.playTurn();assert(a.active.size===0,'muted audio active');});
  await test('audio resume failure does not reject navigation',async()=>{const a=new BookAudio();a.context=context();a.context.resume=()=>Promise.reject(Error('blocked'));await a.playTurn();assert(a.active.size===0,'blocked audio played');});
  await test('first activity sound waits for audio resume',async()=>{const a=new BookAudio();a.context=context();await a.playEffect('wood');assert(a.active.size>0,'first activity effect missing');});
  await test('mute cancels a pending effect even after unmuting',async()=>{const a=new BookAudio();a.context=context();let resume;a.context.resume=()=>new Promise(r=>resume=()=>{a.context.state='running';r();});const pending=a.playEffect('wood');a.setMuted(true);a.setMuted(false);resume?.();await pending;assert(a.active.size===0,'stale effect played');});
  if(typeof document!=='undefined'){document.querySelector('#audio-results').textContent=out.join('\n');}
  else{console.log(out.join('\n'));if(out.some(x=>x.startsWith('FAIL')))process.exitCode=1;}
})();
