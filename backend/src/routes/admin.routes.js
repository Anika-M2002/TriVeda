import { Router } from "express";
import { createDoctor, getDepartments } from "../controllers/admin.controller.js";

const router = Router();
router.get("/departments", getDepartments);
router.post("/create-doctor", createDoctor);
export default router;