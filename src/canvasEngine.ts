import { Rect, RectOptions } from "./rect";
import { EventFn, EventName } from "./types/event";
import { baseShape } from "./types/shape";

// 1. 链表模拟图层
// 删除一个元素就是全部重新渲染

export interface CanvasEngineProps {
  w?: string;
  h?: string;
  canvasTarget?: string;
}

export interface DrawDependencyGraphMap {
  id: symbol;
  path2D: Path2D;
  // todo 这个类型要换
  figureInformation: baseShape;
}

export interface FillOptions {
  color?: string;
}

export class CanvasEngine {
  // 绘画图
  private drawDependencyGraphsMap: Map<symbol, DrawDependencyGraphMap> =
    new Map();
  // canvas dom
  private rawCanvasDom: HTMLCanvasElement;
  // canvas ctx
  public ctx!: CanvasRenderingContext2D;
  // 事件map
  public eventsMap: Map<string, Set<EventFn>> = new Map();
  // 渲染队列
  private renderQueue: { graphical: Rect; options: FillOptions }[] = [];

  constructor(public options: CanvasEngineProps) {
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

  public fill(
    graphical: Rect,
    options: FillOptions,
    isReload: boolean = false
  ) {
    const { color } = options;
    this.ctx.fillStyle = color || "";
    this.ctx.fill(graphical.path2D);
    if (!isReload) {
      this.drawDependencyGraphsMap.set(graphical.id, graphical);
      this.renderQueue.push({
        graphical,
        options,
      });
    }
  }

  addEventListener(graphical: Rect, eventType: EventName, fn: EventFn) {
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

    let eventsNoopSet = graphical.noop[eventType];
    if (!eventsNoopSet) {
      eventsNoopSet = graphical.noop[eventType] = new Set();
    }
    eventsNoopSet.add(noop);

    return () => {
      const eventSet = this.eventsMap.get(eventType);
      eventSet?.delete(noop);
    };
  }
  clear(graphical: Rect) {
    const index = this.renderQueue.findIndex(
      (it) => it.graphical.id === graphical.id
    );
    if (index === -1) return;
    this.renderQueue.splice(index, 1);
    this.emptyEvents(graphical);
    this.reload();
  }
  emptyEvents(graphical: Rect) {
    const { noop } = graphical;
    Object.keys(noop).forEach((eventName) => {
      this.clearEvents(graphical, eventName as EventName);
    });
  }
  clearEvents(graphical: Rect, eventType: EventName) {
    const { noop } = graphical;
    const selfEventSet = noop[eventType];
    const eventSet = this.eventsMap.get(eventType);
    if (!selfEventSet || !eventSet) return;
    selfEventSet.forEach((fn) => {
      eventSet.delete(fn);
    });
  }
  reload() {
    this.clearView();
    this.renderQueue.forEach((render) => {
      this.fill(render.graphical, render.options, true);
    });
  }

  clearView() {
    this.ctx.clearRect(0, 0, Number(this.options.w), Number(this.options.h));
  }
}
