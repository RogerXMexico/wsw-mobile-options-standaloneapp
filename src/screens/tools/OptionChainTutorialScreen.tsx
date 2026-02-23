// Option Chain Tutorial Screen for Wall Street Wildlife Mobile
// Interactive tutorial teaching users how to read an options chain
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChainRow {
  strike: number;
  callBid: number;
  callAsk: number;
  callLast: number;
  callVolume: number;
  callOI: number;
  callDelta: number;
  callIV: number;
  putBid: number;
  putAsk: number;
  putLast: number;
  putVolume: number;
  putOI: number;
  putDelta: number;
  putIV: number;
}

type HighlightColumn = 'bid-ask' | 'volume' | 'oi' | 'delta' | 'iv' | 'strike' | null;
type QuizAnswer = 'A' | 'B' | 'C' | null;

interface QuizQuestion {
  question: string;
  scenario: string;
  options: { label: string; text: string }[];
  correct: QuizAnswer;
  explanation: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STOCK_PRICE = 185;

const mockChainData: ChainRow[] = [
  { strike: 175, callBid: 11.20, callAsk: 11.40, callLast: 11.30, callVolume: 2450, callOI: 15234, callDelta: 0.82, callIV: 24.5, putBid: 0.45, putAsk: 0.50, putLast: 0.48, putVolume: 890, putOI: 8234, putDelta: -0.18, putIV: 26.2 },
  { strike: 180, callBid: 6.80, callAsk: 6.95, callLast: 6.88, callVolume: 5670, callOI: 28456, callDelta: 0.68, callIV: 23.8, putBid: 1.15, putAsk: 1.25, putLast: 1.20, putVolume: 3420, putOI: 19876, putDelta: -0.32, putIV: 25.1 },
  { strike: 185, callBid: 3.40, callAsk: 3.50, callLast: 3.45, callVolume: 12340, callOI: 45678, callDelta: 0.50, callIV: 23.2, putBid: 2.85, putAsk: 2.95, putLast: 2.90, putVolume: 11200, putOI: 42345, putDelta: -0.50, putIV: 23.4 },
  { strike: 190, callBid: 1.35, callAsk: 1.45, callLast: 1.40, callVolume: 8900, callOI: 34567, callDelta: 0.32, callIV: 24.1, putBid: 5.80, putAsk: 5.95, putLast: 5.88, putVolume: 4560, putOI: 21345, putDelta: -0.68, putIV: 24.8 },
  { strike: 195, callBid: 0.42, callAsk: 0.48, callLast: 0.45, callVolume: 3200, callOI: 18234, callDelta: 0.15, callIV: 25.3, putBid: 9.90, putAsk: 10.15, putLast: 10.02, putVolume: 1230, putOI: 9876, putDelta: -0.85, putIV: 26.1 },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: 'You want to buy a call. Which strike has the best liquidity?',
    scenario: 'Look at the bid-ask spreads and volume across strikes.',
    options: [
      { label: 'A', text: '$175 strike (spread: $0.20)' },
      { label: 'B', text: '$185 strike (spread: $0.10)' },
      { label: 'C', text: '$195 strike (spread: $0.06)' },
    ],
    correct: 'B',
    explanation:
      'The $185 ATM strike has the tightest spread ($0.10) AND highest volume (12,340). While $195 has a tighter absolute spread, its low volume means you might not get filled. ATM options typically have the best liquidity.',
  },
  {
    question: 'Which metric tells you about NEW money entering a position?',
    scenario: 'Compare Volume vs Open Interest.',
    options: [
      { label: 'A', text: "Volume - it shows today's activity" },
      { label: 'B', text: 'Open Interest - it shows total positions' },
      { label: 'C', text: 'Both together - compare them' },
    ],
    correct: 'C',
    explanation:
      'When Volume > Open Interest, NEW positions are being opened. When Volume is high but OI stays flat, existing positions are being closed or rolled. You need BOTH metrics to understand the flow.',
  },
  {
    question: 'The $185 call has Delta 0.50. What does this mean?',
    scenario: 'Interpret the Delta value.',
    options: [
      { label: 'A', text: '50% chance of expiring ITM' },
      { label: 'B', text: 'Gains $0.50 for every $1 stock move' },
      { label: 'C', text: 'Both A and B are correct' },
    ],
    correct: 'C',
    explanation:
      'Delta has two interpretations: (1) Approximate probability of expiring ITM, and (2) How much the option price changes per $1 move in the stock. A 0.50 delta means ~50% ITM probability AND $0.50 gain per $1 up move.',
  },
];

const sections = [
  { title: 'Overview', icon: 'eye-outline' as const },
  { title: 'Bid & Ask', icon: 'cash-outline' as const },
  { title: 'Volume & OI', icon: 'bar-chart-outline' as const },
  { title: 'The Greeks', icon: 'analytics-outline' as const },
  { title: 'Strike Selection', icon: 'locate-outline' as const },
  { title: 'Quiz', icon: 'bulb-outline' as const },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const OptionChainTutorialScreen: React.FC = () => {
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  const [activeSection, setActiveSection] = useState(0);
  const [highlightColumn, setHighlightColumn] = useState<HighlightColumn>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([null, null, null]);
  const [showResults, setShowResults] = useState<boolean[]>([false, false, false]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Quiz handlers
  const handleQuizAnswer = (qIdx: number, answer: QuizAnswer) => {
    const next = [...quizAnswers];
    next[qIdx] = answer;
    setQuizAnswers(next);
  };

  const handleCheckAnswer = (qIdx: number) => {
    const next = [...showResults];
    next[qIdx] = true;
    setShowResults(next);
  };

  // Highlight helpers
  const isHighlighted = (col: HighlightColumn) => highlightColumn === col;
  const highlightBg = (col: HighlightColumn) =>
    isHighlighted(col) ? 'rgba(157,78,221,0.25)' : 'transparent';

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderChainTable = () => (
    <View style={styles.chainCard}>
      <Text style={styles.chainCardTitle}>Options Chain</Text>

      {/* Scrollable table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
        <View>
          {/* Header Row 1 */}
          <View style={styles.tableRow}>
            <View style={[styles.headerCell, styles.callsHeader, { flex: 4 }]}>
              <Text style={[styles.headerText, { color: colors.neon.green }]}>CALLS</Text>
            </View>
            <View style={[styles.headerCell, styles.strikeHeader, { backgroundColor: highlightBg('strike') }]}>
              <Text style={[styles.headerText, { color: '#fbbf24' }]}>STRIKE</Text>
            </View>
            <View style={[styles.headerCell, styles.putsHeader, { flex: 4 }]}>
              <Text style={[styles.headerText, { color: '#ff6b6b' }]}>PUTS</Text>
            </View>
          </View>

          {/* Header Row 2 */}
          <View style={styles.tableRow}>
            {/* Call sub-headers */}
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('bid-ask') }]}>
              <Text style={styles.subHeaderText}>Bid</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('bid-ask') }]}>
              <Text style={styles.subHeaderText}>Ask</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('volume') }]}>
              <Text style={styles.subHeaderText}>Vol</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('oi') }]}>
              <Text style={styles.subHeaderText}>OI</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('delta') }]}>
              <Text style={styles.subHeaderText}>Delta</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('iv') }]}>
              <Text style={styles.subHeaderText}>IV</Text>
            </View>

            {/* Strike */}
            <View style={[styles.subHeaderCell, styles.strikeCol, { backgroundColor: highlightBg('strike') }]}>
              <Text style={styles.subHeaderText}>$</Text>
            </View>

            {/* Put sub-headers */}
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('bid-ask') }]}>
              <Text style={styles.subHeaderText}>Bid</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('bid-ask') }]}>
              <Text style={styles.subHeaderText}>Ask</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('volume') }]}>
              <Text style={styles.subHeaderText}>Vol</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('oi') }]}>
              <Text style={styles.subHeaderText}>OI</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('delta') }]}>
              <Text style={styles.subHeaderText}>Delta</Text>
            </View>
            <View style={[styles.subHeaderCell, { backgroundColor: highlightBg('iv') }]}>
              <Text style={styles.subHeaderText}>IV</Text>
            </View>
          </View>

          {/* Data rows */}
          {mockChainData.map((row, idx) => {
            const isATM = row.strike === STOCK_PRICE;
            const isITMCall = row.strike < STOCK_PRICE;
            const isITMPut = row.strike > STOCK_PRICE;
            const isSelected = selectedRow === idx;
            const itmCallBg = isITMCall ? 'rgba(57,255,20,0.06)' : 'transparent';
            const itmPutBg = isITMPut ? 'rgba(255,107,107,0.06)' : 'transparent';
            const atmBg = isATM ? 'rgba(251,191,36,0.10)' : 'transparent';

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedRow(isSelected ? null : idx)}
                style={[
                  styles.tableRow,
                  styles.dataRow,
                  isATM && styles.atmRow,
                  isSelected && styles.selectedRow,
                ]}
                activeOpacity={0.7}
              >
                {/* Call data */}
                <View style={[styles.dataCell, { backgroundColor: itmCallBg }, isHighlighted('bid-ask') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: colors.neon.green }]}>{row.callBid.toFixed(2)}</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmCallBg }, isHighlighted('bid-ask') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: '#66ff88' }]}>{row.callAsk.toFixed(2)}</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmCallBg }, isHighlighted('volume') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: colors.neon.cyan }]}>{(row.callVolume / 1000).toFixed(1)}k</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmCallBg }, isHighlighted('oi') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: colors.text.secondary }]}>{(row.callOI / 1000).toFixed(1)}k</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmCallBg }, isHighlighted('delta') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: colors.neon.purple }]}>{row.callDelta.toFixed(2)}</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmCallBg }, isHighlighted('iv') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: '#fbbf24' }]}>{row.callIV.toFixed(1)}%</Text>
                </View>

                {/* Strike */}
                <View style={[styles.dataCell, styles.strikeCol, { backgroundColor: atmBg }, isHighlighted('strike') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, styles.strikeText, isATM && styles.atmStrike]}>
                    ${row.strike}
                  </Text>
                  {isATM && <Text style={styles.atmLabel}>ATM</Text>}
                </View>

                {/* Put data */}
                <View style={[styles.dataCell, { backgroundColor: itmPutBg }, isHighlighted('bid-ask') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: '#ff6b6b' }]}>{row.putBid.toFixed(2)}</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmPutBg }, isHighlighted('bid-ask') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: '#ff8888' }]}>{row.putAsk.toFixed(2)}</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmPutBg }, isHighlighted('volume') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: colors.neon.cyan }]}>{(row.putVolume / 1000).toFixed(1)}k</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmPutBg }, isHighlighted('oi') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: colors.text.secondary }]}>{(row.putOI / 1000).toFixed(1)}k</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmPutBg }, isHighlighted('delta') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: colors.neon.purple }]}>{row.putDelta.toFixed(2)}</Text>
                </View>
                <View style={[styles.dataCell, { backgroundColor: itmPutBg }, isHighlighted('iv') && styles.highlightedCell]}>
                  <Text style={[styles.cellText, { color: '#fbbf24' }]}>{row.putIV.toFixed(1)}%</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(57,255,20,0.3)' }]} />
          <Text style={styles.legendText}>ITM Calls</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(255,107,107,0.3)' }]} />
          <Text style={styles.legendText}>ITM Puts</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(251,191,36,0.3)' }]} />
          <Text style={styles.legendText}>ATM</Text>
        </View>
      </View>
    </View>
  );

  const renderHighlightButtons = () => (
    <View style={styles.highlightRow}>
      {([
        { key: 'bid-ask' as const, label: 'Bid/Ask', color: colors.neon.green },
        { key: 'volume' as const, label: 'Volume', color: colors.neon.cyan },
        { key: 'oi' as const, label: 'Open Int', color: colors.text.secondary },
        { key: 'delta' as const, label: 'Delta', color: colors.neon.purple },
        { key: 'iv' as const, label: 'IV', color: '#fbbf24' },
        { key: 'strike' as const, label: 'Strike', color: '#fbbf24' },
      ]).map(item => (
        <TouchableOpacity
          key={item.key}
          onPress={() => setHighlightColumn(highlightColumn === item.key ? null : item.key)}
          style={[
            styles.highlightBtn,
            highlightColumn === item.key && { borderColor: item.color, backgroundColor: `${item.color}15` },
          ]}
        >
          <Text style={[styles.highlightBtnText, highlightColumn === item.key && { color: item.color }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ---------------------------------------------------------------------------
  // Section content panels
  // ---------------------------------------------------------------------------

  const renderSectionContent = () => {
    switch (activeSection) {
      case 0: // Overview
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="eye-outline" size={20} color={colors.neon.green} />
              <Text style={styles.sectionTitle}>Overview</Text>
            </View>
            <Text style={styles.sectionBody}>
              The option chain is your{' '}
              <Text style={{ color: colors.neon.green, fontWeight: '700' }}>dashboard</Text> for
              trading options. It shows all available contracts for a given expiration date, organized
              by strike price.
            </Text>

            <View style={styles.infoBox}>
              <Text style={[styles.infoBoxTitle, { color: colors.neon.green }]}>Calls (Left Side)</Text>
              <Text style={styles.infoBoxBody}>
                Bullish bets. Give you the RIGHT to BUY the stock at the strike price.
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={[styles.infoBoxTitle, { color: '#ff6b6b' }]}>Puts (Right Side)</Text>
              <Text style={styles.infoBoxBody}>
                Bearish bets. Give you the RIGHT to SELL the stock at the strike price.
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={[styles.infoBoxTitle, { color: '#fbbf24' }]}>Strike (Center)</Text>
              <Text style={styles.infoBoxBody}>
                The price at which you can buy (call) or sell (put) the underlying stock.
              </Text>
            </View>

            <View style={styles.divider} />
            <Text style={styles.hintText}>
              Tap the buttons below to highlight different columns in the chain.
            </Text>
            {renderHighlightButtons()}
          </View>
        );

      case 1: // Bid & Ask
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="cash-outline" size={20} color={colors.neon.green} />
              <Text style={styles.sectionTitle}>Bid & Ask Spread</Text>
            </View>

            <View style={[styles.alertBox, { borderColor: 'rgba(57,255,20,0.3)', backgroundColor: 'rgba(57,255,20,0.08)' }]}>
              <Text style={[styles.alertTitle, { color: colors.neon.green }]}>The #1 Hidden Cost</Text>
              <Text style={styles.alertBody}>
                The bid-ask spread is the{' '}
                <Text style={{ color: '#fff', fontWeight: '700' }}>immediate cost</Text> of entering
                a trade. Wide spreads eat into your profits before you even start.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bid</Text>
                <Text style={[styles.infoValue, { color: colors.neon.green }]}>$3.40</Text>
              </View>
              <Text style={styles.infoBoxBody}>What buyers will pay (you sell at this)</Text>
            </View>
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ask</Text>
                <Text style={[styles.infoValue, { color: '#ff6b6b' }]}>$3.50</Text>
              </View>
              <Text style={styles.infoBoxBody}>What sellers want (you buy at this)</Text>
            </View>
            <View style={[styles.alertBox, { borderColor: 'rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.08)' }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.alertTitle, { color: '#fbbf24' }]}>Spread</Text>
                <Text style={[styles.infoValue, { color: '#fbbf24' }]}>$0.10 (2.9%)</Text>
              </View>
              <Text style={styles.alertBody}>Your immediate loss if you buy and instantly sell</Text>
            </View>

            <View style={styles.divider} />
            <View style={styles.ruleRow}>
              <Ionicons name="warning-outline" size={14} color="#fbbf24" />
              <Text style={styles.ruleTitleText}>Rule of Thumb</Text>
            </View>
            <Text style={styles.ruleItem}>
              <Text style={{ color: colors.neon.green }}>Tight spread (&lt;5%)</Text> = Liquid, tradeable
            </Text>
            <Text style={styles.ruleItem}>
              <Text style={{ color: '#fbbf24' }}>Wide spread (5-10%)</Text> = Use limit orders
            </Text>
            <Text style={styles.ruleItem}>
              <Text style={{ color: '#ff6b6b' }}>Very wide (&gt;10%)</Text> = Avoid or be patient
            </Text>

            <TouchableOpacity
              onPress={() => setHighlightColumn(highlightColumn === 'bid-ask' ? null : 'bid-ask')}
              style={[styles.highlightActionBtn, { borderColor: 'rgba(157,78,221,0.4)' }]}
            >
              <Text style={{ color: '#9d4edd', fontSize: 13, fontWeight: '600' }}>
                {highlightColumn === 'bid-ask' ? 'Clear Highlight' : 'Highlight Bid/Ask Columns'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 2: // Volume & OI
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="bar-chart-outline" size={20} color={colors.neon.cyan} />
              <Text style={styles.sectionTitle}>Volume & Open Interest</Text>
            </View>

            <View style={[styles.alertBox, { borderColor: 'rgba(0,240,255,0.3)', backgroundColor: 'rgba(0,240,255,0.08)' }]}>
              <Text style={[styles.alertTitle, { color: colors.neon.cyan }]}>Volume</Text>
              <Text style={styles.alertBody}>
                Contracts traded <Text style={{ color: '#fff', fontWeight: '700' }}>TODAY</Text>.
                Resets to zero each morning. High volume = active interest in that strike.
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={[styles.infoBoxTitle, { color: colors.text.secondary }]}>Open Interest (OI)</Text>
              <Text style={styles.infoBoxBody}>
                Total <Text style={{ color: '#fff', fontWeight: '700' }}>OPEN</Text> contracts.
                Updated overnight. High OI = established positions exist at that strike.
              </Text>
            </View>

            <View style={[styles.alertBox, { borderColor: 'rgba(57,255,20,0.3)', backgroundColor: 'rgba(57,255,20,0.08)' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Ionicons name="bulb-outline" size={14} color={colors.neon.green} />
                <Text style={[styles.alertTitle, { color: colors.neon.green }]}>The Signal</Text>
              </View>
              <Text style={styles.signalItem}>
                <Text style={{ color: colors.neon.cyan, fontWeight: '700' }}>Volume {'>'} OI</Text> = New positions opening
              </Text>
              <Text style={styles.signalItem}>
                <Text style={{ color: '#fbbf24', fontWeight: '700' }}>Volume ~ OI</Text> = Positions being closed/rolled
              </Text>
              <Text style={styles.signalItem}>
                <Text style={{ color: '#ff6b6b', fontWeight: '700' }}>Low Vol, High OI</Text> = Stale, less liquid
              </Text>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionBody}>
              High volume and OI mean tighter spreads and easier fills. Low liquidity options can trap
              you in positions you can't exit.
            </Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setHighlightColumn(highlightColumn === 'volume' ? null : 'volume')}
                style={[styles.highlightActionBtn, { flex: 1, borderColor: 'rgba(0,240,255,0.4)' }]}
              >
                <Text style={{ color: colors.neon.cyan, fontSize: 13, fontWeight: '600' }}>Volume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setHighlightColumn(highlightColumn === 'oi' ? null : 'oi')}
                style={[styles.highlightActionBtn, { flex: 1, borderColor: 'rgba(160,160,160,0.3)' }]}
              >
                <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600' }}>Open Interest</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3: // The Greeks
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="analytics-outline" size={20} color={colors.neon.purple} />
              <Text style={styles.sectionTitle}>The Greeks in the Chain</Text>
            </View>

            <View style={[styles.alertBox, { borderColor: 'rgba(191,0,255,0.3)', backgroundColor: 'rgba(191,0,255,0.08)' }]}>
              <Text style={[styles.alertTitle, { color: colors.neon.purple }]}>Delta (Δ)</Text>
              <Text style={styles.alertBody}>Two meanings in one number:</Text>
              <Text style={styles.ruleItem}>
                1. <Text style={{ color: '#fff' }}>Price sensitivity:</Text> $0.50 delta = option gains
                $0.50 per $1 stock move
              </Text>
              <Text style={styles.ruleItem}>
                2. <Text style={{ color: '#fff' }}>Probability proxy:</Text> ~50% chance of expiring ITM
              </Text>
            </View>

            <View style={[styles.alertBox, { borderColor: 'rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.08)' }]}>
              <Text style={[styles.alertTitle, { color: '#fbbf24' }]}>Implied Volatility (IV)</Text>
              <Text style={styles.alertBody}>
                The market's expectation of future volatility. Higher IV = more expensive options.
                Compare IV across strikes to spot{' '}
                <Text style={{ color: '#fff', fontWeight: '700' }}>skew</Text>.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={[styles.infoBoxTitle, { color: '#fff' }]}>Reading Delta Across Strikes</Text>
              <View style={styles.deltaRow}>
                <Text style={styles.deltaLabel}>Deep ITM Call</Text>
                <Text style={[styles.deltaValue, { color: colors.neon.green }]}>Delta ~0.80-0.90</Text>
              </View>
              <View style={styles.deltaRow}>
                <Text style={styles.deltaLabel}>ATM Call</Text>
                <Text style={[styles.deltaValue, { color: '#fbbf24' }]}>Delta ~0.50</Text>
              </View>
              <View style={styles.deltaRow}>
                <Text style={styles.deltaLabel}>OTM Call</Text>
                <Text style={[styles.deltaValue, { color: '#ff6b6b' }]}>Delta ~0.15-0.30</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setHighlightColumn(highlightColumn === 'delta' ? null : 'delta')}
                style={[styles.highlightActionBtn, { flex: 1, borderColor: 'rgba(191,0,255,0.4)' }]}
              >
                <Text style={{ color: colors.neon.purple, fontSize: 13, fontWeight: '600' }}>Delta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setHighlightColumn(highlightColumn === 'iv' ? null : 'iv')}
                style={[styles.highlightActionBtn, { flex: 1, borderColor: 'rgba(251,191,36,0.4)' }]}
              >
                <Text style={{ color: '#fbbf24', fontSize: 13, fontWeight: '600' }}>IV</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 4: // Strike Selection
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="locate-outline" size={20} color={colors.neon.green} />
              <Text style={styles.sectionTitle}>Strike Selection</Text>
            </View>
            <Text style={styles.sectionBody}>
              Choosing the right strike is{' '}
              <Text style={{ color: colors.neon.green, fontWeight: '700' }}>half the trade</Text>.
              Here's what to look for:
            </Text>

            <View style={[styles.alertBox, { borderColor: 'rgba(57,255,20,0.3)', backgroundColor: 'rgba(57,255,20,0.08)' }]}>
              <Text style={[styles.alertTitle, { color: colors.neon.green }]}>1. Check Liquidity First</Text>
              <Text style={styles.ruleItem}>Tight bid-ask spread (&lt;5% of option price)</Text>
              <Text style={styles.ruleItem}>High volume (thousands, not dozens)</Text>
              <Text style={styles.ruleItem}>Decent open interest (&gt;500 contracts)</Text>
            </View>
            <View style={[styles.alertBox, { borderColor: 'rgba(0,240,255,0.3)', backgroundColor: 'rgba(0,240,255,0.08)' }]}>
              <Text style={[styles.alertTitle, { color: colors.neon.cyan }]}>2. Match Delta to Conviction</Text>
              <Text style={styles.ruleItem}>
                <Text style={{ color: '#fff' }}>High conviction:</Text> 0.60-0.70 delta (ITM)
              </Text>
              <Text style={styles.ruleItem}>
                <Text style={{ color: '#fff' }}>Balanced:</Text> 0.40-0.50 delta (ATM)
              </Text>
              <Text style={styles.ruleItem}>
                <Text style={{ color: '#fff' }}>Lottery ticket:</Text> 0.15-0.25 delta (OTM)
              </Text>
            </View>
            <View style={[styles.alertBox, { borderColor: 'rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.08)' }]}>
              <Text style={[styles.alertTitle, { color: '#fbbf24' }]}>3. Consider the Cost</Text>
              <Text style={styles.alertBody}>
                ITM options cost more but have higher probability. OTM options are cheap but often
                expire worthless.{' '}
                <Text style={{ color: '#fff', fontWeight: '700' }}>ATM is often the sweet spot.</Text>
              </Text>
            </View>

            <View style={styles.divider} />
            <View style={styles.infoBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Ionicons name="checkmark-circle" size={14} color={colors.neon.green} />
                <Text style={[styles.infoBoxTitle, { color: '#fff' }]}>Best Practice</Text>
              </View>
              <Text style={styles.infoBoxBody}>
                For beginners: Start with ATM or slightly ITM options on liquid underlyings (SPY, QQQ,
                AAPL). You'll pay more but get better fills and higher probability.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setHighlightColumn(highlightColumn === 'strike' ? null : 'strike')}
              style={[styles.highlightActionBtn, { borderColor: 'rgba(251,191,36,0.4)' }]}
            >
              <Text style={{ color: '#fbbf24', fontSize: 13, fontWeight: '600' }}>
                {highlightColumn === 'strike' ? 'Clear Highlight' : 'Highlight Strike Column'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 5: // Quiz
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="bulb-outline" size={20} color="#fbbf24" />
              <Text style={styles.sectionTitle}>Test Your Knowledge</Text>
            </View>

            {quizQuestions.map((q, idx) => (
              <View key={idx} style={styles.quizQuestionCard}>
                <Text style={styles.quizQuestionText}>
                  Q{idx + 1}: {q.question}
                </Text>
                <Text style={styles.quizScenario}>{q.scenario}</Text>

                {q.options.map(opt => {
                  const isSelected = quizAnswers[idx] === opt.label;
                  const revealed = showResults[idx];
                  const isCorrect = opt.label === q.correct;

                  const optStyles: any[] = [styles.quizOption];
                  let optTextColor: string = colors.text.secondary;

                  if (isSelected && !revealed) {
                    optStyles.push(styles.quizOptionSelected);
                    optTextColor = colors.neon.purple;
                  } else if (revealed && isCorrect) {
                    optStyles.push(styles.quizOptionCorrect);
                    optTextColor = colors.neon.green;
                  } else if (revealed && isSelected && !isCorrect) {
                    optStyles.push(styles.quizOptionWrong);
                    optTextColor = '#ff6b6b';
                  }

                  return (
                    <TouchableOpacity
                      key={opt.label}
                      onPress={() => !revealed && handleQuizAnswer(idx, opt.label as QuizAnswer)}
                      disabled={revealed}
                      style={optStyles}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.quizOptionText, { color: optTextColor }]}>
                        <Text style={{ fontWeight: '700' }}>{opt.label}.</Text> {opt.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {quizAnswers[idx] && !showResults[idx] && (
                  <TouchableOpacity onPress={() => handleCheckAnswer(idx)} style={styles.checkAnswerBtn}>
                    <Text style={styles.checkAnswerText}>Check Answer</Text>
                  </TouchableOpacity>
                )}

                {showResults[idx] && (
                  <View
                    style={[
                      styles.quizResultBox,
                      quizAnswers[idx] === q.correct
                        ? styles.quizResultCorrect
                        : styles.quizResultIncorrect,
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Ionicons
                        name={quizAnswers[idx] === q.correct ? 'checkmark-circle' : 'close-circle'}
                        size={16}
                        color={quizAnswers[idx] === q.correct ? colors.neon.green : '#ff6b6b'}
                      />
                      <Text style={{ color: quizAnswers[idx] === q.correct ? colors.neon.green : '#ff6b6b', fontWeight: '700', fontSize: 13 }}>
                        {quizAnswers[idx] === q.correct ? 'Correct!' : `The answer is ${q.correct}`}
                      </Text>
                    </View>
                    <Text style={styles.quizExplanation}>{q.explanation}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

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
          <Text style={styles.headerTitle}>Reading the Option Chain</Text>
          <Text style={styles.headerSubtitle}>Master the dashboard before you trade</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section navigation pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillScroll}
          contentContainerStyle={styles.pillContainer}
        >
          {sections.map((s, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setActiveSection(idx)}
              style={[styles.pill, activeSection === idx && styles.pillActive]}
            >
              <Ionicons
                name={s.icon}
                size={14}
                color={activeSection === idx ? colors.neon.green : colors.text.tertiary}
              />
              <Text style={[styles.pillText, activeSection === idx && styles.pillTextActive]}>
                {s.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mock stock header */}
        <View style={styles.stockHeader}>
          <View style={styles.stockHeaderLeft}>
            <Text style={styles.stockTicker}>AAPL</Text>
            <Text style={styles.stockPrice}>${STOCK_PRICE.toFixed(2)}</Text>
            <View style={styles.stockChangeRow}>
              <Ionicons name="trending-up" size={14} color={colors.neon.green} />
              <Text style={styles.stockChange}>+1.25 (+0.68%)</Text>
            </View>
          </View>
          <View style={styles.stockHeaderRight}>
            <Text style={styles.expLabel}>Expiration</Text>
            <Text style={styles.expDate}>Jan 19, 2026</Text>
            <Text style={styles.expDTE}>32 DTE</Text>
          </View>
        </View>

        {/* Chain table */}
        {renderChainTable()}

        {/* Educational panel */}
        {renderSectionContent()}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const COL_WIDTH = 58;
const STRIKE_COL_WIDTH = 62;

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

  // Pills
  pillScroll: {
    marginBottom: spacing.md,
  },
  pillContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  pillActive: {
    backgroundColor: 'rgba(57,255,20,0.12)',
    borderColor: 'rgba(57,255,20,0.4)',
  },
  pillText: {
    ...typography.styles.labelSm,
    color: colors.text.tertiary,
  },
  pillTextActive: {
    color: colors.neon.green,
  },

  // Stock header
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  stockHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stockTicker: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  stockPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neon.green,
  },
  stockChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockChange: {
    ...typography.styles.caption,
    color: colors.neon.green,
  },
  stockHeaderRight: {
    alignItems: 'flex-end',
  },
  expLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  expDate: {
    ...typography.styles.labelSm,
    color: colors.text.secondary,
  },
  expDTE: {
    ...typography.styles.caption,
    color: '#fbbf24',
    marginTop: 2,
  },

  // Chain card
  chainCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  chainCardTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  tableScroll: {
    marginBottom: spacing.sm,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCell: {
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callsHeader: {
    width: COL_WIDTH * 6,
  },
  putsHeader: {
    width: COL_WIDTH * 6,
  },
  strikeHeader: {
    width: STRIKE_COL_WIDTH,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subHeaderCell: {
    width: COL_WIDTH,
    paddingVertical: 4,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  subHeaderText: {
    fontSize: 10,
    color: colors.text.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  strikeCol: {
    width: STRIKE_COL_WIDTH,
    alignItems: 'center',
  },
  dataRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.default,
  },
  atmRow: {
    backgroundColor: 'rgba(251,191,36,0.06)',
  },
  selectedRow: {
    backgroundColor: 'rgba(57,255,20,0.08)',
  },
  dataCell: {
    width: COL_WIDTH,
    paddingVertical: 8,
    alignItems: 'center',
  },
  highlightedCell: {
    backgroundColor: 'rgba(157,78,221,0.20)',
  },
  cellText: {
    fontSize: 11,
    fontWeight: '500',
  },
  strikeText: {
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  atmStrike: {
    color: '#fbbf24',
  },
  atmLabel: {
    fontSize: 8,
    color: '#fbbf24',
    fontWeight: '700',
    marginTop: 1,
  },

  // Legend
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    color: colors.text.muted,
  },

  // Highlight buttons
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  highlightBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  highlightBtnText: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  highlightActionBtn: {
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  // Section card
  sectionCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  sectionBody: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },

  // Info boxes
  infoBox: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoBoxBody: {
    fontSize: 12,
    color: colors.text.muted,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text.muted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: typography.fonts.mono,
  },

  // Alert boxes
  alertBox: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  alertBody: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },

  // Rules & items
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.md,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ruleTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  ruleItem: {
    fontSize: 12,
    color: colors.text.muted,
    lineHeight: 20,
    paddingLeft: 4,
  },
  signalItem: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 22,
  },

  // Hint
  hintText: {
    fontSize: 11,
    color: colors.text.muted,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },

  // Delta table
  deltaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  deltaLabel: {
    fontSize: 12,
    color: colors.text.muted,
  },
  deltaValue: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Quiz
  quizQuestionCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  quizQuestionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  quizScenario: {
    fontSize: 12,
    color: colors.text.muted,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  quizOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.card,
    marginBottom: 6,
  },
  quizOptionSelected: {
    borderColor: colors.neon.purple,
    backgroundColor: 'rgba(191,0,255,0.12)',
  },
  quizOptionCorrect: {
    borderColor: colors.neon.green,
    backgroundColor: 'rgba(57,255,20,0.12)',
  },
  quizOptionWrong: {
    borderColor: '#ff6b6b',
    backgroundColor: 'rgba(255,107,107,0.12)',
  },
  quizOptionText: {
    fontSize: 12,
    lineHeight: 18,
  },
  checkAnswerBtn: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(57,255,20,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.3)',
    alignItems: 'center',
  },
  checkAnswerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neon.green,
  },
  quizResultBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  quizResultCorrect: {
    backgroundColor: 'rgba(57,255,20,0.08)',
    borderColor: 'rgba(57,255,20,0.25)',
  },
  quizResultIncorrect: {
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderColor: 'rgba(251,191,36,0.25)',
  },
  quizExplanation: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});

export default OptionChainTutorialScreen;
