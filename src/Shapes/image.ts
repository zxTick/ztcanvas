import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { Position, RectShape } from '../types'
import { ShapeType } from '../types'
import { BaseShape } from './base'

export interface ImageCanvas {
  x: number
  y: number
  w: number
  h: number
  src: string
  zIndex: number
}

export class Img extends BaseShape<RectShape, ImageCanvas> {
  shapeInfo = {} as RectShape & ImageCanvas
  id = Symbol('ImageCanvas')
  constructor(x: number, y: number, w: number, h: number, src: string, zIndex: number)
  constructor(options: ImageCanvas)
  constructor(
    options: ImageCanvas | number,
    y?: number,
    w?: number,
    h?: number,
    src?: string,
    zIndex?: number,
  ) {
    super()
    const completeConfiguration = this.generateConfiguration(
      options,
      y,
      w,
      h,
      src,
      zIndex,
    )
    this.injectShapeInfo(completeConfiguration)
    this.machiningGraphics(completeConfiguration)
  }

  generateConfiguration(
    options: ImageCanvas | number,
    y?: number,
    w?: number,
    h?: number,
    src?: string,
    zIndex?: number,
  ) {
    let completeConfiguration: ImageCanvas
    if (typeof options === 'object') {
      completeConfiguration = options
    }
    else {
      completeConfiguration = {
        x: options,
        y: y!,
        w: w!,
        h: h!,
        src: src!,
        zIndex: zIndex!,
      }
    }
    return completeConfiguration
  }

  protected machiningGraphics(_: ImageCanvas) {

  }

  protected injectShapeInfo(info: ImageCanvas) {
    const { x, y, w, h, src, zIndex } = info
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
      src,
    }

    this.zIndex = zIndex
  }

  render(canvasEngine: CanvasEngine, _: RenderOptions) {
    const image = new Image(this.shapeInfo.w, this.shapeInfo.h)
    image.src = this.shapeInfo.src
    image.onload = () => {
      canvasEngine.ctx.drawImage(image, this.shapeInfo.x, this.shapeInfo.y, this.shapeInfo.w, this.shapeInfo.h)
    }
  }
}
