import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import fallbackDb from "@/lib/fallback-db.json";
import * as z from "zod";

const formSchema = z.object({
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
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const koalaxPassword = fallbackDb.settings.find(s => s.key === "koalax_password")?.value;
    
    if (data.password === koalaxPassword) {
      const sessionData = {
        timestamp: Date.now(),
        type: 'koalax',
        isAuthenticated: true
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{t("admin:auth.title")}</CardTitle>
          <CardDescription>{t("admin:auth.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        autoFocus
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
  );
};

export default KoalaxAuth;