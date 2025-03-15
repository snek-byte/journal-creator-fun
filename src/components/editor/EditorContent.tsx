
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
    const selectionRef = useRef<{ start: number, end: number, node: Node | null } | null>(null);
    
    // Set initial content
    useEffect(() => {
      if (!content) {
        setContent('<p>Start typing here...</p>');
      }
    }, [content, setContent]);
    
    // Function to save the current selection position with more accuracy
    const saveSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        selectionRef.current = {
          start: range.startOffset,
          end: range.endOffset,
          node: range.startContainer
        };
      }
    };
    
    // Function to restore the selection position more accurately
    const restoreSelection = () => {
      if (!selectionRef.current || !selectionRef.current.node) return;
      
      try {
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.setStart(selectionRef.current.node, selectionRef.current.end);
          range.setEnd(selectionRef.current.node, selectionRef.current.end);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (e) {
        console.error("Error restoring selection:", e);
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
                WebkitTextFillColor: gradient ? 'transparent' : (color || 'inherit'),
                color: gradient ? 'transparent' : (color || 'inherit'),
                backgroundImage: gradient || 'none',
                WebkitBackgroundClip: gradient ? 'text' : 'unset',
                backgroundClip: gradient ? 'text' : 'unset',
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact',
                MozPrintColorAdjust: 'exact'
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
                // We don't save selection here as it would cause the cursor to jump
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);

EditorContent.displayName = 'EditorContent';
