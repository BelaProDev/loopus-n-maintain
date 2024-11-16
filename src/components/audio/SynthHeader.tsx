import { Music2 } from "lucide-react";

const SynthHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Music2 className="h-5 w-5" />
        Advanced Synthesizer
      </h3>
    </div>
  );
};

export default SynthHeader;