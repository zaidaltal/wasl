export type UserRole = 'freelancer' | 'client' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  country?: string;
  city?: string;
  created_at: string;
}

export interface FreelancerProfile {
  id: number;
  user_id: number;
  bio?: string;
  skills?: string[];
  portfolio_links?: string[];
  hourly_rate?: number;
  user?: User;
}

export interface ClientProfile {
  id: number;
  user_id: number;
  company_name?: string;
  company_description?: string;
  website?: string;
  user?: User;
}

export interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  icon?: string;
}

export type JobStatus = 'open' | 'closed';

export interface Job {
  id: number;
  client_id: number;
  category_id?: number;
  title: string;
  description: string;
  budget?: number;
  country?: string;
  status: JobStatus;
  created_at: string;
  category?: Category;
  client?: User & { client_profile?: ClientProfile };
  applications_count?: number;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: number;
  job_id: number;
  freelancer_id: number;
  cover_letter?: string;
  status: ApplicationStatus;
  applied_at: string;
  job?: Job;
  freelancer?: User & { freelancer_profile?: FreelancerProfile };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface JobFilters {
  search?: string;
  category_id?: number;
  country?: string;
  status?: JobStatus;
}

export interface AdminStats {
  total_users: number;
  total_freelancers: number;
  total_clients: number;
  total_jobs: number;
  total_applications: number;
  open_jobs: number;
}
