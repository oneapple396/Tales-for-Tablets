'use strict';
(()=>{
 const proto=BookActivities.prototype,original=proto.decorate;
 const ns='http://www.w3.org/2000/svg';
 function art(badge){const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('aria-hidden','true');const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx','50');circle.setAttribute('cy','50');circle.setAttribute('r','47');circle.setAttribute('fill','#fff3d2');circle.setAttribute('stroke',badge.color);circle.setAttribute('stroke-width','5');svg.append(circle);for(const s of badge.strokes){const path=document.createElementNS(ns,'path');path.setAttribute('d',s.points.map(([x,y],i)=>(i?'L':'M')+(10+x*80)+' '+(10+y*80)).join(' '));path.setAttribute('stroke',s.color);path.setAttribute('stroke-width','3');path.setAttribute('fill','none');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.append(path);}return svg;}
 proto.badgeEditor=function(scene){
  const previous=document.activeElement,dialog=this.element('dialog','badge-editor',document.body);dialog.setAttribute('aria-label','Design your mission badge');
  const draft=JSON.parse(JSON.stringify(this.state.badge||{name:'',color:'#315f94',strokes:[],attached:false}));
  this.element('h2','',dialog,'Draw your mission badge');this.element('p','badge-help',dialog,'Draw in the circle with your finger or mouse. Your drawing will be painted on the rocket and carried to Mars.');
  const label=this.element('label','badge-name',dialog,'Mission name (optional)');const input=this.element('input','',label);input.maxLength=24;input.value=draft.name;input.placeholder='Our mission';
  const canvas=this.element('div','badge-canvas',dialog);canvas.tabIndex=0;canvas.setAttribute('role','group');canvas.setAttribute('aria-label','Draw your badge here, or press Enter to add a star');const guide=this.element('p','badge-draw-guide',dialog,'↓ Draw inside this circle');canvas.before(guide);let active=null;
  const render=()=>{canvas.replaceChildren(art(draft));};render();
  const pos=e=>{const r=canvas.getBoundingClientRect();return [ActivityState.clamp(((e.clientX-r.left)/r.width-.1)/.8),ActivityState.clamp(((e.clientY-r.top)/r.height-.1)/.8)];};
  canvas.onpointerdown=e=>{if(e.button!==0||e.isPrimary===false)return;e.preventDefault();active={id:e.pointerId,color:draft.color,points:[pos(e)]};draft.strokes.push(active);if(draft.strokes.length>100)draft.strokes.shift();try{canvas.setPointerCapture(e.pointerId);}catch(_){}render();};
  canvas.onpointermove=e=>{if(active?.id!==e.pointerId)return;if(active.points.length<500)active.points.push(pos(e));render();};
  canvas.onpointerup=()=>{if(active?.points.length===1)active.points.push([active.points[0][0]+.002,active.points[0][1]]);active=null;render();};canvas.onpointercancel=()=>{active=null;};
  const tools=this.element('div','badge-tools',dialog);const button=(text,fn,parent=tools)=>{const b=this.element('button','',parent,text);b.type='button';b.onclick=fn;return b;};
  const colors=[['Ocean blue','#315f94'],['Rocket red','#b8322b'],['Golden yellow','#d6a42c'],['Leaf green','#4c7851']];
  colors.forEach(([name,color])=>{const b=button(name,()=>{draft.color=color;tools.querySelectorAll('[aria-pressed]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});b.className='badge-color';b.style.background=color;b.setAttribute('aria-label',name);b.setAttribute('aria-pressed',String(color===draft.color));});
  const stamp=()=>{const points=[];for(let i=0;i<=10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?.18:.43;points.push([.5+Math.cos(a)*r,.5+Math.sin(a)*r]);}draft.strokes.push({color:draft.color,points});draft.strokes=draft.strokes.slice(-100);render();};
  button('Add a star',stamp);canvas.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();stamp();}};button('Undo',()=>{draft.strokes.pop();render();});button('Clear drawing',()=>{draft.strokes=[];render();});
  const status=this.element('p','badge-help',dialog,'Saved on this device. You can change or remove it here.');status.setAttribute('role','status');
  const actions=this.element('div','badge-actions',dialog);const close=()=>{dialog.close();dialog.remove();previous?.focus();};
  button('Cancel',close,actions);button('Remove badge',()=>{this.state.clearBadge();this.refreshBadges();this.say(scene,'Badge removed. You can make a new one.');close();},actions);
  const save=button('Save my badge',()=>{if(!draft.strokes.length){status.textContent='Draw something or add a star first.';return;}draft.name=input.value.trim()||'Our mission';this.state.saveBadge(draft);this.refreshBadges();this.sound('pencil');this.say(scene,'Your badge is ready! Put it on the rocket when you build it.');close();},actions);save.className='badge-save';
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.showModal();input.focus();
 };
 proto.refreshBadges=function(){document.querySelectorAll('#book > .page').forEach(p=>this.mountBadge(p,Number(p.dataset.storyPage)-1));};
 proto.mountBadge=function(page,index){
  const scene=page.querySelector('.activity-scene');if(!scene)return;page.querySelectorAll('.mission-badge,.badge-story-action,.mission-flag,.mission-paint-layer').forEach(n=>n.remove());
  const badge=this.state.badge;const action=(label,fn)=>{const b=this.element('button','badge-story-action',scene,label);b.type='button';b.dataset.interactive='badge';b.onclick=fn;return b;};
  if(index===2){action(badge?'Edit your mission badge':'✎ Draw your mission badge',()=>this.badgeEditor(scene));return;}
  if(![6,7,10,13,14,15].includes(index))return;
  if(!badge){if(index===6)action('✎ Draw a mission badge',()=>this.badgeEditor(scene));return;}
  if(index===6&&!badge.attached){action('Put your badge on the rocket',()=>{this.state.attachBadge();this.mountBadge(page,index);this.sound('metal');this.say(scene,'Your '+badge.name+' badge is on the rocket!');});return;}
  // Continuing the story carries a saved badge along even if the fitting step was skipped.
  const model=[6,7,13].includes(index);const b=this.element(model?'span':'button','mission-badge',scene);if(model){b.setAttribute('role','img');}else b.type='button';b.dataset.interactive='badge';b.setAttribute('aria-label',badge.name+' — your mission badge');b.append(art(badge));b.title=badge.name;
  if(index===6||index===7){const rocket=scene.querySelector('.upright-rocket');rocket.append(b);b.classList.add('badge-on-model');}
  else if(index===13){scene.querySelector('.landing-rocket').append(b);b.classList.add('badge-on-model');}
  else if(index===10){const illustration=page.querySelector('.illustration');const layer=this.element('div','mission-paint-layer',illustration);layer.style.transform=illustration.querySelector('img').style.transform;layer.append(b);b.classList.add('badge-painted');this.anchor(b,[560,380,95,95]);}
  else if(index===15)this.anchor(b,[470,525,82,82]);
  else{const flag=this.element('div','mission-flag',scene);this.anchor(flag,[345,430,130,270]);this.element('span','flag-ground-shadow',flag).setAttribute('aria-hidden','true');this.element('span','flag-pole',flag).setAttribute('aria-hidden','true');flag.append(b);this.element('span','flag-soil',flag).setAttribute('aria-hidden','true');flag.classList.toggle('planted',!!this.state.page(14).flag);b.setAttribute('aria-label','Plant your '+badge.name+' flag on Mars');}
  b.onclick=e=>{e.stopPropagation();if(index===14){this.state.page(14).flag=true;b.parentElement.classList.add('planted');this.say(scene,'Your '+badge.name+' flag made it to Mars!');}else this.say(scene,'That’s your '+badge.name+' badge — all the way from your sketchbook!');this.animate(b,[{scale:'1'},{scale:'1.15'},{scale:'1'}]);this.sound('click');};
 };
 proto.decorate=function(page,index){original.call(this,page,index);const scene=page.querySelector('.activity-scene');
  if(index===0){scene.classList.add('stars-awake');const b=this.element('button','cover-star-button',scene,'✦');b.type='button';b.dataset.interactive='star';b.setAttribute('aria-label','Make the stars shimmer');const caption=this.element('div','activity-caption',scene,'The stars are shining. Your adventure is ready.');caption.setAttribute('role','status');b.onclick=()=>{scene.classList.add('stars-awake');this.animate(b,[{scale:'1'},{scale:'1.6',rotate:'90deg'},{scale:'1',rotate:'180deg'}]);caption.textContent='Your adventure is ready. Choose Next to begin!';this.sound('focus');};}
  this.mountBadge(page,index);
 };
})();



