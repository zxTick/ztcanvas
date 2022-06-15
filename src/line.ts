import type { CanvasEngine, RenderOptions } from "./canvasEngine";
import { Noop } from "./types";
import type { LineShape } from "./types/shape";
import { ShapeType } from "./types/shape";

export interface LineOptions {
  x: number;
  y: number;
  thickness?: number;
  zIndex?: number;
}

export class Line {
  figureInformation = {} as LineShape;
  path2D: Path2D = new Path2D();
  id = Symbol("Line");
  noop: Noop = {};
  zIndex = -1;
  constructor(options: LineOptions) {
    this.injectFigureInformation(options);
  }

  injectFigureInformation({ x, y, thickness = 1, zIndex = -1 }: LineOptions) {
    this.figureInformation = {
      x,
      y,
      end: { x, y },
      thickness,
      zIndex,
      shape: ShapeType.Line,
      track: [],
    };
  }

  move(toX: number, toY: number) {
    const { x: nowX, y: nowY } = this.figureInformation.end;
    const track = { x: nowX + toX, y: nowY + toY };
    this.figureInformation.end = track;
    this.figureInformation.track.push(track);
    return this;
  }

  /**
   * line fill function
   *
   * @param engine canvasEngine
   * @param fillOptions fillOptions
   * @description 若前后不闭合，采用 stroke 绘制， 反之采用 fill 绘制
   */
  render(engine: CanvasEngine, { color = "", mode = "fill" }: RenderOptions) {
    engine.ctx.beginPath();
    const len = this.figureInformation.track.length;
    for (let i = 0; i < len; i++) {
      const { x, y } = this.figureInformation.track[i];
      this.path2D.lineTo(x, y);
    }
    if (mode === "fill") {
      engine.ctx.fillStyle = color;
      engine.ctx.fill(this.path2D);
    } else if (mode === "stroke") {
      engine.ctx.strokeStyle = color;
      engine.ctx.stroke(this.path2D);
    }

    engine.ctx.closePath();
  }
}
