(async()=>{
  const output=document.createElement('pre');document.body.append(output);
  const result=[],assert=(v,m)=>{if(!v)throw Error(m);};
  async function test(name,fn){try{await fn();result.push('PASS '+name);}catch(e){result.push('FAIL '+name+': '+e.message);}output.textContent=result.join('\n');}
  const host=document.createElement('div');host.className='book';host.style.cssText='width:800px;height:500px';document.body.append(host);
  const pages=Array.from({length:6},(_,i)=>({title:'Page '+(i+1),text:'Story '+(i+1)}));
  const view=new BookView(host,pages);
  await test('turning surfaces retain depth and hide reverse lettering',async()=>{
    const turn=view.turn(0,1),leaf=host.querySelector('.leaf'),animation=leaf.getAnimations()[0];
    animation.pause();animation.currentTime=500;
    let error;
    try{
      assert(getComputedStyle(leaf).filter==='none','leaf filter flattens the two page faces');
      for(const face of leaf.querySelectorAll('.face'))assert(getComputedStyle(face).backfaceVisibility==='hidden','reverse lettering visible');
    }catch(e){error=e;}
    animation.finish();await turn;view.render(0);if(error)throw error;
  });
  await test('two facing pages at rest',()=>{assert(host.querySelectorAll(':scope > .page').length===2,'missing facing page');assert(host.textContent.includes('Page 1')&&host.textContent.includes('Page 2'),'wrong initial spread');});
  await test('forward turn keeps opposite page and uses real reverse surface',async()=>{
    const left=host.querySelector('.page-left');const turn=view.turn(0,1);
    assert(left&&left.isConnected,'opposite page disappeared');assert(host.querySelectorAll(':scope > .page').length===2,'underlying page missing');
    assert(host.querySelector('.leaf .back')?.textContent.includes('Page 3'),'reverse face missing story');
    await turn;assert(host.querySelector('.page-left h2')?.textContent==='Page 3','wrong left');assert(host.querySelector('.page-right h2')?.textContent==='Page 4','wrong right');
  });
  await test('backward turn keeps opposite page',async()=>{
    const right=host.querySelector('.page-right');const turn=view.turn(1,0);assert(right&&right.isConnected,'opposite page disappeared');await turn;
    assert(host.querySelector('.page-left h2')?.textContent==='Page 1'&&host.querySelector('.page-right h2')?.textContent==='Page 2','wrong backward spread');
  });
  await test('last spread contains final two pages',()=>{view.render(2);assert(host.querySelector('.page-left h2')?.textContent==='Page 5'&&host.querySelector('.page-right h2')?.textContent==='Page 6','ending spread wrong');});
  await test('odd page count retains a facing endpaper',()=>{const odd=new BookView(host,pages.slice(0,5));odd.render(2);assert(host.querySelectorAll(':scope > .page').length===2,'endpaper absent');assert(host.querySelector('.page-right')?.textContent.includes('The end'),'ending missing');});
  host.remove();
})();
