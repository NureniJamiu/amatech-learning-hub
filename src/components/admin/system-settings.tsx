"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SystemSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Amatech Lasu - Student Learning Hub",
    siteDescription: "Access course materials and resources",
    maintenanceMode: false,
    allowRegistration: true,
    defaultTheme: "light",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@amatechlasu.edu",
    smtpPassword: "••••••••••••",
    fromEmail: "no-reply@amatechlasu.edu",
    fromName: "Amatech Lasu",
  });

  const handleGeneralSettingChange = (key: string, value: any) => {
    setGeneralSettings({
      ...generalSettings,
      [key]: value,
    });
  };

  const handleEmailSettingChange = (key: string, value: string) => {
    setEmailSettings({
      ...emailSettings,
      [key]: value,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">System Settings</CardTitle>
          <CardDescription>
            Configure system-wide settings for the learning platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="siteName" className="text-right">
                    Site Name
                  </Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) =>
                      handleGeneralSettingChange("siteName", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="siteDescription" className="text-right pt-2">
                    Site Description
                  </Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) =>
                      handleGeneralSettingChange(
                        "siteDescription",
                        e.target.value
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="defaultTheme" className="text-right">
                    Default Theme
                  </Label>
                  <Select
                    value={generalSettings.defaultTheme}
                    onValueChange={(value) =>
                      handleGeneralSettingChange("defaultTheme", value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maintenanceMode" className="text-right">
                    Maintenance Mode
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="maintenanceMode"
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        handleGeneralSettingChange("maintenanceMode", checked)
                      }
                    />
                    <Label htmlFor="maintenanceMode">
                      {generalSettings.maintenanceMode ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="allowRegistration" className="text-right">
                    Allow Registration
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="allowRegistration"
                      checked={generalSettings.allowRegistration}
                      onCheckedChange={(checked) =>
                        handleGeneralSettingChange("allowRegistration", checked)
                      }
                    />
                    <Label htmlFor="allowRegistration">
                      {generalSettings.allowRegistration
                        ? "Enabled"
                        : "Disabled"}
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="email" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="smtpServer" className="text-right">
                    SMTP Server
                  </Label>
                  <Input
                    id="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={(e) =>
                      handleEmailSettingChange("smtpServer", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="smtpPort" className="text-right">
                    SMTP Port
                  </Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) =>
                      handleEmailSettingChange("smtpPort", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="smtpUsername" className="text-right">
                    SMTP Username
                  </Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) =>
                      handleEmailSettingChange("smtpUsername", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="smtpPassword" className="text-right">
                    SMTP Password
                  </Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) =>
                      handleEmailSettingChange("smtpPassword", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fromEmail" className="text-right">
                    From Email
                  </Label>
                  <Input
                    id="fromEmail"
                    value={emailSettings.fromEmail}
                    onChange={(e) =>
                      handleEmailSettingChange("fromEmail", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fromName" className="text-right">
                    From Name
                  </Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) =>
                      handleEmailSettingChange("fromName", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cacheLifetime" className="text-right">
                    Cache Lifetime (seconds)
                  </Label>
                  <Input
                    id="cacheLifetime"
                    defaultValue="3600"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxUploadSize" className="text-right">
                    Max Upload Size (MB)
                  </Label>
                  <Input
                    id="maxUploadSize"
                    defaultValue="50"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sessionTimeout" className="text-right">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    defaultValue="120"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="debugMode" className="text-right">
                    Debug Mode
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch id="debugMode" />
                    <Label htmlFor="debugMode">Disabled</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
