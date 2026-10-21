'use strict';
globalThis.BookInput = class BookInput {
  constructor(book,controller,audio) {
    this.gesture=null;
    const interactive=target=>target.closest('[data-interactive],button,a,input,textarea,select,[contenteditable]');
    const stop=()=>{this.gesture=null;controller.endHold();};
    book.addEventListener('pointerdown',e=>{
      if(this.gesture||e.button!==0||e.isPrimary===false||interactive(e.target))return;
      if(controller.busy)return;
      audio.unlock();
      const r=book.getBoundingClientRect();
      this.gesture={id:e.pointerId,x:e.clientX,y:e.clientY,direction:e.clientX<r.left+r.width/2?-1:1,start:performance.now()};
      try{book.setPointerCapture(e.pointerId);}catch(_){} // Synthetic test pointers are not capturable.
      controller.beginHold(this.gesture.direction);e.preventDefault();
    });
    book.addEventListener('pointermove',e=>{
      const g=this.gesture;if(!g||g.id!==e.pointerId)return;
      if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>10)stop();
    });
    book.addEventListener('pointerup',e=>{
      const g=this.gesture;if(!g||g.id!==e.pointerId)return;
      const short=performance.now()-g.start<450;
      stop();if(short)controller.requestTurn(g.direction);
      if(book.hasPointerCapture(e.pointerId))book.releasePointerCapture(e.pointerId);
    });
    for(const event of ['pointercancel','lostpointercapture'])book.addEventListener(event,e=>{if(this.gesture?.id===e.pointerId)stop();});
    window.addEventListener('blur',stop);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    document.addEventListener('keydown',e=>{
      if(interactive(e.target)||e.repeat||!['ArrowLeft','ArrowRight'].includes(e.key))return;
      e.preventDefault();stop();audio.unlock();controller.requestTurn(e.key==='ArrowRight'?1:-1);
    });
  }
};
