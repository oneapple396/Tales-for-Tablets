'use strict';
globalThis.BookController = class BookController {
  constructor({pageCount, turn, schedule = (fn,ms)=>setTimeout(fn,ms), cancel = id=>clearTimeout(id)}) {
    this.count = pageCount; this.turn = turn; this.schedule = schedule; this.cancel = cancel;
    this._index = 0; this._busy = false; this.held = 0; this.timer = null; this.generation = 0;
  }
  get index() { return this._index; }
  get busy() { return this._busy; }
  restart() { if(this._busy)return false;this.endHold();this._index=0;return true; }
  requestTurn(direction) {
    const next = this._index + direction;
    if (this._busy || ![-1,1].includes(direction) || next < 0 || next >= this.count) return false;
    this._busy = true;
    const generation = this.generation;
    const settle = success => {
      if (success) this._index = next;
      this._busy = false;
      if (!success) this.endHold();
      else if (this.held && generation === this.generation) this.queue(180);
    };
    try { Promise.resolve(this.turn(this._index, next)).then(() => settle(true), () => settle(false)); }
    catch (_) { settle(false); }
    return true;
  }
  queue(delay) {
    const token = this.generation;
    this.timer = this.schedule(() => {
      this.timer = null;
      if (token !== this.generation || !this.held) return;
      if (this._busy) { this.queue(180); return; }
      if (!this.requestTurn(this.held)) this.endHold();
    }, delay);
  }
  beginHold(direction) { this.endHold(); this.held = direction; this.queue(450); }
  endHold() { this.generation++; this.held = 0; if(this.timer !== null) this.cancel(this.timer); this.timer = null; }
};
