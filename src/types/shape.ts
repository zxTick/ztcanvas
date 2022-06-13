export enum ShapeType {
  Rect,
  Act,
}

export interface Size {
  w: number
  h: number
}

export interface baseShape {
  shape: ShapeType
  x: number
  y: number
}

export interface RectShape extends baseShape, Size {}

/**
 * @param {number} x, y 圆心
 * @param {number} radius 半径
 */
export interface ActShape extends baseShape {
  radius: number
}
