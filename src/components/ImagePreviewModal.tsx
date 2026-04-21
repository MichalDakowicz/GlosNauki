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
          <Text style={styles.title}>Przykladowe materialy</Text>
          <Text style={styles.subtitle}>Wybierz obraz placeholder do dalszego flow.</Text>

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
                accessibilityHint={item.description}
              >
                <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
                <Text style={styles.imageTitle}>{item.title}</Text>
              </Pressable>
            )}
          />

          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Zamknij okno"
          >
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
    backgroundColor: 'rgba(34, 19, 24, 0.8)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  card: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#9a7177',
    backgroundColor: '#5b4349',
    padding: 14,
  },
  title: {
    color: '#ffe9ed',
    fontWeight: '800',
    fontSize: 20,
  },
  subtitle: {
    color: '#f2d6da',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },
  listContent: {
    gap: 10,
  },
  column: {
    gap: 10,
  },
  imageCard: {
    flex: 1,
    backgroundColor: '#886a70',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ab858b',
  },
  image: {
    width: '100%',
    height: 90,
  },
  imageTitle: {
    color: '#ffeef1',
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: '#4a1d25',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    color: '#f4d5d9',
    fontWeight: '700',
    fontSize: 14,
  },
});
