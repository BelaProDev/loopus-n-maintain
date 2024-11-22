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
import { Database, Table, Key } from 'lucide-react';
import CustomNode from './nodes/CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { 
      label: 'Users Table',
      type: 'database',
      description: 'User information storage'
    },
    position: { x: 250, y: 25 },
  }
];

const DatabaseSchemaEditor = () => {
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
        type: 'database',
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
        <Button variant="outline" onClick={() => addNode('Table')}>
          <Table className="mr-2 h-4 w-4" />
          Add Table
        </Button>
        <Button variant="outline" onClick={() => addNode('Primary Key')}>
          <Key className="mr-2 h-4 w-4" />
          Add Primary Key
        </Button>
        <Button variant="outline" onClick={() => addNode('Foreign Key')}>
          <Database className="mr-2 h-4 w-4" />
          Add Foreign Key
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
          <div className="text-sm font-medium">Database Schema</div>
          <div className="text-xs text-muted-foreground mt-1">
            Drag to connect tables and keys
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default DatabaseSchemaEditor;