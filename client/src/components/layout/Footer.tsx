import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Ferramenta de Decisão AHP</h3>
            <p className="text-neutral-medium">
              Uma implementação moderna do Processo de Análise Hierárquica para ajudar estudantes a tomar melhores decisões.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tool">
                  <a className="text-neutral-medium hover:text-white transition">Ferramenta de Decisão</a>
                </Link>
              </li>
              <li>
                <Link href="/guide">
                  <a className="text-neutral-medium hover:text-white transition">Guia do Estudante</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-neutral-medium hover:text-white transition">Sobre AHP</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Referências</h3>
            <p className="text-neutral-medium">
              Esta ferramenta é inspirada no trabalho original em{" "}
              <a href="https://bpmsg.com/ahp/" target="_blank" rel="noopener noreferrer" className="text-info hover:underline">
                bpmsg.com/ahp
              </a>{" "}
              e foi projetada para tornar o AHP mais acessível aos estudantes.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-gray text-center text-neutral-medium">
          <p>© {new Date().getFullYear()} Ferramenta de Decisão AHP para Estudantes. Todos os direitos reservados.</p>
          <p className="mt-2">Powered By Alexandre Calaes</p>
        </div>
      </div>
    </footer>
  );
}
