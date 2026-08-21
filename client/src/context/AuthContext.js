import { createContext, useCallback, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .getSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const refreshUser = useCallback(async () => {
    const nextUser = await authApi.getSession();
    setUser(nextUser);
    return nextUser;
  }, []);

  const login = useCallback(async (credentials) => {
    const nextUser = await authApi.login(credentials);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signup = useCallback(async (credentials) => {
    const nextUser = await authApi.signup(credentials);
    setUser(nextUser);
    return nextUser;
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const nextUser = await authApi.loginWithGoogle(credential);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const verifyEmail = useCallback(async (token) => {
    const nextUser = await authApi.verifyEmail(token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const resendVerification = useCallback(() => authApi.resendVerification(), []);

  const resetPassword = useCallback(async (payload) => {
    const nextUser = await authApi.resetPassword(payload);
    setUser(nextUser);
    return nextUser;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const nextUser = await authApi.updateProfile(payload);
    setUser(nextUser);
    return nextUser;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        login,
        signup,
        loginWithGoogle,
        logout,
        verifyEmail,
        resendVerification,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
