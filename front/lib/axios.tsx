// import axios from 'axios'


// const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1', withCredentials: true })


// let isRefreshing = false
// let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = []


// const processQueue = (error: unknown, token = null) => {
// failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)))
// failedQueue = []
// }


// api.interceptors.response.use(
// res => res,
// async err => {
// const originalRequest = err.config
// if (err.response?.status === 401 && !originalRequest._retry) {
// if (isRefreshing) {
// return new Promise((resolve, reject) => {
// failedQueue.push({ resolve, reject })
// }).then(token => {
// originalRequest.headers['Authorization'] = 'Bearer ' + token
// return api(originalRequest)
// })
// }


// originalRequest._retry = true
// isRefreshing = true
// try {
// const r = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/refresh-token', {}, { withCredentials: true })
// const newToken = r.data.data.accessToken
// processQueue(null, newToken)
// originalRequest.headers['Authorization'] = 'Bearer ' + newToken
// return api(originalRequest)
// } catch (e) {
// processQueue(e, null)
// return Promise.reject(e)
// } finally { isRefreshing = false }
// }
// return Promise.reject(err)
// }
// )


// export default api ;
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = []

const processQueue = (error: unknown, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config

    // ⛔️ skip refresh for login/register requests
    if (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/register')
    ) {
      return Promise.reject(err)
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const r = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/refresh-token',
          {},
          { withCredentials: true }
        )
        const newToken = r.data.data.accessToken
        processQueue(null, newToken)
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken
        return api(originalRequest)
      } catch (e) {
        processQueue(e, null)
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  }
)

export default api
