import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, isLoading, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <Link href="/" className="flex items-center cursor-pointer">
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
          </Link>
        </div>
        <div className="flex items-center">
          <nav className="mr-4">
            <ul className="flex space-x-6">
              <li>
                <Link 
                  href="/tool"
                  className={cn(
                    "text-neutral-dark hover:text-primary transition cursor-pointer",
                    location === "/tool" && "text-primary font-medium"
                  )}
                >
                  Ferramenta
                </Link>
              </li>
              <li>
                <Link 
                  href="/my-decisions"
                  className={cn(
                    "text-neutral-dark hover:text-primary transition cursor-pointer",
                    location === "/my-decisions" && "text-primary font-medium"
                  )}
                >
                  Minhas Decisões
                </Link>
              </li>
              <li>
                <Link 
                  href="/guide"
                  className={cn(
                    "text-neutral-dark hover:text-primary transition cursor-pointer",
                    location === "/guide" && "text-primary font-medium"
                  )}
                >
                  Guia
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className={cn(
                    "text-neutral-dark hover:text-primary transition cursor-pointer",
                    location === "/about" && "text-primary font-medium"
                  )}
                >
                  Sobre AHP
                </Link>
              </li>
            </ul>
          </nav>
          
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{user.username}</span>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <LogOut className="h-4 w-4 mr-1" />
                )}
                Sair
              </Button>
            </div>
          ) : (
            <Link href="/auth" className="inline-block">
              <Button variant="default" size="sm">
                Login / Registrar
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="bg-slate-100 text-center py-1 text-xs text-gray-600">
        Powered By Alexandre Calaes
      </div>
    </header>
  );
}
