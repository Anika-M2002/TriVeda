import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Patient Profiles CRUD
  app.post("/api/patients", async (req: Request, res: Response) => {
    try {
      const created = await storage.createPatientProfile(req.body);
      res.status(201).json(created);
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  });

  app.get("/api/patients", async (_req: Request, res: Response) => {
    const patients = await storage.listPatientProfiles();
    res.json(patients);
  });

  app.get("/api/patients/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const patient = await storage.getPatientProfile(id);
    if (!patient) return res.status(404).json({ error: "Not found" });
    res.json(patient);
  });

  const httpServer = createServer(app);
  return httpServer;
}
