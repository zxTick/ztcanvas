import { nanoid } from "nanoid";

export interface RectOptions {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class Rect {
  path2D: Path2D = new Path2D();
  id: string = nanoid();
  figureInformation: RectOptions;
  constructor(options: RectOptions) {
    this.machiningGraphics(options);
    this.figureInformation = options;
  }

  private machiningGraphics(options: RectOptions) {
    const { x, y, w, h } = options;
    this.path2D.rect(x, y, w, h);
  }
}
