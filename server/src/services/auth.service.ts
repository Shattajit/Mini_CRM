import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { generateToken } from "../utils/jwt";

export const AuthService = {
  async signup(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already in use");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    const token = generateToken(user.id);
    return { token };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const token = generateToken(user.id);
    return { token };
  },
};
