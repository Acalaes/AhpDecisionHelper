import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { decisionSchema, type AHPDecision } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

// Middleware para verificar se o usuário está autenticado
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Não autorizado. Faça login para continuar." });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar autenticação
  setupAuth(app);
  
  // API routes
  app.get("/api/decisions", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      // Buscar apenas as decisões do usuário logado
      const userId = req.user.id;
      const decisions = await storage.getDecisions(userId);
      res.json(decisions);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve decisions" });
    }
  });

  app.get("/api/decisions/:id", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const decision = await storage.getDecision(id);
      
      if (!decision) {
        return res.status(404).json({ message: "Decision not found" });
      }
      
      // Verificar se a decisão pertence ao usuário logado
      if (decision.userId !== req.user.id) {
        return res.status(403).json({ message: "Acesso não autorizado a esta decisão" });
      }
      
      res.json(decision);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve decision" });
    }
  });

  app.post("/api/decisions", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      let decisionData = req.body as AHPDecision;
      
      try {
        decisionSchema.parse(decisionData);
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ 
            message: "Validation error", 
            errors: validationError.details 
          });
        }
        throw error;
      }
      
      // Associar a decisão ao usuário logado
      decisionData = {
        ...decisionData,
        userId: req.user.id
      };
      
      const newDecision = await storage.createDecision(decisionData);
      res.status(201).json(newDecision);
    } catch (error) {
      res.status(500).json({ message: "Failed to create decision" });
    }
  });

  app.put("/api/decisions/:id", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      let decisionData = req.body as AHPDecision;
      
      // Verificar se a decisão existe
      const existingDecision = await storage.getDecision(id);
      if (!existingDecision) {
        return res.status(404).json({ message: "Decision not found" });
      }
      
      // Verificar se a decisão pertence ao usuário logado
      if (existingDecision.userId !== req.user.id) {
        return res.status(403).json({ message: "Acesso não autorizado a esta decisão" });
      }
      
      try {
        decisionSchema.parse(decisionData);
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ 
            message: "Validation error", 
            errors: validationError.details 
          });
        }
        throw error;
      }
      
      // Garantir que o userId permaneça o mesmo
      decisionData = {
        ...decisionData,
        userId: req.user.id
      };
      
      const updatedDecision = await storage.updateDecision(id, decisionData);
      
      res.json(updatedDecision);
    } catch (error) {
      res.status(500).json({ message: "Failed to update decision" });
    }
  });

  app.delete("/api/decisions/:id", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      // Verificar se a decisão existe
      const existingDecision = await storage.getDecision(id);
      if (!existingDecision) {
        return res.status(404).json({ message: "Decision not found" });
      }
      
      // Verificar se a decisão pertence ao usuário logado
      if (existingDecision.userId !== req.user.id) {
        return res.status(403).json({ message: "Acesso não autorizado a esta decisão" });
      }
      
      const success = await storage.deleteDecision(id);
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete decision" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
