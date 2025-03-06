
import { TextStyle, applyTextStyle, unicodeMap } from '@/utils/unicodeTextStyles';
import type { Mood } from '@/types/journal';

export function formatJournalText(text: string, style?: TextStyle): string {
  if (!text) return '';
  if (!style || style === 'normal') return text;

  return applyTextStyle(text, style);
}

export function getFormattedMoodText(mood?: Mood): string {
  if (!mood) return '';
  
  // Use the name property from the Mood object
  return mood.name.charAt(0).toUpperCase() + mood.name.slice(1);
}

export function getUnicodeCharacter(char: string, style: TextStyle): string {
  if (style === 'normal' || !unicodeMap[style]) return char;
  
  return unicodeMap[style][char] || char;
}
