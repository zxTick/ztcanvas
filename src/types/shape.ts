export enum ShapeType {
  Rect,
  Act,
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
}

export interface RectShape extends baseShape, Size {}

/**
 * @param {number} x, y 圆心
 * @param {number} radius 半径
 */
export interface ActShape extends baseShape {
  radius: number
}

/**
 * @start {number} x, y 起点
 * @end {number} x, y 终点
 * @thickness {number} 线宽
 * @color {string} 线条颜色
 * @zIndex {number} 层级
 * @track {{x:number, y:number}[]} 轨迹路线图
 */
export interface LineShape extends baseShape {
  end: { x: number; y: number }
  thickness: number
  zIndex: number
  track: { x: number; y: number }[]
}
