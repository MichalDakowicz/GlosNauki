import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
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
  const [voiceIndex, setVoiceIndex] = useState(0);

  const currentVoicePreview = useMemo(
    () => content.voiceCommands[voiceIndex % content.voiceCommands.length],
    [voiceIndex]
  );

  // mapping of sample images -> material base text and per-command responses
  const MATERIALS: Record<'img-1' | 'img-2' | 'img-3' | 'img-4', { key: 'biology' | 'math' | 'history' | 'chemistry'; base: string; commands: Record<string, string> }> = {
    'img-1': {
      key: 'biology',
      base:
        'Biologia: Notatki z fotosyntezy\nWybrano materiał: „Fotosynteza – faza jasna i ciemna”. Pipeline: OCR odczytuje odręczne pismo, segmentacja dzieli proces na etapy, LLM przygotowuje streszczenie oparte na pigułkach wiedzy.',
      commands: {
        next: 'Przechodzimy do fazy ciemnej, czyli cyklu Calvina. Dowiesz się teraz, jak energia z fazy jasnej zamieniana jest w cukier',
        repeat: 'Oczywiście. Chlorofil to barwnik, który pochłania światło. Działa jak panel słoneczny w roślinie',
        simpler:
          "Wyobraź sobie, że roślina to kuchnia. Światło to prąd w kuchence, a woda i dwutlenek węgla to składniki, z których roślina gotuje sobie 'obiad' (cukier)",
        harder:
          'W jaki sposób spadek stężenia dwutlenku węgla w atmosferze wpłynąłby na efektywność produkcji glukozy? Przeanalizuj ten proces',
      },
    },
    'img-2': {
      key: 'math',
      base:
        'Matematyka: Zadania domowe\nWybrano materiał: „Geometria – pole trójkąta”. Pipeline: OCR koryguje odczyt wzorów matematycznych, LLM analizuje strukturę zadania.',
      commands: {
        next: 'Rozwiązaliśmy pole. Następny krok to obliczenie obwodu tego samego trójkąta',
        repeat: 'Wzór na pole trójkąta to jedna druga razy podstawa, razy wysokość opuszczona na tę podstawę',
        simpler: 'Wyobraź sobie, że trójkąt to połowa prostokąta. Liczysz pole prostokąta i przecinasz wynik na pół – tak powstaje nasz wzór',
        harder:
          'Czy potrafisz udowodnić, że pole trójkąta o takich samych bokach zawsze będzie mniejsze od kwadratu o tym samym obwodzie?',
      },
    },
    'img-3': {
      key: 'history',
      base:
        'Historia: Oś czasu\nWybrano materiał: „II Wojna Światowa – kluczowe daty”. Pipeline: System dekonstruuje oś czasu na logiczną narrację audio.',
      commands: {
        next: 'Przeskakujemy o dwa lata. Jesteśmy w roku 1944 – czas na operację Overlord i lądowanie w Normandii',
        repeat:
          'Zaczęło się 1 września 1939 roku od ataku na Westerplatte. To był początek globalnego konfliktu',
        simpler: "Oś czasu to jak lista przystanków autobusu. Każdy przystanek to ważny rok, a my jedziemy od startu do końca wojny",
        harder:
          'Oceń, jakie znaczenie dla losów wojny miało przystąpienie do niej Stanów Zjednoczonych po ataku na Pearl Harbor. Uzasadnij swoją opinię',
      },
    },
    'img-4': {
      key: 'chemistry',
      base:
        'Chemia: Tablica z lekcji\nWybrano materiał: „Reakcje utleniania i redukcji (Redoks)”. Pipeline: Smart-Capture koryguje kadr zdjęcia tablicy, LLM tłumaczy zapisy chemiczne.',
      commands: {
        next: 'Omówiliśmy utleniacz. Teraz spójrzmy na reduktor i zobaczmy, co dzieje się z jego elektronami',
        repeat: 'Utlenianie to proces, w którym atom oddaje swoje elektrony. Zapamiętaj: oddaje, czyli się utlenia',
        simpler: 'Pomyśl o elektronach jak o pieniądzach. Jeden atom pożycza je drugiemu. Ten, który oddaje, to utleniacz',
        harder:
          'Zaprojektuj doświadczenie, które pozwoliłoby odróżnić reakcję redoks od zwykłego wytrącania się osadu',
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
        <View style={styles.mainSection}>
          <DropZone
            label={content.ui.dropLabel}
            onPress={handleDropPress}
            // Only show assistantResponse inside the DropZone after the
            // assistant actually produced a response. The initial welcome
            // message should not replace the "kliknij..." label.
            assistantResponse={latestResponse !== content.welcome ? latestResponse : undefined}
          />

          {selectedMaterial && (
            <View style={styles.commandBar}>
              <TouchableOpacity style={styles.cmdButton} onPress={() => handleMaterialCommand('next')}>
                <Text style={styles.cmdText}>Następne</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cmdButton} onPress={() => handleMaterialCommand('repeat')}>
                <Text style={styles.cmdText}>Powtórz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cmdButton} onPress={() => handleMaterialCommand('simpler')}>
                <Text style={styles.cmdText}>Wytłumacz prościej</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cmdButton} onPress={() => handleMaterialCommand('harder')}>
                <Text style={styles.cmdText}>Zadaj trudniejsze</Text>
              </TouchableOpacity>
            </View>
          )}
  </View>

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
    paddingBottom: 180,
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
  commandBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cmdButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    backgroundColor: '#6b5560',
    borderRadius: 8,
    alignItems: 'center',
  },
  cmdText: {
    color: '#fff',
    fontWeight: '600',
  },
});
