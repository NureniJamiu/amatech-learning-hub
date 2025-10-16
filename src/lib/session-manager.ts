/**
 * Session Manager
 * Handles session lifecycle including creation, validation, and cleanup
 */

import prisma from "@/lib/prisma";

export class SessionManager {
  /**
   * Create a new session in the database
   */
  static async createSession(
    userId: string,
    token: string,
    expiresInDays: number = 15
  ): Promise<void> {
    const expires = new Date();
    expires.setDate(expires.getDate() + expiresInDays);

    try {
      // Delete any existing sessions with the same token
      await prisma.session.deleteMany({
        where: { token },
      });

      // Create new session
      await prisma.session.create({
        data: {
          userId,
          token,
          expires,
        },
      });
    } catch (error) {
      console.error("[SessionManager] Failed to create session:", error);
      throw error;
    }
  }

  /**
   * Validate if a session exists and is not expired
   */
  static async validateSession(token: string): Promise<boolean> {
    try {
      const session = await prisma.session.findUnique({
        where: { token },
      });

      if (!session) {
        return false;
      }

      // Check if session is expired
      if (session.expires < new Date()) {
        // Delete expired session
        await prisma.session.delete({
          where: { token },
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("[SessionManager] Failed to validate session:", error);
      return false;
    }
  }

  /**
   * Invalidate a session (logout)
   */
  static async invalidateSession(token: string): Promise<void> {
    try {
      await prisma.session.deleteMany({
        where: { token },
      });
    } catch (error) {
      console.error("[SessionManager] Failed to invalidate session:", error);
      throw error;
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  static async invalidateAllUserSessions(userId: string): Promise<void> {
    try {
      await prisma.session.deleteMany({
        where: { userId },
      });
    } catch (error) {
      console.error("[SessionManager] Failed to invalidate user sessions:", error);
      throw error;
    }
  }

  /**
   * Clean up expired sessions
   * Should be run periodically (e.g., via cron job)
   */
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      const result = await prisma.session.deleteMany({
        where: {
          expires: {
            lt: new Date(),
          },
        },
      });

      console.log(`[SessionManager] Cleaned up ${result.count} expired sessions`);
      return result.count;
    } catch (error) {
      console.error("[SessionManager] Failed to cleanup expired sessions:", error);
      throw error;
    }
  }

  /**
   * Get active session count for a user
   */
  static async getUserSessionCount(userId: string): Promise<number> {
    try {
      return await prisma.session.count({
        where: {
          userId,
          expires: {
            gt: new Date(),
          },
        },
      });
    } catch (error) {
      console.error("[SessionManager] Failed to get user session count:", error);
      return 0;
    }
  }

  /**
   * Extend session expiration
   */
  static async extendSession(
    token: string,
    additionalDays: number = 15
  ): Promise<void> {
    try {
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + additionalDays);

      await prisma.session.update({
        where: { token },
        data: { expires: newExpiry },
      });
    } catch (error) {
      console.error("[SessionManager] Failed to extend session:", error);
      throw error;
    }
  }
}
