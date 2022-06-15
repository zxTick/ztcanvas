import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { ArcShape } from '../types'
import { ShapeType } from '../types'
import { BaseShape } from './base'

export interface ArcOptions {
  x: number
  y: number
  radius: number
  zIndex: number
}

export class Arc extends BaseShape<ArcShape, ArcOptions> {
  id = Symbol('Arc')
  shapeInfo = {} as ArcShape
  constructor(options: ArcOptions) {
    super()
    this.injectShapeInfo(options)
    this.machiningGraphics(options)
    this.zIndex = options.zIndex || -1
  }

  machiningGraphics(options: ArcOptions) {
    const { x, y, radius } = options
    this.path2D.arc(x, y, radius, 0, Math.PI * 2)
  }

  render(canvasEngine: CanvasEngine, opt: RenderOptions) {
    const { color } = opt
    canvasEngine.ctx.fillStyle = color || ''
    canvasEngine.ctx.fill(this.path2D)
  }

  injectShapeInfo(options: ArcOptions) {
    this.shapeInfo = { ...options, shape: ShapeType.Arc }
  }
}
