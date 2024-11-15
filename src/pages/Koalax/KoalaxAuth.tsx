import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import * as z from "zod";
import { adminQueries } from "@/lib/fauna/adminQueries";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

const KoalaxAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["common", "admin", "auth"]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const admin = await adminQueries.validateAdmin(data.email, data.password);
      
      if (admin) {
        const sessionData = {
          timestamp: Date.now(),
          type: 'koalax',
          isAuthenticated: true,
          email: admin.email
        };
        
        sessionStorage.setItem('koalax_auth', JSON.stringify(sessionData));
        
        const from = location.state?.from?.pathname || "/koalax/emails";
        navigate(from, { replace: true });
        
        toast({
          title: t("auth:loginSuccess"),
          description: t("auth:welcomeBack"),
        });
      } else {
        form.reset();
        toast({
          title: t("auth:loginFailed"),
          description: t("auth:invalidCredentials"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: t("auth:loginFailed"),
        description: t("auth:invalidCredentials"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
      <div className="w-full max-w-[400px] space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => navigate("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          {t("common:nav.home")}
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("admin:auth.title")}</CardTitle>
            <CardDescription>{t("admin:auth.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth:email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="admin@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth:password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? t("common:common.loading") : t("auth:signIn")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KoalaxAuth;