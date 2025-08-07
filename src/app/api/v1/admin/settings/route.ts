import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/middleware/auth.middleware";

// Validation schema for system settings
const systemSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").optional(),
  siteDescription: z.string().min(1, "Site description is required").optional(),
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
  defaultTheme: z.enum(["light", "dark", "system"]).optional(),
  smtpServer: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
  fromEmail: z.string().email().optional(),
  fromName: z.string().optional(),
  cacheLifetime: z.number().int().positive().optional(),
  maxUploadSize: z.number().int().positive().optional(),
  sessionTimeout: z.number().int().positive().optional(),
  debugMode: z.boolean().optional(),
});

// GET /api/v1/admin/settings - Get system settings
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin access
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    // Get or create system settings
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.systemSettings.create({
        data: {
          siteName: "Amatech Lasu - Student Learning Hub",
          siteDescription: "Access course materials and resources",
          maintenanceMode: false,
          allowRegistration: true,
          defaultTheme: "light",
          cacheLifetime: 3600,
          maxUploadSize: 50,
          sessionTimeout: 120,
          debugMode: false,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error fetching system settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/admin/settings - Update system settings
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication and admin access
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const body = await request.json();

    // Validate the request body
    const validatedData = systemSettingsSchema.parse(body);

    // Get existing settings or create if none exist
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      // Create new settings with validated data
      settings = await prisma.systemSettings.create({
        data: {
          siteName: "Amatech Lasu - Student Learning Hub",
          siteDescription: "Access course materials and resources",
          maintenanceMode: false,
          allowRegistration: true,
          defaultTheme: "light",
          cacheLifetime: 3600,
          maxUploadSize: 50,
          sessionTimeout: 120,
          debugMode: false,
          ...validatedData,
        },
      });
    } else {
      // Update existing settings
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: validatedData,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e: z.ZodIssue) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    console.error("Error updating system settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
