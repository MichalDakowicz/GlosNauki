import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

type DropZoneProps = {
  label: string;
  onPress: () => void;
  assistantResponse?: string;
};

const BASE_STRIPE_SPACING = 24;

export function DropZone({ label, onPress, assistantResponse }: DropZoneProps) {
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    setWidth(w);
    setHeight(h);
  };

  // Calculate how many stripes we need to cover the container + extra buffer
  const spacing = BASE_STRIPE_SPACING;
  const buffer = 400; // extra area to cover rotated stripes
  const count = width ? Math.ceil((width + buffer) / spacing) + 4 : 20;
  const startOffset = width ? -buffer / 2 : -120;

  return (
    <Pressable
      style={[styles.container, assistantResponse && styles.containerResponse]}
      onPress={onPress}
      onLayout={onLayout}
      accessibilityRole="button"
      accessibilityLabel="Dodaj plik"
      accessibilityHint="Otwiera podglad przykladowych materialow do nauki"
    >
      {!assistantResponse && (
        <View style={styles.stripeLayer} pointerEvents="none">
          {Array.from({ length: count }).map((_, index) => (
            <View
              key={`stripe-${index}`}
              style={[
                styles.stripe,
                {
                  left: index * spacing + startOffset,
                  // make height relative to container so rotated stripes cover fully
                  height: height ? Math.max(height * 3, 760) : 760,
                  top: height ? -height : -100,
                },
              ]}
            />
          ))}
        </View>
      )}
      {assistantResponse ? (
        <View style={{ width: '100%', padding: 10 }}>
          <Text
            style={styles.responseLeft}
            accessibilityRole="text"
            accessibilityLabel={`Odpowiedz asystenta: ${assistantResponse}`}
          >
            {assistantResponse.split('\n').map((line, i) => (
              <Text key={i} style={line.startsWith('**') ? { fontWeight: '900', fontSize: 26, marginBottom: 10 } : {}}>
                {line.replace(/\*\*/g, '')}
                {i < assistantResponse.split('\n').length - 1 ? '\n\n' : ''}
              </Text>
            ))}
          </Text>
        </View>
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    minHeight: 380,
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
  responseLeft: {
    textAlign: 'left',
    color: '#1a0d10',
    fontSize: 24,
    lineHeight: 34,
    paddingHorizontal: 20,
    fontWeight: '700',
  },
  containerResponse: {
    backgroundColor: '#f7eef0',
    borderColor: '#a07b80',
  },
});
