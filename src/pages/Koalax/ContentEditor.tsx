import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { faunaQueries } from "@/lib/fauna";
import ContentList from "./components/ContentList";

const ContentEditor = () => {
  const [storageType, setStorageType] = useState<"fauna" | "fallback">("fauna");
  const [key, setKey] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("en");
  const [type, setType] = useState<"text" | "textarea" | "wysiwyg">("text");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (storageType === "fauna") {
        await faunaQueries.updateContent({
          key,
          type,
          content,
          language,
          lastModified: Date.now(),
          modifiedBy: "admin"
        });
      } else {
        // Update fallback JSON
        // Implementation pending
      }
      
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Content Editor</h2>
        <Select value={storageType} onValueChange={(value: "fauna" | "fallback") => setStorageType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select storage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fauna">Fauna DB</SelectItem>
            <SelectItem value="fallback">Fallback JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Content Key</label>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g., home_hero_title"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select value={type} onValueChange={(value: "text" | "textarea" | "wysiwyg") => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="wysiwyg">WYSIWYG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            {type === "textarea" || type === "wysiwyg" ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                required
                rows={10}
                className="min-h-[200px]"
              />
            ) : (
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                required
              />
            )}
          </div>

          <Button type="submit">Save Content</Button>
        </form>

        <ContentList storageType={storageType} />
      </div>
    </div>
  );
};

export default ContentEditor;