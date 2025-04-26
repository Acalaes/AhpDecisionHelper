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
        <h4 className="font-medium">Consistency Ratio (CR)</h4>
        {isAcceptable ? (
          <div className="text-success font-medium flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" />
            {formatNumber(consistencyRatio)} (Acceptable)
          </div>
        ) : (
          <div className="text-destructive font-medium flex items-center">
            <AlertCircle className="mr-1 h-4 w-4" />
            {formatNumber(consistencyRatio)} (Inconsistent)
          </div>
        )}
      </div>
      <p className="text-sm text-neutral-dark mt-2">
        CR &lt; 0.1 indicates consistent judgments. If CR &gt; 0.1, please review your comparisons.
      </p>
      
      {!isAcceptable && (
        <div className="mt-2 bg-destructive/10 p-3 rounded-md text-sm text-destructive">
          Your comparisons are inconsistent. Try to adjust your ratings to be more logically consistent.
          For example, if A is 3x more important than B, and B is 2x more important than C, then A should be about 6x more important than C.
        </div>
      )}
    </div>
  );
}
