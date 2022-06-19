import type { baseShape } from '../types'

export function getCanvasCheckApi(ctx: CanvasRenderingContext2D, renderMode: baseShape['renderMode'] = 'fill') {
  const mapping = {
    fill: ctx.isPointInPath,
    stroke: ctx.isPointInStroke,
  }
  return mapping[renderMode].bind(ctx)
}
