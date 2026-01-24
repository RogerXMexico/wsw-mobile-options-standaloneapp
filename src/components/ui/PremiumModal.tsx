// Premium Upgrade Modal Component
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard } from './GlassCard';
import { GlowButton } from './GlowButton';
import { ProfileStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
}

const PREMIUM_FEATURES = [
  { icon: '📊', text: 'Real-time market data' },
  { icon: '🧮', text: 'All calculators & tools' },
  { icon: '🤖', text: 'AI Signal Analyzer' },
  { icon: '📈', text: 'Unlimited paper trading' },
  { icon: '🎓', text: 'All strategy lessons' },
  { icon: '🏆', text: 'Priority support' },
];

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  featureName,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const handleUpgrade = () => {
    onClose();
    // Navigate to subscription screen
    navigation.navigate('Subscription');
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
                <Text style={styles.crownIcon}>👑</Text>
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
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                    <Text style={styles.featureLabel}>{feature.text}</Text>
                  </View>
                ))}
              </View>

              {/* Pricing */}
              <View style={styles.pricingContainer}>
                <Text style={styles.priceStrike}>$14.99</Text>
                <Text style={styles.price}>$9.99</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>

              {/* Buttons */}
              <GlowButton
                title="Upgrade Now"
                onPress={handleUpgrade}
                variant="primary"
                fullWidth
                style={styles.upgradeButton}
              />

              <TouchableOpacity style={styles.laterButton} onPress={onClose}>
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>

              {/* Trial Note */}
              <Text style={styles.trialNote}>
                Start with a 7-day free trial. Cancel anytime.
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
  crownIcon: {
    fontSize: 40,
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
  },
  featureIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  featureLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  priceStrike: {
    ...typography.styles.body,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
    marginRight: spacing.sm,
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
  },
});

export default PremiumModal;
