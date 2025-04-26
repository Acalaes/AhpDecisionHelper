import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Criterion, Alternative, AlternativeComparisons } from "@shared/schema";
import ComparisonSlider from "./ComparisonSlider";
import ConsistencyCheck from "./ConsistencyCheck";
import { generatePairs } from "@/lib/utils";
import { processComparisonMatrix } from "@/lib/ahp";

interface AlternativesStepProps {
  criteria: Criterion[];
  alternatives: Alternative[];
  alternativeComparisons: AlternativeComparisons;
  onAlternativeComparisonsChange: (comparisons: AlternativeComparisons) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function AlternativesStep({
  criteria,
  alternatives,
  alternativeComparisons,
  onAlternativeComparisonsChange,
  onBack,
  onNext,
}: AlternativesStepProps) {
  const [activeCriterion, setActiveCriterion] = useState<string>("");
  const [comparisonData, setComparisonData] = useState<{ [criterionId: string]: [number, number, number][] }>({});
  const [canContinue, setCanContinue] = useState(false);

  // Generate pairs of alternatives for comparison
  const alternativePairs = generatePairs(alternatives);

  // Set the initial active criterion
  useEffect(() => {
    if (criteria.length > 0 && !activeCriterion) {
      setActiveCriterion(criteria[0].id);
    }
  }, [criteria, activeCriterion]);

  // Initialize comparison data for each criterion
  useEffect(() => {
    const newComparisonData: { [criterionId: string]: [number, number, number][] } = {};

    criteria.forEach((criterion) => {
      // Check if we already have comparison data for this criterion
      const existingComparison = alternativeComparisons[criterion.id];
      
      if (existingComparison && existingComparison.matrix.length === alternatives.length) {
        // Extract existing comparison data
        const pairs: [number, number, number][] = [];
        for (let i = 0; i < alternatives.length; i++) {
          for (let j = i + 1; j < alternatives.length; j++) {
            pairs.push([i, j, existingComparison.matrix[i][j]]);
          }
        }
        newComparisonData[criterion.id] = pairs;
      } else {
        // Initialize with default values (1 = equal importance)
        const pairs: [number, number, number][] = [];
        for (let i = 0; i < alternatives.length; i++) {
          for (let j = i + 1; j < alternatives.length; j++) {
            pairs.push([i, j, 1]);
          }
        }
        newComparisonData[criterion.id] = pairs;
        
        // Process the matrix and update
        const newComparison = processComparisonMatrix(alternatives.length, pairs);
        onAlternativeComparisonsChange({
          ...alternativeComparisons,
          [criterion.id]: newComparison
        });
      }
    });

    setComparisonData(newComparisonData);
  }, [criteria, alternatives, alternativeComparisons]);

  // Check if we can continue to the next step
  useEffect(() => {
    // We can continue if all criteria have complete comparisons with acceptable CR
    let allComplete = true;
    
    criteria.forEach((criterion) => {
      const comparison = alternativeComparisons[criterion.id];
      if (!comparison) {
        allComplete = false;
        return;
      }
      
      // Check if matrix is complete
      const isComplete = comparison.matrix.length === alternatives.length;
      
      // Check consistency
      const isConsistent = comparison.consistencyRatio < 0.1 || alternatives.length <= 2;
      
      if (!isComplete || !isConsistent) {
        allComplete = false;
      }
    });
    
    setCanContinue(allComplete);
  }, [criteria, alternatives, alternativeComparisons]);

  // Handle comparison value changes
  const handleComparisonChange = (criterionId: string, index: number, value: number) => {
    // Update comparison data
    const criterionData = [...comparisonData[criterionId]];
    criterionData[index] = [
      criterionData[index][0],
      criterionData[index][1],
      value
    ];
    
    setComparisonData({
      ...comparisonData,
      [criterionId]: criterionData
    });
    
    // Process the matrix and update
    const newComparison = processComparisonMatrix(alternatives.length, criterionData);
    onAlternativeComparisonsChange({
      ...alternativeComparisons,
      [criterionId]: newComparison
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-neutral-dark mb-3">Comparação de Alternativas</h3>
        <p className="mb-4 text-neutral-dark">
          Compare as alternativas em relação a cada critério.
        </p>

        {/* Criterion Tabs */}
        <Tabs value={activeCriterion} onValueChange={setActiveCriterion} className="mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex">
            {criteria.map((criterion) => (
              <TabsTrigger key={criterion.id} value={criterion.id}>
                {criterion.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {criteria.map((criterion) => (
            <TabsContent key={criterion.id} value={criterion.id}>
              <div className="space-y-6">
                <h4 className="font-medium">
                  Com relação a <span className="text-primary">{criterion.name}</span>:
                </h4>

                {/* Alternative Pairwise Comparisons */}
                {alternativePairs.map((pair, index) => (
                  <ComparisonSlider
                    key={`${criterion.id}-${pair[0].id}-${pair[1].id}`}
                    leftItem={pair[0].name}
                    rightItem={pair[1].name}
                    value={
                      comparisonData[criterion.id] && comparisonData[criterion.id][index]
                        ? comparisonData[criterion.id][index][2]
                        : 1
                    }
                    onChange={(value) => handleComparisonChange(criterion.id, index, value)}
                    colorScheme="secondary"
                  />
                ))}

                {/* Consistency Check */}
                {alternativeComparisons[criterion.id] && (
                  <ConsistencyCheck
                    consistencyRatio={alternativeComparisons[criterion.id].consistencyRatio}
                    isAcceptable={alternativeComparisons[criterion.id].consistencyRatio < 0.1 || alternatives.length <= 2}
                  />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" /> Anterior
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="flex items-center"
        >
          Calcular Resultados <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        Powered By Alexandre Calaes
      </div>
    </div>
  );
}
