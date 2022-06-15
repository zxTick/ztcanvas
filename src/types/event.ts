export enum EventName {
  click = 'click',
}

export type ValidEventType = MouseEvent

export type EventFn = (event: ValidEventType) => unknown

export type Noop = {
  [key in EventName]?: Set<EventFn>;
}
