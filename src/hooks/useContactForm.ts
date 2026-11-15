// all the state of the contact form in one reducer: the values, the errors and where the send is at.
// the component only renders what this returns.
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { contactFields, validateContact, validateField, type ContactField, type ContactValues } from '@/lib/validation';
import { sendContactMessage, type SendResult } from '@/services/contact';

export type SubmitStatus = 'idle' | 'invalid' | 'sending' | 'sent' | 'failed';

export interface ContactState {
  values: ContactValues;
  errors: Partial<Record<ContactField, string>>;
  status: SubmitStatus;
  /** the name of whoever sent the last message, used in the thank you line */
  sentBy: string;
}

type Action =
  | { type: 'change'; field: ContactField; value: string }
  | { type: 'invalid'; errors: Partial<Record<ContactField, string>> }
  | { type: 'sending' }
  | { type: 'sent' }
  | { type: 'failed' };

export const emptyValues: ContactValues = { name: '', email: '', subject: '', message: '' };

export const initialContactState: ContactState = { values: emptyValues, errors: {}, status: 'idle', sentBy: '' };

export function contactReducer(state: ContactState, action: Action): ContactState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value };
      // a field that shows an error is checked again on every change, so the error clears once fixed
      if (!state.errors[action.field]) return { ...state, values };
      const message = validateField(action.field, action.value);
      const others = Object.entries(state.errors).filter(([field]) => field !== action.field);
      const errors: ContactState['errors'] = Object.fromEntries(message ? [...others, [action.field, message]] : others);
      return { ...state, values, errors };
    }
    case 'invalid':
      return { ...state, errors: action.errors, status: 'invalid' };
    case 'sending':
      return { ...state, errors: {}, status: 'sending' };
    case 'sent':
      return { values: emptyValues, errors: {}, status: 'sent', sentBy: state.values.name.trim() };
    case 'failed':
      return { ...state, status: 'failed' };
  }
}

type Sender = (values: ContactValues, options: { honeypot: string; signal: AbortSignal }) => Promise<SendResult>;

export function useContactForm(send: Sender = sendContactMessage) {
  const [state, dispatch] = useReducer(contactReducer, initialContactState);
  const controller = useRef<AbortController | null>(null);

  // stop a request that is still running if the form goes away
  useEffect(() => () => controller.current?.abort(), []);

  const change = useCallback((field: ContactField, value: string) => dispatch({ type: 'change', field, value }), []);

  /** checks every field, then sends. returns the first field with an error, so the form can focus it */
  const submit = useCallback(
    async (honeypot: string): Promise<ContactField | null> => {
      if (state.status === 'sending') return null;

      const errors = validateContact(state.values);
      const firstInvalid = contactFields.find((field) => errors[field]) ?? null;
      if (firstInvalid) {
        dispatch({ type: 'invalid', errors });
        return firstInvalid;
      }

      dispatch({ type: 'sending' });
      controller.current = new AbortController();
      const result = await send(state.values, { honeypot, signal: controller.current.signal });
      if (controller.current.signal.aborted) return null;
      dispatch({ type: result.ok ? 'sent' : 'failed' });
      return null;
    },
    [send, state.status, state.values],
  );

  return { state, change, submit };
}
