export interface LoginFormData {
    username: string;
    password: string;
}

export interface SignupFormData {
    username: string;
    password: string;
    confirmPassword: string;
}

export interface AuthContextType {
    currentUser: UsersTable | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<UsersTable | null>>;
}

export interface User {
    username: string;
};

export interface UsersTable {
    username: string;
    passwordHash: string;
    adminAccess: number;
    contributorAccess: number;
    viewerAccess: number;
    about: string | null;
}

export interface DashboardDataFormat {
    userID: number;
    username: string;
    adminAccess: number;
    contributorAccess: number;
    viewerAccess: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    status: number;
    message?: string;
    data?: T;
}
