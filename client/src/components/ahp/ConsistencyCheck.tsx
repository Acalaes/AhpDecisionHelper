import { CheckCircle, AlertCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface ConsistencyCheckProps {
  consistencyRatio: number;
  isAcceptable: boolean;
}

export default function ConsistencyCheck({
  consistencyRatio,
  isAcceptable,
}: ConsistencyCheckProps) {
  return (
    <div className="mt-8 bg-primary bg-opacity-5 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Razão de Consistência (RC)</h4>
        {isAcceptable ? (
          <div className="text-success font-medium flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" />
            {formatNumber(consistencyRatio)} (Aceitável)
          </div>
        ) : (
          <div className="text-destructive font-medium flex items-center">
            <AlertCircle className="mr-1 h-4 w-4" />
            {formatNumber(consistencyRatio)} (Inconsistente)
          </div>
        )}
      </div>
      <p className="text-sm text-neutral-dark mt-2">
        RC &lt; 0,1 indica julgamentos consistentes. Se RC &gt; 0,1, revise suas comparações.
      </p>
      
      {!isAcceptable && (
        <div className="mt-2 bg-destructive/10 p-3 rounded-md text-sm text-destructive">
          Suas comparações são inconsistentes. Tente ajustar suas avaliações para que sejam mais logicamente consistentes.
          Por exemplo, se A é 3x mais importante que B, e B é 2x mais importante que C, então A deveria ser aproximadamente 6x mais importante que C.
        </div>
      )}
    </div>
  );
}
