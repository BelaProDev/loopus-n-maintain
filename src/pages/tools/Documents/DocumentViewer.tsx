import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Share2, Printer, Search } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentViewerProps {
  content: string;
  fileName: string;
}

const DocumentViewer = ({ content, fileName }: DocumentViewerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(100);

  const handlePrint = () => {
    toast.success('Preparing document for printing...');
    window.print();
  };

  const handleDownload = () => {
    toast.success('Downloading document...');
    // Implementation would go here
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard');
    // Implementation would go here
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <h2 className="text-lg font-semibold">{fileName}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
          >
            -
          </Button>
          <span className="min-w-[4rem] text-center">{zoom}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
          >
            +
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <ScrollArea className="h-[600px] border rounded-md p-4">
            <div style={{ zoom: `${zoom}%` }}>
              {content}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="outline">
          <ScrollArea className="h-[600px] border rounded-md p-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">Document outline will appear here</p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="comments">
          <ScrollArea className="h-[600px] border rounded-md p-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">Comments will appear here</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DocumentViewer;