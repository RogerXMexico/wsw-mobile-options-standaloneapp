// Options Quadrant Screen for Wall Street Wildlife Mobile
// Four-quadrant strategy visualization: Bullish/Bearish x Long Vol/Short Vol
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Text as SvgText, Circle, Rect } from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const QUADRANT_SIZE = SCREEN_WIDTH - spacing.md * 2;
const HALF = QUADRANT_SIZE / 2;

// ---------------------------------------------------------------------------
// Strategy placement data
// ---------------------------------------------------------------------------

interface QuadrantStrategy {
  id: string;
  name: string;
  shortName: string;
  x: number; // -1 (bearish) to +1 (bullish)
  y: number; // -1 (short vol) to +1 (long vol)
  tier: number;
  riskLevel: 'low' | 'moderate' | 'high';
  description: string;
  maxProfit: string;
  maxLoss: string;
  outlook: string;
  bestFor: string;
}

const QUADRANT_STRATEGIES: QuadrantStrategy[] = [
  // Bullish + Long Vol (top-right)
  { id: 'long-call', name: 'Long Call', shortName: 'LC', x: 0.7, y: 0.7, tier: 3, riskLevel: 'moderate', description: 'Pay premium for the right to buy shares at the strike price.', maxProfit: 'Unlimited', maxLoss: 'Premium paid', outlook: 'Bullish', bestFor: 'Strong upside conviction with limited capital' },
  { id: 'call-backspread', name: 'Call Backspread', shortName: 'CBS', x: 0.5, y: 0.85, tier: 7, riskLevel: 'moderate', description: 'Sell 1 call, buy 2+ calls at a higher strike for explosive upside.', maxProfit: 'Unlimited', maxLoss: 'Limited', outlook: 'Bullish + Vol', bestFor: 'Explosive bullish moves with vol spike' },
  { id: 'bull-call-spread', name: 'Bull Call Spread', shortName: 'BCS', x: 0.65, y: 0.1, tier: 5, riskLevel: 'low', description: 'Buy a call, sell a higher call. Defined risk bullish play.', maxProfit: 'Width - Debit', maxLoss: 'Net Debit', outlook: 'Moderately Bullish', bestFor: 'Moderate bullish moves, lower cost than long call' },

  // Bearish + Long Vol (top-left)
  { id: 'long-put', name: 'Long Put', shortName: 'LP', x: -0.7, y: 0.7, tier: 3, riskLevel: 'moderate', description: 'Pay premium for the right to sell shares at the strike price.', maxProfit: 'Strike - Premium', maxLoss: 'Premium paid', outlook: 'Bearish', bestFor: 'Strong downside conviction or portfolio hedge' },
  { id: 'put-backspread', name: 'Put Backspread', shortName: 'PBS', x: -0.5, y: 0.85, tier: 7, riskLevel: 'moderate', description: 'Sell 1 put, buy 2+ puts at a lower strike for crash protection.', maxProfit: 'Large (stock to $0)', maxLoss: 'Limited', outlook: 'Bearish + Vol', bestFor: 'Crash protection / bearish explosion' },
  { id: 'bear-put-spread', name: 'Bear Put Spread', shortName: 'BPS', x: -0.65, y: 0.1, tier: 5, riskLevel: 'low', description: 'Buy a put, sell a lower put. Defined risk bearish play.', maxProfit: 'Width - Debit', maxLoss: 'Net Debit', outlook: 'Moderately Bearish', bestFor: 'Moderate bearish moves with defined risk' },

  // Neutral + Long Vol (top-center)
  { id: 'long-straddle', name: 'Long Straddle', shortName: 'LS', x: 0.0, y: 0.8, tier: 6, riskLevel: 'moderate', description: 'Buy both a call and put at the same strike. Profit from big moves.', maxProfit: 'Unlimited', maxLoss: 'Both premiums', outlook: 'Volatile (any direction)', bestFor: 'Expecting explosion, unsure of direction' },
  { id: 'long-strangle', name: 'Long Strangle', shortName: 'LSt', x: 0.0, y: 0.6, tier: 6, riskLevel: 'moderate', description: 'Buy OTM call and OTM put. Cheaper than straddle, needs bigger move.', maxProfit: 'Unlimited', maxLoss: 'Both premiums', outlook: 'Volatile (any direction)', bestFor: 'Cheap pre-event volatility bet' },

  // Bullish + Short Vol (bottom-right)
  { id: 'covered-call', name: 'Covered Call', shortName: 'CC', x: 0.4, y: -0.5, tier: 4, riskLevel: 'low', description: 'Own stock + sell a call. Collect premium income on your shares.', maxProfit: 'Premium + (Strike - Stock)', maxLoss: 'Stock risk - Premium', outlook: 'Neutral-Bullish', bestFor: 'Income generation on existing positions' },
  { id: 'bull-put-spread', name: 'Bull Put Spread', shortName: 'BuPS', x: 0.5, y: -0.6, tier: 5, riskLevel: 'low', description: 'Sell a put, buy a lower put. Credit spread that profits from stability.', maxProfit: 'Net Credit', maxLoss: 'Width - Credit', outlook: 'Bullish / Neutral', bestFor: 'High probability income when bullish' },
  { id: 'cash-secured-put', name: 'Cash-Secured Put', shortName: 'CSP', x: 0.3, y: -0.35, tier: 4, riskLevel: 'moderate', description: 'Sell a put with cash to back it. Collect premium or buy stock at discount.', maxProfit: 'Premium received', maxLoss: 'Strike - Premium', outlook: 'Neutral-Bullish', bestFor: 'Buying stock at a discount via premium' },

  // Bearish + Short Vol (bottom-left)
  { id: 'bear-call-spread', name: 'Bear Call Spread', shortName: 'BeCS', x: -0.5, y: -0.6, tier: 5, riskLevel: 'low', description: 'Sell a call, buy a higher call. Credit spread profiting from downside.', maxProfit: 'Net Credit', maxLoss: 'Width - Credit', outlook: 'Bearish / Neutral', bestFor: 'High probability income when bearish' },
  { id: 'protective-put', name: 'Protective Put', shortName: 'PP', x: -0.3, y: -0.3, tier: 4, riskLevel: 'low', description: 'Own stock + buy a put as insurance against downside.', maxProfit: 'Unlimited (stock upside)', maxLoss: 'Stock Price - Strike + Premium', outlook: 'Hedged Bullish', bestFor: 'Portfolio insurance on existing holdings' },

  // Neutral + Short Vol (bottom-center)
  { id: 'iron-condor', name: 'Iron Condor', shortName: 'IC', x: 0.0, y: -0.6, tier: 6, riskLevel: 'low', description: 'Bull put spread + Bear call spread. Profit from range-bound markets.', maxProfit: 'Net Credit', maxLoss: 'Wing Width - Credit', outlook: 'Range-bound', bestFor: 'Low volatility, range-bound markets' },
  { id: 'iron-butterfly', name: 'Iron Butterfly', shortName: 'IB', x: 0.0, y: -0.75, tier: 6, riskLevel: 'moderate', description: 'Short straddle protected by long strangle wings.', maxProfit: 'Net Credit', maxLoss: 'Wing Width - Credit', outlook: 'Pin at strike', bestFor: 'Expecting stock to pin at a specific price' },
  { id: 'short-strangle', name: 'Short Strangle', shortName: 'SSt', x: 0.0, y: -0.45, tier: 6, riskLevel: 'high', description: 'Sell OTM call + OTM put. Collect double premium, unlimited risk.', maxProfit: 'Both premiums', maxLoss: 'Unlimited', outlook: 'Range-bound', bestFor: 'High conviction that stock stays in range' },
  { id: 'calendar-spread', name: 'Calendar Spread', shortName: 'Cal', x: 0.1, y: -0.3, tier: 7, riskLevel: 'moderate', description: 'Sell front-month, buy back-month at same strike.', maxProfit: 'Limited', maxLoss: 'Net Debit', outlook: 'Neutral near-term', bestFor: 'Time decay harvesting near a strike' },
  { id: 'collar', name: 'Collar', shortName: 'Col', x: 0.15, y: -0.15, tier: 4, riskLevel: 'low', description: 'Own stock + buy put + sell call. Zero-cost protection.', maxProfit: 'Call Strike - Stock', maxLoss: 'Stock - Put Strike', outlook: 'Protected Bullish', bestFor: 'Lock in gains with zero-cost protection' },
];

// Color map for risk levels
const RISK_COLORS: Record<string, string> = {
  low: colors.neon.green,
  moderate: '#fbbf24',
  high: '#ff6b6b',
};

// Tier labels for filtering
const TIER_LABELS: Record<number, string> = {
  3: 'Anchors',
  4: 'Anchors',
  5: 'Verticals',
  6: 'Volatility',
  7: 'Advanced',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const OptionsQuadrantScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedStrategy, setSelectedStrategy] = useState<QuadrantStrategy | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const filteredStrategies = useMemo(() => {
    return QUADRANT_STRATEGIES.filter(s => {
      if (riskFilter !== 'all' && s.riskLevel !== riskFilter) return false;
      if (tierFilter !== 'all' && s.tier.toString() !== tierFilter) return false;
      return true;
    });
  }, [riskFilter, tierFilter]);

  const handleTapStrategy = useCallback((s: QuadrantStrategy) => {
    setSelectedStrategy(s);
    setDetailModalVisible(true);
  }, []);

  // Map strategy position (-1...1) to SVG coordinates
  const toSvgX = (val: number) => HALF + val * (HALF - 30);
  const toSvgY = (val: number) => HALF - val * (HALF - 30); // flip Y

  // ---------------------------------------------------------------------------
  // Quadrant SVG
  // ---------------------------------------------------------------------------

  const renderQuadrantGrid = () => (
    <View style={styles.quadrantContainer}>
      <Svg width={QUADRANT_SIZE} height={QUADRANT_SIZE}>
        {/* Background quadrant fills */}
        <Rect x={HALF} y={0} width={HALF} height={HALF} fill="rgba(57,255,20,0.03)" />
        <Rect x={0} y={0} width={HALF} height={HALF} fill="rgba(255,107,107,0.03)" />
        <Rect x={HALF} y={HALF} width={HALF} height={HALF} fill="rgba(0,240,255,0.03)" />
        <Rect x={0} y={HALF} width={HALF} height={HALF} fill="rgba(191,0,255,0.03)" />

        {/* Axes */}
        <Line x1={0} y1={HALF} x2={QUADRANT_SIZE} y2={HALF} stroke={colors.border.light} strokeWidth={1} />
        <Line x1={HALF} y1={0} x2={HALF} y2={QUADRANT_SIZE} stroke={colors.border.light} strokeWidth={1} />

        {/* Axis labels */}
        <SvgText x={QUADRANT_SIZE - 8} y={HALF - 8} fontSize={10} fill={colors.neon.green} textAnchor="end" fontWeight="700">BULLISH</SvgText>
        <SvgText x={8} y={HALF - 8} fontSize={10} fill="#ff6b6b" textAnchor="start" fontWeight="700">BEARISH</SvgText>
        <SvgText x={HALF + 8} y={16} fontSize={10} fill="#fbbf24" textAnchor="start" fontWeight="700">LONG VOL</SvgText>
        <SvgText x={HALF + 8} y={QUADRANT_SIZE - 8} fontSize={10} fill={colors.neon.cyan} textAnchor="start" fontWeight="700">SHORT VOL</SvgText>

        {/* Arrow indicators */}
        {/* Right arrow (Bullish) */}
        <Line x1={QUADRANT_SIZE - 40} y1={HALF} x2={QUADRANT_SIZE - 14} y2={HALF} stroke={colors.neon.green} strokeWidth={2} />
        <Line x1={QUADRANT_SIZE - 20} y1={HALF - 5} x2={QUADRANT_SIZE - 14} y2={HALF} stroke={colors.neon.green} strokeWidth={2} />
        <Line x1={QUADRANT_SIZE - 20} y1={HALF + 5} x2={QUADRANT_SIZE - 14} y2={HALF} stroke={colors.neon.green} strokeWidth={2} />

        {/* Left arrow (Bearish) */}
        <Line x1={40} y1={HALF} x2={14} y2={HALF} stroke="#ff6b6b" strokeWidth={2} />
        <Line x1={20} y1={HALF - 5} x2={14} y2={HALF} stroke="#ff6b6b" strokeWidth={2} />
        <Line x1={20} y1={HALF + 5} x2={14} y2={HALF} stroke="#ff6b6b" strokeWidth={2} />

        {/* Up arrow (Long Vol) */}
        <Line x1={HALF} y1={40} x2={HALF} y2={14} stroke="#fbbf24" strokeWidth={2} />
        <Line x1={HALF - 5} y1={20} x2={HALF} y2={14} stroke="#fbbf24" strokeWidth={2} />
        <Line x1={HALF + 5} y1={20} x2={HALF} y2={14} stroke="#fbbf24" strokeWidth={2} />

        {/* Down arrow (Short Vol) */}
        <Line x1={HALF} y1={QUADRANT_SIZE - 40} x2={HALF} y2={QUADRANT_SIZE - 14} stroke={colors.neon.cyan} strokeWidth={2} />
        <Line x1={HALF - 5} y1={QUADRANT_SIZE - 20} x2={HALF} y2={QUADRANT_SIZE - 14} stroke={colors.neon.cyan} strokeWidth={2} />
        <Line x1={HALF + 5} y1={QUADRANT_SIZE - 20} x2={HALF} y2={QUADRANT_SIZE - 14} stroke={colors.neon.cyan} strokeWidth={2} />

        {/* Quadrant labels */}
        <SvgText x={QUADRANT_SIZE - 16} y={28} fontSize={9} fill={colors.text.muted} textAnchor="end" fontWeight="600">BULLISH</SvgText>
        <SvgText x={QUADRANT_SIZE - 16} y={40} fontSize={9} fill={colors.text.muted} textAnchor="end" fontWeight="600">LONG VOL</SvgText>

        <SvgText x={16} y={28} fontSize={9} fill={colors.text.muted} textAnchor="start" fontWeight="600">BEARISH</SvgText>
        <SvgText x={16} y={40} fontSize={9} fill={colors.text.muted} textAnchor="start" fontWeight="600">LONG VOL</SvgText>

        <SvgText x={QUADRANT_SIZE - 16} y={QUADRANT_SIZE - 28} fontSize={9} fill={colors.text.muted} textAnchor="end" fontWeight="600">BULLISH</SvgText>
        <SvgText x={QUADRANT_SIZE - 16} y={QUADRANT_SIZE - 16} fontSize={9} fill={colors.text.muted} textAnchor="end" fontWeight="600">SHORT VOL</SvgText>

        <SvgText x={16} y={QUADRANT_SIZE - 28} fontSize={9} fill={colors.text.muted} textAnchor="start" fontWeight="600">BEARISH</SvgText>
        <SvgText x={16} y={QUADRANT_SIZE - 16} fontSize={9} fill={colors.text.muted} textAnchor="start" fontWeight="600">SHORT VOL</SvgText>

        {/* Strategy dots */}
        {filteredStrategies.map(s => {
          const cx = toSvgX(s.x);
          const cy = toSvgY(s.y);
          const dotColor = RISK_COLORS[s.riskLevel];
          const isSelected = selectedStrategy?.id === s.id;
          return (
            <React.Fragment key={s.id}>
              {/* Glow ring when selected */}
              {isSelected && (
                <Circle cx={cx} cy={cy} r={18} fill="none" stroke={dotColor} strokeWidth={2} opacity={0.5} />
              )}
              <Circle cx={cx} cy={cy} r={12} fill={`${dotColor}30`} stroke={dotColor} strokeWidth={1.5} />
              <SvgText x={cx} y={cy + 3.5} fontSize={7} fill="#fff" textAnchor="middle" fontWeight="700">
                {s.shortName}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Touchable overlay dots */}
      {filteredStrategies.map(s => {
        const cx = toSvgX(s.x);
        const cy = toSvgY(s.y);
        return (
          <TouchableOpacity
            key={s.id}
            onPress={() => handleTapStrategy(s)}
            style={[
              styles.dotTouchable,
              { left: cx - 16, top: cy - 16 },
            ]}
            activeOpacity={0.6}
          />
        );
      })}
    </View>
  );

  // ---------------------------------------------------------------------------
  // The Four Basic Moves cards
  // ---------------------------------------------------------------------------

  const basicMoves = [
    {
      title: 'Buy a Call', action: 'BUY', type: 'CALL', outlook: 'Bullish',
      description: 'Pay premium for the RIGHT to buy shares at the strike price. You profit when the stock goes UP.',
      maxProfit: 'Unlimited', maxLoss: 'Premium Paid',
      color: colors.neon.green, bgColor: 'rgba(57,255,20,0.06)', borderColor: 'rgba(57,255,20,0.25)',
      icon: 'trending-up' as const,
    },
    {
      title: 'Sell a Call', action: 'SELL', type: 'CALL', outlook: 'Neutral / Bearish',
      description: 'Receive premium with the OBLIGATION to sell shares if assigned. Profit when stock stays flat/drops.',
      maxProfit: 'Premium Received', maxLoss: 'Unlimited*',
      color: '#fbbf24', bgColor: 'rgba(251,191,36,0.06)', borderColor: 'rgba(251,191,36,0.25)',
      icon: 'cash-outline' as const,
    },
    {
      title: 'Buy a Put', action: 'BUY', type: 'PUT', outlook: 'Bearish',
      description: 'Pay premium for the RIGHT to sell shares at the strike price. You profit when the stock goes DOWN.',
      maxProfit: 'Strike - Premium', maxLoss: 'Premium Paid',
      color: '#ff6b6b', bgColor: 'rgba(255,107,107,0.06)', borderColor: 'rgba(255,107,107,0.25)',
      icon: 'trending-down' as const,
    },
    {
      title: 'Sell a Put', action: 'SELL', type: 'PUT', outlook: 'Neutral / Bullish',
      description: 'Receive premium with the OBLIGATION to buy shares if assigned. Profit when stock stays flat/rises.',
      maxProfit: 'Premium Received', maxLoss: 'Strike x 100 - Premium',
      color: colors.neon.cyan, bgColor: 'rgba(0,240,255,0.06)', borderColor: 'rgba(0,240,255,0.25)',
      icon: 'shield-outline' as const,
    },
  ];

  // ---------------------------------------------------------------------------
  // Order types
  // ---------------------------------------------------------------------------

  const orderTypes = [
    { code: 'BTO', title: 'Buy to Open', desc: 'Opening a new LONG position.', color: colors.neon.green, example: 'You buy 1 AAPL $150 Call -- you now own the call.' },
    { code: 'STC', title: 'Sell to Close', desc: 'Closing an existing LONG position.', color: '#fbbf24', example: 'You sell your AAPL $150 Call -- position closed.' },
    { code: 'STO', title: 'Sell to Open', desc: 'Opening a new SHORT position (writing).', color: '#ff6b6b', example: 'You sell 1 AAPL $150 Put -- you collect premium.' },
    { code: 'BTC', title: 'Buy to Close', desc: 'Closing an existing SHORT position.', color: colors.neon.cyan, example: 'You buy back your AAPL $150 Put -- obligation removed.' },
  ];

  // ---------------------------------------------------------------------------
  // Detail modal
  // ---------------------------------------------------------------------------

  const renderDetailModal = () => (
    <Modal visible={detailModalVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedStrategy && (
            <>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>{selectedStrategy.name}</Text>
                  <Text style={[styles.modalOutlook, { color: getQuadrantColor(selectedStrategy) }]}>
                    {selectedStrategy.outlook}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text.primary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDescription}>{selectedStrategy.description}</Text>

              <View style={styles.modalMetricsRow}>
                <View style={styles.modalMetricBox}>
                  <Text style={styles.modalMetricLabel}>Max Profit</Text>
                  <Text style={[styles.modalMetricValue, { color: colors.neon.green }]}>
                    {selectedStrategy.maxProfit}
                  </Text>
                </View>
                <View style={styles.modalMetricBox}>
                  <Text style={styles.modalMetricLabel}>Max Loss</Text>
                  <Text style={[styles.modalMetricValue, { color: selectedStrategy.maxLoss.includes('Unlimited') ? '#ff6b6b' : colors.text.secondary }]}>
                    {selectedStrategy.maxLoss}
                  </Text>
                </View>
              </View>

              <View style={styles.modalMetricsRow}>
                <View style={styles.modalMetricBox}>
                  <Text style={styles.modalMetricLabel}>Risk Level</Text>
                  <Text style={[styles.modalMetricValue, { color: RISK_COLORS[selectedStrategy.riskLevel] }]}>
                    {selectedStrategy.riskLevel.charAt(0).toUpperCase() + selectedStrategy.riskLevel.slice(1)}
                  </Text>
                </View>
                <View style={styles.modalMetricBox}>
                  <Text style={styles.modalMetricLabel}>Tier</Text>
                  <Text style={[styles.modalMetricValue, { color: colors.neon.cyan }]}>
                    {selectedStrategy.tier} - {TIER_LABELS[selectedStrategy.tier] || 'Core'}
                  </Text>
                </View>
              </View>

              <View style={[styles.bestForBox, { borderColor: getQuadrantColor(selectedStrategy) + '40' }]}>
                <Text style={styles.bestForLabel}>Best Used For</Text>
                <Text style={[styles.bestForText, { color: getQuadrantColor(selectedStrategy) }]}>
                  {selectedStrategy.bestFor}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  function getQuadrantColor(s: QuadrantStrategy): string {
    if (s.x > 0.2 && s.y > 0.2) return colors.neon.green;
    if (s.x < -0.2 && s.y > 0.2) return '#ff6b6b';
    if (s.x > 0.2 && s.y < -0.2) return colors.neon.cyan;
    if (s.x < -0.2 && s.y < -0.2) return colors.neon.purple;
    if (s.y > 0.2) return '#fbbf24';
    if (s.y < -0.2) return colors.neon.cyan;
    return colors.text.secondary;
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Options Quadrant</Text>
          <Text style={styles.headerSubtitle}>Every strategy mapped by direction and volatility</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter row */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Risk:</Text>
          {['all', 'low', 'moderate', 'high'].map(r => (
            <TouchableOpacity
              key={r}
              onPress={() => setRiskFilter(r)}
              style={[styles.filterPill, riskFilter === r && styles.filterPillActive]}
            >
              <Text style={[
                styles.filterPillText,
                riskFilter === r && { color: r === 'all' ? colors.neon.green : RISK_COLORS[r] || colors.neon.green },
              ]}>
                {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Tier:</Text>
          {['all', '3', '4', '5', '6', '7'].map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setTierFilter(t)}
              style={[styles.filterPill, tierFilter === t && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, tierFilter === t && { color: colors.neon.green }]}>
                {t === 'all' ? 'All' : `T${t}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Interactive quadrant */}
        {renderQuadrantGrid()}

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.neon.green }]} />
            <Text style={styles.legendText}>Low Risk</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#fbbf24' }]} />
            <Text style={styles.legendText}>Moderate</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} />
            <Text style={styles.legendText}>High Risk</Text>
          </View>
        </View>
        <Text style={styles.legendHint}>
          Tap any dot to see strategy details. Filter by risk level or tier above.
        </Text>

        {/* The Four Basic Moves */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBadge}>
            <Ionicons name="flash-outline" size={14} color={colors.neon.purple} />
            <Text style={styles.sectionBadgeText}>THE FOUR PILLARS</Text>
          </View>
          <Text style={styles.sectionTitle}>The Four Basic Moves</Text>
          <Text style={styles.sectionSubtitle}>
            Every options strategy is built from these four building blocks.
          </Text>
        </View>

        {basicMoves.map((move, idx) => (
          <View key={idx} style={[styles.moveCard, { backgroundColor: move.bgColor, borderColor: move.borderColor }]}>
            <View style={styles.moveHeader}>
              <View style={[styles.moveIconBox, { backgroundColor: move.bgColor, borderColor: move.borderColor }]}>
                <Ionicons name={move.icon} size={22} color={move.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.moveTitle, { color: move.color }]}>{move.title}</Text>
                <View style={styles.moveTags}>
                  <View style={[styles.moveTag, { backgroundColor: move.action === 'BUY' ? 'rgba(57,255,20,0.15)' : 'rgba(255,107,107,0.15)' }]}>
                    <Text style={[styles.moveTagText, { color: move.action === 'BUY' ? colors.neon.green : '#ff6b6b' }]}>
                      {move.action}
                    </Text>
                  </View>
                  <View style={[styles.moveTag, { backgroundColor: move.type === 'CALL' ? 'rgba(57,255,20,0.08)' : 'rgba(255,107,107,0.08)' }]}>
                    <Text style={[styles.moveTagText, { color: move.type === 'CALL' ? '#66ff88' : '#ff8888' }]}>
                      {move.type}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.moveOutlookLabel}>Outlook</Text>
                <Text style={[styles.moveOutlookValue, { color: move.color }]}>{move.outlook}</Text>
              </View>
            </View>
            <Text style={styles.moveDescription}>{move.description}</Text>
            <View style={styles.moveMetrics}>
              <View style={styles.moveMetricBox}>
                <Text style={styles.moveMetricLabel}>Max Profit</Text>
                <Text style={[styles.moveMetricValue, move.maxProfit === 'Unlimited' && { color: colors.neon.green }]}>
                  {move.maxProfit}
                </Text>
              </View>
              <View style={styles.moveMetricBox}>
                <Text style={styles.moveMetricLabel}>Max Loss</Text>
                <Text style={[styles.moveMetricValue, move.maxLoss.includes('Unlimited') && { color: '#ff6b6b' }]}>
                  {move.maxLoss}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Visual Legend */}
        <View style={styles.buySelLegend}>
          <View style={styles.buySelItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.neon.green }]} />
            <Text style={styles.legendText}>BUY = Pay Premium, Get Rights</Text>
          </View>
          <View style={styles.buySelItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} />
            <Text style={styles.legendText}>SELL = Receive Premium, Have Obligations</Text>
          </View>
        </View>

        {/* Order Types */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionBadge, { borderColor: 'rgba(191,0,255,0.3)', backgroundColor: 'rgba(191,0,255,0.08)' }]}>
            <Ionicons name="swap-horizontal-outline" size={14} color={colors.neon.purple} />
            <Text style={[styles.sectionBadgeText, { color: colors.neon.purple }]}>ORDER TYPES</Text>
          </View>
          <Text style={styles.sectionTitle}>Opening & Closing Positions</Text>
          <Text style={styles.sectionSubtitle}>
            These terms describe whether you're entering or exiting a position.
          </Text>
        </View>

        {orderTypes.map((ot, idx) => (
          <View key={idx} style={[styles.orderCard, { borderColor: `${ot.color}25` }]}>
            <View style={styles.orderHeader}>
              <View style={[styles.orderCodeBox, { backgroundColor: `${ot.color}15`, borderColor: `${ot.color}30` }]}>
                <Text style={[styles.orderCode, { color: ot.color }]}>{ot.code}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.orderTitle, { color: ot.color }]}>{ot.title}</Text>
                <Text style={styles.orderDesc}>{ot.desc}</Text>
              </View>
            </View>
            <View style={styles.orderExampleBox}>
              <Text style={styles.orderExampleLabel}>Example:</Text>
              <Text style={styles.orderExampleText}>{ot.example}</Text>
            </View>
          </View>
        ))}

        {/* Position lifecycle */}
        <View style={styles.lifecycleCard}>
          <Text style={styles.lifecycleTitle}>The Position Lifecycle</Text>
          <View style={styles.lifecycleFlow}>
            <View style={[styles.flowBadge, { backgroundColor: 'rgba(57,255,20,0.15)' }]}>
              <Text style={[styles.flowCode, { color: colors.neon.green }]}>BTO</Text>
            </View>
            <Ionicons name="arrow-forward" size={14} color={colors.text.muted} />
            <Text style={styles.flowLabel}>Long Position</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.text.muted} />
            <View style={[styles.flowBadge, { backgroundColor: 'rgba(251,191,36,0.15)' }]}>
              <Text style={[styles.flowCode, { color: '#fbbf24' }]}>STC</Text>
            </View>
          </View>
          <View style={[styles.lifecycleFlow, { marginTop: 8 }]}>
            <View style={[styles.flowBadge, { backgroundColor: 'rgba(255,107,107,0.15)' }]}>
              <Text style={[styles.flowCode, { color: '#ff6b6b' }]}>STO</Text>
            </View>
            <Ionicons name="arrow-forward" size={14} color={colors.text.muted} />
            <Text style={styles.flowLabel}>Short Position</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.text.muted} />
            <View style={[styles.flowBadge, { backgroundColor: 'rgba(0,240,255,0.15)' }]}>
              <Text style={[styles.flowCode, { color: colors.neon.cyan }]}>BTC</Text>
            </View>
          </View>
        </View>

        {/* Pro tip */}
        <Text style={styles.proTip}>
          <Text style={{ color: colors.neon.purple, fontWeight: '700' }}>Pro Tip: </Text>
          Always double-check your order type before submitting. Accidentally using "Sell to Open"
          instead of "Sell to Close" can create an unintended short position!
        </Text>

        {/* Footer note */}
        <Text style={styles.footerNote}>
          <Text style={{ color: '#fbbf24' }}>*</Text> "Unlimited" risk means theoretically unlimited.
          Always use defined-risk strategies like spreads when starting out.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      {renderDetailModal()}
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  filterLabel: {
    fontSize: 11,
    color: colors.text.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    width: 32,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  filterPillActive: {
    backgroundColor: 'rgba(57,255,20,0.10)',
    borderColor: 'rgba(57,255,20,0.40)',
  },
  filterPillText: {
    fontSize: 11,
    color: colors.text.muted,
    fontWeight: '500',
  },

  // Quadrant
  quadrantContainer: {
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  dotTouchable: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // Legend
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  legendHint: {
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.xl,
  },

  // Section headers
  sectionHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(191,0,255,0.3)',
    backgroundColor: 'rgba(191,0,255,0.08)',
    marginBottom: spacing.sm,
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neon.purple,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    textAlign: 'center',
    maxWidth: 320,
  },

  // Basic moves cards
  moveCard: {
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  moveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.sm,
  },
  moveIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  moveTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  moveTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moveTagText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: typography.fonts.mono,
  },
  moveOutlookLabel: {
    fontSize: 9,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moveOutlookValue: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  moveDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  moveMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  moveMetricBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  moveMetricLabel: {
    fontSize: 9,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  moveMetricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
  },

  // Buy/Sell legend
  buySelLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  buySelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
  },

  // Order types
  orderCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.sm,
  },
  orderCodeBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  orderCode: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: typography.fonts.mono,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  orderDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
    lineHeight: 18,
  },
  orderExampleBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  orderExampleLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.muted,
    marginBottom: 2,
  },
  orderExampleText: {
    fontSize: 11,
    color: colors.text.muted,
    lineHeight: 16,
  },

  // Lifecycle
  lifecycleCard: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  lifecycleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  lifecycleFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  flowBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  flowCode: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: typography.fonts.mono,
  },
  flowLabel: {
    fontSize: 12,
    color: colors.text.muted,
  },

  // Pro tip & footer
  proTip: {
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  footerNote: {
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
  },

  // Detail modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  modalOutlook: {
    ...typography.styles.label,
    marginTop: 4,
  },
  modalDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  modalMetricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  modalMetricBox: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  modalMetricLabel: {
    fontSize: 10,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalMetricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  bestForBox: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  bestForLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  bestForText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default OptionsQuadrantScreen;
