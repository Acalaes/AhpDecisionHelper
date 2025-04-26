import { cn } from "@/lib/utils";

interface StepNavigatorProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function StepNavigator({ currentStep, onStepChange }: StepNavigatorProps) {
  return (
    <div className="flex border-b border-neutral-medium mb-6 overflow-x-auto">
      <button
        className={cn(
          "py-2 px-4 border-b-2 font-medium whitespace-nowrap",
          currentStep === 1
            ? "border-primary text-primary"
            : "border-transparent text-neutral-gray hover:text-neutral-dark"
        )}
        onClick={() => onStepChange(1)}
      >
        1. Definir Problema
      </button>
      <button
        className={cn(
          "py-2 px-4 border-b-2 font-medium whitespace-nowrap",
          currentStep === 2
            ? "border-primary text-primary"
            : "border-transparent text-neutral-gray hover:text-neutral-dark"
        )}
        onClick={() => onStepChange(2)}
        disabled={currentStep < 2}
      >
        2. Comparar Critérios
      </button>
      <button
        className={cn(
          "py-2 px-4 border-b-2 font-medium whitespace-nowrap",
          currentStep === 3
            ? "border-primary text-primary"
            : "border-transparent text-neutral-gray hover:text-neutral-dark"
        )}
        onClick={() => onStepChange(3)}
        disabled={currentStep < 3}
      >
        3. Comparar Alternativas
      </button>
      <button
        className={cn(
          "py-2 px-4 border-b-2 font-medium whitespace-nowrap",
          currentStep === 4
            ? "border-primary text-primary"
            : "border-transparent text-neutral-gray hover:text-neutral-dark"
        )}
        onClick={() => onStepChange(4)}
        disabled={currentStep < 4}
      >
        4. Resultados
      </button>
    </div>
  );
}
