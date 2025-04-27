import express from "express";
import {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  getRemindersDueThisWeek,
} from "../controllers/reminder.controller";

const router = express.Router();

router.post("/", createReminder);
router.get("/", getReminders);
router.get("/:id", getReminderById);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);
router.get("/due-this-week", getRemindersDueThisWeek);

export default router;
