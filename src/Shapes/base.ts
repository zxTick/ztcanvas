import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { EventHandlerFn, EventName } from '../types'

export abstract class BaseShape<S, T> {
  path2D: Path2D = new Path2D()
  abstract id: symbol
  abstract shapeInfo: S
  zIndex = -1
  events = {} as Record<EventName, Set<EventHandlerFn>>
  // 内部需要用到的 zIndex
  public innerZIndex = -1
  constructor() { }
  protected abstract injectShapeInfo(info: T): void
  protected abstract machiningGraphics(info: T): void
  abstract render(canvasEngine: CanvasEngine, options: RenderOptions): void
  beforeRender(_: CanvasEngine, __: RenderOptions): void { }
}
