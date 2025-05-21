"use client";

import { useState } from "react";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import FileUploader from "../file-uploader";

export function TutorManagement() {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock tutor data
    const tutors = [
        {
            id: "1",
            name: "Dr. Adebayo Johnson",
            email: "adebayo@university.edu",
            avatar: "/placeholder.svg?height=40&width=40",
            courses: ["MTE 303", "MTE 401"],
        },
        {
            id: "2",
            name: "Prof. Sarah Williams",
            email: "sarah.williams@university.edu",
            avatar: "/placeholder.svg?height=40&width=40",
            courses: ["MTE 201", "MTE 305"],
        },
        {
            id: "3",
            name: "Dr. Emmanuel Oladele",
            email: "emmanuel@university.edu",
            avatar: null,
            courses: ["MTE 307"],
        },
    ];

    const filteredTutors = tutors.filter(
        (tutor) =>
            tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Tutor Management
                        </CardTitle>
                        <CardDescription>
                            Manage course tutors and lecturers
                        </CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Tutor
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Tutor</DialogTitle>
                                <DialogDescription>
                                    Create a new tutor profile. Click save when
                                    you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Dr. John Doe"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="email"
                                        className="text-right"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@university.edu"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-5 items-center gap-4">
                                    {/* <Label htmlFor="avatar" className="text-right">
                    Profile Image
                  </Label> */}
                                    {/* <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSubmit}
                    className="col-span-3"
                  /> */}
                                    <div className="col-span-2 text-sm">
                                        Image
                                    </div>
                                    {/* <ImageUploader /> */}
                                    <FileUploader uploadPreset="amatech-tutors" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Tutor</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tutors..."
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
                                    <TableHead>Tutor</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Assigned Courses</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTutors.map((tutor) => (
                                    <TableRow key={tutor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    {tutor.avatar ? (
                                                        <AvatarImage
                                                            src={
                                                                tutor.avatar ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={tutor.name}
                                                        />
                                                    ) : (
                                                        <AvatarFallback>
                                                            {tutor.name.charAt(
                                                                0
                                                            )}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <span className="font-medium">
                                                    {tutor.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{tutor.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {tutor.courses.map((course) => (
                                                    <span
                                                        key={course}
                                                        className="inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold"
                                                    >
                                                        {course}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
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
                                                        Edit Tutor
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Assign Course
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Tutor
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
};
