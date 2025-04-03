import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      uid: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };
  }
}

export type AuthRequest = Request;
