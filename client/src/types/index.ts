// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Resume types
export interface Resume {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl?: string;
  extractedText: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

// Interview Template types
export interface InterviewTemplate {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: number;
  questionCount: number;
  tags: string[];
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interview types
export interface Interview {
  _id: string;
  templateId: string | InterviewTemplate;
  userId: string;
  resumeId?: string;
  jobDescription?: string;
  mode: "text" | "voice";
  questions: InterviewQuestion[];
  status: "pending" | "in_progress" | "completed";
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  _id: string;
  question: string;
  category: string;
  answer?: string;
  feedback?: string;
  score?: number;
}

// Interview Result types
export interface InterviewResult {
  _id: string;
  interviewId: string;
  userId: string;
  overallScore: number;
  categoryScores: CategoryScore[];
  feedback: string;
  recommendations: string[];
  completedAt: string;
}

export interface CategoryScore {
  category: string;
  score: number;
  feedback: string;
}

// User types
export interface User {
  _id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: string;
}

// Dashboard stats
export interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  recentResults: InterviewResult[];
}

// Template filters
export interface TemplateFilters {
  category?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}
