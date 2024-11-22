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
  Panel,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CustomNode from './nodes/CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { 
      label: 'Web Server',
      type: 'server',
      description: 'Main web server instance'
    },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    type: 'custom',
    data: { 
      label: 'Database',
      type: 'database',
      description: 'Primary database'
    },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'custom',
    data: { 
      label: 'API Gateway',
      type: 'api',
      description: 'API Gateway service'
    },
    position: { x: 400, y: 125 },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3',
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  },
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
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true,
    }, eds)),
    []
  );

  const addNewNode = () => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      data: { 
        label: `Service ${nodes.length + 1}`,
        type: 'service',
        description: 'New service'
      },
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
          nodeTypes={nodeTypes}
          fitView
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <Background />
          <Controls className="m-4" />
          <Panel position="top-right" className="bg-background/80 p-2 rounded-lg m-4">
            <div className="text-sm font-medium">Diagram Controls</div>
            <div className="text-xs text-muted-foreground mt-1">
              • Drag nodes to move them<br />
              • Click and drag between nodes to connect<br />
              • Use mouse wheel to zoom<br />
              • Hold space to pan
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default SystemArchitectureEditor;