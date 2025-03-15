
export interface TextStyle {
  value: string;
  label: string;
}

// Text styles with Unicode transformations
export const textStyles: TextStyle[] = [
  { value: 'bold', label: '𝐁𝐨𝐥𝐝' },
  { value: 'italic', label: '𝘐𝘵𝘢𝘭𝘪𝘤' },
  { value: 'bold-italic', label: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄' },
  { value: 'script', label: '𝓢𝓬𝓻𝓲𝓹𝓽' },
  { value: 'double-struck', label: 'ⓓⓞⓤⓑⓛⓔ-ⓢⓣⓡⓤⓒⓚ' },
  { value: 'fraktur', label: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯' },
  { value: 'monospace', label: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎' },
  { value: 'sans-serif', label: '𝖲𝖺𝗇𝗌-𝗌𝖾𝗋𝗂𝖿' },
  { value: 'sans-serif-bold', label: '𝗦𝗮𝗻𝘀-𝘀𝗲𝗿𝗶𝗳 𝗯𝗼𝗹𝗱' },
  { value: 'small-caps', label: 'sᴍᴀʟʟ ᴄᴀᴘs' },
  { value: 'superscript', label: 'ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ' },
  { value: 'subscript', label: 'ₛᵤᵦₛ𝒸ᵣᵢₚₜ' },
  { value: 'upside-down', label: 'uʍop-ǝpᴉsdn' },
  { value: 'strikethrough', label: 'S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶' },
  { value: 'underline', label: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲' },
  { value: 'circled', label: 'Ⓒⓘⓡⓒⓛⓔⓓ' },
  { value: 'fullwidth', label: 'Ｆｕｌｌｗｉｄｔｈ' },
  { value: 'math-bold', label: '𝐌𝐚𝐭𝐡 𝐛𝐨𝐥𝐝' },
  { value: 'math-bold-italic', label: '𝑴𝒂𝒕𝒉 𝒃𝒐𝒍𝒅 𝒊𝒕𝒂𝒍𝒊𝒄' },
  { value: 'math-bold-script', label: '𝓜𝓪𝓽𝓱 𝓫𝓸𝓵𝓭 𝓼𝓬𝓻𝓲𝓹𝓽' },
  { value: 'math-double-struck', label: 'ℂ𝕠𝕞𝕡𝕝𝕖𝕩 𝕕𝕠𝕦𝕓𝕝𝕖-𝕤𝕥𝕣𝕦𝕔𝕜' },
  { value: 'math-monospace', label: '𝙼𝚊𝚝𝚑 𝚖𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎' },
  { value: 'math-sans', label: '𝖬𝖺𝗍𝗁 𝗌𝖺𝗇𝗌' },
  { value: 'math-sans-bold', label: '𝗠𝗮𝘁𝗵 𝘀𝗮𝗻𝘀 𝗯𝗼𝗹𝗱' },
  { value: 'math-sans-italic', label: '𝘔𝘢𝘵𝘩 𝘴𝘢𝘯𝘴 𝘪𝘵𝘢𝘭𝘪𝘤' },
  { value: 'math-sans-bold-italic', label: '𝙈𝙖𝙩𝙝 𝙨𝙖𝙣𝙨 𝙗𝙤𝙡𝙙 𝙞𝙩𝙖𝙡𝙞𝙘' },
];

// Character mappings for each style
const characterMaps: Record<string, Record<string, string>> = {
  'bold': {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
    'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
    'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
    'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
    'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  },
  'italic': {
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫',
    'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵',
    'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑',
    'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛',
    'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
  },
  'double-struck': {
    'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ',
    'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ',
    'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
    'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ',
    'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ',
    'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
    '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
  }
};

// Special handling for styles that need different processing
const specialStyles: { [key: string]: (text: string) => string } = {
  'strikethrough': (text) => text.split('').map(c => c + '\u0336').join(''),
  'underline': (text) => text.split('').map(c => c + '\u0332').join(''),
  'upside-down': (text) => {
    const flipTable: { [key: string]: string } = {
      'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
      'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
      'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
      'y': 'ʎ', 'z': 'z', '.': '˙', '[': ']', '(': ')', '{': '}', '?': '¿', '!': '¡',
      '"': '„', '_': '‾'
    };
    return text.toLowerCase().split('').reverse().map(c => flipTable[c] || c).join('');
  }
};

export const applyTextStyle = (text: string, style: string): string => {
  if (!text) return text;
  
  // Check if it's a special style
  if (specialStyles[style]) {
    return specialStyles[style](text);
  }
  
  // Check if we have a character map for this style
  if (characterMaps[style]) {
    return text.split('').map(char => characterMaps[style][char] || char).join('');
  }
  
  // If no specific handling is found, return the original text
  console.log("No specific handling for style:", style);
  return text;
};
