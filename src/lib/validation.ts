// contact form rules. the browser script and the tests both use these.

export type ContactField = 'name' | 'email' | 'subject' | 'message';

export type ContactValues = Record<ContactField, string>;

export const contactFields: ContactField[] = ['name', 'email', 'subject', 'message'];

export const fieldLimits: Record<ContactField, number> = {
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
};

// a practical email check: something@something.something with no spaces
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return emailPattern.test(value.trim());
}

/** returns an error message, or an empty string when the value is fine */
export function validateField(field: ContactField, rawValue: string): string {
  const value = rawValue.trim();

  if (value === '') {
    return `Please fill in your ${field}.`;
  }

  if (value.length > fieldLimits[field]) {
    return `Please keep your ${field} under ${fieldLimits[field]} characters.`;
  }

  if (field === 'email' && !isValidEmail(value)) {
    return 'Please enter a valid email address, like name@example.com.';
  }

  if (field === 'message' && value.length < 10) {
    return 'Please write a little more, at least 10 characters.';
  }

  return '';
}

export function validateContact(values: ContactValues): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  for (const field of contactFields) {
    const message = validateField(field, values[field]);
    if (message) {
      errors[field] = message;
    }
  }
  return errors;
}

/** netlify forms expects the fields url encoded */
export function encodeForm(data: Record<string, string>): string {
  return new URLSearchParams(data).toString();
}
