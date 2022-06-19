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
    this.zIndex = info.zIndex
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
