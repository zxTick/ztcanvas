import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { ArcShape, Position } from '../types'
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

  constructor(x: number, y: number, radius: number, zIndex: number)
  constructor(options: ArcOptions)
  constructor(
    options: ArcOptions | number,
    y?: number,
    radius?: number,
    zIndex?: number,
  ) {
    super()
    const op = this.generateConfiguration(options, y, radius, zIndex)
    this.injectShapeInfo(op)
    this.machiningGraphics(op)
    this.zIndex = op.zIndex || -1
  }

  generateConfiguration(
    options: ArcOptions | number,
    y?: number,
    radius?: number,
    zIndex?: number,
  ) {
    let op: ArcOptions
    if (typeof options === 'object') {
      op = options
    }
    else if (typeof options === 'number') {
      op = {
        x: options,
        y: y!,
        radius: radius!,
        zIndex: zIndex!,
      }
    }
    return op!
  }

  machiningGraphics(options: ArcOptions) {
    const { x, y, radius } = options
    this.path2D.arc(x, y, radius, 0, Math.PI * 2)
  }

  render(canvasEngine: CanvasEngine, opt: RenderOptions) {
    const {
      options: { color },
      cb,
    } = opt
    canvasEngine.ctx.fillStyle = color || ''
    canvasEngine.ctx.fill(this.path2D)
    cb()
  }

  injectShapeInfo(options: ArcOptions) {
    const { radius, x, y } = options
    const top: Position = {
      x,
      y: y - radius,
    }
    const left = {
      x: x - radius,
      y,
    }
    const right: Position = {
      x: x + radius,
      y,
    }
    const bottom: Position = {
      x,
      y: y + radius,
    }
    this.shapeInfo = {
      ...options,
      shape: ShapeType.Arc,
      top,
      left,
      right,
      bottom,
    }
  }
}
