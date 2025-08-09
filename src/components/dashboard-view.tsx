"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Calendar, BookOpen, Clock, Table2Icon } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import {
    useCurrentUserTimetable,
    useAddTimetableEntry,
    TimetableEntryInput,
} from "@/hooks/use-timetable";
import { useUserLevelSemesterCourses, useUserLevelCourses } from "@/hooks/use-courses";
import { RecentlyAccessedCard } from "@/components/recently-accessed-card";

const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const TIME_SLOTS = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
];

export function DashboardView() {
    const { setCurrentView, setSelectedCourse, currentUser } = useAppContext();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newEntry, setNewEntry] = useState({
        day: "Monday",
        time: "",
        courseId: "",
        location: "",
        semester: 1,
    });

    // Fetch user's timetable
    const { data: timetableEntries = [], isLoading: isLoadingTimetable } =
        useCurrentUserTimetable();

    // Fetch courses for the user's level - using optimized hook
    const { data: coursesResponse } = useUserLevelSemesterCourses(
        currentUser?.level || 0,
        currentUser?.currentSemester || 1,
        !!currentUser?.level && !!currentUser?.currentSemester
    );

    // Mutations
    const addTimetableEntryMutation = useAddTimetableEntry();

    const handleViewCourse = (courseCode: string) => {
        const course = coursesResponse?.courses?.find(
            (c) => c.code === courseCode
        );
        if (course) {
            setSelectedCourse(course);
            setCurrentView("courses");
        }
    };

    const handleViewTimetable = () => {
        setCurrentView("timetable");
    };

    const addTimetableEntry = async () => {
        if (newEntry.time && newEntry.courseId && newEntry.location) {
            try {
                const entryData: TimetableEntryInput = {
                    day: newEntry.day,
                    time: newEntry.time,
                    location: newEntry.location,
                    courseId: newEntry.courseId,
                    semester: newEntry.semester,
                };

                await addTimetableEntryMutation.mutateAsync(entryData);

                setNewEntry({
                    day: "Monday",
                    time: "",
                    courseId: "",
                    location: "",
                    semester: 1,
                });
                setIsCreateDialogOpen(false);
            } catch (error) {
                console.error("Failed to add timetable entry:", error);
            }
        }
    };

    // Get current date for greeting
    const currentHour = new Date().getHours();
    let greeting = "Good morning";
    if (currentHour >= 12 && currentHour < 17) {
        greeting = "Good afternoon";
    } else if (currentHour >= 17) {
        greeting = "Good evening";
    }

    // Get user's courses for current semester
    const userCourses = coursesResponse?.courses || [];

    // Get recent timetable entries (limit to upcoming classes)
    const recentTimetableEntries = timetableEntries.slice(0, 5);

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        );
    }

    // Get available courses for current user's level - using optimized hook
    const { data: allLevelCoursesResponse } = useUserLevelCourses(
        currentUser.level,
        !!currentUser.level
    );
    const availableCourses = allLevelCoursesResponse?.courses || [];

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {greeting}, {currentUser.firstname}!
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Welcome back to your learning dashboard
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Courses
                        </CardTitle>
                        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {userCourses.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This semester
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Current Level
                        </CardTitle>
                        <Badge
                            variant="outline"
                            className="text-green-600 border-green-600 text-xs"
                        >
                            Level {currentUser.level}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            Semester {currentUser.currentSemester}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Academic session
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Timetable Entries
                        </CardTitle>
                        <Table2Icon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {timetableEntries.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Scheduled classes
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Department
                        </CardTitle>
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs sm:text-sm font-bold">
                            {currentUser.department}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {currentUser.faculty}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 sm:gap-4">
                <Card className="lg:col-span-4 overflow-hidden">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                        <div className="w-full sm:w-auto">
                            <CardTitle className="text-lg sm:text-xl">
                                My Timetable
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Your recent class schedule
                            </CardDescription>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Dialog
                                open={isCreateDialogOpen}
                                onOpenChange={setIsCreateDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="rounded cursor-pointer flex-1 sm:flex-none"
                                    >
                                        <span className="sm:mr-2">
                                            Add Class
                                        </span>
                                        <Plus className="h-4 w-4 hidden sm:inline" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Class</DialogTitle>
                                        <DialogDescription>
                                            Add a new class to your timetable.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="course"
                                                className="text-right"
                                            >
                                                Course
                                            </Label>
                                            <Select
                                                value={newEntry.courseId}
                                                onValueChange={(value) =>
                                                    setNewEntry({
                                                        ...newEntry,
                                                        courseId: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableCourses.map(
                                                        (course) => (
                                                            <SelectItem
                                                                key={course.id}
                                                                value={
                                                                    course.id
                                                                }
                                                            >
                                                                {course.code} -{" "}
                                                                {course.title}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="day"
                                                className="text-right"
                                            >
                                                Day
                                            </Label>
                                            <Select
                                                value={newEntry.day}
                                                onValueChange={(value) =>
                                                    setNewEntry({
                                                        ...newEntry,
                                                        day: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DAYS_OF_WEEK.map((day) => (
                                                        <SelectItem
                                                            key={day}
                                                            value={day}
                                                        >
                                                            {day}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="time"
                                                className="text-right"
                                            >
                                                Time
                                            </Label>
                                            <Select
                                                value={newEntry.time}
                                                onValueChange={(value) =>
                                                    setNewEntry({
                                                        ...newEntry,
                                                        time: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TIME_SLOTS.map((time) => (
                                                        <SelectItem
                                                            key={time}
                                                            value={time}
                                                        >
                                                            {time}
                                                        </SelectItem>
                                                    ))}
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
                                                value={newEntry.semester.toString()}
                                                onValueChange={(value) =>
                                                    setNewEntry({
                                                        ...newEntry,
                                                        semester:
                                                            parseInt(value),
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">
                                                        First Semester
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        Second Semester
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="location"
                                                className="text-right"
                                            >
                                                Location
                                            </Label>
                                            <Input
                                                id="location"
                                                placeholder="e.g. Room 101"
                                                className="col-span-3"
                                                value={newEntry.location}
                                                onChange={(e) =>
                                                    setNewEntry({
                                                        ...newEntry,
                                                        location:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            onClick={addTimetableEntry}
                                            disabled={
                                                addTimetableEntryMutation.isPending
                                            }
                                        >
                                            {addTimetableEntryMutation.isPending
                                                ? "Adding..."
                                                : "Add to Timetable"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleViewTimetable}
                                className="flex-1 sm:flex-none"
                            >
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                        {isLoadingTimetable ? (
                            <div className="flex items-center justify-center py-8">
                                <p className="text-muted-foreground text-sm">
                                    Loading timetable...
                                </p>
                            </div>
                        ) : recentTimetableEntries.length === 0 ? (
                            <div className="text-center py-6 sm:py-8">
                                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                                <h3 className="text-base sm:text-lg font-semibold mb-2">
                                    No Classes Scheduled
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                                    You haven't added any classes to your
                                    timetable yet.
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="w-full sm:w-auto"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Class
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="min-w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs sm:text-sm">
                                                Day
                                            </TableHead>
                                            <TableHead className="text-xs sm:text-sm">
                                                Time
                                            </TableHead>
                                            <TableHead className="text-xs sm:text-sm">
                                                Course
                                            </TableHead>
                                            <TableHead className="text-xs sm:text-sm">
                                                Location
                                            </TableHead>
                                            <TableHead className="text-xs sm:text-sm text-right">
                                                Semester
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTimetableEntries.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="text-xs sm:text-sm">
                                                    {entry.day}
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">
                                                    {entry.time}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="link"
                                                        className="h-auto p-0 font-medium text-xs sm:text-sm"
                                                        onClick={() =>
                                                            handleViewCourse(
                                                                entry.course
                                                                    ?.code || ""
                                                            )
                                                        }
                                                    >
                                                        {entry.course?.code}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">
                                                    {entry.location}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        Semester{" "}
                                                        {entry.semester}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <RecentlyAccessedCard />
            </div>
        </div>
    );
}
