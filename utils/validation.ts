export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
  }

  return errors;
};

export const validateSignupForm = (name: string, email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!name) {
    errors.name = 'Name is required';
  } else if (!validateName(name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
  }

  return errors;
}; 