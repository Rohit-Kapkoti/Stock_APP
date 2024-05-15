import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = (token: string) => {
        sessionStorage.setItem('access_token', token);
        setIsAuthenticated(true);

        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);
        sessionStorage.setItem('token_expiration', expirationTime.getTime().toString());
    };

    const logout = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('token_expiration');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const tokenExpiration = sessionStorage.getItem('token_expiration');
        if (tokenExpiration) {
            const expirationTime = parseInt(tokenExpiration);
            if (new Date().getTime() > expirationTime) {
                logout();
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
