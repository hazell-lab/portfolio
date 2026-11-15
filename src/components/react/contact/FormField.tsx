// one labelled field with its error message. the error is linked to the field,
// so screen readers read it when the field gets focus.
import type { ContactField } from '@/lib/validation';
import type { Ref } from 'react';

interface Props {
  name: ContactField;
  label: string;
  value: string;
  error: string | undefined;
  maxLength: number;
  placeholder: string;
  type?: 'text' | 'email';
  multiline?: boolean;
  autoComplete?: string;
  inputRef: Ref<HTMLInputElement & HTMLTextAreaElement>;
  onChange: (field: ContactField, value: string) => void;
}

export function FormField({
  name,
  label,
  value,
  error,
  maxLength,
  placeholder,
  type = 'text',
  multiline = false,
  autoComplete,
  inputRef,
  onChange,
}: Props) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    value,
    placeholder,
    maxLength,
    required: true,
    ref: inputRef,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (event: { target: { value: string } }) => onChange(name, event.target.value),
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {multiline ? <textarea rows={5} {...shared} /> : <input type={type} autoComplete={autoComplete} {...shared} />}
      <p className="field-error" id={errorId}>
        {error ?? ''}
      </p>
    </div>
  );
}
