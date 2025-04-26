import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, RefreshCw, ChevronDown, ChevronUp, Users, FileText, BarChart2, Calendar, Clock, Star, ThumbsUp, MessageSquare, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CategoryDistribution from "@/components/dashboard/CategoryDistribution";
import MetricsOverTime from "@/components/dashboard/MetricsOverTime";
import UsageStatistics from "@/components/dashboard/UsageStatistics";
import UserFeedbackTable from "@/components/dashboard/UserFeedbackTable";
import { Feedback } from "@shared/schema";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from "wouter";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  isLoading?: boolean;
}

function MetricCard({ title, value, description, icon, trend, trendValue, isLoading }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            {trend && trendValue && (
              <div className={`flex items-center text-xs mt-2 ${
                trend === "up" ? "text-green-500" : 
                trend === "down" ? "text-red-500" : 
                "text-gray-500"
              }`}>
                {trend === "up" ? <ChevronUp className="h-3 w-3 mr-1" /> : 
                 trend === "down" ? <ChevronDown className="h-3 w-3 mr-1" /> : null}
                {trendValue}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Verificar se o usuário é administrador
  const isAdmin = user?.isAdmin === true;
  
  useEffect(() => {
    // Redirecionar para página inicial se não for admin
    if (user && !isAdmin) {
      toast({
        title: "Acesso restrito",
        description: "Esta página é restrita a administradores.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [user, isAdmin, navigate, toast]);
  
  // Queries protegidas por admin
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/admin/metrics/categories'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin,
  });
  
  const { data: completionTime, isLoading: completionTimeLoading } = useQuery({
    queryKey: ['/api/admin/metrics/completion-time'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin,
  });
  
  const { data: ratings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['/api/admin/metrics/rating'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin,
  });
  
  const { data: usersOverTime, isLoading: usersOverTimeLoading } = useQuery({
    queryKey: ['/api/admin/metrics/users-over-time'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin,
  });
  
  const { data: decisionsOverTime, isLoading: decisionsOverTimeLoading } = useQuery({
    queryKey: ['/api/admin/metrics/decisions-over-time'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin,
  });
  
  const { data: stepEngagement, isLoading: stepEngagementLoading } = useQuery({
    queryKey: ['/api/admin/metrics/step-engagement'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin,
  });
  
  const { data: aggregateMetrics, isLoading: aggregateMetricsLoading } = useQuery({
    queryKey: ['/api/admin/metrics/aggregate'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin,
  });
  
  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery<Feedback[]>({
    queryKey: ['/api/feedback/public'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin,
  });

  const refreshMetrics = async () => {
    try {
      setIsRefreshing(true);
      await apiRequest('POST', '/api/admin/metrics/update', {});
      
      // Invalidate all metrics queries to refetch fresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/admin'] });
      
      toast({
        title: "Métricas atualizadas",
        description: "Os dados das métricas foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar métricas",
        description: "Ocorreu um erro ao tentar atualizar as métricas.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Valores derivados para os cards de métricas
  const totalUsers = usersOverTime && usersOverTime.length > 0 
    ? usersOverTime.reduce((acc, curr) => acc + curr.count, 0) 
    : 0;

  const formattedCompletionTime = completionTime?.averageCompletionTime 
    ? `${Math.floor(completionTime.averageCompletionTime / 60)} min` 
    : "N/A";

  const formattedRating = ratings?.averageRating 
    ? `${ratings.averageRating.toFixed(1)}/10` 
    : "N/A";

  // Encontrar as categorias mais populares
  let topCategories = "N/A";
  if (categories && categories.length > 0) {
    const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
    topCategories = sortedCategories.slice(0, 2).map(c => c.category).join(", ");
  }

  // Calcular estatísticas do passo mais demorado
  let mostTimeConsumingStep = "N/A";
  let averageDuration = "";
  if (stepEngagement && stepEngagement.length > 0) {
    const sorted = [...stepEngagement].sort((a, b) => b.averageDuration - a.averageDuration);
    const step = sorted[0];
    
    const mapStepNameToPt = {
      define_problem: "Definir problema",
      create_criteria: "Criar critérios",
      compare_criteria: "Comparar critérios",
      create_alternatives: "Criar alternativas",
      compare_alternatives: "Comparar alternativas",
      review_results: "Revisar resultados"
    };
    
    mostTimeConsumingStep = mapStepNameToPt[step.step as keyof typeof mapStepNameToPt] || step.step;
    averageDuration = `${Math.floor(step.averageDuration / 60)} min`;
  }

  // Estatísticas de decisões
  const totalDecisions = decisionsOverTime && decisionsOverTime.length > 0
    ? decisionsOverTime.reduce((acc, curr) => acc + curr.count, 0)
    : 0;

  // Gráfico de distribuição de categorias
  const categoryDistributionData = categories && categories.length > 0
    ? categories.map(cat => ({
        name: cat.category,
        value: cat.count
      }))
    : [];

  // Dados para gráficos de métricas ao longo do tempo
  const timeSeriesLabels = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return format(date, "MMM yyyy", { locale: ptBR });
  });

  // Encontrar dados para cada mês nos dados de usuários
  const usersData = timeSeriesLabels.map(label => {
    const dataPoint = usersOverTime?.find(cat => 
      format(new Date(cat.date), "MMM yyyy", { locale: ptBR }) === label
    );
    return dataPoint?.count || 0;
  });

  // Encontrar dados para cada mês nos dados de decisões
  const decisionsData = timeSeriesLabels.map(label => {
    const dataPoint = decisionsOverTime?.find(cat => 
      format(new Date(cat.date), "MMM yyyy", { locale: ptBR }) === label
    );
    return dataPoint?.count || 0;
  });

  // Feedback dos usuários
  const averageFeedbackRating = feedbacks && feedbacks.length > 0
    ? (feedbacks.reduce((sum, item) => sum + item.utilityRating, 0) / feedbacks.length).toFixed(1)
    : "0.0";
    
  const publicFeedbackCount = feedbacks?.length || 0;
  
  // Feedback com permissão de exibição pública
  const publicPermissionFeedbacks = feedbacks?.filter(f => f.allowPublicDisplay) || [];
  
  // Feedback com avaliações positivas (7 ou mais)
  const positiveFeedbacks = feedbacks?.filter(f => f.utilityRating >= 7).length || 0;
  const positivePercentage = feedbacks && feedbacks.length > 0
    ? Math.round((positiveFeedbacks / feedbacks.length) * 100)
    : 0;
    
  // Se o usuário não for administrador, mostre uma mensagem
  if (user && !isAdmin) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Esta página é restrita a administradores. Você será redirecionado para a página inicial em alguns instantes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Renderize o dashboard para administradores
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard de Impacto</h2>
          <p className="text-muted-foreground">
            Acompanhe métricas de impacto da ferramenta AHP.
          </p>
        </div>
        <Button 
          onClick={refreshMetrics} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isRefreshing ? "Atualizando..." : "Atualizar Métricas"}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="user-engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Total de Usuários"
              value={totalUsers}
              description="Usuários registrados na plataforma"
              icon={<Users className="h-4 w-4" />}
              isLoading={usersOverTimeLoading}
            />
            <MetricCard 
              title="Decisões Tomadas"
              value={totalDecisions}
              description="Decisões salvas pelos usuários"
              icon={<FileText className="h-4 w-4" />}
              isLoading={decisionsOverTimeLoading}
            />
            <MetricCard 
              title="Tempo Médio de Decisão"
              value={formattedCompletionTime}
              description="Média de tempo para completar o processo"
              icon={<Clock className="h-4 w-4" />}
              isLoading={completionTimeLoading}
            />
            <MetricCard 
              title="Avaliação Média"
              value={formattedRating}
              description="Pontuação média do feedback dos usuários"
              icon={<Star className="h-4 w-4" />}
              isLoading={ratingsLoading}
            />
          </div>
          
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>
                  Categorias mais populares: {topCategories}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                {categoriesLoading ? (
                  <div className="flex justify-center items-center h-80">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <CategoryDistribution data={categoryDistributionData} />
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Métricas ao Longo do Tempo</CardTitle>
                <CardDescription>
                  Crescimento de usuários e decisões
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                {usersOverTimeLoading || decisionsOverTimeLoading ? (
                  <div className="flex justify-center items-center h-80">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <MetricsOverTime 
                    labels={timeSeriesLabels}
                    usersData={usersData}
                    decisionsData={decisionsData}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="user-engagement" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
              title="Passo Mais Demorado"
              value={mostTimeConsumingStep}
              description={`Tempo médio: ${averageDuration}`}
              icon={<Clock className="h-4 w-4" />}
              isLoading={stepEngagementLoading}
            />
            <MetricCard 
              title="Categorias Favoritas"
              value={topCategories}
              description="Categorias mais utilizadas pelos usuários"
              icon={<BarChart2 className="h-4 w-4" />}
              isLoading={categoriesLoading}
            />
            <MetricCard 
              title="Decisões no Último Mês"
              value={decisionsData[decisionsData.length - 1] || 0}
              description={`De ${timeSeriesLabels[timeSeriesLabels.length - 1]}`}
              icon={<Calendar className="h-4 w-4" />}
              isLoading={decisionsOverTimeLoading}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Uso por Etapa</CardTitle>
              <CardDescription>
                Tempo médio e engajamento em cada etapa do processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stepEngagementLoading ? (
                <div className="flex justify-center items-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <UsageStatistics data={stepEngagement || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
              title="Avaliação Média"
              value={`${averageFeedbackRating}/10`}
              description="Satisfação média dos usuários"
              icon={<Star className="h-4 w-4" />}
              isLoading={feedbacksLoading}
            />
            <MetricCard 
              title="Total de Feedbacks"
              value={publicFeedbackCount}
              description="Número de feedbacks recebidos"
              icon={<MessageSquare className="h-4 w-4" />}
              isLoading={feedbacksLoading}
            />
            <MetricCard 
              title="Avaliações Positivas"
              value={`${positivePercentage}%`}
              description={`${positiveFeedbacks} de ${publicFeedbackCount} avaliações ≥ 7`}
              icon={<ThumbsUp className="h-4 w-4" />}
              isLoading={feedbacksLoading}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feedback dos Usuários</CardTitle>
              <CardDescription>
                Depoimentos dos usuários sobre sua experiência
              </CardDescription>
            </CardHeader>
            <CardContent>
              {feedbacksLoading ? (
                <div className="flex justify-center items-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : feedbacks && feedbacks.length > 0 ? (
                <UserFeedbackTable feedbacks={feedbacks} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum feedback disponível no momento.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}