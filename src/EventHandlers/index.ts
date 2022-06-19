import type { CanvasEngine } from '../canvasEngine'
import type {
  EventFn,
  EventName,
  ShapeClassType,
} from '../types'
import type { BaseEventHandler } from './base'
import { ClickEventHandler } from './click'

type HandlerInstanceCache = {
  [key in EventName]: BaseEventHandler
}

export class EventHandler {
  engine: CanvasEngine
  handlerInstances!: HandlerInstanceCache

  constructor(engine: CanvasEngine) {
    this.engine = engine
    this.initHandlerInstance(this.engine)
  }

  initHandlerInstance(engine: CanvasEngine) {
    this.handlerInstances = {
      click: new ClickEventHandler(engine),
      dblclick: new ClickEventHandler(engine),
    }
  }

  pushEvent(shape: ShapeClassType, eventName: EventName, cbFn: EventFn) {
    const handlerInstance = this.handlerInstances[eventName]
    handlerInstance.track(shape, cbFn)
    // 让 shape 也存在此 listener 的缓存
    let shapeEvents = shape.events[eventName]
    if (!shapeEvents) shapeEvents = shape.events[eventName] = new Set()
    shapeEvents.add(cbFn)
    return () => {
      handlerInstance.removeListener(cbFn)
    }
  }

  removeListener(shape: ShapeClassType, evtName: EventName): void {
    const eventSet = shape.events[evtName]
    if (!eventSet) return
    const handlerInstance = this.handlerInstances[evtName]
    handlerInstance.events = handlerInstance.events.filter(e => e.shape.id === shape.id)
    eventSet.clear()
    handlerInstance.checkEmpty()
  }
}
