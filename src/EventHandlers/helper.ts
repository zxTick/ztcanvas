import type { CanvasEngine } from '../canvasEngine'
import { warn } from '../helper/warn'
import type { EventName, baseShape } from '../types'
import { ClickEventHandler } from './click'

export function getCanvasCheckApi(ctx: CanvasRenderingContext2D, renderMode: baseShape['renderMode'] = 'fill') {
  const mapping = {
    fill: ctx.isPointInPath,
    stroke: ctx.isPointInStroke,
  }
  return mapping[renderMode].bind(ctx)
}

export function getHandlerByEvtName(engine: CanvasEngine, evtName: EventName) {
  const mapping = {
    click: new ClickEventHandler(engine),
  }
  const instance = mapping[evtName]
  if (!instance)
    warn(`${evtName} is not a valid event name`)
  return instance
}
