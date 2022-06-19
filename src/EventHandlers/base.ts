import type { CanvasEngine } from '../canvasEngine'
import { warn } from '../helper/warn'
import type { EventFn, EventName, ShapeClassType, ValidEventType } from '../types'

interface ShouldTriggerEvent { shape: ShapeClassType; handler: EventFn }

export type TriggerReturnType = (event: ValidEventType) => false | ShouldTriggerEvent

export interface EventBase {
  shape: ShapeClassType
  handler: TriggerReturnType
}

/**
 * EventHandler 基类
 */
export abstract class BaseEventHandler {
  abstract eventName: EventName
  engine: CanvasEngine
  events: EventBase[] = []
  domEventListener!: EventFn | null
  constructor(engine: CanvasEngine) {
    this.engine = engine
  }
  /**
   * 收集事件处理函数
   *
   * @param shape 图形
   * @returns {boolean} 是否收集成功
   */
  abstract track(shape: ShapeClassType, cbFn: EventFn): void

  /**
   * 触发事件的处理函数，注意：该函数只能由 track 函数所调用
   * @param shape 图形
   * @param cbFn 事件的处理函数
   * @returns TriggerReturnType 返回一个函数或者 false
   */
  protected abstract trigger(shape: ShapeClassType, cbFn: EventFn): TriggerReturnType

  /**
   * 初始化的时候，为 canvas dom 添加对应的事件监听
   */
  protected initDomEventListener() {
    const dom = this.engine.getCanvasDom()
    this.domEventListener = (e: ValidEventType) => {
      // 根据 shape.zIndex 进行排序，然后只需要触发图层最大的那一个就好了
      const shouldTriggerEvents: ShouldTriggerEvent[] = []
      this.events.forEach((i) => {
        const res = i.handler(e)
        if (res) shouldTriggerEvents.push(res)
      })
      shouldTriggerEvents.sort((a, b) => b.shape.innerZIndex - a.shape.innerZIndex)
      if (shouldTriggerEvents.length) {
        const { handler } = shouldTriggerEvents[0]
        handler(e)
      }
    }
    dom.addEventListener(this.eventName, this.domEventListener)
  }

  /**
   * 根据传入的 fn ，删除此 fn
   * @param fn 事件处理函数
   */
  removeListener(fn: EventFn) {
    const index = this.events.findIndex(evt => evt.handler === fn)
    if (index === -1)
      return warn(`${this.eventName} 事件监听函数不存在`)
    this.events.splice(index, 1)
  }

  /**
   * 判断 event 是否为空，如果为空，则取消此 dom 的事件监听
   */
  checkEmpty() {
    if (!this.events.length) {
      const dom = this.engine.getCanvasDom()
      dom.removeEventListener(this.eventName, this.domEventListener!)
      this.domEventListener = null
    }
  }
}
