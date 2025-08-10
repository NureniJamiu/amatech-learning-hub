"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Search, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import {
    FormSection,
    FormField,
    FormGrid,
    FormActions,
} from "@/components/ui/form-layout";

export function UserManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Mock user data
    const users = [
        {
            id: "1",
            name: "Nureni Jamiu",
            email: "nurenijamiu@gmail.com",
            role: "Admin",
            level: 300,
            department: "Mechanical Engineering",
        },
        {
            id: "2",
            name: "John Doe",
            email: "johndoe@gmail.com",
            role: "Student",
            level: 200,
            department: "Computer Science",
        },
        {
            id: "3",
            name: "Jane Smith",
            email: "janesmith@gmail.com",
            role: "Student",
            level: 400,
            department: "Electrical Engineering",
        },
        {
            id: "4",
            name: "Robert Johnson",
            email: "robert@gmail.com",
            role: "Lecturer",
            level: null,
            department: "Mechanical Engineering",
        },
        {
            id: "5",
            name: "Sarah Williams",
            email: "sarah@gmail.com",
            role: "Student",
            level: 300,
            department: "Civil Engineering",
        },
    ];

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            User Management
                        </CardTitle>
                        <CardDescription>
                            Manage all users in the system
                        </CardDescription>
                    </div>
                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold">
                                    Add New User
                                </DialogTitle>
                                <DialogDescription>
                                    Create a new user account for the platform.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                <FormSection title="User Information">
                                    <FormGrid columns={2}>
                                        <FormField label="Full Name" required>
                                            <Input placeholder="Enter full name" />
                                        </FormField>

                                        <FormField
                                            label="Email Address"
                                            required
                                        >
                                            <Input
                                                type="email"
                                                placeholder="Enter email address"
                                            />
                                        </FormField>

                                        <FormField label="Role" required>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select user role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">
                                                        Administrator
                                                    </SelectItem>
                                                    <SelectItem value="student">
                                                        Student
                                                    </SelectItem>
                                                    <SelectItem value="lecturer">
                                                        Lecturer
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField label="Department" required>
                                            <Input placeholder="Enter department" />
                                        </FormField>

                                        <FormField
                                            label="Academic Level"
                                            hint="For students only"
                                        >
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="100">
                                                        100 Level
                                                    </SelectItem>
                                                    <SelectItem value="200">
                                                        200 Level
                                                    </SelectItem>
                                                    <SelectItem value="300">
                                                        300 Level
                                                    </SelectItem>
                                                    <SelectItem value="400">
                                                        400 Level
                                                    </SelectItem>
                                                    <SelectItem value="500">
                                                        500 Level
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </FormGrid>
                                </FormSection>
                            </div>

                            <FormActions>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Create User</Button>
                            </FormActions>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="rounded border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            {user.level || "N/A"}
                                        </TableCell>
                                        <TableCell>{user.department}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
