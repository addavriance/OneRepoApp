import {ReactNode, useEffect, useState} from "react";
import {UserBase} from "../../../shared/interfaces.ts";
import {AuthContext} from "@/contexts/auth/context.tsx";
import {api} from "@/api";
import {useToast} from "@/hooks/use-toast.ts";

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<UserBase | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {toast} = useToast()

    const fetchUser = async (token: string) => {
        try {
            const result = await api.getUser(token);
            if (!result.error && result.data) {
                setUser(result.data);
            } else {
                setUser(null);
                localStorage.removeItem('authToken');
            }
        } catch (error: Error) {
            setTimeout(() => toast(
                {
                    variant: "destructive",
                    title: "Failed to fetch user:",
                    description: error.message.substring(0, 40)
                }
            ), 500);
            console.error("Failed to fetch user:", error);
            setUser(null);
            // localStorage.removeItem('authToken');
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
