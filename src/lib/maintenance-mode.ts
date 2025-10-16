/**
 * Maintenance Mode Service
 * 
 * Service for checking and managing maintenance mode status
 */

import prisma from '@/lib/prisma';

export interface MaintenanceStatus {
  enabled: boolean;
  message?: string;
  allowedIps?: string[];
  allowedUserIds?: string[];
}

export class MaintenanceMode {
  private static cache: {
    enabled: boolean;
    timestamp: number;
  } | null = null;

  private static CACHE_TTL = 30000; // 30 seconds

  /**
   * Check if maintenance mode is enabled
   * Uses caching to avoid frequent database queries
   */
  static async isEnabled(): Promise<boolean> {
    const now = Date.now();

    // Return cached value if still valid
    if (this.cache && now - this.cache.timestamp < this.CACHE_TTL) {
      return this.cache.enabled;
    }

    try {
      // Fetch from database
      const settings = await prisma.systemSettings.findFirst({
        select: { maintenanceMode: true },
      });

      const enabled = settings?.maintenanceMode ?? false;

      // Update cache
      this.cache = {
        enabled,
        timestamp: now,
      };

      return enabled;
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      // If database is down, assume maintenance mode is enabled
      return true;
    }
  }

  /**
   * Enable maintenance mode
   */
  static async enable(): Promise<void> {
    try {
      const settings = await prisma.systemSettings.findFirst();

      if (settings) {
        await prisma.systemSettings.update({
          where: { id: settings.id },
          data: { maintenanceMode: true },
        });
      } else {
        await prisma.systemSettings.create({
          data: { maintenanceMode: true },
        });
      }

      // Clear cache
      this.cache = null;

      console.log('[Maintenance] Maintenance mode enabled');
    } catch (error) {
      console.error('Error enabling maintenance mode:', error);
      throw error;
    }
  }

  /**
   * Disable maintenance mode
   */
  static async disable(): Promise<void> {
    try {
      const settings = await prisma.systemSettings.findFirst();

      if (settings) {
        await prisma.systemSettings.update({
          where: { id: settings.id },
          data: { maintenanceMode: false },
        });
      }

      // Clear cache
      this.cache = null;

      console.log('[Maintenance] Maintenance mode disabled');
    } catch (error) {
      console.error('Error disabling maintenance mode:', error);
      throw error;
    }
  }

  /**
   * Check if a user is allowed during maintenance mode
   * Admins are always allowed
   */
  static async isUserAllowed(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isAdmin: true },
      });

      return user?.isAdmin ?? false;
    } catch (error) {
      console.error('Error checking user permissions:', error);
      return false;
    }
  }

  /**
   * Clear the maintenance mode cache
   * Useful when you want to force a fresh check
   */
  static clearCache(): void {
    this.cache = null;
  }

  /**
   * Get maintenance mode status with details
   */
  static async getStatus(): Promise<MaintenanceStatus> {
    const enabled = await this.isEnabled();

    return {
      enabled,
      message: enabled
        ? 'The system is currently under maintenance. Please try again later.'
        : undefined,
    };
  }
}

export default MaintenanceMode;
