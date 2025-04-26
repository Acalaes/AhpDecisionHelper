import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ConsistencyCheckProps {
  consistencyRatio: number;
  isAcceptable: boolean;
}

export default function ConsistencyCheck({
  consistencyRatio,
  isAcceptable = consistencyRatio <= 0.1,
}: ConsistencyCheckProps) {
  return (
    <div className="flex items-center mt-1 text-sm">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={isAcceptable ? "outline" : "destructive"}
              className="cursor-help"
            >
              <div className="flex items-center">
                <span className="mr-1">Razão de Consistência:</span>
                {formatNumber(consistencyRatio, 3)}
                {isAcceptable ? (
                  <span className="ml-1 text-xs text-green-500">✓</span>
                ) : (
                  <span className="ml-1 text-xs">⚠</span>
                )}
              </div>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-[250px] text-xs">
              <p>
                A Razão de Consistência (RC) deve ser menor ou igual a 0.1 (10%) 
                para que os julgamentos sejam considerados consistentes.
              </p>
              <p className="mt-1">
                {isAcceptable
                  ? "Seus julgamentos são consistentes."
                  : "Seus julgamentos apresentam inconsistências. Considere revisar suas comparações."}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {!isAcceptable && (
        <div className="ml-2 flex items-center text-destructive">
          <Info className="h-4 w-4 mr-1" />
          <span className="text-xs">Revisar comparações</span>
        </div>
      )}
    </div>
  );
}