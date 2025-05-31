"use client";

import { useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";

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

export function ContentManagement() {
    const [activeTab, setActiveTab] = useState("materials");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [formData, setFormData] = useState<MaterialInput>({
        title: "",
        courseId: "",
        file: null,
        type: "material",
    });

    // React Query Hooks
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
        isLoading,
        error,
        refetch,
    } = useCourses({
        search: undefined,
        limit: 50,
    });

    const queryClient = useQueryClient();
    const uploadMaterialMutation = useUploadMaterial();
    // const deleteMaterialMutation = useDeleteMaterial();
    const uploadPastQuestionMutation = useUploadPastQuestion();
    // const deletePastQuestionMutation = useDeletePastQuestion();

    const materials = materialsResponse?.materials || [];
    // const totalMaterials = materialsResponse?.total || 0;
    const pastQuestions = pastQuestionsResponse?.pastQuestions || [];
    // const totalPastQuestions = pastQuestionsResponse?.total || 0;
    const courses = coursesResponse?.courses || [];

    // Handle form submission for creating/updating courses
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Form data before submission:", formData);

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

        try {
            if (formData.type === "material") {
                await uploadMaterialMutation.mutateAsync(formData);
                queryClient.invalidateQueries({ queryKey: ["materials"] });
            } else {
                await uploadPastQuestionMutation.mutateAsync(formData);
                queryClient.invalidateQueries({ queryKey: ["pastQuestions"] });
            }
            setFormData({
                title: "",
                courseId: "",
                file: null,
            });
        } catch (error) {
            // Error is handled by the mutation's onError
            console.log("Error uploading material:", error);
        }
    };

    const handleFileUploadComplete = (url: string) => {
        setFormData((prev) => ({ ...prev, file: url }));
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
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
                                            value={formData.type ?? ""}
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
                                        <Select
                                            value={formData.courseId ?? ""}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    courseId: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((course) => {
                                                    return (
                                                        <SelectItem
                                                            key={course.id}
                                                            value={course.id}
                                                        >
                                                            {course.code} -{" "}
                                                            {course.title}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
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
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={
                                            uploadMaterialMutation.isPending ||
                                            uploadPastQuestionMutation.isPending
                                        }
                                    >
                                        {uploadMaterialMutation.isPending ||
                                            (uploadPastQuestionMutation.isPending && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ))}

                                        {uploadMaterialMutation.isPending ||
                                        uploadPastQuestionMutation.isPending
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
                                Course Materials
                            </TabsTrigger>
                            <TabsTrigger value="pastQuestions">
                                Past Questions
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
                                            {materials.map((material) => (
                                                <TableRow key={material.id}>
                                                    <TableCell className="font-medium">
                                                        {material.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        {material.course.code}
                                                    </TableCell>
                                                    <TableCell>
                                                        {material.createdAt}
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
                                                                <DropdownMenuItem>
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    View
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
                                            {pastQuestions.map((question) => (
                                                <TableRow key={question.id}>
                                                    <TableCell className="font-medium">
                                                        {question.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        {question.title}
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
                                                                <DropdownMenuItem>
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    View
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
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </>
    );
}
