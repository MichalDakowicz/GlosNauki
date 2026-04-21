import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ResponsePanelProps = {
  title: string;
  content: string;
};

export function ResponsePanel({ title, content }: ResponsePanelProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${content}`}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#7a5358',
    backgroundColor: '#705d62',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  title: {
    color: '#e5cbcf',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  content: {
    color: '#f3e7e9',
    fontSize: 14,
    lineHeight: 20,
  },
});
