import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDropboxManager } from '@/hooks/useDropboxManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Upload, FolderOpen, FileImage, Video, Settings2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ImageGrid } from './photo-gallery/ImageGrid';
import { ImageEditor } from './photo-gallery/ImageEditor';
import { NavigationBreadcrumb } from '../DropboxExplorer/components/NavigationBreadcrumb';
import { useToast } from '@/components/ui/use-toast';

const PhotoGallery = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const {
    files,
    isLoading,
    isAuthenticated,
    uploadMutation,
    handleLogin,
  } = useDropboxManager(currentPath);

  const imageFiles = files?.filter(file => 
    file['.tag'] === 'file' && 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
  );

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedImage(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Photo Gallery</h1>
            <p className="text-lg text-gray-600">Connect to Dropbox to manage your photos</p>
            <Button onClick={handleLogin} className="mt-4">
              <FileImage className="w-4 h-4 mr-2" />
              Connect to Dropbox
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Photo Gallery</h1>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="max-w-[200px]"
              />
              <Button variant="outline">
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
            <TabsList>
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
              <Card className="p-4">
                {isLoading ? (
                  <div className="flex justify-center p-8">Loading...</div>
                ) : (
                  <ImageGrid
                    images={imageFiles || []}
                    onSelect={setSelectedImage}
                    selectedImage={selectedImage}
                  />
                )}
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              <Card className="p-4">
                <ImageEditor
                  imagePath={selectedImage}
                  onSave={() => {
                    toast({
                      title: "Success",
                      description: "Image saved successfully"
                    });
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