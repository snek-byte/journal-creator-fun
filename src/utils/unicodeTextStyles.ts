
export type TextStyle = string;

export const textStyles = [
  { label: 'Bold Serif', value: 'bold-serif' },
  { label: 'Math Bold', value: 'math-bold' },
  { label: 'Math Bold Italic', value: 'math-bold-italic' },
  { label: 'Math Bold Script', value: 'math-bold-script' },
  { label: 'Double-Struck', value: 'double-struck' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Fraktur', value: 'fraktur' },
  { label: 'Bold Fraktur', value: 'bold-fraktur' },
  { label: 'Sans-Serif', value: 'sans-serif' },
  { label: 'Sans-Serif Bold', value: 'sans-serif-bold' },
  { label: 'Sans-Serif Italic', value: 'sans-serif-italic' },
  { label: 'Sans-Serif Bold Italic', value: 'sans-serif-bold-italic' },
  { label: 'Script', value: 'script' },
  { label: 'Small Caps', value: 'small-caps' },
  { label: 'Circled', value: 'circled' },
  { label: 'Inverted Circled', value: 'circled-neg' },
  { label: 'Squared', value: 'squared' },
  { label: 'Inverted Squared', value: 'squared-neg' },
  { label: 'Parenthesized', value: 'parenthesized' },
  { label: 'Upside Down', value: 'upside-down' },
  { label: 'Fullwidth', value: 'fullwidth' },
  { label: 'Math Script', value: 'math-script' },
  { label: 'Strikethrough', value: 'strikethrough' },
  { label: 'Underline', value: 'underline' },
];

// Character mapping for different Unicode styles
const unicodeMap: Record<string, Record<string, string>> = {
  'bold-serif': {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
    'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
    'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
    'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
    'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  },
  'math-bold': {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
    'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
    'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
    'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
    'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  },
  'math-bold-italic': {
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
  },
  'math-bold-script': {
    'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳',
    'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽',
    'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃',
    'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙',
    'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣',
    'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩'
  }
};

// Utility function to transform text based on selected style
export function applyTextStyle(text: string, style: TextStyle): string {
  if (!text) return '';
  if (!style || style === 'normal') return text;

  // Handle special styles that don't use unicode mapping
  switch (style) {
    case 'strikethrough':
      return text.split('').join('̶') + '̶';
    case 'underline':
      return text.split('').join('̲') + '̲';
    case 'upside-down':
      return text.split('').reverse().map(char => {
        const flippedChars: Record<string, string> = {
          'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
          'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
          'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
          'y': 'ʎ', 'z': 'z', '.': '˙', '[': ']', '(': ')', '{': '}', '?': '¿', '!': '¡',
          '"': '„', "'": ',', '‿': '⁀', '⁅': '⁆', '∴': '∵', '&': '⅋', '_': '‾',
          '\\': '/', '<': '>', ';': '', '‿': '⁀', '⁅': '⁆', '∴': '∵'
        };
        return flippedChars[char.toLowerCase()] || char;
      }).join('');
  }

  // Use unicode mapping for other styles
  if (unicodeMap[style]) {
    return text.split('').map(char => unicodeMap[style][char] || char).join('');
  }

  return text;
}
