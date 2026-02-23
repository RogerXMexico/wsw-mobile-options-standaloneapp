// LevelUpCelebration - Full-screen modal overlay for level-up celebration
// Uses pure React Native Animated API for confetti particle effects
import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface LevelUpCelebrationProps {
  visible: boolean;
  level: number;
  xpEarned: number;
  onDismiss: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 30;

const CONFETTI_COLORS = [
  colors.neon.green,
  colors.neon.cyan,
  colors.neon.purple,
  colors.neon.yellow,
  colors.neon.orange,
  colors.neon.pink,
];

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  startX: number;
}

const ConfettiParticle: React.FC<{ particle: Particle }> = ({ particle }) => {
  const spin = particle.rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size * 0.4,
          backgroundColor: particle.color,
          opacity: particle.opacity,
          transform: [
            { translateX: particle.x },
            { translateY: particle.y },
            { rotate: spin },
          ],
        },
      ]}
    />
  );
};

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  visible,
  level,
  xpEarned,
  onDismiss,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const xpCountAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: new Animated.Value(0),
        y: new Animated.Value(-20),
        rotation: new Animated.Value(0),
        opacity: new Animated.Value(1),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
        startX: Math.random() * SCREEN_WIDTH,
      })),
    []
  );

  useEffect(() => {
    if (!visible) {
      scaleAnim.setValue(0);
      glowAnim.setValue(0);
      xpCountAnim.setValue(0);
      fadeIn.setValue(0);
      return;
    }

    // Entry animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // XP count up
    Animated.timing(xpCountAnim, {
      toValue: xpEarned,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Confetti animation
    const confettiAnimations = particles.map((p) => {
      const delay = Math.random() * 600;
      const duration = 2000 + Math.random() * 1500;
      const horizontalDrift = (Math.random() - 0.5) * 120;

      p.x.setValue(p.startX);
      p.y.setValue(-20);
      p.rotation.setValue(0);
      p.opacity.setValue(1);

      return Animated.parallel([
        Animated.timing(p.y, {
          toValue: SCREEN_HEIGHT + 20,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.x, {
          toValue: p.startX + horizontalDrift,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotation, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(delay + duration * 0.7),
          Animated.timing(p.opacity, {
            toValue: 0,
            duration: duration * 0.3,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.stagger(20, confettiAnimations).start();
  }, [visible]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeIn }]}>
        {/* Confetti particles */}
        <View style={styles.confettiContainer} pointerEvents="none">
          {particles.map((p, i) => (
            <ConfettiParticle key={i} particle={p} />
          ))}
        </View>

        {/* Center content */}
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Glow ring */}
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          />

          {/* Level badge */}
          <View style={styles.levelBadge}>
            <Ionicons name="trophy" size={40} color={colors.neon.green} />
            <Text style={styles.levelUpText}>LEVEL UP!</Text>
            <Text style={styles.levelNumber}>{level}</Text>
          </View>

          {/* XP display */}
          <View style={styles.xpContainer}>
            <Ionicons name="flash" size={20} color={colors.neon.yellow} />
            <Text style={styles.xpText}>+{xpEarned} XP</Text>
          </View>

          {/* Dismiss button */}
          <TouchableOpacity
            onPress={onDismiss}
            style={styles.dismissButton}
            activeOpacity={0.7}
          >
            <Text style={styles.dismissText}>Continue</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={colors.text.inverse}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 2,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.neon.green,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
    top: -20,
  },
  levelBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.neon.green,
    marginBottom: spacing.lg,
  },
  levelUpText: {
    ...typography.styles.overline,
    color: colors.neon.green,
    fontSize: 12,
    letterSpacing: 3,
    marginTop: spacing.sm,
  },
  levelNumber: {
    fontFamily: typography.fonts.bold,
    fontSize: 48,
    fontWeight: '700',
    color: colors.text.primary,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 0, 0.2)',
    marginBottom: spacing.xl,
  },
  xpText: {
    ...typography.styles.monoBold,
    color: colors.neon.yellow,
    fontSize: 20,
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  dismissText: {
    ...typography.styles.button,
    color: colors.text.inverse,
  },
});

export default LevelUpCelebration;
