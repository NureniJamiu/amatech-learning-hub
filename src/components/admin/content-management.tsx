"use client";

import { useState } from "react";
import { FileText, FileUp, MoreHorizontal, Search, Trash2 } from "lucide-react";

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

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("materials");

  // Mock data
  const materials = [
    {
      id: "1",
      title: "MTE 301 Course Material 1",
      courseCode: "MTE 301",
      fileType: "pdf",
      uploadDate: "2023-09-15",
    },
    {
      id: "2",
      title: "MTE 301 Course Material 2",
      courseCode: "MTE 301",
      fileType: "pdf",
      uploadDate: "2023-09-20",
    },
    {
      id: "3",
      title: "MTE 303 Course Material 1",
      courseCode: "MTE 303",
      fileType: "pdf",
      uploadDate: "2023-10-05",
    },
    {
      id: "4",
      title: "MTE 305 Course Material 1",
      courseCode: "MTE 305",
      fileType: "pdf",
      uploadDate: "2023-10-12",
    },
    {
      id: "5",
      title: "MTE 307 Course Material 1",
      courseCode: "MTE 307",
      fileType: "pdf",
      uploadDate: "2023-11-03",
    },
  ];

  const pastQuestions = [
    {
      id: "1",
      title: "MTE 301 Past Question 2023",
      courseCode: "MTE 301",
      year: 2023,
      fileType: "pdf",
    },
    {
      id: "2",
      title: "MTE 301 Past Question 2022",
      courseCode: "MTE 301",
      year: 2022,
      fileType: "pdf",
    },
    {
      id: "3",
      title: "MTE 303 Past Question 2023",
      courseCode: "MTE 303",
      year: 2023,
      fileType: "pdf",
    },
    {
      id: "4",
      title: "MTE 305 Past Question 2023",
      courseCode: "MTE 305",
      year: 2023,
      fileType: "pdf",
    },
    {
      id: "5",
      title: "MTE 307 Past Question 2023",
      courseCode: "MTE 307",
      year: 2023,
      fileType: "pdf",
    },
  ];

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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Content</DialogTitle>
                <DialogDescription>
                  Upload new course materials or past questions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contentType" className="text-right">
                    Content Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material">Course Material</SelectItem>
                      <SelectItem value="pastQuestion">
                        Past Question
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course" className="text-right">
                    Course
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mte301">MTE 301</SelectItem>
                      <SelectItem value="mte303">MTE 303</SelectItem>
                      <SelectItem value="mte305">MTE 305</SelectItem>
                      <SelectItem value="mte307">MTE 307</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    File
                  </Label>
                  <Input id="file" type="file" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Upload</Button>
              </DialogFooter>
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
              <TabsTrigger value="materials">Course Materials</TabsTrigger>
              <TabsTrigger value="pastQuestions">Past Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="materials">
              <div className="flex items-center py-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search materials..." className="pl-8" />
                </div>
              </div>
              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>File Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">
                          {material.title}
                        </TableCell>
                        <TableCell>{material.courseCode}</TableCell>
                        <TableCell>{material.fileType.toUpperCase()}</TableCell>
                        <TableCell>{material.uploadDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
              </div>
              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>File Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">
                          {question.title}
                        </TableCell>
                        <TableCell>{question.courseCode}</TableCell>
                        <TableCell>{question.year}</TableCell>
                        <TableCell>{question.fileType.toUpperCase()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
