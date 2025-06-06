import { Check } from "lucide-react";

interface ProcessStepsProps {
  currentStep: number;
}

export default function ProcessSteps({ currentStep }: ProcessStepsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div 
        className={`rounded-lg p-4 flex-1 text-center ${
          currentStep >= 1 
            ? "bg-primary text-white" 
            : "bg-primary-light bg-opacity-10"
        }`}
      >
        <div className="flex justify-center items-center mb-2 h-8 w-8 mx-auto rounded-full bg-white bg-opacity-20">
          {currentStep > 1 ? (
            <Check className="h-5 w-5 text-white" />
          ) : (
            <span className="text-primary-dark font-medium">1</span>
          )}
        </div>
        <h3 className="font-medium mb-1">Definir Problema</h3>
        <p className="text-sm text-neutral-dark">Identificar critérios e alternativas</p>
      </div>

      <div 
        className={`rounded-lg p-4 flex-1 text-center ${
          currentStep >= 2 
            ? "bg-primary text-white" 
            : "bg-primary-light bg-opacity-10"
        }`}
      >
        <div className="flex justify-center items-center mb-2 h-8 w-8 mx-auto rounded-full bg-white bg-opacity-20">
          {currentStep > 2 ? (
            <Check className="h-5 w-5 text-white" />
          ) : (
            <span className="text-primary-dark font-medium">2</span>
          )}
        </div>
        <h3 className="font-medium mb-1">Comparar Critérios</h3>
        <p className="text-sm text-neutral-dark">Comparar critérios par a par</p>
      </div>

      <div 
        className={`rounded-lg p-4 flex-1 text-center ${
          currentStep >= 3 
            ? "bg-primary text-white" 
            : "bg-primary-light bg-opacity-10"
        }`}
      >
        <div className="flex justify-center items-center mb-2 h-8 w-8 mx-auto rounded-full bg-white bg-opacity-20">
          {currentStep > 3 ? (
            <Check className="h-5 w-5 text-white" />
          ) : (
            <span className="text-primary-dark font-medium">3</span>
          )}
        </div>
        <h3 className="font-medium mb-1">Comparar Alternativas</h3>
        <p className="text-sm text-neutral-dark">Comparar alternativas por critérios</p>
      </div>

      <div 
        className={`rounded-lg p-4 flex-1 text-center ${
          currentStep >= 4 
            ? "bg-primary text-white" 
            : "bg-primary-light bg-opacity-10"
        }`}
      >
        <div className="flex justify-center items-center mb-2 h-8 w-8 mx-auto rounded-full bg-white bg-opacity-20">
          <span className="text-primary-dark font-medium">4</span>
        </div>
        <h3 className="font-medium mb-1">Tomar Decisão</h3>
        <p className="text-sm text-neutral-dark">Analisar resultados e decidir</p>
      </div>
    </div>
  );
}
