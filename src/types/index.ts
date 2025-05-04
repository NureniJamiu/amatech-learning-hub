import type React from "react";
export type User = {
  id: string;
  name: string;
  email: string;
  level: number;
  isAdmin: boolean;
  currentSemester: 1 | 2;
  avatar?: string;
  department: string;
  faculty: string;
  matricNumber: string;
};

export type Course = {
  id: string;
  code: string;
  title: string;
  units: number;
  level: number;
  semester: 1 | 2;
  description: string;
  materials: Material[];
  pastQuestions: PastQuestion[];
  tutors: Tutor[];
};

export type Material = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
};

export type PastQuestion = {
  id: string;
  title: string;
  year: number;
  fileUrl: string;
  fileType: string;
};

export type Tutor = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Bookmark = {
  id: string;
  title: string;
  icon: React.ElementType;
  url: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
};

export type TimetableEntry = {
  id: string;
  day: string;
  time: string;
  location: string;
  courseId: string;
};
