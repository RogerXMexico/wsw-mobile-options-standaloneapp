// React Hook for Polymarket Data
// Provides real-time prediction market data for Event Horizons components
// Ported from desktop: imports use mobile polymarketApi service paths

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PolymarketEvent,
  fetchEventBySlug,
  searchEvents,
  fetchEventsByTag,
  getMainMarket,
  getPrimaryProbability,
  getDaysUntilEvent,
  isEventActive,
  getMappings,
  loadMappings,
} from '../services/polymarketApi';
import { EventTickerMapping, EventType } from '../types/polymarket';

interface UsePolymarketOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  initialTags?: string[];
}

interface PolymarketDataState {
  events: PolymarketEvent[];
  mappings: EventTickerMapping[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface FormattedEvent {
  event: PolymarketEvent;
  probability: number;
  probabilityPercent: string;
  daysUntil: number;
  isActive: boolean;
  volumeFormatted: string;
  mapping: EventTickerMapping | null;
}

export const usePolymarketData = (options: UsePolymarketOptions = {}) => {
  const { autoRefresh = false, refreshInterval = 60000, initialTags = ['crypto', 'economics', 'finance', 'politics'] } = options;

  const [state, setState] = useState<PolymarketDataState>({
    events: [],
    mappings: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  // Load mappings on mount
  useEffect(() => {
    loadMappings()
      .then(() => {
        setState((prev) => ({ ...prev, mappings: getMappings() }));
      })
      .catch(console.error);
  }, []);

  // Fetch events by tags
  const fetchByTags = useCallback(async (tags: string[]) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const allEvents: PolymarketEvent[] = [];

      for (const tag of tags) {
        const events = await fetchEventsByTag(tag, 25);
        allEvents.push(...events);
      }

      // Deduplicate by event ID
      const uniqueEvents = Array.from(new Map(allEvents.map((e) => [e.id, e])).values());

      setState((prev) => ({
        ...prev,
        events: uniqueEvents,
        loading: false,
        lastUpdated: new Date(),
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch events',
      }));
    }
  }, []);

  // Search events
  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const events = await searchEvents(query, 30);
      setState((prev) => ({
        ...prev,
        events,
        loading: false,
        lastUpdated: new Date(),
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Search failed',
      }));
    }
  }, []);

  // Fetch single event by slug
  const fetchEvent = useCallback(async (slug: string): Promise<PolymarketEvent | null> => {
    try {
      return await fetchEventBySlug(slug);
    } catch {
      return null;
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchByTags(initialTags);
  }, [fetchByTags, initialTags]);

  // Initial fetch
  useEffect(() => {
    fetchByTags(initialTags);
  }, [fetchByTags, initialTags]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refresh, refreshInterval]);

  // Format events with additional data
  const formattedEvents = useMemo((): FormattedEvent[] => {
    return state.events
      .filter((event) => isEventActive(event))
      .map((event) => {
        const market = getMainMarket(event);
        const probability = market ? getPrimaryProbability(market) : 0.5;
        const volume = market?.volumeNum || 0;

        // Find matching mapping
        const mapping = state.mappings.find(
          (m) => m.polymarketSlug === event.slug || event.title.toLowerCase().includes((m.ticker || '').toLowerCase())
        ) || null;

        return {
          event,
          probability,
          probabilityPercent: `${Math.round(probability * 100)}%`,
          daysUntil: getDaysUntilEvent(event),
          isActive: isEventActive(event),
          volumeFormatted:
            volume > 1000000
              ? `$${(volume / 1000000).toFixed(1)}M`
              : volume > 1000
                ? `$${(volume / 1000).toFixed(1)}K`
                : `$${volume.toFixed(0)}`,
          mapping,
        };
      })
      .sort((a, b) => b.probability - a.probability);
  }, [state.events, state.mappings]);

  // Filter by event type
  const filterByType = useCallback(
    (eventType: EventType): FormattedEvent[] => {
      return formattedEvents.filter((e) => e.mapping?.eventType === eventType);
    },
    [formattedEvents]
  );

  // Get events with mappings (ready for gap analysis)
  const mappedEvents = useMemo(() => {
    return formattedEvents.filter((e) => e.mapping !== null);
  }, [formattedEvents]);

  return {
    // Raw state
    events: state.events,
    mappings: state.mappings,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,

    // Processed data
    formattedEvents,
    mappedEvents,

    // Actions
    search,
    refresh,
    fetchEvent,
    filterByType,
  };
};

// Hook for single event tracking
export const usePolymarketEvent = (slug: string | null) => {
  const [event, setEvent] = useState<PolymarketEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setEvent(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchEventBySlug(slug)
      .then(setEvent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const probability = useMemo(() => {
    if (!event) return null;
    const market = getMainMarket(event);
    return market ? getPrimaryProbability(market) : 0.5;
  }, [event]);

  return {
    event,
    probability,
    loading,
    error,
  };
};

export default usePolymarketData;
