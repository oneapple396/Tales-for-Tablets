(async () => {
  const out=document.querySelector('#integration');
  const results=[];
  const assert=(v,m)=>{if(!v)throw Error(m);};
  const pause=ms=>new Promise(r=>setTimeout(r,ms));
  async function test(name,fn) { try { await fn(); results.push('PASS '+name); } catch(e) { results.push('FAIL '+name+': '+e.message); } out.textContent=results.join('\n'); }
  await test('renderer and input exist',()=>assert(typeof BookView==='function'&&typeof BookInput==='function','renderer/input missing'));
  if(typeof BookView==='undefined'||typeof BookInput==='undefined')return;
  const book=document.querySelector('#test-book');
  const view=new BookView(book,[{title:'One',text:'First page.'},{title:'Facing one',text:'Facing story.'},{title:'Two',text:'Second spread.'},{title:'Facing two',text:'Facing story.'},{title:'Three',text:'Last spread.'},{title:'Facing three',text:'Last page.'}]);
  let sounds=0; const audio={unlock(){},playTurn(){sounds++;}};
  const c=new BookController({pageCount:3,turn:async(a,b)=>{audio.playTurn();await view.turn(a,b);}});
  new BookInput(book,c,audio);
  async function settled(){const until=performance.now()+4000;while(c.busy&&performance.now()<until)await pause(25);assert(!c.busy,'turn did not settle');}
  const fire=(type,x=450,y=40,id=1,target=book)=>target.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:id,isPrimary:id===1,button:0,clientX:book.getBoundingClientRect().left+x,clientY:book.getBoundingClientRect().top+y}));
  await test('short right click commits once and cleans turning layer',async()=>{fire('pointerdown');fire('pointerup');await settled();assert(c.index===1,'wrong page');assert(!book.querySelector('.leaf'),'leaf remains');assert(book.querySelector('h2').textContent==='Two','wrong visible content');assert(sounds===1,'wrong sound count');assert(book.querySelector('.halo'),'no halo');});
  await test('interactive tap and drag never navigate',async()=>{const target=book.querySelector('[data-interactive]');fire('pointerdown',450,40,1,target);fire('pointermove',30,40);fire('pointerup',30,40);await settled();assert(c.index===1&&sounds===1,'interactive gesture navigated');});
  await test('background movement cancels navigation',async()=>{fire('pointerdown');fire('pointermove',400,40);fire('pointerup',400,40);await pause(500);assert(c.index===1,'drag navigated');});
  await test('blur cancels a pending hold',async()=>{fire('pointerdown');window.dispatchEvent(new Event('blur'));await pause(500);fire('pointerup');assert(c.index===1,'blur left hold alive');});
  await test('secondary pointer cannot take over',async()=>{fire('pointerdown',30);fire('pointerdown',450,40,2);fire('pointerup',450,40,2);fire('pointerup',30);await settled();assert(c.index===0,'secondary changed direction');});
  await test('lost capture cancels hold',async()=>{fire('pointerdown');fire('lostpointercapture');await pause(500);fire('pointerup');assert(c.index===0,'lost capture navigated');});
  await test('hold release settles one turn with no trailing click',async()=>{fire('pointerdown');await pause(480);fire('pointerup');await pause(1100);assert(c.index===1,'index='+c.index+' busy='+c.busy+' visible='+book.dataset.page+' hidden='+document.hidden);});
  await test('boundary click has no sound or animation',async()=>{fire('pointerdown');fire('pointerup');await settled();const before=sounds;fire('pointerdown');fire('pointerup');await settled();assert(c.index===2&&sounds===before&&!book.querySelector('.leaf'),'boundary feedback');});
  await test('canceled animation restores original visible page',async()=>{const p=view.turn(2,1);book.querySelector('.leaf').getAnimations()[0]?.cancel();try{await p;}catch(_){}assert(book.querySelector('h2').textContent==='Three','cancellation lost original');assert(!book.querySelector('.leaf'),'canceled leaf remains');});
  await test('halo automatically disappears',async()=>{await pause(900);assert(!book.querySelector('.halo'),'halo stayed visible');});
  await test('manuscript emphasis does not leak markdown markers',()=>{const v=new BookView(document.createElement('div'),[{title:'Cover',text:'Title'},{title:'Ending',text:'**WE FORGOT THE SNACKS!**"'}]);assert(v.page(1).querySelector('p').textContent==='WE FORGOT THE SNACKS!"','raw markdown in story');});
  await test('app controls survive animation cancellation',async()=>{
    const frame=document.createElement('iframe');frame.src='../reader.html?engine-test';document.body.append(frame);await new Promise(r=>frame.onload=r);
    const doc=frame.contentDocument;
    doc.querySelector('#next').click();await pause(800);
    doc.querySelector('#previous').click();doc.querySelector('.leaf').getAnimations()[0].cancel();await pause(100);
    assert(doc.querySelector('[data-interactive="probe"]'),'restored page lost its interactive control');frame.remove();
  });
})();


