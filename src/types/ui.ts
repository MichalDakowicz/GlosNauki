export type TabId = 'materials' | 'session' | 'profile';

export type SampleImage = {
  id: string;
  title: string;
  uri: string;
  description: string;
};

export type VoiceSample = {
  command: string;
  response: string;
};

export type PlaceholderContent = {
  welcome: string;
  ui: {
    dropLabel: string;
    responsePanelTitle: string;
  };
  actions: {
    dropAreaOpen: string;
    imagePicked: string;
    tabs: Record<TabId, string>;
  };
  voiceCommands: VoiceSample[];
};
