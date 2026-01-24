// Options Vocabulary Screen
// Interactive glossary of options trading terms

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
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard, GradientText } from '../../components/ui';
import { GLOSSARY } from '../../data/constants';

// Extended vocabulary with more terms
const VOCABULARY_TERMS = [
  // Greeks
  { term: 'Delta', definition: 'The amount an option price changes for a $1 move in the stock. Also a proxy for probability (0.50 Delta = ~50% chance ITM).', category: 'Greeks', emoji: '' },
  { term: 'Gamma', definition: 'The rate of change of Delta. High Gamma means your P&L swings wildly. Highest for ATM options near expiration.', category: 'Greeks', emoji: '' },
  { term: 'Theta', definition: 'Time decay. The amount of value the option loses every day as it approaches expiration.', category: 'Greeks', emoji: '' },
  { term: 'Vega', definition: 'Sensitivity to Implied Volatility. Long Vega means you profit if IV rises (fear increases).', category: 'Greeks', emoji: '' },
  { term: 'Rho', definition: 'Sensitivity to interest rates. Usually minor unless trading LEAPS.', category: 'Greeks', emoji: '' },

  // Volatility
  { term: 'IV (Implied Volatility)', definition: 'The market\'s forecast of likely movement. High IV = expensive options. Think of it as "fear gauge."', category: 'Volatility', emoji: '' },
  { term: 'HV (Historical Volatility)', definition: 'How much the stock actually moved in the past. Compare to IV to find opportunity.', category: 'Volatility', emoji: '' },
  { term: 'IV Rank', definition: 'Where current IV sits relative to its range over the past year. 80% = IV is high compared to history.', category: 'Volatility', emoji: '' },
  { term: 'IV Crush', definition: 'The sudden drop in IV after an event (like earnings). Options lose value even if stock moves your way.', category: 'Volatility', emoji: '' },
  { term: 'Volatility Smile', definition: 'The curve showing higher IV for deep OTM options. Markets price in tail risk.', category: 'Volatility', emoji: '' },

  // Basics
  { term: 'Call Option', definition: 'The right to BUY 100 shares at the strike price before expiration. Bullish bet or income tool.', category: 'Basics', emoji: '' },
  { term: 'Put Option', definition: 'The right to SELL 100 shares at the strike price before expiration. Bearish bet or protection.', category: 'Basics', emoji: '' },
  { term: 'Strike Price', definition: 'The price at which you can buy (call) or sell (put) the underlying stock.', category: 'Basics', emoji: '' },
  { term: 'Premium', definition: 'The price you pay (or receive) for an option contract. Made up of intrinsic + extrinsic value.', category: 'Basics', emoji: '' },
  { term: 'Expiration', definition: 'The date when the option contract expires and ceases to exist.', category: 'Basics', emoji: '' },
  { term: 'Contract', definition: 'One option contract controls 100 shares of the underlying stock.', category: 'Basics', emoji: '' },

  // Moneyness
  { term: 'ITM (In The Money)', definition: 'Call: stock price > strike. Put: stock price < strike. Has intrinsic value.', category: 'Moneyness', emoji: '' },
  { term: 'OTM (Out of The Money)', definition: 'Call: stock price < strike. Put: stock price > strike. Only extrinsic value.', category: 'Moneyness', emoji: '' },
  { term: 'ATM (At The Money)', definition: 'Stock price is at or very close to the strike price. Highest theta decay here.', category: 'Moneyness', emoji: '' },
  { term: 'Intrinsic Value', definition: 'Real value if exercised now. ITM options have intrinsic value = difference between stock and strike.', category: 'Moneyness', emoji: '' },
  { term: 'Extrinsic Value', definition: 'Time value + volatility premium. This is what decays away by expiration.', category: 'Moneyness', emoji: '' },

  // Mechanics
  { term: 'Exercise', definition: 'The buyer uses their right to buy (call) or sell (put) shares at the strike price.', category: 'Mechanics', emoji: '' },
  { term: 'Assignment', definition: 'The seller is obligated to deliver shares (call) or buy shares (put) when the buyer exercises.', category: 'Mechanics', emoji: '' },
  { term: 'Open Interest', definition: 'The total number of outstanding contracts. High OI = liquid options.', category: 'Mechanics', emoji: '' },
  { term: 'Volume', definition: 'The number of contracts traded today. Liquidity indicator.', category: 'Mechanics', emoji: '' },
  { term: 'Bid-Ask Spread', definition: 'The gap between buy and sell prices. Tight spread = liquid, easy to trade.', category: 'Mechanics', emoji: '' },

  // Trading
  { term: 'Debit', definition: 'You PAY money to enter the trade. Buying options is a debit transaction.', category: 'Trading', emoji: '' },
  { term: 'Credit', definition: 'You RECEIVE money to enter the trade. Selling options is a credit transaction.', category: 'Trading', emoji: '' },
  { term: 'Long', definition: 'You bought the option. You have rights, not obligations.', category: 'Trading', emoji: '' },
  { term: 'Short', definition: 'You sold the option. You have obligations to fulfill if assigned.', category: 'Trading', emoji: '' },
  { term: 'BTO (Buy to Open)', definition: 'Opening a new long position by buying an option.', category: 'Trading', emoji: '' },
  { term: 'STO (Sell to Open)', definition: 'Opening a new short position by selling an option.', category: 'Trading', emoji: '' },
  { term: 'BTC (Buy to Close)', definition: 'Closing an existing short position by buying back the option.', category: 'Trading', emoji: '' },
  { term: 'STC (Sell to Close)', definition: 'Closing an existing long position by selling the option.', category: 'Trading', emoji: '' },

  // Strategies
  { term: 'Covered Call', definition: 'Selling calls against stock you own. Generates income, caps upside.', category: 'Strategies', emoji: '' },
  { term: 'Cash-Secured Put', definition: 'Selling puts with cash to buy shares if assigned. Get paid to wait for a dip.', category: 'Strategies', emoji: '' },
  { term: 'Spread', definition: 'Combining two or more options to define risk/reward. Verticals, calendars, etc.', category: 'Strategies', emoji: '' },
  { term: 'Straddle', definition: 'Buying both a call and put at the same strike. Profits from big moves either direction.', category: 'Strategies', emoji: '' },
  { term: 'Iron Condor', definition: 'Four-leg neutral strategy. Profits if stock stays in a range. Defined risk.', category: 'Strategies', emoji: '' },
  { term: 'LEAPS', definition: 'Long-term options (>1 year expiry). Lower theta decay, used for stock replacement.', category: 'Strategies', emoji: '' },
];

const CATEGORIES = ['All', 'Basics', 'Greeks', 'Volatility', 'Moneyness', 'Mechanics', 'Trading', 'Strategies'];

const OptionsVocabularyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return VOCABULARY_TERMS.filter(item => {
      const matchesSearch = searchQuery === '' ||
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const termsByCategory = useMemo(() => {
    if (selectedCategory !== 'All') {
      return { [selectedCategory]: filteredTerms };
    }
    return filteredTerms.reduce((acc, term) => {
      if (!acc[term.category]) acc[term.category] = [];
      acc[term.category].push(term);
      return acc;
    }, {} as Record<string, typeof VOCABULARY_TERMS>);
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
        <Text style={styles.heroEmoji}></Text>
        <Text style={styles.heroTitle}>Master the Language</Text>
        <Text style={styles.heroSubtitle}>
          {VOCABULARY_TERMS.length} essential options terms
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
        {CATEGORIES.map(category => (
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
            {terms.map(item => (
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
                  <Text style={styles.termEmoji}>{item.emoji}</Text>
                  <Text style={styles.termName}>{item.term}</Text>
                  <Text style={styles.expandIcon}>
                    {expandedTerm === item.term ? '' : ''}
                  </Text>
                </View>
                {expandedTerm === item.term && (
                  <View style={styles.termDefinition}>
                    <Text style={styles.definitionText}>{item.definition}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{item.category}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {filteredTerms.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}></Text>
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
  heroEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
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
  termEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  termName: {
    flex: 1,
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  expandIcon: {
    fontSize: 16,
    color: colors.text.muted,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
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
