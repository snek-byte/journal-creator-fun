
import { TextStyle, applyTextStyle, unicodeMap } from '@/utils/unicodeTextStyles';
import type { Mood } from '@/types/journal';

export function formatJournalText(text: string, style?: TextStyle): string {
  if (!text) return '';
  if (!style || style === 'normal') return text;

  return applyTextStyle(text, style);
}

export function getFormattedMoodText(mood?: Mood): string {
  if (!mood) return '';
  
  // Capitalize the first letter of the mood
  return mood.charAt(0).toUpperCase() + mood.slice(1);
}

export function getUnicodeCharacter(char: string, style: TextStyle): string {
  if (style === 'normal' || !unicodeMap[style]) return char;
  
  return unicodeMap[style][char] || char;
}
