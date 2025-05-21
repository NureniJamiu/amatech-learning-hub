// This file contains logic that is to be changed in the future
import axios from "@/lib/axios"

export const getUserProfile = async () => {
  const res = await axios.get("/user/profile")
  return res.data
}

export const updateUserProfile = async (data: { name: string }) => {
  const res = await axios.put("/user/profile", data)
  return res.data
}
