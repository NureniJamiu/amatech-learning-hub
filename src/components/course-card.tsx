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
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {course.code}
            </CardTitle>
            <CardDescription className="text-sm">
              {course.title}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {course.units} unit{course.units > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{course.materials.length}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{course.pastQuestions.length}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{course.tutors.length}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onViewDetails(course)}
          className="w-full"
          size="sm"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
