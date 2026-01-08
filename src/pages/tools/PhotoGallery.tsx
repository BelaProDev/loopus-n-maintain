import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Image, Upload, Grid, LayoutGrid, ArrowLeft, Search,
  Download, Trash2, ZoomIn, Heart, Share2, Filter,
  SlidersHorizontal, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Photo {
  id: string;
  url: string;
  title: string;
  category: string;
  date: Date;
  liked: boolean;
}

// Demo photos using placeholder images
const demoPhotos: Photo[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", title: "Mountain Vista", category: "nature", date: new Date(), liked: true },
  { id: "2", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800", title: "Forest Path", category: "nature", date: new Date(), liked: false },
  { id: "3", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800", title: "Snowy Peaks", category: "nature", date: new Date(), liked: true },
  { id: "4", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800", title: "City Skyline", category: "urban", date: new Date(), liked: false },
  { id: "5", url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", title: "Street View", category: "urban", date: new Date(), liked: false },
  { id: "6", url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800", title: "Ocean Waves", category: "nature", date: new Date(), liked: true },
  { id: "7", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", title: "Portrait", category: "people", date: new Date(), liked: false },
  { id: "8", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800", title: "Smile", category: "people", date: new Date(), liked: true },
  { id: "9", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", title: "Delicious Food", category: "food", date: new Date(), liked: false },
  { id: "10", url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", title: "Fresh Salad", category: "food", date: new Date(), liked: false },
  { id: "11", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800", title: "Travel Scene", category: "travel", date: new Date(), liked: true },
  { id: "12", url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800", title: "Adventure", category: "travel", date: new Date(), liked: false },
];

const PhotoGallery = () => {
  const { t } = useTranslation(["tools"]);
  const [photos, setPhotos] = useState<Photo[]>(demoPhotos);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["all", "nature", "urban", "people", "food", "travel"];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || photo.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const newPhoto: Photo = {
        id: Date.now().toString() + Math.random(),
        url,
        title: file.name.replace(/\.[^/.]+$/, ""),
        category: "other",
        date: new Date(),
        liked: false,
      };
      setPhotos(prev => [newPhoto, ...prev]);
    });

    toast.success(`${files.length} photo(s) uploaded`);
  };

  const toggleLike = (id: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, liked: !photo.liked } : photo
    ));
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    toast.success("Photo deleted");
  };

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = filteredPhotos.length - 1;
    if (newIndex >= filteredPhotos.length) newIndex = 0;
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const getImageStyle = () => ({
    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/tools">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Image className="h-8 w-8 text-primary" />
                Photo Gallery
              </h1>
              <p className="text-muted-foreground">Organize and edit your photos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{photos.length}</p>
              <p className="text-sm text-muted-foreground">Total Photos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-pink-500">{photos.filter(p => p.liked).length}</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500">{categories.length - 1}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-500">
                {(photos.reduce((acc, p) => acc + (p.url.length / 1000), 0) / 1000).toFixed(1)} MB
              </p>
              <p className="text-sm text-muted-foreground">Storage Used</p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex gap-2 flex-1 w-full md:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search photos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "masonry" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("masonry")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery */}
        <div className={`grid gap-4 ${
          viewMode === "grid" 
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
            : "columns-2 md:columns-3 lg:columns-4 space-y-4"
        }`}>
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.03 }}
                className={viewMode === "masonry" ? "break-inside-avoid" : ""}
              >
                <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden" onClick={() => openLightbox(photo)}>
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white font-medium truncate">{photo.title}</p>
                      <Badge variant="secondary" className="mt-1 capitalize text-xs">
                        {photo.category}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }}
                      >
                        <Heart className={`h-4 w-4 ${photo.liked ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); deletePhoto(photo.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPhotos.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No photos found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterCategory !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Upload some photos to get started"
                }
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lightbox */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
            {selectedPhoto && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                  onClick={() => setLightboxOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={() => navigateLightbox("prev")}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={() => navigateLightbox("next")}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>

                <div className="flex">
                  <div className="flex-1">
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.title}
                      className="w-full max-h-[80vh] object-contain"
                      style={editMode ? getImageStyle() : {}}
                    />
                  </div>

                  {editMode && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="bg-background p-4 space-y-6"
                    >
                      <h3 className="font-semibold flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Adjustments
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Brightness</span>
                            <span>{brightness[0]}%</span>
                          </div>
                          <Slider value={brightness} onValueChange={setBrightness} min={0} max={200} />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Contrast</span>
                            <span>{contrast[0]}%</span>
                          </div>
                          <Slider value={contrast} onValueChange={setContrast} min={0} max={200} />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Saturation</span>
                            <span>{saturation[0]}%</span>
                          </div>
                          <Slider value={saturation} onValueChange={setSaturation} min={0} max={200} />
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setBrightness([100]);
                          setContrast([100]);
                          setSaturation([100]);
                        }}
                        variant="outline"
                      >
                        Reset
                      </Button>
                    </motion.div>
                  )}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => toggleLike(selectedPhoto.id)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${selectedPhoto.liked ? 'fill-red-500 text-red-500' : ''}`} />
                    {selectedPhoto.liked ? 'Liked' : 'Like'}
                  </Button>
                  <Button variant="secondary" onClick={() => setEditMode(!editMode)}>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="secondary">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="secondary">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default PhotoGallery;