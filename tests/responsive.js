(async()=>{
 const out=document.querySelector('#results'),host=document.querySelector('#host'),results=[];
 const pause=ms=>new Promise(r=>setTimeout(r,ms)),assert=(v,m)=>{if(!v)throw Error(m);};
 for(const [width,height] of [[320,740],[390,844],[768,1024],[1024,768],[1280,800]]){
  const frame=document.createElement('iframe');frame.width=width;frame.height=height;frame.title=`${width} by ${height} book`;frame.src='../reader.html';const ready=new Promise(r=>frame.onload=r);host.append(frame);await ready;
  try{const doc=frame.contentDocument;let minimum=Infinity;
   for(let spread=0;spread<8;spread++){
    const pages=[...doc.querySelectorAll('#book > .page')];assert(pages.length===2,'facing page missing');
    assert(doc.documentElement.scrollWidth<=doc.documentElement.clientWidth+1,'horizontal document overflow '+doc.documentElement.scrollWidth+'/'+doc.documentElement.clientWidth+' '+[...doc.querySelectorAll('body > *')].filter(e=>e.getBoundingClientRect().right>doc.documentElement.clientWidth).map(e=>e.tagName+'.'+e.className+':'+Math.round(e.getBoundingClientRect().right)).join(', '));
    for(const page of pages){const reading=page.querySelector('.reading'),title=page.querySelector('h2'),scene=page.querySelector('.activity-scene'),r=reading.getBoundingClientRect(),t=title.getBoundingClientRect();assert(r.height>=(page.classList.contains('cover')?28:60),`story area too short (${r.height}) on spread ${spread}`);if(!page.classList.contains('cover'))minimum=Math.min(minimum,r.height);assert(t.bottom<=r.top+2,'heading overlaps story');if(!page.classList.contains('cover'))assert(scene.getBoundingClientRect().bottom<=t.top+6,'activity overlaps heading');}
    for(const target of doc.querySelectorAll('.art-target:not([hidden])')){const r=target.getBoundingClientRect(),a=target.closest('.activity-scene').getBoundingClientRect();const w=Math.min(r.right,a.right)-Math.max(r.left,a.left),h=Math.min(r.bottom,a.bottom)-Math.max(r.top,a.top);assert(w>=16&&h>=16,'painted target cropped: '+target.getAttribute('aria-label')+' ('+Math.round(w)+'×'+Math.round(h)+')');}
    if(spread<7){doc.querySelector('#next').click();const deadline=performance.now()+10000;while(doc.querySelector('#book').dataset.page!==String((spread+1)*2+1)&&performance.now()<deadline)await pause(25);assert(doc.querySelector('#book').dataset.page===String((spread+1)*2+1),'navigation did not settle');}
   }
   results.push(`PASS ${width}×${height}: all 8 spreads, two pages, no horizontal overflow or text/activity overlap; minimum story height ${Math.round(minimum)}px`);
  }catch(e){results.push(`FAIL ${width}×${height}: ${e.message}`);}
  frame.remove();out.textContent=results.join('\n');
 }
 out.textContent+='\n\n'+results.filter(x=>x.startsWith('PASS')).length+'/'+results.length+' screen sizes passed';
})();


