import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { decisionSchema, type AHPDecision } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/decisions", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const decisions = await storage.getDecisions(userId);
      res.json(decisions);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve decisions" });
    }
  });

  app.get("/api/decisions/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const decision = await storage.getDecision(id);
      
      if (!decision) {
        return res.status(404).json({ message: "Decision not found" });
      }
      
      res.json(decision);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve decision" });
    }
  });

  app.post("/api/decisions", async (req: Request, res: Response) => {
    try {
      const decisionData = req.body as AHPDecision;
      
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
      
      const newDecision = await storage.createDecision(decisionData);
      res.status(201).json(newDecision);
    } catch (error) {
      res.status(500).json({ message: "Failed to create decision" });
    }
  });

  app.put("/api/decisions/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const decisionData = req.body as AHPDecision;
      
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
      
      const updatedDecision = await storage.updateDecision(id, decisionData);
      
      if (!updatedDecision) {
        return res.status(404).json({ message: "Decision not found" });
      }
      
      res.json(updatedDecision);
    } catch (error) {
      res.status(500).json({ message: "Failed to update decision" });
    }
  });

  app.delete("/api/decisions/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteDecision(id);
      
      if (!success) {
        return res.status(404).json({ message: "Decision not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete decision" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
