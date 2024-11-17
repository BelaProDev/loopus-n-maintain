import { useState, useEffect } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Upload, Settings2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ImageGrid } from './photo-gallery/ImageGrid';
import { ImageEditor } from './photo-gallery/ImageEditor';
import { NavigationBreadcrumb } from '../DropboxExplorer/components/NavigationBreadcrumb';
import { toast } from 'sonner';
import { getMediaType } from '@/lib/utils/fileUtils';

const PhotoGallery = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const { client, isAuthenticated, connect } = useDropbox();
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    if (!client) return;
    
    setIsLoading(true);
    try {
      const response = await client.filesListFolder({
        path: currentPath || '',
        include_mounted_folders: true,
        include_non_downloadable_files: true
      });
      
      setFiles(response.result.entries);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (client) {
      fetchFiles();
    }
  }, [client, currentPath]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !client) return;

    const mediaType = getMediaType(file.name);
    if (mediaType === 'other') {
      toast.error("Please select an image or video file");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        await client.filesUpload({
          path: `${currentPath}/${file.name}`,
          contents: arrayBuffer,
          mode: { '.tag': 'add' },
          autorename: true
        });
        toast.success('File uploaded successfully');
        fetchFiles();
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedMedia(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Media Gallery</h1>
            <p className="text-lg text-gray-600">Connect to Dropbox to manage your photos and videos</p>
            <Button onClick={connect} className="mt-4">
              <Image className="w-4 h-4 mr-2" />
              Connect to Dropbox
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Media Gallery
            </h1>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="max-w-[200px]"
              />
              <Button variant="outline" className="hover:bg-purple-50">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          <NavigationBreadcrumb
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />

          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="grid">
                <Image className="w-4 h-4 mr-2" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Settings2 className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-4">
              <Card className="p-4 bg-white/50 backdrop-blur-sm">
                {isLoading ? (
                  <div className="flex justify-center p-8">Loading...</div>
                ) : (
                  <ImageGrid
                    images={files.filter(file => getMediaType(file.name) !== 'other')}
                    onSelect={setSelectedMedia}
                    selectedImage={selectedMedia}
                  />
                )}
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              <Card className="p-4 bg-white/50 backdrop-blur-sm">
                <ImageEditor
                  imagePath={selectedMedia}
                  onSave={() => {
                    toast.success("Media saved successfully");
                  }}
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PhotoGallery;