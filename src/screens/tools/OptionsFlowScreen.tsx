// Options Flow Screen - Real-time options flow alerts from Bullflow API
// Dark theme with cyan (#06b6d4) accents

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { PremiumModal } from '../../components/ui';
import { useSubscription } from '../../hooks/useSubscription';
import {
  getBullflowApiKey,
  setBullflowApiKey,
  getStreamUrl,
  parseOCCSymbol,
  BullflowAlert,
  StreamStatus,
} from '../../services/bullflowApi';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CYAN = '#06b6d4';
const CYAN_DIM = 'rgba(6, 182, 212, 0.15)';
const CYAN_BORDER = 'rgba(6, 182, 212, 0.3)';
const MAX_ALERTS = 200;
const POLL_INTERVAL_MS = 5000;

// -- Format helpers --

const formatPremium = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

// -- Mock data --

const MOCK_ALERTS: BullflowAlert[] = [
  {
    alertType: 'algo',
    symbol: 'O:AAPL260320C00230000',
    alertName: 'Unusual Volume Sweep',
    alertPremium: 1_540_000,
    timestamp: Date.now() - 120_000,
    parsed: { ticker: 'AAPL', expiry: '2026-03-20', type: 'call', strike: 230 },
  },
  {
    alertType: 'custom',
    symbol: 'O:TSLA260417P00250000',
    alertName: 'Large Block Trade',
    alertPremium: 890_000,
    timestamp: Date.now() - 240_000,
    parsed: { ticker: 'TSLA', expiry: '2026-04-17', type: 'put', strike: 250 },
  },
  {
    alertType: 'algo',
    symbol: 'O:NVDA260320C00950000',
    alertName: 'Smart Money Flow',
    alertPremium: 2_300_000,
    timestamp: Date.now() - 360_000,
    parsed: { ticker: 'NVDA', expiry: '2026-03-20', type: 'call', strike: 950 },
  },
  {
    alertType: 'algo',
    symbol: 'O:SPY260515P00580000',
    alertName: 'Aggressive Sweep',
    alertPremium: 456_000,
    timestamp: Date.now() - 480_000,
    parsed: { ticker: 'SPY', expiry: '2026-05-15', type: 'put', strike: 580 },
  },
  {
    alertType: 'custom',
    symbol: 'O:META260320C00620000',
    alertName: 'Repeat Buyer Detected',
    alertPremium: 1_120_000,
    timestamp: Date.now() - 600_000,
    parsed: { ticker: 'META', expiry: '2026-03-20', type: 'call', strike: 620 },
  },
  {
    alertType: 'algo',
    symbol: 'O:AMZN260417C00210000',
    alertName: 'Opening Sweep',
    alertPremium: 675_000,
    timestamp: Date.now() - 720_000,
    parsed: { ticker: 'AMZN', expiry: '2026-04-17', type: 'call', strike: 210 },
  },
];

// -- Types --

type FilterType = 'all' | 'algo' | 'custom';

interface StatsData {
  totalAlerts: number;
  totalPremium: number;
  topTicker: string;
}

// -- Connection status helpers --

const getStatusColor = (status: StreamStatus): string => {
  switch (status) {
    case 'connected':
      return colors.success;
    case 'connecting':
      return colors.warning;
    case 'error':
      return colors.error;
    case 'disconnected':
    default:
      return colors.text.tertiary;
  }
};

const getStatusLabel = (status: StreamStatus): string => {
  switch (status) {
    case 'connected':
      return 'Live';
    case 'connecting':
      return 'Connecting';
    case 'error':
      return 'Error';
    case 'disconnected':
    default:
      return 'Offline';
  }
};

// -- Component --

const OptionsFlowScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Connection state
  const [status, setStatus] = useState<StreamStatus>('disconnected');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [storedApiKey, setStoredApiKey] = useState<string | null>(null);

  // Alert data
  const [alerts, setAlerts] = useState<BullflowAlert[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [minPremium, setMinPremium] = useState('');

  // Polling ref
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load stored API key on mount
  useEffect(() => {
    const loadKey = async () => {
      try {
        const key = await getBullflowApiKey();
        if (key) {
          setStoredApiKey(key);
          setApiKeyInput(key);
        }
      } catch {
        // SecureStore not available in some envs
      }
    };
    loadKey();
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  // Track latest timestamp to avoid duplicate alerts
  const lastTimestampRef = useRef<number>(0);
  // Track whether we've ever connected successfully (to decide fallback behavior)
  const hasConnectedRef = useRef(false);
  // Track whether the component is still mounted for async safety
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // -- Polling logic --

  const fetchAlerts = useCallback(async (apiKey: string): Promise<BullflowAlert[]> => {
    const url = getStreamUrl(apiKey);
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json, text/event-stream' },
    });

    if (!response.ok) {
      throw new Error(`Bullflow API error: ${response.status}`);
    }

    const text = await response.text();

    // Parse SSE events or JSON response
    const alerts: BullflowAlert[] = [];

    // Try JSON array first
    try {
      const json = JSON.parse(text);
      const items = Array.isArray(json) ? json : json.data ? [].concat(json.data) : [json];
      for (const item of items) {
        if (item && item.symbol) {
          alerts.push({
            alertType: item.alertType || item.alert_type || 'algo',
            symbol: item.symbol,
            alertName: item.alertName || item.alert_name || 'Flow Alert',
            alertPremium: item.alertPremium || item.alert_premium || item.premium || 0,
            timestamp: item.timestamp || Date.now(),
            parsed: parseOCCSymbol(item.symbol),
          });
        }
      }
      return alerts;
    } catch {
      // Not JSON, try SSE format
    }

    // Parse SSE text: "data: {...}\n\n"
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.startsWith('data:')) {
        try {
          const item = JSON.parse(line.slice(5).trim());
          if (item && item.symbol) {
            alerts.push({
              alertType: item.alertType || item.alert_type || 'algo',
              symbol: item.symbol,
              alertName: item.alertName || item.alert_name || 'Flow Alert',
              alertPremium: item.alertPremium || item.alert_premium || item.premium || 0,
              timestamp: item.timestamp || Date.now(),
              parsed: parseOCCSymbol(item.symbol),
            });
          }
        } catch {
          // Skip malformed SSE lines
        }
      }
    }

    return alerts;
  }, []);

  const startPolling = useCallback((apiKey: string) => {
    setStatus('connecting');
    hasConnectedRef.current = false;
    lastTimestampRef.current = 0;

    const doFetch = async () => {
      try {
        const newAlerts = await fetchAlerts(apiKey);
        if (!isMountedRef.current) return;

        hasConnectedRef.current = true;
        setStatus('connected');

        if (newAlerts.length > 0) {
          // Filter out alerts we've already seen
          const fresh = newAlerts.filter((a) => a.timestamp > lastTimestampRef.current);
          if (fresh.length > 0) {
            lastTimestampRef.current = Math.max(...fresh.map((a) => a.timestamp));
            setAlerts((prev) => {
              const updated = [...fresh, ...prev];
              return updated.slice(0, MAX_ALERTS);
            });
          }
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        console.warn('Bullflow fetch error:', err);
        // If we never connected successfully, fall back to mock data
        if (!hasConnectedRef.current) {
          setStatus('error');
          setAlerts(MOCK_ALERTS);
          setUseMockData(true);
          // Stop polling since we're falling back to mock
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
        // If already connected, keep 'connected' status and retry on next poll
      }
    };

    doFetch();

    // Continue polling
    pollIntervalRef.current = setInterval(doFetch, POLL_INTERVAL_MS);
  }, [fetchAlerts]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  // -- Handlers --

  const handleConnect = useCallback(async () => {
    const keyToUse = apiKeyInput.trim();
    if (!keyToUse) {
      Alert.alert('API Key Required', 'Please enter your Bullflow API key to connect.');
      return;
    }

    try {
      await setBullflowApiKey(keyToUse);
      setStoredApiKey(keyToUse);
    } catch {
      // SecureStore might not be available
    }

    setAlerts([]);
    setUseMockData(false);
    startPolling(keyToUse);
  }, [apiKeyInput, startPolling]);

  const handleUseMockData = useCallback(() => {
    setUseMockData(true);
    setAlerts(MOCK_ALERTS);
    setStatus('connected');
  }, []);

  const handleDisconnect = useCallback(async () => {
    stopPolling();
    setAlerts([]);
    setUseMockData(false);
    try {
      await setBullflowApiKey('');
      setStoredApiKey(null);
    } catch {
      // ignore
    }
    setApiKeyInput('');
  }, [stopPolling]);

  const handleClearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // -- Computed values --

  const stats: StatsData = useMemo(() => {
    const totalAlerts = alerts.length;
    const totalPremium = alerts.reduce((sum, a) => sum + a.alertPremium, 0);

    // Count tickers
    const tickerCounts: Record<string, number> = {};
    alerts.forEach((a) => {
      const t = a.parsed.ticker;
      tickerCounts[t] = (tickerCounts[t] || 0) + 1;
    });
    const topTicker =
      Object.entries(tickerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '--';

    return { totalAlerts, totalPremium, topTicker };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    let result = alerts;

    if (filterType !== 'all') {
      result = result.filter((a) => a.alertType === filterType);
    }

    const minPremiumValue = parseInt(minPremium, 10);
    if (!isNaN(minPremiumValue) && minPremiumValue > 0) {
      result = result.filter((a) => a.alertPremium >= minPremiumValue);
    }

    return result;
  }, [alerts, filterType, minPremium]);

  const isConnected = status === 'connected';
  const isDisconnected = status === 'disconnected';

  // -- Render helpers --

  const renderStatusDot = () => (
    <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
  );

  const renderStatCard = (
    label: string,
    value: string,
    icon: keyof typeof Ionicons.glyphMap
  ) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={18} color={CYAN} style={styles.statIcon} />
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  const renderAlertItem = ({ item }: { item: BullflowAlert }) => {
    const isCall = item.parsed.type === 'call';
    const typeColor = isCall ? colors.success : colors.error;
    const typeLabel = isCall ? 'CALL' : 'PUT';

    return (
      <View style={styles.alertRow}>
        {/* Time */}
        <Text style={styles.alertTime}>{formatTime(item.timestamp)}</Text>

        {/* Ticker */}
        <Text style={styles.alertTicker}>{item.parsed.ticker}</Text>

        {/* Type badge */}
        <View style={[styles.typeBadge, { backgroundColor: `${typeColor}20` }]}>
          <Text style={[styles.typeBadgeText, { color: typeColor }]}>{typeLabel}</Text>
        </View>

        {/* Strike */}
        <Text style={styles.alertStrike}>${item.parsed.strike}</Text>

        {/* Expiry */}
        <Text style={styles.alertExpiry}>{item.parsed.expiry}</Text>

        {/* Alert type badge */}
        <View
          style={[
            styles.alertTypeBadge,
            {
              backgroundColor:
                item.alertType === 'algo' ? CYAN_DIM : 'rgba(251, 191, 36, 0.15)',
            },
          ]}
        >
          <Text
            style={[
              styles.alertTypeBadgeText,
              {
                color: item.alertType === 'algo' ? CYAN : colors.accent,
              },
            ]}
          >
            {item.alertType === 'algo' ? 'ALGO' : 'CSTM'}
          </Text>
        </View>

        {/* Premium */}
        <Text style={styles.alertPremium}>{formatPremium(item.alertPremium)}</Text>
      </View>
    );
  };

  const renderAlertItemExpanded = ({ item }: { item: BullflowAlert }) => {
    const isCall = item.parsed.type === 'call';
    const typeColor = isCall ? colors.success : colors.error;
    const typeLabel = isCall ? 'CALL' : 'PUT';

    return (
      <View style={styles.alertCard}>
        <View style={styles.alertCardHeader}>
          <View style={styles.alertCardLeft}>
            <Text style={styles.alertCardTicker}>{item.parsed.ticker}</Text>
            <View style={[styles.typeBadgeLarge, { backgroundColor: `${typeColor}20` }]}>
              <Text style={[styles.typeBadgeLargeText, { color: typeColor }]}>
                {typeLabel}
              </Text>
            </View>
          </View>
          <Text style={styles.alertCardPremium}>
            {formatPremium(item.alertPremium)}
          </Text>
        </View>

        <View style={styles.alertCardDetails}>
          <View style={styles.alertDetailItem}>
            <Text style={styles.alertDetailLabel}>Strike</Text>
            <Text style={styles.alertDetailValue}>${item.parsed.strike}</Text>
          </View>
          <View style={styles.alertDetailItem}>
            <Text style={styles.alertDetailLabel}>Expiry</Text>
            <Text style={styles.alertDetailValue}>{item.parsed.expiry}</Text>
          </View>
          <View style={styles.alertDetailItem}>
            <Text style={styles.alertDetailLabel}>Time</Text>
            <Text style={styles.alertDetailValue}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>

        <View style={styles.alertCardFooter}>
          <View
            style={[
              styles.alertNameBadge,
              {
                backgroundColor:
                  item.alertType === 'algo' ? CYAN_DIM : 'rgba(251, 191, 36, 0.15)',
              },
            ]}
          >
            <Text
              style={[
                styles.alertNameBadgeText,
                {
                  color: item.alertType === 'algo' ? CYAN : colors.accent,
                },
              ]}
            >
              {item.alertName}
            </Text>
          </View>
          <Text style={styles.alertTypeSmall}>
            {item.alertType === 'algo' ? 'Algo' : 'Custom'}
          </Text>
        </View>
      </View>
    );
  };

  // -- Main render --

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="pulse" size={20} color={CYAN} style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Live Flow & Alerts</Text>
          </View>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.lockedContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.neon.green} />
          <Text style={styles.lockedTitle}>Premium Feature</Text>
          <Text style={styles.lockedMessage}>Unlock this tool with a premium subscription</Text>
          <TouchableOpacity style={styles.unlockBtn} onPress={() => setShowPremiumModal(true)}>
            <Text style={styles.unlockBtnText}>Unlock Now</Text>
          </TouchableOpacity>
        </View>
        <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} featureName="Options Flow" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="pulse" size={20} color={CYAN} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Live Flow & Alerts</Text>
        </View>
        <View style={styles.headerStatus}>
          {renderStatusDot()}
          <Text
            style={[
              styles.headerStatusText,
              { color: getStatusColor(status) },
            ]}
          >
            {getStatusLabel(status)}
          </Text>
        </View>
      </View>

      {/* Content */}
      {isDisconnected ? (
        /* ---- Disconnected State ---- */
        <View style={styles.disconnectedContainer}>
          <View style={styles.disconnectedContent}>
            {/* Icon */}
            <View style={styles.disconnectedIconContainer}>
              <Ionicons name="radio-outline" size={48} color={CYAN} />
            </View>

            <Text style={styles.disconnectedTitle}>Connect to Live Flow</Text>
            <Text style={styles.disconnectedSubtitle}>
              Enter your Bullflow API key to receive real-time options flow
              alerts and institutional trading signals.
            </Text>

            {/* API Key Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>API Key</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="key-outline"
                  size={18}
                  color={colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={apiKeyInput}
                  onChangeText={setApiKeyInput}
                  placeholder="Enter your Bullflow API key..."
                  placeholderTextColor={colors.text.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Connect Button */}
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Ionicons name="flash" size={18} color="#000" />
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Mock Data Button */}
            <TouchableOpacity
              style={styles.mockDataButton}
              onPress={handleUseMockData}
            >
              <Ionicons name="flask-outline" size={18} color={CYAN} />
              <Text style={styles.mockDataButtonText}>Preview with Sample Data</Text>
            </TouchableOpacity>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={CYAN}
                style={styles.infoIcon}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Get your API key</Text>
                <Text style={styles.infoDescription}>
                  Sign up at bullflow.io to get your API key and access
                  real-time institutional options flow data.
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        /* ---- Connected State ---- */
        <View style={styles.connectedContainer}>
          {/* Stats Bar - 2x2 grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              {renderStatCard(
                'Total Alerts',
                stats.totalAlerts.toString(),
                'notifications-outline'
              )}
              {renderStatCard(
                'Total Premium',
                formatPremium(stats.totalPremium),
                'cash-outline'
              )}
            </View>
            <View style={styles.statsRow}>
              {renderStatCard('Top Ticker', stats.topTicker, 'trending-up-outline')}
              {renderStatCard(
                'Status',
                useMockData ? 'Demo' : getStatusLabel(status),
                'radio-outline'
              )}
            </View>
          </View>

          {/* Filter Bar */}
          <View style={styles.filterBar}>
            <View style={styles.filterTypeRow}>
              {(['all', 'algo', 'custom'] as FilterType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    filterType === type && styles.filterChipActive,
                  ]}
                  onPress={() => setFilterType(type)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterType === type && styles.filterChipTextActive,
                    ]}
                  >
                    {type === 'all' ? 'All' : type === 'algo' ? 'Algo' : 'Custom'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.premiumFilterContainer}>
              <Ionicons
                name="funnel-outline"
                size={14}
                color={colors.text.tertiary}
              />
              <TextInput
                style={styles.premiumInput}
                value={minPremium}
                onChangeText={setMinPremium}
                placeholder="Min $"
                placeholderTextColor={colors.text.muted}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Alert List */}
          <FlatList
            data={filteredAlerts}
            keyExtractor={(item, index) =>
              `${item.timestamp}-${item.symbol}-${index}`
            }
            renderItem={renderAlertItemExpanded}
            contentContainerStyle={styles.alertListContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="radio-outline"
                  size={40}
                  color={colors.text.muted}
                />
                <Text style={styles.emptyStateText}>
                  {status === 'connecting'
                    ? 'Connecting to flow...'
                    : 'Waiting for alerts...'}
                </Text>
                {status === 'connecting' && (
                  <ActivityIndicator
                    color={CYAN}
                    style={styles.emptyStateLoader}
                  />
                )}
              </View>
            }
          />

          {/* Bottom Action Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAlerts}
            >
              <Ionicons name="trash-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={handleDisconnect}
            >
              <Ionicons name="power-outline" size={16} color={colors.error} />
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// -- Styles --

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: CYAN_BORDER,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: spacing.xs,
  },
  headerTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerStatusText: {
    ...typography.styles.labelSm,
    marginLeft: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // -- Disconnected State --
  disconnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  disconnectedContent: {
    alignItems: 'center',
  },
  disconnectedIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: CYAN_DIM,
    borderWidth: 1,
    borderColor: CYAN_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  disconnectedTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  disconnectedSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },

  // Input
  inputWrapper: {
    width: '100%',
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.styles.labelSm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: CYAN_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    ...typography.styles.body,
    color: colors.text.primary,
  },

  // Connect Button
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CYAN,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    width: '100%',
    marginBottom: spacing.md,
  },
  connectButtonText: {
    ...typography.styles.button,
    color: '#000000',
    marginLeft: spacing.sm,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginHorizontal: spacing.md,
  },

  // Mock Data Button
  mockDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CYAN_BORDER,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    width: '100%',
    marginBottom: spacing.lg,
  },
  mockDataButtonText: {
    ...typography.styles.button,
    color: CYAN,
    marginLeft: spacing.sm,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: CYAN_DIM,
    borderWidth: 1,
    borderColor: CYAN_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '100%',
  },
  infoIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...typography.styles.label,
    color: CYAN,
    marginBottom: 4,
  },
  infoDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },

  // -- Connected State --
  connectedContainer: {
    flex: 1,
  },

  // Stats Grid
  statsGrid: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: CYAN_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.sm + 2,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },

  // Filter Bar
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filterTypeRow: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: CYAN_DIM,
    borderWidth: 1,
    borderColor: CYAN_BORDER,
  },
  filterChipText: {
    ...typography.styles.labelSm,
    color: colors.text.tertiary,
  },
  filterChipTextActive: {
    color: CYAN,
  },
  premiumFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    height: 32,
    minWidth: 80,
  },
  premiumInput: {
    ...typography.styles.monoSm,
    color: colors.text.primary,
    marginLeft: 6,
    flex: 1,
    paddingVertical: 0,
  },

  // Alert List
  alertListContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  // Row-style alert (compact)
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  alertTime: {
    ...typography.styles.monoSm,
    color: colors.text.tertiary,
    width: 60,
  },
  alertTicker: {
    ...typography.styles.monoBold,
    color: colors.text.primary,
    width: 48,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  typeBadgeText: {
    ...typography.styles.overline,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  alertStrike: {
    ...typography.styles.monoSm,
    color: colors.text.secondary,
    width: 48,
  },
  alertExpiry: {
    ...typography.styles.monoSm,
    color: colors.text.tertiary,
    width: 72,
    fontSize: 10,
  },
  alertTypeBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  alertTypeBadgeText: {
    ...typography.styles.overline,
    fontSize: 8,
  },
  alertPremium: {
    ...typography.styles.monoBold,
    color: CYAN,
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
  },

  // Card-style alert (expanded)
  alertCard: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  alertCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertCardTicker: {
    ...typography.styles.h4,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoBold,
    marginRight: spacing.sm,
  },
  typeBadgeLarge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  typeBadgeLargeText: {
    ...typography.styles.overline,
    fontSize: 10,
    letterSpacing: 1,
  },
  alertCardPremium: {
    ...typography.styles.h5,
    color: CYAN,
    fontFamily: typography.fonts.monoBold,
  },
  alertCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  alertDetailItem: {
    alignItems: 'center',
  },
  alertDetailLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: 2,
  },
  alertDetailValue: {
    ...typography.styles.mono,
    color: colors.text.secondary,
    fontSize: 13,
  },
  alertCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertNameBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    flexShrink: 1,
  },
  alertNameBadgeText: {
    ...typography.styles.labelSm,
    fontSize: 11,
  },
  alertTypeSmall: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateText: {
    ...typography.styles.body,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
  emptyStateLoader: {
    marginTop: spacing.md,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  clearButtonText: {
    ...typography.styles.labelSm,
    color: colors.text.secondary,
    marginLeft: 6,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  disconnectButtonText: {
    ...typography.styles.labelSm,
    color: colors.error,
    marginLeft: 6,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  lockedTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  lockedMessage: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  unlockBtn: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  unlockBtnText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
});

export default OptionsFlowScreen;
