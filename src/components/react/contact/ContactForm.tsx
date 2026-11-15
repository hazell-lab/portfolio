// the contact form, sent to netlify forms in the background.
// success is only shown after netlify answers ok. locally there is no netlify, so the
// request fails and the form says so, with the email address as the way to reach me.
// without javascript the same form still posts to netlify the normal way.
import { useRef } from 'react';
import { fieldLimits, type ContactField } from '@/lib/validation';
import { contactFormName } from '@/services/contact';
import { useContactForm } from '@/hooks/useContactForm';
import { FormField } from './FormField';
import { Icon } from '../ui/Icon';

type FieldElement = HTMLInputElement & HTMLTextAreaElement;

export function ContactForm({ email }: { email: string }) {
  const { state, change, submit } = useContactForm();
  const honeypot = useRef<HTMLInputElement>(null);
  const fields = useRef<Partial<Record<ContactField, FieldElement | null>>>({});
  const bind = (field: ContactField) => (element: FieldElement | null) => {
    fields.current[field] = element;
  };

  const sending = state.status === 'sending';
  const message = {
    idle: '',
    invalid: 'Please fix the highlighted fields.',
    sending: 'Sending your message...',
    sent: `Thanks${state.sentBy ? `, ${state.sentBy}` : ''}! Your message was sent. I will reply soon.`,
    failed: `Sorry, the message could not be sent. Please email me at ${email}.`,
  }[state.status];
  const tone = state.status === 'sent' ? ' success' : state.status === 'invalid' || state.status === 'failed' ? ' error' : '';

  return (
    <form
      className="contact-form"
      id="contact-form"
      name={contactFormName}
      method="POST"
      action="/"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        const invalid = await submit(honeypot.current?.value ?? '');
        if (invalid) fields.current[invalid]?.focus();
      }}
    >
      {/* netlify needs this hidden field to know which form it is */}
      <input type="hidden" name="form-name" value={contactFormName} />

      {/* spam trap, real people never see or fill this */}
      <p className="visually-hidden" aria-hidden="true">
        <label>
          Leave this empty: <input ref={honeypot} name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <p className="form-heading">
        <span className="meta-key">Or write here</span> Send a message
      </p>
      <p className="form-hint">All fields are required.</p>

      <div className="form-row">
        <FormField
          name="name"
          label="Name"
          value={state.values.name}
          error={state.errors.name}
          maxLength={fieldLimits.name}
          placeholder="Your name"
          autoComplete="name"
          inputRef={bind('name')}
          onChange={change}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          value={state.values.email}
          error={state.errors.email}
          maxLength={fieldLimits.email}
          placeholder="you@example.com"
          autoComplete="email"
          inputRef={bind('email')}
          onChange={change}
        />
      </div>
      <FormField
        name="subject"
        label="Subject"
        value={state.values.subject}
        error={state.errors.subject}
        maxLength={fieldLimits.subject}
        placeholder="Internship opportunity"
        inputRef={bind('subject')}
        onChange={change}
      />
      <FormField
        name="message"
        label="Message"
        multiline
        value={state.values.message}
        error={state.errors.message}
        maxLength={fieldLimits.message}
        placeholder="Write your message here..."
        inputRef={bind('message')}
        onChange={change}
      />

      <button type="submit" className="btn btn-primary btn-block" id="form-submit" disabled={sending} aria-busy={sending || undefined}>
        <span className="btn-label">{sending ? 'Sending...' : 'Send message'}</span>
        <Icon name="arrow" />
      </button>

      <p className={`form-status${tone}`} id="form-status" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
