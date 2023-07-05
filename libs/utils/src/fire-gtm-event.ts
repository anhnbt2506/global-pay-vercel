interface GtmEventParams<T> {
  event?: T;
  [key: string]: unknown;
}

export function fireGtmEvent<T>(data: GtmEventParams<T>): void {
  if (!window.dataLayer) return;

  window.dataLayer.push(data);
}
