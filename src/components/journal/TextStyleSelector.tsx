
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTextStyles, transformText } from "@/utils/unicodeTextStyles";

interface TextStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextStyleSelector({ value, onChange }: TextStyleSelectorProps) {
  const styles = getTextStyles();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Text Style</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a text style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Regular</SelectItem>
          {styles.map((style) => (
            <SelectItem key={style.value} value={style.value}>
              {transformText(style.label, style.value as any)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <p className="text-sm text-muted-foreground">
          Preview: {transformText("The quick brown fox jumps over the lazy dog", value as any)}
        </p>
      )}
    </div>
  );
}
