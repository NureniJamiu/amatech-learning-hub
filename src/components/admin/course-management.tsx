"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";

import { courses } from "@/data/mock-data";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect, type Option } from "@/components/ui/multi-select";

export function CourseManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTutors, setSelectedTutors] = useState<string[]>([]);

    // Track which dialogs are open for each course
    const [openCourseDialogId, setOpenCourseDialogId] = useState<string | null>(
        null
    );
    const [openEditDialogId, setOpenEditDialogId] = useState<string | null>(
        null
    );
    const [openDeleteDialogId, setOpenDeleteDialogId] = useState<string | null>(
        null
    );

    // Track which dropdown is open
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // Edit form state
    const [editFormData, setEditFormData] = useState({
        code: "",
        title: "",
        units: "",
        level: "",
        semester: "",
        description: "",
        tutors: [] as string[],
    });

    // Mock tutors for the multi-select
    const tutors: Option[] = [
        { value: "1", label: "Dr. Adebayo Johnson" },
        { value: "2", label: "Prof. Sarah Williams" },
        { value: "3", label: "Dr. Emmanuel Oladele" },
    ];

    const filteredCourses = courses.filter(
        (course) =>
            course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to handle opening the material dialog
    const handleOpenMaterialDialog = (
        courseId: string,
        e: React.MouseEvent
    ) => {
        // Stop the click from closing the dropdown
        e.stopPropagation();
        // Set the current course dialog to open
        setOpenCourseDialogId(courseId);
    };

    // Function to handle opening the edit dialog
    const handleOpenEditDialog = (courseId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // Find the course data to populate the edit form
        const courseToEdit = courses.find((c) => c.id === courseId);
        if (courseToEdit) {
            setEditFormData({
                code: courseToEdit.code,
                title: courseToEdit.title,
                units: courseToEdit.units.toString(),
                level: courseToEdit.level.toString(),
                semester: courseToEdit.semester.toString(),
                description: courseToEdit.description || "",
                tutors: courseToEdit.tutors.map((t) => t.id),
            });
            setOpenEditDialogId(courseId);
        }
    };

    // Function to handle opening the delete confirmation dialog
    const handleOpenDeleteDialog = (courseId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDeleteDialogId(courseId);
    };

    // Function to handle course deletion
    const handleDeleteCourse = (courseId: string) => {
        // In a real app, you would make an API call here
        console.log(`Deleting course with ID: ${courseId}`);

        // Close the delete dialog
        setOpenDeleteDialogId(null);

        // Close the dropdown menu if it's open
        setOpenDropdownId(null);
    };

    // Function to handle course update
    const handleUpdateCourse = (courseId: string) => {
        // In a real app, you would make an API call here
        console.log(`Updating course with ID: ${courseId}`, editFormData);

        // Close the edit dialog
        setOpenEditDialogId(null);

        // Close the dropdown menu if it's open
        setOpenDropdownId(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Course Management
                        </CardTitle>
                        <CardDescription>
                            Manage all courses in the system
                        </CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Add New Course</DialogTitle>
                                <DialogDescription>
                                    Create a new course. Click save when you're
                                    done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="code"
                                        className="text-right"
                                    >
                                        Course Code
                                    </Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g. MTE 301"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="title"
                                        className="text-right"
                                    >
                                        Course Title
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Engineering Economics"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="units"
                                        className="text-right"
                                    >
                                        Units
                                    </Label>
                                    <Input
                                        id="units"
                                        type="number"
                                        min="1"
                                        max="6"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="level"
                                        className="text-right"
                                    >
                                        Level
                                    </Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="100">
                                                100
                                            </SelectItem>
                                            <SelectItem value="200">
                                                200
                                            </SelectItem>
                                            <SelectItem value="300">
                                                300
                                            </SelectItem>
                                            <SelectItem value="400">
                                                400
                                            </SelectItem>
                                            <SelectItem value="500">
                                                500
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="semester"
                                        className="text-right"
                                    >
                                        Semester
                                    </Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                1st Semester
                                            </SelectItem>
                                            <SelectItem value="2">
                                                2nd Semester
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="tutors"
                                        className="text-right"
                                    >
                                        Tutors
                                    </Label>
                                    <div className="col-span-3">
                                        <MultiSelect
                                            options={tutors}
                                            selected={selectedTutors}
                                            onValueChange={setSelectedTutors}
                                            placeholder="Select tutors"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label
                                        htmlFor="description"
                                        className="text-right pt-2"
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        className="col-span-3"
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Course</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Units</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Tutors</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">
                                            {course.code}
                                        </TableCell>
                                        <TableCell>{course.title}</TableCell>
                                        <TableCell>{course.units}</TableCell>
                                        <TableCell>{course.level}</TableCell>
                                        <TableCell>{course.semester}</TableCell>
                                        <TableCell>
                                            {course.tutors.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {course.tutors.map(
                                                        (tutor) => (
                                                            <span
                                                                key={tutor.id}
                                                                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                                                            >
                                                                {
                                                                    tutor.name.split(
                                                                        " "
                                                                    )[0]
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">
                                                    None
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu
                                                open={
                                                    openDropdownId === course.id
                                                }
                                                onOpenChange={(open) => {
                                                    setOpenDropdownId(
                                                        open ? course.id : null
                                                    );
                                                }}
                                            >
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
                                                    <DropdownMenuItem
                                                        onClick={(e) =>
                                                            handleOpenEditDialog(
                                                                course.id,
                                                                e
                                                            )
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) =>
                                                            handleOpenMaterialDialog(
                                                                course.id,
                                                                e
                                                            )
                                                        }
                                                    >
                                                        Add Material
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={(e) =>
                                                            handleOpenDeleteDialog(
                                                                course.id,
                                                                e
                                                            )
                                                        }
                                                    >
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

            {/* Material Dialogs - Outside of table but controlled by state */}
            {filteredCourses.map((course) => (
                <Dialog
                    key={`material-dialog-${course.id}`}
                    open={openCourseDialogId === course.id}
                    onOpenChange={(open) => {
                        if (!open) setOpenCourseDialogId(null);
                    }}
                >
                    <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                            <DialogTitle>
                                Add Course Material for {course.code}
                            </DialogTitle>
                            <DialogDescription>
                                Upload a new course material. Click save when
                                you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor={`title-${course.id}`}
                                    className="text-right"
                                >
                                    Title
                                </Label>
                                <Input
                                    id={`title-${course.id}`}
                                    placeholder="e.g. Course Notes"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor={`file-${course.id}`}
                                    className="text-right"
                                >
                                    File
                                </Label>
                                <Input
                                    id={`file-${course.id}`}
                                    type="file"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ))}

            {/* Edit Dialogs - Outside of table but controlled by state */}
            {filteredCourses.map((course) => (
                <Dialog
                    key={`edit-dialog-${course.id}`}
                    open={openEditDialogId === course.id}
                    onOpenChange={(open) => {
                        if (!open) setOpenEditDialogId(null);
                    }}
                >
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle>
                                Edit Course: {course.code}
                            </DialogTitle>
                            <DialogDescription>
                                Make changes to the course information. Click
                                save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor={`edit-code-${course.id}`}
                                    className="text-right"
                                >
                                    Course Code
                                </Label>
                                <Input
                                    id={`edit-code-${course.id}`}
                                    value={editFormData.code}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            code: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor={`edit-title-${course.id}`}
                                    className="text-right"
                                >
                                    Course Title
                                </Label>
                                <Input
                                    id={`edit-title-${course.id}`}
                                    value={editFormData.title}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor={`edit-units-${course.id}`}
                                    className="text-right"
                                >
                                    Units
                                </Label>
                                <Input
                                    id={`edit-units-${course.id}`}
                                    type="number"
                                    min="1"
                                    max="6"
                                    value={editFormData.units}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            units: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor={`edit-level-${course.id}`}
                                    className="text-right"
                                >
                                    Level
                                </Label>
                                <Select
                                    value={editFormData.level}
                                    onValueChange={(value) =>
                                        setEditFormData({
                                            ...editFormData,
                                            level: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="100">100</SelectItem>
                                        <SelectItem value="200">200</SelectItem>
                                        <SelectItem value="300">300</SelectItem>
                                        <SelectItem value="400">400</SelectItem>
                                        <SelectItem value="500">500</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor={`edit-semester-${course.id}`}
                                    className="text-right"
                                >
                                    Semester
                                </Label>
                                <Select
                                    value={editFormData.semester}
                                    onValueChange={(value) =>
                                        setEditFormData({
                                            ...editFormData,
                                            semester: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            1st Semester
                                        </SelectItem>
                                        <SelectItem value="2">
                                            2nd Semester
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor={`edit-tutors-${course.id}`}
                                    className="text-right"
                                >
                                    Tutors
                                </Label>
                                <div className="col-span-3">
                                    <MultiSelect
                                        options={tutors}
                                        selected={editFormData.tutors}
                                        onValueChange={(values) =>
                                            setEditFormData({
                                                ...editFormData,
                                                tutors: values,
                                            })
                                        }
                                        placeholder="Select tutors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label
                                    htmlFor={`edit-description-${course.id}`}
                                    className="text-right pt-2"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id={`edit-description-${course.id}`}
                                    value={editFormData.description}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                    rows={4}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                onClick={() => handleUpdateCourse(course.id)}
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ))}

            {/* Delete Confirmation Dialogs */}
            {filteredCourses.map((course) => (
                <AlertDialog
                    key={`delete-dialog-${course.id}`}
                    open={openDeleteDialogId === course.id}
                    onOpenChange={(open) => {
                        if (!open) setOpenDeleteDialogId(null);
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the course "
                                {course.code}: {course.title}" and all its
                                associated materials. This action cannot be
                                undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteCourse(course.id)}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ))}
        </>
    );
}
