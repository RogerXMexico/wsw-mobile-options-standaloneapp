// PremiumModal - Modal shown when users try to access premium content
// Redirects to WallStreetWildlifeOptions.com for payment
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

const WEBSITE_URL = 'https://WallStreetWildlifeOptions.com/pricing';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  featureName = 'This Feature',
}) => {
  const handleSubscribe = () => {
    Linking.openURL(WEBSITE_URL);
    onClose();
  };

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

          {/* Lock icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={48} color={colors.neon.green} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Unlock {featureName}</Text>

          {/* Description */}
          <Text style={styles.description}>
            Subscribe to Wall Street Wildlife Premium to access {featureName.toLowerCase()}, all 70+ strategies, real-time data, and premium tools.
          </Text>

          {/* Pricing */}
          <View style={styles.pricingRow}>
            <Text style={styles.price}>$49/mo</Text>
            <Text style={styles.priceSeparator}>or</Text>
            <Text style={styles.price}>$470/yr</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>Save $118</Text>
            </View>
          </View>

          {/* Subscribe Button */}
          <GlowButton
            title="Subscribe on WallStreetWildlifeOptions.com"
            onPress={handleSubscribe}
            variant="primary"
            fullWidth
          />

          {/* Note */}
          <Text style={styles.note}>
            Subscriptions are managed through our website to offer you the best price. Your premium access syncs automatically to this app.
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
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  price: {
    ...typography.styles.label,
    color: colors.neon.green,
  },
  priceSeparator: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  saveBadge: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  saveText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  note: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 16,
  },
});

export default PremiumModal;
