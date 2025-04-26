import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Printer, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Chart } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { Criterion, Alternative, AHPDecision } from "@shared/schema";
import { formatNumber } from "@/lib/utils";
import { calculateOverallPriorities } from "@/lib/ahp";

interface ResultsStepProps {
  decision: AHPDecision;
  onBack: () => void;
  onNewDecision: () => void;
  onSaveDecision?: () => void;
}

export default function ResultsStep({
  decision,
  onBack,
  onNewDecision,
  onSaveDecision,
}: ResultsStepProps) {
  const { toast } = useToast();
  const [overallPriorities, setOverallPriorities] = useState<{ [alternativeId: string]: number }>({});
  const [rankedAlternatives, setRankedAlternatives] = useState<
    { id: string; name: string; score: number; rank: number }[]
  >([]);

  // Calculate overall priorities
  useEffect(() => {
    const priorities = calculateOverallPriorities(decision);
    setOverallPriorities(priorities);

    // Rank alternatives by their overall priority
    const ranked = decision.alternatives
      .map((alt) => ({
        id: alt.id,
        name: alt.name,
        score: priorities[alt.id],
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score);

    // Assign ranks
    ranked.forEach((alt, index) => {
      alt.rank = index + 1;
    });

    setRankedAlternatives(ranked);
  }, [decision]);

  // Chart data for criteria
  const criteriaChartData = {
    type: "pie",
    data: {
      labels: decision.criteria.map((c) => c.name),
      datasets: [
        {
          data: decision.criteriaComparisons.priorities.map((p) => p * 100),
          backgroundColor: [
            "hsl(var(--chart-1))",
            "hsl(var(--chart-2))",
            "hsl(var(--chart-3))",
            "hsl(var(--chart-4))",
            "hsl(var(--chart-5))",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  };

  // Chart data for alternatives
  const alternativesChartData = {
    type: "bar",
    data: {
      labels: rankedAlternatives.map((a) => a.name),
      datasets: [
        {
          label: "Pontuação Geral",
          data: rankedAlternatives.map((a) => a.score),
          backgroundColor: [
            "hsl(var(--success))",
            "hsl(var(--info))",
            "hsl(var(--muted-foreground))",
            "hsl(var(--warning))",
            "hsl(var(--destructive))",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...rankedAlternatives.map((a) => a.score)) * 1.2,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  const handleSaveResults = () => {
    // Usar a função onSaveDecision do componente pai se disponível
    if (onSaveDecision) {
      onSaveDecision();
    } else {
      // Fallback para o comportamento anterior (apenas mostrar o toast)
      toast({
        title: "Resultados Salvos",
        description: "Os resultados da sua decisão foram salvos com sucesso.",
      });
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-neutral-dark mb-3">Resultados da Decisão</h3>
        <p className="mb-6 text-neutral-dark">
          Com base nas suas preferências, aqui estão os pesos calculados e as classificações finais.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Criteria Weights */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Pesos dos Critérios</h4>
              <div className="h-64 mb-4">
                <Chart {...criteriaChartData} />
              </div>
              
              {decision.criteria.map((criterion, index) => (
                <div key={criterion.id} className="mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span>{criterion.name}</span>
                    <span className="font-medium">
                      {formatNumber(decision.criteriaComparisons.priorities[index] * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={decision.criteriaComparisons.priorities[index] * 100} 
                    className="h-2.5 bg-neutral-light"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Final Ranking */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Classificação Final</h4>
              <div className="h-64 mb-4">
                <Chart {...alternativesChartData} />
              </div>

              <div className="mt-6">
                {rankedAlternatives.map((alt) => (
                  <div 
                    key={alt.id} 
                    className="flex items-center py-2 border-b border-neutral-light last:border-b-0"
                  >
                    <div 
                      className={`w-8 h-8 flex items-center justify-center text-white rounded-full mr-3 ${
                        alt.rank === 1 
                          ? "bg-success" 
                          : alt.rank === 2 
                            ? "bg-info" 
                            : "bg-muted-foreground"
                      }`}
                    >
                      {alt.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{alt.name}</div>
                      <div className="text-sm text-neutral-gray">
                        Pontuação geral: {formatNumber(alt.score)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Matrix */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Prioridades das Alternativas por Critério</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-dark">
              <thead className="text-xs uppercase bg-neutral-light">
                <tr>
                  <th scope="col" className="px-6 py-3">Alternativa</th>
                  {decision.criteria.map((criterion, index) => (
                    <th key={criterion.id} scope="col" className="px-6 py-3">
                      {criterion.name} ({formatNumber(decision.criteriaComparisons.priorities[index] * 100)}%)
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3">Geral</th>
                </tr>
              </thead>
              <tbody>
                {rankedAlternatives.map((alt) => (
                  <tr key={alt.id} className="bg-white border-b">
                    <td className="px-6 py-4 font-medium">{alt.name}</td>
                    {decision.criteria.map((criterion) => {
                      const comparison = decision.alternativeComparisons[criterion.id];
                      const altIndex = decision.alternatives.findIndex(a => a.id === alt.id);
                      return (
                        <td key={`${alt.id}-${criterion.id}`} className="px-6 py-4">
                          {comparison ? formatNumber(comparison.priorities[altIndex]) : "N/A"}
                        </td>
                      );
                    })}
                    <td 
                      className={`px-6 py-4 font-medium ${
                        alt.rank === 1 
                          ? "text-success" 
                          : alt.rank === 2 
                            ? "text-info" 
                            : ""
                      }`}
                    >
                      {formatNumber(alt.score)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button onClick={handleSaveResults} className="flex items-center">
            <Save className="mr-2 h-4 w-4" /> Salvar Resultados
          </Button>
          <Button variant="secondary" onClick={handlePrintReport} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" /> Imprimir Relatório
          </Button>
          <Button variant="outline" onClick={onNewDecision} className="flex items-center">
            <RotateCcw className="mr-2 h-4 w-4" /> Iniciar Nova Decisão
          </Button>
        </div>
      </div>

      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" /> Anterior
        </Button>
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        Powered By Alexandre Calaes
      </div>
    </div>
  );
}
