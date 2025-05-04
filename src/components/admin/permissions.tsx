"use client";

import { useState } from "react";
import { Plus, Save, Shield, User, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Permissions() {
  // Mock data for roles
  const roles = [
    { id: "1", name: "Admin", users: 3, description: "Full system access" },
    {
      id: "2",
      name: "Lecturer",
      users: 15,
      description: "Can manage courses and content",
    },
    {
      id: "3",
      name: "Student",
      users: 1200,
      description: "Can view courses and download materials",
    },
    { id: "4", name: "Guest", users: 50, description: "Limited view access" },
  ];

  // Mock data for permissions
  const permissions = {
    "User Management": {
      "View Users": {
        admin: true,
        lecturer: false,
        student: false,
        guest: false,
      },
      "Create Users": {
        admin: true,
        lecturer: false,
        student: false,
        guest: false,
      },
      "Edit Users": {
        admin: true,
        lecturer: false,
        student: false,
        guest: false,
      },
      "Delete Users": {
        admin: true,
        lecturer: false,
        student: false,
        guest: false,
      },
    },
    "Course Management": {
      "View Courses": {
        admin: true,
        lecturer: true,
        student: true,
        guest: true,
      },
      "Create Courses": {
        admin: true,
        lecturer: true,
        student: false,
        guest: false,
      },
      "Edit Courses": {
        admin: true,
        lecturer: true,
        student: false,
        guest: false,
      },
      "Delete Courses": {
        admin: true,
        lecturer: false,
        student: false,
        guest: false,
      },
    },
    "Content Management": {
      "View Content": {
        admin: true,
        lecturer: true,
        student: true,
        guest: true,
      },
      "Upload Content": {
        admin: true,
        lecturer: true,
        student: false,
        guest: false,
      },
      "Edit Content": {
        admin: true,
        lecturer: true,
        student: false,
        guest: false,
      },
      "Delete Content": {
        admin: true,
        lecturer: true,
        student: false,
        guest: false,
      },
    },
    "System Settings": {
      "View Settings": {
        admin: true,
        lecturer: false,
        student: false,
        guest: false,
      },
      "Edit Settings": {
        admin: true,
        lecturer: false,
        student: false,
        guest: false,
      },
    },
  };

  const [selectedRole, setSelectedRole] = useState("admin");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Permissions & Roles
          </CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            <TabsContent value="roles" className="space-y-4 pt-4">
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Role</DialogTitle>
                      <DialogDescription>
                        Create a new role with specific permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="roleName" className="text-right">
                          Role Name
                        </Label>
                        <Input id="roleName" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label
                          htmlFor="roleDescription"
                          className="text-right pt-2"
                        >
                          Description
                        </Label>
                        <Input id="roleDescription" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Role</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {role.name === "Admin" && (
                              <Shield className="mr-2 h-4 w-4 text-blue-500" />
                            )}
                            {role.name === "Lecturer" && (
                              <UserCog className="mr-2 h-4 w-4 text-green-500" />
                            )}
                            {role.name === "Student" && (
                              <User className="mr-2 h-4 w-4 text-amber-500" />
                            )}
                            {role.name === "Guest" && (
                              <User className="mr-2 h-4 w-4 text-gray-500" />
                            )}
                            {role.name}
                          </div>
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>{role.users}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="permissions" className="space-y-4 pt-4">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <Label htmlFor="roleSelect">Select Role</Label>
                  <div className="flex items-center mt-1 space-x-2">
                    <Button
                      variant={selectedRole === "admin" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRole("admin")}
                    >
                      Admin
                    </Button>
                    <Button
                      variant={
                        selectedRole === "lecturer" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedRole("lecturer")}
                    >
                      Lecturer
                    </Button>
                    <Button
                      variant={
                        selectedRole === "student" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedRole("student")}
                    >
                      Student
                    </Button>
                    <Button
                      variant={selectedRole === "guest" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRole("guest")}
                    >
                      Guest
                    </Button>
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Permissions
                </Button>
              </div>

              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead className="text-right">Allow</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(permissions).map(([category, perms]) => (
                      <>
                        <TableRow key={category}>
                          <TableCell
                            colSpan={2}
                            className="bg-muted/50 font-medium"
                          >
                            {category}
                          </TableCell>
                        </TableRow>
                        {Object.entries(perms).map(([perm, roles]) => (
                          <TableRow key={`${category}-${perm}`}>
                            <TableCell className="pl-6">{perm}</TableCell>
                            <TableCell className="text-right">
                              <Switch
                                checked={
                                  roles[selectedRole as keyof typeof roles]
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
