import type { CanvasEngine } from '../canvasEngine'
import type { EventFn, EventName, ValidEventType } from '../types'
import type { ShapeClassType } from './base'
import { getHandlerByEvtName } from './helper'

type EventHandlerFn = (e: ValidEventType, shape: ShapeClassType) => void
type NormalEventHandlerFn = (ev: MouseEvent) => any

export class EventHandler {
  engine: CanvasEngine
  eventMap: Map<EventName, Set<EventHandlerFn>> = new Map()
  constructor(engine: CanvasEngine) {
    this.engine = engine
  }

  pushEvent(shape: ShapeClassType, eventName: EventName, cbFn: EventFn) {
    let eventSet = this.eventMap.get(eventName)
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, (eventSet = new Set()))
      this.addDomListener(this.engine.canvasDOM, eventName, (e) => {
        const evtSet = this.eventMap.get(eventName)
        evtSet?.forEach((evt) => {
          evt(e, shape)
        })
      })
    }
    const handlerInstance = this.getFn(eventName, shape, cbFn)
    eventSet?.add(handlerInstance.execute.bind(handlerInstance))
    return () => {
      eventSet?.delete(handlerInstance.execute.bind(handlerInstance))
    }
  }

  private addDomListener(dom: HTMLElement, eventName: EventName, cbFn: EventHandlerFn) {
    dom.addEventListener(eventName, cbFn as NormalEventHandlerFn)
  }

  clearAll() {
    this.eventMap.forEach((eventSet, eventName) => {
      eventSet.forEach((evt) => {
        this.engine.canvasDOM.removeEventListener(eventName, evt as NormalEventHandlerFn)
      })
    })
  }

  removeListener(shape: ShapeClassType, evtName: EventName) {
    const eventSet = this.eventMap.get(evtName)
    if (!eventSet) return
    eventSet.forEach((evt) => {
      this.engine.canvasDOM.removeEventListener(evtName, evt as NormalEventHandlerFn)
    })
    this.eventMap.delete(evtName)
  }

  private getFn(eventName: EventName, shape: ShapeClassType, cbFn: EventFn) {
    const handlerInstance = getHandlerByEvtName(this.engine, eventName)
    handlerInstance.track(shape, cbFn)
    return handlerInstance
  }
}
