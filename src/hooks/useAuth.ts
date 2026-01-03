import { useState, useEffect } from 'react';
import { authManager, AuthState } from '@/lib/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: authManager.login.bind(authManager),
    register: authManager.register.bind(authManager),
    verifyEmail: authManager.verifyEmail.bind(authManager),
    resendOTP: authManager.resendOTP.bind(authManager),
    forgotPassword: authManager.forgotPassword.bind(authManager),
    resetPassword: authManager.resetPassword.bind(authManager),
    updateProfile: authManager.updateProfile.bind(authManager),
    changePassword: authManager.changePassword.bind(authManager),
    logout: authManager.logout.bind(authManager),
  };
};