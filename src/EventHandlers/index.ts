import type { CanvasEngine } from '../canvasEngine'
import type { EventFn, EventName } from '../types'
import type { ShapeClassType } from './base'
import { getHandlerByEvtName } from './helper'

type EventHandlerFn = () => void

export class EventHandler {
  engine: CanvasEngine
  eventMap: Map<EventName, Set<EventHandlerFn>> = new Map()
  constructor(engine: CanvasEngine) {
    this.engine = engine
  }

  pushEvent(shape: ShapeClassType, eventName: EventName, cbFn: EventFn) {
    let eventSet = this.eventMap.get(eventName)
    if (!this.eventMap.has(eventName)) {
      eventSet = new Set()
      this.eventMap.set(eventName, eventSet)
      this.addDomListener(this.engine.canvasDOM, eventName, () => {
        const evtSet = this.eventMap.get(eventName)
        evtSet?.forEach(evt => evt())
      })
    }
    const handlerInstance = this.getFn(eventName, shape, cbFn)
    eventSet?.add(() => handlerInstance.execute.bind(handlerInstance))
    return () => {
      eventSet?.delete(() => handlerInstance.execute.bind(handlerInstance))
    }
  }

  private addDomListener(dom: HTMLElement, eventName: EventName, cbFn: EventHandlerFn) {
    dom.addEventListener(eventName, cbFn)
  }

  clearAll() {
    this.eventMap.forEach((eventSet, eventName) => {
      eventSet.forEach((evt) => {
        this.engine.canvasDOM.removeEventListener(eventName, evt)
      })
    })
  }

  private getFn(eventName: EventName, shape: ShapeClassType, cbFn: EventFn) {
    const handlerInstance = getHandlerByEvtName(this.engine, eventName)
    handlerInstance.track(shape, cbFn)
    return handlerInstance
  }
}
