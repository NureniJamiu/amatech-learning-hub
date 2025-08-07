"use client";

import { useAppContext } from "@/context/app-context";
import { useCourses } from "@/hooks/use-courses";

export function CourseFilterTest() {
    const { filterLevel, setFilterLevel, filterSemester, setFilterSemester, filteredCourses } = useAppContext();
    const { data: coursesResponse } = useCourses({ limit: 1000 });

    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-bold mb-4">Course Filter Debug</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Current Level: {filterLevel}</label>
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    >
                        <option value={100}>100 Level</option>
                        <option value={200}>200 Level</option>
                        <option value={300}>300 Level</option>
                        <option value={400}>400 Level</option>
                        <option value={500}>500 Level</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Current Semester: {filterSemester}</label>
                    <select
                        value={filterSemester}
                        onChange={(e) => setFilterSemester(Number(e.target.value) as 1 | 2)}
                        className="w-full p-2 border rounded"
                    >
                        <option value={1}>1st Semester</option>
                        <option value={2}>2nd Semester</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">All Courses ({coursesResponse?.courses?.length || 0})</h4>
                <div className="text-xs max-h-32 overflow-y-auto">
                    {coursesResponse?.courses?.map(course => (
                        <div key={course.id} className="mb-1">
                            {course.code} - Level {course.level}, Semester {course.semester}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-2">Filtered Courses ({filteredCourses.length})</h4>
                <div className="text-xs max-h-32 overflow-y-auto">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="mb-1 bg-green-100 p-1 rounded">
                            {course.code} - Level {course.level}, Semester {course.semester}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
