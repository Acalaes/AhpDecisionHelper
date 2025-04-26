import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <h1 className="text-2xl font-bold text-primary">Ferramenta de Decisão AHP</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/tool">
                <a
                  className={cn(
                    "text-neutral-dark hover:text-primary transition",
                    location === "/tool" && "text-primary font-medium"
                  )}
                >
                  Ferramenta
                </a>
              </Link>
            </li>
            <li>
              <Link href="/my-decisions">
                <a
                  className={cn(
                    "text-neutral-dark hover:text-primary transition",
                    location === "/my-decisions" && "text-primary font-medium"
                  )}
                >
                  Minhas Decisões
                </a>
              </Link>
            </li>
            <li>
              <Link href="/guide">
                <a
                  className={cn(
                    "text-neutral-dark hover:text-primary transition",
                    location === "/guide" && "text-primary font-medium"
                  )}
                >
                  Guia
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a
                  className={cn(
                    "text-neutral-dark hover:text-primary transition",
                    location === "/about" && "text-primary font-medium"
                  )}
                >
                  Sobre AHP
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="bg-slate-100 text-center py-1 text-xs text-gray-600">
        Powered By Alexandre Calaes
      </div>
    </header>
  );
}
