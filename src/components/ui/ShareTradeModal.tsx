// ShareTradeModal - Modal for sharing a trade summary
// Shows trade summary card with ticker, P&L, strategy, and uses Share.share()
import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Share,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface TradeData {
  ticker: string;
  pnl: number;
  strategy: string;
  date: string;
}

export interface ShareTradeModalProps {
  visible: boolean;
  trade: TradeData;
  onDismiss: () => void;
}

export const ShareTradeModal: React.FC<ShareTradeModalProps> = ({
  visible,
  trade,
  onDismiss,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const isProfitable = trade.pnl >= 0;
  const pnlColor = isProfitable ? colors.neon.green : colors.neon.red;
  const pnlSign = isProfitable ? '+' : '';
  const pnlIcon: keyof typeof Ionicons.glyphMap = isProfitable
    ? 'trending-up'
    : 'trending-down';

  const formatPnl = (value: number): string => {
    const abs = Math.abs(value);
    if (abs >= 1000) {
      return `${pnlSign}$${(value / 1000).toFixed(1)}k`;
    }
    return `${pnlSign}$${value.toFixed(2)}`;
  };

  const handleShare = useCallback(async () => {
    const pnlStr = formatPnl(trade.pnl);
    const message = [
      `${trade.ticker} | ${trade.strategy}`,
      `P&L: ${pnlStr}`,
      `Date: ${trade.date}`,
      '',
      'Shared from Wall Street Wildlife',
    ].join('\n');

    try {
      await Share.share({
        message,
        title: `${trade.ticker} Trade - ${pnlStr}`,
      });
    } catch (error) {
      // User cancelled or share failed silently
    }
  }, [trade]);

  const handleShow = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
      onShow={handleShow}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Share Trade</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Trade Card */}
          <View style={[styles.tradeCard, { borderColor: pnlColor + '30' }]}>
            {/* Ticker and strategy */}
            <View style={styles.tradeHeader}>
              <View style={styles.tickerBadge}>
                <Ionicons
                  name="analytics"
                  size={16}
                  color={colors.neon.cyan}
                />
                <Text style={styles.tickerText}>{trade.ticker}</Text>
              </View>
              <Text style={styles.dateText}>{trade.date}</Text>
            </View>

            {/* P&L */}
            <View style={styles.pnlContainer}>
              <Ionicons name={pnlIcon} size={28} color={pnlColor} />
              <Text
                style={[
                  styles.pnlValue,
                  {
                    color: pnlColor,
                    textShadowColor: pnlColor,
                  },
                ]}
              >
                {formatPnl(trade.pnl)}
              </Text>
            </View>

            {/* Strategy */}
            <View style={styles.strategyRow}>
              <Ionicons
                name="layers-outline"
                size={14}
                color={colors.text.muted}
              />
              <Text style={styles.strategyText}>{trade.strategy}</Text>
            </View>

            {/* Watermark */}
            <View style={styles.watermark}>
              <Ionicons name="leaf" size={10} color={colors.text.muted} />
              <Text style={styles.watermarkText}>Wall Street Wildlife</Text>
            </View>
          </View>

          {/* Share button */}
          <TouchableOpacity
            onPress={handleShare}
            style={styles.shareButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="share-outline"
              size={20}
              color={colors.text.inverse}
            />
            <Text style={styles.shareButtonText}>Share Trade</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            onPress={onDismiss}
            style={styles.cancelButton}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  tradeCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.15)',
  },
  tickerText: {
    ...typography.styles.monoBold,
    color: colors.text.primary,
    fontSize: 16,
  },
  dateText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  pnlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  pnlValue: {
    fontFamily: typography.fonts.bold,
    fontSize: 36,
    fontWeight: '700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  strategyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  strategyText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  watermark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.default,
  },
  watermarkText: {
    ...typography.styles.overline,
    color: colors.text.muted,
    fontSize: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.sm,
  },
  shareButtonText: {
    ...typography.styles.button,
    color: colors.text.inverse,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cancelText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
  },
});

export default ShareTradeModal;
