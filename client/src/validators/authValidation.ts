import type { ValidationErrors, FormData } from '../types/index';

export const validateForm = (data: FormData, isSignup: boolean = false): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Name validation (only for signup)
  if (isSignup) {
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Full name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters long';
    } else if (data.name.trim().length > 50) {
      errors.name = 'Full name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(data.name.trim())) {
      errors.name = 'Full name can only contain letters and spaces';
    }
  }

  // Email validation
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  } else if (!/(?=.*[a-zA-Z])/.test(data.password)) {
    errors.password = 'Password must contain at least 1 letter';
  } else if (!/(?=.*[0-9])/.test(data.password)) {
    errors.password = 'Password must contain at least 1 number';
  } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(data.password)) {
    errors.password = 'Password must contain at least 1 special character';
  }

  // Confirm password validation (only for signup)
  if (isSignup) {
    if (!data.confirmPassword || data.confirmPassword.trim() === '') {
      errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const validateLoginForm = (data: { email: string; password: string }): ValidationErrors => {
  return validateForm(data, false);
};

export const validateRegisterForm = (data: { name: string; email: string; password: string; confirmPassword: string }): ValidationErrors => {
  return validateForm(data, true);
};
