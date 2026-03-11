import { patientProfiles } from "../shared/schema.js";
async function seedPatientProfiles() {
  const file = path.join(__dirname, "../attached_assets/patient_profiles.json");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  for (const d of data) {
    await db.insert(patientProfiles).values({
      name: d.name,
      age: d.age,
      gender: d.gender,
      prakriti: d.prakriti,
      allergies: d.allergies,
      weight: d.weight,
      height: d.height,
      email: d.email,
      phone: d.phone,
      dietary_habits: d.dietary_habits,
      health_goals: d.health_goals,
      chronic_conditions: d.chronic_conditions,
      created_at: d.created_at ? new Date(d.created_at) : new Date(),
    });
  }
}

import 'dotenv/config';
import { db } from "../server/db.js";
import { foodNutrition, recipes, mealLogs, recommendations } from "../shared/schema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedFoodNutrition() {
  const file = path.join(__dirname, "../attached_assets/food_nutrition.json");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  for (const item of data) {
    // Map/transform as needed for your schema
    await db.insert(foodNutrition).values({
      food_id: item.food_id,
      name: item.name,
      category: item.category,
      serving_size: item.serving_size,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      vit_c: item.vit_c,
      iron: item.iron,
      preparation: item.preparation,
      rasa: item.rasa,
      virya: item.virya,
      vipaka: item.vipaka,
      gunas: item.gunas,
      dosha_impact: item.dosha_impact,
    });
  }
}

async function seedRecipes() {
  const file = path.join(__dirname, "../attached_assets/recipes.json");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  for (const item of data) {
    await db.insert(recipes).values({
      recipe_id: item.recipe_id,
      name: item.name,
      ingredients: item.ingredients,
      servings: item.data?.servings,
      prep_time: item.data?.prep_time,
      instructions: item.data?.instructions,
    });
  }
}

async function seedMealLogs() {
  const file = path.join(__dirname, "../attached_assets/meal_logs.json");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  for (const item of data) {
    await db.insert(mealLogs).values({
      id: item.id,
      patient_id: item.patient_id,
      date: item.date,
      food_id: item.food_id,
      portion_grams: item.portion_grams,
      meal_type: item.data?.meal_type,
    });
  }
}

async function seedRecommendations() {
  const file = path.join(__dirname, "../attached_assets/recommendations.json");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  for (const item of data) {
    await db.insert(recommendations).values({
      id: item.id,
      patient_id: item.patient_id,
      generated_at: item.generated_at,
      payload: item.payload,
      model_version: item.model_version,
      verified_by_doctor: String(item.verified_by_doctor),
    });
  }
}

async function main() {
  // Clear tables before seeding to avoid duplicate key errors
  await db.delete(recommendations);
  await db.delete(mealLogs);
  await db.delete(recipes);
  await db.delete(foodNutrition);
  await db.delete(patientProfiles);
  await seedFoodNutrition();
  await seedPatientProfiles();
  await seedRecipes();
  await seedMealLogs();
  await seedRecommendations();
  console.log("Seeding complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
