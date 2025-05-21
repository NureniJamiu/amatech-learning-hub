import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// ✅ Request Interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.info(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config)
    return config
  },
  (error: AxiosError) => {
    console.error("[REQUEST ERROR]", error)
    return Promise.reject(error)
  }
)

// ✅ Response Interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.info(`[RESPONSE] ${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        `[RESPONSE ERROR] ${error.response.status} ${error.response.config.url}`,
        error.response.data
      )
    } else if (error.request) {
      console.error("[NO RESPONSE]", error.message)
    } else {
      console.error("[AXIOS ERROR]", error.message)
    }
    return Promise.reject(error)
  }
)

export default instance
