import { NextRequest } from "next/server";

// Extend the NextRequest interface to include the `user` property
declare global {
  namespace NodeJS {
    interface Global {
      user: { userId: string };
    }
  }
}

declare module "next/server" {
  interface NextRequest {
    user?: { userId: string };
  }
}
