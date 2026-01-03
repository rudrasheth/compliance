import { authApi } from './api';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  gstin?: string;
  role: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthManager {
  private static instance: AuthManager;
  private listeners: Array<(state: AuthState) => void> = [];
  private state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  };

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await authApi.getProfile(token);
        if (response.success) {
          this.setState({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        this.clearAuth();
      }
    }
    
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthState {
    return this.state;
  }

  async login(email: string, password: string) {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem('auth_token', token);
        
        this.setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return { success: true, user };
      } else if (response.requiresVerification) {
        return { 
          success: false, 
          requiresVerification: true, 
          email: response.email,
          message: response.message 
        };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company?: string;
    gstin?: string;
  }) {
    try {
      const response = await authApi.register(userData);
      return {
        success: response.success,
        message: response.message,
        requiresVerification: response.data?.requiresVerification,
        email: response.data?.email
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  async verifyEmail(email: string, otp: string) {
    try {
      const response = await authApi.verifyEmail({ email, otp });
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('auth_token', token);
        
        this.setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return { success: true, user };
      }
      
      return { success: false, message: response.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Email verification failed'
      };
    }
  }

  async resendOTP(email: string) {
    try {
      const response = await authApi.resendOTP(email);
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to resend OTP'
      };
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await authApi.forgotPassword(email);
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send reset email'
      };
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const response = await authApi.resetPassword({ token, password });
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Password reset failed'
      };
    }
  }

  async updateProfile(profileData: any) {
    if (!this.state.token) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const response = await authApi.updateProfile(this.state.token, profileData);
      
      if (response.success) {
        this.setState({
          user: response.data
        });
      }
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Profile update failed'
      };
    }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    if (!this.state.token) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const response = await authApi.changePassword(this.state.token, {
        currentPassword,
        newPassword
      });
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Password change failed'
      };
    }
  }

  async logout() {
    if (this.state.token) {
      try {
        await authApi.logout(this.state.token);
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    
    this.clearAuth();
  }

  private clearAuth() {
    localStorage.removeItem('auth_token');
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  getToken(): string | null {
    return this.state.token;
  }

  getUser(): User | null {
    return this.state.user;
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }
}

export const authManager = AuthManager.getInstance();