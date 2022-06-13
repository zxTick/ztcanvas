import { Rect, RectOptions } from "./rect";

export interface CanvasEngineProps {
  w?: string;
  h?: string;
  canvasTarget?: string;
}

export interface DrawDependencyGraphMap {
  id: symbol;
  path2D: Path2D;
  // todo
  figureInformation: RectOptions;
}

export interface FillOptions {
  color?: string;
}

type EventFn = (event: Event) => void;

export class CanvasEngine {
  private drawDependencyGraphsMap: Map<symbol, DrawDependencyGraphMap> =
    new Map();
  private rawCanvasDom: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
  eventsMap: Map<string, Set<EventFn>> = new Map();

  constructor(options: CanvasEngineProps) {
    this.rawCanvasDom = this.initCanvasSize(options);
    this.initCtx();
  }

  private initCanvasSize(options: CanvasEngineProps) {
    const { w, h, canvasTarget } = options;
    const canvasDom = document.getElementById(
      canvasTarget || "canvas"
    ) as HTMLCanvasElement;

    if (canvasDom) {
      canvasDom.setAttribute("width", w || "500");
      canvasDom.setAttribute("height", h || "500");
    } else {
      throw new Error("请选择正确的 canvas id 获取dom元素");
    }
    return canvasDom;
  }
  private initCtx() {
    this.ctx = this.rawCanvasDom.getContext("2d") as CanvasRenderingContext2D;
  }

  public getCanvasDom(): HTMLCanvasElement {
    return this.rawCanvasDom;
  }

  public fill(graphical: Rect, options: FillOptions) {
    const { color } = options;
    this.ctx.fillStyle = color || "";
    this.ctx.fill(graphical.path2D);
    this.drawDependencyGraphsMap.set(graphical.id, graphical);
  }

  addEventListener(graphical: Rect, eventType: string, fn: EventFn) {
    const noop = (e: any) => {
      const isHas = this.ctx.isPointInPath(
        graphical.path2D,
        e.clientX,
        e.clientY
      );
      if (isHas) {
        fn(e);
      }
    };

    if (this.eventsMap.has(eventType)) {
      const eventSet = this.eventsMap.get(eventType);
      eventSet?.add(noop);
    } else {
      this.eventsMap.set(eventType, new Set([noop]));
      this.rawCanvasDom.addEventListener(eventType, (e) => {
        const events = this.eventsMap.get(eventType);
        events?.forEach((fn) => {
          fn(e);
        });
      });
    }

    return () => {
      const eventSet = this.eventsMap.get(eventType);
      eventSet?.delete(noop);
    };
  }
}
