import { describe, expect, it } from 'vitest';
import { encodeForm, fieldLimits, isValidEmail, validateContact, validateField } from '@/lib/validation';

const good = {
  name: 'Aina',
  email: 'aina@example.com',
  subject: 'Internship',
  message: 'Hello, I would like to talk about an internship.',
};

describe('validateField', () => {
  it('asks for every empty field, including whitespace only', () => {
    expect(validateField('name', '')).toBe('Please fill in your name.');
    expect(validateField('subject', '   ')).toBe('Please fill in your subject.');
  });

  it('checks the email shape', () => {
    expect(validateField('email', 'aina@example')).toMatch(/valid email/);
    expect(validateField('email', 'aina example.com')).toMatch(/valid email/);
    expect(validateField('email', ' aina@example.com ')).toBe('');
  });

  it('asks for a message of at least 10 characters', () => {
    expect(validateField('message', 'hi')).toMatch(/at least 10/);
    expect(validateField('message', 'hello there')).toBe('');
  });

  it('rejects values over the length limit', () => {
    expect(validateField('name', 'a'.repeat(fieldLimits.name + 1))).toMatch(/under 100/);
    expect(validateField('name', 'a'.repeat(fieldLimits.name))).toBe('');
  });
});

describe('validateContact', () => {
  it('returns no errors for a good message', () => {
    expect(validateContact(good)).toEqual({});
  });

  it('returns one error per bad field', () => {
    const errors = validateContact({ ...good, email: 'x', message: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message']);
  });
});

describe('isValidEmail', () => {
  it('accepts normal addresses', () => {
    expect(isValidEmail('first.last+tag@sub.example.my')).toBe(true);
  });
});

describe('encodeForm', () => {
  it('url encodes the fields the way netlify forms expects', () => {
    expect(encodeForm({ 'form-name': 'contact', message: 'a & b = c' })).toBe('form-name=contact&message=a+%26+b+%3D+c');
  });
});
