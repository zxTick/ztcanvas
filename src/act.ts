import type { CanvasEngine, RenderOptions } from './canvasEngine'
import { ShapeType } from './types/shape'
import type { ActShape } from './types/shape'
import type { Noop } from './types/event'

export interface ActOptions {
  x: number
  y: number
  radius: number
  zIndex: number
}
export class Act {
  path2D: Path2D = new Path2D()
  id = Symbol('Act')
  figureInformation!: ActShape
  noop: Noop = {}
  zIndex = -1
  constructor(options: ActOptions) {
    this.injectFigureInformation(options)
    this.machiningGraphics(options)
    this.zIndex = options.zIndex || -1
  }

  machiningGraphics(options: ActOptions) {
    const { x, y, radius } = options
    this.path2D.arc(x, y, radius, 0, Math.PI * 2)
  }

  render(canvasEngine: CanvasEngine, opt: RenderOptions) {
    const { color } = opt
    canvasEngine.ctx.fillStyle = color || ''
    canvasEngine.ctx.fill(this.path2D)
  }

  injectFigureInformation(options: ActOptions) {
    this.figureInformation = { ...options, shape: ShapeType.Act }
  }
}
