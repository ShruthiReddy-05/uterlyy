import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertPeriodLogSchema, 
  periodLogFormSchema, 
  insertCycleSchema, 
  insertReminderSchema, 
  reminderFormSchema,
  insertPcosDetectionSchema,
  pcosDetectionFormSchema,
  PeriodLog
} from "@shared/schema";
import { generateChatResponse } from "./geminiService";
import { detectPCOS, loadModel, prepareModelDirectory, uploadToCloudinary } from "./pcosDetectionService";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // User endpoint (for testing or future authentication)
  app.get("/api/user", async (req: Request, res: Response) => {
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Period Logs endpoints
  app.get("/api/period-logs", async (req: Request, res: Response) => {
    // In a real app, get userId from authentication
    const userId = 1;
    const logs = await storage.getPeriodLogs(userId);
    res.json(logs);
  });
  
  app.get("/api/period-logs/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const log = await storage.getPeriodLogById(id);
    if (!log) {
      return res.status(404).json({ message: "Period log not found" });
    }
    
    res.json(log);
  });
  
  app.post("/api/period-logs", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = periodLogFormSchema.parse(req.body);
      
      // Convert to insert schema format with proper date handling
      // Use a type guard to narrow the type
      const date = typeof validatedData.date === 'string' 
        ? validatedData.date 
        : (validatedData.date as Date).toISOString();
        
      const periodLog = {
        userId: 1, // In a real app, get from authentication
        date,
        flow: validatedData.flow,
        symptoms: validatedData.symptoms,
        mood: validatedData.mood,
        notes: validatedData.notes
      };
      
      const validated = insertPeriodLogSchema.parse(periodLog);
      
      // Check if there's already a log for this date
      const existingLog = await storage.getPeriodLogByDate(validated.userId, validated.date);
      
      if (existingLog) {
        // Update existing log
        const updatedLog = await storage.updatePeriodLog(existingLog.id, validated);
        return res.json(updatedLog);
      }
      
      // Create new log
      const newLog = await storage.createPeriodLog(validated);
      res.status(201).json(newLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/period-logs/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      // Partial validation
      const validatedData = periodLogFormSchema.partial().parse(req.body);
      
      // Convert form data to storage data format
      const updateData: Record<string, any> = {};
      
      // Only add properties that exist in the validated data
      if (validatedData.date) {
        updateData.date = typeof validatedData.date === 'string' 
          ? validatedData.date 
          : (validatedData.date as Date).toISOString();
      }
      
      if (validatedData.flow !== undefined) {
        updateData.flow = validatedData.flow;
      }
      
      if (validatedData.symptoms !== undefined) {
        updateData.symptoms = validatedData.symptoms;
      }
      
      if (validatedData.mood !== undefined) {
        updateData.mood = validatedData.mood;
      }
      
      if (validatedData.notes !== undefined) {
        updateData.notes = validatedData.notes;
      }
      
      const updatedLog = await storage.updatePeriodLog(id, updateData);
      if (!updatedLog) {
        return res.status(404).json({ message: "Period log not found" });
      }
      
      res.json(updatedLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/period-logs/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const deleted = await storage.deletePeriodLog(id);
    if (!deleted) {
      return res.status(404).json({ message: "Period log not found" });
    }
    
    res.status(204).end();
  });
  
  // Cycles endpoints
  app.get("/api/cycles", async (req: Request, res: Response) => {
    // In a real app, get userId from authentication
    const userId = 1;
    const cycles = await storage.getCycles(userId);
    res.json(cycles);
  });
  
  app.get("/api/cycles/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const cycle = await storage.getCycleById(id);
    if (!cycle) {
      return res.status(404).json({ message: "Cycle not found" });
    }
    
    res.json(cycle);
  });
  
  app.post("/api/cycles", async (req: Request, res: Response) => {
    try {
      const validatedData = {
        ...req.body,
        userId: 1 // In a real app, get from authentication
      };
      
      const validated = insertCycleSchema.parse(validatedData);
      const newCycle = await storage.createCycle(validated);
      res.status(201).json(newCycle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/cycles/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const updatedCycle = await storage.updateCycle(id, req.body);
      if (!updatedCycle) {
        return res.status(404).json({ message: "Cycle not found" });
      }
      
      res.json(updatedCycle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/cycles/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const deleted = await storage.deleteCycle(id);
    if (!deleted) {
      return res.status(404).json({ message: "Cycle not found" });
    }
    
    res.status(204).end();
  });
  
  // Reminders endpoints
  app.get("/api/reminders", async (req: Request, res: Response) => {
    // In a real app, get userId from authentication
    const userId = 1;
    const reminders = await storage.getReminders(userId);
    res.json(reminders);
  });
  
  app.get("/api/reminders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const reminder = await storage.getReminderById(id);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    
    res.json(reminder);
  });
  
  app.post("/api/reminders", async (req: Request, res: Response) => {
    try {
      const validatedData = reminderFormSchema.parse(req.body);
      
      const reminder = {
        ...validatedData,
        userId: 1 // In a real app, get from authentication
      };
      
      const validated = insertReminderSchema.parse(reminder);
      const newReminder = await storage.createReminder(validated);
      res.status(201).json(newReminder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/reminders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      // Validate partial update
      const validatedData = reminderFormSchema.partial().parse(req.body);
      
      const updatedReminder = await storage.updateReminder(id, validatedData);
      if (!updatedReminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      res.json(updatedReminder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/reminders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const deleted = await storage.deleteReminder(id);
    if (!deleted) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    
    res.status(204).end();
  });

  // Configure multer for image uploads
  const upload = multer({
    dest: './uploads/',
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (acceptedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .jpg, .jpeg and .png formats are allowed'));
      }
    }
  });

  // PCOS Detection endpoints
  app.get("/api/pcos-detections", async (req: Request, res: Response) => {
    // In a real app, get userId from authentication
    const userId = 1;
    const detections = await storage.getPcosDetections(userId);
    res.json(detections);
  });
  
  app.get("/api/pcos-detections/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const detection = await storage.getPcosDetectionById(id);
    if (!detection) {
      return res.status(404).json({ message: "PCOS detection not found" });
    }
    
    res.json(detection);
  });
  
  // Initialize the TensorFlow model when the server starts
  prepareModelDirectory()
    .then(() => loadModel())
    .then(() => console.log("PCOS detection model loaded successfully"))
    .catch(err => console.error("Failed to load PCOS detection model:", err));
  
  app.post("/api/pcos-detections", upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      const imagePath = req.file.path;
      const notes = req.body.notes;
      
      // Validate notes if provided
      if (notes) {
        pcosDetectionFormSchema.parse({ notes });
      }
      
      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(imagePath);
      
      if (!cloudinaryResult) {
        return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
      }
      
      // Detect PCOS from the image
      const detectionResult = await detectPCOS(imagePath);
      
      if (!detectionResult) {
        return res.status(500).json({ message: "Failed to analyze image for PCOS" });
      }
      
      // Create the detection record
      const pcosDetection = {
        userId: 1, // In a real app, get from authentication
        imageUrl: cloudinaryResult.secure_url,
        imageId: cloudinaryResult.public_id,
        pcosLikelihood: detectionResult.pcosLikelihood,
        isPcos: detectionResult.isPcos,
        notes: notes || null
      };
      
      const validated = insertPcosDetectionSchema.parse(pcosDetection);
      const newDetection = await storage.createPcosDetection(validated);
      
      // Clean up the temporary file
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete temporary file:", err);
      });
      
      res.status(201).json(newDetection);
    } catch (error) {
      // Clean up the temporary file if it exists
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      
      console.error("Error in PCOS detection endpoint:", error);
      res.status(500).json({
        message: "Could not process PCOS detection request",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  app.delete("/api/pcos-detections/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const deleted = await storage.deletePcosDetection(id);
    if (!deleted) {
      return res.status(404).json({ message: "PCOS detection not found" });
    }
    
    res.status(204).end();
  });

  // Chat assistant endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const chatRequestSchema = z.object({
        query: z.string(),
        chatHistory: z.array(
          z.object({
            role: z.enum(['user', 'bot']),
            content: z.string()
          })
        )
      });
      
      const { query, chatHistory } = chatRequestSchema.parse(req.body);
      
      // Get period data for the user
      const userId = 1; // In a real app, get from authentication
      const periodLogs = await storage.getPeriodLogs(userId);
      const cycles = await storage.getCycles(userId);
      
      const periodData = {
        periodLogs,
        cycles
      };
      
      // Generate response using Gemini
      const response = await generateChatResponse(
        periodData,
        query,
        chatHistory
      );
      
      // Return response
      res.json({ 
        response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request format",
          details: error.errors 
        });
      }
      res.status(500).json({ 
        message: "Could not process chat request",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
