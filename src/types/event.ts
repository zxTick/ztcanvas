export enum EventName {
  click = 'click',
}

export type EventFn = (event: Event) => unknown;

export type Noop = {
  [key in EventName]?: Set<EventFn>;
};
