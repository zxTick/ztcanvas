import type { BaseShape } from '../Shapes/base'

export enum ShapeType {
  Rect,
  Arc,
  Line,
}

export interface Size {
  w: number
  h: number
}

export interface baseShape {
  shape: ShapeType
  x: number
  y: number
  renderMode?: 'fill' | 'stroke'
}

export type ShapeClassType = BaseShape<baseShape, {}>

export interface RectShape extends baseShape, Size {}

/**
 * @param {number} x, y 圆心
 * @param {number} radius 半径
 */
export interface ArcShape extends baseShape {
  radius: number
}

export interface LineShape extends baseShape {
  end: { x: number; y: number }
  zIndex: number
  track: { x: number; y: number }[]
  lineWidth?: number
}
