import { createContext, useContext, useState } from "react";
import jwtDecode from "jwt-decode";

const AuthContext  = createContext(null);

export const AuthProvider = ({ children }) => {
    const login = (user) => {
        localStorage.setItem('user', jwtDecode(user).username) 
    };
    const logout = () => {
        localStorage.removeItem('user')
        window.location.href = "/"
    };
    return (
        <AuthContext.Provider value={{ login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}