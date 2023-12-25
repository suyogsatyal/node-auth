// utils/interfaces.ts
export interface LoginFormData {
    username: string;
    password: string;
}

export interface SignupFormData {
    username: string;
    password: string;
    confirmPassword: string;
}

export interface UsersTable {
    userId: number | null;
    username: string;
    passwordHash: string;
    adminAccess: number;
    contributorAccess: number;
    viewerAccess: number;
    about: string | null;
}

export interface ApiResponse<T = any> {
    success: boolean;
    status: number;
    message?: string;
    data?: T;
  }
