// SymbolSearch - Stock symbol search input with autocomplete dropdown and popular tickers
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface SymbolSearchProps {
  value: string;
  onChange: (text: string) => void;
  onSelect: (symbol: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

interface TickerEntry {
  symbol: string;
  name: string;
}

const POPULAR_TICKERS: TickerEntry[] = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
];

export const SymbolSearch: React.FC<SymbolSearchProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search symbol...',
  style,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleTextChange = useCallback(
    (text: string) => {
      const upper = text.toUpperCase().replace(/[^A-Z]/g, '');
      onChange(upper);
      setShowDropdown(true);
    },
    [onChange]
  );

  const handleSelect = useCallback(
    (symbol: string) => {
      onSelect(symbol);
      onChange(symbol);
      setShowDropdown(false);
      Keyboard.dismiss();
    },
    [onSelect, onChange]
  );

  const handleClear = useCallback(() => {
    onChange('');
    setShowDropdown(false);
    inputRef.current?.focus();
  }, [onChange]);

  const filteredTickers = useMemo(() => {
    if (!value) return POPULAR_TICKERS;
    const query = value.toUpperCase();
    return POPULAR_TICKERS.filter(
      (t) =>
        t.symbol.includes(query) ||
        t.name.toUpperCase().includes(query)
    );
  }, [value]);

  const shouldShowDropdown = showDropdown && isFocused && filteredTickers.length > 0;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={isFocused ? colors.neon.green : colors.text.muted}
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          onFocus={() => {
            setIsFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            // Small delay so that onSelect fires before dropdown hides
            setTimeout(() => setShowDropdown(false), 200);
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!disabled}
          maxLength={5}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick select chips */}
      {!shouldShowDropdown && !value && (
        <View style={styles.chipsContainer}>
          <Text style={styles.chipsLabel}>Popular:</Text>
          <View style={styles.chipsRow}>
            {POPULAR_TICKERS.slice(0, 8).map((ticker) => (
              <TouchableOpacity
                key={ticker.symbol}
                onPress={() => handleSelect(ticker.symbol)}
                style={styles.chip}
                activeOpacity={0.7}
                disabled={disabled}
              >
                <Text style={styles.chipText}>{ticker.symbol}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Dropdown results */}
      {shouldShowDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredTickers}
            keyExtractor={(item) => item.symbol}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item.symbol)}
                style={[
                  styles.dropdownItem,
                  item.symbol === value && styles.dropdownItemActive,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownItemLeft}>
                  <Text
                    style={[
                      styles.dropdownSymbol,
                      item.symbol === value && styles.dropdownSymbolActive,
                    ]}
                  >
                    {item.symbol}
                  </Text>
                  <Text style={styles.dropdownName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                {item.symbol === value && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={colors.neon.green}
                  />
                )}
              </TouchableOpacity>
            )}
            style={styles.dropdownList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    height: 48,
    paddingHorizontal: spacing.sm,
  },
  inputContainerFocused: {
    borderColor: colors.neon.green,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainerDisabled: {
    opacity: 0.5,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    ...typography.styles.monoBold,
    color: colors.text.primary,
    flex: 1,
    height: 46,
    fontSize: 16,
  },
  clearButton: {
    padding: spacing.xs,
  },
  chipsContainer: {
    marginTop: spacing.sm,
  },
  chipsLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  chipText: {
    ...typography.styles.monoSm,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoBold,
  },
  dropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    maxHeight: 240,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownList: {
    maxHeight: 240,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.default,
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
  },
  dropdownItemLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  dropdownSymbol: {
    ...typography.styles.monoBold,
    color: colors.text.primary,
    fontSize: 14,
  },
  dropdownSymbolActive: {
    color: colors.neon.green,
  },
  dropdownName: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: 1,
  },
});

export default SymbolSearch;
