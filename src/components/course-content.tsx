"use client";

import { Download, ExternalLink } from "lucide-react";

import { useAppContext } from "@/context/app-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CourseContent() {
  const { selectedCourse } = useAppContext();

  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a course from the sidebar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {selectedCourse.code} - {selectedCourse.title}
              </h1>
            </div>
            <Badge className="bg-green-500 hover:bg-green-600">
              {selectedCourse.units} units
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{selectedCourse.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">
                Available Course Material(s)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {selectedCourse.materials.length === 0 ? (
                  <p className="text-muted-foreground">
                    No materials available for this course.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedCourse.materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <span className="text-red-500">{material.title}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <h3 className="mt-16 mb-5 text-xl font-semibold">
                Available Past Questions
              </h3>
              <div>
                {selectedCourse.pastQuestions.length === 0 ? (
                  <p className="text-muted-foreground">
                    No past questions available for this course.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedCourse.pastQuestions.map((pastQuestion) => (
                      <div
                        key={pastQuestion.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <span>{pastQuestion.title}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Tutor(s)</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCourse.tutors.length === 0 ? (
                <p className="text-muted-foreground">Unavailable...</p>
              ) : (
                <div className="space-y-4">
                  {selectedCourse.tutors.map((tutor) => (
                    <div key={tutor.id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                        {tutor.avatar ? (
                          <img
                            src={tutor.avatar || "/placeholder.svg"}
                            alt={tutor.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                            {tutor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tutor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tutor.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Code:</span>
                  <span className="font-medium">{selectedCourse.code}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Units:</span>
                  <span className="font-medium">{selectedCourse.units}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium">{selectedCourse.level}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Semester:</span>
                  <span className="font-medium">{selectedCourse.semester}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Materials:</span>
                  <span className="font-medium">
                    {selectedCourse.materials.length}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Past Questions:</span>
                  <span className="font-medium">
                    {selectedCourse.pastQuestions.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
