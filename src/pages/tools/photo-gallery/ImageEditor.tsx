import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Crop, Contrast, Sun, RotateCcw, Save } from 'lucide-react';

interface ImageEditorProps {
  imagePath: string | null;
  onSave: () => void;
}

export const ImageEditor = ({ imagePath, onSave }: ImageEditorProps) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  if (!imagePath) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>Select an image to edit</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={`https://api.dropboxapi.com/2/files/get_temporary_link`}
          alt="Edit preview"
          className="object-contain w-full h-full"
          style={{
            filter: `brightness(${brightness}%) contrast(${contrast}%)`
          }}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Brightness
          </label>
          <Slider
            value={[brightness]}
            onValueChange={(value) => setBrightness(value[0])}
            min={0}
            max={200}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Contrast className="w-4 h-4" />
            Contrast
          </label>
          <Slider
            value={[contrast]}
            onValueChange={(value) => setContrast(value[0])}
            min={0}
            max={200}
            step={1}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            setBrightness(100);
            setContrast(100);
          }}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};