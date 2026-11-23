// sends the contact form to netlify forms.
// netlify only accepts the post on the deployed site, so locally this returns an error,
// and the form shows it. it never reports success unless netlify answered with a 2xx status.
import { encodeForm, type ContactValues } from '@/lib/validation';
import { fetchWithTimeout, TimeoutError } from './http';

export const contactFormName = 'contact';

export type SendResult = { ok: true } | { ok: false; reason: 'timeout' | 'network' | 'server'; status?: number };

export async function sendContactMessage(
  values: ContactValues,
  options: { honeypot?: string; signal?: AbortSignal; endpoint?: string } = {},
): Promise<SendResult> {
  const body = encodeForm({
    'form-name': contactFormName,
    'bot-field': options.honeypot ?? '',
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
  });

  try {
    const response = await fetchWithTimeout(options.endpoint ?? '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      timeoutMs: 15_000,
      ...(options.signal && { signal: options.signal }),
    });
    return response.ok ? { ok: true } : { ok: false, reason: 'server', status: response.status };
  } catch (error) {
    return { ok: false, reason: error instanceof TimeoutError ? 'timeout' : 'network' };
  }
}
