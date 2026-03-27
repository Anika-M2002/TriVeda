import { prisma } from "../db/config.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getTreatmentCatalogs = asyncHandler(async (_req, res) => {
  const foodRows = await prisma.foods.findMany({
    orderBy: { food_name: "asc" },
    include: {
      ayurveda_props: {
        orderBy: { id: "asc" },
      },
    },
  });

  const foods = foodRows.map((food) => {
    const firstProp = food.ayurveda_props[0] || null;
    return {
      id: String(food.food_id),
      name: food.food_name || "Unnamed Food",
      category: food.category || null,
      rasa: firstProp?.rasa || null,
      dosha: firstProp?.dosha_impact || null,
      calories: typeof food.calories === "number" ? food.calories : null,
    };
  });

  const asanaRows = await prisma.asanas.findMany({
    where: { is_active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      ayurvedic_properties: true,
      effect_profile: true,
    },
  });

  const medicineRows = await prisma.medicines.findMany({
    where: { is_active: true },
    orderBy: { medicine_name: "asc" },
    select: {
      id: true,
      medicine_name: true,
      herbs_used: true,
      ayurvedic_properties: true,
      medicine_type: true,
    },
  });

  const asanas = asanaRows.map((asana) => ({
    id: asana.id,
    name: asana.name,
    category: asana.category || null,
    ayurvedicProperties: Array.isArray(asana.ayurvedic_properties)
      ? asana.ayurvedic_properties
      : [],
    effectProfile: Array.isArray(asana.effect_profile)
      ? asana.effect_profile
      : [],
  }));

  const medicines = medicineRows.map((medicine) => ({
    id: medicine.id,
    medicineName: medicine.medicine_name,
    herbsUsed: Array.isArray(medicine.herbs_used) ? medicine.herbs_used : [],
    ayurvedicProperties: Array.isArray(medicine.ayurvedic_properties)
      ? medicine.ayurvedic_properties
      : [],
    medicineType: medicine.medicine_type || null,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          foods,
          asanas,
          medicines,
        },
        "Treatment catalogs fetched."
      )
    );
});
