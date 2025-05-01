import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User as UserIcon, ChevronDown, BarChart2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import FeedbackButton from "@/components/feedback/FeedbackButton";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAdmin = user?.isAdmin === true;
  const userInitials = user?.username ? user.username.slice(0, 2).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-xl font-bold">AHP-UDESC-ESAG</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex gap-1">
            <Link href="/">
              <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                Início
              </div>
            </Link>
            <Link href="/tool">
              <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/tool" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                Ferramenta
              </div>
            </Link>
            <Link href="/guide">
              <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/guide" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                Guia
              </div>
            </Link>
            <Link href="/about">
              <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/about" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                Sobre
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <FeedbackButton />
            
            {user ? (
              <div className="flex items-center gap-2">
                {user && (
                  <Link href="/my-decisions">
                    <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/my-decisions" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                      Minhas Decisões
                    </div>
                  </Link>
                )}
                
                {isAdmin && (
                  <Link href="/dashboard">
                    <div className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-1 cursor-pointer ${location === "/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                      <BarChart2 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-[120px] truncate">
                        {user.username}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Navigation Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <FeedbackButton />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Sidebar Menu */}
        {isMenuOpen && isMobile && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={toggleMenu}></div>
            <div className="relative bg-background p-4 w-3/4 min-h-screen ml-auto">
              <div className="flex flex-col space-y-4 mt-4">
                <Link href="/">
                  <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                    Início
                  </div>
                </Link>
                <Link href="/tool">
                  <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/tool" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                    Ferramenta
                  </div>
                </Link>
                <Link href="/guide">
                  <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/guide" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                    Guia
                  </div>
                </Link>
                <Link href="/about">
                  <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/about" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                    Sobre
                  </div>
                </Link>
                
                {user ? (
                  <>
                    <Link href="/my-decisions">
                      <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${location === "/my-decisions" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                        Minhas Decisões
                      </div>
                    </Link>
                    
                    {isAdmin && (
                      <Link href="/dashboard">
                        <div className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-1 cursor-pointer ${location === "/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                          <BarChart2 className="h-4 w-4" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                    )}
                    
                    <Button variant="ghost" className="justify-start px-3" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sair</span>
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <Button asChild>
                      <Link href="/auth">Entrar / Cadastrar</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}