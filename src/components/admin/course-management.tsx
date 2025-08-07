"use client";

import { useState } from "react";
import {
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Loader2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "@/components/ui/use-toast";

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
    AlertDialogTrigger,
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

// Import your hooks
import {
    useCourses,
    useCreateCourse,
    useUpdateCourse,
    useDeleteCourse,
    type CourseInput,
} from "@/hooks/use-courses";
import { useTutors } from "@/hooks/use-tutors";

export function CourseManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<string | null>(null);
    const [formData, setFormData] = useState<CourseInput>({
        code: "",
        title: "",
        units: 2,
        level: 100,
        semester: 1,
        description: "",
        tutorIds: [],
    });

    // React Query hooks
    const {
        data: coursesResponse,
        isLoading,
        error,
        refetch,
    } = useCourses({
        search: searchQuery || undefined,
        limit: 50,
    });

    const { data: tutorsResponse } = useTutors({
        search: undefined,
        limit: 10,
    });

    const queryClient = useQueryClient();
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();
    const deleteCourseMutation = useDeleteCourse();

    const courses = coursesResponse?.courses || [];
    const totalCourses = coursesResponse?.total || 0;

    const tutors = tutorsResponse?.tutors || [];

    const tutorOptions: Option[] = tutors.map((tutor) => ({
        value: tutor.id,
        label: `${tutor.name}`,
    }));

    // Handle form submission for creating/updating courses
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.code.trim() || !formData.title.trim()) {
            //   toast({
            //     title: "Validation Error",
            //     description: "Course code and title are required",
            //     variant: "destructive",
            //   });
            return;
        }

        try {
            if (editingCourse) {
                await updateCourseMutation.mutateAsync({
                    id: editingCourse,
                    data: formData,
                });
                // toast({
                //   title: "Success",
                //   description: "Course updated successfully",
                // });
            } else {
                await createCourseMutation.mutateAsync(formData);
                // toast({
                //   title: "Success",
                //   description: "Course created successfully",
                // });
            }

            // Reset form and close dialog
            setFormData({
                code: "",
                title: "",
                units: 2,
                level: 100,
                semester: 1,
                description: "",
                tutorIds: [],
            });
            setIsCreateDialogOpen(false);
            setEditingCourse(null);
            // Query invalidation is now handled by the mutation hooks
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    };

    // Handle delete course
    const handleDelete = async (courseId: string, courseCode: string) => {
        try {
            await deleteCourseMutation.mutateAsync(courseId);
            //   toast({
            //     title: "Success",
            //     description: `${courseCode} deleted successfully`,
            //   });
            // Query invalidation is now handled by the mutation hooks
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    };

    // Handle edit course
    const handleEdit = (course: any) => {
        setFormData({
            code: course.code,
            title: course.title,
            units: course.units.toString(),
            level: course.level.toString(),
            semester: course.semester.toString(),
            description: course.description || "",
            tutorIds: course.tutors.map((t: any) => t.id),
        });
        setEditingCourse(course.id);
        setIsCreateDialogOpen(true);
    };

    // Reset form when dialog closes
    const handleDialogClose = () => {
        setIsCreateDialogOpen(false);
        setEditingCourse(null);
        setFormData({
            code: "",
            title: "",
            units: 2,
            level: 100,
            semester: 1,
            description: "",
            tutorIds: [],
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-2xl font-bold">
                        Course Management
                    </CardTitle>
                    <CardDescription>
                        Manage all courses in the system ({totalCourses} total)
                    </CardDescription>
                </div>
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCourse
                                        ? "Edit Course"
                                        : "Add New Course"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingCourse
                                        ? "Update the course information below."
                                        : "Create a new course. Click save when you're done."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="code"
                                        className="text-right"
                                    >
                                        Code *
                                    </Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g. MTE 301"
                                        className="col-span-3"
                                        value={formData.code}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                code: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="title"
                                        className="text-right"
                                    >
                                        Title *
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Engineering Economics"
                                        className="col-span-3"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        required
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
                                        value={formData.units}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                units: +e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="level"
                                        className="text-right"
                                    >
                                        Level
                                    </Label>
                                    <Select
                                        value={formData.level.toString()}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                level: +value,
                                            })
                                        }
                                    >
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
                                    <Select
                                        value={formData.semester.toString()}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                semester: +value,
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
                                        htmlFor="tutors"
                                        className="text-right"
                                    >
                                        Tutors
                                    </Label>
                                    <div className="col-span-3">
                                        <MultiSelect
                                            options={tutorOptions}
                                            selected={formData.tutorIds}
                                            onValueChange={(values) =>
                                                setFormData({
                                                    ...formData,
                                                    tutorIds: values,
                                                })
                                            }
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
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDialogClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        createCourseMutation.isPending ||
                                        updateCourseMutation.isPending
                                    }
                                >
                                    {(createCourseMutation.isPending ||
                                        updateCourseMutation.isPending) && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {editingCourse
                                        ? "Update Course"
                                        : "Save Course"}
                                </Button>
                            </DialogFooter>
                        </form>
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
                    {error && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="ml-2"
                        >
                            Retry
                        </Button>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="py-4 text-center text-red-600">
                        Failed to load courses. Please try again.
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading courses...
                    </div>
                )}

                {/* Courses Table */}
                {!isLoading && !error && (
                    <div className="rounded border">
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
                                {courses.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-8 text-muted-foreground"
                                        >
                                            {searchQuery
                                                ? "No courses found matching your search."
                                                : "No courses found. Add one to get started."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    courses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell className="font-medium">
                                                {course.code}
                                            </TableCell>
                                            <TableCell>
                                                {course.title}
                                            </TableCell>
                                            <TableCell>
                                                {course.units}
                                            </TableCell>
                                            <TableCell>
                                                {course.level}
                                            </TableCell>
                                            <TableCell>
                                                {course.semester}
                                            </TableCell>
                                            <TableCell>
                                                {course.tutors &&
                                                course.tutors.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {course.tutors.map(
                                                            (tutor: any) => (
                                                                <span
                                                                    key={
                                                                        tutor.id
                                                                    }
                                                                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                                                                >
                                                                    {tutor.name}
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
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
                                                            onClick={() =>
                                                                handleEdit(
                                                                    course
                                                                )
                                                            }
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onSelect={(
                                                                        e
                                                                    ) =>
                                                                        e.preventDefault()
                                                                    }
                                                                >
                                                                    {deleteCourseMutation.isPending ? (
                                                                        <>
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            Deleting...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                        </>
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Are you
                                                                        sure?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This
                                                                        will
                                                                        permanently
                                                                        delete
                                                                        the
                                                                        course "
                                                                        {
                                                                            course.code
                                                                        }
                                                                        :{" "}
                                                                        {
                                                                            course.title
                                                                        }
                                                                        " and
                                                                        all its
                                                                        associated
                                                                        materials.
                                                                        This
                                                                        action
                                                                        cannot
                                                                        be
                                                                        undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                        onClick={async () =>
                                                                            await handleDelete(
                                                                                course.id,
                                                                                course.code
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            deleteCourseMutation.isPending
                                                                        }
                                                                    >
                                                                        {deleteCourseMutation.isPending ? (
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        ) : null}
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
