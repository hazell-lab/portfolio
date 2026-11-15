// a modal built on the native <dialog> element.
// the browser keeps focus inside and closes it with esc; this component adds closing on the
// backdrop, locks page scrolling while it is open, and sends focus back to where it came from.
// `open` is the single source of truth: every way of closing ends in onClose, then the effect
// below closes the element, so it also works in engines without showModal.
import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog */
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, labelledBy, className, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open && !element.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      // older engines without showModal still get a visible dialog
      if (typeof element.showModal === 'function') element.showModal();
      else element.setAttribute('open', '');
      document.body.classList.add('lightbox-open');
      return;
    }

    if (!open && returnFocus.current) {
      if (element.open) {
        if (typeof element.close === 'function') element.close();
        else element.removeAttribute('open');
      }
      document.body.classList.remove('lightbox-open');
      returnFocus.current.focus();
      returnFocus.current = null;
    }
  }, [open]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return undefined;
    // esc closes the native dialog by itself, so react hears about it here
    element.addEventListener('close', onClose);
    return () => element.removeEventListener('close', onClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialog}
      className={className}
      aria-labelledby={labelledBy}
      onClick={(event) => {
        // a click on the backdrop lands on the dialog itself, clicks on the content do not
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
