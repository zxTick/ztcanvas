import type { CanvasEngine } from '../canvasEngine'
import type { EventFn, ShapeType, ValidEventType } from '../types'
import type { ShapeClassType } from './base'
import { BaseEventHandler } from './base'
import { getCanvasCheckApi } from './helper'

export class ClickEventHandler extends BaseEventHandler {
  constructor(engine: CanvasEngine, graphical: ShapeType) {
    super(engine, graphical)
  }

  track(shape: ShapeClassType, cbFn: EventFn): boolean {
    const fn = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { leftOffset, topOffset } = this.engine.canvasDomInfo
      const { renderMode } = shape.shapeInfo
      const api = getCanvasCheckApi(this.engine.ctx)
      let isIn = false
      const params = {
        x: clientX - leftOffset,
        y: clientY - topOffset,
      }
      if (renderMode === 'fill')
        isIn = api(shape.path2D, params.x, params.y)
      else if (renderMode === 'stroke')
        isIn = api(params.x, params.y)
      if (isIn) cbFn(e)
    }
    this.events.push({
      shape,
      handler: fn,
    })
    return true
  }

  execute(e: ValidEventType, shape: ShapeClassType): boolean {
    const event = this.events.find(item => item.shape.id === shape.id)
    if (!event) return false
    event.handler(e)
    return true
  }
}
