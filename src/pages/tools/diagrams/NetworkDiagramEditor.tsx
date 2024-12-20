import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Wifi, Server, Laptop, Router } from 'lucide-react';
import CustomNode from './nodes/CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { 
      label: 'Main Router',
      type: 'server',
      description: 'Network gateway'
    },
    position: { x: 250, y: 25 },
  }
];

const NetworkDiagramEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true
    }, eds));
  };

  const addNode = (type: string) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: 'custom',
      data: { 
        label: `${type} ${nodes.length + 1}`,
        type: 'server',
        description: `New ${type.toLowerCase()}`
      },
      position: { 
        x: Math.random() * 500, 
        y: Math.random() * 500 
      },
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="h-[600px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-4">
      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={() => addNode('Router')}>
          <Router className="mr-2 h-4 w-4" />
          Add Router
        </Button>
        <Button variant="outline" onClick={() => addNode('Server')}>
          <Server className="mr-2 h-4 w-4" />
          Add Server
        </Button>
        <Button variant="outline" onClick={() => addNode('Client')}>
          <Laptop className="mr-2 h-4 w-4" />
          Add Client
        </Button>
        <Button variant="outline" onClick={() => addNode('Access Point')}>
          <Wifi className="mr-2 h-4 w-4" />
          Add Access Point
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
        <Panel position="top-right" className="bg-background/80 p-2 rounded-lg">
          <div className="text-sm font-medium">Network Diagram</div>
          <div className="text-xs text-muted-foreground mt-1">
            Design your network topology
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default NetworkDiagramEditor;