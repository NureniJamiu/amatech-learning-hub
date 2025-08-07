import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.aiAssistantChat.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.timetableEntry.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.pastQuestion.deleteMany();
  await prisma.material.deleteMany();
  await prisma.courseToTutor.deleteMany();
  await prisma.tutor.deleteMany();
  await prisma.course.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemSettings.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create system settings
  await prisma.systemSettings.create({
    data: {
      id: 'system-1',
      siteName: 'Amatech Lasu - Student Learning Hub',
      siteDescription: 'Access course materials and resources',
      maintenanceMode: false,
      allowRegistration: true,
      defaultTheme: 'light',
    },
  });

  // Create test users
  const adminPassword = await hashPassword('admin123');
  const studentPassword = await hashPassword('student123');

  const adminUser = await prisma.user.create({
    data: {
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin@amatech.edu.ng',
      password: adminPassword,
      matricNumber: 'ADMIN001',
      level: 300,
      currentSemester: 1,
      department: 'Management Technology',
      faculty: 'Management Sciences',
      isAdmin: true,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      firstname: 'Student',
      lastname: 'User',
      email: 'student@amatech.edu.ng',
      password: studentPassword,
      matricNumber: '220822017',
      level: 300,
      currentSemester: 1,
      department: 'Management Technology',
      faculty: 'Management Sciences',
      isAdmin: false,
    },
  });

  const level200Student = await prisma.user.create({
    data: {
      firstname: 'Level 200',
      lastname: 'Student',
      email: 'level200@amatech.edu.ng',
      password: studentPassword,
      matricNumber: '220822018',
      level: 200,
      currentSemester: 1,
      department: 'Management Technology',
      faculty: 'Management Sciences',
      isAdmin: false,
    },
  });

  const level400Student = await prisma.user.create({
    data: {
      firstname: 'Level 400',
      lastname: 'Student',
      email: 'level400@amatech.edu.ng',
      password: studentPassword,
      matricNumber: '220822019',
      level: 400,
      currentSemester: 1,
      department: 'Management Technology',
      faculty: 'Management Sciences',
      isAdmin: false,
    },
  });

  console.log('👥 Created test users');

  // Create tutors
  const tutor1 = await prisma.tutor.create({
    data: {
      name: 'Dr. Adebayo Johnson',
      email: 'adebayo@university.edu',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  });

  const tutor2 = await prisma.tutor.create({
    data: {
      name: 'Prof. Sarah Williams',
      email: 'sarah@university.edu',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  });

  console.log('👨‍🏫 Created tutors');

  // Create courses for different levels
  const courses = [
    // Level 200 courses
    {
      code: 'MTE 201',
      title: 'Engineering Mathematics',
      units: 3,
      level: 200,
      semester: 1,
      description: 'Engineering Mathematics covers mathematical concepts and techniques essential for engineering analysis and problem-solving.',
    },
    {
      code: 'MTE 203',
      title: 'Engineering Physics',
      units: 2,
      level: 200,
      semester: 1,
      description: 'Fundamental principles of physics applied to engineering systems.',
    },
    {
      code: 'MTE 205',
      title: 'Engineering Drawing',
      units: 2,
      level: 200,
      semester: 2,
      description: 'Technical drawing and CAD principles for engineering design.',
    },

    // Level 300 courses
    {
      code: 'MTE 301',
      title: 'Engineering Economics',
      units: 3,
      level: 300,
      semester: 1,
      description: 'Engineering Economics is a course that focuses on the application of economic principles to engineering projects and decision-making.',
    },
    {
      code: 'MTE 303',
      title: 'Thermodynamics',
      units: 2,
      level: 300,
      semester: 1,
      description: 'Thermodynamics is the study of energy and its transformations. This course covers the fundamental principles of thermodynamics.',
    },
    {
      code: 'MTE 305',
      title: 'Fluid Mechanics',
      units: 3,
      level: 300,
      semester: 1,
      description: 'Fluid Mechanics is the study of fluids and the forces on them. This course covers fluid statics, fluid dynamics, and applications.',
    },
    {
      code: 'MTE 307',
      title: 'Materials Science',
      units: 2,
      level: 300,
      semester: 1,
      description: 'Materials Science is the study of the properties of materials and their applications in engineering.',
    },
    {
      code: 'MTE 309',
      title: 'Control Systems',
      units: 3,
      level: 300,
      semester: 2,
      description: 'Control Systems is the study of systems and their behavior under different control strategies.',
    },
    {
      code: 'MTE 310',
      title: 'Manufacturing Processes',
      units: 2,
      level: 300,
      semester: 2,
      description: 'Manufacturing Processes is the study of methods used to convert raw materials into finished products.',
    },

    // Level 400 courses
    {
      code: 'MTE 401',
      title: 'Advanced Engineering Design',
      units: 4,
      level: 400,
      semester: 1,
      description: 'Advanced Engineering Design focuses on complex design principles and methodologies for engineering systems.',
    },
    {
      code: 'MTE 403',
      title: 'Project Management',
      units: 3,
      level: 400,
      semester: 1,
      description: 'Principles and practices of project management in engineering contexts.',
    },
    {
      code: 'MTE 405',
      title: 'Quality Control',
      units: 2,
      level: 400,
      semester: 2,
      description: 'Quality control and assurance methods in manufacturing and engineering.',
    },
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    const course = await prisma.course.create({
      data: courseData,
    });
    createdCourses.push(course);
  }

  console.log('📚 Created courses');

  // Assign tutors to some courses
  await prisma.courseToTutor.createMany({
    data: [
      { courseId: createdCourses[3].id, tutorId: tutor1.id }, // MTE 301
      { courseId: createdCourses[4].id, tutorId: tutor1.id }, // MTE 303
      { courseId: createdCourses[5].id, tutorId: tutor2.id }, // MTE 305
      { courseId: createdCourses[9].id, tutorId: tutor2.id }, // MTE 401
    ],
  });

  // Create materials for courses
  const materials = [
    { courseId: createdCourses[3].id, title: 'MTE 301 Course Material 1', fileUrl: 'https://example.com/material1.pdf' },
    { courseId: createdCourses[3].id, title: 'MTE 301 Course Material 2', fileUrl: 'https://example.com/material2.pdf' },
    { courseId: createdCourses[4].id, title: 'MTE 303 Course Material 1', fileUrl: 'https://example.com/material3.pdf' },
    { courseId: createdCourses[5].id, title: 'MTE 305 Course Material 1', fileUrl: 'https://example.com/material4.pdf' },
    { courseId: createdCourses[6].id, title: 'MTE 307 Course Material 1', fileUrl: 'https://example.com/material5.pdf' },
    { courseId: createdCourses[9].id, title: 'MTE 401 Course Material 1', fileUrl: 'https://example.com/material6.pdf' },
  ];

  for (const materialData of materials) {
    await prisma.material.create({
      data: {
        ...materialData,
        uploadedById: adminUser.id,
      },
    });
  }

  // Create past questions for courses
  const pastQuestions = [
    { courseId: createdCourses[3].id, title: 'MTE 301 Past Question 2023', year: 2023, fileUrl: 'https://example.com/pq1.pdf' },
    { courseId: createdCourses[3].id, title: 'MTE 301 Past Question 2022', year: 2022, fileUrl: 'https://example.com/pq2.pdf' },
    { courseId: createdCourses[4].id, title: 'MTE 303 Past Question 2023', year: 2023, fileUrl: 'https://example.com/pq3.pdf' },
    { courseId: createdCourses[5].id, title: 'MTE 305 Past Question 2023', year: 2023, fileUrl: 'https://example.com/pq4.pdf' },
    { courseId: createdCourses[6].id, title: 'MTE 307 Past Question 2023', year: 2023, fileUrl: 'https://example.com/pq5.pdf' },
    { courseId: createdCourses[9].id, title: 'MTE 401 Past Question 2023', year: 2023, fileUrl: 'https://example.com/pq6.pdf' },
  ];

  for (const pqData of pastQuestions) {
    await prisma.pastQuestion.create({
      data: {
        ...pqData,
        uploadedById: adminUser.id,
      },
    });
  }

  console.log('📄 Created materials and past questions');

  // Create bookmarks for the student user
  const bookmarks = [
    { title: 'Course Material 1 - MTE 301', url: '#', icon: 'Compass' },
    { title: 'Past Question 2023 - MTE 301', url: '#', icon: 'FileText' },
    { title: 'Course Material 1 - MTE 303', url: '#', icon: 'Book' },
  ];

  for (const bookmarkData of bookmarks) {
    await prisma.bookmark.create({
      data: {
        ...bookmarkData,
        userId: studentUser.id,
      },
    });
  }

  console.log('🔖 Created bookmarks');

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin@amatech.edu.ng / admin123');
  console.log('Student (Level 300): student@amatech.edu.ng / student123');
  console.log('Student (Level 200): level200@amatech.edu.ng / student123');
  console.log('Student (Level 400): level400@amatech.edu.ng / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
