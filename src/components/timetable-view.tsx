import React, { useState, useMemo } from "react";
import { Plus, Calendar, Clock, MapPin, Trash2, Edit, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAppContext } from "@/context/app-context";
import { useCourses } from "@/hooks/use-courses";
import {
  useCurrentUserTimetableBySemester,
  useAddTimetableEntry,
  useUpdateTimetableEntry,
  useDeleteTimetableEntry,
  TimetableEntryInput
} from "@/hooks/use-timetable";
import type { TimetableEntry } from "@/types";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
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
  "5:00 PM - 6:00 PM"
];

interface TimetableFormData {
  day: string;
  time: string;
  location: string;
  courseId: string;
}

export function TimetableView() {
  const { currentUser } = useAppContext();
  const [activeSemester, setActiveSemester] = useState<1 | 2>(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState<TimetableFormData>({
    day: "",
    time: "",
    location: "",
    courseId: "",
  });

  // Fetch timetable entries for the active semester
  const {
    data: timetableEntries = [],
    isLoading: isLoadingTimetable,
    error: timetableError
  } = useCurrentUserTimetableBySemester(activeSemester);

  // Fetch courses for the current user's level
  const { data: coursesResponse } = useCourses({
    level: currentUser?.level,
    limit: 1000
  });

  // Filter courses by user's level and active semester
  const availableCourses = useMemo(() => {
    if (!coursesResponse?.courses || !currentUser) return [];

    return coursesResponse.courses.filter(
      course => course.level === currentUser.level && course.semester === activeSemester
    );
  }, [coursesResponse?.courses, currentUser, activeSemester]);

  // Mutations
  const addTimetableEntryMutation = useAddTimetableEntry();
  const updateTimetableEntryMutation = useUpdateTimetableEntry();
  const deleteTimetableEntryMutation = useDeleteTimetableEntry();

  // Organize entries by day and time for grid view
  const timetableGrid = useMemo(() => {
    const grid: Record<string, Record<string, TimetableEntry | null>> = {};

    DAYS_OF_WEEK.forEach(day => {
      grid[day] = {};
      TIME_SLOTS.forEach(time => {
        grid[day][time] = null;
      });
    });

    timetableEntries.forEach(entry => {
      if (grid[entry.day] && grid[entry.day][entry.time] !== undefined) {
        grid[entry.day][entry.time] = entry;
      }
    });

    return grid;
  }, [timetableEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.day || !formData.time || !formData.location || !formData.courseId) {
      return;
    }

    try {
      const entryData: TimetableEntryInput = {
        ...formData,
        semester: activeSemester,
      };

      if (editingEntry) {
        await updateTimetableEntryMutation.mutateAsync({
          id: editingEntry.id,
          data: entryData,
        });
      } else {
        await addTimetableEntryMutation.mutateAsync(entryData);
      }

      // Reset form and close dialog
      setFormData({ day: "", time: "", location: "", courseId: "" });
      setIsCreateDialogOpen(false);
      setEditingEntry(null);
    } catch (error) {
      console.error("Failed to save timetable entry:", error);
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      day: entry.day,
      time: entry.time,
      location: entry.location,
      courseId: entry.courseId,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (entryId: string) => {
    try {
      await deleteTimetableEntryMutation.mutateAsync(entryId);
    } catch (error) {
      console.error("Failed to delete timetable entry:", error);
    }
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    setEditingEntry(null);
    setFormData({ day: "", time: "", location: "", courseId: "" });
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    );
  }

  const isEmpty = timetableEntries.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Timetable</h1>
        <p className="text-muted-foreground">
          Level {currentUser.level} timetable for {currentUser.department}
        </p>
      </div>

      {/* Semester Tabs */}
      <Tabs
        value={activeSemester.toString()}
        onValueChange={(value) => setActiveSemester(value as "1" | "2" as any)}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="1" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              First Semester
              <Badge variant="secondary" className="ml-1">
                {activeSemester === 1 ? timetableEntries.length : 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="2" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Second Semester
              <Badge variant="secondary" className="ml-1">
                {activeSemester === 2 ? timetableEntries.length : 0}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Add Entry Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingEntry ? "Edit Class" : "Add New Class"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingEntry
                      ? "Update the class information below."
                      : `Add a new class to your ${activeSemester === 1 ? "first" : "second"} semester timetable.`
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="course" className="text-right">
                      Course *
                    </Label>
                    <Select
                      value={formData.courseId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, courseId: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="day" className="text-right">
                      Day *
                    </Label>
                    <Select
                      value={formData.day}
                      onValueChange={(value) =>
                        setFormData({ ...formData, day: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time *
                    </Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) =>
                        setFormData({ ...formData, time: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g. Room 101, Lab 2"
                      className="col-span-3"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      addTimetableEntryMutation.isPending ||
                      updateTimetableEntryMutation.isPending
                    }
                  >
                    {editingEntry ? "Update Class" : "Add Class"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="1" className="mt-6">
          <TimetableContent
            semester={1}
            timetableEntries={activeSemester === 1 ? timetableEntries : []}
            timetableGrid={activeSemester === 1 ? timetableGrid : {}}
            isEmpty={activeSemester === 1 ? isEmpty : true}
            isLoading={isLoadingTimetable}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="2" className="mt-6">
          <TimetableContent
            semester={2}
            timetableEntries={activeSemester === 2 ? timetableEntries : []}
            timetableGrid={activeSemester === 2 ? timetableGrid : {}}
            isEmpty={activeSemester === 2 ? isEmpty : true}
            isLoading={isLoadingTimetable}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TimetableContentProps {
  semester: number;
  timetableEntries: TimetableEntry[];
  timetableGrid: Record<string, Record<string, TimetableEntry | null>>;
  isEmpty: boolean;
  isLoading: boolean;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (entryId: string) => void;
}

function TimetableContent({
  semester,
  timetableEntries,
  timetableGrid,
  isEmpty,
  isLoading,
  onEdit,
  onDelete
}: TimetableContentProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading timetable...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Classes Scheduled</h3>
          <p className="text-muted-foreground text-center mb-4">
            You haven't added any classes to your {semester === 1 ? "first" : "second"} semester timetable yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Click "Add Class" to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">View:</span>
          <Select value={viewMode} onValueChange={(value: "grid" | "list") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {timetableEntries.length} class{timetableEntries.length !== 1 ? "es" : ""} scheduled
        </p>
      </div>

      {viewMode === "grid" ? (
        <TimetableGridView
          timetableGrid={timetableGrid}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <TimetableListView
          timetableEntries={timetableEntries}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

function TimetableGridView({
  timetableGrid,
  onEdit,
  onDelete
}: {
  timetableGrid: Record<string, Record<string, TimetableEntry | null>>;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (entryId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>Your classes organized by day and time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Time</TableHead>
                {DAYS_OF_WEEK.map((day) => (
                  <TableHead key={day} className="text-center min-w-32">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {TIME_SLOTS.map((time) => (
                <TableRow key={time}>
                  <TableCell className="font-medium">{time}</TableCell>
                  {DAYS_OF_WEEK.map((day) => {
                    const entry = timetableGrid[day]?.[time];
                    return (
                      <TableCell key={`${day}-${time}`} className="p-1">
                        {entry ? (
                          <TimetableEntryCard
                            entry={entry}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            compact
                          />
                        ) : (
                          <div className="h-16 w-full"></div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function TimetableListView({
  timetableEntries,
  onEdit,
  onDelete
}: {
  timetableEntries: TimetableEntry[];
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (entryId: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {timetableEntries.map((entry) => (
        <TimetableEntryCard
          key={entry.id}
          entry={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function TimetableEntryCard({
  entry,
  onEdit,
  onDelete,
  compact = false
}: {
  entry: TimetableEntry;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (entryId: string) => void;
  compact?: boolean;
}) {
  return (
    <Card className={compact ? "h-16" : ""}>
      <CardContent className={`p-3 ${compact ? "py-2" : ""}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h4 className={`font-semibold ${compact ? "text-xs" : "text-sm"} truncate`}>
              {entry.course?.code || "Course"}
            </h4>
            {!compact && (
              <p className="text-xs text-muted-foreground truncate">
                {entry.course?.title}
              </p>
            )}
            <div className={`flex items-center gap-2 text-xs text-muted-foreground ${compact ? "flex-col items-start gap-0" : ""}`}>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className={compact ? "text-xs" : ""}>{entry.day}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className={compact ? "text-xs" : ""}>{entry.location}</span>
              </div>
            </div>
          </div>

          {!compact && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entry)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Class</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this class from your timetable?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(entry.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
