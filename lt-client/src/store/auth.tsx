import React, { useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => void;
};

interface Props {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => undefined,
  logout: () => undefined,
  getToken: () => undefined,
});

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null || false);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const getToken = () => {
    return localStorage.getItem('token') || '';
  };

  const contextValue: AuthContextType = {
    isLoggedIn,
    login,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
