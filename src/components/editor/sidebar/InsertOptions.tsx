
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Image as ImageIcon, 
  Link, 
  Table, 
  FileText, 
  Quote, 
  Code, 
  ListTree 
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

export function InsertOptions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    insertImage,
    insertLink,
    insertTable,
    insertQuote,
    insertCode,
    insertFile
  } = useEditorStore();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        insertImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Insert Media</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-10 justify-start"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Image
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-10 justify-start">
                <Link className="h-4 w-4 mr-2" />
                Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <div className="space-y-1">
                  <Label htmlFor="link-text">Text</Label>
                  <Input id="link-text" placeholder="Link text" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="link-url">URL</Label>
                  <Input id="link-url" placeholder="https://example.com" />
                </div>
                <DialogClose asChild>
                  <Button 
                    className="w-full mt-2"
                    onClick={() => {
                      const text = (document.getElementById('link-text') as HTMLInputElement).value;
                      const url = (document.getElementById('link-url') as HTMLInputElement).value;
                      if (url) {
                        insertLink(text || url, url);
                      }
                    }}
                  >
                    Insert Link
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Insert Elements</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-10 justify-start"
            onClick={insertTable}
          >
            <Table className="h-4 w-4 mr-2" />
            Table
          </Button>
          
          <Button
            variant="outline"
            className="h-10 justify-start"
            onClick={insertQuote}
          >
            <Quote className="h-4 w-4 mr-2" />
            Quote
          </Button>
          
          <Button
            variant="outline"
            className="h-10 justify-start"
            onClick={insertCode}
          >
            <Code className="h-4 w-4 mr-2" />
            Code Block
          </Button>
          
          <Button
            variant="outline"
            className="h-10 justify-start"
            onClick={() => insertFile('document.pdf')}
          >
            <FileText className="h-4 w-4 mr-2" />
            File
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>More Options</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-10 justify-start"
          >
            <ListTree className="h-4 w-4 mr-2" />
            Diagram
          </Button>
          
          <Button
            variant="outline"
            className="h-10 justify-start"
          >
            <ListTree className="h-4 w-4 mr-2" />
            Chart
          </Button>
        </div>
      </div>
    </div>
  );
}
