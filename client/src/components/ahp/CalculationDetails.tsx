import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileDown, Info } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import MatrixView from "./MatrixView";
import { AHPDecision } from "@shared/schema";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalculationDetailsProps {
  decision: AHPDecision;
}

export default function CalculationDetails({ decision }: CalculationDetailsProps) {
  const [expanded, setExpanded] = useState(false);
  
  const createCriteriaMatrix = () => {
    return {
      matrix: decision.criteriaComparisons.matrix,
      priorities: decision.criteriaComparisons.priorities,
      consistencyRatio: decision.criteriaComparisons.consistencyRatio,
      labels: decision.criteria.map(c => c.name)
    };
  };
  
  const createAlternativeMatrices = () => {
    return decision.criteria.map(criterion => {
      const comparisons = decision.alternativeComparisons[criterion.id];
      if (!comparisons) return null;
      
      return {
        criterionId: criterion.id,
        criterionName: criterion.name,
        matrix: comparisons.matrix,
        priorities: comparisons.priorities,
        consistencyRatio: comparisons.consistencyRatio,
        labels: decision.alternatives.map(a => a.name)
      };
    }).filter(Boolean);
  };
  
  const createOverallPrioritiesMatrix = () => {
    // Criar uma matriz que mostre como as prioridades são calculadas
    const alternativeIds = decision.alternatives.map(a => a.id);
    const criteriaIds = decision.criteria.map(c => c.id);
    
    const rows = alternativeIds.map(altId => {
      return criteriaIds.map(critId => {
        const comparisons = decision.alternativeComparisons[critId];
        if (!comparisons) return 0;
        
        const altIndex = decision.alternatives.findIndex(a => a.id === altId);
        return comparisons.priorities[altIndex] || 0;
      });
    });
    
    return {
      rows,
      alternativeLabels: decision.alternatives.map(a => a.name),
      criteriaLabels: decision.criteria.map(c => c.name),
      criteriaPriorities: decision.criteriaComparisons.priorities,
      overallRanking: decision.overallRanking
    };
  };
  
  const criteriaMatrix = createCriteriaMatrix();
  const alternativeMatrices = createAlternativeMatrices();
  const overallMatrix = createOverallPrioritiesMatrix();
  
  const isConsistent = decision.criteriaComparisons.consistencyRatio <= 0.1 &&
    alternativeMatrices.every(matrix => matrix && matrix.consistencyRatio <= 0.1);

  const exportCalculations = () => {
    // Criar um objeto com todos os cálculos
    const calculations = {
      name: decision.name,
      timestamp: new Date().toISOString(),
      criteria: {
        items: decision.criteria.map(c => c.name),
        matrix: decision.criteriaComparisons.matrix,
        priorities: decision.criteriaComparisons.priorities,
        consistencyRatio: decision.criteriaComparisons.consistencyRatio
      },
      alternatives: {
        items: decision.alternatives.map(a => a.name),
        matricesByCriteria: alternativeMatrices.map(m => {
          if (!m) return null;
          return {
            criterion: m.criterionName,
            matrix: m.matrix,
            priorities: m.priorities,
            consistencyRatio: m.consistencyRatio
          };
        }).filter(Boolean)
      },
      overallRanking: Object.entries(decision.overallRanking || {}).map(([altId, score]) => {
        const alt = decision.alternatives.find(a => a.id === altId);
        return {
          alternative: alt?.name || altId,
          score
        };
      }).sort((a, b) => b.score - a.score)
    };
    
    // Converter para JSON e criar um arquivo para download
    const dataStr = JSON.stringify(calculations, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ahp-calculo-${decision.name.replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card className="my-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Detalhes dos Cálculos</CardTitle>
            <CardDescription>
              Visualize as matrizes e cálculos utilizados no método AHP
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>Minimizar</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>Expandir</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="criteria">Critérios</TabsTrigger>
            <TabsTrigger value="alternatives">Alternativas</TabsTrigger>
            <TabsTrigger value="ranking">Ranking Final</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Estado de Consistência</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <span className="text-sm text-muted-foreground">Consistência dos Critérios:</span>
                    <div className="flex items-center mt-1">
                      <div className={`h-2 w-2 rounded-full mr-2 ${criteriaMatrix.consistencyRatio <= 0.1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">
                        RC = {formatNumber(criteriaMatrix.consistencyRatio, 3)}
                        {criteriaMatrix.consistencyRatio <= 0.1 ? ' (Aceitável)' : ' (Inconsistente)'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <span className="text-sm text-muted-foreground">Consistência Geral:</span>
                    <div className="flex items-center mt-1">
                      <div className={`h-2 w-2 rounded-full mr-2 ${isConsistent ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">
                        {isConsistent ? 'Todos os julgamentos são consistentes' : 'Há inconsistências nos julgamentos'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Sobre o Método AHP</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  O Processo de Análise Hierárquica (AHP) é um método estruturado para organizar e analisar decisões complexas. 
                  Ele funciona através da decomposição do problema em uma hierarquia, comparação pareada de elementos, 
                  cálculo de prioridades e verificação de consistência.
                </p>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como os cálculos são feitos?</AccordionTrigger>
                    <AccordionContent>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li><strong>Matrizes de Comparação Pareada:</strong> Para cada par de elementos, atribuímos um valor de 1 a 9 indicando a preferência relativa.</li>
                        <li><strong>Normalização:</strong> Cada matriz é normalizada dividindo cada elemento pela soma de sua coluna.</li>
                        <li><strong>Cálculo de Prioridades:</strong> O vetor de prioridades é obtido pela média de cada linha da matriz normalizada.</li>
                        <li><strong>Verificação de Consistência:</strong> Calculamos o índice de consistência (CI) e a razão de consistência (CR).</li>
                        <li><strong>Ranking Final:</strong> Combinamos as prioridades dos critérios com as prioridades das alternativas.</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Sobre a Razão de Consistência (RC)</AccordionTrigger>
                    <AccordionContent>
                      <p>A Razão de Consistência (RC) mede quão consistentes são os julgamentos. Um valor de RC ≤ 0.1 (10%) é considerado aceitável.</p>
                      <p className="mt-2">
                        <strong>Como é calculado:</strong> RC = CI / RI, onde:
                      </p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>CI (Índice de Consistência) = (λmax - n) / (n - 1)</li>
                        <li>λmax é o maior autovalor da matriz</li>
                        <li>n é o número de elementos comparados</li>
                        <li>RI (Índice Randômico) é um valor tabelado que depende de n</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="criteria">
            <h3 className="text-lg font-medium mb-2">Matriz de Comparação dos Critérios</h3>
            <MatrixView 
              matrix={criteriaMatrix.matrix}
              rowLabels={criteriaMatrix.labels}
              colLabels={criteriaMatrix.labels}
              priorities={criteriaMatrix.priorities}
              consistencyRatio={criteriaMatrix.consistencyRatio}
              title="Comparação Pareada entre Critérios"
            />
            
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Interpretação:</h4>
              <p className="text-sm text-muted-foreground">
                Esta matriz mostra as comparações pareadas entre os critérios. Cada valor representa 
                a importância relativa do critério da linha em relação ao critério da coluna.
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                <li>Valores acima de 1 indicam que o critério da linha é mais importante que o da coluna.</li>
                <li>Valores abaixo de 1 indicam que o critério da linha é menos importante que o da coluna.</li>
                <li>A coluna "Prioridades" mostra o peso relativo de cada critério no problema.</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="alternatives">
            <h3 className="text-lg font-medium mb-2">Matrizes de Comparação das Alternativas</h3>
            <div className="space-y-6">
              {alternativeMatrices.filter(Boolean).map((matrix, index) => (
                matrix && (
                  <MatrixView 
                    key={index}
                    matrix={matrix.matrix}
                    rowLabels={matrix.labels}
                    colLabels={matrix.labels}
                    priorities={matrix.priorities}
                    consistencyRatio={matrix.consistencyRatio}
                    title={`Comparação em relação ao critério: ${matrix.criterionName}`}
                  />
                )
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Interpretação:</h4>
              <p className="text-sm text-muted-foreground">
                Cada matriz mostra como as alternativas foram avaliadas em relação a um critério específico.
                Os valores representam a preferência relativa entre as alternativas para aquele critério.
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                <li>A coluna "Prioridades" mostra o peso relativo de cada alternativa para o critério específico.</li>
                <li>Uma razão de consistência (RC) ≤ 0.1 indica que os julgamentos são consistentes.</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="ranking">
            <h3 className="text-lg font-medium mb-2">Cálculo do Ranking Final</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2 bg-muted/50">Alternativas</th>
                    {criteriaMatrix.labels.map((criterion, i) => (
                      <th key={i} className="border p-2 bg-muted/50">
                        <div>
                          {criterion}
                          <span className="block text-xs text-muted-foreground">
                            (peso: {formatNumber(criteriaMatrix.priorities[i], 3)})
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className="border p-2 bg-primary/10">Score Final</th>
                  </tr>
                </thead>
                <tbody>
                  {overallMatrix.rows.map((row, i) => {
                    const altId = decision.alternatives[i].id;
                    const finalScore = decision.overallRanking?.[altId] || 0;
                    
                    return (
                      <tr key={i}>
                        <td className="border p-2 font-medium">{overallMatrix.alternativeLabels[i]}</td>
                        {row.map((value, j) => (
                          <td key={j} className="border p-2 text-center">
                            {formatNumber(value, 3)}
                          </td>
                        ))}
                        <td className="border p-2 text-center font-bold bg-primary/10">
                          {formatNumber(finalScore, 4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Interpretação do Cálculo:</h4>
              <p className="text-sm text-muted-foreground">
                O score final de cada alternativa é calculado pela soma ponderada dos pesos das alternativas 
                para cada critério, multiplicados pelo peso do respectivo critério.
              </p>
              <div className="mt-2 p-2 bg-white rounded border">
                <h5 className="text-sm font-medium">Fórmula:</h5>
                <p className="text-sm font-mono">
                  Score(A) = Σ [Peso do Critério(i) × Peso da Alternativa A para Critério(i)]
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm">
                <Info className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isConsistent 
                    ? "Todos os julgamentos são consistentes (RC ≤ 0.1)" 
                    : "Há inconsistências nos julgamentos (RC > 0.1)"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>A Razão de Consistência (RC) deve ser menor ou igual a 0.1 (10%) para que os julgamentos sejam considerados consistentes.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="outline" size="sm" onClick={exportCalculations}>
          <FileDown className="h-4 w-4 mr-1" />
          Exportar Cálculos
        </Button>
      </CardFooter>
    </Card>
  );
}