// Edit Profile Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { useAuth } from '../../contexts';
import { MASCOTS } from '../../data/constants';
import { GlassCard, GlowButton, GradientText } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, updateProfile, isLoading } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [selectedAnimal, setSelectedAnimal] = useState(user?.avatarAnimal || 'monkey');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        avatarAnimal: selectedAnimal,
      });
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getAnimalEmoji = (id: string) => {
    switch (id) {
      case 'monkey': return '';
      case 'owl': return '';
      case 'bull': return '';
      case 'bear': return '';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Selection */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Spirit Animal</Text>
            <Text style={styles.sectionSubtitle}>Choose your trading mascot</Text>
            <View style={styles.avatarGrid}>
              {MASCOTS.map((mascot) => (
                <TouchableOpacity
                  key={mascot.id}
                  style={[
                    styles.avatarOption,
                    selectedAnimal === mascot.id && styles.avatarOptionSelected,
                  ]}
                  onPress={() => setSelectedAnimal(mascot.id)}
                >
                  <View
                    style={[
                      styles.avatarCircle,
                      selectedAnimal === mascot.id && styles.avatarCircleSelected,
                    ]}
                  >
                    <Text style={styles.avatarEmoji}>{getAnimalEmoji(mascot.id)}</Text>
                  </View>
                  <Text
                    style={[
                      styles.avatarName,
                      selectedAnimal === mascot.id && styles.avatarNameSelected,
                    ]}
                  >
                    {mascot.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.quizLink}
              onPress={() => navigation.navigate('SpiritAnimalQuiz')}
            >
              <Text style={styles.quizLinkText}>Take the Spirit Animal Quiz</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Display Name */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Display Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your display name"
                placeholderTextColor={colors.text.muted}
                maxLength={30}
                autoCapitalize="words"
              />
            </View>
            <Text style={styles.inputHint}>{displayName.length}/30 characters</Text>
          </GlassCard>

          {/* Email (read-only) */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Email</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Text style={styles.inputText}>{user?.email || 'guest@example.com'}</Text>
            </View>
            <Text style={styles.inputHint}>Email cannot be changed</Text>
          </GlassCard>

          {/* Save Button */}
          <GlowButton
            title={isSaving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            variant="primary"
            fullWidth
            disabled={isSaving || isLoading}
            style={styles.saveButton}
          />

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.neon.green,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  avatarOption: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  avatarOptionSelected: {
    backgroundColor: colors.overlay.neonGreen,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.glass.border,
    marginBottom: spacing.xs,
  },
  avatarCircleSelected: {
    borderColor: colors.neon.green,
    ...shadows.neonGreenSubtle,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarName: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  avatarNameSelected: {
    color: colors.neon.green,
  },
  quizLink: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  quizLinkText: {
    ...typography.styles.bodySm,
    color: colors.neon.cyan,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingHorizontal: spacing.md,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  input: {
    height: 48,
    color: colors.text.primary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.base,
  },
  inputText: {
    height: 48,
    lineHeight: 48,
    color: colors.text.secondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.base,
  },
  inputHint: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  saveButton: {
    marginTop: spacing.md,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    ...typography.styles.body,
    color: colors.text.muted,
  },
});

export default EditProfileScreen;
