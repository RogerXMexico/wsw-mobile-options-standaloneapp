// PremiumModal - Jungle Pass paywall modal
// Shows when users try to access premium content
import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlowButton } from './GlowButton';
import { JUNGLE_PASS_PRICING, ALA_CARTE_PRICING } from '../../data/constants';

const WEBSITE_URL = 'https://WallStreetWildlifeOptions.com/pricing';

export type PremiumModalContext = 'general' | 'tier' | 'tool' | 'mentor';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
  context?: PremiumModalContext;
  tierNumber?: number;
}

const getContextIcon = (context: PremiumModalContext): keyof typeof Ionicons.glyphMap => {
  switch (context) {
    case 'tier': return 'book-outline';
    case 'tool': return 'construct-outline';
    case 'mentor': return 'paw-outline';
    default: return 'lock-closed';
  }
};

const getContextDescription = (context: PremiumModalContext, featureName: string): string => {
  switch (context) {
    case 'tier':
      return `Unlock ${featureName} and all 90+ strategies, tools, mentors, and unlimited paper trading with Jungle Pass.`;
    case 'tool':
      return `${featureName} is a Jungle Pass feature. Get access to all premium calculators, analyzers, and tools.`;
    case 'mentor':
      return `Unlock all 16 animal mentors with Jungle Pass. Each mentor offers unique strategies and trading insights.`;
    default:
      return `Get full access to all strategies, tools, mentors, and unlimited paper trading with Jungle Pass.`;
  }
};

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  featureName = 'This Feature',
  context = 'general',
  tierNumber,
}) => {
  const handleSubscribe = () => {
    Linking.openURL(WEBSITE_URL);
    onClose();
  };

  const monthlySavings = JUNGLE_PASS_PRICING.annual.savings;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name={getContextIcon(context)} size={48} color={colors.neon.green} />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {context === 'general' ? 'Get Jungle Pass' : `Unlock ${featureName}`}
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            {getContextDescription(context, featureName)}
          </Text>

          {/* Pricing */}
          <View style={styles.pricingContainer}>
            <View style={styles.pricingOption}>
              <Text style={styles.pricingLabel}>Monthly</Text>
              <Text style={styles.pricingPrice}>{JUNGLE_PASS_PRICING.monthly.label}</Text>
            </View>
            <View style={styles.pricingDivider} />
            <View style={styles.pricingOption}>
              <Text style={styles.pricingLabel}>Annual</Text>
              <Text style={styles.pricingPrice}>{JUNGLE_PASS_PRICING.annual.label}</Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save ${monthlySavings}</Text>
              </View>
            </View>
          </View>

          {/* A la carte option for tier context */}
          {context === 'tier' && tierNumber !== undefined && (
            <View style={styles.alaCarteRow}>
              <Text style={styles.alaCarteText}>
                Or unlock just this tier for ${ALA_CARTE_PRICING.individualTier.min}–${ALA_CARTE_PRICING.individualTier.max}
              </Text>
            </View>
          )}

          {/* Subscribe Button */}
          <GlowButton
            title="Get Jungle Pass"
            onPress={handleSubscribe}
            variant="primary"
            fullWidth
          />

          {/* Restore purchase */}
          <TouchableOpacity style={styles.restoreLink}>
            <Text style={styles.restoreText}>Restore Purchase</Text>
          </TouchableOpacity>

          {/* Note */}
          <Text style={styles.note}>
            Subscriptions managed through our website. Premium access syncs automatically to this app.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neon.green + '30',
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neon.green + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    width: '100%',
  },
  pricingOption: {
    flex: 1,
    alignItems: 'center',
  },
  pricingLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: 2,
  },
  pricingPrice: {
    ...typography.styles.label,
    color: colors.neon.green,
    fontWeight: '700',
  },
  pricingDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.glass.border,
    marginHorizontal: spacing.sm,
  },
  saveBadge: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: 4,
  },
  saveText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  alaCarteRow: {
    marginBottom: spacing.md,
  },
  alaCarteText: {
    ...typography.styles.caption,
    color: colors.neon.cyan,
    textAlign: 'center',
  },
  restoreLink: {
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  restoreText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textDecorationLine: 'underline',
  },
  note: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});

export default PremiumModal;
