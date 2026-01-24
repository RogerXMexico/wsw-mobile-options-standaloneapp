// PayoffChart component for Wall Street Wildlife Mobile
// Displays options strategy payoff diagrams using react-native-svg
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Path, Circle, Text as SvgText, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography, spacing } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');

interface PayoffPoint {
  price: number;
  profit: number;
}

interface StrategyLeg {
  type: 'call' | 'put';
  strike: number;
  position: 'long' | 'short';
  premium: number;
  quantity?: number;
}

interface PayoffChartProps {
  legs: StrategyLeg[];
  currentPrice?: number;
  width?: number;
  height?: number;
  showBreakeven?: boolean;
  showMaxProfit?: boolean;
  showMaxLoss?: boolean;
  title?: string;
}

// Calculate payoff for a single option leg at a given price
const calculateLegPayoff = (leg: StrategyLeg, price: number): number => {
  const qty = leg.quantity || 1;
  let intrinsicValue = 0;

  if (leg.type === 'call') {
    intrinsicValue = Math.max(0, price - leg.strike);
  } else {
    intrinsicValue = Math.max(0, leg.strike - price);
  }

  const payoff = leg.position === 'long'
    ? (intrinsicValue - leg.premium) * qty * 100
    : (leg.premium - intrinsicValue) * qty * 100;

  return payoff;
};

// Calculate total strategy payoff at a given price
const calculateStrategyPayoff = (legs: StrategyLeg[], price: number): number => {
  return legs.reduce((total, leg) => total + calculateLegPayoff(leg, price), 0);
};

// Generate payoff data points
const generatePayoffData = (legs: StrategyLeg[], currentPrice: number): PayoffPoint[] => {
  const strikes = legs.map(leg => leg.strike);
  const minStrike = Math.min(...strikes);
  const maxStrike = Math.max(...strikes);

  // Extend range 30% beyond strikes
  const range = maxStrike - minStrike || currentPrice * 0.2;
  const minPrice = Math.max(0, minStrike - range * 0.5);
  const maxPrice = maxStrike + range * 0.5;

  const points: PayoffPoint[] = [];
  const steps = 100;
  const stepSize = (maxPrice - minPrice) / steps;

  for (let i = 0; i <= steps; i++) {
    const price = minPrice + i * stepSize;
    points.push({
      price,
      profit: calculateStrategyPayoff(legs, price),
    });
  }

  return points;
};

// Find breakeven points
const findBreakevenPoints = (data: PayoffPoint[]): number[] => {
  const breakevens: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];

    if ((prev.profit <= 0 && curr.profit > 0) || (prev.profit >= 0 && curr.profit < 0)) {
      // Linear interpolation to find exact breakeven
      const ratio = Math.abs(prev.profit) / (Math.abs(prev.profit) + Math.abs(curr.profit));
      const breakeven = prev.price + ratio * (curr.price - prev.price);
      breakevens.push(breakeven);
    }
  }

  return breakevens;
};

export const PayoffChart: React.FC<PayoffChartProps> = ({
  legs,
  currentPrice = 100,
  width = screenWidth - spacing.lg * 2,
  height = 250,
  showBreakeven = true,
  showMaxProfit = true,
  showMaxLoss = true,
  title,
}) => {
  const padding = { top: 30, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { data, breakevens, maxProfit, maxLoss, priceRange, profitRange } = useMemo(() => {
    const payoffData = generatePayoffData(legs, currentPrice);
    const breakevenPoints = findBreakevenPoints(payoffData);

    const profits = payoffData.map(d => d.profit);
    const max = Math.max(...profits);
    const min = Math.min(...profits);

    const prices = payoffData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      data: payoffData,
      breakevens: breakevenPoints,
      maxProfit: max,
      maxLoss: min,
      priceRange: { min: minPrice, max: maxPrice },
      profitRange: { min: Math.min(min, -100), max: Math.max(max, 100) },
    };
  }, [legs, currentPrice]);

  // Scale functions
  const scaleX = (price: number) => {
    return padding.left + ((price - priceRange.min) / (priceRange.max - priceRange.min)) * chartWidth;
  };

  const scaleY = (profit: number) => {
    return padding.top + chartHeight - ((profit - profitRange.min) / (profitRange.max - profitRange.min)) * chartHeight;
  };

  // Generate path
  const pathData = useMemo(() => {
    if (data.length === 0) return '';

    let path = `M ${scaleX(data[0].price)} ${scaleY(data[0].profit)}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${scaleX(data[i].price)} ${scaleY(data[i].profit)}`;
    }
    return path;
  }, [data, scaleX, scaleY]);

  // Generate area path for profit/loss shading
  const areaPath = useMemo(() => {
    if (data.length === 0) return '';

    const zeroY = scaleY(0);
    let path = `M ${scaleX(data[0].price)} ${zeroY}`;

    for (let i = 0; i < data.length; i++) {
      path += ` L ${scaleX(data[i].price)} ${scaleY(data[i].profit)}`;
    }

    path += ` L ${scaleX(data[data.length - 1].price)} ${zeroY} Z`;
    return path;
  }, [data, scaleX, scaleY]);

  // X-axis labels
  const xLabels = useMemo(() => {
    const labels = [];
    const step = (priceRange.max - priceRange.min) / 4;
    for (let i = 0; i <= 4; i++) {
      labels.push(priceRange.min + i * step);
    }
    return labels;
  }, [priceRange]);

  // Y-axis labels
  const yLabels = useMemo(() => {
    const labels = [];
    const step = (profitRange.max - profitRange.min) / 4;
    for (let i = 0; i <= 4; i++) {
      labels.push(profitRange.min + i * step);
    }
    return labels;
  }, [profitRange]);

  const zeroLineY = scaleY(0);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="profitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.success} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={colors.success} stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id="lossGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor={colors.error} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={colors.error} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Background */}
        <Rect
          x={padding.left}
          y={padding.top}
          width={chartWidth}
          height={chartHeight}
          fill={colors.background.secondary}
          rx={8}
        />

        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <Line
            key={`grid-${i}`}
            x1={padding.left}
            y1={scaleY(label)}
            x2={padding.left + chartWidth}
            y2={scaleY(label)}
            stroke={colors.border.light}
            strokeWidth={1}
          />
        ))}

        {/* Zero line */}
        <Line
          x1={padding.left}
          y1={zeroLineY}
          x2={padding.left + chartWidth}
          y2={zeroLineY}
          stroke={colors.text.muted}
          strokeWidth={2}
          strokeDasharray="5,5"
        />

        {/* Payoff line */}
        <Path
          d={pathData}
          stroke={colors.neon.green}
          strokeWidth={3}
          fill="none"
        />

        {/* Strike price markers */}
        {legs.map((leg, i) => (
          <G key={`strike-${i}`}>
            <Line
              x1={scaleX(leg.strike)}
              y1={padding.top}
              x2={scaleX(leg.strike)}
              y2={padding.top + chartHeight}
              stroke={leg.type === 'call' ? colors.bullish : colors.bearish}
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <Circle
              cx={scaleX(leg.strike)}
              cy={scaleY(calculateStrategyPayoff(legs, leg.strike))}
              r={5}
              fill={leg.type === 'call' ? colors.bullish : colors.bearish}
            />
          </G>
        ))}

        {/* Breakeven markers */}
        {showBreakeven && breakevens.map((be, i) => (
          <G key={`be-${i}`}>
            <Circle
              cx={scaleX(be)}
              cy={zeroLineY}
              r={6}
              fill={colors.warning}
            />
            <SvgText
              x={scaleX(be)}
              y={zeroLineY - 12}
              fill={colors.warning}
              fontSize={10}
              textAnchor="middle"
              fontWeight="bold"
            >
              BE: ${be.toFixed(0)}
            </SvgText>
          </G>
        ))}

        {/* Current price marker */}
        <Line
          x1={scaleX(currentPrice)}
          y1={padding.top}
          x2={scaleX(currentPrice)}
          y2={padding.top + chartHeight}
          stroke={colors.neon.cyan}
          strokeWidth={2}
        />
        <SvgText
          x={scaleX(currentPrice)}
          y={padding.top - 5}
          fill={colors.neon.cyan}
          fontSize={10}
          textAnchor="middle"
          fontWeight="bold"
        >
          ${currentPrice}
        </SvgText>

        {/* X-axis labels */}
        {xLabels.map((label, i) => (
          <SvgText
            key={`x-${i}`}
            x={scaleX(label)}
            y={height - 10}
            fill={colors.text.secondary}
            fontSize={10}
            textAnchor="middle"
          >
            ${label.toFixed(0)}
          </SvgText>
        ))}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <SvgText
            key={`y-${i}`}
            x={padding.left - 8}
            y={scaleY(label) + 4}
            fill={colors.text.secondary}
            fontSize={10}
            textAnchor="end"
          >
            ${label.toFixed(0)}
          </SvgText>
        ))}

        {/* Axis labels */}
        <SvgText
          x={width / 2}
          y={height - 2}
          fill={colors.text.muted}
          fontSize={11}
          textAnchor="middle"
        >
          Stock Price at Expiration
        </SvgText>
        <SvgText
          x={12}
          y={height / 2}
          fill={colors.text.muted}
          fontSize={11}
          textAnchor="middle"
          rotation={-90}
          originX={12}
          originY={height / 2}
        >
          Profit/Loss
        </SvgText>
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        {showMaxProfit && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Max Profit: ${maxProfit.toFixed(0)}</Text>
          </View>
        )}
        {showMaxLoss && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
            <Text style={styles.legendText}>Max Loss: ${Math.abs(maxLoss).toFixed(0)}</Text>
          </View>
        )}
        {showBreakeven && breakevens.length > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>
              Breakeven: {breakevens.map(b => `$${b.toFixed(0)}`).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  title: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
});

export default PayoffChart;
