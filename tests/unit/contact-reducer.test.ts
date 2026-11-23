import { describe, expect, it } from 'vitest';
import { contactReducer, initialContactState } from '@/hooks/useContactForm';

describe('contact form reducer', () => {
  it('stores what is typed without showing errors early', () => {
    const state = contactReducer(initialContactState, { type: 'change', field: 'email', value: 'not-an-email' });
    expect(state.values.email).toBe('not-an-email');
    expect(state.errors).toEqual({});
  });

  it('checks a field again while it shows an error, and clears the error once fixed', () => {
    let state = contactReducer(initialContactState, { type: 'invalid', errors: { email: 'Please fill in your email.' } });
    state = contactReducer(state, { type: 'change', field: 'email', value: 'still wrong' });
    expect(state.errors.email).toMatch(/valid email/);
    state = contactReducer(state, { type: 'change', field: 'email', value: 'me@example.com' });
    expect(state.errors.email).toBeUndefined();
  });

  it('clears the fields after a successful send and remembers who sent it', () => {
    let state = contactReducer(initialContactState, { type: 'change', field: 'name', value: '  Aina ' });
    state = contactReducer(state, { type: 'sending' });
    state = contactReducer(state, { type: 'sent' });
    expect(state.status).toBe('sent');
    expect(state.sentBy).toBe('Aina');
    expect(state.values.name).toBe('');
  });

  it('keeps what was typed when sending fails', () => {
    let state = contactReducer(initialContactState, { type: 'change', field: 'message', value: 'hello there friend' });
    state = contactReducer(state, { type: 'sending' });
    state = contactReducer(state, { type: 'failed' });
    expect(state.status).toBe('failed');
    expect(state.values.message).toBe('hello there friend');
  });
});
