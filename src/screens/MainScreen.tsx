import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { BottomNavigation } from '../components/BottomNavigation';
import { DropZone } from '../components/DropZone';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { ResponsePanel } from '../components/ResponsePanel';
import { VoiceActionButton } from '../components/VoiceActionButton';
import placeholderResponses from '../data/placeholderResponses.json';
import sampleImages from '../data/sampleImages.json';
import { PlaceholderContent, SampleImage, TabId } from '../types/ui';

const content = placeholderResponses as PlaceholderContent;
const images = sampleImages as SampleImage[];

export function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('session');
  const [latestResponse, setLatestResponse] = useState(content.welcome);
  const [showImageModal, setShowImageModal] = useState(false);
  const [voiceIndex, setVoiceIndex] = useState(0);

  const currentVoicePreview = useMemo(
    () => content.voiceCommands[voiceIndex % content.voiceCommands.length],
    [voiceIndex]
  );

  const handleDropPress = () => {
    setShowImageModal(true);
    setLatestResponse(content.actions.dropAreaOpen);
  };

  const handleImageSelect = (image: SampleImage) => {
    setShowImageModal(false);
    setLatestResponse(content.actions.imagePicked.replace('{title}', image.title));
  };

  const handleVoicePress = () => {
    const voiceSample = content.voiceCommands[voiceIndex % content.voiceCommands.length];
    setVoiceIndex((value) => value + 1);
    setLatestResponse(`Komenda: \"${voiceSample.command}\". ${voiceSample.response}`);
  };

  const handleTabPress = (tab: TabId) => {
    setActiveTab(tab);
    setLatestResponse(content.actions.tabs[tab]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.mainSection}
          showsVerticalScrollIndicator={false}
        >
          <DropZone label={content.ui.dropLabel} onPress={handleDropPress} />
          <ResponsePanel
            title={content.ui.responsePanelTitle}
            content={`${latestResponse}\n\nNastepna komenda demo: ${currentVoicePreview.command}`}
          />
        </ScrollView>

        <View style={styles.voiceButtonWrapper}>
          <VoiceActionButton onPress={handleVoicePress} />
        </View>

        <View style={styles.bottomNavWrapper}>
          <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
      </View>

      <ImagePreviewModal
        visible={showImageModal}
        images={images}
        onClose={() => setShowImageModal(false)}
        onSelectImage={handleImageSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#55494e',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },
  mainSection: {
    // don't let ScrollView vertically center content — content should start
    // near the top. Add small top padding so the DropZone is 10px from the
    // top of the screen when the app opens.
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 14,
    paddingTop: 10,
    // leave extra bottom padding so the response panel content isn't overlapped
    // by the floating voice button which is positioned absolutely above the
    // bottom navigation
    paddingBottom: 280,
  },
  voiceButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 122,
    alignItems: 'center',
    zIndex: 3,
  },
  bottomNavWrapper: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
  },
});
