
import { v4 as uuidv4 } from 'uuid';
import type { TextBox } from '@/types/journal';

interface TextBoxCreatorProps {
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle: string;
  textBoxes: TextBox[];
  onTextBoxAdd: (textBox: TextBox) => void;
  onTextBoxSelect: (id: string) => void;
}

export function TextBoxCreator({
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  textStyle,
  textBoxes,
  onTextBoxAdd,
  onTextBoxSelect
}: TextBoxCreatorProps) {
  const handleCreateTextBox = () => {
    console.log("Creating new text box");
    const newTextBox: TextBox = {
      id: uuidv4(),
      text: '',
      position: { x: 50, y: 50 },
      width: 200,
      height: 100,
      font,
      fontSize,
      fontWeight,
      fontColor,
      gradient,
      textStyle,
      rotation: 0,
      zIndex: (textBoxes?.length || 0) + 10
    };
    
    onTextBoxAdd(newTextBox);
    onTextBoxSelect(newTextBox.id);
  };
  
  return {
    handleCreateTextBox
  };
}
