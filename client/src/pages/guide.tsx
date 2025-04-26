import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function Guide() {
  return (
    <section className="mb-12">
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-dark mb-4">Guia AHP para Estudantes</h2>

          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is-ahp">
                <AccordionTrigger className="text-left font-medium">
                  O que é o Processo de Análise Hierárquica (AHP)?
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <p className="mb-3">
                    O Processo de Análise Hierárquica (AHP) é uma técnica estruturada para organizar e analisar decisões complexas,
                    desenvolvida por Thomas L. Saaty na década de 1970. Ela ajuda os tomadores de decisão a encontrar a opção que melhor atende às suas necessidades e compreensão do problema.
                  </p>
                  <p>
                    O AHP divide um problema de decisão em uma hierarquia de subproblemas que podem ser mais facilmente compreendidos e avaliados.
                    Em seguida, avalia várias soluções alternativas por meio de comparações par a par de critérios e alternativas.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="when-to-use">
                <AccordionTrigger className="text-left font-medium">
                  Quando usar o AHP?
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <p className="mb-2">O AHP é útil em situações onde:</p>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Múltiplos critérios precisam ser considerados</li>
                    <li>Alguns critérios são subjetivos ou difíceis de medir</li>
                    <li>Múltiplos interessados estão envolvidos na decisão</li>
                    <li>Várias alternativas precisam ser avaliadas</li>
                    <li>A decisão tem consequências significativas</li>
                  </ul>
                  <p>
                    Exemplos incluem decisões de compra, seleção de projetos, avaliação de fornecedores, alocação de recursos e decisões de políticas.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="understanding-scale">
                <AccordionTrigger className="text-left font-medium">
                  Entendendo a Escala AHP
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <p className="mb-3">
                    O AHP usa uma escala de 1-9 para comparações par a par:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-neutral-dark">
                      <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                        <tr>
                          <th className="px-6 py-3">Escala</th>
                          <th className="px-6 py-3">Definição</th>
                          <th className="px-6 py-3">Explicação</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-2">1</td>
                          <td className="px-6 py-2">Importância igual</td>
                          <td className="px-6 py-2">Dois elementos contribuem igualmente para o objetivo</td>
                        </tr>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-2">3</td>
                          <td className="px-6 py-2">Importância moderada</td>
                          <td className="px-6 py-2">Experiência e julgamento favorecem levemente um elemento sobre outro</td>
                        </tr>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-2">5</td>
                          <td className="px-6 py-2">Importância forte</td>
                          <td className="px-6 py-2">Experiência e julgamento favorecem fortemente um elemento sobre outro</td>
                        </tr>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-2">7</td>
                          <td className="px-6 py-2">Importância muito forte</td>
                          <td className="px-6 py-2">Um elemento é favorecido muito fortemente sobre outro</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-2">9</td>
                          <td className="px-6 py-2">Importância extrema</td>
                          <td className="px-6 py-2">A evidência favorecendo um elemento sobre outro é da mais alta ordem possível</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-by-step">
                <AccordionTrigger className="text-left font-medium">
                  Processo AHP Passo a Passo
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>
                      <div className="font-medium">Definir o problema e o objetivo</div>
                      <p className="ml-6 mt-1">Declare claramente qual decisão precisa ser tomada.</p>
                    </li>
                    <li>
                      <div className="font-medium">Estruturar a hierarquia de decisão</div>
                      <p className="ml-6 mt-1">Identifique critérios, subcritérios e alternativas.</p>
                    </li>
                    <li>
                      <div className="font-medium">Construir matrizes de comparação par a par</div>
                      <p className="ml-6 mt-1">Compare cada elemento com todos os outros elementos em seu nível.</p>
                    </li>
                    <li>
                      <div className="font-medium">Calcular prioridades (pesos)</div>
                      <p className="ml-6 mt-1">Sintetize julgamentos para determinar prioridades.</p>
                    </li>
                    <li>
                      <div className="font-medium">Verificar consistência</div>
                      <p className="ml-6 mt-1">Garanta que as comparações sejam consistentes (RC &lt; 0,1).</p>
                    </li>
                    <li>
                      <div className="font-medium">Combinar pesos de critérios com pontuações alternativas</div>
                      <p className="ml-6 mt-1">Calcular a prioridade geral para cada alternativa.</p>
                    </li>
                    <li>
                      <div className="font-medium">Tomar a decisão final</div>
                      <p className="ml-6 mt-1">Selecione a alternativa com a maior pontuação de prioridade geral.</p>
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="consistency-ratio">
                <AccordionTrigger className="text-left font-medium">
                  Entendendo a Razão de Consistência (RC)
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <p className="mb-3">
                    A Razão de Consistência (RC) mede quão consistentes são suas comparações par a par. Inconsistências podem ocorrer ao fazer múltiplas comparações.
                  </p>
                  <p className="mb-3">
                    Por exemplo, se você diz que A é duas vezes mais importante que B, e B é três vezes mais importante que C, então logicamente A deveria ser seis vezes mais importante que C.
                    Se seu julgamento diferir significativamente disso, suas comparações são inconsistentes.
                  </p>
                  <p className="mb-3">
                    <strong>RC &lt; 0,1</strong> é geralmente considerado aceitável. Se RC &gt; 0,1, você deve revisar e ajustar seus julgamentos.
                  </p>
                  <div className="bg-warning bg-opacity-10 p-3 rounded-lg">
                    <p className="font-medium">Exemplo de Inconsistência:</p>
                    <p>Se você disser:</p>
                    <ul className="list-disc list-inside mb-2">
                      <li>A é 3 vezes mais importante que B</li>
                      <li>B é 2 vezes mais importante que C</li>
                      <li>C é 2 vezes mais importante que A</li>
                    </ul>
                    <p>Isso cria uma inconsistência circular que precisa ser resolvida.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            Powered By Alexandre Calaes
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
