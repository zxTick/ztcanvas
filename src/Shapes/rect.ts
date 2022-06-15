import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { RectShape } from '../types'
import { ShapeType } from '../types'
import { BaseShape } from './base'

export interface RectOptions {
  x: number
  y: number
  w: number
  h: number
  zIndex: number
}

export class Rect extends BaseShape<RectShape, RectOptions> {
  shapeInfo = {} as RectShape
  id = Symbol('Rect')
  constructor(options: RectOptions) {
    super()
    this.injectShapeInfo(options)
    this.machiningGraphics(options)
  }

  protected machiningGraphics(options: RectOptions) {
    const { x, y, w, h } = options
    this.path2D.rect(x, y, w, h)
  }

  protected injectShapeInfo(info: RectOptions) {
    this.shapeInfo = {
      ...info,
      shape: ShapeType.Rect,
    }
  }

  render(canvasEngine: CanvasEngine, options: RenderOptions) {
    const { color } = options
    canvasEngine.ctx.fillStyle = color || ''
    canvasEngine.ctx.fill(this.path2D)
  }
}
