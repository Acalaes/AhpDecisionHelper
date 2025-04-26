import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertFeedbackSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Estendendo o schema para validação no formulário
const feedbackFormSchema = insertFeedbackSchema.extend({
  decisionName: z.string(),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  decisionId: number;
  decisionName: string;
  onComplete?: () => void;
}

export default function FeedbackForm({ decisionId, decisionName, onComplete }: FeedbackFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      decisionId,
      decisionName,
      utilityRating: 0,
      testimonial: '',
      allowPublicDisplay: false,
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    if (rating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma avaliação de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Atualizar valor da avaliação no objeto de dados
      data.utilityRating = rating;
      
      // Remover campo não necessário na API
      const { decisionName, ...feedbackData } = data;

      await apiRequest('POST', '/api/feedback', feedbackData);
      
      toast({
        title: "Feedback enviado",
        description: "Obrigado por compartilhar sua experiência!",
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar feedback",
        description: "Ocorreu um erro ao processar seu feedback. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente de estrela para avaliação
  const RatingStar = ({ index }: { index: number }) => {
    const isFilled = (hoverRating || rating) >= index;

    return (
      <Star
        className={`h-8 w-8 cursor-pointer transition-colors ${
          isFilled ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
        }`}
        onMouseEnter={() => setHoverRating(index)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setRating(index)}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormLabel>Decisão avaliada</FormLabel>
          <div className="p-3 bg-secondary/50 rounded-md">
            <p className="font-medium">{decisionName}</p>
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>Como você avalia a utilidade desta ferramenta?</FormLabel>
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((index) => (
              <RatingStar key={index} index={index} />
            ))}
            <span className="ml-3 text-sm text-muted-foreground">
              {rating > 0 ? `${rating} de 5 estrelas` : 'Clique para avaliar'}
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="testimonial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compartilhe sua experiência (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte-nos como o AHP Decision Helper ajudou no seu processo de tomada de decisão..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Seu depoimento pode inspirar outros usuários a aplicarem esta metodologia.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allowPublicDisplay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Permitir exibição pública</FormLabel>
                <FormDescription>
                  Autorizo o uso do meu depoimento e avaliação no Dashboard de Impacto Social
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
        </Button>
      </form>
    </Form>
  );
}