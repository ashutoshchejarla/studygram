import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertSourceSchema } from "@shared/schema";
import { generateQuestions, extractYouTubeTranscript } from "./services/gemini";
import { processPDF, processTextFile, validateFileType } from "./services/fileProcessor";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all sources
  app.get("/api/sources", async (req, res) => {
    try {
      const sources = await storage.getAllSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sources" });
    }
  });

  // Get questions for a source
  app.get("/api/sources/:sourceId/questions", async (req, res) => {
    try {
      const { sourceId } = req.params;
      const questions = await storage.getQuestionsBySourceId(sourceId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Get all questions across all sources
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Get only liked questions
  app.get("/api/questions/liked", async (req, res) => {
    try {
      const questions = await storage.getLikedQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch liked questions" });
    }
  });

  // Upload PDF file
  app.post("/api/upload/pdf", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file provided" });
      }

      if (!validateFileType(req.file.originalname, ['.pdf'])) {
        return res.status(400).json({ error: "Only PDF files are allowed" });
      }

      const content = await processPDF(req.file.path);
      const source = await storage.createSource({
        name: req.file.originalname,
        type: 'pdf',
        content
      });

      // Generate questions from the content
      const generatedQuestions = await generateQuestions(content, source.name);
      
      for (const q of generatedQuestions) {
        await storage.createQuestion({
          sourceId: source.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer
        });
      }

      res.json({ source, questionsGenerated: generatedQuestions.length });
    } catch (error) {
      console.error("PDF upload error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to process PDF" });
    }
  });

  // Upload text file
  app.post("/api/upload/text", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No text file provided" });
      }

      if (!validateFileType(req.file.originalname, ['.txt'])) {
        return res.status(400).json({ error: "Only text files are allowed" });
      }

      const content = await processTextFile(req.file.path);
      const source = await storage.createSource({
        name: req.file.originalname,
        type: 'text',
        content
      });

      // Generate questions from the content
      const generatedQuestions = await generateQuestions(content, source.name);
      
      for (const q of generatedQuestions) {
        await storage.createQuestion({
          sourceId: source.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer
        });
      }

      res.json({ source, questionsGenerated: generatedQuestions.length });
    } catch (error) {
      console.error("Text upload error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to process text file" });
    }
  });

  // Upload YouTube link
  app.post("/api/upload/youtube", async (req, res) => {
    try {
      const { url, name } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "YouTube URL is required" });
      }

      const content = await extractYouTubeTranscript(url);
      const source = await storage.createSource({
        name: name || `YouTube Video - ${new Date().toLocaleDateString()}`,
        type: 'youtube',
        content
      });

      // Generate questions from the content
      const generatedQuestions = await generateQuestions(content, source.name);
      
      for (const q of generatedQuestions) {
        await storage.createQuestion({
          sourceId: source.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer
        });
      }

      res.json({ source, questionsGenerated: generatedQuestions.length });
    } catch (error) {
      console.error("YouTube upload error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to process YouTube content" });
    }
  });

  // Toggle like on question
  app.patch("/api/questions/:questionId/like", async (req, res) => {
    try {
      const { questionId } = req.params;
      const question = await storage.toggleQuestionLike(questionId);
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to update question like status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
