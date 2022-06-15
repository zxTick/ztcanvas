import type { CanvasEngine } from '../canvasEngine'
import type { BaseShape } from '../Shapes/base'
import type { EventFn, ValidEventType, baseShape } from '../types'

export interface EventBase {
  shape: ShapeClassType
  handler: EventFn
}

export type ShapeClassType = BaseShape<baseShape, {}>

/**
 * EventHandler 基类
 */
export abstract class BaseEventHandler {
  engine: CanvasEngine
  events: EventBase[] = []
  constructor(engine: CanvasEngine) {
    this.engine = engine
  }
  /**
   * 收集事件处理函数
   *
   * @param shape 图形
   * @returns {boolean} 是否收集成功
   */
  abstract track(shape: ShapeClassType, cbFn: EventFn): boolean
  /**
   * 触发事件处理函数
   *
   * @param shape 图形
   * @returns 是否触发成功
   */
  abstract execute(e: ValidEventType, shape: ShapeClassType): boolean
}
