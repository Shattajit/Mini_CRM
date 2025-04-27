import express from "express";
import {
  createInteraction,
  getInteractions,
  updateInteraction,
  deleteInteraction,
} from "../controllers/interaction.controller";

const router = express.Router();

router.post("/", createInteraction);
router.get("/", getInteractions);
router.put("/:id", updateInteraction);
router.delete("/:id", deleteInteraction);

export default router;
