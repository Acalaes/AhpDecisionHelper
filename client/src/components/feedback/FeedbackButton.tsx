import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import FeedbackForm from "./FeedbackForm";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface FeedbackButtonProps {
  decisionId?: number;
  decisionName?: string;
}

export default function FeedbackButton({ decisionId, decisionName }: FeedbackButtonProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    // Se estiver tentando abrir o diálogo mas o usuário não está autenticado
    if (open && !user) {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar logado para enviar feedback.",
        variant: "destructive",
      });
      return;
    }
    
    // Se tudo estiver ok, atualiza o estado do modal
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Enviar Feedback
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Feedback da Ferramenta AHP</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência e ajude-nos a melhorar a ferramenta.
          </DialogDescription>
        </DialogHeader>
        
        {user && (
          <FeedbackForm 
            decisionId={decisionId} 
            decisionName={decisionId ? (decisionName || "Decisão Sem Nome") : "Feedback Geral"}
            onComplete={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}