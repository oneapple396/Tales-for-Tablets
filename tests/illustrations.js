(async()=>{
  const illustratedPages=STORY.map(p=>({...p,image:new URL('../'+p.image,location.href).href}));
  const output=document.createElement('pre');document.body.append(output);
  const results=[],assert=(ok,message)=>{if(!ok)throw Error(message);};
  async function test(name,fn){try{await fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+': '+e.message);}output.textContent=results.join('\n');}
  await test('all sixteen story pages have local illustrations and descriptions',()=>{assert(STORY.length===16,'missing pages');assert(STORY.every(p=>p.image?.startsWith('assets/illustrations/')&&p.alt?.length>15),'illustration metadata missing');});
  await test('all illustration files decode',async()=>{for(const p of STORY){assert(p.image,'image missing');const img=new Image();img.src='../'+p.image;await img.decode();assert(img.naturalWidth>=600,'illustration too small');}});
  await test('page renderer includes accessible illustration without replacing manuscript',()=>{const host=document.createElement('div');const view=new BookView(host,illustratedPages);const page=view.page(1),img=page.querySelector('img');assert(img?.getAttribute('src')===illustratedPages[1].image,'illustration absent');assert(img.alt===STORY[1].alt,'alt text missing');assert(page.querySelector('.reading').textContent.includes('One quiet night'),'manuscript lost');});
  await test('turning leaf has illustrated front and back',async()=>{const host=document.createElement('div');host.className='book';document.body.append(host);const view=new BookView(host,illustratedPages);const turn=view.turn(0,1);const leaf=host.querySelector('.leaf');let error;try{assert(leaf.querySelector('.front img')&&leaf.querySelector('.back img'),'turn loses illustration');}catch(e){error=e;}leaf.getAnimations()[0].finish();await turn;host.remove();if(error)throw error;});
})();

