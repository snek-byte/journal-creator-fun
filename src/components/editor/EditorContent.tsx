
import React, { forwardRef, useEffect } from 'react';
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
    
    // Set initial content
    useEffect(() => {
      if (!content) {
        setContent('<p>Start typing here...</p>');
      }
    }, [content, setContent]);
    
    return (
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
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              handleContentChange(target.innerHTML);
            }}
            onKeyDown={(e) => {
              // Support tab key
              if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
              }
            }}
          />
        </div>
      </div>
    );
  }
);

EditorContent.displayName = 'EditorContent';
