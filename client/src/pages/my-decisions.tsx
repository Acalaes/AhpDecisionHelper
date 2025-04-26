import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AHPDecision } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Edit,
  Eye,
  Play,
  Loader2,
  PlusCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function MyDecisions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Buscar todas as decisões salvas
  const { data: decisions, isLoading } = useQuery({
    queryKey: ["/api/decisions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/decisions");
      // Verifica se a resposta tem o método json() e o usa para obter os dados
      if (res instanceof Response) {
        const data = await res.json();
        return data as AHPDecision[];
      }
      return res as AHPDecision[];
    },
  });

  // Mutação para excluir uma decisão
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/decisions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decisions"] });
      toast({
        title: "Decisão excluída",
        description: "A decisão foi excluída com sucesso",
      });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao excluir decisão: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Confirmar e excluir decisão
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  // Navegar para a página da ferramenta para editar uma decisão
  const editDecision = (decision: AHPDecision) => {
    // Armazenar a decisão no localStorage para carregá-la na ferramenta
    localStorage.setItem('editDecision', JSON.stringify(decision));
    navigate('/tool?edit=true');
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <section className="mb-12">
      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-dark">
              Minhas Decisões
            </h2>
            <Button onClick={() => navigate("/tool")} className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Decisão
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando decisões...</span>
            </div>
          ) : !decisions || decisions.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Nenhuma decisão encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não salvou nenhuma decisão. Use a ferramenta AHP para criar e salvar decisões.
              </p>
              <Button onClick={() => navigate("/tool")}>Criar Nova Decisão</Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Decisão</TableHead>
                    <TableHead>Critérios</TableHead>
                    <TableHead>Alternativas</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decisions.map((decision) => (
                    <TableRow key={decision.id}>
                      <TableCell className="font-medium">{decision.name}</TableCell>
                      <TableCell>{decision.criteria.length}</TableCell>
                      <TableCell>{decision.alternatives.length}</TableCell>
                      <TableCell>{formatDate(decision.createdAt.toString())}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Visualizar"
                            onClick={() => editDecision(decision)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Editar"
                            onClick={() => editDecision(decision)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Excluir"
                            onClick={() => confirmDelete(decision.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Diálogo de confirmação de exclusão */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir esta decisão? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            Powered By Alexandre Calaes
          </div>
        </CardContent>
      </Card>
    </section>
  );
}