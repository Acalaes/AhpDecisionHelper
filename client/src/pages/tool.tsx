import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AHPDecision, Criterion, Alternative } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import ProcessSteps from "@/components/ahp/ProcessSteps";
import StepNavigator from "@/components/ahp/StepNavigator";
import DefineStep from "@/components/ahp/DefineStep";
import CriteriaStep from "@/components/ahp/CriteriaStep";
import AlternativesStep from "@/components/ahp/AlternativesStep";
import ResultsStep from "@/components/ahp/ResultsStep";
import { createEmptyDecision, updateCriteriaComparisons, updateAlternativeComparisons } from "@/lib/ahp";

export default function Tool() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, params] = useLocation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [decision, setDecision] = useState<AHPDecision>(createEmptyDecision());
  const [isEditMode, setIsEditMode] = useState(false);

  // Carregar decisão do localStorage se estiver no modo de edição
  useEffect(() => {
    // Verificar se temos uma decisão para editar (via query param ou localStorage)
    const searchParams = new URLSearchParams(window.location.search);
    const isEdit = searchParams.get('edit') === 'true';
    
    if (isEdit) {
      try {
        const savedDecision = localStorage.getItem('editDecision');
        if (savedDecision) {
          const parsedDecision = JSON.parse(savedDecision) as AHPDecision;
          setDecision(parsedDecision);
          setIsEditMode(true);
          // Ir para a etapa de resultados se a decisão estiver completa
          setCurrentStep(4);
          
          toast({
            title: "Decisão carregada",
            description: "A decisão foi carregada com sucesso para edição"
          });
          
          // Limpar o localStorage após carregar
          localStorage.removeItem('editDecision');
        }
      } catch (error) {
        console.error("Erro ao carregar decisão:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a decisão para edição",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Mutation for creating a new decision
  const createDecisionMutation = useMutation({
    mutationFn: (newDecision: AHPDecision) => {
      return apiRequest("POST", "/api/decisions", newDecision);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decisions"] });
      toast({
        title: "Decisão salva",
        description: "Sua decisão foi salva com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao salvar decisão: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for updating an existing decision
  const updateDecisionMutation = useMutation({
    mutationFn: (decisionToUpdate: AHPDecision) => {
      return apiRequest("PUT", `/api/decisions/${decisionToUpdate.id}`, decisionToUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decisions"] });
      toast({
        title: "Decisão atualizada",
        description: "Sua decisão foi atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao atualizar decisão: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle step changes
  const handleStepChange = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Handle problem name changes
  const handleProblemNameChange = (name: string) => {
    setDecision({ ...decision, name });
  };

  // Handle criteria changes
  const handleCriteriaChange = (criteria: Criterion[]) => {
    // Get the IDs of the old and new criteria
    const oldCriteriaIds = decision.criteria.map((c) => c.id);
    const newCriteriaIds = criteria.map((c) => c.id);

    // Update criteria comparisons
    const updatedCriteriaComparisons = updateCriteriaComparisons(
      decision.criteriaComparisons,
      oldCriteriaIds,
      newCriteriaIds
    );

    // Update alternative comparisons
    const updatedAlternativeComparisons = updateAlternativeComparisons(
      decision.alternativeComparisons,
      newCriteriaIds,
      decision.alternatives.map((a) => a.id),
      decision.alternatives.map((a) => a.id)
    );

    setDecision({
      ...decision,
      criteria,
      criteriaComparisons: updatedCriteriaComparisons,
      alternativeComparisons: updatedAlternativeComparisons,
    });
  };

  // Handle alternatives changes
  const handleAlternativesChange = (alternatives: Alternative[]) => {
    // Get the IDs of the old and new alternatives
    const oldAlternativeIds = decision.alternatives.map((a) => a.id);
    const newAlternativeIds = alternatives.map((a) => a.id);

    // Update alternative comparisons
    const updatedAlternativeComparisons = updateAlternativeComparisons(
      decision.alternativeComparisons,
      decision.criteria.map((c) => c.id),
      oldAlternativeIds,
      newAlternativeIds
    );

    setDecision({
      ...decision,
      alternatives,
      alternativeComparisons: updatedAlternativeComparisons,
    });
  };

  // Handle criteria comparisons changes
  const handleCriteriaComparisonsChange = (criteriaComparisons: any) => {
    setDecision({ ...decision, criteriaComparisons });
  };

  // Handle alternative comparisons changes
  const handleAlternativeComparisonsChange = (alternativeComparisons: any) => {
    setDecision({ ...decision, alternativeComparisons });
  };

  // Go to the next step
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  // Go to the previous step
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Start a new decision
  const handleNewDecision = () => {
    setDecision(createEmptyDecision());
    setCurrentStep(1);
  };

  // Save the decision
  const handleSaveDecision = () => {
    if (isEditMode && decision.id) {
      // Atualizar uma decisão existente
      updateDecisionMutation.mutate(decision);
    } else {
      // Criar uma nova decisão
      createDecisionMutation.mutate(decision);
    }
  };

  return (
    <section className="mb-12">
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-dark mb-4">
            Ferramenta Processo de Análise Hierárquica (AHP)
          </h2>
          <p className="text-neutral-dark mb-6">
            Tome melhores decisões com o Processo de Análise Hierárquica (AHP). Esta ferramenta ajuda você a avaliar alternativas
            com base em múltiplos critérios, fazendo comparações par a par.
          </p>

          <ProcessSteps currentStep={currentStep} />
          <StepNavigator currentStep={currentStep} onStepChange={handleStepChange} />

          {/* Step 1: Define Problem */}
          {currentStep === 1 && (
            <DefineStep
              problemName={decision.name}
              criteria={decision.criteria}
              alternatives={decision.alternatives}
              onProblemNameChange={handleProblemNameChange}
              onCriteriaChange={handleCriteriaChange}
              onAlternativesChange={handleAlternativesChange}
              onNext={handleNext}
            />
          )}

          {/* Step 2: Compare Criteria */}
          {currentStep === 2 && (
            <CriteriaStep
              criteria={decision.criteria}
              criteriaComparisons={decision.criteriaComparisons}
              onCriteriaComparisonsChange={handleCriteriaComparisonsChange}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {/* Step 3: Compare Alternatives */}
          {currentStep === 3 && (
            <AlternativesStep
              criteria={decision.criteria}
              alternatives={decision.alternatives}
              alternativeComparisons={decision.alternativeComparisons}
              onAlternativeComparisonsChange={handleAlternativeComparisonsChange}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && (
            <ResultsStep
              decision={decision}
              onBack={handleBack}
              onNewDecision={handleNewDecision}
              onSaveDecision={handleSaveDecision}
            />
          )}
          
          <div className="text-center mt-8 text-sm text-gray-500">
            Powered By Alexandre Calaes
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
