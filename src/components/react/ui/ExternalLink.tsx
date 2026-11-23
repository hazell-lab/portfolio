// a link to another site: new tab, no access back to this page, and a note for screen readers
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & { href: string; children: ReactNode };

export function ExternalLink({ children, ...rest }: Props) {
  return (
    <a {...rest} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
