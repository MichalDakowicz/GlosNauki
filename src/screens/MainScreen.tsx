import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Modal, Pressable } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNavigation } from '../components/BottomNavigation';
import { DropZone } from '../components/DropZone';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { VoiceActionButton } from '../components/VoiceActionButton';
import placeholderResponses from '../data/placeholderResponses.json';
import sampleImages from '../data/sampleImages.json';
import { PlaceholderContent, SampleImage, TabId } from '../types/ui';

const content = placeholderResponses as PlaceholderContent;
const images = sampleImages as SampleImage[];

export function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('session');
  const [latestResponse, setLatestResponse] = useState(content.welcome);
  const [selectedMaterial, setSelectedMaterial] = useState<'biology' | 'math' | 'history' | 'chemistry' | undefined>(undefined);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [pipelineInfo, setPipelineInfo] = useState('');
  const [voiceIndex, setVoiceIndex] = useState(0);

  const currentVoicePreview = useMemo(
    () => content.voiceCommands[voiceIndex % content.voiceCommands.length],
    [voiceIndex]
  );

  // mapping of sample images -> material base text and per-command responses
  const MATERIALS: Record<'img-1' | 'img-2' | 'img-3' | 'img-4', { key: 'biology' | 'math' | 'history' | 'chemistry'; base: string; pipeline: string; commands: Record<string, string> }> = {
    'img-1': {
      key: 'biology',
      base:
        '**Biologia: Notatki z fotosyntezy**\nWybrano materiał: „Fotosynteza – faza jasna i ciemna”.',
      pipeline: 'OCR odczytuje odręczne pismo, segmentacja dzieli proces na etapy, LLM przygotowuje streszczenie oparte na pigułkach wiedzy.',
      commands: {
        next: '**Faza ciemna (cykl Calvina)**\nPrzechodzimy do fazy ciemnej. Dowiesz się teraz, jak energia z fazy jasnej zamieniana jest w cukier.',
        repeat: '**Znaczenie chlorofilu**\nOczywiście. Chlorofil to barwnik, który pochłania światło. Działa jak panel słoneczny w roślinie.',
        simpler:
          "**Jak działa roślina? (Prościej)**\nWyobraź sobie, że roślina to kuchnia. Światło to prąd, a woda i dwutlenek węgla to składniki na 'obiad' (cukier).",
        harder:
          '**Zagadka dla Ciebie**\nW jaki sposób spadek stężenia CO2 w atmosferze wpłynąłby na efektywność produkcji glukozy?',
      },
    },
    'img-2': {
      key: 'math',
      base:
        '**Matematyka: Zadania domowe**\nWybrano materiał: „Geometria – pole trójkąta”.',
      pipeline: 'OCR koryguje odczyt wzorów matematycznych, LLM analizuje strukturę zadania.',
      commands: {
        next: '**Kolejny krok: Obwód**\nRozwiązaliśmy pole. Następny krok to obliczenie obwodu tego samego trójkąta.',
        repeat: '**Wzór na pole trójkąta**\nPole = 1/2 × podstawa × wysokość.',
        simpler: '**Pole trójkąta (Prościej)**\nWyobraź sobie prostokąt. Liczysz pole prostokąta i dzielisz na dwa – tak powstaje nasz wzór na trójkąt.',
        harder:
          '**Wyzwanie matematyczne**\nCzy pole trójkąta o takich samych bokach zawsze będzie mniejsze od kwadratu o tym samym obwodzie?',
      },
    },
    'img-3': {
      key: 'history',
      base:
        '**Historia: Oś czasu**\nWybrano materiał: „II Wojna Światowa – kluczowe daty”.',
      pipeline: 'System dekonstruuje oś czasu na logiczną narrację audio.',
      commands: {
        next: '**Rok 1944**\nPrzeskakujemy o dwa lata. Jesteśmy w roku 1944 – czas na lądowanie w Normandii.',
        repeat:
          '**Wojna obronna Polski**\nZaczęło się 1 września 1939 roku od ataku na Westerplatte.',
        simpler: "**Oś czasu (Prościej)**\nOś czasu jest jak lista przystanków autobusu. Każdy przystanek to ważny rok.",
        harder:
          '**Analiza historyczna**\nJakie znaczenie dla losów wojny miało przystąpienie do niej USA po ataku na Pearl Harbor?',
      },
    },
    'img-4': {
      key: 'chemistry',
      base:
        '**Chemia: Tablica z lekcji**\nWybrano materiał: „Reakcje utleniania i redukcji (Redoks)”.',
      pipeline: 'Smart-Capture koryguje kadr zdjęcia tablicy, LLM tłumaczy zapisy.',
      commands: {
        next: '**Kolejny krok: Reduktor**\nOmówiliśmy utleniacz. Teraz spójrzmy na reduktor i jego elektrony.',
        repeat: '**Definicja utleniania**\nUtlenianie to proces, w którym atom oddaje swoje elektrony.',
        simpler: '**Utlenianie (Prościej)**\nPomyśl o elektronach jak o pieniądzach. Ten, który je oddaje, to utleniacz.',
        harder:
          '**Zaprojektuj doświadczenie**\nJak odróżnisz reakcję redoks od zwykłego wytrącania się osadu?',
      },
    },
  };

  const handleDropPress = () => {
    setShowImageModal(true);
    setLatestResponse(content.actions.dropAreaOpen);
  };

  const handleImageSelect = (image: SampleImage) => {
    setShowImageModal(false);

    // Map selected sample images to a "material" and show the base text.
    const mapping = MATERIALS[image.id as 'img-1' | 'img-2' | 'img-3' | 'img-4'];
    if (mapping) {
      setSelectedMaterial(mapping.key);
      setLatestResponse(mapping.base);
      setPipelineInfo(mapping.pipeline);
      setTimeout(() => setShowPipelineModal(true), 500); // Auto-show pipeline on select
      return;
    }

    setLatestResponse(content.actions.imagePicked.replace('{title}', image.title));
  };

  const handleMaterialCommand = (cmd: 'next' | 'repeat' | 'simpler' | 'harder') => {
    if (!selectedMaterial) return;
    // Find the mapping for the current selected material
    const reverseMap: Record<string, any> = {
      biology: MATERIALS['img-1'],
      math: MATERIALS['img-2'],
      history: MATERIALS['img-3'],
      chemistry: MATERIALS['img-4'],
    };
    const mapping = reverseMap[selectedMaterial];
    if (!mapping) return;
    const text = mapping.commands[cmd];
    if (text) setLatestResponse(text);
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
        <View style={styles.topSection}>
          <View style={styles.dropZoneWrapper}>
            <DropZone
              label={content.ui.dropLabel}
              onPress={handleDropPress}
              assistantResponse={latestResponse !== content.welcome ? latestResponse : undefined}
            />
          </View>

          {selectedMaterial && (
            <View style={styles.actionRowContainer}>
              <TouchableOpacity accessible={true} accessibilityRole="button" accessibilityLabel="Pokaz informacje o Pipeline" accessibilityHint="Otwiera okno z informacja o widoku" style={styles.pipelineButton} onPress={() => setShowPipelineModal(true)}>
                <MaterialCommunityIcons name="information-outline" size={20} color="#ffe9ed" />
                <Text style={styles.pipelineButtonText}>Pipeline Info</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedMaterial && (
            <View style={styles.commandBar}>
              <TouchableOpacity accessible={true} accessibilityRole="button" accessibilityLabel="Nastepne" accessibilityHint="Przejdz do nastepnego fragmentu" style={styles.cmdButton} onPress={() => handleMaterialCommand('next')}>
                <FontAwesome5 name="forward" size={18} color="#fff" />
                <Text style={styles.cmdText}>Dalej</Text>
              </TouchableOpacity>
              <TouchableOpacity accessible={true} accessibilityRole="button" accessibilityLabel="Powtorz" accessibilityHint="Powtorz aktualny" style={styles.cmdButton} onPress={() => handleMaterialCommand('repeat')}>
                <FontAwesome5 name="redo" size={18} color="#fff" />
                <Text style={styles.cmdText}>Powtorz</Text>
              </TouchableOpacity>
              <TouchableOpacity accessible={true} accessibilityRole="button" accessibilityLabel="Prosciej" accessibilityHint="Wytlumacz prościej" style={styles.cmdButton} onPress={() => handleMaterialCommand('simpler')}>
                <FontAwesome5 name="puzzle-piece" size={18} color="#fff" />
                <Text style={styles.cmdText}>Prosciej</Text>
              </TouchableOpacity>
              <TouchableOpacity accessible={true} accessibilityRole="button" accessibilityLabel="Trudniej" accessibilityHint="Zadaj trudniejsze" style={styles.cmdButton} onPress={() => handleMaterialCommand('harder')}>
                <FontAwesome5 name="brain" size={18} color="#fff" />
                <Text style={styles.cmdText}>Trudniej</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.fixedBottomSection}>
          <View style={styles.voiceButtonWrapper}>
            <VoiceActionButton onPress={handleVoicePress} />
          </View>

          <View style={styles.bottomNavWrapper}>
            <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
          </View>
        </View>
      </View>

      <ImagePreviewModal
        visible={showImageModal}
        images={images}
        onClose={() => setShowImageModal(false)}
        onSelectImage={handleImageSelect}
      />

      <Modal
        transparent
        animationType="fade"
        visible={showPipelineModal}
        onRequestClose={() => setShowPipelineModal(false)}
        statusBarTranslucent
        accessibilityViewIsModal
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.pipelineCard} accessibilityRole="none" accessible={false}>
            <View style={styles.pipelineHeader}>
              <MaterialCommunityIcons name="cogs" size={28} color="#ffe9ed" />
              <Text style={styles.pipelineTitle}>Pipeline Przetwarzania</Text>
            </View>
            <Text style={styles.pipelineContent}>{pipelineInfo}</Text>
            <Pressable
              style={styles.pipelineCloseButton}
              onPress={() => setShowPipelineModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Zamknij info"
            >
              <MaterialCommunityIcons name="check-bold" size={20} color="#f4d5d9" />
              <Text style={styles.pipelineCloseButtonText}>Rozumiem</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 14,
    paddingTop: 10,
    paddingBottom: 20,
  },
  dropZoneWrapper: {
    flex: 1,
    width: '100%',
    maxHeight: 460,
  },
  fixedBottomSection: {
    height: 180,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  voiceButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 124,
    alignItems: 'center',
    zIndex: 3,
  },
  bottomNavWrapper: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  commandBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionRowContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  pipelineButton: {
    flexDirection: 'row',
    backgroundColor: '#866c72',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  pipelineButtonText: {
    color: '#ffe9ed',
    fontWeight: '700',
    fontSize: 14,
  },
  cmdButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    backgroundColor: '#6b5560',
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  cmdText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(34, 19, 24, 0.85)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pipelineCard: {
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#b2878d',
    backgroundColor: '#5b4349',
    padding: 24,
  },
  pipelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  pipelineTitle: {
    color: '#ffe9ed',
    fontWeight: '900',
    fontSize: 20,
  },
  pipelineContent: {
    color: '#f2d6da',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  pipelineCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4a1d25',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#733340',
  },
  pipelineCloseButtonText: {
    color: '#f4d5d9',
    fontWeight: '800',
    fontSize: 16,
  },
});
