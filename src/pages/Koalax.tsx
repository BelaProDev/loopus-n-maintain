import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockContentData } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock registered users data
const mockUsers = [
  { id: 1, email: "user1@example.com", registeredAt: "2024-02-20" },
  { id: 2, email: "user2@example.com", registeredAt: "2024-02-21" },
  { id: 3, email: "user3@example.com", registeredAt: "2024-02-22" },
];

const Koalax = () => {
  const { toast } = useToast();

  const { data: content } = useQuery<ContentItem[]>({
    queryKey: ['content'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockContentData as ContentItem[];
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUsers;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (variables: { ref: ContentItem['ref']; data: ContentItem['data'] }) => {
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
        <h1 className="text-3xl font-bold mb-8">Koalax - Admin Dashboard</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.registeredAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-8">
          <h2 className="text-2xl font-semibold">Website Content</h2>
          {content?.map((item) => (
            <div key={item.ref.id} className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">{item.data.key}</h2>
              
              <div className="grid gap-4">
                {Object.entries(item.data.translations).map(([lang, text]) => (
                  <div key={lang} className="space-y-2">
                    <label className="block font-medium">
                      {lang.toUpperCase()}
                    </label>
                    {item.data.type === 'text' ? (
                      <Input
                        defaultValue={text}
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
                        defaultValue={text}
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