"use client";

import { BookOpen, FileText, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
}

export function CourseCard({ course, onViewDetails }: CourseCardProps) {
  return (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col border-0 shadow-sm">
          <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm sm:text-base font-bold group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                          {course.code}
                      </CardTitle>
                      <Badge
                          variant="outline"
                          className="text-xs px-2 py-1 font-medium flex-shrink-0 bg-primary/5 text-primary border-primary/20"
                      >
                          {course.units} unit{course.units > 1 ? "s" : ""}
                      </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium text-foreground/80">
                      {course.title}
                  </CardDescription>
              </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3 sm:space-y-4 flex-1 flex flex-col">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                  {course.description}
              </p>

              <div className="flex items-center justify-center gap-4 sm:gap-6 py-2 bg-muted/30 rounded-lg flex-shrink-0">
                  <div className="flex flex-col items-center gap-1">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-semibold text-foreground">
                          {course.materials.length}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                          Materials
                      </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-foreground">
                          {course.pastQuestions.length}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                          Questions
                      </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-semibold text-foreground">
                          {course.tutors.length}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                          Tutors
                      </span>
                  </div>
              </div>

              <Button
                  onClick={() => onViewDetails(course)}
                  className="w-full mt-auto h-9 sm:h-10 font-medium"
                  size="sm"
              >
                  <span className="text-sm">View Course</span>
              </Button>
          </CardContent>
      </Card>
  );
}
