import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { Position, RectShape } from '../types'
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
  constructor(x: number, y: number, w: number, h: number, zIndex: number)
  constructor(options: RectOptions)
  constructor(
    options: RectOptions | number,
    y?: number,
    w?: number,
    h?: number,
    zIndex?: number,
  ) {
    super()
    const completeConfiguration = this.generateConfiguration(
      options,
      y,
      w,
      h,
      zIndex,
    )
    this.injectShapeInfo(completeConfiguration)
    this.machiningGraphics(completeConfiguration)
  }

  generateConfiguration(
    options: RectOptions | number,
    y?: number,
    w?: number,
    h?: number,
    zIndex?: number,
  ) {
    let completeConfiguration: RectOptions
    if (typeof options === 'object') {
      completeConfiguration = options
    }
    else {
      completeConfiguration = {
        x: options,
        y: y!,
        w: w!,
        h: h!,
        zIndex: zIndex!,
      }
    }
    return completeConfiguration
  }

  protected machiningGraphics(options: RectOptions) {
    const { x, y, w, h } = options
    this.path2D.rect(x, y, w, h)
  }

  protected injectShapeInfo(info: RectOptions) {
    const { x, y, w, h, zIndex } = info
    const topCenter: Position = { x: (x + w) / 2, y }
    const bottomCenter: Position = { x: (x + w) / 2, y: y + h }
    const leftCenter: Position = { x, y: (y + h) / 2 }
    const rightCenter: Position = { x: x + w, y: (y + h) / 2 }
    this.shapeInfo = {
      ...info,
      shape: ShapeType.Rect,
      topCenter,
      bottomCenter,
      leftCenter,
      rightCenter,
    }

    this.zIndex = zIndex
  }

  render(canvasEngine: CanvasEngine, options: RenderOptions) {
    const {
      options: { color },
      cb,
    } = options
    canvasEngine.ctx.fillStyle = color || ''
    canvasEngine.ctx.fill(this.path2D)
    cb()
  }
}
