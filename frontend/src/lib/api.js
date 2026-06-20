import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('admin_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
    }
    return Promise.reject(err)
  }
)

// Public
export const getAbout          = () => api.get('/api/about')
export const getServices       = () => api.get('/api/services')
export const getSkills         = () => api.get('/api/skills')
export const getCertifications = () => api.get('/api/certifications')
export const getProjects       = () => api.get('/api/projects')
export const sendMessage       = (data) => api.post('/api/contact', data)
export const getExperiences    = () => api.get('/api/experience')
export const getTestimonials   = () => api.get('/api/testimonials')
export const getArticles       = () => api.get('/api/articles')
export const getArticle        = (slug) => api.get(`/api/articles/${slug}`)
export const chat              = (data) => api.post('/api/chat', data, { timeout: 90000 })

// Auth
export const adminLogin = (creds) =>
  api.post('/api/auth/login', new URLSearchParams(creds), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
export const getMe = () => api.get('/api/auth/me')

// Admin — About
export const updateAbout = (data) => api.put('/api/about', data)

// Admin — Services
export const createService = (data) => api.post('/api/services', data)
export const updateService = (id, data) => api.put(`/api/services/${id}`, data)
export const deleteService = (id) => api.delete(`/api/services/${id}`)

// Admin — Skills
export const createSkill = (data) => api.post('/api/skills', data)
export const updateSkill = (id, data) => api.put(`/api/skills/${id}`, data)
export const deleteSkill = (id) => api.delete(`/api/skills/${id}`)

// Admin — Certifications
export const createCertification = (data) => api.post('/api/certifications', data)
export const updateCertification = (id, data) => api.put(`/api/certifications/${id}`, data)
export const deleteCertification = (id) => api.delete(`/api/certifications/${id}`)

// Admin — Projects
export const getProject    = (id) => api.get(`/api/projects/${id}`)
export const createProject = (data) => api.post('/api/projects', data)
export const updateProject = (id, data) => api.put(`/api/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/api/projects/${id}`)

// Admin — Experience
export const createExperience = (data) => api.post('/api/experience', data)
export const updateExperience = (id, data) => api.put(`/api/experience/${id}`, data)
export const deleteExperience = (id) => api.delete(`/api/experience/${id}`)

// Admin — Testimonials
export const getAllTestimonials = () => api.get('/api/testimonials/all')
export const createTestimonial = (data) => api.post('/api/testimonials', data)
export const updateTestimonial = (id, data) => api.put(`/api/testimonials/${id}`, data)
export const deleteTestimonial = (id) => api.delete(`/api/testimonials/${id}`)

// Admin — Articles
export const getAllArticles  = () => api.get('/api/articles/all')
export const createArticle  = (data) => api.post('/api/articles', data)
export const updateArticle  = (id, data) => api.put(`/api/articles/${id}`, data)
export const deleteArticle  = (id) => api.delete(`/api/articles/${id}`)

// Admin — Messages
export const getMessages    = () => api.get('/api/contact')
export const markRead       = (id) => api.put(`/api/contact/${id}/read`)
export const deleteMessage  = (id) => api.delete(`/api/contact/${id}`)

// Admin — Account
export const updateCredentials = (data) => api.put('/api/auth/credentials', data)

// Upload
export const uploadFile = (formData) =>
  api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export default api
