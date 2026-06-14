export const validators = {
  required: (value) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "This field is required";
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email";
    return null;
  },

  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(value)) return "Password must contain a lowercase letter";
    if (!/\d/.test(value)) return "Password must contain a number";
    return null;
  },

  confirmPassword: (value, compareValue) => {
    if (!value) return "Please confirm your password";
    if (value !== compareValue) return "Passwords do not match";
    return null;
  },

  minLength: (min) => (value) => {
    if (!value || value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Cannot exceed ${max} characters`;
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    if (!phoneRegex.test(value)) return "Please enter a valid phone number";
    return null;
  },
};

export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = formData[field];

    for (const rule of fieldRules) {
      const error = rule(value, formData);
      if (error) {
        errors[field] = error;
        isValid = false;
        break;
      }
    }
  });

  return { errors, isValid };
};