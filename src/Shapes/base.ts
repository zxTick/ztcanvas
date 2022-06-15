import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { EventFn, EventName } from '../types'

export abstract class BaseShape<S, T> {
  path2D: Path2D = new Path2D()
  abstract id: symbol
  abstract shapeInfo: S
  zIndex = -1
  events = {} as Record<EventName, Set<EventFn>>
  constructor() { }
  protected abstract injectShapeInfo(info: T): void
  protected abstract machiningGraphics(info: T): void
  abstract render(canvasEngine: CanvasEngine, options: RenderOptions): void
}
