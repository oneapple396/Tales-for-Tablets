'use strict';
// A low-resolution heat field: buoyant transport, lateral turbulence and cooling.
// The renderer maps temperature to light, rather than animating flame silhouettes.
class FireField {
  constructor(width=100,height=100,random=Math.random){this.width=width;this.height=height;this.random=random;this.heat=new Float32Array(width*height);this.next=new Float32Array(width*height);}
  step(time){
    const w=this.width,h=this.height,a=this.heat,b=this.next;
    for(let y=0;y<h-2;y++)for(let x=0;x<w;x++){
      const altitude=1-y/h;
      // Backtrace a buoyant, rotating flow. Neighbor mixing lets flames join;
      // cool pockets stretch and detach their tips as each hot parcel rises.
      const drift=altitude*(Math.sin(x*.105+y*.10-time*2.7)*1.6+Math.sin(x*.18-y*.075+time*1.9)*.8);
      const lift=1.1+a[y*w+x]*1.8+.5*Math.sin(x*.13+time*2+y*.08);
      const xx=Math.max(1,Math.min(w-2,x+drift)),yy=Math.min(h-1,y+lift);
      const ix=Math.floor(xx),iy=Math.floor(yy),fx=xx-ix,fy=yy-iy,iy2=Math.min(h-1,iy+1);
      const v=(a[iy*w+ix]*(1-fx)+a[iy*w+ix+1]*fx)*(1-fy)+(a[iy2*w+ix]*(1-fx)+a[iy2*w+ix+1]*fx)*fy;
      const mix=(a[iy*w+ix-1]+a[iy*w+ix+1])*.5;
      const pocket=Math.max(0,Math.sin(x*.22+y*.15-time*3.4)*Math.sin(y*.17+time*2.1));
      b[y*w+x]=Math.max(0,(v*.91+mix*.09)*(.991-altitude*.008)-.003-pocket*altitude*.025);
    }
    for(let y=h-2;y<h;y++)for(let x=0;x<w;x++){
      let fuel=.17*Math.exp(-Math.pow((x/w-.5)/.29,4));
      for(let k=0;k<4;k++){const center=w*(.23+k*.18+.035*Math.sin(time*(.8+k*.13)+k*4));
        const pulse=.32+.5*Math.pow(.5+.5*Math.sin(time*(2.3+k*.31)+k*2.4),2);
        const width=w*(.06+.022*Math.sin(time*1.7+k));
        fuel+=Math.exp(-Math.pow((x-center)/width,2))*pulse;}
      b[y*w+x]=Math.min(1,Math.max(0,fuel+this.random()*.055));
    }
    this.heat=b;this.next=a;
  }
}
if(typeof module!=='undefined')module.exports={FireField};
if(typeof document!=='undefined')(()=>{
  const canvas=document.querySelector('#fire');if(!canvas)return;
  const ctx=canvas.getContext('2d'),button=document.querySelector('#fire-toggle');
  if(!ctx){button.hidden=true;return;}
  const field=new FireField(100,110),buffer=document.createElement('canvas');buffer.width=100;buffer.height=110;
  const bc=buffer.getContext('2d'),pixels=bc.createImageData(100,110),motion=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=motion.matches,frame=0,last=0,time=0;
  const sparks=Array.from({length:12},()=>({x:Math.random(),phase:Math.random(),speed:.15+Math.random()*.18}));
  function draw(){
    const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
    const glow=ctx.createRadialGradient(w*.5,h*.88,0,w*.5,h*.8,w*.65);glow.addColorStop(0,'#e7772548');glow.addColorStop(1,'#b64b0000');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    for(let i=0;i<field.heat.length;i++){
      const v=field.heat[i],j=i*4;
      pixels.data[j]=255;pixels.data[j+1]=Math.min(255,45+v*310);pixels.data[j+2]=Math.max(0,(v-.35)*390);pixels.data[j+3]=Math.min(255,Math.max(0,(v-.12)*570));
    }
    bc.putImageData(pixels,0,0);ctx.save();ctx.globalCompositeOperation='screen';ctx.filter='blur(1px)';ctx.drawImage(buffer,w*.08,h*.02,w*.84,h*.83);ctx.filter='blur(8px)';ctx.globalAlpha=.25;ctx.drawImage(buffer,w*.08,h*.02,w*.84,h*.83);ctx.restore();
    // Soot-darkened brick joints catch the low amber light.
    ctx.save();ctx.globalCompositeOperation='destination-over';ctx.strokeStyle='#79604b35';ctx.lineWidth=1;
    for(let row=0;row<7;row++){const y=row*h/7;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();for(let col=0;col<5;col++){const x=(col+(row%2)*.5)*w/4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h/7);ctx.stroke();}}ctx.restore();
    // Charred logs sit in front of the heat, with thin glowing fissures.
    for(let i=0;i<3;i++){ctx.save();ctx.translate(w*(.28+i*.22),h*(.88+(i%2)*.025));ctx.rotate((i-1)*.15);const bark=ctx.createLinearGradient(0,-10,0,10);bark.addColorStop(0,'#634536');bark.addColorStop(.4,'#302d28');bark.addColorStop(1,'#171e20');ctx.fillStyle=bark;ctx.beginPath();ctx.roundRect(-w*.22,-9,w*.44,20,7);ctx.fill();ctx.strokeStyle='#ca672c80';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-w*.17,-5);ctx.lineTo(-w*.04,-3);ctx.lineTo(w*.07,-6);ctx.lineTo(w*.16,-4);ctx.stroke();ctx.strokeStyle='#a1744b55';for(let grain=0;grain<4;grain++){ctx.beginPath();ctx.moveTo(-w*.19,grain*4-7);ctx.bezierCurveTo(-w*.08,grain*4-10,w*.08,grain*4-4,w*.18,grain*4-7);ctx.stroke();}ctx.fillStyle='#65503a';ctx.beginPath();ctx.ellipse(w*.19,1,4,8,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    for(let i=0;i<23;i++){const x=w*(.15+i/32),pulse=.4+.3*Math.sin(time*2+i*4);ctx.fillStyle=`rgba(244,113,40,${pulse})`;ctx.beginPath();ctx.ellipse(x,h*(.95+.01*Math.sin(i)),2.4,1.3,0,0,Math.PI*2);ctx.fill();}
    for(const s of sparks){const age=(time*s.speed+s.phase)%1;ctx.fillStyle=`rgba(255,193,95,${(1-age)*.5})`;ctx.beginPath();ctx.arc(w*(.25+s.x*.5)+Math.sin(time+s.phase*12)*8,h*(.83-age*.7),.7,0,Math.PI*2);ctx.fill();}
  }
  function tick(now){if(paused||document.hidden){frame=0;return;}if(now-last>=33){last=now;time+=1/30;field.step(time);draw();}frame=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(frame);frame=0;button.textContent=paused?'Play fireplace':'Pause fireplace';button.setAttribute('aria-pressed',String(paused));if(!paused&&!document.hidden)frame=requestAnimationFrame(tick);}
  for(let i=0;i<160;i++)field.step(i/30);draw();
  button.onclick=()=>{paused=!paused;sync();};motion.addEventListener('change',()=>{paused=motion.matches;sync();});document.addEventListener('visibilitychange',sync);window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));sync();
})();

