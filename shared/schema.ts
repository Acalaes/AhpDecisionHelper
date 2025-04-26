import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table from original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// AHP Decision Problem table
export const decisions = pgTable("decisions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  criteria: jsonb("criteria").notNull(),
  alternatives: jsonb("alternatives").notNull(),
  criteriaComparisons: jsonb("criteria_comparisons").notNull(),
  alternativeComparisons: jsonb("alternative_comparisons").notNull(),
  createdAt: text("created_at").notNull(),
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
  createdAt: string;
  userId?: number;
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
  createdAt: z.string(),
  userId: z.number().optional(),
});

export const insertDecisionSchema = createInsertSchema(decisions);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDecision = z.infer<typeof insertDecisionSchema>;
export type Decision = typeof decisions.$inferSelect;
