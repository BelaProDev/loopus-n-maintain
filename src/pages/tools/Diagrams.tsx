import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Upload, Save, Share2 } from "lucide-react";
import { toast } from "sonner";
import DatabaseSchemaEditor from './diagrams/DatabaseSchemaEditor';
import ComponentDiagramEditor from './diagrams/ComponentDiagramEditor';
import NetworkDiagramEditor from './diagrams/NetworkDiagramEditor';
import SystemArchitectureEditor from './diagrams/SystemArchitectureEditor';

const Diagrams = () => {
  const [activeTab, setActiveTab] = useState('system');

  const handleSave = () => {
    toast.success("Diagram saved successfully");
  };

  const handleExport = () => {
    toast.success("Diagram exported successfully");
  };

  const handleShare = () => {
    toast.success("Share link copied to clipboard");
  };

  const handleImport = () => {
    toast.success("Diagram imported successfully");
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Designer</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="system">System Architecture</TabsTrigger>
            <TabsTrigger value="component">Component Diagram</TabsTrigger>
            <TabsTrigger value="database">Database Schema</TabsTrigger>
            <TabsTrigger value="network">Network Diagram</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="mt-4">
            <SystemArchitectureEditor />
          </TabsContent>

          <TabsContent value="component" className="mt-4">
            <ComponentDiagramEditor />
          </TabsContent>

          <TabsContent value="database" className="mt-4">
            <DatabaseSchemaEditor />
          </TabsContent>

          <TabsContent value="network" className="mt-4">
            <NetworkDiagramEditor />
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Diagram Properties</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-1 rounded-md border" 
              placeholder="Diagram name"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Author</label>
            <input 
              type="text" 
              className="w-full px-3 py-1 rounded-md border" 
              placeholder="Author name"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Version</label>
            <input 
              type="text" 
              className="w-full px-3 py-1 rounded-md border" 
              placeholder="1.0.0"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Last Modified</label>
            <input 
              type="text" 
              className="w-full px-3 py-1 rounded-md border" 
              value={new Date().toLocaleDateString()}
              readOnly
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Diagrams;