import { Tool } from "@/utils/toolUtils";
import ToolCard from "@/components/home/ToolCard";

interface ToolGridProps {
  tools: Tool[];
}

const ToolGrid = ({ tools }: ToolGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          icon={tool.icon}
          title={tool.title}
          description={tool.description}
          to={tool.to}
        />
      ))}
    </div>
  );
};

export default ToolGrid;