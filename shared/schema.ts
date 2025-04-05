import { pgTable, text, serial, integer, boolean, date, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const periodLogs = pgTable("period_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  flow: text("flow"),
  symptoms: text("symptoms").array(),
  mood: text("mood"),
  notes: text("notes"),
});

export const insertPeriodLogSchema = createInsertSchema(periodLogs).omit({
  id: true,
});

export const cycles = pgTable("cycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  periodLength: integer("period_length"),
  cycleLength: integer("cycle_length"),
});

export const insertCycleSchema = createInsertSchema(cycles).omit({
  id: true,
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'period', 'fertile', 'ovulation', 'medication', 'custom'
  timing: json("timing").notNull(), // { days: number, when: 'before'|'after'|'on' }
  time: text("time").notNull(), // HH:MM format
  message: text("message"),
  enabled: boolean("enabled").notNull().default(true),
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
});

// PCOS Detection schema
export const pcosDetections = pgTable("pcos_detections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url").notNull(),
  imageId: text("image_id").notNull(),
  pcosLikelihood: real("pcos_likelihood").notNull(),
  isPcos: boolean("is_pcos").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

export const insertPcosDetectionSchema = createInsertSchema(pcosDetections).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PeriodLog = typeof periodLogs.$inferSelect;
export type InsertPeriodLog = z.infer<typeof insertPeriodLogSchema>;

export type Cycle = typeof cycles.$inferSelect;
export type InsertCycle = z.infer<typeof insertCycleSchema>;

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

export type PcosDetection = typeof pcosDetections.$inferSelect;
export type InsertPcosDetection = z.infer<typeof insertPcosDetectionSchema>;

// Custom schemas for validation
export const periodLogFormSchema = z.object({
  date: z.union([z.string(), z.date()]),
  flow: z.enum(['light', 'medium', 'heavy', 'none']).optional(),
  symptoms: z.array(z.string()).optional(),
  mood: z.string().optional(),
  notes: z.string().optional(),
});

export const reminderFormSchema = z.object({
  type: z.enum(['period', 'fertile', 'ovulation', 'medication', 'custom']),
  timing: z.object({
    days: z.number(),
    when: z.enum(['before', 'after', 'on']),
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  message: z.string().optional(),
  enabled: z.boolean().default(true),
});

export const pcosDetectionFormSchema = z.object({
  notes: z.string().optional(),
});
