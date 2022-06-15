import type { CanvasEngine, RenderOptions } from './canvasEngine'
import type { Noop } from './types/event'
import type { RectShape } from './types/shape'
import { ShapeType } from './types/shape'

export interface RectOptions {
  x: number
  y: number
  w: number
  h: number
  zIndex: number
}

export class Rect {
  path2D: Path2D = new Path2D()
  id = Symbol('Rect')
  figureInformation!: RectShape
  noop: Noop = {}
  zIndex = -1
  constructor(options: RectOptions) {
    this.machiningGraphics(options)
    this.injectFigureInformation(options)
    this.zIndex = options.zIndex || -1
  }

  private machiningGraphics(options: RectOptions) {
    const { x, y, w, h } = options
    this.path2D.rect(x, y, w, h)
  }

  public render(canvasEngine: CanvasEngine, options: RenderOptions) {
    const { color } = options
    canvasEngine.ctx.fillStyle = color || ''
    canvasEngine.ctx.fill(this.path2D)
  }

  private injectFigureInformation(options: RectOptions) {
    this.figureInformation = {
      ...options,
      shape: ShapeType.Rect,
    }
  }
}
