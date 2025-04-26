import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, BarChart2, LineChart, PieChart, Users, Clock, Star, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Redirect } from 'wouter';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DECISION_CATEGORIES } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategoryDistribution from '@/components/dashboard/CategoryDistribution';
import UserFeedbackTable from '@/components/dashboard/UserFeedbackTable';
import MetricsOverTime from '@/components/dashboard/MetricsOverTime';
import UsageStatistics from '@/components/dashboard/UsageStatistics';

function formatNumber(num: number, precision = 2): string {
  return Number(num.toFixed(precision)).toLocaleString('pt-BR');
}

export default function Dashboard() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Verificar se o usuário é administrador
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    toast({
      title: "Acesso restrito",
      description: "Esta página é restrita a administradores.",
      variant: "destructive",
    });
    return <Redirect to="/" />;
  }

  // Calcular datas com base no intervalo selecionado
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    
    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();

  // Buscar estatísticas de categorias
  const { 
    data: categoriesData, 
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ['/api/admin/metrics/categories', refreshTrigger],
    refetchOnWindowFocus: false,
  });

  // Buscar tempo médio de conclusão
  const { 
    data: completionTimeData, 
    isLoading: isLoadingCompletionTime 
  } = useQuery({
    queryKey: ['/api/admin/metrics/completion-time', refreshTrigger],
    refetchOnWindowFocus: false,
  });

  // Buscar avaliação média
  const { 
    data: ratingData, 
    isLoading: isLoadingRating 
  } = useQuery({
    queryKey: ['/api/admin/metrics/rating', refreshTrigger],
    refetchOnWindowFocus: false,
  });

  // Buscar usuários ao longo do tempo
  const { 
    data: usersOverTimeData, 
    isLoading: isLoadingUsersOverTime 
  } = useQuery({
    queryKey: ['/api/admin/metrics/users-over-time', startDate.toISOString(), endDate.toISOString(), refreshTrigger],
    refetchOnWindowFocus: false,
  });

  // Buscar decisões ao longo do tempo
  const { 
    data: decisionsOverTimeData, 
    isLoading: isLoadingDecisionsOverTime 
  } = useQuery({
    queryKey: ['/api/admin/metrics/decisions-over-time', startDate.toISOString(), endDate.toISOString(), refreshTrigger],
    refetchOnWindowFocus: false,
  });

  // Buscar estatísticas de engajamento por etapa
  const { 
    data: stepEngagementData, 
    isLoading: isLoadingStepEngagement 
  } = useQuery({
    queryKey: ['/api/admin/metrics/step-engagement', refreshTrigger],
    refetchOnWindowFocus: false,
  });

  // Buscar feedbacks públicos
  const { 
    data: publicFeedbacksData, 
    isLoading: isLoadingPublicFeedbacks 
  } = useQuery({
    queryKey: ['/api/feedback/public', refreshTrigger],
    refetchOnWindowFocus: false,
  });

  // Função para atualizar métricas agregadas
  const handleUpdateMetrics = async () => {
    try {
      await fetch('/api/admin/metrics/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      toast({
        title: "Métricas atualizadas",
        description: "As métricas foram atualizadas com sucesso.",
      });
      
      // Forçar recarregamento dos dados
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast({
        title: "Erro ao atualizar métricas",
        description: "Ocorreu um erro ao atualizar as métricas. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const isLoading = 
    isLoadingCategories || 
    isLoadingCompletionTime || 
    isLoadingRating || 
    isLoadingUsersOverTime || 
    isLoadingDecisionsOverTime || 
    isLoadingStepEngagement || 
    isLoadingPublicFeedbacks;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard de Impacto Social</h1>
          <p className="text-muted-foreground">
            Visualize métricas de impacto e utilização da ferramenta AHP Decision Helper
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleUpdateMetrics} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar Métricas"
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          <TabsTrigger value="feedback">Avaliações</TabsTrigger>
        </TabsList>
        
        {/* Tab de Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card de Usuários */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      usersOverTimeData?.length || 0
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Decisões */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Decisões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart2 className="h-6 w-6 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      decisionsOverTimeData?.reduce((acc, curr) => acc + curr.count, 0) || 0
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Tempo Médio */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tempo Médio de Conclusão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-yellow-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      completionTimeData ? 
                        `${formatNumber(completionTimeData.averageCompletionTime / 60, 1)} min` : 
                        'N/A'
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Avaliação Média */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avaliação Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Star className="h-6 w-6 text-amber-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      ratingData ? 
                        `${formatNumber(ratingData.averageRating, 1)}/5` : 
                        'N/A'
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de distribuição por categoria */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>
                  Distribuição de decisões por categoria de aplicação
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <CategoryDistribution data={categoriesData || []} />
                )}
              </CardContent>
            </Card>

            {/* Gráfico de estatísticas de utilização */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Estatísticas de Utilização</CardTitle>
                <CardDescription>
                  Tempo médio por etapa do processo AHP
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <UsageStatistics data={stepEngagementData || []} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab de Categorias */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Decisões por Categoria</CardTitle>
              <CardDescription>
                Análise detalhada das categorias de aplicação da metodologia AHP
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <CategoryDistribution data={categoriesData || []} showLegend={true} />
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Dados coletados no período de {format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(DECISION_CATEGORIES).map(([key, value]) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      categoriesData?.find(cat => cat.category === key)?.count || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    decisões registradas
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Tab de Linha do Tempo */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Gráfico de usuários ao longo do tempo */}
            <Card>
              <CardHeader>
                <CardTitle>Usuários ao Longo do Tempo</CardTitle>
                <CardDescription>
                  Evolução do número de novos usuários registrados
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <MetricsOverTime 
                    data={usersOverTimeData || []} 
                    dateRange={dateRange}
                    title="Novos usuários"
                    color="#3b82f6"
                  />
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Dados coletados no período de {format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </CardFooter>
            </Card>
            
            {/* Gráfico de decisões ao longo do tempo */}
            <Card>
              <CardHeader>
                <CardTitle>Decisões ao Longo do Tempo</CardTitle>
                <CardDescription>
                  Evolução do número de novas decisões registradas
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <MetricsOverTime 
                    data={decisionsOverTimeData || []} 
                    dateRange={dateRange}
                    title="Novas decisões"
                    color="#22c55e"
                  />
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Dados coletados no período de {format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab de Avaliações */}
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações dos Usuários</CardTitle>
              <CardDescription>
                Feedbacks e depoimentos sobre a utilidade da ferramenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : publicFeedbacksData && publicFeedbacksData.length > 0 ? (
                <UserFeedbackTable feedbacks={publicFeedbacksData} />
              ) : (
                <Alert>
                  <AlertTitle>Nenhum feedback disponível</AlertTitle>
                  <AlertDescription>
                    Ainda não há feedbacks públicos registrados pelos usuários.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Impacto Estatístico</CardTitle>
              <CardDescription>
                Análise estatística do impacto da ferramenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Avaliação média de utilidade
                  </p>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-xl font-bold">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        ratingData ? 
                          `${formatNumber(ratingData.averageRating, 1)}/5` : 
                          'N/A'
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de feedbacks
                  </p>
                  <div className="text-xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      publicFeedbacksData?.length || 0
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Depoimentos públicos
                  </p>
                  <div className="text-xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      publicFeedbacksData?.filter(f => f.testimonial).length || 0
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Decisões completadas
                  </p>
                  <div className="text-xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      decisionsOverTimeData?.reduce((acc, curr) => acc + curr.count, 0) || 0
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}