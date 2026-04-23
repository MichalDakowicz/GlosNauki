import React from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SampleImage } from '../types/ui';

type ImagePreviewModalProps = {
  visible: boolean;
  images: SampleImage[];
  onClose: () => void;
  onSelectImage: (image: SampleImage) => void;
};

export function ImagePreviewModal({
  visible,
  images,
  onClose,
  onSelectImage,
}: ImagePreviewModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button">
        <Pressable
          style={styles.card}
          onPress={() => undefined}
          accessibilityRole="none"
          accessible={false}
        >
          <Text style={styles.title}>Przykładowe materiały</Text>
          <Text style={styles.subtitle}>Wybierz obraz z listy do przetworzenia</Text>

          <FlatList
            data={images}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.imageCard}
                onPress={() => onSelectImage(item)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                accessibilityHint={`Przetwarza obraz: ${item.description}`}
              >
                <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" accessible={false} />
                <Text style={styles.imageTitle}>{item.title}</Text>
              </Pressable>
            )}
          />

          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Zamknij okno wyboru"
          >
            <MaterialCommunityIcons name="close-circle-outline" size={24} color="#f4d5d9" />
            <Text style={styles.closeButtonText}>Zamknij</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(34, 19, 24, 0.85)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  card: {
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#b2878d',
    backgroundColor: '#5b4349',
    padding: 18,
  },
  title: {
    color: '#ffe9ed',
    fontWeight: '900',
    fontSize: 24,
    textAlign: 'left',
  },
  subtitle: {
    color: '#f2d6da',
    fontSize: 16,
    marginTop: 6,
    marginBottom: 16,
    textAlign: 'left',
    fontWeight: '600',
  },
  listContent: {
    gap: 12,
  },
  column: {
    gap: 12,
  },
  imageCard: {
    flex: 1,
    backgroundColor: '#886a70',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ab858b',
  },
  image: {
    width: '100%',
    height: 110,
  },
  imageTitle: {
    color: '#ffeef1',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'left',
  },
  closeButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#4a1d25',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#733340',
  },
  closeButtonText: {
    color: '#f4d5d9',
    fontWeight: '800',
    fontSize: 18,
  },
});
