import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client, q } from "@/lib/fauna";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

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

interface FaunaResponse {
  data: ContentItem[];
}

const Koalax = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const { data: content, isLoading } = useQuery<ContentItem[]>({
    queryKey: ['content'],
    queryFn: async () => {
      const result = await client.query<FaunaResponse>(
        q.Map(
          q.Paginate(q.Documents(q.Collection('structure_tool-ofthe-year'))),
          q.Lambda('ref', q.Get(q.Var('ref')))
        )
      );
      return result.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (variables: { ref: any; data: ContentItem['data'] }) => {
      return await client.query(
        q.Update(variables.ref, { data: variables.data })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
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

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Back Office - Content Management</h1>
        
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
    </div>
  );
};

export default Koalax;