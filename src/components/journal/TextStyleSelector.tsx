
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { textStyleOptions } from "@/utils/unicodeTextStyles";

interface TextStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextStyleSelector({ value, onChange }: TextStyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Text Style</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a text style" />
        </SelectTrigger>
        <SelectContent>
          {textStyleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
