import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { insertFeedbackSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const feedbackFormSchema = insertFeedbackSchema.extend({
  testimonial: z.string().optional(),
  allowPublicDisplay: z.boolean().optional()
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  decisionId: number;
  decisionName: string;
  onComplete?: () => void;
}

export default function FeedbackForm({ decisionId, decisionName, onComplete }: FeedbackFormProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      decisionId,
      utilityRating: 5,
      testimonial: '',
      allowPublicDisplay: true
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const response = await apiRequest('POST', '/api/feedback', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
      setIsSubmitted(true);
      toast({
        title: "Feedback enviado com sucesso!",
        description: "Obrigado por compartilhar sua experiência.",
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar feedback",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: FeedbackFormData) => {
    await submitMutation.mutate(data);
  };

  // Se o usuário já tiver enviado o feedback, mostrar mensagem de agradecimento
  if (isSubmitted) {
    return (
      <div className="space-y-4 py-4 text-center">
        <h3 className="text-xl font-medium">Feedback Enviado!</h3>
        <p className="text-muted-foreground">
          Obrigado por compartilhar sua experiência. Sua opinião é muito importante 
          para continuar melhorando a ferramenta.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Avaliando: {decisionName}</h3>
          <p className="text-sm text-muted-foreground">
            Por favor, avalie sua experiência com a ferramenta AHP.
          </p>
        </div>

        <FormField
          control={form.control}
          name="utilityRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quão útil foi esta ferramenta? (1-10)</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-2">
                  <Input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 - Nada útil</span>
                    <span>{field.value}</span>
                    <span>10 - Extremamente útil</span>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="testimonial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Depoimento (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Compartilhe sua experiência com a ferramenta AHP..."
                  className="resize-none"
                  rows={4}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Seu feedback nos ajuda a melhorar a ferramenta.
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
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Permito que meu depoimento seja exibido publicamente
                </FormLabel>
                <FormDescription>
                  Seu nome não será exibido, apenas seu depoimento.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Feedback'
          )}
        </Button>
      </form>
    </Form>
  );
}