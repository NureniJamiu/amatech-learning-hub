import { useState, useCallback } from 'react';

/**
 * Centralized validation utilities for consistent form validation across the app
 */

export type ValidationRule = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any, allData?: any) => boolean | string;
};

export type ValidationSchema = Record<string, ValidationRule>;

export type ValidationErrors = Record<string, string | undefined>;

/**
 * Validates a single field against its rules
 */
export function validateField(value: any, rules: ValidationRule, allData?: any): string | null {
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return 'This field is required';
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && !value.trim())) {
    return null;
  }

  // Min length validation
  if (rules.min && typeof value === 'string' && value.length < rules.min) {
    return `Must be at least ${rules.min} characters`;
  }

  // Max length validation
  if (rules.max && typeof value === 'string' && value.length > rules.max) {
    return `Must be no more than ${rules.max} characters`;
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rules.custom) {
    const result = rules.custom(value, allData);
    if (typeof result === 'string') {
      return result;
    }
    if (result === false) {
      return 'Invalid value';
    }
  }

  return null;
}

/**
 * Validates an entire object against a schema
 */
export function validateSchema(data: Record<string, any>, schema: ValidationSchema): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules, data);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

/**
 * Common validation schemas
 */
export const validationSchemas = {
  login: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      min: 6,
    },
  } as ValidationSchema,

  signup: {
    firstname: {
      required: true,
      min: 2,
      max: 50,
    },
    lastname: {
      max: 50,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      min: 6,
      max: 100,
    },
    passwordConfirmation: {
      required: true,
      custom: (value: any, data: any) => {
        if (data && value !== data.password) {
          return 'Passwords do not match';
        }
        return true;
      },
    },
    matricNumber: {
      required: true,
      pattern: /^[A-Z0-9\/]+$/i,
    },
    level: {
      required: true,
      custom: (value: any) => [100, 200, 300, 400, 500].includes(Number(value)),
    },
    department: {
      required: true,
      min: 2,
    },
    faculty: {
      required: true,
      min: 2,
    },
  } as ValidationSchema,

  course: {
    code: {
      required: true,
      min: 3,
      max: 10,
      pattern: /^[A-Z]{2,4}\s?\d{3}$/i,
    },
    title: {
      required: true,
      min: 3,
      max: 200,
    },
    units: {
      required: true,
      custom: (value: any) => {
        const num = Number(value);
        return num >= 1 && num <= 6;
      },
    },
    level: {
      required: true,
      custom: (value: any) => [100, 200, 300, 400, 500].includes(Number(value)),
    },
    semester: {
      required: true,
      custom: (value: any) => [1, 2].includes(Number(value)),
    },
    description: {
      max: 1000,
    },
  } as ValidationSchema,

  material: {
    title: {
      required: true,
      min: 3,
      max: 200,
    },
    courseId: {
      required: true,
    },
    file: {
      required: true,
    },
  } as ValidationSchema,

  tutor: {
    name: {
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  } as ValidationSchema,
};

/**
 * Hook for managing form validation state
 */
export function useFormValidation<T extends Record<string, any>>(
  schema: ValidationSchema,
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateAll = useCallback(() => {
    const newErrors = validateSchema(data, schema);
    setErrors(newErrors);
    return Object.keys(newErrors).filter(key => newErrors[key]).length === 0;
  }, [data, schema]);

  const validateSingleField = useCallback((field: string) => {
    if (schema[field]) {
      const error = validateField(data[field], schema[field], data);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  }, [data, schema]);

  const updateField = useCallback((field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const markTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    validateAll,
    validateField: validateSingleField,
    updateField,
    markTouched,
    reset,
    isValid: Object.keys(errors).filter(key => errors[key]).length === 0,
  };
}
