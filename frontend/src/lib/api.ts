import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('wasl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('wasl_token');
      Cookies.remove('wasl_user');
      if (typeof window !== 'undefined') {
        window.location.href = '/en/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

export const usersApi = {
  getUser: (id: number) => api.get(`/users/${id}`),
  updateUser: (id: number, data: FormData) =>
    api.put(`/users/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadAvatar: (id: number, data: FormData) =>
    api.post(`/users/${id}/avatar`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const freelancersApi = {
  getProfile: (id: number) => api.get(`/freelancers/${id}`),
  updateProfile: (id: number, data: object) => api.put(`/freelancers/${id}`, data),
  getMyApplications: () => api.get('/freelancers/me/applications'),
  getFeatured: () => api.get('/freelancers/featured'),
};

export const clientsApi = {
  getProfile: (id: number) => api.get(`/clients/${id}`),
  updateProfile: (id: number, data: object) => api.put(`/clients/${id}`, data),
};

export const jobsApi = {
  getJobs: (params?: object) => api.get('/jobs', { params }),
  getJob: (id: number) => api.get(`/jobs/${id}`),
  createJob: (data: object) => api.post('/jobs', data),
  updateJob: (id: number, data: object) => api.put(`/jobs/${id}`, data),
  deleteJob: (id: number) => api.delete(`/jobs/${id}`),
  applyToJob: (id: number, data: object) => api.post(`/jobs/${id}/apply`, data),
  getApplicants: (id: number) => api.get(`/jobs/${id}/applicants`),
};

export const applicationsApi = {
  updateStatus: (id: number, status: string) =>
    api.put(`/applications/${id}/status`, { status }),
};

export const categoriesApi = {
  getCategories: () => api.get('/categories'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  getJobs: () => api.get('/admin/jobs'),
  deleteJob: (id: number) => api.delete(`/admin/jobs/${id}`),
};

export default api;
