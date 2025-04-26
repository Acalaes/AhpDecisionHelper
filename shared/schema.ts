import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, date, doublePrecision, time } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Constantes para categorias de decisão
export const DECISION_CATEGORIES = {
  EDUCATIONAL: 'educational',
  PROFESSIONAL: 'professional',
  PERSONAL: 'personal',
  OTHER: 'other'
} as const;

// User table from original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at").defaultNow(),
  isAdmin: boolean("is_admin").default(false),
});

// AHP Decision Problem table
export const decisions = pgTable("decisions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  criteriaJson: text("criteria_json").notNull(),
  alternativesJson: text("alternatives_json").notNull(),
  criteriaComparisonsJson: text("criteria_comparisons_json").notNull(),
  alternativeComparisonsJson: text("alternative_comparisons_json").notNull(),
  overallRankingJson: text("overall_ranking_json"),
  createdAt: text("created_at").notNull(),
  completionTime: integer("completion_time"),  // tempo em segundos para completar a decisão
  category: varchar("category", { length: 20 }).default(DECISION_CATEGORIES.OTHER),  // categoria da decisão
});

// Tabela para métricas de engajamento
export const userEngagements = pgTable("user_engagements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  decisionId: integer("decision_id").references(() => decisions.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  actionType: varchar("action_type", { length: 50 }).notNull(), // 'define', 'criteria', 'alternatives', 'results', etc.
  duration: integer("duration"), // tempo gasto na ação em segundos
  stepIndex: integer("step_index"), // índice da etapa do processo AHP
});

// Tabela para feedback dos usuários
export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  decisionId: integer("decision_id").references(() => decisions.id), // tornando opcional
  utilityRating: integer("utility_rating").notNull(), // escala de 1-10
  testimonial: text("testimonial"), // depoimento opcional
  allowPublicDisplay: boolean("allow_public_display").default(false), // permissão para exibir depoimento
  createdAt: timestamp("created_at").defaultNow().notNull(),
  feedbackType: varchar("feedback_type", { length: 20 }).default("decision"), // "decision" ou "general"
});

// Tabela para estatísticas agregadas (atualizadas periodicamente)
export const aggregateMetrics = pgTable("aggregate_metrics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type", { length: 50 }).notNull(), // 'users_count', 'decisions_by_category', etc.
  metricValue: doublePrecision("metric_value").notNull(),
  metricDate: date("metric_date").notNull(),
  metricDetails: jsonb("metric_details"), // detalhes adicionais em formato JSON
});

// Types for AHP calculations
export type Criterion = {
  id: string;
  name: string;
};

export type Alternative = {
  id: string;
  name: string;
};

export type ComparisonMatrix = {
  matrix: number[][];
  priorities: number[];
  consistencyRatio: number;
};

export type AlternativeComparisons = {
  [criterionId: string]: ComparisonMatrix;
};

export type AHPDecision = {
  id?: number;
  name: string;
  criteria: Criterion[];
  alternatives: Alternative[];
  criteriaComparisons: ComparisonMatrix;
  alternativeComparisons: AlternativeComparisons;
  overallRanking?: { [alternativeId: string]: number };
  createdAt: string | Date;
  userId?: number | null;
  
  // Propriedades extras do DB (não expostas na API)
  criteriaJson?: string;
  alternativesJson?: string;
  criteriaComparisonsJson?: string;
  alternativeComparisonsJson?: string;
  overallRankingJson?: string | null;
};

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const criterionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Criterion name is required"),
});

export const alternativeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Alternative name is required"),
});

export const comparisonMatrixSchema = z.object({
  matrix: z.array(z.array(z.number())),
  priorities: z.array(z.number()),
  consistencyRatio: z.number(),
});

export const alternativeComparisonsSchema = z.record(comparisonMatrixSchema);

export const decisionSchema = z.object({
  name: z.string().min(1, "Decision name is required"),
  criteria: z.array(criterionSchema).min(2, "At least 2 criteria are required"),
  alternatives: z.array(alternativeSchema).min(2, "At least 2 alternatives are required"),
  criteriaComparisons: comparisonMatrixSchema,
  alternativeComparisons: alternativeComparisonsSchema,
  createdAt: z.union([z.string(), z.date(), z.instanceof(Date)]), // Aceita string ou Date
  userId: z.number().nullable().optional(),
});

export const insertDecisionSchema = createInsertSchema(decisions);

// Schemas para as novas entidades
export const feedbackSchema = z.object({
  decisionId: z.number().optional(),
  utilityRating: z.number().min(1).max(10),
  testimonial: z.string().optional(),
  allowPublicDisplay: z.boolean().default(false),
  feedbackType: z.enum(["decision", "general"]).default("general"),
});

export const insertFeedbackSchema = createInsertSchema(feedbacks).omit({
  id: true,
  createdAt: true
});

export const insertUserEngagementSchema = createInsertSchema(userEngagements).omit({
  id: true,
  timestamp: true
});

export const categoryType = z.enum([
  DECISION_CATEGORIES.EDUCATIONAL,
  DECISION_CATEGORIES.PROFESSIONAL,
  DECISION_CATEGORIES.PERSONAL,
  DECISION_CATEGORIES.OTHER
]);

export const updateDecisionSchema = z.object({
  category: categoryType.optional(),
  completionTime: z.number().optional(),
});

// Definição de relacionamentos para consultas mais eficientes
export const usersRelations = relations(users, ({ many }) => ({
  decisions: many(decisions),
  engagements: many(userEngagements),
  feedbacks: many(feedbacks)
}));

export const decisionsRelations = relations(decisions, ({ one, many }) => ({
  user: one(users, {
    fields: [decisions.userId],
    references: [users.id]
  }),
  feedbacks: many(feedbacks),
  engagements: many(userEngagements)
}));

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id]
  }),
  decision: one(decisions, {
    fields: [feedbacks.decisionId],
    references: [decisions.id]
  })
}));

export const userEngagementsRelations = relations(userEngagements, ({ one }) => ({
  user: one(users, {
    fields: [userEngagements.userId],
    references: [users.id]
  }),
  decision: one(decisions, {
    fields: [userEngagements.decisionId],
    references: [decisions.id]
  })
}));

// Tipos exportados
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDecision = z.infer<typeof insertDecisionSchema>;
export type Decision = typeof decisions.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbacks.$inferSelect;
export type InsertUserEngagement = z.infer<typeof insertUserEngagementSchema>;
export type UserEngagement = typeof userEngagements.$inferSelect;
export type AggregateMetric = typeof aggregateMetrics.$inferSelect;
export type DecisionCategory = z.infer<typeof categoryType>;
