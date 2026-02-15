// Premium Upgrade Modal Component
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlowButton } from './GlowButton';

const { width } = Dimensions.get('window');
const WEBSITE_PRICING_URL = 'https://wallstreetwildlife.com/pricing';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
}

const PREMIUM_FEATURES = [
  { text: 'All 70+ strategy lessons' },
  { text: 'Real-time market data' },
  { text: 'All calculators & tools' },
  { text: 'AI Signal Analyzer' },
  { text: 'Options Flow data' },
  { text: 'Unlimited paper trading' },
  { text: '16 Animal Mentor guides' },
  { text: 'Tribe chat & social features' },
];

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  featureName,
}) => {
  const handleSubscribeOnWeb = () => {
    onClose();
    Linking.openURL(WEBSITE_PRICING_URL);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={[colors.neon.green + '20', colors.background.secondary]}
              style={styles.gradient}
            >
              {/* Crown Icon */}
              <View style={styles.iconContainer}>
                <Ionicons name="diamond" size={36} color={colors.neon.green} />
              </View>

              {/* Title */}
              <Text style={styles.title}>Unlock Premium</Text>

              {featureName && (
                <Text style={styles.featureText}>
                  "{featureName}" is a premium feature
                </Text>
              )}

              {/* Description */}
              <Text style={styles.description}>
                Get unlimited access to all tools, real-time data, and premium strategies
              </Text>

              {/* Features List */}
              <View style={styles.featuresList}>
                {PREMIUM_FEATURES.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.neon.green}
                    />
                    <Text style={styles.featureLabel}>{feature.text}</Text>
                  </View>
                ))}
              </View>

              {/* Pricing */}
              <View style={styles.pricingContainer}>
                <Text style={styles.price}>$49</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>
              <Text style={styles.annualNote}>
                or $470/year (save $118)
              </Text>

              {/* Subscribe on Web Button */}
              <GlowButton
                title="Subscribe on wallstreetwildlife.com"
                onPress={handleSubscribeOnWeb}
                variant="primary"
                fullWidth
                style={styles.upgradeButton}
              />

              <TouchableOpacity style={styles.laterButton} onPress={onClose}>
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>

              {/* Note */}
              <Text style={styles.trialNote}>
                Subscribe on our website to get the best price.{'\n'}
                Your premium access syncs automatically to this app.
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: width - spacing.lg * 2,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.neonGreenSubtle,
  },
  gradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.neon.green,
    ...shadows.neonGreenSubtle,
  },
  title: {
    ...typography.styles.h3,
    color: colors.neon.green,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  featureText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  featuresList: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
    gap: spacing.sm,
  },
  featureLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  price: {
    ...typography.styles.h2,
    color: colors.neon.green,
  },
  pricePeriod: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  annualNote: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    marginBottom: spacing.lg,
  },
  upgradeButton: {
    marginBottom: spacing.md,
  },
  laterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  laterButtonText: {
    ...typography.styles.body,
    color: colors.text.muted,
  },
  trialNote: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});

export default PremiumModal;
