import {
    Briefcase,
    Compass,
    GraduationCap,
    LayoutDashboard,
    MessageSquare,
} from "lucide-react";

import type { Bookmark, Course, User } from "@/types";

export const currentUser: User & { isAdmin: boolean } = {
  id: "user-1",
  name: "Nureni Jamiu",
  email: "nurenijamiu@gmail.com",
  level: 300,
  currentSemester: 1,
  avatar: "/placeholder.svg?height=40&width=40",
  department: "Management Technology",
  faculty: "Management Sciences",
  matricNumber: "220822017",
  isAdmin: true, // Set to true to enable admin functionality
};

export const courses: Course[] = [
  {
    id: "course-1",
    code: "MTE 301",
    title: "Engineering Economics",
    units: 3,
    level: 300,
    semester: 1,
    description:
      "Engineering Economics is a course that focuses on the application of economic principles to engineering projects and decision-making. It covers topics such as cost analysis, project evaluation, and financial management in engineering contexts.",
    materials: [
      {
        id: "material-1",
        title: "MTE 301 Course Material 1",
        fileUrl: "#",
        fileType: "pdf",
      },
      {
        id: "material-2",
        title: "MTE 301 Course Material 2",
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    pastQuestions: [
      {
        id: "pq-1",
        title: "MTE 301 Past Question 2023",
        year: 2023,
        fileUrl: "#",
        fileType: "pdf",
      },
      {
        id: "pq-2",
        title: "MTE 301 Past Question 2022",
        year: 2022,
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    tutors: [],
  },
  {
    id: "course-2",
    code: "MTE 303",
    title: "Thermodynamics",
    units: 2,
    level: 300,
    semester: 1,
    description:
      "Thermodynamics is the study of energy and its transformations. This course covers the fundamental principles of thermodynamics, including the laws of thermodynamics, thermodynamic processes, and their applications in engineering systems.",
    materials: [
      {
        id: "material-3",
        title: "MTE 303 Course Material 1",
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    pastQuestions: [
      {
        id: "pq-3",
        title: "MTE 303 Past Question 2023",
        year: 2023,
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    tutors: [
      {
        id: "tutor-1",
        name: "Dr. Adebayo Johnson",
        email: "adebayo@university.edu",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "course-3",
    code: "MTE 305",
    title: "Fluid Mechanics",
    units: 3,
    level: 300,
    semester: 1,
    description:
      "Fluid Mechanics is the study of fluids and the forces on them. This course covers fluid statics, fluid dynamics, dimensional analysis, and applications in engineering systems.",
    materials: [
      {
        id: "material-4",
        title: "MTE 305 Course Material 1",
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    pastQuestions: [
      {
        id: "pq-4",
        title: "MTE 305 Past Question 2023",
        year: 2023,
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    tutors: [],
  },
  {
    id: "course-4",
    code: "MTE 307",
    title: "Materials Science",
    units: 2,
    level: 300,
    semester: 1,
    description:
      "Materials Science is the study of the properties of materials and their applications in engineering. This course covers the structure, properties, processing, and performance of engineering materials.",
    materials: [
      {
        id: "material-5",
        title: "MTE 307 Course Material 1",
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    pastQuestions: [
      {
        id: "pq-5",
        title: "MTE 307 Past Question 2023",
        year: 2023,
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    tutors: [],
  },
  {
    id: "course-5",
    code: "MTE 309",
    title: "Control Systems",
    units: 3,
    level: 300,
    semester: 2,
    description:
      "Control Systems is the study of systems and their behavior under different control strategies. This course covers the analysis and design of control systems for engineering applications.",
    materials: [
      {
        id: "material-6",
        title: "MTE 309 Course Material 1",
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    pastQuestions: [
      {
        id: "pq-6",
        title: "MTE 309 Past Question 2023",
        year: 2023,
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    tutors: [],
  },
  {
    id: "course-6",
    code: "MTE 310",
    title: "Manufacturing Processes",
    units: 2,
    level: 300,
    semester: 2,
    description:
      "Manufacturing Processes is the study of methods used to convert raw materials into finished products. This course covers various manufacturing processes, their principles, and applications.",
    materials: [
      {
        id: "material-7",
        title: "MTE 310 Course Material 1",
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    pastQuestions: [
      {
        id: "pq-7",
        title: "MTE 310 Past Question 2023",
        year: 2023,
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    tutors: [],
  },
  {
    id: "course-7",
    code: "MTE 201",
    title: "Engineering Mathematics",
    units: 3,
    level: 200,
    semester: 1,
    description:
      "Engineering Mathematics covers mathematical concepts and techniques essential for engineering analysis and problem-solving.",
    materials: [
      {
        id: "material-8",
        title: "MTE 201 Course Material 1",
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    pastQuestions: [
      {
        id: "pq-8",
        title: "MTE 201 Past Question 2023",
        year: 2023,
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    tutors: [],
  },
  {
    id: "course-8",
    code: "MTE 401",
    title: "Advanced Engineering Design",
    units: 4,
    level: 400,
    semester: 1,
    description:
      "Advanced Engineering Design focuses on complex design principles and methodologies for engineering systems.",
    materials: [
      {
        id: "material-9",
        title: "MTE 401 Course Material 1",
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    pastQuestions: [
      {
        id: "pq-9",
        title: "MTE 401 Past Question 2023",
        year: 2023,
        fileUrl: "#",
        fileType: "pdf",
      },
    ],
    tutors: [],
  },
];

export const bookmarks: Bookmark[] = [
  {
    id: "bookmark-1",
    title: "Course Material 3 - MTE 399",
    icon: Compass,
    url: "#",
  },
  {
    id: "bookmark-2",
    title: "Course Material 1 - MTE 301",
    icon: Briefcase,
    url: "#",
  },
  {
    id: "bookmark-3",
    title: "Past Question 2023 - MTE 301",
    icon: Compass,
    url: "#",
  },
];

export const mainNavItems = [
  {
    id: "nav-1",
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "nav-2",
    title: "Courses",
    icon: GraduationCap,
    path: "/dashboard/courses",
  },
  {
    id: "nav-3",
    title: "AI Assistant",
    icon: MessageSquare,
    path: "/dashboard/ai-assistant",
  },
];
