import { db } from "./db";
import { sql } from "drizzle-orm";
import { DECISION_CATEGORIES } from "@shared/schema";

async function runMigration() {
  console.log("Iniciando migração do banco de dados...");

  try {
    // Adicionando novas colunas à tabela de usuários
    console.log("Adicionando colunas à tabela users...");
    await db.execute(sql`
      ALTER TABLE IF EXISTS users 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE
    `);

    // Adicionando novas colunas à tabela de decisões
    console.log("Adicionando colunas à tabela decisions...");
    await db.execute(sql`
      ALTER TABLE IF EXISTS decisions 
      ADD COLUMN IF NOT EXISTS completion_time INTEGER,
      ADD COLUMN IF NOT EXISTS category VARCHAR(20) DEFAULT 'other'
    `);

    // Criando tabela de engajamento de usuários
    console.log("Criando tabela user_engagements...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_engagements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        decision_id INTEGER REFERENCES decisions(id),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        duration INTEGER,
        step_index INTEGER
      )
    `);

    // Criando tabela de feedback
    console.log("Criando tabela feedbacks...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        decision_id INTEGER NOT NULL REFERENCES decisions(id),
        utility_rating INTEGER NOT NULL,
        testimonial TEXT,
        allow_public_display BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    // Criando tabela de métricas agregadas
    console.log("Criando tabela aggregate_metrics...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS aggregate_metrics (
        id SERIAL PRIMARY KEY,
        metric_type VARCHAR(50) NOT NULL,
        metric_value DOUBLE PRECISION NOT NULL,
        metric_date DATE NOT NULL,
        metric_details JSONB,
        UNIQUE(metric_type, metric_date)
      )
    `);

    console.log("Migração concluída com sucesso!");
  } catch (error) {
    console.error("Erro durante a migração:", error);
  }
}

// Executa a migração
runMigration()
  .then(() => {
    console.log("Script de migração executado.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erro ao executar migração:", error);
    process.exit(1);
  });

export default runMigration;