import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface FeedbackFormProps {
  decisionId?: number;
  decisionName: string;
  onComplete: () => void;
}

export default function FeedbackForm({ decisionId, decisionName, onComplete }: FeedbackFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(7);
  const [testimonial, setTestimonial] = useState<string>("");
  const [allowPublicDisplay, setAllowPublicDisplay] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validação para garantir valores dentro dos limites aceitos
      if (rating < 1 || rating > 10) {
        throw new Error("A avaliação deve estar entre 1 e 10");
      }
      
      // Estrutura de dados correta, seguindo exatamente o tipo InsertFeedback definido no schema
      const feedbackData = {
        utilityRating: rating,
        testimonial: testimonial.trim() || undefined,
        allowPublicDisplay: !!allowPublicDisplay,
        feedbackType: decisionId ? "decision" : "general",
        ...(decisionId ? { decisionId } : {})
      };
      
      console.log("Enviando feedback:", feedbackData);
      
      try {
        // Enviar requisição para o servidor
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbackData),
          credentials: "include"
        });
        
        // Verificar se o servidor retornou um erro
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Resposta de erro:", response.status, errorData);
          throw new Error(errorData.message || errorData.error || `Erro ${response.status} ao enviar feedback`);
        }
        
        const data = await response.json();
        console.log("Resposta do servidor:", data);
        
        // Invalidar consultas relevantes para atualizar os dados
        await queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/feedback/public'] });
        
        toast({
          title: "Feedback enviado",
          description: "Obrigado por compartilhar sua experiência conosco.",
        });
        
        // Fechar o modal
        onComplete();
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      
      // Mensagem de erro mais detalhada
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro desconhecido ao enviar feedback";
        
      toast({
        title: "Erro ao enviar feedback",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="decision">Decisão avaliada</Label>
        <Input 
          id="decision" 
          value={decisionName} 
          disabled 
          className="bg-muted"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rating" className="flex justify-between">
          <span>Avaliação (1-10)</span>
          <span className="font-bold">{rating}/10</span>
        </Label>
        <Slider
          id="rating"
          min={1}
          max={10}
          step={1}
          value={[rating]}
          onValueChange={(values) => setRating(values[0])}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Nada útil</span>
          <span>Extremamente útil</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="testimonial">Depoimento (opcional)</Label>
        <Textarea
          id="testimonial"
          placeholder="Compartilhe sua experiência e sugestões..."
          value={testimonial}
          onChange={(e) => setTestimonial(e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="publicDisplay"
          checked={allowPublicDisplay}
          onCheckedChange={(checked) => setAllowPublicDisplay(checked as boolean)}
        />
        <Label htmlFor="publicDisplay" className="text-sm">
          Permitir compartilhar este depoimento publicamente
        </Label>
      </div>
      
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Feedback
        </Button>
      </div>
    </form>
  );
}