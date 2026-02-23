// Bullflow real-time options flow streaming hook
// Ported from desktop: browser fetch SSE -> react-native-sse EventSource
// Uses react-native-sse for SSE streaming on React Native

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import EventSource from 'react-native-sse';
import { getStreamUrl, parseOCCSymbol, BullflowAlert, StreamStatus } from '../services/bullflowApi';

const MAX_ALERTS = 200;

interface StreamStats {
  totalAlerts: number;
  totalPremium: number;
  topTickers: [string, number][];
}

export function useBullflowStream(apiKey: string | null) {
  const [alerts, setAlerts] = useState<BullflowAlert[]>([]);
  const [status, setStatus] = useState<StreamStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffRef = useRef(1000);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  useEffect(() => {
    if (!apiKey) {
      setStatus('disconnected');
      setError(null);
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      return;
    }

    let cancelled = false;

    function connect() {
      if (cancelled) return;

      setStatus('connecting');
      setError(null);

      const url = getStreamUrl(apiKey!);

      // Use react-native-sse EventSource instead of browser fetch streaming
      const es = new EventSource(url, {
        headers: {
          'Accept': 'text/event-stream',
        },
      });

      esRef.current = es;

      // Handle connection open
      es.addEventListener('open', () => {
        if (cancelled) return;
        setStatus('connected');
        setError(null);
        backoffRef.current = 1000;
      });

      // Handle init event
      es.addEventListener('init', () => {
        // Connection initialized, no action needed
      });

      // Handle heartbeat
      es.addEventListener('heartbeat', () => {
        // Keep-alive, no action needed
      });

      // Handle alert events
      es.addEventListener('alert', (event: any) => {
        if (cancelled) return;
        try {
          const eventData = typeof event.data === 'string' ? event.data : '';
          if (!eventData) return;

          const data = JSON.parse(eventData);
          const parsed = parseOCCSymbol(data.symbol || '');
          const alert: BullflowAlert = {
            alertType: data.alertType || 'algo',
            symbol: data.symbol || '',
            alertName: data.alertName || '',
            alertPremium: data.alertPremium || 0,
            timestamp: data.timestamp || Date.now(),
            parsed,
          };
          setAlerts(prev => [alert, ...prev].slice(0, MAX_ALERTS));
        } catch {
          // Ignore malformed alert data
        }
      });

      // Handle error events from server
      es.addEventListener('error', (event: any) => {
        if (cancelled) return;

        const eventData = typeof event.data === 'string' ? event.data : '';

        // Check if this is an HTTP error
        if (event.type === 'error') {
          const statusCode = (event as any).status;

          if (statusCode === 401 || statusCode === 403) {
            setStatus('error');
            setError(`Authentication failed (${statusCode})`);
            es.close();
            esRef.current = null;
            return; // Don't reconnect for auth errors
          }

          if (statusCode === 409) {
            setStatus('error');
            setError('Connection conflict (409) -- close other Bullflow sessions and retry');
            es.close();
            esRef.current = null;
            return; // Don't reconnect for conflict
          }
        }

        setStatus('error');
        setError(eventData || 'Connection error');
        es.close();
        esRef.current = null;
        scheduleReconnect();
      });

      // Handle cancelled event (explicit server cancel)
      es.addEventListener('cancelled', (event: any) => {
        if (cancelled) return;
        const eventData = typeof event.data === 'string' ? event.data : '';
        setStatus('error');
        setError(eventData || 'Stream cancelled');
        es.close();
        esRef.current = null;
        // Don't reconnect on explicit cancel
      });

      // Handle generic message events (fallback)
      es.addEventListener('message', (event: any) => {
        // Some SSE implementations send generic messages
        // These are typically handled by the specific event handlers above
      });
    }

    function scheduleReconnect() {
      if (cancelled) return;
      const delay = backoffRef.current;
      backoffRef.current = Math.min(delay * 2, 30000); // Exponential backoff, max 30s
      reconnectTimeoutRef.current = setTimeout(() => {
        if (!cancelled) connect();
      }, delay);
    }

    connect();

    return () => {
      cancelled = true;
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [apiKey]);

  const stats: StreamStats = useMemo(() => {
    const totalAlerts = alerts.length;
    const totalPremium = alerts.reduce((sum, a) => sum + a.alertPremium, 0);

    const tickerMap = new Map<string, number>();
    for (const a of alerts) {
      tickerMap.set(a.parsed.ticker, (tickerMap.get(a.parsed.ticker) || 0) + 1);
    }
    const topTickers: [string, number][] = Array.from(tickerMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { totalAlerts, totalPremium, topTickers };
  }, [alerts]);

  return { alerts, status, error, stats, clearAlerts };
}

export default useBullflowStream;
