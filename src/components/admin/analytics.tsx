"use client";

import { BarChart, LineChart, Users, BookOpen, FileText, GraduationCap } from "lucide-react";
import { useCourses } from "@/hooks/use-courses";
import { useMaterials } from "@/hooks/use-materials";
import { usePastQuestions } from "@/hooks/use-past-questions";
import { useTutors } from "@/hooks/use-tutors";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Analytics() {
  // Real data from our hooks
  const { data: coursesResponse, isLoading: coursesLoading } = useCourses({ limit: 1000 });
  const { data: materialsResponse, isLoading: materialsLoading } = useMaterials({ limit: 1000 });
  const { data: pastQuestionsResponse, isLoading: pastQuestionsLoading } = usePastQuestions({ limit: 1000 });
  const { data: tutorsResponse, isLoading: tutorsLoading } = useTutors({ limit: 1000 });

  // Extract data
  const courses = coursesResponse?.courses || [];
  const materials = materialsResponse?.materials || [];
  const pastQuestions = pastQuestionsResponse?.pastQuestions || [];
  const tutors = tutorsResponse?.tutors || [];

  // Calculate analytics
  const totalCourses = courses.length;
  const totalMaterials = materials.length;
  const totalPastQuestions = pastQuestions.length;
  const totalTutors = tutors.length;

  // Calculate course usage (materials per course)
  const courseUsageData = courses.map(course => {
    const courseMaterials = materials.filter(material => material.course?.code === course.code);
    const coursePastQuestions = pastQuestions.filter(pq => pq.course?.code === course.code);
    return {
      course: course.code,
      materials: courseMaterials.length,
      pastQuestions: coursePastQuestions.length,
      totalContent: courseMaterials.length + coursePastQuestions.length
    };
  }).sort((a, b) => b.totalContent - a.totalContent).slice(0, 5);

  // Calculate content distribution
  const contentDistribution = [
    { name: "Course Materials", value: totalMaterials, color: "bg-blue-500" },
    { name: "Past Questions", value: totalPastQuestions, color: "bg-green-500" },
  ];

  // Calculate level distribution
  const levelDistribution = courses.reduce((acc, course) => {
    acc[course.level] = (acc[course.level] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const isLoading = coursesLoading || materialsLoading || pastQuestionsLoading || tutorsLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {totalCourses > 0 ? `${totalCourses} courses available` : "No courses yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Materials</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterials}</div>
            <p className="text-xs text-muted-foreground">
              {totalMaterials > 0 ? `${totalMaterials} materials uploaded` : "No materials yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Questions</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPastQuestions}</div>
            <p className="text-xs text-muted-foreground">
              {totalPastQuestions > 0 ? `${totalPastQuestions} past questions` : "No past questions yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tutors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTutors}</div>
            <p className="text-xs text-muted-foreground">
              {totalTutors > 0 ? `${totalTutors} tutors registered` : "No tutors yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Course Usage Analytics</CardTitle>
            <CardDescription>
              Most content-rich courses (materials + past questions)
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {courseUsageData.length > 0 ? (
              <div className="space-y-4">
                {courseUsageData.map((course, index) => (
                  <div key={course.course} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{course.course}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.materials} materials, {course.pastQuestions} past questions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{course.totalContent}</p>
                      <p className="text-xs text-muted-foreground">total items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No course data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Materials vs Past Questions</CardDescription>
          </CardHeader>
          <CardContent>
            {contentDistribution.some(item => item.value > 0) ? (
              <div className="space-y-4">
                {contentDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}</span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Content</span>
                    <span className="text-sm font-bold">{totalMaterials + totalPastQuestions}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No content data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>View detailed analytics by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="courses">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="tutors">Tutors</TabsTrigger>
            </TabsList>
            <TabsContent value="courses" className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Course Level Distribution</h3>
                  <div className="grid gap-4 md:grid-cols-5">
                    {Object.entries(levelDistribution).map(([level, count]) => (
                      <Card key={level}>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{count}</div>
                          <p className="text-sm text-muted-foreground">Level {level}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Course Details</h3>
                  <div className="space-y-2">
                    {courses.map((course) => {
                      const courseMaterials = materials.filter(m => m.course?.code === course.code);
                      const coursePastQuestions = pastQuestions.filter(pq => pq.course?.code === course.code);
                      return (
                        <div key={course.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{course.code} - {course.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Level {course.level}, Semester {course.semester}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{courseMaterials.length} materials</p>
                            <p className="text-sm text-muted-foreground">{coursePastQuestions.length} past questions</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="content" className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Content Overview</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Course Materials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-2">{totalMaterials}</div>
                        <p className="text-muted-foreground">Total materials uploaded</p>
                        {materials.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Recent Materials:</p>
                            {materials.slice(0, 3).map((material) => (
                              <div key={material.id} className="text-sm text-muted-foreground">
                                • {material.title} ({material.course?.code})
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Past Questions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-2">{totalPastQuestions}</div>
                        <p className="text-muted-foreground">Total past questions</p>
                        {pastQuestions.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Recent Past Questions:</p>
                            {pastQuestions.slice(0, 3).map((question) => (
                              <div key={question.id} className="text-sm text-muted-foreground">
                                • {question.title} ({question.year})
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tutors" className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Tutor Overview</h3>
                  <div className="text-3xl font-bold mb-2">{totalTutors}</div>
                  <p className="text-muted-foreground">Total tutors registered</p>
                </div>
                {tutors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Tutor List</h3>
                    <div className="space-y-2">
                      {tutors.map((tutor) => (
                        <div key={tutor.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{tutor.name}</p>
                            <p className="text-sm text-muted-foreground">{tutor.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
