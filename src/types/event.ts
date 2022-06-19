import type { ShapeClassType } from './shape'

export enum EventName {
  click = 'click',
  dblclick = 'dblclick',
}

export type ValidEventType = MouseEvent

export type EventFn = (event: ValidEventType) => unknown

export type Noop = () => {}

export type EventHandlerFn = (e: ValidEventType, shape: ShapeClassType) => void
export type NormalEventHandlerFn = (ev: MouseEvent) => any
