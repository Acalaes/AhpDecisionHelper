import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PublicFeedbackList from "@/components/feedback/PublicFeedbackList";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-dark">
          Ferramenta de Decisão AHP
        </h1>
        <p className="text-xl text-neutral-gray mb-8">
          Uma abordagem moderna para tomada de decisões complexas para estudantes
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/tool">
              Comece a Tomar Decisões <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/guide">
              Aprenda Como Funciona
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Compare Alternativas</h3>
          <p className="text-neutral-gray">
            Compare facilmente várias opções com base em seus critérios específicos usando comparações par a par.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Economize Tempo</h3>
          <p className="text-neutral-gray">
            Tome decisões complexas mais rapidamente, dividindo-as em componentes mais simples e gerenciáveis.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Relatórios Detalhados</h3>
          <p className="text-neutral-gray">
            Obtenha análises abrangentes com representações visuais das prioridades de sua decisão.
          </p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Casos de Uso Comuns para Estudantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Escolha de Faculdade</h3>
            <p className="text-sm text-neutral-gray">
              Compare universidades com base em programas acadêmicos, localização, custo e vida no campus.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Decisões de Carreira</h3>
            <p className="text-sm text-neutral-gray">
              Avalie ofertas de emprego considerando salário, benefícios, localização e oportunidades de crescimento.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tópicos de Pesquisa</h3>
            <p className="text-sm text-neutral-gray">
              Selecione temas de pesquisa com base em interesse, recursos disponíveis e impacto acadêmico.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Seleção de Disciplinas</h3>
            <p className="text-sm text-neutral-gray">
              Escolha disciplinas eletivas ponderando dificuldade, interesse e relevância para a carreira.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Projetos em Grupo</h3>
            <p className="text-sm text-neutral-gray">
              Decida coletivamente sobre abordagens de projeto avaliando alternativas de forma objetiva.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Compras de Tecnologia</h3>
            <p className="text-sm text-neutral-gray">
              Compare laptops, celulares ou software com base em especificações, preço e avaliações.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-16">
        <PublicFeedbackList />
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Pronto para Tomar Melhores Decisões?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Comece a usar nossa Ferramenta de Decisão AHP hoje e experimente uma abordagem estruturada para tomada de decisões.
        </p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/tool">Comece Agora</Link>
        </Button>
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        Powered By Alexandre Calaes
      </div>
    </div>
  );
}
