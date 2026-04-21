import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type VoiceActionButtonProps = {
  onPress: () => void;
};

export function VoiceActionButton({ onPress }: VoiceActionButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Aktywuj komende glosowa"
      accessibilityHint="Uruchamia placeholder komend voice-first"
    >
      <View style={styles.iconRow}>
        <MaterialCommunityIcons name="file-document-outline" size={34} color="#4a2029" />
        <MaterialCommunityIcons name="waveform" size={28} color="#4a2029" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 132,
    height: 122,
    borderRadius: 24,
    backgroundColor: '#be9197',
    borderWidth: 3,
    borderColor: '#5a2f38',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
