import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [faculty, setFaculty] = useState(
    JSON.parse(localStorage.getItem('faculty')) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  const login = (facultyData, tokenData) => {
    setFaculty(facultyData);
    setToken(tokenData);
    localStorage.setItem('faculty', JSON.stringify(facultyData));
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setFaculty(null);
    setToken(null);
    localStorage.removeItem('faculty');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ faculty, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);