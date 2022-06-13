import { FillOptions } from "./canvasEngine";
import { CanvasEngine } from "./canvasEngine";

export interface RectOptions {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class Rect {
  path2D: Path2D = new Path2D();
  id: symbol = Symbol();
  figureInformation: RectOptions;
  constructor(options: RectOptions) {
    this.machiningGraphics(options);
    this.figureInformation = options;
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
}
