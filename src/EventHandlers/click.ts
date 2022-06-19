import type { CanvasEngine } from '../canvasEngine'
import type { EventFn, ShapeClassType } from '../types'
import { EventName } from '../types'
import type { TriggerReturnType } from './base'
import { BaseEventHandler } from './base'
import { getCanvasCheckApi } from './helper'

export class ClickEventHandler extends BaseEventHandler {
  eventName = EventName.click

  constructor(engine: CanvasEngine) {
    super(engine)
  }

  track(shape: ShapeClassType, cbFn: EventFn): void {
    if (!this.events.length) this.initDomEventListener()
    const fn = this.trigger(shape, cbFn)
    this.events.push({
      shape,
      handler: fn,
    })
  }

  trigger(shape: ShapeClassType, cbFn: EventFn): TriggerReturnType {
    return (e: MouseEvent) => {
      this.engine.updateCanvasOffset()
      const { clientX, clientY } = e
      const { leftOffset, topOffset } = this.engine.canvasDomInfo
      const { renderMode = 'fill' } = shape.shapeInfo
      const api = getCanvasCheckApi(this.engine.ctx)
      let isIn = false
      const params = {
        x: clientX - leftOffset,
        y: clientY - topOffset,
      }
      if (renderMode === 'fill') isIn = api(shape.path2D, params.x, params.y)
      else if (renderMode === 'stroke') isIn = api(params.x, params.y)
      if (isIn) {
        return {
          shape,
          handler: cbFn.bind(cbFn, e),
        }
      }
      else { return false }
    }
  }
}
