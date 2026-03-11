import { type User, type InsertUser, users, patientProfiles } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Patient Profiles CRUD
  createPatientProfile(profile: Omit<typeof patientProfiles.$inferInsert, "id">): Promise<any>;
  getPatientProfile(id: number): Promise<any>;
  listPatientProfiles(): Promise<any[]>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createPatientProfile(profile: Omit<typeof patientProfiles.$inferInsert, "id">) {
    const [created] = await db.insert(patientProfiles).values(profile).returning();
    return created;
  }
  async getPatientProfile(id: number) {
    const [profile] = await db.select().from(patientProfiles).where(eq(patientProfiles.id, id));
    return profile;
  }
  async listPatientProfiles() {
    return db.select().from(patientProfiles);
  }
}

export const storage = new DrizzleStorage();
