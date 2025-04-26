import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MatrixViewProps {
  matrix: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  title?: string;
  precision?: number;
  priorities?: number[];
  consistencyRatio?: number;
  showConsistency?: boolean;
  highlightDiagonal?: boolean;
}

export default function MatrixView({
  matrix,
  rowLabels,
  colLabels,
  title,
  precision = 2,
  priorities,
  consistencyRatio,
  showConsistency = true,
  highlightDiagonal = true,
}: MatrixViewProps) {
  // Se não tiver labels, usa índices começando em 1
  const rows = rowLabels || matrix.map((_, i) => `Item ${i + 1}`);
  const cols = colLabels || matrix[0].map((_, i) => `Item ${i + 1}`);

  return (
    <div className="border rounded-lg overflow-hidden my-4">
      {title && (
        <div className="bg-muted px-4 py-2 border-b">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">
        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] border-r bg-muted/50">
                  {/* Célula vazia no canto superior esquerdo */}
                </TableHead>
                {cols.map((col, i) => (
                  <TableHead key={i} className="text-center min-w-[80px]">
                    {col}
                  </TableHead>
                ))}
                {priorities && (
                  <TableHead className="text-center bg-primary/10 border-l">
                    <div className="flex items-center justify-center">
                      Prioridades
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[250px] text-xs">
                              Estes são os vetores de prioridade calculados a partir da matriz. 
                              Representam a importância relativa de cada item.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium border-r bg-muted/50">
                    {rows[i]}
                  </TableCell>
                  {row.map((value, j) => (
                    <TableCell
                      key={j}
                      className={
                        highlightDiagonal && i === j
                          ? "text-center bg-muted/30"
                          : "text-center"
                      }
                    >
                      {formatNumber(value, precision)}
                    </TableCell>
                  ))}
                  {priorities && (
                    <TableCell className="text-center font-medium bg-primary/10 border-l">
                      {formatNumber(priorities[i], 4)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {showConsistency && consistencyRatio !== undefined && (
          <div className="mt-2 text-right">
            <Badge
              variant={consistencyRatio <= 0.1 ? "outline" : "destructive"}
              className="ml-auto"
            >
              <span className="mr-1">RC:</span>
              {formatNumber(consistencyRatio, 3)}
              {consistencyRatio <= 0.1 ? (
                <span className="ml-1 text-xs text-green-500">(Consistente)</span>
              ) : (
                <span className="ml-1 text-xs">(Inconsistente)</span>
              )}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}