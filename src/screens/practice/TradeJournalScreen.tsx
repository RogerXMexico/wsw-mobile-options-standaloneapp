// Trade Journal Screen for Wall Street Wildlife Mobile
// Upgraded with Analytics, Patterns, Charts, Strategy tagging, Grading, Export, Filters
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Share,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Polyline, Line, Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useTradingStore, TradeJournalEntry } from '../../stores/tradingStore';
import { useTradeJournal, Trade } from '../../hooks/useTradeJournal';
import {
  computeAnalytics,
  computeChartData,
  detectPatterns,
  Analytics,
  Pattern,
} from '../../utils/tradeAnalytics';

// ── Constants ──────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.lg * 2; // card padding
const CHART_HEIGHT = 140;

const STRATEGY_OPTIONS = [
  'Long Call',
  'Long Put',
  'Covered Call',
  'Cash-Secured Put',
  'Bull Call Spread',
  'Bear Put Spread',
  'Bull Put Spread',
  'Bear Call Spread',
  'Iron Condor',
  'Iron Butterfly',
  'Straddle',
  'Strangle',
  'Calendar Spread',
  'PMCC',
  'Custom',
];

const TAG_OPTIONS = [
  'Earnings',
  'High IV',
  'Low IV',
  'Momentum',
  'Mean Reversion',
  'Hedge',
  'Speculation',
  'Income',
];

const PURPOSE_OPTIONS = [
  { value: 'investment', label: 'Investment' },
  { value: 'income', label: 'Income' },
  { value: 'speculation', label: 'Speculation' },
  { value: 'hedge', label: 'Hedge' },
  { value: 'gambling-deliberate', label: 'Gambling (Deliberate)' },
  { value: 'gambling-impulsive', label: 'Gambling (Impulsive)' },
];

const TIME_HORIZON_OPTIONS = [
  { value: 'day', label: 'Day Trade' },
  { value: 'swing', label: 'Swing (2-5d)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'leaps', label: 'LEAPS (6+ mo)' },
];

const GRADE_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'A', label: 'A - Excellent', color: '#39ff14' },
  { value: 'B', label: 'B - Good', color: '#00f0ff' },
  { value: 'C', label: 'C - Average', color: '#ffff00' },
  { value: 'D', label: 'D - Poor', color: '#ff6600' },
  { value: 'F', label: 'F - Failed Plan', color: '#ff073a' },
];

const JOURNAL_PROMPTS = [
  'Why this ticker?',
  'What is your thesis?',
  'What catalyst are you expecting?',
  'What price would make you exit?',
  'What would invalidate your thesis?',
];

type MainTab = 'trades' | 'analytics' | 'patterns';

// ── Helper to bridge Zustand entries to analytics Trade type ────────────

function zustandToAnalyticsTrade(entry: TradeJournalEntry): import('../../utils/tradeAnalytics').Trade {
  return {
    id: entry.id,
    ticker: entry.symbol,
    strategy: entry.strategy,
    type: 'other',
    status: entry.status === 'open' ? 'open' : 'closed',
    date: entry.date,
    pnl: entry.pnl ?? null,
    tags: entry.tags ?? [],
    notes: entry.notes,
    quantity: entry.quantity,
  };
}

// ── Component ──────────────────────────────────────────────────────────────

const TradeJournalScreen: React.FC = () => {
  const navigation = useNavigation();

  // Zustand store (existing data source)
  const zustandEntries = useTradingStore((s) => s.journalEntries);
  const addJournalEntry = useTradingStore((s) => s.addJournalEntry);
  const deleteJournalEntry = useTradingStore((s) => s.deleteJournalEntry);
  const updateJournalEntry = useTradingStore((s) => s.updateJournalEntry);

  // Cloud-synced hook (new data source)
  const {
    trades: hookTrades,
    addTrade: hookAddTrade,
    updateTrade: hookUpdateTrade,
    deleteTrade: hookDeleteTrade,
    syncStatus,
    syncError,
    clearSyncError,
    isLoaded,
  } = useTradeJournal();

  // Merge: use hook trades if any, else fall back to Zustand entries
  const allEntries = useMemo(() => {
    if (hookTrades.length > 0) return hookTrades;
    return zustandEntries;
  }, [hookTrades, zustandEntries]);

  // Convert for analytics
  const analyticsTrades = useMemo(() => {
    if (hookTrades.length > 0) {
      // Hook trades match the analytics Trade type better
      return hookTrades.map((t): import('../../utils/tradeAnalytics').Trade => ({
        id: t.id,
        ticker: t.ticker,
        strategy: t.strategy,
        type: 'other',
        status: t.status === 'expired' ? 'closed' : t.status,
        date: t.date,
        pnl: t.pnl,
        ivAtEntry: t.ivAtEntry ?? undefined,
        daysHeld: t.daysHeld ?? undefined,
        tags: t.tags,
        notes: t.notes,
        quantity: t.quantity,
      }));
    }
    return zustandEntries.map(zustandToAnalyticsTrade);
  }, [hookTrades, zustandEntries]);

  // ── State ────────────────────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState<MainTab>('trades');
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [filterStrategy, setFilterStrategy] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'pnl' | 'strategy'>('date');
  const [selectedEntry, setSelectedEntry] = useState<TradeJournalEntry | null>(null);
  const [selectedHookTrade, setSelectedHookTrade] = useState<Trade | null>(null);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStrategyPicker, setShowStrategyPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showPurposePicker, setShowPurposePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // New entry form state
  const [formSymbol, setFormSymbol] = useState('');
  const [formStrategy, setFormStrategy] = useState('Long Call');
  const [formEntryPrice, setFormEntryPrice] = useState('');
  const [formExitPrice, setFormExitPrice] = useState('');
  const [formQuantity, setFormQuantity] = useState('1');
  const [formDirection, setFormDirection] = useState<'long' | 'short'>('long');
  const [formStatus, setFormStatus] = useState<'open' | 'closed' | 'expired'>('open');
  const [formNotes, setFormNotes] = useState('');
  const [formPreTradePlan, setFormPreTradePlan] = useState('');
  const [formPostReflection, setFormPostReflection] = useState('');
  const [formLessons, setFormLessons] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formIV, setFormIV] = useState('');
  const [formDelta, setFormDelta] = useState('');
  const [formDaysHeld, setFormDaysHeld] = useState('');
  const [formPurpose, setFormPurpose] = useState('');
  const [formTimeHorizon, setFormTimeHorizon] = useState('');
  const [formGrade, setFormGrade] = useState('');

  // ── Computed data ────────────────────────────────────────────────────────

  const analytics = useMemo(() => computeAnalytics(analyticsTrades), [analyticsTrades]);
  const chartData = useMemo(() => computeChartData(analyticsTrades), [analyticsTrades]);
  const patterns = useMemo(() => detectPatterns(analyticsTrades, analytics), [analyticsTrades, analytics]);

  // Streak calculation
  const streakInfo = useMemo(() => {
    const closed = analyticsTrades
      .filter(t => t.status === 'closed' && t.pnl !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (closed.length === 0) return { current: 0, type: 'none' as const, maxWin: 0, maxLoss: 0 };

    let currentStreak = 0;
    let currentType: 'win' | 'loss' | 'none' = 'none';
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let tempWin = 0;
    let tempLoss = 0;

    for (const t of closed) {
      const isWin = (t.pnl || 0) > 0;
      if (currentType === 'none') {
        currentType = isWin ? 'win' : 'loss';
        currentStreak = 1;
      } else if ((currentType === 'win' && isWin) || (currentType === 'loss' && !isWin)) {
        currentStreak++;
      }
      // Max streaks
      if (isWin) {
        tempWin++;
        tempLoss = 0;
        maxWinStreak = Math.max(maxWinStreak, tempWin);
      } else {
        tempLoss++;
        tempWin = 0;
        maxLossStreak = Math.max(maxLossStreak, tempLoss);
      }
    }

    return { current: currentStreak, type: currentType, maxWin: maxWinStreak, maxLoss: maxLossStreak };
  }, [analyticsTrades]);

  // Best / worst trades
  const bestTrade = useMemo(() => {
    const closed = analyticsTrades.filter(t => t.pnl !== null);
    if (closed.length === 0) return null;
    return closed.reduce((best, t) => ((t.pnl || 0) > (best.pnl || 0) ? t : best));
  }, [analyticsTrades]);

  const worstTrade = useMemo(() => {
    const closed = analyticsTrades.filter(t => t.pnl !== null);
    if (closed.length === 0) return null;
    return closed.reduce((worst, t) => ((t.pnl || 0) < (worst.pnl || 0) ? t : worst));
  }, [analyticsTrades]);

  // Filtered & sorted entries (for Trades tab)
  const filteredEntries = useMemo(() => {
    let list: TradeJournalEntry[];
    if (hookTrades.length > 0) {
      // Map hook trades back to the TradeJournalEntry shape for display
      list = hookTrades.map((t): TradeJournalEntry => ({
        id: t.id,
        date: t.date,
        symbol: t.ticker,
        strategy: t.strategy,
        direction: t.direction === 'long' ? 'bullish' : 'bearish',
        entryPrice: t.entryPrice,
        exitPrice: t.exitPrice ?? undefined,
        quantity: t.quantity,
        pnl: t.pnl ?? undefined,
        pnlPercent: t.pnlPercent ?? undefined,
        status: t.status === 'closed' ? ((t.pnl ?? 0) > 0 ? 'win' : (t.pnl ?? 0) < 0 ? 'loss' : 'breakeven') : t.status === 'expired' ? 'loss' : 'open',
        notes: t.notes,
        lessons: t.purpose || '',
        emotions: [],
        tags: t.tags,
      }));
    } else {
      list = [...zustandEntries];
    }

    // Status filter
    if (filter === 'open') {
      list = list.filter(e => e.status === 'open');
    } else if (filter === 'closed') {
      list = list.filter(e => e.status !== 'open');
    }

    // Strategy filter
    if (filterStrategy !== 'all') {
      list = list.filter(e => e.strategy === filterStrategy);
    }

    // Sort
    if (sortBy === 'date') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'pnl') {
      list.sort((a, b) => ((b.pnl ?? 0) - (a.pnl ?? 0)));
    } else if (sortBy === 'strategy') {
      list.sort((a, b) => a.strategy.localeCompare(b.strategy));
    }

    return list;
  }, [hookTrades, zustandEntries, filter, filterStrategy, sortBy]);

  // Unique strategies in the data
  const uniqueStrategies = useMemo(() => {
    const strats = new Set<string>();
    if (hookTrades.length > 0) {
      hookTrades.forEach(t => strats.add(t.strategy));
    } else {
      zustandEntries.forEach(e => strats.add(e.strategy));
    }
    return Array.from(strats).sort();
  }, [hookTrades, zustandEntries]);

  // ── Form Helpers ─────────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setFormSymbol('');
    setFormStrategy('Long Call');
    setFormEntryPrice('');
    setFormExitPrice('');
    setFormQuantity('1');
    setFormDirection('long');
    setFormStatus('open');
    setFormNotes('');
    setFormPreTradePlan('');
    setFormPostReflection('');
    setFormLessons('');
    setFormTags([]);
    setFormIV('');
    setFormDelta('');
    setFormDaysHeld('');
    setFormPurpose('');
    setFormTimeHorizon('');
    setFormGrade('');
    setIsEditing(false);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFormTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleSubmitEntry = useCallback(() => {
    const price = parseFloat(formEntryPrice);
    const exitPrice = formExitPrice ? parseFloat(formExitPrice) : null;
    const qty = parseInt(formQuantity, 10) || 1;

    if (!formSymbol.trim()) {
      Alert.alert('Missing Field', 'Please enter a symbol.');
      return;
    }
    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid entry price.');
      return;
    }

    // Calculate P&L for closed trades
    let pnl: number | null = null;
    let pnlPercent: number | null = null;
    if (exitPrice !== null && formStatus === 'closed') {
      const multiplier = formDirection === 'long' ? 1 : -1;
      pnl = (exitPrice - price) * multiplier * qty * 100;
      pnlPercent = ((exitPrice - price) / price) * multiplier * 100;
    }

    // Combine notes fields
    const combinedNotes = [
      formPreTradePlan ? `PRE-TRADE PLAN:\n${formPreTradePlan}` : '',
      formNotes ? `NOTES:\n${formNotes}` : '',
      formPostReflection ? `POST-TRADE REFLECTION:\n${formPostReflection}` : '',
      formLessons ? `LESSONS LEARNED:\n${formLessons}` : '',
      formGrade ? `GRADE: ${formGrade}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    if (hookTrades.length > 0 || isLoaded) {
      // Use the hook to add trades
      const trade: Trade = {
        id: isEditing && selectedHookTrade ? selectedHookTrade.id : Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ticker: formSymbol.trim().toUpperCase(),
        strategy: formStrategy,
        direction: formDirection,
        entryPrice: price,
        exitPrice: exitPrice,
        quantity: qty,
        pnl,
        pnlPercent,
        status: formStatus,
        ivAtEntry: formIV ? parseFloat(formIV) : null,
        deltaAtEntry: formDelta ? parseFloat(formDelta) : null,
        daysHeld: formDaysHeld ? parseInt(formDaysHeld) : null,
        notes: combinedNotes,
        tags: formTags,
        purpose: formPurpose || null,
        timeHorizon: formTimeHorizon || null,
      };

      if (isEditing && selectedHookTrade) {
        hookUpdateTrade(trade);
      } else {
        hookAddTrade(trade);
      }
    } else {
      // Fallback to Zustand store
      if (isEditing && selectedEntry) {
        updateJournalEntry(selectedEntry.id, {
          symbol: formSymbol.trim().toUpperCase(),
          strategy: formStrategy,
          direction: formDirection === 'long' ? 'bullish' : 'bearish',
          entryPrice: price,
          exitPrice: exitPrice ?? undefined,
          quantity: qty,
          pnl: pnl ?? undefined,
          status: formStatus === 'closed' ? (pnl && pnl > 0 ? 'win' : pnl && pnl < 0 ? 'loss' : 'breakeven') : 'open',
          notes: combinedNotes,
          lessons: formLessons,
          tags: formTags,
        });
      } else {
        addJournalEntry({
          date: new Date().toISOString().split('T')[0],
          symbol: formSymbol.trim().toUpperCase(),
          strategy: formStrategy,
          direction: formDirection === 'long' ? 'bullish' : 'bearish',
          entryPrice: price,
          exitPrice: exitPrice ?? undefined,
          quantity: qty,
          pnl: pnl ?? undefined,
          status: formStatus === 'closed' ? (pnl && pnl > 0 ? 'win' : pnl && pnl < 0 ? 'loss' : 'breakeven') : 'open',
          notes: combinedNotes,
          lessons: formLessons,
          emotions: [],
          tags: formTags,
        });
      }
    }

    resetForm();
    setShowNewEntry(false);
    setSelectedEntry(null);
    setSelectedHookTrade(null);
  }, [
    formSymbol, formStrategy, formDirection, formEntryPrice, formExitPrice,
    formQuantity, formStatus, formNotes, formPreTradePlan, formPostReflection,
    formLessons, formTags, formIV, formDelta, formDaysHeld, formPurpose,
    formTimeHorizon, formGrade, hookTrades, isLoaded, isEditing,
    selectedEntry, selectedHookTrade,
    hookAddTrade, hookUpdateTrade, addJournalEntry, updateJournalEntry, resetForm,
  ]);

  const handleDeleteEntry = useCallback((entry: TradeJournalEntry) => {
    Alert.alert(
      'Delete Entry',
      `Delete the ${entry.symbol} ${entry.strategy} entry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (hookTrades.length > 0) {
              hookDeleteTrade(entry.id);
            } else {
              deleteJournalEntry(entry.id);
            }
            setSelectedEntry(null);
            setSelectedHookTrade(null);
          },
        },
      ],
    );
  }, [hookTrades, hookDeleteTrade, deleteJournalEntry]);

  const handleEditEntry = useCallback((entry: TradeJournalEntry) => {
    setIsEditing(true);
    setFormSymbol(entry.symbol);
    setFormStrategy(entry.strategy);
    setFormEntryPrice(entry.entryPrice.toString());
    setFormExitPrice(entry.exitPrice?.toString() || '');
    setFormQuantity(entry.quantity.toString());
    setFormDirection(entry.direction === 'bearish' ? 'short' : 'long');
    setFormStatus(entry.status === 'open' ? 'open' : 'closed');
    setFormNotes(entry.notes || '');
    setFormLessons(entry.lessons || '');
    setFormTags(entry.tags || []);
    setSelectedEntry(entry);
    setShowNewEntry(true);
  }, []);

  const handleExport = useCallback(async () => {
    const trades = filteredEntries;
    if (trades.length === 0) {
      Alert.alert('No Trades', 'No trades to export.');
      return;
    }

    const lines = trades.map(t => {
      const pnlStr = t.pnl != null ? `$${t.pnl}` : 'Open';
      return `${t.date} | ${t.symbol} | ${t.strategy} | ${t.direction} | Entry: $${t.entryPrice.toFixed(2)} | Exit: ${t.exitPrice ? '$' + t.exitPrice.toFixed(2) : '-'} | P&L: ${pnlStr} | ${t.status.toUpperCase()}`;
    });

    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const summary = `\nTrade Journal Summary\n${'='.repeat(40)}\n${lines.join('\n')}\n\nTotal P&L: $${totalPnl.toFixed(2)}\nTotal Trades: ${trades.length}\nWin Rate: ${analytics.winRate.toFixed(1)}%\nProfit Factor: ${analytics.profitFactor.toFixed(2)}`;

    try {
      await Share.share({
        message: summary,
        title: 'Trade Journal Export',
      });
    } catch {
      // User cancelled
    }
  }, [filteredEntries, analytics]);

  // ── Formatting ───────────────────────────────────────────────────────────

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'open': return colors.neon.cyan;
      case 'win': return colors.bullish;
      case 'loss': return colors.bearish;
      case 'breakeven': return colors.neon.yellow;
      default: return colors.text.muted;
    }
  }, []);

  const getDirectionIcon = useCallback((direction: string): { name: keyof typeof Ionicons.glyphMap; color: string } => {
    switch (direction) {
      case 'bullish':
      case 'long':
        return { name: 'trending-up', color: colors.bullish };
      case 'bearish':
      case 'short':
        return { name: 'trending-down', color: colors.bearish };
      default:
        return { name: 'remove-outline', color: colors.neon.cyan };
    }
  }, []);

  const getPatternColor = useCallback((type: string) => {
    switch (type) {
      case 'warning': return colors.bearish;
      case 'strength': return colors.bullish;
      case 'insight': return colors.neon.cyan;
      default: return colors.text.muted;
    }
  }, []);

  const getPatternIcon = useCallback((type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'warning': return 'alert-circle';
      case 'strength': return 'checkmark-circle';
      case 'insight': return 'information-circle';
      default: return 'ellipse';
    }
  }, []);

  const getGradeColor = useCallback((grade: string) => {
    const found = GRADE_OPTIONS.find(g => g.value === grade);
    return found?.color || colors.text.muted;
  }, []);

  // ── Renders ──────────────────────────────────────────────────────────────

  const renderSyncStatus = useCallback(() => {
    if (syncStatus === 'syncing') {
      return (
        <View style={styles.syncRow}>
          <ActivityIndicator size="small" color={colors.neon.cyan} />
          <Text style={[styles.syncText, { color: colors.neon.cyan }]}>Syncing...</Text>
        </View>
      );
    }
    if (syncStatus === 'success') {
      return (
        <View style={styles.syncRow}>
          <Ionicons name="cloud-done" size={14} color={colors.bullish} />
          <Text style={[styles.syncText, { color: colors.bullish }]}>Saved to cloud</Text>
        </View>
      );
    }
    if (syncStatus === 'error' && syncError) {
      return (
        <View style={styles.syncRow}>
          <Ionicons name="cloud-offline" size={14} color={colors.bearish} />
          <Text style={[styles.syncText, { color: colors.bearish }]} numberOfLines={1}>{syncError}</Text>
          <TouchableOpacity onPress={clearSyncError}>
            <Ionicons name="close-circle" size={14} color={colors.bearish} />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [syncStatus, syncError, clearSyncError]);

  const renderStatsOverview = useCallback(() => (
    <View style={styles.statsCard}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: analytics.totalPnL >= 0 ? colors.bullish : colors.bearish }]}>
            {analytics.totalPnL >= 0 ? '+' : ''}${analytics.totalPnL.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Total P&L</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: analytics.winRate >= 50 ? colors.bullish : colors.bearish }]}>
            {analytics.winRate.toFixed(0)}%
          </Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{analytics.totalTrades}</Text>
          <Text style={styles.statLabel}>Closed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: analytics.profitFactor >= 1 ? colors.bullish : colors.bearish }]}>
            {analytics.profitFactor.toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Profit Factor</Text>
        </View>
      </View>

      <View style={styles.avgRow}>
        <View style={styles.avgItem}>
          <Text style={styles.avgLabel}>Avg Win</Text>
          <Text style={[styles.avgValue, { color: colors.bullish }]}>
            +${analytics.avgWin.toFixed(0)}
          </Text>
        </View>
        <View style={styles.avgItem}>
          <Text style={styles.avgLabel}>Avg Loss</Text>
          <Text style={[styles.avgValue, { color: colors.bearish }]}>
            -${analytics.avgLoss.toFixed(0)}
          </Text>
        </View>
        <View style={styles.avgItem}>
          <Text style={styles.avgLabel}>Open</Text>
          <Text style={[styles.avgValue, { color: colors.neon.cyan }]}>
            {analytics.openTrades}
          </Text>
        </View>
      </View>
    </View>
  ), [analytics]);

  // ── Cumulative P&L Line Chart (SVG) ──────────────────────────────────────

  const renderCumulativePnLChart = useCallback(() => {
    const data = chartData.cumulativePnL;
    if (data.length < 2) return null;

    const chartW = Math.max(CHART_WIDTH, 200);
    const chartH = CHART_HEIGHT;
    const padL = 10;
    const padR = 10;
    const padT = 10;
    const padB = 20;
    const plotW = chartW - padL - padR;
    const plotH = chartH - padT - padB;

    const values = data.map(d => d.pnl);
    const minVal = Math.min(...values, 0);
    const maxVal = Math.max(...values, 0);
    const range = maxVal - minVal || 1;

    const points = data.map((d, i) => {
      const x = padL + (i / (data.length - 1)) * plotW;
      const y = padT + plotH - ((d.pnl - minVal) / range) * plotH;
      return { x, y };
    });
    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

    const lastPoint = data[data.length - 1];
    const lineColor = lastPoint.pnl >= 0 ? colors.bullish : colors.bearish;

    // Zero line y
    const zeroY = padT + plotH - ((0 - minVal) / range) * plotH;

    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="trending-up" size={18} color={colors.bullish} />
          <Text style={styles.chartTitle}>Cumulative P&L</Text>
        </View>
        <Svg width={chartW} height={chartH}>
          {/* Zero line */}
          <Line x1={padL} y1={zeroY} x2={chartW - padR} y2={zeroY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4,4" />
          {/* P&L line */}
          <Polyline fill="none" stroke={lineColor} strokeWidth="2" points={polylinePoints} />
          {/* End dot */}
          <Circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={lineColor} />
        </Svg>
        <View style={styles.chartFooter}>
          <Text style={styles.chartFooterText}>First Trade</Text>
          <Text style={[styles.chartFooterValue, { color: lineColor }]}>
            Current: {lastPoint.pnl >= 0 ? '+' : ''}${lastPoint.pnl.toFixed(0)}
          </Text>
        </View>
      </View>
    );
  }, [chartData.cumulativePnL]);

  // ── Monthly Bar Chart (SVG) ──────────────────────────────────────────────

  const renderMonthlyChart = useCallback(() => {
    const data = chartData.monthly;
    if (data.length === 0) return null;

    const chartW = Math.max(CHART_WIDTH, 200);
    const chartH = CHART_HEIGHT;
    const padL = 10;
    const padR = 10;
    const padT = 10;
    const padB = 30;
    const plotH = chartH - padT - padB;
    const barCount = data.length;
    const barGap = 8;
    const barWidth = Math.min(40, (chartW - padL - padR - barGap * (barCount - 1)) / barCount);

    const maxPnL = Math.max(...data.map(m => Math.abs(m.pnl)), 1);

    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="calendar" size={18} color={colors.neon.cyan} />
          <Text style={styles.chartTitle}>Monthly Performance</Text>
        </View>
        <Svg width={chartW} height={chartH}>
          {data.map((month, idx) => {
            const barH = (Math.abs(month.pnl) / maxPnL) * plotH;
            const x = padL + idx * (barWidth + barGap) + (chartW - padL - padR - barCount * barWidth - (barCount - 1) * barGap) / 2;
            const y = padT + plotH - barH;
            const fillColor = month.pnl >= 0 ? colors.bullish : colors.bearish;
            const monthLabel = new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short' });

            return (
              <G key={idx}>
                <Rect x={x} y={y} width={barWidth} height={Math.max(barH, 2)} rx={3} fill={fillColor} opacity={0.8} />
                <SvgText x={x + barWidth / 2} y={chartH - padB + 14} fill={colors.text.muted} fontSize="10" textAnchor="middle">
                  {monthLabel}
                </SvgText>
                <SvgText x={x + barWidth / 2} y={y - 4} fill={fillColor} fontSize="9" textAnchor="middle" fontWeight="bold">
                  {month.pnl >= 0 ? '+' : ''}{month.pnl.toFixed(0)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    );
  }, [chartData.monthly]);

  // ── P&L Distribution Buckets ─────────────────────────────────────────────

  const renderPnLDistribution = useCallback(() => {
    const buckets = chartData.pnlBuckets;
    const total = Object.values(buckets).reduce((a, b) => a + b, 0);
    if (total === 0) return null;

    const items = [
      { label: 'Big Loss', value: buckets.bigLoss, color: '#ff073a', desc: '<-$200' },
      { label: 'Sm Loss', value: buckets.smallLoss, color: '#ff6666', desc: '-$200~-$50' },
      { label: 'B/E', value: buckets.breakeven, color: '#666666', desc: '+/-$50' },
      { label: 'Sm Win', value: buckets.smallWin, color: '#66ff66', desc: '$50~$200' },
      { label: 'Big Win', value: buckets.bigWin, color: '#39ff14', desc: '>$200' },
    ];

    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="pie-chart" size={18} color={colors.neon.purple} />
          <Text style={styles.chartTitle}>P&L Distribution</Text>
        </View>
        <View style={styles.distributionRow}>
          {items.map((item, idx) => {
            const pct = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <View key={idx} style={styles.distributionItem}>
                <View style={styles.distributionBarContainer}>
                  <View
                    style={[
                      styles.distributionBar,
                      { height: `${Math.max(pct, 5)}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
                <Text style={styles.distributionLabel}>{item.label}</Text>
                <Text style={[styles.distributionValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.distributionDesc}>{item.desc}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }, [chartData.pnlBuckets]);

  // ── Strategy Breakdown ───────────────────────────────────────────────────

  const renderStrategyBreakdown = useCallback(() => {
    const stratEntries = Object.entries(analytics.byStrategy);
    if (stratEntries.length === 0) return null;

    const sorted = stratEntries.sort((a, b) => b[1].totalPnL - a[1].totalPnL);
    const maxPnL = Math.max(...sorted.map(([, d]) => Math.abs(d.totalPnL)), 1);

    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="bar-chart" size={18} color={colors.neon.orange} />
          <Text style={styles.chartTitle}>Performance by Strategy</Text>
        </View>
        {sorted.map(([strategy, data]) => {
          const winRate = data.count > 0 ? (data.wins / data.count) * 100 : 0;
          const barPct = maxPnL > 0 ? (Math.abs(data.totalPnL) / maxPnL) * 100 : 0;
          const barColor = data.totalPnL >= 0 ? colors.bullish : colors.bearish;
          return (
            <View key={strategy} style={styles.strategyRow}>
              <View style={styles.strategyInfo}>
                <Text style={styles.strategyName}>{strategy}</Text>
                <Text style={styles.strategyMeta}>{data.count} trades</Text>
              </View>
              <View style={styles.strategyStats}>
                <Text style={[styles.strategyWinRate, { color: winRate >= 50 ? colors.bullish : colors.bearish }]}>
                  {winRate.toFixed(0)}%
                </Text>
                <Text style={[styles.strategyPnL, { color: barColor }]}>
                  {data.totalPnL >= 0 ? '+' : ''}${data.totalPnL.toFixed(0)}
                </Text>
              </View>
              <View style={styles.strategyBarBg}>
                <View style={[styles.strategyBarFill, { width: `${Math.max(barPct, 3)}%`, backgroundColor: barColor }]} />
              </View>
            </View>
          );
        })}
      </View>
    );
  }, [analytics.byStrategy]);

  // ── Tag Performance ──────────────────────────────────────────────────────

  const renderTagPerformance = useCallback(() => {
    const tagData = chartData.tagPerformance;
    if (tagData.length === 0) return null;

    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="pricetag" size={18} color={colors.neon.yellow} />
          <Text style={styles.chartTitle}>Performance by Tag</Text>
        </View>
        <View style={styles.tagGrid}>
          {tagData.map((tag, idx) => {
            const winRate = tag.trades > 0 ? (tag.wins / tag.trades) * 100 : 0;
            return (
              <View key={idx} style={styles.tagCard}>
                <Text style={styles.tagName}>{tag.tag}</Text>
                <Text style={[styles.tagPnL, { color: tag.pnl >= 0 ? colors.bullish : colors.bearish }]}>
                  {tag.pnl >= 0 ? '+' : ''}${tag.pnl.toFixed(0)}
                </Text>
                <View style={styles.tagMeta}>
                  <Text style={styles.tagMetaText}>{tag.trades} trades</Text>
                  <Text style={[styles.tagMetaText, { color: winRate >= 50 ? colors.bullish : colors.bearish }]}>
                    {winRate.toFixed(0)}% win
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }, [chartData.tagPerformance]);

  // ── Streak & Stats Cards ─────────────────────────────────────────────────

  const renderStatsCards = useCallback(() => (
    <View style={styles.statsGrid}>
      {/* Current Streak */}
      <View style={[styles.miniCard, { borderColor: streakInfo.type === 'win' ? colors.bullish + '40' : streakInfo.type === 'loss' ? colors.bearish + '40' : colors.border.default }]}>
        <Ionicons
          name={streakInfo.type === 'win' ? 'flame' : streakInfo.type === 'loss' ? 'snow' : 'remove'}
          size={20}
          color={streakInfo.type === 'win' ? colors.bullish : streakInfo.type === 'loss' ? colors.bearish : colors.text.muted}
        />
        <Text style={styles.miniCardValue}>{streakInfo.current}</Text>
        <Text style={styles.miniCardLabel}>
          {streakInfo.type === 'win' ? 'Win Streak' : streakInfo.type === 'loss' ? 'Loss Streak' : 'No Streak'}
        </Text>
      </View>

      {/* Max Win Streak */}
      <View style={[styles.miniCard, { borderColor: colors.bullish + '30' }]}>
        <Ionicons name="trophy" size={20} color={colors.bullish} />
        <Text style={styles.miniCardValue}>{streakInfo.maxWin}</Text>
        <Text style={styles.miniCardLabel}>Best Win Streak</Text>
      </View>

      {/* Max Loss Streak */}
      <View style={[styles.miniCard, { borderColor: colors.bearish + '30' }]}>
        <Ionicons name="alert-circle" size={20} color={colors.bearish} />
        <Text style={styles.miniCardValue}>{streakInfo.maxLoss}</Text>
        <Text style={styles.miniCardLabel}>Worst Loss Streak</Text>
      </View>

      {/* Avg Days Held */}
      <View style={[styles.miniCard, { borderColor: colors.neon.cyan + '30' }]}>
        <Ionicons name="time" size={20} color={colors.neon.cyan} />
        <Text style={styles.miniCardValue}>{analytics.avgDaysHeld.toFixed(0)}</Text>
        <Text style={styles.miniCardLabel}>Avg Days Held</Text>
      </View>

      {/* Best Trade */}
      {bestTrade && (
        <View style={[styles.miniCard, { borderColor: colors.bullish + '30' }]}>
          <Ionicons name="arrow-up-circle" size={20} color={colors.bullish} />
          <Text style={[styles.miniCardValue, { color: colors.bullish }]}>+${(bestTrade.pnl || 0).toFixed(0)}</Text>
          <Text style={styles.miniCardLabel}>{bestTrade.ticker}</Text>
        </View>
      )}

      {/* Worst Trade */}
      {worstTrade && (
        <View style={[styles.miniCard, { borderColor: colors.bearish + '30' }]}>
          <Ionicons name="arrow-down-circle" size={20} color={colors.bearish} />
          <Text style={[styles.miniCardValue, { color: colors.bearish }]}>${(worstTrade.pnl || 0).toFixed(0)}</Text>
          <Text style={styles.miniCardLabel}>{worstTrade.ticker}</Text>
        </View>
      )}

      {/* IV Analysis */}
      {analytics.highIVWinRate > 0 && (
        <View style={[styles.miniCard, { borderColor: colors.neon.purple + '30' }]}>
          <Ionicons name="pulse" size={20} color={colors.neon.purple} />
          <Text style={styles.miniCardValue}>{analytics.highIVWinRate.toFixed(0)}%</Text>
          <Text style={styles.miniCardLabel}>High IV Win Rate</Text>
        </View>
      )}

      {analytics.lowIVWinRate > 0 && (
        <View style={[styles.miniCard, { borderColor: colors.neon.cyan + '30' }]}>
          <Ionicons name="pulse" size={20} color={colors.neon.cyan} />
          <Text style={styles.miniCardValue}>{analytics.lowIVWinRate.toFixed(0)}%</Text>
          <Text style={styles.miniCardLabel}>Low IV Win Rate</Text>
        </View>
      )}
    </View>
  ), [streakInfo, analytics, bestTrade, worstTrade]);

  // ── Patterns Tab ─────────────────────────────────────────────────────────

  const renderPatterns = useCallback(() => (
    <View style={styles.patternsContainer}>
      <View style={styles.patternIntro}>
        <Ionicons name="analytics" size={20} color={colors.neon.cyan} />
        <Text style={styles.patternIntroText}>
          Pattern recognition analyzes your trading history to identify strengths, weaknesses, and actionable insights.
        </Text>
      </View>

      {patterns.map((pattern, idx) => {
        const pColor = getPatternColor(pattern.type);
        const pIcon = getPatternIcon(pattern.type);
        return (
          <View
            key={idx}
            style={[styles.patternCard, { borderColor: pColor + '40', backgroundColor: pColor + '08' }]}
          >
            <View style={styles.patternContent}>
              <View style={[styles.patternIconBg, { backgroundColor: pColor + '20' }]}>
                <Ionicons name={pIcon} size={18} color={pColor} />
              </View>
              <View style={styles.patternTextContent}>
                <Text style={[styles.patternTitle, { color: pColor }]}>{pattern.title}</Text>
                <Text style={styles.patternDescription}>{pattern.description}</Text>
              </View>
              {pattern.metric && (
                <Text style={[styles.patternMetric, { color: pColor }]}>{pattern.metric}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  ), [patterns, getPatternColor, getPatternIcon]);

  // ── Trade Entry Card ─────────────────────────────────────────────────────

  const renderTradeCard = useCallback((entry: TradeJournalEntry) => {
    const dirIcon = getDirectionIcon(entry.direction);
    const statusColor = getStatusColor(entry.status);
    return (
      <TouchableOpacity
        key={entry.id}
        style={styles.entryCard}
        onPress={() => setSelectedEntry(entry)}
        activeOpacity={0.7}
      >
        <View style={styles.entryHeader}>
          <View style={styles.entrySymbol}>
            <View style={[styles.directionIcon, { backgroundColor: dirIcon.color + '15' }]}>
              <Ionicons name={dirIcon.name} size={18} color={dirIcon.color} />
            </View>
            <View>
              <Text style={styles.symbolText}>{entry.symbol}</Text>
              <Text style={styles.strategyText}>{entry.strategy}</Text>
            </View>
          </View>
          <View style={styles.entryMeta}>
            <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {entry.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.entryBody}>
          <View style={styles.entryPrices}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Entry</Text>
              <Text style={styles.priceValue}>${entry.entryPrice.toFixed(2)}</Text>
            </View>
            <Ionicons name="arrow-forward" size={14} color={colors.text.muted} />
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Exit</Text>
              <Text style={styles.priceValue}>
                {entry.exitPrice != null ? `$${entry.exitPrice.toFixed(2)}` : '-'}
              </Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Qty</Text>
              <Text style={styles.priceValue}>{entry.quantity}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>P&L</Text>
              <Text style={[
                styles.pnlValue,
                { color: entry.pnl != null ? (entry.pnl >= 0 ? colors.bullish : colors.bearish) : colors.text.muted },
              ]}>
                {entry.pnl != null ? `${entry.pnl >= 0 ? '+' : ''}$${entry.pnl.toFixed(0)}` : '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tags row */}
        {(entry.tags.length > 0) && (
          <View style={styles.tagsRow}>
            {entry.tags.map(tag => (
              <View key={tag} style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {entry.notes ? (
          <Text style={styles.notesPreview} numberOfLines={2}>
            {entry.notes}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  }, [formatDate, getDirectionIcon, getStatusColor]);

  // ── Filter Bar ───────────────────────────────────────────────────────────

  const renderFilterBar = useCallback(() => (
    <View style={styles.filterBarContainer}>
      {/* Status filter pills */}
      <View style={styles.filterTabs}>
        {(['all', 'open', 'closed'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action buttons row */}
      <View style={styles.filterActionsRow}>
        {/* Strategy filter */}
        <TouchableOpacity style={styles.filterChip} onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="funnel" size={14} color={filterStrategy !== 'all' ? colors.neon.green : colors.text.muted} />
          <Text style={[styles.filterChipText, filterStrategy !== 'all' && { color: colors.neon.green }]}>
            {filterStrategy !== 'all' ? filterStrategy : 'Strategy'}
          </Text>
        </TouchableOpacity>

        {/* Sort */}
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setSortBy(prev => prev === 'date' ? 'pnl' : prev === 'pnl' ? 'strategy' : 'date')}
        >
          <Ionicons name="swap-vertical" size={14} color={colors.text.muted} />
          <Text style={styles.filterChipText}>
            {sortBy === 'date' ? 'Date' : sortBy === 'pnl' ? 'P&L' : 'Strategy'}
          </Text>
        </TouchableOpacity>

        {/* Export */}
        <TouchableOpacity style={styles.filterChip} onPress={handleExport}>
          <Ionicons name="share-outline" size={14} color={colors.text.muted} />
          <Text style={styles.filterChipText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Expanded strategy filter */}
      {showFilters && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.strategyFilterScroll}>
          <TouchableOpacity
            style={[styles.strategyFilterPill, filterStrategy === 'all' && styles.strategyFilterPillActive]}
            onPress={() => { setFilterStrategy('all'); setShowFilters(false); }}
          >
            <Text style={[styles.strategyFilterText, filterStrategy === 'all' && styles.strategyFilterTextActive]}>All</Text>
          </TouchableOpacity>
          {uniqueStrategies.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.strategyFilterPill, filterStrategy === s && styles.strategyFilterPillActive]}
              onPress={() => { setFilterStrategy(s); setShowFilters(false); }}
            >
              <Text style={[styles.strategyFilterText, filterStrategy === s && styles.strategyFilterTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  ), [filter, filterStrategy, sortBy, showFilters, uniqueStrategies, handleExport]);

  // ── Main Render ──────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Trade Journal</Text>
          <Text style={styles.headerSubtitle}>Track, analyze & improve</Text>
          {renderSyncStatus()}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => { resetForm(); setShowNewEntry(true); }}>
          <Ionicons name="add" size={24} color={colors.background.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Tabs */}
      <View style={styles.mainTabs}>
        {([
          { id: 'trades' as MainTab, label: 'Trades', icon: 'book-outline' as const },
          { id: 'analytics' as MainTab, label: 'Analytics', icon: 'bar-chart-outline' as const },
          { id: 'patterns' as MainTab, label: 'Patterns', icon: 'analytics-outline' as const },
        ]).map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.mainTab, activeTab === tab.id && styles.mainTabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={activeTab === tab.id ? colors.neon.green : colors.text.muted}
            />
            <Text style={[styles.mainTabText, activeTab === tab.id && styles.mainTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Trades Tab ──────────────────────────────────────────── */}
        {activeTab === 'trades' && (
          <>
            {renderStatsOverview()}
            {renderFilterBar()}

            <View style={styles.entriesSection}>
              {filteredEntries.map(entry => renderTradeCard(entry))}
            </View>

            {filteredEntries.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={48} color={colors.text.muted} />
                <Text style={styles.emptyTitle}>No entries yet</Text>
                <Text style={styles.emptyText}>
                  Start journaling your trades to track your progress
                </Text>
                <TouchableOpacity style={styles.emptyButton} onPress={() => { resetForm(); setShowNewEntry(true); }}>
                  <Ionicons name="add" size={18} color={colors.background.primary} />
                  <Text style={styles.emptyButtonText}>Log First Trade</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Tips */}
            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb" size={18} color={colors.neon.yellow} />
                <Text style={styles.tipsTitle}>Journaling Tips</Text>
              </View>
              <Text style={styles.tipsText}>
                {'\u2022'} Record your reasoning before entering{'\n'}
                {'\u2022'} Document both wins AND losses{'\n'}
                {'\u2022'} Note emotional state during trades{'\n'}
                {'\u2022'} Review weekly to spot patterns{'\n'}
                {'\u2022'} Be honest about mistakes
              </Text>
            </View>
          </>
        )}

        {/* ── Analytics Tab ───────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <>
            {renderStatsOverview()}
            {renderStatsCards()}
            {renderCumulativePnLChart()}
            {renderMonthlyChart()}
            {renderPnLDistribution()}
            {renderStrategyBreakdown()}
            {renderTagPerformance()}

            {analytics.totalTrades === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="bar-chart-outline" size={48} color={colors.text.muted} />
                <Text style={styles.emptyTitle}>No analytics yet</Text>
                <Text style={styles.emptyText}>
                  Close some trades to see performance analytics
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── Patterns Tab ────────────────────────────────────────── */}
        {activeTab === 'patterns' && (
          <>
            {renderPatterns()}
          </>
        )}
      </ScrollView>

      {/* ── Entry Detail Modal ──────────────────────────────────────── */}
      <Modal
        visible={selectedEntry !== null && !showNewEntry}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedEntry(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedEntry && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <View style={[styles.directionIcon, { backgroundColor: getDirectionIcon(selectedEntry.direction).color + '15' }]}>
                      <Ionicons
                        name={getDirectionIcon(selectedEntry.direction).name}
                        size={22}
                        color={getDirectionIcon(selectedEntry.direction).color}
                      />
                    </View>
                    <View>
                      <Text style={styles.modalTitle}>{selectedEntry.symbol}</Text>
                      <Text style={styles.modalSubtitle}>{selectedEntry.strategy}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedEntry(null)}>
                    <Ionicons name="close" size={24} color={colors.text.muted} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScroll}>
                  {/* Trade Details */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Trade Details</Text>
                    {[
                      { label: 'Date', value: selectedEntry.date },
                      { label: 'Direction', value: selectedEntry.direction.charAt(0).toUpperCase() + selectedEntry.direction.slice(1) },
                      { label: 'Quantity', value: `${selectedEntry.quantity} contracts` },
                      { label: 'Entry Price', value: `$${selectedEntry.entryPrice.toFixed(2)}` },
                      { label: 'Exit Price', value: selectedEntry.exitPrice != null ? `$${selectedEntry.exitPrice.toFixed(2)}` : 'Open' },
                    ].map((row, idx) => (
                      <View key={idx} style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{row.label}</Text>
                        <Text style={styles.detailValue}>{row.value}</Text>
                      </View>
                    ))}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>P&L</Text>
                      <Text style={[
                        styles.detailValue,
                        { color: selectedEntry.pnl != null ? (selectedEntry.pnl >= 0 ? colors.bullish : colors.bearish) : colors.text.muted },
                      ]}>
                        {selectedEntry.pnl != null ? `${selectedEntry.pnl >= 0 ? '+' : ''}$${selectedEntry.pnl}` : '-'}
                      </Text>
                    </View>
                  </View>

                  {/* Notes */}
                  {selectedEntry.notes ? (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Notes</Text>
                      <Text style={styles.notesText}>{selectedEntry.notes}</Text>
                    </View>
                  ) : null}

                  {/* Lessons */}
                  {selectedEntry.lessons ? (
                    <View style={[styles.detailSection, styles.lessonsSection]}>
                      <Text style={styles.detailSectionTitle}>Lessons / Setup</Text>
                      <Text style={styles.notesText}>{selectedEntry.lessons}</Text>
                    </View>
                  ) : null}

                  {/* Tags */}
                  {selectedEntry.tags.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Tags</Text>
                      <View style={styles.tagsRow}>
                        {selectedEntry.tags.map(tag => (
                          <View key={tag} style={styles.tagBadge}>
                            <Text style={styles.tagBadgeText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      handleEditEntry(selectedEntry);
                    }}
                  >
                    <Ionicons name="create-outline" size={16} color={colors.neon.cyan} />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteEntry(selectedEntry)}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.bearish} />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.closeModalButton, { flex: 1 }]}
                    onPress={() => setSelectedEntry(null)}
                  >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── New / Edit Entry Modal ──────────────────────────────────── */}
      <Modal
        visible={showNewEntry}
        transparent
        animationType="slide"
        onRequestClose={() => { resetForm(); setShowNewEntry(false); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Edit Trade' : 'New Trade Entry'}</Text>
              <TouchableOpacity onPress={() => { resetForm(); setShowNewEntry(false); }}>
                <Ionicons name="close" size={24} color={colors.text.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Symbol */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Symbol</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., SPY"
                  placeholderTextColor={colors.text.muted}
                  value={formSymbol}
                  onChangeText={(t) => setFormSymbol(t.toUpperCase())}
                  autoCapitalize="characters"
                />
              </View>

              {/* Strategy Picker */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Strategy</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowStrategyPicker(!showStrategyPicker)}
                >
                  <Text style={styles.pickerButtonText}>{formStrategy}</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.text.muted} />
                </TouchableOpacity>
                {showStrategyPicker && (
                  <View style={styles.pickerDropdown}>
                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                      {STRATEGY_OPTIONS.map(s => (
                        <TouchableOpacity
                          key={s}
                          style={[styles.pickerOption, formStrategy === s && styles.pickerOptionActive]}
                          onPress={() => { setFormStrategy(s); setShowStrategyPicker(false); }}
                        >
                          <Text style={[styles.pickerOptionText, formStrategy === s && styles.pickerOptionTextActive]}>{s}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Direction */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Direction</Text>
                <View style={styles.directionRow}>
                  {(['long', 'short'] as const).map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.directionButton,
                        formDirection === d && styles.directionButtonActive,
                        formDirection === d && { borderColor: d === 'long' ? colors.bullish : colors.bearish },
                      ]}
                      onPress={() => setFormDirection(d)}
                    >
                      <Ionicons
                        name={d === 'long' ? 'trending-up' : 'trending-down'}
                        size={18}
                        color={formDirection === d ? (d === 'long' ? colors.bullish : colors.bearish) : colors.text.muted}
                      />
                      <Text style={[
                        styles.directionButtonText,
                        formDirection === d && { color: d === 'long' ? colors.bullish : colors.bearish },
                      ]}>
                        {d === 'long' ? 'Long (Buy)' : 'Short (Sell)'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Entry / Exit / Qty */}
              <View style={styles.formRow}>
                <View style={[styles.formSection, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Entry Price</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.text.muted}
                    value={formEntryPrice}
                    onChangeText={setFormEntryPrice}
                  />
                </View>
                <View style={[styles.formSection, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Exit Price</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.text.muted}
                    value={formExitPrice}
                    onChangeText={setFormExitPrice}
                  />
                </View>
                <View style={[styles.formSection, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Qty</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="1"
                    keyboardType="number-pad"
                    placeholderTextColor={colors.text.muted}
                    value={formQuantity}
                    onChangeText={setFormQuantity}
                  />
                </View>
              </View>

              {/* Status */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Status</Text>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowStatusPicker(!showStatusPicker)}>
                  <Text style={styles.pickerButtonText}>{formStatus.charAt(0).toUpperCase() + formStatus.slice(1)}</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.text.muted} />
                </TouchableOpacity>
                {showStatusPicker && (
                  <View style={styles.pickerDropdown}>
                    {(['open', 'closed', 'expired'] as const).map(s => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.pickerOption, formStatus === s && styles.pickerOptionActive]}
                        onPress={() => { setFormStatus(s); setShowStatusPicker(false); }}
                      >
                        <Text style={[styles.pickerOptionText, formStatus === s && styles.pickerOptionTextActive]}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Greeks & Duration */}
              <View style={styles.formRow}>
                <View style={[styles.formSection, { flex: 1 }]}>
                  <Text style={styles.formLabel}>IV at Entry</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="25"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.text.muted}
                    value={formIV}
                    onChangeText={setFormIV}
                  />
                </View>
                <View style={[styles.formSection, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Delta</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.50"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.text.muted}
                    value={formDelta}
                    onChangeText={setFormDelta}
                  />
                </View>
                <View style={[styles.formSection, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Days Held</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="5"
                    keyboardType="number-pad"
                    placeholderTextColor={colors.text.muted}
                    value={formDaysHeld}
                    onChangeText={setFormDaysHeld}
                  />
                </View>
              </View>

              {/* Tags */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Tags</Text>
                <View style={styles.tagsPickerRow}>
                  {TAG_OPTIONS.map(tag => (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagPickerPill, formTags.includes(tag) && styles.tagPickerPillActive]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text style={[styles.tagPickerText, formTags.includes(tag) && styles.tagPickerTextActive]}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Purpose */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Trade Purpose (Optional)</Text>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPurposePicker(!showPurposePicker)}>
                  <Text style={styles.pickerButtonText}>
                    {formPurpose ? PURPOSE_OPTIONS.find(p => p.value === formPurpose)?.label || formPurpose : 'Select purpose...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.text.muted} />
                </TouchableOpacity>
                {showPurposePicker && (
                  <View style={styles.pickerDropdown}>
                    <TouchableOpacity
                      style={styles.pickerOption}
                      onPress={() => { setFormPurpose(''); setShowPurposePicker(false); }}
                    >
                      <Text style={styles.pickerOptionText}>None</Text>
                    </TouchableOpacity>
                    {PURPOSE_OPTIONS.map(p => (
                      <TouchableOpacity
                        key={p.value}
                        style={[styles.pickerOption, formPurpose === p.value && styles.pickerOptionActive]}
                        onPress={() => { setFormPurpose(p.value); setShowPurposePicker(false); }}
                      >
                        <Text style={[styles.pickerOptionText, formPurpose === p.value && styles.pickerOptionTextActive]}>{p.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Time Horizon */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Time Horizon (Optional)</Text>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(!showTimePicker)}>
                  <Text style={styles.pickerButtonText}>
                    {formTimeHorizon ? TIME_HORIZON_OPTIONS.find(h => h.value === formTimeHorizon)?.label || formTimeHorizon : 'Select horizon...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.text.muted} />
                </TouchableOpacity>
                {showTimePicker && (
                  <View style={styles.pickerDropdown}>
                    <TouchableOpacity
                      style={styles.pickerOption}
                      onPress={() => { setFormTimeHorizon(''); setShowTimePicker(false); }}
                    >
                      <Text style={styles.pickerOptionText}>None</Text>
                    </TouchableOpacity>
                    {TIME_HORIZON_OPTIONS.map(h => (
                      <TouchableOpacity
                        key={h.value}
                        style={[styles.pickerOption, formTimeHorizon === h.value && styles.pickerOptionActive]}
                        onPress={() => { setFormTimeHorizon(h.value); setShowTimePicker(false); }}
                      >
                        <Text style={[styles.pickerOptionText, formTimeHorizon === h.value && styles.pickerOptionTextActive]}>{h.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Trade Grade */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Trade Grade (Optional)</Text>
                <View style={styles.gradeRow}>
                  {GRADE_OPTIONS.map(g => (
                    <TouchableOpacity
                      key={g.value}
                      style={[
                        styles.gradeButton,
                        formGrade === g.value && { borderColor: g.color, backgroundColor: g.color + '15' },
                      ]}
                      onPress={() => setFormGrade(formGrade === g.value ? '' : g.value)}
                    >
                      <Text style={[
                        styles.gradeButtonText,
                        formGrade === g.value && { color: g.color },
                      ]}>
                        {g.value}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Journal Prompts */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Quick Prompts</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsScroll}>
                  {JOURNAL_PROMPTS.map(prompt => (
                    <TouchableOpacity
                      key={prompt}
                      style={styles.promptPill}
                      onPress={() => setFormPreTradePlan(prev => prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`)}
                    >
                      <Text style={styles.promptPillText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Pre-Trade Plan */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Pre-Trade Plan</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="What's your thesis? Entry/exit criteria?"
                  placeholderTextColor={colors.text.muted}
                  multiline
                  numberOfLines={3}
                  value={formPreTradePlan}
                  onChangeText={setFormPreTradePlan}
                />
              </View>

              {/* Notes */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Any additional notes..."
                  placeholderTextColor={colors.text.muted}
                  multiline
                  numberOfLines={3}
                  value={formNotes}
                  onChangeText={setFormNotes}
                />
              </View>

              {/* Post-Trade Reflection (show for closed) */}
              {formStatus === 'closed' && (
                <>
                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Post-Trade Reflection</Text>
                    <TextInput
                      style={[styles.formInput, styles.formTextarea]}
                      placeholder="Did you follow the plan? What happened?"
                      placeholderTextColor={colors.text.muted}
                      multiline
                      numberOfLines={3}
                      value={formPostReflection}
                      onChangeText={setFormPostReflection}
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Lessons Learned</Text>
                    <TextInput
                      style={[styles.formInput, styles.formTextarea]}
                      placeholder="What would you do differently?"
                      placeholderTextColor={colors.text.muted}
                      multiline
                      numberOfLines={3}
                      value={formLessons}
                      onChangeText={setFormLessons}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitEntry}>
              <Ionicons name={isEditing ? 'checkmark' : 'add-circle'} size={20} color={colors.background.primary} />
              <Text style={styles.submitButtonText}>{isEditing ? 'Update Trade' : 'Add Entry'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  syncText: {
    fontSize: 10,
    fontWeight: '500',
  },

  // Main tabs
  mainTabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  mainTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  mainTabActive: {
    backgroundColor: colors.background.tertiary,
  },
  mainTabText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    fontWeight: typography.weights.medium,
  },
  mainTabTextActive: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'] + 20,
  },

  // Stats card
  statsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border.default,
  },
  avgRow: {
    flexDirection: 'row',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  avgItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  avgLabel: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  avgValue: {
    ...typography.styles.bodySm,
    fontWeight: typography.weights.semibold,
  },

  // Filter bar
  filterBarContainer: {
    marginBottom: spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  filterTabActive: {
    backgroundColor: colors.background.tertiary,
  },
  filterTabText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
  },
  filterTabTextActive: {
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  filterActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  filterChipText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  strategyFilterScroll: {
    marginTop: spacing.sm,
  },
  strategyFilterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  strategyFilterPillActive: {
    backgroundColor: colors.neon.green + '20',
    borderColor: colors.neon.green + '50',
  },
  strategyFilterText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  strategyFilterTextActive: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },

  // Entries
  entriesSection: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  entryCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  entrySymbol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  directionIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  strategyText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  entryMeta: {
    alignItems: 'flex-end',
  },
  dateText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
    fontSize: 10,
  },
  entryBody: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  entryPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: 2,
  },
  priceValue: {
    ...typography.styles.bodySm,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  pnlValue: {
    ...typography.styles.bodySm,
    fontWeight: typography.weights.bold,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  tagBadge: {
    backgroundColor: colors.neon.yellow + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.neon.yellow + '30',
  },
  tagBadgeText: {
    ...typography.styles.caption,
    color: colors.neon.yellow,
    fontSize: 10,
  },
  notesPreview: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },

  // Empty state
  emptyState: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  emptyButtonText: {
    ...typography.styles.buttonSm,
    color: colors.background.primary,
  },

  // Tips
  tipsCard: {
    backgroundColor: colors.neon.yellow + '08',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neon.yellow + '25',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipsTitle: {
    ...typography.styles.label,
    color: colors.neon.yellow,
  },
  tipsText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 22,
  },

  // Charts
  chartCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chartTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  chartFooterText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  chartFooterValue: {
    ...typography.styles.bodySm,
    fontWeight: typography.weights.bold,
  },

  // P&L Distribution
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  distributionItem: {
    alignItems: 'center',
    flex: 1,
  },
  distributionBarContainer: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  distributionBar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  distributionLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 9,
    textAlign: 'center',
  },
  distributionValue: {
    ...typography.styles.bodySm,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  distributionDesc: {
    fontSize: 8,
    color: colors.text.muted,
    textAlign: 'center',
  },

  // Strategy breakdown
  strategyRow: {
    marginBottom: spacing.md,
  },
  strategyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  strategyName: {
    ...typography.styles.bodySm,
    color: colors.text.primary,
  },
  strategyMeta: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  strategyStats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginBottom: 4,
  },
  strategyWinRate: {
    ...typography.styles.caption,
    fontWeight: typography.weights.medium,
  },
  strategyPnL: {
    ...typography.styles.bodySm,
    fontWeight: typography.weights.bold,
  },
  strategyBarBg: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  strategyBarFill: {
    height: 6,
    borderRadius: 3,
  },

  // Tag performance
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.lg * 2 - spacing.sm) / 2,
  },
  tagName: {
    ...typography.styles.label,
    color: colors.neon.yellow,
    marginBottom: 4,
  },
  tagPnL: {
    ...typography.styles.h5,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  tagMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagMetaText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },

  // Stats cards grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  miniCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 2) / 3,
  },
  miniCardValue: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  miniCardLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 2,
  },

  // Patterns
  patternsContainer: {
    gap: spacing.md,
  },
  patternIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.sm,
  },
  patternIntroText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
  },
  patternCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
  },
  patternContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  patternIconBg: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  patternTextContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  patternTitle: {
    ...typography.styles.label,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  patternDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  patternMetric: {
    ...typography.styles.h4,
    fontWeight: typography.weights.bold,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  modalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  modalSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  modalScroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  detailSection: {
    marginBottom: spacing.xl,
  },
  detailSectionTitle: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  detailLabel: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  detailValue: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  notesText: {
    ...typography.styles.body,
    color: colors.text.primary,
    lineHeight: 22,
  },
  lessonsSection: {
    backgroundColor: colors.bullish + '08',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.neon.cyan + '15',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  editButtonText: {
    ...typography.styles.buttonSm,
    color: colors.neon.cyan,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bearish + '15',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  deleteButtonText: {
    ...typography.styles.buttonSm,
    color: colors.bearish,
  },
  closeModalButton: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeModalButtonText: {
    ...typography.styles.button,
    color: colors.text.primary,
  },

  // Form
  formSection: {
    marginBottom: spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  formLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  formInput: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  formTextarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Direction buttons
  directionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  directionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  directionButtonActive: {
    backgroundColor: 'transparent',
  },
  directionButtonText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    fontWeight: typography.weights.medium,
  },

  // Picker
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  pickerButtonText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  pickerDropdown: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  pickerOptionActive: {
    backgroundColor: colors.neon.green + '15',
  },
  pickerOptionText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  pickerOptionTextActive: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },

  // Tags picker
  tagsPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagPickerPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tagPickerPillActive: {
    backgroundColor: colors.neon.yellow + '15',
    borderColor: colors.neon.yellow + '40',
  },
  tagPickerText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  tagPickerTextActive: {
    color: colors.neon.yellow,
    fontWeight: typography.weights.semibold,
  },

  // Grade
  gradeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gradeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  gradeButtonText: {
    ...typography.styles.h5,
    color: colors.text.muted,
    fontWeight: typography.weights.bold,
  },

  // Prompts
  promptsScroll: {
    marginBottom: spacing.sm,
  },
  promptPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.neon.cyan + '10',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neon.cyan + '20',
    marginRight: spacing.sm,
  },
  promptPillText: {
    ...typography.styles.caption,
    color: colors.neon.cyan,
    fontSize: 10,
  },

  // Submit
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    margin: spacing.lg,
    backgroundColor: colors.neon.green,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
  },
  submitButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
});

export default TradeJournalScreen;
