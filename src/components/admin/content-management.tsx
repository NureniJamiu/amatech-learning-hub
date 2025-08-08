"use client";

import { useState, useEffect } from "react";
import {
    FileText,
    FileUp,
    Loader2,
    MoreHorizontal,
    Search,
    Trash2,
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
import FileUploader from "../file-uploader";
import { useCourses } from "@/hooks/use-courses";
import { MaterialInput } from "@/hooks/use-materials";
import type { Material2 } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useTransactionalUpload } from "@/hooks/use-transactional-upload";

// Import your hooks
import {
    useMaterials,
    useUploadMaterial,
    useDeleteMaterial,
} from "@/hooks/use-materials";
import {
    useDeletePastQuestion,
    usePastQuestions,
    useUploadPastQuestion,
} from "@/hooks/use-past-questions";
import { useRecentlyAccessed } from "@/hooks/use-recently-accessed";

export function ContentManagement() {
    const [activeTab, setActiveTab] = useState("materials");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [formData, setFormData] = useState<{
        title: string;
        courseId: string;
        type: string;
    }>({
        title: "",
        courseId: "",
        type: "material",
    });

    // Transactional upload state
    const materialUpload = useTransactionalUpload({
        uploadPreset: "amatech-materials-and-pqs",
        folder: "materials",
        onError: (error) => {
            console.error("Upload error:", error);
        },
    });

    const { trackMaterialAccess, trackPastQuestionAccess } =
        useRecentlyAccessed();

    // React Query Hooks - declare these first
    const queryClient = useQueryClient();

    const {
        data: materialsResponse,
        isLoading: materialsLoading,
        error: materialsError,
        refetch: refetchMaterials,
    } = useMaterials({
        search: undefined,
        limit: 50,
        courseId: undefined,
    });

    const {
        data: pastQuestionsResponse,
        isLoading: pastQuestionsLoading,
        error: pastQuestionsError,
        refetch: refetchPastQuestions,
    } = usePastQuestions({
        search: undefined,
        limit: 50,
    });

    const {
        data: coursesResponse,
        isLoading: coursesLoading,
        error: coursesError,
        refetch: refetchCourses,
    } = useCourses({
        search: undefined,
        limit: 100, // Increased limit to ensure new courses are included
    });

    // Course updates are handled automatically by React Query invalidation
    const uploadMaterialMutation = useUploadMaterial();
    const deleteMaterialMutation = useDeleteMaterial();
    const uploadPastQuestionMutation = useUploadPastQuestion();
    const deletePastQuestionMutation = useDeletePastQuestion();

    const materials = materialsResponse?.materials || [];
    const totalMaterials = materialsResponse?.total || 0;
    const pastQuestions = pastQuestionsResponse?.pastQuestions || [];
    const totalPastQuestions = pastQuestionsResponse?.total || 0;
    const courses = coursesResponse?.courses || [];

    // Handle form submission for creating/updating content
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.type) {
            return;
        }

        if (!formData.title.trim()) {
            //   toast({
            //     title: "Validation Error",
            //     description: "Title is required",
            //     variant: "destructive",
            //   });
            return;
        }

        if (!formData.courseId) {
            //   toast({
            //     title: "Validation Error",
            //     description: "Course is required",
            //     variant: "destructive",
            //   });
            return;
        }

        if (!materialUpload.selectedFile) {
            //   toast({
            //     title: "Validation Error",
            //     description: "File is required",
            //     variant: "destructive",
            //   });
            return;
        }

        try {
            // Step 1: Upload file to Cloudinary (transactional)
            const fileUrl = await materialUpload.executeUpload();

            if (!fileUrl) {
                throw new Error("File upload failed");
            }

            // Step 2: Save to database with uploaded file URL
            const materialData: MaterialInput = {
                ...formData,
                file: fileUrl,
            };

            if (formData.type === "material") {
                const result = await uploadMaterialMutation.mutateAsync(
                    materialData
                );

                // Automatically process the material for RAG
                if (result && result.id) {
                    try {
                        await fetch("/api/v1/materials/process", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ materialId: result.id }),
                        });
                        console.log("Material processing started for RAG");
                    } catch (processingError) {
                        console.warn(
                            "Material uploaded but RAG processing failed:",
                            processingError
                        );
                    }
                }

                // toast({
                //   title: "Success",
                //   description: "Material uploaded successfully",
                // });
            } else {
                await uploadPastQuestionMutation.mutateAsync(materialData);
                // toast({
                //   title: "Success",
                //   description: "Past question uploaded successfully",
                // });
            }

            // Reset form and close dialog
            setFormData({
                title: "",
                courseId: "",
                type: "material",
            });
            materialUpload.reset();
            setIsUploadDialogOpen(false);

            // Refresh courses to ensure material counts are updated
            queryClient.invalidateQueries({ queryKey: ["courses"] });

            // Query invalidation for materials is now handled by the mutation hooks
        } catch (error) {
            // Error handling: If database save fails, we should clean up the uploaded file
            if (materialUpload.uploadedUrl) {
                await materialUpload.cleanupUpload(materialUpload.uploadedUrl);
                console.log("Cleaned up uploaded file due to database error");
            }
            console.log("Error uploading content:", error);
        }
    };

    // Handle delete material
    const handleDeleteMaterial = async (
        materialId: string,
        materialTitle: string
    ) => {
        try {
            await deleteMaterialMutation.mutateAsync(materialId);
            // toast({
            //   title: "Success",
            //   description: `${materialTitle} deleted successfully`,
            // });
            // Query invalidation is now handled by the mutation hooks
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    };

    // Handle delete past question
    const handleDeletePastQuestion = async (
        questionId: string,
        questionTitle: string
    ) => {
        try {
            await deletePastQuestionMutation.mutateAsync(questionId);
            // toast({
            //   title: "Success",
            //   description: `${questionTitle} deleted successfully`,
            // });
            // Query invalidation is now handled by the mutation hooks
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    };

    const handleFileUploadComplete = (file: File | string) => {
        if (file instanceof File) {
            materialUpload.setSelectedFile(file);
        } else {
            // Handle string URL case (shouldn't happen with autoUpload=false, but for safety)
            console.warn("Received URL instead of File object:", file);
        }
    };

    // Handle opening the upload dialog - refetch courses to ensure latest data
    const handleOpenUploadDialog = () => {
        setIsUploadDialogOpen(true);
        // Refetch courses to ensure we have the latest course list
        refetchCourses();
        // Also invalidate the courses cache to force a fresh fetch
        queryClient.invalidateQueries({ queryKey: ["courses"] });
    };

    // Handle view material
    const handleViewMaterial = (material: Material2) => {
        trackMaterialAccess(material);
        // Open in a new tab
        if (material.fileUrl) {
            window.open(material.fileUrl, "_blank");
        }
    };

    // Handle view past question
    const handleViewPastQuestion = (pastQuestion: any) => {
        if (pastQuestion.course) {
            trackPastQuestionAccess(pastQuestion);
            // Open in a new tab
            if (pastQuestion.fileUrl) {
                window.open(pastQuestion.fileUrl, "_blank");
            }
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Content Management
                        </CardTitle>
                        <CardDescription>
                            Manage course materials and past questions
                        </CardDescription>
                    </div>
                    <Dialog
                        open={isUploadDialogOpen}
                        onOpenChange={setIsUploadDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button onClick={handleOpenUploadDialog}>
                                <FileUp className="mr-2 h-4 w-4" />
                                Upload Content
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Upload Content</DialogTitle>
                                    <DialogDescription>
                                        Upload new course materials or past
                                        questions.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="contentType"
                                            className="text-right"
                                        >
                                            Content Type
                                        </Label>
                                        <Select
                                            value={formData.type || undefined}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    type: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    "material",
                                                    "pastQuestion",
                                                ].map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type === "material"
                                                            ? "Course Material"
                                                            : "Past Question"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="course"
                                            className="text-right"
                                        >
                                            Course
                                        </Label>
                                        <div className="col-span-3 flex gap-2">
                                            <Select
                                                value={
                                                    formData.courseId ||
                                                    undefined
                                                }
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        courseId: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue placeholder="Select course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {coursesLoading ? (
                                                        <SelectItem
                                                            value="loading"
                                                            disabled
                                                        >
                                                            Loading courses...
                                                        </SelectItem>
                                                    ) : coursesError ? (
                                                        <SelectItem
                                                            value="error"
                                                            disabled
                                                        >
                                                            Error loading
                                                            courses
                                                        </SelectItem>
                                                    ) : courses.length === 0 ? (
                                                        <SelectItem
                                                            value="no-courses"
                                                            disabled
                                                        >
                                                            No courses available
                                                        </SelectItem>
                                                    ) : (
                                                        courses.map(
                                                            (course) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={
                                                                            course.id
                                                                        }
                                                                        value={
                                                                            course.id
                                                                        }
                                                                    >
                                                                        {
                                                                            course.code
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            course.title
                                                                        }
                                                                    </SelectItem>
                                                                );
                                                            }
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => refetchCourses()}
                                                disabled={coursesLoading}
                                                className="whitespace-nowrap"
                                            >
                                                {coursesLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    "Refresh"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="title"
                                            className="text-right"
                                        >
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
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
                                        <div className="col-span-2 text-sm">
                                            Upload File
                                        </div>
                                        <div className="col-span-3">
                                            <FileUploader
                                                uploadPreset="amatech-materials-and-pqs"
                                                accept="application/pdf"
                                                onUploadComplete={
                                                    handleFileUploadComplete
                                                }
                                                autoUpload={false}
                                            />
                                            {materialUpload.selectedFile && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Selected:{" "}
                                                    {
                                                        materialUpload
                                                            .selectedFile.name
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={
                                            uploadMaterialMutation.isPending ||
                                            uploadPastQuestionMutation.isPending ||
                                            materialUpload.isUploading ||
                                            !materialUpload.canProceed
                                        }
                                    >
                                        {(uploadMaterialMutation.isPending ||
                                            uploadPastQuestionMutation.isPending ||
                                            materialUpload.isUploading) && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}

                                        {uploadMaterialMutation.isPending ||
                                        uploadPastQuestionMutation.isPending ||
                                        materialUpload.isUploading
                                            ? "Uploading..."
                                            : "Upload"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Tabs
                        defaultValue="materials"
                        className="w-full"
                        onValueChange={setActiveTab}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="materials">
                                Course Materials ({totalMaterials})
                            </TabsTrigger>
                            <TabsTrigger value="pastQuestions">
                                Past Questions ({totalPastQuestions})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="materials">
                            <div className="flex items-center py-4">
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search materials..."
                                        className="pl-8"
                                    />
                                </div>
                                {materialsError && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetchMaterials()}
                                        className="ml-2"
                                    >
                                        Retry
                                    </Button>
                                )}
                            </div>

                            {/* Error State */}
                            {materialsError && (
                                <div className="py-4 text-center text-red-600">
                                    Failed to load materials. Please try again.
                                </div>
                            )}

                            {/* Loading State */}
                            {materialsLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                    Loading materials...
                                </div>
                            )}

                            {/* Materials Table */}
                            {!materialsLoading && !materialsError && (
                                <div className="rounded border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Course</TableHead>
                                                <TableHead>
                                                    Upload Date
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {materials.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="text-center py-8 text-muted-foreground"
                                                    >
                                                        No materials found.
                                                        Upload one to get
                                                        started.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                materials.map((material) => (
                                                    <TableRow key={material.id}>
                                                        <TableCell className="font-medium">
                                                            {material.title}
                                                        </TableCell>
                                                        <TableCell>
                                                            {material.course
                                                                ?.code || "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                material.createdAt
                                                            ).toLocaleDateString()}
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
                                                                            Open
                                                                            menu
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
                                                                            handleViewMaterial(
                                                                                material
                                                                            )
                                                                        }
                                                                    >
                                                                        <FileText className="mr-2 h-4 w-4" />
                                                                        View
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
                                                                                {deleteMaterialMutation.isPending ? (
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
                                                                                    Are
                                                                                    you
                                                                                    sure?
                                                                                </AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    This
                                                                                    will
                                                                                    permanently
                                                                                    delete
                                                                                    the
                                                                                    material
                                                                                    "
                                                                                    {
                                                                                        material.title
                                                                                    }
                                                                                    ".
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
                                                                                    onClick={() =>
                                                                                        handleDeleteMaterial(
                                                                                            material.id,
                                                                                            material.title
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        deleteMaterialMutation.isPending
                                                                                    }
                                                                                >
                                                                                    {deleteMaterialMutation.isPending ? (
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
                        </TabsContent>
                        <TabsContent value="pastQuestions">
                            <div className="flex items-center py-4">
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search past questions..."
                                        className="pl-8"
                                    />
                                </div>
                                {pastQuestionsError && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetchPastQuestions()}
                                        className="ml-2"
                                    >
                                        Retry
                                    </Button>
                                )}
                            </div>

                            {/* Error State */}
                            {pastQuestionsError && (
                                <div className="py-4 text-center text-red-600">
                                    Failed to load past questions. Please try
                                    again.
                                </div>
                            )}

                            {/* Loading State */}
                            {pastQuestionsLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                    Loading past questions...
                                </div>
                            )}

                            {/* PastQuestions Table */}
                            {!pastQuestionsLoading && !pastQuestionsError && (
                                <div className="rounded border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Course</TableHead>
                                                <TableHead>Year</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pastQuestions.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="text-center py-8 text-muted-foreground"
                                                    >
                                                        No past questions found.
                                                        Upload one to get
                                                        started.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                pastQuestions.map(
                                                    (question) => (
                                                        <TableRow
                                                            key={question.id}
                                                        >
                                                            <TableCell className="font-medium">
                                                                {question.title}
                                                            </TableCell>
                                                            <TableCell>
                                                                {question.course
                                                                    ?.code ||
                                                                    "N/A"}
                                                            </TableCell>
                                                            <TableCell>
                                                                {question.year}
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
                                                                                Open
                                                                                menu
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
                                                                                handleViewPastQuestion(
                                                                                    question
                                                                                )
                                                                            }
                                                                        >
                                                                            <FileText className="mr-2 h-4 w-4" />
                                                                            View
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
                                                                                    {deletePastQuestionMutation.isPending ? (
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
                                                                                        Are
                                                                                        you
                                                                                        sure?
                                                                                    </AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        This
                                                                                        will
                                                                                        permanently
                                                                                        delete
                                                                                        the
                                                                                        past
                                                                                        question
                                                                                        "
                                                                                        {
                                                                                            question.title
                                                                                        }
                                                                                        ".
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
                                                                                        onClick={() =>
                                                                                            handleDeletePastQuestion(
                                                                                                question.id,
                                                                                                question.title
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            deletePastQuestionMutation.isPending
                                                                                        }
                                                                                    >
                                                                                        {deletePastQuestionMutation.isPending ? (
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
                                                    )
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </>
    );
}
