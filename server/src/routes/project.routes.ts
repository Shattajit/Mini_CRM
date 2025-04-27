import { Router } from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";

const router = Router();

// Project routes
router.post("/", createProject); // POST /api/projects
router.get("/", getProjects); // GET /api/projects
router.put("/:id", updateProject); // PUT /api/projects/:id
router.delete("/:id", deleteProject); // DELETE /api/projects/:id

export default router;
