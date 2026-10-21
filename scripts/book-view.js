'use strict';
globalThis.BookView = class BookView {
  constructor(element, pages) {
    this.element=element; this.pages=pages; this.preloaded=new Map();this.scrollPositions=new Map();
    this.readingObserver=new ResizeObserver(entries=>entries.forEach(({target})=>this.updateReadingHint(target)));
    this.render(0);
  }
  updateReadingHint(reading) {
    this.activities?.layout(reading.parentElement);
    const hint=reading.parentElement.querySelector('.reading-hint');
    if(hint)hint.hidden=reading.scrollHeight-reading.clientHeight-reading.scrollTop<4;
  }
  rememberReading(){for(const reading of this.element.querySelectorAll(':scope > .page .reading'))this.scrollPositions.set(Number(reading.dataset.storyIndex),reading.scrollTop);}
  resetReading(){this.scrollPositions.clear();for(const reading of this.element.querySelectorAll('.reading'))reading.scrollTop=0;}
  restoreReading(){for(const reading of this.element.querySelectorAll('.reading')){reading.scrollTop=this.scrollPositions.get(Number(reading.dataset.storyIndex))||0;this.updateReadingHint(reading);}}
  page(index) {
    const data=this.pages[index]||{title:'The end',text:'Next time, pack lunch.'}, page=document.createElement('article');
    page.className='page '+(index===0?'cover':'interior');
    const label=document.createElement('div');label.className='imprint';label.textContent=index===0?'TALES FOR TABLETS':'JOHNNY BUILDS TO MARS';page.append(label);
    const title=document.createElement('h2');title.textContent=data.title;page.append(title);
    if(data.image){
      page.classList.add('illustrated');
      const figure=document.createElement('figure');figure.className='illustration';
      const img=document.createElement('img');img.src=this.activities?.imageFor(index,data.image)||data.image;img.alt=data.alt||'';img.draggable=false;img.decoding='async';img.width=1024;img.height=1536;
      figure.append(img);page.append(figure);
    }
    const reading=document.createElement('div');reading.className='reading';reading.dataset.interactive='reading';reading.dataset.storyIndex=index;reading.tabIndex=0;reading.setAttribute('role','region');reading.setAttribute('aria-label',data.title+' — story text; scroll to read more');
    // The manuscript's outer quotation marks delimit the supplied passage, not dialogue.
    const displayText=data.text.replace(/^"([\s\S]*)"(?=\s*\n\s*\nTHE END|$)/,'$1');
    for(const line of displayText.split(/\n\s*\n/)){
      const p=document.createElement('p');
      if(line==='THE END')p.className='story-ending';
      else if(line==='Next time, pack lunch.')p.className='story-coda';
      else if(['THE RED COMET','WHOOOOOOOSH!','THUMP!'].includes(line))p.className='story-emphasis';
      for(const [i,part] of line.split('**').entries()){
        if(i%2){const strong=document.createElement('strong');strong.textContent=part;p.append(strong);}
        else p.append(document.createTextNode(part.replace(/^\*|\*$/g,'')));
      }
      reading.append(p);
    }
    page.append(reading);
    const folio=document.createElement('div');folio.className='folio';folio.textContent=index<this.pages.length?String(index+1).padStart(2,'0')+' / '+String(this.pages.length).padStart(2,'0'):'';page.append(folio);
    if(index>0){const hint=document.createElement('span');hint.className='reading-hint';hint.textContent='More story below ↓';hint.hidden=true;hint.setAttribute('aria-hidden','true');folio.prepend(hint);}
    reading.addEventListener('scroll',()=>this.updateReadingHint(reading),{passive:true});
    this.activities?.decorate(page,index);
    return page;
  }
  render(index) {
    this.rememberReading();
    const left=this.page(index*2),right=this.page(index*2+1);
    left.classList.add('page-left');right.classList.add('page-right');
    this.element.replaceChildren(left,right);
    this.restoreReading();
    this.readingObserver.disconnect();
    for(const reading of this.element.querySelectorAll('.reading'))this.readingObserver.observe(reading);
    this.element.dataset.page=String(index*2+1);
    this.element.setAttribute('aria-label','Picture book, pages '+(index*2+1)+'–'+Math.min(index*2+2,this.pages.length)+' of '+this.pages.length);
    for(let i=Math.max(0,index*2-2);i<Math.min(this.pages.length,index*2+6);i++){
      const src=this.activities?.imageFor(i,this.pages[i].image)||this.pages[i].image;if(!src||this.preloaded.has(src))continue;
      const image=new Image();image.src=src;this.preloaded.set(src,image);image.decode().catch(()=>{});
    }
  }
  async turn(from,to) {
    this.rememberReading();
    this.activities?.cancel();
    const el=this.element, forward=to>from, leaf=document.createElement('div');
    leaf.className='leaf '+(forward?'forward':'backward');leaf.setAttribute('aria-hidden','true');
    const front=this.page(from*2+(forward?1:0)),back=this.page(to*2+(forward?0:1));
    front.classList.add('face','front');front.inert=true;
    back.classList.add('face','back');back.inert=true;leaf.append(front,back);
    // Keep the opposite physical page attached while exposing the destination beneath the leaf.
    const revealed=this.page(to*2+(forward?1:0));
    revealed.classList.add(forward?'page-right':'page-left');
    el.querySelector(forward?':scope > .page-right':':scope > .page-left').replaceWith(revealed);
    el.querySelectorAll(':scope > .page').forEach(page=>page.inert=true);
    el.querySelectorAll('.test-control,.halo').forEach(control=>control.remove());
    el.append(leaf);el.classList.add('turning');
    this.restoreReading();
    const angle=forward?[-3,-84,-177]:[3,84,177];
    const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?80:720;
    // Filters/opacity on the leaf flatten preserve-3d and expose mirrored front text.
    // Shade each opaque face independently, leaving the leaf transform-only.
    const shading=[front,back].map(face=>{
      const shade=document.createElement('div');shade.className='turn-shade';face.append(shade);
      return shade.animate([{opacity:0},{opacity:.32,offset:.5},{opacity:0}],{duration,easing:'ease-in-out'});
    });
    const anim=leaf.animate([
      {transform:`rotateY(${angle[0]}deg)`,offset:0},
      {transform:`rotateY(${forward?-38:38}deg) rotateX(-1deg) translateZ(10px)`,offset:.25},
      {transform:`rotateY(${angle[1]}deg) rotateX(-2deg) translateZ(24px)`,offset:.5},
      {transform:`rotateY(${forward?-142:142}deg) rotateX(-1deg) translateZ(10px)`,offset:.75},
      {transform:`rotateY(${angle[2]}deg)`,offset:1}
    ],{duration,easing:'cubic-bezier(.35,.04,.2,1)',fill:'forwards'});
    try {
      await anim.finished;
      this.render(to);
      const halo=document.createElement('div');halo.className='halo';halo.setAttribute('aria-hidden','true');el.append(halo);
      const glow=halo.animate([{opacity:0},{opacity:.48,offset:.25},{opacity:0}],{duration:850});
      glow.finished.then(()=>halo.remove(),()=>halo.remove());
      el.dispatchEvent(new CustomEvent('pagechange',{detail:to}));
    } catch(error) { this.render(from);el.dispatchEvent(new CustomEvent('pagerestore',{detail:from}));throw error; }
    finally { leaf.remove();el.classList.remove('turning');anim.cancel();shading.forEach(animation=>animation.cancel()); }
  }
};
