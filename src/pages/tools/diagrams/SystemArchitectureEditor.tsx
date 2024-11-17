import { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Web Server' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Database' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'API Gateway' },
    position: { x: 400, y: 125 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const SystemArchitectureEditor = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { toast } = useToast();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNewNode = () => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { label: `Service ${nodes.length + 1}` },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
    };
    setNodes([...nodes, newNode]);
  };

  const clearDiagram = () => {
    setNodes([]);
    setEdges([]);
  };

  const saveDiagram = () => {
    toast({
      title: "Diagram Saved",
      description: "Your system architecture diagram has been saved successfully.",
    });
  };

  return (
    <div className="flex flex-col h-[800px]">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <Button onClick={addNewNode} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>
          <Button onClick={clearDiagram} variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
        <Button onClick={saveDiagram} size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <Background />
          <Controls className="m-4" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default SystemArchitectureEditor;