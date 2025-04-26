import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type Feedback } from '@shared/schema';

interface UserFeedbackTableProps {
  feedbacks: Feedback[];
}

export default function UserFeedbackTable({ feedbacks }: UserFeedbackTableProps) {
  if (!feedbacks || !feedbacks.length) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">Nenhum feedback registrado</p>
      </div>
    );
  }

  // Função para renderizar as estrelas com base na classificação
  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
      />
    ));
  };

  // Função para obter as iniciais do nome de usuário
  const getUserInitials = (username: string) => {
    if (!username) return '?';
    // Extrair iniciais do nome de usuário ou email
    if (username.includes('@')) {
      // É um email, pegar a primeira letra da parte antes do @
      return username.split('@')[0][0].toUpperCase();
    }
    // É um nome, pegar a primeira letra
    return username[0].toUpperCase();
  };

  // Obter uma cor baseada no nome de usuário para o avatar
  const getAvatarColor = (username: string) => {
    const colors = [
      'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
      'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
      'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
      'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
      'bg-rose-500'
    ];
    
    // Gerar um índice baseado na string do username
    const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Usuário</TableHead>
            <TableHead className="w-[120px]">Avaliação</TableHead>
            <TableHead>Depoimento</TableHead>
            <TableHead className="w-[180px] text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className={`h-8 w-8 ${getAvatarColor(feedback.user?.username || '')}`}>
                    <AvatarFallback>{getUserInitials(feedback.user?.username || '')}</AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-[80px]">{feedback.user?.username.split('@')[0]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex">
                  {renderRatingStars(feedback.utilityRating)}
                </div>
              </TableCell>
              <TableCell>
                {feedback.testimonial ? (
                  <p className="line-clamp-2 text-sm">{feedback.testimonial}</p>
                ) : (
                  <Badge variant="outline" className="text-xs">Sem depoimento</Badge>
                )}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {format(new Date(feedback.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}