import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

export default function About() {
  return (
    <section className="mb-12">
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-dark mb-4">Sobre AHP</h2>

          <div className="prose max-w-none">
            <p>
              O Processo de Análise Hierárquica (AHP) é uma técnica estruturada para organizar e analisar decisões complexas.
              Desenvolvido por Thomas L. Saaty na década de 1970, tornou-se um dos métodos mais utilizados para tomada de decisão com múltiplos critérios.
            </p>

            <h3>Principais Vantagens do AHP</h3>
            <ul>
              <li>Combina fatores qualitativos e quantitativos na tomada de decisão</li>
              <li>Fornece uma maneira estruturada de lidar com decisões complexas e multifacetadas</li>
              <li>Permite verificações de consistência para validar o processo de decisão</li>
              <li>Ajuda a criar consenso entre os tomadores de decisão</li>
              <li>Produz prioridades numéricas que podem ser facilmente comparadas</li>
            </ul>

            <h3>Aplicações do AHP</h3>
            <p>
              O AHP é usado em diversos campos, incluindo estratégia empresarial, políticas públicas, alocação de recursos,
              saúde, engenharia e educação. Algumas aplicações comuns incluem:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="bg-neutral-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Empresarial</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Seleção de fornecedores</li>
                  <li>Avaliação de produtos</li>
                  <li>Priorização de projetos</li>
                  <li>Decisões de investimento</li>
                </ul>
              </div>
              <div className="bg-neutral-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Governamental</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Avaliação de políticas</li>
                  <li>Alocação de recursos</li>
                  <li>Planejamento urbano</li>
                  <li>Avaliação de riscos</li>
                </ul>
              </div>
              <div className="bg-neutral-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Pessoal</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Escolhas de carreira</li>
                  <li>Compras importantes</li>
                  <li>Seleção de escolas</li>
                  <li>Decisões de moradia</li>
                </ul>
              </div>
            </div>

            <h3>Fundamento Matemático</h3>
            <p>
              O AHP utiliza álgebra matricial para determinar pesos e prioridades. O processo envolve:
            </p>
            <ol>
              <li>Criação de matrizes de comparação</li>
              <li>Cálculo do autovetor principal para derivar prioridades</li>
              <li>Cálculo da razão de consistência para verificar a coerência dos julgamentos</li>
              <li>Síntese dos resultados para determinar a classificação geral</li>
            </ol>

            <div className="bg-neutral-lightest p-4 rounded-lg border border-neutral-medium mt-6">
              <p className="font-medium mb-2">Recursos para Aprendizado Adicional:</p>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://pt.wikipedia.org/wiki/Analytic_Hierarchy_Process" 
                    className="text-primary hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Wikipedia: Processo de Análise Hierárquica
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.youtube.com/watch?v=J4T70o8gjlk" 
                    className="text-primary hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Tutorial em Vídeo: Introdução ao AHP
                  </a>
                </li>
                <li>
                  <a 
                    href="https://bpmsg.com/ahp/" 
                    className="text-primary hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Sistema Online AHP BPMSG
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            Powered By Alexandre Calaes
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
