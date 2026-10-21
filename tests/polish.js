(async()=>{
 const results=[],out=document.querySelector('#results'),book=document.querySelector('#polish-book'),view=new BookView(book,STORY);
 const assert=(v,m)=>{if(!v)throw Error(m);};
 async function test(name,fn){try{await fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+': '+e.message);}out.textContent=results.join('\n');}
 await test('reading position survives forward and backward page turns',async()=>{view.render(7);const reading=book.querySelector('.page-right .reading');reading.scrollTop=100;const before=reading.scrollTop;assert(before>0,'fixture does not overflow');await view.turn(7,6);await view.turn(6,7);assert(Math.abs(book.querySelector('.page-right .reading').scrollTop-before)<2,'reading position was lost');});
 await test('activity artwork is used in nearby preloading',()=>{view.activities=new BookActivities({unlock(){},playEffect(){}});view.render(5);assert([...view.preloaded.keys()].some(x=>x.endsWith('cockpit-clean.jpg')),'clean activity artwork not preloaded');view.activities.cancel();});
 await test('stationary page restores text without changing manuscript',()=>{assert(book.querySelectorAll(':scope > .page').length===2,'spread lost facing page');assert(book.querySelector('.reading').textContent.includes('WHOOOOOOOSH'),'manuscript changed');});
 await test('Read again starts all passages at the beginning',()=>{view.render(7);book.querySelector('.page-right .reading').scrollTop=120;view.render(6);book.querySelector('.page-left .reading').scrollTop=80;view.resetReading();view.render(0);view.render(7);assert(book.querySelector('.page-right .reading').scrollTop===0,'final passage remains scrolled');view.render(6);assert(book.querySelector('.page-left .reading').scrollTop===0,'earlier passage remains scrolled');});
 view.readingObserver.disconnect();out.textContent+='\n\n'+results.filter(x=>x.startsWith('PASS')).length+'/'+results.length+' passed';
})();
