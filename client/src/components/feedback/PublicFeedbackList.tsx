import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Feedback } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PublicFeedbackList() {
  const { data: feedbacks, isLoading } = useQuery<Feedback[]>({
    queryKey: ['/api/feedback/public'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando depoimentos...</p>
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0 || !feedbacks.some(f => f.allowPublicDisplay && f.testimonial)) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Depoimentos</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Nenhum depoimento público disponível ainda. Seja o primeiro a compartilhar sua experiência!
        </p>
      </div>
    );
  }

  // Filtrar apenas feedbacks públicos com depoimentos
  const publicFeedbacks = feedbacks
    .filter(f => f.allowPublicDisplay && f.testimonial)
    .sort((a, b) => b.utilityRating - a.utilityRating)
    .slice(0, 3); // Limitar a 3 depoimentos

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-center mb-6">O Que Dizem Nossos Usuários</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicFeedbacks.map((feedback) => (
          <Card key={feedback.id} className="bg-white">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center">
                <div className="flex text-yellow-500 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 mr-0.5" 
                      fill={i < Math.round(feedback.utilityRating / 2) ? "currentColor" : "none"} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">{feedback.utilityRating}/10</span>
              </div>
              
              <div className="relative">
                <Quote className="h-8 w-8 text-primary/20 absolute -top-1 -left-2" />
                <p className="text-neutral-gray relative pl-6 italic">
                  "{feedback.testimonial}"
                </p>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground flex justify-between items-center">
                <span>
                  {format(new Date(feedback.createdAt), "PPP", { locale: ptBR })}
                </span>
                <span className="font-medium">{feedback.decisionName || 'Decisão AHP'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}