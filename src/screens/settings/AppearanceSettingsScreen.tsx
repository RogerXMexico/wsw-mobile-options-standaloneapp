// Appearance Settings Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GradientText } from '../../components/ui';

type ThemeOption = 'dark' | 'light' | 'system';
type AccentColor = 'green' | 'cyan' | 'purple' | 'yellow' | 'pink';

interface AccentColorOption {
  id: AccentColor;
  name: string;
  color: string;
}

const ACCENT_COLORS: AccentColorOption[] = [
  { id: 'green', name: 'Neon Green', color: colors.neon.green },
  { id: 'cyan', name: 'Cyber Cyan', color: colors.neon.cyan },
  { id: 'purple', name: 'Mystic Purple', color: colors.neon.purple },
  { id: 'yellow', name: 'Golden Hour', color: colors.neon.yellow },
  { id: 'pink', name: 'Hot Pink', color: colors.neon.pink },
];

const AppearanceSettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  const [theme, setTheme] = useState<ThemeOption>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('green');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [glowEffects, setGlowEffects] = useState(true);

  const selectedAccent = ACCENT_COLORS.find(c => c.id === accentColor);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>Appearance</GradientText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section */}
        <Text style={styles.sectionTitle}>Theme</Text>
        <GlassCard style={styles.themeCard} noPadding>
          {(['dark', 'light', 'system'] as ThemeOption[]).map((option, index) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.themeOption,
                index !== 2 && styles.themeOptionBorder,
                theme === option && styles.themeOptionSelected,
              ]}
              onPress={() => setTheme(option)}
            >
              <View style={styles.themePreview}>
                <View
                  style={[
                    styles.themePreviewBox,
                    option === 'dark' && styles.themePreviewDark,
                    option === 'light' && styles.themePreviewLight,
                    option === 'system' && styles.themePreviewSystem,
                  ]}
                >
                  <Text style={styles.themePreviewIcon}>
                    {option === 'dark' ? '🌙' : option === 'light' ? '☀️' : '📱'}
                  </Text>
                </View>
              </View>
              <View style={styles.themeInfo}>
                <Text style={styles.themeName}>
                  {option === 'dark' ? 'Dark Mode' : option === 'light' ? 'Light Mode' : 'System'}
                </Text>
                <Text style={styles.themeDescription}>
                  {option === 'dark'
                    ? 'Neon jungle aesthetic'
                    : option === 'light'
                    ? 'Coming soon'
                    : 'Match device settings'}
                </Text>
              </View>
              <View style={styles.radioOuter}>
                {theme === option && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* Accent Color Section */}
        <Text style={styles.sectionTitle}>Accent Color</Text>
        <GlassCard style={styles.accentCard}>
          <View style={styles.accentGrid}>
            {ACCENT_COLORS.map((colorOption) => (
              <TouchableOpacity
                key={colorOption.id}
                style={[
                  styles.accentOption,
                  accentColor === colorOption.id && styles.accentOptionSelected,
                ]}
                onPress={() => setAccentColor(colorOption.id)}
              >
                <View
                  style={[
                    styles.accentSwatch,
                    { backgroundColor: colorOption.color },
                    accentColor === colorOption.id && {
                      shadowColor: colorOption.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 12,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.accentName,
                    accentColor === colorOption.id && { color: colorOption.color },
                  ]}
                >
                  {colorOption.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.accentPreview}>
            <Text style={styles.accentPreviewLabel}>Preview</Text>
            <View style={styles.previewButtons}>
              <View
                style={[styles.previewButton, { backgroundColor: selectedAccent?.color }]}
              >
                <Text style={styles.previewButtonText}>Primary</Text>
              </View>
              <View
                style={[
                  styles.previewButtonOutline,
                  { borderColor: selectedAccent?.color },
                ]}
              >
                <Text style={[styles.previewButtonTextOutline, { color: selectedAccent?.color }]}>
                  Outline
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Visual Effects Section */}
        <Text style={styles.sectionTitle}>Visual Effects</Text>
        <GlassCard style={styles.settingsCard} noPadding>
          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingEmoji}>✨</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Glow Effects</Text>
                <Text style={styles.settingDescription}>Neon glow on buttons and cards</Text>
              </View>
            </View>
            <Switch
              value={glowEffects}
              onValueChange={setGlowEffects}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingEmoji}>🎬</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Animations</Text>
                <Text style={styles.settingDescription}>Smooth transitions and effects</Text>
              </View>
            </View>
            <Switch
              value={showAnimations}
              onValueChange={setShowAnimations}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingEmoji}>🏃</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Reduced Motion</Text>
                <Text style={styles.settingDescription}>Minimize animation movement</Text>
              </View>
            </View>
            <Switch
              value={reducedMotion}
              onValueChange={setReducedMotion}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>
        </GlassCard>

        {/* Accessibility Section */}
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <GlassCard style={styles.settingsCard} noPadding>
          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingEmoji}>🔲</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>High Contrast</Text>
                <Text style={styles.settingDescription}>Increase text and border contrast</Text>
              </View>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingEmoji}>📐</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Compact Mode</Text>
                <Text style={styles.settingDescription}>Reduce spacing for more content</Text>
              </View>
            </View>
            <Switch
              value={compactMode}
              onValueChange={setCompactMode}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>
        </GlassCard>

        {/* Pro Tip */}
        <View style={styles.proTip}>
          <Text style={styles.proTipIcon}>💡</Text>
          <Text style={styles.proTipText}>
            Dark mode is optimized for OLED screens, saving battery while looking great.
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    ...typography.styles.h4,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  themeCard: {
    overflow: 'hidden',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  themeOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  themeOptionSelected: {
    backgroundColor: colors.overlay.neonGreen,
  },
  themePreview: {
    marginRight: spacing.md,
  },
  themePreviewBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  themePreviewDark: {
    backgroundColor: '#0a0a0a',
  },
  themePreviewLight: {
    backgroundColor: '#f0f0f0',
  },
  themePreviewSystem: {
    backgroundColor: '#555',
  },
  themePreviewIcon: {
    fontSize: 24,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: 2,
  },
  themeDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.neon.green,
    ...shadows.neonGreenSubtle,
  },
  accentCard: {
    padding: spacing.md,
  },
  accentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  accentOption: {
    alignItems: 'center',
    width: '30%',
  },
  accentOptionSelected: {
    // Selected state handled by swatch glow
  },
  accentSwatch: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  accentName: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  accentPreview: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  accentPreviewLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  previewButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  previewButtonText: {
    ...typography.styles.label,
    color: colors.background.primary,
    fontWeight: '600',
  },
  previewButtonOutline: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  previewButtonTextOutline: {
    ...typography.styles.label,
    fontWeight: '600',
  },
  settingsCard: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  proTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.overlay.neonGreen,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neon.green,
    marginTop: spacing.lg,
  },
  proTipIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  proTipText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    flex: 1,
  },
});

export default AppearanceSettingsScreen;
