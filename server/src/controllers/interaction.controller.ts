import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const createInteraction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { date, interactionType, notes, clientId, projectId } = req.body;

    if (!interactionType || !clientId) {
      res
        .status(400)
        .json({ error: "Interaction type and client ID are required" });
      return;
    }

    const interaction = await prisma.interactionLog.create({
      data: {
        date: date ? new Date(date) : new Date(),
        interactionType,
        notes: notes || null,
        clientId,
        projectId: projectId || null,
      },
    });

    res.status(201).json(interaction);
  } catch (error) {
    console.error("Create interaction error:", error);

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
      error: "Failed to create interaction",
      details: getErrorMessage(error),
    });
  }
};

export const getInteractions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { clientId, projectId } = req.query;

    const where: Prisma.InteractionLogWhereInput = {};
    if (clientId) where.clientId = clientId as string;
    if (projectId) where.projectId = projectId as string;

    const interactions = await prisma.interactionLog.findMany({
      where,
      include: {
        client: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
      orderBy: { date: "desc" },
    });

    res.json(interactions);
  } catch (error) {
    console.error("Get interactions error:", error);
    res.status(500).json({
      error: "Failed to fetch interactions",
      details: getErrorMessage(error),
    });
  }
};

export const updateInteraction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, interactionType, notes } = req.body;

    const updateData: Prisma.InteractionLogUpdateInput = {};
    if (date) updateData.date = new Date(date);
    if (interactionType) updateData.interactionType = interactionType;
    if (notes !== undefined) updateData.notes = notes;

    const updatedInteraction = await prisma.interactionLog.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedInteraction);
  } catch (error) {
    console.error("Update interaction error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Interaction not found" });
        return;
      }
    }

    res.status(500).json({
      error: "Failed to update interaction",
      details: getErrorMessage(error),
    });
  }
};

export const deleteInteraction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.interactionLog.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Delete interaction error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Interaction not found" });
        return;
      }
    }

    res.status(500).json({
      error: "Failed to delete interaction",
      details: getErrorMessage(error),
    });
  }
};
