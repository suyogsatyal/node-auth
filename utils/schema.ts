// utils/schema.ts
import * as yup from 'yup';
import { LoginFormData, SignupFormData } from './interface';

export const loginSchema = yup.object<LoginFormData>({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const signupSchema = yup.object<SignupFormData>({
  username: yup.string().min(4, 'Username must be at least 4 characters').required('Username is required'),
  password: yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match'),
});
