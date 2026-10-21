'use strict';
globalThis.ActivityState=class ActivityState {
  constructor(){this.reset();this.badge=null;try{const saved=JSON.parse(localStorage.getItem('johnny-mission-badge'));if(saved)this.badge=this.cleanBadge(saved);}catch(_){}}
  cleanBadge(b){return {name:String(b.name||'Our mission').slice(0,24),color:/^#[0-9a-f]{6}$/i.test(b.color)?b.color:'#315f94',attached:!!b.attached,strokes:(Array.isArray(b.strokes)?b.strokes:[]).slice(-100).map(s=>({color:/^#[0-9a-f]{6}$/i.test(s.color)?s.color:'#315f94',points:(Array.isArray(s.points)?s.points:[]).filter(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)).slice(0,500).map(p=>p.map(v=>ActivityState.clamp(v)))}))};}
  saveBadge(b){this.badge=this.cleanBadge(b);try{localStorage.setItem('johnny-mission-badge',JSON.stringify(this.badge));}catch(_){}return this.badge;}
  attachBadge(){if(this.badge)this.saveBadge({...this.badge,attached:true});}
  clearBadge(){this.badge=null;try{localStorage.removeItem('johnny-mission-badge');}catch(_){}}
  reset(){this.pages=new Map();this.color='#b8322b';}
  page(index){if(!this.pages.has(index))this.pages.set(index,{found:[],strokes:[],positions:{},value:0,prints:[]});return this.pages.get(index);}
  discover(index,item){const s=this.page(index);if(!s.found.includes(item))s.found.push(item);return s.found.length;}
  setColor(color){if(/^#[0-9a-f]{6}$/i.test(color))this.color=color;}
  addStroke(index,points,color){const s=this.page(index);s.strokes.push({points:points.slice(0,1000),color});if(s.strokes.length>200)s.strokes.shift();}
  static clamp(v,min=0,max=1){return Math.max(min,Math.min(max,v));}
  static angleDelta(from,to){return ((to-from+540)%360)-180;}
};
