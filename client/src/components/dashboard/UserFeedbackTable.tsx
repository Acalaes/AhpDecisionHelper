import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MoreVertical, Star } from "lucide-react";
import { Feedback } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserFeedbackTableProps {
  feedbacks: Feedback[];
}

export default function UserFeedbackTable({ feedbacks }: UserFeedbackTableProps) {
  // Se não houver feedbacks, exibir mensagem
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum feedback disponível</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Nota</TableHead>
            <TableHead className="min-w-[150px]">Data</TableHead>
            <TableHead className="min-w-[150px]">Depoimento</TableHead>
            <TableHead className="w-[100px]">Público</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{feedback.utilityRating}/10</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {format(new Date(feedback.createdAt), "PPP", { locale: ptBR })}
              </TableCell>
              <TableCell>
                {feedback.testimonial ? (
                  <span className="line-clamp-2 text-sm">
                    "{feedback.testimonial}"
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">Sem depoimento</span>
                )}
              </TableCell>
              <TableCell>
                {feedback.allowPublicDisplay ? (
                  <Badge variant="default" className="flex items-center bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Sim
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center">
                    <XCircle className="h-3 w-3 mr-1" />
                    Não
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Aprovar para exibição</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}