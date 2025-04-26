import { users, type User, type InsertUser, decisions, type Decision, type InsertDecision, type AHPDecision } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private decisions: Map<number, AHPDecision>;
  private userId: number;
  private decisionId: number;

  constructor() {
    this.users = new Map();
    this.decisions = new Map();
    this.userId = 1;
    this.decisionId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Decision operations
  async getDecision(id: number): Promise<AHPDecision | undefined> {
    return this.decisions.get(id);
  }

  async getDecisions(userId?: number): Promise<AHPDecision[]> {
    const decisions = Array.from(this.decisions.values());
    if (userId) {
      return decisions.filter(decision => decision.userId === userId);
    }
    return decisions;
  }

  async createDecision(decision: AHPDecision): Promise<AHPDecision> {
    const id = this.decisionId++;
    const newDecision: AHPDecision = { ...decision, id };
    this.decisions.set(id, newDecision);
    return newDecision;
  }

  async updateDecision(id: number, decision: AHPDecision): Promise<AHPDecision | undefined> {
    if (!this.decisions.has(id)) {
      return undefined;
    }
    const updatedDecision: AHPDecision = { ...decision, id };
    this.decisions.set(id, updatedDecision);
    return updatedDecision;
  }

  async deleteDecision(id: number): Promise<boolean> {
    return this.decisions.delete(id);
  }
}

export const storage = new MemStorage();
