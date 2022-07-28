import { EventHandler } from './EventHandlers'
import type { BaseShape } from './Shapes/base'
import type { Rect } from './Shapes/rect'
import type { EventFn, EventName } from './types/event'
import type { ShapeClassType } from './types/shape'

// todo
// 移动元素
// 切换图层

export interface CanvasEngineProps {
  w?: string
  h?: string
  canvasTarget?: string | HTMLCanvasElement
}

export interface DrawDependencyGraphMap {
  id: symbol
  path2D: Path2D
  shapeInfo: BaseShape<unknown, unknown>
}

export interface RenderOptions {
  options: {
    color?: string
    mode?: 'fill' | 'stroke'
  }
  cb: (...args: any[]) => unknown
}

export interface CanvasDomInfo {
  canvasHeight: number
  canvasWidth: number
  leftOffset: number
  topOffset: number
}

export class CanvasEngine {
  private maxZIndex = -1

  public canvasDomInfo: CanvasDomInfo = {
    canvasHeight: 0,
    canvasWidth: 0,
    leftOffset: 0,
    topOffset: 0,
  }

  // 绘画图
  private drawDependencyGraphsMap: Map<symbol, ShapeClassType> = new Map()

  // canvas dom
  private rawCanvasDom!: HTMLCanvasElement
  // canvas ctx
  public ctx!: CanvasRenderingContext2D
  // 事件map
  public eventsMap: Map<string, Set<EventFn>> = new Map()
  // 渲染队列
  private renderQueue: {
    graphical: BaseShape<unknown, unknown>
    options: RenderOptions
  }[] = []

  isRender = false

  private eventHandler

  constructor(public options: CanvasEngineProps) {
    this.initCanvasSize(options)
    this.initCtx()
    this.eventHandler = new EventHandler(this)
  }

  private initCanvasSize(options: CanvasEngineProps) {
    const { w, h, canvasTarget } = options
    const canvasDom = typeof canvasTarget === 'string'
      ? (document.querySelector(
          canvasTarget || '#canvas',
        ) as HTMLCanvasElement)
      : canvasTarget

    if (canvasDom) {
      canvasDom.setAttribute('width', w || '500')
      canvasDom.setAttribute('height', h || '500')
    }
    else {
      throw new Error('请选择正确的 canvas id 获取dom元素')
    }
    this.rawCanvasDom = canvasDom
    this.initCanvasDomInfo(options, canvasDom)
  }

  private initCanvasDomInfo(options: CanvasEngineProps, _: HTMLCanvasElement) {
    const { w, h } = options
    this.canvasDomInfo.canvasWidth = Number(w || '500')
    this.canvasDomInfo.canvasHeight = Number(h || '500')
    this.updateCanvasOffset()
  }

  public updateCanvasOffset() {
    const { left, top } = this.rawCanvasDom.getClientRects()[0]
    this.canvasDomInfo.leftOffset = left
    this.canvasDomInfo.topOffset = top
  }

  private sortRenderQueue() {
    this.renderQueue.sort((a, b) => {
      return a.graphical.zIndex - b.graphical.zIndex
    })
  }

  private initCtx() {
    this.ctx = this.rawCanvasDom.getContext('2d') as CanvasRenderingContext2D
  }

  private renderingQueue() {
    this.sortRenderQueue()
    this.renderQueue.forEach((render) => {
      render.graphical.innerZIndex = ++this.maxZIndex
      render.graphical.beforeRender(this, render.options)
      render.graphical.render(this, render.options)
    })
  }

  public getCanvasDom(): HTMLCanvasElement {
    return this.rawCanvasDom
  }

  public render(
    graphical: ShapeClassType,
    options: RenderOptions['options'],
    cb: RenderOptions['cb'] = () => {},
  ) {
    this.drawDependencyGraphsMap.set(graphical.id, graphical)
    this.renderQueue.push({
      graphical,
      options: {
        options,
        cb,
      },
    })
    this.runRenderTask()
  }

  public addEventListener(
    graphical: ShapeClassType,
    eventType: EventName,
    fn: EventFn,
  ) {
    return this.eventHandler.pushEvent(graphical, eventType, fn)
  }

  public clear(graphical: ShapeClassType) {
    const index = this.renderQueue.findIndex(
      it => it.graphical.id === graphical.id,
    )
    if (index === -1) return
    this.renderQueue.splice(index, 1)
    this.emptyEvents(graphical)
    this.runRenderTask()
  }

  public emptyEvents(graphical: ShapeClassType) {
    const { events } = graphical
    Object.keys(events).forEach((eventName) => {
      this.clearEvents(graphical, eventName as EventName)
    })
  }

  public clearEvents(graphical: ShapeClassType, eventType: EventName) {
    this.eventHandler.removeListener(graphical, eventType)
  }

  public reload() {
    this.clearView()
    this.renderingQueue()
  }

  public clearView() {
    const { canvasWidth, canvasHeight } = this.canvasDomInfo
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  }

  public modifyShapeLayer(graphical: Rect, zIndex: number) {
    graphical.zIndex = zIndex
    this.runRenderTask()
  }

  private runRenderTask() {
    if (!this.isRender) {
      this.isRender = true
      Promise.resolve().then(() => {
        this.reload()
        this.isRender = false
      })
    }
  }

  public getCtx() {
    return this.ctx
  }
}
