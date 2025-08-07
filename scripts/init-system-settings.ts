import { PrismaClient } from "../src/app/generated/prisma";

const prisma = new PrismaClient();

async function initSystemSettings() {
  try {
    // Check if system settings already exist
    const existingSettings = await prisma.systemSettings.findFirst();

    if (existingSettings) {
      console.log("System settings already exist:", existingSettings.id);
      return;
    }

    // Create default system settings
    const settings = await prisma.systemSettings.create({
      data: {
        siteName: "Amatech Lasu - Student Learning Hub",
        siteDescription: "Access course materials and resources for computer science students",
        maintenanceMode: false,
        allowRegistration: true,
        defaultTheme: "light",
        cacheLifetime: 3600,
        maxUploadSize: 50,
        sessionTimeout: 120,
        debugMode: false,
        smtpServer: "smtp.gmail.com",
        smtpPort: "587",
        fromEmail: "noreply@amatechlasu.edu",
        fromName: "Amatech LASU",
      },
    });

    console.log("System settings initialized successfully:", settings.id);
  } catch (error) {
    console.error("Error initializing system settings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

initSystemSettings();
