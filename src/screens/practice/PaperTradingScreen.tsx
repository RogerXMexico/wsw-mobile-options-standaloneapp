// Paper Trading Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface Position {
  id: string;
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiry: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  side: 'long' | 'short';
}

interface Trade {
  id: string;
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  side: 'long' | 'short';
  quantity: number;
  price: number;
  pnl: number;
  date: string;
}

const PaperTradingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState(10000);
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'call',
      strike: 175,
      expiry: 'Feb 21',
      quantity: 2,
      entryPrice: 3.50,
      currentPrice: 4.25,
      side: 'long',
    },
    {
      id: '2',
      symbol: 'SPY',
      type: 'put',
      strike: 480,
      expiry: 'Feb 14',
      quantity: 1,
      entryPrice: 2.10,
      currentPrice: 1.85,
      side: 'long',
    },
  ]);
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: '1',
      symbol: 'TSLA',
      type: 'call',
      strike: 250,
      side: 'long',
      quantity: 1,
      price: 5.20,
      pnl: 125,
      date: 'Jan 20',
    },
  ]);
  const [showNewTrade, setShowNewTrade] = useState(false);
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    type: 'call' as 'call' | 'put',
    strike: '',
    expiry: 'Feb 21',
    quantity: '1',
    price: '',
    side: 'long' as 'long' | 'short',
  });

  const totalPnl = positions.reduce((sum, p) => {
    const multiplier = p.side === 'long' ? 1 : -1;
    return sum + (p.currentPrice - p.entryPrice) * p.quantity * 100 * multiplier;
  }, 0);

  const handleSubmitTrade = () => {
    if (!newTrade.symbol || !newTrade.strike || !newTrade.price) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    const tradeCost = parseFloat(newTrade.price) * parseInt(newTrade.quantity) * 100;

    if (newTrade.side === 'long' && tradeCost > balance) {
      Alert.alert('Insufficient Funds', 'Not enough balance for this trade');
      return;
    }

    const position: Position = {
      id: Date.now().toString(),
      symbol: newTrade.symbol.toUpperCase(),
      type: newTrade.type,
      strike: parseFloat(newTrade.strike),
      expiry: newTrade.expiry,
      quantity: parseInt(newTrade.quantity),
      entryPrice: parseFloat(newTrade.price),
      currentPrice: parseFloat(newTrade.price),
      side: newTrade.side,
    };

    setPositions([...positions, position]);
    setBalance(prev => newTrade.side === 'long' ? prev - tradeCost : prev + tradeCost);
    setShowNewTrade(false);
    setNewTrade({
      symbol: '',
      type: 'call',
      strike: '',
      expiry: 'Feb 21',
      quantity: '1',
      price: '',
      side: 'long',
    });
  };

  const handleClosePosition = (position: Position) => {
    Alert.alert(
      'Close Position',
      `Close ${position.quantity}x ${position.symbol} ${position.strike} ${position.type.toUpperCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          onPress: () => {
            const pnl = (position.currentPrice - position.entryPrice) *
              position.quantity * 100 * (position.side === 'long' ? 1 : -1);

            const trade: Trade = {
              id: Date.now().toString(),
              symbol: position.symbol,
              type: position.type,
              strike: position.strike,
              side: position.side,
              quantity: position.quantity,
              price: position.currentPrice,
              pnl,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            };

            setTrades([trade, ...trades]);
            setPositions(positions.filter(p => p.id !== position.id));
            setBalance(prev => prev + position.currentPrice * position.quantity * 100);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Paper Trading</Text>
          <Text style={styles.headerSubtitle}>Practice with virtual money</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Summary */}
        <View style={styles.accountCard}>
          <View style={styles.accountRow}>
            <View>
              <Text style={styles.accountLabel}>Buying Power</Text>
              <Text style={styles.accountValue}>
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.accountRight}>
              <Text style={styles.accountLabel}>Unrealized P&L</Text>
              <Text style={[
                styles.accountValue,
                { color: totalPnl >= 0 ? colors.bullish : colors.bearish }
              ]}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* New Trade Button */}
        <TouchableOpacity
          style={styles.newTradeButton}
          onPress={() => setShowNewTrade(true)}
        >
          <Text style={styles.newTradeButtonText}>+ New Trade</Text>
        </TouchableOpacity>

        {/* Open Positions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open Positions ({positions.length})</Text>

          {positions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={32} color={colors.text.muted} style={{ marginBottom: spacing.sm }} />
              <Text style={styles.emptyText}>No open positions</Text>
            </View>
          ) : (
            <View style={styles.positionsList}>
              {positions.map((position) => {
                const pnl = (position.currentPrice - position.entryPrice) *
                  position.quantity * 100 * (position.side === 'long' ? 1 : -1);
                const pnlPercent = ((position.currentPrice - position.entryPrice) / position.entryPrice * 100) *
                  (position.side === 'long' ? 1 : -1);

                return (
                  <TouchableOpacity
                    key={position.id}
                    style={styles.positionCard}
                    onPress={() => handleClosePosition(position)}
                  >
                    <View style={styles.positionHeader}>
                      <View style={styles.positionLeft}>
                        <Text style={styles.positionSymbol}>{position.symbol}</Text>
                        <View style={[
                          styles.positionTypeBadge,
                          { backgroundColor: position.type === 'call' ? colors.bullish + '20' : colors.bearish + '20' }
                        ]}>
                          <Text style={[
                            styles.positionTypeText,
                            { color: position.type === 'call' ? colors.bullish : colors.bearish }
                          ]}>
                            {position.side.toUpperCase()} {position.type.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.positionRight}>
                        <Text style={[
                          styles.positionPnl,
                          { color: pnl >= 0 ? colors.bullish : colors.bearish }
                        ]}>
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                        </Text>
                        <Text style={[
                          styles.positionPnlPercent,
                          { color: pnl >= 0 ? colors.bullish : colors.bearish }
                        ]}>
                          {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                    <View style={styles.positionDetails}>
                      <Text style={styles.positionDetail}>
                        ${position.strike} strike • {position.expiry} exp
                      </Text>
                      <Text style={styles.positionDetail}>
                        {position.quantity}x @ ${position.entryPrice.toFixed(2)} → ${position.currentPrice.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Trade History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trades</Text>

          {trades.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={32} color={colors.text.muted} style={{ marginBottom: spacing.sm }} />
              <Text style={styles.emptyText}>No trade history</Text>
            </View>
          ) : (
            <View style={styles.tradesList}>
              {trades.map((trade) => (
                <View key={trade.id} style={styles.tradeCard}>
                  <View style={styles.tradeLeft}>
                    <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                    <Text style={styles.tradeInfo}>
                      {trade.side.toUpperCase()} {trade.quantity}x ${trade.strike} {trade.type.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.tradeRight}>
                    <Text style={[
                      styles.tradePnl,
                      { color: trade.pnl >= 0 ? colors.bullish : colors.bearish }
                    ]}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </Text>
                    <Text style={styles.tradeDate}>{trade.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* New Trade Modal */}
      <Modal
        visible={showNewTrade}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewTrade(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Trade</Text>
            <TouchableOpacity onPress={handleSubmitTrade}>
              <Text style={styles.modalSubmit}>Submit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Symbol */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Symbol</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., AAPL"
                placeholderTextColor={colors.text.muted}
                value={newTrade.symbol}
                onChangeText={(text) => setNewTrade({ ...newTrade, symbol: text.toUpperCase() })}
                autoCapitalize="characters"
              />
            </View>

            {/* Type Toggle */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Option Type</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    newTrade.type === 'call' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setNewTrade({ ...newTrade, type: 'call' })}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    newTrade.type === 'call' && styles.toggleButtonTextActive,
                  ]}>
                    CALL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    newTrade.type === 'put' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setNewTrade({ ...newTrade, type: 'put' })}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    newTrade.type === 'put' && styles.toggleButtonTextActive,
                  ]}>
                    PUT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Side Toggle */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Position</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    newTrade.side === 'long' && styles.toggleButtonActiveBuy,
                  ]}
                  onPress={() => setNewTrade({ ...newTrade, side: 'long' })}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    newTrade.side === 'long' && { color: colors.bullish },
                  ]}>
                    BUY (Long)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    newTrade.side === 'short' && styles.toggleButtonActiveSell,
                  ]}
                  onPress={() => setNewTrade({ ...newTrade, side: 'short' })}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    newTrade.side === 'short' && { color: colors.bearish },
                  ]}>
                    SELL (Short)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Strike Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Strike Price</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 175"
                placeholderTextColor={colors.text.muted}
                value={newTrade.strike}
                onChangeText={(text) => setNewTrade({ ...newTrade, strike: text })}
                keyboardType="numeric"
              />
            </View>

            {/* Quantity */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity (contracts)</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor={colors.text.muted}
                value={newTrade.quantity}
                onChangeText={(text) => setNewTrade({ ...newTrade, quantity: text })}
                keyboardType="numeric"
              />
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Option Price (per share)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 3.50"
                placeholderTextColor={colors.text.muted}
                value={newTrade.price}
                onChangeText={(text) => setNewTrade({ ...newTrade, price: text })}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Cost Summary */}
            {newTrade.price && newTrade.quantity && (
              <View style={styles.costSummary}>
                <Text style={styles.costLabel}>
                  {newTrade.side === 'long' ? 'Total Cost:' : 'Credit Received:'}
                </Text>
                <Text style={styles.costValue}>
                  ${(parseFloat(newTrade.price || '0') * parseInt(newTrade.quantity || '1') * 100).toFixed(2)}
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
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
  headerTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  accountCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neon.green + '30',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountRight: {
    alignItems: 'flex-end',
  },
  accountLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  accountValue: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  newTradeButton: {
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  newTradeButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyState: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  positionsList: {
    gap: spacing.md,
  },
  positionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  positionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  positionSymbol: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  positionTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  positionTypeText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
    fontSize: 10,
  },
  positionRight: {
    alignItems: 'flex-end',
  },
  positionPnl: {
    ...typography.styles.label,
    fontWeight: typography.weights.bold,
  },
  positionPnlPercent: {
    ...typography.styles.caption,
  },
  positionDetails: {
    gap: 2,
  },
  positionDetail: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  tradesList: {
    gap: spacing.sm,
  },
  tradeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tradeLeft: {
    flex: 1,
  },
  tradeSymbol: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  tradeInfo: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  tradeRight: {
    alignItems: 'flex-end',
  },
  tradePnl: {
    ...typography.styles.label,
    fontWeight: typography.weights.bold,
  },
  tradeDate: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  modalCancel: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  modalTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  modalSubmit: {
    ...typography.styles.body,
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },
  modalContent: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    height: 48,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  toggleButtonActive: {
    backgroundColor: colors.neon.green + '20',
    borderColor: colors.neon.green,
  },
  toggleButtonActiveBuy: {
    backgroundColor: colors.bullish + '20',
    borderColor: colors.bullish,
  },
  toggleButtonActiveSell: {
    backgroundColor: colors.bearish + '20',
    borderColor: colors.bearish,
  },
  toggleButtonText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  toggleButtonTextActive: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },
  costSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  costLabel: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  costValue: {
    ...typography.styles.h4,
    color: colors.neon.green,
  },
});

export default PaperTradingScreen;
