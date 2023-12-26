import { createContext, useState } from "react"
import { UsersTable } from "../../../utils/interface"

interface AuthContextType {
    currentUser: any | null;
    setCurrentUser: any;
}


export const AuthContext = createContext({} as AuthContextType);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UsersTable | null>(null);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>

    )
}

export default {AuthContext, AuthProvider};
