import { users, type User, type InsertUser, decisions, type Decision, type InsertDecision, type AHPDecision } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Decision related operations
  getDecision(id: number): Promise<AHPDecision | undefined>;
  getDecisions(userId?: number): Promise<AHPDecision[]>;
  createDecision(decision: AHPDecision): Promise<AHPDecision>;
  updateDecision(id: number, decision: AHPDecision): Promise<AHPDecision | undefined>;
  deleteDecision(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getDecision(id: number): Promise<AHPDecision | undefined> {
    const [decision] = await db.select().from(decisions).where(eq(decisions.id, id));
    if (!decision) return undefined;
    
    // Parse the JSON fields
    return {
      ...decision,
      criteria: JSON.parse(decision.criteriaJson || '[]'),
      alternatives: JSON.parse(decision.alternativesJson || '[]'),
      criteriaComparisons: JSON.parse(decision.criteriaComparisonsJson || '{}'),
      alternativeComparisons: JSON.parse(decision.alternativeComparisonsJson || '{}'),
      overallRanking: decision.overallRankingJson ? JSON.parse(decision.overallRankingJson) : undefined,
      createdAt: typeof decision.createdAt === 'string' ? decision.createdAt : decision.createdAt.toString()
    };
  }

  async getDecisions(userId?: number): Promise<AHPDecision[]> {
    const query = userId 
      ? db.select().from(decisions).where(eq(decisions.userId, userId))
      : db.select().from(decisions);
      
    const decisionsData = await query;
    
    // Transform DB records to AHPDecision objects
    return decisionsData.map(decision => ({
      ...decision,
      criteria: JSON.parse(decision.criteriaJson || '[]'),
      alternatives: JSON.parse(decision.alternativesJson || '[]'),
      criteriaComparisons: JSON.parse(decision.criteriaComparisonsJson || '{}'),
      alternativeComparisons: JSON.parse(decision.alternativeComparisonsJson || '{}'),
      overallRanking: decision.overallRankingJson ? JSON.parse(decision.overallRankingJson) : undefined,
      createdAt: typeof decision.createdAt === 'string' ? decision.createdAt : decision.createdAt.toString()
    }));
  }

  async createDecision(decision: AHPDecision): Promise<AHPDecision> {
    // Prepare the decision data for database storage
    const insertData = {
      name: decision.name,
      criteriaJson: JSON.stringify(decision.criteria),
      alternativesJson: JSON.stringify(decision.alternatives),
      criteriaComparisonsJson: JSON.stringify(decision.criteriaComparisons),
      alternativeComparisonsJson: JSON.stringify(decision.alternativeComparisons),
      overallRankingJson: decision.overallRanking ? JSON.stringify(decision.overallRanking) : null,
      createdAt: typeof decision.createdAt === 'string' ? decision.createdAt : new Date().toISOString(),
      userId: decision.userId || null
    };

    const [newDecision] = await db
      .insert(decisions)
      .values(insertData)
      .returning();

    // Return the full AHPDecision object
    return {
      ...newDecision,
      criteria: decision.criteria,
      alternatives: decision.alternatives,
      criteriaComparisons: decision.criteriaComparisons,
      alternativeComparisons: decision.alternativeComparisons,
      overallRanking: decision.overallRanking,
      createdAt: typeof newDecision.createdAt === 'string' ? newDecision.createdAt : newDecision.createdAt.toString()
    };
  }

  async updateDecision(id: number, decision: AHPDecision): Promise<AHPDecision | undefined> {
    // Check if the decision exists
    const existing = await this.getDecision(id);
    if (!existing) return undefined;

    // Prepare the update data
    const updateData = {
      name: decision.name,
      criteriaJson: JSON.stringify(decision.criteria),
      alternativesJson: JSON.stringify(decision.alternatives),
      criteriaComparisonsJson: JSON.stringify(decision.criteriaComparisons),
      alternativeComparisonsJson: JSON.stringify(decision.alternativeComparisons),
      overallRankingJson: decision.overallRanking ? JSON.stringify(decision.overallRanking) : null
    };

    const [updated] = await db
      .update(decisions)
      .set(updateData)
      .where(eq(decisions.id, id))
      .returning();

    if (!updated) return undefined;

    // Return the full AHPDecision object
    return {
      ...updated,
      criteria: decision.criteria,
      alternatives: decision.alternatives,
      criteriaComparisons: decision.criteriaComparisons,
      alternativeComparisons: decision.alternativeComparisons,
      overallRanking: decision.overallRanking,
      createdAt: typeof updated.createdAt === 'string' ? updated.createdAt : updated.createdAt.toString()
    };
  }

  async deleteDecision(id: number): Promise<boolean> {
    const result = await db
      .delete(decisions)
      .where(eq(decisions.id, id))
      .returning({ id: decisions.id });
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();