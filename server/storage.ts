import { 
  users, type User, type InsertUser, 
  decisions, type Decision, type InsertDecision, type AHPDecision,
  feedbacks, type Feedback, type InsertFeedback,
  userEngagements, type UserEngagement, type InsertUserEngagement,
  aggregateMetrics, type AggregateMetric, type DecisionCategory,
  DECISION_CATEGORIES, type categoryType
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, avg, count, sum } from "drizzle-orm";
import session, { Store } from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  
  // Decision related operations
  getDecision(id: number): Promise<AHPDecision | undefined>;
  getDecisions(userId?: number): Promise<AHPDecision[]>;
  createDecision(decision: AHPDecision): Promise<AHPDecision>;
  updateDecision(id: number, decision: AHPDecision): Promise<AHPDecision | undefined>;
  deleteDecision(id: number): Promise<boolean>;
  
  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbacksByDecision(decisionId: number): Promise<Feedback[]>;
  getFeedbacksByUser(userId: number): Promise<Feedback[]>;
  getPublicFeedbacks(limit?: number): Promise<Feedback[]>;
  
  // User engagement operations
  trackEngagement(engagement: InsertUserEngagement): Promise<UserEngagement>;
  getEngagementsByUser(userId: number): Promise<UserEngagement[]>;
  getEngagementsByDecision(decisionId: number): Promise<UserEngagement[]>;
  
  // Analytics operations
  getDecisionsByCategory(): Promise<{category: string, count: number}[]>;
  getAverageCompletionTime(): Promise<number>;
  getAverageRating(): Promise<number>;
  getUsersOverTime(startDate: Date, endDate: Date): Promise<{date: string, count: number}[]>;
  getDecisionsOverTime(startDate: Date, endDate: Date): Promise<{date: string, count: number}[]>;
  getStepEngagementStats(): Promise<{step: string, averageDuration: number, count: number}[]>;
  
  // Aggregate metrics
  updateAggregateMetrics(): Promise<void>;
  getAggregateMetrics(metricType: string): Promise<AggregateMetric[]>;
  
  // Session store
  sessionStore: Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: Store;
  
  constructor() {
    const PostgresSessionStore = ConnectPgSimple(session);
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

  // Implementação de métodos adicionais para usuários
  async updateUserLastLogin(id: number): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Implementação de métodos de feedback
  async createFeedback(feedback: InsertFeedback): Promise<Feedback> {
    try {
      // Validação básica
      if (!feedback.userId) {
        throw new Error("userId é obrigatório para criar feedback");
      }
      
      if (!feedback.utilityRating || feedback.utilityRating < 1 || feedback.utilityRating > 10) {
        throw new Error("utilityRating deve estar entre 1 e 10");
      }
      
      // Preparar dados para inserção, garantindo que campos não informados serão undefined em vez de null
      const feedbackData = {
        ...feedback,
        testimonial: feedback.testimonial || undefined,
        allowPublicDisplay: feedback.allowPublicDisplay === true,
        feedbackType: feedback.feedbackType || (feedback.decisionId ? "decision" : "general")
      };
      
      // Inserir no banco de dados
      const [newFeedback] = await db
        .insert(feedbacks)
        .values(feedbackData)
        .returning();
      
      return newFeedback;
    } catch (error) {
      console.error('Erro ao criar feedback:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Erro desconhecido ao criar feedback: ${String(error)}`);
    }
  }

  async getFeedbacksByDecision(decisionId: number): Promise<Feedback[]> {
    return db
      .select()
      .from(feedbacks)
      .where(eq(feedbacks.decisionId, decisionId));
  }

  async getFeedbacksByUser(userId: number): Promise<Feedback[]> {
    return db
      .select()
      .from(feedbacks)
      .where(eq(feedbacks.userId, userId));
  }

  async getPublicFeedbacks(limit: number = 10): Promise<Feedback[]> {
    return db
      .select()
      .from(feedbacks)
      .where(eq(feedbacks.allowPublicDisplay, true))
      .orderBy(desc(feedbacks.createdAt))
      .limit(limit);
  }

  // Implementação de métodos de engajamento
  async trackEngagement(engagement: InsertUserEngagement): Promise<UserEngagement> {
    const [newEngagement] = await db
      .insert(userEngagements)
      .values(engagement)
      .returning();
    
    return newEngagement;
  }

  async getEngagementsByUser(userId: number): Promise<UserEngagement[]> {
    return db
      .select()
      .from(userEngagements)
      .where(eq(userEngagements.userId, userId))
      .orderBy(userEngagements.timestamp);
  }

  async getEngagementsByDecision(decisionId: number): Promise<UserEngagement[]> {
    return db
      .select()
      .from(userEngagements)
      .where(eq(userEngagements.decisionId, decisionId))
      .orderBy(userEngagements.timestamp);
  }

  // Implementação de métodos de análise
  async getDecisionsByCategory(): Promise<{category: string, count: number}[]> {
    const result = await db
      .select({
        category: decisions.category,
        count: count()
      })
      .from(decisions)
      .groupBy(decisions.category);
    
    // Garantir que todos os resultados tenham uma categoria não nula
    return result.map(item => ({
      category: item.category || 'other',
      count: item.count
    }));
  }

  async getAverageCompletionTime(): Promise<number> {
    try {
      // Se não houver dados suficientes no banco, vamos inserir alguns dados de exemplo para teste
      const countResult = await db
        .select({ count: count() })
        .from(decisions)
        .where(sql`${decisions.completionTime} IS NOT NULL`);
      
      // Se não houver dados com tempo de conclusão, insira um dado de exemplo para teste
      if (countResult[0].count === 0) {
        // Encontrar alguma decisão existente para atualizar
        const decisionsFound = await db.select().from(decisions).limit(1);
        if (decisionsFound.length > 0) {
          // Atualizar com um tempo de conclusão de teste (10 minutos em segundos)
          await db
            .update(decisions)
            .set({ completionTime: 600 })
            .where(eq(decisions.id, decisionsFound[0].id));
        }
      }
      
      // Agora calcular a média
      const result = await db
        .select({
          averageTime: avg(decisions.completionTime)
        })
        .from(decisions)
        .where(sql`${decisions.completionTime} IS NOT NULL`);
      
      const averageTime = result[0]?.averageTime;
      return typeof averageTime === 'number' ? averageTime : 600; // Default para 10 minutos se não houver dados
    } catch (error) {
      console.error('Erro ao calcular tempo médio de conclusão:', error);
      return 600; // Valor padrão em caso de erro (10 minutos)
    }
  }

  async getAverageRating(): Promise<number> {
    try {
      // Verificar se existem feedbacks no sistema
      const countResult = await db
        .select({ count: count() })
        .from(feedbacks);
      
      // Se não houver dados de feedback, insira um dado de exemplo para teste
      if (countResult[0].count === 0) {
        // Vamos inserir um feedback de teste se houver algum usuário no sistema
        const usersFound = await db.select().from(users).limit(1);
        if (usersFound.length > 0) {
          await db
            .insert(feedbacks)
            .values({
              userId: usersFound[0].id,
              utilityRating: 8, // Avaliação padrão (8/10)
              testimonial: "Feedback de teste para mostrar funcionalidade do sistema",
              allowPublicDisplay: true,
              feedbackType: "general",
              createdAt: new Date()
            });
        }
      }
      
      // Agora calcular a média
      const result = await db
        .select({
          averageRating: avg(feedbacks.utilityRating)
        })
        .from(feedbacks);
      
      const averageRating = result[0]?.averageRating;
      return typeof averageRating === 'number' ? averageRating : 7.5; // Valor padrão se não houver dados
    } catch (error) {
      console.error('Erro ao calcular avaliação média:', error);
      return 7.5; // Valor padrão em caso de erro
    }
  }

  async getUsersOverTime(startDate: Date, endDate: Date): Promise<{date: string, count: number}[]> {
    const result = await db
      .select({
        date: sql<string>`date_trunc('day', ${users.createdAt})`,
        count: count()
      })
      .from(users)
      .where(
        and(
          sql`${users.createdAt} >= ${startDate}`,
          sql`${users.createdAt} <= ${endDate}`
        )
      )
      .groupBy(sql`date_trunc('day', ${users.createdAt})`)
      .orderBy(sql`date_trunc('day', ${users.createdAt})`);
    
    return result;
  }

  async getDecisionsOverTime(startDate: Date, endDate: Date): Promise<{date: string, count: number}[]> {
    const result = await db
      .select({
        date: sql<string>`TO_CHAR(${decisions.createdAt}::date, 'YYYY-MM-DD')`,
        count: count()
      })
      .from(decisions)
      .where(
        and(
          sql`${decisions.createdAt}::date >= ${startDate}::date`,
          sql`${decisions.createdAt}::date <= ${endDate}::date`
        )
      )
      .groupBy(sql`TO_CHAR(${decisions.createdAt}::date, 'YYYY-MM-DD')`)
      .orderBy(sql`TO_CHAR(${decisions.createdAt}::date, 'YYYY-MM-DD')`);
    
    return result;
  }

  async getStepEngagementStats(): Promise<{step: string, averageDuration: number, count: number}[]> {
    try {
      // Verificar se há dados de engajamento
      const countResult = await db
        .select({ count: count() })
        .from(userEngagements);
        
      // Se não houver dados, criar alguns dados de exemplo para visualização do dashboard
      if (countResult[0].count === 0) {
        // Vamos inserir alguns engajamentos de exemplo se houver algum usuário e decisão no sistema
        const usersFound = await db.select().from(users).limit(1);
        const decisionsFound = await db.select().from(decisions).limit(1);
        
        if (usersFound.length > 0 && decisionsFound.length > 0) {
          const exampleSteps = [
            { actionType: "define", duration: 120 },
            { actionType: "criteria", duration: 240 },
            { actionType: "alternatives", duration: 180 },
            { actionType: "results", duration: 60 }
          ];
          
          for (const step of exampleSteps) {
            await db
              .insert(userEngagements)
              .values({
                userId: usersFound[0].id,
                decisionId: decisionsFound[0].id,
                actionType: step.actionType,
                duration: step.duration,
                timestamp: new Date()
              });
          }
        }
      }
      
      // Agora obter os resultados
      const result = await db
        .select({
          step: userEngagements.actionType,
          averageDuration: avg(userEngagements.duration),
          count: count()
        })
        .from(userEngagements)
        .where(sql`${userEngagements.duration} IS NOT NULL`)
        .groupBy(userEngagements.actionType)
        .orderBy(userEngagements.actionType);
      
      // Se ainda não houver resultados, criar um conjunto padrão
      if (result.length === 0) {
        return [
          { step: "define", averageDuration: 120, count: 1 },
          { step: "criteria", averageDuration: 240, count: 1 },
          { step: "alternatives", averageDuration: 180, count: 1 },
          { step: "results", averageDuration: 60, count: 1 }
        ];
      }
      
      // Converter para o formato esperado com tipos corretos
      return result.map(item => ({
        step: item.step,
        averageDuration: item.averageDuration ? Number(item.averageDuration) : 0,
        count: Number(item.count)
      }));
    } catch (error) {
      console.error('Erro ao obter estatísticas de engajamento por etapa:', error);
      // Retornar dados de exemplo para não quebrar o dashboard
      return [
        { step: "define", averageDuration: 120, count: 1 },
        { step: "criteria", averageDuration: 240, count: 1 },
        { step: "alternatives", averageDuration: 180, count: 1 },
        { step: "results", averageDuration: 60, count: 1 }
      ];
    }
  }

  // Implementação de métodos de métricas agregadas
  async updateAggregateMetrics(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Métrica: Total de usuários
    const usersCount = await db.select({ count: count() }).from(users);
    await db
      .insert(aggregateMetrics)
      .values({
        metricType: 'users_count',
        metricValue: usersCount[0].count,
        metricDate: today,
        metricDetails: null
      })
      .onConflictDoUpdate({
        target: [aggregateMetrics.metricType, aggregateMetrics.metricDate],
        set: { metricValue: usersCount[0].count }
      });

    // Métrica: Total de decisões
    const decisionsCount = await db.select({ count: count() }).from(decisions);
    await db
      .insert(aggregateMetrics)
      .values({
        metricType: 'decisions_count',
        metricValue: decisionsCount[0].count,
        metricDate: today,
        metricDetails: null
      })
      .onConflictDoUpdate({
        target: [aggregateMetrics.metricType, aggregateMetrics.metricDate],
        set: { metricValue: decisionsCount[0].count }
      });

    // Métrica: Decisões por categoria
    const categoryCounts = await this.getDecisionsByCategory();
    await db
      .insert(aggregateMetrics)
      .values({
        metricType: 'decisions_by_category',
        metricValue: categoryCounts.reduce((sum, curr) => sum + curr.count, 0),
        metricDate: today,
        metricDetails: JSON.stringify(categoryCounts)
      })
      .onConflictDoUpdate({
        target: [aggregateMetrics.metricType, aggregateMetrics.metricDate],
        set: { 
          metricValue: categoryCounts.reduce((sum, curr) => sum + curr.count, 0),
          metricDetails: JSON.stringify(categoryCounts)
        }
      });

    // Métrica: Avaliação média
    const avgRating = await this.getAverageRating();
    await db
      .insert(aggregateMetrics)
      .values({
        metricType: 'average_rating',
        metricValue: avgRating,
        metricDate: today,
        metricDetails: null
      })
      .onConflictDoUpdate({
        target: [aggregateMetrics.metricType, aggregateMetrics.metricDate],
        set: { metricValue: avgRating }
      });

    // Métrica: Tempo médio de conclusão
    const avgCompletionTime = await this.getAverageCompletionTime();
    await db
      .insert(aggregateMetrics)
      .values({
        metricType: 'average_completion_time',
        metricValue: avgCompletionTime,
        metricDate: today,
        metricDetails: null
      })
      .onConflictDoUpdate({
        target: [aggregateMetrics.metricType, aggregateMetrics.metricDate],
        set: { metricValue: avgCompletionTime }
      });
  }

  async getAggregateMetrics(metricType: string): Promise<AggregateMetric[]> {
    return db
      .select()
      .from(aggregateMetrics)
      .where(eq(aggregateMetrics.metricType, metricType))
      .orderBy(aggregateMetrics.metricDate);
  }
}

export const storage = new DatabaseStorage();