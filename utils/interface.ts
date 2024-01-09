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

export interface UserDataFormat {
    user_id: number;
    username: string;
    admin_access: number;
    contributor_access: number;
    viewer_access: number;
}

export interface DashboardDataFormat {
    admins: UserDataFormat[];
    contributors: UserDataFormat[];
    viewers: UserDataFormat[];
}

export interface ApiResponse<T = any> {
    success: boolean;
    status: number;
    message?: string;
    data?: T;
}
