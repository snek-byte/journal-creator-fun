
import React, { forwardRef, useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

interface EditorContentProps {
  font: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  gradient: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
}

export const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  ({ font, fontSize, fontWeight, color, gradient, alignment }, ref) => {
    const { setContent, content, handleContentChange } = useEditorStore();
    const selectionRef = useRef<{ start: number, end: number } | null>(null);
    
    // Set initial content
    useEffect(() => {
      if (!content) {
        setContent('<p>Start typing here...</p>');
      }
    }, [content, setContent]);
    
    // Function to save the current selection position
    const saveSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        selectionRef.current = {
          start: range.startOffset,
          end: range.endOffset
        };
      }
    };
    
    // Function to restore the selection position
    const restoreSelection = () => {
      const contentEditableDiv = ref as React.RefObject<HTMLDivElement>;
      if (contentEditableDiv?.current && selectionRef.current) {
        const selection = window.getSelection();
        if (selection) {
          try {
            // Get all text nodes in the editor
            const textNodes: Node[] = [];
            const walker = document.createTreeWalker(
              contentEditableDiv.current,
              NodeFilter.SHOW_TEXT,
              null
            );
            
            let node;
            while (node = walker.nextNode()) {
              textNodes.push(node);
            }
            
            if (textNodes.length > 0) {
              // Try to set selection at the saved position
              const range = document.createRange();
              range.setStart(textNodes[0], selectionRef.current.start);
              range.setEnd(textNodes[0], selectionRef.current.end);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          } catch (e) {
            console.error("Error restoring selection:", e);
          }
        }
      }
    };
    
    return (
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto w-full bg-white rounded-lg shadow-sm min-h-[60vh]">
          <div className="p-6">
            <div
              ref={ref}
              contentEditable
              suppressContentEditableWarning
              className={cn(
                "outline-none min-h-[50vh] break-words",
                {
                  "text-left": alignment === 'left',
                  "text-center": alignment === 'center',
                  "text-right": alignment === 'right',
                  "text-justify": alignment === 'justify',
                }
              )}
              style={{
                fontFamily: font || 'inherit',
                fontSize: fontSize || 'inherit',
                fontWeight: fontWeight || 'inherit',
                color: gradient ? 'transparent' : (color || 'inherit'),
                background: gradient || 'transparent',
                WebkitBackgroundClip: gradient ? 'text' : 'border-box',
                backgroundClip: gradient ? 'text' : 'border-box',
              }}
              dangerouslySetInnerHTML={{ __html: content }}
              onBlur={saveSelection}
              onClick={saveSelection}
              onKeyDown={(e) => {
                saveSelection();
                // Support tab key
                if (e.key === 'Tab') {
                  e.preventDefault();
                  document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLDivElement;
                handleContentChange(target.innerHTML);
                saveSelection();
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);

EditorContent.displayName = 'EditorContent';
