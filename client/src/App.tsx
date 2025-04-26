import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Tool from "@/pages/tool";
import Guide from "@/pages/guide";
import About from "@/pages/about";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/tool" component={Tool} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
