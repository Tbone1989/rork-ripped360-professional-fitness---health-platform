import React from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  titleStyle?: TextStyle;
  footer?: React.ReactNode;
  footerStyle?: ViewStyle;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  title,
  titleStyle,
  footer,
  footerStyle,
  testID,
}) => {
  const renderContent = (node: React.ReactNode) => {
    if (typeof node === 'string' || typeof node === 'number') {
      return <Text style={styles.contentText}>{node}</Text>;
    }
    return node;
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <View style={styles.content}>{renderContent(children)}</View>
      {footer && <View style={[styles.footer, footerStyle]}>{renderContent(footer)}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    padding: 16,
    paddingBottom: 12,
  },
  content: {
    padding: 16,
  },
  contentText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  footer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
});