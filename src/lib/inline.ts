// turns the small rich text syntax used in the data files into safe html.
// supported: **bold** and `code`. everything else is escaped first,
// so text from the data files can never inject markup.

const escapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => escapes[char] ?? char);
}

export function renderInline(text: string): string {
  // split out the code parts first, so stars inside code are left alone
  return text
    .split(/(`[^`]+`)/)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 1
        ? `<code>${escapeHtml(part.slice(1, -1))}</code>`
        : escapeHtml(part).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'),
    )
    .join('');
}

/** plain text version, for meta tags and alt text */
export function stripInline(text: string): string {
  return text.replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
}
