import { Router } from "express";
import { getTreatmentCatalogs } from "../controllers/catalog.controller.js";

const router = Router();

router.get("/treatment", getTreatmentCatalogs);

export default router;
