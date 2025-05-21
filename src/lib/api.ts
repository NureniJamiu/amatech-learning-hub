import axios from "@/lib/axios"

export async function get<T>(url: string, params?: any): Promise<T> {
  const response = await axios.get<T>(url, { params })
  return response.data
}

export async function post<T>(url: string, data?: any): Promise<T> {
  const response = await axios.post<T>(url, data)
  return response.data
}

export async function put<T>(url: string, data?: any): Promise<T> {
  const response = await axios.put<T>(url, data)
  return response.data
}

export async function del<T>(url: string): Promise<T> {
  const response = await axios.delete<T>(url)
  return response.data
}
