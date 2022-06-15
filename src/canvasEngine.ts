import { EventHandler } from './EventHandlers'
import type { Rect } from './Shapes/rect'
import type { EventFn, EventName } from './types/event'
import type { baseShape } from './types/shape'

// todo
// 移动元素
// 切换图层

export interface CanvasEngineProps {
  w?: string
  h?: string
  canvasTarget?: string
}

export interface DrawDependencyGraphMap {
  id: symbol
  path2D: Path2D
  shapeInfo: baseShape
}

export interface RenderOptions {
  color?: string
  mode?: 'fill' | 'stroke'
}

export interface CanvasDomInfo {
  canvasHeight: number
  canvasWidth: number
  leftOffset: number
  topOffset: number
}

export class CanvasEngine {
  public canvasDomInfo: CanvasDomInfo = {
    canvasHeight: 0,
    canvasWidth: 0,
    leftOffset: 0,
    topOffset: 0,
  }

  // 绘画图
  private drawDependencyGraphsMap: Map<symbol, DrawDependencyGraphMap>
    = new Map()

  // canvas dom
  private rawCanvasDom: HTMLCanvasElement
  // canvas ctx
  public ctx!: CanvasRenderingContext2D
  // 事件map
  public eventsMap: Map<string, Set<EventFn>> = new Map()
  // 渲染队列
  private renderQueue: { graphical: Rect; options: RenderOptions }[] = []

  private eventHandler

  constructor(public options: CanvasEngineProps) {
    this.rawCanvasDom = this.initCanvasSize(options)
    this.initCtx()
    this.eventHandler = new EventHandler(this)
  }

  private initCanvasSize(options: CanvasEngineProps) {
    const { w, h, canvasTarget } = options
    const canvasDom = document.getElementById(
      canvasTarget || 'canvas',
    ) as HTMLCanvasElement

    if (canvasDom) {
      canvasDom.setAttribute('width', w || '500')
      canvasDom.setAttribute('height', h || '500')
    }
    else {
      throw new Error('请选择正确的 canvas id 获取dom元素')
    }
    this.initCanvasDomInfo(options, canvasDom)
    return canvasDom
  }

  private initCanvasDomInfo(
    options: CanvasEngineProps,
    canvasDom: HTMLCanvasElement,
  ) {
    const { w, h } = options
    const { left, top } = canvasDom.getClientRects()[0]
    this.canvasDomInfo.canvasWidth = Number(w || '500')
    this.canvasDomInfo.canvasHeight = Number(h || '500')
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

  public getCanvasDom(): HTMLCanvasElement {
    return this.rawCanvasDom
  }

  public render(graphical: Rect, options: RenderOptions, isReload = false) {
    if (!isReload) {
      this.drawDependencyGraphsMap.set(graphical.id, graphical)
      this.renderQueue.push({
        graphical,
        options,
      })
      this.reload()
    }
  }

  public addEventListener(graphical: Rect, eventType: EventName, fn: EventFn) {
    this.eventHandler.pushEvent(graphical, eventType, fn)
  }

  public clear(graphical: Rect) {
    const index = this.renderQueue.findIndex(
      it => it.graphical.id === graphical.id,
    )
    if (index === -1) return
    this.renderQueue.splice(index, 1)
    this.emptyEvents(graphical)
    this.reload()
  }

  public emptyEvents(graphical: Rect) {
    const { events } = graphical
    Object.keys(events).forEach((eventName) => {
      this.clearEvents(graphical, eventName as EventName)
    })
  }

  public clearEvents(graphical: Rect, eventType: EventName) {
    const { events } = graphical
    const selfEventSet = events[eventType]
    const eventSet = this.eventsMap.get(eventType)
    if (!selfEventSet || !eventSet) return
    selfEventSet.forEach((fn) => {
      eventSet.delete(fn)
    })
  }

  public reload() {
    this.clearView()
    this.sortRenderQueue()
    this.renderQueue.forEach((render) => {
      render.graphical.render(this, render.options)
    })
  }

  public clearView() {
    const { canvasWidth, canvasHeight } = this.canvasDomInfo
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  }

  public modifyShapeLayer(graphical: Rect, zIndex: number) {
    graphical.zIndex = zIndex
    this.reload()
  }

  get canvasDOM() {
    return this.rawCanvasDom
  }
}
