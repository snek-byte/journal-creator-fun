
import { create } from 'zustand';

interface JournalState {
  text: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  showPreview: boolean;
  setText: (text: string) => void;
  setFont: (font: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setFontColor: (color: string) => void;
  setGradient: (gradient: string) => void;
  togglePreview: () => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  text: '',
  font: 'inter',
  fontSize: '16px',
  fontWeight: 'normal',
  fontColor: '#000000',
  gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  showPreview: true,
  setText: (text) => set({ text }),
  setFont: (font) => set({ font }),
  setFontSize: (fontSize) => set({ fontSize }),
  setFontWeight: (fontWeight) => set({ fontWeight }),
  setFontColor: (fontColor) => set({ fontColor }),
  setGradient: (gradient) => set({ gradient }),
  togglePreview: () => set((state) => ({ showPreview: !state.showPreview })),
}));
