import { Request } from "express";

export interface DecodedToken {
  uid: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: DecodedToken;
}
