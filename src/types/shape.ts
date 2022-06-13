export enum ShapeType {
  Rect,
  Act,
}

export interface Size {
  w: number;
  h: number;
}

export interface baseShape {
  shape: ShapeType;
  x: number;
  y: number;
}

export interface RectShape extends baseShape, Size {}
