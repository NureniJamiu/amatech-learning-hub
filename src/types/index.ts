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

export type Material2 = {
    id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    courseId: string;
    createdAt: string; // or Date if you parse it
    processed: boolean;
    processingStatus: string;
    processingError?: string;
    chunksCount: number;
    processingStartedAt?: string;
    processingCompletedAt?: string;
    course: {
        code: string;
        title: string;
    };
    uploadedBy: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
    };
};


export type PastQuestion = {
    id: string;
    title: string;
    year: number;
    fileUrl: string;
    fileType: string;
    course?: {
        code: string;
        title: string;
    };
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
    semester: number;
    courseId: string;
    course?: Course; // Optional, for when we include course details
};
