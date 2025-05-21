import axios from "@/lib/axios"

export const getAllCourses = async () => {
  const res = await axios.get("/courses")
  return res.data
}

export const createNewCourse = async (data: {
    code: string
    title: string
    level: number
    semester: number
    tutors: { id: string }[]
    units?: number
    description?: string
}) => {
    // const res = await axios.post("/courses", data)
    // return res.data
    console.log("createNewCourse", data)
}
