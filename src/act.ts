import type { CanvasEngine, FillOptions } from './canvasEngine'
import { ShapeType } from './types/shape'
import type { ActShape } from './types/shape'

export interface ActOptions {
  x: number
  y: number
  radius: number
}

export class Act {
  path2D: Path2D = new Path2D()
  id = Symbol('Act')
  figureInformation!: ActShape
  constructor(options: ActOptions) {
    this.injectFigureInformation(options)
    this.machiningGraphics(options)
  }

  machiningGraphics(options: ActOptions) {
    const { x, y, radius } = options
    this.path2D.arc(x, y, radius, 0, Math.PI * 2)
  }

  fill(canvasEngine: CanvasEngine, opt: FillOptions) {
    const { color } = opt
    canvasEngine.ctx.fillStyle = color || ''
    canvasEngine.ctx.fill(this.path2D)
  }

  injectFigureInformation(options: ActOptions) {
    this.figureInformation = { ...options, shape: ShapeType.Act }
  }
}
