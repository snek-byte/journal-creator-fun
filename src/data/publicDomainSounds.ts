
import { v4 as uuidv4 } from 'uuid';
import type { AudioTrack } from '@/types/journal';

// Collection of public domain sounds
// NOTE: These sounds are hosted on freesound.org CDN and may be blocked by CORS policies.
// For best results, users should upload their own audio files.
export const publicDomainSounds: AudioTrack[] = [
  // Ambient Nature
  {
    id: uuidv4(),
    name: "Forest Ambience",
    url: "https://cdn.freesound.org/previews/573/573577_4435739-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "ambient"
  },
  {
    id: uuidv4(),
    name: "Ocean Waves",
    url: "https://cdn.freesound.org/previews/617/617306_1648170-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "ambient"
  },
  {
    id: uuidv4(),
    name: "Gentle Stream",
    url: "https://cdn.freesound.org/previews/459/459145_4435739-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "ambient"
  },
  {
    id: uuidv4(),
    name: "Rain",
    url: "https://cdn.freesound.org/previews/523/523657_7866464-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "ambient"
  },
  
  // Lo-Fi Music
  {
    id: uuidv4(),
    name: "Lo-Fi Beat 1",
    url: "https://cdn.freesound.org/previews/653/653062_1648170-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "music"
  },
  {
    id: uuidv4(),
    name: "Lo-Fi Beat 2",
    url: "https://cdn.freesound.org/previews/553/553416_5674468-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "music"
  },
  {
    id: uuidv4(),
    name: "Piano Melody",
    url: "https://cdn.freesound.org/previews/531/531623_11471037-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "music"
  },
  
  // White Noise
  {
    id: uuidv4(),
    name: "White Noise",
    url: "https://cdn.freesound.org/previews/133/133099_2398403-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "noise"
  },
  {
    id: uuidv4(),
    name: "Brown Noise",
    url: "https://cdn.freesound.org/previews/252/252186_4082826-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "noise"
  },
  {
    id: uuidv4(),
    name: "Pink Noise",
    url: "https://cdn.freesound.org/previews/235/235428_4082826-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "noise"
  },
  
  // Meditation Sounds
  {
    id: uuidv4(),
    name: "Singing Bowl",
    url: "https://cdn.freesound.org/previews/421/421184_7552772-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "meditation"
  },
  {
    id: uuidv4(),
    name: "Gentle Chimes",
    url: "https://cdn.freesound.org/previews/411/411090_5121236-lq.mp3",
    volume: 50,
    isPlaying: false,
    category: "meditation"
  }
];

export const soundCategories = [
  { id: "ambient", name: "Nature Ambience" },
  { id: "music", name: "Music" },
  { id: "noise", name: "White Noise" },
  { id: "meditation", name: "Meditation" }
];

export function getSoundsByCategory(category: string): AudioTrack[] {
  return publicDomainSounds.filter(sound => sound.category === category);
}

// Helper function to explain possible sound issues
export function getAudioTroubleshootingMessage(): string {
  return "External audio from freesound.org is often blocked by CORS policies. For best results, upload your own audio files.";
}
