import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth.middleware";

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const { user } = authResult;

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        switch (type) {
            case "overview":
                return await getOverviewAnalytics();
            case "course-usage":
                return await getCourseUsageAnalytics();
            case "content-distribution":
                return await getContentDistributionAnalytics();
            case "level-distribution":
                return await getLevelDistributionAnalytics();
            case "recent-activity":
                return await getRecentActivityAnalytics();
            case "semester-breakdown":
                return await getSemesterBreakdownAnalytics();
            default:
                return NextResponse.json(
                    { error: "Invalid analytics type" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Analytics API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

async function getOverviewAnalytics() {
    const [totalCourses, totalMaterials, totalPastQuestions, totalTutors] =
        await Promise.all([
            prisma.course.count(),
            prisma.material.count(),
            prisma.pastQuestion.count(),
            prisma.tutor.count(),
        ]);

    const totalContent = totalMaterials + totalPastQuestions;
    const averageMaterialsPerCourse =
        totalCourses > 0 ? (totalMaterials / totalCourses).toFixed(1) : "0";
    const averagePastQuestionsPerCourse =
        totalCourses > 0 ? (totalPastQuestions / totalCourses).toFixed(1) : "0";

    return NextResponse.json({
        totalCourses,
        totalMaterials,
        totalPastQuestions,
        totalTutors,
        totalContent,
        averageMaterialsPerCourse,
        averagePastQuestionsPerCourse,
    });
}

async function getCourseUsageAnalytics() {
    const courses = await prisma.course.findMany({
        include: {
            _count: {
                select: {
                    materials: true,
                    pastQuestions: true,
                },
            },
        },
    });

    const courseUsageData = courses
        .map((course) => ({
            course: course.code,
            courseTitle: course.title,
            materials: course._count.materials,
            pastQuestions: course._count.pastQuestions,
            totalContent: course._count.materials + course._count.pastQuestions,
            level: course.level,
            semester: course.semester,
        }))
        .sort((a, b) => b.totalContent - a.totalContent);

    return NextResponse.json(courseUsageData);
}

async function getContentDistributionAnalytics() {
    const [materialsCount, pastQuestionsCount] = await Promise.all([
        prisma.material.count(),
        prisma.pastQuestion.count(),
    ]);

    const contentDistribution = [
        {
            name: "Course Materials",
            value: materialsCount,
            color: "bg-blue-500",
        },
        {
            name: "Past Questions",
            value: pastQuestionsCount,
            color: "bg-green-500",
        },
    ];

    return NextResponse.json(contentDistribution);
}

async function getLevelDistributionAnalytics() {
    const courses = await prisma.course.findMany({
        select: { level: true },
    });

    const levelCount = courses.reduce((acc, course) => {
        acc[course.level] = (acc[course.level] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const totalCourses = courses.length;

    const levelDistribution = Object.entries(levelCount)
        .map(([level, count]) => ({
            level: parseInt(level),
            count,
            percentage:
                totalCourses > 0 ? Math.round((count / totalCourses) * 100) : 0,
        }))
        .sort((a, b) => a.level - b.level);

    return NextResponse.json(levelDistribution);
}

async function getRecentActivityAnalytics() {
    const [recentMaterials, recentPastQuestions] = await Promise.all([
        prisma.material.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                course: {
                    select: { code: true, title: true },
                },
            },
        }),
        prisma.pastQuestion.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                course: {
                    select: { code: true, title: true },
                },
            },
        }),
    ]);

    return NextResponse.json({
        recentMaterials,
        recentPastQuestions,
    });
}

async function getSemesterBreakdownAnalytics() {
    const courses = await prisma.course.findMany({
        select: {
            level: true,
            semester: true,
            _count: {
                select: {
                    materials: true,
                    pastQuestions: true,
                },
            },
        },
    });

    const semesterBreakdown = courses.reduce((acc, course) => {
        const key = `Level ${course.level} - Semester ${course.semester}`;
        if (!acc[key]) {
            acc[key] = {
                level: course.level,
                semester: course.semester,
                courses: 0,
                materials: 0,
                pastQuestions: 0,
                totalContent: 0,
            };
        }

        acc[key].courses += 1;
        acc[key].materials += course._count.materials;
        acc[key].pastQuestions += course._count.pastQuestions;
        acc[key].totalContent +=
            course._count.materials + course._count.pastQuestions;

        return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(Object.values(semesterBreakdown));
}
