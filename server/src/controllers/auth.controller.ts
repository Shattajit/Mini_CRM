import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { prisma } from "../prisma";

import express from "express";

const app = express();
app.use(express.json());

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signup(req: Request, res: Response) {
  try {
    console.log("Received body:", req.body);
    const { email, password } = AuthSchema.parse(req.body); // Validating the input using zod
    console.log(email, password);

    const result = await AuthService.signup(email, password);
    res.status(201).json(result);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = AuthSchema.parse(req.body);
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function createClient(req: Request, res: Response) {
  try {
    const { name, email, phone, company, notes } = req.body;

    // Validation
    if (!name || !email || !phone) {
      res.status(400).json({ error: "Name, email, and phone are required." });
      return;
    }

    // Create new client
    const newClient = await prisma.client.create({
      data: { name, email, phone, company, notes },
    });

    // Return success response
    res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create client" });
  }
}

export async function getClients(req: Request, res: Response) {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
}

export async function updateClient(req: Request, res: Response) {
  const { id } = req.params;
  const { name, email, phone, company, notes } = req.body;

  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data: { name, email, phone, company, notes },
    });

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: "Failed to update client" });
  }
}

export async function deleteClient(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.client.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete client" });
  }
}
