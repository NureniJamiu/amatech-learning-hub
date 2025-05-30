import { verifyAuthToken } from "@/utils/token";
import { NextRequest } from "next/server";

export const authenticateRequest = (
  req: NextRequest
): { userId: string } | null => {
  const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader) {
      console.warn("Missing Authorization header");
      return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
      console.warn("Malformed Authorization header:", authHeader);
      return null;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAuthToken(token);

  if (!decoded) {
      console.warn("Token verification failed");
  }

  return decoded ?? null;
};
