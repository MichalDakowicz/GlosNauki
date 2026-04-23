import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';

type VoiceActionButtonProps = {
  onPress: () => void;
};

export function VoiceActionButton({ onPress }: VoiceActionButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Aktywuj komendę głosową"
      accessibilityHint="Rozpocznij mówienie z asystentem"
    >
      <View style={styles.iconRow}>
        <MaterialCommunityIcons name="microphone" size={48} color="#1c070c" />
      </View>
      <Text style={styles.label}>MÓW</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#be9197',
    borderWidth: 4,
    borderColor: '#5a2f38',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '900',
    color: '#1c070c',
    letterSpacing: 2,
  },
});
