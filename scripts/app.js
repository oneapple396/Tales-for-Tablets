'use strict';
(() => {
  const book=document.querySelector('#book'),view=new BookView(book,STORY),audio=new BookAudio();
  view.activities=new BookActivities(audio);view.render(0);
  const previous=document.querySelector('#previous'),next=document.querySelector('#next'),position=document.querySelector('#position');
  let taps=0;
  const engineTest=new URLSearchParams(location.search).has('engine-test');
  const spreadCount=Math.ceil(STORY.length/2);
  function update(index){
    previous.disabled=index===0;next.disabled=index===spreadCount-1;
    position.textContent=(index*2+1)+'–'+Math.min(index*2+2,STORY.length)+' / '+STORY.length;
    if(engineTest){const probe=document.createElement('button');probe.className='test-control';probe.dataset.interactive='probe';probe.textContent='Test object · '+taps;probe.setAttribute('aria-label','Engine test object; does not turn pages');
    probe.onclick=()=>{taps++;probe.textContent='Test object · '+taps;};book.append(probe);}
    if(index===spreadCount-1){const restart=document.createElement('button');restart.className='test-control';restart.style.left='20px';restart.style.right='auto';restart.textContent='Read again';restart.onclick=()=>{if(!controller.restart())return;view.activities.cancel();audio.stop();view.resetReading();view.render(0);update(0);};book.append(restart);}
  }
  const controller=new BookController({pageCount:spreadCount,turn:async(from,to)=>{audio.stop();audio.playTurn();await view.turn(from,to);}});
  new BookInput(book,controller,audio);
  previous.onclick=()=>{audio.unlock();controller.endHold();controller.requestTurn(-1);};
  next.onclick=()=>{audio.unlock();controller.endHold();controller.requestTurn(1);};
  document.querySelector('#mute').onclick=e=>{audio.unlock();audio.setMuted(!audio.muted);e.currentTarget.textContent=audio.muted?'Sound off':'Sound on';e.currentTarget.setAttribute('aria-pressed',String(audio.muted));};
  book.addEventListener('pagechange',e=>update(e.detail));
  book.addEventListener('pagerestore',e=>update(e.detail));update(0);
})();

