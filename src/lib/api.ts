const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage for authenticated requests
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new ApiError(response.status, errorData.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error occurred');
  }
}

// Filings API
export const filingsApi = {
  getAll: (params?: { status?: string; type?: string; priority?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return apiRequest<{
      success: boolean;
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/filings?${searchParams}`);
  },

  getById: (id: string) => 
    apiRequest<{ success: boolean; data: any }>(`/filings/${id}`),

  create: (filing: any) =>
    apiRequest<{ success: boolean; data: any; message: string }>('/filings', {
      method: 'POST',
      body: JSON.stringify(filing),
    }),

  update: (id: string, filing: any) =>
    apiRequest<{ success: boolean; data: any; message: string }>(`/filings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(filing),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean; message: string }>(`/filings/${id}`, {
      method: 'DELETE',
    }),

  getOverview: () =>
    apiRequest<{
      success: boolean;
      data: {
        statusCounts: Array<{ _id: string; count: number }>;
        typeCounts: Array<{ _id: string; count: number }>;
        upcomingDeadlines: any[];
      };
    }>('/filings/status/overview'),
};

// Audit Logs API
export const auditLogsApi = {
  getAll: (params?: { user?: string; action?: string; status?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return apiRequest<{
      success: boolean;
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/audit-logs?${searchParams}`);
  },

  getStats: () =>
    apiRequest<{
      success: boolean;
      data: {
        totalActions: number;
        successRate: Array<{ _id: string; count: number }>;
        actionCounts: Array<{ _id: string; count: number }>;
        recentActivity: Array<{ _id: string; count: number }>;
      };
    }>('/audit-logs/stats'),
};

// Notifications API
export const notificationsApi = {
  getAll: (params?: { read?: boolean; type?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return apiRequest<{
      success: boolean;
      data: any[];
      unreadCount: number;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/notifications?${searchParams}`);
  },

  markAsRead: (id: string) =>
    apiRequest<{ success: boolean; data: any; message: string }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  markAllAsRead: () =>
    apiRequest<{ success: boolean; message: string }>('/notifications/mark-all-read', {
      method: 'PATCH',
    }),

  create: (notification: any) =>
    apiRequest<{ success: boolean; data: any; message: string }>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    }),
};

// Compliance API
export const complianceApi = {
  getMetrics: (months?: number) => {
    const searchParams = new URLSearchParams();
    if (months) {
      searchParams.append('months', months.toString());
    }
    return apiRequest<{
      success: boolean;
      data: Array<{
        month: string;
        year: number;
        score: number;
        totalFilings: number;
        onTimeFilings: number;
        lateFilings: number;
        pendingFilings: number;
      }>;
    }>(`/compliance/metrics?${searchParams}`);
  },

  getHealthMatrix: () =>
    apiRequest<{
      success: boolean;
      data: Array<{
        id: string;
        title: string;
        subtitle: string;
        status: 'compliant' | 'due-soon' | 'overdue';
      }>;
    }>('/compliance/health-matrix'),

  getDashboard: () =>
    apiRequest<{
      success: boolean;
      data: {
        nextDeadline: any;
        complianceScore: number;
        workflowCounts: Array<{ _id: string; count: number }>;
      };
    }>('/compliance/dashboard'),
};

// Health check
export const healthApi = {
  check: () =>
    apiRequest<{
      success: boolean;
      message: string;
      timestamp: string;
      environment: string;
    }>('/health'),
};

// Authentication API
export const authApi = {
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company?: string;
    gstin?: string;
  }) =>
    apiRequest<{
      success: boolean;
      message: string;
      data: {
        userId: string;
        email: string;
        requiresVerification: boolean;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    apiRequest<{
      success: boolean;
      message: string;
      data?: {
        token: string;
        user: any;
      };
      requiresVerification?: boolean;
      email?: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  verifyEmail: (data: { email: string; otp: string }) =>
    apiRequest<{
      success: boolean;
      message: string;
      data: {
        token: string;
        user: any;
      };
    }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resendOTP: (email: string) =>
    apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email: string) =>
    apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (data: { token: string; password: string }) =>
    apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: (token: string) =>
    apiRequest<{
      success: boolean;
      data: any;
    }>('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updateProfile: (token: string, profileData: any) =>
    apiRequest<{
      success: boolean;
      message: string;
      data: any;
    }>('/auth/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }),

  changePassword: (token: string, data: { currentPassword: string; newPassword: string }) =>
    apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/change-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  logout: (token: string) =>
    apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};