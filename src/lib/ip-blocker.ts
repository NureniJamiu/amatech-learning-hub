import prisma from '@/lib/prisma';

export interface IPBlockResult {
  isBlocked: boolean;
  reason?: string;
  expiresAt?: Date;
}

export class IPBlocker {
  /**
   * Check if an IP address is blocked
   */
  static async isBlocked(ipAddress: string): Promise<IPBlockResult> {
    try {
      const block = await prisma.iPBlock.findFirst({
        where: {
          ipAddress,
          isActive: true,
          OR: [
            { expiresAt: null }, // Permanent block
            { expiresAt: { gt: new Date() } }, // Temporary block not expired
          ],
        },
      });

      if (!block) {
        return { isBlocked: false };
      }

      return {
        isBlocked: true,
        reason: block.reason,
        expiresAt: block.expiresAt || undefined,
      };
    } catch (error) {
      console.error('Error checking IP block:', error);
      // On error, don't block (fail open)
      return { isBlocked: false };
    }
  }

  /**
   * Block an IP address
   */
  static async blockIP(
    ipAddress: string,
    reason: string,
    durationMs?: number
  ): Promise<void> {
    try {
      const expiresAt = durationMs 
        ? new Date(Date.now() + durationMs) 
        : null;

      await prisma.iPBlock.upsert({
        where: { ipAddress },
        create: {
          ipAddress,
          reason,
          expiresAt,
          isActive: true,
          failedCount: 1,
        },
        update: {
          reason,
          expiresAt,
          isActive: true,
          failedCount: { increment: 1 },
          blockedAt: new Date(),
        },
      });

      console.log(`IP ${ipAddress} blocked: ${reason}`);
    } catch (error) {
      console.error('Error blocking IP:', error);
    }
  }

  /**
   * Unblock an IP address
   */
  static async unblockIP(ipAddress: string): Promise<void> {
    try {
      await prisma.iPBlock.updateMany({
        where: { ipAddress },
        data: {
          isActive: false,
        },
      });

      console.log(`IP ${ipAddress} unblocked`);
    } catch (error) {
      console.error('Error unblocking IP:', error);
    }
  }

  /**
   * Record a failed authentication attempt
   * Automatically blocks IP after threshold is reached
   */
  static async recordFailedAuth(
    ipAddress: string,
    threshold: number = 5,
    blockDurationMs: number = 15 * 60 * 1000 // 15 minutes
  ): Promise<boolean> {
    try {
      // Get or create IP block record
      let block = await prisma.iPBlock.findUnique({
        where: { ipAddress },
      });

      if (!block) {
        block = await prisma.iPBlock.create({
          data: {
            ipAddress,
            reason: 'repeated_auth_failures',
            failedCount: 1,
            isActive: false,
            expiresAt: new Date(Date.now() + blockDurationMs),
          },
        });
        return false;
      }

      // Increment failed count
      const updatedBlock = await prisma.iPBlock.update({
        where: { ipAddress },
        data: {
          failedCount: { increment: 1 },
        },
      });

      // Check if threshold reached
      if (updatedBlock.failedCount >= threshold) {
        await this.blockIP(
          ipAddress,
          'repeated_auth_failures',
          blockDurationMs
        );
        return true; // IP was blocked
      }

      return false; // Not blocked yet
    } catch (error) {
      console.error('Error recording failed auth:', error);
      return false;
    }
  }

  /**
   * Reset failed authentication count for an IP
   */
  static async resetFailedAuth(ipAddress: string): Promise<void> {
    try {
      await prisma.iPBlock.updateMany({
        where: { ipAddress },
        data: {
          failedCount: 0,
          isActive: false,
        },
      });
    } catch (error) {
      console.error('Error resetting failed auth:', error);
    }
  }

  /**
   * Get all active blocks
   */
  static async getActiveBlocks(): Promise<any[]> {
    try {
      return await prisma.iPBlock.findMany({
        where: {
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        orderBy: {
          blockedAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error getting active blocks:', error);
      return [];
    }
  }

  /**
   * Clean up expired blocks
   */
  static async cleanupExpired(): Promise<number> {
    try {
      const result = await prisma.iPBlock.updateMany({
        where: {
          isActive: true,
          expiresAt: {
            lte: new Date(),
          },
        },
        data: {
          isActive: false,
        },
      });
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired blocks:', error);
      return 0;
    }
  }
}
