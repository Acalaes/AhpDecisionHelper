import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

interface FeedbackButtonProps {
  decisionId?: number;
  decisionName?: string;
}

export default function FeedbackButton({ decisionId, decisionName }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();

  // Se não tiver um ID de decisão, use um ID de teste
  const feedbackDecisionId = decisionId || 0;
  const feedbackDecisionName = decisionName || 'Feedback geral sobre a ferramenta';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-4 right-4 z-50 shadow-md bg-white hover:bg-primary hover:text-white"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Fornecer Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sua opinião é importante!</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência com a ferramenta AHP Decision Helper para ajudar a melhorá-la.
          </DialogDescription>
        </DialogHeader>
        
        {user ? (
          <FeedbackForm 
            decisionId={feedbackDecisionId} 
            decisionName={feedbackDecisionName}
            onComplete={() => setIsOpen(false)}
          />
        ) : (
          <div className="space-y-4 py-4">
            <p className="text-center text-muted-foreground">
              Você precisa estar logado para fornecer feedback.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => window.location.href = `/auth?redirect=${encodeURIComponent(location)}`}
              >
                Fazer Login
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}