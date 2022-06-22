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

export interface Position {
  x: number
  y: number
}

export interface RectShape extends baseShape, Size {
  leftCenter: Position
  rightCenter: Position
  bottomCenter: Position
  topCenter: Position
}

/**
 * @param {number} x, y 圆心
 * @param {number} radius 半径
 */
export interface ArcShape extends baseShape {
  radius: number
  top: Position
  left: Position
  right: Position
  bottom: Position
}

export interface LineShape extends baseShape {
  end: { x: number; y: number }
  zIndex: number
  track: { x: number; y: number }[]
  lineWidth?: number
}
