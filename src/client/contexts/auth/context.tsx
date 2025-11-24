import {createContext} from "react";
import {UserBase} from "../../../shared/interfaces";

interface AuthContextType {
    user: UserBase | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
