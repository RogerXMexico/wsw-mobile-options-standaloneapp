// Options Vocabulary Screen
// Interactive glossary of 200+ options trading terms with rich educational content

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import {
  VOCABULARY_TERMS,
  VOCABULARY_COUNT,
  ALL_CATEGORIES,
  filterTerms,
  groupTermsByCategory,
  VocabularyTerm,
} from '../../data/vocabularyData';

// Visual indicator dot color based on buy/sell/neutral
const getVisualColor = (visual?: string) => {
  switch (visual) {
    case 'buy': return '#10b981';   // emerald
    case 'sell': return '#f43f5e';  // rose
    default: return '#64748b';       // slate
  }
};

const OptionsVocabularyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return filterTerms(selectedCategory, searchQuery);
  }, [searchQuery, selectedCategory]);

  const termsByCategory = useMemo(() => {
    if (selectedCategory !== 'All') {
      return { [selectedCategory]: filteredTerms };
    }
    return groupTermsByCategory(filteredTerms);
  }, [filteredTerms, selectedCategory]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Options Vocabulary</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Ionicons name="book-outline" size={48} color={colors.neon.green} style={{ marginBottom: spacing.sm }} />
        <Text style={styles.heroTitle}>Master the Language</Text>
        <Text style={styles.heroSubtitle}>
          {VOCABULARY_COUNT} essential options terms
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search terms..."
          placeholderTextColor={colors.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {ALL_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryPill,
              selectedCategory === category && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Terms List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(termsByCategory).map(([category, terms]) => (
          <View key={category} style={styles.categorySection}>
            {selectedCategory === 'All' && (
              <Text style={styles.categoryTitle}>{category}</Text>
            )}
            {terms.map((item: VocabularyTerm) => (
              <TouchableOpacity
                key={item.term}
                style={[
                  styles.termCard,
                  expandedTerm === item.term && styles.termCardExpanded,
                ]}
                onPress={() => setExpandedTerm(expandedTerm === item.term ? null : item.term)}
                activeOpacity={0.7}
              >
                <View style={styles.termHeader}>
                  {item.visual && (
                    <View style={[styles.visualDot, { backgroundColor: getVisualColor(item.visual) }]} />
                  )}
                  <View style={styles.termNameContainer}>
                    <Text style={styles.termName}>{item.term}</Text>
                    {item.abbrev && (
                      <Text style={styles.termAbbrev}>{item.abbrev}</Text>
                    )}
                  </View>
                  <Text style={styles.expandIcon}>
                    {expandedTerm === item.term ? '\u25B2' : '\u25BC'}
                  </Text>
                </View>
                {expandedTerm === item.term && (
                  <View style={styles.termDefinition}>
                    <Text style={styles.definitionText}>{item.definition}</Text>

                    {item.example && (
                      <View style={styles.exampleContainer}>
                        <Text style={styles.exampleLabel}>Example</Text>
                        <Text style={styles.exampleText}>{item.example}</Text>
                      </View>
                    )}

                    {item.tip && (
                      <View style={styles.tipContainer}>
                        <Text style={styles.tipLabel}>Pro Tip</Text>
                        <Text style={styles.tipText}>{item.tip}</Text>
                      </View>
                    )}

                    <View style={styles.badgeRow}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{item.category}</Text>
                      </View>
                      {item.visual && (
                        <View style={[styles.visualBadge, { backgroundColor: getVisualColor(item.visual) + '20' }]}>
                          <Text style={[styles.visualBadgeText, { color: getVisualColor(item.visual) }]}>
                            {item.visual === 'buy' ? 'Bullish' : item.visual === 'sell' ? 'Bearish' : 'Neutral'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {filteredTerms.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.text.muted} style={{ marginBottom: spacing.md }} />
            <Text style={styles.emptyText}>No terms found</Text>
            <Text style={styles.emptySubtext}>Try a different search</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  heroTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
  },
  heroSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    height: 44,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingHorizontal: spacing.md,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: colors.neon.green,
  },
  categoryText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  categoryTextActive: {
    color: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.cyan,
    marginBottom: spacing.sm,
  },
  termCard: {
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  termCardExpanded: {
    borderColor: colors.neon.green,
  },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  visualDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  termNameContainer: {
    flex: 1,
  },
  termName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  termAbbrev: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 12,
    color: colors.text.muted,
    marginLeft: spacing.sm,
  },
  termDefinition: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
    paddingTop: spacing.md,
  },
  definitionText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  exampleContainer: {
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#06b6d4',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  exampleLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: '#06b6d4',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  exampleText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  tipContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: '#f59e0b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  tipText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.overlay.neonGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryBadgeText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.neon.green,
  },
  visualBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  visualBadgeText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  emptySubtext: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.muted,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default OptionsVocabularyScreen;
