import { 
  users, 
  type User, 
  type InsertUser,
  periodLogs,
  type PeriodLog,
  type InsertPeriodLog,
  cycles,
  type Cycle,
  type InsertCycle,
  reminders,
  type Reminder,
  type InsertReminder
} from "@shared/schema";

import { eq, and, desc, or } from 'drizzle-orm';
import { db } from './db';

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Period logs methods
  getPeriodLogs(userId: number): Promise<PeriodLog[]>;
  getPeriodLogById(id: number): Promise<PeriodLog | undefined>;
  getPeriodLogByDate(userId: number, date: string): Promise<PeriodLog | undefined>;
  createPeriodLog(log: InsertPeriodLog): Promise<PeriodLog>;
  updatePeriodLog(id: number, log: Partial<PeriodLog>): Promise<PeriodLog | undefined>;
  deletePeriodLog(id: number): Promise<boolean>;
  
  // Cycles methods
  getCycles(userId: number): Promise<Cycle[]>;
  getCycleById(id: number): Promise<Cycle | undefined>;
  createCycle(cycle: InsertCycle): Promise<Cycle>;
  updateCycle(id: number, cycle: Partial<Cycle>): Promise<Cycle | undefined>;
  deleteCycle(id: number): Promise<boolean>;
  
  // Reminders methods
  getReminders(userId: number): Promise<Reminder[]>;
  getReminderById(id: number): Promise<Reminder | undefined>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<Reminder>): Promise<Reminder | undefined>;
  deleteReminder(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private periodLogs: Map<number, PeriodLog>;
  private cycles: Map<number, Cycle>;
  private reminders: Map<number, Reminder>;
  
  private userId: number;
  private periodLogId: number;
  private cycleId: number;
  private reminderId: number;

  constructor() {
    this.users = new Map();
    this.periodLogs = new Map();
    this.cycles = new Map();
    this.reminders = new Map();
    
    this.userId = 1;
    this.periodLogId = 1;
    this.cycleId = 1;
    this.reminderId = 1;
    
    // Add a default user
    this.createUser({
      username: 'default',
      password: 'password'
    });
    
    // Add some sample data
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    // Create a sample cycle
    this.createCycle({
      userId: 1,
      startDate: monthAgo.toISOString(),
      endDate: today.toISOString(),
      periodLength: 5,
      cycleLength: 28
    });
    
    // Create a sample reminder
    this.createReminder({
      userId: 1,
      type: 'period',
      timing: { days: 2, when: 'before' },
      time: '08:00',
      message: 'Your period is coming soon',
      enabled: true
    });
  }

  // User methods
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
  
  // Period logs methods
  async getPeriodLogs(userId: number): Promise<PeriodLog[]> {
    return Array.from(this.periodLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getPeriodLogById(id: number): Promise<PeriodLog | undefined> {
    return this.periodLogs.get(id);
  }
  
  async getPeriodLogByDate(userId: number, date: string): Promise<PeriodLog | undefined> {
    return Array.from(this.periodLogs.values()).find(
      log => log.userId === userId && log.date === date
    );
  }
  
  async createPeriodLog(log: InsertPeriodLog): Promise<PeriodLog> {
    const id = this.periodLogId++;
    const newLog: PeriodLog = { ...log, id };
    this.periodLogs.set(id, newLog);
    
    // Update cycle data automatically when logging periods
    this.updateCyclesFromPeriodLogs(log.userId);
    
    return newLog;
  }
  
  async updatePeriodLog(id: number, log: Partial<PeriodLog>): Promise<PeriodLog | undefined> {
    const existingLog = this.periodLogs.get(id);
    if (!existingLog) return undefined;
    
    const updatedLog = { ...existingLog, ...log };
    this.periodLogs.set(id, updatedLog);
    
    // Update cycle data when period logs change
    this.updateCyclesFromPeriodLogs(existingLog.userId);
    
    return updatedLog;
  }
  
  async deletePeriodLog(id: number): Promise<boolean> {
    const log = this.periodLogs.get(id);
    if (!log) return false;
    
    const deleted = this.periodLogs.delete(id);
    
    // Update cycle data when period logs are deleted
    if (deleted) {
      this.updateCyclesFromPeriodLogs(log.userId);
    }
    
    return deleted;
  }
  
  // Cycles methods
  async getCycles(userId: number): Promise<Cycle[]> {
    return Array.from(this.cycles.values())
      .filter(cycle => cycle.userId === userId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }
  
  async getCycleById(id: number): Promise<Cycle | undefined> {
    return this.cycles.get(id);
  }
  
  async createCycle(cycle: InsertCycle): Promise<Cycle> {
    const id = this.cycleId++;
    const newCycle: Cycle = { ...cycle, id };
    this.cycles.set(id, newCycle);
    return newCycle;
  }
  
  async updateCycle(id: number, cycle: Partial<Cycle>): Promise<Cycle | undefined> {
    const existingCycle = this.cycles.get(id);
    if (!existingCycle) return undefined;
    
    const updatedCycle = { ...existingCycle, ...cycle };
    this.cycles.set(id, updatedCycle);
    return updatedCycle;
  }
  
  async deleteCycle(id: number): Promise<boolean> {
    return this.cycles.delete(id);
  }
  
  // Reminders methods
  async getReminders(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values())
      .filter(reminder => reminder.userId === userId)
      .sort((a, b) => a.id - b.id);
  }
  
  async getReminderById(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }
  
  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const id = this.reminderId++;
    const newReminder: Reminder = { ...reminder, id };
    this.reminders.set(id, newReminder);
    return newReminder;
  }
  
  async updateReminder(id: number, reminder: Partial<Reminder>): Promise<Reminder | undefined> {
    const existingReminder = this.reminders.get(id);
    if (!existingReminder) return undefined;
    
    const updatedReminder = { ...existingReminder, ...reminder };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }
  
  async deleteReminder(id: number): Promise<boolean> {
    return this.reminders.delete(id);
  }
  
  // Helper functions
  private updateCyclesFromPeriodLogs(userId: number): void {
    const logs = Array.from(this.periodLogs.values())
      .filter(log => log.userId === userId && log.flow && log.flow !== 'none')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (logs.length === 0) return;
    
    // Group logs into cycles
    const cycleLogs: PeriodLog[][] = [];
    let currentCycleLogs: PeriodLog[] = [logs[0]];
    
    for (let i = 1; i < logs.length; i++) {
      const prevDate = new Date(logs[i-1].date);
      const currDate = new Date(logs[i].date);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If days are consecutive or within 2 days, they're part of the same period
      if (diffDays <= 2) {
        currentCycleLogs.push(logs[i]);
      } else {
        // Start a new cycle
        cycleLogs.push(currentCycleLogs);
        currentCycleLogs = [logs[i]];
      }
    }
    
    // Add the last cycle
    if (currentCycleLogs.length > 0) {
      cycleLogs.push(currentCycleLogs);
    }
    
    // Clear existing cycles for this user
    Array.from(this.cycles.values())
      .filter(cycle => cycle.userId === userId)
      .forEach(cycle => this.cycles.delete(cycle.id));
    
    // Create new cycles
    cycleLogs.forEach((periodLogs, index) => {
      const startDate = periodLogs[0].date;
      const endDate = periodLogs[periodLogs.length - 1].date;
      const periodLength = periodLogs.length;
      
      // Calculate cycle length based on the time between this cycle's start and the next cycle's start
      let cycleLength: number | undefined;
      if (index < cycleLogs.length - 1) {
        const nextCycleStart = new Date(cycleLogs[index + 1][0].date);
        const thisStart = new Date(startDate);
        cycleLength = Math.floor((nextCycleStart.getTime() - thisStart.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      this.createCycle({
        userId,
        startDate,
        endDate,
        periodLength,
        cycleLength
      });
    });
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Period logs methods
  async getPeriodLogs(userId: number): Promise<PeriodLog[]> {
    return await db
      .select()
      .from(periodLogs)
      .where(eq(periodLogs.userId, userId))
      .orderBy(desc(periodLogs.date));
  }

  async getPeriodLogById(id: number): Promise<PeriodLog | undefined> {
    const [log] = await db
      .select()
      .from(periodLogs)
      .where(eq(periodLogs.id, id));
    return log;
  }

  async getPeriodLogByDate(userId: number, date: string): Promise<PeriodLog | undefined> {
    const [log] = await db
      .select()
      .from(periodLogs)
      .where(
        and(
          eq(periodLogs.userId, userId),
          eq(periodLogs.date, date)
        )
      );
    return log;
  }

  async createPeriodLog(log: InsertPeriodLog): Promise<PeriodLog> {
    const [newLog] = await db
      .insert(periodLogs)
      .values({
        userId: log.userId,
        date: log.date,
        flow: log.flow || null,
        symptoms: log.symptoms || null,
        mood: log.mood || null,
        notes: log.notes || null
      })
      .returning();
    
    // Update cycle data
    await this.updateCyclesFromPeriodLogs(log.userId);
    
    return newLog;
  }

  async updatePeriodLog(id: number, updateData: Partial<PeriodLog>): Promise<PeriodLog | undefined> {
    const [log] = await db
      .select()
      .from(periodLogs)
      .where(eq(periodLogs.id, id));
    
    if (!log) return undefined;
    
    const [updatedLog] = await db
      .update(periodLogs)
      .set(updateData)
      .where(eq(periodLogs.id, id))
      .returning();
    
    // Update cycle data
    await this.updateCyclesFromPeriodLogs(log.userId);
    
    return updatedLog;
  }

  async deletePeriodLog(id: number): Promise<boolean> {
    const [log] = await db
      .select()
      .from(periodLogs)
      .where(eq(periodLogs.id, id));
    
    if (!log) return false;
    
    await db
      .delete(periodLogs)
      .where(eq(periodLogs.id, id));
    
    // Update cycle data
    await this.updateCyclesFromPeriodLogs(log.userId);
    
    return true;
  }

  // Cycles methods
  async getCycles(userId: number): Promise<Cycle[]> {
    return await db
      .select()
      .from(cycles)
      .where(eq(cycles.userId, userId))
      .orderBy(desc(cycles.startDate));
  }

  async getCycleById(id: number): Promise<Cycle | undefined> {
    const [cycle] = await db
      .select()
      .from(cycles)
      .where(eq(cycles.id, id));
    return cycle;
  }

  async createCycle(cycle: InsertCycle): Promise<Cycle> {
    const [newCycle] = await db
      .insert(cycles)
      .values({
        userId: cycle.userId,
        startDate: cycle.startDate,
        endDate: cycle.endDate || null,
        periodLength: cycle.periodLength || null,
        cycleLength: cycle.cycleLength || null
      })
      .returning();
    return newCycle;
  }

  async updateCycle(id: number, updateData: Partial<Cycle>): Promise<Cycle | undefined> {
    const [cycle] = await db
      .select()
      .from(cycles)
      .where(eq(cycles.id, id));
    
    if (!cycle) return undefined;
    
    const [updatedCycle] = await db
      .update(cycles)
      .set(updateData)
      .where(eq(cycles.id, id))
      .returning();
    
    return updatedCycle;
  }

  async deleteCycle(id: number): Promise<boolean> {
    const result = await db
      .delete(cycles)
      .where(eq(cycles.id, id))
      .returning({ deleted: cycles.id });
    
    return result.length > 0;
  }

  // Reminders methods
  async getReminders(userId: number): Promise<Reminder[]> {
    return await db
      .select()
      .from(reminders)
      .where(eq(reminders.userId, userId));
  }

  async getReminderById(id: number): Promise<Reminder | undefined> {
    const [reminder] = await db
      .select()
      .from(reminders)
      .where(eq(reminders.id, id));
    return reminder;
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [newReminder] = await db
      .insert(reminders)
      .values({
        userId: reminder.userId,
        type: reminder.type,
        timing: reminder.timing,
        time: reminder.time,
        message: reminder.message || null,
        enabled: reminder.enabled === undefined ? true : reminder.enabled
      })
      .returning();
    return newReminder;
  }

  async updateReminder(id: number, updateData: Partial<Reminder>): Promise<Reminder | undefined> {
    const [reminder] = await db
      .select()
      .from(reminders)
      .where(eq(reminders.id, id));
    
    if (!reminder) return undefined;
    
    const [updatedReminder] = await db
      .update(reminders)
      .set(updateData)
      .where(eq(reminders.id, id))
      .returning();
    
    return updatedReminder;
  }

  async deleteReminder(id: number): Promise<boolean> {
    const result = await db
      .delete(reminders)
      .where(eq(reminders.id, id))
      .returning({ deleted: reminders.id });
    
    return result.length > 0;
  }

  // Helper methods
  private async updateCyclesFromPeriodLogs(userId: number): Promise<void> {
    // Get all period logs for this user with flow
    const logs = await db
      .select()
      .from(periodLogs)
      .where(
        and(
          eq(periodLogs.userId, userId),
          or(
            eq(periodLogs.flow, "light"),
            eq(periodLogs.flow, "medium"),
            eq(periodLogs.flow, "heavy")
          )
        )
      )
      .orderBy(periodLogs.date);
    
    if (logs.length === 0) return;
    
    // Group logs into cycles
    const cycleLogs: PeriodLog[][] = [];
    let currentCycleLogs: PeriodLog[] = [logs[0]];
    
    for (let i = 1; i < logs.length; i++) {
      const prevDate = new Date(logs[i-1].date);
      const currDate = new Date(logs[i].date);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If days are consecutive or within 2 days, they're part of the same period
      if (diffDays <= 2) {
        currentCycleLogs.push(logs[i]);
      } else {
        // Start a new cycle
        cycleLogs.push(currentCycleLogs);
        currentCycleLogs = [logs[i]];
      }
    }
    
    // Add the last cycle
    if (currentCycleLogs.length > 0) {
      cycleLogs.push(currentCycleLogs);
    }
    
    // Delete existing cycles
    await db
      .delete(cycles)
      .where(eq(cycles.userId, userId));
    
    // Create new cycles
    for (let i = 0; i < cycleLogs.length; i++) {
      const periodLogs = cycleLogs[i];
      const startDate = periodLogs[0].date;
      const endDate = periodLogs[periodLogs.length - 1].date;
      const periodLength = periodLogs.length;
      
      // Calculate cycle length based on the time between this cycle's start and the next cycle's start
      let cycleLength: number | undefined;
      if (i < cycleLogs.length - 1) {
        const nextCycleStart = new Date(cycleLogs[i + 1][0].date);
        const thisStart = new Date(startDate);
        cycleLength = Math.floor((nextCycleStart.getTime() - thisStart.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      await this.createCycle({
        userId,
        startDate,
        endDate,
        periodLength,
        cycleLength
      });
    }
  }
}

// Initialize storage
let storage: IStorage;

try {
  // Try database storage
  const dbStorage = new DatabaseStorage();
  storage = dbStorage;
  console.log('Using database storage');
  
  // Seed with sample data for a better demo
  (async () => {
    try {
      // Check if we have a user
      const user = await storage.getUser(1);
      if (!user) {
        // Create default user
        await storage.createUser({
          username: 'default',
          password: 'password'
        });
      }
      
      // Check if we have any period logs
      const logs = await storage.getPeriodLogs(1);
      if (logs.length === 0) {
        // Add sample period data for the past 6 months
        const today = new Date();
        
        // Create 6 cycles (approximately 6 months of data)
        for (let i = 6; i >= 0; i--) {
          // Start date is roughly 28 days * i days ago
          const startDate = new Date(today);
          startDate.setDate(today.getDate() - (28 * i));
          
          // Create a 5-day period with varying flow
          const flows = ['light', 'medium', 'heavy', 'medium', 'light'] as const;
          const symptoms = [
            ['cramps', 'bloating', 'headache'],
            ['cramps', 'fatigue'],
            ['cramps', 'backache'],
            ['fatigue'],
            ['bloating']
          ];
          const moods = ['irritable', 'normal', 'emotional', 'tired', 'normal'];
          
          for (let day = 0; day < 5; day++) {
            const logDate = new Date(startDate);
            logDate.setDate(startDate.getDate() + day);
            
            await storage.createPeriodLog({
              userId: 1,
              date: logDate.toISOString().split('T')[0],
              flow: flows[day],
              symptoms: symptoms[day],
              mood: moods[day],
              notes: `Day ${day + 1} of period ${6 - i}`
            });
          }
        }
        
        console.log('Added sample period data');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  })();
  
} catch (error) {
  // Fallback to memory storage if database fails
  console.error('Database connection failed, using in-memory storage:', error);
  storage = new MemStorage();
}

// Export the storage implementation
export { storage };
