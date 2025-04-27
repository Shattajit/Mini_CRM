import express from "express";
import { login, signup } from "../controllers/auth.controller";
import { createClient } from "../controllers/auth.controller";
import {
  getClients,
  updateClient,
  deleteClient,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// CLIENT ROUTES
router.post("/clients", createClient);
router.get("/clients", getClients);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

export default router;
