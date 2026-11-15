import { describe, expect, it } from 'vitest';
import { escapeHtml, renderInline, stripInline } from '@/lib/inline';

describe('escapeHtml', () => {
  it('escapes every character that could start markup', () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;',
    );
  });
});

describe('renderInline', () => {
  it('turns **bold** and `code` into tags', () => {
    expect(renderInline('a **bold** word and `code`')).toBe('a <strong>bold</strong> word and <code>code</code>');
  });

  it('never lets html from the data through', () => {
    const html = renderInline('<script>alert(1)</script> **<img src=x onerror=alert(1)>**');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;script&gt;');
  });

  it('keeps code content literal, even with stars inside', () => {
    expect(renderInline('`a **b** c`')).toBe('<code>a **b** c</code>');
  });

  it('escapes html written inside code', () => {
    expect(renderInline('`useFetch<T>`')).toBe('<code>useFetch&lt;T&gt;</code>');
  });
});

describe('stripInline', () => {
  it('removes the markers for plain text uses like meta descriptions', () => {
    expect(stripInline('a **bold** and `code` part')).toBe('a bold and code part');
  });
});
