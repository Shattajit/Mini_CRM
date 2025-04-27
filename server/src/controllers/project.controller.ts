import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function createProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { title, budget, deadline, status, clientId } = req.body;

    if (!title || budget === undefined || !deadline || !status || !clientId) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const parsedBudget =
      typeof budget === "string" ? parseFloat(budget) : budget;
    if (isNaN(parsedBudget)) {
      res.status(400).json({ error: "Budget must be a valid number." });
      return;
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      res.status(400).json({ error: "Deadline must be a valid date." });
      return;
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        budget: parsedBudget,
        deadline: parsedDeadline,
        status,
        clientId,
      },
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
}

export async function getProjects(req: Request, res: Response): Promise<void> {
  try {
    const projects = await prisma.project.findMany({
      include: { client: true },
    });
    res.json(projects);
  } catch (error) {
    console.error("Get Projects Error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}

export async function updateProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { title, budget, deadline, status } = req.body;

    if (!id) {
      res.status(400).json({ error: "Project ID is required." });
      return;
    }

    const data: any = {};

    if (title !== undefined) data.title = title;
    if (budget !== undefined) {
      const parsedBudget =
        typeof budget === "string" ? parseFloat(budget) : budget;
      if (isNaN(parsedBudget)) {
        res.status(400).json({ error: "Budget must be a valid number." });
        return;
      }
      data.budget = parsedBudget;
    }
    if (deadline !== undefined) {
      const parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline.getTime())) {
        res.status(400).json({ error: "Deadline must be a valid date." });
        return;
      }
      data.deadline = parsedDeadline;
    }
    if (status !== undefined) data.status = status;

    const updatedProject = await prisma.project.update({
      where: { id },
      data,
    });

    res.json(updatedProject);
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
}

export async function deleteProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Project ID is required." });
      return;
    }

    await prisma.project.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
}
