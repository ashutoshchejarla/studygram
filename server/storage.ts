import { type Source, type InsertSource, type Question, type InsertQuestion } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Source methods
  createSource(source: InsertSource): Promise<Source>;
  getAllSources(): Promise<Source[]>;
  getSourceById(id: string): Promise<Source | undefined>;

  // Question methods
  createQuestion(question: InsertQuestion): Promise<Question>;
  getAllQuestions(): Promise<Question[]>;
  getLikedQuestions(): Promise<Question[]>;
  getQuestionsBySourceId(sourceId: string): Promise<Question[]>;
  getQuestionById(id: string): Promise<Question | undefined>;
  toggleQuestionLike(id: string): Promise<Question>;
}

export class MemStorage implements IStorage {
  private sources: Map<string, Source>;
  private questions: Map<string, Question>;

  constructor() {
    this.sources = new Map();
    this.questions = new Map();
  }

  async createSource(insertSource: InsertSource): Promise<Source> {
    const id = randomUUID();
    const source: Source = { 
      ...insertSource, 
      id,
      createdAt: new Date()
    };
    this.sources.set(id, source);
    return source;
  }

  async getAllSources(): Promise<Source[]> {
    return Array.from(this.sources.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getSourceById(id: string): Promise<Source | undefined> {
    return this.sources.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      ...insertQuestion,
      id,
      liked: false,
      createdAt: new Date()
    };
    this.questions.set(id, question);
    return question;
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getLikedQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.liked)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getQuestionsBySourceId(sourceId: string): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.sourceId === sourceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async toggleQuestionLike(id: string): Promise<Question> {
    const question = this.questions.get(id);
    if (!question) {
      throw new Error("Question not found");
    }
    
    const updatedQuestion = { ...question, liked: !question.liked };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }
}

export const storage = new MemStorage();
