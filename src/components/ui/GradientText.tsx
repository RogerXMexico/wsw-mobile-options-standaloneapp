// GradientText - Text with neon green gradient effect
import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { colors } from '../../theme';

interface GradientTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const GradientText: React.FC<GradientTextProps> = ({ children, style }) => {
  return (
    <Text
      style={[
        {
          color: colors.neon.green,
          textShadowColor: colors.neon.green,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default GradientText;
