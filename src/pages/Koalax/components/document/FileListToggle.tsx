import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FileListToggleProps {
  isMacOS: boolean;
  onToggle: (checked: boolean) => void;
}

const FileListToggle = ({ isMacOS, onToggle }: FileListToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="ui-style"
        checked={isMacOS}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="ui-style">macOS Style</Label>
    </div>
  );
};

export default FileListToggle;