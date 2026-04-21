import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type DropZoneProps = {
  label: string;
  onPress: () => void;
};

const STRIPE_COUNT = 20;

export function DropZone({ label, onPress }: DropZoneProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Dodaj plik"
      accessibilityHint="Otwiera podglad przykladowych materialow do nauki"
    >
      <View style={styles.stripeLayer} pointerEvents="none">
        {Array.from({ length: STRIPE_COUNT }).map((_, index) => (
          <View key={`stripe-${index}`} style={[styles.stripe, { left: index * 24 - 120 }]} />
        ))}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    minHeight: 470,
    borderRadius: 28,
    borderWidth: 6,
    borderColor: '#b98f94',
    backgroundColor: '#c99da1',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stripeLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  stripe: {
    position: 'absolute',
    top: -100,
    width: 12,
    height: 760,
    backgroundColor: 'rgba(80, 45, 52, 0.2)',
    transform: [{ rotate: '-42deg' }],
  },
  label: {
    textAlign: 'center',
    fontSize: 54,
    lineHeight: 68,
    fontWeight: '900',
    color: '#3d1f28',
    letterSpacing: 1,
  },
});
