import type { CanvasEngine } from '../canvasEngine'
import type { EventFn, EventHandlerFn, EventName, NormalEventHandlerFn, ShapeClassType, ValidEventType } from '../types'
import { getHandlerByEvtName } from './helper'

const ownListener = Symbol('ownListener')

type SetWithListener = Set<EventHandlerFn> & {
  [ownListener]?: (e: ValidEventType) => void
}
export class EventHandler {
  engine: CanvasEngine
  eventMap: Map<EventName, SetWithListener> = new Map()
  constructor(engine: CanvasEngine) {
    this.engine = engine
  }

  pushEvent(shape: ShapeClassType, eventName: EventName, cbFn: EventFn) {
    let eventSet = this.eventMap.get(eventName)
    let listener: (e: ValidEventType) => void
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, (eventSet = new Set()))
      listener = (e: ValidEventType) => {
        const evtSet = this.eventMap.get(eventName)
        evtSet?.forEach((evt) => {
          evt(e, shape)
        })
      }
      eventSet[ownListener] = listener
      this.addDomListener(this.engine.canvasDOM, eventName, listener)
    }
    const handlerInstance = this.getFn(eventName, shape, cbFn)
    const event = handlerInstance.execute.bind(handlerInstance)
    eventSet?.add(event)
    // 让 shape 也存在此 listener 的缓存
    let shapeEvents = shape.events[eventName]
    if (!shapeEvents)
      shapeEvents = shape.events[eventName] = new Set()
    shapeEvents.add(event)
    return () => {
      eventSet?.delete(event)
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
    const eventHandlers = shape.events[evtName]
    const eventSet = this.eventMap.get(evtName)
    if (!eventSet) return
    const listener = eventSet[ownListener]
    eventHandlers.forEach((item) => {
      eventSet?.delete(item)
    })
    if (eventSet.size === 0) {
      this.eventMap.delete(evtName)
      this.engine.canvasDOM.removeEventListener(evtName, listener as NormalEventHandlerFn)
    }
  }

  private getFn(eventName: EventName, shape: ShapeClassType, cbFn: EventFn) {
    const handlerInstance = getHandlerByEvtName(this.engine, eventName)
    handlerInstance.track(shape, cbFn)
    return handlerInstance
  }
}
