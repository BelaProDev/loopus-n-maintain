import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockContentData } from "@/lib/mockData";

const languages = ['en', 'fr', 'es', 'de', 'it'];

interface Translation {
  [key: string]: string;
}

interface ContentItem {
  ref: {
    id: string;
  };
  data: {
    key: string;
    type: 'text' | 'textarea';
    translations: Translation;
  };
}

const Koalax = () => {
  const { toast } = useToast();

  const { data: content } = useQuery<ContentItem[]>({
    queryKey: ['content'],
    queryFn: () => Promise.resolve(mockContentData)
  });

  const updateMutation = useMutation({
    mutationFn: async (variables: { ref: any; data: ContentItem['data'] }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return variables;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto p-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Koalax - Content Management</h1>
        
        <div className="grid gap-8">
          {content?.map((item) => (
            <div key={item.ref.id} className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">{item.data.key}</h2>
              
              <div className="grid gap-4">
                {languages.map(lang => (
                  <div key={lang} className="space-y-2">
                    <label className="block font-medium">
                      {lang.toUpperCase()}
                    </label>
                    {item.data.type === 'text' ? (
                      <Input
                        defaultValue={item.data.translations[lang]}
                        onChange={(e) => {
                          const newTranslations = {
                            ...item.data.translations,
                            [lang]: e.target.value
                          };
                          updateMutation.mutate({
                            ref: item.ref,
                            data: {
                              ...item.data,
                              translations: newTranslations
                            }
                          });
                        }}
                      />
                    ) : (
                      <Textarea
                        defaultValue={item.data.translations[lang]}
                        onChange={(e) => {
                          const newTranslations = {
                            ...item.data.translations,
                            [lang]: e.target.value
                          };
                          updateMutation.mutate({
                            ref: item.ref,
                            data: {
                              ...item.data,
                              translations: newTranslations
                            }
                          });
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Koalax;