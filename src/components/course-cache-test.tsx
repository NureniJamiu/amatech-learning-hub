"use client";

import { useCourses, useCourse } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function CourseCacheTest() {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null
    );

    // Fetch all courses
    const {
        data: coursesResponse,
        isLoading: coursesLoading,
        error: coursesError,
        refetch: refetchCourses,
    } = useCourses({ limit: 10 });

    // Fetch individual course (only when selected)
    const {
        data: course,
        isLoading: courseLoading,
        error: courseError,
        refetch: refetchCourse,
    } = useCourse(selectedCourseId || "");

    const courses = coursesResponse?.courses || [];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Course Cache Test
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => refetchCourses()}
                                disabled={coursesLoading}
                            >
                                {coursesLoading
                                    ? "Refetching..."
                                    : "Refetch All"}
                            </Button>
                            {selectedCourseId && (
                                <Button
                                    size="sm"
                                    onClick={() => refetchCourse()}
                                    disabled={courseLoading}
                                >
                                    {courseLoading
                                        ? "Refetching..."
                                        : "Refetch Course"}
                                </Button>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {/* Courses List */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                All Courses ({courses.length})
                            </h3>
                            {coursesLoading ? (
                                <p>Loading courses...</p>
                            ) : coursesError ? (
                                <p className="text-red-500">
                                    Error: {coursesError.message}
                                </p>
                            ) : (
                                <div className="grid gap-2">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50"
                                            onClick={() =>
                                                setSelectedCourseId(course.id)
                                            }
                                        >
                                            <div>
                                                <span className="font-medium">
                                                    {course.code}
                                                </span>
                                                <span className="text-gray-500 ml-2">
                                                    - {course.title}
                                                </span>
                                            </div>
                                            <Badge variant="secondary">
                                                Level {course.level}, Sem{" "}
                                                {course.semester}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Individual Course */}
                        {selectedCourseId && (
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    Selected Course
                                </h3>
                                {courseLoading ? (
                                    <p>Loading course details...</p>
                                ) : courseError ? (
                                    <p className="text-red-500">
                                        Error: {courseError.message}
                                    </p>
                                ) : course ? (
                                    <div className="space-y-2">
                                        <div>
                                            <strong>Code:</strong> {course.code}
                                        </div>
                                        <div>
                                            <strong>Title:</strong>{" "}
                                            {course.title}
                                        </div>
                                        <div>
                                            <strong>Units:</strong>{" "}
                                            {course.units}
                                        </div>
                                        <div>
                                            <strong>Level:</strong>{" "}
                                            {course.level}, Semester:{" "}
                                            {course.semester}
                                        </div>
                                        <div>
                                            <strong>Description:</strong>{" "}
                                            {course.description}
                                        </div>
                                        <div>
                                            <strong>Materials:</strong>{" "}
                                            {course.materials.length}
                                        </div>
                                        <div>
                                            <strong>Past Questions:</strong>{" "}
                                            {course.pastQuestions.length}
                                        </div>
                                        <div>
                                            <strong>Tutors:</strong>{" "}
                                            {course.tutors.length}
                                        </div>
                                    </div>
                                ) : (
                                    <p>No course selected</p>
                                )}
                            </div>
                        )}

                        {/* Cache Status */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                Cache Status
                            </h3>
                            <div className="text-sm space-y-1">
                                <div>
                                    <strong>Courses List:</strong>{" "}
                                    {coursesLoading ? "Loading" : "Cached"}
                                </div>
                                {selectedCourseId && (
                                    <div>
                                        <strong>Individual Course:</strong>{" "}
                                        {courseLoading ? "Loading" : "Cached"}
                                    </div>
                                )}
                                <div className="text-gray-500 mt-2">
                                    💡 Try clicking "Refetch" buttons to see the
                                    difference between cached and fresh data.
                                    <br />
                                    💡 The individual course data is cached
                                    longer (10 minutes) than the list (2
                                    minutes).
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
