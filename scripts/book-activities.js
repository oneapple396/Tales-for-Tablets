'use strict';
// Every scene is built from local art and DOM surfaces. No activity gates the story.
globalThis.BookActivities=class BookActivities {
  constructor(audio){
    this.audio=audio;this.state=new ActivityState();this.jobs=new Set();this.frames=new Set();this.animations=new Set();this.cancellations=new Set();
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener('blur',()=>{this.cancel();this.audio.stop?.();});
    document.addEventListener('visibilitychange',()=>{document.documentElement.classList.toggle('book-paused',document.hidden);if(document.hidden){this.cancel();this.audio.stop?.();}});
  }
  imageFor(index,fallback){const plates={6:'page-07-clean.jpg',7:'page-08-clean.jpg',11:'cockpit-clean.jpg',13:'page-14-clean.jpg',14:'mars-clean.jpg'};return plates[index]?'assets/activities/'+plates[index]:fallback;}
  cancel(){for(const a of this.animations)a.cancel();this.animations.clear();for(const fn of this.cancellations)fn();this.cancellations.clear();for(const id of this.jobs)clearTimeout(id);this.jobs.clear();for(const id of this.frames)cancelAnimationFrame(id);this.frames.clear();}
  frame(node,fn){const id=requestAnimationFrame(time=>{this.frames.delete(id);if(node.isConnected&&!node.closest('[inert]')&&!document.hidden)fn(time);});this.frames.add(id);return id;}
  clearFrame(id){if(id!==undefined){cancelAnimationFrame(id);this.frames.delete(id);}}
  later(node,fn,ms){const id=setTimeout(()=>{this.jobs.delete(id);if(node.isConnected&&!node.closest('[inert]'))fn();},ms);this.jobs.add(id);return id;}
  clearJob(id){if(id!==undefined){clearTimeout(id);this.jobs.delete(id);}}
  sound(kind){this.audio.unlock();this.audio.playEffect?.(kind);}
  animate(node,frames,options={}){if(this.reduced.matches)return;const a=node.animate(frames,{duration:500,easing:'cubic-bezier(.22,.75,.25,1)',...options});this.animations.add(a);a.finished.catch(()=>{}).finally(()=>this.animations.delete(a));return a;}
  element(tag,cls,parent,text){const el=document.createElement(tag);el.className=cls;if(text)el.textContent=text;parent?.append(el);return el;}
  object(parent,name,cell,x,y,size=28){
    const b=this.element('button','story-object',parent);b.type='button';b.dataset.interactive='object';b.setAttribute('aria-label',name);b.title=name;
    Object.assign(b.style,{left:x+'%',top:y+'%',width:size+'%'});
    const col=cell%4,row=Math.floor(cell/4);
    b.innerHTML=`<svg viewBox="${col*250} ${cell===12?700:row*250} 250 ${cell===12?300:250}" aria-hidden="true"><image href="assets/activities/objects.png" width="1000" height="1000"/></svg>`;
    return b;
  }
  layout(page){page.style.setProperty('--art-unit',Math.max(page.clientWidth/1024,page.clientHeight/1536)+'px');}
  anchor(el,rect){
    el.classList.add('art-anchored');const [x,y,w,h]=rect;
    el.style.left='calc((100% - 1024 * var(--art-unit)) * var(--art-focus, .5) + '+x+' * var(--art-unit))';
    el.style.top='calc('+y+' * var(--art-unit))';el.style.width='calc('+w+' * var(--art-unit))';el.style.height='calc('+h+' * var(--art-unit))';return el;
  }
  target(scene,label,cls,rect){const b=this.element('button','art-target '+cls,scene);b.type='button';b.dataset.interactive='art';b.setAttribute('aria-label',label);return this.anchor(b,rect);}
  acknowledge(target){target.classList.add('discovered');this.animate(target,[{boxShadow:'inset 0 0 0 2px #ffe7a8'},{boxShadow:'inset 0 0 0 2px transparent'}],{duration:700});}
  say(scene,text){const caption=scene.querySelector('.activity-caption');if(caption.textContent!==text)caption.textContent=text;}
  drag(el,scene,{start=()=>{},move=()=>{},end=()=>{},key=()=>{}}){
    let gesture=null;
    const point=e=>{const r=scene.getBoundingClientRect();return {x:ActivityState.clamp((e.clientX-r.left)/r.width),y:ActivityState.clamp((e.clientY-r.top)/r.height)};};
    const stop=cancelled=>{if(!gesture)return;const g=gesture;gesture=null;el.classList.remove('held');scene.classList.remove('interacting');this.cancellations.delete(cancel);end(g.last,cancelled,g);try{el.releasePointerCapture(g.id);}catch(_){}};
    const cancel=()=>stop(true);
    el.addEventListener('pointerdown',e=>{if(gesture||e.button!==0||e.isPrimary===false)return;e.preventDefault();e.stopPropagation();this.audio.unlock();gesture={id:e.pointerId,first:point(e),last:point(e)};this.cancellations.add(cancel);el.classList.add('held');scene.classList.add('interacting');try{el.setPointerCapture(e.pointerId);}catch(_){}start(gesture.first,gesture);});
    el.addEventListener('pointermove',e=>{if(gesture?.id!==e.pointerId)return;const p=point(e);move(p,gesture.last,gesture);gesture.last=p;});
    el.addEventListener('pointerup',e=>{if(gesture?.id===e.pointerId)stop(false);});
    for(const event of ['pointercancel','lostpointercapture'])el.addEventListener(event,e=>{if(gesture?.id===e.pointerId)stop(true);});
    el.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();this.audio.unlock();key(e.key);}});
    // Suppress the synthetic click after a drag. Native keyboard actions are handled above.
    el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();});
  }
  movable(el,scene,s,id,onMoved=()=>{},bounds={x:[.05,.8],y:[.1,.72]}){
    const original={x:parseFloat(el.style.left)/100,y:parseFloat(el.style.top)/100};let pos=s.positions[id]||original;
    const draw=()=>{el.style.left=pos.x*100+'%';el.style.top=pos.y*100+'%';};draw();
    const shift=(dx,dy)=>{pos={x:ActivityState.clamp(pos.x+dx,...bounds.x),y:ActivityState.clamp(pos.y+dy,...bounds.y)};s.positions[id]=pos;draw();};
    this.drag(el,scene,{move:(p,last)=>shift(p.x-last.x,p.y-last.y),end:(p,cancelled,g)=>{if(!cancelled&&Math.hypot(p.x-g.first.x,p.y-g.first.y)>.025)onMoved();},key:k=>{shift(k==='ArrowLeft'?-.07:k==='ArrowRight'?.07:['Enter',' '].includes(k)?.15:0,k==='ArrowUp'?-.07:k==='ArrowDown'?.07:0);onMoved();}});
  }
  decorate(page,index){
    page.dataset.storyPage=index+1;page.style.setProperty('--art-focus',({3:.9,4:.9,5:.9,8:.65,9:.8,12:.65})[index]??.5);
    const scene=this.element('div','activity-scene scene-'+index,page);scene.setAttribute('role','group');scene.setAttribute('aria-label','Optional story activity');
    const caption=this.element('div','activity-caption',scene);caption.setAttribute('role','status');caption.setAttribute('aria-live','polite');
    const s=this.state.page(index);
    if(index>=8){page.style.setProperty('--rocket-paint',this.state.color);this.paintAccent(page,index);}
    if(index===0){scene.classList.add('cover-atmosphere');for(let i=0;i<12;i++){const star=this.element('i','twinkle',scene);star.style.left=(12+i*7)%90+'%';star.style.top=(i*13)%40+'%';star.style.animationDelay=i*.37+'s';}caption.remove();return;}
    const methods=['','telescope','sketch','shopping','treasure','garage','assemble','paint','screw','ignition','launch','floatDog','steer','landing','walk','backpack'];
    this[methods[index]](scene,s,page,index);
  }
  paintAccent(page,index){
    const paths={8:'M785 85 Q890 55 985 90 L997 154 Q895 120 780 147Z',10:'M530 251 Q610 210 713 262 L718 287 Q610 238 516 276Z',14:'M135 252 Q225 222 303 246 L310 280 Q230 256 127 285Z',15:'M137 253 Q186 241 232 258 L236 280 Q190 264 131 275Z'};
    if(!paths[index]||this.state.color==='#b8322b')return;
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');svg.classList.add('rocket-color-accent');svg.setAttribute('viewBox','0 0 1024 1536');svg.setAttribute('preserveAspectRatio','xMidYMin slice');svg.setAttribute('aria-hidden','true');path.setAttribute('d',paths[index]);path.setAttribute('fill',this.state.color);svg.append(path);this.anchor(svg,[0,0,1024,1536]);page.querySelector('.illustration').append(svg);
  }
  rocketColor(rocket){rocket.style.setProperty('--paint-hue',this.state.color==='#315f94'?'205deg':this.state.color==='#d6a42c'?'35deg':'0deg');rocket.classList.add('colored-rocket');}
  telescope(scene,s,page){
    
    const scope=this.target(scene,'Focus the telescope — drag or use arrow keys','telescope-target',[535,220,250,150]);
    const lens=this.anchor(this.element('div','mars-lens',scene),[870,55,92,112]);lens.setAttribute('aria-hidden','true');
    const set=value=>{s.value=ActivityState.clamp(value);lens.style.opacity=s.value; this.say(scene,s.value>.85?'Mars! Look at its rocky surface.':'Slide along the telescope to focus on Mars.');};
    this.drag(scope,scene,{move:(p,last)=>set(s.value+(p.x-last.x)*2),end:()=>this.sound('focus'),key:k=>set(s.value+(k==='ArrowLeft'?-0.15:.15))});set(s.value);
  }
  drawing(scene,s,index,paint=false){
    const paper=this.element('div',paint?'paint-surface':'sketch-paper',scene);paper.dataset.interactive='drawing';paper.tabIndex=0;paper.setAttribute('role','group');paper.setAttribute('aria-label',paint?'Paint the rocket — draw with a finger or mouse; Enter adds a stripe':'Sketchbook — draw with a finger or mouse; Enter draws a rocket');
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 300 220');svg.setAttribute('preserveAspectRatio','none');paper.append(svg);
    const path=stroke=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',stroke.points.map(([x,y],i)=>(i?'L':'M')+(x*300)+' '+(y*220)).join(' '));p.setAttribute('stroke',stroke.color);p.setAttribute('stroke-width',paint?'9':'2.2');p.setAttribute('fill','none');p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');svg.append(p);return p;};
    s.strokes.forEach(path);let points=[],line;
    const local=p=>{const sr=scene.getBoundingClientRect(),matrix=svg.getScreenCTM();if(!matrix)return [0,0];const point=new DOMPoint(p.x*sr.width+sr.left,p.y*sr.height+sr.top).matrixTransform(matrix.inverse());return [ActivityState.clamp(point.x/300),ActivityState.clamp(point.y/220)];};
    const finish=()=>{if(points.length>1){this.state.addStroke(index,points,paint?this.state.color:'#4a4036');while(svg.childElementCount>200)svg.firstElementChild.remove();this.sound(paint?'brush':'pencil');this.say(scene,paint?'The Red Comet has your colors!':'A brilliant rocket idea, Johnny!');}else line?.remove();points=[];};
    this.drag(paper,scene,{start:p=>{points=[local(p)];line=path({points,color:paint?this.state.color:'#4a4036'});},move:p=>{if(points.length>=1000)return;points.push(local(p));line.setAttribute('d',points.map(([x,y],i)=>(i?'L':'M')+x*300+' '+y*220).join(' '));},end:()=>finish(),key:k=>{if(k!=='Enter'&&k!==' ')return;points=paint?[[.2,.45],[.8,.45]]:[[.35,.8],[.35,.35],[.5,.1],[.65,.35],[.65,.8],[.35,.8],[.25,.95],[.35,.6]];path({points,color:paint?this.state.color:'#4a4036'});finish();}});
    const erase=this.element('button','activity-reset',scene,paint?'Clear paint':'Clear drawing');erase.type='button';erase.dataset.interactive='erase';erase.setAttribute('aria-label',paint?'Erase paint':'Erase sketch');erase.onclick=()=>{s.strokes=[];svg.replaceChildren();this.say(scene,paint?'Ready for fresh paint.':'A fresh page for your idea.');};
    if(!paint)this.anchor(paper,[322,465,214,103]);return paper;
  }
  sketch(scene,s,page,index){const paper=this.drawing(scene,s,index);this.element('span','sketch-invitation',paper,'✎ Draw here');this.say(scene,'Draw in the open sketchbook with your finger or mouse.');}
  shopping(scene,s,page,index){
    const list=this.anchor(this.element('div','shopping-note',scene),[335,552,272,126]);list.setAttribute('aria-hidden','true');
    const names=['flashlight','duck','paper'],rects=[[800,580,180,120],[685,605,140,145],[580,565,200,95]];
    const reveal=(id,b)=>{this.state.discover(index,id);this.acknowledge(b);if(s.found.length===3){list.classList.add('circled');this.say(scene,'A rubber duck. For emergencies!');this.sound('pencil');}else this.say(scene,s.found.length+' of 3 essentials found.');};
    names.forEach((name,i)=>{const b=this.target(scene,'Find the '+(name==='paper'?'helmet sketch':name),'shopping-item',rects[i]);this.drag(b,scene,{end:(_,cancelled)=>{if(!cancelled)reveal(name,b);},key:k=>{if(k==='Enter'||k===' ')reveal(name,b);}});if(s.found.includes(name))b.classList.add('discovered');});
    if(s.found.length===3)list.classList.add('circled');this.say(scene,'Find the flashlight, duck, and helmet sketch.');
  }
  treasure(scene,s,page,index){
    const names=['toolbox','fan','toaster'],rects=[[505,565,275,175],[855,405,150,165],[805,487,130,80]];
    names.forEach((name,i)=>{const b=this.target(scene,'Find the '+name,'supply-target',rects[i]);b.onclick=()=>{this.state.discover(index,name);this.acknowledge(b);this.sound('wood');this.say(scene,s.found.length===3?'Everything is ready for Johnny’s wagon!':s.found.length+' of 3 supplies found.');};if(s.found.includes(name))b.classList.add('discovered');});
    this.say(scene,'Find the toolbox, fan, and toaster.');
  }
  garage(scene,s,page){
    const cord=this.target(scene,'Switch the hanging garage lamp — tap or press Enter','lamp-target',[725,60,120,100]);
    const shade=this.element('div','garage-shade',scene);shade.setAttribute('aria-hidden','true');
    const draw=()=>{page.classList.toggle('garage-lit',!!s.lit);cord.setAttribute('aria-pressed',String(!!s.lit));};
    const light=()=>{s.lit=!s.lit;draw();this.sound('click');this.say(scene,s.lit?'Mission Control is lit!':'Tap the hanging lamp to turn it on.');};
    this.drag(cord,scene,{end:(_,cancelled)=>{if(!cancelled)light();},key:light});draw();
    const fan=this.target(scene,'Switch the garage fan on or off','fan-target',[855,235,120,145]);
    const blades=this.element('span','fan-blades',fan);blades.setAttribute('aria-hidden','true');blades.innerHTML='<svg viewBox="0 0 100 100"><g fill="#baa77b66"><path d="M50 50Q10 5 40 10Q60 10 50 50M50 50Q95 10 90 40Q90 60 50 50M50 50Q90 95 60 90Q40 90 50 50M50 50Q5 90 10 60Q10 40 50 50"/></g></svg>';
    fan.setAttribute('aria-pressed',String(!!s.fan));fan.classList.toggle('fan-running',!!s.fan);fan.onclick=()=>{s.fan=!s.fan;fan.classList.toggle('fan-running',s.fan);fan.setAttribute('aria-pressed',String(s.fan));this.sound('click');this.say(scene,s.fan?'A breeze blows through the garage.':'The fan slows to a stop.');};this.say(scene,'Tap the hanging lamp or the shelf fan.');
  }
  assemble(scene,s,page,index){
    page.querySelector('.illustration img').src='assets/activities/page-07-clean.jpg';
    const rocket=this.object(scene,'Rocket under construction',11,45,24,59);rocket.disabled=true;rocket.classList.add('rocket-blueprint','upright-rocket');
    const names=['body panel','nose cone','engine housing'],targets=[{x:.66,y:.48},{x:.66,y:.24},{x:.66,y:.72}];
    names.forEach((name,i)=>{const part=this.object(scene,'Fit the '+name+' — drag to rocket or press Enter',4+i,4+i*27,65,22);
      const fit=()=>{this.state.discover(index,name);part.style.left=targets[i].x*100+'%';part.style.top=targets[i].y*100+'%';part.style.width='25%';part.classList.add('fitted');part.disabled=true;rocket.style.opacity=1;this.animate(rocket,[{translate:'0 0'},{translate:'0 2px'},{translate:'0 0'}],{duration:320});this.sound('metal');this.say(scene,s.found.length===3?'All three parts fitted. One splendid rocket!':`${s.found.length} of 3 parts fitted.`);};
      this.drag(part,scene,{move:p=>{part.style.left=(p.x-.12)*100+'%';part.style.top=(p.y-.12)*100+'%';part.style.rotate='-8deg';},end:(p,cancelled)=>{part.style.rotate='';if(!cancelled&&Math.hypot(p.x-targets[i].x-.12,p.y-targets[i].y-.12)<.17)fit();else{part.style.left=4+i*27+'%';part.style.top='65%';}},key:k=>{if(k==='Enter'||k===' ')fit();}});if(s.found.includes(name)){part.style.left=targets[i].x*100+'%';part.style.top=targets[i].y*100+'%';part.style.width='25%';part.disabled=true;part.classList.add('fitted');}
    });rocket.style.opacity=1;this.say(scene,s.found.length===3?'Your rocket is ready!':'Drag each part onto the rocket.');
  }
  paint(scene,s,page,index){
    page.querySelector('.illustration img').src='assets/activities/page-08-clean.jpg';
    const rocket=this.object(scene,'The Red Comet paint surface',11,45,24,59);rocket.disabled=true;rocket.classList.add('paint-rocket','upright-rocket');this.rocketColor(rocket);
    this.drawing(scene,s,index,true);
    const paws=this.element('div','painted-paws',scene);paws.setAttribute('aria-hidden','true');for(let i=0;i<6;i++){const paw=this.element('i','pawprint',paws);paw.style.left=15+i*10+'%';paw.style.top=82+(i%2)*3+'%';paw.style.animationDelay=i*.6+'s';}paws.style.color=this.state.color;
    ['#b8322b','#315f94','#d6a42c'].forEach((color,i)=>{const can=this.object(scene,['Red','Blue','Gold'][i]+' paint',7,4+i*22,70,19);can.style.filter=`hue-rotate(${[0,210,35][i]}deg) drop-shadow(1px 3px 2px #241b1570)`;can.setAttribute('aria-pressed',String(color===this.state.color));can.onclick=()=>{this.state.setColor(color);this.rocketColor(rocket);paws.style.color=color;scene.querySelectorAll('[aria-pressed]').forEach(b=>b.setAttribute('aria-pressed',String(b===can)));this.say(scene,['Red','Blue','Gold'][i]+' paint. Draw on the rocket.');this.sound('click');};});this.say(scene,'Pick a color. Paint the rocket.');
  }
  screw(scene,s){
    const driver=this.target(scene,'Tighten the screw beside Biscuit’s nose — circle it or press Right','screw-target',[565,395,94,74]);let angle=0;
    const set=v=>{s.value=ActivityState.clamp(v,0,720);driver.style.setProperty('--tightness',s.value/720);this.say(scene,s.value>=720?'Biscuit says: woof! Ready to fly.':'Circle the loose screw beside Biscuit’s nose.');};
    const turn=d=>{const before=s.value;set(s.value+d);if(before<720&&s.value>=720){this.sound('bark');this.acknowledge(driver);}};
    const angleAt=p=>{const sr=scene.getBoundingClientRect(),r=driver.getBoundingClientRect();return Math.atan2(p.y*sr.height+sr.top-r.top-r.height/2,p.x*sr.width+sr.left-r.left-r.width/2)*180/Math.PI;};
    this.drag(driver,scene,{start:p=>{angle=angleAt(p);},move:p=>{const next=angleAt(p);turn(ActivityState.angleDelta(angle,next));angle=next;},key:k=>turn(k==='ArrowLeft'?-90:90)});set(s.value);
  }
  ignition(scene,s){
    const display=this.anchor(this.element('output','countdown-display',scene),[750,690,85,78]);display.textContent=s.done?'READY':'10';
    const lever=this.target(scene,'Pull the lever in Johnny’s hand — drag down or press Enter','ignition-target',[775,440,150,210]);let running=false;
    const stop=()=>{running=false;scene.classList.remove('igniting');display.textContent=s.done?'READY':'10';this.cancellations.delete(stop);};
    const ignite=()=>{if(running||s.done)return;running=true;this.cancellations.add(stop);this.sound('engine');scene.classList.add('igniting');let n=10;const tick=()=>{display.textContent=String(n);if(n--<=0){s.done=true;stop();this.say(scene,'Ready for blast off!');return;}this.sound('click');this.later(scene,tick,500);};tick();};
    this.drag(lever,scene,{move:(p,_,g)=>{lever.style.setProperty('--pull',ActivityState.clamp((p.y-g.first.y)*4));},end:(_,cancelled)=>{if(!cancelled)ignite();},key:ignite});this.say(scene,s.done?'Ready for blast off!':'Pull the lever to start the countdown.');
  }
  launch(scene,s,page){
    const throttle=this.element('button','rocket-launch-target',scene);throttle.type='button';throttle.dataset.interactive='rocket';throttle.setAttribute('aria-label','Hold the rocket to launch — or hold Space');
    
    const smoke=this.element('div','launch-smoke',scene);smoke.setAttribute('aria-hidden','true');let held=false,timer;
    const draw=()=>{scene.style.setProperty('--power',s.value);page.querySelector('.illustration img').style.transform=`scale(${1+s.value*.13}) translateY(${s.value*3}%)`;const paint=page.querySelector('.mission-paint-layer');if(paint)paint.style.transform=page.querySelector('.illustration img').style.transform;this.say(scene,s.value>=1?'We’re flying! Goodbye, rooftops!':'Hold the rocket to fly. Release to pause.');};
    const tick=()=>{if(!held)return;s.value=ActivityState.clamp(s.value+.00625);draw();if(s.value<1)timer=this.later(scene,tick,16);};
    const stop=()=>{held=false;this.clearJob(timer);scene.classList.remove('engines-on');this.cancellations.delete(stop);};
    const begin=()=>{if(held)return;if(s.value>=1)s.value=0;held=true;this.cancellations.add(stop);scene.classList.add('engines-on');this.sound('engine');tick();};
    this.drag(throttle,scene,{start:begin,end:stop,key:k=>{if(k===' '||k==='Enter')begin();}});throttle.addEventListener('keyup',stop);throttle.addEventListener('blur',stop);draw();
  }
  floatDog(scene,s,page){
    page.querySelector('.illustration img').src='assets/activities/cockpit-clean.jpg';
    const dog=this.object(scene,'Float Biscuit — drag or use arrow keys',10,10,12,45);let pos=s.positions.dog||{x:.1,y:.12},vx=0,vy=0,spin=s.spin||0;
    const draw=()=>{dog.style.left=pos.x*100+'%';dog.style.top=pos.y*100+'%';dog.style.rotate=spin+'deg';s.positions.dog=pos;s.spin=spin;};draw();
    const shift=(dx,dy)=>{pos={x:ActivityState.clamp(pos.x+dx,0,.55),y:ActivityState.clamp(pos.y+dy,.02,.52)};spin+=dx*100;draw();};let drifting=false,timer,lastFrame=0;
    const stop=()=>{drifting=false;this.clearFrame(timer);this.cancellations.delete(stop);};
    const drift=time=>{if(!drifting)return;const step=Math.min(2,(time-lastFrame)/30);lastFrame=time;vx*=Math.pow(.88,step);vy*=Math.pow(.88,step);shift(vx*step,vy*step);if(Math.abs(vx)+Math.abs(vy)>.0008)timer=this.frame(scene,drift);else stop();};
    this.drag(dog,scene,{start:()=>{stop();vx=vy=0;},move:(p,last)=>{vx=ActivityState.clamp(p.x-last.x,-.06,.06);vy=ActivityState.clamp(p.y-last.y,-.06,.06);shift(vx,vy);},end:(_,cancelled)=>{if(!cancelled&&!this.reduced.matches){drifting=true;lastFrame=performance.now();this.cancellations.add(stop);timer=this.frame(scene,drift);}this.say(scene,'Zero gravity. Biscuit is still unimpressed.');},key:k=>{stop();shift(k==='ArrowLeft'?-.06:k==='ArrowRight'?.06:0,k==='ArrowUp'?-.06:k==='ArrowDown'?.06:0);}});this.say(scene,'Drag Biscuit. Let go to watch him float.');
  }
  steer(scene,s,page){
    const stick=this.target(scene,'Steer with the stick in Johnny’s hands — drag or use arrow keys','steering-target',[543,535,110,160]);const mars=this.element('div','distant-mars',scene),comet=this.element('div','passing-comet',scene);mars.setAttribute('aria-hidden','true');comet.setAttribute('aria-hidden','true');
    let x=s.steerX||0,y=s.steerY||0;
    mars.hidden=true;
    const view=this.element('div','mars-window-layer',page.querySelector('.illustration'));this.anchor(view,[0,0,1024,1536]);const clipId='mars-window-'+Math.random().toString(36).slice(2);view.innerHTML='<svg viewBox="0 0 1024 1536" aria-hidden="true"><defs><clipPath id="'+clipId+'"><path d="M430 278 C400 160 455 50 560 0 L865 0 C980 55 1015 150 1010 260 C1020 450 950 530 775 560 C650 570 575 520 520 470 L515 355 Q490 290 430 278Z"/></clipPath></defs><g clip-path="url(#'+clipId+')"><image href="assets/illustrations/page-13-full.jpg" width="1024" height="1536"/></g></svg>';const space=view.querySelector('image');
    const draw=()=>{space.style.transformOrigin='760px 280px';space.style.transform=`translate(${x*9}px,${y*9}px) scale(${1+s.value*.65})`;};
    const move=(dx,dy)=>{x=ActivityState.clamp(x+dx,-1,1);y=ActivityState.clamp(y+dy,-1,1);s.steerX=x;s.steerY=y;s.value=ActivityState.clamp(s.value+.03);draw();this.say(scene,s.value>=1?'Mars is getting closer!':'Move the stick in Johnny’s hands.');};
    this.drag(stick,scene,{move:(p,last)=>move((p.x-last.x)*5,(p.y-last.y)*5),key:k=>move(k==='ArrowLeft'?-.2:k==='ArrowRight'?.2:0,k==='ArrowUp'?-.2:k==='ArrowDown'?.2:0)});draw();this.say(scene,'Move the stick in Johnny’s hands.');
  }
  landing(scene,s,page){
    page.querySelector('.illustration img').src='assets/activities/page-14-clean.jpg';
    const rocket=this.object(scene,'Guide the landing — drag the rocket or press Enter',11,37,12,43);rocket.classList.add('landing-rocket');this.rocketColor(rocket);const shadow=this.element('div','landing-shadow',scene);shadow.setAttribute('aria-hidden','true');const stick=rocket;
    let x=s.landX??.15;
    const draw=()=>{rocket.style.left=x*60+12+'%';rocket.style.top=(12+s.value*38)+'%';rocket.style.rotate=(-30+(x-.5)*35)+'deg';shadow.style.left=(x*60+19)+'%';shadow.style.filter='blur('+(5-s.value*3)+'px)';shadow.style.opacity=.15+s.value*.4;shadow.style.scale=.5+s.value*.5;};
    const descend=()=>{if(Math.abs(x-.5)<.2){s.value=ActivityState.clamp(s.value+.2);if(s.value>=1){scene.classList.add('landed');this.sound('landing');this.animate(rocket,[{translate:'0 -10px'},{translate:'0 3px'},{translate:'0 0'}]);}}draw();this.say(scene,s.value>=1?'THUMP! A soft landing on Mars.':'Center the rocket. Release to land.');};
    this.drag(stick,scene,{move:(p,last)=>{x=ActivityState.clamp(x+(p.x-last.x)/.6);s.landX=x;draw();},end:(_,cancelled)=>{if(!cancelled)descend();},key:k=>{x=k==='ArrowLeft'?ActivityState.clamp(x-.1):k==='ArrowRight'?ActivityState.clamp(x+.1):.5;s.landX=x;descend();}});draw();if(s.value>=1)scene.classList.add('landed');this.say(scene,s.value>=1?'Welcome to Mars!':'Drag the rocket to the center. Release to land.');
  }
  walk(scene,s,page){
    page.querySelector('.illustration img').src='assets/activities/mars-clean.jpg';
    const ground=this.element('button','walking-ground',scene);ground.type='button';ground.dataset.interactive='ground';ground.setAttribute('aria-label','Walk on Mars — tap the ground or use arrow keys');
    const boy=this.object(scene,'Johnny on Mars',12,30,50,36),dog=this.object(scene,'Biscuit on Mars',10,55,60,30);boy.disabled=true;dog.disabled=true;
    [boy,dog].forEach((character,i)=>{character.innerHTML=`<svg viewBox="${i*768} 0 768 1024" aria-hidden="true"><image href="assets/activities/walkers.png" width="1536" height="1024"/></svg>`;});
    const prints=this.element('div','footprints',scene);prints.setAttribute('aria-hidden','true');
    const footprint=p=>{const mark=this.element('i',p.dog?'pawprint':'bootprint',prints);mark.style.left=p.x*100+'%';mark.style.top=p.y*100+'%';};s.prints.forEach(footprint);
    let pos=s.positions.walk||{x:.3,y:.5};const draw=()=>{boy.style.left=pos.x*100+'%';boy.style.top=pos.y*100+'%';dog.style.left=Math.min(.7,pos.x+.23)*100+'%';dog.style.top=(pos.y+.1)*100+'%';};draw();
    const step=(x,y)=>{const dest={x:ActivityState.clamp(x,.1,.6),y:ActivityState.clamp(y,.5,.6)};for(let i=1;i<=6;i++){const t=i/6,p={x:pos.x+(dest.x-pos.x)*t+.18,y:pos.y+(dest.y-pos.y)*t+.3,dog:false},paw={x:Math.min(.9,p.x+.18),y:p.y+.03,dog:true};s.prints.push(p,paw);footprint(p);footprint(paw);}while(s.prints.length>240){s.prints.shift();prints.firstChild?.remove();}pos=dest;s.positions.walk=pos;draw();this.animate(boy,[{rotate:'-3deg'},{rotate:'3deg'},{rotate:'-3deg'},{rotate:'0deg'}],{duration:700});this.animate(dog,[{translate:'0 0'},{translate:'0 -12px'},{translate:'0 0'}],{duration:450});this.sound('step');this.say(scene,'One small step… and lots of little pawprints!');};
    ground.onclick=e=>{const r=scene.getBoundingClientRect();step((e.clientX-r.left)/r.width-.13,(e.clientY-r.top)/r.height-.22);};ground.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();step(pos.x+(e.key==='ArrowLeft'?-.1:['ArrowRight','Enter',' '].includes(e.key)?.1:0),pos.y+(e.key==='ArrowUp'?-.06:e.key==='ArrowDown'?.06:0));}});this.say(scene,'Tap the ground to walk.');
  }
  backpack(scene,s,page,index){
    const zipper=this.target(scene,'Search Johnny’s backpack — tap or press Enter','backpack-zip',[410,440,240,230]);
    const items=[],names=['flashlight','notebook','rubber duck'],rects=[[445,505,62,77],[500,495,72,82],[570,510,64,70]];
    names.forEach((name,i)=>{const item=this.target(scene,'Search the '+name,'backpack-item',rects[i]);items.push(item);const discover=()=>{this.state.discover(index,name);this.acknowledge(item);if(i<2)items[i+1].hidden=false;this.say(scene,s.found.length===3?'WE FORGOT THE SNACKS!':name==='notebook'?'A notebook. Still no lunch.':'A '+name+'. But no sandwiches.');if(s.found.length===3)this.sound('rumble');};this.drag(item,scene,{end:(_,cancelled)=>{if(!cancelled)discover();},key:k=>{if(['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(k))discover();}});item.hidden=!s.open||(i>0&&!s.found.includes(names[i-1]));if(s.found.includes(name))item.classList.add('discovered');});
    const open=()=>{s.open=true;items[0].hidden=false;zipper.classList.add('unzipped');zipper.hidden=true;this.sound('zip');this.say(scene,'Tap each thing inside. Where is lunch?');};
    this.drag(zipper,scene,{end:(_,cancelled)=>{if(!cancelled)open();},key:open});if(s.open){zipper.classList.add('unzipped');zipper.hidden=true;}this.say(scene,s.found.length===3?'WE FORGOT THE SNACKS!':'Tap the backpack to search for lunch.');
  }
};
