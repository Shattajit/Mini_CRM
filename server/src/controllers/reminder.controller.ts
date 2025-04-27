import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// Create reminder
export const createReminder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) {
      res.status(400).json({ error: "Title and due date are required" });
      return;
    }

    const reminder = await prisma.reminder.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        description: req.body.description || null,
        clientId: req.body.clientId || null,
        projectId: req.body.projectId || null,
      },
      include: {
        client: { select: { name: true } },
        project: { select: { title: true } },
      },
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error("Create reminder error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "Unique constraint violation" });
        return;
      }
      if (error.code === "P2003") {
        res.status(400).json({ error: "Foreign key constraint failed" });
        return;
      }
    }

    res.status(500).json({
      error: "Failed to create reminder",
      details: getErrorMessage(error),
    });
  }
};

// Get all reminders
export const getReminders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { clientId, projectId, upcoming, completed } = req.query;

    const where: Prisma.ReminderWhereInput = {};
    if (clientId) where.clientId = clientId as string;
    if (projectId) where.projectId = projectId as string;
    if (completed) where.isCompleted = completed === "true";

    if (upcoming === "true") {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      where.dueDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        client: { select: { name: true } },
        project: { select: { title: true } },
      },
      orderBy: { dueDate: "asc" },
    });

    res.json(reminders);
  } catch (error) {
    console.error("Get reminders error:", error);
    res.status(500).json({
      error: "Failed to fetch reminders",
      details: getErrorMessage(error),
    });
  }
};

// Get single reminder
export const getReminderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reminder = await prisma.reminder.findUnique({
      where: { id: req.params.id },
      include: {
        client: { select: { name: true } },
        project: { select: { title: true } },
      },
    });

    if (!reminder) {
      res.status(404).json({ error: "Reminder not found" });
      return;
    }

    res.json(reminder);
  } catch (error) {
    console.error("Get reminder by ID error:", error);
    res.status(500).json({
      error: "Failed to fetch reminder",
      details: getErrorMessage(error),
    });
  }
};

// Update reminder
export const updateReminder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, isCompleted } = req.body;

    const updateData: Prisma.ReminderUpdateInput = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { name: true } },
        project: { select: { title: true } },
      },
    });

    res.json(updatedReminder);
  } catch (error) {
    console.error("Update reminder error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Reminder not found" });
        return;
      }
    }

    res.status(500).json({
      error: "Failed to update reminder",
      details: getErrorMessage(error),
    });
  }
};

// Delete reminder
export const deleteReminder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.reminder.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Delete reminder error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Reminder not found" });
        return;
      }
    }

    res.status(500).json({
      error: "Failed to delete reminder",
      details: getErrorMessage(error),
    });
  }
};

// Get reminders due this week
export const getRemindersDueThisWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the week (Sunday)
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay())); // End of the week (Saturday)

    // Filtering reminders due between the start and end of the week
    const reminders = await prisma.reminder.findMany({
      where: {
        dueDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      include: {
        client: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
      orderBy: { dueDate: "asc" },
    });

    res.status(200).json(reminders);
  } catch (error) {
    console.error("Get reminders due this week error:", error);
    res.status(500).json({
      error: "Failed to fetch reminders",
      details: getErrorMessage(error),
    });
  }
};
