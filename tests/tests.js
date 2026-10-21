(async function () {
  const lines = [];
  function assert(ok, message) { if (!ok) throw Error(message); }
  async function test(name, fn) {
    try { await fn(); lines.push('PASS ' + name); }
    catch (e) { lines.push('FAIL ' + name + ': ' + e.message); }
  }
  function rig(count = 4) {
    let now = 0, seq = 0, jobs = new Map(), finish;
    const turns = [];
    const c = new BookController({pageCount: count,
      turn(a,b) { turns.push([a,b]); return new Promise(r => { finish = r; }); },
      schedule(fn, delay) { jobs.set(++seq, {fn, at: now + delay}); return seq; },
      cancel(id) { jobs.delete(id); }});
    return {c, turns, async finish() { finish(); await Promise.resolve(); await Promise.resolve(); },
      tick(ms) { now += ms; for (const [id,j] of [...jobs]) if(j.at <= now) { jobs.delete(id); j.fn(); } }};
  }
  await test('controller exists', () => assert(typeof BookController === 'function', 'controller missing'));
  if (typeof BookController !== 'undefined') {
    await test('single turn commits once', async () => { const r=rig(); r.c.requestTurn(1); assert(r.c.index===0,'committed early'); await r.finish(); assert(r.c.index===1,'wrong page'); r.tick(5000); assert(r.turns.length===1,'extra turn'); });
    await test('first and last boundaries', async () => { const r=rig(2); assert(!r.c.requestTurn(-1),'underflow'); r.c.requestTurn(1); await r.finish(); assert(!r.c.requestTurn(1),'overflow'); r.c.requestTurn(-1); await r.finish(); assert(r.c.index===0,'backward failed'); });
    await test('rapid opposing requests do not overlap', async () => { const r=rig(); r.c.requestTurn(1); assert(!r.c.requestTurn(-1),'overlap'); assert(!r.c.requestTurn(1),'overlap'); await r.finish(); assert(r.turns.length===1,'queued extra request'); });
    await test('hold waits then repeats after settling', async () => { const r=rig(); r.c.beginHold(1); r.tick(449); assert(!r.turns.length,'early'); r.tick(1); assert(r.turns.length===1,'missing'); r.tick(1000); assert(r.turns.length===1,'overlap'); await r.finish(); r.tick(179); assert(r.turns.length===1,'pause missing'); r.tick(1); assert(r.turns.length===2,'no repeat'); });
    await test('release mid-animation stops subsequent turns', async () => { const r=rig(); r.c.beginHold(1); r.tick(450); r.c.endHold(); await r.finish(); r.tick(5000); assert(r.c.index===1 && r.turns.length===1,'release did not stop'); });
    await test('release before initial delay cancels hold', () => { const r=rig(); r.c.beginHold(1); r.c.endHold(); r.tick(5000); assert(!r.turns.length,'stale hold'); });
    await test('hold stops at book boundary', async () => { const r=rig(2); r.c.beginHold(1); r.tick(450); await r.finish(); r.tick(180); r.tick(5000); assert(r.turns.length===1,'boundary repeated'); });
    await test('failed animation unlocks without committing', async () => { const c=new BookController({pageCount:3,turn:()=>Promise.reject(Error('cancel'))}); c.requestTurn(1); await Promise.resolve(); await Promise.resolve(); assert(c.index===0&&!c.busy,'failed turn corrupted state'); });
    await test('restart is rejected while turning and cancels holds when settled', async()=>{const r=rig();r.c.requestTurn(1);assert(r.c.restart()===false,'restart interrupted turn');await r.finish();r.c.beginHold(1);assert(r.c.restart()===true&&r.c.index===0,'restart failed');r.tick(5000);assert(r.turns.length===1,'restart retained hold');});
  }
  globalThis.testResults = lines;
  if (typeof document !== 'undefined') document.querySelector('pre').textContent = lines.join('\n');
  else { console.log(lines.join('\n')); if(lines.some(x=>x.startsWith('FAIL'))) process.exitCode=1; }
})();
