import { EMPTY_STR, ONE } from './constants'
import './style.css'

class EventUnit {
  name: string
  fun: (...args: any[]) => void
  queued: boolean
  args?: any
  constructor(name: string, fun: (...args: any[]) => void, queued: boolean, args?: any) {
    this.name = name
    this.fun = fun
    this.queued = queued
    this.args = args
  }
}

export class QueueEventEmitter {
  events: Array<EventUnit>
  onany: Array<EventUnit>
  constructor() {
    this.events = []
    this.onany = []
  }
  _removeQueue(e: EventUnit) {
    const i = this.events.indexOf(e);
    i > -1 && this.events.splice(i, ONE);
  }
  emit(name: string, ...args: any[]) {
    const onboard = this.events.filter((e) => e.name == name && e.queued == false);
    const onany = this.onany;
    onany.map((e) => e.fun(name, ...args))
    if (onboard.length > 0) return onboard.map((e) => e.fun(...args));
    this.events.push(new EventUnit(name, () => {}, true, args))
  }
  on(name: string, fun: (...args: any[]) => void) {
    const queued = this.events.filter((e) => e.name == name && e.queued == true)
    this.events.push(new EventUnit(name, fun, false))
    queued.length > 0 && queued.map(e => {
      fun(...e.args)
    })
    queued.map(e => this._removeQueue(e))
  }
  off(name: string) {
    this.events = this.events.filter((e) => e.name != name);
  }
  onAny(fun: (name: string, ...args: any[]) => void) {
    this.onany.push(new EventUnit(EMPTY_STR, fun, false))
  }
  emitAll(...args: any[]) {
    this.onany.push(new EventUnit(EMPTY_STR, () => {}, true, args))
    this.events.map((e) => {
      this.emit(e.name, ...args)
    })
  }
  offAny() {
    this.onany.pop();
  }
}
