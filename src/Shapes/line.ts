import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { LineShape } from '../types'
import { ShapeType } from '../types'
import { BaseShape } from './base'

export interface LineOptions {
  x: number
  y: number
  thickness?: number
  zIndex?: number
  lineWidth?: number
}

export class Line extends BaseShape<LineShape, LineOptions> {
  id = Symbol('Line')
  shapeInfo = {} as LineShape

  constructor(
    x: number,
    y: number,
    thickness?: number,
    lineWidth?: number,
    zIndex?: number
  )
  constructor(options: LineOptions)
  constructor(
    options: LineOptions | number,
    y?: number,
    thickness?: number,
    lineWidth?: number,
    zIndex?: number,
  ) {
    super()
    const op = this.generateConfiguration(
      options,
      y,
      thickness,
      lineWidth,
      zIndex,
    )
    this.injectShapeInfo(op)
  }

  generateConfiguration(
    options: LineOptions | number,
    y?: number,
    thickness?: number,
    lineWidth?: number,
    zIndex?: number,
  ) {
    let op: LineOptions
    if (typeof options === 'number') {
      op = {
        x: options,
        y: y!,
        thickness,
        lineWidth,
        zIndex,
      }
    }
    else {
      op = options
    }

    return op
  }

  machiningGraphics(_: LineOptions) { }

  injectShapeInfo(options: LineOptions) {
    const { x, y, zIndex = -1, lineWidth } = options
    this.shapeInfo = {
      x,
      y,
      end: { x, y },
      zIndex,
      shape: ShapeType.Line,
      track: [],
      lineWidth,
      renderMode: 'fill',
    }
  }

  move(toX: number, toY: number) {
    const { x: nowX, y: nowY } = this.shapeInfo.end
    const track = { x: nowX + toX, y: nowY + toY }
    this.shapeInfo.end = track
    this.shapeInfo.track.push(track)
    return this
  }

  render(engine: CanvasEngine, { options: { color = '', mode = 'fill' }, cb }: RenderOptions) {
    engine.ctx.beginPath()
    const len = this.shapeInfo.track.length
    for (let i = 0; i < len; i++) {
      const { x, y } = this.shapeInfo.track[i]
      this.path2D.lineTo(x, y)
    }
    engine.ctx.lineWidth = this.shapeInfo.lineWidth || 1
    if (mode === 'fill') {
      engine.ctx.fillStyle = color
      engine.ctx.fill(this.path2D)
    }
    else if (mode === 'stroke') {
      engine.ctx.strokeStyle = color
      engine.ctx.stroke(this.path2D)
    }

    this.shapeInfo.renderMode = mode
    engine.ctx.closePath()
    cb()
  }
}
