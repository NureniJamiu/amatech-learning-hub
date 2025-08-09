"use client";

import { useState } from "react";
import { Download, ExternalLink, ArrowLeft } from "lucide-react";

import { useAppContext } from "@/context/app-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Material, PastQuestion, Material2 } from "@/types";
import { FullScreenPDFViewer } from "./full-screen-pdf-viewer";
import { useRecentlyAccessed } from "@/hooks/use-recently-accessed";

// Local PDF path for development
const LOCAL_PDF_PATH = "/pdfs/stakeholders.pdf";

export function CourseContent() {
    const { selectedCourse, setSelectedCourse } = useAppContext();
    const { trackMaterialAccess, trackPastQuestionAccess } =
        useRecentlyAccessed();
    const [viewingPdf, setViewingPdf] = useState<
        Material | PastQuestion | null
    >(null);

    if (!selectedCourse) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                    Select a course from the sidebar
                </p>
            </div>
        );
    }

    // Function to go back to courses list
    const handleBackToCourses = () => {
        setSelectedCourse(null);
    };

    // Function to handle PDF download
    const handleDownload = (
        fileUrl: string,
        title: string,
        item?: Material | PastQuestion
    ) => {
        // Track the access for recently accessed items if item is provided
        if (item) {
            if ("year" in item) {
                // It's a past question
                const pastQuestionWithCourse = {
                    ...item,
                    course: {
                        code: selectedCourse.code,
                        title: selectedCourse.title,
                    },
                };
                trackPastQuestionAccess(pastQuestionWithCourse);
            } else {
                // It's a material
                const materialWithCourse: Material2 = {
                    id: item.id,
                    title: item.title,
                    fileUrl: item.fileUrl,
                    fileType: item.fileType,
                    createdAt: new Date().toISOString(),
                    course: {
                        code: selectedCourse.code,
                        title: selectedCourse.title,
                    },
                    uploadedBy: {
                        id: "mock",
                        firstname: "Mock",
                        lastname: "User",
                        email: "mock@example.com",
                    },
                };
                trackMaterialAccess(materialWithCourse);
            }
        }

        // Use the actual file URL or fallback to local PDF for development
        const pdfUrl = fileUrl && fileUrl !== "#" ? fileUrl : LOCAL_PDF_PATH;

        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `${title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to handle opening PDF
    const handleOpenPdf = (item: Material | PastQuestion) => {
        // Track the access for recently accessed items
        if ("year" in item) {
            // It's a past question
            const pastQuestionWithCourse = {
                ...item,
                course: {
                    code: selectedCourse.code,
                    title: selectedCourse.title,
                },
            };
            trackPastQuestionAccess(pastQuestionWithCourse);
        } else {
            // It's a material
            const materialWithCourse: Material2 = {
                id: item.id,
                title: item.title,
                fileUrl: item.fileUrl,
                fileType: item.fileType,
                createdAt: new Date().toISOString(),
                course: {
                    code: selectedCourse.code,
                    title: selectedCourse.title,
                },
                uploadedBy: {
                    id: "mock",
                    firstname: "Mock",
                    lastname: "User",
                    email: "mock@example.com",
                },
            };
            trackMaterialAccess(materialWithCourse);
        }

        // Use the actual file URL or fallback to local PDF for development
        const actualFileUrl =
            item.fileUrl && item.fileUrl !== "#"
                ? item.fileUrl
                : LOCAL_PDF_PATH;

        // Create a modified item with the actual or fallback file URL
        const modifiedItem = {
            ...item,
            fileUrl: actualFileUrl,
        };
        setViewingPdf(modifiedItem);
    };

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToCourses}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to Courses</span>
                    <span className="sm:hidden">Back</span>
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                                {selectedCourse.code} - {selectedCourse.title}
                            </h1>
                        </div>
                        <Badge className="bg-green-500 hover:bg-green-600 flex-shrink-0">
                            {selectedCourse.units} units
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        {selectedCourse.description}
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-xl">
                                Available Course Material(s)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedCourse.materials.length === 0 ? (
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    No materials available for this course.
                                </p>
                            ) : (
                                <div className="space-y-2 sm:space-y-3">
                                    {selectedCourse.materials.map(
                                        (material) => (
                                            <div
                                                key={material.id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3 border rounded-lg"
                                            >
                                                <span className="text-sm sm:text-base text-red-500 font-medium truncate min-w-0 flex-1">
                                                    {material.title}
                                                </span>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-500 text-xs sm:text-sm"
                                                        onClick={() =>
                                                            handleOpenPdf(
                                                                material
                                                            )
                                                        }
                                                    >
                                                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                        Open
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-500 text-xs sm:text-sm"
                                                        onClick={() =>
                                                            handleDownload(
                                                                material.fileUrl,
                                                                material.title,
                                                                material
                                                            )
                                                        }
                                                    >
                                                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-xl">
                                Available Past Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedCourse.pastQuestions.length === 0 ? (
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    No past questions available for this course.
                                </p>
                            ) : (
                                <div className="space-y-2 sm:space-y-3">
                                    {selectedCourse.pastQuestions.map(
                                        (pastQuestion) => (
                                            <div
                                                key={pastQuestion.id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3 border rounded-lg"
                                            >
                                                <span className="text-sm sm:text-base font-medium truncate min-w-0 flex-1">
                                                    {pastQuestion.title}
                                                </span>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-500 text-xs sm:text-sm"
                                                        onClick={() =>
                                                            handleOpenPdf(
                                                                pastQuestion
                                                            )
                                                        }
                                                    >
                                                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                        Open
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-500 text-xs sm:text-sm"
                                                        onClick={() =>
                                                            handleDownload(
                                                                pastQuestion.fileUrl,
                                                                pastQuestion.title,
                                                                pastQuestion
                                                            )
                                                        }
                                                    >
                                                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-xl">Tutor(s)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedCourse.tutors.length === 0 ? (
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Unavailable...
                                </p>
                            ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    {selectedCourse.tutors.map((tutor) => (
                                        <div
                                            key={tutor.id}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                                                {tutor.avatar ? (
                                                    <img
                                                        src={
                                                            tutor.avatar ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={tutor.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-xs sm:text-sm">
                                                        {tutor.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm sm:text-base font-medium truncate">
                                                    {tutor.name}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                                    {tutor.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-xl">
                                Course Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Code:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {selectedCourse.code}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Units:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {selectedCourse.units}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Level:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {selectedCourse.level}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Semester:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {selectedCourse.semester}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Materials:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {selectedCourse.materials.length}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Past Questions:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {selectedCourse.pastQuestions.length}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* PDF Viewer Dialog */}
            {viewingPdf && (
                <FullScreenPDFViewer
                    fileUrl={viewingPdf.fileUrl}
                    title={viewingPdf.title}
                    open={!!viewingPdf}
                    onClose={() => setViewingPdf(null)}
                />
            )}
        </div>
    );
}
