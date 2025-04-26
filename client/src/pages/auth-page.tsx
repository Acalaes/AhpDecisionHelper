import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertUserSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

// Formulário de login
const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Formulário de registro 
const registerSchema = insertUserSchema.extend({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Redirecionar se o usuário já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Formulário de login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Formulário de registro
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handler de login
  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Handler de registro
  const onRegister = (data: RegisterFormData) => {
    // Remover confirmPassword pois não é esperado na API
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center min-h-[80vh]">
      <div className="flex flex-col justify-center p-4">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>

          {/* Formulário de Login */}
          <TabsContent value="login" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Faça login para acessar suas decisões AHP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome de Usuário</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu nome de usuário" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Digite sua senha" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                      {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Entrar
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <div className="text-center w-full">
                  <p className="text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("register");
                      }} 
                      className="text-primary hover:underline"
                    >
                      Registre-se
                    </a>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Formulário de Registro */}
          <TabsContent value="register" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar</CardTitle>
                <CardDescription>
                  Crie uma conta para começar a usar o AHP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome de Usuário</FormLabel>
                          <FormControl>
                            <Input placeholder="Escolha um nome de usuário" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Crie uma senha" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirme sua senha" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                      {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Registrar
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <div className="text-center w-full">
                  <p className="text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("login");
                      }} 
                      className="text-primary hover:underline"
                    >
                      Faça login
                    </a>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-slate-100 p-8 rounded-lg hidden md:block">
        <h2 className="text-2xl font-bold mb-4">Processo de Análise Hierárquica</h2>
        <p className="mb-4">
          O AHP (Processo de Análise Hierárquica) é uma poderosa ferramenta para tomada de decisões complexas.
        </p>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium">Defina o problema</h3>
            <p className="text-sm text-neutral-gray">Estabeleça critérios e alternativas para sua decisão</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium">Compare critérios</h3>
            <p className="text-sm text-neutral-gray">Pondere a importância relativa de cada critério</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium">Compare alternativas</h3>
            <p className="text-sm text-neutral-gray">Avalie cada alternativa em relação aos critérios</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium">Veja os resultados</h3>
            <p className="text-sm text-neutral-gray">Obtenha uma análise baseada em matemática</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8 col-span-1 md:col-span-2 text-sm text-gray-500">
        Powered By Alexandre Calaes
      </div>
    </div>
  );
}