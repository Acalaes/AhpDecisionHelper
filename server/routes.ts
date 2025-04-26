import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { decisionSchema, feedbackSchema, insertFeedbackSchema, type AHPDecision, type InsertFeedback, type InsertUserEngagement, type DecisionCategory, DECISION_CATEGORIES, updateDecisionSchema } from "@shared/schema";
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

// Middleware para verificar se o usuário é administrador
function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Acesso restrito a administradores." });
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
      if (existingDecision.userId !== req.user!.id) {
        return res.status(403).json({ message: "Acesso não autorizado a esta decisão" });
      }
      
      const success = await storage.deleteDecision(id);
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete decision" });
    }
  });

  // === Rotas de Feedback ===
  app.post("/api/feedback", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      let feedbackData = req.body as InsertFeedback;
      
      // Valide os dados recebidos (pode incluir ou não decisionId)
      try {
        feedbackData = {
          ...feedbackData,
          // Garantindo que feedbackType exista
          feedbackType: feedbackData.feedbackType || (feedbackData.decisionId ? "decision" : "general")
        };
        
        insertFeedbackSchema.parse(feedbackData);
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ 
            message: "Erro de validação", 
            errors: validationError.details 
          });
        }
        throw error;
      }
      
      // Associar o feedback ao usuário logado
      const feedback = await storage.createFeedback({
        ...feedbackData,
        userId: req.user!.id
      });
      
      res.status(201).json(feedback);
    } catch (error) {
      console.error("Erro ao salvar feedback:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      res.status(500).json({ 
        message: "Erro ao salvar feedback", 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  app.get("/api/feedback/public", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const feedbacks = await storage.getPublicFeedbacks(limit);
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter feedbacks públicos" });
    }
  });

  // === Rotas de Engajamento ===
  app.post("/api/engagement", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const engagement: InsertUserEngagement = {
        ...req.body,
        userId: req.user!.id,
        timestamp: new Date()
      };
      
      const result = await storage.trackEngagement(engagement);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao registrar engajamento" });
    }
  });

  // === Rotas de Dashboard (Admin) ===
  app.get("/api/admin/metrics/categories", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDecisionsByCategory();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter estatísticas por categoria" });
    }
  });

  app.get("/api/admin/metrics/completion-time", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const avgTime = await storage.getAverageCompletionTime();
      res.json({ averageCompletionTime: avgTime });
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter tempo médio de conclusão" });
    }
  });

  app.get("/api/admin/metrics/rating", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const avgRating = await storage.getAverageRating();
      res.json({ averageRating: avgRating });
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter avaliação média" });
    }
  });

  app.get("/api/admin/metrics/users-over-time", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : 
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const stats = await storage.getUsersOverTime(startDate, endDate);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter estatísticas de usuários ao longo do tempo" });
    }
  });

  app.get("/api/admin/metrics/decisions-over-time", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : 
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const stats = await storage.getDecisionsOverTime(startDate, endDate);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter estatísticas de decisões ao longo do tempo" });
    }
  });

  app.get("/api/admin/metrics/step-engagement", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStepEngagementStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter estatísticas de engajamento por etapa" });
    }
  });

  app.get("/api/admin/metrics/aggregate", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const metricType = req.query.type as string;
      if (!metricType) {
        return res.status(400).json({ message: "Parâmetro 'type' é obrigatório" });
      }
      
      const metrics = await storage.getAggregateMetrics(metricType);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter métricas agregadas" });
    }
  });

  app.post("/api/admin/metrics/update", ensureAdmin, async (req: Request, res: Response) => {
    try {
      await storage.updateAggregateMetrics();
      res.status(200).json({ message: "Métricas atualizadas com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar métricas agregadas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
