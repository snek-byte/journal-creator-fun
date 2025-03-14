
import { create } from 'zustand';
import { toast } from 'sonner';

interface EditorState {
  // Content
  content: string;
  setContent: (content: string) => void;
  handleContentChange: (content: string) => void;
  
  // History
  history: string[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Text formatting
  currentFont: string;
  currentFontSize: string;
  currentFontWeight: string;
  currentColor: string;
  currentGradient: string;
  currentAlignment: 'left' | 'center' | 'right' | 'justify';
  activeMark: string[];
  activeBlock: string[];
  
  // Actions
  setFont: (font: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setColor: (color: string) => void;
  setGradient: (gradient: string) => void;
  setAlignment: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  
  // Text operations
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleStrikethrough: () => void;
  toggleCode: () => void;
  toggleLink: () => void;
  toggleBulletList: () => void;
  toggleOrderedList: () => void;
  toggleCheckList: () => void;
  
  // Insert operations
  insertImage: (url: string) => void;
  insertLink: (text: string, url: string) => void;
  insertTable: () => void;
  insertQuote: () => void;
  insertCode: () => void;
  insertFile: (filename: string) => void;
  insertEmoji: (emoji: string) => void;
  
  // Text style
  applyTextStyle: (style: string) => void;
  
  // Reset
  resetEditor: () => void;
}

// Helper to execute commands
const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

// Helper to get selected text
const getSelectedText = () => {
  const selection = window.getSelection();
  return selection?.toString() || '';
};

// Initial state
const initialState = {
  content: '',
  history: [],
  historyIndex: -1,
  currentFont: 'inter',
  currentFontSize: '16px',
  currentFontWeight: 'normal',
  currentColor: '#000000',
  currentGradient: '',
  currentAlignment: 'left' as const,
  activeMark: [],
  activeBlock: [],
};

export const useEditorStore = create<EditorState>()((set, get) => ({
  ...initialState,
  
  // Content management
  setContent: (content) => {
    set({ content });
  },
  
  handleContentChange: (content) => {
    const { history, historyIndex } = get();
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(content);
    
    set({ 
      content,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: newHistory.length > 1,
      canRedo: false
    });
  },
  
  // History management
  canUndo: false,
  canRedo: false,
  
  undo: () => {
    const { history, historyIndex } = get();
    
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ 
        historyIndex: newIndex,
        content: history[newIndex],
        canUndo: newIndex > 0,
        canRedo: true
      });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ 
        historyIndex: newIndex,
        content: history[newIndex],
        canUndo: true,
        canRedo: newIndex < history.length - 1
      });
    }
  },
  
  // Text formatting
  setFont: (font) => {
    set({ currentFont: font });
    execCommand('fontName', font);
  },
  
  setFontSize: (size) => {
    set({ currentFontSize: size });
    
    try {
      const sizePx = parseInt(size);
      if (!isNaN(sizePx)) {
        // Convert px to pt for execCommand (approximate)
        const sizePt = Math.round(sizePx * 0.75);
        execCommand('fontSize', sizePt.toString());
      }
    } catch (error) {
      console.error('Error setting font size:', error);
    }
  },
  
  setFontWeight: (weight) => {
    set({ currentFontWeight: weight });
    
    // Apply bold if weight is bold or greater
    if (weight === 'bold' || parseInt(weight) >= 700) {
      execCommand('bold');
    }
  },
  
  setColor: (color) => {
    set({ currentColor: color });
    execCommand('foreColor', color);
  },
  
  setGradient: (gradient) => {
    set({ currentGradient: gradient });
    
    // Gradients can't be applied via execCommand
    // We'll need to rely on the styling in the EditorContent component
  },
  
  setAlignment: (alignment) => {
    set({ currentAlignment: alignment });
    
    switch (alignment) {
      case 'left':
        execCommand('justifyLeft');
        break;
      case 'center':
        execCommand('justifyCenter');
        break;
      case 'right':
        execCommand('justifyRight');
        break;
      case 'justify':
        execCommand('justifyFull');
        break;
    }
  },
  
  // Text operations
  toggleBold: () => {
    execCommand('bold');
    
    const { activeMark } = get();
    const newMarks = activeMark.includes('bold')
      ? activeMark.filter(m => m !== 'bold')
      : [...activeMark, 'bold'];
    
    set({ activeMark: newMarks });
  },
  
  toggleItalic: () => {
    execCommand('italic');
    
    const { activeMark } = get();
    const newMarks = activeMark.includes('italic')
      ? activeMark.filter(m => m !== 'italic')
      : [...activeMark, 'italic'];
    
    set({ activeMark: newMarks });
  },
  
  toggleUnderline: () => {
    execCommand('underline');
    
    const { activeMark } = get();
    const newMarks = activeMark.includes('underline')
      ? activeMark.filter(m => m !== 'underline')
      : [...activeMark, 'underline'];
    
    set({ activeMark: newMarks });
  },
  
  toggleStrikethrough: () => {
    execCommand('strikeThrough');
    
    const { activeMark } = get();
    const newMarks = activeMark.includes('strikethrough')
      ? activeMark.filter(m => m !== 'strikethrough')
      : [...activeMark, 'strikethrough'];
    
    set({ activeMark: newMarks });
  },
  
  toggleCode: () => {
    const selectedText = getSelectedText();
    
    if (selectedText) {
      execCommand('insertHTML', `<code>${selectedText}</code>`);
    } else {
      execCommand('insertHTML', '<code>code</code>');
    }
    
    const { activeMark } = get();
    const newMarks = activeMark.includes('code')
      ? activeMark.filter(m => m !== 'code')
      : [...activeMark, 'code'];
    
    set({ activeMark: newMarks });
  },
  
  toggleLink: () => {
    const selectedText = getSelectedText();
    
    if (selectedText) {
      const url = prompt('Enter URL:', 'https://');
      
      if (url) {
        execCommand('createLink', url);
      }
    } else {
      const url = prompt('Enter URL:', 'https://');
      const text = prompt('Enter link text:', 'Link');
      
      if (url && text) {
        execCommand('insertHTML', `<a href="${url}">${text}</a>`);
      }
    }
    
    const { activeMark } = get();
    const newMarks = activeMark.includes('link')
      ? activeMark.filter(m => m !== 'link')
      : [...activeMark, 'link'];
    
    set({ activeMark: newMarks });
  },
  
  toggleBulletList: () => {
    execCommand('insertUnorderedList');
    
    const { activeBlock } = get();
    const newBlocks = activeBlock.includes('bullet')
      ? activeBlock.filter(b => b !== 'bullet')
      : [...activeBlock, 'bullet'];
    
    set({ activeBlock: newBlocks });
  },
  
  toggleOrderedList: () => {
    execCommand('insertOrderedList');
    
    const { activeBlock } = get();
    const newBlocks = activeBlock.includes('ordered')
      ? activeBlock.filter(b => b !== 'ordered')
      : [...activeBlock, 'ordered'];
    
    set({ activeBlock: newBlocks });
  },
  
  toggleCheckList: () => {
    const html = `
      <ul style="list-style-type: none; padding-left: 1.5em;">
        <li>
          <input type="checkbox" style="margin-right: 0.5em;"> List item
        </li>
      </ul>
    `;
    
    execCommand('insertHTML', html);
    
    const { activeBlock } = get();
    const newBlocks = activeBlock.includes('check')
      ? activeBlock.filter(b => b !== 'check')
      : [...activeBlock, 'check'];
    
    set({ activeBlock: newBlocks });
  },
  
  // Insert operations
  insertImage: (url) => {
    execCommand('insertHTML', `<img src="${url}" alt="Image" style="max-width: 100%;">`);
    toast.success('Image inserted');
  },
  
  insertLink: (text, url) => {
    execCommand('insertHTML', `<a href="${url}" target="_blank">${text}</a>`);
    toast.success('Link inserted');
  },
  
  insertTable: () => {
    const html = `
      <table style="width: 100%; border-collapse: collapse; margin: 1em 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Header 1</th>
            <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Header 2</th>
            <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">Row 1, Cell 1</td>
            <td style="border: 1px solid #ccc; padding: 8px;">Row 1, Cell 2</td>
            <td style="border: 1px solid #ccc; padding: 8px;">Row 1, Cell 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">Row 2, Cell 1</td>
            <td style="border: 1px solid #ccc; padding: 8px;">Row 2, Cell 2</td>
            <td style="border: 1px solid #ccc; padding: 8px;">Row 2, Cell 3</td>
          </tr>
        </tbody>
      </table>
    `;
    
    execCommand('insertHTML', html);
    toast.success('Table inserted');
  },
  
  insertQuote: () => {
    const html = `
      <blockquote style="border-left: 3px solid #ccc; margin: 1em 0; padding-left: 1em; color: #666;">
        <p>Enter your quote here...</p>
      </blockquote>
    `;
    
    execCommand('insertHTML', html);
    toast.success('Quote block inserted');
  },
  
  insertCode: () => {
    const html = `
      <pre style="background-color: #f5f5f5; border-radius: 4px; padding: 1em; overflow-x: auto; font-family: monospace; margin: 1em 0;">
// Your code here
function example() {
  console.log("Hello world");
}
      </pre>
    `;
    
    execCommand('insertHTML', html);
    toast.success('Code block inserted');
  },
  
  insertFile: (filename) => {
    const html = `
      <div style="display: flex; align-items: center; padding: 0.5em; border: 1px solid #ccc; border-radius: 4px; margin: 0.5em 0; background-color: #f9f9f9;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5em;">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span>${filename}</span>
      </div>
    `;
    
    execCommand('insertHTML', html);
    toast.success('File attachment inserted');
  },
  
  insertEmoji: (emoji) => {
    execCommand('insertText', emoji);
  },
  
  // Text style
  applyTextStyle: (style) => {
    const selectedText = getSelectedText();
    
    if (!selectedText) {
      toast.error('Please select text first');
      return;
    }
    
    let html = '';
    
    switch (style) {
      case 'highlight':
        html = `<mark style="background-color: #fff387; padding: 0 2px;">${selectedText}</mark>`;
        break;
      case 'shadow':
        html = `<span style="text-shadow: 2px 2px 2px rgba(0,0,0,0.3);">${selectedText}</span>`;
        break;
      case 'glow':
        html = `<span style="text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6;">${selectedText}</span>`;
        break;
      case 'outline':
        html = `<span style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; color: white;">${selectedText}</span>`;
        break;
      case 'blur':
        html = `<span style="color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5);">${selectedText}</span>`;
        break;
      case 'reveal':
        html = `<span style="background-color: #000; color: #000; transition: color 0.3s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#000'">${selectedText}</span>`;
        break;
      default:
        // For unicode transformations from the textStyles array
        html = `<span>${selectedText}</span>`;
        if (style) {
          // Apply unicode transformation in the component
          console.log(`Applying style: ${style}`);
          toast.success('Style applied');
        }
        break;
    }
    
    execCommand('insertHTML', html);
  },
  
  // Reset
  resetEditor: () => {
    set({
      ...initialState,
      content: '<p>Start typing here...</p>',
      history: ['<p>Start typing here...</p>'],
      historyIndex: 0,
      canUndo: false,
      canRedo: false,
    });
    
    toast.success('Editor reset to default');
  }
}));
