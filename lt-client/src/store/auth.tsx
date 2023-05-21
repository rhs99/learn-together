import React, { useState } from 'react';

type StoredValue = {
  token: string;
  userName: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string, userName: string) => void;
  logout: () => void;
  getStoredValue: () => StoredValue;
};

interface Props {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => undefined,
  logout: () => undefined,
  getStoredValue: () => {
    return {
      token: '',
      userName: '',
    };
  },
});

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null || false);

  const login = (token: string, userName: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
  };

  const getStoredValue = () => {
    return {
      token: localStorage.getItem('token') || '',
      userName: localStorage.getItem('userName') || '',
    };
  };

  const contextValue: AuthContextType = {
    isLoggedIn,
    login,
    logout,
    getStoredValue,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
