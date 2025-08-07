"use client";

import { useState } from "react";
import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { FileText, GraduationCap, Plus, Table2Icon } from "lucide-react";

import { currentUser } from "@/data/mock-data";
import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseFilterTest } from "@/components/course-filter-test";

export function DashboardView() {
    const { filteredCourses, setCurrentView, setSelectedCourse } =
        useAppContext();
    const [timetable, setTimetable] = useState<
        Array<{
            id: string;
            day: string;
            time: string;
            course: string;
            location: string;
        }>
    >([
        {
            id: "1",
            day: "Monday",
            time: "9:00 AM - 11:00 AM",
            course: "MTE 301",
            location: "Room 101",
        },
        {
            id: "2",
            day: "Tuesday",
            time: "1:00 PM - 3:00 PM",
            course: "MTE 303",
            location: "Lab 2",
        },
        {
            id: "3",
            day: "Wednesday",
            time: "10:00 AM - 12:00 PM",
            course: "MTE 305",
            location: "Room 205",
        },
    ]);
    const [newEntry, setNewEntry] = useState({
        day: "Monday",
        time: "",
        course: "",
        location: "",
    });

    const handleViewCourse = (courseCode: string) => {
        const course = filteredCourses.find((c) => c.code === courseCode);
        if (course) {
            setSelectedCourse(course);
            setCurrentView("courses");
        }
    };

    const addTimetableEntry = () => {
        if (newEntry.time && newEntry.course && newEntry.location) {
            setTimetable([
                ...timetable,
                {
                    id: Date.now().toString(),
                    day: newEntry.day,
                    time: newEntry.time,
                    course: newEntry.course,
                    location: newEntry.location,
                },
            ]);
            setNewEntry({
                day: "Monday",
                time: "",
                course: "",
                location: "",
            });
        }
    };

    // Get current date for greeting
    const currentHour = new Date().getHours();
    let greeting = "Good morning";
    if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good afternoon";
    } else if (currentHour >= 18) {
        greeting = "Good evening";
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {greeting}, {currentUser.name.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">
                    Welcome to your learning dashboard. Here's what's happening
                    in your academic world.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Enrolled Courses
                        </CardTitle>
                        <GraduationCap className="size-6 text-green-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {filteredCourses.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {currentUser.level} Level, Semester{" "}
                            {currentUser.currentSemester}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Course Materials
                        </CardTitle>
                        <FileText className="size-6 text-blue-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {filteredCourses.reduce(
                                (acc, course) => acc + course.materials.length,
                                0
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Available for download
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Timetable Entries
                        </CardTitle>
                        <Table2Icon className="size-6 text-yellow-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {timetable.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Scheduled classes
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Debug component - remove in production */}
            <CourseFilterTest />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader className="flex justify-between items-center">
                        <div>
                            <CardTitle>My Timetable</CardTitle>
                            <CardDescription>
                                Your weekly class schedule
                            </CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    className="rounded cursor-pointer"
                                >
                                    Add Class
                                    <Plus className="size-4" />
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
                                                <SelectItem value="Monday">
                                                    Monday
                                                </SelectItem>
                                                <SelectItem value="Tuesday">
                                                    Tuesday
                                                </SelectItem>
                                                <SelectItem value="Wednesday">
                                                    Wednesday
                                                </SelectItem>
                                                <SelectItem value="Thursday">
                                                    Thursday
                                                </SelectItem>
                                                <SelectItem value="Friday">
                                                    Friday
                                                </SelectItem>
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
                                        <Input
                                            id="time"
                                            placeholder="e.g. 9:00 AM - 11:00 AM"
                                            className="col-span-3"
                                            value={newEntry.time}
                                            onChange={(e) =>
                                                setNewEntry({
                                                    ...newEntry,
                                                    time: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="course"
                                            className="text-right"
                                        >
                                            Course
                                        </Label>
                                        <Input
                                            id="course"
                                            placeholder="e.g. MTE 301"
                                            className="col-span-3"
                                            value={newEntry.course}
                                            onChange={(e) =>
                                                setNewEntry({
                                                    ...newEntry,
                                                    course: e.target.value,
                                                })
                                            }
                                        />
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
                                                    location: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={addTimetableEntry}>
                                        Add to Timetable
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table className="overflow-x-hidden">
                            <TableHeader className="overflow-x-clip">
                                <TableRow>
                                    <TableHead>Day</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead className="text-right">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {timetable.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>{entry.day}</TableCell>
                                        <TableCell>{entry.time}</TableCell>
                                        <TableCell>{entry.course}</TableCell>
                                        <TableCell>{entry.location}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleViewCourse(
                                                        entry.course
                                                    )
                                                }
                                            >
                                                View Course
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Student Information</CardTitle>
                        <CardDescription>Your academic profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    {currentUser.avatar ? (
                                        <AvatarImage
                                            // src={currentUser.avatar || "/images/login.jpg"}
                                            src={"/images/login.jpg"}
                                            alt={currentUser.name}
                                        />
                                    ) : (
                                        <AvatarFallback>
                                            {currentUser.name.charAt(0)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">
                                        {currentUser.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {currentUser.email}
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">
                                        Matric Number
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {currentUser.matricNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Level</p>
                                    <p className="text-sm text-muted-foreground">
                                        {currentUser.level}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Department
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {currentUser.department}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Faculty
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {currentUser.faculty}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                            View Full Profile
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
