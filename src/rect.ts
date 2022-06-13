import { FillOptions } from "./canvasEngine";
import { CanvasEngine } from "./canvasEngine";
import { RectShape, ShapeType } from "./types/shape";

export interface RectOptions {
  x: number;
  y: number;
  shape: "";
  w: number;
  h: number;
}

export class Rect {
  path2D: Path2D = new Path2D();
  id: symbol = Symbol();
  figureInformation!: RectShape;
  constructor(options: RectOptions) {
    this.machiningGraphics(options);
    this.injectFigureInformation(options);
  }

  private machiningGraphics(options: RectOptions) {
    const { x, y, w, h } = options;
    this.path2D.rect(x, y, w, h);
  }

  public fill(canvasEngine: CanvasEngine, options: FillOptions) {
    const { color } = options;
    canvasEngine.ctx.fillStyle = color || "";
    canvasEngine.ctx.fill(this.path2D);
  }

  private injectFigureInformation(options: RectOptions) {
    this.figureInformation = {
      ...options,
      shape: ShapeType.Rect,
    };
  }
}
