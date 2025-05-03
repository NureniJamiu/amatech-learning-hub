import { verifyAuthToken } from "@/lib/token";
import { NextRequest } from "next/server";

export const authenticateRequest = (
  req: NextRequest
): { userId: string } | null => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAuthToken(token);
  return decoded ?? null;
};
