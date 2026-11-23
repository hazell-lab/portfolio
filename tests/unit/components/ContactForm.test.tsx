// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/react/contact/ContactForm';

const email = 'me@example.com';

async function fillIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Aina');
  await user.type(screen.getByLabelText('Email'), 'aina@example.com');
  await user.type(screen.getByLabelText('Subject'), 'Internship');
  await user.type(screen.getByLabelText('Message'), 'Hello, I would like to talk about an internship.');
}

describe('ContactForm', () => {
  it('shows every error on submit, links it to its field and focuses the first one', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    render(<ContactForm email={email} />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    const name = screen.getByLabelText('Name');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Please fill in your name.');
    expect(screen.getByLabelText('Message')).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('Please fix the highlighted fields.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clears an error as soon as the field is fixed', async () => {
    const user = userEvent.setup();
    render(<ContactForm email={email} />);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    const name = screen.getByLabelText('Name');
    await user.type(name, 'Aina');
    expect(name).not.toHaveAttribute('aria-invalid');
    expect(name).not.toHaveAccessibleDescription();
  });

  it('only says thank you after netlify answers ok', async () => {
    const user = userEvent.setup();
    let answer: (response: Response) => void = () => undefined;
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise((resolve) => (answer = resolve)));
    render(<ContactForm email={email} />);
    await fillIn(user);

    await user.click(screen.getByRole('button', { name: /send message/i }));
    const button = screen.getByRole('button', { name: /sending/i });
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Sending your message...');

    answer(new Response('', { status: 200 }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Thanks, Aina! Your message was sent.'));
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('shows the email address and keeps the message when sending fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 404 }));
    render(<ContactForm email={email} />);
    await fillIn(user);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(`Please email me at ${email}.`));
    expect(screen.getByRole('status')).not.toHaveTextContent(/thanks/i);
    expect(screen.getByLabelText('Name')).toHaveValue('Aina');
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('sends the honeypot so netlify can drop spam', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 200 }));
    const { container } = render(<ContactForm email={email} />);
    await fillIn(user);
    const trap = container.querySelector<HTMLInputElement>('input[name="bot-field"]');
    expect(trap).not.toBeNull();
    if (trap) trap.value = 'i am a bot';

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = new URLSearchParams(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.get('bot-field')).toBe('i am a bot');
    expect(body.get('form-name')).toBe('contact');
  });
});
