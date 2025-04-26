import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Feedback } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicFeedbackList() {
  const { data: feedbacks, isLoading, error } = useQuery<Feedback[]>({
    queryKey: ['/api/feedback/public'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center mb-6">Depoimentos dos Usuários</h3>
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground">
        <p>Não foi possível carregar os depoimentos.</p>
      </div>
    );
  }

  // Se não houver feedbacks públicos, mostre uma mensagem
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
        <p>Nenhum depoimento disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center mb-6">Depoimentos dos Usuários</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  {feedback.utilityRating}/10
                </CardTitle>
                <CardDescription>
                  {feedback.decisionName || "Ferramenta AHP"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {feedback.testimonial ? (
                <p className="text-sm italic">"{feedback.testimonial}"</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Usuário não deixou um depoimento escrito</p>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {feedback.createdAt && format(new Date(feedback.createdAt), "PPP", { locale: ptBR })}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}