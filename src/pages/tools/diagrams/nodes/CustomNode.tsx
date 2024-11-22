import { Handle, Position, NodeProps } from 'reactflow';
import { Database, Server, Network, Cpu } from 'lucide-react';

const iconMap = {
  database: Database,
  server: Server,
  api: Network,
  service: Cpu,
};

const CustomNode = ({ data }: NodeProps) => {
  const Icon = iconMap[data.type as keyof typeof iconMap] || Server;

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex items-center">
        <Icon className="h-8 w-8 text-gray-500 mr-2" />
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

export default CustomNode;