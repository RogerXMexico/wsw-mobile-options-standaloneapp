// Trade Journal Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface JournalEntry {
  id: string;
  date: string;
  symbol: string;
  strategy: string;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  pnl: number | null;
  status: 'open' | 'closed' | 'expired';
  notes: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  setup: string;
  mistakes?: string;
  lessons?: string;
}

// Mock journal entries
const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    symbol: 'SPY',
    strategy: 'Bull Call Spread',
    entryPrice: 2.50,
    exitPrice: 4.20,
    quantity: 2,
    pnl: 340,
    status: 'closed',
    notes: 'Market was showing strong momentum after earnings season.',
    sentiment: 'bullish',
    setup: 'Breakout above 470 resistance',
    lessons: 'Patience paid off - held through minor pullback.',
  },
  {
    id: '2',
    date: '2024-01-12',
    symbol: 'AAPL',
    strategy: 'Iron Condor',
    entryPrice: 3.20,
    exitPrice: 1.60,
    quantity: 1,
    pnl: 160,
    status: 'closed',
    notes: 'Expected consolidation after product launch.',
    sentiment: 'neutral',
    setup: 'High IV after earnings, range-bound price action',
  },
  {
    id: '3',
    date: '2024-01-10',
    symbol: 'NVDA',
    strategy: 'Long Call',
    entryPrice: 5.80,
    exitPrice: 3.20,
    quantity: 1,
    pnl: -260,
    status: 'closed',
    notes: 'Semiconductor weakness caught me off guard.',
    sentiment: 'bullish',
    setup: 'Cup and handle pattern on daily',
    mistakes: 'Entered too early before confirmation. Should have waited for breakout.',
    lessons: 'Always wait for confirmation before entering breakout trades.',
  },
  {
    id: '4',
    date: '2024-01-08',
    symbol: 'TSLA',
    strategy: 'Put Credit Spread',
    entryPrice: 1.80,
    exitPrice: null,
    quantity: 3,
    pnl: null,
    status: 'open',
    notes: 'Support at 240 looks solid.',
    sentiment: 'bullish',
    setup: 'Bounce from 50-day MA support',
  },
];

const TradeJournalScreen: React.FC = () => {
  const navigation = useNavigation();
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showNewEntry, setShowNewEntry] = useState(false);

  // Calculate stats
  const stats = {
    totalTrades: entries.filter(e => e.status === 'closed').length,
    winningTrades: entries.filter(e => e.pnl !== null && e.pnl > 0).length,
    losingTrades: entries.filter(e => e.pnl !== null && e.pnl < 0).length,
    totalPnl: entries.reduce((sum, e) => sum + (e.pnl || 0), 0),
    avgWin: entries.filter(e => e.pnl !== null && e.pnl > 0).length > 0
      ? entries.filter(e => e.pnl !== null && e.pnl > 0).reduce((sum, e) => sum + (e.pnl || 0), 0) /
        entries.filter(e => e.pnl !== null && e.pnl > 0).length
      : 0,
    avgLoss: entries.filter(e => e.pnl !== null && e.pnl < 0).length > 0
      ? entries.filter(e => e.pnl !== null && e.pnl < 0).reduce((sum, e) => sum + (e.pnl || 0), 0) /
        entries.filter(e => e.pnl !== null && e.pnl < 0).length
      : 0,
  };

  const winRate = stats.totalTrades > 0
    ? ((stats.winningTrades / stats.totalTrades) * 100).toFixed(1)
    : '0';

  const filteredEntries = entries.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '🐂';
      case 'bearish': return '🐻';
      default: return '😐';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return colors.neon.cyan;
      case 'closed': return colors.text.muted;
      case 'expired': return colors.neon.yellow;
      default: return colors.text.muted;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Trade Journal</Text>
          <Text style={styles.headerSubtitle}>Track & analyze your trades</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewEntry(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: stats.totalPnl >= 0 ? colors.bullish : colors.bearish }]}>
                {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Total P&L</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.bullish }]}>{winRate}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalTrades}</Text>
              <Text style={styles.statLabel}>Trades</Text>
            </View>
          </View>

          <View style={styles.avgRow}>
            <View style={styles.avgItem}>
              <Text style={styles.avgLabel}>Avg Win</Text>
              <Text style={[styles.avgValue, { color: colors.bullish }]}>
                +${stats.avgWin.toFixed(0)}
              </Text>
            </View>
            <View style={styles.avgItem}>
              <Text style={styles.avgLabel}>Avg Loss</Text>
              <Text style={[styles.avgValue, { color: colors.bearish }]}>
                ${stats.avgLoss.toFixed(0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
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

        {/* Journal Entries */}
        <View style={styles.entriesSection}>
          {filteredEntries.map(entry => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => setSelectedEntry(entry)}
            >
              <View style={styles.entryHeader}>
                <View style={styles.entrySymbol}>
                  <Text style={styles.sentimentEmoji}>{getSentimentEmoji(entry.sentiment)}</Text>
                  <View>
                    <Text style={styles.symbolText}>{entry.symbol}</Text>
                    <Text style={styles.strategyText}>{entry.strategy}</Text>
                  </View>
                </View>
                <View style={styles.entryMeta}>
                  <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(entry.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(entry.status) }]}>
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
                  <Text style={styles.priceArrow}>→</Text>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Exit</Text>
                    <Text style={styles.priceValue}>
                      {entry.exitPrice !== null ? `$${entry.exitPrice.toFixed(2)}` : '-'}
                    </Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>P&L</Text>
                    <Text style={[
                      styles.pnlValue,
                      { color: entry.pnl !== null ? (entry.pnl >= 0 ? colors.bullish : colors.bearish) : colors.text.muted }
                    ]}>
                      {entry.pnl !== null ? `${entry.pnl >= 0 ? '+' : ''}$${entry.pnl}` : '-'}
                    </Text>
                  </View>
                </View>
              </View>

              {entry.notes && (
                <Text style={styles.notesPreview} numberOfLines={2}>
                  {entry.notes}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {filteredEntries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptyText}>
              Start journaling your trades to track your progress
            </Text>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>📓 Journaling Tips</Text>
          <Text style={styles.tipsText}>
            • Record your reasoning before entering{'\n'}
            • Document both wins AND losses{'\n'}
            • Note emotional state during trades{'\n'}
            • Review weekly to spot patterns{'\n'}
            • Be honest about mistakes
          </Text>
        </View>
      </ScrollView>

      {/* Entry Detail Modal */}
      <Modal
        visible={selectedEntry !== null}
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
                    <Text style={styles.modalEmoji}>{getSentimentEmoji(selectedEntry.sentiment)}</Text>
                    <View>
                      <Text style={styles.modalTitle}>{selectedEntry.symbol}</Text>
                      <Text style={styles.modalSubtitle}>{selectedEntry.strategy}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedEntry(null)}>
                    <Text style={styles.modalClose}>×</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScroll}>
                  {/* Trade Details */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Trade Details</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date</Text>
                      <Text style={styles.detailValue}>{selectedEntry.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailValue}>{selectedEntry.quantity} contracts</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Entry Price</Text>
                      <Text style={styles.detailValue}>${selectedEntry.entryPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Exit Price</Text>
                      <Text style={styles.detailValue}>
                        {selectedEntry.exitPrice !== null ? `$${selectedEntry.exitPrice.toFixed(2)}` : 'Open'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>P&L</Text>
                      <Text style={[
                        styles.detailValue,
                        { color: selectedEntry.pnl !== null ? (selectedEntry.pnl >= 0 ? colors.bullish : colors.bearish) : colors.text.muted }
                      ]}>
                        {selectedEntry.pnl !== null ? `${selectedEntry.pnl >= 0 ? '+' : ''}$${selectedEntry.pnl}` : '-'}
                      </Text>
                    </View>
                  </View>

                  {/* Setup */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Setup</Text>
                    <Text style={styles.notesText}>{selectedEntry.setup}</Text>
                  </View>

                  {/* Notes */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Notes</Text>
                    <Text style={styles.notesText}>{selectedEntry.notes}</Text>
                  </View>

                  {/* Mistakes */}
                  {selectedEntry.mistakes && (
                    <View style={[styles.detailSection, styles.mistakesSection]}>
                      <Text style={styles.detailSectionTitle}>Mistakes</Text>
                      <Text style={styles.notesText}>{selectedEntry.mistakes}</Text>
                    </View>
                  )}

                  {/* Lessons */}
                  {selectedEntry.lessons && (
                    <View style={[styles.detailSection, styles.lessonsSection]}>
                      <Text style={styles.detailSectionTitle}>Lessons Learned</Text>
                      <Text style={styles.notesText}>{selectedEntry.lessons}</Text>
                    </View>
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedEntry(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* New Entry Modal */}
      <Modal
        visible={showNewEntry}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewEntry(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Trade Entry</Text>
              <TouchableOpacity onPress={() => setShowNewEntry(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Symbol</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., SPY"
                  placeholderTextColor={colors.text.muted}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Strategy</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Bull Call Spread"
                  placeholderTextColor={colors.text.muted}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formSection, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Entry Price</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.text.muted}
                  />
                </View>
                <View style={[styles.formSection, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Quantity</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="1"
                    keyboardType="number-pad"
                    placeholderTextColor={colors.text.muted}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Sentiment</Text>
                <View style={styles.sentimentRow}>
                  {(['bullish', 'neutral', 'bearish'] as const).map(s => (
                    <TouchableOpacity key={s} style={styles.sentimentButton}>
                      <Text style={styles.sentimentButtonEmoji}>
                        {getSentimentEmoji(s)}
                      </Text>
                      <Text style={styles.sentimentButtonText}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Setup / Thesis</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="What's your reasoning for this trade?"
                  placeholderTextColor={colors.text.muted}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Any additional notes..."
                  placeholderTextColor={colors.text.muted}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => setShowNewEntry(false)}
            >
              <Text style={styles.submitButtonText}>Add Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
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
  backButtonText: {
    fontSize: 24,
    color: colors.text.primary,
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
  addButtonText: {
    fontSize: 24,
    color: colors.background.primary,
    fontWeight: typography.weights.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  statsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
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
    ...typography.styles.h4,
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
    paddingHorizontal: spacing.md,
  },
  avgLabel: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  avgValue: {
    ...typography.styles.bodySm,
    fontWeight: typography.weights.semibold,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
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
  entriesSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
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
  sentimentEmoji: {
    fontSize: 24,
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
    gap: spacing.md,
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
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  priceArrow: {
    color: colors.text.muted,
    fontSize: 16,
  },
  pnlValue: {
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
  },
  notesPreview: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  emptyState: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: colors.neon.yellow + '10',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neon.yellow + '30',
  },
  tipsTitle: {
    ...typography.styles.label,
    color: colors.neon.yellow,
    marginBottom: spacing.sm,
  },
  tipsText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  modalEmoji: {
    fontSize: 32,
  },
  modalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  modalSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  modalClose: {
    fontSize: 28,
    color: colors.text.muted,
  },
  modalScroll: {
    padding: spacing.xl,
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
  mistakesSection: {
    backgroundColor: colors.bearish + '10',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  lessonsSection: {
    backgroundColor: colors.bullish + '10',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  closeButton: {
    margin: spacing.xl,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.styles.button,
    color: colors.text.primary,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
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
  sentimentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sentimentButton: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  sentimentButtonEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  sentimentButtonText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  submitButton: {
    margin: spacing.xl,
    backgroundColor: colors.neon.green,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
});

export default TradeJournalScreen;
