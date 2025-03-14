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

// Utility function to transform text based on selected style
export function transformText(text: string, style: string): string {
  // Implementation details would go here
  // This would use Unicode character mappings to transform the text
  // For example, to convert to small caps, circled letters, etc.
  return text;
}
