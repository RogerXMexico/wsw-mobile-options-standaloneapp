// Strategy Builder Screen for Wall Street Wildlife Mobile
import React, { useState, useMemo } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface OptionLeg {
  id: string;
  type: 'call' | 'put';
  action: 'buy' | 'sell';
  strike: number;
  premium: number;
  quantity: number;
}

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  legs: Omit<OptionLeg, 'id' | 'strike' | 'premium'>[];
  emoji: string;
}

const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    id: 'long-call',
    name: 'Long Call',
    description: 'Bullish bet with limited risk',
    emoji: 'trending-up',
    legs: [{ type: 'call', action: 'buy', quantity: 1 }],
  },
  {
    id: 'long-put',
    name: 'Long Put',
    description: 'Bearish bet with limited risk',
    emoji: 'trending-down',
    legs: [{ type: 'put', action: 'buy', quantity: 1 }],
  },
  {
    id: 'covered-call',
    name: 'Covered Call',
    description: 'Generate income on shares',
    emoji: 'shield-checkmark',
    legs: [{ type: 'call', action: 'sell', quantity: 1 }],
  },
  {
    id: 'bull-call-spread',
    name: 'Bull Call Spread',
    description: 'Limited risk bullish play',
    emoji: 'arrow-up-circle',
    legs: [
      { type: 'call', action: 'buy', quantity: 1 },
      { type: 'call', action: 'sell', quantity: 1 },
    ],
  },
  {
    id: 'bear-put-spread',
    name: 'Bear Put Spread',
    description: 'Limited risk bearish play',
    emoji: 'arrow-down-circle',
    legs: [
      { type: 'put', action: 'buy', quantity: 1 },
      { type: 'put', action: 'sell', quantity: 1 },
    ],
  },
  {
    id: 'iron-condor',
    name: 'Iron Condor',
    description: 'Profit from low volatility',
    emoji: 'git-merge-outline',
    legs: [
      { type: 'put', action: 'buy', quantity: 1 },
      { type: 'put', action: 'sell', quantity: 1 },
      { type: 'call', action: 'sell', quantity: 1 },
      { type: 'call', action: 'buy', quantity: 1 },
    ],
  },
  {
    id: 'straddle',
    name: 'Long Straddle',
    description: 'Profit from big moves',
    emoji: 'compass',
    legs: [
      { type: 'call', action: 'buy', quantity: 1 },
      { type: 'put', action: 'buy', quantity: 1 },
    ],
  },
  {
    id: 'strangle',
    name: 'Long Strangle',
    description: 'Cheaper volatility play',
    emoji: 'swap-horizontal',
    legs: [
      { type: 'call', action: 'buy', quantity: 1 },
      { type: 'put', action: 'buy', quantity: 1 },
    ],
  },
];

const StrategyBuilderScreen: React.FC = () => {
  const navigation = useNavigation();
  const [stockPrice, setStockPrice] = useState('100');
  const [legs, setLegs] = useState<OptionLeg[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showAddLeg, setShowAddLeg] = useState(false);
  const [newLeg, setNewLeg] = useState<Partial<OptionLeg>>({
    type: 'call',
    action: 'buy',
    strike: 100,
    premium: 3,
    quantity: 1,
  });

  // Calculate strategy metrics
  const metrics = useMemo(() => {
    const price = parseFloat(stockPrice) || 100;

    let maxProfit = 0;
    let maxLoss = 0;
    let breakevens: number[] = [];
    let netPremium = 0;

    legs.forEach(leg => {
      const legPremium = leg.premium * leg.quantity * 100;
      if (leg.action === 'buy') {
        netPremium -= legPremium;
      } else {
        netPremium += legPremium;
      }
    });

    // Simplified max profit/loss calculation
    if (legs.length === 1) {
      const leg = legs[0];
      if (leg.action === 'buy') {
        maxLoss = Math.abs(netPremium);
        maxProfit = leg.type === 'call' ? Infinity : leg.strike * 100 - Math.abs(netPremium);
      } else {
        maxProfit = Math.abs(netPremium);
        maxLoss = leg.type === 'call' ? Infinity : leg.strike * 100 - Math.abs(netPremium);
      }
    } else if (legs.length === 2) {
      // Spread logic
      const buyLeg = legs.find(l => l.action === 'buy');
      const sellLeg = legs.find(l => l.action === 'sell');

      if (buyLeg && sellLeg && buyLeg.type === sellLeg.type) {
        const width = Math.abs(buyLeg.strike - sellLeg.strike) * 100;
        if (netPremium < 0) {
          // Debit spread
          maxLoss = Math.abs(netPremium);
          maxProfit = width - Math.abs(netPremium);
        } else {
          // Credit spread
          maxProfit = netPremium;
          maxLoss = width - netPremium;
        }
      }
    }

    // Calculate P&L at different price points for chart
    const pricePoints: { price: number; pnl: number }[] = [];
    for (let p = price * 0.7; p <= price * 1.3; p += price * 0.02) {
      let pnl = 0;
      legs.forEach(leg => {
        const multiplier = leg.action === 'buy' ? 1 : -1;
        const premium = leg.premium * leg.quantity * 100;

        if (leg.type === 'call') {
          const intrinsic = Math.max(0, p - leg.strike) * leg.quantity * 100;
          pnl += multiplier * intrinsic - (leg.action === 'buy' ? premium : -premium);
        } else {
          const intrinsic = Math.max(0, leg.strike - p) * leg.quantity * 100;
          pnl += multiplier * intrinsic - (leg.action === 'buy' ? premium : -premium);
        }
      });
      pricePoints.push({ price: p, pnl });
    }

    return {
      netPremium,
      maxProfit: maxProfit === Infinity ? 'Unlimited' : `$${maxProfit.toFixed(0)}`,
      maxLoss: maxLoss === Infinity ? 'Unlimited' : `$${maxLoss.toFixed(0)}`,
      pricePoints,
    };
  }, [legs, stockPrice]);

  const applyTemplate = (template: StrategyTemplate) => {
    const price = parseFloat(stockPrice) || 100;
    const newLegs: OptionLeg[] = template.legs.map((leg, index) => {
      // Set strike prices based on template
      let strike = price;
      if (template.id === 'bull-call-spread') {
        strike = leg.action === 'buy' ? price : price + 5;
      } else if (template.id === 'bear-put-spread') {
        strike = leg.action === 'buy' ? price : price - 5;
      } else if (template.id === 'iron-condor') {
        if (leg.type === 'put') {
          strike = leg.action === 'buy' ? price - 10 : price - 5;
        } else {
          strike = leg.action === 'sell' ? price + 5 : price + 10;
        }
      } else if (template.id === 'strangle') {
        strike = leg.type === 'call' ? price + 5 : price - 5;
      }

      return {
        id: `leg-${Date.now()}-${index}`,
        type: leg.type,
        action: leg.action,
        strike,
        premium: leg.action === 'buy' ? 3 : 2.5,
        quantity: leg.quantity,
      };
    });

    setLegs(newLegs);
    setShowTemplates(false);
  };

  const addLeg = () => {
    const leg: OptionLeg = {
      id: `leg-${Date.now()}`,
      type: newLeg.type || 'call',
      action: newLeg.action || 'buy',
      strike: newLeg.strike || 100,
      premium: newLeg.premium || 3,
      quantity: newLeg.quantity || 1,
    };
    setLegs([...legs, leg]);
    setShowAddLeg(false);
    setNewLeg({
      type: 'call',
      action: 'buy',
      strike: parseFloat(stockPrice) || 100,
      premium: 3,
      quantity: 1,
    });
  };

  const removeLeg = (id: string) => {
    setLegs(legs.filter(l => l.id !== id));
  };

  const clearStrategy = () => {
    setLegs([]);
    setShowTemplates(true);
  };

  // Find min/max P&L for chart scaling
  const minPnl = Math.min(...metrics.pricePoints.map(p => p.pnl));
  const maxPnl = Math.max(...metrics.pricePoints.map(p => p.pnl));
  const pnlRange = maxPnl - minPnl || 1;

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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Strategy Builder</Text>
          <Text style={styles.headerSubtitle}>Build & visualize strategies</Text>
        </View>
        {legs.length > 0 && (
          <TouchableOpacity onPress={clearStrategy} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stock Price Input */}
        <View style={styles.priceInputCard}>
          <Text style={styles.priceInputLabel}>Underlying Price</Text>
          <View style={styles.priceInputWrapper}>
            <Text style={styles.priceInputPrefix}>$</Text>
            <TextInput
              style={styles.priceInput}
              value={stockPrice}
              onChangeText={setStockPrice}
              keyboardType="decimal-pad"
              placeholder="100"
              placeholderTextColor={colors.text.muted}
            />
          </View>
        </View>

        {/* Template Selection */}
        {showTemplates && legs.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose a Strategy</Text>
            <View style={styles.templatesGrid}>
              {STRATEGY_TEMPLATES.map(template => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateCard}
                  onPress={() => applyTemplate(template)}
                >
                  <Ionicons name={template.emoji as keyof typeof Ionicons.glyphMap} size={28} color={colors.neon.green} />
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Legs List */}
        {legs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Option Legs</Text>
              <TouchableOpacity
                style={styles.addLegButton}
                onPress={() => setShowAddLeg(true)}
              >
                <Text style={styles.addLegButtonText}>+ Add Leg</Text>
              </TouchableOpacity>
            </View>

            {legs.map(leg => (
              <View key={leg.id} style={styles.legCard}>
                <View style={styles.legInfo}>
                  <View style={[
                    styles.legBadge,
                    { backgroundColor: leg.action === 'buy' ? colors.bullish + '20' : colors.bearish + '20' }
                  ]}>
                    <Text style={[
                      styles.legBadgeText,
                      { color: leg.action === 'buy' ? colors.bullish : colors.bearish }
                    ]}>
                      {leg.action.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.legDetails}>
                    {leg.quantity}x ${leg.strike} {leg.type.toUpperCase()}
                  </Text>
                  <Text style={styles.legPremium}>@ ${leg.premium.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeLeg(leg.id)}
                  style={styles.removeLegButton}
                >
                  <Text style={styles.removeLegButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* P&L Chart */}
        {legs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>P&L at Expiration</Text>
            <View style={styles.chartCard}>
              <View style={styles.chart}>
                {/* Zero line */}
                <View style={[
                  styles.zeroLine,
                  { top: `${((maxPnl) / pnlRange) * 100}%` }
                ]} />

                {/* Price points */}
                <View style={styles.chartBars}>
                  {metrics.pricePoints.map((point, index) => {
                    const height = Math.abs(point.pnl) / pnlRange * 100;
                    const isProfit = point.pnl >= 0;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.chartBar,
                          {
                            height: `${Math.max(height, 2)}%`,
                            backgroundColor: isProfit ? colors.bullish : colors.bearish,
                            alignSelf: isProfit ? 'flex-end' : 'flex-start',
                          }
                        ]}
                      />
                    );
                  })}
                </View>
              </View>

              {/* Price labels */}
              <View style={styles.chartLabels}>
                <Text style={styles.chartLabel}>
                  ${(parseFloat(stockPrice) * 0.7).toFixed(0)}
                </Text>
                <Text style={styles.chartLabelCenter}>
                  ${parseFloat(stockPrice).toFixed(0)}
                </Text>
                <Text style={styles.chartLabel}>
                  ${(parseFloat(stockPrice) * 1.3).toFixed(0)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Strategy Metrics */}
        {legs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strategy Metrics</Text>
            <View style={styles.metricsCard}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Net Premium</Text>
                <Text style={[
                  styles.metricValue,
                  { color: metrics.netPremium >= 0 ? colors.bullish : colors.bearish }
                ]}>
                  {metrics.netPremium >= 0 ? '+' : ''}${metrics.netPremium.toFixed(2)}
                </Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Max Profit</Text>
                <Text style={[styles.metricValue, { color: colors.bullish }]}>
                  {metrics.maxProfit}
                </Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Max Loss</Text>
                <Text style={[styles.metricValue, { color: colors.bearish }]}>
                  {metrics.maxLoss}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="bulb-outline" size={20} color={colors.neon.yellow} />
            <Text style={styles.tipsTitle}>Strategy Tips</Text>
          </View>
          <Text style={styles.tipsText}>
            • Start with defined-risk strategies like spreads{'\n'}
            • Match strategy to your market outlook{'\n'}
            • Consider time decay and implied volatility{'\n'}
            • Always know your max loss before entering
          </Text>
        </View>
      </ScrollView>

      {/* Add Leg Modal */}
      <Modal
        visible={showAddLeg}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddLeg(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Option Leg</Text>
              <TouchableOpacity onPress={() => setShowAddLeg(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Action Toggle */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Action</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    newLeg.action === 'buy' && styles.toggleButtonActive,
                    newLeg.action === 'buy' && { backgroundColor: colors.bullish + '20' },
                  ]}
                  onPress={() => setNewLeg({ ...newLeg, action: 'buy' })}
                >
                  <Text style={[
                    styles.toggleText,
                    newLeg.action === 'buy' && { color: colors.bullish },
                  ]}>BUY</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    newLeg.action === 'sell' && styles.toggleButtonActive,
                    newLeg.action === 'sell' && { backgroundColor: colors.bearish + '20' },
                  ]}
                  onPress={() => setNewLeg({ ...newLeg, action: 'sell' })}
                >
                  <Text style={[
                    styles.toggleText,
                    newLeg.action === 'sell' && { color: colors.bearish },
                  ]}>SELL</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Type Toggle */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Type</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    newLeg.type === 'call' && styles.toggleButtonActiveBlue,
                  ]}
                  onPress={() => setNewLeg({ ...newLeg, type: 'call' })}
                >
                  <Text style={[
                    styles.toggleText,
                    newLeg.type === 'call' && { color: colors.neon.cyan },
                  ]}>CALL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    newLeg.type === 'put' && styles.toggleButtonActiveBlue,
                  ]}
                  onPress={() => setNewLeg({ ...newLeg, type: 'put' })}
                >
                  <Text style={[
                    styles.toggleText,
                    newLeg.type === 'put' && { color: colors.neon.cyan },
                  ]}>PUT</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Strike Price */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Strike Price</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.modalInput}
                  value={String(newLeg.strike || '')}
                  onChangeText={(v) => setNewLeg({ ...newLeg, strike: parseFloat(v) || 0 })}
                  keyboardType="decimal-pad"
                  placeholder="100"
                  placeholderTextColor={colors.text.muted}
                />
              </View>
            </View>

            {/* Premium */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Premium (per share)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.modalInput}
                  value={String(newLeg.premium || '')}
                  onChangeText={(v) => setNewLeg({ ...newLeg, premium: parseFloat(v) || 0 })}
                  keyboardType="decimal-pad"
                  placeholder="3.00"
                  placeholderTextColor={colors.text.muted}
                />
              </View>
            </View>

            {/* Quantity */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Quantity</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setNewLeg({ ...newLeg, quantity: Math.max(1, (newLeg.quantity || 1) - 1) })}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{newLeg.quantity || 1}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setNewLeg({ ...newLeg, quantity: (newLeg.quantity || 1) + 1 })}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addLeg}>
              <Text style={styles.addButtonText}>Add Leg</Text>
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
  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearButtonText: {
    ...typography.styles.bodySm,
    color: colors.bearish,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  priceInputCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  priceInputLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
  },
  priceInputPrefix: {
    ...typography.styles.h4,
    color: colors.text.muted,
    paddingLeft: spacing.md,
  },
  priceInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  templateCard: {
    width: '47%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  templateName: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  templateDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  addLegButton: {
    backgroundColor: colors.neon.green + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  addLegButtonText: {
    ...typography.styles.bodySm,
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },
  legCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  legInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  legBadgeText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
    fontSize: 10,
  },
  legDetails: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  legPremium: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  removeLegButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bearish + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLegButtonText: {
    fontSize: 18,
    color: colors.bearish,
    fontWeight: typography.weights.bold,
  },
  chartCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  chart: {
    height: 150,
    position: 'relative',
    marginBottom: spacing.md,
  },
  zeroLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.text.muted,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartBar: {
    width: 3,
    borderRadius: 1.5,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  chartLabelCenter: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontWeight: typography.weights.semibold,
  },
  metricsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  metricLabel: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  metricValue: {
    ...typography.styles.h5,
    fontWeight: typography.weights.semibold,
  },
  metricDivider: {
    height: 1,
    backgroundColor: colors.border.default,
  },
  tipsCard: {
    backgroundColor: colors.neon.cyan + '10',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neon.cyan + '30',
  },
  tipsTitle: {
    ...typography.styles.label,
    color: colors.neon.cyan,
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
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  modalClose: {
    fontSize: 28,
    color: colors.text.muted,
  },
  modalSection: {
    marginBottom: spacing.lg,
  },
  modalLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  toggleButtonActive: {
    borderColor: colors.bullish,
  },
  toggleButtonActiveBlue: {
    backgroundColor: colors.neon.cyan + '20',
    borderColor: colors.neon.cyan,
  },
  toggleText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontWeight: typography.weights.semibold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  inputPrefix: {
    ...typography.styles.body,
    color: colors.text.muted,
    paddingLeft: spacing.md,
  },
  modalInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  quantityButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  quantityValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.neon.green,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  addButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
});

export default StrategyBuilderScreen;
