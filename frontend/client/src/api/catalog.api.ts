import { apiClient } from "./client";

export type FoodCatalogItem = {
  id: string;
  name: string;
  category: string | null;
  rasa: string | null;
  dosha: string | null;
  calories: number | null;
};

export type AsanaCatalogItem = {
  id: string;
  name: string;
  category: string | null;
  ayurvedicProperties: string[];
  effectProfile: string[];
};

export type MedicineCatalogItem = {
  id: string;
  medicineName: string;
  herbsUsed: string[];
  ayurvedicProperties: string[];
  medicineType: string | null;
};

export type TreatmentCatalogResponse = {
  foods: FoodCatalogItem[];
  asanas: AsanaCatalogItem[];
  medicines: MedicineCatalogItem[];
};

export const catalogApi = {
  getTreatmentCatalogs: async (): Promise<TreatmentCatalogResponse> => {
    return apiClient.get("/catalogs/treatment") as any;
  },
};
