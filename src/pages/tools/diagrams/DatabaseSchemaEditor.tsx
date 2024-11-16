import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Database, Table, Key } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Users Table' },
    position: { x: 250, y: 25 },
  }
];

const DatabaseSchemaEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const addNode = (type: string) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: 'default',
      data: { label: type },
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
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default DatabaseSchemaEditor;