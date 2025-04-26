import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Criterion, ComparisonMatrix } from "@shared/schema";
import ComparisonSlider from "./ComparisonSlider";
import ConsistencyCheck from "./ConsistencyCheck";
import { generatePairs } from "@/lib/utils";
import { processComparisonMatrix } from "@/lib/ahp";

interface CriteriaStepProps {
  criteria: Criterion[];
  criteriaComparisons: ComparisonMatrix;
  onCriteriaComparisonsChange: (comparisons: ComparisonMatrix) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function CriteriaStep({
  criteria,
  criteriaComparisons,
  onCriteriaComparisonsChange,
  onBack,
  onNext,
}: CriteriaStepProps) {
  const [comparisonData, setComparisonData] = useState<[number, number, number][]>([]);
  const [canContinue, setCanContinue] = useState(false);

  // Generate pairs of criteria for comparison
  const criteriaPairs = generatePairs(criteria);

  // Initialize comparison data
  useEffect(() => {
    // If we already have a matrix, extract the comparison data
    if (criteriaComparisons.matrix.length === criteria.length) {
      const pairs: [number, number, number][] = [];
      for (let i = 0; i < criteria.length; i++) {
        for (let j = i + 1; j < criteria.length; j++) {
          pairs.push([i, j, criteriaComparisons.matrix[i][j]]);
        }
      }
      setComparisonData(pairs);
    } else {
      // Initialize with default values (1 = equal importance)
      const pairs: [number, number, number][] = [];
      for (let i = 0; i < criteria.length; i++) {
        for (let j = i + 1; j < criteria.length; j++) {
          pairs.push([i, j, 1]);
        }
      }
      setComparisonData(pairs);
      
      // Process the matrix and update
      const newComparisons = processComparisonMatrix(criteria.length, pairs);
      onCriteriaComparisonsChange(newComparisons);
    }
  }, [criteria, criteriaComparisons.matrix.length]);

  // Check if we can continue to the next step
  useEffect(() => {
    // We can continue if all pairs have been compared and CR is acceptable
    const allCompared = comparisonData.length === criteriaPairs.length;
    
    const consistency = criteriaComparisons.consistencyRatio < 0.1 || criteria.length <= 2;
    setCanContinue(allCompared && consistency);
  }, [comparisonData, criteriaComparisons.consistencyRatio, criteriaPairs.length, criteria.length]);

  // Handle comparison value changes
  const handleComparisonChange = (index: number, value: number) => {
    const newComparisonData = [...comparisonData];
    newComparisonData[index] = [
      comparisonData[index][0],
      comparisonData[index][1],
      value
    ];
    setComparisonData(newComparisonData);
    
    // Process the matrix and update
    const newComparisons = processComparisonMatrix(criteria.length, newComparisonData);
    onCriteriaComparisonsChange(newComparisons);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-neutral-dark mb-3">Comparação Par a Par de Critérios</h3>
        <p className="mb-4 text-neutral-dark">
          Compare a importância relativa de cada critério em relação aos outros.
        </p>

        {/* Comparison Scale Legend */}
        <div className="bg-neutral-light p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Escala AHP:</h4>
          <div className="grid grid-cols-9 gap-1 text-center text-sm mb-2">
            <div className="bg-destructive bg-opacity-20 p-1 rounded">9</div>
            <div className="bg-destructive bg-opacity-10 p-1 rounded">7</div>
            <div className="bg-warning bg-opacity-20 p-1 rounded">5</div>
            <div className="bg-warning bg-opacity-10 p-1 rounded">3</div>
            <div className="bg-neutral-medium p-1 rounded">1</div>
            <div className="bg-success bg-opacity-10 p-1 rounded">3</div>
            <div className="bg-success bg-opacity-20 p-1 rounded">5</div>
            <div className="bg-info bg-opacity-10 p-1 rounded">7</div>
            <div className="bg-info bg-opacity-20 p-1 rounded">9</div>
          </div>
          <div className="grid grid-cols-3 text-center text-sm">
            <div className="text-left">Esquerda é mais importante</div>
            <div className="text-center">Igual</div>
            <div className="text-right">Direita é mais importante</div>
          </div>
        </div>

        {/* Criteria Pairwise Comparison */}
        <div className="space-y-6">
          {criteriaPairs.map((pair, index) => (
            <ComparisonSlider
              key={`${pair[0].id}-${pair[1].id}`}
              leftItem={pair[0].name}
              rightItem={pair[1].name}
              value={comparisonData[index] ? comparisonData[index][2] : 1}
              onChange={(value) => handleComparisonChange(index, value)}
            />
          ))}
        </div>

        {/* Consistency Check */}
        <ConsistencyCheck
          consistencyRatio={criteriaComparisons.consistencyRatio}
          isAcceptable={criteriaComparisons.consistencyRatio < 0.1 || criteria.length <= 2}
        />
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
          Próximo <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        Powered By Alexandre Calaes
      </div>
    </div>
  );
}
