import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { faunaQueries } from "@/lib/fauna";

const ContentEditor = () => {
  const [key, setKey] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("en");
  const [type, setType] = useState<"text" | "textarea" | "wysiwyg">("text");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await faunaQueries.updateContent({
        key,
        type,
        content,
        language,
        lastModified: Date.now(),
        modifiedBy: "admin" // TODO: Get from auth context
      });
      
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
      
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "text" | "textarea" | "wysiwyg")}
          className="w-full border rounded p-2"
        >
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
          <option value="wysiwyg">WYSIWYG</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        {type === "wysiwyg" ? (
          <div className="border rounded p-2">
            {/* TODO: Implement WYSIWYG editor */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content"
              required
              rows={10}
            />
          </div>
        ) : type === "textarea" ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content"
            required
            rows={5}
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
  );
};

export default ContentEditor;