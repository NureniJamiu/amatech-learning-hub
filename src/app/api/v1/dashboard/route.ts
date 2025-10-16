import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { applyAPIRateLimit, withRateLimitHeaders } from '@/lib/rate-limit-helpers';

/**
 * GET /api/v1/dashboard
 * Get dashboard data with optimized parallel queries
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const { authenticateAndValidateUser } = await import('@/middleware/auth.middleware');
    const authResult = await authenticateAndValidateUser(req);
    
    if (!authResult || !authResult.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Apply rate limiting
    const rateLimitResponse = await applyAPIRateLimit(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { userId } = authResult;
    const isAdmin = authResult.user.isAdmin;

    // Use parallel queries to fetch all dashboard data efficiently
    const [
      userProfile,
      coursesCount,
      materialsCount,
      pastQuestionsCount,
      recentMaterials,
      recentPastQuestions,
      userTimetable,
      userBookmarks,
      recentChatSessions,
    ] = await Promise.all([
      // User profile
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          avatar: true,
          level: true,
          currentSemester: true,
          department: true,
          faculty: true,
          isAdmin: true,
        },
      }),
      // Courses count
      prisma.course.count(),
      // Materials count
      prisma.material.count(),
      // Past questions count
      prisma.pastQuestion.count(),
      // Recent materials (last 5)
      prisma.material.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          fileUrl: true,
          processingStatus: true,
          createdAt: true,
          course: {
            select: {
              code: true,
              title: true,
            },
          },
        },
      }),
      // Recent past questions (last 5)
      prisma.pastQuestion.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          year: true,
          fileUrl: true,
          createdAt: true,
          course: {
            select: {
              code: true,
              title: true,
            },
          },
        },
      }),
      // User's timetable for current semester
      prisma.timetableEntry.findMany({
        where: {
          userId,
          semester: isAdmin ? undefined : (await prisma.user.findUnique({
            where: { id: userId },
            select: { currentSemester: true },
          }))?.currentSemester || 1,
        },
        select: {
          id: true,
          day: true,
          time: true,
          location: true,
          course: {
            select: {
              code: true,
              title: true,
            },
          },
        },
        orderBy: [
          { day: 'asc' },
          { time: 'asc' },
        ],
      }),
      // User's bookmarks (last 5)
      prisma.bookmark.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          url: true,
          icon: true,
          createdAt: true,
        },
      }),
      // Recent chat sessions (last 3)
      prisma.chatSession.findMany({
        where: { userId },
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          course: {
            select: {
              code: true,
              title: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
      }),
    ]);

    // Admin-specific data
    let adminData = null;
    if (isAdmin) {
      const [usersCount, tutorsCount, processingQueueCount] = await Promise.all([
        prisma.user.count(),
        prisma.tutor.count(),
        prisma.processingQueue.count({
          where: {
            status: { in: ['pending', 'processing'] },
          },
        }),
      ]);

      adminData = {
        usersCount,
        tutorsCount,
        processingQueueCount,
      };
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user: userProfile,
        stats: {
          coursesCount,
          materialsCount,
          pastQuestionsCount,
        },
        recentMaterials,
        recentPastQuestions,
        timetable: userTimetable,
        bookmarks: userBookmarks,
        recentChatSessions,
        ...(adminData && { admin: adminData }),
      },
    });

    return withRateLimitHeaders(response, req);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
