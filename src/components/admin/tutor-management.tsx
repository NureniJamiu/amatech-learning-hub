"use client";

import { useState } from "react";
import {
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    UserPlus,
    Loader2,
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
// import { useToast } from "@/components/ui/use-toast";
import FileUploader from "../file-uploader";

// Import your hooks
import {
    useTutors,
    useCreateTutor,
    useUpdateTutor,
    useDeleteTutor,
    type TutorInput,
} from "@/hooks/use-tutors"; // Adjust import path as needed
import { AlertDialog, AlertDialogDescription } from "../ui/alert-dialog";

export function TutorManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingTutor, setEditingTutor] = useState<string | null>(null);
    const [formData, setFormData] = useState<TutorInput>({
        name: "",
        email: "",
        avatar: "",
    });

    // const { toast } = useToast();

    // React Query hooks
    const {
        data: tutorsResponse,
        isLoading,
        error,
        refetch,
    } = useTutors({
        search: searchQuery || undefined,
        limit: 50,
    });

    const createTutorMutation = useCreateTutor();
    const updateTutorMutation = useUpdateTutor();
    const deleteTutorMutation = useDeleteTutor();

    const tutors = tutorsResponse?.tutors || [];
    const totalTutors = tutorsResponse?.total || 0;

    // Handle form submission for creating/updating tutors
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            // toast({
            //     title: "Validation Error",
            //     description: "Name and email are required",
            //     variant: "destructive",
            // });
            return;
        }

        try {
            if (editingTutor) {
                await updateTutorMutation.mutateAsync({
                    id: editingTutor,
                    data: formData,
                });
                // toast({
                //     title: "Success",
                //     description: "Tutor updated successfully",
                // });
            } else {
                await createTutorMutation.mutateAsync(formData);
                // toast({
                //     title: "Success",
                //     description: "Tutor created successfully",
                // });
            }

            // Reset form and close dialog
            setFormData({ name: "", email: "", avatar: "" });
            setIsCreateDialogOpen(false);
            setEditingTutor(null);
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    };

    // Handle delete tutor
    const handleDelete = async (tutorId: string, tutorName: string) => {
        if (window.confirm(`Are you sure you want to delete ${tutorName}?`)) {
            try {
                await deleteTutorMutation.mutateAsync(tutorId);
                // toast({
                //     title: "Success",
                //     description: "Tutor deleted successfully",
                // });
            } catch (error) {
                // Error is handled by the mutation's onError
            }
        }
    };

    // Handle edit tutor
    const handleEdit = (tutor: any) => {
        setFormData({
            name: tutor.name,
            email: tutor.email,
            avatar: tutor.avatar || "",
        });
        setEditingTutor(tutor.id);
        setIsCreateDialogOpen(true);
    };

    // Handle file upload complete - for backward compatibility with image uploads
    const handleFileUploadComplete = (fileOrUrl: File | string) => {
        if (typeof fileOrUrl === "string") {
            // URL received (autoUpload = true case)
            setFormData((prev) => ({ ...prev, avatar: fileOrUrl }));
        } else {
            // File received (autoUpload = false case) - not used for tutors
            console.log("File selected but not uploaded:", fileOrUrl?.name);
        }
    };

    // Reset form when dialog closes
    const handleDialogClose = () => {
        setIsCreateDialogOpen(false);
        setEditingTutor(null);
        setFormData({ name: "", email: "", avatar: "" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-2xl font-bold">
                        Tutor Management
                    </CardTitle>
                    <CardDescription>
                        Manage course tutors and lecturers ({totalTutors} total)
                    </CardDescription>
                </div>
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Tutor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingTutor
                                        ? "Edit Tutor"
                                        : "Add New Tutor"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingTutor
                                        ? "Update the tutor information below."
                                        : "Create a new tutor profile. Click save when you're done."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Dr. John Doe"
                                        className="col-span-3"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="email"
                                        className="text-right"
                                    >
                                        Email *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@university.edu"
                                        className="col-span-3"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-5 items-center gap-4">
                                    <div className="col-span-2 text-sm">
                                        Profile Image
                                    </div>
                                    <div className="col-span-3">
                                        <FileUploader
                                            uploadPreset="amatech-tutors"
                                            onUploadComplete={
                                                handleFileUploadComplete
                                            }
                                            initialImageUrl={formData.avatar}
                                            autoUpload={true}
                                        />
                                    </div>
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
                                        createTutorMutation.isPending ||
                                        updateTutorMutation.isPending
                                    }
                                >
                                    {(createTutorMutation.isPending ||
                                        updateTutorMutation.isPending) && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {editingTutor
                                        ? "Update Tutor"
                                        : "Save Tutor"}
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
                            placeholder="Search tutors..."
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
                    <AlertDialog>
                        <AlertDialogDescription className="text-red-600">
                            Failed to load tutors. Please try again.
                        </AlertDialogDescription>
                    </AlertDialog>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading tutors...
                    </div>
                )}

                {/* Tutors Table */}
                {!isLoading && !error && (
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
                                {tutors.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center py-8 text-muted-foreground"
                                        >
                                            {searchQuery
                                                ? "No tutors found matching your search."
                                                : "No tutors found. Add one to get started."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tutors.map((tutor) => (
                                        <TableRow key={tutor.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        {tutor.avatar ? (
                                                            <AvatarImage
                                                                src={
                                                                    tutor.avatar
                                                                }
                                                                alt={tutor.name}
                                                            />
                                                        ) : (
                                                            <AvatarFallback>
                                                                {tutor.name
                                                                    .split(" ")
                                                                    .map((n) =>
                                                                        n.charAt(
                                                                            0
                                                                        )
                                                                    )
                                                                    .join("")
                                                                    .toUpperCase()}
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
                                                    {tutor.courses &&
                                                    tutor.courses.length > 0 ? (
                                                        tutor.courses.map(
                                                            (course) => (
                                                                <span
                                                                    key={
                                                                        course.id +
                                                                        course.code
                                                                    }
                                                                    className="inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold"
                                                                >
                                                                    {
                                                                        course.code
                                                                    }
                                                                </span>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">
                                                            No courses assigned
                                                        </span>
                                                    )}
                                                </div>
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
                                                                    tutor
                                                                )
                                                            }
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Tutor
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Assign Course
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    tutor.id,
                                                                    tutor.name
                                                                )
                                                            }
                                                            disabled={
                                                                deleteTutorMutation.isPending
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Tutor
                                                        </DropdownMenuItem>
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
