import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Tool from "@/pages/tool";
import Guide from "@/pages/guide";
import About from "@/pages/about";
import MyDecisions from "@/pages/my-decisions";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeedbackButton from "@/components/feedback/FeedbackButton";

function Router() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/tool" component={Tool} />
          <ProtectedRoute path="/my-decisions" component={MyDecisions} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route path="/guide" component={Guide} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
