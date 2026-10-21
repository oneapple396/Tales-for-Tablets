(()=>{
 const out=document.createElement('pre');document.body.append(out);const results=[];
 const assert=(ok,message)=>{if(!ok)throw Error(message);};
 function test(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+': '+e.message);}out.textContent=results.join('\n');}
 const view=new BookView(document.createElement('div'),STORY.map(p=>({...p,image:new URL('../'+p.image,location.href).href})));
 const text=p=>p.querySelector('.reading').textContent;
 test('presentation preserves every manuscript word',()=>{
  for(let i=1;i<STORY.length;i++){
   const expected=STORY[i].text.replace(/^"([\s\S]*)"(?=\s*\n\s*\nTHE END|$)/,'$1').replace(/\*/g,'').replace(/\s+/g,'');
   assert(text(view.page(i)).replace(/\s+/g,'')===expected,'changed text on page '+(i+1));
  }
 });
 test('passage wrappers are removed while dialogue remains',()=>{const p=view.page(1);assert(text(p).startsWith('One quiet night'),'opening wrapper remains');assert(text(p).includes("'Not for long,' he whispered."),'dialogue altered');assert(!text(p).endsWith('"'),'closing wrapper remains');});
 test('ending retains punchline and has a distinct closing treatment',()=>{const p=view.page(15);assert(p.querySelector('strong').textContent==="'WE FORGOT THE SNACKS!'",'punchline lost');assert(p.querySelector('.story-ending').textContent==='THE END','ending missing');assert(p.querySelector('.story-coda'),'coda missing');});
 test('reading regions are named and show a cue only for unread overflow',()=>{
  const p=view.page(1),r=p.querySelector('.reading');assert(r.getAttribute('role')==='region'&&r.getAttribute('aria-label').includes(STORY[1].title),'region not named');
  Object.defineProperties(r,{scrollHeight:{value:300},clientHeight:{value:100},scrollTop:{value:0,writable:true}});
  view.updateReadingHint(r);assert(!p.querySelector('.reading-hint').hidden,'missing overflow cue');r.scrollTop=200;view.updateReadingHint(r);assert(p.querySelector('.reading-hint').hidden,'cue remains at end');
 });
 view.readingObserver.disconnect();
})();
