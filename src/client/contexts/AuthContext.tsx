import {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {api} from "@/api";
import {UserBase} from "../../shared/interfaces";

interface AuthContextType {
    user: UserBase | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<UserBase | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async (token: string) => {
        try {
            const result = await api.getUser(token);
            if (!result.error && result.data) {
                setUser(result.data);
            } else {
                setUser(null);
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
            localStorage.removeItem('authToken');
        }
    };

    const login = async (token: string) => {
        localStorage.setItem('authToken', token);
        await fetchUser(token);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const refreshUser = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            await fetchUser(token);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                await fetchUser(token);
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
