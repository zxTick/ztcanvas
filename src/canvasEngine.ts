import type { Rect } from './rect'
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
  // todo 这个类型要换
  figureInformation: baseShape
}

export interface RenderOptions {
  color?: string
  mode?: 'fill' | 'stroke'
}

export class CanvasEngine {
  public canvasHeight!: number
  public canvasWidth!: number
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

  constructor(public options: CanvasEngineProps) {
    this.rawCanvasDom = this.initCanvasSize(options)
    this.initCtx()
  }

  private initCanvasSize(options: CanvasEngineProps) {
    const { w, h, canvasTarget } = options
    const canvasDom = document.getElementById(
      canvasTarget || 'canvas',
    ) as HTMLCanvasElement

    if (canvasDom) {
      canvasDom.setAttribute('width', w || '500')
      canvasDom.setAttribute('height', h || '500')
      this.canvasWidth = Number(w || '500')
      this.canvasHeight = Number(h || '500')
    }
    else {
      throw new Error('请选择正确的 canvas id 获取dom元素')
    }
    return canvasDom
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

  public render(
    graphical: Rect,
    options: RenderOptions,
    isReload = false,
  ) {
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
    const noop = (e: any) => {
      const isHas = this.ctx.isPointInPath(
        graphical.path2D,
        e.clientX,
        e.clientY,
      )
      if (isHas)
        fn(e)
    }

    if (this.eventsMap.has(eventType)) {
      const eventSet = this.eventsMap.get(eventType)
      eventSet?.add(noop)
    }
    else {
      this.eventsMap.set(eventType, new Set([noop]))
      this.rawCanvasDom.addEventListener(eventType, (e) => {
        const events = this.eventsMap.get(eventType)
        events?.forEach((fn) => {
          fn(e)
        })
      })
    }

    let eventsNoopSet = graphical.noop[eventType]
    if (!eventsNoopSet)
      eventsNoopSet = graphical.noop[eventType] = new Set()

    eventsNoopSet.add(noop)

    return () => {
      const eventSet = this.eventsMap.get(eventType)
      eventSet?.delete(noop)
    }
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
    const { noop } = graphical
    Object.keys(noop).forEach((eventName) => {
      this.clearEvents(graphical, eventName as EventName)
    })
  }

  public clearEvents(graphical: Rect, eventType: EventName) {
    const { noop } = graphical
    const selfEventSet = noop[eventType]
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
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  public modifyShapeLayer(graphical: Rect, zIndex: number) {
    graphical.zIndex = zIndex
    this.reload()
  }
}
