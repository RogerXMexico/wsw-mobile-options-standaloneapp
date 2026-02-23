declare module 'react-native-sse' {
  interface EventSourceOptions {
    headers?: Record<string, string>;
    method?: string;
    body?: string;
    withCredentials?: boolean;
    timeout?: number;
  }

  type EventSourceEvent = {
    type: string;
    data?: string;
    lastEventId?: string;
    url?: string;
  };

  class EventSource {
    constructor(url: string, options?: EventSourceOptions);
    addEventListener(type: string, listener: (event: EventSourceEvent) => void): void;
    removeEventListener(type: string, listener: (event: EventSourceEvent) => void): void;
    close(): void;
    readonly readyState: number;
    readonly url: string;
    static readonly CONNECTING: 0;
    static readonly OPEN: 1;
    static readonly CLOSED: 2;
  }

  export default EventSource;
}
