
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, serial, timestamp, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for login)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Patient Profiles
export const patientProfiles = pgTable("patient_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  weight: integer("weight"),
  height: integer("height"),
  email: text("email"),
  phone: text("phone"),
  dietary_habits: text("dietary_habits"),
  health_goals: jsonb("health_goals"),
  allergies: text("allergies"),
  chronic_conditions: jsonb("chronic_conditions"),
  prakriti: text("prakriti"),
  created_at: timestamp("created_at").defaultNow(),
});

// Meal Logs (match JSON structure)
export const mealLogs = pgTable("meal_logs", {
  id: integer("id").primaryKey(),
  patient_id: integer("patient_id").notNull(),
  date: text("date"),
  food_id: integer("food_id"),
  portion_grams: integer("portion_grams"),
  meal_type: text("meal_type"),
});

// Food Nutrition (split columns for project needs)
export const foodNutrition = pgTable("food_nutrition", {
  food_id: varchar("food_id").primaryKey(),
  name: text("name"),
  category: text("category"),
  serving_size: integer("serving_size"),
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fat: integer("fat"),
  vit_c: integer("vit_c"),
  iron: integer("iron"),
  preparation: text("preparation"),
  rasa: text("rasa"),
  virya: text("virya"),
  vipaka: text("vipaka"),
  gunas: text("gunas"),
  dosha_impact: text("dosha_impact"),
});

// Recommendations (match JSON structure)
export const recommendations = pgTable("recommendations", {
  id: integer("id").primaryKey(),
  patient_id: integer("patient_id").notNull(),
  generated_at: text("generated_at"),
  payload: jsonb("payload"),
  model_version: text("model_version"),
  verified_by_doctor: text("verified_by_doctor"),
});

// Recipes (match JSON structure)
export const recipes = pgTable("recipes", {
  recipe_id: integer("recipe_id").primaryKey(),
  name: text("name").notNull(),
  ingredients: jsonb("ingredients").notNull(),
  servings: integer("servings"),
  prep_time: text("prep_time"),
  instructions: text("instructions"),
});
