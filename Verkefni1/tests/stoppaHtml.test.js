import { describe, it, expect } from 'vitest';
import { stoppaHTML } from '../src/lib/stoppaHtml.js';

describe('stoppaHTML', () => {
  it('escapes special HTML characters', () => {
    const input = '<div>"hello"&<world></div>';
    const output = stoppaHTML(input);

    expect(output).toBe('&lt;div&gt;&quot;hello&quot;&amp;&lt;world&gt;&lt;/div&gt;');
  });

  it('returns empty string if input is empty', () => {
    expect(stoppaHTML('')).toBe('');
  });

  it('handles strings with no special characters', () => {
    const input = 'plain text';
    expect(stoppaHTML(input)).toBe('plain text');
  });
});
